# Created at 07/17/2025 By Linus Xiong - The CRUD code for all collections has been initially completed, but it still needs to add validation for the parameters passed by the middleware.

# A class handle all collections operations
class Api::V1::CollectionsController < ApplicationController
  # Retrieves a limited list of collections
  #
  # @return [Array<Collection>] JSON array of up to 30 collections with :ok status
  def index
    collections = Collection.where(is_public: true).limit(30)
    render json: collections, status: :ok
  end

  # Retrieves a specific collection by ID
  #
  # @param id [Integer] The ID of the collection to retrieve
  # @return [Collection] JSON representation of the collection with :ok status
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  def show
    collection = Collection.find_by(id: params[:id], is_public: true)
    if collection.nil?
      render json: { error: "Collection not found" }, status: :not_found
    else
      render json: collection, status: :ok
    end
  end
end
