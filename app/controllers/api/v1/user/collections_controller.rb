# Created 07/19/2025 By Linus Xiong
class Api::V1::User::CollectionsController < ApplicationController
  before_action :find_collection, only: [ :publish, :update, :destroy ]
  before_action :authorize_collection, only: [ :publish, :update, :destroy ]

  def publish
    @collection.publish!
    render json: @collection, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render status: :unprocessable_entity, json: { errors: e.record.errors }
  end

  # Creates a new collection with the provided parameters
  #
  # @param collection_params [Hash] Collection attributes (user_id, title, description, is_public)
  # @return [Collection] JSON representation of the created collection with :created status
  # @return [Hash] Validation errors with :unprocessable_entity status if creation fails
  def create
    collection = Collection.new(collection_params)
    collection.user_id = Current&.user.id
    if collection.save
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
    if @collection.update(collection_params)
      render json: @collection, status: :ok
    else
      render status: :unprocessable_entity, json: @collection.errors
    end
  end

  # Deletes a collection by ID
  #
  # @param id [Integer] The ID of the collection to delete
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  # @return [void] No content returned if deletion is successful
  def destroy
    @collection.destroy
  end

  private

  # Filters and validates the required parameters for collection operations
  #
  # @return [ActionController::Parameters] Permitted parameters containing user_id, title, description, and is_public
  # @raise [ActionController::ParameterMissing] If any required parameter is missing
  def collection_params
    params.permit(:title, :description, :is_public)
  end

  def find_collection
    @collection = Collection.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Collection not found" }, status: :not_found
  end

  def authorize_collection
    return if @collection&.user_id == Current.user.id
    render json: { error: "User No permission" }, status: :unauthorized
  end
end
