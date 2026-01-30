import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Housing } from './../services/housing';
import { ActivatedRoute } from '@angular/router';
import { HousingLocationInfo } from '../interfaces/housinglocation';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(Housing);
  housingLocation: HousingLocationInfo | undefined;
  housingLocationId: number = 0;

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    this.housingLocationId = Number(this.route.snapshot.params['id']);
    // this.housingLocation = this.housingService.getHousingLocationById(this.housingLocationId);
    this.housingService.getHousingLocationById(this.housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
      this.changeDetectorRef.markForCheck();
      //notifica a Angular un cambio.
    });
  }
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
      this.housingLocationId,
    );
  }
}
