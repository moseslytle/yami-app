# Created 07/22/2025 By Linus Xiong
class Api::V1::User::ItemsController < ApplicationController
  before_action :check_exist
  before_action :find_collection_item, except: [ :create, :index ]

# Retrieves all items in a specific collection with provider details
#
# @return [Array<CollectionItem>] JSON array of all collection items with provider info and :ok status
def index
  items = @collection.collection_items.includes(:provider)
  render json: items.as_json(include: { provider: { only: [ :name, :category, :rating, :image_url, :price_range, :favorites_count ] } })
end

  # Creates a new item in a collection with the provided parameters
  #
  # @param collection_id [Integer] The ID of the collection to add the item to
  # @param collection_items_params [Hash] Item attributes (provider_id, user_note)
  # @return [CollectionItem] JSON representation of the created item with :created status
  # @return [Hash] Error message with :bad_request status if creation fails
  # @return [Hash] Error message with :bad_request status if foreign key constraint is violated
  # @return [Hash] Error message with :conflict status if duplicate record exists
  def create
    item = @collection.collection_items.create(collection_items_params)
    if item.persisted?
      render json: item, status: :created
    else
      render json: { error: "Failed to add item to collection" }, status: :bad_request
    end
  rescue ActiveRecord::InvalidForeignKey
      render json: { error: "Invalid foreign key constraint" }, status: :bad_request
  rescue ActiveRecord::RecordNotUnique
    render json: { error: "Duplicate record" }, status: :conflict
  end

  # Deletes a specific item from a collection
  #
  # @param collection_id [Integer] The ID of the collection containing the item
  # @param id [Integer] The ID of the item to delete
  # @return [void] No content returned if deletion is successful
  def destroy
    @item.destroy
  end

  # Updates an existing collection item with the provided parameters
  #
  # @param collection_id [Integer] The ID of the collection containing the item
  # @param id [Integer] The ID of the item to update
  # @param collection_items_params [Hash] Item attributes to update (provider_id, user_note)
  # @return [CollectionItem] JSON representation of the updated item with :ok status
  # @return [Hash] Validation errors with :unprocessable_entity status if update fails
  def update
    if @item.update(collection_items_params)
      render json: @item, status: :ok
    else
      render status: :unprocessable_entity, json: @item.errors
    end
  end

  private

  # Filters and validates the required parameters for collection item operations
  #
  # @return [ActionController::Parameters] Permitted parameters containing provider_id and user_note
  def collection_items_params
    params.permit(:provider_id, :user_note)
  end

  # Finds and sets the collection for the current request
  # Supports both owned collections and public collections
  # Called before all actions to ensure the collection exists and is accessible
  #
  # @param collection_id [Integer] The ID of the collection to find
  # @return [Collection] Sets @collection instance variable
  # @return [Hash] Error message with :not_found status if collection doesn't exist or is inaccessible
  def check_exist
    @collection = Collection.where(id: params[:collection_id])
                           .where("user_id = ? OR is_public = ?", Current.user.id, true)
                           .first

    unless @collection
      render json: { error: "Collection not found or access denied" }, status: :not_found
    end
  end

  # Finds and sets the collection item within the collection
  # Called before update and destroy actions to ensure the item exists
  #
  # @param id [Integer] The ID of the collection item to find
  # @return [CollectionItem] Sets @item instance variable
  # @return [Hash] Error message with :not_found status if item doesn't exist
  def find_collection_item
    @item = @collection.collection_items.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Item not found" }, status: :not_found
  end
end
