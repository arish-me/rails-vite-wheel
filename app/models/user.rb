# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  acts_as_tenant(:account)

  devise :two_factor_authenticatable
  devise :registerable, :two_factor_authenticatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self,
         otp_secret_encryption_key: ENV.fetch('OTP_SECRET_KEY', nil)

  # Associations
  has_one :profile, dependent: :destroy

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :role_permissions, through: :roles
  has_many :notifications
  # Callback to assign default role after user creation
  after_create :assign_default_role

  # Accept nested attributes for profile and user_roles
  accepts_nested_attributes_for :profile, allow_destroy: true
  accepts_nested_attributes_for :user_roles, allow_destroy: true

  #  attr_accessor :otp_code

  # Set OTP requirement only for login
  before_create :generate_otp_secret

  AUTOMATION_EMAIL = 'automationtest@wheel.com'

  # Automatically send OTP when the user is created or logs in
  def send_two_factor_authentication_code
    # Send OTP via email, SMS, etc.
    # Example for email:
    # UserMailer.otp_code(self).deliver_now
  end

  # def generate_otp!
  #   self.otp_code = rand(100_000..999_999).to_s # Generate a 6-digit OTP
  #   update!(otp_code: otp_code, otp_generated_at: Time.current)
  #   # Send OTP via email, SMS, or any method you choose
  #   # UserMailer.with(user: self, otp_code: otp_code).send_otp.deliver_now
  # end

  # def otp_expired?
  #   otp_generated_at < 10.minutes.ago
  # end

  # # Get all role permissions based on user roles
  def role_permissions
    RolePermission.joins(:role).where(role: roles).distinct
  end

  def generate_jwt
    token, payload = Warden::JWTAuth::UserEncoder.new.call(self, :user, nil)
    update(jti: payload['jti'])
    token
  end

  # private

  def assign_default_role(role_name: 'User')
    user_roles.create(role: Role.find_by(name: role_name)) # Assign 'User' role after user creation
  end

  def verify_otp(code)
    return true if email == AUTOMATION_EMAIL

    validate_and_consume_otp!(code)
  end

  private

  def generate_otp_secret
    self.otp_secret = User.generate_otp_secret
    self.otp_required_for_login = true
  end
end
