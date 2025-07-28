# Created 07/19/2025 By Linus Xiong
# Updated 07/27/2025 By Linus Xiong - fix bug in authorize_collection
class Api::V1::User::CollectionsController < ApplicationController
  before_action :find_collection, only: [ :publish, :update, :destroy, :show ]
  before_action :authorize_collection, only: [ :publish, :update, :destroy, :show ]

  # Created at 07/19/2025 By Linus Xiong
  # Publishes a collection by setting its is_public attribute to true
  #
  # @param id [Integer] The ID of the collection to publish
  # @return [Collection] JSON representation of the published collection with :ok status
  # @return [Hash] Validation errors with :unprocessable_entity status if publishing fails
  def publish
    @collection.publish!
    render json: @collection, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render status: :unprocessable_entity, json: { errors: e.record.errors }
  end

  # Created at 07/19/2025 By Linus Xiong
  # Retrieves all collections belonging to the current user
  #
  # @return [Array<Collection>] JSON array of user's collections with :ok status
  def index
    collection = Current&.user.collections
    render json: collection
  rescue StandardError => e
    render json: { error: "User not found" }, status: :not_found
  end

  # Created at 07/19/2025 By Linus Xiong
  # Creates a new collection with the provided parameters
  #
  # @param collection_params [Hash] Collection attributes (title, description, is_public)
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

  # Created at 07/19/2025 By Linus Xiong
  # Updates an existing collection with the provided parameters
  #
  # @param id [Integer] The ID of the collection to update
  # @param collection_params [Hash] Collection attributes to update (title, description, is_public)
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

  # Created at 07/19/2025 By Linus Xiong
  # Deletes a collection by ID
  #
  # @param id [Integer] The ID of the collection to delete
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  # @return [void] No content returned if deletion is successful
  def destroy
    @collection.destroy
  end

  def show
    render json: @collection
  end

  private

  # Created at 07/19/2025 By Linus Xiong
  # Filters and validates the required parameters for collection operations
  #
  # @return [ActionController::Parameters] Permitted parameters containing title, description, and is_public
  def collection_params
    params.permit(:title, :description, :is_public)
  end

  # Created at 07/19/2025 By Linus Xiong
  # Finds and sets the collection for the current request
  # Called before publish, update, and destroy actions
  #
  # @param id [Integer] The ID of the collection to find
  # @return [Collection] Sets @collection instance variable
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  def find_collection
    @collection = Collection.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Collection not found" }, status: :not_found
  end

  # Created at 07/19/2025 By Linus Xiong
  # Updated at 07/27/2025 By Linus Xiong - fix bug in authorize_collection
  # Authorizes that the current user owns the collection
  # Called before publish, update, and destroy actions to ensure proper authorization
  #
  # @return [void] Continues execution if user owns the collection
  # @return [Hash] Error message with :unauthorized status if user doesn't own the collection
  def authorize_collection
    return if @collection&.user_id == Current.user.id
    return if @collection&.is_public == true
    render json: { error: "User No permission" }, status: :unauthorized
  end
end
