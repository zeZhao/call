<template>
  <div class="FormItem">
    <el-form
      ref="form"
      :label-width="`${labelWidth}px`"
      :model="formData"
      :label-position="labelPosition"
      v-if="formConfig.length"
      class="demo-ruleForm"
    >
      <el-row :gutter="gutter">
        <el-col
          v-for="(item, index) in formConfig"
          :key="index"
          :span="item.colSpan || colSpan"
        >
          <div v-if="item.type === 'divider' && !item.isShow">
            <el-divider></el-divider>
          </div>
          <el-form-item
            :label="item.label ? `${item.label}：` : ``"
            :prop="item.key"
            :rules="item.rules"
            v-if="!item.isShow"
          >
            <!--输入框-->
            <template v-if="item.type === 'input'">
              <el-input
                :class="{ inputWid: item.btnTxt || item.specialSymbols }"
                v-model.trim="formData[item.key]"
                clearable
                size="small"
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :maxlength="item.maxlength"
                show-word-limit
                @blur="
                  item.defaultValue = $event.target.value = $event.target.value.replace(
                    /^\s+|\s+$/gm,
                    ''
                  )
                "
                @input="
                  val => {
                    onInputChange(val, item);
                  }
                "
              />
              <el-button
                style="border-color: #0964ff"
                v-if="item.btnTxt"
                :disabled="item.btnDisabled"
                @click="chooses(item)"
                size="small"
                >{{ item.btnTxt }}</el-button
              >
              <span v-if="item.specialSymbols">{{ item.specialSymbols }}</span>
              <div v-if="item.tips" class="item-tips">{{ item.tips }}</div>
            </template>
            <!--密码类型-输入框-->
            <template v-if="item.type === 'password'">
              <el-input
                :class="{ inputWid: item.btnTxt }"
                v-model.trim="formData[item.key]"
                clearable
                size="small"
                type="password"
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :maxlength="item.maxlength"
                show-word-limit
                @blur="
                  item.defaultValue = $event.target.value = $event.target.value.replace(
                    /^\s+|\s+$/gm,
                    ''
                  )
                "
                @input="
                  val => {
                    onInputChange(val, item);
                  }
                "
              />
            </template>
            <!--多文本输入框-->
            <template v-if="item.type === 'textarea'">
              <el-input
                v-model="formData[item.key]"
                type="textarea"
                clearable
                show-word-limit
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :maxlength="item.maxlength"
                :autosize="{ minRows: 3, maxRows: 4 }"
                @input="
                  val => {
                    onChange(val, item);
                  }
                "
              />
              <slot
                v-if="item.isChooseProviceOrCity"
                name="isChooseProviceOrCity"
              ></slot>
              <div v-if="item.mobileTips" class="item-tips">
                {{ returnMobileTips(formData[item.key]) }}
              </div>
              <div v-if="item.contentTips" class="item-tips">
                {{ returnContentTips(formData[item.key]) }}
              </div>
            </template>
            <!--数字输入框-->
            <template v-if="item.type === 'inputNum'">
              <!-- <el-input-number
                v-model="formData[item.key]"
                clearable
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :max="item.maxlength"
                :min="item.minlength"
                :precision="item.precision || 0"
                :controls-position="item.position || 'right'"
                @input="
                  val => {
                    onChange(val, item);
                  }
                "
              /> -->
              <el-input
                v-model.number="formData[item.key]"
                type="number"
                size="small"
                clearable
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                @input="
                  val => {
                    onChange(val, item);
                  }
                "
                onKeypress="this.value = this.value.replace(/\D/g, '')"
              />
            </template>

            <!--下拉列表-->
            <template v-if="item.type === 'select'">
              <el-select
                style="width: 100%"
                v-model="formData[item.key]"
                filterable
                :clearable="item.clearable || true"
                :multiple="item.multiple"
                :collapse-tags="item.collapseTags"
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请选择${item.label}`"
                @change="
                  val => {
                    selectChange(val, item);
                  }
                "
              >
                <el-option
                  v-for="option in item.optionData"
                  :value="option.key"
                  :key="option.key"
                  :label="option.value"
                  :disabled="option.disabled"
                />
              </el-select>
            </template>

            <!--多项下拉 合并为一行（进行一个label校验）-->
            <template v-if="item.type === 'selects'">
              <div style="display: flex; justify-content: space-between">
                <el-select
                  v-for="it in item.list"
                  :key="it.key"
                  :style="{ width: `${100 / (item.list.length + 0.2)}%` }"
                  v-model="formData[it.key]"
                  filterable
                  :clearable="it.clearable || true"
                  :multiple="it.multiple"
                  :collapse-tags="it.collapseTags"
                  :disabled="it.disabled"
                  :placeholder="it.placeholder || `请选择${it.label}`"
                  @change="
                    val => {
                      selectChange(val, it);
                    }
                  "
                >
                  <el-option
                    v-for="option in it.optionData"
                    :value="option.key"
                    :key="option.key"
                    :label="option.value"
                    :disabled="option.disabled"
                  />
                </el-select>
              </div>
            </template>

            <!--下拉列表分组-->
            <template v-if="item.type === 'selectGroup'">
              <el-select
                style="width: 100%"
                v-model="formData[item.key]"
                clearable
                :placeholder="item.placeholder || `请选择${item.label}`"
                @change="
                  val => {
                    selectChange(val, item);
                  }
                "
              >
                <el-option-group
                  v-for="group in item.optionData"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </template>

            <!--多选框-->
            <template v-if="item.type === 'checkbox'">
              <el-checkbox-group
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              >
                <el-checkbox
                  v-for="option in item.optionData"
                  :key="option.key"
                  :label="option.key"
                  >{{ option.value }}</el-checkbox
                >
              </el-checkbox-group>
            </template>

            <!--单选框-->
            <template v-if="item.type === 'radio'">
              <el-radio-group
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              >
                <el-radio
                  v-for="option in item.optionData"
                  :key="option.key"
                  :label="option.key"
                  >{{ option.value }}</el-radio
                >
              </el-radio-group>
            </template>

            <!--单个日期-->
            <template v-if="item.type === 'date'">
              <el-date-picker
                type="date"
                :placeholder="item.placeholder || `请选择${item.label}`"
                clearable
                :value-format="item.format || 'yyyy-MM-dd'"
                :picker-options="item.disabledDate || null"
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-date-picker>
            </template>

            <!--双日期-->
            <template v-if="item.type === 'dates'">
              <el-date-picker
                type="daterange"
                clearable
                :value-format="item.format || 'yyyy-MM-dd'"
                :range-separator="item.rangeSeparator || '至'"
                :start-placeholder="item.startPlaceholder || '开始日期'"
                :end-placeholder="item.endPlaceholder || '结束日期'"
                :picker-options="item.disabledDate || null"
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-date-picker>
            </template>

            <!--单个月份-->
            <template v-if="item.type === 'month'">
              <el-date-picker
                type="month"
                :placeholder="item.placeholder || `请选择${item.label}`"
                clearable
                :value-format="item.format || 'yyyy-MM'"
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-date-picker>
            </template>

            <!--单个时间-->
            <template v-if="item.type === 'time'">
              <el-time-picker
                clearable
                v-model="formData[item.key]"
                :value-format="item.format || 'HH:mm:ss'"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :picker-options="item.pickerOptions || ''"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-time-picker>
            </template>
            <!--双时间-->
            <template v-if="item.type === 'times'">
              <el-time-picker
                clearable
                v-model="formData[item.key]"
                :value-format="item.format || 'HH:mm:ss'"
                is-range
                range-separator="-"
                :start-placeholder="item.startPlaceholder || '开始时间'"
                :end-placeholder="item.endPlaceholder || '结束时间'"
                :placeholder="item.placeholder || '选择时间范围'"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-time-picker>
            </template>
            <!--日期与时间-->
            <template v-if="item.type === 'dataTime'">
              <el-date-picker
                v-model="formData[item.key]"
                :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                type="datetime"
                clearable
                :picker-options="item.disabledDate || null"
                :placeholder="item.placeholder || `请选择${item.label}`"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              >
              </el-date-picker>
            </template>
            <!--日期与时间-双-->
            <template v-if="item.type === 'dataTimes'">
              <el-date-picker
                v-model="formData[item.key]"
                :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                type="datetimerange"
                clearable
                :range-separator="item.rangeSeparator || '至'"
                :start-placeholder="item.startPlaceholder || '开始日期'"
                :end-placeholder="item.endPlaceholder || '结束日期'"
                :picker-options="item.disabledDate || null"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              >
              </el-date-picker>
            </template>
            <template v-if="item.type === 'switch'">
              <el-switch
                style="display: block"
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
                :active-color="item.activeColor || '#13ce66'"
                :inactive-color="item.inactiveColor || '#ff4949'"
                :active-text="item.activeText"
                :inactive-text="item.inactiveText"
                :active-value="item.activeValue || '1'"
                :inactive-value="item.inactiveValue || '0'"
              >
              </el-switch>
            </template>
            <!--上传-->
            <template v-if="item.type === 'upload'">
              <div v-if="!item.defaultValue">
                <el-upload
                  ref="uploadFile"
                  :action="action"
                  :headers="header"
                  :on-preview="handlePreview"
                  :on-remove="
                    (file, fileList) => {
                      handleRemove(file, fileList, item);
                    }
                  "
                  :on-success="
                    (res, file, fileList) => {
                      handleSuccess(item, res, file, fileList);
                    }
                  "
                  :before-upload="
                    file => {
                      beforeUpload(item, file);
                    }
                  "
                  :on-progress="
                    (event, file, fileList) => {
                      handleProgress(item, event, file, fileList);
                    }
                  "
                  :on-error="handleError"
                  :limit="item.limit || 1"
                  :file-list="item.defaultFileList || []"
                  :on-exceed="handleExceed"
                >
                  <el-button size="small" type="primary">{{
                    item.btnTxt ? item.btnTxt : "上传文件"
                  }}</el-button>
                </el-upload>
              </div>
              <div v-else>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="`${href}/${item.defaultValue}`"
                  alt=""
                  style="width: 100px; height: 75px"
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(item.defaultValue)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    style="display: inline-block"
                    @click="handleRemoveImg(item)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </template>
            <!--上传xls、xlsx等-->
            <template v-if="item.type === 'uploadXlsx'">
              <div>
                <el-upload
                  ref="uploadFileXlsx"
                  :action="upLoadUrl(item)"
                  :headers="header"
                  :on-preview="handlePreview"
                  :on-remove="
                    (file, fileList) => {
                      handleRemove(file, fileList, item);
                    }
                  "
                  :before-remove="
                    (file, fileList) => {
                      handleRemove(file, fileList, item);
                    }
                  "
                  :on-success="
                    (res, file, fileList) => {
                      handleSuccess(item, res, file, fileList);
                    }
                  "
                  :before-upload="
                    file => {
                      beforeUpload(item, file);
                    }
                  "
                  :on-progress="
                    (event, file, fileList) => {
                      handleProgress(item, event, file, fileList);
                    }
                  "
                  :on-error="handleError"
                  :limit="item.limit || 1"
                  :file-list="item.defaultFileList || []"
                  :on-exceed="handleExceed"
                >
                  <el-button size="small" type="primary">{{
                    item.btnTxt ? item.btnTxt : "上传文件"
                  }}</el-button>
                </el-upload>
              </div>
            </template>
            <p v-if="item.tip" class="tip">{{ item.tip }}</p>
          </el-form-item>
        </el-col>
        <div>
          <slot name="Other"></slot>
          <div
            class="submitBtn"
            :class="{ 'footer-text-center': footerIsCenter }"
          >
            <slot name="Btn">
              <el-button @click="cancel" size="small" v-if="isCancel"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="onSubmit('form')"
                v-throttle="3000"
                size="small"
                :disabled="submitDisabled"
                :loading="confirmDisabled"
                class="submit"
              >
                {{ btnTxt }}
              </el-button>
            </slot>
          </div>
        </div>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :modal="false">
      <img width="100%" :src="`${href}/${dialogImageUrl}`" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getStorage } from "@/utils/auth";

export default {
  props: {
    formConfig: {
      type: Array,
      default() {
        return [];
      }
    },
    btnTxt: {
      type: String,
      default() {
        return "新增";
      }
    },
    isCancel: {
      type: Boolean,
      default() {
        return true;
      }
    },
    labelPosition: {
      type: String,
      default() {
        return "right";
      }
    },
    labelWidth: {
      type: [String, Number],
      default() {
        return 150;
      }
    },
    gutter: {
      type: [String, Number],
      default() {
        return 24;
      }
    },
    colSpan: {
      type: [String, Number],
      default() {
        return 24;
      }
    },
    //footer文字是否居中
    footerIsCenter: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // 提交按钮是否可点击
    confirmDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      formData: {},
      action: `${process.env.VUE_APP_BASE_API}/sysPrepaidCard/uploadFile`,
      header: {
        token: getStorage('token')
      },
      href: window.location.origin,
      dialogVisible: false,
      dialogImageUrl: "",
      submitDisabled: false
    };
  },
  mounted() {
    this.initComponent();
  },
  computed: {},
  methods: {
    upLoadUrl(item) {
      return item.uploadUrl || this.action;
    },
    //input Change事件
    onInputChange(val, item) {
      this._setDefaultVal(val, item);
      this.$emit("inpChange", { val, item });
    },
    //  select 事件
    onChange(val, item) {
      this._setDefaultVal(val, item);
      this.$emit("onChange", { val, item });
    },
    // 选择组件
    chooses(item) {
      this.$emit("choose", item);
    },
    /**
     * 提交验证
     */
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formConfig.forEach(item => {
            for(const i in this.formData) {
              if (item.key === i && item.type === "inputNum" && this.formData[i]) {
                this.formData[i] = +(this.formData[i]); // 转为number类型
              }
            }
          });
          this.$emit("submit", this.formData);
        } else {
          // this.$message.error("请输入必填项");
          return false;
        }
      });
    },
    //返回该formData对象
    renderFormData() {
      this.$emit("getFormData", this.formData);
    },
    /**
     * 回显数据
     */
    initComponent() {
      const form = {};
      this.formConfig.forEach(item => {
        const { key, type } = item;
        form[key] = item.defaultValue;

        if (type === "selects") {
          item.list.forEach(v => {
            form[v.key] = v.defaultValue;
          });
        }
      });
      this.formData = form;
    },
    /* 清除表单验证信息 */
    clearValidate() {
      this.$refs.form.clearValidate();
    },
    //清空上传文件
    clearFiles() {
      this.$refs.uploadFile.clearFiles();
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.formConfig.forEach(item => {
        const { defaultValue, key, type } = item;
        if (defaultValue || this.formData[key] || defaultValue === 0) {
          if (type === "checkbox") {
            if (item.initDefaultValue) {
              this.$set(item, "defaultValue", item.initDefaultValue);
            } else {
              item.defaultValue = [];
              this.formData[key] = [];
            }
          } else if (
            [
              "select",
              "radio",
              "switch",
              "date",
              "time",
              "selectGroup"
            ].includes(type)
          ) {
            if (item.initDefaultValue) {
              this.$set(item, "defaultValue", item.initDefaultValue);
            } else {
              item.defaultValue = null;
            }
          } else if (type === "uploadXlsx") {
            item.defaultValue = null;
            item.defaultFileList = [];
          } else {
            item.defaultValue = null;
            this.formData[key] = null;
          }
        } else if (type === "selects") {
          item.list.forEach(v => {
            v.defaultValue = null;
          });
        }
      });
      this.$nextTick(() => {
        this.clearValidate();
      });
      // this.$refs.form.resetFields();
    },
    cancel() {
      this.$emit("cancel");
    },
    /**
     * 是否可以清除
     */
    isClearAble(item) {
      return item.clearable !== false;
    },
    selectChange(val, item) {
      this._setDefaultVal(val, item);
      this.$emit("selectChange", { val, item });
    },

    //设置默认值
    _setDefaultVal(val, item) {
      if (item.hasOwnProperty("defaultValue")) {
        item.defaultValue = val;
      } else {
        this.$set(item, "defaultValue", val);
      }
    },
    //  文件上传成功时的钩子
    handleSuccess(item, response, file, fileList) {
      this.submitDisabled = false;
      if (response.code == 200) {
        this.$emit("handleSuccess", { response, file, fileList, item });
      } else {
        this.$message.error(response.data);
        item.defaultFileList = [];
        // fileList = [];
      }
    },
    //上传前
    beforeUpload(item, file) {
      this.$nextTick(() => {
        this.submitDisabled = true;
      });
    },
    //  文件上传时的钩子
    handleProgress(item, event, file, fileList) {
      this.$emit("handleProgress", { item, event, file, fileList });
    },
    //  文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.submitDisabled = false;
      this.$emit("handleError", { err, file, fileList });
    },
    //  文件列表移除文件时的钩子
    handleRemove(file, fileList, item) {
      this.submitDisabled = false;
      this.$emit("handleRemove", { file, fileList, item });
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },
    //  文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$emit("handleExceed", { files, fileList });
    },
    //删除图片
    handleRemoveImg(item) {
      // console.log(file);
      item.defaultValue = "";
      item.defaultFileList = [];
    },
    //查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file;
      this.dialogVisible = true;
    },
    //清空某一些校验
    clearValidateMore(arr) {
      this.$refs.form.clearValidate(arr);
    },

    //回显input下列提示
    returnMobileTips(value) {
      if (!value) return "已输入0个手机号";
      const arr = value.split(",");
      let num = 0;
      arr.forEach(item => {
        if (item) num++;
      });
      return `已输入${num}个手机号`;
    },
    //回显input下列提示
    returnContentTips(value) {
      const num = 67; //67个文字算一条
      const computeder = value ? value.length / num : 0;
      return `已输入${value ? value.length : 0}字符，将按${
        value ? Math.ceil(computeder) : 1
      }条计费，计费条数仅供参考，以实际扣费为准！`;
    }
  },
  watch: {
    formConfig: {
      handler() {
        this.initComponent();
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.FormItem {
  // position: relative;
  .submitBtn {
    float: right;
    margin-right: 12px;
    // position: absolute;
    // right: 20px;
    // bottom: 20px;
  }
  .footer-text-center {
    float: none;
    margin-top: 20px;
    text-align: center;
  }
  .inputWid {
    width: 63%;
  }
  .item-tips {
    color: #999999;
    font-size: 12px;
    line-height: 17px;
    text-align: right;
    margin-top: 6px;
  }
  .tip {
    margin: 0;
    font-size: 12px;
    color: #909399;
  }
}
</style>
