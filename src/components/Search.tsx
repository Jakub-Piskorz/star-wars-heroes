import {
  useState,
  useRef,
  ChangeEventHandler,
  ChangeEvent,
  useCallback,
  useEffect,
} from 'react';
import './search.scss';
import CharacterCard from './Card';
import debounce from 'lodash.debounce';
import { BeatLoader } from 'react-spinners';
import { SearchResult, Result } from '../types/search-results';
import { Homeworld } from '../types/homeworld';

interface SimpleHomeworld {
  name: string;
  population: number | string;
}

interface SimpleHomeworlds {
  [key: string]: SimpleHomeworld;
}

const Search = () => {
  const [search, setSearch] = useState<string>('');
  const [loadingAnimation, setLoadingAnimation] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Result[] | null>([]);
  const [homeworlds, setHomeworlds] = useState<SimpleHomeworlds>({});

  const fetchData = useCallback(async (character: string) => {
    // Don't search empty string
    if (!character.length) {
      setSearchResults([]);
      return;
    }
    // Fetch data and send it to "searchResults"
    const data = await fetch(
      `https://swapi.dev/api/people/?search=${character}`,
      {
        method: 'GET',
      }
    );
    if (!data.ok) {
      // TODO: Show some error component
      console.error(data.status);
      console.error(data.statusText);
      setSearchResults(null);
      return;
    }
    const dataJson: SearchResult = await data.json();
    setSearchResults(dataJson.results.length ? dataJson.results : null);
  }, []);

  // Fetch only, if user stopped typing for 0.3 second.
  const debouncedSearch = useRef(
    debounce(async (character) => {
      await fetchData(character);
      setLoadingAnimation(false);
    }, 300)
  ).current;

  // Search input changes initiate data fetching
  useEffect(() => {
    setLoadingAnimation(true);
    debouncedSearch(search);
  }, [search]);

  // Take fetched characters and assign homeworlds to them.
  useEffect(() => {
    if (!searchResults) return;
    // Find characters, which homeworlds aren't cached yet.
    const missingHomeworldCharacters = searchResults.filter((result: any) => {
      return !homeworlds.hasOwnProperty(result.homeworld);
    });
    // Create an array of missing homeworlds URLs.
    const missingHomeworlds: string[] = [];
    missingHomeworldCharacters.forEach((character: any) => {
      if (
        missingHomeworlds.findIndex(
          (missingHomeworld) => character.homeworld === missingHomeworld
        ) === -1
      ) {
        missingHomeworlds.push(character.homeworld);
      }
    });
    // Fetch all missing homeworlds and pass the data to homeworlds object
    missingHomeworlds.forEach((missingHomeworld) =>
      fetch(missingHomeworld)
        .then((data) => data.ok && data.json())
        .then((dataJson: Homeworld) => {
          // Add entry to homeworlds object
          setHomeworlds((prev) => {
            return {
              ...prev,
              [missingHomeworld]: {
                name: dataJson.name,
                population: dataJson.population,
              },
            };
          });
        })
    );
  }, [searchResults]);

  // Clean-up after search is unmounted.
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Force re-render on every homeworlds change
  useEffect(() => {
    console.log('HOMEWOLRDS: ', homeworlds);
  }, [homeworlds]);

  const getCharacterUrl = useCallback((url: string) => {
    let params = url.split('/');
    return `character/${params[params.length - 2]}`;
  }, []);

  return (
    <section className="search-box">
      <h1>Search your favorite character</h1>
      {/* Let's not use form, since it's so simple (not event submit button) */}
      <input
        className="search-box__input"
        type="text"
        placeholder="Luke Skywalker"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="search-box__results">
        {loadingAnimation && (
          <div>
            <BeatLoader color="white" />
          </div>
        )}
        {searchResults &&
          !loadingAnimation &&
          searchResults.map((result, i) => (
            <CharacterCard
              key={i}
              name={result.name}
              // if cached homeworld is found, pass its name
              text={
                (homeworlds.hasOwnProperty(result.homeworld) &&
                  `Homeworld: ${
                    homeworlds[result.homeworld].name
                  }, population: ${homeworlds[result.homeworld].population}`) ||
                ``
              }
              // if cached homeworld is found, pass its population
              url={getCharacterUrl(result.url)}
            />
          ))}
      </div>
      {!searchResults && !loadingAnimation && <div>No character found</div>}
    </section>
  );
};

// { "https://swapi.dev/api/planets/10/": {name, population}]}

export default Search;
