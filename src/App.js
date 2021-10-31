import React from 'react';
import './App.css';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem('value', value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {

  const stories = [
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const handleSearch = event => {
    setSearchTerm(event.target.value);
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
      >
        <strong>Search: </strong>
      </InputWithLlabel>

    <hr />

    <List list={searchedStories} />
    </div>
  )
}

const InputWithLlabel = ({ id, value, type, onInputChange, children }) => {

  return (
    <>
      <label htmlFor="search">{children}</label>
      <input 
        onChange={onInputChange} 
        id={id}
        type={type}
        value={value}
      />
    </>
  )
}

const List = props => {
  return props.list.map(({objectID, ...item}) => (
    <Item 
      key={objectID}
      {...item}
    />
    ))
  }

const Item = ({ title, url, author, num_comments, points }) => {
  return (
  <div>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </div>
  )
}

export default App;