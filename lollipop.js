/****************************************************************************
    Lollipop is a light weight, customizable, draggable  and resizeable
    javascript popup which is designed to avoid loading heavy libraries just
    for a popup.
    
    Copyright (C) 2014 pMan and karmicbee.

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
****************************************************************************/
var Lollipop = (function(ops) {
	var options = {
		'title'	: "Lookup Dictionaries & Thesaurus",
		'close'	: "X",
		'top'	: "100",
		'left'	: "180",
		'href'	: "http://www.google.com/custom?q=test&btnG=Search"
	};

	var minHeight = 300, minWidth = 400;
	
	var isDragging = false, isResizing = false, xInit =0, yInit = 0;
	var width, height, xI =0, yI = 0;
	
	var popupDiv	= document.createElement("div");
	var headerDiv	= popupDiv.cloneNode(false);
	var closeDiv	= popupDiv.cloneNode(false);
	var iframe		= document.createElement("iframe");
	var title		= document.createElement("span");
	var resizeDiv	= popupDiv.cloneNode(false);
	
	var moverDiv, workaround;
	
	// constructor
	var popup = function(ops) {
		// equivalent to jQuery.extend
		for (var prop in ops) {
			options[prop] = ops[prop];
		}
	};
	
	// resizes the popup
	var resizePopup = function() {
		headerHeight = headerDiv.offsetHeight + 20;
		popupHeight = popupDiv.offsetHeight;
		iframe.style.height = popupHeight - headerHeight;
	};
	
	var addEvent = function(elem, evnt, func) {
		elem.addEventListener ? elem.addEventListener(evnt,func,false) : elem.attachEvent("on"+evnt, func) ;
	};
	
	// initializations
	popup.prototype.init = function(op) {
		
		// set popup properties	
		popupDiv.setAttribute("class", "lolli_popup bxshd");
		popupDiv.style.top = options['top'] + "px";
		popupDiv.style.left = options['left'] + "px";
		document.body.appendChild(popupDiv);
		
		// set title properties
		title.setAttribute("class", "lolli_title");
		title.innerHTML = options['title'];
		
		// set close button properties
		closeDiv.setAttribute("class", "lolli_close");
		closeDiv.innerHTML = options['close'];
		
		// set popup header properties
		headerDiv.setAttribute("class", "lolli_header");
		//headerDiv.appendChild(title);
		//headerDiv.appendChild(closeDiv);
		this.setupHeader(title, closeDiv);
		popupDiv.appendChild(headerDiv);
		
		// iframe to load data
		popupDiv.appendChild(iframe);
		iframe.setAttribute("class", "lolli_iframe");
		
		// set 'loading...' in the popup and then set url
		iframe.contentDocument.write("<html><body><div style='width:100%; "+
			"color: gray; text-align: center; line-height: 100%;'><i style='padding-top: 100px;"+
			"display: block;'>loading...</i></div></body></html>");
		iframe.setAttribute("src", options['href']);
		resizePopup();
		
		resizeDiv.setAttribute("class", "lolli_drag");
		addEvent(resizeDiv, "mousedown", this.resizeMouseDownListener); //resizeDiv.addEventListener("mousedown", this.resizeMouseDownListener, false);
		addEvent(document, "mouseup", this.resizeMouseUpListener); //document.addEventListener("mouseup", this.resizeMouseUpListener, false);
		addEvent(document, "mousemove", this.resizeMouseMoveListener); //document.addEventListener("mousemove", this.resizeMouseMoveListener, false);
		popupDiv.appendChild(resizeDiv);
		
		addEvent(document, "mousemove", this.dragMouseMoveListener); //document.addEventListener("mousemove", this.dragMouseMoveListener, false);
		addEvent(document, "mouseup", this.dragMouseUpListener); //document.addEventListener("mouseup", this.dragMouseUpListener, false);
	};
	
	popup.prototype.setupHeader = function(title, close) {
		headerDiv.innerHTML = "";
		
		var titleTd = document.createElement("td");
		titleTd.appendChild(title);
		addEvent(titleTd, "mousedown", this.dragMouseDownListener); //titleTd.addEventListener("mousedown", this.dragMouseDownListener, false);
		
		var closeTd = document.createElement("td");
		closeTd.style.width = "20px";
		closeTd.appendChild(close);
		addEvent(closeTd, "click", this.closeListener); //closeTd.addEventListener("click", this.closeListener, true);
		
		var tr = document.createElement("tr");
		tr.appendChild(titleTd);
		tr.appendChild(closeTd);
		
		var table = document.createElement("table");
		table.style.width = "100%";
		table.appendChild(tr);
		
		headerDiv.appendChild(table);
	};
	
	// mouseup even handler
	popup.prototype.dragMouseUpListener = function(e) {
		isDragging = false;
		popupDiv.style.top = moverDiv.style.top;
		popupDiv.style.left = moverDiv.style.left;
		
		if (moverDiv.parentNode !== null)
		moverDiv.parentNode.removeChild(moverDiv);
	};
	
	// click handler
	popup.prototype.closeListener = function(e) {
		//e.preventDefault();
		//e.stopPropagation();
		popupDiv.parentNode.removeChild(popupDiv);
	};
	
	// mousedown handler
	popup.prototype.dragMouseDownListener = function(e) {
		xInit	= e.clientX;
		yInit	= e.clientY;
		moverDiv = popupDiv.cloneNode(false);
		moverDiv.innerHTML = "";
		moverDiv.setAttribute("class", "lolli_popup");
		moverDiv.style.opacity = "0.5";
		
		document.body.appendChild(moverDiv);
		
		isDragging = true;
	};
	
	// mousemove handler
	popup.prototype.dragMouseMoveListener = function(e) {
		// check for click + drag
		if (! isDragging) return false;
		
		//options['top'] = parseInt(popupDiv.style.top); // to remove "px"
		//options['left'] = parseInt(popupDiv.style.left);
		
		options['top'] = parseInt(moverDiv.style.top); // to remove "px"
		options['left'] = parseInt(moverDiv.style.left);
		
		// reset coords position
		moverDiv.style.top	= options['top'] + e.clientY - yInit;
		moverDiv.style.left	= options['left'] + e.clientX - xInit;
		
		// set new initial positions
		xInit	= e.clientX;
		yInit	= e.clientY;
	};

	popup.prototype.resizeMouseDownListener = function(e) {
		document.body.setAttribute("class", "noselect");
		moverDiv = popupDiv.cloneNode(false);
		moverDiv.innerHTML = "";
		moverDiv.setAttribute("class", "lolli_popup");
		moverDiv.style.opacity = "0.5";
		
		workaround = popupDiv.cloneNode(false);
		workaround.innerHTML = "";
		workaround.style.opacity = "0.0";
		
		document.body.appendChild(moverDiv);
		document.body.appendChild(workaround);
		
		isResizing = true;
	};
	
	popup.prototype.resizeMouseMoveListener = function(e) {
		if (! isResizing) return false;
		
		// set new initial positions
		xI	= e.clientX - parseInt(options["left"]) ;
		yI	= e.clientY - parseInt(options["top"]) ;
		
		// reset coords position
		moverDiv.style.height	= yI + "px";
		moverDiv.style.width	= xI + "px";
		document.getElementById("testt").innerHTML = xI + "px";
	};
	
	// mouseup even handler
	popup.prototype.resizeMouseUpListener = function(e) {
		document.body.setAttribute("class", "");
		isResizing = false;

		popupDiv.style.width = moverDiv.style.width;
		popupDiv.style.height = moverDiv.style.height;
		
		resizePopup();
		
		if (moverDiv.parentNode !== null)
		moverDiv.parentNode.removeChild(moverDiv);
		
		if (workaround !== undefined && workaround.parentNode !== null)
		workaround.parentNode.removeChild(workaround);
	};
	
	return popup;
})();
