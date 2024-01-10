export interface AdCitiesModel {
  id: number;
  country_code: string;
  name: string;
  asciiname: string;
  latitude: number;
  longitude: number;
  feature_class: string;
  feature_code: string;
  subadmin1_code: string;
  subadmin2_code: number;
  population: bigint;
  time_zone: number;
  active: number;
  created_at: Date;
  updated_at: Date;

  provincia:string;
}

export interface AdCitiesResponse {
  STATUS:string,
  MESSAGE:string,
  DATA:AdCitiesModel[]
}