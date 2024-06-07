import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

const ENDPOINT = "http://localhost:4000";

const Quiz = ({ quizId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [scores, setScores] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch quiz questions
    axios.get(`http://localhost:8003/quizzes/${quizId}/`)
      .then(response => {
        setQuestions(response.data.questions);
        setCurrentQuestion(response.data.questions[0]);
      });

    // Initialize WebSocket connection
    const ws = socketIOClient(ENDPOINT);
    ws.on('score_update', (data) => {
      setScores(data);
    });
    setSocket(ws);

    return () => {
      ws.disconnect();
    };
  }, [quizId]);

  const submitAnswer = (choiceId) => {
    if (socket && currentQuestion) {
      socket.emit('submit_answer', {
        user_id: 1,  // replace with actual user ID
        quiz_id: quizId,
        question_id: currentQuestion.id,
        choice_id: choiceId,
      });
    }
  };

  return (
    <div>
      <h1>Quiz {quizId}</h1>
      {currentQuestion && (
        <div>
          <h2>{currentQuestion.question_text}</h2>
          {currentQuestion.choices.map(choice => (
            <button key={choice.id} onClick={() => submitAnswer(choice.id)}>{choice.choice_text}</button>
          ))}
        </div>
      )}
      <h2>Leaderboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>{score.user}: {score.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Quiz;