<!--
 * @Author       : Imor
 * @Date         : 2021-09-30 09:07:56
 * @LastEditTime : 2021-10-12 16:23:14
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\views\visualization\components\SceneTree.vue
 * @Description  : 
-->
<template>
  <div class="scene_tree">
    <!-- 顶部标题 -->
    <div class="scene_tree_title">{{ componentTitle }}</div>
    <!-- 搜索 -->
    <div class="input_tree">
      <div class="div_input">
        <el-input :placeholder="default_pholder" v-model="filterText" @input="emitInputText" />
      </div>
    </div>
    <!-- 树形 -->
    <slot name="component_content"></slot>
  </div>
</template>

<script>
export default {
  props: {
    componentTitle: {
      type: String,
      default: () => {
        return "啥也不是";
      },
    },
    default_pholder: {
      type: String,
      default: () => {
        return "啥也不是";
      },
    },
    treeData: {
      type: Array,
      default: () => {
        return [
          {
            children: null,
            labelName: "1号楼",
          },
          {
            children: null,
            labelName: "2号楼",
          },
        ];
      },
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "LabelName",
        };
      },
    },
  },
  data() {
    return {
      filterText: "",
    };
  },
  methods:{
    emitInputText(){
      this.$emit('inputText', this.filterText);
    }
  }
};
</script>

<style>
.scene_tree {
  background: #fff;
  width: 22%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scene_tree > div:nth-child(3) {
  height: 100%;
  overflow: hidden;
  padding-bottom: 10px;
}

.scene_tree_title {
  background-color: #434348;
  padding-left: 25px;
  font-size: 20px;
  color: #fff;
  height: 60px;
  line-height: 60px;
  position: relative;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.input_tree .div_input {
  padding: 15px 25px;
  text-align: center;
}
</style>

