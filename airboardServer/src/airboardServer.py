from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

# In-memory flight records storage
flights = {}

def add_random_flights():
    for i in range(1, 2):
        flights[i] = {
            "airport_ICAO": "JFK",
            "airline_name": "Delta",
            "expected_arrival_time": "2021-01-01T00:00:00",
            "expected_departure_time": "2021-01-01T00:00:00",
            "gate": "A1",
            "baggage_carousel": 1,
            "delayed": False,
            "cancelled": False,
            "gate_changed": False
        }

add_random_flights()

@app.route("/flights/<int:flight_number>", methods=["POST"])
def update_flight(flight_number):
    data = request.json
    required_fields = ["airport_ICAO", "airline_name", "expected_arrival_time", "expected_departure_time", "gate", "baggage_carousel"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    flights[flight_number] = {
        "flight_number": flight_number,
        "airport_ICAO": data["airport_ICAO"],
        "airline_name": data["airline_name"],
        "expected_arrival_time": data["expected_arrival_time"],
        "expected_departure_time": data["expected_departure_time"],
        "gate": data["gate"],
        "baggage_carousel": data["baggage_carousel"],
        "delayed": data.get("delayed", False),
        "cancelled": data.get("cancelled", False),
        "gate_changed": data.get("gate_changed", False)
        
    }
    return jsonify({"message": "Flight updated successfully"})
    
@app.route("/flights/", methods=["GET"])
def get_all_flight():
    flight_data = flights
    response = jsonify(flight_data)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
