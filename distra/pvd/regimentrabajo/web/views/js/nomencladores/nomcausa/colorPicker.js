
/**
 * @class Ext.form.ColorField
 * @extends Ext.form.TriggerField
 * Provides a very simple color form field with a ColorMenu dropdown.
 * Values are stored as a six-character hex value without the '#'.
 * I.e. 'ffffff'
 * @constructor
 * Create a new ColorField
 * <br />Example:
 * <pre><code>
var cf = new Ext.form.ColorField({
	fieldLabel: 'Color',
	hiddenName:'pref_sales',
	showHexValue:true
});
</code></pre>
 * @param {Object} config
 */
Ext.form.ColorField = function(config){
    Ext.form.ColorField.superclass.constructor.call(this, config);
	this.on('render', this.handleRender);
};

Ext.extend(Ext.form.ColorField, Ext.form.TriggerField,  {
    /**
     * @cfg {Boolean} showHexValue
     * True to display the HTML Hexidecimal Color Value in the field
     * so it is manually editable.
     */
    showHexValue : false,
	
	/**
     * @cfg {String} triggerClass
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-color-trigger'
     * which displays a calendar icon).
     */
    triggerClass : 'x-form-color-trigger',
	
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "10", autocomplete: "off"})
     */
    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "10",
						 autocomplete: "off", maxlength:"6"},
	
	/**
	 * @cfg {String} lengthText
	 * A string to be displayed when the length of the input field is
	 * not 3 or 6, i.e. 'fff' or 'ffccff'.
	 */
	lengthText: "Color hex values must be either 3 or 6 characters.",
	
	//text to use if blank and allowBlank is false
	blankText: "Must have a hexidecimal value in the format ABCDEF.",
	
	/**
	 * @cfg {String} color
	 * A string hex value to be used as the default color.  Defaults
	 * to 'FFFFFF' (white).
	 */
	defaultColor: 'FFFFFF',
	
	maskRe: /[a-f0-9]/i,
	// These regexes limit input and validation to hex values
	regex: /[a-f0-9]/i,

	//private
	curColor: 'ffffff',
    curValue: 'ffffff',
    // private
    validateValue : function(value){
		if(!this.showHexValue) {
			return true;
		}
		if(value.length<1) {
			this.el.setStyle({
				'background-color':'#' + this.defaultColor
			});
			if(!this.allowBlank) {
				this.markInvalid(String.format(this.blankText, value));
				return false
			}
			return true;
		}
		if(value.length!=3 && value.length!=6 ) {
			this.markInvalid(String.format(this.lengthText, value));
			return false;
		}
		this.setColor(value);
        this.curValue = value;
        return true;
    },

    // private
    validateBlur : function(){
        return !this.menu || !this.menu.isVisible();
    },
	
	// Manually apply the invalid line image since the background
	// was previously cleared so the color would show through.
	markInvalid : function( msg ) {
		Ext.form.ColorField.superclass.markInvalid.call(this, msg);
		this.el.setStyle({
			'background-image': 'url(../lib/resources/images/default/grid/invalid_line.gif)'
		});
	},

    /**
     * Returns the current color value of the color field
     * @return {String} value The hexidecimal color value
     */
    getValue : function(){
        return Ext.form.ColorField.superclass.getValue.call(this) || "";
		//return this.curValue || this.defaultValue || "FFFFFF";
    },

    /**
     * Sets the value of the color field.  Format as hex value 'FFFFFF'
     * without the '#'.
     * @param {String} hex The color value
     */
    setValue : function(hex){
		Ext.form.ColorField.superclass.setValue.call(this, hex);
		this.setColor(hex);
    },
	
	/**
	 * Sets the current color and changes the background.
	 * Does *not* change the value of the field.
	 * @param {String} hex The color value.
	 */
	setColor : function(hex) {
		this.curColor = hex;
		
		this.el.setStyle( {
			'background-color': '#' + hex,
			'background-image': 'none'
		});
		if(!this.showHexValue) {
			this.el.setStyle({
				'text-indent': '-100px'
			});
			if(Ext.isIE) {
				this.el.setStyle({
					'margin-left': '100px'
				});
			}
		}
	},
	
	handleRender: function() {
		this.setDefaultColor();
	},
	
	setDefaultColor : function() {
		this.setValue(this.defaultColor);
	},

    // private
    menuListeners : {
        select: function(m, d){
            this.setValue(d);
        },
        show : function(){ // retain focus styling
            this.onFocus();
        },
        hide : function(){
            this.focus();
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },
	
	//private
	handleSelect : function(palette, selColor) {
		this.setValue(selColor);
	},

    // private
    // Implements the default empty TriggerField.onTriggerClick function to display the ColorPicker
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.ColorMenu();
			this.menu.palette.on('select', this.handleSelect, this );
        }
        this.menu.on(Ext.apply({}, this.menuListeners, {
            scope:this
        }));
        this.menu.show(this.el, "tl-bl?");
    }
});



//**
// * @class Ext.form.ColorField
// * @extends Ext.form.TriggerField
// * Provides a color input field with a {@link Ext.ColorPalette} dropdown.
// * @constructor
// * Create a new ColorField
// * <br />Example:
// * <pre><code>
// var color_field = new Ext.form.ColorField({
//	fieldLabel: 'Color',
//	id: 'color',
//	width: 175,
//	allowBlank: false
//});
// </code></pre>
// * @param {Object} config
// */
//Ext.form.ColorField = function(config){
//    Ext.form.ColorField.superclass.constructor.call(this, config);
//};
//
//Ext.extend(Ext.form.ColorField, Ext.form.TriggerField,  {
//    /**
//     * @cfg {String} invalidText
//     * The error to display when the color in the field is invalid (defaults to
//     * '{value} is not a valid color - it must be in the format {format}').
//     */
//    invalidText : "{0} is not a valid color - it must be in a the hex format {1}",
//    /**
//     * @cfg {String} triggerClass
//     * An additional CSS class used to style the trigger button.  The trigger will always get the
//     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-color-trigger'
//     * which displays a color wheel icon).
//     */
//    triggerClass : 'x-form-color-trigger',
//    /**
//     * @cfg {String/Object} autoCreate
//     * A DomHelper element spec, or true for a default element spec (defaults to
//     * {tag: "input", type: "text", size: "10", autocomplete: "off"})
//     */
//
//    // private
//    defaultAutoCreate : {tag: "input", type: "text", size: "10", maxlength: "7", autocomplete: "off"},
//
//    // Limit input to hex values
//    maskRe: /[a-f0-9]/i,
//    regex: /[a-f0-9]/i,
//
//    // private
//    validateValue : function(value){
//        if(!Ext.form.ColorField.superclass.validateValue.call(this, value)){
//            return false;
//        }
//        if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
//            return true;
//        }
//
//        var parseOK = this.parseColor(value);
//
//        if(!value || (parseOK == false)){
//            this.markInvalid(String.format(this.invalidText, value, '#AABBCC'));
//            return false;
//        }
//
//        return true;
//    },
//
//    // private
//    // Provides logic to override the default TriggerField.validateBlur which just returns true
//    validateBlur : function(){
//        return !this.menu || !this.menu.isVisible();
//    },
//
//    /**
//     * Returns the current value of the color field
//     * @return {String} value The color value
//     */
//    getValue : function(){
//        return Ext.form.ColorField.superclass.getValue.call(this) || "";
//    },
//
//    /**
//     * Sets the value of the color field.  You can pass a string that can be parsed into a valid HTML color
//     * <br />Usage:
//     * <pre><code>
//     colorField.setValue('#FFFFFF');
//     </code></pre>
//     * @param {String} color The color string
//     */
//    setValue : function(color){
//        Ext.form.ColorField.superclass.setValue.call(this, this.formatColor(color));
//    },
//
//    // private
//    parseColor : function(value){
//        return (!value || (value.substring(0,1) != '#')) ?
//            false : true;
//    },
//
//    // private
//    formatColor : function(value){
//        if (value && (this.parseColor(value) == false)) {
//            value = '#' + value;
//        }
//
//        return value;
//    },
//
//    // private
//    menuListeners : {
//        select: function(e, c){
//            this.setValue(c);
//        },
//        show : function(){ // retain focus styling
//            this.onFocus();
//        },
//        hide : function(){
//            this.focus();
//            var ml = this.menuListeners;
//            this.menu.un("select", ml.select,  this);
//            this.menu.un("show", ml.show,  this);
//            this.menu.un("hide", ml.hide,  this);
//        }
//    },
//
//    // private
//    // Implements the default empty TriggerField.onTriggerClick function to display the ColorPalette
//    onTriggerClick : function(){
//        if(this.disabled){
//            return;
//        }
//        if(this.menu == null){
//            this.menu = new Ext.menu.ColorMenu();
//        }
//
//        this.menu.on(Ext.apply({}, this.menuListeners, {
//            scope:this
//        }));
//
//        this.menu.show(this.el, "tl-bl?");
//    }
//});