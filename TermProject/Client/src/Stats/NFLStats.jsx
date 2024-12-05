import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './NFLStats.css';

export const NFLStats = () => {
  const navigate = useNavigate();

  return (
    <div className="football-stats">
      <h1>Welcome to NFL Stats</h1>
      <p>Select a category to view specific NFL statistics:</p>
      <div className="stat-categories">
        <button onClick={() => navigate('/stats/football/nfl/teams')}>Team Stats</button>
        <button onClick={() => navigate('/stats/football/nfl/players')}>Player Stats</button>
        <button onClick={() => navigate('/stats/football/nfl/games')}>Game Stats</button>
        <button onClick={() => navigate('/stats/football/nfl/create-custom-stats')}>Create Custom Stats</button>
        <button onClick={() => navigate('/stats/football/nfl/view-custom-stats')}>View Custom Stats</button>
      </div>
    </div>
  );
};

export const NFLTeamDetailStats = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the team ID from the URL
  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [year, setYear] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Manage the current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  const availableCategories = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Example category IDs
  const availableYears = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]; // Example years

  const handleCategoryChange = (e) => setCategoryId(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const handleBackClick = () => {
    navigate(-1);
  }

  // Move fetchTeamDetails outside of useEffect to prevent the dependency warning
  const fetchTeamDetails = async (page) => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `http://localhost:3000/api/stats/teams/${id}?category_id=${categoryId}&year=${year}&page=${page}`,
        { method: 'GET', headers: headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch team details');
      }

      const data = await response.json();
      setTeamDetails(data);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryId && year) {
      setIsFormSubmitted(true);
    } else {
      setError('Please select both Category and Year.');
    }
  };

  useEffect(() => {
    if (isFormSubmitted) {
      fetchTeamDetails(currentPage);
    }
  }, [id, categoryId, year, isFormSubmitted, currentPage]);

  if (loading && isFormSubmitted) {
    return <div>Loading team details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { teamStats } = teamDetails || {};

  return (
    <div className="team-details">
      <h1>Detailed Stats by Year and Category</h1>
      {!isFormSubmitted ? (
        <div className="filter-selection">
          <form onSubmit={handleSubmit}>
            <label>
              Category:
              <select value={categoryId} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    Category {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Year:
              <select value={year} onChange={handleYearChange}>
                <option value="">Select Year</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        teamStats && teamStats.length > 0 ? (
          <div>
            <h2 onClick={handleBackClick} style={{ cursor: 'pointer', color: 'blue' }}>Go Back?</h2>
            <div className="team-stats">
              <h3>Team Stats</h3>
              {teamStats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <p><strong>{stat.display_name} ({stat.short_display_name}):</strong> {stat.display_value}</p>
                  <p><strong>Description:</strong> {stat.description}</p>
                  <p><strong>Rank:</strong> {stat.rank_display_value}</p>
                  <p><strong>Per Game Value:</strong> {stat.per_game_display_value}</p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div>No team details found</div>
        )
      )}
    </div>
  );
};

export const NFLTeamStats = () => {
  const location = useLocation();

  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 results per page

  // Fetch NFL teams data with results per page
  const fetchNFLStats = async (page, itemsPerPage) => {
    try {
      console.log(itemsPerPage);
      setLoading(true); // Start loading
      const authToken = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`http://localhost:3000/api/stats/teams?page=${page}&itemsPerPage=${itemsPerPage}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Destructure pagination and teams from API response
      const { pagination, teams } = data;

      // Update statsData and pagination
      setStatsData((prevData) => {
        const newTeams = teams.filter((team) =>
          !prevData.some((existingTeam) => existingTeam.id === team.id)
        );
        return [...prevData, ...newTeams];
      });

      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch data on initial load or when the path changes
  useEffect(() => {
    if (location.pathname.includes('teams') && statsData.length === 0) {
      fetchNFLStats(1, itemsPerPage); // Fetch the first page with selected results per page
    }
  }, [location.pathname, statsData, itemsPerPage]);

  // Load next page of data
  const loadNextPage = () => {
    if (!loading && currentPage < totalPages) {
      fetchNFLStats(currentPage + 1, itemsPerPage); // Fetch the next page with selected results per page
    }
  };

  // Handle change of results per page
  const handleResultsPerPageChange = (e) => {
    const newResultsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newResultsPerPage);
    setStatsData([]); // Clear existing data to reload from the first page
    fetchNFLStats(1, newResultsPerPage); // Fetch the first page with the new results per page
    setCurrentPage(1); // Reset to page 1 when results per page changes
  };

  // Show loading state while fetching data
  if (loading) {
    return <div>Loading NFL Stats...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="football-stats">
      <h1>NFL Teams</h1>

      {/* Results Per Page Dropdown */}
      <div className="results-per-page">
        <label htmlFor="resultsPerPage">Results Per Page: </label>
        <select id="resultsPerPage" value={itemsPerPage} onChange={handleResultsPerPageChange}>
          <option value={10}>10</option>
          <option value={16}>16</option>
          <option value={32}>32</option>
        </select>
      </div>

      <div className="teams-container">
    {statsData.length > 0 ? (
      <ul className="teams-list">
        {statsData.map((team) => (
          <li key={`${team.id}-${team.abbreviation}`} className="team-item">
            <div className="team-info">
              <h3>
                <Link to={`/stats/football/nfl/teams/${team.id}`}>{team.name} ({team.abbreviation})</Link>
              </h3>
              <p>{team.location}</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No teams data available</p>
    )}
  </div>

      {/* Pagination Controls */}
      {currentPage < totalPages && (
        <button className="load-more" onClick={loadNextPage}>
          Load More Teams
        </button>
      )}
    </div>
  );
};

export const NFLPlayerStats = () => {
  // Logic for fetching and displaying player stats
  return <div>Player Stats Component</div>;
};

export const NFLGameStats = () => {
  // Logic for fetching and displaying game stats
  return <div>Game Stats Component</div>;
};

export const CreateCustomStats = () => {
  const [team, setTeam] = useState({ name: '', abbreviation: '', location: '', display_name: '' });
  const [player, setPlayer] = useState({ first_name: '', last_name: '', full_name: '', team_id: '' });
  const [statsCategory, setStatsCategory] = useState({ name: '', description: '' });
  const [customStat, setCustomStat] = useState({ player_id: '', category_id: '', game_date: '', stat_description: '' });
  const [compositeStat, setCompositeStat] = useState({ player_id: '', stat_group: '', stat_value: '' });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Retrieve authToken from localStorage
  const authToken = localStorage.getItem('authToken');

  // Validate all data before sending it to the backend
  const validateForm = () => {
    const newErrors = [];

    // Team validation
    if (
      (team.name || team.abbreviation || team.location || team.display_name) &&
      !(team.name && team.abbreviation && team.location)
    ) {
      newErrors.push('Please fill out all team fields if you are adding a team.');
    }

    // Player validation
    if (
      (player.first_name || player.last_name || player.full_name || player.team_id) &&
      !(player.first_name && player.last_name && player.full_name && player.team_id)
    ) {
      newErrors.push('Please fill out all player fields if you are adding a player.');
    }

    // Stats Category validation
    if (
      (statsCategory.name || statsCategory.description) &&
      !(statsCategory.name && statsCategory.description)
    ) {
      newErrors.push('Please fill out all stats category fields if you are adding a stats category.');
    }

    // Custom Stat validation
    if (
      (customStat.player_id || customStat.category_id || customStat.game_date || customStat.stat_description) &&
      !(customStat.player_id && customStat.category_id && customStat.game_date && customStat.stat_description)
    ) {
      newErrors.push('Please fill out all custom stat fields if you are adding a custom stat.');
    }

    // Composite Stat validation
    if (
      (compositeStat.player_id || compositeStat.stat_group || compositeStat.stat_value) &&
      !(compositeStat.player_id && compositeStat.stat_group && compositeStat.stat_value)
    ) {
      newErrors.push('Please fill out all composite stat fields if you are adding a composite stat.');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/customStats',
        {
          team,
          player,
          statsCategory,
          customStat,
          compositeStat,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      if (response.data.success) {
        setSuccessMessage('Stats added successfully!');
        setErrors([]);
        // Optionally, reset form fields after success
        setTeam({ name: '', abbreviation: '', location: '', display_name: '' });
        setPlayer({ first_name: '', last_name: '', full_name: '', team_id: '' });
        setStatsCategory({ name: '', description: '' });
        setCustomStat({ player_id: '', category_id: '', game_date: '', stat_description: '' });
        setCompositeStat({ player_id: '', stat_group: '', stat_value: '' });

        showPopup('Data submitted successfully!');
      } else {
        showPopup('Failed to submit data. Please try again.');
      }
    } catch (error) {
      setErrors([error.message || 'An error occurred while submitting the stats.']);
      showPopup('An error occurred while submitting the data.');
    }
  };

  // Show popup with a message
  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000); // Hide the popup after 3 seconds
  };

  return (
    <div>
      <h1>Submit Custom Stats</h1>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Team Information</legend>
          <input
            type="text"
            placeholder="Team Name"
            value={team.name}
            onChange={(e) => setTeam({ ...team, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Abbreviation"
            value={team.abbreviation}
            onChange={(e) => setTeam({ ...team, abbreviation: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={team.location}
            onChange={(e) => setTeam({ ...team, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Display Name"
            value={team.display_name}
            onChange={(e) => setTeam({ ...team, display_name: e.target.value })}
          />
        </fieldset>

        <fieldset>
          <legend>Player Information</legend>
          <input
            type="text"
            placeholder="First Name"
            value={player.first_name}
            onChange={(e) => setPlayer({ ...player, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={player.last_name}
            onChange={(e) => setPlayer({ ...player, last_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={player.full_name}
            onChange={(e) => setPlayer({ ...player, full_name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Team ID"
            value={player.team_id}
            onChange={(e) => setPlayer({ ...player, team_id: e.target.value })}
          />
        </fieldset>

        <fieldset>
          <legend>Stats Category Information</legend>
          <input
            type="text"
            placeholder="Category Name"
            value={statsCategory.name}
            onChange={(e) => setStatsCategory({ ...statsCategory, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category Description"
            value={statsCategory.description}
            onChange={(e) => setStatsCategory({ ...statsCategory, description: e.target.value })}
          />
        </fieldset>

        <fieldset>
          <legend>Custom Stat Information</legend>
          <input
            type="number"
            placeholder="Player ID"
            value={customStat.player_id}
            onChange={(e) => setCustomStat({ ...customStat, player_id: e.target.value })}
          />
          <input
            type="number"
            placeholder="Category ID"
            value={customStat.category_id}
            onChange={(e) => setCustomStat({ ...customStat, category_id: e.target.value })}
          />
          <input
            type="date"
            placeholder="Game Date"
            value={customStat.game_date}
            onChange={(e) => setCustomStat({ ...customStat, game_date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Stat Description"
            value={customStat.stat_description}
            onChange={(e) => setCustomStat({ ...customStat, stat_description: e.target.value })}
          />
        </fieldset>

        <fieldset>
          <legend>Composite Stat Information</legend>
          <input
            type="number"
            placeholder="Player ID"
            value={compositeStat.player_id}
            onChange={(e) => setCompositeStat({ ...compositeStat, player_id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Stat Group"
            value={compositeStat.stat_group}
            onChange={(e) => setCompositeStat({ ...compositeStat, stat_group: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stat Value"
            value={compositeStat.stat_value}
            onChange={(e) => setCompositeStat({ ...compositeStat, stat_value: e.target.value })}
          />
        </fieldset>

        <button type="submit">Submit Stats</button>
      </form>

      {popupVisible && (
        <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'darkblue', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export const ViewCustomStats = () => {
  const [customStats, setCustomStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomStats = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/customStats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch custom stats');
        }

        const data = await response.json();
        console.log(data);
        setCustomStats(data.data); // Assuming data is under the 'data' field
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading custom stats...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="view-custom-stats">
      <h2 className="title">View Custom Stats</h2>
      {customStats.length > 0 ? (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Team Location</th>
              <th>Team Display Name</th>
              <th>Player Name</th>
              <th>Player Full Name</th>
              <th>Game Date</th>
              <th>Stats Category</th>
              <th>Custom Stat Description</th>
              <th>Composite Stat Group</th>
              <th>Composite Stat Value</th>
            </tr>
          </thead>
          <tbody>
            {customStats.map((stat, index) => (
              <tr key={index}>
                <td>{stat.team_name}</td>
                <td>{stat.location}</td>
                <td>{stat.team_display_name}</td>
                <td>{`${stat.first_name} ${stat.last_name}`}</td>
                <td>{stat.full_name}</td>
                <td>{stat.game_date}</td>
                <td>{stat.category_name}</td>
                <td>{stat.custom_stat_description}</td>
                <td>{stat.stat_group}</td>
                <td>{stat.stat_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data">No custom stats available</div>
      )}
    </div>
  );
};