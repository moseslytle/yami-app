# Created 7/22/2025 by Moses Lytle
#
# Handles OTP (One-Time Password) verification for email confirmation
# Users receive a 6-digit code via email and enter it to verify their account
class Api::V1::Auth::OtpController < ApplicationController
  # Send OTP code to user's email
  #
  # @param email [String] User's email address
  # @return [Hash] Success message with :ok status
  #
  # @example Request:
  #   POST /api/v1/auth/otp/send
  #   { "email": "user@example.com" }
  #
  def send_code
    user = User.find_by(email: params[:email])

    if user
      otp_code = user.generate_otp_code
      UserMailer.otp_verification_email(user, otp_code).deliver_now
      render json: { message: "OTP code sent to your email" }, status: :ok
    else
      render json: { errors: [ "Email not found" ] }, status: :not_found
    end
  end

  # Verify OTP code
  #
  # @param email [String] User's email address
  # @param code [String] 6-digit OTP code
  # @return [Hash] Success message or error
  #
  # @example Request:
  #   POST /api/v1/auth/otp/verify
  #   { "email": "user@example.com", "code": "123456" }
  #
  def verify_code
    user = User.find_by(email: params[:email])

    if user.nil?
      render json: { errors: [ "Email not found" ] }, status: :not_found
      return
    end

    if user.otp_expired?
      render json: { errors: [ "OTP code has expired" ] }, status: :unprocessable_entity
      return
    end

    if user.otp_attempts >= 3
      render json: { errors: [ "Too many attempts. Please request a new code" ] }, status: :unprocessable_entity
      return
    end

    if user.verify_otp_code(params[:code])
      render json: { message: "Email verified successfully" }, status: :ok
    else
      remaining_attempts = 3 - user.otp_attempts
      render json: {
        errors: [ "Invalid OTP code. #{remaining_attempts} attempts remaining" ]
      }, status: :unprocessable_entity
    end
  end

  private

  # Strong parameters for OTP requests
  # @return [ActionController::Parameters] Permitted parameters
  def otp_params
    params.permit(:email, :code)
  end
end
