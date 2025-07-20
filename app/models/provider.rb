# Created 07/17/2025 by Paulina Salazar.
# Edited 07/19/2025 by Paulina Salazar - implemented geocoder.

class Provider < ApplicationRecord
  has_many :collection_items, dependent: :destroy
  has_many :collections, through: :collection_items
  has_many :favorites, dependent: :destroy
  has_many :favorited_by, through: :favorites, source: :user

  # Find distance with geocoder, to be accessed in controller.
  reverse_geocoded_by :latitude, :longitude
  attr_accessor :distance

end
