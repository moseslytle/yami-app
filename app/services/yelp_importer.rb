# Created 07/18/2025 by Paulina Salazar.

require 'httparty'
require 'yaml'

# Class used to import business data from Yelp API into the Provider model.
class YelpImporter
  include HTTParty
  base_uri 'https://api.yelp.com/v3'

  # Yelp categories loaded from yml file.
  CATEGORIES = YAML.load_file(Rails.root.join('config', 'yelp_categories.yml'))["categories"]

  # Created 07/18/2025 by Paulina Salazar.
  # Initializes the import with the specified location: Columbus, OH.
  #
  # @param location [String]    the location to search businesses for (default: 'Columbus, OH')
  def initialize(location = 'Columbus, OH')
    @headers = {
      "Authorization" => "Bearer #{ENV['YELP_API_KEY']}"
    }
    @location = location
  end

  # Created 07/18/2025 by Paulina Salazar.
  # Imports businesses for all categories defined in CATEGORIES through yml file.
  #
  # Iterates through categories, imports one business per category.
  def import_all
    CATEGORIES.each do |category|
        begin
            puts "Importing #{category}..."
            import_category(category)
        rescue StandardError => e
            puts "Error importing category '#{category}': #{e.message}"
        end
    end
  end
  
  # Created 07/18/2025 by Paulina Salazar.
  # Imports a single business for the specified category.
  #
  # Fetches business data and finds or creates the Provider record and updates its attributes.
  #
  # @param category [String]    the Yelp business category to import
  def import_category(category)
    limit = 50
    offset = 0
    max_total = 240

    loop do
        break if (limit + offset) > max_total
        response = self.class.get("/businesses/search", headers: @headers, query: {
            location: @location,
            categories: category,
            limit: limit,
            offset: offset
        })
        
        unless response.success?
            puts "Failed to fetch data from Yelp for category '#{category}': HTTP #{response.code}"
            puts "Response body: #{response.body}"
            break
        end
        
        businesses = response.parsed_response["businesses"]
        if businesses.empty?
            puts "No businesses found for category '#{category}'."
            break
        end
        
        businesses.each do |provider|
             # Hours are in business details and must be fetched separately.
             details = fetch_business_details(provider["id"])
             hours_data = if details && details["hours"]
                details["hours"].is_a?(String) ? (JSON.parse(details["hours"]) rescue nil) : details["hours"]
            else
                nil
            end
            formatted_hours = format_hours(hours_data) if hours_data
            
            provider_record = Provider.find_or_initialize_by(yelp_id: provider["id"])
            provider_record.assign_attributes(
                name: provider["name"],
                phone: provider["display_phone"],
                rating: provider["rating"],
                review_count: provider["review_count"],
                address: provider["location"]["display_address"].join(", "),
                category: category,
                latitude: provider["coordinates"]["latitude"],
                longitude: provider["coordinates"]["longitude"],
                image_url: provider["image_url"],
                hours: formatted_hours,
                price_range: provider["price"],
                google_place_id: nil
            )
            provider_record.save!

        end

        offset+= limit
        sleep 0.3
     end
    end

    private

    # Created 07/18/2025 by Paulina Salazar.
    # Fetches  business details from Yelp API by business ID.
    #
    # @param yelp_id [String]     the Yelp business ID
    # @return [Hash, nil]     parsed JSON response with business details, or nil on failure
    def fetch_business_details(yelp_id)
        response = self.class.get("/businesses/#{yelp_id}", headers: @headers)
        if response.success?
            return response.parsed_response 
        else
            return nil
        end
    rescue StandardError => e
        puts "Failed to fetch details for business ID '#{yelp_id}': #{e.message}"
        return nil
    end

    # Created 07/18/2025 by Paulina Salazar.
    # Converts Yelp hours data to a readable string.
    #
    # @param hours_array [Array<Hash>]    the hours section from Yelp details
    # @return [String, nil]      readable hours or nil
    def format_hours(hours_array)
        return nil unless hours_array && hours_array.first && hours_array.first["open"]
        days = %w[Monday Tuesday Wednesday Thursday Friday Saturday Sunday]
        formatted = ""
        hours_array.first["open"].each do |entry|
            day = days[entry["day"]] || "Unknown"
            start_time = entry["start"] ? entry["start"].dup.insert(2, ":") : nil
            end_time = entry["end"] ? entry["end"].dup.insert(2, ":") : nil
            formatted += "#{day}: #{start_time}–#{end_time}\n"
        end
        formatted.strip
    end
end
