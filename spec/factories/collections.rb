FactoryBot.define do
  factory :collection do
    title { "Test Collection" }
    description { "Test Description" }
    is_public { false }
  end
end
