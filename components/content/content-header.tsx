import Image from "next/image";

import {
  Badge,
  Heading
} from "@/components/ui";

import type {
  ContentItem
} from "@/types";


interface Props {
 item:ContentItem;
}


export function ContentHeader({
 item
}:Props){

return(

<div className="space-y-6">


<div
className="
relative
aspect-video
overflow-hidden
rounded-3xl
border
border-border
"
>

<Image

src={item.image}

alt={item.title}

fill

className="
object-cover
"

/>

</div>



<div className="flex flex-wrap gap-3">

<Badge variant="primary">
{item.category}
</Badge>


{item.edition?.map((edition) => (
  <span
    key={edition}
    className="
      rounded-full
      bg-surface-secondary
      px-3
      py-1
      text-xs
      text-muted
    "
  >
    {edition}
  </span>
))}

</div>



<Heading
as="h1"
size="2xl"
>

{item.title}

</Heading>



<p className="max-w-3xl text-lg text-muted">

{item.description}

</p>


</div>

)

}