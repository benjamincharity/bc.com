#!/bin/bash
set -e

# Pre-PR Validation Script
# This script runs all checks required for a PR to pass CI

echo "🔍 Starting Pre-PR Validation..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any step fails
FAILED=0

# Function to run a check
run_check() {
  local name=$1
  local command=$2

  echo "📋 Running: $name"
  echo "   Command: $command"

  if eval "$command"; then
    echo -e "${GREEN}✅ $name passed${NC}"
  else
    echo -e "${RED}❌ $name failed${NC}"
    FAILED=1
  fi
  echo ""
}

# 1. Type checking (with clean cache - matches CI)
run_check "TypeScript Type Check (CI mode)" "npm run typecheck:ci"

# 2. Linting
run_check "ESLint" "npm run lint"

# 3. Unit Tests
run_check "Unit Tests" "npm test"

# 4. Production Build
run_check "Production Build" "npm run build"

# 5. Git status check (warn about uncommitted changes)
echo "📋 Checking Git Status"
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
  git status -s
else
  echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi
echo ""

# Final summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Ready to create PR${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Review your changes: git diff"
  echo "  2. Commit: git add . && git commit -m 'your message'"
  echo "  3. Push: git push"
  echo "  4. Create PR on GitHub"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please fix them before creating PR${NC}"
  exit 1
fi
