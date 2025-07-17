class CreateCollections < ActiveRecord::Migration[8.0]
  def change
    create_table :collections do |t|
      t.integer :user_id
      t.string :title
      t.text :description
      t.boolean :is_public

      t.timestamps
    end
  end
end
