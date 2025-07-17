class AddNullConstraintsToCollectionTables < ActiveRecord::Migration[8.0]
  def change
    change_column_null :collections, :user_id, false
    change_column_null :collection_items, :collection_id, false
    change_column_null :collection_items, :provider_id, false
  end
end
