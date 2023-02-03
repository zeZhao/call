import request from "./http"

export default {
  login:{
    login(params){
      return request('/attend/login','post',params)
    },
    logout(params){
      return request('/attend/logout','get',params)
    }
  },
  // 下拉接口
  select: {
    //获取公司
    // corpType（0:商家,1:代理商,2:供应商）
    queryCorpByCorpType(data) {
      return request('/corp/queryCorpByCorpType', 'get', data)
    },
    // 获取供应商
    corpListAll(data) {
      return request('/corpSupply/listAll', 'post', data)
    },
    // 获取商户
    userListAll(data) {
      return request('/corpUser/listAll', 'post', data)
    },
    // 获取代理商
    agentListAll(data) {
      return request('/corpAgent/listAll', 'post', data)
    },
    // 获取省份
    provincecity(data) {
      return request('/provincecity/get', 'post', data)
    },
    // 获取坐席
    attendlistAll(data) {
      return request('/attend/listAll', 'post', data)
    },
    // 获取IVR流程下拉
    IVRlistAll(data) {
      return request('/skillGroup/listAll', 'get', data)
    },
  },
  // 外呼管理
  outbound: {
    //通话记列表
    listCallLogByPage(params) {
      return request("/call/log/listCallLogByPage", 'post', params);
    },
    //通话记对话详情
    listSceneLogByLogId(params) {
      return request("/scene/log/listSceneLogByLogId", 'post', params);
    },
    //  呼叫名单 录列表
    listCallDataByPage(params) {
      return request("/call/data/listCallDataByPage", 'post', params);
    },
    //任务管理 列表
    listCampaignByPage(params) {
      return request("/call/campaign/listCampaignByPage", 'post', params);
    },
    //任务管理 列表模板下载
    downloadTemplate(params) {
      return request("/call/campaign/downloadTemplate", 'get', params, true);
    },

    //任务管理 添加
    addCampaign(params) {
      return request("/call/campaign/addCampaign", 'post', params);
    },
    //任务管理 查询可用号码列表
    listMobileByAccess(params) {
      return request("/client/listMobileByAccess", 'post', params);
    },
    //任务管理 修改
    updateCampaign(params) {
      return request("/call/campaign/updateCampaign", 'post', params);
    },
    //语义引擎列表
    listSemanticProvider(params) {
      return request("/semantic/provider/listSemanticProvider", 'post', params);
    },
    //查询启用和重复发布的场景列表
    listSceneByState(params) {
      return request("/scene/listSceneByState", 'post', params);
    },
    //修改
    updateCampaignStatus(params) {
      return request("/call/campaign/updateCampaignStatus", 'post', params);
    },
    //呼叫统计列表
    statCallData(params) {
      return request("/call/campaign/statCallData", 'post', params);
    },
    //呼叫名单导出
    exportCallData(params) {
      return request("/call/data/exportCallData", 'get', params, true);
    },
    //活动列表
    listCampaign(params) {
      return request("/call/campaign/listCampaign", 'post', params);
    },
    //活动列表
    listInbound(params) {
      return request("/inbound/listInbound", 'post', params);
    },
    //呼入管理列表
    listInboundIdByPage(params) {
      return request("/inbound/listInboundIdByPage", 'post', params);
    },
    //  呼入管理
    listInboundDataByPage(params) {
      return request("/inboundData/listInboundDataByPage", 'post', params);
    },
    //新增呼入
    addInbound(params) {
      return request("/callTask/addTask", 'post', params);
    },
    //检查呼入是否重复使用同一个号码
    checkInboundMobile(params) {
      return request("/inbound/checkInboundMobile", 'post', params);
    },

    //编辑呼入
    updateInbound(params) {
      return request("/callTask/updateTask", 'post', params);
    },

    //更新呼入状态
    updateInboundStatus(params) {
      return request("/callTask/updateTaskStatus", 'post', params);
    },
    //上传语音文件
    importWav(params) {
      return request("/inbound/importWav", 'post', params);
    },
    //统计
    taskStatistics(params) {
      return request("/call/campaign/taskStatistics", 'post', params);
    },
    //导入记录
    listCallDataImportLogByPage(params) {
      return request("/call/data/listCallDataImportLogByPage", 'post', params);
    },
    //查看记录
    listMobile(params) {
      return request("/call/data/listMobile", 'post', params);
    },
    //下载记录
    exportMobile(params) {
      return request("/call/data/exportMobile", 'get', params, true);
    },
    //  队列管理表头
    getSceneVariable(params) {
      return request("/call/data/getSceneVariable", 'post', params);
    },
    //  服务流程/班组
    listScene(params) {
      return request("/scene/listScene", 'post', params);
    },
    //  获取外呼任务列表
    listTaskByPage(params) {
      return request("/callTask/listTaskByPage", 'post', params);
    },
  },
  //坐席
  attend: {
    //列表
    list(data) {
      return request('/attend/list', 'post', data)
    },
    //新增、修改
    updateAndSaveAttend(data) {
      return request('/attend/updateAndSaveAttend', 'post', data)
    },
    //删除
    delete(data) {
      return request('/attend/delete', 'get', data)
    },
  },
  // 技能组
  skillGroup: {
    //获取技能组列表
    listAll(params) {
      return request("/skillGroup/listAll", 'get', params);
    },
    // 获取本企业所有坐席
    listAttendAll(params) {
      return request("/skillGroup/listAttendAll", 'get', params);
    },
    // 获取本技能组所有坐席
    listAttendAllBySkillGroup(params) {
      return request("/skillGroup/listAttendAllBySkillGroup", 'get', params);
    },
    // 分页查询技能组
    listByPage(params) {
      return request("/skillGroup/listByPage", 'post', params);
    },
    // 新增技能组
    save(params) {
      return request("/skillGroup/save", 'post', params);
    },
    // 更新技能组
    update(params) {
      return request("/skillGroup/update", 'post', params);
    },
    // 更新技能组状态
    updateState(params) {
      return request("/skillGroup/updateState", 'post', params);
    },
    // 删除技能组
    delete(params) {
      return request("/skillGroup/delete", 'delete', params);
    },
  },
}