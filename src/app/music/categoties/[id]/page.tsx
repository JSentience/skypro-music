import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoriesPage({ params }: PageProps) {
  const { id } = await params;
  return <CategoryClient selectionId={id} />;
}
