import { AuthProvider } from "../context/AuthContext";
import GamesPage from "./GamesPage";

const GamesPageWithAuth = () => (
  <AuthProvider>
    <GamesPage />
  </AuthProvider>
);

export default GamesPageWithAuth;
