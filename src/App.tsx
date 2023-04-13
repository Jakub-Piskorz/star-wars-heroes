import logo from './assets/logo.png';
import './App.scss';
import SearchPage from './pages/SearchPage';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
} from 'react-router-dom';
import CharacterPage from './pages/CharacterPage';

function App() {
  const router = createBrowserRouter(
    [
      { path: '/', element: <SearchPage /> },
      { path: '/character/:id', element: <CharacterPage /> },
    ],
    {
      basename: '/star-wars-heroes',
    }
  );

  return (
    <div className="App">
      <div className="header">
        <a href="/star-wars-heroes">
          <div className="logo">
            <img src={logo} className="logo" alt="Logo" />
          </div>
        </a>
      </div>
      <div className="main">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
