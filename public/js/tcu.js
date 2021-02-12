$(document).ready(start());

var socket;
var id = 0;

function makeOtherMessageBox( message )
{
	var $newrow = $('<tr/>', {'class':'message-row', 'id':id});
	var $usermessage = $('<td/>', {'class':'user-message', 'id':id, 'contenteditable':'true'});
	var $othermessage = $('<td/>', {'class':'other-message', 'id':id });
	$othermessage.text(message);
	$newrow.append($usermessage);
	$newrow.append($othermessage);
	return $newrow;
}

function addOtherMessageBox(messageText)
{
	id++;
	$newbox = makeOtherMessageBox(messageText);
	$("tbody").append($newbox);
}

function addOtherMessage( id, msg )
{
	msgBox = $("#"+id+".other-message")[0];
	if( msgBox == undefined )
		msgBox = addOtherMessageBox(msg);
	else
		msgBox.innerHTML = msg;
}

function makeEditableMessageBox()
{
	id++;
	var $newrow = $('<tr/>', {'class':'message-row', 'id':id});
	var $usermessage = $('<td/>', {'class':'user-message', 'id':id, 'contenteditable':'true'});
	var $othermessage = $('<td/>', {'class':'other-message', 'id':id });
	$newrow.append($usermessage);
	$newrow.append($othermessage);
	return $newrow
}

function addEditableMessageBox(currentMessageBox)
{
	$newBox = makeEditableMessageBox();
	$("table").append($newBox);
	$newBox.children(".user-message")[0].focus();
}

function start()
{
	socket = io();

	socket.on('chat message', function(msg) {
		if( !msg.startsWith(socket.id) )
			msgText = msg.substring(27);
			msgId = msg.match(/\[(.*?)\]/)[1];
			addOtherMessage(msgId, msgText);
	});

	// ENTER and BACKSPACE
	$(document).keydown( function(e)
	{
		var focus = $(":focus");
		if( e.which == 13 ) // ENTER
		{
			e.preventDefault();
			// send the message or send an already sent message that has changed
			last = $($("table tr:last").children(".user-message")[0]);
			var message = focus[0].innerText
      socket.emit('chat message', socket.id+" ["+focus.attr("id")+"] : "+message);
			if( last.is(focus) )
				addEditableMessageBox(focus);
			else
				focus.parent().next().children(".user-message")[0].focus();
		}
		else if( e.which == 8 ) // BACKSPACE
		{
			console.log("BACKSPACE");
		}
		else if( e.which == 38 ) // UP
    {
			focus.parent().prev().children(".user-message")[0].focus();
    }
		else if( e.which == 40 ) // DOWN
		{
			focus.parent().next().children(".user-message")[0].focus();
		}
	});
}
