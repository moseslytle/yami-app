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
        end
      end

      namespace :user do
        resources :collections, only: [ :create, :destroy, :update ] do
          member do
            put :publish
          end
        end
        resources :favorites, param: :provider_id, only: [ :create, :destroy ]
      end

      post "auth/register", to: "auth#register"
      post "auth/login", to: "auth#login"
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
