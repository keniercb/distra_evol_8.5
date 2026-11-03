Ext.namespace('Ext.Caja.WindowNomSellos');
Ext.Caja.WindowNomSellos = Ext.extend(Ext.Window, {

    constructor: function (params) {
        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        params.runner = new Ext.util.TaskRunner();
        params.tarea;

        params.title = (params.accion === 'adicionar') ? params.idioma.titlewindowaddSell
            : params.idioma.titlewindowmodSell;

        this.btnAccept = new Ext.Button({
            id: 'btnaccept' + params.id,
            text: params.idioma.textbtnAceptar,
            iconCls: 'aceptar',
            tooltip: params.idioma.tooltipbtnAceptar,
            disabled: true
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnaplicar' + params.id,
            text: params.idioma.textbtnAplicar,
            iconCls: 'aplicar',
            tooltip: params.idioma.tooltipbtnAplicar,
            disabled: true
        });

        this.btnCancelar = new Ext.Button({
            id: 'btncancelar' + params.id,
            text: params.idioma.textbtnCancelar,
            iconCls: 'cancelar',
            minWidth: 80,
            tooltip: params.idioma.tooltipbtnCancelar
        });

        this.firstElement = this.tfdenominacion = new Ext.form.TextField({
            fieldLabel: params.idioma.headerDenomSell,
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
//Combo para moneda
        this.rdMoneda = new Ext.data.JsonReader({
            root: 'datos'
        }, [{
            name: 'nombremoneda'
        }, {
            name: 'codigoiso'
        }, {
            name: 'idmoneda'
        }, {
            name: 'idmonedaentidad'
        }
        ]);

        this.stMoneda = new Ext.data.Store({
            url: 'cargarmonedas',
            reader: this.rdMoneda,
            autoLoad: true
        });

        this.cbMoneda = new Ext.form.ComboBox({
            fieldLabel: 'Moneda',
            store: this.stMoneda,
            name: 'idmoneda',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            disabled: false,
            readOnly:true,
            id: 'cbMoneda',
            anchor: '98%',
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            enableKeyEvents: true
        });

        //-----------------
        this.nfImporte = new Ext.form.NumberField({
            fieldLabel: params.idioma.headerPrecio,
            disabledClass: 'disabled-component',
            disabled: false,
            style: 'text-align:right;',
            anchor: '100%',
            // maxLength: 16,
            // maxLengthText: params.idioma.maxLengthTextPrecio,
            // regex: /^[0-9]+.([0-9]{1,2})?$/,
            maskRe: /^[0-9]$/,
            regexText: params.idioma.regexTextPrecio,
            allowBlank: false,
            selectOnFocus: true,
            enableKeyEvents: true,
            //value: '0.00',
            validator: function (value) {
                if (parseFloat(value) == 0) {
                    return params.idioma.msgNoCero;
                }
                return true;
            }
        });

        var arrbotones = (params.accion == 'adicionar') ? [this.btnCancelar, this.btnAplicar, this.btnAccept] : [this.btnCancelar, this.btnAccept];

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
                fn: function () {
                }
            },
            buttons: arrbotones,
            items: [{
                layout: 'column',
                frame: true,
                border: false,
                items: [
                    {
                        columnWidth: .5,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.tfdenominacion]
                    },
                    {
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.cbMoneda]
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.nfImporte]
                    }
                ]
            }
            ]
        });

        Ext.Caja.WindowNomSellos.superclass.constructor.call(this);

        this.inicializarEventos(params.perfil, params.idioma);

        if (params.accion === 'modificar') {
            this.show();
            this.tfdenominacion.setValue(this.paramsMod.denominacion);
            this.cbMoneda.setValue(this.paramsMod.idmoneda);
            this.cbMoneda.setRawValue(this.paramsMod.codigoiso);
            this.nfImporte.setValue(formatoMoneda(this.paramsMod.importe));

            //Cargando los datos en estas variables para poder saber si hay cambios
            this.oldDenominacion = this.tfdenominacion.getValue();
            this.oldIdmoneda = this.cbMoneda.getValue();
            this.oldImporte = this.nfImporte.getValue();
        }
        else {//entonces esta adicionando
            this.show();
            this.tfdenominacion.focus(true, 1000);
        }
    },
    inicializarEventos: function (perfil, idioma) {

        this.on({
            scope: this,
            show: function () {
                this.globalKeyMap.disable();

                var arrbotonesvalidate = (this.accion == 'adicionar') ? [this.btnAplicar, this.btnAccept] : [this.btnAccept];
                this.startTaskValidation(this.accion, arrbotonesvalidate);
            },
            close: function () {
                this.globalKeyMap.enable();

                this.stopTaskValidation();

                this.stSellos.reload();
            }
        });

        this.btnCancelar.on({
            scope: this,
            click: function () {
                this.close();
            }
        });

        this.btnAccept.on({
            scope: this,
            click: function () {
                this.addModSellos(false);
            }
        });

        this.btnAplicar.on({
            scope: this,
            click: function () {
                this.addModSellos(true);
            }
        });

        // this.nfImporte.on({
        //     scope: this,
        //     blur: function (field) {
        //         var value = cleanComa(field.getValue());
        //         field.setValue(formatoMoneda(value));
        //     }
        // });
    },
    startTaskValidation: function (accion, arrbotones) {
        this.tarea = {
            run: function () {
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
    stopTaskValidation: function () {
        if (!Ext.isEmpty(this.tarea)) {
            this.runner.stop(this.tarea);
        }
    },
    formValid: function () {
        return this.tfdenominacion.isValid() && this.nfImporte.isValid();
    },
    fieldsModified: function () {
        var denominacionChanged = this.oldDenominacion != this.tfdenominacion.getValue();

        // var importeChanged = cleanComa(this.oldImporte) != cleanComa(this.nfImporte.getValue());
        var importeChanged = this.oldImporte != this.nfImporte.getValue();

        return denominacionChanged || importeChanged;
    },
    onloadMessageBox: function (agTtl, agMsg) {
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
    addModSellos: function (aplicar) {
        var denominacion = this.tfdenominacion.getValue();
        var idmoneda = this.cbMoneda.getValue();
        // var importe = cleanComa(this.nfImporte.getValue());
        var importe = this.nfImporte.getValue();
        var idsellos = null;
        if (this.accion == 'modificar') {
            idsellos = this.paramsMod.idsellos;
        }

        var msgAddMod = (this.accion == 'adicionar') ? this.idioma.titleAdicionando : this.idioma.titleModificando;
        this.onloadMessageBox(msgAddMod, this.idioma.msgEspere);

        Ext.Ajax.request({
            method: "POST",
            url: "addModSellos",
            params: {
                denominacion: denominacion,
                idmoneda: idmoneda,
                importe: importe,
                idsellos: idsellos
            },
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var res = Ext.decode(response.responseText);

                if (res.success) {
                    var msgSuccess = (this.accion == 'adicionar') ? 'El desglose de sello ha sido adicionado satisfactoriamente' : 'El desglose de sello ha sido modificado satisfactoriamente';
                    mostrarMensaje(1, msgSuccess);

                    if (aplicar) {
                        this.tfdenominacion.setValue('');
                        this.nfImporte.setValue('0.00');
                    }
                    else {
                        this.close();
                    }
                }
            }
        });
    }
});