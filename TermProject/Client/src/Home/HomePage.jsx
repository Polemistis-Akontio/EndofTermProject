import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1 className="homepage-title">Sports Insights & Betting Hub</h1>
        <p className="homepage-subtitle">Your go-to platform for real-time stats, analysis, and odds.</p>
      </header>

      <main className="homepage-main">
        <section className="featured-section">
          <h2 className="section-title">Featured Games</h2>
          <div className="featured-games">
            <div className="game-card">
              <h3>Team A vs Team B</h3>
              <p>Date: 2024-12-10</p>
              <p>Time: 7:00 PM EST</p>
              <button className="view-details-btn">View Details</button>
            </div>
            <div className="game-card">
              <h3>Team C vs Team D</h3>
              <p>Date: 2024-12-11</p>
              <p>Time: 9:00 PM EST</p>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <h2 className="section-title">Latest Statistics</h2>
          <div className="stats-grid">
            <div className="stats-card">
              <h3>Player Performance</h3>
              <p>Top Scorer: Player X</p>
              <p>Yards: 245</p>
            </div>
            <div className="stats-card">
              <h3>Team Rankings</h3>
              <p>#1: Team Y</p>
              <p>Win Rate: 85%</p>
            </div>
            <div className="stats-card">
              <h3>Game Highlights</h3>
              <p>Most Thrilling Match: Game Z</p>
              <p>Score: 34-30</p>
            </div>
          </div>
        </section>

        <section className="odds-section">
          <h2 className="section-title">Top Betting Odds</h2>
          <div className="odds-grid">
            <div className="odds-card">
              <h3>Team A vs Team B</h3>
              <p>Odds: 1.5 - 2.8</p>
            </div>
            <div className="odds-card">
              <h3>Team C vs Team D</h3>
              <p>Odds: 1.9 - 2.1</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;