import './Header.css';

const Stats = () => {
  const sportsData = [
    { category: 'Football', leagues: ['NFL', 'CFL', 'NCAA'] },
    { category: 'Basketball', leagues: ['NBA', 'WNBA', 'NCAA'] },
    { category: 'Soccer', leagues: ['Premier League', 'La Liga', 'Bundesliga'] },
  ];

  return (
    <div className="dropdown stats-dropdown">
      <ul className="dropdown-list">
        {sportsData.map((sport) => (
          <li key={sport.category} className="dropdown-item">
            <a href={`/stats/${sport.category.toLowerCase()}`} className="dropdown-link">
              {sport.category}
            </a>
            <div className="league-dropdown">
              {sport.leagues.map((league) => (
                <a
                  key={league}
                  href={`/stats/${sport.category.toLowerCase()}/${league.toLowerCase()}`}
                  className="league-link"
                >
                  {league}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stats;
