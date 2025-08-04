#!/bin/bash

# Script per creare la GitHub Release v1.1.0
# Assicurati di avere un GitHub Personal Access Token configurato

REPO="bemyrider/bemyrider-jobs"
TAG="v1.1.0"
RELEASE_NOTES_FILE="RELEASE_NOTES_v1.1.0.md"

# Leggi le note di release
RELEASE_BODY=$(cat "$RELEASE_NOTES_FILE")

# Crea la release usando l'API di GitHub
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$REPO/releases \
  -d "{
    \"tag_name\": \"$TAG\",
    \"name\": \"Bemyrider Jobs v1.1.0 - UI Migliorata e Integrazioni Complete\",
    \"body\": $(echo "$RELEASE_BODY" | jq -Rs .),
    \"draft\": false,
    \"prerelease\": false
  }"

echo "GitHub Release creata con successo!"
echo "Visita: https://github.com/$REPO/releases/tag/$TAG" 