# Intro to Backend

A beginner-friendly, modular REST API backend built with Node.js, Express.js, and MongoDB. This project demonstrates backend architecture fundamentals, including connecting to a cloud database (MongoDB Atlas), structuring code using the Model-Router-Controller pattern, hashing passwords securely, and building full CRUD endpoints.

---

## Technologies Used

* **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database & ODM:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
* **Security & Utilities:**
  * `bcrypt`: Secure password hashing before storing credentials in the database
  * `cors`: Cross-Origin Resource Sharing middleware
  * `cookie-parser`: Parsing incoming cookie headers
  * `dotenv`: Managing environment variables
* **Development Tools:**
  * `nodemon`: Automatically restarts the development server when code changes

---

## Project Structure

```text
intro-to-backend/
├── .env.example              # Template for required environment variables
├── .gitignore                # Excludes node_modules, .env, and OS/log files
├── package.json              # Project manifest, dependencies, and npm scripts
├── package-lock.json         # Dependency tree lockfile
├── README.md                 # Project documentation
└── src/
    ├── app.js                # Express application setup and global middleware
    ├── index.js              # Server entry point and database connection listener
    ├── config/
    │   └── database.js       # Asynchronous Mongoose connection to MongoDB Atlas
    ├── controllers/
    │   ├── post.controller.js # CRUD business logic for posts
    │   └── user.controller.js # User registration and password hashing logic
    ├── models/
    │   ├── post.model.js     # Post schema with ObjectId reference to User
    │   └── user.model.js     # User schema with unique validations
    └── routes/
        ├── post.routes.js    # Routes for post operations (/api/v1/posts)
        └── user.routes.js    # Routes for user operations (/api/v1/users)
```

---

## Prerequisites

* [Node.js](https://nodejs.org/) (v20.19 or higher)
* [npm](https://www.npmjs.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and database cluster

> **Important MongoDB Atlas Configuration:**
> Before running this project, you must whitelist your IP address in MongoDB Atlas:
> 1. Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
> 2. In the left navigation, go to **Security** > **Network Access**.
> 3. Click **Add IP Address**.
> 4. Select **Add Current IP Address** to authorize only your current IP address for security.
> 5. Confirm and wait for the status to become **Active**.

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devanshiyadav0305-wq/intro-to-backend.git
cd intro-to-backend
```

### 2. Install Dependencies

```bash
npm install
```
*(On Windows PowerShell, use `npm.cmd install` if script execution policies apply).*

### 3. Configure Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
# On Linux / macOS
cp .env.example .env

# On Windows PowerShell
Copy-Item .env.example .env
```

Open the `.env` file and provide your port and MongoDB Atlas connection string:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

> **Note:** Never commit the `.env` file or expose your database credentials. `.env` is excluded from version control by `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Once started successfully, the console will display:
```text
MongoDB connected successfully! DB Host: ...
Server is running on port 8000
```

To run the server in standard mode without automatic restarts:
```bash
npm start
```

---

## Data Models

### User Model (`src/models/user.model.js`)
Defines the schema for registered users:
* **`username`**: String, required, unique, whitespace trimmed.
* **`email`**: String, required, unique, lowercase, whitespace trimmed.
* **`password`**: String, required (hashed using `bcrypt` before storage).

### Post Model (`src/models/post.model.js`)
Defines the schema for posts:
* **`title`**: String, required, whitespace trimmed.
* **`content`**: String, required.
* **`author`**: Mongoose `ObjectId` referencing the `User` model (`ref: "User"`), required.

---

## API Endpoints

All API endpoints are mounted with the `/api/v1` prefix.

### User Routes (`/api/v1/users`)

| Method | Endpoint | Description | Request Body | Response Status |
|---|---|---|---|---|
| `POST` | `/api/v1/users/register` | Registers a new user. Checks for missing fields, checks for duplicate email/username, hashes password with `bcrypt`, and returns the created user (`_id`, `username`, `email`). Plaintext and hashed passwords are never returned. | `{ "username": "...", "email": "...", "password": "..." }` | `201 Created`<br>`400 Bad Request` |

### Post Routes (`/api/v1/posts`)

| Method | Endpoint | Description | Request Parameters / Body | Response Status |
|---|---|---|---|---|
| `POST` | `/api/v1/posts/create` | Creates a new post. Validates title, content, and author ID, verifies author exists, and links the post to the user. | Body: `{ "title": "...", "content": "...", "author": "<userId>" }` | `201 Created`<br>`400 Bad Request`<br>`404 Not Found` |
| `GET` | `/api/v1/posts/all` | Retrieves all posts from MongoDB. Uses `.populate("author", "username email")` to attach author information without exposing passwords. | *None* | `200 OK` |
| `PUT` | `/api/v1/posts/update/:id` | Updates an existing post's `title` and/or `content` by its post ID. Enforces schema validators (`runValidators: true`). | URL Param: `:id`<br>Body: `{ "title": "...", "content": "..." }` | `200 OK`<br>`404 Not Found` |
| `DELETE` | `/api/v1/posts/delete/:id` | Deletes a post by its post ID using `findByIdAndDelete`. | URL Param: `:id` | `200 OK`<br>`404 Not Found` |

---

## License

ISC

