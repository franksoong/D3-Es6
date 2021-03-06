import icon from '../../../images/mobile.png';
export default function(json,vis){
    let _node=vis.selectAll('g.node');
    _node=_node.data(json.nodes,(d)=>(d.id));
    _node.exit().remove();
    _node=_node.enter().append("svg:g").attr("class", "node").merge(_node);
    _node.selectAll('image').remove();
    _node.selectAll('text').remove();
    _node.append("svg:image")
        .attr("class", "circle")
        .attr("xlink:href", icon)
        .attr("x", "-15px")
        .attr("y", "-15px")
        .attr("width", "30px")
        .attr("height", "30px");
    _node.append("svg:text")
        .attr("class", "nodetext")
        .attr("dy", "30px")
        .attr('text-anchor','middle')
        .text(function(d) { return d.name });
    return _node
}

