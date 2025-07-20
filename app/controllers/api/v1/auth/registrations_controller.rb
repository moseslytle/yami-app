# Created 7/19/2025 by Moses Lytle
#
# this manages the user signup process including account creation
class Api::V1::Auth::RegistrationsController < ApplicationController
  # create a new user account with email verification
  #
  # @param user [Hash] user params containing name, email, password, and password_confirmation
  # @return [Hash] Success message with :created status if user created successfully
  #
  # @example Request body:
  #   {
  #     "user": {
  #       "name": "John Doe",
  #       "email": "john@example.com",
  #       "password": "password123",
  #       "password_confirmation": "password123"
  #     }
  #   }
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
