# Building and Test

### Installation & Set-up

- Run the command `npm install` to install the necessary dependencies
- Create a `.env` file in the project root and add the following:

```
LOCAL_DB_HOST="localhost"
LOCAL_DB_USER="root"
LOCAL_DB_PASS="{your_localmysql_password_here}"
LOCAL_DB_DATABASE="developmentdb"
AZURE_DB_HOST="jobtracker.mysql.database.azure.com"
AZURE_DB_USER="osu467"
AZURE_DB_PASS="JobTracker1.0"
AZURE_DB_DATABASE="developmentdb"
JWT_SECRET="d5bb8b56620cc82ee7d0ebda543f26414e8547051469fe642a64100b918767c5ef5494efe3659742853f83d425562098ca450abbc8d38f3f5dfcc2aceb22b78a"
SESSION_SECRET="dfbPS6Zx8NZY/1g}3kSX"
```

### Running the Development Environment

- Make sure your localhost mysql server is running (likely using `mysql.server start`) and accessible at port 3306
- Run the command `npm run database:local` to set up the database schema and populate dummy data
- Run the command `npm run dev` to start  development server
  - Visit `localhost:3000` in your browser to view and interact with the website
  - The React client is served at localhost:3000 and the express server is served from localhost:3001
- To swtich between localhost mysql and Azure, update `FLAGS.ts` to be `environment = AZURE` or `environment = LOCAL`
