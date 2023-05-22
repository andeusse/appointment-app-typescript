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
2. Run 'npm run dev' so we can run the backend program and make node aware of any change and compile again
3. Import the API collection file to postman, sign in as an admin and a customer and update the variables with the token for each kind of user
4. Give a try to all the endpoints
