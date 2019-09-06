<template>
<div>
<br>
<el-tabs type="border-card">
  <el-tab-pane label="用户修改">
    	<el-table :data="userdata" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="Username" label="用户名" width="200%" sortable>
			</el-table-column>
			<el-table-column prop="Group" label="归属组" width="220%" sortable>
			</el-table-column>
			<el-table-column prop="Role" label="组权限" width="200%" sortable>
			</el-table-column>
			<el-table-column prop="CreateTime" label="创建时间" width="600%" sortable>
			</el-table-column>
			<el-table-column label="操作" width="300%">
				<template scope="scope">
					<el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">修改权限</el-button>
          <el-button type="warning" size="small" @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除用户</el-button>
				</template>
			</el-table-column>
		</el-table>

    <!--修改权限按钮界面-->
    <el-dialog title="修改权限" :visible.sync="dialogModifyFormVisible">
      <el-form>
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="用户名不能为空" style="width:200px;"></el-input>          
        </el-form-item>
        <el-form-item label="权限组" >

          <el-select v-model="rolevalue" placeholder="请选择修改的角色" style="width:200px;">
            <el-option
              v-for="item in rolelist"
              :key="item.Rolename"
              :label="item.Rolename"
              :value="item.Rolename">
            </el-option>
          </el-select>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogModifyCommit">修 改</el-button>
      </div>
    </el-dialog>

    <!--重置密码按钮界面-->
    <el-dialog title="重置密码" :visible.sync="dialogResetFormVisible">
      <el-form>
        <el-form-item label="新密码">
          <el-input type="password" v-model="newpassword" placeholder="新密码" style="width:200px;cursor:pointer"></el-input>          
        </el-form-item>
        <el-form-item label="再次输入新密码" >
          <el-input type="password" v-model="repeat_newpassword" placeholder="再次输入新密码" style="width:200px;cursor:pointer"></el-input>          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogResetFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogResetCommit">修 改</el-button>
      </div>
    </el-dialog>
    
  </el-tab-pane>


  <!-- 新用户添加导航页-->  
  <el-tab-pane label="用户添加">
    <el-form ref="userform" :model="userform" label-width="80px" style="width:400px;">
		  <el-form-item label="用户名称">
			  <el-input v-model="userform.name"></el-input>
		  </el-form-item>

      <el-form-item label="用户密码">
			  <el-input type="password" v-model="userform.password"></el-input>
		  </el-form-item>

		  <el-form-item label="用户权限">
        <el-select v-model="userform.role" placeholder="请选择用户权限" style="width:200px;">
            <el-option
              v-for="item in rolelist"
              :key="item.Rolename"
              :label="item.Rolename"
              :value="item.Rolename">
            </el-option>
        </el-select>
		  </el-form-item>

      <el-form-item>
			  <el-button type="primary" @click="userAdd">创建用户</el-button>
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
      userdata: [],
      loading: false,
      dialogModifyFormVisible: false,
      dialogResetFormVisible: false,
      username: "",
      rolelist: [],
      rolevalue: '',
      userform :{
        name: '',
        password: '',
        role: '',
      },
      newpassword:'',
      repeat_newpassword:'',
      
    }
  },
  methods: {
      // 打开编辑按钮
    	handleEdit: function (index, row) {
        this.dialogModifyFormVisible = true;
        this.username = Object.assign({}, row).Username
      },
      
      handleReset:function (index, row) {
        this.dialogResetFormVisible = true;
        this.username = Object.assign({}, row).Username
      },

      handleDel: function (index,row) {
				this.$confirm('确认删除吗?', '提示', {
				}).then(() => {
          var del_url = '/mgt/api/v1/user/userdel'
          var data = {"username":Object.assign({}, row).Username}
          this.$post(del_url,data,'删除失败，请联系SA进行检查').then((response)=> {
            location.reload();
            })
          }).catch(() => {});
      },

      dialogModifyCommit: function () {
        if (this.rolevalue == '' || this.username == '') {
          this.$message.error("数据不能为空")
        }else {
          console.log(this.username)
          console.log(this.rolevalue)
          var update_url = '/mgt/api/v1/user/roleupdate'
          var data = {"username":this.username,"role":this.rolevalue}
          this.$post(update_url,data,'更新失败，请检查用户名密码是否正确').then((response)=> {
            this.$alert('修改成功').then(() => {
              this.dialogRestFormVisible = false;
              location.reload();
            })                        
          })
        }
      },

      dialogResetCommit: function () {
        var reset_url = '/mgt/api/v1/user/resetpassword'
        var data = {"username":this.username,"password":this.newpassword}
        if (this.newpassword != this.repeat_newpassword) {
          this.$message.error("两次输入密码不一致!请重新输入")
        } else if (this.newpassword == '' || this.repeat_newpassword == '') {
          this.$message.error("新密码不得为空")
        } else {
          this.$post(reset_url,data,'重置密码失败，请联系SA进行检查').then((response)=> {
            console.log(response)
            this.$alert('修改成功').then(() => {
              this.repeat_newpassword = ''
              this.newpassword = ''
              this.dialogResetFormVisible = false;
            })
          })
        }

      },

      userAdd: function() {
        console.log(this.userform)
        var add_url = '/mgt/api/v1/user/useradd'
        var data = {"username":this.userform.name,"password":this.userform.password,"role":this.userform.role}
        this.$post(add_url,data,'添加用户失败，请联系SA进行检查').then((response)=> {
          this.$alert('添加成功').then(() => {
            location.reload();
            })
        })

      },

  },
  mounted() {		
    var url = '/mgt/api/v1/user/userinfo'
    var role_url = '/mgt/api/v1/user/rolelist'
		this.loading = true
    this.$get(url,'执行失败，请检查参数是否正确').then((response)=> {
		  this.loading = false
          this.userdata = response.Msg
    })
    this.$get(role_url,'获取role列表失败').then((response)=> {
      this.rolelist = response.Msg
    // console.log(this.rolelist)
    })
	}
}
</script>

<style scoped>
</style>