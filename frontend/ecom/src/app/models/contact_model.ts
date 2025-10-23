/**
 * User model interface
 * 
 * This defines the structure of the user data coming from your backend.
 * It ensures strong typing in your Angular app when handling user info.
 */
export class Contact {
  _id?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone_number?: string;
  contact_enquiry_type?: string;
  contact_message?: string;
  contact_createdAt?: Date;
  contact_updatedAt?: Date;

  constructor(){
    this.contact_first_name = '';
    this.contact_last_name = '';
    this.contact_email = '';
    this.contact_phone_number = '';
    this.contact_enquiry_type = '';
    this.contact_message = '';
    this.contact_createdAt = new Date();
    this.contact_updatedAt = new Date();
  }
}
