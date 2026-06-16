#!/bin/bash
# ArcBright IDE — patch VS Code source and build
set -e

echo "=== ArcBright IDE Build ==="

# Clone VS Code at matching version
VSCODE_VERSION="1.125.0"
if [ ! -d vscode ]; then
  git clone --depth 1 --branch $VSCODE_VERSION https://github.com/microsoft/vscode.git vscode
fi

cd vscode

# Apply ArcBright patches
echo "Applying ArcBright patches..."
cp -r ../patches/* . 2>/dev/null || true

# Remove Copilot entirely
rm -rf extensions/copilot
sed -i '/copilot/d' package.json remote/package.json 2>/dev/null || true

# Install deps
npm install --ignore-scripts
npx gulp vscode-linux-x64

echo "=== Build complete ==="
ls -la ../VSCode-linux-x64/ 2>/dev/null || echo "Check output directory"
