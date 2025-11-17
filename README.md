# Employee Task App

A full-stack web application to manage employees and tasks with secure JWT authentication. Built with FastAPI, SQLAlchemy, MySQL, and Vanilla HTML/CSS/JS.

---

## 📁 Repository Structure

employee_task_app/     

backend/             
main.py
crud.py
models.py
schemas.py
database.py
requirements.txt   
.env.example       

frontend/            
index.html
script.js

---

## 🛠 Setup Instructions

### 1. Clone the Repository
git clone https://github.com/sarveshmathanraj02/employee_task_app.git  
cd employee_task_app/backend

---

### 2. Setup Backend

Create a virtual environment:
python -m venv venv

Activate the virtual environment:

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

Set up environment variables:

Copy .env.example → .env

Update values for DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, and SECRET_KEY if needed.

Run the backend server:
uvicorn main:app --reload

Backend will run at:
👉 http://127.0.0.1:8000

---

### 3. Setup Frontend
   
Navigate to frontend:
cd ../frontend

Start a local HTTP server:
python -m http.server 5500

Open the app:
👉 http://localhost:5500

Frontend will now communicate correctly with backend APIs.

---

## 🔌 API Endpoints

### Auth  
POST /signup/ → Create a new user  
POST /login/ → Login user and get JWT token  

### Employees (Protected)  
GET /employees/ → Get all employees  
POST /employees/ → Create employee  
GET /employees/{id} → Get employee by ID  
PUT /employees/{id} → Update employee  
DELETE /employees/{id} → Delete employee  

### Tasks (Protected)  
GET /tasks/ → Get all tasks  
POST /tasks/ → Create task  
GET /tasks/{id} → Get task by ID  
PUT /tasks/{id} → Update task  
DELETE /tasks/{id} → Delete task  

---

## ✨ Bonus Features Implemented

✔ JWT-based authentication  
✔ Edit/Delete for employees & tasks  
✔ Cascading deletes (when deleting employee)  
✔ Fully integrated frontend with live API calls  

---

## 📸 Demo Video

🎥 Watch Demo Video (Replace this link with your own):  
https://drive.google.com/your-video-link

---

## 🧰 Tech Stack Used

- **Backend**: FastAPI  
- **ORM**: SQLAlchemy  
- **Database**: MySQL  
- **Frontend**: HTML / CSS / JavaScript  
- **Security & Utilities**: JWT, Passlib, python-dotenv  

---

## 🧪 How to Contribute / Test

1. Clone the repo  
2. Follow setup instructions  
3. Run backend + frontend  
4. Test CRUD via UI or Postman  

---

## 👤 Author

**Sarvesh M**  
📧 Email: sarveshmathanraj2@gmail.com

---
