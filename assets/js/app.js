$("#createGame").on("click",function() {
	var allowed = [];
	$(".allowed-user").each(function(){
		if($(this).val()!=''){
			allowed.push($(this).val());
		}
	});
	var game = {
		name: $("#name").val(),
		allowed: allowed
	};
	io.socket.post('/game/create',{'Game':game},function(data, jwr){
		if(jwr.statusCode==200){
			console.log("Game created");
		}
	});
});

$("#")

io.socket.on('gameCreated',function(data){
	$("#onlinegames").append("<a href='"+data.id+"' class='list-group-item join-game'><span class='badge'>"+data.users.length+"</span>"+data.name+"</a>");
});
