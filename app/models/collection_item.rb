class CollectionItem < ApplicationRecord
  belongs_to :collection
  belongs_to :provider

  validates :collection_id, :provider_id, presence: true
end
