class User < ActiveRecord::Base
	has_secure_password

  validates :first_name, :last_name, :address, :zip, presence: :true
  validates :zip, numericality: { only_integer: true}
  validates :username, presence: :true, uniqueness: :true
end
