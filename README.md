# Let's play noughts and crosses

Create a simple turn-based noughts and crosses game where two players can play against each other.

Implement the game logic to handle player moves, check for win conditions, and determine the end of the game.

## Requirements

### Backend API

- Implement an API to handle game logic and state management
- Endpoints / commands should include functionalities like:
  - Starting a new game
  - Making a move
  - Checking game status
  - Retrieving the current board state
- Use any programming language and framework of your choice (e.g., Django, Express.js, Rails, Gin, etc.)

### Frontend

- Develop a frontend interface where users can interact with the game
- The interface should allow players to see the current state of the game board, make a move, and display the winner or a draw when the game ends
- Utilize any frontend framework or library (e.g., React, Angular, Vue.js, plain HTML/CSS/JavaScript, etc.)
- If flashy graphics are not your thing, don't worry. For this assignment, function is more important than form

### General guidance

- For a datastore, it is acceptable for your application to just read from and write to a file on disk, rather than use a database solution
- We leave it to you to decide how to transmit the data between the client and the server
- You should use engineering best practices where appropriate. Principles we value include: performance, readability, testability, scalability, simplicity. You should also aim to achieve a clean separation of concerns between components of your solution; using the MVVM pattern, for example
- Please use git, and commit often so that we're able to see the stages you went through when approaching the problem
- Do not spend more than 2 hours on this. If you are unable to finish, then consider writing some notes on how you would have proceeded
- We're assessing **your** ability to program. Please no copy/pasting or use of AI

### Bonus points

- Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Provide Docker configuration files (Dockerfile, docker-compose.yml, etc.) to enable easy deployment and running of the application locally
- Write up a README with information on how to build / run and information on the architecture
- Include unit tests or integration tests to ensure the correctness of the game logic and API endpoints

### Submission

Either zip up your solution (including the .git folder) and send over, or share a link to a repository on a cloud git service, such as Github, Gitlab or Bitbucket.

## Building and Running the Application

### Local Development

#### Prerequisites

- Node.js v20 or later
- npm v9 or later

#### Server

```zsh
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

Server runs on http://localhost:3001

#### Client

```zsh
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

Client runs on http://localhost:3000

### Docker

```zsh
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```
