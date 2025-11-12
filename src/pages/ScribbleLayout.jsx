import { Outlet } from "react-router-dom";
import { GameProvider } from "../context/GameContext";

const ScribbleLayout = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Outlet />
      </div>
    </GameProvider>
  );
};

export default ScribbleLayout;
