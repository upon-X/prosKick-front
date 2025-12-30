import { useAuthStore } from '../store/auth.store';

// Hook para obtener solo el usuario
export const useUser = () => useAuthStore((state) => state.user);

// Hook para obtener solo el perfil de jugador
export const usePlayerProfile = () => useAuthStore((state) => state.player_profile);

// Hook para obtener solo el usuario de Firebase
export const useFirebaseUser = () => useAuthStore((state) => state.firebase_user);

// Hook para obtener el estado de carga
export const useAuthLoading = () => useAuthStore((state) => state.loading);

// Hook para saber si es un usuario nuevo
export const useIsNewUser = () => useAuthStore((state) => state.is_new_user);

// Hook para saber si está autenticado
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);

// Hook para saber si está inicializado
export const useIsInitialized = () => useAuthStore((state) => state.is_initialized);

// Hook para obtener datos específicos del usuario
export const useUserEmail = () => useAuthStore((state) => state.user?.email);
export const useUserAvatar = () => useAuthStore((state) => state.user?.avatar_url);
export const useUserRoles = () => useAuthStore((state) => state.user?.roles || []);
export const useUserSubscription = () => useAuthStore((state) => state.user?.subscription);

// Hook para obtener datos específicos del perfil
export const usePlayerHandle = () => useAuthStore((state) => state.player_profile?.handle);
export const usePlayerName = () => useAuthStore((state) => state.player_profile?.name);
export const usePlayerElo = () => useAuthStore((state) => state.player_profile?.elo);
export const usePlayerStats = () => useAuthStore((state) => state.player_profile?.stats);

// Hooks para estadísticas de games
export const usePlayerGames = () => useAuthStore((state) => state.player_profile?.stats?.games);
export const usePlayerGamesTotal = () => useAuthStore((state) => state.player_profile?.stats?.games?.total || 0);
export const usePlayerGamesWins = () => useAuthStore((state) => state.player_profile?.stats?.games?.wins || 0);
export const usePlayerGamesLoses = () => useAuthStore((state) => state.player_profile?.stats?.games?.loses || 0);
export const usePlayerGamesDraws = () => useAuthStore((state) => state.player_profile?.stats?.games?.draws || 0);

// Hook para obtener el estado completo de autenticación
export const useAuthState = () => useAuthStore((state) => ({
  user: state.user,
  player_profile: state.player_profile,
  firebase_user: state.firebase_user,
  loading: state.loading,
  is_new_user: state.is_new_user,
  is_initialized: state.is_initialized,
}));
