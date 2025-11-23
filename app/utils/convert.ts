export default (htmlCode: string, apiStyle: "composition" | "options") => {
  if (!htmlCode.trim()) return "";

  try {
    let html = htmlCode;

    // Remove DOCTYPE
    html = html.replace(/<!doctype[^>]*>/gi, "");

    // Extract style blocks
    const styleBlocks: string[] = [];
    html = html.replace(
      /<style[^>]*>([\s\S]*?)<\/style>/gi,
      (match, content) => {
        if (content.trim()) styleBlocks.push(content.trim());
        return "";
      }
    );

    // Extract script blocks
    const scriptBlocks: string[] = [];
    html = html.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/gi,
      (match, content) => {
        if (content.trim()) scriptBlocks.push(content.trim());
        return "";
      }
    );

    // Remove html/head
    html = html.replace(/<\/?html[^>]*>/gi, "");
    html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");

    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let template = bodyMatch?.[1] || html;

    template = template.replace(/<\/?body[^>]*>/gi, "");

    // Remove meta/link/title
    template = template.replace(/<meta[^>]*\/?>/gi, "");
    template = template.replace(/<link[^>]*\/?>/gi, "");
    template = template.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "");

    template = template.trim();
    template = template.replace(/\n\s*\n\s*\n/g, "\n\n");

    if (!template) return "<!-- No valid template content found -->";

    // Validate that the template contains actual HTML elements
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(template);
    const looksLikeJavaScript =
      /^(const|let|var|function|class|import|export)\s+/i.test(template);

    if (!hasHtmlTags || looksLikeJavaScript) {
      return "<!-- Invalid HTML: Please paste valid HTML markup, not plain text or JavaScript code -->";
    }

    // Build Vue SFC output
    const parts = ["<template>", '  <div class="app-wrapper">'];

    template.split("\n").forEach((line) => {
      const trimmed = line.trim();
      parts.push(trimmed ? `    ${trimmed}` : "");
    });

    parts.push("  </div>");
    parts.push("</template>");
    parts.push("");

    // Parse and categorize JavaScript
    const variables: string[] = [];
    const functions: string[] = [];

    scriptBlocks.forEach((script) => {
      // Clean script
      let cleanScript = script
        .replace(/console\.(log|error|warn|info)\([^)]*\);?/g, "") // Remove console logs
        .trim();

      // Parse line by line
      const lines = cleanScript.split("\n");
      let currentFunction = "";
      let braceCount = 0;

      for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("//")) continue;

        // Check if it's a function declaration
        const isFunctionDeclaration =
          /^(function\s+\w+|const\s+\w+\s*=\s*(\([^)]*\)|[\w]+)\s*=>|const\s+\w+\s*=\s*function)/.test(
            trimmed
          );

        if (isFunctionDeclaration) {
          currentFunction = trimmed;
          braceCount =
            (trimmed.match(/{/g) || []).length -
            (trimmed.match(/}/g) || []).length;

          // Single line arrow function
          if (trimmed.includes("=>") && !trimmed.endsWith("{")) {
            functions.push(currentFunction);
            currentFunction = "";
            braceCount = 0;
          }
        } else if (currentFunction) {
          // Continue collecting function body
          currentFunction += "\n" + trimmed;
          braceCount +=
            (trimmed.match(/{/g) || []).length -
            (trimmed.match(/}/g) || []).length;

          if (braceCount === 0) {
            functions.push(currentFunction);
            currentFunction = "";
          }
        } else {
          // It's a variable declaration
          const isVariable =
            /^(const|let|var)\s+\w+\s*=/.test(trimmed) &&
            !isFunctionDeclaration;
          if (isVariable) {
            variables.push(trimmed);
          }
        }
      }

      // Catch any remaining function
      if (currentFunction) {
        functions.push(currentFunction);
      }
    });

    // Generate script based on API style
    if (apiStyle === "composition") {
      parts.push("<" + 'script setup lang="ts">');

      if (variables.length > 0 || functions.length > 0) {
        parts.push("import { ref } from 'vue'");
        parts.push("");

        // Convert variables to refs
        if (variables.length > 0) {
          parts.push("// Reactive state (converted from variables)");
          variables.forEach((varDecl) => {
            // Convert: const name = "value" → const name = ref("value")
            const converted = varDecl.replace(
              /^(const|let|var)\s+(\w+)\s*=\s*(.+);?$/,
              (match, keyword, name, value) => {
                // Clean up the value
                const cleanValue = value.trim().replace(/;$/, "");
                return `const ${name} = ref(${cleanValue})`;
              }
            );
            parts.push(converted);
          });
          parts.push("");
        }

        // Add functions as-is
        if (functions.length > 0) {
          parts.push("// Functions");
          functions.forEach((func) => {
            parts.push(func);
          });
          parts.push("");
        }

        parts.push("// TODO: Review and adjust the converted code");
      } else {
        parts.push("// Add your Composition API logic here");
        parts.push("// import { ref } from 'vue'");
        parts.push("// const count = ref(0)");
      }

      parts.push("</" + "script>");
    } else {
      // Options API
      parts.push("<" + 'script lang="ts">');
      parts.push("import { defineComponent } from 'vue'");
      parts.push("");
      parts.push("export default defineComponent({");
      parts.push("  name: 'ConvertedComponent',");

      // Data section
      parts.push("  data() {");
      parts.push("    return {");

      if (variables.length > 0) {
        variables.forEach((varDecl) => {
          // Convert: const name = "value" → name: "value",
          const converted = varDecl.replace(
            /^(const|let|var)\s+(\w+)\s*=\s*(.+);?$/,
            (match, keyword, name, value) => {
              const cleanValue = value.trim().replace(/;$/, "");
              return `      ${name}: ${cleanValue},`;
            }
          );
          parts.push(converted);
        });
      } else {
        parts.push("      // Add your component data here");
      }

      parts.push("    }");
      parts.push("  },");

      // Methods section
      parts.push("  methods: {");

      if (functions.length > 0) {
        functions.forEach((func) => {
          // Convert arrow functions to methods: const add = (a, b) => { } → add(a, b) { }
          let converted = func.replace(
            /^const\s+(\w+)\s*=\s*(\([^)]*\)|[\w]+)\s*=>\s*/,
            (match, name, params) => {
              return `    ${name}${params} `;
            }
          );

          // Handle function declarations: function add(a, b) { } → add(a, b) { }
          converted = converted.replace(/^function\s+(\w+)/, "$1");

          // Add proper indentation
          const lines = converted.split("\n");
          lines.forEach((line, index) => {
            if (index === 0) {
              parts.push(`    ${line}`);
            } else {
              parts.push(`    ${line}`);
            }
          });

          if (!func.endsWith(",")) {
            // Add comma between methods
            const lastIndex = parts.length - 1;
            if (parts[lastIndex] && !parts[lastIndex].trim().endsWith(",")) {
              parts[lastIndex] = parts[lastIndex] + ",";
            }
          }
        });

        // Remove trailing comma from last method
        const lastMethodIndex = parts.length - 1;
        if (parts[lastMethodIndex]) {
          parts[lastMethodIndex] = parts[lastMethodIndex].replace(/,$/, "");
        }
      } else {
        parts.push("    // Add your component methods here");
      }

      parts.push("  },");
      parts.push("  mounted() {");
      parts.push("    // Add lifecycle hooks here");
      parts.push("  }");
      parts.push("})");
      parts.push("</" + "script>");
    }

    if (styleBlocks.length > 0) {
      parts.push("");
      parts.push("<" + "style scoped>");
      parts.push("/* Converted styles - review and adjust */");

      styleBlocks.forEach((b) => {
        parts.push("");
        // Normalize indentation in style blocks
        b.split("\n").forEach((styleLine) => {
          const trimmed = styleLine.trim();
          if (trimmed) parts.push(trimmed);
        });
      });

      parts.push("</" + "style>");
    }

    return parts.join("\n");
  } catch (err) {
    return `<!-- Error converting HTML to Vue component: ${err} -->`;
  }
};
