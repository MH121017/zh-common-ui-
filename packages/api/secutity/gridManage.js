import request from '@/utils/request'

const service = {

  getGridTreeList: function (query) {
    return request({
      url:  '/api/gridManage/loadGridManageTreeByNodeGuid',
      method: 'post',
      data: query
    });
  }
};

export default service;