class RemoveAddedAtFromCollectionItems < ActiveRecord::Migration[8.0]
  def change
    remove_index :collection_items, :added_at
    remove_column :collection_items, :added_at, :datetime
  end
end
