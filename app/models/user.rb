
# Created 7/17/2025 by Moses Lytle
# Edited 7/22/2025 by Moses Lytle - add OTP email verification and TOTP 2FA support
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

  # Generates a 6-digit OTP code for email verification
  #
  # Creates a random 6-digit code that expires in 10 minutes.
  # Resets attempt counter when new code is generated.
  #
  # @return [String] The generated OTP code
  #
  # @example
  #   user.generate_otp_code
  #   # => "123456"
  def generate_otp_code
    self.otp_code = sprintf("%06d", rand(1_000_000))
    self.otp_expires_at = 10.minutes.from_now
    self.otp_attempts = 0
    save!
    otp_code
  end

  # Generates both verification token and OTP code for email verification
  #
  # This method is called during registration to provide users with two
  # verification options: clicking a link or entering an OTP code
  #
  # @return [String] The generated OTP code
  #
  # @example
  #   user.generate_verification_credentials
  #   # => "123456" (also sets verification_token)
  def generate_verification_credentials
    self.verification_token = SecureRandom.urlsafe_base64
    generate_otp_code
  end

  # Verifies the provided OTP code
  #
  # Checks if the code matches, hasn't expired, and user hasn't exceeded max attempts.
  # Increments attempt counter on each verification attempt.
  #
  # @param [String] code The OTP code to verify
  # @return [Boolean] true if verification successful, false otherwise
  #
  # @example
  #   user.verify_otp_code("123456")
  #   # => true (if code is correct and not expired)
  def verify_otp_code(code)
    return false if otp_code.blank? || otp_expires_at.blank?
    return false if Time.current > otp_expires_at
    return false if otp_attempts >= 3  # Max 3 attempts

    self.otp_attempts += 1

    if otp_code == code.to_s
      clear_otp_code
      mark_email_verified
      true
    else
      save!
      false
    end
  end

  # Clears the OTP code and related fields
  #
  # @return [void]
  def clear_otp_code
    self.otp_code = nil
    self.otp_expires_at = nil
    self.otp_attempts = 0
    save!
  end

  # Checks if OTP code has expired
  #
  # @return [Boolean] true if expired, false otherwise
  def otp_expired?
    otp_expires_at.blank? || Time.current > otp_expires_at
  end

  # Generates TOTP secret for 2FA setup
  #
  # Creates a new secret key for Time-based One-Time Password authentication.
  #
  # @return [String] Base32 encoded secret
  #
  # @example
  #   user.generate_totp_secret
  #   # => "JBSWY3DPEHPK3PXP"
  def generate_totp_secret
    require "rotp"
    self.totp_secret = ROTP::Base32.random
    save!
    totp_secret
  end

  # Enables TOTP 2FA for the user
  #
  # @return [Boolean] true if successfully enabled
  def enable_totp!
    self.totp_enabled = true
    save!
  end

  # Disables TOTP 2FA for the user
  #
  # @return [Boolean] true if successfully disabled
  def disable_totp!
    self.totp_enabled = false
    self.totp_secret = nil
    save!
  end

  # Verifies TOTP code
  #
  # @param [String] code The 6-digit TOTP code
  # @return [Boolean] true if code is valid
  #
  # @example
  #   user.verify_totp_code("123456")
  #   # => true (if code matches current time window)
  def verify_totp_code(code)
    return false unless totp_enabled? && totp_secret.present?

    require "rotp"
    totp = ROTP::TOTP.new(totp_secret)
    totp.verify(code, drift_behind: 30, drift_ahead: 30)
  end

  # Generates QR code URI for TOTP setup
  #
  # @param [String] issuer The application name
  # @return [String] QR code URI for authenticator apps
  #
  def totp_qr_code(issuer = "YamiApp")
    return nil unless totp_secret.present?

    require "rotp"
    totp = ROTP::TOTP.new(totp_secret, issuer: issuer)
    totp.provisioning_uri(email)
  end

  # Marks email as verified
  #
  # @return [void]
  def mark_email_verified
    self.is_verified = true
    self.verified_at = Time.current
    self.verification_token = nil
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
