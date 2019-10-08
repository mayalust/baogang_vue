import main from './frames/prod_main';
import secondLv from './frames/prod_2ndlv';
import thirdLv from './frames/prod_3rdlv';
class RouterTemplate {
  createMainRouter({ name, path, filename }, component) {
    if (component == null) {
      component = () => import("./router" + filename + ".vue");
    }
    return {
      path: '/main/:id/:showTree/:deviceOnly/:mainIndex',
      name: "main_" + name,
      component: main,
      children: [{
        path,
        name,
        component
      }]
    }
  }
  createLv1Router({ name, path, filename }, component) {
    if (component == null) {
      component = () => import("./router" + filename + ".vue");
    }
    return {
      path: '/lv2/:id/:showTree/:deviceOnly/:mainIndex',
      name: "main2lv_1stLevel_" + name,
      component: main,
      children: [{
        name: "main2lv_2ndLevel_" + name,
        path: ":subIndex",
        component: secondLv,
        children: [{
          path,
          name: "main2lv_" + name,
          component
        }]
      }]
    }
  }
  createLv2Router({ name, path, filename }, component) {
    if (component == null) {
      component = () => import("./router" + filename + ".vue");
    }
    return {
      path: '/lv3/:id/:showTree/:deviceOnly/:mainIndex',
      name: "main3lv_1stLevel_" + name,
      component: main,
      children: [{
        name: "main3lv_2ndLevel_" + name,
        path: ":subIndex",
        component: secondLv,
        children: [{
          name: "main3lv_3rdLevel_" + name,
          path: ":minorIndex",
          component: thirdLv,
          children: [{
            path,
            name: "main3lv_" + name,
            component
          }]
        }]
      }]
    }
  }
}
export default new RouterTemplate
