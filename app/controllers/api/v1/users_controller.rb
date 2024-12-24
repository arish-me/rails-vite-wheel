# frozen_string_literal: true

module Api
  module V1
    class UsersController < BaseController
      before_action :authenticate_user!
      before_action :set_user, only: [:update]
      before_action :authorize!, except: [:index]

      def index
        # Your code to fetch and render user data goes here
        user_profile = current_user&.profile
        image_url = user_profile&.image_url
        profile = user_profile&.as_json&.merge(image_url:)
        permissions = current_user.role_permissions.pluck(:resource, :action).as_json
        account = current_user.account

        render json: {
                 data: current_user.as_json.merge(profile:,
                                                  permissions:,
                                                  account:),
                 isLoggedIn: current_user.present?
               },
               status: :ok
      end

      def create; end

      def fetch
        @users = User.includes(:roles, :profile, :user_roles).all

        render json: @users.map { |user|
          user.as_json(include: :profile).merge(
            role_ids: user.roles&.ids
          )
        }, status: :ok
      end

      def update
        @user.update!(user_params)
        render_message(I18n.t('successfully_updated', entity: 'User'))
      end

      def create
        User.create!(user_params)
        render_message(I18n.t('successfully_updated', entity: 'User'))
      end

      # Confirm email address
      def confirm
        token = params[:token]
        user = User.find_by(confirmation_token: token)
        if user&.valid_confimation_token?
          user.token_confirmed!
          render json: { success: 'User confirmed successfully' }, status: :ok
        else
          render json: { error: 'Invalid token' }, status: :not_found
        end
      end

      def destroy; end

      private

      def authorize!
        authorize User
      end

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(
          :email,
          :password,
          :password_confirmation,
          profile_attributes: %i[id first_name last_name _destroy], # Adjust according to your profile attributes
          # user_roles_attributes: [:id, :role_id, :_destroy],
          role_ids: []
        )
      end
    end
  end
end
