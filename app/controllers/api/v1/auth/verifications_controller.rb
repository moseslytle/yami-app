class Api::V1::Auth::VerificationsController < ApplicationController
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
