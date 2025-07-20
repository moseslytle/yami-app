class AddPasswordResetToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :reset_token, :string
    add_column :users, :reset_token_expires_at, :datetime
  end
end
