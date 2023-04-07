<template>
  <div>
    <el-card>
      <div>
        <el-descriptions title="联动信息" :column="2">
          <el-descriptions-item label="联动id">
            {{ info.linkId }}
          </el-descriptions-item>
          <el-descriptions-item label="联动名称">
            {{ info.linkName }}
          </el-descriptions-item>
          <el-descriptions-item label="触发方式">
            <el-tag size="small">
              {{
                info.triggerMode == 1
                  ? "手动触发"
                  : info.triggerMode == 2
                  ? "定时触发"
                  : info.triggerMode == 3
                  ? "设备触发"
                  : "未知"
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            {{ info.status == 0 ? "已启用" : "已停用" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <div>
      <el-table :data="linkRecordList">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="联动记录id" align="center" prop="id" />
        <el-table-column label="联动名称" align="center" prop="linkName" />
        <el-table-column
          label="联动触发类型"
          align="center"
          prop="triggerMode"
          :formatter="triggerModeFormat"
        />
        <el-table-column
          label="联动触发时间"
          align="center"
          prop="triggerTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.triggerTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联动查看状态"
          align="center"
          prop="checkStatus"
          width="180"
        >
          <template slot-scope="scope">
            <span>
              <el-tag v-if="scope.row.checkStatus == 0" type="warning"
                >未查看</el-tag
              >
              <el-tag v-else type="success">已查看</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['subsystem:linkRecord:edit']"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['subsystem:linkRecord:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 添加或修改联动记录对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      @close="closeCheck"
      width="50%"
      append-to-body
    >
      <linkage-detail-dialog :data="dialogData"></linkage-detail-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" type="primary"> 返 回 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LinkageDetailDialog from "@/views/linkage/linkage-record/LinkageDetailDialog.vue";
import {
  getLinkRecordList,
  getLinkRecordDatail,
  delLinkRecord,
  addLinkRecord,
  updateLinkRecord,
} from "@/api/linkage/linkRecord";

export default {
  components: {
    LinkageDetailDialog,
  },
  data() {
    return {
      title: "",
      total: 0,
      info: {},
      dialogData: {},
      // 是否显示弹出层
      open: false,
      // 联动触发类型字典
      triggerModeOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        linkId: null,
      },
      linkRecordList: [],
    };
  },
  created() {
    // query通过this.$route.query接收参数
    this.queryParams.linkId = this.info.actionId;
    if (this.$route.params.linkId) {
      console.log(this.$route.params);
      localStorage.setItem("info", JSON.stringify(this.$route.params));
    }
    this.info = JSON.parse(localStorage.getItem("info"));
    console.log(localStorage.getItem("info"));
    this.getDicts("link_trigger_condition").then((response) => {
      this.triggerModeOptions = response.data;
    });
    // console.log("query:", this.info);
    this.getList();
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 联动触发类型字典翻译
    triggerModeFormat(row, column) {
      return this.selectDictLabel(this.triggerModeOptions, row.triggerMode);
    },
    /** 查询联动记录列表 */
    getList() {
      console.log(this.queryParams);
      this.queryParams.linkId = JSON.parse(
        localStorage.getItem("info")
      ).actionId;
      getLinkRecordList(this.queryParams).then((response) => {
        this.linkRecordList = response.data.records;
        this.total = response.data.total;
      });
    },
    closeCheck() {
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除联动记录编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delLinkRecord(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids;
      getLinkRecordDatail(id).then((response) => {
        this.form = response.data;
        this.dialogData = response.data;
        this.open = true;
        this.title = "联动触发详情";
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
