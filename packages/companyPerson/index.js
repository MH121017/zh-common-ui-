import companyPerson from './src/companyPerson.vue';

companyPerson.install = function (Vue) {
  Vue.component(companyPerson.name, companyPerson)
}

export default companyPerson