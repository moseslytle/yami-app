
# Created 7/17/2025 by Moses Lytle
#
# Represents a user in the system with authentication capabilities, email verification,
#
# @attr [String] name User's full name
# @attr [String] email User's email address (unique)
# @attr [String] password_digest Encrypted password
# @attr [Boolean] the user's email has been verified
# @attr [DateTime] verified_at Timestamp when email was verified
# @attr [String] verification_token Token for email verification (auto-generated)
# @attr [String] reset_token Token for password reset
# @attr [DateTime] reset_token_expires_at Expiration time for password reset token
class User < ApplicationRecord
  has_secure_password

  # Associations
  has_many :collections, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorited_providers, through: :favorites, source: :provider

  # Callbacks
  before_create :generate_verification_token

  # Validations
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }

  # Generates a secure password reset token with expiration
  #
  # Creates a URL-safe token and sets expiration 1 hour
  #
  # @return [void]
  #
  # @example
  #   user.generate_password_reset_token
  #   # Sets a reset_token and reset_token_expires_at then saves
  def generate_password_reset_token
    self.reset_token = SecureRandom.urlsafe_base64
    self.reset_token_expires_at = 1.hour.from_now
    save!
  end

  # Checks if the password reset token has expired
  #
  # @return [Boolean] true if token has expired, false otherwise
  #
  # @example
  #   user.password_reset_expired?
  #   # => false (if token is still valid)
  def password_reset_expired?
    reset_token_expires_at < Time.current
  end

  # Clears the password reset token and expiration
  #
  # Removes the reset token and expiration timestamp after successful
  # password reset to prevent token reuse.
  #
  # @return [void]
  #
  # @example
  #   user.clear_password_reset_token
  #   # Sets reset_token and reset_token_expires_at to nil, then saves
  def clear_password_reset_token
    self.reset_token = nil
    self.reset_token_expires_at = nil
    save!
  end

  private

  # Generates a unique verification token for email verification
  #
  # Creates a URL-safe token used in email verification links.
  #
  # @return [void]
  def generate_verification_token
    self.verification_token = SecureRandom.urlsafe_base64
  end
end
