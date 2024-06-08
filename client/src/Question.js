import React from 'react';

const Question = ({ question, submitAnswer }) => {
  return (
    <div>
      <h2>{question.question_text}</h2>
      {question.choices.map(choice => (
        <button key={choice.id} onClick={() => submitAnswer(choice.id)}>
          {choice.choice_text}
        </button>
      ))}
    </div>
  );
};

export default Question;