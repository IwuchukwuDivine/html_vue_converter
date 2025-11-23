# 🔄 HTML to Vue Converter

A powerful web-based tool that instantly converts vanilla HTML into Vue 3 Single File Components (SFC). Supports both **Composition API** and **Options API** with intelligent parsing of scripts, styles, and templates.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-4.2-00DC82.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)

## ✨ Features

- **🎯 Dual API Support**: Convert to either Composition API or Options API
- **🧠 Smart Parsing**: Automatically extracts and converts:
  - Variables → `ref()` (Composition) or `data()` (Options)
  - Functions → Composable functions or methods
  - Styles → Scoped CSS
  - Templates → Clean Vue templates
- **⚡ Real-time Conversion**: Instant preview as you type
- **📋 Copy to Clipboard**: One-click copy of converted code
- **🎨 Syntax Highlighting**: Beautiful code editor with syntax highlighting
- **🧪 Fully Tested**: Comprehensive test suite with Vitest
- **🌐 Zero Dependencies**: Pure TypeScript conversion logic

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/IwuchukwuDivine/html_vue_converter.git
cd html_vue_converter

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

## 📖 Usage

### Web Interface

1. Open the application in your browser
2. Paste your HTML code into the left editor
3. Select your preferred API style (Composition or Options)
4. View the converted Vue component in the right panel
5. Click "Copy Code" to copy to clipboard

### Programmatic Usage

You can also use the converter function directly in your code:

```typescript
import convert from "./app/utils/convert";

const html = `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>Hello World</h1>
      <button onclick="greet()">Click me</button>
      <script>
        function greet() {
          alert('Hello!');
        }
      </script>
    </body>
  </html>
`;

// Convert to Composition API
const vueComponentComposition = convert(html, "composition");

// Convert to Options API
const vueComponentOptions = convert(html, "options");

console.log(vueComponentComposition);
```

### Example Conversions

#### Input (HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Counter: <span id="count">0</span></h1>
      <button onclick="increment()">+</button>
    </div>
    <script>
      let count = 0;
      function increment() {
        count++;
        document.getElementById("count").textContent = count;
      }
    </script>
  </body>
</html>
```

#### Output (Vue Composition API)

```vue
<template>
  <div class="app-wrapper">
    <div class="container">
      <h1>Counter: <span id="count">0</span></h1>
      <button onclick="increment()">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Reactive state (converted from variables)
const count = ref(0);

// Functions
function increment() {
  count.value++;
  document.getElementById("count").textContent = count.value;
}

// TODO: Review and adjust the converted code
</script>

<style scoped>
/* Converted styles - review and adjust */

.container {
  padding: 20px;
}
</style>
```

## 🧪 Testing

This project includes comprehensive tests using Vitest:

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The test suite includes:

- ✅ Basic HTML to Vue template conversion
- ✅ Script extraction and conversion (variables & functions)
- ✅ Style extraction and preservation
- ✅ Both Composition and Options API outputs
- ✅ Edge cases and error handling
- ✅ Complex nested structures
- ✅ Multiple script/style blocks

## 🏗️ Project Structure

```
html_vue_converter/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Global styles
│   ├── components/
│   │   ├── CodeEditor.vue        # Monaco-based code editor
│   │   └── Header.vue            # App header
│   ├── pages/
│   │   └── index.vue             # Main converter page
│   ├── utils/
│   │   ├── convert.ts            # Core conversion logic
│   │   ├── convert.test.ts       # Comprehensive tests
│   │   └── test-files/           # HTML test fixtures
│   └── app.vue                   # Root component
├── public/
│   └── logo-trans.png            # App logo
├── nuxt.config.ts                # Nuxt configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. **🐛 Report Bugs**: Open an issue describing the bug and how to reproduce it
2. **💡 Suggest Features**: Share your ideas for new features
3. **📝 Improve Documentation**: Help improve our docs
4. **🔧 Submit Pull Requests**: Fix bugs or add new features

### Development Workflow

1. **Fork the repository** on GitHub
2. **Clone your fork**:

   ```bash
   git clone https://github.com/IwuchukwuDivine/html_vue_converter.git
   cd html_vue_converter
   ```

3. **Create a feature branch**:

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes** and commit:

   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

5. **Write/update tests** if applicable:

   ```bash
   npm test
   ```

6. **Push to your fork**:

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request** on GitHub

### Code Style

- Use TypeScript for type safety
- Follow the existing code style
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

### Running Locally

```bash
# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Built With

- **[Nuxt 3](https://nuxt.com/)** - The Vue Framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript Framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Pinia](https://pinia.vuejs.org/)** - State Management
- **[Vitest](https://vitest.dev/)** - Unit Testing Framework
- **[VueUse](https://vueuse.org/)** - Vue Composition Utilities

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need to quickly migrate legacy HTML to Vue 3
- Thanks to all contributors who help improve this tool
- Built with ❤️ for the Vue community

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/IwuchukwuDivine/html_vue_converter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/IwuchukwuDivine/html_vue_converter/discussions)

## 🗺️ Roadmap

- [ ] Support for Vue 2 conversion
- [ ] JSX/TSX output option
- [ ] Better handling of event listeners
- [ ] Import statement detection and preservation
- [ ] Component composition detection
- [ ] Dark mode toggle
- [ ] Export as .vue file
- [ ] Multiple file conversion (batch processing)
- [ ] VS Code extension

---

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the community
