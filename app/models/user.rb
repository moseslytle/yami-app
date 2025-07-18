# This is a partical model, related to user favorite. Whoever create the user model can add to this.
class User < ApplicationRecord
  has_many :collections, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorited_providers, through: :favorites, source: :provider
end
