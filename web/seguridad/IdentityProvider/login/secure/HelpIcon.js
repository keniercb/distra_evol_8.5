// create namespace for plugins
Ext.ns('Ext.ux.plugins');

/**
 * Ext.ux.plugins.HelpIcon plugin for Ext.form.Field
 *
 * @author  Jonas Skoogh
 * @date    September 4, 2008
 *
 * @class Ext.ux.plugins.HelpIcon
 * @extends Ext.util.Observable
 *
 * An plugin for all kind of form fields.
 *
 * NOTE: Don't use anchor:'100%', use anchor:-20 (or -40 if msgTarget:'side' is used)
 */

/**
 *
 * @class Ext.ux.plugins.HelpIcon
 * @extends Ext.util.Observable
 */
Ext.ux.plugins.HelpIcon = Ext.extend(Ext.util.Observable, {
    /**
     * Init of plugin
     * @param {Ext.Component} field
     */
    init:function(field) {
        Ext.apply(field, {
            onRender:field.onRender.createSequence(function(ct, position) {
                //If field has the fieldLabel object, add the helpIcon
                if(this.fieldLabel && this.helpText) {
                    var label = this.el.findParent('.x-form-element', 5, true) || this.el.findParent('.x-form-field-wrap', 5, true);
                    if(this.user){
                        this.helpIcon = label.createChild({
                            cls:(this.helpIconCls || 'ux-helpicon-icon')
                            ,
                            style:'width:25px; height:25px; position:absolute; left:0; top:0; display:block; background:transparent no-repeat scroll 0 -2px;'
                        });
                    }
                    else{
                        this.helpIcon = label.createChild({
                            cls:(this.helpIconCls || 'ux-helpicon-iconpassword ')
                            ,
                            style:'width:25px; height:25px; position:absolute; left:0; top:0; display:block; background:transparent no-repeat scroll 0 -2px;'
                        });
                    }


                    this.alignHelpIcon = function(){
                        var el = this.wrap ? this.wrap : this.el;
                        this.helpIcon.alignTo(el, 'tl-tr', [2, 0]);
                    }
                    //Redefine alignErrorIcon to move the errorIcon (if it exist) to the right of helpIcon
                    if(this.alignErrorIcon) {
                        this.alignErrorIcon = function() {
                            this.errorIcon.alignTo(this.helpIcon, 'tl-tr', [2, 0]);
                        }
                    }

                    this.on('resize', this.alignHelpIcon, this);

                    //Register QuickTip for icon
                    Ext.QuickTips.register({
                        target:this.helpIcon
                        ,
                        title:(this.helpTitle || '')
                        ,
                        text:(this.helpText || 'No help defined yet!')
                        ,
                        enabled:true
                    });
                }
            }) //end of onRender
        }); //end of Ext.apply
    } // end of function init
}); // end of extend

// end of file
