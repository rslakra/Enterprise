# e-commerce

---

The `e-commerce` project is a Spring Boot application for building e-commerce services.

## Tech Stack

- **Java**: 21
- **Spring Boot**: 3.5.7
- **Spring Data JPA**: For database operations
- **Spring Security**: For authentication and authorization
- **Liquibase**: For database migrations
- **H2 Database**: For development (file-based)
- **Thymeleaf**: For server-side HTML rendering
- **Maven**: For build and dependency management

## Types of E-commerce

- Business-to-Business (B2B)
- Business-to-Consumer (B2C)
- Consumer-to-Consumer (C2C)
- Consumer-to-Business (C2B)

## Features

- User authentication (login, logout, password recovery)
- Role-based access control
- Product management
- Task management
- Marketing campaigns
- Content taxonomy management
- REST API for external integrations
- CSV/Excel file upload and download

## Prerequisites

- Java 21 or later
- Maven 3.8+

## Building the Application

```bash
# Build with tests
./buildMaven.sh

# Or using Maven directly
mvn clean install
```

## Running the Application

```bash
# Using the run script
./runMaven.sh

# Or using Maven directly
mvn clean spring-boot:run
```

## Application URLs

Once running, the application is available at:

| URL | Description |
|-----|-------------|
| http://localhost:9080/ecommerce | Main application |
| http://localhost:9080/ecommerce/h2 | H2 Database Console |
| http://localhost:9081/actuator | Management endpoints |

## Default Credentials

| Username | Password |
|----------|----------|
| admin | Admin123 |

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rest/roles` | List all roles |
| POST | `/rest/roles` | Create a role |
| PUT | `/rest/roles` | Update a role |
| DELETE | `/rest/roles/{id}` | Delete a role |
| GET | `/rest/users` | List all users |
| POST | `/rest/users` | Create a user |
| PUT | `/rest/users` | Update a user |
| DELETE | `/rest/users/{id}` | Delete a user |
| GET | `/rest/tasks` | List all tasks |
| POST | `/rest/tasks` | Create a task |
| PUT | `/rest/tasks` | Update a task |
| DELETE | `/rest/tasks/{id}` | Delete a task |
| GET | `/rest/marketing` | List all marketing campaigns |
| GET | `/rest/content-taxonomy` | List all content taxonomies |

## Web Controllers

| URL | Description |
|-----|-------------|
| `/` or `/index` | Home page |
| `/home` | Dashboard |
| `/auth/login` | Login page |
| `/roles/list` | Roles management |
| `/users/list` | Users management |
| `/tasks/list` | Tasks management |
| `/marketing/list` | Marketing management |
| `/content-taxonomy/list` | Content taxonomy management |

## Configuration

Key configuration properties in `application.properties`:

```properties
# Server
server.port=9080
server.servlet.contextPath=/ecommerce

# Database
spring.datasource.url=jdbc:h2:file:~/Downloads/H2DB/e-commerce;AUTO_SERVER=TRUE;

# Security
spring.security.user.name=admin
spring.security.user.password=Admin123
```

## Project Structure

```
e-commerce/
├── src/
│   ├── main/
│   │   ├── java/com/rslakra/iws/ecommerce/
│   │   │   ├── account/          # User and Role management
│   │   │   ├── advertising/      # Content taxonomy
│   │   │   ├── alert/            # Event services
│   │   │   ├── framework/        # Base classes and utilities
│   │   │   ├── marketing/        # Marketing campaigns
│   │   │   ├── order/            # Order/Transaction management
│   │   │   ├── process/          # Schema management
│   │   │   ├── product/          # Product management
│   │   │   ├── project/          # Project/Feature management
│   │   │   ├── report/           # Reporting
│   │   │   └── task/             # Task management
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── db/changelog/     # Liquibase migrations
│   │       ├── static/           # Static assets (CSS, JS, images)
│   │       └── templates/        # Thymeleaf templates
│   └── test/
│       └── java/                 # Test classes
├── buildMaven.sh                 # Build script
├── runMaven.sh                   # Run script
├── pom.xml                       # Maven configuration
└── README.md
```

## Database

The application uses H2 database by default with file-based storage at `~/Downloads/H2DB/e-commerce`.

Database migrations are managed by Liquibase and located in `src/main/resources/db/changelog/`.

## Author

---

- Rohtash Lakra
