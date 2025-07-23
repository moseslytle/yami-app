# Created 7/22/2025 by Moses Lytle
#
# Handles TOTP (Time-based One-Time Password) 2FA setup and verification
# Follows RFC 6238 standard for TOTP authentication
class Api::V1::Auth::TotpController < ApplicationController
  include AuthorizeRequest

  # Setup TOTP 2FA for authenticated user
  #
  # Generates a secret key and returns QR code URI for authenticator apps
  #
  # @return [Hash] TOTP setup information
  #
  # @example Successful response:
  #   {
  #     "secret": "JBSWY3DPEHPK3PXP",
  #     "qr_code_uri": "otpauth://totp/YamiApp:user@example.com?secret=...",
  #     "manual_entry_key": "JBSWY3DPEHPK3PXP"
  #   }
  def setup
    secret = @current_user.generate_totp_secret
    qr_uri = @current_user.totp_qr_code

    render json: {
      secret: secret,
      qr_code_uri: qr_uri,
      manual_entry_key: secret,
      message: "Scan QR code with your authenticator app, then verify with a code to enable 2FA"
    }, status: :ok
  end

  # Enable TOTP 2FA after verification
  #
  # @param code [String] 6-digit TOTP code from authenticator app
  # @return [Hash] Success message
  #
  # @example Request:
  #   POST /api/v1/auth/totp/enable
  #   { "code": "123456" }
  #
  # @example Successful response:
  #   {
  #     "message": "Two-factor authentication enabled successfully"
  #   }
  def enable
    if @current_user.verify_totp_code(params[:code])
      @current_user.enable_totp!
      render json: { message: "Two-factor authentication enabled successfully" }, status: :ok
    else
      render json: { errors: [ "Invalid TOTP code" ] }, status: :unprocessable_entity
    end
  end

  # Disable TOTP 2FA
  #
  # @param code [String] 6-digit TOTP code for verification
  # @return [Hash] Success message
  #
  # @example Request:
  #   POST /api/v1/auth/totp/disable
  #   { "code": "123456" }
  def disable
    if @current_user.verify_totp_code(params[:code])
      @current_user.disable_totp!
      render json: { message: "Two-factor authentication disabled successfully" }, status: :ok
    else
      render json: { errors: [ "Invalid TOTP code" ] }, status: :unprocessable_entity
    end
  end

  # Verify TOTP code during login
  #
  # @param code [String] 6-digit TOTP code
  # @return [Hash] Verification result
  #
  # @example Request:
  #   POST /api/v1/auth/totp/verify
  #   { "code": "123456" }
  def verify
    if @current_user.verify_totp_code(params[:code])
      render json: {
        message: "TOTP verification successful",
        verified: true
      }, status: :ok
    else
      render json: {
        errors: [ "Invalid TOTP code" ],
        verified: false
      }, status: :unprocessable_entity
    end
  end

  # Get TOTP status for current user
  #
  # @return [Hash] TOTP status information
  def status
    render json: {
      totp_enabled: @current_user.totp_enabled?,
      has_secret: @current_user.totp_secret.present?
    }, status: :ok
  end

  private

  # Strong parameters for TOTP requests
  # @return [ActionController::Parameters] Permitted parameters
  def totp_params
    params.permit(:code)
  end
end
