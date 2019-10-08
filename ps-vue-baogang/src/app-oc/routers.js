import noMatch from "../tools/prod_no_match";
const routes = (names) => {
  let routes = names.map(({ name, path, filename }) => {
    return {
      path: `/:mainIndex/:subIndex/${path}`,
      name,
      component() {
        return import(`./router${filename}.vue`)
      }
    }
  });
  return {
    routes
  }
}
export default routes
