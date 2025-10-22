/**
 * User model interface
 * 
 * This defines the structure of the user data coming from your backend.
 * It ensures strong typing in your Angular app when handling user info.
 */
export interface User {
  _id?: string;
  googleId?: string;
  user_email: string;
  user_password?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_phone_number?: string;
  user_address?: string;       // references a Location document (ObjectId)
  user_profile_img?: string;
  user_role?: 'admin' | 'seller' | 'buyer';
  refreshTokens?: string;
  user_createdAt?: Date;
  user_updatedAt?: Date;
}
