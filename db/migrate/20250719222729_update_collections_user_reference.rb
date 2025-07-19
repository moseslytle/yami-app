class UpdateCollectionsUserReference < ActiveRecord::Migration[8.0]
  def up
    if column_exists?(:collections, :user_id)
      Collection.where(user_id: nil).delete_all if Collection.exists?
      change_column_null :collections, :user_id, false
      unless foreign_key_exists?(:collections, :users)
        add_foreign_key :collections, :users
      end
    else
      add_reference :collections, :user, null: false, foreign_key: true
    end
    change_column_null :collections, :title, false
    change_column_default :collections, :is_public, from: nil, to: false
    Collection.where(is_public: nil).update_all(is_public: false) if Collection.exists?
    change_column_null :collections, :is_public, false

    add_index :collections, :user_id unless index_exists?(:collections, :user_id)
    add_index :collections, :is_public unless index_exists?(:collections, :is_public)
    add_index :collections, [ :user_id, :is_public ] unless index_exists?(:collections, [ :user_id, :is_public ])
  end

  def down
    remove_index :collections, [ :user_id, :is_public ] if index_exists?(:collections, [ :user_id, :is_public ])
    remove_index :collections, :is_public if index_exists?(:collections, :is_public)
    remove_index :collections, :user_id if index_exists?(:collections, :user_id)
    change_column_null :collections, :is_public, true
    change_column_default :collections, :is_public, from: false, to: nil
    change_column_null :collections, :title, true
    if foreign_key_exists?(:collections, :users)
      remove_foreign_key :collections, :users
    end
    change_column_null :collections, :user_id, true
  end
end
