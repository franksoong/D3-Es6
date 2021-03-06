export default function(json,dialog,update,svg2Png){
/*    let sundo = new SimpleUndo({maxLength: 10,provider(done){
        let newJson=$.extend(true,{},json);
        done(newJson)
    }});//撤销 重做
    sundo.save();*/

    //删除节点和相关联的边
    d3.select('#J_DelNode').on('click',()=>{
        let dialogTpl=`
                     <table class="op-dialog del-node-dialog">
                         <tr>
                             <td class="td-til" >
                              <span>输入节点名称</span>
                             </td>
                             <td>
                               <input type="text" name="node-name" class="node-name" value="" />
                             </td>
                         </tr>
                     </table>
                    `;
        let d = dialog({
            title: '删除节点和关联的边',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok() {
                let iptNodeName=$.trim($('.del-node-dialog').find('.node-name').val().toLowerCase());
                if(!!iptNodeName){
                    //获取节点索引
                    let nodeIndex=json.nodes.findIndex((item)=>(item.name.toLowerCase()===iptNodeName));
                    if(nodeIndex>-1){
                        //删除节点
                        json.nodes.splice(nodeIndex,1);
                        //删除节点相关联的边
                        for (let i = 0; i < json.links.length; i++) {
                            if (nodeIndex == json.links[i]['source']['index'] || nodeIndex == json.links[i]['target']['index']) {
                                json.links.splice(i, 1);
                                i--;
                            }
                        }
                        update(json)
                    }else{
                        let d = dialog({content: '没有查找到该节点！'}).show();
                        setTimeout(()=>{d.close().remove()}, 2000);
                        return false;
                    }
                }
            },
            cancel(){}
        }).showModal();
    });
    //增加点
    d3.select('#J_AddNode').on('click',()=>{
        let dialogTpl=`
             <table class="op-dialog add-node-dialog">
                 <tr>
                     <td class="td-til" >
                      <span>输入节点名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-name" class="node-name" value="" />
                     </td>
                 </tr>
             </table>
            `;
        let d = dialog({
            title: '添加点',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok() {
                let iptNodeName=$('.add-node-dialog').find('.node-name').val();
                if(!!iptNodeName){
                    if(!(json.nodes.findIndex((item)=>(item.name.toLowerCase()==$.trim(iptNodeName.toLowerCase())))>-1)){
                        json.nodes.push({'name':iptNodeName});
                    /*    sundo.save();*/
                        update(json);
                    }else{
                        let d = dialog({content: '已经有该节点，重复了！'}).show();
                        setTimeout(()=>{d.close().remove()}, 2000);
                        return false;
                    }
                }
            },
            cancel(){}
        }).showModal();
    });
    //添加连接线和关系
    d3.select('#J_AddLR').on('click',()=>{
        let dialogTpl=`
             <table class="op-dialog add-link-dialog">
                 <tr>
                     <td class="td-til" >
                      <span>开始点的名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-source-name" class="node-source-name" value="" />
                     </td>
                 </tr>
                  <tr>
                     <td class="td-til" >
                      <span>结束点的名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-target-name" class="node-target-name" value="" />
                     </td>
                 </tr>
                 <tr>
                     <td class="td-til" >
                      <span>连接线的关系</span>
                     </td>
                     <td>
                       <input type="text" name="linetext-name" class="linetext-name" value="" />
                     </td>
                 </tr>
                 <tr>
                     <td class="td-til" >
                      <span>设置权重</span>
                     </td>
                     <td>
                       <input type="number" name="weight-value" class="weight-value" value="" min="1" max="10" />
                     </td>
                 </tr>
             </table>
            `;

        let d = dialog({
            title: '添加连接线和关系',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok() {
                let addLinkDialog=$('.add-link-dialog');
                let iptNodeSourceName=addLinkDialog.find('.node-source-name').val();
                let iptNodeTargetName=addLinkDialog.find('.node-target-name').val();
                let iptLineTextName=addLinkDialog.find('.linetext-name').val();
                let iptWeightValue=addLinkDialog.find('.weight-value').val();
                let alreadyLinking=json.links.findIndex((item)=>{
                     return item.source.name===iptNodeSourceName&&item.target.name===iptNodeTargetName
                });
                function hasNodes(key){
                    return json.nodes.findIndex((item)=>{
                        return item.name===key
                    })
                }
                if(!!iptNodeSourceName&&!!iptNodeTargetName&&!!iptLineTextName&&!!iptWeightValue){
                    if(alreadyLinking<0&&hasNodes(iptNodeSourceName)>-1&& hasNodes(iptNodeTargetName)>-1){
                        let sourceNode=json.nodes.filter((item)=>{
                            return item.name===iptNodeSourceName
                        })[0];
                        let targetNode=json.nodes.filter((item)=>{
                            return item.name===iptNodeTargetName
                        })[0];
                        json.links.push(
                            {
                                "source":sourceNode,
                                "target":targetNode,
                                "relation":iptLineTextName,
                                "weight":parseInt(iptWeightValue,10)
                            }
                        );
                        update(json)
                    }else{
                        let d = dialog({content: '已经有连线或者没有这些节点!'}).show();
                        setTimeout(()=>{d.close().remove()}, 2000);
                        return false
                    }
                }else{
                    let d = dialog({content: '不能为空!'}).show();
                    setTimeout(()=>{d.close().remove()}, 2000);
                    return false
                }
            },
            cancel(){}
        }).showModal();
    });
    //导出png图片
    d3.select('#J_SvgToPng').on('click',()=>{
        svg2Png.saveSvgAsPng(document.getElementById("svgView"), "svg2Png.png")
    });
    //查找路径关系
    d3.select('#J_FindRelation').on('click',()=>{
        let dialogTpl=`
             <table class="op-dialog find-link-dialog">
                 <tr>
                     <td class="td-til" >
                      <span>节点一名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-source-name" class="node-source-name" value="" />
                     </td>
                 </tr>
                  <tr>
                     <td class="td-til" >
                      <span>节点二名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-target-name" class="node-target-name" value="" />
                     </td>
                 </tr>
             </table>
            `;

        let d = dialog({
            title: '超找两个点之间的多层关系',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok() {
                let findLinkDialog=$('.find-link-dialog');
                let iptNodeSourceName=$.trim(findLinkDialog.find('.node-source-name').val().toLowerCase());
                let iptNodeTargetName=$.trim(findLinkDialog.find('.node-target-name').val().toLowerCase());
                let allLink=d3.selectAll('.link');
                let highlightLinks=[];
                if(!!iptNodeSourceName&&!!iptNodeTargetName){
                    json.links.forEach(function(item){
                        //暂时显示两个节点本身的路径，应该改成多层
                        let sname=item.source.name.toLowerCase();
                        let tname=item.target.name.toLowerCase();
                        if((sname==iptNodeSourceName&&tname==iptNodeTargetName)||(sname==iptNodeTargetName&&tname==iptNodeSourceName)){
                            Array.prototype.push.call(highlightLinks,item.index)
                        }
                    });
                    allLink.classed('highlight',(d)=>(highlightLinks.indexOf(d.index) > -1));
                }
            },
            cancel(){}
        }).showModal();
    });
    //取消查找路径
    d3.select('#J_CancelFind').on('click',()=>{
        let allLink=d3.selectAll('.link');
        allLink.classed('highlight',(d)=>(false));
    });
/*    //撤销
    d3.select('#J_Undo').on('click',()=>{
        sundo.undo(function(serialized){
            update(serialized);
        });
    });
    //重做
    d3.select('#J_Redo').on('click',()=>{
        sundo.redo(function(serialized){
            update(serialized);
        });
    });*/

}
