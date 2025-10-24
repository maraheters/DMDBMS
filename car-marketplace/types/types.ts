export interface User {
  id: number;
  email: string;
  password_hash: string;
  role_id: number;
}
export interface Manufacturer {
  id: number;
  name: string;
}
export interface CarModel {
  id: number;
  name: string;
}
export interface Generation {
  id: number;
  name: string;
}
export interface Modification {
  id: number;
  name: string;
}
export interface Listing {
  id: number;
  carConfiguration: any;
  price: number;
  mileage: number;
  images: ListingImage[];
}
export interface ListingImage {
  order: number;
  url: string;
  id: string;
}
