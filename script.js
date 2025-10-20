document.addEventListener("DOMContentLoaded", function () {
  // Simulator elements
  const speedSlider = document.getElementById("speedSlider");
  const reactionSlider = document.getElementById("reactionSlider");
  const roadCondition = document.getElementById("roadCondition");
  const simulateBtn = document.getElementById("simulateBtn");
  const resetBtn = document.getElementById("resetBtn"); // NEW
  const useMyReactionBtn = document.getElementById("useMyReaction");
  const simulationStatus = document.getElementById("simulationStatus");

  const speedValue = document.getElementById("speedValue");
  const reactionValue = document.getElementById("reactionValue");
  const thinkingDistance = document.getElementById("thinkingDistance");
  const brakingDistance = document.getElementById("brakingDistance");
  const totalDistance = document.getElementById("totalDistance");

  const roadContainer = document.getElementById("roadContainer");
  const roadMarkings = document.getElementById("roadMarkings");
  const car = document.getElementById("car");
  const carGraphic = car && car.querySelector ? car.querySelector("svg") : null;
  const brakeLights = document.getElementById("brakeLights");
  const hazard = document.getElementById("hazard");
  const thinkingMarker = document.getElementById("thinkingMarker");
  const stoppingMarker = document.getElementById("stoppingMarker");
  const hazardMarker = document.getElementById("hazardMarker");
  const thinkingDistanceVis = document.getElementById("thinkingDistanceVis");
  const brakingDistanceVis = document.getElementById("brakingDistanceVis");

  // Reaction test elements
  const reactionTestArea = document.getElementById("reactionTestArea");
  const reactionTestText = document.getElementById("reactionTestText");
  const startReactionTest = document.getElementById("startReactionTest");
  const measuredReactionTime = document.getElementById("measuredReactionTime");
  const testProgress = document.getElementById("testProgress");

  let reactionTestState = "idle"; // idle, waiting, ready, measuring
  let reactionTestStartTime = 0;
  let measuredReactionTimeValue = null;
  let reactionTimes = [];
  let currentTestNumber = 0;
  let simulationRunning = false;

  // Keep active timeouts so we can clear them on reset
  const activeTimeouts = [];

  function safeSetTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    activeTimeouts.push(id);
    return id;
  }

  function clearActiveTimeouts() {
    while (activeTimeouts.length) {
      const id = activeTimeouts.pop();
      clearTimeout(id);
    }
  }

  // Reaction test logic
  function startReactionTestFunc() {
    // Reset test if we're starting a new series
    if (currentTestNumber === 0 || currentTestNumber === 3) {
      reactionTimes = [];
      currentTestNumber = 0;
      testProgress.textContent = "0/3";
    }

    currentTestNumber++;
    testProgress.textContent = `${currentTestNumber}/3`;

    reactionTestArea.style.backgroundColor = "#FEF3C7"; // Yellow background
    reactionTestText.textContent = "Wait for green...";
    reactionTestState = "waiting";

    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;

    safeSetTimeout(() => {
      if (reactionTestState === "waiting") {
        reactionTestArea.style.backgroundColor = "#D1FAE5"; // Green background
        reactionTestText.textContent = "Click now!";
        reactionTestState = "ready";
        reactionTestStartTime = Date.now();
      }
    }, delay);
  }

  // Attach event listeners
  startReactionTest.onclick = startReactionTestFunc;

  reactionTestArea.onclick = function () {
    if (reactionTestState === "idle") {
      startReactionTestFunc();
    } else if (reactionTestState === "waiting") {
      // Clicked too early
      reactionTestArea.style.backgroundColor = "#FEE2E2"; // Red background
      reactionTestText.textContent = "Too early! Click to try again.";
      reactionTestState = "idle";
    } else if (reactionTestState === "ready") {
      // Measure reaction time
      const reactionTime = (Date.now() - reactionTestStartTime) / 1000;
      reactionTimes.push(reactionTime);

      if (currentTestNumber < 3) {
        reactionTestArea.style.backgroundColor = "#DBEAFE"; // Blue background
        reactionTestText.textContent = `Test ${currentTestNumber}/3: ${reactionTime.toFixed(
          3
        )} seconds. Get ready for next test...`;
        reactionTestState = "idle";

        // Automatically start next test after 1.5 seconds
        safeSetTimeout(() => {
          startReactionTestFunc();
        }, 1500);
      } else {
        // Calculate average after 3 tests
        const averageReactionTime =
          reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
        measuredReactionTimeValue = averageReactionTime;
        measuredReactionTime.textContent =
          averageReactionTime.toFixed(3) + " seconds";

        reactionTestArea.style.backgroundColor = "#DBEAFE"; // Blue background
        reactionTestText.textContent = `Average reaction time: ${averageReactionTime.toFixed(
          3
        )} seconds. Click to try again.`;
        reactionTestState = "idle";

        // Enable the "Use My Time" button
        useMyReactionBtn.disabled = false;
      }
    }
  };

  useMyReactionBtn.onclick = function () {
    if (measuredReactionTimeValue !== null) {
      reactionSlider.value = Math.min(
        Math.max(measuredReactionTimeValue, 0.2),
        2.0
      );
      reactionValue.textContent =
        measuredReactionTimeValue.toFixed(2) + " seconds";
      //updateDistances();
    }
  };
function setResultsToZero() {
        thinkingDistance.textContent = `0.0 metres`;
        brakingDistance.textContent = `0.0 metres`;
        totalDistance.textContent = `0.0 metres`;
    }
    setResultsToZero();
  
  // Update displayed values when sliders change
  speedSlider.oninput = function () {
    speedValue.textContent = this.value + " km/h";
    //updateDistances();
  };

  reactionSlider.oninput = function () {
    reactionValue.textContent = this.value + " seconds";
    //updateDistances();
  };
// Compute distances (returns numbers in metres)
function computeDistances() {
    const speed = parseFloat(speedSlider.value); // km/h
    const reactionTimeSeconds = parseFloat(reactionSlider.value);
    const roadType = roadCondition.value;

    const speedMS = speed * 0.27778; // m/s
    const thinkingDist = speedMS * reactionTimeSeconds;

    let frictionCoefficient = 0.7;
    if (roadType === 'wet') frictionCoefficient = 0.4;
    if (roadType === 'snow') frictionCoefficient = 0.1;

    const brakingDist = Math.pow(speedMS, 2) / (2 * frictionCoefficient * 9.81);
    const totalDist = thinkingDist + brakingDist;

    return { thinkingDist, brakingDist, totalDist, speedMS };
}

  //roadCondition.onchange = updateDistances;

  // Calculate and update distances using more accurate formulas
  
  // Initial calculation
 
   let simulationHasRun = false;
  
  // Run simulation with improved animation
  simulateBtn.onclick = function () {
    if (simulationRunning) return;
    simulationRunning = true;

    // Reset simulation state
    resetSimulation();

    // Show simulation status
    simulationStatus.hidden = false;
    simulationStatus.textContent = "Car moving...";
    simulationStatus.className = "simulation-status";

    // Get current values
    const speed = parseFloat(speedSlider.value);
    const reactionTimeSeconds = parseFloat(reactionSlider.value);
    const roadType = roadCondition.value;

    // Convert km/h to m/s
    const speedMS = speed * 0.27778;

    // Calculate distances
    let frictionCoefficient = 0.7; // Dry road
    if (roadType === "wet") frictionCoefficient = 0.4; // Wet road
    if (roadType === "snow") frictionCoefficient = 0.1; // Snow/ice

    const thinkingDist = speedMS * reactionTimeSeconds;
    const brakingDist = Math.pow(speedMS, 2) / (2 * frictionCoefficient * 9.81);
    const totalDist = thinkingDist + brakingDist;

    simulationHasRun = true;
    
    // Disable button during animation
    simulateBtn.disabled = true;
    simulateBtn.classList.add("disabled");

    // Set car position
    car.style.left = "20%";
    car.style.top = "50%";
    car.style.transform = "translateY(-50%)";

    // Start road animation - speed based on vehicle speed
    const animationDuration = Math.max(1, Math.min(4, 110 / speed));
    roadMarkings.style.animationDuration = `${animationDuration}s`;
    roadMarkings.classList.add("animate-road");

    // Add subtle car vibration
    //car.classList.add('animate-shake');
    if (carGraphic) {
      carGraphic.classList.add("animate-shake");
    } else {
      car.classList.add("animate-shake");
    }

    // Set hazard position (80% of road width)
    const roadWidth = roadContainer.offsetWidth;
    const hazardPosition = roadWidth * 0.8;
    hazard.style.right = "10%";

    // Scale for visualization (max 100m fits in our visual)
    const scaleFactor = roadWidth / 100;

    // Position markers for distances
    const carStartPosition = roadWidth * 0.2; // 20% from left
    const thinkingEndPosition = carStartPosition + thinkingDist * scaleFactor;
    const stoppingEndPosition = thinkingEndPosition + brakingDist * scaleFactor;

    // After 2 seconds, show the hazard
    safeSetTimeout(() => {
      // Show hazard
      hazard.style.opacity = "1";

      // Position hazard marker
      hazardMarker.style.left = `${hazardPosition}px`;
      hazardMarker.style.opacity = "1";

      simulationStatus.textContent = "Hazard detected!";

      // Stop road animation - now the car will move
      roadMarkings.classList.remove("animate-road");

      // After reaction time, start moving the car
      safeSetTimeout(() => {
        // Show thinking distance visualization
        thinkingDistanceVis.style.left = `${carStartPosition}px`;
        thinkingDistanceVis.style.width = `${thinkingDist * scaleFactor}px`;
        thinkingDistanceVis.style.opacity = "1";

        // Position thinking marker
        thinkingMarker.style.left = `${thinkingEndPosition}px`;
        thinkingMarker.style.opacity = "1";

        simulationStatus.textContent = "Thinking...";

        // Calculate animation time based on speed
        // Thinking phase - constant speed
        const thinkingTime = reactionTimeSeconds;

        // Move car at constant speed during thinking phase
        car.style.transition = `left ${thinkingTime}s linear`;
        car.style.left = `${thinkingEndPosition}px`;

        // After thinking time, start braking
        safeSetTimeout(() => {
          // Activate brake lights
          if (brakeLights) brakeLights.classList.add("active");

          // Show braking distance visualization
          brakingDistanceVis.style.left = `${thinkingEndPosition}px`;
          brakingDistanceVis.style.width = `${brakingDist * scaleFactor}px`;
          brakingDistanceVis.style.opacity = "1";

          // Position stopping marker
          stoppingMarker.style.left = `${stoppingEndPosition}px`;
          stoppingMarker.style.opacity = "1";

          // Braking phase - deceleration
          // Calculate braking time based on physics (v/a where a is deceleration)
          const brakingTime = Math.max(
            3,
            speedMS / (frictionCoefficient * 9.81)
          );

          // Move car with deceleration during braking phase
          car.style.transition = `left ${brakingTime}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
          car.style.left = `${stoppingEndPosition}px`;

          // Stop car vibration
          // car.classList.remove('animate-shake');
          if (carGraphic) {
            carGraphic.classList.remove("animate-shake");
          } else {
            car.classList.remove("animate-shake");
          }

          simulationStatus.textContent = "Braking...";

          // Calculate if car stops in time or hits hazard
          const stopsInTime = stoppingEndPosition < hazardPosition;

          // After braking time, show result
          safeSetTimeout(() => {
            if (stopsInTime) {
              // Car stops before hazard
              simulationStatus.textContent = "Stopped safely! ✓";
              simulationStatus.style.color = "green";
            } else {
              // Car hits hazard
              simulationStatus.textContent = "Collision! ✗";
              simulationStatus.style.color = "crimson";

              // Add collision effect
              //car.classList.add('animate-shake');
              if (carGraphic) {
                carGraphic.classList.add("animate-shake");
              } else {
                car.classList.add("animate-shake");
              }

              hazard.classList.add("animate-shake");
            }
             thinkingDistance.textContent = `${thinkingDist.toFixed(1)} metres`;
    brakingDistance.textContent = `${brakingDist.toFixed(1)} metres`;
    totalDistance.textContent = `${totalDist.toFixed(1)} metres`;

            // Re-enable button after animation completes
            safeSetTimeout(() => {
              simulateBtn.disabled = false;
              simulateBtn.classList.remove("disabled");
              simulationRunning = false;
            }, 1500);
          }, brakingTime * 1000);
        }, thinkingTime * 1000);
      }, reactionTimeSeconds);
    }, 2000);
  };

  // Reset button handler
  resetBtn.addEventListener("click", () => {
    // Stop and clear any pending timeouts
    clearActiveTimeouts();

    // Reset the simulation visuals and UI
    resetSimulation();
  setResultsToZero();
    // Re-enable simulate button
    simulateBtn.disabled = false;
    simulateBtn.classList.remove("disabled");

    // Reset simulationRunning flag
    simulationRunning = false;
  });

  function resetSimulation() {
    // Reset all animation states
    roadMarkings.classList.remove("animate-road");
    //car.classList.remove('animate-shake');
    if (carGraphic) {
      carGraphic.classList.remove("animate-shake");
    } else {
      car.classList.remove("animate-shake");
    }

    hazard.classList.remove("animate-shake");

    // Reset car position and transition
    car.style.left = "20%";
    car.style.transition = "none";

    // Reset opacity of markers
    if (thinkingMarker) thinkingMarker.style.opacity = "0";
    if (stoppingMarker) stoppingMarker.style.opacity = "0";
    if (hazardMarker) hazardMarker.style.opacity = "0";

    // Reset distance visualizations
    if (thinkingDistanceVis) {
      thinkingDistanceVis.style.opacity = "0";
      thinkingDistanceVis.style.width = "0px";
      thinkingDistanceVis.style.left = "0px";
    }
    if (brakingDistanceVis) {
      brakingDistanceVis.style.opacity = "0";
      brakingDistanceVis.style.width = "0px";
      brakingDistanceVis.style.left = "0px";
    }

    // Reset hazard
    if (hazard) hazard.style.opacity = "0";

    // Reset brake lights
    if (brakeLights) brakeLights.classList.remove("active");

    // reset simulation status style & hide
    if (simulationStatus) {
      simulationStatus.style.color = "";
      simulationStatus.textContent = "";
      simulationStatus.hidden = true;
    }
  }
});
