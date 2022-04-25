# Building and Test

### Installation & Set-up

-   To install the necessary dependencies use: `npm install`
-   Create a `.env` file and add the following:

```
LOCAL_DB_HOST="localhost"
LOCAL_DB_USER="root"
LOCAL_DB_PASS="{password_here}"
LOCAL_DB_DATABASE="developmentdb"
AZURE_DB_HOST="jobtracker-mysql-server1.mysql.database.azure.com"
AZURE_DB_USER="osu467"
AZURE_DB_PASS="{password_here - get from Stanely}"
AZURE_DB_DATABASE="developmentdb"
JWT_SECRET="{secret_here}"
SESSION_SECRET="{secret_here}"
```

-   To swtich between localhost mysql and Azure, update `FLAGS.ts` to be `environment = AZURE` or `environment = LOCAL`
-   TODO: create script to set-up local copy of database with dummy data

### Running the Development Environment

-   To run the development server use: `npm run dev`
-   This command will serve the React client at localhost:3000 and the express server at localhost:3001
