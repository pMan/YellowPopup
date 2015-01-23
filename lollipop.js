function Popup() {
	
	lollipop = null;;
	
	minHeight = 300, minWidth = 400;
	isDragging = false, isResizing = false, xInit =0, yInit = 0;
	width = height = xI =0, yI = 0;
	
	// global config object
	globalConfig = {
		'title'	: "Lollipop!",
		'close'	: "X",
		'top'	: "100",
		'left'	: "180",
		'href'	: "http://www.karmicbee.com"
	};
	
	popupDiv	= document.createElement("div");
	headerDiv	= popupDiv.cloneNode(false);
	closeDiv	= popupDiv.cloneNode(false);
	iframe		= document.createElement("iframe");
	title		= document.createElement("span");
	resizeDiv	= popupDiv.cloneNode(false);
	
	closeTd = document.createElement("td");
	titleTd = document.createElement("td");
	tr = document.createElement("tr");
	table = document.createElement("table");
	
	title.className = "lolli_title";
	closeDiv.className = "lolli_close";
	closeTd.style.width = "20px";
	headerDiv.className = "lolli_header";
	
	iframe.className = "lolli_iframe";
	iframe.id =  "lolli_iframe";
	
	return this;
};

Popup.prototype = {
	
	// for IE and others
	addEvent: function(elem, evnt, func) {
		elem.addEventListener ? elem.addEventListener(evnt,func,false) : elem.attachEvent("on"+evnt, func);
	},
	
	// auto resizes the popup
	resizePopup: function() {
		headerHeight = headerDiv.offsetHeight + 20;
		popupHeight = popupDiv.offsetHeight;
		iframe.style.height = popupHeight - headerHeight;
	},
	
	// setup the header of the popup
	setupHeader: function() {
		// set popup header properties
		headerDiv.innerHTML = "";
		
		// set title properties
		title.innerHTML = globalConfig['title'];
		titleTd.appendChild(title);
		this.addEvent(titleTd, "mousedown", this.dragMouseDownListener);
		
		// set close button properties
		closeDiv.innerHTML = globalConfig['close'];
		closeTd.appendChild(closeDiv);
		this.addEvent(closeTd, "click", this.closeListener);
		
		tr.appendChild(titleTd);
		tr.appendChild(closeTd);
		
		table.style.width = "100%";
		table.appendChild(tr);
		
		headerDiv.appendChild(table);
	},
	
	// click handler for close button
	closeListener: function(e) {
		popupDiv.parentNode.removeChild(popupDiv);
	},
	
	// mousedown handler
	dragMouseDownListener: function(e) {
		xInit	= e.clientX;
		yInit	= e.clientY;
		moverDiv = popupDiv.cloneNode(false);
		moverDiv.innerHTML = "";
		moverDiv.className = "lolli_popup";
		moverDiv.style.opacity = "0.5";
		
		document.body.appendChild(moverDiv);
		
		isDragging = true;
	},
	
	// mousemove handler
	dragMouseMoveListener: function(e) {
		// check for click + drag
		if (! isDragging) return false;
		
		globalConfig['top'] = parseInt(moverDiv.style.top); // to remove "px"
		globalConfig['left'] = parseInt(moverDiv.style.left);
		
		// reset coords position
		moverDiv.style.top	= globalConfig['top'] + e.clientY - yInit;
		moverDiv.style.left	= globalConfig['left'] + e.clientX - xInit;
		
		// set new initial positions
		xInit	= e.clientX;
		yInit	= e.clientY;
	},
	
	// mouseup even handler
	dragMouseUpListener: function(e) {
		isDragging = false;
		popupDiv.style.top = moverDiv.style.top;
		popupDiv.style.left = moverDiv.style.left;
		
		if (moverDiv.parentNode !== null)
		moverDiv.parentNode.removeChild(moverDiv);
	},
	
	resizeMouseDownListener: function(e) {
		document.body.className = "noselect";
		moverDiv = popupDiv.cloneNode(false);
		moverDiv.innerHTML = "";
		moverDiv.className = "lolli_popup";
		moverDiv.style.opacity = "0.5";
		
		workaround = popupDiv.cloneNode(false);
		workaround.innerHTML = "";
		workaround.style.opacity = "0.0";
		
		document.body.appendChild(moverDiv);
		document.body.appendChild(workaround);
		
		isResizing = true;
	},
	
	resizeMouseMoveListener: function(e) {
		if (! isResizing) return false;
		
		// set new initial positions
		xI	= e.clientX - parseInt(globalConfig["left"]) ;
		yI	= e.clientY - parseInt(globalConfig["top"]) ;
		
		// reset coords position
		moverDiv.style.height	= yI + "px";
		moverDiv.style.width	= xI + "px";
	},
	
	// mouseup even handler
	resizeMouseUpListener: function(e) {
		if (! isResizing) return false;
		document.body.className = "";
		isResizing = false;

		popupDiv.style.width = moverDiv.style.width;
		popupDiv.style.height = moverDiv.style.height;
		
		resizePopup();
		
		if (moverDiv.parentNode !== null)
		moverDiv.parentNode.removeChild(moverDiv);
		
		if (workaround !== undefined && workaround.parentNode !== null)
		workaround.parentNode.removeChild(workaround);
	},
	
	init: function(config) {
		
		for (var prop in config) {
			globalConfig[prop] = config[prop];
		}
		
		// set popup properties	
		popupDiv.className = "lolli_popup bxshd";
		popupDiv.style.top = globalConfig['top'] + "px";
		popupDiv.style.left = globalConfig['left'] + "px";
		document.body.appendChild(popupDiv);
		
		// set the popup header section - title and 'close' button
		this.setupHeader();
		popupDiv.appendChild(headerDiv);
		
		// iframe to load data
		popupDiv.appendChild(iframe);
		
		// set 'loading...' in the popup (if possible) and then set url
		if ('object' == typeof document.getElementById('lolli_iframe').contentWindow.document) { // non-IE browsers
			document.getElementById('lolli_iframe').contentWindow.document.write("<html><body><div style='width:100%; "+
				"color: gray; text-align: center; line-height: 100%;'><i style='padding-top: 100px;"+
				"display: block;'>loading...</i></div></body></html>");
		} else { // IE
			try {
				iframe.contentDocument.write("<html><body><div style='width:100%; "+
					"color: gray; text-align: center; line-height: 100%;'><i style='padding-top: 100px;"+
					"display: block;'>loading...</i></div></body></html>");
			} catch (e) {
				// this is to fix IE's 'Access denied' on iframe. Just move on.
			}
		}
		iframe.setAttribute("src", globalConfig['href']);
		this.resizePopup();
		
		resizeDiv.className = "lolli_drag";
		
		this.addEvent(resizeDiv, "mousedown", this.resizeMouseDownListener);
		this.addEvent(document, "mouseup", this.resizeMouseUpListener);
		this.addEvent(document, "mousemove", this.resizeMouseMoveListener);
		
		popupDiv.appendChild(resizeDiv);
		
		this.addEvent(document, "mousemove", this.dragMouseMoveListener);
		this.addEvent(document, "mouseup", this.dragMouseUpListener);
		
	};
	
};
