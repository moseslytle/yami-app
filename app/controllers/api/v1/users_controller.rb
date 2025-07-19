class Api::V1::UsersController < ApplicationController
    include AuthorizeRequest

  def me
    render json: { user: @current_user }
  end
end
