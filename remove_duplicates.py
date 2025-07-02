#!/usr/bin/env python3

with open('/Users/dasean/Downloads/ai-navigator-pro/components/TrendAnalysis.tsx.bak', 'r') as f_in:
    with open('/Users/dasean/Downloads/ai-navigator-pro/components/TrendAnalysis.tsx', 'w') as f_out:
        seen = set()
        for line in f_in:
            if line not in seen:
                seen.add(line)
                f_out.write(line)