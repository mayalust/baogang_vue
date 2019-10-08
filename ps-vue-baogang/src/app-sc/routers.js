import routersTemplate from './routers-template';
import validate from './validate'
const { createMainRouter, createLv1Router, createLv2Router } = routersTemplate,
routes = (names) => {
  let routes = [{
      path: "/",
      name: "validate",
      component: validate
    }]
    .concat(names.map(name => createMainRouter(name)))
    .concat(names.map(name => createLv1Router(name)))
    .concat(names.map(name => createLv2Router(name)));
  return {
    routes
  }
}
export default routes