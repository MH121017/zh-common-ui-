import request from '../../utils/request'

const service = {

  // 查询列表
  getList: function (query) {
    return request({
      url:  '/api/nationalEconomyType/loadEconomyTypeTree',
      method: 'post',
      data: query
    });
  },

};

export default service;