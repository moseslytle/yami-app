# Created at 07/18/2025 By Joshua - User favorites controller for CRUD
# TODO: Have to implement the actual authentication

# A class handle user favorite operations
class Api::V1::User::FavoritesController < ApplicationController
  # Creates a new favorite for the current user
  #
  # @param provider_id [Integer]  The ID of the provider to favorite
  # @return [Favorite]  JSON representation of the created favorite with :created status
  # @return [Hash]  Error message with :not_found status if provider not exist
  # @return [Hash]  Validation errors with :unprocessable_entity status if creation fails
  def create
    provider = Provider.find_by(id: params[:provider_id])
    if provider.nil?
      render json: { error: "Provider not found" }, status: :not_found
      return
    end

    favorite = current_user.favorites.build(provider: provider)

    if favorite.save
      render json: favorite, status: :created
    else
      render json: { errors: favorite.errors }, status: :unprocessable_entity
    end
  end

  # Removes a favorite for the current user
  #
  # @param provider_id [Integer]  The ID of the provider to unfavorite
  # @return [Hash]  Error message with :not_found status if favorite not exist
  # @return [void]  No content with :no_content status if deletion is successful
  def destroy
    favorite = current_user.favorites.find_by(provider_id: params[:provider_id])
    if favorite.nil?
      render json: { error: "Favorite not found" }, status: :not_found
    elsif favorite.destroy
      head :no_content
    end
  end

  private

  # Placeholder method for current user authentication
  # TODO: Implement actual authentication
  def current_user
    @current_user ||= User.first
  end
end
