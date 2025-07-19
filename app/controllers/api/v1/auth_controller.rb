


class Api::V1::AuthController < ApplicationController
def register
  user = User.new(user_params)

  if user.save
    render json: { message: "User registered successfully" }, status: :created
  else
    render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
  end
end

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token }, status: :ok
    else
      render json: { errors: [ "Invalid email or password" ] }, status: :unauthorized
    end
  end

private

def user_params
  params.require(:user).permit(:name, :email, :password, :password_confirmation)
end
end
