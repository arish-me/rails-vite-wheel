# frozen_string_literal: true

module Api
  module V1
    # models/accounts_controller.rb
    class AccountsController < BaseController
      before_action :set_account, only: %i[index update upload_image]
      def index
        render_json(
          account: @account.as_json.merge(image_url: @account.image_url),
        )
      end

      def update
        @account.update!(account_params)
        render_message(I18n.t('successfully_updated', entity: 'Account'), :ok, account: @account.as_json.merge(image_url: @account.image_url))
      end

      def upload_image
        @account.image.detach if @account.image.attached?
        @account.image.attach(params[:image])
        if @account.image.valid?
          @account.save(validate: false)
          render_message(I18n.t('successfully_updated', entity: 'Account'), :ok, image_url: @account.image_url)
        else
          render_error(@account.errors.full_messages.join(', '), :unprocessable_entity)
        end
      end

      private

      def set_account
        @account = ActsAsTenant.current_tenant
      end

      def account_params
        params.require(:account).permit(:name, :subdomain, :phone_number)
      end
    end
  end
end
