# frozen_string_literal: true

class RolePolicy < ApplicationPolicy
  def index?
    user_has_permission?(:view) || user_has_permission?(:edit)
  end

  def show?
    user_has_permission?(:view) || user_has_permission?(:edit)
  end

  def create?
    user_has_permission?(:edit)
  end

  def fetch?
    user_has_permission?(:edit)
  end

  def update?
    user_has_permission?(:edit)
  end

  def destroy?
    user_has_permission?(:edit)
  end

  def bulk_destroy?
    user_has_permission?(:edit)
  end

  private

  def user_has_permission?(action)
    # Check if the user has any role
    return false unless user.roles.present?

    # Check permissions based on role_permissions table
    user.roles.any? do |role|
      role.role_permissions.exists?(resource: record.name, action:)
    end
  end
end
