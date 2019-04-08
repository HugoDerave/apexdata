Rails.application.routes.draw do
  mount Flipper::UI.app(Flipper) => "/flipper"

  root "high_voltage/pages#show", id: "index"

  resources :users
  resources :sessions, only: [:new, :create, :destroy]

  resources :profiles, only: [:index]
  get "profile/:platform/:user", to: "profiles#show"

  get "register", to: "users#new", as: "register"
  get "login", to: "sessions#new", as: "login"
  get "logout", to: "sessions#destroy", as: "logout"

  get "where/:where/:value" => "where#index", as: "where"

  get "legends" => "legends#index"
  get "legends/:name" => "legends#show", as: "legend_show"

  get "sort/:items/:sort_by" => "sort#index", as: "sort"

  post "claim-initiate", to: "claimed_profiles#initiate", as: "claim_profile_initiate"
  post "claim-step-1", to: "claimed_profiles#step_1", as: "claim_profile_step_1"
  post "claim-step-2", to: "claimed_profiles#step_2", as: "claim_profile_step_2"
  post "claim-step-3", to: "claimed_profiles#step_3", as: "claim_profile_step_3"
end
