class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # before_action :check_logged_in, except: [:welcome, :new]

  # def check_logged_in
  #   @user = User.find_by(email: params[:email]).try(:authenticate, params[:password])

  #   unless @user
  #     redirect_to root_path
  #   end
  # end
end
