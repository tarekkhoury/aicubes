

//
//
//$( document ).ready(function() {
//
//	function init1( mc_id, comp_id, comp_desc, comp_action, comp_value){
//		var socket = io.connect();
//		socket.json.emit('emit_from_client', {
//			mcId: mc_id,
//			compId: comp_id,
//			desc: comp_desc,
//			action: comp_action,
//			value: comp_value
//		}); }
//
//
//	//init1('2','1','','get','-');
//
//	setTimeout((function(){init1('2','1','','get','-');}), 1000);
//	setTimeout((function(){init1('1','1','','get','-');}), 1000);
//	setTimeout((function(){init1('2','2','','get','-');}), 1000);
//	setTimeout((function(){init1('1','2','','get','-');}), 1000);
//	setTimeout((function(){init1('1','3','','get','-');}), 1000);
//    });
//

$(function(){
    var socket = io.connect();
	//var lastCmd = "Stop"; //default




    //sending command to server
	function sendToServer( mc_id, comp_id, comp_desc, comp_action, comp_value){
		socket.json.emit('emit_from_client', {
			mcId: mc_id,
			compId: comp_id,
			desc: comp_desc,
			action: comp_action,
			value: comp_value
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
	//setInterval((function(){sendToServer('2','1','','get','-');}), 5000);
	//setInterval((function(){sendToServer('1','1','','get','-');}), 5500);
	//setInterval((function(){sendToServer('2','2','','get','-');}), 6000);
	//setInterval((function(){sendToServer('1','2','','get','-');}), 6500);
	//setInterval((function(){sendToServer('1','3','','get','-');}), 7000);








	//length data from server
	socket.on('emit_from_server', function(data){
		var obj = jQuery.parseJSON( data );
		//console.log("received from server>> : " + obj.mcId  + " " + obj.compId + " " + obj.desc+ " " + obj.action + "" + obj.value);

		if (obj.mcId == '1'&& obj.compId == '1') {

			$('#mcID_1_1').text(obj.mcId);
			$('#compId_1_1').text(obj.compId);
			$('#compDesc_1_1').text(obj.desc);
			$('#compAction_1_1').text(obj.action);
			$('#compValue_1_1').text(obj.value);
		}

        if (obj.mcId == '1'&& obj.compId == '2') {
			$('#mcID_1_2').text(obj.mcId);
			$('#compId_1_2').text(obj.compId);
			$('#compDesc_1_2').text(obj.desc);
			$('#compAction_1_2').text(obj.action);
			$('#compValue_1_2').text(obj.value);
		}

        if (obj.mcId == '1'&& obj.compId == '3') {
			$('#mcID_1_3').text(obj.mcId);
			$('#compId_1_3').text(obj.compId);
			$('#compDesc_1_3').text(obj.desc);
			$('#compAction_1_3').text(obj.action);
			$('#compValue_1_3').text(obj.value+ ' C');
		}

        if (obj.mcId == '2'&& obj.compId == '1') {
            $('#mcID_2_1').text(obj.mcId);
            $('#compId_2_1').text(obj.compId);
            $('#compDesc_2_1').text(obj.desc);
            $('#compAction_2_1').text(obj.action);
            $('#compValue_2_1').text(obj.value);
        }

        if (obj.mcId == '2'&& obj.compId == '2') {
            $('#mcID_2_2').text(obj.mcId);
            $('#compId_2_2').text(obj.compId);
            $('#compDesc_2_2').text(obj.desc);
            $('#compAction_2_2').text(obj.action);
            $('#compValue_2_2').text(obj.value);
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
		sendToServer('1','1','Door 1','get','-');
		//lastCmd = $('#go').text();
    });

	$('#getLED').click(function(){
		sendToServer('1','2','Lights 1','get','-');
		//lastCmd = $('#go').text();
	});

    $('#getTemp').click(function(){
        sendToServer('1','3','Temperature','get','-');
        //lastCmd = $('#go').text();
    });



	$('#setOnL_1_1').click(function(){
		sendToServer('1','2','Lights 1.1','set','ON');
		//lastCmd = $('#go').text();
	});

	$('#setOffL_1_1').click(function(){
		sendToServer('1','2','Lights 1.1','set','OFF');
		//lastCmd = $('#go').text();
	});

    $('#setOnL_2_1').click(function(){
        sendToServer('2','1','Lights 2.1','set','ON');
        //lastCmd = $('#go').text();
    });

    $('#setOffL_2_1').click(function(){
        sendToServer('2','1','Lights 2.1','set','OFF');
        //lastCmd = $('#go').text();
    });

    $('#setOnL_2_2').click(function(){
        sendToServer('2','2','Lights 2.2','set','ON');
        //lastCmd = $('#go').text();
    });
	$('#setOffL_2_2').click(function(){
		sendToServer('2','2','Lights 2.2','set','OFF');
		//lastCmd = $('#go').text();
	});

    $('#testButton').click(function(){
		sendToServerText(jQuery.parseJSON($('#testBox').val()));
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
		//	console.log("slider val : " + ui.value);
    //    	$('#slideValue').val(ui.value);
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
