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

      # GET /api/v1/providers/search
      def search
        @providers = Provider.all

        @providers = @providers.where("name ILIKE ?", "%#{params[:name]}%") if params[:name].present?
        @providers = @providers.where(category: params[:category]) if params[:category].present?

        render json: {
          success: true,
          data: {
            providers: @providers
          }
        }
      end
    end
  end
end
