const drag_movement = d3.drag()
    .on("drag", function() {
        if (!isPlaying) {
            // Get x1, y1 and x2,y2 position of the line
            let x1 = d3.select(this).select(".arrow-line").attr("x1")
            let y1 = d3.select(this).select(".arrow-line").attr("y1")
            let x2 = d3.select(this).select(".arrow-line").attr("x2")
            let y2 = d3.select(this).select(".arrow-line").attr("y2")

            // Calculate set angle and distance
            var velocity_arrow_length = Math.sqrt(Math.pow((x2 - x1), 2) +  Math.pow((y2 - y1), 2))
            var angle = Math.atan2((x2 - x1), (y2-y1))

            // Get the current x and y positions from the event
            let cx = d3.event.x;
            let cy = d3.event.y;

            // Get the new position from the drag event
            cx = Math.max(0, Math.min(d3.event.x, PITCH_WIDTH)); // Constrain within chart width
            cy = Math.max(0, Math.min(d3.event.y, PITCH_HEIGHT));  // Constrain within chart height

            // Update the position of the circle
            d3.select(this).select(".team-circle")
                .attr("cx", cx)
                .attr("cy", cy);

            // Update the x1,y1 position of the arrow
            d3.select(this).select(".arrow-line")
                .attr("x1", cx)
                .attr("y1", cy);

            // Update the x1,y1 position of the arrow
            d3.select(this).select(".arrow-line")
                .attr("x2", cx + velocity_arrow_length * Math.sin(angle))
                .attr("y2", cy + velocity_arrow_length * Math.cos(angle));
        }   
    })
    .on("end", function() {
        if (!isPlaying) {
            // Display WhatIf button
            whatIfButton = document.getElementById('whatIf')
            whatIfButton.style.display = 'block';
        }
    });

    // Define the drag behavior
    const arrow_adjustment = d3.drag()
    .on("start", function() {
        if (!isPlaying) {
            // Store the initial x1, y1 values when dragging starts
            const line = d3.select(this);
            line.datum({
                x1: +line.attr("x1"),
                y1: +line.attr("y1")
            });
        }
    })
    .on("drag", function() {
        if (!isPlaying) {
            if (!velocityText) {
                velocityText = d3.select(".circle-arrow-group") // or your container selection
                    .append("text")
                    .attr("id", "velocityText")
                    .attr("font-size", "2px")
                    .attr("fill", "black");
            }
            
            const line = d3.select(this);
            const x1 = line.datum().x1;
            const y1 = line.datum().y1;

            // Get the new x2, y2 values from the drag event
            const x2 = Math.max(0, Math.min(d3.event.x, PITCH_WIDTH));
            const y2 = Math.max(0, Math.min(d3.event.y, PITCH_HEIGHT));

            const velocity_arrow_length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            // Check if max velocity exceeded
            if (velocity_arrow_length <= maxVelocity + velocityOffset && velocity_arrow_length >= 0 + velocityOffset) {
                // Update the x2, y2 position of the arrow
                line
                    .attr("x2", x2)
                    .attr("y2", y2);

                // Update the text element with the current velocity_arrow_length
                if (velocityText) {
                    velocityText
                        .text(`${(velocity_arrow_length - velocityOffset).toFixed(2)} m/s`)
                        .attr("x", x2 + 1) // Position it near the end of the arrow
                        .attr("y", y2 + 1);
                }
            }
        }
    })
    .on("end", function() {
        if (!isPlaying) {
            // Hide or remove the text element when dragging stops
            if (velocityText) {
                velocityText.remove();
                velocityText = null; // Reset the variable
            }

            // Display WhatIf button
            whatIfButton = document.getElementById('whatIf')
            whatIfButton.style.display = 'block';

        }
    });