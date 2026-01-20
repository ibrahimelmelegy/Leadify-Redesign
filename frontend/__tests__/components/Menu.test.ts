import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

// Mock Menu component for testing
const Menu = {
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    template: `
    <nav data-testid="menu-container">
      <ul>
        <li 
          v-for="(item, index) in items" 
          :key="index"
          data-testid="menu-item"
          :class="{ active: item.active }"
          @click="$emit('select', item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </nav>
  `
}

describe('Menu Component', () => {
    const mockItems = [
        { label: 'Dashboard', path: '/', active: true },
        { label: 'Leads', path: '/sales/leads', active: false },
        { label: 'Clients', path: '/sales/clients', active: false },
        { label: 'Proposals', path: '/sales/proposals', active: false }
    ]

    it('renders menu container', () => {
        const wrapper = mount(Menu, {
            props: { items: mockItems }
        })
        expect(wrapper.find('[data-testid="menu-container"]').exists()).toBe(true)
    })

    it('renders all menu items', () => {
        const wrapper = mount(Menu, {
            props: { items: mockItems }
        })
        const items = wrapper.findAll('[data-testid="menu-item"]')
        expect(items.length).toBe(4)
    })

    it('displays correct labels', () => {
        const wrapper = mount(Menu, {
            props: { items: mockItems }
        })
        expect(wrapper.text()).toContain('Dashboard')
        expect(wrapper.text()).toContain('Leads')
        expect(wrapper.text()).toContain('Clients')
        expect(wrapper.text()).toContain('Proposals')
    })

    it('emits select event on item click', async () => {
        const wrapper = mount(Menu, {
            props: { items: mockItems }
        })
        await wrapper.findAll('[data-testid="menu-item"]')[1].trigger('click')
        expect(wrapper.emitted('select')).toBeTruthy()
        expect(wrapper.emitted('select')![0]).toEqual([mockItems[1]])
    })

    it('applies active class to active item', () => {
        const wrapper = mount(Menu, {
            props: { items: mockItems }
        })
        const activeItem = wrapper.findAll('[data-testid="menu-item"]')[0]
        expect(activeItem.classes()).toContain('active')
    })

    it('renders empty when no items provided', () => {
        const wrapper = mount(Menu, {
            props: { items: [] }
        })
        const items = wrapper.findAll('[data-testid="menu-item"]')
        expect(items.length).toBe(0)
    })
})
