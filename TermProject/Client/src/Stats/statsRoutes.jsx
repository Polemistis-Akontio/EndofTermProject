import { StatsHome, StatsFootball } from './Stats';
import { NFLStats, NFLTeamStats, NFLPlayerStats, NFLGameStats, ViewCustomStats, CreateCustomStats, NFLTeamDetailStats } from './NFLStats';
//import BasketballStats from './BasketballStats';
//import BaseballStats from './BaseballStats';
//import HockeyStats from './HockeyStats';
const statsRoutes = [
  {
    path: "/stats/home",
    component: <StatsHome />,
    protected: true,
  },
  {
    path: "/stats/football",
    component: <StatsFootball />,
    protected: true,
  },
  {
    path: '/stats/football/nfl',
    component: <NFLStats />,
    protected: true,
  },
  {
    path: '/stats/football/nfl/teams',
    component: <NFLTeamStats />,
    protected: true,
  },
  {
    path: '/stats/football/nfl/teams/:id', // Dynamic route for individual team details
    component: <NFLTeamDetailStats />,  // New component for individual team stats
    protected: true,
  },
  {
    path: '/stats/football/nfl/players',
    component: <NFLPlayerStats />,
    protected: true,
  },
  {
    path: '/stats/football/nfl/games',
    component: <NFLGameStats />,
    protected: true,
  },
  {
    path: '/stats/football/nfl/create-custom-stats',
    component: <CreateCustomStats />,
    protected: true,
  },
  {
    path: '/stats/football/nfl/view-custom-stats',
    component: <ViewCustomStats />,
    protected: true,
  }

  // Add more sport-related routes as necessary
];

export default statsRoutes;
