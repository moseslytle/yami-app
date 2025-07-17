class CreateCollectionItems < ActiveRecord::Migration[8.0]
  def change
    create_table :collection_items do |t|
      t.integer :collection_id
      t.integer :provider_id
      t.datetime :added_at
      t.text :user_note

      t.timestamps
    end
  end
end
