class AddReviewCountToProviders < ActiveRecord::Migration[8.0]
  def change
    add_column :providers, :review_count, :integer
  end
end
