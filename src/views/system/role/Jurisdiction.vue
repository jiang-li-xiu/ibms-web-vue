<template>
    <el-dialog
      :title="title"
      :visible.sync="openDataScope"
      width="500px"
      append-to-body
    >
      <el-form
        :model="form"
        label-width="80px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox
            v-model="deptExpand"
            @change="handleCheckedTreeExpand($event, 'dept')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
            >全选/全不选</el-checkbox
          >
          <el-checkbox
            v-model="form.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')"
            >父子联动</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
</template>
<script>
import { getRole, dataScope } from "@/api/system/role";
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect,
} from "@/api/system/dept";
export default {
   name: 'Jurisdiction',
   components: {},
   props: {},
   data() {
      return {
        // 弹出层标题
        title: "",
        // 部门列表
        deptOptions: [],
        // 是否显示弹出层（数据权限）
        openDataScope: false,
        menuExpand: false,
        menuNodeAll: false,
        deptExpand: true,
        deptNodeAll: false,
        // 数据范围选项
        dataScopeOptions: [
          {
            value: "1",
            label: "全部数据权限",
          },
          {
            value: "2",
            label: "自定数据权限",
          },
          {
            value: "3",
            label: "本部门数据权限",
          },
          {
            value: "4",
            label: "本部门及以下数据权限",
          },
          {
            value: "5",
            label: "仅本人数据权限",
          },
        ],
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label",
        },
      }
   },
   created(){
     
   },
   methods:{
      /** 查询菜单树结构 */
      getMenuTreeselect() {
        menuTreeselect().then((response) => {
          this.menuOptions = response.data;
        });
      },
      /** 查询部门树结构 */
      getDeptTreeselect() {
        deptTreeselect().then((response) => {
          this.deptOptions = response.data;
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
      // 所有部门节点数据
      getDeptAllCheckedKeys() {
        // 目前被选中的部门节点
        let checkedKeys = this.$refs.dept.getCheckedKeys();
        // 半选中的部门节点
        let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
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
      /** 根据角色ID查询部门树结构 */
      getRoleDeptTreeselect(roleId) {
        return roleDeptTreeselect(roleId).then((response) => {
          this.deptOptions = response.depts;
          return response;
        });
      },
      // 取消按钮（数据权限）
      cancelDataScope() {
        this.openDataScope = false;
        this.reset();
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
      //  树权限（展开/折叠）
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
      /** 选择角色权限范围触发 */
      dataScopeSelectChange(value) {
        if (value !== "2") {
          this.$refs.dept.setCheckedKeys([]);
        }
      },
      /** 分配数据权限操作 */
    allocation(row) {
        this.reset();
        const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId);
        getRole(row.roleId).then((response) => {
          this.form = response.data;
          this.openDataScope = true;
          this.$nextTick(() => {
            roleDeptTreeselect.then((res) => {
              this.$refs.dept.setCheckedKeys(res.checkedKeys);
            });
          });
        });
      },
      /** 提交按钮（数据权限） */
      submitDataScope () {
        if (this.form.roleId != undefined) {
          this.form.deptIds = this.getDeptAllCheckedKeys();
          dataScope(this.form).then((response) => {
            this.msgSuccess("修改成功");
            this.openDataScope = false;
            this.$emit("ok");
          });
        }
      },
   },
}
</script>
<style lang="scss" scoped>

</style>
