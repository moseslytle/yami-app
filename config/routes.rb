Rails.application.routes.draw do
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"



  namespace :api do
    namespace :v1 do
      resources :collections, only: [ :index, :show ]
      resources :providers, only: [ :index, :show ] do
        collection do
          get :search
          get :most_favorited
          get "search/google", to: "providers#search_google"
          get "search/yelp", to: "providers#search_yelp"
          get "search/all", to: "providers#search_all"
        end
      end

      namespace :user do
        resources :collections do
          member do
            put :publish
          end
          resources :items, only: [ :create, :destroy, :update, :index ]
        end
        resources :favorites, param: :provider_id, only: [ :index, :create, :destroy ]
      end

      namespace :auth do
        post :register, to: "registrations#create"
        post :login, to: "sessions#create"
        post "password/forgot", to: "passwords#forgot"
        post "password/reset", to: "passwords#reset"
        get  "verify/:token", to: "verifications#verify"

        # OTP routes for email verification with 6-digit codes
        post "otp/send", to: "otp#send_code"
        post "otp/verify", to: "otp#verify_code"

        # TOTP routes for 2FA (Time-based One-Time Password)
        post "totp/setup", to: "totp#setup"
        post "totp/enable", to: "totp#enable"
        post "totp/disable", to: "totp#disable"
        post "totp/verify", to: "totp#verify"
        get "totp/status", to: "totp#status"
      end

      get "me", to: "users#me"
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
