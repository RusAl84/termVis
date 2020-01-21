var w = $(window).width() - 50, h = 700;

var labelDistance = 0;

var vis
var rdy = false
var nodes = [];
var labelAnchors = [];
var labelAnchorLinks = [];
var links = [];
var termList = [];
let urlcsv = 'http://localhost:8000/term_out/out.csv';
var i = 0
function parseTerms(_callback){
		d3.csv(urlcsv, function(data) {
			for(var i = 0; i<data.length;i++){
				window.termList[i] = data[i]
				console.log(termList[i])
			};
		console.log(i)
		//build()
		//node.label = data[i].phrase
		//console.log(node.label)
		_callback()
	});
}
function buildFromReady(){
	if(termList.length < 1){
		alert("Готовых данных для построения графа нет. Вставте текст и проанализируйте его.")
		return
	}
	build(termList)
}
function analyse(){
	var data = document.getElementById('textToAnalyse').value
	if (data == ""){
		alert("Текстовое поле пустое")
		return
	}
	//$.post( "cgi-bin/Ajax.py", function( data ) {
		//$( ".result" ).html( data );
	//  });
	//	$('#form').submit(function(event){
		//	console.log(123)
	//		$.post("cgi-bin/ajax.py",{data:$("#textToAnalyse").val()},onResponse);
//			return false;
	//	})
		//function onResponse(data){
		//	console.log(text(data));
	//	}
		
	jQuery.get("cgi-bin/extract_terms_to_csv.py")
	parseTerms(function(){
		build(termList)
		console.log(termList[0])
	})
}
//setTimeout(() => {  build(); }, 1000);
function build(t){

	if(rdy){
		clearGraph()
		rdy = false
	}
w = $(window).width() - 50
vis = d3.select("body").select("#graph").append("svg:svg").attr("width", w).attr("height", h);
rdy = true 
for(var i = 0; i < t.length; i++) {
	var node = {
		label : t[i].phrase,
		};
	nodes.push(node);
	labelAnchors.push({
		node : node
	});
	labelAnchors.push({
		node : node
	});
};

var visLinks = checkMode(t)

for(var i = 0; i < t.length; i++) {
	var m = visLinks[i]
	console.log(m)
	for(var j = 0; j < i; j++) {
		var n = visLinks[j]
		if(m == n)
			links.push({
				source : i,
				target : j,
				weight : 0.05
			});
	}
	labelAnchorLinks.push({
		source : i * 2,
		target : i * 2 + 1,
		weight : 0.1
	});
};

var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).linkDistance(50).charge(-8000).linkStrength(function(x) {
	return x.weight * 10
});


force.start();

var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([w, h]);
force2.start();

var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

var node = vis.selectAll("svg.svg").data(force.nodes()).enter().append("svg:g").attr("class", "node");
	node.append("svg:circle").attr("r",function(d, i) {
		return 5 < t[i].count ? 25 : t[i].count * 7
	}).style("fill", function(d, i) {
		return setColor(t[i].POS,t[i].number)
	}).style("stroke", "#FFF").style("stroke-width", 3);
node.call(force.drag);

var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
	
	anchorNode.append("svg:text").text(function(d, i) {
	return i % 2 == 0 ? "" : d.node.label
}).style("fill", "#555").style("font-family", "Arial").style("font-size", function(d, i) {
	
	return i % 2 == 0 ? 0 : 12 * parseInt(t[(i-1)/2].count)/1.2
});

var updateLink = function() {
	this.attr("x1", function(d) {
		return d.source.x;
	}).attr("y1", function(d) {
		return d.source.y;
	}).attr("x2", function(d) {
		return d.target.x;
	}).attr("y2", function(d) {
		return d.target.y;
	});

}

var updateNode = function() {
	this.attr("transform", function(d) {
		d.x = Math.max(0,d.x)
		d.x = Math.min(w,d.x)

		d.y = Math.max(0,d.y)
		d.y = Math.min(h,d.y)
		
		return "translate(" + d.x + "," + d.y + ")";
	});

}


force.on("tick", function() {

	force2.start();

	node.call(updateNode);

	anchorNode.each(function(d, i) {
		if(i % 2 == 0) {
			d.x = d.node.x;
			d.y = d.node.y;
		} else {
			var b = this.childNodes[1].getBBox();

			var diffX = d.x - d.node.x;
			var diffY = d.y - d.node.y;

			var dist = Math.sqrt(diffX * diffX + diffY * diffY);

			var shiftX = b.width * (diffX - dist) / (dist * 2);
			shiftX = Math.max(-b.width, Math.min(0, shiftX));
			var shiftY = 5;
			this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
		}
	});


	anchorNode.call(updateNode);

	link.call(updateLink);
	anchorLink.call(updateLink);

});
}
function clearGraph(){
	d3.selectAll("svg").remove();
	labelDistance = 0;
	nodes = [];
	labelAnchors = [];
	labelAnchorLinks = [];
	links = [];
}
function handleMouseOver(d, i) {  // Add interactivity

	// Use D3 to select element, change color and size
	d3.select(this).attr({
	  fill: "orange",
	  r: radius * 2
	});

	// Specify where to put label of text
	svg.append("text").attr({
	   id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
		x: function() { return xScale(d.x) - 30; },
		y: function() { return yScale(d.y) - 15; }
	})
	.text(function() {
	  return [d.x, d.y];  // Value of the text
	});
  }

function handleMouseOut(d, i) {
	// Use D3 to select element, change color back to normal
	d3.select(this).attr({
	  fill: "black",
	  r: radius
	});

	// Select text by id and then remove
	d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
  }