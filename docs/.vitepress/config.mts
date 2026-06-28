import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/ci-cd-failure-diagnoser/',
  locales: {
    root: { description: 'AI-powered CI/CD failure diagnoser', label: 'English', lang: 'en', title: 'CI/CD Failure Diagnoser' },
    zh: { description: 'AI驱动的CI/CD故障诊断器', label: '简体中文', lang: 'zh-CN', link: '/zh/', title: 'CI/CD故障诊断器' },
  },
})