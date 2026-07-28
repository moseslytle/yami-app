demo_providers = [
  [ "Olympus Cleaners", "window washing", 5.0, 1, "4864 Stoneybrook Blvd, Hilliard, OH 43147", "(614) 407-5269", "https://s3-media0.fl.yelpcdn.com/bphoto/qH4jX-o097DbIaEMXgGcYg/o.jpg", 40.017496, -83.142223 ],
  [ "Dionne Supreme Studio", "hair stylists", 5.0, 2, "1239 N High St, Columbus, OH 43201", "(614) 824-3017", "https://s3-media0.fl.yelpcdn.com/bphoto/IGcXsI5VE_lOgM14luQQfA/o.jpg", 39.987610, -83.006040 ],
  [ "Tippie The Barber", "barbers", 5.0, 6, "2433 N High St, Columbus, OH 43202", "(614) 230-2660", "https://s3-media0.fl.yelpcdn.com/bphoto/uvZmN2vsNxlWTqpZBzChLg/o.jpg", 40.011904, -83.010793 ],
  [ "Outreach Promotional Solutions", "web design", 5.0, 2, "111 Liberty St, Columbus, OH 43215", "(614) 484-7329", "https://s3-media0.fl.yelpcdn.com/bphoto/FUHDuABjL_LSdOmgOoJ4nA/o.jpg", 39.950700, -83.002070 ],
  [ "Ace of All Trades", "pet services", 5.0, 1, "Columbus, OH 43228", "(614) 460-0267", "https://s3-media0.fl.yelpcdn.com/bphoto/YEZkFaZZjtGm2WMbWr1qbg/o.jpg", 39.964809, -83.125971 ],
  [ "Units Moving and Portable Storage", "self storage", 5.0, 1, "3635 Zane Trace Dr, Columbus, OH 43228", "(614) 695-3995", "https://s3-media0.fl.yelpcdn.com/bphoto/gOkiye52aPOmPWMCBz2lsA/o.jpg", 40.003903, -83.109969 ],
  [ "Putnam White Lewis Insurance", "insurance", 5.0, 7, "4161 N High St, Columbus, OH 43214", "(614) 267-1269", "https://s3-media0.fl.yelpcdn.com/bphoto/2bf5aY7UEvmtAVSWuome0A/o.jpg", 40.046870, -83.020410 ],
  [ "Streamline Auto", "auto repair", 5.0, 12, "3040 Cleveland Ave, Columbus, OH 43224", "(614) 268-2229", "https://s3-media0.fl.yelpcdn.com/bphoto/kBNL4UdcLEklFO7hXVW2iQ/o.jpg", 40.029602, -82.963759 ]
]

existing_names = Provider.where(name: demo_providers.map(&:first)).pluck(:name)
now = Time.current
Provider.insert_all!(demo_providers.filter_map do |name, category, rating, reviews, address, phone, image, latitude, longitude|
  next if existing_names.include?(name)

  {
    name:, category:, rating:, review_count: reviews, address:, phone:,
    image_url: image, latitude:, longitude:, created_at: now, updated_at: now
  }
end)

demo_user = User.find_or_create_by!(email: "demo@yami.app") do |user|
  user.name = "Yami Demo"
  user.password = "DemoYami123!"
  user.password_confirmation = "DemoYami123!"
  user.is_verified = true
  user.verified_at = Time.current
end

collection = demo_user.collections.find_or_create_by!(title: "Columbus Favorites") do |item|
  item.description = "A starter collection showcasing local services around Columbus."
  item.is_public = true
end

Provider.where(name: demo_providers.first(4).map(&:first)).find_each do |provider|
  collection.collection_items.find_or_create_by!(provider:)
end
