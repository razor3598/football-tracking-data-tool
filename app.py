# -*- coding: utf-8 -*-
"""
Created on Wed Jan 31 11:02:09 2024

@author: Amod
"""

# importing the required libraries
from dotenv import load_dotenv
from flask import Flask, request, render_template, jsonify, url_for, session, redirect
from flask_cors import CORS, cross_origin
import json
import random
import os

# Load environment variables from the .env file
load_dotenv()

# Dummy credentials. Use a DB & hashed password if in production.
APP_USERNAME = os.environ.get("APP_USERNAME")
APP_PASSWORD = os.environ.get("APP_PASSWORD")

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')
CORS(app, supports_credentials=True)  # Allow cookies and credentials

# Example data for dropdowns
'''
REPLACE WITH A LOGIC TO PULL IN ACTUAL DATA
'''
competitions = [{"id": 1, "name": "FA CUP 2024"}]
matches = {
    1: [{"id": 101, "name": "FINAL: Manchester United vs Manchester City"}]
}
sequences = {
    101: [{"id": 1001, "name": "Kobbie Mainoo Goal"}]
}


@app.route("/")
def home():
    if session.get("authorized"):
        return render_template('trackingtool.html')
    
    # Render login template with optional error message
    error = request.args.get('error', '')
    return render_template('login.html', error=error)

@app.route("/tracking_tool")
def tracking_tool():
    # Check if the user is authenticated to view the page
    if session.get('authorized'):
        return render_template('trackingtool.html')
    else:
        # Redirect to landing page if not authenticated
        return redirect(url_for('home'))
    
@app.route('/animation-data', methods=['POST'])
@cross_origin(supports_credentials=True)
def get_animation_data():
    # Open and read the JSON file
    with open('data/tracking_frames_1.json', 'r') as file:
        tracking_data = json.load(file)

    with open('data/predictions.json', 'r') as file:
        predictions = json.load(file)

    # Combine the data into a single dictionary
    combined_data = {
        'tracking_data': tracking_data,
        'predictions': predictions
    }

    # Return the combined data as JSON
    return jsonify(combined_data)

    
# Collect Data sent from 
@app.route('/collect_coordinates', methods=['POST'])
def receive_data():
    data = request.json
    # Generate a random float between 0 and 1
    prediction = round(random.random(), 2)
    return jsonify({'status': 'success', 'prediction': prediction}), 200


# Collect Data sent from 
@app.route('/check_dropdown')
def check_dropdown():
    # Check if the user is authenticated to view the page
    if session.get('authorized'):
        return render_template('dropdownselection.html')
    else:
        # Redirect to landing page if not authenticated
        return redirect(url_for('home'))

@app.route('/get-competitions', methods=['POST'])
def get_competitions():
    return jsonify(competitions)

@app.route('/get-matches', methods=['POST'])
def get_matches():
    competition_id = int(request.json.get('competition_id'))
    return jsonify(matches.get(competition_id, []))

@app.route('/get-sequences', methods=['POST'])
def get_sequences():
    match_id = int(request.json.get('match_id'))
    return jsonify(sequences.get(match_id, []))

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    # Validate credentials
    if username == APP_USERNAME and password == APP_PASSWORD:
        session['authorized'] = True
        return redirect(url_for('check_dropdown'))
    else:
        session['authorized'] = False
        return redirect(url_for('home' , error='Invalid Username or Password'))

@app.route('/logout')
def logout():
    session['authorized'] = False
    return redirect(url_for('home'))  # Redirect to the login page or another page

if __name__ == "__main__":
    app.run(debug = True)