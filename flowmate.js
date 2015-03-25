var com = {};

com.flowmate = {
	init : function () {

	},

	createShapeByType : function (type) {
		this.util.debug("createShapeByType");
		this.init();

		if (!this.util.didSelect()) {
			return;
		}

		var loop = [selection objectEnumerator];
		while (shape = [loop nextObject]) {
 		
 			if (shape.class() == MSTextLayer) {
 				this.setStyleOfLabel(shape);
 			}
 			else {
 				util.showToast ("You must select text layer(s) only.");
 			}

 			this.createWrapperShapeByType(type);
 			this.groupShapeAndLabel(shapeName, label, shape)

			if (type == "decision")
					this.addDirectionToDecision();
			}
	},

	createWrapperShapeByType : function ("type") {
		this.util.debug ("createProcessShape : " + type);
	},

	groupShapeAndLabel : function (shapeName, label, shape)

	addDirectionToDecision : function () {
		this.util.debug ("addDirectionToDecision");	
	}

	setStyleOfLabel : function (shape) {
		this.util.debug (shape)
		if (shape.class() == MSTextLayer ) {
			var label = shape;
			this.util.setFontStyle (label);
		}
		else {
			return;
		}
	}
};

com.flowmate.options = {
	mode : "debug",
	fontName : "Helvetica",
	fontSize : 15,
	fontColor : "#232323",
	dropShadow : false,
	align : 2
};

com.flowmate.util = {
	options : com.flowmate.options,

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

		//Restore the position to original middle point
		var newFrame = label.frame();
		newFrame.setMidX(originalFrame.midX());
		newFrame.setMidY(originalFrame.midY());
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