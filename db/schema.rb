# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_29_183711) do

  create_table "badges", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "claimed_profiles", force: :cascade do |t|
    t.integer "user_id"
    t.string "profile_uid", limit: 255
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "check_1"
    t.string "check_2"
    t.string "check_3"
    t.integer "checks_completed", default: 0
    t.string "platform"
    t.string "username"
  end

  create_table "distributed_badges", force: :cascade do |t|
    t.string "profile_uid"
    t.integer "badge_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "visibility", default: 1
  end

  create_table "event_legend_data", force: :cascade do |t|
    t.integer "event_id"
    t.string "profile_uid"
    t.string "legend"
    t.integer "initial_value"
    t.bigint "current_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "event_signups", force: :cascade do |t|
    t.integer "event_id"
    t.integer "user_id"
    t.string "profile_uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "total_value", default: 0
  end

  create_table "events", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.text "description"
    t.string "data_names"
    t.string "legends"
    t.datetime "start_datetime"
    t.datetime "end_datetime"
    t.integer "badge_id_first_place"
    t.integer "badge_id_participation"
    t.string "reward_first_place"
    t.string "reward_second_place"
    t.string "reward_third_place"
  end

  create_table "flipper_features", force: :cascade do |t|
    t.string "key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_flipper_features_on_key", unique: true
  end

  create_table "flipper_gates", force: :cascade do |t|
    t.string "feature_key", null: false
    t.string "key", null: false
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_key", "key", "value"], name: "index_flipper_gates_on_feature_key_and_key_and_value", unique: true
  end

  create_table "memberships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "payment_complete", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "order_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.integer "user_id"
    t.integer "has_been_read", default: 0
    t.string "content"
    t.string "go_to"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "profile_legend_data", force: :cascade do |t|
    t.string "profile_uid"
    t.string "legend"
    t.string "data_name"
    t.bigint "data_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "remember_tokens", force: :cascade do |t|
    t.integer "user_id"
    t.string "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rewards", force: :cascade do |t|
    t.integer "user_id"
    t.string "title"
    t.string "description"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "server_statuses", force: :cascade do |t|
    t.string "display"
    t.string "group"
    t.string "host"
    t.decimal "response_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "level", default: 0
    t.string "api_key"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

end
