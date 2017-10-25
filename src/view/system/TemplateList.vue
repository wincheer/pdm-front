<template>
    <section>
        <!--项目模板-->
        <el-col :span='24' class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filter">
                <el-form-item>
                    <el-select v-model="filter.templateId" v-loading="listLoading">
                        <el-option v-for="item in templateList" :key="item.templateId" :label="item.templateName" :value="item.templateId" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="plus"></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="edit"></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" icon="delete"></el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--项目目录与文件(?)-->
        <el-col>
            <el-tree 
                :data="templateFolds" 
                :props="defaultProps" 
                node-key="id" 
                ref="tree" 
                default-expand-all 
                :render-content="renderContent">
            </el-tree>
        </el-col>
    </section>
</template>

<script>
import { queryTemplistList } from "../../config/api";
export default {
  data() {
    return {
      filter: {
        templateId: null
      },
      listLoading: true,
      templateList: [],
      templateFolds: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    queryTemplates: function() {
      queryTemplistList().then(res => {
        this.templateList = res.data;
        this.listLoading = false;
        this.filter.templateId = this.templateList[0];
      });
    }
  },
  mounted() {
    this.queryTemplates();
  }
};
</script>

<style scoped>

</style>
