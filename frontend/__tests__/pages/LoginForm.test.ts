import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, reactive, nextTick } from 'vue'

// Mock Login Form component
const LoginForm = {
    template: `
    <form @submit.prevent="handleSubmit" data-testid="login-form">
      <div>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="Email"
          data-testid="email-input"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" data-testid="email-error">{{ errors.email }}</span>
      </div>
      <div>
        <input 
          v-model="form.password" 
          type="password" 
          placeholder="Password"
          data-testid="password-input"
          :class="{ error: errors.password }"
        />
        <span v-if="errors.password" data-testid="password-error">{{ errors.password }}</span>
      </div>
      <button type="submit" :disabled="loading" data-testid="submit-button">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
    </form>
  `,
    emits: ['submit'],
    setup(props: any, { emit }: any) {
        const form = reactive({ email: '', password: '' })
        const errors = reactive({ email: '', password: '' })
        const loading = ref(false)

        const validate = () => {
            errors.email = ''
            errors.password = ''

            if (!form.email) {
                errors.email = 'Email is required'
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                errors.email = 'Invalid email format'
            }

            if (!form.password) {
                errors.password = 'Password is required'
            } else if (form.password.length < 6) {
                errors.password = 'Password must be at least 6 characters'
            }

            return !errors.email && !errors.password
        }

        const handleSubmit = async () => {
            if (validate()) {
                loading.value = true
                emit('submit', { ...form })
                loading.value = false
            }
        }

        return { form, errors, loading, handleSubmit }
    }
}

describe('LoginForm Component', () => {
    it('renders form correctly', () => {
        const wrapper = mount(LoginForm)
        expect(wrapper.find('[data-testid="login-form"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(true)
    })

    it('shows error when submitting empty form', async () => {
        const wrapper = mount(LoginForm)
        await wrapper.find('form').trigger('submit')
        await nextTick()

        const emailError = wrapper.find('[data-testid="email-error"]')
        const passwordError = wrapper.find('[data-testid="password-error"]')
        expect(emailError.exists()).toBe(true)
        expect(passwordError.exists()).toBe(true)
    })

    it('shows error for invalid email format', async () => {
        const wrapper = mount(LoginForm)

        await wrapper.find('[data-testid="email-input"]').setValue('invalid-email')
        await wrapper.find('[data-testid="password-input"]').setValue('password123')
        await wrapper.find('form').trigger('submit')
        await nextTick()

        const emailError = wrapper.find('[data-testid="email-error"]')
        expect(emailError.exists()).toBe(true)
    })

    it('shows error for short password', async () => {
        const wrapper = mount(LoginForm)

        await wrapper.find('[data-testid="email-input"]').setValue('test@example.com')
        await wrapper.find('[data-testid="password-input"]').setValue('12345')
        await wrapper.find('form').trigger('submit')
        await nextTick()

        const passwordError = wrapper.find('[data-testid="password-error"]')
        expect(passwordError.exists()).toBe(true)
    })

    it('emits submit event with valid data', async () => {
        const wrapper = mount(LoginForm)

        await wrapper.find('[data-testid="email-input"]').setValue('admin@leadify.com')
        await wrapper.find('[data-testid="password-input"]').setValue('admin123')
        await wrapper.find('form').trigger('submit')
        await nextTick()

        const emitted = wrapper.emitted('submit')
        expect(emitted).toBeTruthy()
        expect(emitted![0]).toEqual([{
            email: 'admin@leadify.com',
            password: 'admin123'
        }])
    })

    it('does not emit submit with invalid data', async () => {
        const wrapper = mount(LoginForm)

        await wrapper.find('[data-testid="email-input"]').setValue('')
        await wrapper.find('[data-testid="password-input"]').setValue('')
        await wrapper.find('form').trigger('submit')
        await nextTick()

        expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('button text shows "Login" initially', () => {
        const wrapper = mount(LoginForm)
        expect(wrapper.find('[data-testid="submit-button"]').text()).toBe('Login')
    })
})
