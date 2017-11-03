<template>
    <el-upload
            ref="upload"
            action="http://localhost:8080/upload"
            :on-change="handleChange"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :auto-upload = 'false'
            :multiple="true"
            :data="form">
        <el-button slot="trigger" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
    </el-upload>
</template>
<script>
import SparkMD5 from "spark-md5";
export default {
  data() {
    return {
      fileList: [],
      form: {
        fname: "",
        md5: ""
      }
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    beforeAvatarUpload(file) {
      //this.form.fname = file.name;
      var uploadFileList = this.$refs.upload.$data.uploadFiles;
      for (var i = 0; i < uploadFileList.length; i++) {
        var fo = uploadFileList[i];
        if (fo.name == file.name) {
          this.form.fname = fo.name;
          this.form.md5 = fo.md5;
          break;
        }
      }
    },
    handleChange(file, fileList) {
      for (var j = 0; j < fileList.length; j++) {
        var _fo = fileList[j];
        if (_fo.status == "ready") {
          var _this = this;
          var spark = new SparkMD5();
          var fileReader = new FileReader();
          fileReader.readAsBinaryString(file.raw);
          fileReader.onload = function(e) {
            spark.appendBinary(e.target.result);
            var md5 = spark.end();
            for (var i = 0; i < fileList.length; i++) {
              var fo = fileList[i];
              if (fo.name == file.name) {
                if (typeof fo.md5 == "undefined") {
                  _this.$set(fo, "md5", md5);
                } else {
                  fo.md5 = md5;
                }
                break;
              }
            }
          };
        }
      }
    }
  }
};
</script>
<style scope>

</style>