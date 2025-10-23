import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbService } from '../services/db-service';
import { Router } from '@angular/router';
import { Contact } from '../models/contact_model';

@Component({
  selector: 'app-contact-us',
  imports: [FormsModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css'
})
export class ContactUs {
  contact: Contact[] = [];
  contact_data: Contact = new Contact;

  constructor(private db:DbService, private router:Router){}

  addContact(){
    this.db.addContact(this.contact_data).subscribe({
      next: (res:any)=>{
        console.log('Contact message sent:', res);
        this.contact_data = new Contact();
        alert('Your message has been sent successfully!');
      }
    })
  }
}
