import request from '@/utils/request'

const service = {
  //树列表
  getGridTreeList: function ( query ) {
    return request( {
      url: '/api/gridManage/loadGridManageTreeByNodeGuid',
      method: 'post',
      data: query
    } );
  },
  getUsersByGridList: function ( query ) {
    return request( {
      url: '/api/user/findUsersByGrid',
      method: 'post',
      data: query
    } );
  }
};

export default service;