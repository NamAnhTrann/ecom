import { Component } from '@angular/core';
import { Product } from '../models/product_model';
import { DbService } from '../services/db-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-detail',
  imports: [],
  templateUrl: './view-detail.html',
  styleUrl: './view-detail.css'
})
export class ViewDetail {
  product? : Product;
  //add to cart later

  ngOnInit(): void {
    //TODO list product
    this.listSingleProduct();
  }

  constructor(private db: DbService, private router:Router, private route:ActivatedRoute){}

  listSingleProduct(){
    this.route.paramMap.subscribe(params =>{
      const product_id = params.get('id')!;
      this.db.listSingleProduct(product_id).subscribe((data:any)=>{
        this.product = data;
      })
    })
  }
}
