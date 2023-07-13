# Appointment App in typescript

This is an application used to manage an appointment system in a general doctor consultation. To run the application the first time, you must have in your local system:

- Docker
- Python
- Node
- Postman

To run the mongo data base and mongo-express, follow the next steps

1. Run docker
2. Compose-up the docker-compose.yml file
3. Create a virtual environment for python or use your local installation
4. Execute the file database.py to fill the data base with some users and some appointments

After making sure we have the last part working, jump to the backend folder and follow the next steps:

1. Run in the console 'npm install'
2. Copy the example file of the environment variables to the root folder of the background and change them:
   2.1 The status of the development
   2.2 The port for the API to use in production and development
   2.3 The connection string for the mongodb database in production and development
   2.4 The key for the JWT in production and development
3. Run 'npm run dev' so we can run the backend program and make node aware of any change and compile again
4. Import the API collection file to postman, sign in as an admin and a customer and update the variables with the token for each kind of user
5. Give a try to all the endpoints

The last part is way easy, go to the frontend folder and follow the next steps:

1. Run in the console 'npm install'
2. Copy the example file of the environment variables to the root folder of the frontend and change them:
   2.1 The status of the development
   2.2 The API url in production and development
3. Run 'npm start' so the frontend start working and looking for changes in the code
4. Give a try to the app for the 3 kind of users: Admin, Customer, Doctor
5. Enjoy!
