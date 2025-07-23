class AddOtpAndTotpToUsers < ActiveRecord::Migration[8.0]
  def change
    # OTP (One-Time Password) fields for email verification
    add_column :users, :otp_code, :string, limit: 6
    add_column :users, :otp_expires_at, :datetime
    add_column :users, :otp_attempts, :integer, default: 0, null: false

    # TOTP (Time-based One-Time Password) fields for 2FA
    add_column :users, :totp_secret, :string
    add_column :users, :totp_enabled, :boolean, default: false, null: false

    # Add indexes for performance
    add_index :users, :otp_code
    add_index :users, :totp_enabled
  end
end
