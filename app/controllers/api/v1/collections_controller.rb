class Api::V1::CollectionsController < ApplicationController
  def index
    collections = Collection.all
    render json: collections
  end

  def show
  end

  def create
  end

  def update
  end

  def destroy
  end
end
