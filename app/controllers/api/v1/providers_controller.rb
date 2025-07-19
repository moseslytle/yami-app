# Created 07/17/2025 by Paulina Salazar.

module Api
  module V1
    class ProvidersController < ApplicationController

      # Created 07/18/2025 by Paulina Salazar.
      #
      # GET /api/v1/providers - Retrieve all service providers.
      def index
        page = (params[:page] || 1).to_i
        limit = [(params[:limit] || 20).to_i, 100].min
        sort = params[:sort] || 'name_asc'

        providers = Provider.all

        # Sorting orders.
        providers = case sort
                    when 'name_asc' then providers.order(name: :asc)
                    when 'name_desc' then providers.order(name: :desc)
                    when 'rating_asc' then providers.order(rating: :asc)
                    when 'rating_desc' then providers.order(rating: :desc)
                    when 'created_asc' then providers.order(created_at: :asc)
                    when 'created_desc' then providers.order(created_at: :desc)
                    else providers.order(name: :asc)
                    end

        total_items = providers.count
        total_pages = (total_items / limit.to_f).ceil
        providers = providers.offset((page - 1) * limit).limit(limit)

        render json: {
          success: true,
          data: {
            providers: providers.as_json(only: [:id, :name, :category, :rating, :review_count, :price_range, :address, :phone, :hours, :image_url]),
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
        radius = [(params[:radius] || 10).to_i, 50].min
        min_rating = (params[:min_rating] || 1).to_f
        price_range = params[:price_range]
        page = (params[:page] || 1).to_i
        limit = [(params[:limit] || 20).to_i, 100].min
        sort = params[:sort] || 'name'

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
          providers = Provider.near([latitude, longitude], radius)
        end


        # Search sorting orders.
        providers = case sort
                    when 'distance'
                      providers.order('distance ASC')
                    when 'rating'
                      providers.order(rating: :desc)
                    when 'name'
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
              only: [:id, :name, :category, :rating, :address, :price_range, :image_url],
              methods: [:distance]
            ),
            search_metadata: {
              query: q,
              filters_applied: {
                category: category,
                latitude: latitude,
                longitude: longitude,
                radius: radius,
                min_rating: min_rating,
                price_range: price_range,
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
          is_favorited: false,
          created_at: provider.created_at,
          updated_at: provider.updated_at
        }

        render json: { success: true, data: { provider: data } }
      end
    end
  end
end

