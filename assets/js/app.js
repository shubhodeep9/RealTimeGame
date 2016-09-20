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

function joingame(id){
	console.log('hey');
	io.socket.post('/game/join',{'gameid':id},function(data,jwr){
		if(jwr.statusCode==200){
			window.location = '/game/play';
		} else if(jwr.statusCode==403) {
			window.alert("Not allowed");
		} else {
			window.alert("Maximum limit reached");
		}
	})
}

io.socket.on('gameCreated',function(data){
	$("#onlinegames").append("<a href='#' onclick='joingame(\""+data.id+"\")' class='list-group-item join-game'><span class='badge'>"+data.users.length+"</span>"+data.name+"</a>");
});

io.socket.on('gameUpdated',function(data){
	if(data.users.length==0){
		$('#'+data.id).hide();
	} else {
		$('#'+data.id).html("<span class='badge'>"+data.users.length+"</span>"+data.name);
	}
});

io.socket.on('connect',function(){
	//Request to establish personal game updates
   	io.socket.get('/game/subscribe');

   	//Waiting for updates
   	io.socket.on('gamePlayers',function(data){
   		htmlContent = "";
   		for(var i=0;i<data.length; i++){
   			htmlContent += "<li href='#'' class='list-group-item'>"+data[i].username+"</li>";
   		}
   		$("#onlineplayers").html(htmlContent);
   		if(data.length==1){
   			htmlContent2 = "<h1>Waiting</h1><p>Only 1 player available</p>";
   			$(".jumbotron").html(htmlContent2);
   		} else {
   			htmlContent2 = "<h1>You may play now!</h1><button class='btn btn-lg btn-primary btn-block' onclick='playGame(1)' type='button'>Play</button>";
   			$(".jumbotron").html(htmlContent2);
   		}
   	});

   	io.socket.on('gamePlay',function(data){
   		htmlContent = "";
   		console.log(data);
   		if(data.playing == 'YES'){
   			htmlContent = "<h1>Playing</h1><button class='btn btn-lg btn-primary btn-block' onclick='playGame(0)' type='button'>Stop</button>";
   			$(".jumbotron").html(htmlContent);
   		} else {
   			htmlContent = "<h1>You may play now!</h1><button class='btn btn-lg btn-primary btn-block' onclick='playGame(1)' type='button'>Play</button>";
   			$(".jumbotron").html(htmlContent);
   		}
   	});
});

function playGame(status){
	console.log(status);
	status = status==0?'NO':'YES';
	io.socket.get('/game/activate',{playing:status});
}


$("#leaveGame").click(function(){
	io.socket.post('/game/leave',function(data,jwr){
		console.log(jwr.statusCode);
		if(jwr.statusCode==200){
			window.location.href = '/';
		}
	});
});


