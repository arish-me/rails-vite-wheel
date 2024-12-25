class Account < ApplicationRecord
  include Imagable
  # Validations
  validates :subdomain, presence: true, uniqueness: true

  # Callbacks
  before_update :prevent_subdomain_change

  def image_url
    image.attached? ? Rails.application.routes.url_helpers.url_for(image.variant(:medium)) : nil
  end

  private

  def prevent_subdomain_change
    if subdomain_changed?
      errors.add(:subdomain, "cannot be updated after creation")
      throw(:abort)
    end
  end
end
