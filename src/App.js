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

  const [searchTerm, setSearchTerm] = React.useState('');

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

    <Search onSearch={handleSearch} />

    <hr />

    <List list={searchedStories} />
    </div>
  )
}

const Search = props => {

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input 
        onChange={props.onSearch} 
        id="search"
        type="text" 
      />
    </div>
  )
}


const List = props => {
  return props.list.map(elt => (
    <div key={elt.objectID}>
    <span>
    <a href={elt.url}>{elt.title}</a>
    </span>
    <span>{elt.author}</span>
    <span>{elt.num_comments}</span>
    <span>{elt.points}</span>
    </div>
    ))
  }

export default App;