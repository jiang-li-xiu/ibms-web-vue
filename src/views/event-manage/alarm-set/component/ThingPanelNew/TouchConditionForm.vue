<template>
  <div>
    <div class="font-600 trigger_condition_title">触发条件</div>
    <div class="trigger_condition_box">
      <div
        class="trigger_condition_item margin_top_1 padding_tb_3"
        v-for="(item, i) in templateData.conditions"
        :key="item.id"
      >
        <el-row :gutter="1">
          <el-col :span="2">触发条件：{{ item.id }}</el-col>
          <el-col :span="1">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteTrigger(i)"
              >删除</el-button
            >
          </el-col>
        </el-row>

        <!-- 请选择触发条件 -->
        <el-row>
          <el-col>
            <el-select
              v-model="item.alarmTriggerType"
              placeholder="请选择触发条件"
              disabled
            >
              <el-option
                v-for="items in linkTriggerCondition"
                :key="items.dictValue"
                :label="items.dictLabel"
                v-model="items.dictValue"
              />
            </el-select>
          </el-col>
        </el-row>

        <!-- 请选择类型 -->
        <el-row class="margin_top_1">
          <el-col :span="5">
            <el-form-item :prop="`conditions[${i}].type`" :rules="rules.type">
              <el-select
                v-model="item.type"
                placeholder="请选择类型"
                @change="typeEP($event, i)"
              >
                <el-option
                  v-for="items in linkageTriggerType"
                  :key="items.dictValue"
                  :label="items.dictLabel"
                  v-model="items.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 选择事件后展示 -->
          <el-col :span="5" v-show="item.type == 2">
            <el-form-item
              :prop="`conditions[${i}].eventName`"
              :rules="rules.eventName"
              ref="eventName"
            >
              <el-select
                v-model="item.eventName"
                placeholder=""
                @change="handlsChange($event, i)"
              >
                <el-option
                  v-for="(items,index) in events"
                  :key="index"
                  :label="items.eventName"
                  v-model="items.eventType"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 选择属性后展示 -->
        <el-row class="padding_left_3" v-show="item.type == 1">
          <el-col>
            <el-row
              v-for="(items, is) in item.filters"
              :key="items.id"
              class="margin_top_2"
            >
              <el-col :span="5">
                <el-form-item
                  :prop="`conditions[${i}].filters[${is}].propertyName`"
                  :rules="rules.propertyName"
                  ref="propertyName"
                >
                  <el-select
                    v-model="items.propertyName"
                    placeholder=""
                    @change="changeProperty($event, i, is)"
                  >
                    <el-option
                      v-for="itemss in properties"
                      :key="itemss.field"
                      :label="itemss.name"
                      v-model="itemss.field"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 操作符 -->
              <el-col :span="5">
                <el-form-item
                  :prop="`conditions[${i}].filters[${is}].operator`"
                  :rules="rules.operator"
                  ref="operator"
                >
                  <el-select
                    style="width: 13.8rem"
                    v-model="items.operator"
                    placeholder="请选择操作符"
                  >
                    <el-option
                      v-for="itemss in linkTriggerOperator"
                      :key="itemss.dictValue"
                      :label="itemss.dictLabel"
                      v-model="itemss.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 过滤值 -->
              <el-col :span="5">
                <el-form-item
                  :prop="`conditions[${i}].filters[${is}].threshold`"
                  :rules="rules.threshold"
                  ref="threshold"
                >
                  <el-input
                    style="width: 13.8rem"
                    v-model="items.threshold"
                    placeholder="请输入过滤值"
                    clearable
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click.stop="deleteA(i, is)"
                >删除</el-button
              >
            </el-row>
          </el-col>

          <el-col :span="2" class="margin_top_2">
            <el-button type="primary" @click="addFilter(i)"
              >添加过滤条件</el-button
            >
          </el-col>
        </el-row>
      </div>

      <div
        class="margin_top_1 trigger_condition_title"
        style="padding-left: 3.1vw"
      >
        <el-button type="primary" @click="addTrigger">新增触发条件</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TouchConditionForm",
  components: {},
  props: {
    templateData: {
      type: Object,
      default() {
        return {};
      },
    },
    linkTriggerCondition: {
      type: Array,
      default() {
        return [];
      },
    },
    linkageTriggerType: {
      type: Array,
      default() {
        return [];
      },
    },
    events: {
      type: Array,
      default() {
        return [];
      },
    },
    properties: {
      type: Array,
      default() {
        return [];
      },
    },
    linkTriggerOperator: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // 验证
      rules: {
        type: [
          { required: true, message: "请选择类型", trigger: "blur" },
          //
        ],
        eventName: [
          { required: true, message: "请选择", trigger: "blur" },
          //
        ],
        propertyName: [
          { required: true, message: "请选择", trigger: "blur" },
          //
        ],
        operator: [
          { required: true, message: "请选择操作符", trigger: "blur" },
          //
        ],
        threshold: [
          { required: true, message: "请输入过滤值", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 删除过滤条件
    deleteA(i, is) {
      if (this.templateData.conditions[i].filters.length <= 1) {
        return this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
      }
      this.templateData.conditions[i].filters.splice(is, 1);
    },
    // 处理选框
    changeProperty(e, i, is) {
      this.properties.forEach((item) => {
        if (item.field == e) {
          // this.templateData.conditions[i].filters[is].type = item.dataType.type;
          this.$set(
            this.templateData.conditions[i].filters[is],
            "type",
            item.dataType.type
          );
        }
      });
    },
    // 切换事件类型
    handlsChange(e, i) {
      this.events.forEach((item) => {
        if (item.eventType == e) {
          this.templateData.conditions[i].eventName = item.eventName;
          this.templateData.conditions[i].eventType = item.eventType;
        }
      });
    },
    // 删除触发条件
    deleteTrigger(i) {
      if (this.templateData.conditions.length <= 1) {
        return this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
      }
      this.templateData.conditions.splice(i, 1);
    },
    // 添加过滤条件
    addFilter(i) {
      let datas = this.templateData.conditions[i].filters,
        id = datas[datas.length - 1].id;
      id += 1;
      this.templateData.conditions[i].filters.push({
        id,
        propertyName: "", // 过滤条件
        type: "",
        operator: "", // 操作符
        threshold: null, // 输入值
      });
    },
    // 重置类型
    typeEP(val, i) {
      if (val == 1) {
        this.templateData.conditions[`${i}`].eventName = "";
        this.$refs.eventName[`${i}`].clearValidate();
        this.$set(this.templateData.conditions[`${i}`], "filters", [
          {
            id: 1,
            propertyName: "",
            type: "",
            operator: "",
            threshold: "",
          },
        ]);
      } else {
        this.$refs.propertyName[i].clearValidate();
        this.$refs.operator[i].clearValidate();
        this.$refs.threshold[i].clearValidate();
      }
    },
    // 新增触发条件
    addTrigger() {
      let datas = this.templateData.conditions,
        id = datas[datas.length - 1].id;
      id += 1;
      this.templateData.conditions.push({
        id,
        alarmTriggerType: "3", // 触发类型
        type: "", // 属性/事件
        eventName: "", // 事件触发类型
        filters: [
          {
            id: 1,
            propertyName: "", // 过滤条件
            type: "",
            operator: "", // 操作符
            threshold: null, // 输入值
          },
        ],
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.margin_top_1 {
  margin-top: 1vh;
}

.margin_top_2 {
  margin-top: 2vh;
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
