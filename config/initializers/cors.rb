# Edited 07/19/2025 By Linus Xiong - Add CORS verify for safety
# Avoid CORS issues when API is called from the frontend app.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # if publish to production, need to change this origins
    origins "*"

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
