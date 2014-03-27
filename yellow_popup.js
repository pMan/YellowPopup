/****************************************************************************
    Yellow is a light weight, customizable, draggable javascript popup
    which is designed to avoid loading heavy libraries just for a popup.
    
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
var YellowPopup = (function(ops) {
	var options = {
		'title'	: "Lookup Dictionaries & Thesaurus",
		'close'	: "X",
		'top'	: "100",
		'left'	: "180",
		'href'	: "http://karmicbee.com/about"
	};

	var isMouseDown = false, xInit =0, yInit = 0;
	
	var popupDiv	= document.createElement("div");
	var headerDiv	= popupDiv.cloneNode();
	var closeDiv	= popupDiv.cloneNode();
	var iframe		= document.createElement("iframe");
	var moverDiv;
		
	var popup = function(ops) {
		// equivalent to jQuery.extend
		for (var prop in ops) {
			options[prop] = ops[prop];
		}
	};
	
	// initializations
	popup.prototype.init = function(op) {
		
		// set popup properties	
		popupDiv.setAttribute("class", "yellow_popup bxshd");
		popupDiv.style.top = options['top'] + "px";
		popupDiv.style.left = options['left'] + "px";
		document.body.appendChild(popupDiv);
		
		// set popup header properties
		headerDiv.setAttribute("class", "yellow_header");
		headerDiv.innerHTML = options['title'];
		popupDiv.appendChild(headerDiv);
		
		// set close button properties
		closeDiv.setAttribute("class", "yellow_close");
		closeDiv.innerHTML = options['close'];
		headerDiv.appendChild(closeDiv);
		
		// iframe to load data
		popupDiv.appendChild(iframe);
		iframe.setAttribute("class", "yellow_iframe");
		
		// set 'loading...' in the popup and then set url
		iframe.contentDocument.write("<html><body><div style='width:100%; "+
			"color: gray; text-align: center; line-height: 100%;'><i style='padding-top: 100px;"+
			"display: block;'>loading...</i></div></body></html>");
		iframe.setAttribute("src", options['href']);
		this.resizeIframe();
		
		closeDiv.addEventListener("click", this.closeListener, false);
		headerDiv.addEventListener("mousedown", this.mouseDownListener, false);
		document.addEventListener("mousemove", this.mouseMoveListener, false);
		document.addEventListener("mouseup", this.mouseUpListener, false);
	};
	
	// resizes the iframe
	popup.prototype.resizeIframe = function() {
		headerHeight = headerDiv.offsetHeight + 20;
		popupHeight = popupDiv.offsetHeight;
		iframe.style.height = popupHeight - headerHeight;
	};
	
	// mouseup even handler
	popup.prototype.mouseUpListener = function(e) {
		isMouseDown = false;
		popupDiv.style.top = moverDiv.style.top;
		popupDiv.style.left = moverDiv.style.left;
		
		moverDiv.parentNode.removeChild(moverDiv);
	};
	
	// click handler
	popup.prototype.closeListener = function() {
		popupDiv.parentNode.removeChild(popupDiv);
	};
	
	// mousedown handler
	popup.prototype.mouseDownListener = function(e) {
		xInit	= e.clientX;
		yInit	= e.clientY;
		moverDiv = popupDiv.cloneNode();
		moverDiv.innerHTML = "";
		moverDiv.setAttribute("class", "yellow_popup");
		moverDiv.style.opacity = "0.5";
		
		document.body.appendChild(moverDiv);
		
		isMouseDown = true;
	};
	
	// mousemove handler
	popup.prototype.mouseMoveListener = function(e) {
		// check for click + drag
		if (! isMouseDown) return false;
		
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
	
	return popup;
})();
