# Repository Cleanup Plan

## Current State Analysis
- **Total MD files in root:** ~100+
- **Status:** Development-heavy, AI-assisted working directory
- **Goal:** Clean production-grade smart-city platform repository

## Files Classification

### ✅ KEEP (Production-Critical)
1. `README.md` - Main project documentation (will be rewritten)
2. `DEPLOYMENT_GUIDE.md` - Deployment instructions
3. `ARCHITECTURE_OVERVIEW.md` - System architecture
4. `QUICK_START.md` - Quick start guide
5. `.env.example` - Environment template
6. `package.json` - Root package file
7. `.gitignore` - Git ignore rules

### 📦 ARCHIVE (Move to docs/archive/)
All progress reports, milestone updates, fix summaries, and temporary documentation:
- All `*_COMPLETE.md` files
- All `*_FIX*.md` files
- All `*_SUMMARY.md` files
- All `PHASE_*.md` files
- All `SESSION_*.md` files
- All `QUICK_*.md` duplicates
- All status update files
- All troubleshooting guides (consolidate into one)

### 🗑️ DELETE (Obsolete/Redundant)
- Duplicate markdown files
- Temporary test files
- Old frontend files (css/, js/, images/, index.html, app.py)
- Verification scripts
- API_VALIDATION.js
- SYSTEM_VALIDATION.js
- test-barangay-images.html
- verify-*.js files

## New Documentation Structure

```
smart-city-lipa/
├── README.md                      # Professional portfolio-quality
├── QUICK_START.md                 # Installation & setup
├── DEPLOYMENT_GUIDE.md            # Production deployment
├── FEATURE_BREAKDOWN.md           # Comprehensive feature documentation
├── PRESENTATION_REFERENCE.md      # For presentations & defense
├── CONTRIBUTING.md                # Contribution guidelines
├── LICENSE                        # License file
├── docs/
│   ├── architecture/
│   │   ├── SYSTEM_ARCHITECTURE.md
│   │   ├── DATABASE_SCHEMA.md
│   │   └── API_DESIGN.md
│   ├── api/
│   │   └── API_DOCUMENTATION.md
│   ├── deployment/
│   │   ├── DOCKER_DEPLOYMENT.md
│   │   └── CLOUD_DEPLOYMENT.md
│   ├── features/
│   │   └── FEATURE_DETAILS.md
│   └── archive/
│       └── [all progress reports]
├── frontend/
├── backend/
└── .github/
    └── workflows/
```

## Cleanup Actions

### Phase 1: Create New Documentation
1. Create comprehensive `FEATURE_BREAKDOWN.md`
2. Create `PRESENTATION_REFERENCE.md`
3. Rewrite `README.md` (portfolio-quality)
4. Create `CONTRIBUTING.md`
5. Add `LICENSE` file

### Phase 2: Organize Existing Docs
1. Create `docs/` directory structure
2. Move architecture docs to `docs/architecture/`
3. Move API docs to `docs/api/`
4. Move deployment docs to `docs/deployment/`

### Phase 3: Archive Progress Reports
1. Create `docs/archive/` directory
2. Move all progress/fix/summary files to archive
3. Keep archive for reference but out of main view

### Phase 4: Delete Obsolete Files
1. Remove old frontend files (css/, js/, images/, index.html)
2. Remove temporary test/verification scripts
3. Remove duplicate markdown files
4. Clean up root directory

### Phase 5: Verification
1. Ensure app still runs
2. Verify all links in documentation
3. Test deployment guides
4. Verify no critical files deleted

## Expected Outcome

### Before:
- 100+ markdown files in root
- Cluttered, unprofessional appearance
- Difficult to navigate
- Development artifacts everywhere

### After:
- ~7 key markdown files in root
- Clean, professional structure
- Easy to navigate
- Production-ready appearance
- Portfolio-quality presentation
- Thesis/defense-ready documentation
