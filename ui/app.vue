<template>
  <div class="viteInit-content">
    <!-- 顶部标题栏 -->
    <div class="viteInit-header public_flex_left">
      <div class="header-left">
        <img src="https://vite.dev/assets/viteconf.Dvk5Ghxu.svg" />
        <span>开发仪表盘</span>
      </div>

      <!-- 服务器状态（右侧紧凑显示） -->
      <div class="server-status-compact">
        <!-- 主项目服务器未运行 -->
        <el-tooltip v-if="!mainServerRunning" placement="bottom" effect="light">
          <template #content>
            <div style="line-height: 1.8; padding: 4px">
              <div style="font-weight: 600; margin-bottom: 6px">
                需要启动主项目开发服务器
              </div>
              <div style="font-size: 12px; color: #666">
                运行命令：<br />
                <code
                  style="
                    background: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: monospace;
                  "
                  >npm run dev</code
                >
                或
                <code
                  style="
                    background: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: monospace;
                  "
                  >npm run dev:all</code
                >
              </div>
            </div>
          </template>
          <el-tag type="warning" size="large" effect="dark">
            ⚠️ 服务器未运行
          </el-tag>
        </el-tooltip>

        <!-- 主项目服务器运行中 -->
        <el-tooltip v-else placement="bottom" effect="light">
          <template #content>
            <div style="padding: 4px">
              <div style="font-weight: 600; margin-bottom: 4px">
                主项目开发服务器
              </div>
              <div style="font-size: 12px; color: #666">
                地址：http://localhost:8084
              </div>
            </div>
          </template>
          <el-tag type="success" size="large" effect="dark">
            ✅ 服务器运行中 :8084
          </el-tag>
        </el-tooltip>
      </div>
    </div>

    <div class="viteInit-main public_flex_left">
      <div class="catalogNavigation">
        <div
          v-for="(item, index) in reactCatalog1"
          :key="`dataName-${item}`"
          :class="[
            `catalog`,
            `catalog1`,
            `${refCurr1 === item ? 'active' : ''}`,
            `public_flex_left`,
          ]"
          @click="funcCatalog1(item)"
        >
          <img src="https://vite.dev/assets/viteconf.Dvk5Ghxu.svg" />
          <span>{{ item }}</span>
        </div>

        <!-- 创建新页面按钮 -->
        <div class="create-page-action">
          <div
            class="catalog catalog1 create-button public_flex_left"
            @click="showCreateDialog = true"
          >
            <span>➕ 创建新页面</span>
          </div>
        </div>
      </div>

      <div class="catalogContent">
        <div class="catalogueContent">
          <template
            v-for="(item, index) in reactCatalogueArray"
            :key="`HomeCatalogue${index}`"
          >
            <div
              :class="[
                `catalog`,
                `catalog2`,
                `hoverAct`,
                `${refCataLogueIndex === index && 'active'}`,
              ]"
              @click="funcCurrentCata(index, item.fileName)"
            >
              <span>{{ item.catalogue }}</span>
            </div>
          </template>

          <div class="catalogueContent__main">
            <template
              v-for="(item, index) in reactCatalogueArray[refCataLogueIndex]
                ?.fileName"
              :key="`HomeCatalogue${index}`"
            >
              <div
                :class="[
                  `catalog`,
                  `catalog2`,
                  `hoverAct`,
                  `${refCurr2 === item && 'active'}`,
                ]"
                @click="funcCatalog2(item)"
              >
                <span>{{ item }}</span>
              </div>
            </template>
          </div>
        </div>

        <ul>
          <li
            v-for="(item, index) in reactCatalog3newaArray"
            :key="`lettC-${item.alphabetCollection}`"
          >
            <div class="lettFlag">{{ item.alphabetCollection }}</div>
            <p
              v-for="(itemProName, indexProName) in item.catalog3"
              :key="`o${indexProName}`"
              @click="funcCatalog3(itemProName)"
            >
              {{ itemProName }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <!-- 创建页面对话框 -->
    <el-dialog v-model="showCreateDialog" title="✨ 创建新页面" width="600px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="页面名称" required>
          <el-input
            v-model="createForm.pageName"
            placeholder="例如: 2025 或 2025/11 (支持多级目录)"
            @input="handlePageNameChange"
          />
          <div class="form-tip">
            支持单级或多级目录，使用 / 分隔，如：honor-wall, 2025/11
          </div>
        </el-form-item>

        <el-form-item label="选择模板" required>
          <el-select
            v-model="createForm.template"
            placeholder="选择模板"
            style="width: 100%"
          >
            <el-option label="SoulStar模板" value="soulstar" />
          </el-select>
          <div class="form-tip">当前版本仅支持SoulStar模板</div>
        </el-form-item>

        <el-form-item label="多语言配置" required>
          <el-checkbox-group v-model="createForm.languages">
            <el-checkbox label="en">English</el-checkbox>
            <el-checkbox label="ar">العربية (Arabic)</el-checkbox>
            <el-checkbox label="tr">Türkçe (Turkish)</el-checkbox>
          </el-checkbox-group>
          <div class="form-tip">默认全选，至少选择一种语言</div>
        </el-form-item>

        <el-form-item label="生成路径">
          <el-alert
            :title="previewPath"
            type="success"
            :closable="false"
            show-icon
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="creating"
          :disabled="!isFormValid"
          @click="handleCreate"
        >
          {{ creating ? "创建中..." : "创建页面" }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import appTs from "./app";
export default appTs;
</script>

<style lang="scss">
@use "./public_class.scss";
@use "./viteInit-style.scss";
@use "./viteInit-animate.scss";

body {
  background: linear-gradient(
    270deg,
    rgba(187, 16, 143, 1) 0%,
    rgba(0, 153, 117, 1) 50%,
    rgba(93, 0, 175, 1) 99%
  );
}

/* 顶部标题栏样式（Flex 布局） */
.viteInit-header {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .server-status-compact {
    display: flex;
    align-items: center;

    :deep(.el-tag) {
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: help;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    :deep(.el-tag--success) {
      background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      border-color: #67c23a;
    }

    :deep(.el-tag--warning) {
      background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
      border-color: #e6a23c;
    }
  }
}

/* 左侧导航区域 - 创建按钮样式 */
.catalogNavigation {
  .create-page-action {
    padding: 8px 12px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 8px;

    .create-button {
      justify-content: center;
      background: linear-gradient(
        -45deg,
        #67c23a 50%,
        #85ce61 60%,
        #67c23a 70%
      );
      background-size: 600% 100%;
      color: rgb(255, 255, 255);
      font-weight: bold;
      animation: shine 20s infinite;
      animation-delay: 0s;
      animation-timing-function: linear;

      &:hover {
        background: linear-gradient(
          -45deg,
          #529b2e 50%,
          #67c23a 60%,
          #529b2e 70%
        );
        background-size: 600% 100%;
        animation: shine 20s infinite;
      }

      span {
        font-size: 18px;
      }
    }
  }
}

/* 表单提示样式 */
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}

/* 代码片段样式 */
.code-snippet {
  background: rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 12px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0 4px;
  display: inline-block;
}
</style>
