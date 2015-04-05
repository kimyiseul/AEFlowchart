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
				this.createProcessShape(label);
				break;
			case "Decision":
				this.createDecisionShape(label);
				break;
			case "Reference":
				this.createReferenceShape(label);
		}
	},
	createReferenceShape : function (label) {
		this.util.debug ("createDecisionShape");

		var stepName 		= "Refernce",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + " - " + labelString);

		//Set label style
		this.util.setFontStyle (label, {
			name : this.options.reference.fontName, 
			size : this.options.reference.fontSize,
			color : this.options.reference.fontColor
		});

		//Create background shape
		var shapeOption = {
			color 		: this.options.reference.shapeColor,
			width 		: this.options.reference.shapeSize,
			height 		: this.options.reference.shapeSize
		};
		
		var shapeName 	= stepName + "-" + labelString + "-bgshape",
			shapeGroup 	= this.util.addOval(shapeName, newGroup, shapeOption);

		//Set shape position
		this.util.setPosition (shapeGroup, {
			type : "middle", 
			x : label.frame().midX(),
			y : label.frame().midY()
		});

		//Move label layer into the group
		this.util.moveLayer({
			target : label, 
			newGroup : newGroup
		});

		//Reset group size
		newGroup.resizeRoot(0);
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
		this.util.setPosition(label, {
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
		var textYes 			= this.util.addText("Condition-Yes", newGroup),
			textNo 				= this.util.addText("Condition-No", newGroup),
			textYesFrame 		= textYes.frame(),
			textNoFrame 		= textNo.frame(),
			conditionFontStyle 	= {
				name 	: this.options.decision.fontForCondition,
				size 	: this.options.decision.fontSizeOfCondition,
				color 	: this.options.decision.fontColorForCondition
			};

		textYes.setStringValue ("Y");
		textNo.setStringValue ("N");

		this.util.setFontStyle(textYes, conditionFontStyle);
		this.util.setFontStyle(textNo, conditionFontStyle);

		this.util.setPosition(textYes, {
			type 	: "middle",
			x 		: shape.frame().maxX() - 11,
			y 		: shape.frame().midY()
		});

		this.util.setPosition(textNo, {
			type 	: "middle",
			x 		: shape.frame().midX(),
			y 		: shape.frame().maxY() - 11
		})

		// Relocate the label
		this.util.setPosition(label, {
			type 	: "topleft",
			x 		: shape.frame().midX() - label.frame().width() - 20,
			y 		: shape.frame().minY()
		})
	},

	createProcessShape : function (label) {
		this.util.debug ("createProcessShape");

		var stepName 		= "Process",
			labelString 	= label.stringValue(),
			newGroup 		= this.util.addGroup(stepName + "-" + labelString),
			bgShape 		= this.util.addShape(stepName + "-" + labelString + "-bgshape", newGroup);

		this.util.debug ("newGroup :" + newGroup);

		//Set Layer name of label and styles
		label.setName ("label - " + labelString);

		this.util.setFontStyle(label);
		
		//Set BGShape size and styles
		this.util.setSize(bgShape, {
			width : this.options.process.shapeWidth, 
			height : this.options.process.shapeHeight
		});
		
		this.util.setBorder(bgShape, {
			color : this.options.process.borderColor,
			thickness : this.options.process.borderThickness
		});
		
		this.util.setGradient(bgShape, {
			startColor : this.options.process.gradientStartColor,
			endColor : this.options.process.gradientEndColor
			
		});

		//set Position of Shape
		this.util.setPosition(bgShape, {
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