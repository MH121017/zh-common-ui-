import request from '../../utils/request'

const service = {
  // 查询列表
  getListEmployee: function (query) {
    return request({
      url:  '/api/companyEmployee/listEmployee',
      method: 'post',
      data: query
    });
  }
};

export default service;