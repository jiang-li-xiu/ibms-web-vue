<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="500px"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
      </el-form-item>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number
          v-model="form.roleSort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-checkbox
          v-model="menuExpand"
          @change="handleCheckedTreeExpand($event, 'menu')"
          >展开/折叠</el-checkbox
        >
        <el-checkbox
          v-model="menuNodeAll"
          @change="handleCheckedTreeNodeAll($event, 'menu')"
          >全选/全不选</el-checkbox
        >
        <el-checkbox
          v-model="form.menuCheckStrictly"
          @change="handleCheckedTreeConnect($event, 'menu')"
          >父子联动</el-checkbox
        >
        <el-tree
          class="tree-border"
          :data="menuOptions"
          show-checkbox
          ref="menu"
          node-key="id"
          :check-strictly="!form.menuCheckStrictly"
          empty-text="加载中，请稍后"
          :props="defaultProps"
        ></el-tree>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="open = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getRole, addRole, updateRole } from "@/api/system/role";
import {
  treeselect as menuTreeselect,
  roleMenuTreeselect,
} from "@/api/system/menu";

export default {
  name: "Configuration",
  components: {},
  props: {
    statusOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 菜单列表
      menuOptions: [],
      // 是否显示弹出层（数据权限）
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" },
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    /** 新增按钮操作 */
    add() {
      this.getMenuTreeselect();
      this.reset();
      this.open = true;
    },
    /** 触发编辑功能 */
    edit(record) {
      this.reset();
      const roleMenu = this.getRoleMenuTreeselect(record.roleId);
      getRole(record.roleId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then((res) => {
            let checkedKeys = res.checkedKeys;
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false);
              });
            });
          });
        });
      });
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then((response) => {
        this.menuOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then((response) => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == "menu") {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == "dept") {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "menu") {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == "dept") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == "menu") {
        this.form.menuCheckStrictly = value ? true : false;
      } else if (type == "dept") {
        this.form.deptCheckStrictly = value ? true : false;
      }
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      (this.menuExpand = false),
        (this.menuNodeAll = false),
        (this.deptExpand = true),
        (this.deptNodeAll = false),
        (this.form = {
          roleId: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: "0",
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined,
        });
      this.resetForm("form");
    },
    /** 提交按钮 */
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.menuIds = this.getMenuAllCheckedKeys();
          if (this.form.roleId != undefined) {        
            updateRole(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.$emit("ok");
            });
          } else {
            addRole(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.$emit("ok");
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
