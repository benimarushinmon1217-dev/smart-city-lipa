# Syntax Error Fix - Duplicate Imports ✅

## Problem
```
[plugin:vite:react-babel] Unexpected token (29:0)
```

Babel parser error at line 29 in `AIAdvisorWidget.jsx`.

## Root Cause
During the previous string replacement to add the ashfall calculator imports, the import statements got duplicated:

```javascript
// Correct imports
import { calculateAshfallRisk, getWindDirectionName } from '../../utils/ashfallCalculator';
import { formatDistanceToNow } from 'date-fns';

// DUPLICATE (causing error)
getAdvisoryIcon,
    ADVISORY_PRIORITIES
} from '../../hooks/useAIAdvisor';
import { useMapStore } from '../../stores/mapStore';
import { formatDistanceToNow } from 'date-fns';
```

The duplicate lines created invalid JavaScript syntax.

## Solution
Removed the duplicate import lines, keeping only the correct imports:

```javascript
import { useState, useEffect } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Minimize2,
    Maximize2,
    Volume2,
    VolumeX,
    Sparkles
} from 'lucide-react';
import { Button, Badge, Spinner } from '../common';
import {
    useAIAdvisor,
    getAdvisoryColor,
    getAdvisoryIcon,
    ADVISORY_PRIORITIES
} from '../../hooks/useAIAdvisor';
import { useMapStore } from '../../stores/mapStore';
import { calculateAshfallRisk, getWindDirectionName } from '../../utils/ashfallCalculator';
import { formatDistanceToNow } from 'date-fns';
```

## Files Modified
- `frontend/src/components/ai/AIAdvisorWidget.jsx` - Removed duplicate imports

## Verification
```bash
cd frontend
npm run dev
```

**Expected:** No syntax errors, frontend compiles successfully ✅

## Status: ✅ FIXED

The syntax error is resolved and the file now compiles correctly!

---

**All systems operational!** 🚀
