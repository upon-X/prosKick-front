export interface IUser {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  roles: string[];
  is_verified: boolean;
  created_at: string;
  last_login_at?: string;
  subscription?: {
    plan: string;
    seats_teams: number;
    venues_limit: number | string;
    status: string;
  };
}


export interface IPlayerProfile {
  id: string;
  handle: string;
  name: string;
  location: {
    country: string;
    province: string;
    city: string;
  };
  foot?: string;
  position?: string[];
  height_cm?: number;
  weight_kg?: number;
  avatar_url?: string;
  elo: number;
  rep_score: number;
  stats: {
    games: {
      total: number;
      wins: number;
      loses: number;
      draws: number;
    };
    goals: number;
    assists: number;
    mvps: number;
    cards_y: number;
    cards_r: number;
  };
}
