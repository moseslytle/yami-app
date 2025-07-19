class UpdateCollectionItemsReferences < ActiveRecord::Migration[8.0]
  def up
    if column_exists?(:collection_items, :collection_id)
      CollectionItem.joins("LEFT JOIN collections ON collections.id = collection_items.collection_id")
                   .where("collections.id IS NULL")
                   .delete_all if CollectionItem.exists?
      CollectionItem.where(collection_id: nil).delete_all if CollectionItem.exists?
      change_column_null :collection_items, :collection_id, false
      unless foreign_key_exists?(:collection_items, :collections)
        add_foreign_key :collection_items, :collections
      end
    else
      add_reference :collection_items, :collection, null: false, foreign_key: true
    end

    if column_exists?(:collection_items, :provider_id)
      CollectionItem.joins("LEFT JOIN providers ON providers.id = collection_items.provider_id")
                   .where("providers.id IS NULL")
                   .delete_all if CollectionItem.exists? && table_exists?(:providers)
      CollectionItem.where(provider_id: nil).delete_all if CollectionItem.exists?
      change_column_null :collection_items, :provider_id, false
      if table_exists?(:providers) && !foreign_key_exists?(:collection_items, :providers)
        add_foreign_key :collection_items, :providers
      end
    else
      if table_exists?(:providers)
        add_reference :collection_items, :provider, null: false, foreign_key: true
      end
    end
    if column_exists?(:collection_items, :added_at)
      CollectionItem.where(added_at: nil).update_all(added_at: Time.current) if CollectionItem.exists?
    end

    add_index :collection_items, :collection_id unless index_exists?(:collection_items, :collection_id)
    add_index :collection_items, :provider_id unless index_exists?(:collection_items, :provider_id)
    add_index :collection_items, :added_at unless index_exists?(:collection_items, :added_at)
    add_index :collection_items, [ :collection_id, :provider_id ] unless index_exists?(:collection_items, [ :collection_id, :provider_id ])
  end

  def down
    remove_index :collection_items, [ :collection_id, :provider_id ] if index_exists?(:collection_items, [ :collection_id, :provider_id ])
    remove_index :collection_items, :added_at if index_exists?(:collection_items, :added_at)
    remove_index :collection_items, :provider_id if index_exists?(:collection_items, :provider_id)
    remove_index :collection_items, :collection_id if index_exists?(:collection_items, :collection_id)
    if foreign_key_exists?(:collection_items, :providers)
      remove_foreign_key :collection_items, :providers
    end
    if foreign_key_exists?(:collection_items, :collections)
      remove_foreign_key :collection_items, :collections
    end
    change_column_null :collection_items, :provider_id, true if column_exists?(:collection_items, :provider_id)
    change_column_null :collection_items, :collection_id, true if column_exists?(:collection_items, :collection_id)
  end
end
