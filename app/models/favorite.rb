# Created 7/18/2025 by Joshua, create favorite model
class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :provider

  validates :user_id, uniqueness: { scope: :provider_id }
end
