# Created 07/17/2025 by Paulina Salazar.
# Created 07/18/2025 by Joshua Zhang
# Merged 07/20/2025 by Joshua Zhang - Implemented different endpoints for both google and yelp search

module Api
  module V1
    class ProvidersController < ApplicationController
      # Created 07/18/2025 by Paulina Salazar.
      #
      # GET /api/v1/providers - Retrieve all service providers.
      def index
        page = (params[:page] || 1).to_i
        limit = [ (params[:limit] || 20).to_i, 100 ].min
        sort = params[:sort] || "name_asc"

        providers = Provider.all

        # Sorting orders.
        providers = case sort
        when "name_asc" then providers.order(name: :asc)
        when "name_desc" then providers.order(name: :desc)
        when "rating_asc" then providers.order(rating: :asc)
        when "rating_desc" then providers.order(rating: :desc)
        when "created_asc" then providers.order(created_at: :asc)
        when "created_desc" then providers.order(created_at: :desc)
        else providers.order(name: :asc)
        end

        total_items = providers.count
        total_pages = (total_items / limit.to_f).ceil
        providers = providers.offset((page - 1) * limit).limit(limit)

        render json: {
          success: true,
          data: {
            providers: providers.as_json(only: [ :id, :name, :category, :rating, :review_count, :price_range, :address, :phone, :hours, :image_url ]),
            pagination: {
              current_page: page,
              total_pages: total_pages,
              total_items: total_items,
              has_next: page < total_pages,
              has_previous: page > 1
            }
          }
        }
      end

      # Created 07/18/2025 by Paulina Salazar.
      #
      # GET /api/v1/providers/search - Search and filter service providers.
      def search
        # Params
        q = params[:q]
        category = params[:category]
        latitude = params[:latitude]&.to_f
        longitude = params[:longitude]&.to_f
        radius = [ (params[:radius] || 10).to_i, 50 ].min
        min_rating = (params[:min_rating] || 1).to_f
        price_range = params[:price_range]
        page = (params[:page] || 1).to_i
        limit = [ (params[:limit] || 20).to_i, 100 ].min
        sort = params[:sort] || "name"

        providers = Provider.all

        # Filtering based on params.
        if q.present?
          providers = providers.where("name ILIKE :q OR category ILIKE :q OR address ILIKE :q", q: "%#{q}%")
        end
        providers = providers.where(category: category) if category.present?
        providers = providers.where("rating >= ?", min_rating) if min_rating > 1
        providers = providers.where(price_range: price_range) if price_range.present?

        # Location based filtering using Geocoder.
        if latitude && longitude
          providers = Provider.near([ latitude, longitude ], radius)
        end


        # Search sorting orders.
        providers = case sort
        when "distance"
                      providers.order("distance ASC")
        when "rating"
                      providers.order(rating: :desc)
        when "name"
                      providers.order(name: :asc)
        else
                      providers
        end

        total_items = providers.count
        total_pages = (total_items / limit.to_f).ceil
        providers = providers.offset((page - 1) * limit).limit(limit)

        render json: {
          success: true,
          data: {
            providers: providers.as_json(
              only: [ :id, :name, :category, :rating, :address, :price_range, :image_url ],
              methods: [ :distance ]
            ),
            search_metadata: {
              query: q,
              filters_applied: {
                category: category,
                latitude: latitude,
                longitude: longitude,
                radius: radius,
                min_rating: min_rating,
                price_range: price_range
              },
              total_results: total_items
            },
            pagination: {
              current_page: page,
              total_pages: total_pages,
              has_next: page < total_pages,
              has_previous: page > 1
            }
          }
        }
      end

      # Created 07/18/2025 by Paulina Salazar.
      #
      # GET /api/v1/providers/:id
      def show
        provider = Provider.find_by(id: params[:id])
        return render json: { success: false, error: "Provider not found" }, status: 404 unless provider

        data = {
          id: provider.id,
          name: provider.name,
          category: provider.category,
          rating: provider.rating,
          review_count: provider.review_count,
          address: provider.address,
          phone: provider.phone,
          price_range: provider.price_range,
          hours: provider.hours,
          image_url: provider.image_url,
          favorites_count: provider.favorites_count,
          is_favorited: false,
          created_at: provider.created_at,
          updated_at: provider.updated_at
        }

        render json: { success: true, data: { provider: data } }
      end

      # Added 07/20/2025 by Joshua - Most favorited providers
      #
      # GET /api/v1/providers/most_favorited
      def most_favorited
        providers = Provider.order(favorites_count: :desc).limit(20)
        render json: {
          success: true,
          data: {
            providers: providers.as_json(only: [ :id, :name, :category, :rating, :review_count, :price_range, :address, :phone, :hours, :image_url, :favorites_count ])
          }
        }
      end

      # Added 07/20/2025 by Joshua - Google Places only search
      #
      # GET /api/v1/providers/search/google
      def search_google
        if ENV["GOOGLE_PLACES_API_KEY"].blank?
          return render json: { success: false, error: "Google Places API not configured" }, status: :service_unavailable
        end

        google_results = fetch_google_places
        save_external_providers(google_results)

        render json: {
          success: true,
          data: {
            providers: google_results,
            source: "google_places"
          }
        }
      end

      # Added 07/20/2025 by Joshua - Yelp only search
      #
      # GET /api/v1/providers/search/yelp
      def search_yelp
        if ENV["YELP_API_KEY"].blank?
          return render json: { success: false, error: "Yelp API not configured" }, status: :service_unavailable
        end

        yelp_results = fetch_yelp_businesses
        save_external_providers(yelp_results)

        render json: {
          success: true,
          data: {
            providers: yelp_results,
            source: "yelp"
          }
        }
      end

      # Added 07/20/2025 by Joshua - Combined search from all sources
      #
      # GET /api/v1/providers/search/all
      def search_all
        # Use Paulina's search logic for database
        q = params[:q] || params[:query]
        category = params[:category]
        latitude = params[:latitude]&.to_f
        longitude = params[:longitude]&.to_f

        providers = search_database_providers(q, category, latitude, longitude)

        # Add external sources if requested
        external_results = []
        if params[:fetch_external] == "true"
          external_results.concat(fetch_google_places) if ENV["GOOGLE_PLACES_API_KEY"].present?
          external_results.concat(fetch_yelp_businesses) if ENV["YELP_API_KEY"].present?
          save_external_providers(external_results)

          # Refresh database search
          providers = search_database_providers(q, category, latitude, longitude)
        end

        render json: {
          success: true,
          data: {
            providers: providers.as_json(only: [ :id, :name, :category, :rating, :review_count, :address, :price_range, :image_url, :favorites_count ]),
            sources_used: [ "database" ] + (params[:fetch_external] == "true" ? [ "google", "yelp" ] : [])
          }
        }
      end

      private

      # Helper method using Paulina's search logic
      def search_database_providers(q, category, latitude, longitude)
        providers = Provider.all

        if q.present?
          providers = providers.where("name ILIKE :q OR category ILIKE :q OR address ILIKE :q", q: "%#{q}%")
        end
        providers = providers.where(category: category) if category.present?

        if latitude && longitude
          providers = Provider.near([ latitude, longitude ], 10)
        end

        providers.limit(50)
      end

      # Fetch from Google Places (Joshua's implementation)
      def fetch_google_places
        google_service = GooglePlacesService.new
        location_param = params[:latitude] && params[:longitude] ? "#{params[:latitude]},#{params[:longitude]}" : params[:location]
        google_service.search_places(
          query: params[:q] || params[:query] || "service provider",
          location: location_param
        )
      end

      # Fetch from Yelp (simplified version)
      def fetch_yelp_businesses
        results = []
        headers = { "Authorization" => "Bearer #{ENV['YELP_API_KEY']}" }

        query_params = {
          term: params[:q] || params[:query] || "service",
          limit: 20,
          location: params[:location] || "Columbus, OH"
        }

        if params[:latitude] && params[:longitude]
          query_params[:latitude] = params[:latitude]
          query_params[:longitude] = params[:longitude]
          query_params.delete(:location)
        end

        response = HTTParty.get("https://api.yelp.com/v3/businesses/search", headers: headers, query: query_params)

        if response.success?
          businesses = response["businesses"] || []
          results = businesses.map do |business|
            {
              yelp_id: business["id"],
              name: business["name"],
              address: business["location"]["display_address"].join(", "),
              phone: business["display_phone"],
              rating: business["rating"],
              review_count: business["review_count"],
              price_range: business["price"],
              latitude: business.dig("coordinates", "latitude"),
              longitude: business.dig("coordinates", "longitude"),
              category: determine_category_from_yelp(business["categories"]),
              image_url: business["image_url"]
            }
          end
        end

        results
      end

      # Save external providers to database
      def save_external_providers(providers)
        providers.each do |provider_data|
          next if provider_data[:google_place_id] && Provider.exists?(google_place_id: provider_data[:google_place_id])
          next if provider_data[:yelp_id] && Provider.exists?(yelp_id: provider_data[:yelp_id])

          Provider.create(
            name: provider_data[:name],
            category: provider_data[:category] || "Other",
            rating: provider_data[:rating],
            review_count: provider_data[:review_count],
            address: provider_data[:address],
            phone: provider_data[:phone],
            hours: provider_data[:hours],
            latitude: provider_data[:latitude],
            longitude: provider_data[:longitude],
            image_url: provider_data[:image_url],
            price_range: provider_data[:price_range],
            google_place_id: provider_data[:google_place_id],
            yelp_id: provider_data[:yelp_id]
          )
        rescue ActiveRecord::RecordInvalid => e
          Rails.logger.error "Failed to save provider: #{e.message}"
        end
      end

      # Determine category from Yelp categories
      def determine_category_from_yelp(categories)
        return "Other" unless categories.is_a?(Array)

        category_mapping = {
          "plumbing" => "Plumber",
          "carwash" => "Car Wash",
          "homecleaning" => "Cleaner",
          "electricians" => "Electrician",
          "locksmiths" => "Locksmith",
          "painters" => "Painter",
          "roofing" => "Roofer",
          "movers" => "Mover"
        }

        categories.each do |cat|
          alias_name = cat["alias"]
          return category_mapping[alias_name] if category_mapping[alias_name]
        end

        "Other"
      end
    end
  end
end
