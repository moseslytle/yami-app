# Created at 07/17/2025 By Linus Xiong - The CRUD code for all collections has been initially completed, but it still needs to add validation for the parameters passed by the middleware.

# A class handle all collections operations
class Api::V1::CollectionsController < ApplicationController
  # Retrieves a limited list of collections
  #
  # @return [Array<Collection>] JSON array of up to 30 collections with :ok status
  def index
    collections = Collection.all.limit(30)
    render collections, status: :ok
  end

  # Retrieves a specific collection by ID
  #
  # @param id [Integer] The ID of the collection to retrieve
  # @return [Collection] JSON representation of the collection with :ok status
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  def show
    collection = Collection.find_by(params[:id])
    if collection.nil?
      render json: { error: "Collection not found" }, status: :not_found
    else
      render collection, status: :ok
    end
  end

  # Creates a new collection with the provided parameters
  #
  # @param collection_params [Hash] Collection attributes (user_id, title, description, is_public)
  # @return [Collection] JSON representation of the created collection with :created status
  # @return [Hash] Validation errors with :unprocessable_entity status if creation fails
  def create
    collection = Collection.create(collection_params)
    if collection.persisted?
      render status: :created, json: collection
    else
      render status: :unprocessable_entity, json: collection.errors
    end
  end

  # Updates an existing collection with the provided parameters
  #
  # @param id [Integer] The ID of the collection to update
  # @param collection_params [Hash] Collection attributes to update (user_id, title, description, is_public)
  # @return [Collection] JSON representation of the updated collection with :ok status
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  # @return [Hash] Validation errors with :unprocessable_entity status if update fails
  def update
    collection = Collection.find_by(id: params[:id])
    if collection.nil?
      render json: { error: "Collection not found" }, status: :not_found
    elsif collection.update(collection_params)
      render json: collection, status: :ok
    else
      render json: { errors: collection.errors }, status: :unprocessable_entity
    end
  end

  # Deletes a collection by ID
  #
  # @param id [Integer] The ID of the collection to delete
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  # @return [void] No content returned if deletion is successful
  def destroy
    collection = Collection.find_by(id: params[:id])
    if collection.nil?
      render json: { error: "Collection not found" }, status: :not_found
    elsif collection.destroy
    end
  end

  private

  # Filters and validates the required parameters for collection operations
  #
  # @return [ActionController::Parameters] Permitted parameters containing user_id, title, description, and is_public
  # @raise [ActionController::ParameterMissing] If any required parameter is missing
  def collection_params
    params.expect(:user_id, :title, :description, :is_public)
  end
end
