const pitchWidth = 105;  // Example pitch width
const pitchHeight = 68;  // Example pitch height
const margin = { top: -20, right: 10, bottom: 10, left: 7};

// Initialize line chart with pitch dimensions
const lineChart = d3.select("#lineChart")
.attr("width", 800)
.attr("height", 100);

const svg = lineChart.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


const width = +lineChart.attr("width");
const height = +lineChart.attr("height");

 // Define scales
 let xScale = d3.scaleLinear()
    .domain([0, 20]) // Initial domain set to maxLineDataLength
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([-0.3, 1.0])
    .range([height, 0]);

const line = d3.line()
    .x(d => xScale(d.index)) // Use index for x-axis
    .y(d => yScale(d.value)); // Use value for y-axis

const path = lineChart.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

// Append x and y axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

svg.append("g")
 .attr("class", "x axis")
 .attr("transform", `translate(0,${height})`)
 .call(xAxis);

svg.append("g")
 .attr("class", "y axis")
 .call(yAxis);

// Initialize the slider
const slider = document.getElementById("frameSlider");

// Check if frames are playing or not
let isPlaying = false;

// Array to store line chart data
let lineData = [];


// Function to update xScale dynamically
function updateXScaleDomain(newLength) {
    xScale.domain([0, newLength - 1]);
    d3.select(".x.axis").call(d3.axisBottom(xScale)); // Update x-axis with new scale
}

// Function to update positions of elements based on data
function updatePositions(trackingData, predictions) {
    // Update player positions based on data
    const playerGroups = d3.selectAll(".player-group")
        .data(trackingData.players, d => d.id); // Bind data using player id

    playerGroups.each(function(d) {
        const group = d3.select(this);

        // Update player circle position
        group.select(".team-circle")
            .attr("cx", d.x)
            .attr("cy", d.y);

        // Update arrow line based on vx and vy
        group.select(".arrow-line")
            .attr("x1", d.x)
            .attr("y1", d.y)
            .attr("x2", d.x + d.vx)
            .attr("y2", d.y + d.vy);
    });

    // Update ball position and arrow line
    const ballGroup = d3.select("#ballGroup");

    ballGroup.select(".team-circle")
        .attr("cx", trackingData.ball.x)
        .attr("cy", trackingData.ball.y);

    ballGroup.select(".arrow-line")
        .attr("x1", trackingData.ball.x)
        .attr("y1", trackingData.ball.y)
        .attr("x2", trackingData.ball.x + trackingData.ball.vx)
        .attr("y2", trackingData.ball.y + trackingData.ball.vy);

    // Update line chart data
    if (slider.value >= lineData.length) {
        lineData.push({
            index: lineData.length,
            value: predictions.val
        });
        updateXScaleDomain(lineData.length); // Update xScale domain based on new lineData length
    } else {
        lineData = lineData.slice(0, +slider.value + 1);
        updateXScaleDomain(lineData.length); // Update xScale domain based on new lineData length
    }

    path.datum(lineData)
        .attr("d", line);
}

function animation_helper(trackingData, predictions) {
    // Update the xScale domain initially
    updateXScaleDomain(trackingData.length);

    // Initial configuration
    let currentFrame = 0;
    const totalFrames = trackingData.length;

    slider.max = totalFrames - 1;

    // Function to handle slider input
    slider.addEventListener("input", function () {
        currentFrame = +this.value; // Update current frame based on slider value
        updatePositions(trackingData[currentFrame], predictions[currentFrame]);
    });

    // Play and pause button event handler
    document.getElementById("playPauseButton").addEventListener("click", function () {
        if (isPlaying) {
            // If currently playing, pause the animation
            isPlaying = false;
            this.innerHTML = '▶️'; // Set to play symbol
        } else {
            // If currently paused, start the animation
            isPlaying = true;
            this.innerHTML = '⏸️'; // Set to pause symbol
            // Remove WhatIf Button
            whatIfButton = document.getElementById('whatIf')
            whatIfButton.style.display = 'none';

            // Remove WhatIf Prediction value
            whatIfPredValue = document.getElementById('predictionValue')
            whatIfPredValue.style.display = 'none';

            playAnimation();
        }
    });

    // Play animation function
    function playAnimation() {
        if (isPlaying && currentFrame < totalFrames) {
            updatePositions(trackingData[currentFrame], predictions[currentFrame]);
            slider.value = currentFrame; // Sync slider with current frame
            currentFrame++;
            setTimeout(playAnimation, 100); // Adjust the timeout for animation speed
        } else {
            isPlaying = false; // Stop the animation if we've reached the end
            document.getElementById("playPauseButton").innerHTML = '▶️'; // Reset button to play symbol if at the end
        }
    }
}
