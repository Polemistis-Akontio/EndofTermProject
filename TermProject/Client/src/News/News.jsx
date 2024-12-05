import { useEffect, useState } from 'react';
import './News.css'

const NFLNews = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=50');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        setNewsArticles(data.articles || []); // Ensure we're working with the correct array of articles
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error('Fetch error:', error); // Log error details
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="news-container">
      <h2>Latest NFL News</h2>
      <div className="news-list">
        {newsArticles.map((article, index) => (
          <div key={index} className="news-item">
            <h3>{article.headline}</h3>
            <p>{article.description}</p>
            
            {/* Display image if available */}
            {article.images && article.images.length > 0 && (
              <div className="news-image">
                <img 
                  src={article.images[0].url} 
                  alt={article.images[0].alt || 'Image'} 
                  width="100%" 
                  height="auto" 
                />
              </div>
            )}
            
            <p className="last-modified">Published: {new Date(article.published).toLocaleString()}</p>
            <a href={article.links.web.href} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFLNews;
