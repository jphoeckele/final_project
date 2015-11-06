class AddEmailConfirmationToUser < ActiveRecord::Migration
  def change
    add_column :users, :email_confirmtaion, :string
  end
end
