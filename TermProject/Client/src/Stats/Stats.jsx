import { Link } from 'react-router-dom';
import './Stats.css';

export const StatsHome = () => {
  const sports = [
    {
      name: 'Football',
      leagues: [
        { name: 'NFL', link: '/stats/football/nfl' },
        { name: 'College Football', link: '/stats/football/college' },
      ],
    },
    {
      name: 'Basketball',
      leagues: [
        { name: 'NBA', link: '/stats/basketball/nba' },
        { name: 'College Basketball', link: '/stats/basketball/college' },
      ],
    },
    {
      name: 'Baseball',
      leagues: [
        { name: 'MLB', link: '/stats/baseball/mlb' },
        { name: 'Minor League', link: '/stats/baseball/minor' },
      ],
    },
  ];

  return (
    <div className="stats-home">
      <h1>Stats Home</h1>
      {sports.map((sport) => (
        <div key={sport.name} className="sport-section">
          <h2><Link to={`/stats/${sport.name.toLowerCase()}`}>{sport.name}</Link></h2>
          <ul className="league-list">
            {sport.leagues.map((league) => (
              <li key={league.name}>
                <Link to={league.link}>{league.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export const StatsFootball = () => {
  const leagues = [
    { name: 'NFL', link: '/stats/football/nfl' },
    { name: 'College Football', link: '/stats/football/college' },
  ];

  return (
    <div className="stats-football">
      <h1>Football Stats</h1>
      <ul className="league-list">
        {leagues.map((league) => (
          <li key={league.name}>
            <Link to={league.link}>{league.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
