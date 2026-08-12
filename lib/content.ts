import {
  ContentRepository
} from "@/repositories";


export function getAllContent(){

  return ContentRepository.getAll();

}



export function getContentBySlug(
  slug:string
){

  return ContentRepository.getBySlug(slug);

}



export function getContentByCategory(
  category:string
){

  return ContentRepository.getByCategory(category);

}



export function searchContent(
  query:string
){

  return ContentRepository.search(query);

}