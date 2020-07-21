import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard',
        noCache: true,
        affix: true
      }
    }]
  },
  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: { title: '系统设置', icon: 'table' },
    children: [
      {
        path: 'index',
        name: 'system_index',
        component: () => import('@/views/system/index'),
        meta: { title: '系统设置', icon: 'sets' },
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'user',
    meta: { title: '用户管理', icon: 'table' },
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' },
      }
    ]
  },
  // {
  //   path: '/auth',
  //   component: Layout,
  //   name: 'permission',
  //   meta: { title: '权限管理', icon: 'auths' },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('@/views/user/admin_index'),
  //       meta: { title: '管理员', icon: 'auth' }
  //     },
  //     {
  //       path: 'roles',
  //       name: 'roles',
  //       component: () => import('@/views/roles/index'),
  //       meta: { title: '角色', icon: '' }
  //     },
  //     {
  //       path: 'permission',
  //       name: '_permission',
  //       component: () => import('@/views/permission/index'),
  //       meta: { title: '权限', icon: '' }
  //     },
  //     {
  //       path: 'menu',
  //       name: 'menu',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: '菜单', icon: '' }
  //     },
  //     {
  //       path: 'operating_log',
  //       name: 'operating_log',
  //       component: () => import('@/views/operating/index'),
  //       meta: { title: '操作日志', icon: '' }
  //     }
  //   ]
  // },
  {
    path: '/goods',
    component: Layout,
    name: 'goods',
    meta: { title: '产品管理', icon: 'order' },
    children: [
      {
        path: 'goods',
        name: 'goods_box',
        component: () => import('@/views/goods/goods/index'),
        meta: { title: '商品列表', icon: 'goods' },
        children: [
          {
            path: 'index',
            name: 'goods_index',
            component: () => import('@/views/goods/goods/list'),
            meta: { title: '商品列表', icon: 'goods' },
          },
          {
            path: 'add_edit',
            name: 'goods_add_edit',
            component: () => import('@/views/goods/goods/add_edit'),
            meta: { title: '商品编辑', icon: '' },
            hidden: true
          },
        ]
      },
      {
        path: 'goods_category',
        name: 'goods_category',
        component: () => import('@/views/goods/goods_category/index'),
        meta: { title: '商品分类', icon: 'goods_category' },
        redirect: 'index',
        children: [
          {
            path: 'index',
            name: 'goods_category_index',
            component: () => import('@/views/goods/goods_category/list'),
            meta: { title: '商品分类', icon: 'goods_category' },
          },
          {
            path: 'add_edit',
            name: 'goods_category_add_edit',
            component: () => import('@/views/goods/goods_category/add_edit'),
            meta: { title: '商品编辑', icon: '' },
            hidden: true
          },
        ]
      },

    ]
  },
  {
    path: '/banner',
    component: Layout,
    name: 'banner',
    meta: { title: '广告管理', icon: 'banner' },
    children: [
      {
        path: 'banner',
        name: 'banner_box',
        component: () => import('@/views/banner/banner/index'),
        meta: { title: '广告列表', icon: '' },
        children: [
          {
            path: 'index',
            name: 'banner_index',
            component: () => import('@/views/banner/banner/list'),
            meta: { title: '广告列表', icon: '' },
          },
          {
            path: 'add_edit',
            name: 'banner_add_edit',
            component: () => import('@/views/banner/banner/add_edit'),
            meta: { title: '广告编辑', icon: '' },
            hidden: true
          },
        ]
      },
      {
        path: 'banner_type',
        name: 'banner_type',
        component: () => import('@/views/banner/banner_type/index'),
        redirect: 'index',
        children: [
          {
            path: 'index',
            name: 'banner_type_index',
            component: () => import('@/views/banner/banner_type/list'),
            meta: { title: '广告分类', icon: '' },
          },
          {
            path: 'add_edit',
            name: 'banner_type_add_edit',
            component: () => import('@/views/banner/banner_type/add_edit'),
            meta: { title: '广告分类编辑', icon: '' },
            hidden: true
          },
        ]
      },

    ]
  },
  {
    path: '/article',
    component: Layout,
    name: 'article',
    meta: { title: '文章管理', icon: 'article' },
    children: [
      {
        path: 'article',
        name: 'article_box',
        component: () => import('@/views/article/article/index'),
        meta: { title: '文章列表', icon: 'article' },
        children: [
          {
            path: 'index',
            name: 'article_index',
            component: () => import('@/views/article/article/list'),
            meta: { title: '文章列表', icon: 'article_category' },
          },
          {
            path: 'add_edit',
            name: 'article_add_edit',
            component: () => import('@/views/article/article/add_edit'),
            meta: { title: '文章编辑', icon: '' },
            hidden: true
          },
        ]
      },

    ]
  },
  {
    path: '/account',
    component: Layout,
    name: 'account',
    meta: { title: '充值对账管理', icon: 'rechargels' },
    children: [
      {
        path: 'turnover_box',
        component: () => import('@/views/account/index'),
        name: 'turnover_box',
        meta: { title: '充值对账管理', icon: 'rechargels' },
        children: [
          {
            path: 'turnover',
            name: 'turnover',
            component: () => import('@/views/account/turnover/list'),
            meta: { title: '流水列表', icon: '' },
          },
        ]
      },

      {
        path: 'graph_box',
        component: () => import('@/views/account/index'),
        name: 'graph_box',
        meta: { title: '充值对账管理', icon: 'rechargels' },
        children: [
          {
            path: 'graph',
            name: 'graph',
            component: () => import('@/views/account/graph/list'),
            meta: { title: '统计信息', icon: ''},
          },
        ]
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: { title: '订单管理', icon: 'order' },
    children: [
      {
        path: '/order_box',
        component: () => import('@/views/order/index'),
        name: 'order_box',
        meta: { title: '订单列表', icon: 'order' },
        children: [
          {
            path: 'order_index',
            name: 'order_index',
            component: () => import('@/views/order/order/list'),
            meta: { title: '订单列表', icon: '' },
          },
        ]
      },
      {
        path: '/packager_box',
        component: () => import('@/views/order/index'),
        name: 'packager_box',
        meta: { title: '包裹列表', icon: 'order' },
        children: [
          {
            path: 'packager_index',
            name: 'packager_index',
            component: () => import('@/views/order/package/list'),
            meta: { title: '包裹列表', icon: ''},
          },
        ]
      },
    ]
  },

  {
    path: '/weight',
    component: Layout,
    redirect: '/weight/index',
    meta: { title: '重量价格管理', icon: 'package' },
    children:[
      {
        path: 'index',
        name: 'weight_index',
        component: () => import('@/views/weight/list'),
        meta: { title: '重量价格管理', icon: 'package' },
        hidden: true
      },
      {
        path: 'add_edit',
        name: 'weight_add_edit',
        component: () => import('@/views/weight/add_edit'),
        meta: { title: '重量价格编辑', icon: '' },
        hidden: true
      }
    ]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
