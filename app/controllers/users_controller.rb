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

    respond_to do |format|
      format.html {redirect_to root, notice: 'User was successfully destroyed'}
    end
  end

  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html{redirect_to @user, notice: 'User was successfully created.'}
      else
        format.html{render :new}
      end
    end
  end

  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html{redirect_to @user, notice: 'User was successfully updated.'}
      else
        format.html{render :new}
      end
    end
  end


  private 
  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :address, :zip, :username, :password, :password_confirmation)
  end
end
