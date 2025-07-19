class Collection < ApplicationRecord
  belongs_to :user
  has_many :collection_items, dependent: :destroy
  attribute :is_public, :boolean, default: false
  def publish!
    update!(is_public: true)
  end

  def unpublish!
    update!(is_public: false)
  end

  def published?
    is_public?
  end
end
