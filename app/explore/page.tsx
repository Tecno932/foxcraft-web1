import {
Container,
Heading
} from "@/components/ui";


import {
Explorer
} from "@/components/search";


import {
ContentRepository
} from "@/repositories";



export default function ExplorePage(){


const content =
ContentRepository.getAll();



return (

<main>


<section
className="
py-20
"
>


<Container>


<div
className="
space-y-4
mb-10
"
>

<Heading
size="2xl"
>
Explorar contenido
</Heading>


<p
className="
text-muted
max-w-2xl
"
>

Busca mods, mapas, skins,
shaders y todo el contenido
disponible.

</p>


</div>



<Explorer
items={content}
/>


</Container>


</section>


</main>

)

}