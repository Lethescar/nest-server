import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const about: AppRouteModule = {
  path: '/about',
  name: 'About',
  component: LAYOUT,
  redirect: '/about/server',
  meta: {
    icon: 'simple-icons:aboutdotme',
    title: t('routes.about.about'),
    orderNo: 10000,
  },
  children: [
    {
      path: 'server',
      name: 'ServerPage',
      component: () => import('/@/views/about/server/index.vue'),
      meta: {
        title: t('routes.about.server'),
      },
    },
    {
      path: 'file',
      name: 'FilePage',
      component: () => import('/@/views/about/file/index.vue'),
      meta: {
        title: t('routes.about.file'),
      },
    },
  ],
};

export default about;
