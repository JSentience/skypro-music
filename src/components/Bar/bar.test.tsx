import { TrackType } from '@/sharedTypes/sharedTypes';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { makeStore } from '@/store/store';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Bar from './Bar';

jest.mock('next/link', () => {
  const LinkMock = ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  );

  LinkMock.displayName = 'LinkMock';
  return LinkMock;
});

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: jest.fn().mockResolvedValue(undefined),
});
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: jest.fn(),
});
Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: jest.fn(),
});
Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  configurable: true,
  value: 69,
});
Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  configurable: true,
  value: 0,
});

const mockTrack: TrackType = {
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

describe('Bar component', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  it('должен отображать автора и альбом трека', () => {
    const store = makeStore();
    store.dispatch(setCurrentTrack(mockTrack));
    render(
      <Provider store={store}>
        <Bar />
      </Provider>,
    );
    expect(screen.getByText(mockTrack.author)).toBeInTheDocument();
    expect(screen.getByText(mockTrack.album)).toBeInTheDocument();
  });

  it('должен отображать длительность трека после загрузки метаданных', async () => {
    const store = makeStore();
    store.dispatch(setCurrentTrack(mockTrack));
    render(
      <Provider store={store}>
        <Bar />
      </Provider>,
    );

    const audio = document.querySelector('audio') as HTMLAudioElement;
    fireEvent.loadedMetadata(audio);

    await waitFor(() => {
      expect(screen.getByText('00:00 / 01:09')).toBeInTheDocument();
    });
  });

  it('должен вызывать play при клике на кнопку воспроизведения', async () => {
    const store = makeStore();
    store.dispatch(setCurrentTrack(mockTrack));
    const playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play');

    render(
      <Provider store={store}>
        <Bar />
      </Provider>,
    );

    const audio = document.querySelector('audio') as HTMLAudioElement;
    fireEvent.loadedMetadata(audio);

    const playButton = document.querySelector('.player__btnPlay');
    expect(playButton).toBeInTheDocument();

    fireEvent.click(playButton!);

    await waitFor(() => {
      expect(playSpy).toHaveBeenCalled();
    });
  });

  it('должен вызывать pause при повторном клике на кнопку воспроизведения', async () => {
    const store = makeStore();
    store.dispatch(setCurrentTrack(mockTrack));
    const pauseSpy = jest.spyOn(HTMLMediaElement.prototype, 'pause');

    render(
      <Provider store={store}>
        <Bar />
      </Provider>,
    );

    const audio = document.querySelector('audio') as HTMLAudioElement;
    fireEvent.loadedMetadata(audio);

    const playButton = document.querySelector('.player__btnPlay');

    fireEvent.click(playButton!);

    Object.defineProperty(audio, 'paused', {
      configurable: true,
      value: false,
    });

    fireEvent.click(playButton!);

    await waitFor(() => {
      expect(pauseSpy).toHaveBeenCalled();
    });
  });
});
