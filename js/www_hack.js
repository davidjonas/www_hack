www_hack = {};
www_hack.domain = 'wwwHack';
www_hack.key = 'demo';
www_hack.mouse = new Array();
www_hack.users = new Array();
www_hack.cleanTime = 30000;
JSBroadcast.configure({'domain': www_hack.domain});
JSBroadcast.registerReceiver(www_hack.key);

www_hack.update = function ()
{
	if(www_hack.mouse.length > 0)
	{
		JSBroadcast.sendMessage(www_hack.key, $.toJSON(www_hack.mouse));
	}
	var messages = JSBroadcast.get(www_hack.key);
	var posArray;
	var element;
	
	if (messages !== null)
	{
		for(var msg in messages)
		{
			element = $('#'+messages[msg].usr);
			posArray = $.parseJSON(messages[msg].msg);
			
			if(element.length > 0)
			{
				element.css({'top': posArray[posArray.length - 1][1], 'left': posArray[posArray.length - 1][0]});
			}
			else
			{
				$('body').append('<div id="' + messages[msg].usr + '" class="www_hack_arrow '+ www_hack.getBrowser() +'">'+ '</div>');
			}
			www_hack.users[messages[msg].usr] = new Date().getTime();
		}
	}
	delete www_hack.mouse;
	www_hack.mouse = new Array();
};

www_hack.clean = function ()
{		
	for(var user in www_hack.users)
	{
		if(new Date().getTime() >= www_hack.users[user] + www_hack.cleanTime)
		{
			$('#'+user).remove();
			delete www_hack.users[user]
		}
	}
};

JSBroadcast.registerFunction("update", www_hack.update);
JSBroadcast.registerFunction("clean", www_hack.clean);

www_hack.getBrowser = function ()
{
	return navigator.platform;
}

www_hack.regMove = function (evt)
{
	www_hack.mouse.push([mouseX(evt), mouseY(evt)]);
}

function mouseX(evt) {
	if (evt.pageX) return evt.pageX;
	else if (evt.clientX)
	return evt.clientX + (document.documentElement.scrollLeft ?
		document.documentElement.scrollLeft :
		document.body.scrollLeft);
	else return null;
}

function mouseY(evt) {
	if (evt.pageY) return evt.pageY;
	else if (evt.clientY)
	return evt.clientY + (document.documentElement.scrollTop ?
		document.documentElement.scrollTop :
		document.body.scrollTop);
	else return null;
}

$(document).mousemove(www_hack.regMove);

JSBroadcast.run(100);