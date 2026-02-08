import { TrackType } from '@/sharedTypes/sharedTypes';
import { makeStore } from '@/store/store';
import { formatTime } from '@/utils/helper';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Track from './Track';

const baseTrack: TrackType = {
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
};

describe('Track component', () => {
  it('должен отображать данные трека', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <Track track={baseTrack} />
      </Provider>,
    );

    expect(screen.getByText(baseTrack.name)).toBeInTheDocument();
    expect(screen.getByText(baseTrack.author)).toBeInTheDocument();
    expect(
      screen.getByText(formatTime(baseTrack.duration_in_seconds)),
    ).toBeInTheDocument();
    expect(screen.getByText(baseTrack.album)).toBeInTheDocument();
  });
});
