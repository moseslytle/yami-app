# Created at 07/19/2025 by Paulina - Initialize the providers controller
# Edited at 07/18/2025 By Joshua - Providers controller with Google Places integration and favorites count
# Edited at 07/19/2025 by Joshua - Add new endpoint to return top 20 favorited providers
module Api
  module V1
    class ProvidersController < ApplicationController
      # GET /api/v1/providers
      def index
        @providers = Provider.all
        render json: {
          success: true,
          data: {
            providers: @providers
          }
        }
      end

      # GET /api/v1/providers/:id
      def show
        @provider = Provider.find(params[:id])
        render json: {
          success: true,
          data: {
            provider: @provider
          }
        }
      end

      # GET /api/v1/providers/most_favorited
      def most_favorited
        @providers = Provider.order(favorites_count: :desc).limit(20)
        render json: {
          success: true,
          data: {
            providers: @providers
          }
        }
      end

      # GET /api/v1/providers/search
      # Search providers from Google Places API
      def search
        # First, search in our database
        @providers = Provider.all
        @providers = @providers.where("name ILIKE ?", "%#{params[:name]}%") if params[:name].present?
        @providers = @providers.where(category: params[:category]) if params[:category].present?

        # Then, fetch from external APIs if requested
        if params[:fetch_external] == "true"
          external_results = fetch_external_providers(
            query: params[:query] || params[:name],
            location: params[:location],
            latitude: params[:latitude],
            longitude: params[:longitude]
          )
          # Save new providers to database
          save_external_providers(external_results)

          # Merge with existing results
          @providers = Provider.where(
            "name ILIKE ? OR category = ?",
            "%#{params[:query]}%",
            params[:category]
          ).limit(50)
        end

        render json: {
          success: true,
          data: {
            providers: @providers
          }
        }
      end

      # Fetch providers from external APIs
      def fetch_external_providers(query:, location: nil, latitude: nil, longitude: nil)
        results = []

        # Fetch from Google Places
        if ENV["GOOGLE_PLACES_API_KEY"].present?
          google_service = GooglePlacesService.new
          location_param = latitude && longitude ? "#{latitude},#{longitude}" : nil
          google_results = google_service.search_places(
            query: query,
            location: location_param
          )
          results.concat(google_results)
        end

        # Todo: Fetch from Yelp ()
        #
        results
      end

      # Save external providers to database
      def save_external_providers(providers)
        providers.each do |provider_data|
          # Don't create if already exists
          next if provider_data[:google_place_id] && Provider.exists?(google_place_id: provider_data[:google_place_id])

          Provider.create(
            name: provider_data[:name],
            category: provider_data[:category] || "Other",
            rating: provider_data[:rating],
            address: provider_data[:address],
            phone: provider_data[:phone],
            hours: provider_data[:hours],
            latitude: provider_data[:latitude],
            longitude: provider_data[:longitude],
            image_url: provider_data[:image_url],
            price_range: provider_data[:price_range],
            google_place_id: provider_data[:google_place_id]
          )
        rescue ActiveRecord::RecordInvalid => e
          Rails.logger.error "Failed to save provider: #{e.message}"
        end
      end
    end
  end
end
