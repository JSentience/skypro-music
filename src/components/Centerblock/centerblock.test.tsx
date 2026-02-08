import { TrackType } from '@/sharedTypes/sharedTypes';
import { makeStore } from '@/store/store';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Centerblock from './Centerblock';

jest.mock('@/hooks/useFavoriteTracks', () => ({
  useFavoriteTracks: () => undefined,
}));
jest.mock('next/navigation', () => ({
  usePathname: () => '/music/main',
}));

const MockTracks: TrackType[] = [
  {
    _id: 1,
    name: 'Тестовый трек',
    author: 'Тестовый артист',
    release_date: '2020',
    genre: ['Поп'] as [string],
    duration_in_seconds: 69,
    album: 'Тестовый альбом',
    logo: null,
    track_file: 'track.mp3',
    stared_user: [],
  },
  {
    _id: 2,
    name: 'Тестовый трек 2',
    author: 'Тестовый артист 2',
    release_date: '2022',
    genre: ['Рок'] as [string],
    duration_in_seconds: 75,
    album: 'Тестовый альбом 2',
    logo: null,
    track_file: 'track-2.mp3',
    stared_user: [],
  },
];

describe('Centerblock component', () => {
  it('должен отображать заголовок и треки', () => {
    render(
      <Provider store={makeStore()}>
        <Centerblock tracks={MockTracks} title="Тестовая подборка" />
      </Provider>,
    );
    expect(screen.getByText('Тестовая подборка')).toBeInTheDocument();
    expect(screen.getByText('Тестовый трек')).toBeInTheDocument();
    expect(screen.getByText('Тестовый трек 2')).toBeInTheDocument();
  });
});
