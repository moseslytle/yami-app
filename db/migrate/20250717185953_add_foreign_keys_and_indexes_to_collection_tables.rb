class AddForeignKeysAndIndexesToCollectionTables < ActiveRecord::Migration[8.0]
  def change
    # Adding Foreign Key Constraints
    add_foreign_key :collections, :users
    add_foreign_key :collection_items, :collections
    add_foreign_key :collection_items, :providers

    # Add Index
    add_index :collections, :user_id
    add_index :collection_items, :collection_id
    add_index :collection_items, :provider_id
  end
end
