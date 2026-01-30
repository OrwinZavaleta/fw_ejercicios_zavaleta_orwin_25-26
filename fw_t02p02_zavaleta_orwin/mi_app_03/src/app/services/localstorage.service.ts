import { Injectable } from '@angular/core';
import { InterfaceHouseForm } from '../interfaces/interface-house-form';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly APPLICATIONS_KEY = 'application';

  saveApplication(application: InterfaceHouseForm): void {
    const applications = this.getAllApplications();
    applications.push(application);
    localStorage.setItem(this.APPLICATIONS_KEY, JSON.stringify(applications));
  }

  getAllApplications(): InterfaceHouseForm[] {
    const data = localStorage.getItem(this.APPLICATIONS_KEY);
    if (!data) {
      return [];
    }

    const applications = JSON.parse(data);
    for (let i = 0; i < applications.length; i++) {
      applications[i].consultaDate = new Date(applications[i].consultaDate);
    }

    return applications;
  }
}
