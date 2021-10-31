import React from 'react';
import './App.css';


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

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || 'React'
  );

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

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

    <Search search={searchTerm} onSearch={handleSearch} />

    <hr />

    <List list={searchedStories} />
    </div>
  )
}

const Search = ({ search, onSearch }) => {

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input 
        onChange={onSearch} 
        id="search"
        type="text" 
        value={search}
      />
    </div>
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