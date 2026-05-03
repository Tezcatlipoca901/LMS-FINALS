from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
# Enable CORS so your frontend (app.py running on port 5000) can request data from this API
CORS(app)

# Database configuration based on your MySQL Workbench setup
db_config = {
    'host': 'localhost',
    'user': 'root',         # Replace with your MySQL username
    'password': 'password123',         # Replace with your MySQL password
    'database': 'calendar'  # As seen in the provided screenshot
}

def get_db_connection():
    """Establish and return a database connection."""
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    """Fetch all announcements from the database and return as JSON."""
    try:
        conn = get_db_connection()
        # dictionary=True makes sure the data is returned as JSON-friendly objects, not just lists of values
        cursor = conn.cursor(dictionary=True) 
        
        # Query matching your table structure
        query = "SELECT id, event_name, event_date, description FROM announcements ORDER BY event_date ASC;"
        cursor.execute(query)
        
        announcements = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(announcements), 200
        
    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run on port 5001 so it doesn't conflict with app.py running on port 5000
    app.run(debug=True, host='0.0.0.0', port=5001)