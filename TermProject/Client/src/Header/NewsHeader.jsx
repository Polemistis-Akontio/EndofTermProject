import './Header.css';

const News = () => {
  const newsSources = [
    { name: 'ESPN', sports: ['NFL', 'NBA', 'MLB'] },
    { name: 'CBS Sports', sports: ['NHL', 'Golf', 'Tennis'] },
    { name: 'NBC Sports', sports: ['Soccer', 'Olympics', 'MLB'] },
  ];

  return (
    <div className="dropdown news-dropdown">
      <ul className="dropdown-list">
        {newsSources.map((source) => (
          <li key={source.name} className="dropdown-item">
            <a href={`/news/${source.name.toLowerCase()}`} className="dropdown-link">
              {source.name}
            </a>
            <div className="league-dropdown">
              {source.sports.map((sport) => (
                <a
                  key={sport}
                  href={`/news/${source.name.toLowerCase()}/${sport.toLowerCase()}`}
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

export default News;
