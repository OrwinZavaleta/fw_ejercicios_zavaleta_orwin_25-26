import { WeekDay } from '../enums/week-day';

export interface InterfaceHouseForm {
  // id?: string;
  firstName: string;
  lastName: string;
  email: string;
  housingLocationId: number;
  consultaDate: Date;
  id: number;
  assignedDay?: WeekDay;

}
