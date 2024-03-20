import React, { useEffect, useState, useRef } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';

const Quiz: React.FC = () => {
  const quizCore = useRef(new QuizCore());

  const [currentQuestion, setCurrentQuestion] = useState(quizCore.current.getCurrentQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Next question");

  const handleOptionSelect = (option: string): void => {
    setSelectedAnswer(option);
  }

  const handleButtonClick = (): void => {
    // Task3: Implement the logic for button click, such as moving to the next question.
    if (selectedAnswer && currentQuestion) {
      quizCore.current.answerQuestion(selectedAnswer);
      if (quizCore.current.hasNextQuestion()) {
        quizCore.current.nextQuestion();
        setCurrentQuestion(quizCore.current.getCurrentQuestion());
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true); // no more questions
      }
    }
  }

  // if current question changes (including changed to null), check if the quiz is finished
  // the dependency array of a useEffect hook tells React to re-run the effect after the initial render whenever one of the dependencies has changed
  useEffect(() => {
    if (!quizCore.current.getCurrentQuestion() && !quizCore.current.hasNextQuestion()) {
      setQuizFinished(true);
    }
  }, [currentQuestion]);

  // user click submit button on the last question (no next question, but current question is not null, therefore not finsihed yet)
  useEffect(() => {
    if (!quizCore.current.hasNextQuestion() && !quizFinished) {
      setButtonLabel("Submit");  // Change button label to "Submit" if there are no more questions
    }
  }, [currentQuestion, quizFinished]);

  if (quizFinished) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {quizCore.current.getScore()} out of {quizCore.current.getTotalQuestions()}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      {currentQuestion ? (
        <>
          <p>{currentQuestion.question}</p>
          <h3>Answer Options:</h3>
          <ul>
            {currentQuestion.options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionSelect(option)}
                // each option gets a base class `option`, and if it's the selected answer, it also gets the `selected` class.
                className={selectedAnswer === option ? 'option selected' : 'option'}
              >
                {option}
              </li>
            ))}
          </ul>

          <h3>Selected Answer:</h3>
          <p>{selectedAnswer ?? 'No answer selected'}</p>

          <button onClick={handleButtonClick}>{buttonLabel}</button>
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default Quiz;