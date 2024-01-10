export interface AdCategorySubModel {

  sub_cat_id: number;
  main_cat_id: number;
  sub_cat_name: string;
  slug: string;
  cat_order: number;
  photo_show: string;
  price_show: string;
  picture: string;
  
  categoria:string;
}

export interface AdCategorySubResponse {
  STATUS:string,
  MESSAGE:string,
  DATA:AdCategorySubModel[]
}