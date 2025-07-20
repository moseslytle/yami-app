
class Api::V1::AuthController < ApplicationController
  def register
    user = User.new(user_params)
    user.verification_token = SecureRandom.hex(16)

    if user.save
      UserMailer.verification_email(user).deliver_later
      render json: { message: "User registered. Please check your email to verify." }, status: :created
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


  def verify
  user = User.find_by(verification_token: params[:token])
  if user
    user.update(is_verified: true, verified_at: Time.current, verification_token: nil)
    render json: { message: "Account successfully verified." }, status: :ok
  else
    render json: { error: "Invalid or expired verification token" }, status: :not_found
  end
end


private

def user_params
  params.require(:user).permit(:name, :email, :password, :password_confirmation)
end
end
