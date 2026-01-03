<template lang="pug">
.onboarding-tour(v-if="showTour")
  .tour-overlay(@click.self="skipTour")
  .tour-tooltip(:style="tooltipStyle")
    .tour-content
      .tour-step-indicator
        span(
          v-for="(step, index) in steps"
          :key="index"
          :class="{ active: index === currentStep, completed: index < currentStep }"
        )
      h3.tour-title {{ currentStepData.title }}
      p.tour-description {{ currentStepData.description }}
    .tour-actions
      el-button(v-if="currentStep > 0" @click="prevStep") Previous
      el-button(type="default" @click="skipTour") Skip
      el-button(
        type="primary"
        @click="nextStep"
      ) {{ isLastStep ? 'Finish' : 'Next' }}
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface TourStep {
  target: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const props = withDefaults(defineProps<{
  steps: TourStep[];
  storageKey?: string;
}>(), {
  storageKey: 'onboarding_completed'
});

const emit = defineEmits(['complete', 'skip']);

const showTour = ref(false);
const currentStep = ref(0);

const currentStepData = computed(() => props.steps[currentStep.value]);
const isLastStep = computed(() => currentStep.value === props.steps.length - 1);

const tooltipStyle = computed(() => {
  const step = currentStepData.value;
  const target = document.querySelector(step.target);
  
  if (!target) {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
  
  const rect = target.getBoundingClientRect();
  const placement = step.placement || 'bottom';
  
  let top = 0;
  let left = 0;
  
  switch (placement) {
    case 'top':
      top = rect.top - 10;
      left = rect.left + rect.width / 2;
      return { top: `${top}px`, left: `${left}px`, transform: 'translate(-50%, -100%)' };
    case 'bottom':
      top = rect.bottom + 10;
      left = rect.left + rect.width / 2;
      return { top: `${top}px`, left: `${left}px`, transform: 'translateX(-50%)' };
    case 'left':
      top = rect.top + rect.height / 2;
      left = rect.left - 10;
      return { top: `${top}px`, left: `${left}px`, transform: 'translate(-100%, -50%)' };
    case 'right':
      top = rect.top + rect.height / 2;
      left = rect.right + 10;
      return { top: `${top}px`, left: `${left}px`, transform: 'translateY(-50%)' };
  }
});

onMounted(() => {
  const completed = localStorage.getItem(props.storageKey);
  if (!completed) {
    setTimeout(() => {
      showTour.value = true;
      highlightElement();
    }, 1000);
  }
});

onUnmounted(() => {
  removeHighlight();
});

function highlightElement() {
  removeHighlight();
  const step = currentStepData.value;
  const target = document.querySelector(step.target);
  if (target) {
    target.classList.add('tour-highlight');
  }
}

function removeHighlight() {
  document.querySelectorAll('.tour-highlight').forEach(el => {
    el.classList.remove('tour-highlight');
  });
}

function nextStep() {
  if (isLastStep.value) {
    completeTour();
  } else {
    currentStep.value++;
    highlightElement();
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
    highlightElement();
  }
}

function skipTour() {
  showTour.value = false;
  removeHighlight();
  localStorage.setItem(props.storageKey, 'skipped');
  emit('skip');
}

function completeTour() {
  showTour.value = false;
  removeHighlight();
  localStorage.setItem(props.storageKey, 'completed');
  emit('complete');
}
</script>

<style>
.tour-highlight {
  position: relative;
  z-index: 10001;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
  border-radius: 8px;
}
</style>

<style scoped>
.onboarding-tour {
  position: fixed;
  inset: 0;
  z-index: 10000;
}

.tour-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.tour-tooltip {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 10002;
}

.tour-step-indicator {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.tour-step-indicator span {
  width: 24px;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  transition: background 0.3s;
}

.tour-step-indicator span.active {
  background: #3b82f6;
}

.tour-step-indicator span.completed {
  background: #10b981;
}

.tour-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.tour-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.tour-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
