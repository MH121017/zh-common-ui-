import request from '../../utils/request'

const service = {
  /**
   * @description 获取企业vo列表
   * @param {Object} query
   */
  getVoList: function(query) {
    return request({
      url: '/api/company/getVoList',
      method: 'post',
      data: query
    })
  }
}

export default service