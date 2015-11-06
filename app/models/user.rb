class User < ActiveRecord::Base
	has_secure_password

  validates :first_name, :last_name, :address, :zip, presence: :true
  validates :zip, numericality: { only_integer: true}, length: {maximum: 5}
  validates :username, presence: :true, uniqueness: :true
  validates :email, presence: :true, uniqueness: :true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
end
