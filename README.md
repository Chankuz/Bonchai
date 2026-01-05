# BonChai - Tree Information Platform

BonChai is a blog-style web application where users can browse, read, and bookmark information about different tree species.

## Features

- Browse and read tree articles without logging in
- User registration and login system
- Add/remove trees from favorites (star icon)
- Personal favorites list for each user
- Session-based authentication
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: PHP (no framework)
- **Database**: MySQL
- **Infrastructure**: Docker, docker-compose
- **Web Server**: Apache (via PHP image)

## Prerequisites

- Docker
- Docker Compose

## Installation & Setup

1. Clone or navigate to the project directory:
```bash
cd Bonchai
```

2. Start the Docker containers:
```bash
docker-compose up -d
```

3. Wait for the containers to start (this may take a minute or two on first run)

4. Access the application:
   - **Main Application**: http://localhost:8080
   - **phpMyAdmin**: http://localhost:8081
     - Username: `root`
     - Password: `rootpassword`

## Database Configuration

The database is automatically initialized with:
- Database name: `bonchai`
- Username: `bonchai_user`
- Password: `bonchai_password`

Sample tree data is automatically loaded on first startup.

## Project Structure

```
Bonchai/
├── api/                 # PHP API endpoints
│   ├── auth.php        # Authentication endpoints
│   ├── trees.php       # Tree data endpoints
│   └── favorites.php   # Favorites management
├── assets/
│   ├── css/
│   │   └── style.css   # Main stylesheet
│   └── js/
│       ├── auth.js     # Authentication utilities
│       ├── main.js     # Home page functionality
│       ├── tree-detail.js  # Tree detail page
│       ├── login.js    # Login page
│       ├── signup.js   # Signup page
│       └── favorites.js # Favorites page
├── config/
│   └── database.php    # Database connection
├── index.php           # Home page
├── tree.php            # Tree detail page
├── login.php           # Login page
├── signup.php          # Signup page
├── favorites.php       # Favorites page
├── Dockerfile          # PHP + Apache container
├── docker-compose.yml  # Docker services configuration
├── init.sql            # Database schema and sample data
└── README.md           # This file
```

## Usage

### For Visitors
- Browse trees on the home page
- Click on any tree card to view details
- Search for trees using the search bar

### For Registered Users
- Sign up for a new account
- Log in to access favorites feature
- Click the star icon to add/remove trees from favorites
- View your favorites list from the navigation menu

## Stopping the Application

To stop the containers:
```bash
docker-compose down
```

To stop and remove volumes (this will delete the database):
```bash
docker-compose down -v
```

## Development

The project files are mounted as volumes, so changes to PHP, HTML, CSS, or JavaScript files will be reflected immediately after saving (you may need to refresh the browser).

## Security Features

- Password hashing using `password_hash()`
- Prepared statements to prevent SQL injection
- Session-based authentication
- Input validation and sanitization

## Notes

- The application uses Unsplash images for tree photos
- All text content is in Thai language
- The database is initialized with 9 sample trees

