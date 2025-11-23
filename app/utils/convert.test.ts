import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import convert from "./convert";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to read test files
const readTestFile = (filename: string): string => {
  return readFileSync(join(__dirname, "test-files", filename), "utf-8");
};

describe("HTML to Vue Converter", () => {
  describe("Basic Functionality", () => {
    it("should handle empty input", () => {
      const result = convert("", "composition");
      expect(result).toBe("");
    });

    it("should handle whitespace only input", () => {
      const result = convert("   \n  \n  ", "composition");
      expect(result).toBe("");
    });

    it("should reject plain text without HTML tags", () => {
      const html = readTestFile("invalid.html");
      const result = convert(html, "composition");
      expect(result).toContain("Invalid HTML");
    });

    it("should handle empty body", () => {
      const html = readTestFile("empty-body.html");
      const result = convert(html, "composition");
      expect(result).toContain("No valid template content found");
    });
  });

  describe("Composition API - Template Conversion", () => {
    it("should convert basic HTML to Vue template", () => {
      const html = readTestFile("basic.html");
      const result = convert(html, "composition");

      expect(result).toContain("<template>");
      expect(result).toContain("</template>");
      expect(result).toContain('<div class="app-wrapper">');
      expect(result).toContain("<h1>Hello World</h1>");
      expect(result).toContain("<p>This is a basic HTML document.</p>");
      expect(result).toContain("<button>Click me</button>");
    });

    it("should preserve complex nested structure", () => {
      const html = readTestFile("complex-nesting.html");
      const result = convert(html, "composition");

      expect(result).toContain("<header>");
      expect(result).toContain("<nav>");
      expect(result).toContain("<main>");
      expect(result).toContain('<section id="home">');
      expect(result).toContain("<footer>");
      expect(result).toContain("&copy; 2025 Test App");
    });

    it("should remove DOCTYPE, meta, and link tags", () => {
      const html = readTestFile("basic.html");
      const result = convert(html, "composition");

      expect(result).not.toContain("<!DOCTYPE");
      expect(result).not.toContain("<meta");
      expect(result).not.toContain("<html");
      expect(result).not.toContain("<head");
      expect(result).not.toContain("<title>");
    });
  });

  describe("Composition API - Script Conversion", () => {
    it("should convert variables to refs", () => {
      const html = readTestFile("with-script.html");
      const result = convert(html, "composition");

      expect(result).toContain('<script setup lang="ts">');
      expect(result).toContain("import { ref } from 'vue'");
      expect(result).toContain("const count = ref(0)");
      expect(result).toContain("const step = ref(1)");
    });

    it("should convert functions", () => {
      const html = readTestFile("with-script.html");
      const result = convert(html, "composition");

      expect(result).toContain("function increment()");
      expect(result).toContain("function decrement()");
      expect(result).toContain("const reset = ()");
    });

    it("should handle complex script with multiple variables and functions", () => {
      const html = readTestFile("complete.html");
      const result = convert(html, "composition");

      expect(result).toContain("import { ref } from 'vue'");
      expect(result).toContain("const todos = ref([])");
      expect(result).toContain("const nextId = ref(1)");
      expect(result).toContain("function addTodo()");
      expect(result).toContain("function toggleTodo");
      expect(result).toContain("const renderTodos = ()");
    });

    it("should add TODO comment for review", () => {
      const html = readTestFile("with-script.html");
      const result = convert(html, "composition");

      expect(result).toContain("// TODO: Review and adjust the converted code");
    });

    it("should provide placeholder comments when no script exists", () => {
      const html = readTestFile("basic.html");
      const result = convert(html, "composition");

      expect(result).toContain("// Add your Composition API logic here");
      expect(result).toContain("// import { ref } from 'vue'");
    });
  });

  describe("Options API - Script Conversion", () => {
    it("should create proper Options API structure", () => {
      const html = readTestFile("with-script.html");
      const result = convert(html, "options");

      expect(result).toContain('<script lang="ts">');
      expect(result).toContain("import { defineComponent } from 'vue'");
      expect(result).toContain("export default defineComponent({");
      expect(result).toContain("name: 'ConvertedComponent',");
      expect(result).toContain("data() {");
      expect(result).toContain("methods: {");
      expect(result).toContain("mounted() {");
    });

    it("should convert variables to data properties", () => {
      const html = readTestFile("with-script.html");
      const result = convert(html, "options");

      expect(result).toContain("count: 0,");
      expect(result).toContain("step: 1,");
    });

    it("should convert functions to methods", () => {
      const html = readTestFile("with-script.html");
      const result = convert(html, "options");

      expect(result).toContain("increment()");
      expect(result).toContain("decrement()");
      expect(result).toContain("reset()");
    });

    it("should handle complex script with multiple variables and functions", () => {
      const html = readTestFile("complete.html");
      const result = convert(html, "options");

      expect(result).toContain("todos: [],");
      expect(result).toContain("nextId: 1,");
      expect(result).toContain("addTodo()");
      expect(result).toContain("toggleTodo");
      expect(result).toContain("renderTodos()");
    });

    it("should not have trailing comma on last method", () => {
      const html = readTestFile("with-script.html");
      const result = convert(html, "options");

      // Check that methods section ends properly without trailing comma
      const methodsSection = result.match(/methods:\s*{[\s\S]*?}/)?.[0];
      expect(methodsSection).toBeDefined();

      // The last method before closing brace should not have trailing comma
      const lines = methodsSection!.split("\n").filter((l) => l.trim());
      const lastMethodLine = lines[lines.length - 2]; // -2 because last is '}'
      if (lastMethodLine) {
        expect(lastMethodLine.trim()).not.toMatch(/,\s*$/);
      }
    });
  });

  describe("Style Conversion", () => {
    it("should extract and preserve CSS styles", () => {
      const html = readTestFile("with-styles.html");
      const result = convert(html, "composition");

      expect(result).toContain("<style scoped>");
      expect(result).toContain("</style>");
      expect(result).toContain(".container {");
      expect(result).toContain("max-width: 800px;");
      expect(result).toContain(".title {");
      expect(result).toContain("color: #333;");
      expect(result).toContain(".button {");
      expect(result).toContain("background-color: #007bff;");
    });

    it("should handle complete file with styles and scripts", () => {
      const html = readTestFile("complete.html");
      const result = convert(html, "composition");

      // Check template
      expect(result).toContain('<div class="todo-app">');

      // Check styles
      expect(result).toContain("<style scoped>");
      expect(result).toContain(".todo-app {");
      expect(result).toContain(".completed {");

      // Check script
      expect(result).toContain('<script setup lang="ts">');
      expect(result).toContain("const todos = ref([])");
    });

    it("should add review comment to styles", () => {
      const html = readTestFile("with-styles.html");
      const result = convert(html, "composition");

      expect(result).toContain("/* Converted styles - review and adjust */");
    });
  });

  describe("Component Structure", () => {
    it("should create proper Vue SFC structure for Composition API", () => {
      const html = readTestFile("basic.html");
      const result = convert(html, "composition");

      // Check order: template -> script
      const templateIndex = result.indexOf("<template>");
      const scriptIndex = result.indexOf('<script setup lang="ts">');

      expect(templateIndex).toBeGreaterThan(-1);
      expect(scriptIndex).toBeGreaterThan(templateIndex);
    });

    it("should create proper Vue SFC structure for Options API", () => {
      const html = readTestFile("basic.html");
      const result = convert(html, "options");

      // Check order: template -> script
      const templateIndex = result.indexOf("<template>");
      const scriptIndex = result.indexOf('<script lang="ts">');

      expect(templateIndex).toBeGreaterThan(-1);
      expect(scriptIndex).toBeGreaterThan(templateIndex);
    });

    it("should wrap template content in app-wrapper div", () => {
      const html = readTestFile("basic.html");
      const result = convert(html, "composition");

      expect(result).toContain('<div class="app-wrapper">');

      // Check that app-wrapper is inside template
      const templateMatch = result.match(/<template>([\s\S]*?)<\/template>/);
      expect(templateMatch).toBeDefined();
      expect(templateMatch![1]).toContain('<div class="app-wrapper">');
    });
  });

  describe("Edge Cases", () => {
    it("should handle HTML with only styles", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; }
          </style>
        </head>
        <body><div>Content</div></body>
        </html>
      `;
      const result = convert(html, "composition");

      expect(result).toContain("<div>Content</div>");
      expect(result).toContain("<style scoped>");
      expect(result).toContain("body { margin: 0; }");
    });

    it("should handle HTML with multiple style blocks", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>.class1 { color: red; }</style>
          <style>.class2 { color: blue; }</style>
        </head>
        <body><div>Content</div></body>
        </html>
      `;
      const result = convert(html, "composition");

      expect(result).toContain(".class1 { color: red; }");
      expect(result).toContain(".class2 { color: blue; }");
    });

    it("should handle HTML with multiple script blocks", () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <div>Content</div>
          <script>const a = 1;</script>
          <script>const b = 2;</script>
        </body>
        </html>
      `;
      const result = convert(html, "composition");

      expect(result).toContain("const a = ref(1)");
      expect(result).toContain("const b = ref(2)");
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed HTML gracefully", () => {
      const html = "<div><p>Unclosed paragraph<div>Another div</div>";
      const result = convert(html, "composition");

      // Should still attempt to convert
      expect(result).toContain("<template>");
      expect(result).toContain("<div>");
    });

    it("should not crash on complex malformed input", () => {
      const html = "<<<>>><script>let x = {{{</script>";

      // Should return error or attempt conversion
      expect(() => convert(html, "composition")).not.toThrow();
    });
  });

  describe("API Style Comparison", () => {
    it("should produce different output for composition vs options API", () => {
      const html = readTestFile("with-script.html");
      const composition = convert(html, "composition");
      const options = convert(html, "options");

      expect(composition).not.toBe(options);
      expect(composition).toContain("script setup");
      expect(options).toContain("defineComponent");
    });

    it("should have same template for both API styles", () => {
      const html = readTestFile("basic.html");
      const composition = convert(html, "composition");
      const options = convert(html, "options");

      const compTemplate = composition.match(
        /<template>([\s\S]*?)<\/template>/
      )?.[1];
      const optTemplate = options.match(
        /<template>([\s\S]*?)<\/template>/
      )?.[1];

      expect(compTemplate).toBe(optTemplate);
    });
  });
});
