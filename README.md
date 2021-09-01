# Nova Chat Backend  

Backend using ExpressJS with Socket io connected to MongoDB through Mongoose

## List of API endpoints and Socket events

### Socket events

- "connectUser" listener - take user's name and emit array of online users to all connected users listening on event "onlineUsers"
- "startMessage" listener - take senderId and receiverEmail to add receiver to recipient list.
- "sendMessage" listener - take sender object, receiver object and message
  -  emit "newRecipient" event with message info if receiver is not present already in sender's chat list.
  -  else emit message info to receiver and sender by event "message".
  
### Users

- POST /users/login - Takes username and password as a parameter and returns token and user.
- POST /users/signup - Providing name, password, and unique email would add a new user into the database.
- PUT  /users/update/:userId - Update details of user (except id).
- DELETE /users/:userId - delete user.
- GET  /get_by_Id/:userId  - get single user by id.
- POST /users/saveMessage - take userId and message to save it.
- DELETE /users/delete_saved_message  - take userId and message to delete it from Saved Messages.
- GET /users/get_by_Id/:userId - return user object.
- GET /users/recipients/:userId - fetch Recipients by userId
- GET /users/groups/:userId  - fetch Groups By userId.
- PUT /users/update/:userId - update User Details.
- DELETE /users/:userId - delete User

### Message

- POST /messages/get_messages - Takes senderId and receiverId to fetch and return all messages.

<!-- - POST /messages/join - Join project using project code and userId.
- PUT /messages/:projectId - Update details of project(except id and refs).
- DELETE /messages/:projectId - delete project.
- GET /messages/boards/:projectId - fetch all boards of the project.
- POST /projects/removeMember/:projectId - remove team member by memberId.
- GET /projects/:userId - fetch all projects of single user. -->
<!-- ### Boards

- POST /boards/create - Takes title and userId to add new board and returns boardId.
- GET /boards/:boardId - Fetch the details of single board.
- PUT /boards/:boardId - Update details of board (except id and ref).
- DELETE /boards/:boardId - delete board.
- GET /boards/lists/:boardId - fetch all lists of single board.
- GET /boards/:userId - fetch all boards of single user.

### Lists

- POST /lists/create - Takes title and boardId to add new list and returns listId.
- GET /lists/:listId - Fetch the details of single list.
- PUT /lists/:listId - Update details of list (except id and board ref).
- DELETE /lists/:listId - delete list.
- GET /lists/cards/:listId - fetch all cards of single list.

### Cards

- POST /cards/create - Takes title and listId to add new card and returns cardId (description is optional in request).
- PUT /cards/:cardId - Update details of card (except id and list ref).
- DELETE /cards/:cardId - delete card.
- GET cards/comments/:cardId - fetch all comments of single card.

### Comment

- POST /comments/create - Takes content, author and cardId to add new comment and returns commentId
- PUT /comments/:commentId - Update comment.
- DELETE /comments/:commentId - delete comment.  -->
