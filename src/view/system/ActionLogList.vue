<template>
  <section>
      <!-- 查询工具条 -->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filter">
                <el-form-item>
                    <el-input v-model="filter.actor" placeholder="操作员"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filter.action" placeholder="操作"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryLogs">查询</el-button>
                </el-form-item>
			</el-form>
		</el-col>
        <!--列表-->
		<el-table :data="logList" highlight-current-row  v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="actor" label="操作员" width="120">
			</el-table-column>
			<el-table-column prop="action" label="操作" width="120" >
			</el-table-column>
			<el-table-column prop="actionObject" label="操作对象" width="220" >
			</el-table-column>
			<el-table-column prop="action_date" label="时间" width="200" >
			</el-table-column>
			<el-table-column prop="ip_address" label="IP 地址" min-width="200" >
			</el-table-column>
		</el-table>
        <!--分页工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next"  :page-size="size" :total="total" @current-change="handleCurrentChange" style="float:right;">
			</el-pagination>
		</el-col>
  </section>
</template>

<script>
import { queryLogListPage } from "../../config/api";
export default {
  data() {
    return {
      filter: {
        actor: "",
        action: ""
      },
      listLoading: false,
      logList: [],
      total: 0,
      page: 1,
      size: 20
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.queryLogs();
    },
    queryLogs() {
      let param = {
        pageNo: this.page,
        pageSize: this.size,
        filter: this.filter
      };
      this.listLoading = true;
      queryLogListPage(param).then(res => {
        this.total = res.total;
        this.logList = res.rows;
        this.listLoading = false;
      });
    }  
  },
  mounted() {
      this.queryLogs();
    }
};
</script>

<style lang="sass">

</style>

