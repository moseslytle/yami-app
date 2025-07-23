class UserMailer < ApplicationMailer
  def verification_email(user, otp_code = nil)
    @user = user
    @otp_code = otp_code
    @url = "#{ENV['FRONTEND_URL'] || 'http://localhost:3000'}/api/v1/auth/verify/#{user.verification_token}"
    mail(to: @user.email, subject: "Verify your account")
  end

  def password_reset_email(user)
    @user = user
    @url = "#{ENV['FRONTEND_URL'] || 'http://localhost:3000'}/reset-password?token=#{user.reset_token}"
    mail(to: @user.email, subject: "Reset your password")
  end

  def otp_verification_email(user, otp_code)
    @user = user
    @otp_code = otp_code
    mail(to: @user.email, subject: "Your verification code")
  end
end
