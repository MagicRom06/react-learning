import logo from './logo.svg';
import './App.css';

function App() {

  const welcome = (title) => {
    return title
  };

  return (
    <div className="App">
      <h1>Hello {welcome('React')}</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
