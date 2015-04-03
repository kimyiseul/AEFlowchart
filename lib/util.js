com.flowmate.util = {
	options : com.flowmate.options,
	super : com.flowmate,

	addLayer : function (name, type, parent) {
		var parent = parent ? parent : this.super.current,
			layer = parent.addLayerOfType(type);

		if (name) {
			layer.setName(name);
		}

		 return layer;
	},

	addShape : function (name, parent) {
		var layer = this.addLayer(name, 'rectangle', parent);
		
		if (this.isShape(layer)){
			return layer;
		}
		return this.shapeWithPath(layer);
	},

	addGroup : function (name, parent) {
		return this.addLayer(name, 'group', parent);
	},

	addText : function (opt) {
		// this.util.debugLog("addText");

		// var parent 		= opt.parent || doc.currentPage(),
		// 	name 		= opt.name || "new text layer",
		// 	color 		= MSColor.colorWithSVGString(opt.color || this.options.fontColor),
		// 	fontName	= opt.fontNamr || this.options.fontName,
		// 	fontSize 	= opt.fontSize || this.options.fontSize,
		// 	string 		= opt.string || "Type something",
		// 	w 			= opt.width || 400,
		// 	h 			= opt.height || 24,
		// 	x 			= opt.x || 0,
		// 	y 			= opt.y || 0,
		// 	fixed 		= opt.fixed || false;

		// var textLayer = parent.addLayerOfType("text");

		// textLayer.textColor = color;
		// textLayer.fontSize = fontSize;

		// textLayer.setName(name);
		// textLayer.setNameIsFixed(true);
		// this.setStringValue(textLayer, string);
		// textLayer.setFontPostscriptName(fontName);

		// var textLayerFrame = textLayer.frame();

		// textLayerFrame.setWidth(w);
		// textLayerFrame.setX(y);
		// textLayerFrame.setY(y);

		// if(fixed){
		//     textLayer.setTextBehaviour(1) // BCTextBehaviourFixedWidth
		// }

		// return textLayer;
		return this.addLayer(name, 'text', parent);
	},

	removeLayer : function (group, layer) {
		this.debug ("removeLayer");
		
		if (group) {
			group.removeLayer(layer);
		}
	},

	moveLayer : function (opt) {
		this.debug ("moveLayer");
		var layer = opt.target,
			newGroup = opt.newGroup,
			oldGroup = layer.parentGroup();

		layer.setIsSelected(false);

		if (this.isGroup(newGroup)) {
			newGroup.addLayers ([layer]);
			this.removeLayer(oldGroup, layer);
		}
	},

	is : function (layer, theClass) {
		var klass = layer.class();
		return klass === theClass;
	},

	isPage : function (layer) {
		return this.is(layer, MSPage);
	},

	isGroup : function (layer) {
		return this.is(layer, MSLayerGroup);
	},

	isText : function (layer) {
		return this.is(layer, MSTextLayer);
	},

	isShape : function (layer){
		return this.is(layer, MSShapeGroup);
	},

	getFrame : function (layer) {
		var frame = layer.frame();

		return {
			x: Math.round(frame.x()),
			y: Math.round(frame.y()),
			width: Math.round(frame.width()),
			height: Math.round(frame.height())
		};
	},

	getRect : function (layer) {
		var rect = layer.absoluteRect();
		return {
			x: Math.round(rect.x()),
			y: Math.round(rect.y()),
			width: Math.round(rect.width()),
			height: Math.round(rect.height())
		};
	},

	setSize : function (opt) {
		//layer, width, height, absolute
		this.debug(opt.layer);

		var layer = opt.target;

		if(opt.absolute){
			layer.absoluteRect().setWidth(opt.width);
			layer.absoluteRect().setHeight(opt.height);
		}
		else{
			layer.frame().setWidth(opt.width);
			layer.frame().setHeight(opt.height);
		}

		return layer;
	},

	setPosition : function (opt) {
		//layer, x, y, absolute
		//
		var layer = opt.target;

		this.debug (layer.absoluteRect().setMidX)

		if (opt.type == "topleft") {
			if(opt.absolute){
				layer.absoluteRect().setX(opt.x);
				layer.absoluteRect().setY(opt.y);
			}
			else{
				layer.frame().setX(opt.x);
				layer.frame().setY(opt.y);
			}
		} else if (opt.type == "middle") {
			if(opt.absolute){
				layer.absoluteRect().setMidX(opt.x);
				layer.absoluteRect().setMidY(opt.y);
			}
			else{
				layer.frame().setMidX(opt.x);
				layer.frame().setMidY(opt.y);
			}
		}

		return layer;
	},

	setFontStyle :function (label, opt) {
		this.debug("setFontStyle");
		var opt 	= opt || {},
			name 	= (opt.name) ? opt.name : this.options.fontName, 
			size 	= (opt.size) ? opt.size : this.options.fontSize,
			color 	= (opt.color) ? MSColor.colorWithSVGString(opt.color] :  MSColor.colorWithSVGString(this.options.fontColor],
			align 	= (opt.align) ? (opt.align) : this.options.align;

		var originalFrame = label.frame();

		label.setFontPostscriptName (name);
		label.setFontSize (size);
		label.setTextColor (color);
		label.setTextAlignment(align); // center
	},

	setBorder : function (opt) {
		var layer = opt.target;
		if (this.isShape(layer)) {
			var border 			= layer.style().borders().addNewStylePart();
			border.color 		= MSColor.colorWithSVGString(opt.color);
			border.thickness 	= opt.thickness;
		}
	},

	setShapeColor : function (opt) {
		//layer, hex, alpha
		var layer = opt.target;

		if(this.isShape(layer)) {

			var	color = MSColor.alloc().init()),			
				rgb = this.hexToRgb(opt.hex),
				red = rgb.r / 255,
				green = rgb.g / 255,
				blue = rgb.b / 255;

			this.debug (rgb);

			var alpha = (opt.alpha) ? opt.alpha : 1;
			//alphe = (alpha && !isNaN(alpha) && (alpha <= 1 || alpha >= 0)) ? alpha : 1;

			color.setRed(red);
			color.setGreen(green);
			color.setBlue(blue);
			color.setAlpha(alpha);
	
			var fills = layer.style().fills();
			if (fills.count() <= 0) {
				fills.addNewStylePart();
			}

			layer.style().fill().setFillType(0);
			layer.style().fill().setColor(color);
		}
	},

	setGradient : function (opt) {
		var layer = opt.target;

		if (this.isShape(layer)) {
			var fills = layer.style().fills();
			if (fills.count() <= 0) {
				fills.addNewStylePart();
			}

			layer.style().fill().setFillType(1);
			var gradient 	= layer.style().fill().gradient(),
				startColor 	= opt.startColor,
				endColor 	= opt.endColor;

			[gradient setColor:[MSColor colorWithSVGString:startColor] atIndex:0];
			[gradient setColor:[MSColor colorWithSVGString:endColor] atIndex:1];
		}
	},

	didSelect : function () {
		if (selection.count() > 0) {
			return true;
		} else {
			this.showToast ("Must Select Text Layer to create flochart node.");
		}
	},

	showToast : function (message) {
		this.runCommand(['-c', 'afplay /System/Library/Sounds/Basso.aiff']);
		[doc showMessage: message];
	},

	runCommand: function(cmd,path){
        var task = [[NSTask alloc] init];    
        task.setLaunchPath("/bin/bash");
        task.setArguments(cmd);
        task.launch();
    },

	debug : function(msg){
        if(this.isModeDebug()) log(msg);
    },

    isModeDebug : function() {
    	return (com.flowmate.options.mode == "debug");
    },

	hexToRgb : function (hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},

    shapeWithPath : function (shape) {
		if ( shape.embedInShapeGroup != undefined ) {
			return shape.embedInShapeGroup()
		} else if ( MSShapeGroup.shapeWithPath != undefined ) {
			return MSShapeGroup.shapeWithPath(shape)
		}
     },

	dump : function (obj) {
	    this.debugLog("#####################################################################################");
	    this.debugLog("## Dumping object " + obj );
	    this.debugLog("## obj class is: " + [obj className]);
	    this.debugLog("#####################################################################################");

	    this.debugLog("############################# obj.properties:");
	    this.debugLog([obj class].mocha().properties());
	    this.debugLog("############################# obj.propertiesWithAncestors:");
	    this.debugLog([obj class].mocha().propertiesWithAncestors());

	    this.debugLog("############################# obj.classMethods:");
	    this.debugLog([obj class].mocha().classMethods());
	    this.debugLog("############################# obj.classMethodsWithAncestors:");
	    this.debugLog([obj class].mocha().classMethodsWithAncestors());

	    this.debugLog("############################# obj.instanceMethods:");
	    this.debugLog([obj class].mocha().instanceMethods());
	    this.debugLog("############################# obj.instanceMethodsWithAncestors:");
	    this.debugLog([obj class].mocha().instanceMethodsWithAncestors());

	    this.debugLog("############################# obj.protocols:");
	    this.debugLog([obj class].mocha().protocols())
	    this.debugLog("############################# obj.protocolsWithAncestors:");
	    this.debugLog([obj class].mocha().protocolsWithAncestors());

	    this.debugLog("############################# obj.treeAsDictionary():");
	    this.debugLog(obj.treeAsDictionary());
	}
}