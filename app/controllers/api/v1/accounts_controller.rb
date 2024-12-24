# frozen_string_literal: true

module Api
  module V1
    # models/accounts_controller.rb
    class AccountsController < BaseController
      def index
        @account = ActsAsTenant.current_tenant
        render_json(account: @account)
      end

      def update
        @account = ActsAsTenant.current_tenant
        @account.update!(account_params)
        render_message(I18n.t('successfully_updated', entity: 'Account'))
      end

      private

      def account_params
        params.require(:account).permit(:name, :subdomain, :phone_number)
      end
    end
  end
end
