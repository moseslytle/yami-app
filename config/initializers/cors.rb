# Edited 07/19/2025 By Linus Xiong - Add CORS verify for safety
# Avoid CORS issues when API is called from the frontend app.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*ENV.fetch("CORS_ORIGINS", "http://localhost:8081,http://localhost:19006")
      .split(",")
      .map(&:strip))

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
