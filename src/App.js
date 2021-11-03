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
    fill: #ffffff;
    stroke: #ffffff;
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

const getSumComments = stories => {
  console.log('C');
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

  const sumComments = React.useMemo(() => getSumComments(stories), [
    stories,
  ]);

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
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  }

  return (
    <StyledContainer>
    <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments</StyledHeadlinePrimary>

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

const List = React.memo(({list, onRemoveItem}) => {
  return list.map(item => (
    <Item 
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
    ))
  })

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
      <Icon />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
  )
}

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      x="0"
      y="0"
      version="1.1"
      viewBox="0 0 755 607"
      xmlSpace="preserve"
    >
      <path
        fill="#21b04b"
        d="M225.38 585.25L198.61 550l-43.889-50.323-50.221-40.088-56.75-35.997L23 410.595 38.5 336 54 258.835 55.51 256l20.25 9.424 18.74 9.423 29.11 29.327 29.111 29.326 13.215 21.25L179.871 376l97.457-102L398.5 159.519l89-69.957 114.973-79.37L659.544 81.5l64.611 81.838 8.814 12-62.25 36.092-62.219 34.93L543 292.32 378.767 420.175 334.033 460.5l-37.6 42.5-52.767 63.226-16.175 20.75z"
      ></path>
    </svg>
  );
}

export default App;