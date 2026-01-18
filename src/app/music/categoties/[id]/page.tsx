import { getSelectionById } from '@/sevices/tracks/selectionsApi';
import { getTracks } from '@/sevices/tracks/tracksApi';
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoriesPage({ params }: PageProps) {
  const { id } = await params;
  const selectionId = parseInt(id);
  const [selection, tracks] = await Promise.all([
    getSelectionById(selectionId),
    getTracks(),
  ]);
  return <CategoryClient selection={selection} tracks={tracks} />;
}
