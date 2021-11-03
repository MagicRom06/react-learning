import React from 'react';
import './App.css';
import axios from 'axios';
import styled from 'styled-components';

const StyledContainer = styled.div `
  height: 100vw;
  padding: 20px;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1 `
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const StyledButton = styled.button `
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;

const StyledSearchForm = styled.form `
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledButtonSmall = styled(StyledButton) `
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton) `
  padding: 10px;
`;

const StyledLabel = styled.label `
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledItem = styled.div `
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span `
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: inherite;
  }

  width: ${props => props.width};
`;

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
    <StyledContainer>
    <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>

    <SearchForm 
      searchTerm={searchTerm}
      onSearchInput={handleSearchInput}
      onSearchSubmit={handleSearchSubmit}
    />

    {stories.isError && <p>Something went wrong ...</p>}
    {stories.isLoading ? ( <p>Loading ...</p> ) : ( <List list={stories.data} onRemoveItem={handleRemoveStory} /> )}
    </StyledContainer>
  )
}

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
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
    <StyledButtonLarge type="submit" disabled={!searchTerm}>
      Submit
    </StyledButtonLarge>
  </StyledSearchForm>
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
      <StyledLabel htmlFor={id} className="label">{children}</StyledLabel>
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
  <StyledItem key={item.objectID}>
    <StyledColumn width='40%'>
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width='30%'>{item.author}</StyledColumn>
    <StyledColumn width='10%'>{item.num_comments}</StyledColumn>
    <StyledColumn width='10%'>{item.points}</StyledColumn>
    <StyledColumn width= '30%'>
      <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
  )
}

export default App;