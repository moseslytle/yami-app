class User < ApplicationRecord
  has_secure_password

  # Verification token later?
  # before_create :generate_verification_token

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }

  private

  # def generate_verification_token
  #   self.verification_token = SecureRandom.urlsafe_base64
  # end
end
 