import { useEffect, useMemo, useState } from 'react';
import './CharacterPage.scss';
import { useParams } from 'react-router-dom';
import { Result } from '../types/search-results';
import { Film } from '../types/films';
import Card from '../components/Card';

interface SimpleFilm {
  title: string;
  releaseDate: Date;
  openingCrawl: string;
}

interface SimpleFilms {
  [key: string]: SimpleFilm;
}

const CharacterPage = () => {
  const params = useParams();
  const [character, setCharacter] = useState<Result | null>(null);
  const [films, setFilms] = useState<SimpleFilms>({});

  useEffect(() => {
    const getData = async () => {
      setFilms({});
      // Get character data
      const data = await fetch(`https://swapi.dev/api/people/${params.id}`);
      if (!data.ok) {
        // TODO: Handle errors better
        console.error(data.status);
        console.error(data.statusText);
        return;
      }
      const dataJson: Result = await data.json();
      setCharacter(dataJson);
      // Get all films for that character
      dataJson.films?.forEach((filmURL) => {
        if (!films.hasOwnProperty(filmURL)) {
          fetch(filmURL)
            .then((data) => data.ok && data.json())
            .then((filmJson: Film) => {
              // Add fetched film data to films object
              setFilms((prev) => {
                return {
                  ...prev,
                  [filmURL]: {
                    title: filmJson.title,
                    releaseDate: filmJson.release_date,
                    openingCrawl: filmJson.opening_crawl,
                  },
                };
              });
            });
        }
      });
    };
    getData();
    // Clear films on unmount
    return setFilms({});
  }, []);

  return (
    <div className="character-section">
      {character && (
        <div>
          <h1>{character.name}</h1>
          <h2>Found in films:</h2>
          {
            <div className="character-section__films">
              {Object.keys(films).map((filmURL, i) => (
                <Card
                  key={i}
                  name={films[filmURL].title}
                  text={`Release date: ${
                    films[filmURL].releaseDate
                  }, opening crawl: ${films[filmURL].openingCrawl.slice(
                    0,
                    130
                  )}...`}
                />
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default CharacterPage;
