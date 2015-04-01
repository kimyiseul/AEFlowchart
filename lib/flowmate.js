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

 			this.createShapeByType(type, shape);
 		}
	},

	createShapeByType : function (type, label) {
		this.util.debug ("createShapeByType : " + type);

		var wrapperShape, group;

		switch (type) {
			case "Process":
				wrapperShape = this.createProcessShape(label);
				break;
			case "Decision":
				wrapperShape = this.createDecisionShape(label);
				break;
		}
	},

	createDecisionShape : function (label) {
		this.util.debug ("createDecisionShape");

		var stepName 		= "Decision",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + " - " + labelString),
			bgShape 		= this.drawDecisionShape(label);

		this.util.setFontStyle(label, {
			size: this.options.decision.fontSizeOfLabel
		});

		this.util.setShapeColor({
			target : bgShape, 
			hex : this.options.decision.shapeColor,
		});

		this.util.moveLayer({
			target : bgShape, 
			newGroup : newGroup
		});

		//set Position of Label
		this.util.setPosition({
			target : label, 
			type : "topleft",
			x : bgShape.frame().midX() - label.frame().width() - 20,
			y : bgShape.frame().minY()
		});

		this.util.moveLayer({
			target : label, 
			newGroup : newGroup
		});

		//Add X, Y Directions
		this.addDirectionToDecision(newGroup, label, bgShape);

		newGroup.resizeRoot(0);
	},

	drawDecisionShape : function (label) {
		var labelFrame 	= label.frame(), 
			labelWidth 	= labelFrame.width(),
			labelHeight = labelFrame.height(),
			nSize 		= this.options.decision.shapeSize;
			shapePath 	= NSBezierPath.bezierPath(),

		[shapePath moveToPoint:CGPointMake([labelFrame midX], [labelFrame midY] - nSize)];
		[shapePath lineToPoint:CGPointMake([labelFrame midX] + nSize, [labelFrame midY])];
		[shapePath lineToPoint:CGPointMake([labelFrame midX], [labelFrame midY] + nSize)];
		[shapePath lineToPoint:CGPointMake([labelFrame midX] - nSize, [labelFrame midY])];
		shapePath.closePath();

		return MSShapeGroup.shapeWithBezierPath(shapePath);
	},

	addDirectionToDecision : function (newGroup, label, shape) {
		this.util.debug ("addDirectionToDecision");	

		var labelFrame = label.frame(),
			shapeFrame = shape.frame();

		// create Y & N
		var textYes = newGroup.addLayerOfType("text"),
			textNo = newGroup.addLayerOfType("text"),
			textYesFrame = [textYes frame],
			textNoFrame = [textNo frame];

		textYes.setName("Y");
		textYes.setStringValue ("Y");
		textYes.fontSize = this.options.decision.fontSizeOfException;
		textYes.setFontPostscriptName(this.options.decision.fontForException);
		textYes.textColor = MSColor.colorWithSVGString(this.options.decision.fontColorForException);

		textNo.setName("N");
		textNo.setStringValue ("N");
		textNo.fontSize = this.options.decision.fontSizeOfException;
		textNo.setFontPostscriptName(this.options.decision.fontForException);
		textNo.textColor = MSColor.colorWithSVGString(this.options.decision.fontColorForException);


		var xYes = shapeFrame.midX() + 11,
		yYes = shapeFrame.midY();

		textYesFrame.setX(shapeFrame.midX() + 11);
		textYesFrame.setMidY(shapeFrame.midY());

		var xNo = shapeFrame.midX(),
		yNo = shapeFrame.maxY() - 16;

		textNoFrame.setMidX(shapeFrame.midX());
		textNoFrame.setY(shapeFrame.maxY() - 16);

		// Relocate the label
		labelFrame.setY(shapeFrame.minY());
		labelFrame.setX(shapeFrame.midX() - labelFrame.width() - 20);
	},

	createProcessShape : function (label) {
		this.util.debug ("createProcessShape");

		var stepName 		= "Process",
			labelString 	= label.stringValue(),
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
		});
		
		//Merge Shape and Label
		this.util.moveLayer({
			target : label,
			newGroup : newGroup
		});

		newGroup.resizeRoot(0);
	},
};