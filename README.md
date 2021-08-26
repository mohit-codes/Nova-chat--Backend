# Nova Chat Backend 

Backend using ExpressJS connected to MongoDB through Mongoose

## List of API endpoints

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

<!-- ### Projects (Teams)

- POST /projects/create - Takes title, description and userId to create new project (description is optional ).
- POST /projects/join - Join project using project code and userId.
- PUT /projects/:projectId - Update details of project(except id and refs).
- DELETE /projects/:projectId - delete project.
- GET /projects/boards/:projectId - fetch all boards of the project.
- POST /projects/removeMember/:projectId - remove team member by memberId.
- GET /projects/:userId - fetch all projects of single user.
  
### Boards

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
- DELETE /comments/:commentId - delete comment. -->
