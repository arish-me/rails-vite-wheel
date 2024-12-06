# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
                                 sign_in: 'login',
                                 sign_out: 'logout',
                                 registration: 'signup'
                               },
                     controllers: {
                       sessions: 'users/sessions',
                       registrations: 'users/registrations',
                       passwords: 'users/passwords'
                     }
  devise_scope :user do
    post 'verify_otp', to: 'users/sessions#verify_otp'
    post 'change_password', to: 'users/registrations#change_password'
    delete 'bulk_destroy', to: 'users/registrations#bulk_destroy'
  end
  namespace :api do
    namespace :v1 do
      resources :users, only: %i[index create update] do
        get :fetch, on: :collection
      end
      resources :notifications do
        collection do
          patch :mark_all_as_read
        end
      end
      resources :profiles do
        member do
          post :upload_image
        end
      end
      resources :roles, only: %i[index show create destroy update] do
        delete 'bulk_destroy', on: :collection
      end
      resources :permissions, only: %i[index show create destroy update]
      resources :role_permissions, only: %i[index show create destroy update]
      resources :user_roles, only: %i[index show create destroy update] do
        delete 'bulk_destroy', on: :collection
      end
      resources :categories do
        delete 'bulk_destroy', on: :collection
      end
      resources :organization_settings
    end
  end

  get 'up' => 'rails/health#show', as: :rails_health_check

  root 'pages#index'

  # get '*path', to: 'pages#index', constraints: lambda { |req|
  #   req.path !~ %r{^/rails/active_storage}
  # }, defaults: { format: :html }

  get '*path', to: 'pages#index', constraints: lambda { |request|
    !request.xhr? && request.format.html?
  }
end
