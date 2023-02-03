<template>
  <div class="company">
    <h1>短信记录</h1>
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
        {
          type: "select",
          label: "签名",
          key: "sign",
          optionData: [
            { key: "1", value: "有效" },
            { key: "2", value: "无效" },
          ],
        },
        {
          type: "select",
          label: "类别",
          key: "signs",
          optionData: [
            { key: "1", value: "商家" },
            { key: "2", value: "代理商" },
            { key: "3", value: "供应商" },
          ],
        },
        {
          type: "daterange",
          label: "开户时间",
          key: ["", "submitStartTime", "submitEndTime"],
        },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "smslongnum",
        list: "list",
        detele: "delete",
      },
      // 列表参数
      namespace: "configs",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"],
            },
          ],
        },
        {
          type: "textarea",
          label: "长号码",
          key: "smsLongNum",
          defaultValue: "",
          maxlength: 4000,
          // rules: [
          //   {
          //     required: true,
          //     message: "请输入必填项",
          //     trigger: ['blur', 'change']
          //   }
          // ]
        },
      ],
      id: "",
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
