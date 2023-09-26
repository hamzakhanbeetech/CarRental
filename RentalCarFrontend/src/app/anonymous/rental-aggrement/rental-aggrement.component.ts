import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { formatDate } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

interface Review {
  reviewId: number;
  productId?: number;
  userId?: number;
  rating?: number;
  comment?: string;
  reviewDate?: Date;
}

interface Product {
  carId: number;
  maker: string;
  model: string;
  rentalPrice?: number;
  imageURL?: string;
  availabilityStatus: boolean;
  rentalAgreement: any[]
}

@Component({
  selector: 'app-rental-agreement',
  templateUrl: './rental-aggrement.component.html',
  styleUrls: ['./rental-aggrement.component.css']
})
export class RentalAgreementComponent implements OnInit {

  
  todayDate:Date = new Date();
  
  
  myHolidayDates = [
    new Date("09/26/2024"),
];

myHolidayFilter = (d: Date | null): boolean => {
  const time=d?.getTime();
  return !this.myHolidayDates.find(x=>x.getTime()==time);
}

hi(d: Date | null):boolean{
  const time=d?.getTime();
  return !this.myHolidayDates.find(x=>x.getTime()==time);

}
  currentDate = new Date();
  checkA: boolean = true;

  totalDays:number|undefined;
  productId = 0; 
  product: Product | undefined;
  reviews: Review[] = []; 
  startDate: Date = new Date(); 
  endDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router:Router,
    private fb: FormBuilder,) {}
    dateRangeForm!: FormGroup;
    predefinedRanges: {startDate: Date; endDate: Date;}[] = [
      { startDate: new Date('2023-09-25'), endDate: new Date('2023-09-29') },
      // Add more predefined ranges as needed
    ];

  
  ngOnInit(): void {  

    this.totalDays=0;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = Number(id);
        console.log('id:', this.productId);
        this.getProductDetails();
        this.getReviewsByProductId();
        this.initForm()
      } else {
        // Handle the case when the productId is not present in the route
        console.log('productId is not available');
      }
    });
  }

  initForm(){
    this.dateRangeForm = this.fb.group(
      {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      },
      { validator: this.dateRangeOverlapValidator(this.predefinedRanges) }
    );

  }  

  dateRangeOverlapValidator(predefinedRanges: { startDate: Date, endDate: Date }[]): ValidatorFn 
  {
    console.log("predefined ranges validator")
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDate = control.get('startDate')!.value as Date;
      const endDate = control.get('endDate')!.value as Date;
  
      if (startDate && endDate && startDate <= endDate) {
        for (const predefinedRange of predefinedRanges) {
          if (startDate <= predefinedRange.endDate && endDate >= predefinedRange.startDate) {
            return { overlapping: true };
          }
        }
      }
  
      return null; // No error
    };
}

  getProductDetails(): void {
    this.apiService.getProduct(this.productId).subscribe(
      (product) => {
        this.product = product;
        console.log(this.product);

        
        this.product?.rentalAgreement.forEach(element => {
          this.disableDates(new Date(element.startDate), new Date(element.endDate))
          this.predefinedRanges.push(
            { startDate: new Date(element.startDate), endDate: new Date(element.endDate) },)
        });
        
      },
      (error) => {
        console.error('Failed to fetch product details:', error);
      }
    );
  }
  disableDates(startDate:Date, endDate:Date){
    
    const MS_PER_DAY: number = 1000 * 60 * 60 * 24;
    const start: number = startDate.getTime();
    const end: number = endDate.getTime();
    const daysBetweenDates: number = Math.ceil((end - start) / MS_PER_DAY);

    // The days array will contain a Date object for each day between dates (inclusive)
    const days: Date[] = Array.from(new Array(daysBetweenDates + 1), 
        (v, i) => new Date(formatDate(new Date(start + (i * MS_PER_DAY)),'MM/dd/yyyy',"en-US"))
        );
    
    this.myHolidayDates = this.myHolidayDates.concat(days)

    console.log("datessss ", this.myHolidayDates)
    
    this.myHolidayFilter = (d: Date | null): boolean => {
      const time=d?.getTime();
      return !this.myHolidayDates.find(x=>x.getTime()==time);
    }
  }
  calculateTotalPrice(): void {
    if (this.dateRangeForm.value.startDate && this.dateRangeForm.value.endDate) {
      const start = new Date(this.dateRangeForm.value.startDate);
      const end = new Date(this.dateRangeForm.value.endDate);
      const timeDifference = end.getTime() - start.getTime();
      this.totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    } else {
      this.totalDays = undefined; // Reset totalDays if dates are not valid
    }
    const data={
      carId:this.productId,
      startDate:this.dateRangeForm.value.startDate,
      endDate:this.dateRangeForm.value.endDate
    }
    this.apiService.CheckAvailability(data).subscribe(res=>{
      console.log(res);
      if(res===false)
      {
        this.checkA=false;
      }
      else
      {
        this.checkA=true;
      }
    })
  }

  ConfirmBooking()
  {

    if(this.dateRangeForm.invalid){
      alert("Invalid Form")
      return
    }
    const data = {
      rentalAgreement: 0,
      carId: this.productId,
      userId: 0,
      startDate: this.dateRangeForm.value.startDate,
      endDate: this.dateRangeForm.value.endDate,
      rentalDuration: this.totalDays,
      totalCost: (this.product?.rentalPrice),
      imageURL:this.product?.imageURL,
      model:this.product?.model
    };
    console.log(data);
    this.apiService.addBooking(data).subscribe(

      (response: any) => {
        alert("Booking is Confirm");
        console.log('Bookng added successfully:', response);

        this.router.navigate(['/']);

      },

      (error: any) => {

        console.error('Failed to add product:', error);

      }

    );

  }


  getReviewsByProductId(): void {
    this.apiService.getReviewsByProductId(this.productId).subscribe(
      (reviews) => {
        this.reviews = reviews;
      },
      (error) => {
        console.error('Failed to fetch reviews:', error);
      }
    );
  }
}
