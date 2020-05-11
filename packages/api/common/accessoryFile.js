import request from "../../utils/request";

const service = {
  getFileListByEntity: function(entity) {
    return request({
      url: "/api/accessoryFile/findListByParentGuid",
      method: "post",
      data: entity
    });
  },
  // 删除
  deleteOne: function(id) {
    return request({
      url: "/api/accessoryFile/delete/" + id,
      method: "post"
    });
  }
};

export default service;
