import React from 'react';
import './App.css';
import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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
        data: action.payload
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
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  )

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading : false, isError: false}
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    axios
    .get(url)
    .then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      })
    })
    .catch(() => 
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    );
  }, [url])

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  }

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  }

  return (
    <div className="container">
    <h1 className="headline-primary">My Hacker Stories</h1>

    <SearchForm 
      searchTerm={searchTerm}
      onSearchInput={handleSearchInput}
      onSearchSubmit={handleSearchSubmit}
    />

    {stories.isError && <p>Something went wrong ...</p>}
    {stories.isLoading ? ( <p>Loading ...</p> ) : ( <List list={stories.data} onRemoveItem={handleRemoveStory} /> )}
    </div>
  )
}

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => (
  <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLlabel 
      id="search"
      label="Search"
      value={searchTerm}
      type="text"
      onInputChange={onSearchInput}
      isFocused
    >
      <strong>Search: </strong>
    </InputWithLlabel>
    <button className="button button_large" type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
)

const InputWithLlabel = ({ id, value, type, onInputChange, children, isFocused }) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className="label">{children}</label>
      <input 
        ref={inputRef}
        onChange={onInputChange} 
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        className="input"
      />
    </>
  )
}

const List = ({list, onRemoveItem}) => {
  return list.map(item => (
    <Item 
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
    ))
  }

const Item = ({ item, onRemoveItem }) => {

  return (
  <div className="item" key={item.objectID}>
    <span style={{width: '40%'}}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{width: '30%'}}>{item.author}</span>
    <span style={{width: '10%'}}>{item.num_comments}</span>
    <span style={{width: '10%'}}>{item.points}</span>
    <span style={{width: '30%'}}>
      <button className="button button_small" type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
  )
}

export default App;