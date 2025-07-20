# Created 07/18/2025 by Joshua - Create favorite model
# Created 07/19/2025 by Joshua - Add favorites count feature
class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :provider, counter_cache: true

  validates :user_id, uniqueness: { scope: :provider_id }
end
