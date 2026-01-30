import { Injectable } from '@angular/core';
import { InterfaceHouseForm } from '../interfaces/interface-house-form';
import { InterfaceUser } from '../interfaces/interface-user';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly APPLICATIONS_KEY = 'application';
  private readonly USERS_KEY = 'users';
  private readonly AUTH_KEY = 'currentUser';

  constructor() {
    this.initializeTestUsers();
  }

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

  getApplicationsByMonthAndYear(month: number, year: number): InterfaceHouseForm[] {
    const allApplications = this.getAllApplications();

    return allApplications.filter((application) => {
      const date = new Date(application.consultaDate);
      return date.getMonth() === month - 1 && date.getFullYear() === year;
    });
  }

  private initializeTestUsers(): void {
    const currentUsers = this.getAllUsers();

    if (currentUsers.length === 0) {
      const testUsers: InterfaceUser[] = [
        { username: 'gon', password: 'gon' },
        { username: 'killua', password: 'killua' },
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(testUsers));
    }
  }

  private getAllUsers(): InterfaceUser[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  verifyUser(username: string, password: string): boolean {
    const users = this.getAllUsers();
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  saveAuthenticatedUser(username: string): void {
    localStorage.setItem(this.AUTH_KEY, username);
  }

  getAuthenticatedUser(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAuthenticatedUser() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }
}
