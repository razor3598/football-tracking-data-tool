// Set default configuration
const PITCH_ORIGIN_X = 0.0;
const PITCH_ORIGIN_Y = 0.0;
const PITCH_WIDTH = 105.0;
const PITCH_HEIGHT = 68.0;
const maxVelocity = 10;
const velocityOffset = 1;
const attacking_color = '#DA291C';
const defending_color = '#6CABDD';

let velocityText;

let animationData = [];

async function fetchAnimationData() {
    try {
        const response = await fetch('http://localhost:5000/animation-data', {
            method: 'POST',
            credentials: 'include'  // This ensures that cookies are sent with the request
        });
        if (response.ok) {
            animationData = await response.json();

            // Access the tracking_data and predictions from the combined animationData
            const trackingData = animationData.tracking_data;
            const predictions = animationData.predictions;
            
            // Now you can use trackingData and predictions as needed
            initializeVisualization(trackingData, predictions); // Pass the data to initialize your visualization


        } else {
            console.error('Failed to fetch animation data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching animation data:', error);
    }
}

// Get Frames Data
fetchAnimationData();

function initializeVisualization(trackingData, predictions) {

    // Call Animation Helper
    animation_helper(trackingData, predictions);

    // Initialize the visualization with the first frame
    updatePositions(trackingData[0], predictions[0]);

    // Define marker and color
    function createArrowhead(markerId, color) {
        layer.append("defs").append("marker")
            .attr("id", markerId)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 3)
            .attr("markerHeight", 3)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", color);
    }

    // Plot d3-soccer Pitch
    var pitch = d3.pitch().height(550)
    .rotate(false) 
    .showDirOfPlay(false)  
    .shadeMiddleThird(false) 
    .pitchStrokeWidth(.5)
    .goals("line")
    .clip([[PITCH_ORIGIN_X - maxVelocity, PITCH_ORIGIN_Y - maxVelocity], [PITCH_WIDTH + maxVelocity, PITCH_HEIGHT + maxVelocity]]);

    // GET SVG Object
    var svg = d3.select("#chart").call(pitch);
    const layer = svg.select("#above");

    // Create a group element for each player
    const playerGroups = layer.selectAll(".player-group")
        .data(trackingData[0].players, d => d.id)
        .enter()
        .append("g")
        .call(drag_movement) // Apply drag behavior to each player
        .attr("class", "player-group");

    // Append circles and arrows to each player group
    playerGroups.each(function(d) {
        if (d.is_attacking_team == 1) {
            color = attacking_color;
        } else {
            color = defending_color;
        }
        const group = d3.select(this);
        // Create unique marker ID for each color
        const markerId = `arrowhead-${color}`;
        createArrowhead(markerId, color);

        group.append("circle")
            .attr("class", "team-circle")
            .attr("cx", d.x)
            .attr("cy", d.y)
            .attr("player_id", d.id)
            .attr("is_attacking_team", d.is_attacking_team)
            .attr("r", 0.8) // Set the radius for players
            .attr("fill", color);

        group.append("line")
            .attr("class", "arrow-line")
            .attr("player_id", d.id)
            .attr("x1", d.x)
            .attr("y1", d.y)
            .attr("x2", d.x + velocityOffset) // Initial arrow endpoint, relative to the circle center
            .attr("y2", d.y + velocityOffset)
            .attr("stroke", color) // Line color based on player's color
            .attr("stroke-width", 0.3)
            .call(arrow_adjustment) // Apply arrow adjustment behavior
            .attr("marker-end", `url(#${markerId})`); // Set marker ID
    });

    // Create a group for the ball with drag behavior
    const ballGroup = layer.append("g")
        .attr("class", "circle-arrow-group")
        .attr("id", "ballGroup")
        .call(drag_movement); // Apply the same drag behavior to the ball

    // Create the ball element
    ballGroup.append("circle")
        .attr("class", "team-circle")
        .attr("cx", trackingData[0].ball.x) // Set the x position
        .attr("cy", trackingData[0].ball.y) // Set the y position
        .attr("r", 0.8);

    // Create the arrow (line) element within the ball group
    ballGroup.append("line")
        .attr("class", "arrow-line")
        .attr("x1", trackingData[0].ball.x)
        .attr("y1", trackingData[0].ball.y)
        .attr("x2", trackingData[0].ball.x + velocityOffset) // Initial arrow endpoint, relative to the circle center
        .attr("y2", trackingData[0].ball.y + velocityOffset)
        .attr("id", "theball")
        .attr("stroke", "black") // Line color
        .attr("stroke-width", 0.3)
        .attr("marker-end", "url(#arrowhead-black)") // Use a default arrowhead for the ball
        .call(arrow_adjustment); 

    // Create a default marker for the ball
    createArrowhead("arrowhead-black", "black");
}