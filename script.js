document.addEventListener('DOMContentLoaded', function() {
  const questions = [
    {
      question: "What is the distance travelled by a vehicle when the driver is reacting to a hazard?",
      options: [
        "Stopping distance",
        "Thinking distance",
        "Braking distance",
        "Reaction time"
      ],
      correctAnswer: 1,
      explanation: "During the fraction of a second that a driver takes to react to a hazard and press the brakes, the vehicle will have moved - the Thinking Distance"
    },
    {
      question: "If a car's speed doubles from 30 km/h to 60 km/h, what happens to its braking distance?",
      options: [
        "Stays the same",
        "Doubles",
        "Quadruples",
        "Increases by 8 times"
      ],
      correctAnswer: 2,
      explanation: "Braking distance increases with the square of speed. 2× speed = 4× braking distance (2²). At 30 km/h → 9m braking distance, at 60 km/h → 36m."
    },
    {
      question: "A typical reaction time is 0.4 seconds. At 50 km/h (14 m/s), how far does the car travel during reaction time?",
      options: [
        "3.2 m",
        "5.6 m",
        "20.0 m",
        "56.0 m"
      ],
      correctAnswer: 1,
      explanation: "Calculation: Thinking distance = speed × time = 14 m/s × 0.4s = 5.6 m. This is just the distance covered before braking begins!"
    },
    {
      question: "Which condition would INCREASE stopping distance the most?",
      options: [
        "Dry concrete road ",
        "Wet asphalt road",
        "Icy road",
        "New tyres on dry road"
      ],
      correctAnswer: 2,
      explanation: "Icy roads can increase braking distance by 7-10× compared to dry conditions."
    },
    {
      question: "Which factor ONLY affects braking distance?",
      options: [
        "Using a mobile phone",
        "Worn tire tread",
        "Driver age",
        "Loud music"
      ],
      correctAnswer: 1,
      explanation: "Braking distance is increased by: • Worn brakes/tires • Wet/icy roads • Higher speed • Vehicle weight. It's NOT affected by the driver's reactions."
    },
    {
      question: "What makes up total stopping distance?",
      options: [
        "Braking distance only",
        "Thinking distance + braking distance",
        "Speed + reaction time",
        "Vehicle weight + road condition"
      ],
      correctAnswer: 1,
      explanation: "Total stopping distance has two parts: 1) Thinking distance (time to react) and 2) Braking distance (time for car to stop)."
    },
    {
      question: "How does tiredness affect stopping distance?",
      options: [
        "Only increases braking distance",
        "Can double reaction time (increasing thinking distance)",
        "Improves braking performance",
        "Has no measurable effect"
      ],
      correctAnswer: 1,
      explanation: "Fatigue can increase reaction time significantly. This could double the thinking distance"
    },
    {
      question: "Which has the shortest stopping distance when traveling at 50 km/h?",
      options: [
        "Sports car on dry road",
        "Bus on wet road",
        "Bicycle on icy road",
        "Motorbike on gravel"
      ],
      correctAnswer: 0,
      explanation: "Sports cars have the best brakes and tires. Dry roads provide most friction. Combination gives shortest stopping distance."
    },
    {
      question: "Which factor affects BOTH thinking and braking distance?",
      options: [
        "Drinking alcohol",
        "Speed of the vehicle",
        "Foggy weather",
        "Number of passengers"
      ],
      correctAnswer: 1,
      explanation: "Speed increases: • Thinking distance (more distance covered during reaction time) • Braking distance (more kinetic energy to dissipate)."
    },
    {
      question: "Which factor ONLY affects thinking distance?",
      options: [
        "Wet road surface",
        "Driver tiredness",
        "Worn brake pads",
        "Icy conditions"
      ],
      correctAnswer: 1,
      explanation: "Thinking distance is increased by: • Tiredness • Alcohol/drugs • Distractions • Poor visibility. It's NOT affected by vehicle/road conditions."
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let userAnswers = [];

  const quizContent = document.getElementById('quiz-content');
  const questionNumberEl = document.getElementById('question-number');
  const progressBarEl = document.getElementById('progress-bar');
  const scoreDisplayEl = document.getElementById('score-display');

  function displayQuestion() {
    const q = questions[currentQuestion];

    questionNumberEl.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    progressBarEl.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    let optionsHTML = '';
    q.options.forEach((opt, idx) => {
      optionsHTML += `
        <div class="option-item">
          <label class="option-label" data-index="${idx}">
            <input type="radio" name="answer" value="${idx}">
            <span class="option-text">${opt}</span>
          </label>
        </div>
      `;
    });

    quizContent.innerHTML = `
      <div class="question-block">
        <div class="question-title">${q.question}</div>
        <form id="quiz-form">
          <div class="options">${optionsHTML}</div>
          <div style="margin-top:14px;">
            <button type="submit" id="submit-btn" class="btn btn-primary" aria-label="Submit answer">Submit Answer</button>
          </div>
        </form>
      </div>
      <div id="feedback" class="feedback hidden"></div>
    `;

    const form = document.getElementById('quiz-form');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitAnswer();
    });
  }

  function submitAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) {
      alert('Please select an answer!');
      return;
    }

    const answer = parseInt(selected.value, 10);
    const correct = answer === questions[currentQuestion].correctAnswer;

    if (correct) {
      score++;
      scoreDisplayEl.textContent = `Score: ${score}`;
    }

    userAnswers.push({
      question: currentQuestion,
      userAnswer: answer,
      correct: correct
    });

    // Show feedback
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.classList.remove('hidden');
    feedbackDiv.className = 'feedback ' + (correct ? 'correct' : 'incorrect');

    // icon SVGs
    const icon = correct ? '<svg class="icon" viewBox="0 0 20 20"><path fill="currentColor" d="M7.4 13.4L4 10l1.4-1.4L7.4 10.6 14.6 3.4 16 4.8z"></path></svg>' :
                          '<svg class="icon" viewBox="0 0 20 20"><path fill="currentColor" d="M10 8.6l3.2-3.2 1.4 1.4L11.4 10l3.2 3.2-1.4 1.4L10 11.4l-3.2 3.2-1.4-1.4L8.6 10 5.4 6.8 6.8 5.4 10 8.6z"></path></svg>';

    feedbackDiv.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <div style="flex-shrink:0;">${icon}</div>
        <div>
          <p style="margin:0 0 6px;font-weight:600;">${correct ? 'Correct!' : 'Incorrect!'}</p>
          <p style="margin:0;font-size:14px;">${questions[currentQuestion].explanation}</p>
        </div>
      </div>
      <div style="margin-top:12px;">
        <button id="next-btn" class="btn btn-primary">${currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}</button>
      </div>
    `;

    // disable options
    const options = document.querySelectorAll('input[name="answer"]');
    options.forEach(opt => opt.disabled = true);

    // highlight correct and wrong
    const labels = document.querySelectorAll('.option-label');
    labels.forEach((label, idx) => {
      if (idx === questions[currentQuestion].correctAnswer) {
        label.classList.add('correct-answer');
      } else if (idx === answer && !correct) {
        label.classList.add('wrong-answer');
      }
    });

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
  }

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    document.getElementById('quiz-content').classList.add('hidden');
    const resultsEl = document.getElementById('results');
    resultsEl.classList.remove('hidden');

    // allow CSS transition to apply
    setTimeout(() => resultsEl.classList.add('show'), 50);

    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-count').textContent = score;
    document.getElementById('final-progress').style.width = `${(score / questions.length) * 100}%`;

    const resultMessage = document.getElementById('result-message');
    if (score === 10) {
      resultMessage.textContent = "Perfect! You're a stopping distance expert!";
    } else if (score >= 8) {
      resultMessage.textContent = "Excellent! You understand safe following distances well.";
    } else if (score >= 6) {
      resultMessage.textContent = "Good job! You know most key concepts about braking.";
    } else if (score >= 4) {
      resultMessage.textContent = "You're learning - review the 3-second rule and speed effects.";
    } else {
      resultMessage.textContent = "Important to review - these concepts could save lives!";
    }

    // review list
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    userAnswers.forEach((ans, i) => {
      const question = questions[ans.question];
      const correctClass = ans.correct ? 'correct' : 'incorrect';
      const correctAnswerText = question.options[question.correctAnswer];
      const userAnswerText = question.options[ans.userAnswer];

      const item = document.createElement('div');
      item.className = `review-item ${correctClass}`;
      item.innerHTML = `
        <p style="margin:0 0 6px;font-weight:600;">Question ${i + 1}: ${question.question}</p>
        <p style="margin:0 0 4px;"><strong>Your answer:</strong> ${userAnswerText}</p>
        ${ans.correct ? '' : `<p style="margin:0;"><strong>Correct answer:</strong> ${correctAnswerText}</p>`}
      `;
      reviewList.appendChild(item);
    });

    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
  }

  function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    scoreDisplayEl.textContent = 'Score: 0';
    const resultsEl = document.getElementById('results');
    resultsEl.classList.remove('show');
    // hide then re-display question
    setTimeout(() => {
      resultsEl.classList.add('hidden');
      document.getElementById('quiz-content').classList.remove('hidden');
      displayQuestion();
    }, 300);
  }

  // start
  displayQuestion();
});