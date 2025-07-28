# Created 07/19/2025 By Linus Xiong
FactoryBot.define do
  factory :collection do
    title { "Test Collection" }
    description { "Test Description" }
    is_public { false }
    association :user

    trait :public do
      is_public { true }
    end

    trait :private do
      is_public { false }
    end
  end

  factory :provider do
    name { "Test Provider" }
    category { "Restaurant" }
    rating { 4.5 }
    image_url { "https://example.com/image.jpg" }
    price_range { "$$" }
    favorites_count { 0 }
    address { "123 Test Street, Test City" }
    phone { "+1234567890" }
    hours { "Mon-Sun: 9:00 AM - 10:00 PM" }
    google_place_id { "test_google_place_id_#{rand(10000)}" }
    yelp_id { "test_yelp_id_#{rand(10000)}" }
    review_count { 100 }
  end

  factory :collection_item do
    association :collection
    association :provider
    user_note { "Great place!" }
  end
end
