import request from '../../utils/request'

const service = {
     // 查询列表
     getTreeList: function (query) {
        return request({
            url: '/api/companyDepartment/tree',
            method: 'post',
            data: query
        });
    }
};

export default service;