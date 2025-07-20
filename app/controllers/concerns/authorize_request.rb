module AuthorizeRequest
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
  end

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
