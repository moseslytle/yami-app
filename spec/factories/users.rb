# Created 07/19/2025 By Linus Xiong
FactoryBot.define do
  factory :user do
    name { "Test User" }
    email { Faker::Internet.email }
    password { "password123" }
  end
end
