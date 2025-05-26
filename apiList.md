# LikeMind API's

### authRouter

- POST /auth/Signup
- POST /auth/Login
- POST /auth/LogOut

### prifleRouter

- PATCH /profile/edit
- GET /profile/view
- PATCH /prfile/password

- status ignore, interested, accepted, rejected

### connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:reviewId
- POSt /request/review/rejected/:reviewId

### userRouter

- GET /user/connections
- GET /user/request/received
- GET /user/feed - gets you the profile of other users
