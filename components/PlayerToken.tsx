
import React from 'react';
import { PlayerToken as TokenType } from '../types';

interface TokenProps {
  token: TokenType;
  color: string;
}

const TokenIcon: React.FC<{ token: TokenType }> = ({ token }) => {
    // Simplified icons for demonstration
    switch (token) {
        case 'car': return <path d="M6 15h12v-2h-12v2zm13-8h-2v-2h-14v2h-2v-3h18v3zm-5 6.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm-7 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm1.5-3.5h4v-4h-4v4z"/>;
        case 'thimble': return <path d="M12 2c-3.313 0-6 2.687-6 6v1h12v-1c0-3.313-2.687-6-6-6zm-8 7v2h16v-2h-16zm1 3v8h14v-8h-14z"/>;
        case 'boot': return <path d="M21 3h-13v12h-1.5c-1.381 0-2.5 1.119-2.5 2.5v3.5h17v-18zm-15 16h-1.5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1.5v1zm2-14h11v14h-11v-14z"/>;
        case 'dog': return <path d="M19 2c0-1.104-.896-2-2-2h-10c-1.104 0-2 .896-2 2v2h14v-2zm-12 4c-1.104 0-2 .896-2 2v2h2v-4h-2zm10 0h-8v4h8v-4zm2 0h-1v4h2v-2c0-1.104-.896-2-1-2zm-12 6c-1.104 0-2 .896-2 2v2h2v-4h-2zm10 0h-8v4h8v-4zm2 0h-1v4h2v-2c0-1.104-.896-2-1-2zm-6 6c-1.104 0-2 .896-2 2v2h4v-2c0-1.104-.896-2-2-2z"/>;
        case 'battleship': return <path d="M12 2c-1.932 0-3.695.789-4.95 2.05l-4.05 4.05h3.016l2.129-2.129c.639-.639 1.488-1.012 2.381-1.012s1.742.373 2.381 1.012l2.129 2.129h3.016l-4.05-4.05c-1.255-1.261-3.018-2.05-4.95-2.05zm-10 8l4.05 4.05c1.255 1.261 3.018 2.05 4.95 2.05s3.695-.789 4.95-2.05l4.05-4.05h-18zm1 6v4h16v-4h-16z"/>;
        case 'tophat': return <path d="M12 2c-4.418 0-8 1.791-8 4v2h16v-2c0-2.209-3.582-4-8-4zm-10 7v2h20v-2h-20zm1 3v8h18v-8h-18z"/>;
        default: return null;
    }
}

const PlayerToken: React.FC<TokenProps> = ({ token, color }) => {
  return (
    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: color, border: '1px solid black' }}>
        <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current">
            <TokenIcon token={token}/>
        </svg>
    </div>
  );
};

export default PlayerToken;
