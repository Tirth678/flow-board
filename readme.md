# 📋 Flow Board - Collaborative Project Management Platform

##  Project Description

**Flow Board** is a full-stack collaborative project management application designed to help teams organize, track, and manage their workflow efficiently. Inspired by modern productivity tools like Trello, Asana, and Monday.com, Flow Board combines intuitive Kanban-style boards with powerful team collaboration features. 

The platform enables users to:
- Create and manage multiple organizations
- Build teams with role-based access control
- Create customizable Kanban boards with flexible columns
- Manage tasks through an intuitive card system
- Collaborate in real-time with team members
- Track project progress and team productivity

Whether you're managing a startup project, coordinating a development team, or organizing personal tasks, Flow Board provides the flexibility and power needed for effective project management.

---

##  Technologies & Stack

### Backend Architecture
- **Runtime Environment**: Node.js (v14+)
- **Web Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Validation**: express-validator for input sanitization
- **HTTP Logging**: Morgan middleware for request tracking
- **Session Management**: Cookie-parser for secure session handling
- **Email Service**: Mailtrap for transactional emails
- **Development Tools**: Nodemon for hot-reload during development

### Frontend Stack
- **Markup**: HTML5 with semantic elements
- **Styling**: CSS3 with responsive design patterns
- **Scripting**: Vanilla JavaScript (ES6+)
- **Architecture**: MVC-inspired client-side structure
- **API Communication**: Fetch API for REST endpoints
- **State Management**: Client-side session storage

### Infrastructure & Deployment
- **API Architecture**: RESTful with JSON payloads
- **Port Configuration**: Backend on port 3001, Frontend on port 8000
- **Session Persistence**: Cookie-based with JWT tokens
- **Database Connection**: Mongoose with MongoDB Atlas support
- **Environment Management**: dotenv for configuration

---

##  Core Features

### 1️ User Authentication & Account Management
- **Secure Registration**: Email-based signup with password strength validation
- **Login System**: JWT-based authentication with token refresh capability
- **Password Security**: Bcrypt hashing with salt rounds for maximum security
- **Session Management**: Persistent sessions with cookie storage
- **Logout Functionality**: Secure token invalidation and session cleanup
- **Password Recovery**: Email-based password reset via Mailtrap integration
- **User Roles**: Admin and regular user roles with different permissions
- **Profile Management**: User profile customization and settings

**Implementation Details**:
- JWT tokens stored in HTTP-only cookies for security
- Token verification on every protected route
- Automatic token refresh for seamless user experience
- Password hashing with bcrypt (10 salt rounds)

### 2️ Organization Management
- **Organization Creation**: Users can create multiple organizations
- **Team Building**: Add and manage team members within organizations
- **Role-Based Access**: Admin, Editor, and Viewer roles
- **Member Invitation**: Invite team members via email
- **Organization Settings**: Customize organization details and preferences
- **Member Permissions**: Granular control over member access levels
- **Organization Isolation**: Data segregation between organizations
- **Member Activity Tracking**: Monitor team member contributions

**Key Capabilities**:
- Unique organization names per creator
- Indexed queries for fast member lookups
- Role-based authorization checks on all operations
- Organization-level data isolation

### 3️ Board Management (Kanban Boards)
- **Board Creation**: Create unlimited boards within organizations
- **Customizable Columns**: Define workflow stages (To Do, In Progress, Done, etc.)
- **Board Description**: Add detailed board descriptions and guidelines
- **Board Sharing**: Share boards with team members
- **Board Settings**: Configure board preferences and visibility
- **Board Deletion**: Archive or permanently delete boards (admin only)
- **Board Listing**: View all boards within an organization
- **Timestamps**: Track board creation and modification dates

**Technical Implementation**:
- Boards linked to organizations and creators
- Automatic timestamp tracking (createdAt, updatedAt)
- Membership verification before board access
- Admin-only deletion with proper authorization checks

### 4️ Card Management (Task Management)
- **Card Creation**: Create tasks/cards on boards with title and description
- **Card Status Tracking**: Three-state workflow (up_next, in_progress, done)
- **Card Assignment**: Assign cards to team members
- **Card Editing**: Update card details and descriptions
- **Card Deletion**: Remove cards (admin access required)
- **Card Listing**: View all cards on a board with filtering
- **Card Timestamps**: Track card creation and updates
- **Card Metadata**: Store creator information and board references

**Status Workflow**:
```
up_next → in_progress → done
```

**Features**:
- Drag-and-drop card movement between columns (frontend)
- Card detail modal with full information
- Bulk operations on cards
- Card history and activity tracking

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `C` | Create new card | Board view |
| `/` | Open global search | Anywhere |
| `Esc` | Close modal/dialog | Modal open |
| `Ctrl/Cmd + S` | Save changes | Form editing |
| `Ctrl/Cmd + Z` | Undo last action | Board view |
| `Ctrl/Cmd + Shift + Z` | Redo action | Board view |
| `@` | Mention team member | Comment field |
| `Tab` | Navigate form fields | Forms |
| `Enter` | Submit form | Forms |
| `Shift + Enter` | New line in textarea | Text areas |
| `?` | Show help/shortcuts | Anywhere |
| `N` | Create new board | Organization view |
| `O` | Switch organization | Anywhere |
| `B` | Go to boards | Anywhere |

---

## 🏗️ The Build Process: How I Built It

### Phase 1: Backend Foundation ✅ (Completed)

**Objectives Achieved**:
- Set up Express.js server with middleware pipeline
- Configured MongoDB connection with Mongoose
- Implemented environment variable management
- Created modular folder structure (MVC pattern)

**Key Implementations**:
```javascript
// Express app with middleware chain
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI)
```

**Learnings**:
- Middleware execution order matters
- Proper error handling prevents cascading failures
- Environment variables keep sensitive data secure

---

### Phase 2: Database Schema Design ✅ (Completed)

**Models Created**:

1. **User Model**
   - Username (unique)
   - Email (unique)
   - Password (hashed)
   - Role (user/admin)

2. **Organization Model**
   - Organization name (unique per creator)
   - Description
   - Creator reference
   - Composite index on (orgName, createdBy)

3. **OrgMember Model**
   - Organization reference
   - User reference
   - Role assignment
   - Membership tracking

4. **Board Model**
   - Board name
   - Description
   - Organization reference
   - Creator reference
   - Timestamps

5. **Card Model**
   - Title
   - Description
   - Status (up_next, in_progress, done)
   - Board reference
   - Creator reference
   - Timestamps

6. **Session Model**
   - User reference
   - Token storage
   - Session expiry

**Design Decisions**:
- Normalized schema to avoid data duplication
- References instead of embedding for flexibility
- Timestamps on all models for audit trails
- Composite indexes for query optimization

---

### Phase 3: Authentication System ✅ (Completed)

**Implementation**:
- JWT token generation on login
- Bcrypt password hashing on registration
- Token verification middleware
- Cookie-based token storage
- Token refresh mechanism

**Security Features**:
- HTTP-only cookies prevent XSS attacks
- Bcrypt with 10 salt rounds
- Token expiration handling
- Secure logout with token invalidation

**Code Structure**:
```javascript
// Auth middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) return res.status(401).json({message: "No token"});
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({message: "Invalid token"});
    }
}
```

---

### Phase 4: API Endpoints Development ✅ (Completed)

**Authentication Routes** (`/api/auth`)
- `POST /register` - User registration with validation
- `POST /login` - User login with JWT generation
- `POST /logout` - Session termination
- `POST /refresh-token` - Token refresh

**Organization Routes** (`/api/org`)
- `POST /:orgId/members` - Add member to organization
- `GET /:orgId/members` - List organization members
- `DELETE /:orgId/members/:memberId` - Remove member
- `PUT /:orgId` - Update organization details
- `GET /` - List user's organizations

**Board Routes** (`/api/board`)
- `POST /:orgId` - Create board in organization
- `GET /:orgId` - List boards in organization
- `PUT /:boardId` - Update board details
- `DELETE /:boardId` - Delete board (admin only)
- `GET /:boardId/cards` - Get board cards

**Card Routes** (`/api/card`)
- `POST /:boardId` - Create card on board
- `GET /:boardId` - Get all cards on board
- `PUT /:cardId` - Update card details
- `PATCH /:cardId/status` - Update card status
- `DELETE /:cardId` - Delete card (admin only)

**Error Handling**:
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging
- Try-catch blocks on all async operations

---

### Phase 5: Validation & Middleware ✅ (Completed)

**Validation Middleware**:
- Email format validation
- Password strength requirements
- Required field checks
- Data type validation
- Input sanitization

**Authentication Middleware**:
- Token verification on protected routes
- User context injection
- Authorization checks

**Error Handling Middleware**:
- Global error handler
- Request logging with Morgan
- Error response formatting

---

### Phase 6: Frontend Setup 🔄 (In Progress)

**Current Status**:
- HTML structure created
- CSS framework initialized
- JavaScript module setup
- API integration layer started

**Next Steps**:
- Build responsive layouts
- Implement Kanban board UI
- Create modal components
- Add drag-and-drop functionality

---

### Phase 7: UI/UX Implementation 📋 (Planned)

**Planned Features**:
- Responsive design for all screen sizes
- Kanban board with drag-and-drop
- Card detail modals
- Real-time collaboration indicators
- Mobile-optimized interface
- Dark mode support
- Accessibility compliance

---

## 📚 What I Learned

### Backend Development Mastery
- **RESTful API Design**: Proper endpoint structure, HTTP methods, status codes
- **Express.js Patterns**: Middleware chains, error handling, routing
- **Async/Await**: Promise handling and error management
- **Request Validation**: Input sanitization and data validation
- **Error Handling**: Try-catch blocks, error propagation, user-friendly messages

### Database Design & Optimization
- **MongoDB Schema Design**: Normalization vs. denormalization trade-offs
- **Mongoose ODM**: Schema definition, relationships, indexing
- **Query Optimization**: Composite indexes, query performance
- **Data Relationships**: References vs. embedding decisions
- **Audit Trails**: Timestamp tracking for data integrity

### Security Best Practices
- **Password Security**: Bcrypt hashing, salt rounds, secure storage
- **JWT Authentication**: Token generation, verification, refresh
- **Session Management**: Cookie security, HTTP-only flags
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Preventing injection attacks
- **CORS & Headers**: Security headers configuration

### Software Architecture
- **MVC Pattern**: Separation of concerns (Models, Views, Controllers)
- **Modular Code**: Reusable components and functions
- **Configuration Management**: Environment variables, config files
- **Code Organization**: Logical folder structure
- **Scalability**: Designing for growth and maintenance

### Development Practices
- **Version Control**: Git workflow and commit practices
- **Debugging**: Console logging, error tracking
- **Documentation**: Code comments and README
- **Testing Mindset**: Thinking about edge cases
- **Performance**: Efficient queries and response times

### Problem-Solving
- **Debugging Complex Issues**: Tracing through middleware chains
- **Database Relationships**: Designing proper data models
- **Authorization Logic**: Implementing role-based access
- **Error Messages**: Creating helpful user feedback

---

## 📐 Project Structure & Coordinates

### Directory Layout
```
Flow-Board/
│
├── BE/                                    # Backend Application
│   ├── src/
│   │   ├── app.js                        # Express app configuration
│   │   ├── server.js                     # Entry point (port 3001)
│   │   │
│   │   ├── config/
│   │   │   └── config.js                 # Configuration management
│   │   │
│   │   ├── db/
│   │   │   └── db.js                     # MongoDB connection
│   │   │
│   │   ├── models/                       # Database Schemas (6 models)
│   │   │   ├── user.model.js             # User schema
│   │   │   ├── org.model.js              # Organization schema
│   │   │   ├── orgMember.model.js        # Organization membership
│   │   │   ├── board.model.js            # Kanban board schema
│   │   │   ├── card.model.js             # Task/card schema
│   │   │   └── session.model.js          # Session tracking
│   │   │
│   │   ├── controllers/                  # Business Logic (4 controllers)
│   │   │   ├── user.controller.js        # Auth & user operations
│   │   │   ├── org.controller.js         # Organization management
│   │   │   ├── board.controller.js       # Board operations
│   │   │   └── card.controller.js        # Card operations
│   │   │
│   │   ├── routes/                       # API Endpoints
│   │   │   ├── auth.route.js             # /api/auth/*
│   │   │   ├── org.route.js              # /api/org/*
│   │   │   ├── board.route.js            # /api/board/*
│   │   │   └── card.route.js             # /api/card/*
│   │   │
│   │   └── middlewares/                  # Middleware Functions
│   │       ├── auth.middleware.js        # JWT verification
│   │       └── validation.middleware.js  # Input validation
│   │
│   ├── .env                              # Environment variables
│   ├── .gitignore                        # Git ignore rules
│   ├── package.json                      # Dependencies & scripts
│   ├── package-lock.json                 # Dependency lock file
│   └── server.js                         # Server entry point
│
├── FE/                                    # Frontend Application
│   ├── index.html                        # Main HTML file
│   ├── index.js                          # JavaScript logic
│   ├── style.css                         # Styling
│   └── assets/                           # Images, icons (planned)
│
└── README.md                              # This file
```

### File Statistics
- **Total Backend Files**: 20+
- **Models**: 6 (User, Org, OrgMember, Board, Card, Session)
- **Controllers**: 4 (User, Org, Board, Card)
- **Routes**: 4 (Auth, Org, Board, Card)
- **Middlewares**: 2 (Auth, Validation)
- **Frontend Files**: 3 (HTML, CSS, JS)

### API Endpoint Summary
```
Authentication
├── POST   /api/auth/register
├── POST   /api/auth/login
├── POST   /api/auth/logout
└── POST   /api/auth/refresh-token

Organizations
├── POST   /api/org
├── GET    /api/org
├── GET    /api/org/:orgId
├── PUT    /api/org/:orgId
├── DELETE /api/org/:orgId
├── POST   /api/org/:orgId/members
├── GET    /api/org/:orgId/members
└── DELETE /api/org/:orgId/members/:memberId

Boards
├── POST   /api/board/:orgId
├── GET    /api/board/:orgId
├── PUT    /api/board/:boardId
└── DELETE /api/board/:boardId

Cards
├── POST   /api/card/:boardId
├── GET    /api/card/:boardId
├── PUT    /api/card/:cardId
├── PATCH  /api/card/:cardId/status
└── DELETE /api/card/:cardId
```

### Database Schema Relationships
```
User (1) ──── (Many) Organization
  │                      │
  │                      └──── (Many) OrgMember
  │                                      │
  │                                      └──── (Many) Board
  │                                                      │
  └──────────────────────────────────────────────────────└──── (Many) Card
```

---

## 🎨 Discover Flow Board

### Who Should Use Flow Board?

**Perfect For**:
- 🚀 Startup teams managing product development
- 👨‍💻 Development teams coordinating sprints
- 📊 Project managers tracking multiple projects
- 🎯 Agile teams using Kanban methodology
- 👥 Remote teams needing collaboration tools
- 📋 Anyone organizing tasks and workflows

### Key Use Cases

1. **Software Development**
   - Sprint planning and tracking
   - Bug tracking and resolution
   - Feature development workflow
   - Code review coordination

2. **Project Management**
   - Project timeline tracking
   - Task assignment and monitoring
   - Team collaboration
   - Progress reporting

3. **Team Collaboration**
   - Cross-functional team coordination
   - Workflow standardization
   - Team communication
   - Accountability tracking

4. **Personal Productivity**
   - Task organization
   - Goal tracking
   - Workflow management
   - Time management

### Competitive Advantages
- ✅ Lightweight and fast
- ✅ Easy to set up and deploy
- ✅ Customizable workflows
- ✅ Team collaboration features
- ✅ Role-based access control
- ✅ Open-source foundation

---

## 📈 Overall Growth & Progress

### Current Development Status

**Backend**: 90% Complete ✅
- ✅ All core APIs implemented
- ✅ Authentication system working
- ✅ Database schemas finalized
- ✅ Error handling in place
- 🔄 Testing and optimization ongoing

**Frontend**: 20% Complete 🔄
- ✅ HTML structure created
- ✅ CSS framework initialized
- 🔄 JavaScript integration in progress
- 📋 UI components pending
- 📋 Responsive design pending

**Database**: 100% Complete ✅
- ✅ All schemas designed
- ✅ Relationships established
- ✅ Indexes created
- ✅ Data validation rules set

**Overall Project**: 55% Complete 🚀

### Milestones Achieved
- ✅ Backend API fully functional
- ✅ Database schema designed and implemented
- ✅ Authentication system working
- ✅ Organization and team management
- ✅ Board and card management endpoints
- ✅ Role-based access control
- ✅ Error handling and validation

### Upcoming Milestones
- 🔄 Complete responsive frontend UI (2-3 weeks)
- 🔄 Implement drag-and-drop functionality (1-2 weeks)
- 🔄 Add real-time collaboration features (2-3 weeks)
- 🔄 Mobile app optimization (1-2 weeks)
- 🔄 Testing and quality assurance (2 weeks)
- 🔄 Deployment and production setup (1 week)

### Timeline Estimate
- **Current Phase**: Frontend Development (Weeks 1-4)
- **Next Phase**: Feature Enhancement (Weeks 5-8)
- **Final Phase**: Testing & Deployment (Weeks 9-10)
- **Estimated Launch**: 10 weeks from start

---

## 🚀 How Can It Be Improved

### Short-term Improvements (1-2 weeks)

1. **Frontend Completion**
   - Build responsive Kanban board interface
   - Create modal dialogs for card details
   - Implement form validation
   - Add loading states and error messages

2. **Real-time Updates**
   - Implement WebSocket for live collaboration
   - Add presence indicators (who's viewing)
   - Real-time card updates
   - Live notification system

3. **File Uploads**
   - Attachment functionality
   - Cloud storage integration (AWS S3)
   - File preview capabilities
   - Drag-and-drop file upload

4. **Enhanced Notifications**
   - Email notifications for updates
   - In-app notification center
   - Notification preferences
   - Digest emails

5. **Search & Filtering**
   - Global search across boards and cards
   - Advanced filters (by assignee, date, status)
   - Saved search filters
   - Search history

### Medium-term Improvements (1-2 months)

1. **Mobile Application**
   - Native iOS app (React Native)
   - Native Android app (React Native)
   - Mobile-optimized UI
   - Offline support

2. **Alternative Views**
   - Calendar view for due dates
   - Timeline/Gantt chart view
   - Table/spreadsheet view
   - List view with sorting

3. **Automation & Workflows**
   - Workflow automation rules
   - Trigger-based actions
   - Card templates
   - Bulk operations

4. **Integrations**
   - Slack integration
   - GitHub integration
   - Google Calendar sync
   - Email integration

5. **Advanced Permissions**
   - Granular role-based access
   - Custom roles
   - Permission templates
   - Audit logs

### Long-term Improvements (2-6 months)

1. **Analytics & Reporting**
   - Team productivity dashboard
   - Project analytics
   - Burndown charts
   - Custom reports

2. **AI Features**
   - Smart task suggestions
   - Automated task assignment
   - Predictive analytics
   - Natural language processing

3. **Enterprise Features**
   - Single Sign-On (SSO)
   - Advanced security
   - Data export
   - API rate limiting

4. **Performance Optimization**
   - Database query optimization
   - Caching layer (Redis)
   - CDN for static assets
   - Load balancing

5. **Scalability**
   - Microservices architecture
   - Horizontal scaling
   - Database sharding
   - Message queues

6. **Progressive Web App**
   - Offline functionality
   - Push notifications
   - App-like experience
   - Service workers

---

## 🚀 Running the Project

### Prerequisites
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **MongoDB**: Local instance or MongoDB Atlas cloud
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Installation & Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/flow-board.git
cd flow-board
```

#### Step 2: Backend Setup

Navigate to backend directory:
```bash
cd BE
```

Install dependencies:
```bash
npm install
```

Create `.env` file with configuration:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/flow-board
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/flow-board

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Email Configuration (Mailtrap)
MAILTRAP_TOKEN=your_mailtrap_api_token
MAILTRAP_FROM_EMAIL=noreply@flowboard.com

# Environment
NODE_ENV=development
PORT=3001
```

Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

Start backend development server:
```bash
npm run dev
```

Expected output:
```
Listening on port 3001
connected to DB
```

#### Step 3: Frontend Setup

Open new terminal and navigate to frontend:
```bash
cd FE
```

Start a local server:
```bash
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js (http-server)
npx http-server

# Option 3: Using Node.js (live-server)
npx live-server
```

Frontend will be available at: `http://localhost:8000`

### Full Stack Development Workflow

**Terminal 1 - MongoDB**:
```bash
mongod
```

**Terminal 2 - Backend**:
```bash
cd BE
npm run dev
```

**Terminal 3 - Frontend**:
```bash
cd FE
npx http-server
```

**Terminal 4 - Optional: Logs**:
```bash
# Monitor API calls
curl http://localhost:3001/api/health
```

### Testing the API

#### 1. Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### 3. Create Organization
```bash
curl -X POST http://localhost:3001/api/org \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orgName": "My Team",
    "description": "Our awesome team"
  }'
```

#### 4. Create Board
```bash
curl -X POST http://localhost:3001/api/board/ORG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Project Alpha",
    "description": "Main project board"
  }'
```

#### 5. Create Card
```bash
curl -X POST http://localhost:3001/api/card/BOARD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Fix login bug",
    "description": "Users unable to login with email"
  }'
```

### Troubleshooting

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running (`mongod` command)

**Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3001
```
Solution: Kill process on port 3001
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**JWT Token Expired**
```
Error: Invalid or expired token
```
Solution: Login again to get new token

**CORS Errors**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
Solution: Ensure frontend and backend are on correct ports

---

## 📹 Video Demo

[Video Demo Coming Soon]

---

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/flow-board.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Test your changes
- Update documentation
- Keep commits atomic and descriptive

### Areas for Contribution
- Frontend UI/UX improvements
- Backend optimization
- Bug fixes
- Documentation
- Testing
- Performance optimization

---

## 💬 Support & Contact

### Getting Help
- **Documentation**: Check README.md and inline code comments
- **Issues**: Open an issue on GitHub for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@flowboard.com

### Reporting Bugs
When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- Environment details (OS, Node version, etc.)

### Feature Requests
Have an idea? We'd love to hear it!
- Open a GitHub issue with label "enhancement"
- Describe the feature and use case
- Provide mockups if applicable

---

## 🙏 Acknowledgments

- Inspired by Trello, Asana, and Monday.com
- Built with Express.js and MongoDB
- Community feedback and contributions
- Open-source libraries and tools

---

## 📊 Project Statistics

- **Lines of Code**: 2,000+
- **API Endpoints**: 15+
- **Database Models**: 6
- **Controllers**: 4
- **Middleware Functions**: 2
- **Development Time**: 4-6 weeks
- **Team Size**: 1 developer
- **Last Updated**: April 2024

---

## 🎯 Future Vision

Flow Board aims to become the go-to project management solution for teams of all sizes. Our roadmap includes:

---

**Built with ❤️ by Tirth S Pandya**

*Version: 1.8.3*
