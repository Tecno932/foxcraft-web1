import type {
ContentItem
} from "@/types";


interface Props{
item:ContentItem;
}


export function ContentInfo({
item
}:Props){

return(

<div
className="
grid
gap-4
sm:grid-cols-2
"
>


<div className="rounded-xl border border-border bg-surface p-5">

<p className="text-sm text-muted">
Autor
</p>

<p className="mt-1 font-medium">
{item.author}
</p>

</div>



<div className="rounded-xl border border-border bg-surface p-5">

<p className="text-sm text-muted">
Descargas
</p>

<p className="mt-1 font-medium">
{item.downloads?.toLocaleString() ?? "0"}
</p>

</div>



<div className="rounded-xl border border-border bg-surface p-5">

<p className="text-sm text-muted">
Versiones
</p>

<p className="mt-1 font-medium">
{item.version?.join(", ") ?? "Sin especificar"}
</p>

</div>



<div className="rounded-xl border border-border bg-surface p-5">

<p className="text-sm text-muted">
Plataforma
</p>

<p className="mt-1 font-medium">
{item.edition?.join(", ") ?? "Sin especificar"}
</p>

</div>


</div>

)

}