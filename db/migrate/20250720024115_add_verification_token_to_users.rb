class AddVerificationTokenToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :verification_token, :string
  end
end
