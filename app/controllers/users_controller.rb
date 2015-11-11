class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  def new
    @user = User.new
  end

  def show
  end

  def edit
  end

  def destroy
    @user.destroy

    redirect_to root_path, notice: 'User was successfully destroyed'
  end

  def create
    @user = User.new(user_params)

    if @user.save
      redirect_to homepage_path, notice: 'User was successfully created.'
    else
      render :homepage_path
    end
  end

  def update
    if @user.update(user_params)
      html{redirect_to @user, notice: 'User was successfully updated.'}
    else
      html{render :new}
    end
  end


  private
  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :address, :zip, :password, :password_confirmation, :email, :email_confirmation)
  end
end
