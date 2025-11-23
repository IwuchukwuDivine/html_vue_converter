<template>
  <div class="code-editor">
    <div class="editor-header">
      <div class="header-left">
        <Icon :name="icon" class="editor-icon" />
        <h2 class="editor-title">{{ title }}</h2>
      </div>
      <div class="header-right">
        <button
          v-if="showUpload"
          @click="handleUploadClick"
          class="action-btn"
          aria-label="Upload file"
        >
          <Icon name="uil:file-upload-alt" class="action-icon" />
        </button>
        <input
          v-if="showUpload"
          ref="fileInput"
          type="file"
          accept=".html,.htm"
          @change="handleFileUpload"
          class="file-input"
        />
        <button
          v-if="showDownload"
          @click="handleDownload"
          class="action-btn"
          aria-label="Download file"
        >
          <Icon name="uil:download-alt" class="action-icon" />
        </button>
        <button
          v-if="showCopy"
          @click="handleCopy"
          class="action-btn"
          :class="{ copied: isCopied }"
          aria-label="Copy code"
        >
          <Icon
            :name="isCopied ? 'uil:check-circle' : 'uil:copy'"
            class="action-icon"
            :class="{ 'icon-copied': isCopied }"
          />
        </button>
        <button
          v-if="showClear"
          @click="handleClear"
          class="action-btn"
          aria-label="Clear code"
        >
          <Icon name="uil:trash-alt" class="action-icon" />
        </button>
      </div>
    </div>

    <div class="editor-container">
      <textarea
        v-if="editable"
        :value="modelValue"
        @input="
          $emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value
          )
        "
        :placeholder="placeholder"
        class="editor-textarea"
        spellcheck="false"
      />
      <pre
        v-else
        class="editor-preview"
      ><code>{{ modelValue || placeholder }}</code></pre>
    </div>

    <div class="editor-footer">
      <div class="footer-info">
        <Icon name="uil:info-circle" class="info-icon" />
        <span class="info-text">{{ footerText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  title: string;
  icon: string;
  modelValue?: string;
  placeholder?: string;
  editable?: boolean;
  showCopy?: boolean;
  showClear?: boolean;
  showUpload?: boolean;
  showDownload?: boolean;
  downloadFileName?: string;
  footerText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Enter your code here...",
  editable: true,
  showCopy: false,
  showClear: false,
  showUpload: false,
  showDownload: false,
  downloadFileName: "file.vue",
  footerText: "Ready",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  clear: [];
  upload: [content: string];
  download: [];
}>();
const isCopied = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleUploadClick = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      emit("update:modelValue", content);
      emit("upload", content);

      // Reset input so the same file can be selected again
      if (target) target.value = "";
    };
    reader.readAsText(file);
  }
};

const handleDownload = () => {
  if (!props.modelValue) return;

  const blob = new Blob([props.modelValue], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = props.downloadFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  emit("download");
};

const handleCopy = async () => {
  if (!props.modelValue) return;

  try {
    await navigator.clipboard.writeText(props.modelValue);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const handleClear = () => {
  emit("update:modelValue", "");
  emit("clear");
};
</script>

<style scoped>
.code-editor {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.code-editor:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-lg);
}

.editor-header {
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.editor-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.editor-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.header-right {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.action-btn:hover .action-icon {
  color: white;
}

.action-btn.copied {
  background: var(--color-success);
  border-color: var(--color-success);
}

.action-btn.copied .action-icon {
  color: white;
}

.action-icon {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.action-icon.icon-copied {
  animation: scaleSuccess 0.3s ease-out;
}

@keyframes scaleSuccess {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.editor-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background: var(--color-code-bg);
  color: var(--color-text);
  border: none;
  outline: none;
  font-family: "Fira Code", "Cascadia Code", "SF Mono", Monaco, Consolas,
    monospace;
  font-size: 0.9375rem;
  line-height: 1.6;
  resize: none;
  tab-size: 2;
}

.editor-textarea::placeholder {
  color: var(--color-text-muted);
}

.editor-preview {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background: var(--color-code-bg);
  color: var(--color-text);
  margin: 0;
  overflow: auto;
}

.editor-preview code {
  font-family: "Fira Code", "Cascadia Code", "SF Mono", Monaco, Consolas,
    monospace;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.editor-footer {
  background: var(--color-surface-secondary);
  border-top: 1px solid var(--color-border);
  padding: 0.75rem 1.25rem;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-icon {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.info-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.file-input {
  display: none;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .editor-header {
    padding: 0.875rem 1rem;
  }

  .editor-title {
    font-size: 1rem;
  }

  .editor-icon {
    font-size: 1.25rem;
  }

  .action-btn {
    padding: 0.375rem;
  }

  .action-icon {
    font-size: 1rem;
  }

  .editor-textarea,
  .editor-preview {
    padding: 1rem;
    font-size: 0.875rem;
  }

  .editor-footer {
    padding: 0.625rem 1rem;
  }

  .info-text {
    font-size: 0.8125rem;
  }
}
</style>
