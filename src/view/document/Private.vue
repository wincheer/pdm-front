<template>
    <section>
        <el-upload
            ref="upload"
            action="http://localhost:8080/upload"
            :on-change="handleChange"
            :before-upload="handelBefore"
            :auto-upload="false"
            :multiple="false"
            :data={fileName:this.docName,fileMD5:this.docMd5}
            :show-file-list="true">
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
      docName: "",
      docMd5: "",
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleChange(file, fileList) {
      var _this = this;

      var spark = new SparkMD5();
      var fileReader = new FileReader();
      fileReader.readAsBinaryString(file.raw);
      //第一次选取后，状态为ready,第二次读写之前是uploading，之后是success
      fileReader.onload = function(e) {
        spark.appendBinary(e.target.result);
        _this.docMd5 = spark.end();
        _this.docName = file.name;
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
    },
    handelBefore(file) {
      var uploadFileList = this.$refs.upload.$data.uploadFiles;
      for (var i = 0; i < uploadFileList.length; i++) {
        var fo = uploadFileList[i];
        if (fo.name == file.name) {
          this.docMd5 = fo.md5;
          this.docName = fo.name;
        //   this.uploadParam = {
        //     fileName: fo.name,
        //     fileMD5: fo.md5
        //   };
          break;
        }
      }
    }
  }
};
</script>

<style lang="sass">

</style>
