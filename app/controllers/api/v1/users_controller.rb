# Created 7/17/2025 by Moses Lytle
#
# controller provides access to user account information for authenticated users.
class Api::V1::UsersController < ApplicationController
  # JWT authorization for protection
  include AuthorizeRequest

  # Retrieves current authenticated user's profile information
  #
  # @header Authorization [String] Bearer <token> for authentication
  # @return [Hash] User profile data
  #
  # @example Request headers:
  #   Authorization: Bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  #
  # @example Successful response:
  #   {
  #     "user": {
  #       "id": 1,
  #       "name": "John Doe",
  #       "email": "john@example.com",
  #       "is_verified": true,
  #       "verified_at": "2025-07-20T17:39:59.251Z"        "created_at": "2025-07-20T17:38:03.944Z",
  #       "updated_at": "2025-07-20T18:35:54.245Z",
  #       "verification_token": null,
  #       "reset_token": null,
  #       "reset_token_expires_at": null
  #     }
  #   }
  def me
    render json: { user: @current_user }
  end
end
