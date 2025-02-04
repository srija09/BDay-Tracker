from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from collections import Counter

app = Flask(__name__)

# Configure session storage (stores session data on the server)
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "supersecretkey"  # Needed for session handling
Session(app)

# In-memory storage for birthdates (reset when server restarts)
birthdays = Counter()


@app.route("/")
def home():
    """Render the frontend page."""
    return render_template("index.html")


@app.route("/add_birthday", methods=["POST"])
def add_birthday():
    """Add a birthdate to the in-memory storage."""
    # if session.get("submitted"):
    #     return jsonify({"error": "You have already submitted your birthday"}), 400

    data = request.json
    birthdate = data.get("birthdate")

    if not birthdate:
        return jsonify({"error": "Birthdate is required"}), 400

    birthdays[birthdate] += 1  # Increment count for the birthdate

    # Store in session to prevent multiple submissions per session
    session["submitted"] = True  

    return jsonify({"message": "Birthday added successfully", "your_birthday": birthdate})


@app.route("/top_birthdays", methods=["GET"])
def top_birthdays():
    """Return the top 100 most common birthdates."""
    top_100 = birthdays.most_common(100)  # Get top 100 most common birthdays
    return jsonify({"top_birthdays": top_100})


if __name__ == "__main__":
    app.run(debug=True)
