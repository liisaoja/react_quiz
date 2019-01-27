import React, { Component } from 'react';
import logo from './img/hahmot.PNG';
import './App.css';
import Quiz from './components/Quiz';
import Question from './components/Question';
import quizQuestions from './api/quizQuestions';
import Result from './components/Result';

class App extends Component {
   constructor(props) {
    super(props);

    this.state = {
     counter: 0,
     questionId: 1,
     question: '',
     answerOptions: [],
     answer: '',
     answersCount: {
       aktivisti: 0,
       sohvaperuna: 0,
       toimeentarttuja: 0,
       puskaradiohuutelija: 0,
       sydämellätekijä: 0,
       eettinenkuluttaja: 0,
     },
     result: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }


  componentWillMount() {
    const shuffledAnswerOptions = quizQuestions.map((question) => this.shuffleArray(question.answers));  

    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  setUserAnswer(answer) {
      this.setState((state) => ({
        answersCount: {
          ...state.answersCount,
          [answer]: state.answersCount[answer] + 1
        },
        answer: answer
      }));
    }

    setNextQuestion() {
      const counter = this.state.counter + 1;
      const questionId = this.state.questionId + 1;
      this.setState({
        counter: counter,
        questionId: questionId,
        question: quizQuestions[counter].question,
        answerOptions: quizQuestions[counter].answers,
        answer: ''
    });
  }

   getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }

   setResults (result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: ' sekoitus useampaa tyyppiä' });
    }
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
          setTimeout(() => this.setResults(this.getResults()), 300);
      }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        counter={this.state.counter}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result} />
    );
  }

   render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Millainen vaikuttaja olet?</h2>
        </div>
         {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    )
  }
}

export default App;
