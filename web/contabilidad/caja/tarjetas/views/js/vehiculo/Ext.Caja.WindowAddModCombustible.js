/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Caja.WindowAddModCombustible
 * @extends Ext.Window
 */

Ext.namespace('Ext.Caja.WindowAddModCombustible');
Ext.Caja.WindowAddModCombustible = Ext.extend(Ext.Window, {
//    Properties and Variables
//    accion
//    idioma
//    perfil
//    id
    //Functions
    constructor: function(params) {

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        params.runner = new Ext.util.TaskRunner();
        params.tarea;

        params.title = (params.accion === 'adicionar') ? params.idioma.titlewindowaddCom
                : params.idioma.titlewindowmodCom;

        params.btnaccept = new Ext.Button({
            id: 'btnaccept' + params.id,
            text: params.idioma.textbtnAceptar,
            iconCls: 'aceptar',
            tooltip: params.idioma.tooltipbtnAceptar,
            disabled: true
        });

        params.btnaplicar = new Ext.Button({
            id: 'btnaplicar' + params.id,
            text: params.idioma.textbtnAplicar,
            iconCls: 'aplicar',
            tooltip: params.idioma.tooltipbtnAplicar,
            disabled: true
        });

        params.btncancelar = new Ext.Button({
            id: 'btncancelar' + params.id,
            text: params.idioma.textbtnCancelar,
            iconCls: 'cancelar',
            minWidth: 80,
            tooltip: params.idioma.tooltipbtnCancelar
        });

        this.firstElement = params.tfdenominacion = new Ext.form.TextField({
            fieldLabel: params.idioma.headerDenomCom,
            disabled: false,
            id: 'tfdenominacion' + params.id,
            anchor: '98%',
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            regexText: params.idioma.regexTextDenom,
            maxLength: 100,
            maxLengthText: params.idioma.maxLengthTextDenom,
            allowBlank: false,
            enableKeyEvents: true
        });

        params.tfprecio = new Ext.form.TextField({
            fieldLabel: params.idioma.headerPrecio,
            disabledClass: 'disabled-component',
            disabled: false,
            id: 'tfprecio' + params.id,
            style: 'text-align:right;',
            anchor: '100%',
            maxLength: 16,
            maxLengthText: params.idioma.maxLengthTextPrecio,
            regex: /^[0-9]+.([0-9]{1,2})?$/,
            maskRe: /^[0-9.]$/,
            regexText: params.idioma.regexTextPrecio,
            allowBlank: false,
            selectOnFocus: true,
            enableKeyEvents: true,
            value: '0.00',
            validator: function(value) {
                if (parseFloat(value) == 0.00) {
                    return params.idioma.msgNoCero;
                }
                return true;
            }
        });

        var arrbotones = (params.accion == 'adicionar') ? [params.btncancelar, params.btnaplicar, params.btnaccept] : [params.btncancelar, params.btnaccept];

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'window' + params.id,
            border: false,
            closeAction: 'close',
            layout: 'fit',
            constrain: true,
            modal: true,
            resizable: false,
            height: 125,
            width: 540,
            keys: {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function() {
                }
            },
            buttons: arrbotones,
            items: [{
                    layout: 'column',
                    frame: true,
                    border: false,
                    items: [
                        {
                            columnWidth: .7,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [params.tfdenominacion]
                        },
                        {
                            columnWidth: .3,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [params.tfprecio]
                        }
                    ]
                }
            ]
        });

        Ext.Caja.WindowAddModCombustible.superclass.constructor.call(this);

        this.inicializarEventos(params.perfil, params.idioma);

        if (params.accion === 'modificar') {
            this.show();
            this.tfdenominacion.setValue(this.paramsMod.denominacion);
            this.tfprecio.setValue(formatoMoneda(this.paramsMod.precio));

            //Cargando los datos en estas variables para poder saber si hay cambios
            this.oldDenominacion = this.tfdenominacion.getValue();
            this.oldPrecio = this.tfprecio.getValue();
        }
        else {//entonces esta adicionando
            this.show();
            this.tfdenominacion.focus(true, 1000);
        }
    },
    inicializarEventos: function(perfil, idioma) {

        this.on({
            scope: this,
            show: function() {
                this.globalKeyMap.disable();

                var arrbotonesvalidate = (this.accion == 'adicionar') ? [this.btnaplicar, this.btnaccept] : [this.btnaccept];
                this.startTaskValidation(this.accion, arrbotonesvalidate);
            },
            close: function() {
                this.globalKeyMap.enable();

                this.stopTaskValidation();
                
                this.stCombustible.reload();
            }
        });

        this.btncancelar.on({
            scope: this,
            click: function() {
                this.close();
            }
        });

        this.btnaccept.on({
            scope: this,
            click: function() {
                this.addModCombustible(false);
            }
        });

        this.btnaplicar.on({
            scope: this,
            click: function() {
                this.addModCombustible(true);
            }
        });

        this.tfprecio.on({
            scope: this,
            blur: function(field) {
                var value = cleanComa(field.getValue());

                field.setValue(formatoMoneda(value));
            }
        });
    },
    startTaskValidation: function(accion, arrbotones) {
        this.tarea = {
            run: function() {
                if (accion === 'adicionar') {
                    if (this.formValid()) {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(false);
                        }
                    }
                    else {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(true);
                        }
                    }
                }
                else {
                    if (this.formValid() && this.fieldsModified()) {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(false);
                        }
                    }
                    else {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(true);
                        }
                    }
                }
            },
            interval: 300,
            scope: this
        };

        this.runner.start(this.tarea);
    },
    stopTaskValidation: function() {
        if (!Ext.isEmpty(this.tarea)) {
            this.runner.stop(this.tarea);
        }
    },
    formValid: function() {
        var denominacionValid = this.tfdenominacion.isValid();

        var precioValid = this.tfprecio.isValid();

        return denominacionValid && precioValid;
    },
    fieldsModified: function() {
        var denominacionChanged = this.oldDenominacion != this.tfdenominacion.getValue();

        var precioChanged = cleanComa(this.oldPrecio) != cleanComa(this.tfprecio.getValue());

        return denominacionChanged || precioChanged;
    },
    onloadMessageBox: function(agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    addModCombustible: function(aplicar) {
        var denominacion = this.tfdenominacion.getValue();
        var precio = cleanComa(this.tfprecio.getValue());
        var idcombustible = null;
        if (this.accion == 'modificar') {
            idcombustible = this.paramsMod.idcombustible;
        }

        var msgAddMod = (this.accion == 'adicionar') ? this.idioma.titleAdicionando : this.idioma.titleModificando;
        this.onloadMessageBox(msgAddMod, this.idioma.msgEspere);

        Ext.Ajax.request({
            method: "POST",
            url: "addModCombustible",
            params: {
               denominacion: denominacion,
               precio: precio,
               idcombustible: idcombustible
            },
            scope: this,
            callback: function(options, success, response)
            {
                Ext.MessageBox.hide();
                var res = Ext.decode(response.responseText);
                
                if(res.success) {
                    var msgSuccess = (this.accion == 'adicionar') ? this.idioma.msgAddSuccessCombustible : this.idioma.msgModSuccessCombustible;
                    mostrarMensaje(1, msgSuccess);
                    
                    if(aplicar) {
                        this.tfdenominacion.setValue('');
                        this.tfprecio.setValue('0.00');
                    }
                    else {
                        this.close();
                    }
                }
            }
        });
    }
});