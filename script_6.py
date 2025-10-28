
# Crear .dockerignore para optimizar builds

dockerignore_content = '''node_modules
dist
.git
.gitignore
.env
.env.local
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
.vscode
.idea
README.md
README_DEPLOY.md
*.md'''

with open('.dockerignore', 'w', encoding='utf-8') as f:
    f.write(dockerignore_content)

print("✅ .dockerignore creado")
print("   Optimiza el proceso de build de Docker")
