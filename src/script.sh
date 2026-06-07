#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# --- CONFIGURATION ---
GITHUB_USER="yazdan-centos"
GITHUB_EMAIL="yazdanparast.centos@gmail.com"
# REPLACE THE VALUE BELOW WITH YOUR PERSONAL ACCESS TOKEN (PAT)
# Do not use your account password here
GITHUB_TOKEN="YOUR_PERSONAL_ACCESS_TOKEN_HERE"
REPO_NAME="YOUR_REPOSITORY_NAME_HERE"

# --- GIT CONFIG ---
echo "Configuring global Git identity..."
git config --global user.name "$GITHUB_USER"
git config --global user.email "$GITHUB_EMAIL"

# --- INITIALIZATION ---
if [ ! -d ".git" ]; then
    echo "Initializing local Git repository..."
    git init -b main
else
    echo "Git repository already initialized."
fi

# --- STAGING & COMMIT ---
echo "Staging files..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit via automation script"

# --- REMOTE LINKING & PUSH ---
echo "Linking to GitHub remote repository..."
# This URL format safely embeds your token so the script does not ask for credentials
REMOTE_URL="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Remove existing origin if it exists, then add the correct one
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"

echo "Pushing code to GitHub main branch..."
git push -u origin main

echo "Project successfully shared on GitHub!"
