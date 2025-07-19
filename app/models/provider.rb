class Provider < ApplicationRecord
  has_many :collection_items, dependent: :destroy
  has_many :collections, through: :collection_items
  has_many :favorites, dependent: :destroy
  has_many :favorited_by, through: :favorites, source: :user
end
