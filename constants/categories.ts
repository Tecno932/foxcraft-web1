import type { ContentCategory } from "@/types";


interface CategoryConfig {

  title:string;

  description:string;

}


export const categories: Record<
ContentCategory,
CategoryConfig
> = {


mods:{
  title:"Mods",
  description:
  "Explora nuevos mundos, criaturas, sistemas y aventuras para Minecraft."
},


maps:{
  title:"Maps",
  description:
  "Mapas de aventura, survival, construcciones y experiencias únicas."
},


shaders:{
  title:"Texture and Shaders",
  description:
  "Mejora los gráficos de Minecraft con nuevos efectos visuales."
},


"resource-packs":{
  title:"Resource Packs",
  description:
  "Nuevas texturas, sonidos y estilos visuales."
},


"texture-packs":{
  title:"Texture Packs",
  description:
  "Paquetes de texturas para personalizar Minecraft."
},


"ui-packs":{
  title:"UI Packs",
  description:
  "Interfaces personalizadas para Minecraft."
},


skins:{
  title:"Skins",
  description:
  "Skins creadas por la comunidad."
},


"armor-trims":{
  title:"Armor Trims",
  description:
  "Diseños personalizados para armaduras."
},


banners:{
  title:"Banners",
  description:
  "Diseños de estandartes."
},


"schematics-java":{
  title:"Schematics Java",
  description:
  "Construcciones listas para Minecraft Java."
},


"schematics-bedrock":{
  title:"Schematics Bedrock",
  description:
  "Construcciones compatibles con Minecraft Bedrock."
}

};