# Created 07/20/2025 by Joshua - Following YelpImporter pattern to filled in google api databased

require "httparty"
require "yaml"

# Class used to import business data from Google Places API into the Provider model
class GoogleImporter
  include HTTParty
  base_uri "https://maps.googleapis.com/maps/api/place"

  # Yelp categories loaded from yml file
  CATEGORIES = YAML.load_file(Rails.root.join("config", "yelp_categories.yml"))["categories"]

  # Created 07/20/2025 by Joshua
  #
  # Initializes the import with Columbus
  # @param location [String] the location to search businesses
  def initialize(location = "Columbus, OH")
    @api_key = ENV["GOOGLE_PLACES_API_KEY"]
    @location = location
    # Columbus, OH coordinates
    @latitude = 39.9612
    @longitude = -82.9988
  end

  # Created 07/20/2025 by Joshua
  # Following pattern from YelpImporter
  #
  # Iterates through categories, imports businesses per category
  # @param resume_from [String] category importer resumes importing
  def import_all(resume_from: nil)
    resume = resume_from.nil?

    CATEGORIES.each do |category|
      unless resume
        resume = (category == resume_from)
        next
      end

      begin
        puts "Importing #{category} from Google Places..."
        import_category(category)
      rescue StandardError => e
        puts "Error importing category '#{category}': #{e.message}"
      end
    end
  end

  # Created 07/20/2025 by Joshua
  #
  # Fetches business data and finds or creates theprovider record
  # @param category [String] the category to import
  def import_category(category)
    # Just use the category directly, same as Yelp
    query = "#{category} Columbus Ohio"

    options = {
      query: {
        key: @api_key,
        query: query,
        type: "establishment",
        location: "#{@latitude},#{@longitude}",
        radius: 25000 # 25km radius around Columbus
      }
    }

    response = self.class.get("/textsearch/json", options)

    unless response.success?
      puts "Failed to fetch data from Google Places for category '#{category}': HTTP #{response.code}"
      puts "Response body: #{response.body}"
      return
    end

    results = response.parsed_response["results"]
    if results.nil? || results.empty?
      puts "No businesses found for category '#{category}'."
      return
    end

    results.each do |place|
      next if Provider.exists?(google_place_id: place["place_id"])

      # Get detailed information
      details = fetch_place_details(place["place_id"])

      provider_record = Provider.find_or_initialize_by(google_place_id: place["place_id"])
      provider_record.assign_attributes(
        name: place["name"],
        phone: details&.dig("formatted_phone_number"),
        rating: place["rating"],
        review_count: details&.dig("user_ratings_total") || place["user_ratings_total"],
        address: place["formatted_address"],
        category: category, # Use the same category in yml file
        latitude: place.dig("geometry", "location", "lat"),
        longitude: place.dig("geometry", "location", "lng"),
        image_url: build_photo_url(place.dig("photos", 0)),
        hours: format_hours(details&.dig("opening_hours")),
        price_range: price_range_from_level(place["price_level"]),
        yelp_id: nil
      )
      provider_record.save!

      sleep 0.3
    rescue ActiveRecord::RecordInvalid => e
      puts "Failed to save provider: #{e.message}"
    end
  end

  private

  # Created 07/20/2025 by Joshua
  #
  # Fetches detailed business information from Google Places API
  # @param place_id [String] the Google Place ID
  # @return [Hash, nil] parsed JSON response with place details, or nil on failure
  def fetch_place_details(place_id)
    options = {
      query: {
        key: @api_key,
        place_id: place_id,
        fields: "formatted_phone_number,opening_hours,user_ratings_total"
      }
    }

    response = self.class.get("/details/json", options)

    if response.success? && response["result"]
      response["result"]
    else
      nil
    end
  rescue StandardError => e
    puts "Failed to fetch details for place ID '#{place_id}': #{e.message}"
    nil
  end

  # Created 07/20/2025 by Joshua
  #
  # Formats Google opening hours to a readable string
  # @param hours [Hash] the opening hours from Google
  # @return [String, nil] formatted hours or nil
  def format_hours(hours)
    return nil unless hours && hours["weekday_text"]
    hours["weekday_text"].join("\n")
  end

  # Created 07/20/2025 by Joshua
  #
  # Convert price level to price range string
  # @param level [Integer] Price level from 0-4
  # @return [String] Price range string (e.g., "$", "$$")
  def price_range_from_level(level)
    return nil unless level
    "$" * [ level, 4 ].min
  end

  # Created 07/20/2025 by Joshua
  #
  # Build photo URL from photo reference
  # @param photo [Hash] Photo data from API
  # @return [String, nil] Photo URL or nil
  def build_photo_url(photo)
    return nil unless photo && photo["photo_reference"]

    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo["photo_reference"]}&key=#{@api_key}"
  end
end
