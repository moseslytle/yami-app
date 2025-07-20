class UserMailer < ApplicationMailer
  def verification_email(user)
    @user = user
    @url = "#{ENV['FRONTEND_URL'] || 'http://localhost:3000'}/api/v1/auth/verify/#{user.verification_token}"
    mail(to: @user.email, subject: "Verify your account")
  end
end
