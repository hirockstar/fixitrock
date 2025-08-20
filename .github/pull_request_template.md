## 📝 Description
<!-- Describe your changes here -->

## 🔄 Type of Change
- [ ] ✨ New feature (adds new functionality)
- [ ] 🚀 Enhancement (improves existing features)
- [ ] 🐛 Bug fix (fixes a bug or issue)
- [ ] 🔒 Security fix (addresses security vulnerabilities)
- [ ] 💥 Breaking change (changes that break existing functionality)
- [ ] 📚 Documentation update (updates docs, comments, README)
- [ ] 🎨 UI/UX improvement (better design, layout, user experience)
- [ ] ⚡ Performance improvement (faster, more efficient)
- [ ] 🧹 Code cleanup (refactoring, formatting, organization)
- [ ] 🔧 Configuration change (env vars, settings, config files)
- [ ] 🚚 Migration (moving files, changing structure)
- [ ] 🧪 Testing (new tests, test improvements)

## 📋 Checklist
- [ ] Code follows project style and conventions
- [ ] Self-review completed (checked my own code)
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] No console.log or debug code left behind
- [ ] All linting errors fixed
- [ ] Build passes successfully
- [ ] Changes tested locally (if applicable)
- [ ] Mobile responsive (if UI changes)
- [ ] Accessibility considered (if UI changes)

## 🚀 Changeset Required
**IMPORTANT**: Before merging, you must create a changeset describing your changes.

### Create Changeset:
```bash
bun run changeset
```

This will:
1. Ask for the type of change (patch/minor/major)
2. Ask for a description of changes
3. Create a markdown file in `.changeset/` folder

### UI/UX Changes:
If this PR includes UI/UX improvements, also consider:
- [ ] Screenshots/videos added (before/after if applicable)
- [ ] Mobile responsiveness tested
- [ ] Dark/light theme compatibility checked
- [ ] Accessibility improvements documented

### What Happens Next:
- When merged to main, GitHub Actions will:
  - Automatically bump version numbers
  - Generate changelog entries
  - Create release notes
  - Publish packages (if configured)

### 💡 Changeset Writing Tips:
- **Be descriptive**: "Added mobile content management" not just "Added feature"
- **List specific changes**: "- Implemented file upload", "- Added search functionality"
- **Include context**: What problem does this solve?
- **Reference issues**: "Closes #123" or "Fixes #456"
- **Use present tense**: "Adds" not "Added"

## 🔗 Related Issues
<!-- Link any related issues here -->
Closes #
