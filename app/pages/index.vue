<template>
  <div class="app-container">
    <Header />

    <main class="main-content">
      <div class="converter-container">
        <!-- API Style Selection -->
        <div class="api-selector">
          <label class="api-label">Vue API Style:</label>
          <div class="api-options">
            <button
              class="api-button"
              :class="{ active: apiStyle === 'composition' }"
              @click="apiStyle = 'composition'"
            >
              <Icon name="uil:brackets-curly" class="api-icon" />
              Composition API
            </button>
            <button
              class="api-button"
              :class="{ active: apiStyle === 'options' }"
              @click="apiStyle = 'options'"
            >
              <Icon name="uil:setting" class="api-icon" />
              Options API
            </button>
          </div>
        </div>

        <!-- Two-column converter -->
        <div class="converter-grid">
          <!-- HTML Input Editor -->
          <CodeEditor
            v-model="htmlCode"
            title="HTML Input"
            icon="uil:html5"
            :editable="true"
            :show-upload="true"
            :show-clear="true"
            placeholder="Paste your HTML code here..."
            footer-text="Type or paste your HTML code"
          />

          <!-- Vue Output Editor -->
          <CodeEditor
            :model-value="vueCode"
            title="Vue Output"
            icon="uil:vuejs"
            :editable="false"
            :show-download="true"
            :show-copy="true"
            download-file-name="component.vue"
            placeholder="Your Vue component will appear here..."
            footer-text="Converted Vue component"
          />
        </div>

        <!-- Feature cards -->
        <div class="features-section">
          <div class="feature-card">
            <Icon name="uil:bolt" class="feature-icon" />
            <h3 class="feature-title">Lightning Fast</h3>
            <p class="feature-description">
              Convert HTML to Vue components instantly
            </p>
          </div>

          <div class="feature-card">
            <Icon name="uil:check-circle" class="feature-icon" />
            <h3 class="feature-title">Clean Output</h3>
            <p class="feature-description">Generate well-structured Vue code</p>
          </div>

          <div class="feature-card">
            <Icon name="uil:brush-alt" class="feature-icon" />
            <h3 class="feature-title">Style Preserved</h3>
            <p class="feature-description">Maintains your CSS and styling</p>
          </div>

          <div class="feature-card">
            <Icon name="uil:cog" class="feature-icon" />
            <h3 class="feature-title">Customizable</h3>
            <p class="feature-description">Flexible conversion options</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <div class="flex items-center gap-2 justify-center cursor-pointer">
        <Icon name="uil:heart" class="footer-icon text-red-500" />
        <p class="footer-text">Built for Vue developers</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const htmlCode = ref("");
const apiStyle = ref<"composition" | "options">("composition");

/** Auto-convert HTML → Vue */
const vueCode = computed(() => {
  if (!htmlCode.value.trim()) return "";

  return convert(htmlCode.value, apiStyle.value);
});
</script>

<style scoped>
/* Your layout styles remain unchanged — these were valid */
.app-container {
  min-height: 100vh;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.converter-container {
  max-width: 1400px;
  margin: 0 auto;
}

.api-selector {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.api-label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 1rem;
}

.api-options {
  display: flex;
  gap: 0.75rem;
}

.api-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.api-button:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
}

.api-button.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.api-icon {
  font-size: 1.25rem;
}

.converter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  min-height: 500px;
  margin-bottom: 3rem;
}

/* Mobile responsive: stack vertically on smaller screens */
@media (max-width: 768px) {
  .converter-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    min-height: auto;
  }

  /* Increase editor height on mobile */
  .converter-grid > * {
    min-height: 400px;
  }
}

@media (max-width: 480px) {
  /* Even better height for very small screens */
  .converter-grid > * {
    min-height: 350px;
  }
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.75rem;
  text-align: center;
  transition: all 0.2s ease;
}

.feature-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.feature-description {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
}

.app-footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 1.5rem 2rem;
  margin-top: auto;
}

.footer-text {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  color: var(--color-text-secondary);
}

/* Additional mobile optimizations */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .api-selector {
    padding: 1rem;
    gap: 1rem;
  }

  .api-button {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .api-icon {
    font-size: 1.125rem;
  }

  .features-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-card {
    padding: 1.25rem;
  }
}
</style>
