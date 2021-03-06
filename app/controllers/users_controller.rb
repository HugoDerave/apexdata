class UsersController < ApplicationController
  before_action only: [:show] do
    redirect_to login_path unless current_user
  end

  before_action only: [:new] do
    redirect_to account_path if current_user
  end

  def show
    @user = current_user
    redirect_to root_path unless @user
  end

  def new
    @user = User.new
  end

  def edit
    @user = current_user
    redirect_to root_path unless @user
  end

  def create
    generate_api_key

    @user = User.new(user_params)
    @user.api_key = @token

    if @user.save
      session[:user_id] = @user.id

      redirect_to account_path, notice: "User was successfully created."
    else
      render :new
    end
  end

  def update
    params[:user].delete(:password).delete(:password_confirmation) if params[:user][:password].blank?
    @user = current_user
    if @user.update(user_params)
      redirect_to edit_user_path, notice: "User was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    current_user.destroy
    @claimed_profiles = ClaimedProfile.where(user_id: current_user.id)
    @claimed_profiles.destroy_all
    @event_signups = EventSignup.where(user_id: current_user.id)
    @event_signups.destroy_all
    @rewards = Reward.where(user_id: current_user.id)
    @rewards.destroy_all

    session[:user_id] = nil
    redirect_to login_path
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:username, :password, :password_confirmation)
  end

  def generate_api_key
    loop do
      @token = SecureRandom.base64.tr('+/=', 'Qrt')
      break @token unless User.exists?(api_key: @token)
    end
  end
end
