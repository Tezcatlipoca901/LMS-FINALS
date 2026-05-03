from flask import Flask, render_template, request, redirect, url_for, session, flash
import mysql.connector
from flask import jsonify
import os

app = Flask(__name__)
app.secret_key = '27a95a254431fb7ad835f155bfa2b71ca6e6e7c69ae434325cfcb21869aaa8ba'

# --- API ROUTES ---
@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    """Fetch all announcements from the database and return as JSON."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) 
        
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

# Configure upload folder for images
UPLOAD_FOLDER = 'static/images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# announcements
db_config = {
    'host': 'localhost',
    'user': 'root',         
    'password': 'password123',         # Leave blank if XAMPP default, or 'password123' if you set it to that
    'database': 'calendar'  
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# DUMMY USERS (NO DATABASE)
USERS = {
    "student1": {
        "password": "123",
        "role": "student"
    },
    "instructor1": {
        "password": "123",
        "role": "instructor"
    },
    "admin1": {
        "password": "123",
        "role": "admin"
    }
}

# LOGIN PAGE
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('studentNumber')
    password = request.form.get('password')
    user = USERS.get(username)

    if user and user['password'] == password:
        session['logged_in'] = True
        session['username'] = username
        session['role'] = user['role']

        if user['role'] == 'student':
            return redirect(url_for('dashboard'))
        elif user['role'] == 'instructor':
            return redirect(url_for('instructor_dashboard'))
        elif user['role'] == 'admin':
            return redirect(url_for('admin_dashboard'))

    # Wrong credentials → flash and redirect
    flash('Incorrect username or password.', 'error')
    return redirect(url_for('index')) 
# ROUTES 

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# STUDENT DASHBOARD ROUTES

@app.route('/student/dashboard')
def dashboard():
    if not session.get('logged_in') or session.get('role') != "student":
        return redirect(url_for('index'))
    return render_template('student/dashboard.html')

@app.route('/student/enrollment')
def enrollment():
    """Student enrollment information"""
    return render_template('student/enrollment.html')

@app.route('/student/irregular')
def irregular():
    """Student irregular enrollment information"""
    return render_template('student/irregular.html')

@app.route('/student/grades')
def grades():
    """Student grades"""
    return render_template('student/grades.html')
# Professor evaluation (In Grades page)
@app.route("/student/evaluation")
def evaluation():
    return render_template("student/evaluation.html")

@app.route('/student/courses')
def courses():
    """Student courses"""
    return render_template('student/courses.html')

@app.route('/student/account-info')
def account_info():
    """Student account information"""
    return render_template('student/account_info.html')

@app.route('/student/inbox')
def inbox():
    """Student inbox"""
    if not session.get('logged_in') or session.get('role') != "student":
        return redirect(url_for('index'))
    return render_template('student/inbox.html')

@app.route("/student/application")
def graduation_application():
    return render_template("student/graduation_application.html")

@app.route("/student/student-application", methods=["GET", "POST"])
def student_application():
    return render_template("student/student_application.html")

@app.route("/student/application")
def tor_request():
    return render_template("student/tor_request.html")

@app.route("/student/application")
def leave_of_absence():
    return render_template("student/leave_of_absence.html")

@app.route("/student/application")
def withdraw_drop():
    return render_template("student/withdraw_drop.html")

@app.route('/student/send-message', methods=['POST'])
def send_message():
    """
    Handle message submission
    TODO: Save message to database
    """
    to = request.form.get('msgTo')
    subject = request.form.get('msgSubject')
    body = request.form.get('msgBody')
    
    # TODO: Save to database
    print(f"Message from {session.get('student_number')} to {to}: {subject}")
    
    return redirect(url_for('compose_message'))

# INSTRUCTOR DASHBOARD ROUTES

@app.route('/instructor/dashboard')
def instructor_dashboard():
    if not session.get('logged_in') or session.get('role') != "instructor":
        return redirect(url_for('index'))
    return render_template('instructor/instructor_dashboard.html')

# My Classes - View assigned classes
@app.route('/instructor/classes')
def instructor_classes():
    return render_template('instructor/instructor_classes.html')

# Teaching Schedule
@app.route('/instructor/schedule')
def instructor_schedule():
    return render_template('instructor/instructor_schedule.html')

# Grade Management (Gradebook)
@app.route('/instructor/grades')
def instructor_grades():
    return render_template('instructor/instructor_grades.html')

# Student Records Access
@app.route('/instructor/students')
def instructor_students():
    return render_template('instructor/instructor_students.html')

# Attendance Management
@app.route('/instructor/attendance')
def instructor_attendance():
    return render_template('instructor/instructor_attendance.html')

# Academic Applications Handling
@app.route('/instructor/applications')
def instructor_applications():
    return render_template('instructor/instructor_applications.html')

# Instructor Account/Profile
@app.route('/instructor/account')
def instructor_account():
    return render_template('instructor/instructor_account.html')

# Messages (Compose)
@app.route('/instructor/messages')
def instructor_messages():
    return render_template('instructor/instructor_messages.html')

# Inbox (System notifications)
@app.route('/instructor/inbox')
def instructor_inbox():
    return render_template('instructor/instructor_inbox.html')

# ADMIN DASHBOARD ROUTES

@app.route('/admin/dashboard')
def admin_dashboard():
    if not session.get('logged_in') or session.get('role') != "admin":
        return redirect(url_for('index'))
    return render_template('admin/admin_dashboard.html')

@app.route('/admin/master-data')
def admin_master_data():
    """Master Data Management - Courses, Programs, Sections, Academic Calendar"""
    return render_template('admin/admin_master_data.html')

# USER & ROLE MANAGEMENT ROUTES
@app.route('/admin/users')
def admin_users():
    """Manage Users - Create, Edit, Archive Users"""
    return render_template('admin/admin_users.html')

@app.route('/admin/admin-acc-info')
def admin_acc_info():
    """Account Information of admin"""
    return render_template('admin/admin_acc_info.html')

# STUDENT MANAGEMENT ROUTES
@app.route('/admin/student-records')
def admin_student_records():
    """Student Records - Manage Student Profiles, Demographics, Enrollment History"""
    return render_template('admin/admin_student_records.html')

@app.route('/admin/applications')
def admin_applications():
    """Application Approvals - Review/Approve Student Requests"""
    return render_template('admin/admin_applications.html')

# INSTRUCTOR MANAGEMENT ROUTES
@app.route('/admin/instructors')
def admin_instructors():
    """Manage Instructors - Create, Edit, Assign Courses"""
    return render_template('admin/admin_instructors.html')

@app.route('/admin/schedule')
def admin_schedule():
    """Scheduling & Timetable - Create Class Schedules, Assign Rooms"""
    return render_template('admin/admin_schedule.html')

# GRADES & ATTENDANCE ROUTES
@app.route('/admin/grades')
def admin_grades():
    """Grade Overrides - Enter/Adjust Grades"""
    return render_template('admin/admin_grades.html')

@app.route('/admin/attendance')
def admin_attendance():
    """Attendance Overrides - Mark/Edit Attendance Records"""
    return render_template('admin/admin_attendance.html')

@app.route('/admin/audit')
def admin_audit():
    """Degree Audit - Track Graduation Progress"""
    return render_template('admin/admin_audit.html')

# COMMUNICATION ROUTES
@app.route('/admin/announcements')
def admin_announcements():
    """System Announcements - Create and Manage Announcements"""
    return render_template('admin/admin_announcements.html')

@app.route('/admin/messaging')
def admin_messaging():
    """Messaging - Email/SMS Notifications"""
    return render_template('admin/admin_messaging.html')

# SYSTEM & SETTINGS ROUTES
@app.route('/admin/system-settings')
def admin_system_settings():
    """System Settings - Security, Privacy, Password Management"""
    return render_template('admin/admin_system_settings.html')

@app.route('/admin/integrations')
def admin_integrations():
    """Integrations - LMS, Finance, Payments, SSO"""
    return render_template('admin/admin_integrations.html')

# ========== ERROR HANDLERS ==========

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return "Page not found", 404


@app.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors"""
    return "Internal server error", 500

# ========== LMS CONNECTION ==========
@app.route('/lms', methods= ['GET'])
def lms_connection():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')

    if role == "student":
        return redirect(url_for('student_home'))
    elif role == "instructor":
        return redirect(url_for('instructor_home'))

    return redirect(url_for('index')) 

@app.route('/sis', methods= ['GET'])
def sis_connection():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')

    if role == "student":
        return redirect(url_for('dashboard'))
    elif role == "instructor":
        return redirect(url_for('instructor_dashboard'))

    return redirect(url_for('index')) 


# ===== STUDENT LMS ========
@app.route('/student/home', methods= ['GET'])
def student_home():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/home.html')
    return redirect(url_for('index')) 

@app.route('/student/calendar', methods= ['GET'])
def student_calendar():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/calendar.html')
    return redirect(url_for('index')) 

@app.route('/student/course-overview', methods= ['GET'])
def student_course_overview():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/course-overview.html')
    return redirect(url_for('index')) 

@app.route('/student/lmscourses', methods= ['GET'])
def student_lmscourses():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/courses.html')
    return redirect(url_for('index')) 

@app.route('/student/lmsinbox', methods= ['GET'])
def student_lmsinbox():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/inbox.html')
    return redirect(url_for('index')) 

@app.route('/student/profile', methods= ['GET'])
def student_profile():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/profile.html')
    return redirect(url_for('index')) 

@app.route('/student/quiz', methods= ['GET'])
def student_quiz():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/quiz.html')
    return redirect(url_for('index')) 

@app.route('/student/seatwork', methods= ['GET'])
def student_seatwork():
    
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "student":
        return render_template('lms-student/seatwork.html')
    return redirect(url_for('index')) 


# ===== INSTRUCTOR LMS ========
@app.route('/instructor/home' , methods= ['GET'])
def instructor_home():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "instructor":
        return render_template('lms-instructor/instructor-home.html')
    return redirect(url_for('index')) 
    

@app.route('/instructor/profile', methods= ['GET'])
def instructor_profile():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "instructor":
        return render_template('lms-instructor/instructor-profile.html')
    return redirect(url_for('index')) 

@app.route('/instructor/course-list', methods= ['GET'])
def instructor_course_list():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "instructor":
        return render_template('lms-instructor/instructor-course-list.html')
    return redirect(url_for('index')) 

@app.route('/instructor/course-overview', methods= ['GET'])
def instructor_course_overview():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "instructor":
        return render_template('lms-instructor/instructor-course-overview.html')
    return redirect(url_for('index')) 

@app.route('/instructor/lmsinbox', methods= ['GET'])
def instructor_lmsinbox():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "instructor":
        return render_template('lms-instructor/instructor-inbox.html')
    return redirect(url_for('index')) 


@app.route('/instructor/calendar', methods= ['GET'])
def instructor_lmscalendar():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    
    role = session.get('role')
    
    if role == "instructor":
        return render_template('lms-instructor/instructor-calendar.html')
    return redirect(url_for('index')) 

# ========== RUN APPLICATION ==========

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)