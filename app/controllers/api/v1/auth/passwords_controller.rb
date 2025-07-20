# Created 7/19/2025 by Moses Lytle
#
# manages the password reset process including reset token generation
# a
class Api::V1::Auth::PasswordsController < ApplicationController
  # Initiates password reset process by sending reset email
  #
  # @param email [String] User's email address
  # @return [Hash] Success message with :ok status if email found
  #
  # @example Request body:
  #   {
  #     "email": "john@example.com"
  #   }
  def forgot
    user = User.find_by(email: params[:email])
    if user
      user.generate_password_reset_token
      UserMailer.password_reset_email(user).deliver_later
      render json: { message: "Password reset email sent." }, status: :ok
    else
      render json: { error: "Email not found" }, status: :not_found
    end
  end

  # Resets user password using reset token
  #
  # @param token [String] password reset token from email
  # @param password [String] new password
  # @param password_confirmation [String] password confirmation
  # @return [Hash] Success message with :ok status if success
  #
  # @example Request body:
  #   {
  #     "token": "abc123def456",
  #     "password": "newpassword123",
  #     "password_confirmation": "newpassword123"
  #   }
  def reset
    user = User.find_by(reset_token: params[:token])

    if user.nil?
      render json: { error: "Invalid reset token" }, status: :not_found
    elsif user.password_reset_expired?
      render json: { error: "Reset token has expired" }, status: :unprocessable_entity
    elsif params[:password] != params[:password_confirmation]
      render json: { error: "Passwords do not match" }, status: :unprocessable_entity
    else
      user.password = params[:password]
      user.password_confirmation = params[:password_confirmation]

      if user.save
        user.clear_password_reset_token
        render json: { message: "Password successfully reset" }, status: :ok
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
