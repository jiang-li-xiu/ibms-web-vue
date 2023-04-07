/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-02-17 11:51:31
 * @LastEditors: JLX
 * @LastEditTime: 2022-08-05 10:29:09
 */
import { checkSpecialKey } from "@/utils/index";

export const TableListMixin = {
    data() {
        return {
            // 查询参数
            queryParams: {},
            // table遮罩层
            loading: false,
            // table数据源
            tableList: [],
            // 数据总数
            total: 0,
            // table选中keys
            selectedRowKeys: [],
            // table选中的row
            selection: [],
            // 控制展示检索功能
            showSearch: true,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 不执行混入的mounted
            disableMixinMounted: false
        }
    },
    mounted() {
        if (!this.disableMixinMounted) {
            /** 获取表格数据列表 */
            this.getList();
        }
    },
    methods: {
        /** 获取表格数据列表 */
        getList() {
            this.loading = true;
            this.interface.getTableList(this.queryParams).then((response) => {
                this.tableList = response.rows || response.data.list || response.data.records
                this.total = response.total || response.data.total;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        /** 重置检索 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 检索搜索 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 特殊字符正则验证规则 */
        validateQueryFormRules(rule, value, callback) {
            if (!checkSpecialKey(value)) {
                callback(new Error("不能含有特殊字符！！"));
            } else {
                callback();
            }
        },
        /** 表格多选获取id */
        handleSelectionChange(selection) {
            console.log(selection);
            this.selection = selection
            this.selectedRowKeys = selection.map((item) => item[this.rowKey]);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 删除按钮操作 */
        handleDelete(id) {
            const ids = id || this.selectedRowKeys;
            let that = this
            that.$confirm(
                    '是否确认删除此数据项?',
                    "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                .then(function() {
                    return that.interface.delList(ids);
                })
                .then(() => {
                    that.msgSuccess("删除成功");
                    that.modalFormOk();
                })
                .catch(() => {});
        },
        /** 新增 */
        handleAdd() {
            this.$refs.modelForm.add();
            this.$refs.modelForm.title = "新增";
            this.$refs.modelForm.disableSubmit = false;
        },
        /** 修改 */
        handleEdit(record) {
            this.$refs.modelForm.title = '修改'
            this.$refs.modelForm.edit(record)
            this.$refs.modelForm.disableSubmit = false;
        },
        /** 详情 */
        handleDetail(record) {
            this.$refs.modelForm.edit(record);
            this.$refs.modelForm.title = "详情";
            this.$refs.modelForm.disableSubmit = true;
        },
        /**  清空列表选择*/
        onClearSelected() {
            this.selectedRowKeys = [];
        },
        /** 子组件传值：新增/修改 成功时，重载列表*/
        modalFormOk() {
            // 新增/修改 成功时，重载列表
            this.getList();
            //清空列表选中
            this.onClearSelected()
        },
    }
}