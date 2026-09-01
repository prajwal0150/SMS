# School Management System (Simple Website)

A simple, working school management website built with **Python (FastAPI)** for
the backend and **MongoDB** for the database. Plain HTML pages — no React, no
build step.

## Features

- **Dashboard** — student/teacher counts, recent notices, upcoming events
- **Students** — add, view, remove student records (name, class, guardian, phone)
- **Teachers** — add, view, remove teacher records
- **Attendance** — mark Present/Absent/Late per class, per day, and revisit any date
- **Notices** — post announcements targeted at Whole School / Teachers / Parents
- **Events** — school calendar (exams, holidays, sports day, etc.)

## Requirements

- Python 3.9+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

1. **Install MongoDB** (if you don't have it):
   - macOS: `brew install mongodb-community && brew services start mongodb-community`
   - Windows/Linux: see https://www.mongodb.com/docs/manual/installation/
   - Or use a free cloud database at https://www.mongodb.com/cloud/atlas

2. **Install Python dependencies:**
   ```bash
   cd school-app
   pip install -r requirements.txt
   ```

3. **Point the app at your database** (only needed if not using local MongoDB):
   Edit `app/database.py` and change `MONGO_URI`, e.g.:
   ```python
   MONGO_URI = "mongodb+srv://<user>:<password>@<cluster>.mongodb.net"
   ```

4. **Run the app:**
   ```bash
   uvicorn app.main:app --reload
   ```

5. Open your browser at **http://127.0.0.1:8000**

## Project structure

```
school-app/
├── app/
│   ├── main.py          # All routes (pages + form handling)
│   └── database.py      # MongoDB connection + class list
├── templates/           # HTML pages (Jinja2)
│   ├── base.html         # Shared layout + sidebar nav
│   ├── dashboard.html
│   ├── students.html
│   ├── teachers.html
│   ├── attendance.html
│   ├── notices.html
│   └── events.html
├── static/css/style.css # All styling
└── requirements.txt
```

## How data is stored (MongoDB collections)

- `students` — `{ name, class_name, guardian, phone }`
- `teachers` — `{ name, subject, phone }`
- `attendance` — one document **per class per day**: `{ class_name, date, records: [{ student_id, status }] }`
- `notices` — `{ title, message, audience, date }`
- `events` — `{ title, date, description }`

## Next steps if you want to grow this

- Add login (Admin / Teacher / Parent roles) — the layout already has an
  `active` page indicator ready for a nav that changes per role.
- Add a Fees module using the same pattern as Attendance (one doc per
  student per term, with a `payments` array).
- Swap the class list in `app/database.py` for a real `classes` collection
  once you need to add/rename classes without editing code.
