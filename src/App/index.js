import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import List from '../List/index';
import SearchForm from '../SearchForm/index';

const StyledContainer = styled.div `
  height: 100vw;
  padding: 20px;
  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1 `
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='
const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const getUrl = (searchTerm, page) => 
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;
const extractSearchTerm = url =>
  url
    .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
    .replace(PARAM_SEARCH, '');

const getSumComments = stories => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: 
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading : false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      }
    default:
      throw new Error();
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)])

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], page: 0, isLoading : false, isError: false}
  );

  const sumComments = React.useMemo(() => getSumComments(stories), [
    stories,
  ]);

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    axios
    .get(urls)
    .then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page,
        }
      })
    })
    .catch(() => 
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    );
  }, [urls])

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  const handleRemoveStory = React.useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  }, []);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = event => {
    handleSearch(searchTerm, 0)
    event.preventDefault();
  }

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(url);
  }

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  }

  return (
    <StyledContainer>
    <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments</StyledHeadlinePrimary>

    <SearchForm 
      searchTerm={searchTerm}
      onSearchInput={handleSearchInput}
      onSearchSubmit={handleSearchSubmit}
    />
    <List list={stories.data} onRemoveItem={handleRemoveStory} />
    {stories.isError && <p>Something went wrong ...</p>}
    {stories.isLoading ? ( <p>Loading ...</p> ) : (<button type="button" onClick={handleMore}>More</button>)}
    </StyledContainer>
  )
}

export default App;

export {storiesReducer};