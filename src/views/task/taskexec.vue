<template>
<div>
<br>
<el-tabs type="border-card">

  <!--同步任务快速执行-->
  <el-tab-pane label="实步任务">
    <el-form ref="form" :model="taskfrom" label-width="80px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="同步任务">
			<el-select v-model="taskfrom.taskname" placeholder="请选择需要执行的任务">
        <el-option
          v-for="item in synctasklist"
          :key="item.Taskname"
          :label="item.Taskname"
          :value="item.Taskname">
        </el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="操作IP列表">
			<el-input type="textarea" v-model="taskfrom.taskip"></el-input>
		</el-form-item>

		<el-form-item>
			<el-button type="primary" @click="ExecCommit">执 行</el-button>
		</el-form-item>

	  </el-form>

    <br>
    <el-divider></el-divider>
    <br>

    <!--同步任务结果展示-->

    <el-table :data="taskData" v-loading="loading" style="width: 100%">
    <el-table-column label="任务名称" width="300">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.taskname }}</span>
      </template>
    </el-table-column>

    <el-table-column label="IP地址" width="300">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.taskip }}</span>
      </template>
    </el-table-column>

    <el-table-column label="输出" width="500">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.taskoutput }}</span>
      </template>
    </el-table-column>

    <el-table-column label="执行结果" width="400">
      <template slot-scope="scope">
         <font v-if="scope.row.state === 'failed'" color="red">失 败</font>
         <font v-else color="green">成 功</font>
      </template>
    </el-table-column>
  </el-table>
  </el-tab-pane>

  <!--异步执行-->
  <el-tab-pane label="异步任务">
    <el-form ref="form" :model="rsynctaskfrom" label-width="80px" style="margin:20px;width:60%;min-width:600px;">
		  <el-form-item label="异步任务">
			  <el-select v-model="rsynctaskfrom.taskname" placeholder="请选择需要执行的任务">
          <el-option
            v-for="item in rsynctasklist"
            :key="item.Taskname"
            :label="item.Taskname"
            :value="item.Taskname">
        </el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="操作IP列表">
			<el-input type="textarea" v-model="rsynctaskfrom.taskip"></el-input>
		</el-form-item>

		<el-form-item>
			<el-button type="primary" @click="RsyncCommit">执 行</el-button>
		</el-form-item>
	  </el-form>

    <br>
    <el-divider></el-divider>
    <br>


    <!--异步任务结果展示-->
    <el-table :data="RsynctempList" stripe v-loading="loading" style="width: 100%">
    <el-table-column label="任务名称" width="200">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.Taskname }}</span>
      </template>
    </el-table-column>

    <el-table-column label="任务ID" width="330">
      <template slot-scope="scope">

        <span v-if="scope.row.Execstate === 'finish'" style="margin-left: 10px" @click="rsyncdialogshow">{{ scope.row.Celeryid }}</span>
        <span v-else-if="scope.row.Execstate === 'processing'" style="margin-left: 10px">{{ scope.row.Celeryid }}</span>
        <span v-else style="margin-left: 10px">{{ scope.row.Celeryid }}</span>

      </template>
    </el-table-column>

    <el-table-column label="操作用户" width="200">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.Execuser }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作时间" width="300">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.Exectime }}</span>
      </template>
    </el-table-column>

    <el-table-column label="执行状态" width="400">
      <template slot-scope="scope">
        <font v-if="scope.row.Execstate === 'finished'" color="green">成 功</font>
        <el-progress v-else-if="scope.row.Execstate === 'processing'" :percentage="50"></el-progress>
        <font v-else-if="scope.row.Execstate === 'failed'" color="red">失 败</font>
        <font v-else-if="scope.row.Execstate === 'timeout'" color="red">超 时</font>
      </template>
    </el-table-column>
  </el-table> 
  <br>
  <div>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange" 
    :current-page="currentPage"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="rsynctaskData.length">
  </el-pagination>
  </div>
    
  </el-tab-pane>

  <!--新任务配置-->
  <el-tab-pane label="任务配置">
    <el-form :model="configtaskfrom" label-width="80px" style="width:400px;">
		  <el-form-item label="任务名称">
			  <el-input v-model="configtaskfrom.taskname"></el-input>
		  </el-form-item>

      <el-form-item label="调用URL">
			  <el-input v-model="configtaskfrom.taskurl"></el-input>
		  </el-form-item>

      <el-form-item label="调用参数">
			  <el-input v-model="configtaskfrom.taskargs" placeholder="参数不包括'iplist'固定参数" ></el-input>
		  </el-form-item>

		  <el-form-item label="任务类型">
        <el-select v-model="configtaskfrom.tasktype" placeholder="请选择任务类型" style="width:200px;">
            <el-option
              v-for="item in tasktypelist"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
		  </el-form-item>

      <el-form-item>
			  <el-button type="primary" @click="Taskadd">提交任务</el-button>
		  </el-form-item>
	  </el-form>

  </el-tab-pane>
</el-tabs>
</div>
</template>
<script>
	export default {
		data() {
			return {
        timer: '',
        currentPage: 1,
　　　　 pageSize: 10,
        RsynctempList: [],
        tasktypelist: [
        {
            value: 'sync',
            label: '同步任务',
        },
        {
            value: 'rsync',
            label: '异步任务',
        },
        ],
        loading: false,
        rsynctaskfrom: {
					taskname: '',
          taskip: '',
          taskargs: '',
          taskurl: '',
        },
				taskfrom: {
					taskname: '',
          taskip: '',
          taskargs: '',
          taskurl: '',
        },
        taskData: [],
        rsynctaskData: [],
        synctasklist: [],
        rsynctasklist: [],
        configtaskfrom: {
					taskname: '',
          taskurl: '',
          taskargs: '',
          tasktype: '',
        },
			}
    },
		methods: {
			ExecCommit() {
        if (this.taskfrom.taskname == '' || this.taskfrom.taskip == '' || this.taskfrom.taskargs == ''){
          this.$message.error("数据不能为空")
        } else {
          this.loading = true
          var tmpargs = JSON.parse(this.taskfrom.taskargs)
          tmpargs["iplist"] = this.taskfrom.taskip
          this.taskfrom.taskargs = JSON.stringify(tmpargs)
          var data = this.taskfrom.taskargs
          this.$post(this.taskfrom.taskurl,data,'执行失败，请检查接口是否可用').then((response)=> {
            var tmpdata = []
            for(var f = 0,faillen=response.message.failed.length; f < faillen; f++) {
              var tmpdict = {'taskname':this.taskfrom.taskname,'taskip':response.message.failed[f]['host'],'taskoutput':response.message.failed[f]['msg'],'state':'failed'}
              tmpdata.push(tmpdict)
            }
            for(var u = 0,unreachlen=response.message.unreachable.length; u < unreachlen; u++) {
              var tmpdict = {'taskname':this.taskfrom.taskname,'taskip':response.message.unreachable[u]['host'],'taskoutput':response.message.unreachable[u]['msg'],'state':'failed'}
              tmpdata.push(tmpdict)
            }
            for(var s = 0,successlen=response.message.success.length; s < successlen; s++) {
              var tmpdict = {'taskname':this.taskfrom.taskname,'taskip':response.message.success[s]['host'],'taskoutput':response.message.success[s]['msg'],'state':'success'}
              tmpdata.push(tmpdict)
            }
            this.loading = false
            this.taskData = tmpdata
          })
        }
      },
      RsyncCommit() {
        if (this.rsynctaskfrom.taskname == '' || this.rsynctaskfrom.taskip == '' || this.rsynctaskfrom.taskargs == ''){
          this.$message.error("数据不能为空")
        } else {
          this.loading = true
          var tmpargs = JSON.parse(this.rsynctaskfrom.taskargs)
          tmpargs["iplist"] = this.rsynctaskfrom.taskip
          this.rsynctaskfrom.taskargs = JSON.stringify(tmpargs)
          var data = this.rsynctaskfrom.taskargs
          this.$post(this.rsynctaskfrom.taskurl,data,'执行失败，请检查接口是否可用').then((response)=> {
            var tmpdict = {'taskname':this.rsynctaskfrom.taskname,'celeryid':response.message.resultid,'execuser': window.localStorage.getItem("username"),'execstate':'processing','exectype':'rsync'}
            var record_url = 'mgt/api/v1/task/addtaskrecord'
            this.$post(record_url,tmpdict,'添加纪录失败，请检查接口是否可用').then((response)=> {
              this.loading = false
              location.reload();
            })
          })
        }
      },
      Taskadd() { 
        if (this.configtaskfrom.taskname == '' || this.configtaskfrom.taskurl == '' || this.configtaskfrom.taskargs == '' || this.configtaskfrom.tasktype == ''){
          this.$message.error("数据不能为空")
      } else {
        var add_url = '/mgt/api/v1/task/addtask'
        var data = {"Taskname":this.configtaskfrom.taskname,"Taskurl":this.configtaskfrom.taskurl,"Taskargs":this.configtaskfrom.taskargs,"Taskmod":this.configtaskfrom.tasktype}
        this.$post(add_url,data,'添加失败，请检查接口是否可用').then((response)=> {
          this.$alert('添加成功').then(() => {
            location.reload();
            })
          })
        }
      },
      handleSizeChange(size){
        this.pageSize = size;
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.currentChangePage(this.rsynctaskData,currentPage)
      },
      currentChangePage(list,currentPage) { 
        let from = (currentPage - 1) * this.pageSize;
        let to = currentPage * this.pageSize;
        this.RsynctempList = [];
        for (; from < to; from++) {
          if (list[from]) {
            this.RsynctempList.push(list[from]);
            }
        }
      },
      Getsynctask() { 
        var sync_url = '/mgt/api/v1/task/getsynctask'
        this.$get(sync_url,{},'获取任务列表失败，请检查参数是否正确').then((response)=> {
          this.synctasklist = response.Msg
        })
      },
      Getrsynctask() { 
        var rsync_url = '/mgt/api/v1/task/getrsynctask'
        this.$get(rsync_url,{},'获取任务列表失败，请检查参数是否正确').then((response)=> {
          this.rsynctasklist = response.Msg
        })
      },
      Getrsyncrecords() { 
        var rsyncrecords_url = '/mgt/api/v1/task/getrsynctaskrecords'
        this.$get(rsyncrecords_url,{},'获取异步操作纪录列表失败，请检查参数是否正确').then((response)=> {
          this.rsynctaskData = response.Msg
          this.RsynctempList = this.rsynctaskData.slice(0,this.pageSize)
        })
      }
    },
    watch: { 
     taskfrom:{//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
            for(var j = 0,len=this.synctasklist.length; j < len; j++) {
              if (this.taskfrom.taskname == this.synctasklist[j].Taskname) {
                this.taskfrom.taskurl = this.synctasklist[j].Taskurl
                this.taskfrom.taskargs = "{" + this.synctasklist[j].Taskargs + "}"
                
              }
            }
         },
         deep:true
     },
     rsynctaskfrom:{//深度监听，可监听到对象、数组的变化
         handler(val, oldVal){
            for(var j = 0,len=this.rsynctasklist.length; j < len; j++) {
              if (this.rsynctaskfrom.taskname == this.rsynctasklist[j].Taskname) {
                this.rsynctaskfrom.taskurl = this.rsynctasklist[j].Taskurl
                this.rsynctaskfrom.taskargs = "{" + this.rsynctasklist[j].Taskargs + "}"
                
              }
            }
         },
         deep:true
     }   
    },
    mounted() {		
      this.Getsynctask()
      this.Getrsynctask()
      this.Getrsyncrecords()
      // 内部计时器，每间10s更新一次任务
      this.timer = setInterval(this.Getrsyncrecords, 10000);
	  },
	}


</script>

<style scoped>
</style>