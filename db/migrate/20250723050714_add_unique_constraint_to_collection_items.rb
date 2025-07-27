class AddUniqueConstraintToCollectionItems < ActiveRecord::Migration[8.0]
  def change
    remove_index :collection_items, [ :collection_id, :provider_id ] if index_exists?(:collection_items, [ :collection_id, :provider_id ])
    add_index :collection_items, [ :collection_id, :provider_id ], unique: true, name: 'index_collection_items_on_collection_and_provider_unique'
  end
end
