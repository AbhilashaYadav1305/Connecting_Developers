# Connecting_Developers
An Application to connect with Developers worldwide, built using MERN stack technologies.

#Features
- Model-View-Controller architecture .
- FrontEnd built using ReactJs and glbal state management using Redux.
- Backend built using NodeJs and ExpressJs. 
- Databse is being handled using MongoDB Atlas and modelling application data using Mongoose.
- REST api methods used to perform CRUD operations
- Design is responsive to different screen sizes.

#Setup Instructions
#Add a default.json file in config folder with the following
```
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
}
```

#Install server dependencies
```
npm install
```
#Install client dependencies
```
cd client
npm install
```
#Run both Express & React from root
```
npm run dev
```
