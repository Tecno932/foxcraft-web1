"use client";


import {
useState
} from "react";

import {
SearchBar
} from "./search-bar";

import {
ContentGrid
} from "@/components/catalog";

import {
  EmptyState,
} from "@/components/ui";

import type {
ContentItem
} from "@/types";



interface Props {

items:ContentItem[];

}



export function Explorer({
items
}:Props){


const [
results,
setResults
] =
useState(items);



function handleSearch(
value:string
){


if(!value){

setResults(items);

return;

}



const search =
value.toLowerCase();



setResults(

items.filter(
item =>

item.title
.toLowerCase()
.includes(search)

||

item.description
.toLowerCase()
.includes(search)

)

);


}



return (

<div
className="
space-y-10
"
>


<SearchBar
onSearch={handleSearch}
/>


{results.length > 0 ? (
  <ContentGrid items={results} />
) : (
  <EmptyState />
)}


</div>

)

}