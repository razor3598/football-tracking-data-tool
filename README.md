# Tracking Data Tool in Football

As football tracking data becomes more comprehensive, the use of machine learning models in the sport has surged. These models leverage vast amounts of tracking data, including player movements, ball trajectories, and team formations, to generate insights and predictions (For example - [See here](https://github.com/USSoccerFederation/ussf_ssac_23_soccer_gnn)). By analyzing this data, machine learning algorithms can enhance performance analysis, strategic planning, and player development. They help in identifying patterns and trends that were previously hidden, offering valuable information for coaches, analysts, and teams. As the volume and accuracy of tracking data continue to grow, the potential for machine learning to revolutionize football analysis and decision-making becomes increasingly significant.

Observing tracking data as video frames, provides a dynamic and intuitive way to visualize player and ball movements in real-time. This approach allows users to better understand the flow of the game and the impact of specific actions. The "what-if" analysis feature enhances its utility by enabling users to simulate various scenarios and assess their potential outcomes. Coaches, analysts, and teams can experiment with different strategies, player positionsto see how they might influence game performance. This repository provides a Flask backend server and a Javascript frontend for observing and analyzing the tracking data frames.


<p align="center">
  <img src="https://github.com/razor3598/football-tracking-data-tool/blob/main/example/clip.gif" alt="Example GIF">
</p>

---
## How to Run?
1. Install Python and relevant Flask libraries
   ```
   pip install Flask
   pip install Flask-Cors
   ```
2. Add a  ```.env``` file to your repository
   ```
   SECRET_KEY = # BAD_SECRET_KEY
   APP_USERNAME = # YOUR_USERNAME
   APP_PASSWORD = # ANY_PASSWORD
   ```
   A secret key that will be used for securely signing the session cookie and can be used for any other security related needs by extensions or your application. [Details here](https://flask.palletsprojects.com/en/2.3.x/config/#SECRET_KEY).

3. Open your terminal prompt, navigate to your directory and run the following command
   ```
   python app.py
   ```
   This will start a development server for testing. Head over to your browser and navigate to http://127.0.0.1:5000/

## If using in Production
If you plan on using the application in production a few things to take care of:
* Adjust Pitch dimensions. The current setup takes in coordinates ```x-cordinate -> (0, 105)``` and ```y-cordinate -> (0, 68)```.
* The tracking data takes in values in the format:
  ```
  [
      {"players": [
                  { "id": 1, "x": 40, "y": 10, "vx": 1, "vy": 1, "is_attacking_team": 1 }, 
                  { "id": 2, "x": 53, "y": 18, "vx": 5, "vy": 0, "is_attacking_team": 1 },
                  { "id": 3, "x": 45, "y": 27, "vx": 4.5, "vy": 0, "is_attacking_team": 1 }, 
                  { "id": 4, "x": 54, "y": 60, "vx": 6, "vy": -0.8, "is_attacking_team": 1 },
                  { "id": 5, "x": 88, "y": 34, "vx": -0.5, "vy": 0, "is_attacking_team": 0 },
                  { "id": 6, "x": 58, "y": 20, "vx": 5, "vy": 0, "is_attacking_team": 0 },
                  { "id": 7, "x": 53, "y": 28, "vx":3, "vy": 0, "is_attacking_team": 0 },
                  { "id": 8, "x": 58, "y": 34, "vx":5, "vy": 0, "is_attacking_team": 0 },
                  { "id": 9, "x": 58, "y": 44, "vx":5, "vy": 0, "is_attacking_team": 0 }
                  ], 
      "ball": { "x": 41, "y": 11, "vx": 1, "vy": 1 } 
      },
    {"players": [
                { "id": 1, "x": 60, "y": 10, "vx": 2, "vy": -1, "is_attacking_team": 1 }, 
                { "id": 2, "x": 75, "y": 20, "vx": 7, "vy": 2, "is_attacking_team": 1 },
                { "id": 3, "x": 72, "y": 27, "vx": 6, "vy": 3, "is_attacking_team": 1 }, 
                { "id": 4, "x": 80, "y": 60, "vx": 5, "vy": -0.8, "is_attacking_team": 1 },
                { "id": 5, "x": 96, "y": 34, "vx": -2, "vy": 0.3, "is_attacking_team": 0 },
                { "id": 6, "x": 75, "y": 24, "vx": 5, "vy": 1, "is_attacking_team": 0 },
                { "id": 7, "x": 68, "y": 26, "vx":3, "vy": 0, "is_attacking_team": 0 },
                { "id": 8, "x": 80, "y": 34, "vx":3, "vy": -3, "is_attacking_team": 0 },
                { "id": 9, "x": 86, "y": 44, "vx":3, "vy": 0, "is_attacking_team": 0 }
                ], 
    "ball": { "x": 81, "y": 60, "vx": 0.5, "vy": 0 } 
    }
  ]
  ```
 * Repalce this hard-coded logic with your logic to pull in data for competitions, matches, sequence, etc.
   ```
   competitions = [{"id": 1, "name": "FA CUP 2024"}]
   matches = {
       1: [{"id": 101, "name": "FINAL: Manchester United vs Manchester City"}]
   }
   sequences = {
       101: [{"id": 1001, "name": "Kobbie Mainoo Goal"}]
   }
   ```
   
   ```
   def get_animation_data():
    '''
    REPLACE THIS CODE BY RETRIEVING TRACKING DATA FROM YOUR DATABASE / FILES.
    '''
    # YOUR CODE HERE
   
   ```

   ```
   def receive_data():
      data = request.json
  
      '''
      CALL YOUR MODEL HERE
      '''
      # YOUR CODE HERE
   ```
* Use a database and hashed passwords for user authentication for enhanced security.

### Credits
Thanks to [Pieter Robberechts](https://twitter.com/p_robberechts) for his [d3 soccer plugin](https://github.com/probberechts/d3-soccer). 
   
