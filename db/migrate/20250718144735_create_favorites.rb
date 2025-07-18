# Created 7/18/2025 by Joshua, migrate for create user favorites table
class CreateFavorites < ActiveRecord::Migration[8.0]
  def change
    create_table :favorites do |t|
      t.integer :user_id, null: false
      t.integer :provider_id, null: false

      t.timestamps
    end

    # Add dependenices to existing tables
    add_index :favorites, :user_id
    add_index :favorites, :provider_id
    add_index :favorites, [:user_id, :provider_id], unique: true

    add_foreign_key :favorites, :users
    add_foreign_key :favorites, :providers
  end
end
