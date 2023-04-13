import logo from './assets/logo.png';
import './App.scss';
import Search from './components/Search';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
} from 'react-router-dom';
import CharacterPage from './pages/CharacterPage';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Search /> },
    { path: '/character/:id', element: <CharacterPage /> },
  ]);

  return (
    <div className="App">
      <div className="header">
        <a href="/">
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
