import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { PremitivePlayer } from '../src/components/organisms/player/PremitivePlayer';

let container: HTMLElement | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (!container) {
    throw Error('Container is missing');
  }
  document.body.removeChild(container);
  container = null;
});

it('can render', () => {
  if (!container) {
    throw Error('Container is missing');
  }
  act(() => {
    ReactDOM.render(<PremitivePlayer src="fake_video" />, container);
  });
  const video: HTMLVideoElement | null | undefined = container.querySelector(
    'video'
  );
  if (!video) {
    throw Error('Video tag is missing');
  }
  expect(video.src).toBe('http://localhost/fake_video');
});
