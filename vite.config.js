import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'DynamicReportListing',
      fileName: (format) => `dynamic-report-listing.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'date-range-picker-mui'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'date-range-picker-mui': 'DateRangePickerMui'
        },
      },
    },
  },
})