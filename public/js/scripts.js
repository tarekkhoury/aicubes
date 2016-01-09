
$(function(){
    var socket = io.connect();
	//var lastCmd = "Stop"; //default




    //sending command to server
	function sendToServer( mc_id, comp_id, comp_desc, comp_action, comp_value){
		socket.json.emit('emit_from_client', {
			//m: mc_id,
			//compId: comp_id,
			//desc: comp_desc,
			//action: comp_action,
			//value: comp_value

			m: mc_id,
			c: comp_id,
			d: comp_desc,
			a: comp_action,
			v: comp_value
		});

		//console.log("Sent from client>> : mc_id: "  + mc_id+" ,comp_id: "+comp_id + ",desc: " + comp_desc+ ",action: " + comp_action+   " ,comp_value:"+ comp_value);
	}


	//sending command to server
	function sendToServerText(text1){
		//		var socket = io.connect();

		socket.json.emit('emit_from_client',
			text1
		);

		//console.log("Sent from client>> : mc_id: "  + mc_id+" ,comp_id: "+comp_id + ",desc: " + comp_desc+ ",action: " + comp_action+   " ,comp_value:"+ comp_value);
	}


    //
	//setInterval((function(){sendToServer('2','1','','GET','');}), 5000);
	//setInterval((function(){sendToServer('1','1','','GET','');}), 5500);
	//setInterval((function(){sendToServer('2','2','','GET','');}), 6000);
	//setInterval((function(){sendToServer('1','2','','GET','');}), 6500);
	//setInterval((function(){sendToServer('1','3','','GET','');}), 7000);








	//length data from server
	socket.on('emit_from_server', function(data){
		var obj = jQuery.parseJSON( data );
		//console.log("received from server>> : " + obj.m  + " " + obj.c + " " + obj.d+ " " + obj.a + "" + obj.v);

		if (obj.m == '1'&& obj.c == '1') {

			$('#mcID_1_1').text(obj.m);
			$('#compId_1_1').text(obj.c);
			$('#compDesc_1_1').text(obj.d);
			$('#compAction_1_1').text(obj.a);
			$('#compValue_1_1').text(obj.v);
		}

        if (obj.m == '1'&& obj.c == '2') {
			$('#mcID_1_2').text(obj.m);
			$('#compId_1_2').text(obj.c);
			$('#compDesc_1_2').text(obj.d);
			$('#compAction_1_2').text(obj.a);
			$('#compValue_1_2').text(obj.v);
		}

        if (obj.m == '1'&& obj.c == '3') {
			$('#mcID_1_3').text(obj.m);
			$('#compId_1_3').text(obj.c);
			$('#compDesc_1_3').text(obj.d);
			$('#compAction_1_3').text(obj.a);
			$('#compValue_1_3').text(obj.v+ ' C');
		}

        if (obj.m == '2'&& obj.c == '1') {
            $('#mcID_2_1').text(obj.m);
            $('#compId_2_1').text(obj.c);
            $('#compDesc_2_1').text(obj.d);
            $('#compAction_2_1').text(obj.a);
            $('#compValue_2_1').text(obj.v);
        }

        if (obj.m == '2'&& obj.c == '2') {
            $('#mcID_2_2').text(obj.m);
            $('#compId_2_2').text(obj.c);
            $('#compDesc_2_2').text(obj.d);
            $('#compAction_2_2').text(obj.a);
            $('#compValue_2_2').text(obj.v);
        }


		/////

		if (obj.m == '1'&& obj.c == '4') {
			$('#mcID_1_4').text(obj.m);
			$('#compId_1_4').text(obj.c);
			$('#compDesc_1_4').text(obj.d);
			$('#compAction_1_4').text(obj.a);
			$('#compValue_1_4').text(obj.v+ ' %');
		}

		if (obj.m == '1'&& obj.c == '5') {
			$('#mcID_1_5').text(obj.m);
			$('#compId_1_5').text(obj.c);
			$('#compDesc_1_5').text(obj.d);
			$('#compAction_1_5').text(obj.a);
			$('#compValue_1_5').text(obj.v + ' Pa');
		}


		if (obj.m == '1'&& obj.c == '6') {
			$('#mcID_1_6').text(obj.m);
			$('#compId_1_6').text(obj.c);
			$('#compDesc_1_6').text(obj.d);
			$('#compAction_1_6').text(obj.a);
			$('#compValue_1_6').text(obj.v+ ' m');
		}



		if (obj.m == '3'&& obj.c == '1') {
			$('#mcID_3_1').text(obj.m);
			$('#compId_3_1').text(obj.c);
			$('#compDesc_3_1').text(obj.d);
			$('#compAction_3_1').text(obj.a);
			$('#compValue_3_1').text(obj.v);
		}

		if (obj.m == '3'&& obj.c == '2') {
			$('#mcID_3_2').text(obj.m);
			$('#compId_3_2').text(obj.c);
			$('#compDesc_3_2').text(obj.d);
			$('#compAction_3_2').text(obj.a);
			$('#compValue_3_2').text(obj.v);
		}

		if (obj.m == '1'&& obj.c == '7') {
			$('#mcID_1_7').text(obj.m);
			$('#compId_1_7').text(obj.c);
			$('#compDesc_1_7').text(obj.d);
			$('#compAction_1_7').text(obj.a);
			$('#compValue_1_7').text(obj.v);
		}





	});

	////power data from server ;
	//socket.on('emit_from_server_pw', function(data){
	//	console.log("from_server power : " + data);
	//	var power = JSON.parse(data).power;
	//	$("#slider").slider("value",power)
     //   //$('#defaultSlider').val(power);
     //   $('#slideValue').val(power);
	//});

    $('#getDoor').click(function(){
		sendToServer('1','1','Door','GET','');
		//lastCmd = $('#go').text();
    });

	$('#getLED').click(function(){
		sendToServer('1','2','Light','GET','');
		//lastCmd = $('#go').text();
	});

    $('#getTemp').click(function(){
        sendToServer('1','3','Temperature','GET','');
        //lastCmd = $('#go').text();
    });



	$('#setOnL_1_1').click(function(){
		sendToServer('1','2','Light','SET','ON');
		//lastCmd = $('#go').text();
	});

	$('#setOffL_1_1').click(function(){
		sendToServer('1','2','Light','SET','OFF');
		//lastCmd = $('#go').text();
	});

    $('#setOnL_2_1').click(function(){
        sendToServer('2','1','Light','SET','ON');
        //lastCmd = $('#go').text();
    });

    $('#setOffL_2_1').click(function(){
        sendToServer('2','1','Light','SET','OFF');
        //lastCmd = $('#go').text();
    });

    $('#setOnL_2_2').click(function(){
        sendToServer('2','2','Light','SET','ON');
        //lastCmd = $('#go').text();
    });
	$('#setOffL_2_2').click(function(){
		sendToServer('2','2','Light','SET','OFF');
		//lastCmd = $('#go').text();
	});

	$('#setOnL_3_2').click(function(){
		sendToServer('3','2','Light','SET','ON');
		//lastCmd = $('#go').text();
	});
	$('#setOffL_3_2').click(function(){
		sendToServer('3','2','Light','SET','OFF');
		//lastCmd = $('#go').text();
	});



    $('#testButton').click(function(){
		sendToServerText(jQuery.parseJSON($('#testBox').val()));
    });

	$('#testall').click(function(){
		sendToServer('','','','TESTALL','');
	});

	$('#broadcast').click(function(){
		sendToServer('','','','BROADCAST','');
	});

	$('#discoComponents').click(function(){
		//sendToServer('1','','','DISCO_COMPS','');
		sendToServer('2','','','DISCO_COMPS','');
		//sendToServer('3','','','DISCO_COMPS','');
	});

	$('#discoDevices').click(function(){
		sendToServer('','','','DISCO_DEVICES','');

	});


    //$('#blink').click(function(){
		//sendToServer($('#blink').text(), $('#slideValue').val());
		//lastCmd = $('#blink').text();
    //});
    //$('#right').click(function(){
		//sendToServer($('#right').text(), $('#slideValue').val());
		//lastCmd = $('#right').text();
    //});
    //$('#back').click(function(){
		//sendToServer($('#back').text(), $('#slideValue').val());
		//lastCmd = $('#back').text();
    //});
    //$('#stop').click(function(){
		//sendToServer($('#stop').text(), $('#slideValue').val());
		//lastCmd = $('#stop').text();
    //});

    //
    ////slider
    //$("#slider").slider({
		//range: "max",
		//min: 0,
		//max: 244,
		//value: 150,
    //
		////default
		//create: function( event, ui ) {
    //    	$('#slideValue').val(150);
		//	console.log("create val : " + 150);
		//},
		////change slider
		//slide: function( event, ui ) {
		//	console.log("slider val : " + ui.v);
    //    	$('#slideValue').val(ui.v);
		//	socket.emit('emit_from_client_pw', {power : ui.value});
		//},
		////slider change done
		//stop: function( event, ui ) {
		//	console.log("stop val : " + ui.value);
		//	sendToServer(lastCmd, $('#slideValue').val());
		//}
    //});
    //
    ////change input field
    //$('#slideValue').change( function () {
		//$("#slider").slider("value",this.value)
		//socket.emit('emit_from_client_pw', {power : this.value});
    //});

/***
	//change slider
    $('#defaultSlider').change(function(){
        $('#slideValue').val(this.value);
		socket.emit('emit_from_client_pw', {power : this.value});
    });
***/

});

function clickButton(go){
    //var val = document.getElementById("slideValue").value;
    //console.log(go + ": power:" + val);
}
