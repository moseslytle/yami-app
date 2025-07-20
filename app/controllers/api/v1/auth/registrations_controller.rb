class Api::V1::Auth::RegistrationsController < ApplicationController
  def create
    user = User.new(user_params)
    user.verification_token = SecureRandom.hex(16)

    if user.save
      UserMailer.verification_email(user).deliver_later
      render json: { message: "User registered. Please check your email to verify." }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
