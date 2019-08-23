<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="el-icon-s-fold"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
                <el-menu default-active="1-4-1" class="el-menu-vertical-demo"  :collapse="collapsed">
                <template v-for="(item,index) in meuns" v-if="!item.hidden">
                    <!-- 一级菜单的情况 -->
                    <template v-if="item.children&&item.children.length===1">
                        <router-link :to="item.path+'/'+item.children[0].path">
                        <!--index跟浏览器地址对应，这样菜单才能显示选中状态  -->
                        <el-menu-item :index="item.path+'/'+item.children[0].path">
                        <template slot="title">
                        <!-- 设置icon -->
                        <i v-if="item.children[0].meta.icon" :class="item.children[0].meta.icon"></i>
                            <!-- 菜单名称 -->
                            {{item.children[0].meta.title}}
                        </template>
                        </el-menu-item>
                        </router-link>
                    </template>
                    <!-- 一级菜单的情况 end-->
                    <!-- 多级菜单 -->
                    <template v-else>
                    <el-submenu :index="item.path">
                    <template slot="title">
                    <i :class="item.meta.icon"></i>
                    {{item.meta.title}}
                    </template>
                    <!-- 遍历子菜单 -->
                    <template v-for="(itemChild,indexChild) in item.children"  v-if="!itemChild.hidden">
                        <!-- 当发现存在3级或大于3级菜单时,重新遍历当前组件 -->
                        <template v-if="itemChild.children&&itemChild.children.length>0">
                            <side-meuns :routes="[itemChild]" class="nest-menu"></side-meuns>
                        </template>
                    <!-- 2级菜单时-->
                    <template v-else>
                    <router-link :to="item.path+'/'+itemChild.path">
                    <el-menu-item :index="item.path+'/'+itemChild.path">
                    <i v-if="itemChild.meta.icon" :class="itemChild.meta.icon"></i>
                    {{itemChild.meta.title}}</el-menu-item>
                    </router-link>
                    </template>
                    </template>
                    <!-- 遍历子菜单 end-->
                    </el-submenu>
                    </template>
                    <!-- 多级菜单 end-->
                </template>
                </el-menu>

			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				sysName:'壹钱包',
				collapsed:false,
				sysUserName: 'Unknown',
                sysUserAvatar: '',
                meuns : [],
			}
		},
		methods: {
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
				}).then(() => {
                    window.localStorage.clear(),
                    window.localStorage.setItem("role", 'unload')
                    // 跳转到登录页的时候顺便刷新
                    window.location.href = window.location.origin + window.location.pathname
				}).catch(() => {});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
        mounted() {
            this.sysUserName = window.localStorage.getItem("username")
            var menulist=[].concat(this.$store.state.allroutes);  
            this.meuns = menulist
        }
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
                }
                .el-menu-vertical-demo:not(.el-menu--collapse) {
                    transition: width .28s;
                    width: 180px;
                    height: 100%;
                    min-height: 400px;
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 1001;
                }
			}
		}
	}
</style>