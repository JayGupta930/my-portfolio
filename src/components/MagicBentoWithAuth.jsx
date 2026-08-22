import { AuthProvider } from "../context/AuthContext";
import MagicBento from "./MagicBento";

const MagicBentoWithAuth = props => (
  <AuthProvider>
    <MagicBento {...props} />
  </AuthProvider>
);

export default MagicBentoWithAuth;
