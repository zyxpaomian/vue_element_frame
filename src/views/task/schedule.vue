<template>
  <div class="menus-tree">
  <br>
    <el-table ref="menusTable" :row-style="showRow" :data="menusTable" v-bind="$attrs">
      <el-table-column
        prop="Jobtype"
        label="任务类别">
        <template slot-scope="scope">
          <!--span :class="['level'+scope.row.level]"-->
          <span :class="['level'+scope.row.Level]">
          <i v-if="scope.row.Children" @click="openToggle(scope.row)"
             :class="[scope.row.open?'el-icon-arrow-down':'el-icon-arrow-right']"></i>
            </span>
          {{scope.row.Jobtype}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Exectime"
        label="执行频率(秒 分 时 日 月 星期)">
        <template slot-scope="scope">
          {{scope.row.Exectime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Job_url"
        label="任务URL">
        <template slot-scope="scope">
          {{scope.row.Job_url}}
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.Level == 1" type="success" size="small" @click="handleAdd(scope.$index, scope.row)">增加</el-button>
          <el-button v-if="scope.row.Level != 1" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.Level != 1" type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>          
        </template>
      </el-table-column>
    </el-table>

    <!--修改权计划任务界面-->
    <el-dialog title="计划任务修改" :visible.sync="dialogModifyFormVisible">
      <el-form>
        <el-form-item label="任务名称">
          <el-input v-model="newjobname" placeholder="任务名称不能为空" style="width:200px;"></el-input>          
        </el-form-item>

        <el-form-item label="调用接口">
          <el-input v-model="joburl" placeholder="接口默认使用GET无参数" style="width:200px;"></el-input>          
        </el-form-item>
        <span>执行周期:</span>
        <br>
        <el-col :span="2">
        <el-form-item label="秒 " >
          <el-input v-model="jobinterval_sec" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="分 " >
          <el-input v-model="jobinterval_min" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="时 " >
          <el-input v-model="jobinterval_hou" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="日 " >
          <el-input v-model="jobinterval_day" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="月 " >
          <el-input v-model="jobinterval_mon" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="周 " >
          <el-input v-model="jobinterval_week" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogModifyCommit">修 改</el-button>
      </div>
    </el-dialog>


    <!--添加子计划任务界面-->
    <el-dialog title="新任务添加" :visible.sync="dialogAddFormVisible">
      <el-form>
        <el-form-item label="任务名称">
          <el-input v-model="new_jobname" placeholder="任务名称不能为空" style="width:200px;"></el-input>          
        </el-form-item>

        <el-form-item label="调用接口">
          <el-input v-model="new_joburl" placeholder="接口默认使用GET无参数" style="width:200px;"></el-input>          
        </el-form-item>

        <el-form-item label="父任务类别">
          <el-input v-model="parentname" placeholder="父任务类别" style="width:200px;" :disabled="true" ></el-input>          
        </el-form-item>


  
        <span>执行周期:</span>
        <br>
        <el-col :span="2">
        <el-form-item label="秒 " >
          <el-input v-model="jobinterval_sec" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="分 " >
          <el-input v-model="jobinterval_min" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="时 " >
          <el-input v-model="jobinterval_hou" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="日 " >
          <el-input v-model="jobinterval_day" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="月 " >
          <el-input v-model="jobinterval_mon" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="2">
        <el-form-item label="周 " >
          <el-input v-model="jobinterval_week" style="width:60px;" maxlength="4"></el-input>
        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddCommit">添 加</el-button>
      </div>
    </el-dialog>


    

  </div>
</template>

<script>

  export default {
    data() {
      return {
        // 菜单树结构数据
        // menusTree: [],
        menusTree: [],
        // 菜单表格结构数据
        menusTable: [],
        dialogModifyFormVisible : false,
        dialogAddFormVisible: false,
        parentlist: '',
        jobname: '',
        newjobname: '',
        joburl: '',
        jobinterval: '',
        jobinterval_sec: '',
        jobinterval_min: '',
        jobinterval_hou: '',
        jobinterval_day: '',
        jobinterval_mon: '',
        jobinterval_week: '',
        new_jobname: '',
        new_joburl: '',
        parentname: '',

      }
    },
    // 初始化函数，赋值，menusTree =>menusTable
    created() {
      this.menusTable = this.menusTree;
      var crontab_url = '/mgt/api/v1/crontab/getjoblist'
    // var role_url = '/mgt/api/v1/user/rolelist'
		  this.loading = true
      this.$get(crontab_url,'获取计划任务列表失败').then((response)=> {
        this.loading = false
        this.menusTree = response.Msg
        }).then(() => {
          this.menusTable = this.menusTree
          })
      var getparent_url = 'mgt/api/v1/crontab/getparentlist'
      this.$get(crontab_url,'获取父任务列表失败').then((response)=> {
        this.parentlist = response.Msg
        //console.log(response.Msg)
      })


    },
    methods: {
      showRow: function (row) {
        const show = row.row.parent
        // console.log("consolerow ",show)
          ? row.row.parent._expanded && row.row.parent._show
          : true;
        row.row._show = show;
        return show
          ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
          : "display:none;";
      },

      // 树节点开关操作
      openToggle: function (item) {
        // 这里只是展开和关闭样式的变换方法
        this.$set(item, 'open', !item.open);
        // 展开的时候，显示子节点，关闭的时候隐藏子节点
        // 遍历所有的子节点，加入到menuTable中
        for (let j = 0; j < this.menusTable.length; j++) {
          // 找到父节点的id，然后依次把子节点放到数组里面父节点后面
          if (this.menusTable[j].Id !== item.Id) {
            continue;
          }
          if (item.open) { // open => close
            let menusTable = this.menusTable;
            item.Children.forEach(function (child, index) {
              menusTable.splice(j + index + 1, 0, child); // 添加子节点
            })
          } else {
            this.menusTable.splice(j + 1, item.Children.length); // 删除子节点
          }
          break;
        }
      },

      handleAdd: function (index,row) {
        this.dialogAddFormVisible = true;
        console.log(Object.assign({}, row))
        this.parentname = Object.assign({}, row).Jobtype
      },

      handleEdit: function (index, row) {
        this.dialogModifyFormVisible = true;
        this.jobname = Object.assign({}, row).Jobtype
        this.joburl = Object.assign({}, row).Job_url
        // this.jobinterval = Object.assign({}, row).Exectime
        this.newjobname = this.jobname
        //console.log(Object.assign({}, row))
        //this.username = Object.assign({}, row).Username
      },

      handleDel: function (index,row) {
				this.$confirm('确认删除吗?', '提示', {
				}).then(() => {
          // this.jobname = Object.assign({}, row).Jobtype
          var del_url = '/mgt/api/v1/crontab/delchildjob'
          var data = {"Jobtype":Object.assign({}, row).Jobtype}
          this.$post(del_url,data,'删除失败，请联系SA进行检查').then((response)=> {
            location.reload();
            })
          }).catch(() => {});
      },

      dialogModifyCommit: function () {
        if (this.newjobname == '' || this.joburl == '' || this.jobinterval_sec == '' || this.jobinterval_min == '' || this.jobinterval_hou == '' || this.jobinterval_day == '' || this.jobinterval_mon == '' || this.jobinterval_week == '') {
          this.$message.error("数据不能为空")
        }else {
          //console.log(this.username)
          //console.log(this.rolevalue)
          this.jobinterval = this.jobinterval_sec + ' ' + this.jobinterval_min + ' ' + this.jobinterval_hou + ' ' + this.jobinterval_day + ' ' + this.jobinterval_mon + ' ' + this.jobinterval_week
          console.log(this.jobinterval)
          var update_url = '/mgt/api/v1/crontab/updatechildjob'
          var data = {"Job_url":this.joburl,"Jobtype":this.jobname,"Newjobtype":this.newjobname,"Exec_time":this.jobinterval}
          // var data = {"username":this.username,"role":this.rolevalue}
          this.$post(update_url,data,'更新失败，请检查参数是否正确').then((response)=> {
            console.log(response)
            if (response.Status == 'Failed') {
              this.$message.error("更新失败，请检查参数是否正确")
            } else {
              this.$alert('修改成功').then(() => {
                this.dialogModifyVisible = false;
                location.reload();
              })                        
          }
          })
        }
      },
      dialogAddCommit: function () {
        if (this.new_jobname == '' || this.new_joburl == '') {
          this.$message.error("数据不能为空")
        }else {
          //console.log(this.username)
          //console.log(this.rolevalue)
          this.jobinterval = this.jobinterval_sec + ' ' + this.jobinterval_min + ' ' + this.jobinterval_hou + ' ' + this.jobinterval_day + ' ' + this.jobinterval_mon + ' ' + this.jobinterval_week
          console.log(this.jobinterval)
          var update_url = '/mgt/api/v1/crontab/addchildjob'
          // var data = {"Job_url", childjobtype, parentjobtype, exec_time}
          var data = {"Job_url":this.new_joburl,"Childjobtype":this.new_jobname,"Parentjobtype":this.parentname,"Exec_time":this.jobinterval}
          // var data = {"username":this.username,"role":this.rolevalue}
          this.$post(update_url,data,'添加失败，请检查参数是否正确').then((response)=> {
            console.log(response)
            if (response.Status == 'Failed') {
              this.$message.error("添加失败，请检查参数是否正确")
            } else {
              this.$alert('添加成功').then(() => {
                this.dialogAddFormVisible = false;
                location.reload();
              })                        
          }
          })
        }
      },
    },
    mounted () {


    }
  }
</script>

<style scoped>
  .level1, .level2, .level3 {
    display: inline-block;
    width: 20px;
  }

  .level1 {
    margin-left: 5px;

  }

  .level2 {
    margin-left: 20px;
  }

  .level3 {
    margin-left: 35px;
  }
</style>