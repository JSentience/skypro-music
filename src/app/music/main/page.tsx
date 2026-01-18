import { getTracks } from '@/sevices/tracks/tracksApi';
import MainClient from './MainClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tracks = await getTracks();
  return <MainClient tracks={tracks} />;
}
