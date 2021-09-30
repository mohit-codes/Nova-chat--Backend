# Nova Chat Backend  

Backend using ExpressJS with Socket io connected to MongoDB through Mongoose

## List of API endpoints and Socket events

### Socket events

- "connectUser" listener - take user's name and emit array of online users to all connected users listening on event "onlineUsers"
- "startMessage" listener - take senderId and receiverEmail to add receiver to recipient list.
- "sendMessage" listener - take sender object, receiver object and message
  -  emit "newRecipient" event with message info if receiver is not present already in sender's chat list.
  -  else emit message info to receiver and sender by event "message".
- "sendGroupMessage" listener - take sender, group and message
  - emit "groupMessage" event into room associated with the group.
- "joinGroup" listener - take userInfo and group to join user client socket into the room associated to group.
  
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
- POST /messages/get_group_messages - Takes userId and groupId to fetch and return all messages.
- DELETE /messages/:messageId - delete message.
  
### Group
- GET /groups/members/:groupId - fetch group members.
- POST /groups/create - Providing (adminId : string), (groupName : string), (isPublic : bool), (description : string) would add a new group into the database.
- POST /groups/add_member - Takes email and groupId to add member to group.
- PUT /groups/update_group - Takes groupId, name, description, isPublic to update Group info.
- POST /groups/remove_member - Takes memberId and groupId to remove the member from group.
- DELETE /groups/:groupId" - deletes the group.
