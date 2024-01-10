import { AdCategorySubModel } from "./ad_catagory_sub";

export interface AdCategoryMainModel {

  cat_id: number;
  cat_order: number;
  cat_name: string;
  slug: string;
  icon: string;
  picture: string;
  
  subcategorias:AdCategorySubModel[]
}

export interface AdCategoryMainResponse {
  STATUS:string,
  MESSAGE:string,
  DATA:AdCategoryMainModel[]
}

export interface CategoriaModal{
  idCat:number;
  idSub:number;
  clase:string;
  categoria:boolean;
  nombre:string;
  nombreCategoria:string;
  contenido:string;
  objeto:AdCategoryMainModel|AdCategorySubModel;
}