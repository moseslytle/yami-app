# Created 7/18/2025 by Moses Lytle
#
# This controller manages user login functionality and JWT token generation
# for authenticated API access.
class Api::V1::Auth::SessionsController < ApplicationController
  # Authenticates user credentials and returns JWT token
  #
  # @param email [String] User's email address
  # @param password [String] User's password
  # @return [Hash] JWT token with :ok status if authentication successful
  # @return [Hash] Error message with :unauthorized status if authentication fails
  #
  # @example Request body:
  #   {
  #     "email": "john@example.com",
  #     "password": "password123"
  #   }
  #
  # @example Successful response:
  #   {
  #     "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MjE1ODcyODF9.abc123"
  #   }
  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token }, status: :ok
    else
      render json: { errors: [ "Invalid email or password" ] }, status: :unauthorized
    end
  end
end
