
module AuthorizeRequest
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
  end

  private

  # Validates JWT token and sets current user
  #
  # @header Authorization [String] Bearer token in format "Bearer <token>"
  # @return [void] Sets @current_user instance variable if successful
  # @return [JSON] Error response with 401 status if unauthorized
  def authorize_request
    header = request.headers["Authorization"]
    header = header.split(" ").last if header.present?

    decoded = JsonWebToken.decode(header)

    if decoded && decoded[:user_id]
      @current_user = User.find(decoded[:user_id])
    else
      render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
    end
  rescue ActiveRecord::RecordNotFound
    render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
  rescue JWT::DecodeError
    render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
  rescue
    render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
  end
end
