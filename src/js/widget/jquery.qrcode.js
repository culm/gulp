(function( $ ){
	var getCanvas = function(options){
		// create the qrcode itself
		var qrcode	= new QRCode(options.typeNumber || -1, options.correctLevel || QRErrorCorrectLevel.H);
		qrcode.addData(options.text);
		qrcode.make();
		// create canvas element
		var canvas	= document.createElement('canvas');
		canvas.width	= options.width || 105;
		canvas.height	= options.height || 105;
		var ctx		= canvas.getContext('2d');

		// compute tileW/tileH based on options.width/options.height
		var tileW	= (options.width || 105)  / qrcode.getModuleCount();
		var tileH	= (options.height || 105) / qrcode.getModuleCount();

		// draw in the canvas
		for( var row = 0; row < qrcode.getModuleCount(); row++ ){
			for( var col = 0; col < qrcode.getModuleCount(); col++ ){
				ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
				var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
				var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
				ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);  
			}	
		}
		// return just built canvas
		return canvas;
	}
	$.fn.qrcode = function(options) {
		// if options is string, 
		if( typeof options === 'string' ){
			options	= { text: options };
		}

		// set default values
		// typeNumber < 1 for automatic calculation
		options	= $.extend( {}, {
			render		: "canvas",
			width		: 105,
			height		: 105,
			typeNumber	: -1,
			correctLevel	: QRErrorCorrectLevel.H,
                        background      : "#ffffff",
                        foreground      : "#000000"
		}, options);

		var createCanvas	= function(target){
			var barcode = target.getAttribute('barcode');
			if(barcode) options.text = barcode;
			//if(!options.text) options.text = target.getAttribute('barcode');
			target.removeAttribute('barcode');
			return getCanvas(options);
		}

		// from Jon-Carlos Rivera (https://github.com/imbcmdth)
		var createTable	= function(target){
			if(!options.text) options.text = target.getAttribute('barcode');
			target.removeAttribute('barcode');
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();
			
			// create table element
			var $table	= $('<table></table>')
				.css("width", options.width+"px")
				.css("height", options.height+"px")
				.css("border", "0px")
				.css("border-collapse", "collapse")
				.css('background-color', options.background);
		  
			// compute tileS percentage
			var tileW	= options.width / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the table
			for(var row = 0; row < qrcode.getModuleCount(); row++ ){
				var $row = $('<tr></tr>').css('height', tileH+"px").appendTo($table);
				
				for(var col = 0; col < qrcode.getModuleCount(); col++ ){
					$('<td></td>')
						.css('width', tileW+"px")
						.css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
						.appendTo($row);
				}	
			}
			// return just built canvas
			return $table;
		}
		return this.each(function(){
			var element = null;
			if(document.createElement('canvas').getContext){
				element = createCanvas(this);
			}else{
				element = createTable(this);
			}
			$(element).appendTo(this);
		});
	};
	$.fn.qrcode.getImgBarcode = function(barcode){
		try{
			var canvas = getCanvas({text: barcode || '1'});
			canvas.style.display = 'none';
			document.body.appendChild(canvas);
			var image = canvas.toDataURL();//.replace("image/png", "image/octet-stream");
			return image;
		}
		catch(e){
			return '';
		}
	}

})( jQuery );
