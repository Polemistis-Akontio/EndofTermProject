import './Header.css';

const Betting = () => {
  const sportsbooks = [
    { name: 'DraftKings', sports: ['NFL', 'NBA', 'MLB'] },
    { name: 'FanDuel', sports: ['NFL', 'NBA', 'MLB'] },
    { name: 'BetMGM', sports: ['NFL', 'Soccer', 'Tennis'] },
    { name: 'Caesars Sportsbook', sports: ['NHL', 'MLB', 'Soccer'] },
  ];

  return (
    <div className="dropdown betting-dropdown">
      <ul className="dropdown-list">
        {sportsbooks.map((book) => (
          <li key={book.name} className="dropdown-item">
            <a href={`/betting/${book.name.toLowerCase()}`} className="dropdown-link">
              {book.name}
            </a>
            <div className="league-dropdown">
              {book.sports.map((sport) => (
                <a
                  key={sport}
                  href={`/betting/${book.name.toLowerCase()}/${sport.toLowerCase()}`}
                  className="league-link"
                >
                  {sport}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Betting;
