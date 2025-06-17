# TalentTrack

TalentTrack is a fullstack project and task management platform designed to streamline collaboration, task assignments, and skill tracking for software development teams. It helps management assign tasks based on developer skills and tracks project progress using intuitive charts and visualizations.

##  Features

- Role-based authentication (Admin, Management, Development)
- Project and task management with status workflows
- Skill-based task assignment using compatibility matching
- File uploads per task with secure storage
- Interactive Gantt charts and status visualizations
- Editable task notes and comments
- Email verification via Brevo SMTP
- SQLite (local) and PostgreSQL (deployment-ready) support

##  Tech Stack

- **Backend:** Laravel 11 (PHP)
- **Frontend:** React.js with Inertia.js
- **Database:** SQLite (local), PostgreSQL (production)
- **Authentication:** Laravel Breeze
- **Email:** Brevo SMTP
- **Deployment:** Docker & Render

##  Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/talenttrack.git
   cd talenttrack

Install dependencies:

    composer install
    npm install

Setup .env and run:

    cp .env.example .env
    php artisan key:generate
    php artisan migrate --seed
    npm run dev
    php artisan serve

    Visit: http://localhost:8000

 Testing Users

    Admin: admin@example.com / 123.321A

    Manager: manager@example.com / 123.321A

    Developer: developer@example.com / 123.321A

(Add more via DatabaseSeeder if needed.)

 Future Enhancements

    Task dependencies

    Mobile-friendly layout

    Multi-user task assignments

    Notifications and reminders

    REST API support
