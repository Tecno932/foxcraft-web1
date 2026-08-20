import {
  ContentRepository
} from "@/repositories";

import type { ContentCategory } from "@/types";

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

  return ContentRepository.getByCategory(category as ContentCategory);

}



export function searchContent(
  query:string
){

  return ContentRepository.search(query);

}