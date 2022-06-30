import axios from "axios";
import { useEffect, useState } from "react";
import icon from "./assets/shuffle.svg";

let baseURL = import.meta.env.VITE_BASE_URL;
let APIKEY = import.meta.env.VITE_API_KEY;
let language = import.meta.env.VITE_LANGUAGE;
let baseIMG = import.meta.env.VITE_IMG_URL;

async function getMovie() {
  let randomID = Math.floor(Math.random() * 90000) + 1000;
  let url = `${baseURL}${randomID}?api_key=${APIKEY}&${language}`;

  const result = await axios.get(url).catch(() => {
    return { error: true };
  });
  return result;
}

function converter(minutos) {
  const horas = Math.floor(minutos / 60);
  const min = minutos % 60;
  const textoHoras = `00${horas}h`.slice(-2);
  const textoMinutos = `00${min}m`.slice(-3);

  return `${textoHoras}:${textoMinutos}`;
}

function App() {
  const [movie, setMovie] = useState(false);
  const [loading, setLoading] = useState(false)
  const [screen, setScreen] = useState(0)


  async function renderMovie() {
    let result = await getMovie();
    setLoading(true)

    if (result.error) {
      renderMovie();
      console.clear();
    } else if (result.data.adult == true || result.data.overview == "") {
      renderMovie();
      console.clear();
    } else {
      const movieMount = {
        poster_path: result.data.poster_path,
        backdrop_path: result.data.backdrop_path,
        runtime: converter(result.data.runtime),
        release_date: result.data.release_date.split("-").reverse().join("/"),
        overview: result.data.overview,
        original_title: result.data.original_title,
        title: result.data.title,
        genre: [],
      };

      result.data.genres.map((genre) => movieMount.genre.push(genre.name));

      setMovie(movieMount);
      setLoading(false)
    }
  }

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setScreen(width)
  };

  return (
    <div className={`App container ${movie ? '' : 'init'} ${loading ? 'loading' : ''}`}>
      <img src={icon} alt="icon" className="logo" />

      <h1 className="title">
        Não sabe o que assistir?
      </h1>

      {movie && (
        <>
          <div
            className="preview"
            style={movie.overview.length > 320 && screen > 640 ? { flexDirection: 'column', alignItems: 'center' } : null}
          >
            <img
              className={`${!movie.backdrop_path ? 'hidden' : null}`}
              src={`${baseIMG}${movie.backdrop_path}`}
              alt="front-cover"
            />
            <span
              className="description"
              style={!movie.backdrop_path || (movie.overview.length > 320 && screen > 640) ? { width: '600px' } : null}>{movie.overview}</span>
          </div>

          <div className="info">
            <span className="info__movie">{movie.title}</span>
            <div className="info__wrapper">
              <img
                src={`${baseIMG}${movie.poster_path}`}
                alt="movie poster"
                className={`${!movie.poster_path ? 'hidden' : null}`}
              />
              <div className="info__details">
                <div className="info__date">
                  <span>Lançamento</span>
                  <p>{movie.release_date}</p>
                </div>
                <div className={`info__runtime ${movie.runtime == "0h:00m" ? 'hidden' : null}`}>
                  <span>Duração</span>
                  <p>{movie.runtime}</p>
                </div>
                {movie.genre !== "" ? (
                  <div className="info__genre">
                    <span>Genero</span>
                    <p>{movie.genre.join(", ")}</p>
                  </div>
                ) : null}

              </div>
            </div>
          </div>
        </>
      )}

      <button onClick={renderMovie} className="btn" disabled={loading ? true : false} >
        <img src={icon} alt="icon" />
        <span>Encontrar filme</span>
      </button>

      <p className="note">Clique em <strong>"Encontrar filme"</strong> que traremos informações
        de algum filme para você assistir hoje.</p>

      <footer className="footer">Feito com 💜 por jonescesarn</footer>
    </div>
  );
}

export default App;
