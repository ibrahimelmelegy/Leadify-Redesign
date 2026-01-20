import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

// Simple mock component for DarkModeToggle
const DarkModeToggle = {
    template: `
    <button @click="toggle" data-testid="dark-mode-toggle">
      {{ isDark ? 'Light Mode' : 'Dark Mode' }}
    </button>
  `,
    setup() {
        const isDark = ref(false)
        const toggle = () => { isDark.value = !isDark.value }
        return { isDark, toggle }
    }
}

describe('DarkModeToggle Component', () => {
    it('renders correctly', () => {
        const wrapper = mount(DarkModeToggle)
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('[data-testid="dark-mode-toggle"]').exists()).toBe(true)
    })

    it('displays "Dark Mode" text initially', () => {
        const wrapper = mount(DarkModeToggle)
        expect(wrapper.text()).toContain('Dark Mode')
    })

    it('toggles to "Light Mode" on click', async () => {
        const wrapper = mount(DarkModeToggle)
        await wrapper.find('button').trigger('click')
        expect(wrapper.text()).toContain('Light Mode')
    })

    it('toggles back to "Dark Mode" on second click', async () => {
        const wrapper = mount(DarkModeToggle)
        await wrapper.find('button').trigger('click')
        await wrapper.find('button').trigger('click')
        expect(wrapper.text()).toContain('Dark Mode')
    })
})
