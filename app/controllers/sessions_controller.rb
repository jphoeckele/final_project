class SessionsController < ApplicationController
  before_action :set_user, only: [:homepage]
  after_action :forget_user, only: [:logout]

  def new
  end

  def welcome
  end

  def homepage
    session[:user_id] = @user.id
  end

  def logout
    reset_session
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

  private
  def set_user
    @user = User.find_by(params[:email])
  end

  def forget_user
    @user = nil
  end
end

