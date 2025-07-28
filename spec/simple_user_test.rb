# created 7/20/2025 by Moses Lytle - test for auth and user
require 'rails_helper'

RSpec.describe User, type: :model do
  it "creates a user with valid attributes" do
    user = User.new(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    expect(user.valid?).to be true
  end

  it "requires an email" do
    user = User.new(name: "Test", password: "password123")

    expect(user.valid?).to be false
    expect(user.errors[:email]).to include("can't be blank")
  end

  it "encrypts password" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    expect(user.password_digest).to be_present
    expect(user.password_digest).not_to eq("password123")
  end

  it "generates OTP code" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    otp = user.generate_otp_code

    expect(otp).to match(/\A\d{6}\z/)
    expect(user.otp_code).to eq(otp)
    expect(user.otp_expires_at).to be_present
  end

  it "verifies correct OTP code" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    user.generate_otp_code

    expect(user.verify_otp_code(user.otp_code)).to be true
    expect(user.is_verified).to be true
  end

  it "rejects invalid OTP code" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    user.generate_otp_code

    expect(user.verify_otp_code("wrong")).to be false
    expect(user.is_verified).to be false
  end

  it "generates password reset token" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    user.generate_password_reset_token

    expect(user.reset_token).to be_present
    expect(user.reset_token_expires_at).to be_present
  end

  it "checks if password reset token is expired" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    user.update!(reset_token_expires_at: 2.hours.ago)

    expect(user.password_reset_expired?).to be true
  end

  it "generates TOTP secret" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    secret = user.generate_totp_secret

    expect(secret).to be_present
    expect(user.totp_secret).to eq(secret)
  end

  it "enables TOTP" do
    user = User.create!(
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    )

    user.enable_totp!

    expect(user.totp_enabled).to be true
  end
end
