<template>
  <div class="company">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="corpId" label="公司名称" />
      <el-table-column prop="corpId" label="类别" /> 
      <el-table-column prop="corpId" label="联系人" />
      <el-table-column prop="corpId" label="联系电话" />
      <el-table-column prop="corpId" label="邮箱" />
      <el-table-column prop="corpId" label="银行账户" />
      <el-table-column prop="corpId" label="地址" />
      <el-table-column prop="corpId" label="状态" />
      <el-table-column prop="corpId" label="开户时间" />
      <el-table-column prop="corpId" label="备注" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem('templateId', scope.row.templateId, false, true)
            "
            type="text"
            size="small"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "公司名称", key: "corpName" },
        { type: "input", label: "联系人", key: "corpNames" },
        { type: "inputNum", label: "联系电话", key: "userId" },
        { type: "select", label: "签名", key: "sign",optionData:[{key:'1',value:"有效"},{key:'2',value:"无效"},] },
        { type: "select", label: "类别", key: "signs",optionData:[{key:'1',value:"商家"},{key:'2',value:"代理商"},{key:'3',value:"供应商"},] },
        {
          type: "daterange",
          label: "开户时间",
          key: ["", "submitStartTime", "submitEndTime"]
        }
      ]
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped></style>
