import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import Question from './Question';
import Leaderboard from './Leaderboard';

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
        <Question 
          question={currentQuestion} 
          submitAnswer={submitAnswer} 
        />
      )}
      <Leaderboard scores={scores} />
    </div>
  );
};

export default Quiz;