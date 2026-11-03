/**
 * Created by john on 15/05/15.
 */

/**
 * Script con la clas FormValidator
 * requires : [
 *      _ExtBase(dev).s
 *  ]
 */

(function(_){

    var cls = _.Class,
        utils = _.Utils;

    _.FormValidator = cls({
        $extend : Ext.util.Observable,
        buttons : null,
        fields: null,
        start : null,
        keyMapContainer : null,
        buttonsRegister : null,
        otherIsValid : null,
        checkAll : null,
        checkDirty : true,
        xtypes : {
            checkbox: {
                evt: ['check']
            },
            combobox: {
                evt: ['select','keyup']
            },
            genesigcombobox: {
                evt: ['validation']
            },
            combo: {
                evt: ['select','keyup']
            },
            textarea: {
                evt: ['keyup']
            },
            textfield: {
                evt: ['keyup']
            },
            numberfield: {
                evt: ['keyup']
            },
            simpleField: {
                evt: ['keyup']
            },
            fieldDenom: {
                evt: ['keyup']
            },
            fieldDescripcion: {
                evt: ['keyup']
            },
            fieldPasswd: {
                evt: ['keyup']
            },
            fieldsPasswd: {
                evt: ['keyup']
            },
            genesignumberfiel: {
                evt: ['keyup']
            },
            radio: {
                evt: ['check']
            },
            field: {
                evt: ['keyup']
            },
            fieldSetProjectionGMS: {
                evt: ['eventProjecGMS']
            },
            triggerfieldlayer: {
                evt: ['setvalue']
            },
            triggerfieldconnection: {
                evt: ['setvalue']
            },
            gistriggerfield:{
                evt: ['setvalue']
            },
            gis_fileuploadfield:{
                evt: ['fileselected']
            },
            datefield:{
                evt: ['select', 'keyup']
            },
            grid: {
                evt: ['change']
            }
        },
        constructor : function(pConfig){
            var utils = _.Utils,
                fnCheckDataType = utils.checkDataType,
                config = fnCheckDataType(pConfig,{});

            this.buttons = fnCheckDataType(config.buttons,[]);
            this.fields = fnCheckDataType(config.fields,[]);
            this.start = fnCheckDataType(config.autoStartValidator,true);
            this.checkDirty = fnCheckDataType(config.checkDirty,true);
            this.keyMapContainer = config.keyMapContainer;
            this.buttonsRegister = config.buttonsRegister;
            this.otherIsValid = config.otherIsValid;
            this.checkAll = config.checkAll;         
            
            this.init();
            this.addEvents({
                check : true
            });
        },
        init : function () {
            this.initButtons();
            this.initFields();
        },
        initButtons : function () {
            if (this.buttons) {
                var buttonsLength = this.buttons.length;
                //noinspection JSDuplicatedDeclaration
                for (var i = 0; i < buttonsLength; i++) {
                    var button = this.buttons[i];
                    if (button && button.handler && !button.reconfiguredHandler) {
                        button.reconfiguredHandler = true;
                        button.fn = button.handler;
                        /*button.handler = function (b) {
                            if (b && !b.disabled) {
                                b.fn.call(b.scope || b, b);
                            }
                        }*/
                    }
                }
            }

            if (this.keyMapContainer) {
                this.applyButtonsKey(this.buttons, this.keyMapContainer);
                if (this.buttonsRegister) {
                    this.applyButtonsKey(this.buttonsRegister, this.keyMapContainer);
                }
            }
        },
        initFields : function () {
            if (this.fields) {
                this.resetOriginalValues();
                var fieldsLength = this.fields.length;
                //noinspection JSDuplicatedDeclaration
                for (var i = 0; i < fieldsLength; i++) {
                    if (this.fields[i].getXType() && this.xtypes[ this.fields[i].getXType()]) {
                        // Habilitar el trabajo con los eventos de las teclas
                        this.initializeEvent(this.fields[i]);
                    }
                }
            }
        },
        applyButtonsKey : function (buttons, keyContainer) {
            utils.applyButtonsKey(buttons, keyContainer);
        },
        resetOriginalValues : function () {
            if (this.fields) {
                //--------------------------DESHABILITO TODOS LOS BOTONES------------------------------
                if (this.buttons) {
                    this.habilitarBotones(this.buttons, false);
                }

                if (!this.checkDirty) {
                    //this.habilitarBotones(this.buttons, true);
                    return;
                }

                for (var i = 0; i < this.fields.length; i++) {
                    this.resetOriginalValue(this.fields[i]);
                }
            }
        },
        resetOriginalValue : function (field) {
            if (field.getValue) {
                if(field.resetOriginalValue){
                    field.resetOriginalValue();
                }else{
                    field.originalValue = field.getValue();
                }
            }
            if (field.clearInvalid) {
                field.clearInvalid();
            }
        },
        registrarNuevoXtype : function (name, props) {
            if (props) {
                if (utils.isObject(props)) {
                    if (this.xtypes.hasOwnProperty(name)) {
                        var addEvent = true;
                        for (var j = 0; j < this.xtypes[name].evt.length; j++) {
                            if (this.xtypes[name].evt[j] == props.evt) {
                                addEvent = false;
                                break;
                            }
                        }

                        if (addEvent)
                            this.xtypes[name].evt.push(props.evt);
                    }
                    else {
                        this.xtypes[name] = {
                            evt: Ext.isArray(props.evt) ? props.evt : [props.evt]
                        };
                    }
                }
                else if (typeof(props) == 'string' && this.xtypes.hasOwnProperty(props)) {
                    this.xtypes[name] = {
                        evt: this.xtypes[props].evt
                    };
                }

                for (var i = 0; i < this.fields.length; i++) {
                    if (this.fields[i].getXType() && this.xtypes[this.fields[i].getXType()] && this.fields[i].getXType() == name) {
                        // Habilitar el trabajo con los eventos de las teclas para este fild
                        this.initializeEvent(this.fields[i]);
                    }
                }
            }
        },
        habilitarBotones : function (arrayButtons, enable) {
            if(!arrayButtons){
                return;
            }
            for (var i = 0; i < arrayButtons.length; i++) {
                var button = arrayButtons[i];
                if (button && button.disabled == enable)
                    button.setDisabled(!enable);
            }

            //this.fireEvent('changeEnableButtons', {enable: enable});
        },
        initializeEvent : function (field) {
            var th = this;
            if (this.xtypes.hasOwnProperty(field.getXType()) && this.xtypes[field.getXType()].hasOwnProperty('evt')) {
                // Habilitar el trabajo con los eventos de las teclas
                for (var i = 0; i < this.xtypes[field.getXType()].evt.length; i++) {
                    if (this.xtypes[field.getXType()].evt[i] == 'keyup' && !field.enableKeyEvents) {
                        field.enableKeyEvents = true;

                        if (field.rendered) {
                            field.mon(field.el, 'keyup', field.onKeyUp, field);
                            field.mon(field.el, 'keydown', field.onKeyDown, field);
                            field.mon(field.el, 'keypress', field.onKeyPress, field);
                        }
                        else {
                            field.on('afterrender', function () {
                                this.mon(this.el, 'keyup', this.onKeyUp, this);
                                this.mon(this.el, 'keydown', this.onKeyDown, this);
                                this.mon(this.el, 'keypress', this.onKeyPress, this);
                            });
                        }
                        break;
                    }
                }

                //------------------AGREGO EVENTO A CADA CAMPO DEPENDIENDO DEL XTYPE DEL MISMO--------------
                for (var j = 0; j < this.xtypes[field.getXType()].evt.length; j++) {
                    field.on(this.xtypes[field.getXType()].evt[j], function(){
                        th.check();
                    });
                }

                if (!field.isDirty) {
                    field.isDirty = function () {
                        return (this.getValue() != this.originalValue);
                    }
                }
            }
        },
        check : function () {
            var valid = true;

            if (!this.start) {
                return;
            }

            var fnIsValid = this.otherIsValid ? this.otherIsValid : 'isValid';

            var visible;
            for (var i = 0; i < this.fields.length; i++) {
                if (!this.fields[i].isVisible) {
                    visible = true;
                }
                else {
                    visible = this.fields[i].isVisible();
                }
                if (!this.fields[i].disabled && visible && this.fields[i][fnIsValid] && !this.fields[i][fnIsValid]()) {
                    this.habilitarBotones(this.buttons, false);
                    valid = false;
                    if(!this.checkAll){
                        return;
                    }
                }
            }

            if(!valid){
                return;
            }

            if (!this.checkDirty) {
                this.habilitarBotones(this.buttons, true);
                return;
            }
            else {
                for (var j = 0; j < this.fields.length; j++) {
                    if (!this.fields[j].isVisible) {
                        visible = true;
                    }
                    else {
                        visible = this.fields[j].isVisible();
                    }

                    if (!this.fields[j].disabled && visible && this.fields[j].isDirty()) {
                        this.habilitarBotones(this.buttons, true);
                        return;
                    }
                }
            }

            this.habilitarBotones(this.buttons, false);
        },
        startValidator : function () {
            this.start = true;
        },
        stopValidator : function () {
            this.start = false;
        },
        addButton : function (button) {
            this.buttons.push(button);
        },
        setButtons : function (pbuttons) {
            this.buttons = pbuttons;
            this.initButtons();
        },
        addField : function (field) {
            this.fields.push(field);

            this.initializeEvent(field);
        },
        getXtypes : function () {
            return this.xtypes;
        },
        resetFieldsValues : function () {
            if (this.fields.length > 0) {
                for (var i = 0; i < this.fields.length; i++) {
                    this.fields[i].setValue ? this.fields[i].setValue('') : '';
                    this.fields[i].clearInvalid ? this.fields[i].clearInvalid() : '';
                }
                this.habilitarBotones(this.buttons, false);
            }
        }        
    });

})(ExtExtend);