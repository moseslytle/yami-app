# Created at 07/18/2025 By Joshua - Demo for Search with Google Places API， waiting for actual providers table
# Updated at 07/20/2025 By Joshua - Add Columbus-specific import functionality
# Note after standup: save the real time api search and update db function for later daliy auto grep function

require "httparty"
require "yaml"

# Service class for Google Places API integration
class GooglePlacesService
  include HTTParty
  base_uri "https://maps.googleapis.com/maps/api/place"

  # Columbus, OH coordinates
  COLUMBUS_LAT = 39.9612
  COLUMBUS_LNG = -82.9988
  COLUMBUS_RADIUS = 25000 # 25km radius

  # Put your api key in .env file
  def initialize
    @api_key = ENV["GOOGLE_PLACES_API_KEY"]
  end

  # Search for places based on query and location
  #
  # @param query [String] Search query (e.g., "car wash")
  # @param location [String]  Location in "latitude,longitude" format
  # @param radius [Integer] Search radius in meters
  # @return [Array<Hash>] Array of place results
  def search_places(query:, location: nil, radius: 10000)
    options = {
      query: {
        key: @api_key,
        query: query,
        radius: radius
      }
    }

    options[:query][:location] = location if location
    response = self.class.get("/textsearch/json", options)
    if response.success?
      parse_places(response["results"])
    else
      Rails.logger.error "Google Places API error: #{response.code} - #{response.message}"
      []
    end
  end

  # Get detailed information about a specific place
  #
  # @param place_id [String]  Google Place ID
  # @return [Hash, nil] Place details or nil if not found
  def get_place_details(place_id)
    options = {
      query: {
        key: @api_key,
        place_id: place_id,
        fields: "name,formatted_address,formatted_phone_number,opening_hours,rating,price_level,photos,types,geometry"
      }
    }

    response = self.class.get("/details/json", options)
    if response.success? && response["result"]
      parse_place_details(response["result"])
    else
      Rails.logger.error "Google Places API error: #{response.code} - #{response.message}"
      nil
    end
  end

  # Parse places from API response
  # We need two different parse functions because google place API return different endpionts for "Search" and "Details"
  #
  # @param places [Array<Hash>] Raw places data from API
  # @return [Array<Hash>] Parsed place data
  def parse_places(places)
    places.map do |place|
      {
        google_place_id: place["place_id"],
        name: place["name"],
        address: place["formatted_address"],
        rating: place["rating"],
        price_level: price_range_from_level(place["price_level"]),
        latitude: place.dig("geometry", "location", "lat"),
        longitude: place.dig("geometry", "location", "lng"),
        types: place["types"],
        photo_reference: place.dig("photos", 0, "photo_reference")
      }
    end
  end

  # Parse detailed place information
  #
  # @param place [Hash] Raw place details from API
  # @return [Hash] Parsed place details
  def parse_place_details(place)
    {
      google_place_id: place["place_id"],
      name: place["name"],
      address: place["formatted_address"],
      phone: place["formatted_phone_number"],
      rating: place["rating"],
      price_range: price_range_from_level(place["price_level"]),
      latitude: place.dig("geometry", "location", "lat"),
      longitude: place.dig("geometry", "location", "lng"),
      hours: format_opening_hours(place["opening_hours"]),
      category: determine_category(place["types"]),
      image_url: build_photo_url(place.dig("photos", 0))
    }
  end

  # Some helper methods here

  # Convert price level to price range string
  #
  # @param level [Integer] Price level from 0-4
  # @return [String] Price range string ("$$")
  def price_range_from_level(level)
    return nil unless level
    "$" * level
  end

  # Format opening hours for storage
  #
  # @param hours [Hash] Opening hours from API
  # @return [String] JSON formatted hours
  def format_opening_hours(hours)
    return nil unless hours && hours["weekday_text"]
    hours["weekday_text"].to_json
  end

  # Determine category from Google types
  #
  # @param types [Array<String>] Google place types
  # @return [String] Simplified category
  def determine_category(types)
    return "Other" unless types.is_a?(Array)

    category_mapping = {
      "plumber" => "Plumber",
      "car_wash" => "Car Wash",
      "cleaning_service" => "Cleaner",
      "electrician" => "Electrician",
      "locksmith" => "Locksmith",
      "painter" => "Painter",
      "roofing_contractor" => "Roofer",
      "moving_company" => "Mover"
    }

    types.each do |type|
      return category_mapping[type] if category_mapping[type]
    end

    "Other"
  end

  # Build photo URL from photo reference
  #
  # @param photo [Hash] Photo data from API
  # @return [String, nil] Photo URL or nil
  def build_photo_url(photo)
    return nil unless photo && photo["photo_reference"]
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo["photo_reference"]}&key=#{@api_key}"
  end
end
