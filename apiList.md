# LikeMind API's

### authRouter

- POST /auth/Signup
- POST /auth/Login
- POST /auth/LogOut

### prifleRouter

- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

- status ignore, interested, accepted, rejected

### connectionRequestRouter

- POST /request/send/:status/:userId --> ignored,interested

- POST /request/review/:status/:reviewId -->rejected,accepted

### userRouter

- GET /user/request/received
- GET /user/connections
- GET /user/feed - gets you the profile of other users
