<template>
    <section>
        <!--查询工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filter">
                <el-form-item>
                    <el-input v-model="filter.displayName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filter.loginName" placeholder="登录账号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryEmployees">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
			</el-form>
		</el-col>
        <!--数据列表-->
        <el-table :data="employeeList" highlight-current-row  v-loading="listLoading" border style="width: 100%;">
			<el-table-column prop="displayName" label="用户名" width="280">
			</el-table-column>
			<el-table-column prop="loginName" label="登录账号" width="280" >
			</el-table-column>
            <el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
        <!--分页工具条-->
        <el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next"  :page-size="size" :total="total" @current-change="handleCurrentChange" style="float:right;">
			</el-pagination>
		</el-col>
        <!--新增/编辑界面-->
		<el-dialog :title="editFormTitle" v-model="editFormVisible" :close-on-click-modal="false" size="tiny">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名：">
					<el-input v-model="editForm.displayName" style="width:90%"></el-input>
				</el-form-item>
				<el-form-item label="登录账号：">
					<el-input v-model="editForm.loginName" style="width:90%"></el-input>
				</el-form-item>
				<el-form-item label="登录密码：">
					<el-input v-model="editForm.loginPassword" style="width:90%"></el-input>
				</el-form-item>
				<el-form-item label="角色：">
					<el-select v-model="editForm.roleId" placeholder="请选择">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                        </el-option>
                    </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
    </section>
</template>

<script>
import { queryEmployeeListPage, removeUser } from "../../config/api";
export default {
  data() {
    return {
      //查询数据
      filter: {
        loginName: "",
        displayName: ""
      },
      //列表数据
      listLoading: false,
      employeeList: [],
      total: 0,
      page: 1,
      size: 20,
      //编辑界面数据
      editFormVisible: false, //界面是否显示
      editFormTitle: "",
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      editForm: {
        displayName: "",
        loginName: "",
        loginPassword: "",
        roleId: ""
      },
      roleList: [
        {
          roleId: "1",
          roleName: "系统管理员"
        },
        {
          roleId: "2",
          roleName: "项目管理员"
        },
        {
          roleId: "3",
          roleName: "项目成员"
        },
        {
          roleId: "4",
          roleName: "普通用户"
        }
      ]
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.queryEmployees();
    },
    queryEmployees() {
      let param = {
        pageNo: this.page,
        pageSize: this.size,
        filter: this.filter
      };
      this.listLoading = true;
      queryEmployeeListPage(param).then(res => {
        this.total = res.total;
        this.employeeList = res.rows;
        this.listLoading = false;
      });
    },
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { employeeId: row.employeeId };
          removeUser(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.queryEmployees();
          });
        })
        .catch(() => {});
    },
    handleAdd: function() {
      this.editFormVisible = true;
      this.editFormTitle = "新增",
      this.editForm = {
        displayName: "",
        loginName: "",
        loginPassword: "",
        roleId: ""
      };
    },
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editFormTitle = "编辑",
      this.editForm = Object.assign({}, row);
    },
    mounted() {
      this.queryEmployees();
    }
  }
};
</script>

<style lang="sass">

</style>
