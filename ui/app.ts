import { defineComponent, reactive, ref, computed } from "vue";
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInput,
  ElCheckboxGroup,
  ElCheckbox,
  ElAlert,
  ElTag,
  ElTooltip,
  ElMessage,
} from "element-plus";
import "element-plus/dist/index.css";

export default defineComponent({
  components: {
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElInput,
    ElCheckboxGroup,
    ElCheckbox,
    ElAlert,
    ElTag,
    ElTooltip,
  },
  setup() {
    // 响应式数据
    const data = ref<string[]>([]);
    const pageTree = ref({});

    const reactCatalog1 = reactive<string[]>([]);
    const reactCatalog2 = reactive<string[]>([]);
    const reactCatalog3 = reactive<string[]>([]);

    const refCurr1 = ref("");
    const refCurr2 = ref("");
    const refCurr3 = ref("");

    let catalog = {};

    // 从 API 加载页面数据
    const loadPages = async () => {
      try {
        console.log("📡 正在从 API 加载页面数据...");
        const response = await fetch("/__api/pages");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "加载页面失败");
        }

        console.log(`✅ 加载成功，共 ${result.pages.length} 个页面`);
        
        // 更新响应式数据
        data.value = result.catalog;
        pageTree.value = result.tree;

        // 重新构建目录结构
        rebuildCatalog();
      } catch (err) {
        console.error("❌ 加载页面数据失败:", err);
        ElMessage.error(`加载页面失败: ${err.message}`);
        
        // 降级：使用编译时注入的数据
        console.log("⚠️ 使用编译时数据作为降级方案");
        data.value = window.__VITE_HTML_CATALOG__ || [];
        pageTree.value = window.__PAGE_TREE__ || {};
        rebuildCatalog();
      }
    };

    // 构建目录结构
    const rebuildCatalog = () => {
      // 清空现有数据
      catalog = {};
      reactCatalog1.length = 0;
      reactCatalog2.length = 0;
      reactCatalog3.length = 0;

      // 去除 src 后的目录数组
      const dataArray = data.value.map((item) => item.split("/").slice(1));

      // 重新构建目录
      for (let item of dataArray) {
        let [a, b, c] = item;
        if (!catalog[a]) catalog[a] = {};
        if (!catalog[a][b]) catalog[a][b] = [];
        catalog[a][b].push(c);
        reactCatalog1.find((item) => a === item) ? null : reactCatalog1.push(a);
      }

      console.log(`📂 目录结构重建完成，一级目录: ${reactCatalog1.length} 个`);
    };

    // 初始化
    const init = async () => {
      // 先加载页面数据
      await loadPages();
      if (reactCatalog1.length === 0) return;

      // 确保二三级目录和字母分类数组被清空（防止重复调用时累加）
      reactCatalog2.length = 0;
      reactCatalog3.length = 0;
      reactCatalogueArray.length = 0;

      refCurr1.value = reactCatalog1[0];
      let temp = Object.keys(catalog[refCurr1.value]);

      reactCatalog2.push(...temp);
      reactCatalog2.sort();

      if (reactCatalog2.length > 0) {
        await funcResortAnalysis(reactCatalog2);
        refCataLogueIndex.value = reactCatalogueArray.length - 1;
        let refRcaLength =
          reactCatalogueArray[refCataLogueIndex.value]?.fileName;
        if (refRcaLength && refRcaLength.length > 0) {
          refCurr2.value = refRcaLength[0];
          reactCatalog3.push(...catalog[refCurr1.value][refCurr2.value]);
          refCurr3.value = reactCatalog3[0];
          computedCatalog3();
        }
      }
    };

    // 按首字母分类
    let reactCatalogueArray: any = reactive([]);
    let refCataLogueIndex = ref(0);

    const funcResortAnalysis = async (arr: any[]) => {
      arr.forEach((oldData: any) => {
        let index = -1;
        let alpha = String(oldData).substring(0, 1);
        let alreadyExists = reactCatalogueArray.some(
          (newData: any, j: number) => {
            if (alpha === newData.catalogue) {
              index = j;
              return true;
            }
          }
        );
        if (!alreadyExists) {
          let res: any = [];
          res.push(oldData);
          reactCatalogueArray.push({
            catalogue: alpha,
            fileName: res,
          });
        } else {
          reactCatalogueArray[index].fileName.push(oldData);
        }
      });
      return reactCatalogueArray;
    };

    const funcNewArrayLength = async (arr, index) => {
      reactCatalogueArray.length = 0;
      await funcResortAnalysis(arr);
      refCataLogueIndex.value = index && reactCatalogueArray.length - 1;
      refCurr2.value = !index ? arr[0] : arr[arr.length - 1];
    };

    const funcCatalog1 = async (catalog1) => {
      let key = Object.keys(catalog[catalog1]);
      reactCatalog2.length = 0;
      reactCatalog2.push(...key);
      refCurr1.value = catalog1;
      await funcNewArrayLength(reactCatalog2, catalog1.indexOf("components"));

      let ThreeLevelCatalog = catalog[refCurr1.value];
      let formatConfig =
        ThreeLevelCatalog[
          Object.keys(ThreeLevelCatalog)[
            !catalog1.indexOf("components")
              ? 0
              : Object.keys(ThreeLevelCatalog).length - 1
          ]
        ];
      reactCatalog3.length = 0;
      reactCatalog3.push(...formatConfig);
      refCurr3.value = formatConfig[0];
      computedCatalog3();
    };

    const funcCurrentCata = (index, item) => {
      refCataLogueIndex.value = index;
      refCurr2.value = item[item.length - 1];
      funcCatalog2(refCurr2.value);
    };

    const funcCatalog2 = (catalog2) => {
      let data = catalog[refCurr1.value][catalog2];
      reactCatalog3.length = 0;
      reactCatalog3.push(...data);
      refCurr2.value = catalog2;
      refCurr3.value = data[0];
      computedCatalog3();
    };

    const funcCatalog3 = (catalog3) => {
      refCurr3.value = catalog3;

      // 仪表盘运行在独立服务器，需要跳转到主项目的 dev server
      // 默认主项目运行在 8084 端口
      const mainProjectPort = 8084;
      let url = `http://localhost:${mainProjectPort}/src/${refCurr1.value}/${refCurr2.value}/${refCurr3.value}`;
      url += /\.html$/.test(refCurr3.value)
        ? `?lang=en`
        : `/index.html?lang=en`;

      // 显示提示并打开页面
      ElMessage.info({
        message: `正在打开页面...`,
        duration: 2000,
      });

      setTimeout(() => {
        window.open(url, "_blank");
      }, 200);
    };

    // 处理第三级目录
    let alphabetCollection: string[] = [];
    let reactCatalog3newaArray = reactive<any>([]);

    const computedCatalog3 = async () => {
      alphabetCollection.length = 0;
      reactCatalog3newaArray.length = 0;

      for (let i = 0; i < reactCatalog3.length; i++) {
        let letter = reactCatalog3[i].replace(/[^a-zA-Z0-9]/g, "")
          ? reactCatalog3[i]
              .replace(/[^a-zA-Z0-9]/g, "")
              .substring(0, 1)
              .toLocaleUpperCase()
          : "";
        if (alphabetCollection.indexOf(letter) <= -1)
          alphabetCollection.push(letter);
      }

      for (let i = 0; i < alphabetCollection.length; i++) {
        let tempCatalogObjArr: string[] = [];
        let tempObj: { alphabetCollection?: string; catalog3?: string[] } = {};
        let letterTemp = alphabetCollection[i];
        tempObj.alphabetCollection = letterTemp;

        for (let j = 0; j < reactCatalog3.length; j++) {
          let letter = reactCatalog3[j]
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 1)
            .toLocaleUpperCase();
          if (letterTemp == letter) tempCatalogObjArr.push(reactCatalog3[j]);
        }

        tempObj.catalog3 = tempCatalogObjArr;
        reactCatalog3newaArray.push(tempObj);
      }
    };

    // 服务器状态检测
    const mainServerRunning = ref(false);
    const mainProjectPort = 8084;

    // 检测主项目服务器是否运行
    const checkMainServer = async () => {
      try {
        const response = await fetch(`http://localhost:${mainProjectPort}`, {
          method: "HEAD",
          mode: "no-cors",
        });
        mainServerRunning.value = true;
      } catch (err) {
        mainServerRunning.value = false;
      }
    };

    // 定期检测服务器状态
    const startServerCheck = () => {
      checkMainServer();
      setInterval(checkMainServer, 5000); // 每5秒检测一次
    };

    // 创建页面相关
    const showCreateDialog = ref(false);
    const createForm = reactive({
      pageName: "",
      template: "soulstar",
      languages: ["en", "ar", "tr"], // 默认全选
    });
    const creating = ref(false);

    // 路径预览
    const previewPath = computed(() => {
      if (!createForm.pageName) {
        return "请输入页面名称";
      }
      return `src/page/${createForm.pageName}/`;
    });

    // 表单验证
    const isFormValid = computed(() => {
      // 页面名称验证：字母、数字、中划线、下划线、斜杠
      const pageNameValid = /^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/.test(
        createForm.pageName
      );
      // 至少选择一种语言
      const languagesValid = createForm.languages.length > 0;
      return pageNameValid && languagesValid;
    });

    // 页面名称输入时触发
    const handlePageNameChange = () => {
      // 实时验证
      if (createForm.pageName && !isFormValid.value) {
        // 可以添加额外的提示逻辑
      }
    };

    const handleCreate = async () => {
      if (!isFormValid.value) {
        ElMessage.warning("请检查表单输入");
        return;
      }

      creating.value = true;

      try {
        // 1. 创建页面
        const res = await fetch("/__api/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createForm),
        });

        const result = await res.json();

        if (result.success) {
          ElMessage.success({
            message: `✅ 页面创建成功！\n路径: ${result.path}`,
            duration: 2000,
          });

          // 2. 重新加载页面数据并初始化 UI（init 内部会调用 loadPages 并清空数组）
          console.log("🔄 重新加载页面列表...");
          await init();

          ElMessage.success({
            message: `📂 页面列表已更新，新页面已可见！`,
            duration: 2000,
          });

          showCreateDialog.value = false;
          
          // 重置表单
          createForm.pageName = "";
          createForm.languages = ["en", "ar", "tr"];
        } else {
          throw new Error(result.message || "创建失败");
        }
      } catch (err) {
        ElMessage.error(`创建失败: ${err.message}`);
      } finally {
        creating.value = false;
      }
    };

    init();
    startServerCheck();

    return {
      refCurr1,
      refCurr2,
      refCurr3,
      reactCatalog1,
      reactCatalog2,
      reactCatalog3,
      funcCatalog1,
      funcCatalog2,
      funcCatalog3,
      reactCatalog3newaArray,
      reactCatalogueArray,
      refCataLogueIndex,
      funcCurrentCata,
      // 服务器状态
      mainServerRunning,
      // 创建页面相关
      showCreateDialog,
      createForm,
      creating,
      handleCreate,
      previewPath,
      isFormValid,
      handlePageNameChange,
    };
  },
});
