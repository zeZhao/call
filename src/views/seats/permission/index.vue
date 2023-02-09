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
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="remarks" label="描述" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
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
        // {
        //   type: "select",
        //   label: "角色名称",
        //   key: "roleName",
        //   defaultValue: "",
        //   optionData:[]
        // },
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
    };
  },
  created() {},
  mounted() {
    this.getSysMenuList();
    // this.sysRoleMenuList()
  },
  computed: {},
  methods: {
    getSysMenuList() {
      this.$http.role.sysMenuList().then((res) => {
        this.treeData = res.data;
        console.log(res);
      });
    },
    sysRoleMenuList(roleId) {
      this.defaultCheckedList = [];
      this.$http.role.permissionsList({ roleId }).then((res) => {
        this.defaultCheckedList = [];
        let arr = [];
        res.data.forEach((item) => {
          arr.push(item.menuId);
        });
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(arr);
          this.defaultCheckedList = arr;
        });
      });
    },
    jurisdictionBtn(row) {
      const { roleId } = row;
      this.roleId = roleId;
      this.jurisdictionVisible = true;
      // console.log(row, "====");

      this.sysRoleMenuList(roleId);
    },
    submitTree() {
      console.log(this.$refs.tree);
      console.log(this.$refs.tree.getCheckedKeys());
      let arr = this.$refs.tree.getCheckedKeys();
      let sysRoleMenu = [];
      arr.forEach((item) => {
        sysRoleMenu.push({ roleId: this.roleId, menuId: item });
      });
      console.log({ sysRoleMenu }, ";;;;;;;");
      this.$http.role.permissionsPost([...sysRoleMenu]).then((res) => {
        if (resOk) {
          this.jurisdictionVisible = false;
          this.roleId = "";
          // this.$message.s
        }
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
