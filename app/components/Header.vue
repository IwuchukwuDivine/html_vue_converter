<template>
  <header class="header">
    <div class="header-content">
      <div class="logo-section">
        <Icon name="uil:code" class="logo-icon" />
        <h1 class="title">HTML to Vue Converter</h1>
      </div>

      <button
        @click="toggleDark()"
        class="theme-toggle"
        aria-label="Toggle theme"
      >
        <Icon v-if="isDark" name="uil:sun" class="theme-icon" />
        <Icon v-else name="uil:moon" class="theme-icon" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1.25rem 2rem;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(8px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.logo-icon {
  font-size: 2rem;
  color: var(--color-primary);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.025em;
}

.theme-toggle {
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.theme-toggle:hover .theme-icon {
  color: white;
}

.theme-icon {
  font-size: 1.5rem;
  color: var(--color-text);
  transition: color 0.2s ease;
}
</style>
