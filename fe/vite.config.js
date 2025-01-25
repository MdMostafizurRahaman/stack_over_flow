import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      API_BASE_URL: JSON.stringify(process.env.NODE_ENV === 'production' ? 'http://user-service:3001' : 'http://localhost:3001'),
      POST_SERVICE_URL: JSON.stringify(process.env.NODE_ENV === 'production' ? 'http://post-service:3003' : 'http://localhost:3003'),
      NOTIFICATION_SERVICE_URL: JSON.stringify(process.env.NODE_ENV === 'production' ? 'http://notification-service:3002' : 'http://localhost:3002')
    }
  }
})