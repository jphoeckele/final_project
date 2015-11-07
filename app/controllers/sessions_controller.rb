class SessionsController < ApplicationController
  def new
  end

  def welcome
  end

  def homepage
    @user = User.find_by(params[:email])
  end

  def logout
    session[:user_id] = nil
  end

  def create
	 @user = User.find_by(email: params[:email]).try(:authenticate, params[:password])

 	  if @user
 		 session[:user_id] = @user.id
 		 redirect_to homepage_path
 	  else
 		 render action: 'new'
 	  end
  end
end

