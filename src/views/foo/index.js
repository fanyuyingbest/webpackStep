import router from '../../router'

import template from './index.html'
// import './style.css'

// 导出类

export default class {
  mount (container) {
    document.title = 'foo'
    container.innerHTML = template
    container.querySelector('.foo_gobar'.addEventListener('click', () => {
      // 调用router
      router.go('/bar')
    }))
  }
}
