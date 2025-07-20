
class User < ApplicationRecord
  has_secure_password
  has_many :collections, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorited_providers, through: :favorites, source: :provider

  before_create :generate_verification_token

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }

  def generate_password_reset_token
    self.reset_token = SecureRandom.urlsafe_base64
    self.reset_token_expires_at = 1.hour.from_now
    save!
  end

  def password_reset_expired?
    reset_token_expires_at < Time.current
  end

  def clear_password_reset_token
    self.reset_token = nil
    self.reset_token_expires_at = nil
    save!
  end

  private

  def generate_verification_token
    self.verification_token = SecureRandom.urlsafe_base64
  end
end
