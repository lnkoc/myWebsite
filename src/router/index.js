import { createRouter, createMemoryHistory } from 'vue-router'
import BlogView from '../views/HomePage/BlogView.vue'
import HomePage from '@/layouts/HomePage.vue'
import { useSessionStore } from '@/stores/session'

const router = createRouter({
  history: createMemoryHistory(), // import.meta.env.BASE_URL
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      children: [
        {
          path: '/blog',
          name: 'blog',
          component: BlogView
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/HomePage/AboutView.vue')
        },
        {
          path: '/webgl',
          name: 'webgl',
          component: () => import('../views/HomePage/WebGLView.vue')
        },
        {
          path: '/contact',
          name: 'contact',
          component: () => import('../views/HomePage/ContactView.vue')
        },
        {
          path: '/hobby',
          name: 'hobby',
          component: () => import('../views/HomePage/HobbyView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../layouts/DashBoard.vue'),
      meta: { requiesAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard/summary'
        },
        {
          path: '/dashboard/summary',
          name: 'summary',
          component: () => import('../views/DashBoard/SummaryView.vue')
        },
        {
          path: '/dashboard/create',
          name: 'create',
          component: () => import('../views/DashBoard/CreateView.vue')
        },
        {
          path: '/dashboard/list',
          name: 'list',
          component: () => import('../views/DashBoard/ListView.vue'),
          children: [
            {
              path: '/edit-article/:date/id=:articleId',
              name: 'editArticle',
              props: true,
              component: () => import('../components/EditArticle.vue')
            }
          ]
        },
        {
          path: '/dashboard/drafts',
          name: 'drafts',
          component: () => import('../views/DashBoard/DraftsView.vue'),
          children: [
            {
              path: '/edit-draft/id=:articleId',
              name: 'editDraft',
              props: true,
              component: () => import('../components/EditDraft.vue')
            }
          ]
        },
        {
          path: '/dashboard/pictures',
          name: 'pictures',
          component: () => import('../views/DashBoard/PicturesView.vue')
        },
        {
          path: '/dashboard/trash',
          name: 'trash',
          component: () => import('../views/DashBoard/TrashView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const store = useSessionStore()

  if (to.meta.requiesAuth == true && !store.isAuth) {
    return {
      path: '/login'
    }
  }
})

export default router
