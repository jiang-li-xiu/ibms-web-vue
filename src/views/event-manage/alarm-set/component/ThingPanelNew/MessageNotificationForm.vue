<template>
  <div>
    <div class="font-600 trigger_condition_title">消息通知</div>
    <div class="trigger_condition_box">
      <div
        class="trigger_condition_item margin_top_1 padding_tb_3"
        v-for="(item, i) in templateData.alarmNotices"
        :key="item.id"
      >
        <el-row :gutter="1">
          <el-col :span="2">消息通知：{{ item.id }}</el-col>
          <el-col :span="1">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteNotice(i)"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 13.8rem">
            <el-form-item
              :prop="`alarmNotices[${i}].noticeType`"
              :rules="rules.noticeType"
            >
              <el-select
                v-model="item.noticeType"
                @change="getNoticeType($event, i)"
                placeholder="选择通知类型"
              >
                <el-option
                  v-for="items in noticeType"
                  :key="items.dictValue"
                  :label="items.dictLabel"
                  v-model="items.dictValue"
                  :disabled="items.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col
            style="width: 13.8rem; margin-left: 1vw"
            v-if="item.noticeType != null"
          >
            <el-form-item
              :prop="`alarmNotices[${i}].noticeConfigId`"
              :rules="rules.noticeConfigId"
            >
              <template>
                <el-select
                  v-model="item.noticeConfigId"
                  @change="getNoticeConfig($event, i)"
                  placeholder="选择通知配置"
                >
                  <el-option
                    v-for="items in item.noticeConfig"
                    :key="items.id"
                    :label="items.name"
                    v-model="items.id"
                  />
                </el-select>
              </template>
            </el-form-item>
          </el-col>

          <el-col
            style="width: 13.8rem; margin-left: 1vw"
            v-if="item.noticeType != null && item.noticeConfigId != null"
          >
            <el-form-item
              :prop="`alarmNotices[${i}].noticeTemplateId`"
              :rules="rules.noticeTemplateId"
            >
              <template>
                <el-select
                  v-model="item.noticeTemplateId"
                  placeholder="选择通知模板"
                >
                  <el-option
                    v-for="items in item.noticeTemplate"
                    :key="items.id"
                    :label="items.name"
                    v-model="items.id"
                  />
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div
        class="margin_top_1 trigger_condition_title"
        style="padding-left: 3.1vw"
      >
        <el-button type="primary" @click="newAddNotice">新增通知</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getNoticeNoticeConfigV1List,
  getNoticeNoticeTemplateV1List,
} from "@/api/subsystem/linkageAdministration";
export default {
  name: "MessageNotificationForm",
  components: {},
  props: {
    templateData: {
      type: Object,
      default() {
        return {};
      },
    },
    noticeType: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      rules: {
        noticeType: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 根据服务商获取列表
    getNoticeConfig(val, i) {
      let serviceProvider = null;
      this.templateData.alarmNotices[i].noticeConfig.forEach((item) => {
        if (item.id == val) {
          serviceProvider = item.serviceProvider;
        }
      });

      getNoticeNoticeTemplateV1List(serviceProvider).then((response) => {
        this.$set(
          this.templateData.alarmNotices[i],
          "noticeTemplate",
          response.data
        );
      });
    },
    // 根据选择的通知方式请求数据
    getNoticeType(val, i) {
      getNoticeNoticeConfigV1List(val).then((response) => {
        this.$set(
          this.templateData.alarmNotices[i],
          "noticeConfig",
          response.data
        );
      });
    },
    // 删除通知
    deleteNotice(i) {
      if (this.templateData.alarmNotices.length <= 1) {
        return this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
      }
      this.templateData.alarmNotices.splice(i, 1);
    },
    // 新增通知
    newAddNotice() {
      let datas = this.templateData.alarmNotices,
        id = datas[datas.length - 1].id;
      id += 1;
      this.templateData.alarmNotices.push({
        id,
        alarmId: "",
        noticeType: null,
        noticeConfigId: null,
        noticeTemplateId: null,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.margin_top_1 {
  margin-top: 1vh;
}

.padding_tb_3 {
  padding: 3vh 0;
  box-sizing: border-box;
}

.trigger_condition_title {
  margin-left: -2.7vw;
}

.trigger_condition_box {
  margin-left: -3.1vw;
}

.trigger_condition_item {
  padding-left: 3.1vw;
  box-sizing: border-box;
  background-color: #eee;
}
</style>
