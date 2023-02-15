<template>
  <!-- 角色及权限 -->
  <div class="permission">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="corpName" label="商家名称" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="remarks" label="描述" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" >
        <template slot-scope="{row}">
          <span>{{row.createTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'roleId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="jurisdictionBtn(scope.row)"
            type="text"
            size="small"
            >权限</el-button
          >
          <el-button
            @click="_mxDeleteItem('roleId', scope.row.roleId, false, false)"
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
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <el-dialog
      title="权限分配"
      :visible.sync="jurisdictionVisible"
      :close-on-click-modal="false"
      top="45px"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        node-key="menuId"
        :default-checked-keys="defaultCheckedList"
        show-checkbox
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jurisdictionVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTree">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import { setStorage, getStorage } from "@/utils/auth";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "角色名称", key: "roleName" },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: 0, value: "禁用" },
            { key: 1, value: "启用" },
          ],
        },
      ],
      isParamsNotData: false,
      submitParamsIsData: false,
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "role",
        list: "list",
        add: "post",
        edit: "put",
        detele: "del",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "商户名称",
          key: "corpId",
          defaultValue: "",
          isShow:true,
          // optionData: [],
        },
        {
          type: "input",
          label: "角色名称",
          key: "roleName",
          defaultValue: "",
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          defaultValue: "",
          optionData: [
            { key: 1, value: "启用" },
            { key: 0, value: "禁用" },
          ],
        },
        {
          type: "textarea",
          label: "备注",
          key: "remarks",
          rules: [],
          defaultValue: "",
        },
      ],
      id: "",
      jurisdictionVisible: false,
      treeData: [],
      defaultCheckedList: [],
      defaultProps: {
        children: "childMenu",
        label: "name",
      },
      roleId: "",
      corpId: "",
    };
  },
  created() {},
  mounted() {
  },
  computed: {},
  methods: {
    /**
     * 创建表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    getSysMenuList() {
      this.$http.role.sysMenuList().then((res) => {
        let arr = []
        res.data.forEach(item=>{
          if(item.type === 1){
            arr.push(item)
          }
        })
        this.treeData = arr;
        console.log(res);
      });
    },
    sysRoleMenuList(roleId) {
      this.defaultCheckedList = [];
      this.$http.role.permissionsList({ roleId }).then((res) => {
        let arr = []
        let checkedList = []
        res.data.forEach(item=>{
          if(item.type === 1){
            arr.push(item)
          }
        })
         this.treeData = arr;
         arr.forEach(item=>{
          if(item.childMenu && item.childMenu.length > 0){
            item.childMenu.forEach(i=>{
              if(i.ifChecked == 1){
                checkedList.push(i.menuId)
              }
            })
          }else{
            if(item.ifChecked == 1){
                checkedList.push(item.menuId)
              }
          }
         })
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(checkedList);
          this.defaultCheckedList = checkedList;
        });
      });
    },
    jurisdictionBtn(row) {
      const { roleId,corpId } = row;
      this.roleId = roleId;
      this.corpId = corpId;
      this.jurisdictionVisible = true;

      this.sysRoleMenuList(roleId);
    },
    submitTree() {
      let arr = this.$refs.tree.getCheckedKeys();
      this.$http.role.permissionsPost({roleId: this.roleId,corpId:this.corpId,menuIdList:arr}).then((res) => {
        if (resOk) {
          this.jurisdictionVisible = false;
          this.roleId = "";
        }
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
