export interface Country {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role_id: number;
}

export interface Body {
  id: number;
  type: string;
}
export interface Transmission {
  id: number;
  type: string;
  gears_num: number;
}

export interface Engine {
  id: number;
  name: string;
  type: string;
  configuration: string;
  power_kw: number;
  torque_nm: number;
  displacement: number;
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
  body: Body;
  generation: Generation;
  car_model: CarModel;
  manufacturer: Manufacturer;
  engine: Engine;
  transmission: Transmission;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  mileage: number;
  price: number;
  user_id: number;
  created_at: Date;
  modification: Modification;
  images: ListingImage[];
  documents?: Document[];
}

export interface ListingImage {
  order: number;
  url: string;
  id: string;
}

export interface Document {
  url: string;
  id: string;
}
