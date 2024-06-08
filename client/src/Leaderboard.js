import React from 'react';

const Leaderboard = ({ scores }) => {
  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>{score.user}: {score.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;