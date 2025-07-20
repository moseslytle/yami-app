# Created 7/19/2025 by Moses Lytle
#
#  email verification process using secure tokens
# sent to users during registration.
class Api::V1::Auth::VerificationsController < ApplicationController
  # verify the user email address using verification token
  #
  # @param token [String] Verification token from email link
  # @return [Hash] Success message with :ok status if verification successful
  #
  # @example URL:
  #   GET /api/v1/auth/verify/abc123def456
  #
  # @example Successful response:
  #   {
  #     "message": "Account successfully verified."
  #   }
  def verify
    user = User.find_by(verification_token: params[:token])
    if user
      user.update(is_verified: true, verified_at: Time.current, verification_token: nil)
      render json: { message: "Account successfully verified." }, status: :ok
    else
      render json: { error: "Invalid or expired verification token" }, status: :not_found
    end
  end
end
