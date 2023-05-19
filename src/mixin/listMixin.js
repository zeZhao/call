
function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

/**
 * 节流阀
 * 判断接口请求频率是否超出设定的限制
 */
function throttle() {
  const lastRequestTimeStamp = this.lastRequestTimeStamp;
  const requestFrequency = this.requestFrequency;
  const nowTimeStamp = new Date().getTime();
  this.lastRequestTimeStamp = nowTimeStamp;
  const timeDifference = nowTimeStamp - lastRequestTimeStamp;

  //时间差小于限定值
  if (timeDifference < requestFrequency) {
    if (this.queryTask != null) {
      clearTimeout(this.queryTask);
    }
  }

  this.loading = true;
  this.queryTask = setTimeout(queryData.bind(this), requestFrequency);
}

/**
 * 处理参数格式
 * @param key
 * @param val
 */
function DynamicKey(key, val) {
  let params = {}
  if (this.isParamsNotData) {
    params = {
      data: {
        // pageIndex: this.pageObj.currentPage,
        pageNumber: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
    };
    if (this.namespaceType === 'Array') {
      params.data[key] = [
        {
          ...val
        }
      ];
    } else {
      params.data[key] = {
        ...val
      };
    }


    //短信通道筛选标签的特殊格式
    // if (params.data[key]['labelName']) {
    //   params.data['labelName'] = params.data[key]['labelName'];
    //   delete params.data[key]['labelName'];
    // }
  } else {
    params = {
      pageIndex: this.pageObj.currentPage,
      pageNumber: this.pageObj.currentPage,
      pageSize: this.pageObj.pageSize
    };
    params[key] = {
      ...val
    };
  }


  return params;
}

/**
 * 调用接口查询数据
 */
async function queryData() {
  this._mxBeforeGetList();

  this.loading = true;

  let searchParam = Object.assign({}, this.searchParam);
  // for (const key in searchParam){
  //
  //   //将时间对象转为时间戳
  //   if(searchParam[key] instanceof Date){
  //     searchParam[key] = new Date(searchParam[key]).getTime();
  //   }
  // }

  //手动调整一次提交的数据
  searchParam = await this._formatRequestData(searchParam);

  let params = {};
  //提交参数做兼容处理
  if (this.namespace) {
    let newF = DynamicKey.bind(this, this.namespace, searchParam);
    params = newF();
  } else {
    if (this.isParamsNotData) {
      params = {
        data: {
          ...searchParam,
          // pageIndex: this.pageObj.currentPage,
          pageNumber: this.pageObj.currentPage,
          // pageNum: this.pageObj.currentPage,
          pageSize: this.pageObj.pageSize
        }
      };
    } else {
      params = {
        ...searchParam,
        // pageIndex: this.pageObj.currentPage,
        current: this.pageObj.currentPage,
        // pageNum: this.pageObj.currentPage,
        size: this.pageObj.pageSize
      };
    }

  }

  const { namespace, list } = this.searchAPI; //动态接口路径

  if (!list) return;

  this.$http[namespace][list](params).then(res => {
    this.loading = false;

    if (resOk(res)) {
      let list = [];
      //兼容性处理
      if (res.data.list) {
        list = res.data.list;
        this.pageObj.total = res.data.total;
      } else if (res.data.content) {
        list = res.data.content;
        this.pageObj.total = res.data.totalElements;
        this.statistics = res.data.totalElements;
      } else if (res.data.records) {
        list = res.data.records;
        this.pageObj.total = res.data.total;
      } else if (res.data.pageInfo) {
        list = res.data.pageInfo.list;
        this.pageObj.total = res.data.pageInfo.total;
        this.statistics = res.data.statistics;
      } else if (res.data) {
        list = res.data;
      }
      //使用钩子再次格式化数据
      this.listData = this._mxFormListData(this._mxlistDataNull(list));
    } else if (res.code === 500 || res.code === "500") {
      this.$message.error(res.data || res.msg || "获取数据失败");
    } else {
      this.$message.error(res.msg || res.data || "获取数据失败");
    }

    this.tableDoLayout();
  });

  //请求表格下方展示数据的接口凭证
  if (this.searchAPI.tabBottomDataUrl) {
    this.$http[namespace][this.searchAPI.tabBottomDataUrl](params).then(res => {
      if (resOk(res)) {
        this.tabBottomData = res.data;
      } else {
        this.$message.error("获取底部数据失败");
      }
    });
  }
}

export default {
  data: function () {
    return {
      pageObj: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      formTit: "新增",
      addChannel: false,
      //查询条件参数
      searchParam: {},

      listData: [
        // {corpId:"416123",userId:"412412",userName:"dada"},
        // {corpId:"416123",userId:"412412",userName:"dada"},
        // {corpId:"416123",userId:"412412",userName:"dada"},
      ],
      //统计
      statistics: {},
      loading: false,

      searchAPI: {
        namespace: "",
        list: "",
        detele: "",
        add: "",
        edit: ""
      },
      namespace: "",
      delAPI: "",
      id: "",
      editId: "",
      //增加请求接口节流阀
      //节流阀-最后一次请求的时间戳
      lastRequestTimeStamp: 0,
      //节流阀-接口请求频率限制(ms)
      requestFrequency: 0,
      //节流阀-查询接口任务
      queryTask: null,
      //列表请求是否需要data包起来
      isParamsNotData: true,
      // 修改保存时参数是否需要data包含
      submitParamsIsData: true,
      // 删除时参数是否需要data包含
      deleteParamsIsData: true,
      //表格默认高度
      tableHeight: "50vh"
    };
  },

  created() { },

  mounted() {
    //动态计算表格高度
    this.handleTableResize()
    window.addEventListener("resize", this.handleTableResize);
    // 默认进入该页面不查询
    if (this.notSearch) return;

    // 请求数据
    this._mxGetBeforeListData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleTableResize);
  },

  methods: {
    // 重新计算table高度，避免table变形
    tableDoLayout() {
      this.$refs.table && this.$refs.table.doLayout();
    },
    handleTableResize() {
      const content = document.getElementById("content_page");
      const searchPanel = document.getElementById("searchPanel");
      const contentClientHeight = content ? content.clientHeight : 0;
      const searchPanelClientHeight = searchPanel ? searchPanel.clientHeight : 0;
      this.$nextTick(() => {
        // 90为底部距离分页器
        this.tableHeight = `${(contentClientHeight - searchPanelClientHeight - 90).toString()}px`;
      });
    },
    /***
     * 请求数据
     * @private
     */
    _mxGetBeforeListData() {
      // 请求查询列表接口之前是否请求其他接口
      if (!this.searchAPI.beforeList) {
        // 直接请求查询列表接口
        this._mxGetList();
      } else {
        const { namespace, beforeList } = this.searchAPI;
        if (!Array.isArray(beforeList)) return;
        beforeList.forEach(async (item, index) => {
          const res = await this.$http[namespace][beforeList[index]]({});
          if (res.code === 200) {
            this.beforeListData = res.data;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
        // 请求列表数据
        this._mxGetList();
      }
    },

    /***
     * 获取表格数据
     * @private
     */
    _mxGetList() {
      this.tableDoLayout();

      throttle.call(this);
    },

    /***
     * 页码改变触发
     * @private
     */
    handleCurrentChange(currentPage) {
      this.pageObj.currentPage = currentPage;
      this._mxGetList();
    },

    /***
     * 每页数据条数改变触发
     * @private
     */
    handleSizeChange(pageSize) {
      this.pageObj.pageSize = pageSize;
      this._mxGetList();
    },

    /**
     * 列表查询操作
     * @param param
     * @private
     */
    _mxDoSearch(param = this.searchParam) {
      //调用查询时默认跳转到第一页
      this.pageObj.currentPage = 1;
      this.$nextTick(() => {
        this.searchParam = {
          ...param
        };
      });

      this._mxGetList();
    },

    //显示选择用户弹窗
    choose(item) {
      this.isChooseUser = true;
    },
    //关闭选择用户弹窗
    cancelUser(val) {
      this.isChooseUser = val;
    },

    /**
     * 删除列表中项目
     * @param id
     * @param isData 参数是否需要data包含
     * @param isQuery  参数是否拼接在路径上
     * @private
     */
    _mxDeleteItem(key, id, isData = true, isQuery = false, tip = "您确定要删除此项吗？") {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h("div", null, [
          h("p", null, tip)
          // h('p', {
          //     style: 'color: red'
          // }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(action => {
        let params = {};
        if (!isQuery) {
          if (isData) {
            params = {
              data: {}
            };
            params.data[key] = id.toString();
          } else {
            params[key] = id.toString();
          }
        } else {
          params = id.toString()
        }


        const { namespace, detele } = this.searchAPI;
        this.$http[namespace][detele](params).then(res => {
          if (resOk(res)) {
            this.$message.success("删除成功！");
            this.pageObj.currentPage = 1;
            this._mxGetList();
          } else {
            this.$message.error(res.msg || "删除失败！");
          }
        });
      }).catch(() => { });
    },
    /**
     * 表格数据为空用“-”展示
     * @param list
     * @returns {*}
     * @private
     */
    _mxlistDataNull(list) {
      if (Array.isArray(list)) {
        list.forEach(item => {
          for (let key in item) {
            if (item[key] === "" || item[key] === null) {
              item[key] = "-"
            }
          }
        })
      }

      return list
    },

    /**
     * 对表格数据进行自定义调整
     * @param listData
     * @returns {*}
     * @private
     */
    _mxFormListData(listData) {
      return listData;
    },

    /**
     * 调整筛选条件提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      return data;
    },

    /**
     * 调用列表查询方法前的钩子
     * @private
     */
    _mxBeforeGetList() { },

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

    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    /**
     * 关闭弹窗
     */
    _mxCancel() {
      //如果是页面新增、修改，则返回列表页
      if (this.isPage) {
        window.history.back();
      }
      this.addChannel = false;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },

    /**
     * 编辑表单前调整表单内数据
     * @param row
     * @private
     */
    _mxArrangeEditData(row) {
      return row;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      return formData;
    },

    /**
     * 提交表单操作
     * @param form    表单数据
     * @param editId        编辑修改id
     * @private
     */
    _mxHandleSubmit(form, editId, hasData = true) {
      editId = this.editId;
      form = this._mxArrangeSubmitData(form);
      const { namespace, add, edit } = this.searchAPI;
      let params = {};

      if (hasData && this.submitParamsIsData) {
        params = {
          data: {
            ...form
          }
        };
      } else {
        params = {
          ...form
        };
      }

      if (this.formTit == "新增") {
        this.$http[namespace][add](params).then(res => {
          this._mxSuccess(res, hasData && this.submitParamsIsData ? params.data : params);
        });
      } else {
        if (hasData && this.submitParamsIsData) {
          params.data = Object.assign(params.data, {
            [editId]: this.id
          });
        } else {
          params = Object.assign(params, {
            [editId]: this.id
          });
        }

        // params.data[editId] = this.id
        // this.$set(params.data, editId, this.id)
        this.$http[namespace][edit](params).then(res => {
          this._mxSuccess(res, hasData && this.submitParamsIsData ? params.data : params);
        });
      }
    },
    /**
     * 提交成功后执行
     * @param res
     */
    _mxSuccess(res, params) {
      if (resOk(res)) {
        //如果是页面新增、修改，则返回列表页
        if (this.isPage) {
          window.history.back();
        }
        this.$message.success(res.msg || res.data);
        this._mxGetList();
        this.addChannel = false;
      } else {
        console.log(111)
        this.$message.error(res.msg || res.data);
      }
    },

    /**
     * 公共导出
     * @param searchFormParam
     * @private
     */
    _mxExportData(searchFormParam) {
      const { exportUrl, exportMethod, fileName } = this.searchAPI;

      if (!exportUrl) return;

      const method = exportMethod || "post";

      let searchParam = Object.assign({}, searchFormParam);

      //手动调整一次提交的数据
      searchParam = this._formatRequestData(searchParam);

      let params = {};
      //提交参数做兼容处理
      if (this.namespace) {
        let newF = DynamicKey.bind(this, this.namespace, searchParam);
        params = newF();
      } else {
        if (this.isParamsNotData) {
          params = {
            data: {
              ...searchParam,
              // pageIndex: this.pageObj.currentPage,
              pageNumber: this.pageObj.currentPage,
              // pageNum: this.pageObj.currentPage,
              pageSize: this.pageObj.pageSize
            }
          };
        } else {
          params = {
            ...searchParam,
            // pageIndex: this.pageObj.currentPage,
            pageNumber: this.pageObj.currentPage,
            // pageNum: this.pageObj.currentPage,
            pageSize: this.pageObj.pageSize
          };
        }
      }

      this.downloadFileByFile(method, exportUrl, params, fileName);
    },

    /**
     * 设置默认选择项
     * @param list 选择项
     * @param data 获取的数据
     * @param key 选择项key值
     * @param optionKey 设置key的值
     * @param optionVal 设置value的值
     * @private
     */
    _setDefaultValue(list, data, key, optionKey, optionVal, disabled, defaultData) {
      let arr = []
      list.forEach(item => {
        if (item.key === key) {
          if (item.type === 'select' || item.type === 'checkbox') {
            item.optionData = []
            data.forEach(t => {
              let obj = {
                key: t[optionKey],
                value: t[optionVal],
                disabled: t[disabled] === 1 ? true : false || false
              };
              item.optionData.push(obj)
            });
          } else if (item.type === 'input' || item.type === 'transfer') {
            if (item.type === 'transfer') {
              console.log(optionKey, '=====穿梭框值=====')
            }
            this.$nextTick(() => {
              this.$set(item, 'defaultValue', optionKey)
              item.defaultValue = optionKey
            })

          }
        }
      });
    },

    /**
     * 选择依赖项
     * @param data 选择项
     * @param itemKey 获取的数据
     * @param selectKey 选择项key值
     * @param Keys 设置key的值
     * @private
     */

    _changeDepend(data, itemKey, selectKey, Keys) {
      const { val, item } = data;
      let obj = {};
      if (item.key === itemKey) {
        item.optionData.map(t => {
          if (t[selectKey] == val) {
            obj = t;
          }
        });
        this._setDefaultValueKeys(Keys, obj);
      }
    },

    _setDefaultValueKeys(defaultKey, val) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === defaultKey) {
          t.defaultValue = val;
        }
      });
    },
    /**
     * 清空默认选择项
     * @param list 选择项
     * @param key 选择项key值
     * @private
     */
    _deleteDefaultValue(list, key) {
      list.forEach(item => {
        if (item.key === key || item.tag === key) {
          if (item.type === 'select' || item.type === 'checkbox') {
            // item.optionData = [];
            if (item.initDefaultValue) {
              this.$set(item, "defaultValue", item.initDefaultValue);
            } else {
              item.defaultValue = null
            }
          } else if (item.type === 'input') {
            this.$set(item, "defaultValue", '');
            // item.defaultValue = ''
          }

        }
      });
    },
    /**
     * 通过key查询表单项数据
     * @param list 选择项
     * @param key 选择项key值
     * @private
     */
    _getFormKeyData(list, key) {
      let val = null
      list.forEach(item => {
        if (item.key === key) {
          val = item.defaultValue
        }
      })
      return val

    },

    /**
     * 通过key设置表单项显示隐藏
     * @param list 选择项
     * @param key 选择项key值
     * @private
     */
    _setDisplayShow(list, key, show) {
      list.forEach(item => {
        if (item.key === key) {
          this.$set(item, "isShow", show);
        }
      });
    },
    /**
     * 通过tag设置表单项显示隐藏
     * @param list 选择项
     * @param key 选择项tag值
     * @private
     */
    _setTagDisplayShow(list, tag, show) {
      list.forEach(item => {
        if (item.tag === tag) {
          this.$set(item, "isShow", show);
        }
      });
    },
    /**
     * 通过label设置表单项显示隐藏
     * @param list 选择项
     * @param label 选择项label值
     * @private
     */
    _setLabelDisplayShow(list, label, show) {
      list.forEach(item => {
        if (item.label === label) {
          this.$set(item, "isShow", show);
        }
      });
    }
  }
};
