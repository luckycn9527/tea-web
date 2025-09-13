# Contributing to Chinese Porcelain Gallery

Thank you for your interest in contributing to the Chinese Porcelain Gallery project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue templates** provided
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser/OS information

### Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing feature requests** first
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Consider implementation** complexity

### Code Contributions

#### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/tea-web.git
   cd tea-web
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the coding standards
   - Write tests if applicable
   - Update documentation

5. **Test your changes**
   ```bash
   npm run dev
   npm run test
   npm run lint
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Vue.js**: Follow Vue 3 Composition API patterns
- **Naming**: Use descriptive, clear variable and function names
- **Comments**: Add comments for complex logic
- **Formatting**: Use Prettier for consistent formatting

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(admin): add product bulk upload functionality
fix(products): resolve image loading issue on mobile
docs(readme): update installation instructions
```

### File Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   └── specific/       # Feature-specific components
├── views/              # Page components
├── stores/             # Pinia stores
├── config/             # Configuration files
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Define clear prop interfaces
3. **Composition API**: Use Vue 3 Composition API
4. **Reactive Data**: Use `ref()` and `reactive()` appropriately
5. **Computed Properties**: Use `computed()` for derived state

### Testing

- **Unit Tests**: Write tests for utility functions
- **Component Tests**: Test component behavior
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test user workflows

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Environment Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/luckycn9527/tea-web.git
   cd tea-web
   npm run install:all
   ```

2. **Environment variables**
   ```bash
   # Frontend
   cd porcelain-gallery/frontend
   cp .env.example .env
   
   # Backend
   cd ../backend
   cp .env.example .env
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build frontend for production

# Testing
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript type checking
```

## 📚 Documentation

### Code Documentation

- **JSDoc**: Use JSDoc for function documentation
- **README**: Keep README.md updated
- **API Docs**: Document API endpoints
- **Component Docs**: Document component props and usage

### Writing Documentation

- **Clear Language**: Use simple, clear language
- **Examples**: Provide code examples
- **Screenshots**: Include screenshots for UI changes
- **Links**: Link to related resources

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**
   - OS and version
   - Browser and version
   - Node.js version

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected behavior
   - Actual behavior

3. **Additional Information**
   - Screenshots
   - Console errors
   - Network requests (if applicable)

## 🎨 Design Guidelines

### UI/UX Principles

- **Consistency**: Follow existing design patterns
- **Accessibility**: Ensure accessibility compliance
- **Responsive**: Design for all screen sizes
- **Performance**: Optimize for speed and efficiency

### Styling

- **Tailwind CSS**: Use Tailwind utility classes
- **Custom CSS**: Minimal custom CSS
- **Design System**: Follow established design tokens
- **Dark Mode**: Consider dark mode support

## 🔒 Security

### Security Guidelines

- **Input Validation**: Validate all user inputs
- **Authentication**: Implement proper authentication
- **Authorization**: Check user permissions
- **Data Protection**: Protect sensitive data
- **Dependencies**: Keep dependencies updated

### Reporting Security Issues

For security vulnerabilities, please:

1. **Do not** create public issues
2. **Email** security concerns to [security@example.com]
3. **Include** detailed information about the vulnerability
4. **Wait** for acknowledgment before public disclosure

## 📈 Performance

### Performance Guidelines

- **Image Optimization**: Optimize images for web
- **Code Splitting**: Use dynamic imports
- **Caching**: Implement appropriate caching
- **Bundle Size**: Keep bundle size minimal
- **Loading**: Implement loading states

## 🌍 Internationalization

### Adding New Languages

1. **Create translation files** in `src/i18n/`
2. **Update language switcher** component
3. **Add locale** to router configuration
4. **Test** all text displays correctly

### Translation Guidelines

- **Context**: Provide context for translators
- **Consistency**: Use consistent terminology
- **Cultural Sensitivity**: Consider cultural differences
- **Testing**: Test with different languages

## 📝 Pull Request Process

### Before Submitting

1. **Test** your changes thoroughly
2. **Update** documentation if needed
3. **Run** linting and formatting
4. **Check** for breaking changes
5. **Update** CHANGELOG.md

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

## 🎯 Roadmap

### Current Priorities

1. **Performance Optimization**
2. **Mobile Experience**
3. **Accessibility Improvements**
4. **Testing Coverage**
5. **Documentation**

### Future Features

- User authentication system
- Payment integration
- Advanced search functionality
- PWA capabilities
- Multi-language support

## 💬 Community

### Getting Help

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: [Join our community server]
- **Email**: [contact@example.com]

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Be patient** with newcomers
- **Be collaborative** in discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Chinese Porcelain Gallery project! 🏺✨
