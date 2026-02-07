import { MyMeal } from "./my-meal";

export interface UserMiniMeal {
  id: MyMeal['idMeal'];
  name: string;
  image_small: string;
}
