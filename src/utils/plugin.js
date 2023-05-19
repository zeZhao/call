import Page from "@/components/Page"
import Search from "@/components/searchPanel"
import FormItem from "@/components/FormItem"
import Api from "@/utils/api.js";

class callPlugin {

  constructor() { }

  install(Vue, options) {
    this.installExtendsFunction();

    this.installComponent(Vue);

    this.installPrototype(Vue);

    this.installFilter(Vue);

    this.installDirective(Vue);

    this.installMixin(Vue);
  }

  /*------------------安装扩展方法------------------*/
  installExtendsFunction() {
    /**
     * 扩展时间对象，增加Format方法
     */
    {
      /*对Date的扩展，将 Date 转化为指定格式的String
       月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
       年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
       例子：
       (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
       (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
       支持时间格式化*/
      Date.prototype.Format = function (fmt) { //author: meizz
        let o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    }

    /**
     * 判断接口返回是否是正确
     */
    {
      window.resOk = function (res = {}) {
        const {
          code,
          state
        } = res
        if (code === '200' || code === 200 || Object.keys(res.data).length !== 0 || state === '0000') {
          if (code === 9000 || code === '9000') {
            return false
          }
          return true;
        } else {
          return false;
        }
      }
    }
  }

  /*------------------添加vue组件------------------*/
  installComponent(Vue) {
    Vue.component("Page", Page);
    Vue.component("Search", Search);
    Vue.component("FormItem", FormItem);
  }

  /*------------------添加vue过滤器------------------*/
  installFilter(Vue) {
    Vue.filter('dateTime',function (value) {
      if (value && value !== null && value !== '-') {
        return new Date(value).Format("yyyy-MM-dd hh:mm:ss")
      } else {
        return '-'
      }
    })
  }

  /*------------------添加vue实例方法------------------*/
  installPrototype(Vue) {
    Vue.prototype.$http = Api;

    /* 深拷贝 */
    Vue.prototype.$deepClone = function deepClone(obj) {
      var objClone = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === "object") {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (obj[key] && typeof obj[key] === "object") {
              objClone[key] = deepClone(obj[key]);
            } else {
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    }
    /**
     * 根据数据流下载文件
     */
    Vue.prototype.downloadFileByFile = function ( url, params, fileName) {
      this.$axios
        .post(
          url,
          { ...params },
          {
            responseType: "blob",
            headers: { token: window.localStorage.getItem("token") }
          }
        )
        .then(res => {
          if (["application/octet-stream", "application/vnd.ms-excel"].includes(res.data.type)) {
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute(
              "download",
              `${fileName}.xlsx`
            );
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
          } else {
            this.$message.error("下载失败");
          }
        });
    };

    /**
     * 根据连接下载文件
     * @param url
     * @param fileName
     */
    Vue.prototype.downloadFileByUrl = function (url, fileName = "") {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('chrome') > -1 || userAgent.indexOf('safari') > -1) {

        let link = document.createElement('a');
        link.href = url;
        link.target = '_blank';

        if (link.download !== undefined) {
          link.download = fileName;
        }

        if (document.createEvent) {
          let e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          link.dispatchEvent(e);
          return;
        }
        return;
      }
      window.open(url, '_blank');
    };

  }

  /*------------------安装指令方法------------------*/
  installDirective(Vue) {
    // 点击间隔
    Vue.directive('throttle', {
      inserted(el, binding) {
        el.addEventListener('click', () => {
          el.style.pointerEvents = 'none';
          el.style.backgroundColor = "rgba(215, 215, 215, 1)"
          el.style.borderColor = "rgba(215, 215, 215, 1)"
          if (!el.disabled) {
            setTimeout(() => {
              el.style.pointerEvents = 'auto';
              el.style.backgroundColor = "#0964FF"
              el.style.borderColor = "#0964FF"
            }, binding.value || 1000);
          }
        });
      }
    });

  }

  /*------------------安装mixin方法------------------*/
  installMixin(Vue) {

  }
}

export default new callPlugin();
