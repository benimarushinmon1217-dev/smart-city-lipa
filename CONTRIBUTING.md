# Contributing to Smart City Lipa

Thank you for your interest in contributing to Smart City Lipa! This document provides guidelines for contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation Guidelines](#documentation-guidelines)
9. [Reporting Issues](#reporting-issues)
10. [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, identity, or experience level.

### Expected Behavior
- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites
Before contributing, ensure you have:
- Node.js 18+ installed
- MySQL 8+ installed
- Git installed
- Basic knowledge of React, Node.js, and Express.js
- Familiarity with the project structure

### First-Time Contributors
1. Read the [README.md](./README.md) to understand the project
2. Review the [ARCHITECTURE_OVERVIEW.md](./docs/architecture/ARCHITECTURE_OVERVIEW.md)
3. Check the [Issues](https://github.com/your-repo/smart-city-lipa/issues) for beginner-friendly tasks
4. Look for issues labeled `good first issue` or `help wanted`

---

## Development Setup

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/smart-city-lipa.git
cd smart-city-lipa
```

### 2. Install Dependencies
```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment
```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your database credentials and API keys

# Frontend environment
cd ../frontend
cp .env.example .env
# Edit .env with your API URLs
```

### 4. Setup Database
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE smart_city_lipa;"

# Sync database schema
cd backend
npm run db:sync

# (Optional) Seed demo data
npm run seed
```

### 5. Start Development Servers
```bash
# From project root, start both servers
npm run dev

# Or start separately
cd backend && npm run dev
cd frontend && npm run dev
```

### 6. Verify Setup
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Test API: http://localhost:5000/api/v1/health

---

## Coding Standards

### JavaScript/React Style
- Use ES6+ syntax
- Use functional components with hooks (no class components)
- Use arrow functions for callbacks
- Use destructuring where appropriate
- Use template literals for string interpolation

### Naming Conventions
- **Files:** PascalCase for components (`MapContainer.jsx`), camelCase for utilities (`apiClient.js`)
- **Components:** PascalCase (`UserProfile`)
- **Functions:** camelCase (`getUserData`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes:** kebab-case (`user-profile-card`)

### Code Organization
```javascript
// Component structure
import React from 'react';
import PropTypes from 'prop-types';

// 1. Imports (external libraries first, then internal)
// 2. Component definition
// 3. PropTypes
// 4. Default export

const MyComponent = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState(null);
  
  // Event handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

export default MyComponent;
```

### Backend Structure
```javascript
// Controller pattern
const controllerFunction = asyncHandler(async (req, res) => {
  // 1. Extract and validate input
  const { param } = req.body;
  
  // 2. Call service layer
  const result = await service.doSomething(param);
  
  // 3. Return response
  return res.status(200).json({
    success: true,
    data: result,
  });
});
```

### Comments
- Write self-documenting code (clear variable/function names)
- Add comments for complex logic
- Use JSDoc for functions
```javascript
/**
 * Calculate evacuation route risk score
 * @param {Array} routeSegments - Array of route coordinates
 * @param {Array} barangays - Array of barangay polygons with risk data
 * @returns {Object} Risk analysis with high/medium/low percentages
 */
function calculateRouteRisk(routeSegments, barangays) {
  // Implementation
}
```

### Error Handling
```javascript
// Frontend
try {
  const data = await apiCall();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  toast.error('Failed to load data');
}

// Backend
const handler = asyncHandler(async (req, res) => {
  // asyncHandler catches errors automatically
  const data = await Model.findAll();
  res.json({ success: true, data });
});
```

---

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-improvement` - Code refactoring
- `test/test-addition` - Adding tests

### Commit Messages
Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(map): add heatmap visualization layer

fix(auth): resolve JWT token expiration issue

docs(readme): update installation instructions

refactor(api): simplify incident controller logic
```

### Workflow Steps
```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat(scope): description"

# 3. Keep branch updated
git fetch origin
git rebase origin/main

# 4. Push to your fork
git push origin feature/my-feature

# 5. Create Pull Request on GitHub
```

---

## Pull Request Process

### Before Submitting
- [ ] Code follows project coding standards
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Code is properly commented
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventions
- [ ] Branch is up-to-date with main

### PR Title
Use the same format as commit messages:
```
feat(map): Add real-time heatmap visualization
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process
1. Automated checks run (linting, tests)
2. Code review by maintainers
3. Address feedback and make changes
4. Approval from at least one maintainer
5. Merge to main branch

---

## Testing Requirements

### Manual Testing
- Test all affected features
- Test on different screen sizes (responsive)
- Test error scenarios
- Test with different user roles

### Automated Testing (Future)
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run all tests
npm test
```

### Testing Checklist
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive design maintained
- [ ] Accessibility considerations
- [ ] Error handling works
- [ ] Loading states display correctly

---

## Documentation Guidelines

### Code Documentation
- Add JSDoc comments for functions
- Explain complex algorithms
- Document API endpoints
- Update README if needed

### API Documentation
When adding new endpoints, document:
```javascript
/**
 * @route   POST /api/incidents
 * @desc    Create new incident report
 * @access  Private (authenticated users)
 * @body    { title, description, type, severity, latitude, longitude, photo }
 * @returns { success, data: incident }
 */
```

### Component Documentation
```javascript
/**
 * MapContainer - Main map component with incident markers
 * 
 * @component
 * @param {Array} incidents - Array of incident objects
 * @param {Function} onIncidentClick - Callback when incident marker clicked
 * @param {Object} center - Map center coordinates { lat, lng }
 * @param {Number} zoom - Initial zoom level
 */
```

---

## Reporting Issues

### Bug Reports
Use the bug report template:

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 3.0.0]

**Additional context**
Any other relevant information
```

### Security Issues
**Do not** create public issues for security vulnerabilities.
Email security concerns to: security@smartcitylipa.com

---

## Feature Requests

### Proposing New Features
1. Check if feature already requested
2. Create issue with `feature request` label
3. Describe the feature and use case
4. Explain why it's valuable
5. Discuss implementation approach

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What problem does this address?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, references
```

---

## Development Tips

### Useful Commands
```bash
# Backend
npm run dev          # Start with nodemon
npm run db:sync      # Sync database schema
npm run seed         # Seed demo data
npm run logs         # View logs

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Both
npm run dev          # Start both servers
npm run install:all  # Install all dependencies
```

### Debugging
- Use browser DevTools for frontend debugging
- Use `console.log()` or debugger for quick checks
- Check `backend/logs/` for backend errors
- Use React DevTools extension
- Use Redux DevTools for state inspection

### Common Issues
**Port already in use:**
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

**Database connection error:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Ask in discussions
4. Contact maintainers

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Acknowledgments

Thank you for contributing to Smart City Lipa! Your efforts help make disaster management more effective and save lives.

---

**Happy Contributing! 🎉**
