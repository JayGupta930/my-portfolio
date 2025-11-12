import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const createSamplePlayers = () => [
  {
    id: "p1",
    name: "Alex",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Alex",
    score: 245,
    isHost: true,
  },
  {
    id: "p2",
    name: "Jordan",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Jordan",
    score: 220,
  },
  {
    id: "p3",
    name: "Mia",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Mia",
    score: 180,
  },
  {
    id: "p4",
    name: "Ravi",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Ravi",
    score: 140,
  },
];

const initialChat = [
  {
    id: "c1",
    author: "System",
    content: "Round 1 starts now! Alex is drawing.",
    kind: "system",
    timestamp: new Date().toISOString(),
  },
  {
    id: "c2",
    author: "Jordan",
    content: "Is it a rocket?",
    kind: "guess",
    timestamp: new Date().toISOString(),
  },
  {
    id: "c3",
    author: "Mia",
    content: "Planet!",
    kind: "guess",
    timestamp: new Date().toISOString(),
  },
];

const fakeHints = [
  "_ _ _ _ _",
  "S _ _ _ _",
  "S T _ _ _",
  "S T A _ _",
  "STA__ (Almost there!)",
];

const fakeGuesses = [
  { author: "Jordan", content: "Stair?" },
  { author: "Mia", content: "Stamp" },
  { author: "Ravi", content: "Star!" },
  { author: "Jordan", content: "Starfish" },
  { author: "Mia", content: "Starship" },
];

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("MOON");
  const [players, setPlayers] = useState(() => createSamplePlayers());
  const [drawerId, setDrawerId] = useState("p1");
  const [chatMessages, setChatMessages] = useState(initialChat);
  const [round, setRound] = useState(1);
  const totalRounds = 3;
  const [timer, setTimer] = useState(75);
  const [wordHint, setWordHint] = useState(fakeHints[0]);
  const [gameState, setGameState] = useState("in-progress");
  const [currentPlayerId, setCurrentPlayerId] = useState("p2");

  const hintIndexRef = useRef(0);
  const fakeGuessIndexRef = useRef(0);

  useEffect(() => {
    if (timer === 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const hintInterval = window.setInterval(() => {
      hintIndexRef.current = (hintIndexRef.current + 1) % fakeHints.length;
      setWordHint(fakeHints[hintIndexRef.current]);
    }, 7000);

    return () => window.clearInterval(hintInterval);
  }, []);

  useEffect(() => {
    const guessInterval = window.setInterval(() => {
      fakeGuessIndexRef.current = (fakeGuessIndexRef.current + 1) % fakeGuesses.length;
      const nextGuess = fakeGuesses[fakeGuessIndexRef.current];

      setChatMessages((prev) => [
        ...prev.slice(-24),
        {
          id: `c${Date.now()}`,
          author: nextGuess.author,
          content: nextGuess.content,
          kind: nextGuess.content.toLowerCase().includes("star") ? "correct" : "guess",
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 4500);

    return () => window.clearInterval(guessInterval);
  }, []);

  const addChatMessage = (content) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    const authorName = username || "You";

    setChatMessages((prev) => [
      ...prev.slice(-24),
      {
        id: `c${Date.now()}`,
        author: authorName,
        content: trimmed,
        kind: "guess",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const promoteNextDrawer = () => {
    setPlayers((prevPlayers) => {
      if (prevPlayers.length === 0) {
        return prevPlayers;
      }

      const currentIndex = prevPlayers.findIndex((player) => player.id === drawerId);
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % prevPlayers.length : 0;
      setDrawerId(prevPlayers[nextIndex].id);
      return prevPlayers;
    });
  };

  const advanceRound = () => {
    setRound((prev) => {
      const nextRound = prev < totalRounds ? prev + 1 : prev;
      if (nextRound !== prev) {
        setTimer(75);
        setWordHint(fakeHints[0]);
        hintIndexRef.current = 0;
        promoteNextDrawer();
      }
      return nextRound;
    });
  };

  const resetGame = () => {
    setPlayers(createSamplePlayers());
    setDrawerId("p1");
    setChatMessages(initialChat);
    setRound(1);
    setTimer(75);
    setWordHint(fakeHints[0]);
    hintIndexRef.current = 0;
    fakeGuessIndexRef.current = 0;
    setGameState("in-progress");
  };

  const value = useMemo(
    () => ({
      username,
      setUsername,
      roomCode,
      setRoomCode,
      players,
      setPlayers,
      drawerId,
      chatMessages,
      addChatMessage,
      round,
      totalRounds,
      timer,
      setTimer,
      wordHint,
      gameState,
      setGameState,
      advanceRound,
      resetGame,
      currentPlayerId,
      setCurrentPlayerId,
    }),
    [
      username,
      roomCode,
      players,
      drawerId,
      chatMessages,
      round,
      totalRounds,
      timer,
      wordHint,
      gameState,
      currentPlayerId,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
