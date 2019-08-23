<template>
<div>
<br>
<el-tabs type="border-card">
  <el-tab-pane label="权限管理">
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
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

    <!--编辑用户按钮界面-->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="用户名">
          <el-input v-model="editform['Username']" placeholder="用户名不能为空" style="width:200px;"></el-input>          
        </el-form-item>
        <el-form-item label="权限组" >
          <el-select v-model="editform.Role" placeholder="请选择修改的角色" style="width:200px;">
            <el-option label="admin" value="admin"></el-option>
            <el-option label="sa_user" value="sa_user"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCommit">修 改</el-button>
      </div>
    </el-dialog>

  </el-tab-pane>
  <el-tab-pane label="用户添加">配置管理</el-tab-pane>
</el-tabs>
</div>
</template>
<script>
export default {
  data() {
    return {
      userdata: [],
      loading: false,
      dialogFormVisible: false,
      editform: {
          Username: '',
          Role: ''
     },
     user:""
    }
  },
  methods: {
      // 打开编辑按钮
    	handleEdit: function (index, row) {
        var that = this
        this.dialogFormVisible = true;
        that.user=Object.assign({}, row).Username
        that.editForm = Object.assign({}, row);
        console.log(that.editForm)
      },
      handleCommit: function () {
        this.dialogFormVisible = false;
        // console.log(this.editForm.Username)
			}
  },
  mounted() {		
		var url = '/mgt/api/v1/user/userinfo'
		this.loading = true
    this.$get(url,'执行失败，请检查参数是否正确').then((response)=> {
      // console.log(response.Msg)
		  this.loading = false
          this.userdata = response.Msg
    })
	}
}
</script>

<style scoped>
</style>