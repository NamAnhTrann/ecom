import { Product } from './product_model';

export interface User {
  _id?: string;
  googleId?: string;

  user_email: string;
  user_password?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_phone_number?: string;
  user_address?: string;
  user_profile_img?: string;

  user_role?: 'admin' | 'seller' | 'buyer';
  refreshTokens?: string;

  user_createdAt?: Date;
  user_updatedAt?: Date;

  // reset password fields
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  products?: (string | Product)[];
}
