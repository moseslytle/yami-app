# Created 07/19/2025 by Joshua - Add favorites count feature
class AddFavoritesCountToProviders < ActiveRecord::Migration[8.0]
  def change
    add_column :providers, :favorites_count, :integer, default: 0, null: false
    add_index :providers, :favorites_count
  end
end
