<template>
  <div>
    <el-dialog title="新增联动" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="3vw" ref="addForm">
        <div class="id_name_box">
          <div>
            <el-form-item label="联动ID" prop="linkageID">
              <el-input
                v-model="form.linkageID"
                placeholder="请输入联动ID"
                size="small"
              />
            </el-form-item>
          </div>

          <div>
            <el-form-item label="联动名称" prop="linkageName">
              <el-input
                v-model="form.linkageName"
                placeholder="请输入联动名称"
                size="small"
              >
              </el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 触发条件 -->
        <div>
          <div class="title_box">触发条件</div>

          <div class="trigger_box">
            <div
              class="trigger_item"
              v-for="(item, i) in linkTriggerconditionData"
              :key="item.id"
            >
              <div class="trigger_title">
                <span>触发器：{{ item.id }}</span>
                <span @click="deleteTrigger(i)">删除</span>
              </div>

              <!-- 第一行输入框（start） -->
              <div class="margin_left_3 position_relative">
                <div
                  class="select_input_box cursor_pointer"
                  @click="openTrigger(i)"
                >
                  <input
                    class="cursor_pointer"
                    type="text"
                    placeholder="请选择触发器"
                    :value="item.dictLabel"
                    disabled
                  />
                  <em class="el-icon-arrow-up" v-if="item.isInput"></em>
                  <em class="el-icon-arrow-down" v-else></em>
                </div>

                <div
                  class="select_panel_box cursor_pointer position_absolute"
                  v-if="item.isInput"
                >
                  <div
                    class="select_panel_item"
                    v-for="items in linkTriggerCondition"
                    :key="items.dictValue"
                    v-text="items.dictLabel"
                    @click="selectTrigger(items, i)"
                  ></div>
                </div>
              </div>
              <!-- 第一行输入框（end） -->

              <!-- 场景触发模块（status） -->
              <div :style="{ display: item.dictValue == 4 ? 'block' : 'none' }">
                <div class="scene_box">
                  <div
                    class="select_input_box cursor_pointer margin_left_3"
                    @click="twoOpenTrigger(i)"
                  >
                    <input
                      class="cursor_pointer"
                      type="text"
                      placeholder="请选择场景"
                      value=""
                      disabled
                    />
                    <em class="el-icon-arrow-up" v-if="item.isInputTwo"></em>
                    <em class="el-icon-arrow-down" v-else></em>
                  </div>

                  <div class="show_box">
                    <span>已选项:</span>
                    <span
                      class="show_item"
                      v-for="(items, is) in item.twoData"
                      :key="items.id"
                    >
                      <span v-text="items.title" v-if="items.isOpent"></span>
                      <em
                        v-if="items.isOpent"
                        class="el-icon-close"
                        @click="twoSelectTrigger(items, i, is)"
                        style="
                          color: #ff0000;
                          margin-left: 0.1vw;
                          cursor: pointer;
                        "
                      ></em>
                    </span>
                  </div>
                </div>

                <div class="trigger_content" v-if="item.isInputTwo">
                  <p
                    v-for="(items, is) in item.twoData"
                    :key="items.id"
                    @click="twoSelectTrigger(items, i, is)"
                  >
                    <span>{{ items.title }}</span>
                    <em
                      class="el-icon-check"
                      style="margin-left: 0.5vw"
                      v-if="items.isOpent"
                    ></em>
                    <!-- <em class="el-icon-check" style="color: #ffffff" v-else></em> -->
                  </p>
                </div>
              </div>
              <!-- 场景触发模块（status） -->

              <!-- 定时触发（status） -->
              <div
                class="timing_trigger_box"
                :style="{ display: item.dictValue == 2 ? 'block' : 'none' }"
              >
                <input
                  class="timing_trigger_input"
                  type="text"
                  placeholder="cron表达式"
                  v-model="item.timingTrigger"
                />
              </div>
              <!-- 定时触发（end） -->

              <!-- 设备触发（start） -->
              <div
                class="equipment_trigger_box"
                :style="{ display: item.dictValue == 3 ? 'block' : 'none' }"
              >
                <!-- 点击选择设备 -->
                <div class="position_relative">
                  <div class="select_input_box cursor_pointer">
                    <input
                      class="cursor_pointer"
                      type="text"
                      disabled
                      placeholder="点击选择设备"
                      v-model="item.equipment"
                    />
                    <em class="el-icon-arrow-down"></em>
                    <!-- <em class="el-icon-arrow-up" v-if="item.isInput"></em> -->
                    <!-- <em class="el-icon-arrow-down" v-else></em> -->
                  </div>
                </div>

                <!-- 类型 -->
                <div class="dis_r">
                  <div class="position_relative">
                    <!-- 按钮 -->
                    <div
                      class="select_input_box cursor_pointer"
                      @click="TriggerTypes(i)"
                    >
                      <input
                        class="cursor_pointer"
                        type="text"
                        placeholder="请选择类型"
                        v-model="item.triggerType"
                        disabled
                      />
                      <em
                        class="el-icon-arrow-up"
                        v-if="item.isTriggerType"
                      ></em>
                      <em class="el-icon-arrow-down" v-else></em>
                    </div>

                    <!-- 面板 -->
                    <div
                      class="select_panel_box cursor_pointer position_absolute"
                      v-if="item.isTriggerType"
                    >
                      <div
                        class="select_panel_item"
                        v-for="(items, is) in item.equipmentType"
                        :key="items.id"
                        v-text="items.title"
                        @click="selectType(items, i, is)"
                      ></div>
                    </div>
                  </div>

                  <div
                    class="position_relative margin_left_1"
                    v-if="item.isTriggerTypess"
                  >
                    <!-- 按钮 -->
                    <div
                      class="select_input_box cursor_pointer"
                      @click="TriggerTypess(i)"
                    >
                      <input
                        class="cursor_pointer"
                        type="text"
                        placeholder=""
                        v-model="item.triggerTypes"
                        disabled
                      />
                      <em
                        class="el-icon-arrow-up"
                        v-if="item.isTriggerTypes"
                      ></em>
                      <em class="el-icon-arrow-down" v-else></em>
                    </div>

                    <!-- 面板 -->
                    <div
                      style="display: none"
                      class="select_panel_box cursor_pointer position_absolute"
                      v-if="item.isTriggerType"
                    >
                      <div
                        class="select_panel_item"
                        v-for="items in item.equipmentType"
                        :key="items.id"
                        v-text="items.title"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- 过滤条件 -->
                <div class="filter_panel_box" v-if="item.isAddFilter">
                  <div
                    class="filter_panel_item"
                    v-for="(items, is) in item.addFilterData"
                    :key="is"
                  >
                    <!-- 类型 -->
                    <div class="position_relative">
                      <div class="select_input_box cursor_pointer">
                        <input
                          class="cursor_pointer"
                          type="text"
                          placeholder="请选择类型"
                          v-model="items.title01"
                          disabled
                        />
                        <em
                          class="el-icon-arrow-up"
                          v-if="item.isTriggerType"
                        ></em>
                        <em class="el-icon-arrow-down" v-else></em>
                      </div>
                    </div>

                    <!-- 操作符 -->
                    <div class="position_relative margin_left_1">
                      <!-- 按钮 -->
                      <div
                        class="select_input_box cursor_pointer"
                        @click="operator(items, i, is)"
                      >
                        <input
                          class="cursor_pointer"
                          type="text"
                          placeholder="操作符"
                          v-model="items.title02"
                          disabled
                        />
                        <em
                          class="el-icon-arrow-up"
                          v-if="items.isOperator"
                        ></em>
                        <em class="el-icon-arrow-down" v-else></em>
                      </div>

                      <!-- 面板 -->
                      <div
                        class="
                          select_panel_box
                          cursor_pointer
                          position_absolute
                        "
                        v-if="items.isOperator"
                      >
                        <div
                          class="select_panel_item"
                          v-for="itemss in item.linkTriggerOperator"
                          :key="itemss.dictValue"
                          v-text="itemss.dictLabel"
                          @click="selectOperator(itemss, i, is)"
                        ></div>
                      </div>
                    </div>

                    <!-- 过滤条件值 -->
                    <div class="position_relative margin_left_1">
                      <div class="select_input_box">
                        <input
                          type="text"
                          placeholder="请输入过滤条件值"
                          v-model="items.title03"
                        />
                      </div>
                    </div>

                    <div
                      class="add_delete margin_left_1"
                      @click="addDelete(i, is)"
                    >
                      删除
                    </div>
                  </div>
                </div>

                <!-- 添加 -->
                <div
                  class="add_filter"
                  v-if="item.isAddFilter"
                  @click="addFilter(i)"
                >
                  <span>添加过滤条件</span>
                </div>
              </div>
              <!-- 设备触发（end） -->
            </div>

            <div style="margin-top: 1vh">
              <el-button icon="el-icon-plus" type="primary" @click="addTrigger"
                >新增触发器</el-button
              >
            </div>
          </div>
        </div>

        <!-- 执行条件 -->
        <div>
          <div class="title_box" style="margin-top: 3vh">执行条件</div>

          <div>
            <div
              class="implement_item"
              v-for="(item, i) in collectImplement"
              :key="item.id"
            >
              <div>
                <div class="trigger_title">
                  <span>执行动作：{{ item.id }}</span>
                  <span @click="deleteImplement(i)">删除</span>
                </div>

                <div class="margin_left_3 dis_r_fs">
                  <div class="position_relative">
                    <div
                      class="select_input_box cursor_pointer"
                      @click="openImplementInput01(item, i)"
                    >
                      <input
                        class="cursor_pointer"
                        type="text"
                        placeholder="请选择执行方式"
                        :value="item.inputText01"
                        disabled
                      />
                      <em
                        class="el-icon-arrow-up"
                        v-if="item.isOpentInput01"
                      ></em>
                      <em class="el-icon-arrow-down" v-else></em>
                    </div>

                    <div
                      class="select_panel_box position_absolute"
                      v-if="item.isOpentInput01"
                    >
                      <div
                        class="select_panel_item cursor_pointer"
                        v-for="items in linkageExecutionMode"
                        :key="items.dictValue"
                        v-text="items.dictLabel"
                        @click="selectPanel01(items, i)"
                      ></div>
                    </div>
                  </div>

                  <div v-show="item.inputVal01 != null">
                    <div
                      class="dis_r_fs"
                      v-show="item.inputVal01 != null && item.inputVal01 == 1"
                    >
                      <div class="margin_left_1 position_relative">
                        <div
                          class="select_input_box cursor_pointer"
                          @click="openImplementInput02(item, i)"
                        >
                          <input
                            class="cursor_pointer"
                            type="text"
                            placeholder="请选择通知类型"
                            :value="item.inputText02"
                            disabled
                          />
                          <em
                            class="el-icon-arrow-up"
                            v-if="item.isOpentInput02"
                          ></em>
                          <em class="el-icon-arrow-down" v-else></em>
                        </div>

                        <div
                          class="select_panel_box position_absolute"
                          v-if="item.isOpentInput02"
                        >
                          <div
                            class="select_panel_item cursor_pointer"
                            v-for="items in linkageNotifyType"
                            :key="items.dictValue"
                            v-text="items.dictLabel"
                            @click="selectPanel02(items, i)"
                          ></div>
                        </div>
                      </div>

                      <div class="margin_left_1 position_relative">
                        <div
                          class="select_input_box cursor_pointer"
                          @click="openImplementInput03(item, i)"
                        >
                          <input
                            class="cursor_pointer"
                            type="text"
                            placeholder="请选择通知配置"
                            :value="item.inputText03"
                            disabled
                          />
                          <em
                            class="el-icon-arrow-up"
                            v-if="item.isOpentInput03"
                          ></em>
                          <em class="el-icon-arrow-down" v-else></em>
                        </div>

                        <div
                          class="select_panel_box position_absolute"
                          v-if="item.isOpentInput03"
                        >
                          <div
                            class="select_panel_item cursor_pointer"
                            v-for="items in linkageExecutionMode"
                            :key="items.dictValue"
                            v-text="items.dictLabel"
                            @click="selectPanel03(items, i)"
                          ></div>
                        </div>
                      </div>

                      <div class="margin_left_1 position_relative">
                        <div
                          class="select_input_box cursor_pointer"
                          @click="openImplementInput04(item, i)"
                        >
                          <input
                            class="cursor_pointer"
                            type="text"
                            placeholder="请选择通知模板"
                            :value="item.inputText04"
                            disabled
                          />
                          <em
                            class="el-icon-arrow-up"
                            v-if="item.isOpentInput04"
                          ></em>
                          <em class="el-icon-arrow-down" v-else></em>
                        </div>

                        <div
                          class="select_panel_box position_absolute"
                          v-if="item.isOpentInput04"
                        >
                          <div
                            class="select_panel_item cursor_pointer"
                            v-for="items in linkageExecutionMode"
                            :key="items.dictValue"
                            v-text="items.dictLabel"
                            @click="selectPanel04(items, i)"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div
                      v-show="item.inputVal01 != null && item.inputVal01 == 2"
                    >
                      951
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="implement_box">
            <div style="margin-top: 1vh">
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="addImplement"
              >
                新增执行动作
              </el-button>
            </div>
          </div>
        </div>
      </el-form>

      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: true,
      formLabelWidth: "3vw",
      // 数据渲染
      linkTriggerconditionData: [],

      form: {
        linkageID: "",
        linkageName: "",
      },

      val: "",

      formData: {
        id: 1,

        // 第一行选中的内容
        dictLabel: "",
        // 第一行选中的值（需要提交给后端的数据）
        dictValue: "",
        // 控制第一行面板的显示与隐藏
        isInput: false,

        // 控制第二行，且第一行的值为四时的面板显示与隐藏
        isInputTwo: false,
        // 第二行数据
        twoData: [],

        // 定时触发
        timingTrigger: "",

        // 点击选择设备
        equipment: "",
        // 触发类型
        triggerType: "",
        triggerTypeId: "",
        isTriggerType: false,
        // 控制 添加过滤条件 的显示与隐藏
        isAddFilter: false,
        // 设备类型
        equipmentType: [],

        triggerTypes: "",
        triggerTypesId: "",
        isTriggerTypes: false,
        isTriggerTypess: false,

        // 添加
        addFilterData: [],

        // 操作符 字典数据
        linkTriggerOperator: [],
      },

      twoData: [
        {
          id: 1,
          title: "打开摄像头",
          value: 1,
          isOpent: false,
        },
        {
          id: 2,
          title: "温度超过28度",
          value: 2,
          isOpent: false,
        },
        {
          id: 3,
          title: "温度>100度打开摄像头头头",
          value: 3,
          isOpent: false,
        },
      ],

      // 设备类型 字典
      linkageTriggerType: [],
      equipmentType: [
        {
          id: 3,
          title: "属性",
          value: 3,
        },
        {
          id: 4,
          title: "事件",
          value: 4,
        },
        {
          id: 5,
          title: "功能",
          value: 5,
        },
      ],

      // 添加过滤条件
      addFilterData: {
        title01: "",
        value01: "",
        title02: "",
        value02: "",
        title03: "",
        value03: "",
        isOperator: false,
      },

      // 字典数据（start）
      // 触发条件 字典数据
      linkTriggerCondition: [],
      // 操作符 字典数据
      linkTriggerOperator: [],
      // 字典数据（end）

      // 执行条件（status）
      // 数据模板
      implementTemplate: {
        id: 1,
        inputText01: null,
        inputVal01: null,
        isOpentInput01: false,

        inputText02: null,
        inputVal02: null,
        isOpentInput02: false,

        inputText03: null,
        inputVal03: null,
        isOpentInput03: false,

        inputText04: null,
        inputVal04: null,
        isOpentInput04: false,
      },
      // 数据收集
      collectImplement: [],
      // 执行方式 字典数据
      linkageExecutionMode: [],
      // 通知类型 字典数据
      linkageNotifyType: [],
      // 执行条件（end）
    };
  },

  created() {
    this.getDictionaries("linkTriggerCondition", "link_trigger_condition");
    this.getDictionaries("linkTriggerOperator", "link_trigger_operator");
    this.getDictionaries("linkageTriggerType", "linkage_trigger_type");
    this.getDictionaries("linkageExecutionMode", "linkage_execution_mode");
    this.getDictionaries("linkageNotifyType", "linkage_notify_type");
  },

  mounted() {
    // 数据初始化
    this.initialization();
    this.initImplement();
  },

  watch: {
    dialogFormVisible: {
      handler(val) {
        this.$emit("addPanel", val);
      },
    },
  },

  methods: {
    // 获取字典数据
    getDictionaries(key, value) {
      this.getDicts(value).then((response) => {
        let { code, data } = response;
        if (code == 200) {
          this[key] = data;
          console.log("字典：", data);
        }
      });
    },

    // 执行条件（status）
    /* 初始化执行条件数据 */
    initImplement() {
      this.collectImplement.push(this.deepClone(this.implementTemplate));
    },

    /* 选中第二个面板的值 */
    selectPanel02(data, i) {
      this.collectImplement[i].inputText02 = data.dictLabel;
      this.collectImplement[i].inputVal02 = data.dictValue;
      this.collectImplement[i].isOpentInput02 = false;
    },

    /* 打开第二个选择框 */
    openImplementInput02(data, i) {
      let datas = this.collectImplement,
        is = 0;
      for (; is < datas.length; is++) {
        if (i == is) {
          this.collectImplement[i].isOpentInput02 = !data.isOpentInput02;
        } else {
          this.collectImplement[is].isOpentInput02 = false;
        }
      }
    },

    /* 选中第一个面板的值 */
    selectPanel01(data, i) {
      if (this.collectImplement[i].inputVal01 != data.dictValue) {
        this.collectImplement[i].inputText02 = "";
        this.collectImplement[i].inputVal02 = "";
      }
      this.collectImplement[i].inputText01 = data.dictLabel;
      this.collectImplement[i].inputVal01 = data.dictValue;
      this.collectImplement[i].isOpentInput01 = false;
    },

    /* 打开第一个选择框 */
    openImplementInput01(data, i) {
      let datas = this.collectImplement,
        is = 0;
      for (; is < datas.length; is++) {
        if (i == is) {
          this.collectImplement[i].isOpentInput01 = !data.isOpentInput01;
        } else {
          this.collectImplement[is].isOpentInput01 = false;
        }
      }
    },

    /* 删除 */
    deleteImplement(i) {
      if (this.collectImplement.length <= 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }
      this.collectImplement.splice(i, 1);
    },

    /* 新增执行动作 */
    addImplement() {
      let data = this.collectImplement,
        dataTemplate = this.implementTemplate,
        id = data[data.length - 1].id;
      id += 1;
      dataTemplate.id = id;
      this.collectImplement.push(this.deepClone(dataTemplate));
    },

    // 执行条件（end）

    // 数据初始化（触发条件）
    initialization() {
      let data = this.formData;

      data.linkTriggerOperator = this.linkTriggerOperator;
      data.twoData = this.twoData;
      data.equipmentType = this.equipmentType;

      this.linkTriggerconditionData.push(this.deepClone(data));
    },

    // twoData 数据克隆
    deepClone(data) {
      if (data === null || typeof data !== "object") return data;
      let cloneData = Array.isArray(data) ? [] : {};
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          cloneData[key] = this.deepClone(data[key]);
        }
      }
      return cloneData;
    },

    // 选择 操作符 的值
    selectOperator(data, i, is) {
      this.linkTriggerconditionData[i].addFilterData[is].title02 =
        data.dictLabel;
      this.linkTriggerconditionData[i].addFilterData[is].value02 =
        data.dictValue;
      this.linkTriggerconditionData[i].addFilterData[is].isOperator = false;
    },

    // 控制操作符的显示隐藏
    operator(data, i, is) {
      console.log(data, i, is);
      this.linkTriggerconditionData[i].addFilterData[is].isOperator =
        !data.isOperator;
    },

    // 删除过滤条件
    addDelete(i, is) {
      this.linkTriggerconditionData[i].addFilterData.splice(is, 1);
    },

    // 添加过滤条件
    addFilter(i) {
      this.linkTriggerconditionData[i].addFilterData.push(
        this.deepClone(this.addFilterData)
      );
    },

    // 选择 类型 选框后的选框面板的值
    selectTypef(data, i, is) {
      console.log(data, i, is);
      this.linkTriggerconditionData[i].triggerTypes = data.title;
      this.linkTriggerconditionData[i].isTriggerTypes = false;
    },

    // 控制 类型 选框后的选框的面板 显示影藏
    TriggerTypess(i) {
      for (let is = 0; is < this.linkTriggerconditionData.length; is++) {
        if (i == is) {
          this.linkTriggerconditionData[i].isTriggerTypes =
            !this.linkTriggerconditionData[i].isTriggerTypes;
        } else {
          this.linkTriggerconditionData[is].isTriggerTypes = false;
        }
        this.linkTriggerconditionData[is].isInput = false;
      }
      // triggerTypes: "",
      //   triggerTypesId: "",
    },

    // 选中类型的值
    selectType(data, i, is) {
      console.log(data, i, is);
      let id = data.id;
      if (this.linkTriggerconditionData[i].triggerType != data.title) {
        this.linkTriggerconditionData[i].addFilterData = [];
      }

      this.linkTriggerconditionData[i].triggerType = data.title;
      this.linkTriggerconditionData[i].triggerTypeId = id;
      this.linkTriggerconditionData[i].isAddFilter = id == 3 ? true : false;
      this.linkTriggerconditionData[i].isTriggerType = false;
      this.linkTriggerconditionData[i].isTriggerTypess = true;
      this.linkTriggerconditionData[i].triggerTypes = "";
    },

    // 控制类型面板的显示隐藏
    TriggerTypes(i) {
      for (let is = 0; is < this.linkTriggerconditionData.length; is++) {
        if (i == is) {
          this.linkTriggerconditionData[i].isTriggerType =
            !this.linkTriggerconditionData[i].isTriggerType;
        } else {
          this.linkTriggerconditionData[is].isTriggerType = false;
        }
        this.linkTriggerconditionData[is].isInput = false;
      }
    },

    // 选中触发场景面板的值
    twoSelectTrigger(data, i, is) {
      this.linkTriggerconditionData[i].twoData[is].isOpent = !data.isOpent;
    },

    // 打开场景触发面板
    twoOpenTrigger(i) {
      console.log(i);
      for (let is = 0; is < this.linkTriggerconditionData.length; is++) {
        if (i == is) {
          this.linkTriggerconditionData[i].isInputTwo =
            !this.linkTriggerconditionData[i].isInputTwo;
        } else {
          this.linkTriggerconditionData[is].isInputTwo = false;
        }
        this.linkTriggerconditionData[is].isInput = false;
      }
    },

    // 选中触发器获取的值
    selectTrigger(data, i) {
      let datas = this.linkTriggerconditionData;
      for (let is = 0; is < datas[i].twoData.length; is++) {
        this.linkTriggerconditionData[i].twoData[is].isOpent = false;
      }
      this.linkTriggerconditionData[i].timingTrigger = "";
      this.linkTriggerconditionData[i].dictLabel = data.dictLabel;
      this.linkTriggerconditionData[i].dictValue = data.dictValue;
      this.linkTriggerconditionData[i].isInput = false;
    },

    // 打开触发器 面板
    openTrigger(i) {
      for (let is = 0; is < this.linkTriggerconditionData.length; is++) {
        if (i == is) {
          this.linkTriggerconditionData[i].isInput =
            !this.linkTriggerconditionData[i].isInput;
        } else {
          this.linkTriggerconditionData[is].isInput = false;
        }
        this.linkTriggerconditionData[is].isInputTwo = false;
      }
    },

    // 删除触发器
    deleteTrigger(i) {
      if (this.linkTriggerconditionData.length == 1) {
        this.$message({
          message: "必须保留一项数据。",
          type: "warning",
        });
        return false;
      }

      this.linkTriggerconditionData.splice(i, 1);
    },

    // 添加触发器
    addTrigger() {
      let datas = this.linkTriggerconditionData,
        val = datas[datas.length - 1].id,
        data = this.formData;

      val += 1;

      data.data = this.linkTriggerCondition;
      data.linkTriggerOperator = this.linkTriggerOperator;
      data.twoData = this.twoData;
      data.equipmentType = this.equipmentType;
      data.id = val;

      this.linkTriggerconditionData.push(this.deepClone(data));
    },

    // 确定
    determine() {
      console.log(this.form);
      console.log(this.linkTriggerconditionData);
      console.log(this.collectImplement);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 公共样式（start） */
.dis_r_fs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.title_box {
  font-weight: 600;
  margin: 1vh 0;
}

input::placeholder {
  color: #cccfe0;
}

.cursor_pointer {
  /* 小手 */
  cursor: pointer;
}

.position_relative {
  /* 相对定位 */
  position: relative;
}

.position_absolute {
  /* 绝对定位 */
  position: absolute;
}

.select_input_box {
  background-color: #ffffff;
  display: inline-block;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0.7vh 0.5vw;
}

.select_panel_box {
  background-color: #fff;
  z-index: 9;
  margin-top: 0.3vh;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.select_panel_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1vh 0.7vw;
  margin: 1vh 0;
  box-sizing: border-box;
}

.margin_left_3 {
  margin-left: 3vw;
}

.margin_left_2 {
  margin-left: 2vw;
}

.margin_left_1 {
  margin-left: 1vw;
}
/* 公共样式（end） */

/* 执行条件（status） */
.implement_item {
  background-color: #eee;
  padding: 1vh 0;
  margin: 1vh 0;
  box-sizing: border-box;
}
/* 执行条件（end） */

.id_name_box {
  display: flex;
}

.id_name_box > div:last-child {
  margin-left: 3vw;
}

.trigger_box {
  margin-top: 1vh;
}

.trigger_item {
  background-color: #eee;
  padding: 1vh 0;
  box-sizing: border-box;
  margin: 1vh 0;
}

.trigger_title {
  margin-bottom: 0.5vh;
}

.trigger_title > span:last-child {
  margin-left: 2vw;
  color: #0000ff;
  cursor: pointer;
}

/* .el-form-item {
  margin-bottom: 0;
} */

/* 触发器（start） */
.scene_box {
  display: flex;
  align-items: center;
  margin-top: 0.7vh;
}

.show_box {
  margin-left: 0.7vw;
}

.show_box > span:first-child {
  margin-right: -0.3vw;
}

.show_item {
  margin-left: 0.5vw;
}

.trigger_content {
  background-color: #fff;
  position: absolute;
  z-index: 9;
  margin-left: 3.05vw;
  margin-top: 0.3vh;
  width: 6.7vw;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.trigger_content > p {
  cursor: pointer;
  padding: 0.3vh 0.7vw;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trigger_content > p:hover {
  background-color: #eee;
}
/* 触发器（end） */

/* 定时触发（start） */
.timing_trigger_box {
  background-color: #ffffff;
  margin-left: 3vw;
  margin-top: 0.7vh;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0.7vh 0.5vw;
  width: 208px;
  box-sizing: border-box;
}
/* 定时触发（end） */

/* 设备触发（start） */
.equipment_trigger_box {
  margin-top: 0.7vh;
  margin-left: 3vw;
}

.dis_r {
  display: flex;
  margin-top: 0.7vh;
}

/* 设备触发（end） */

/* 过滤条件面板 */
.filter_panel_item {
  display: flex;
  align-items: center;
  margin-top: 0.7vh;
}

.link_trigger_operator {
  position: absolute;
  background-color: #fff;
  margin-top: 0.7vh;
  z-index: 9;
}

.add_delete {
  color: #ff0000;
  cursor: pointer;
}
/* 过滤条件面板 */

/* 添加过滤条件（start） */
.add_filter {
  color: #0000ff;
  margin-top: 0.7vh;
  cursor: pointer;
}

input {
  outline: none;
  background: none;
  background-image: none;
  border: none;
}
</style>