# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_19_222737) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "collection_items", force: :cascade do |t|
    t.integer "collection_id", null: false
    t.integer "provider_id", null: false
    t.datetime "added_at"
    t.text "user_note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["added_at"], name: "index_collection_items_on_added_at"
    t.index ["collection_id", "provider_id"], name: "index_collection_items_on_collection_id_and_provider_id"
    t.index ["collection_id"], name: "index_collection_items_on_collection_id"
    t.index ["provider_id"], name: "index_collection_items_on_provider_id"
  end

  create_table "collections", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title", null: false
    t.text "description"
    t.boolean "is_public", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["is_public"], name: "index_collections_on_is_public"
    t.index ["user_id", "is_public"], name: "index_collections_on_user_id_and_is_public"
    t.index ["user_id"], name: "index_collections_on_user_id"
  end

  create_table "favorites", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "provider_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider_id"], name: "index_favorites_on_provider_id"
    t.index ["user_id", "provider_id"], name: "index_favorites_on_user_id_and_provider_id", unique: true
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "providers", force: :cascade do |t|
    t.string "name", null: false
    t.string "category", null: false
    t.decimal "rating", precision: 3, scale: 2
    t.string "address"
    t.string "phone"
    t.text "hours"
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.string "image_url"
    t.string "price_range"
    t.string "google_place_id"
    t.string "yelp_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "review_count"
    t.index ["category"], name: "index_providers_on_category"
    t.index ["google_place_id"], name: "index_providers_on_google_place_id", unique: true
    t.index ["latitude", "longitude"], name: "index_providers_on_latitude_and_longitude"
    t.index ["yelp_id"], name: "index_providers_on_yelp_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.boolean "is_verified", default: false
    t.datetime "verified_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "collection_items", "collections"
  add_foreign_key "collection_items", "providers"
  add_foreign_key "collections", "users"
  add_foreign_key "favorites", "providers"
  add_foreign_key "favorites", "users"
end
