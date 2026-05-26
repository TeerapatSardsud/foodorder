#!/bin/bash
# setup-github.sh
# Run this ONCE to initialise the repo and push to GitHub

# ─── 1. Init git ─────────────────────────────────────────────────────────────
git init
git add .
git commit -m "feat: initial project structure — Food Order System"

# ─── 2. Push to GitHub ───────────────────────────────────────────────────────
# แก้ชื่อ repo ให้ตรงกับที่สร้างใน GitHub
REPO_URL="https://github.com/YOUR_USERNAME/food-order-system.git"

git remote add origin $REPO_URL
git branch -M main
git push -u origin main

echo "✅ Done! Repo is live at $REPO_URL"
