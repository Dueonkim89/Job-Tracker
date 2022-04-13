# Building and Test

### Installation

-   To install the necessary dependencies use: `npm install`
-   If running a local mysql, create a `.env` file and add the following:

```
DB_HOST="localhost"
DB_USER="root"
DB_PASS={put_password_here_if_any}
DB_DATABASE={put_password_here_if_any}
```

-   TODO: create script to set-up local copy of database with dummy data

### Running the Development Environment

-   To run the development server use: `npm run dev`
-   This command will serve the React client at localhost:3000 and the express server at localhost:3001
