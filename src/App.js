import React from 'react';
import './App.css';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
]

const getAsyncStories = () => 
  new Promise(resolve => 
    setTimeout(
    () => resolve({ data: { stories: initialStories } }),
    2000
  )
)

const App = () => {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories().then((result) => {
      setStories(result.data.stories);
      setIsLoading(false)
    }).catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = item => {
    const newStories = stories.filter(story => (
      item.objectID !== story.objectID
    ));
    setStories(newStories);
  }

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const handleClick = event => {
    if (isClicked) {
      setIsClicked(false);
    }
    else {
      setIsClicked(true);
    }
  }

  const searchedStories = stories.filter(story => {
    return story.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  })

  return (
    <div className="App">
    <h1>Hello</h1>

    <InputWithLlabel 
      id="search"
      label="Search"
      value={searchTerm}
      type="text"
      onInputChange={handleSearch}
      isFocused
      >
        <strong>Search: </strong>
      </InputWithLlabel>

    <hr />
    {isError && <p>Something went wrong ...</p>}
    {isLoading ? ( <p>Loading ...</p> ) : ( <List list={searchedStories} onRemoveItem={handleRemoveStory} /> )}
    <button type="button" onClick={handleClick}>Click me</button>
    {isClicked && <p>Hello there</p>}
    </div>
  )
}

const InputWithLlabel = ({ id, value, type, onInputChange, children, isFocused }) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor="search">{children}</label>
      <input 
        ref={inputRef}
        onChange={onInputChange} 
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
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
  <div key={item.objectID}>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
  )
}

export default App;