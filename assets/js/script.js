const question = document.querySelector('#question');
const options = Array.from(document.querySelectorAll('.option-text'));
const quizStart = document.querySelector('#start-quiz');
const leaderboardBtn = document.querySelector('#leaderboard-btn');
const restart = document.querySelector('#restart');
const welcome = document.querySelector('#welcome');
const counters = document.querySelector('#counters');
const quiz = document.querySelector('#quiz');
const result = document.querySelector('#result');
const instructions = document.querySelector('#instructions')
const leaderboard = document.querySelector('#leaderboard');
const currentScore = document.querySelector('#current-score');
const questionNumber = document.querySelector('#question-number');
const finalScore = document.querySelector('#final-score');
const home = document.querySelector('#home');
const resultMessage = document.querySelector('#result-message');
const username = document.querySelector('#username');
const submit = document.querySelector('#submit-score');
const leaderboardUsers = Array.from(document.querySelectorAll('.leaderboard-user'));
const leaderboardScores = Array.from(document.querySelectorAll('.leaderboard-score'));
const exitLeaderboard = document.querySelector('#exit-leaderboard');
const openInstructionsBtn = document.querySelector('#open-instructions-btn');
const closeInstructionsBtn = document.querySelector('#close-instructions-btn');

const APIURL = 'https://opentdb.com/api.php?amount=10&category=31&type=multiple';
let scoreCounter = 0;
let questionCounter = 0;
let availableQuestions = [];
let highScores = JSON.parse(sessionStorage.getItem('highScores')) || [];

/**
 * Removes unneccessary data
 * @param {[]} questionList 
 * @returns Formatted question
 */
const formatQuestion = (questionList) => {
    return questionList?.map(q => {
        return {
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: shuffleAnswers([...q.incorrect_answers, q.correct_answer])
        };
    });
};

/**
 * @param {[]} answersArray 
 * Gives negative or positive number to each answer
 * and sorts based on positivity
 * @returns Shuffled array
 */
const shuffleAnswers = (answersArray) => answersArray.sort(() => Math.random() - 0.5);

/**
 * Checks available question length,
 * if equal to 0, goes to result window.
 * If not equal to 0, takes question from availableQuestions array
 * @returns 
 * Question and answers from question and replaces innerHTML for quiz window.
 * Removes current question from array.
 */
const presentQuestions = () => {
    if (availableQuestions.length === 0) {
        finalScore.innerText = scoreCounter;
        if (+finalScore.innerText < 5) {
            resultMessage.innerText = 'Bad Luck =[';
        } else {
            resultMessage.innerText = 'Well Done! =]';
        }            
        quiz.classList.add('hidden');
        counters.classList.add('hidden');
        result.classList.remove('hidden');
        return;
    };
    questionCounter++;
    questionNumber.innerText = questionCounter;
    presentedQuestion = availableQuestions[0];
    question.innerHTML = presentedQuestion.question;
    options.forEach((option, index) => {
        option.innerHTML = presentedQuestion.answers[index];    
    });
    availableQuestions.splice(question, 1);
};

/**
 * 
 * @param {event}
 * Checks selected answer and if correct adds point
 * and then calls for next question
 */
const checkAnswer = (event) => {
    const selectedOption = event.target;
    const selectedAnswer = selectedOption.innerHTML;

    if (selectedAnswer == presentedQuestion.correctAnswer) {
        scoreCounter++;
        currentScore.innerText = scoreCounter;  
    } 
    const applyClass = selectedAnswer == presentedQuestion.correctAnswer ? 'correct' : 'incorrect';
    selectedOption.parentElement.classList.add(applyClass);

    setTimeout(() => {
        selectedOption.parentElement.classList.remove(applyClass);
        presentQuestions(); 
    }, 500);           
};


/**
 * Sets questionCounter and score to 0,
 * adds formattedQuestions to availableQuestion array,
 * and gets next question.
 */
const startQuiz = () => {
    questionCounter = 0;
    scoreCounter = 0;
    questionNumber.innerText = '1';
    currentScore.innerText = scoreCounter;
    resultMessage.innerText = "";
    welcome.classList.add('hidden');
    counters.classList.remove('hidden');
    quiz.classList.remove('hidden');
};

/**
 * Adds hidden class to quiz window
 * then removes hidden class from welcome window
 * thus returning to welcome window.
 */
const restartQuiz = () => {
    questionCounter = 0;
    scoreCounter = 0;    
    quiz.classList.add('hidden');
    counters.classList.add('hidden');
    welcome.classList.remove('hidden');
    initialise();
};

/**
 * Adds hidden class to result window
 * then removes hidden class from welcome window
 * returns to welcome window
 */
const goHome = () => {
    result.classList.add('hidden');
    welcome.classList.remove('hidden');
    initialise();
};

const submitScore = () => {
    const submittedScore = {
        score: +finalScore.innerText,
        user: username.value
    };    
    highScores.push(submittedScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    sessionStorage.setItem('highScores', JSON.stringify(highScores));


};

const openInstructions = () => {
    welcome.classList.add('hidden');
    instructions.classList.remove('hidden');

    closeInstructionsBtn.addEventListener('click', closeInstructions);
}

const closeInstructions = () => {
    instructions.classList.add('hidden');
    welcome.classList.remove('hidden');
}

const openLeaderboard = () => {
    welcome.classList.add('hidden');
    leaderboard.classList.remove('hidden');

    exitLeaderboard.addEventListener('click', closeLeaderboard);  
};

const closeLeaderboard = () => {    
    leaderboard.classList.add('hidden');
    welcome.classList.remove('hidden');
}
 
/**
 * Waits for questions to be fetched from API
 * then resolves json,
 * formats questions using formatQuestion function,
 * presents question in html.
 */
const initialise = async() => {
    const res = await fetch(APIURL);
    const fetchedQuestions = await res.json();
    const formattedQuestions = await formatQuestion(fetchedQuestions.results);
    availableQuestions = [...formattedQuestions];
    presentQuestions();
};

/**
 * Checks for DOM content to be loaded
 * Sets click event listeners to start, restart and home buttons.
 * Runs initialise function.
 * Sets click event listeners to answer options
 */
window.addEventListener("DOMContentLoaded", (event) => {

    quizStart.addEventListener('click', startQuiz);
    openInstructionsBtn.addEventListener('click', openInstructions);
    leaderboardBtn.addEventListener('click', openLeaderboard);
    restart.addEventListener('click', restartQuiz);
    home.addEventListener('click', goHome);
    leaderboard
    
    initialise();

    // Add click event listener for answer options
    options.forEach(option => {
        option.addEventListener('click', checkAnswer);
    });
    
    //Add click event listener for submit score button
    submit.addEventListener('click', submitScore);

});