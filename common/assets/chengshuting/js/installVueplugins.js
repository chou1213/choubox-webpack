import filters from './filters.js';
import directives from './directives.js';
export default {
  install:function (Vue,options) {

    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    });
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    });
  }
}