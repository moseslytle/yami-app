# Created at 07/17/2025 By Linus Xiong - The CRUD code for all collections has been initially completed, but it still needs to add validation for the parameters passed by the middleware.
# Updated at 07/23/2025 By Linus Xiong - add pagination for the collections index
# Updated at 07/27/2025 By Linus Xiong - add items for the collections show

# A class handle all collections operations
class Api::V1::CollectionsController < ApplicationController
  before_action :find_public_collection, only: [ :show, :items ]

# Created at 07/17/2025 By Linus Xiong
# Updated at 07/23/2025 By Linus Xiong - add pagination for the collections index
# Retrieves a paginated list of public collections for infinite loading
#
# @param page [Integer] The page number (default: 1)
# @param limit [Integer] The number of collections per page (default: 10, max: 100)
# @return [Hash] JSON object containing collections array and pagination info with :ok status
def index
  page = [ params[:page].to_i, 1 ].max
  limit = [ [ params[:limit].to_i, 10 ].max, 100 ].min # Default 10, max 100
  offset = (page - 1) * limit

  # Get total count first
  total_count = Collection.where(is_public: true).count

  # Get paginated collections
  collections = Collection.where(is_public: true)
                         .order(created_at: :desc)
                         .limit(limit)
                         .offset(offset)

  has_more = offset + limit < total_count

  render json: {
    collections: collections,
    pagination: {
      page: page,
      limit: limit,
      total: total_count,
      hasMore: has_more
    }
  }, status: :ok
end

  # Created at 07/17/2025 By Linus Xiong
  # Retrieves a specific collection by ID
  #
  # @param id [Integer] The ID of the collection to retrieve
  # @return [Collection] JSON representation of the collection with :ok status
  # @return [Hash] Error message with :not_found status if collection doesn't exist
  def show
    render json: @collection, status: :ok
  end

  # Created at 07/17/2025 By Linus Xiong
  # Retrieves all items in a specific public collection
  #
  # @param id [Integer] The ID of the public collection
  # @return [Array<CollectionItem>] JSON array of all collection items with provider info and :ok status
  # @return [Hash] Error message with :not_found status if collection doesn't exist or is private
  def items
    items = @collection.collection_items.includes(:provider)
    render json: items.as_json(include: {
      provider: {
        only: [ :name, :category, :rating, :image_url, :price_range, :favorites_count ]
      }
    })
  end

  private

  # Created at 07/17/2025 By Linus Xiong
  # Finds and sets the public collection for show and items actions
  #
  # @param id [Integer] The ID of the collection to find
  # @return [Collection] Sets @collection instance variable
  # @return [Hash] Error message with :not_found status if collection doesn't exist or is private
  def find_public_collection
    @collection = Collection.find_by(id: params[:id], is_public: true)
    if @collection.nil?
      render json: { error: "Collection not found or is private" }, status: :not_found
    end
  end
end
