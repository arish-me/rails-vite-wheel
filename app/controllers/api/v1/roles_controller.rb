# frozen_string_literal: true

module Api
  module V1
    # api/v1/roles_controller.rb
    class RolesController < BaseController
      before_action :authenticate_user!
      before_action :set_role, only: %i[update]
      before_action :load_data, only: :bulk_destroy
      before_action :authorize!

      def index
        roles = Role.excluding_super_admin
        render_json(roles:)
      end

      def create
        @role = Role.create!(role_params)
        render_message(I18n.t('successfully_created', entity: 'Role'))
      end

      def update
        @role.update!(role_params)
        render_message(I18n.t('successfully_updated', entity: 'Role'))
      end

      def bulk_destroy
        records_size = @roles.size
        if @roles.destroy_all
          render_message(I18n.t('successfully_deleted', count: records_size,
                                                        entity: records_size > 1 ? 'Roles' : 'Role'))
        else
          render_error(I18n.t(:something_went_wrong))
        end
      end

      def set_role
        @role = Role.find(params[:id])
      end

      def load_data
        @roles = Role.where(id: params[:ids])
      end

      def authorize!
        authorize Role
      end

      private

      def role_params
        params.require(:role).permit(:name)
      end
    end
  end
end
