# url-shortener
The frontend is built with Vue.js and provides a simple user interface that allows the user to convert a long link into a much shorter one. The backend built in Node and Express.js is linked to MongoDB. The URL the user sends in is stored in the database. In response, the user is given a link, which, when entered, makes a request to the database. That request gives back the stored URL and redirects to it.