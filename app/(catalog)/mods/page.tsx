import CategoryPage from "../[category]/page";

interface ModsPageProps {
  params: Promise<{
    category?: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({
  searchParams,
}: ModsPageProps) {
  return (
    <CategoryPage
      params={Promise.resolve({
        category: "mods",
      })}
      searchParams={searchParams}
    />
  );
}