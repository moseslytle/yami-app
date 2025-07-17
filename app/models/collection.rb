class Collection < ApplicationRecord
  has_many :collection_items, dependent: :destroy
end
