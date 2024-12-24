# frozen_string_literal: true

# Create Roles
roles = %w[Admin SuperAdmin Guest User]
roles.each do |name|
  Role.find_or_create_by!(name: name)
end

# Setup Account
account = Account.find_or_create_by!(subdomain: 'galaxy') do |acc|
  acc.name = 'Galaxy'
  acc.state = 'California'
  acc.city = 'San Francisco'
  acc.phone_number = '123-456-7890'
end

# Set the current tenant
ActsAsTenant.current_tenant = account

# Create SuperAdmin User within the context of the current account
superadmin_role = Role.find_by(name: 'SuperAdmin')
superadmin_user = User.find_or_create_by!(email: 'superadmin@wheel.com') do |user|
  user.password = 'password'
  user.password_confirmation = 'password'
end

# Assign the SuperAdmin role
superadmin_user.roles << superadmin_role unless superadmin_user.roles.include?(superadmin_role)

# Define Models
MODEL_NAME = %w[
  User
  Category
  Role
  RolePermission
  UserRole
].freeze

# Assign permissions to roles
MODEL_NAME.each do |model_name|
  Role.where(name: %w[SuperAdmin Admin]).each do |role|
    # Allow SuperAdmin and Admin to view and edit all models
    %i[view edit].each do |action|
      RolePermission.find_or_create_by!(role: role, resource: model_name, action: action)
    end
  end

  # Assign Guest and User roles
  Role.where(name: %w[Guest User]).each do |role|
    if model_name == 'Category'
      # Allow view permission only for the Category model
      RolePermission.find_or_create_by!(role: role, resource: model_name, action: :view)
    else
      # No permissions for other models
      RolePermission.where(role: role, resource: model_name).destroy_all
    end
  end
end

# Reset the current tenant to avoid conflicts
ActsAsTenant.current_tenant = nil

puts 'Seed data created successfully!'
