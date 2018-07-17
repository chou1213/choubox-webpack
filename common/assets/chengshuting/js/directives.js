let directives = {};
directives.lang = function (el, binding) {
  if (binding.value == 'ar') {
    el.style.textAlign = 'right';
    el.style.direction = 'rtl';
  }
};
directives.langCenter = function (el, binding) {
  if (binding.value == 'ar') {
    el.style.direction = 'rtl';
  }
};
export default directives;