var com = {};

com.flowmate = {
	init : function () {
		this.page 		= [doc currentPage];
  		this.artboard 	= this.page.currentArtboard();
  		this.artboards 	= [doc artboards];
  		this.current 	= this.artboard ? this.artboard : this.page;
	},

	createSymbol : function (type) {
		this.util.debug("createSymbol");
		this.init();

		if (!this.util.didSelect()) {
			return;
		}

		var loop = [selection objectEnumerator];
		while (shape = [loop nextObject]) {

 			if (!this.util.isText(shape)) {
 				this.util.showToast ("You must select text layer(s) only.");
 				return; 
 			}

 			//this.setStyleOfLabel(shape);
 			//newShaep = this.createWrapperShapeByType(label);
 			this.createShapeByType(type, shape);
 		}
	},

	createShapeByType : function (type, label) {
		this.util.debug ("createShapeByType : " + type);

		var wrapperShape, group;

		switch (type) {
			case "Process":
				wrapperShape = this.createProcessWrapperShape(label);
			break;
		}


		if (type == "Decision") {
			this.addDirectionToDecision(group, wrapperShape, label);
		}
	},

	createProcessWrapperShape : function (label) {
		this.util.debug ("createProcessWrapperShape");

		var stepName 		= "Process",
			labelString 	= label.stringValue();
			newGroup 		= this.util.addGroup(stepName + " - " + labelString),
			bgShape 		= this.util.addShape("bgShape - " + labelString, newGroup);

		this.util.debug ("newGroup :" + newGroup);

		//Set Layer name of label and styles
		label.setName ("label - " + labelString);

		this.util.setFontStyle(label);
		
		//Set BGShape size and styles
		this.util.setSize({
			target : bgShape, 
			width : this.options.process.shapeWidth, 
			height : this.options.process.shapeHeight
		});
		
		this.util.setBorder({
			target : bgShape,
			color : this.options.process.borderColor,
			thickness : this.options.process.borderThickness
		});
		
		this.util.setGradient({
			target : bgShape, 
			startColor : this.options.process.gradientStartColor,
			endColor : this.options.process.gradientEndColor
			
		});

		//set Position of Shape
		this.util.setPosition({
			target : bgShape, 
			type : "middle",
			x : label.frame().midX(),
			y : label.frame().midY()
		})
		
		//Merge Shape and Label
		this.util.moveLayer({
			target : label,
			newGroup : newGroup
		});

		newGroup.resizeRoot(0);
	},

	addDirectionToDecision : function () {
		this.util.debug ("addDirectionToDecision");	
	},
};