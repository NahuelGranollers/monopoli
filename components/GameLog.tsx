
import React, { useRef, useEffect } from 'react';

interface GameLogProps {
  messages: string[];
}

const GameLog: React.FC<GameLogProps> = ({ messages }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-inner flex-grow">
      <h3 className="font-bold text-center mb-2 font-display">Registro del Juego</h3>
      <div ref={logContainerRef} className="h-32 overflow-y-auto text-xs space-y-1">
        {messages.map((msg, index) => (
          <p key={index} className="px-1">{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default GameLog;
