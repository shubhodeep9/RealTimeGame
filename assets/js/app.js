$("#createGame").on("click",function() {
	var $btn = $(this).button('loading');
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
			window.location = '/game/play';
		}
		$btn.button('reset');
	});
});

$(".join-game").on("click",function(){
	var id = $(this).attr('id');
	io.socket.post('/game/join',{'gameid':id},function(data,jwr){
		if(jwr.statusCode==200){
			window.location = '/game/play';
		} else if(jwr.statusCode==403) {
			window.alert("Not allowed");
		} else {
			window.alert("Maximum limit reached");
		}
	})
});

io.socket.on('gameCreated',function(data){
	$("#onlinegames").append("<a href='#' id='"+data.id+"' class='list-group-item join-game'><span class='badge'>"+data.users.length+"</span>"+data.name+"</a>");
});

io.socket.on('gameUpdated',function(data){
	$('#'+data.id).html("<span class='badge'>"+data.users.length+"</span>"+data.name);
});
