/* =============================================================================
 #         Desc: 首页交互
 #      Creator: Choey
 #   LastChange: 2018-3-23 18:45:52
 ============================================================================= */
require(['../rConfig/rConfig'], function() {
    require(['lib/vue/vue'], function (Vue) {
        var main = {
            init:function(){
                var vm = new Vue({
                    el:'#pb_content',
                    data:{
                        dataList:[],
                        flag:0,
                        index:0,
                        ipMessage:''
                    },
                    methods:{
                        //点击“增加”按钮
                        addResource:function(index){
                            var me = this;
                            this.flag = 1;
                            this.index = index;
                        },
                        //弹窗  保存
                        add:function(){
                            var me = this,
                                data = me.ipMessage,
                                list = [];
                            if(data == ''){
                                alert("请输入内容");
                                return;
                            }
                            if(data.indexOf(',')){
                                list = data.split(',');
                                console.log(list);
                            }else{
                                list.push(data);
                            }

                            var index = me.index,
                                dataList = me.dataList;
                            for(var i = 0; i < list.length; i++){
                                dataList[index].resources.push(list[i]);
                            }
                            me.ipMessage = '';
                            me.flag = 0;
                        },
                        //关闭弹窗
                        close:function(){
                            var me = this;
                            me.ipMessage = '';
                            me.flag = 0;
                        },
                        //删除
                        deleteRes:function(index, cIndex){
                            var me = this, tempList = [];
                            var list = me.dataList[index].resources;
                            for(var i = 0; i < list.length; i++){
                                if(i != cIndex){
                                    tempList.push(list[i]);
                                }else{
                                    tempList.push(null);
                                }
                            }
                            //先删除所有元素
                            list.splice(0, list.length);
                            for(var j = 0 ; j < tempList.length; j++){
                                if(tempList[j] != null){
                                    list.push(tempList[j]);
                                }
                            }
                        }
                    },
                    ready:function(){
                        var me = this;
                        //调用后台接口，查询出展示列表的数据，现造数来模拟ajax发送请求从后台取出数据
                        me.dataList=[
                            {index:0, website:'bjstdmngbgr02.thoughtworks.com', type:'idle', ip:'190.168.1.2', route:'/var/lib/cruise-agent', resources:['ubuntu', 'firefox3', 'core-duo']},
                            {index:1, website:'bjstdmngbgr03.thoughtworks.com', type:'building', ip:'190.168.1.3', route:'/var/lib/cruise-agent', resources:['ubuntu', 'firefox3', 'mysql', 'core-duo']},
                            {index:2, website:'bjstdmngbgr04.thoughtworks.com', type:'building', ip:'190.168.1.4', route:'/var/lib/cruise-agent', resources:['ubuntu', 'firefox3', 'mysql', 'core-duo']},
                            {index:3, website:'bjstdmngbgr05.thoughtworks.com', type:'idle', ip:'190.168.1.5', route:'/var/lib/cruise-agent', resources:['ubuntu']}
                        ]
                    }
                });
            }
        };
        main.init();
    });
});

