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

  const handleSearch = event => {
    console.log(event.target.value);
  }

  return (
    <div className="App">
    <h1>Hello</h1>

    <Search onSearch={handleSearch} />

    <hr />

    <List list={stories} />
    </div>
  )
}

const Search = props => {

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = event => {
    setSearchTerm(event.target.value);
    props.onSearch(event);
  };
  
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input 
        onChange={handleChange} 
        id="search"
        type="text" 
      />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
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