# frozen_string_literal: true

module Api
  module V1
    class RolePermissionsController < BaseController
      # before_action :set_role_permission

      before_action :authorize!

      def index
        roles = Role.excluding_super_admin.includes(:role_permissions).all
        all_resources = RolePermission.distinct.pluck(:resource) # More efficient to use `distinct.pluck`
        render json: roles.map { |role| serialize_role(role, all_resources) }
      end

      def create
        @role = RolePermission.create!(role_permission_params)
        render_message(I18n.t('successfully_created', entity: 'Permission'))
      end

      def update
        role_permission = RolePermission.find_or_initialize_by(
          role_id: role_permission_params[:role_id], resource: role_permission_params[:resource]
        )

        return destroy_permission(role_permission) if role_permission_params[:action] == 'none'

        role_permission.update!(action: role_permission_params[:action])
        render_message(I18n.t('successfully_updated', entity: 'Permission'))
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.message }, status: :unprocessable_entity
      end

      private

      def authorize!
        authorize RolePermission
      end

      def serialize_role(role, all_resources)
        {
          id: role.id,
          role_name: role.name,
          permissions: all_resources.map do |resource|
            role_permission = role.role_permissions.find { |rp| rp.resource == resource }
            {
              resource:,
              id: role_permission&.id,
              action: role_permission&.action || 'none'
            }
          end
        }
      end

      def destroy_permission(role_permission)
        if role_permission.persisted?
          role_permission.destroy
          render json: { success: true }
        else
          render json: { success: false, message: 'Permission not found' }, status: :not_found
        end
      end

      def set_role_permission
        @role_permission = RolePermission.find(params[:id])
      end

      def role_permission_params
        params.require(:role_permission).permit(:role_id, :resource, :action)
      end
    end
  end
end
