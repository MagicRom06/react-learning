import { render, screen } from '@testing-library/react';
import React from 'react';
import App, {
  storiesReducer,
  SearchForm,
  InputWithLlabel,
  List,
  Item
} from './App';

const  storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
}

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov',
  num_comments: 2,
  points: 5,
  objectID: 1,
}

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action = {type: 'REMOVE_STORY', payload: storyOne};
    const state = {data: stories, isLoading: false, isError: false};

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
    
  });
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Search/i);
  expect(linkElement).toBeInTheDocument();
});
