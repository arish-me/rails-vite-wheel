class Account < ApplicationRecord
  # Validations
  validates :subdomain, presence: true, uniqueness: true

  # Callbacks
  before_update :prevent_subdomain_change

  private

  def prevent_subdomain_change
    if subdomain_changed?
      errors.add(:subdomain, "cannot be updated after creation")
      throw(:abort)
    end
  end
end
