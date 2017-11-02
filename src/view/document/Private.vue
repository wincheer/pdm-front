<template>
    <section>
        <el-upload
            ref="upload"
            action="http://localhost:8080/upload"
            :on-change="handleChange2"
            :auto-upload="false"
            :data="{
                fileName: this.docName,
                fileMD5: this.docMd5
            }">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
    </section>
    
</template>

<script>
import SparkMD5 from "spark-md5";

export default {
  data() {
    return {
      docName: '',
      docMd5: ''
    };
  },
  methods: {
    submitUpload() {
      this.$message(this.docMd5);
      this.$refs.upload.submit();
    },
    handleChange(file, fileList) {
      var _this = this;
      var spark = new SparkMD5.ArrayBuffer();
      this.docName = file.name;
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file.raw);
      fileReader.onload = function(e) {
        spark.append(e.target.result);
        _this.docMd5 = spark.end();
      };
    },
    handleChange2(file, fileList) {
      var _this = this;
      var spark = new SparkMD5();
      var fileReader = new FileReader();
      fileReader.readAsBinaryString(file.raw);
      fileReader.onload = function(e) {
        spark.appendBinary(e.target.result);
        _this.docMd5 = spark.end();
        _this.docName = file.name;
      };
    }
  }
};
</script>

<style lang="sass">

</style>
