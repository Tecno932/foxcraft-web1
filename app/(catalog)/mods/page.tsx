import CategoryPage from "../[category]/page";

export default function Page() {
  return (
    <CategoryPage
      params={Promise.resolve({
        category: "mods",
      })}
    />
  );
}