import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import './Betting.css'


export const ViewOddsByGame = () => {
  const { id } = useParams(); // Extract the game ID from the URL
  const [oddsData, setOddsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch(`https://v1.american-football.api-sports.io/odds?game=${id}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'v1.american-football.api-sports.io',
            'x-rapidapi-key': 'fdae54ec4391e78a3895a712f8a80a5d', // Replace with your actual API key
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setOddsData(data.response); // Assuming response contains an array
        console.log(data); // Log the entire response to the console
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading odds...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="view-odds">
      <h2 className="title">View Odds for Game {id}</h2>

      {oddsData.length > 0 ? (
        <ul className="odds-list">
          {oddsData.map((game, gameIndex) => (
            <li key={gameIndex} className="game-item">
              <h3 className="game-label">Game Details</h3>
              <p><strong>Game ID:</strong> {game.game.id}</p>
              <p><strong>League:</strong> {game.league.name}</p>
              <p><strong>Country:</strong> {game.country.name}</p>
              <p><strong>Update Time:</strong> {game.update}</p>
              <h3>Bookmakers</h3>
              <div className="bookmakers-section">
                {game.bookmakers.map((bookmaker, bookmakerIndex) => (
                  <div key={bookmakerIndex} className="bookmaker">
                    <h4><strong>Bookmaker Name:</strong> {bookmaker.name}</h4>
                    <p><strong>Last Update:</strong> {bookmaker.last_update}</p>

                    <div className="bets-section">
                      <h5>Bets</h5>
                      {bookmaker.bets.map((bet, betIndex) => (
                        <div key={betIndex} className="bet">
                          <h6><strong>Bet Name:</strong> {bet.name}</h6>

                          <ul className="values-list">
                            {bet.values.map((value, valueIndex) => (
                              <li key={valueIndex} className="value-item">
                                <p><strong>Odd:</strong> {value.odd}</p>
                                <p><strong>Value:</strong> {value.value}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No odds data available</p>
      )}
    </div>
  );
};

export const ViewGamesByDate = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("https://v1.american-football.api-sports.io/games?date=2024-12-08", {
          method: "GET",
          headers: {
            "x-rapidapi-host": "v1.american-football.api-sports.io",
            "x-rapidapi-key": "fdae54ec4391e78a3895a712f8a80a5d", // Replace with your actual API key
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }

        const data = await response.json();
        console.log(data);
        setGames(data.response); // Assuming response contains an array of games
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <div className="loading">Loading games...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="view-games">
      <h2 className="title">Games on 12/08/2024</h2>

      {games.length > 0 ? (
        <ul className="games-list">
          {games.map((game) => {
            const homeTeam = game.teams.home?.name || "Home Team Unknown";
            const awayTeam = game.teams.away?.name || "Away Team Unknown";

            return (
              <li key={game.id || Math.random()} className="game-item">
                <Link to={`/betting/${game.game.id}`}>
                  {homeTeam} vs {awayTeam}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="no-data">No games available on this date</div>
      )}
    </div>
  );
};
