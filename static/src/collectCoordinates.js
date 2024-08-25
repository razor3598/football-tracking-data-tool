function collectCoordinates(){
    
    // Step 1: Gather Information
    const playerGroups = Array.from(document.querySelectorAll('.player-group')).filter(group => group.querySelector('.team-circle'));

    const players = playerGroups.map(group => {
        const teamCircles = group.querySelectorAll('.team-circle');
        return Array.from(teamCircles).map(circle => {
          const id = parseInt(circle.getAttribute('player_id'));
          const cx = parseFloat(circle.getAttribute('cx'));
          const cy = parseFloat(circle.getAttribute('cy'));
          const isAttackingTeam = parseInt(circle.getAttribute('is_attacking_team'));
          // Compute vx and vy from the line attributes
          const associatedLine = document.querySelector(`.arrow-line[player_id="${id}"]`);
          const x1 = parseFloat(associatedLine.getAttribute('x1'));
          const y1 = parseFloat(associatedLine.getAttribute('y1'));
          const x2 = parseFloat(associatedLine.getAttribute('x2'));
          const y2 = parseFloat(associatedLine.getAttribute('y2'));
    
          const vx = x2 - x1;
          const vy = y2 - y1;
    
          return {
            id: id,
            x: cx,
            y: cy,
            vx: vx,
            vy: vy,
            is_attacking_team: isAttackingTeam
          };
        });
      }).flat(); // Flatten the array since players can be nested

    
    // Step 2: Gather Ball Information
    const ballGroup = document.querySelector('#ballGroup');

    const teamCircle = ballGroup.querySelector('.team-circle');
    const associatedLine = document.querySelector(`.arrow-line[id="theball"]`);
    const x1 = parseFloat(associatedLine.getAttribute('x1'));
    const y1 = parseFloat(associatedLine.getAttribute('y1'));
    const x2 = parseFloat(associatedLine.getAttribute('x2'));
    const y2 = parseFloat(associatedLine.getAttribute('y2'));

    let vx = x2 - x1;
    let vy = y2 - y1;

    const ball = {
        x: parseFloat(teamCircle.getAttribute('cx')),
        y: parseFloat(teamCircle.getAttribute('cy')),
        vx: vx,
        vy: vy
    };
    
    // Step 3: Create JSON Object
    const data = {
        players: players,
        ball: ball
    };

    fetch('http://localhost:5000/collect_coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success');
        console.log('Prediction:', data.prediction);
        const spanElement = document.getElementById('predictionValue');
        // Update the span's content with the value from Flask
        spanElement.textContent = `Modified frame prediction is ${data.prediction}`;
        spanElement.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}
