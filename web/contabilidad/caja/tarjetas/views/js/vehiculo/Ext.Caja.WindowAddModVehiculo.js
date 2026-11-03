/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Caja.WindowAddModVehiculo
 * @extends Ext.Window
 */

Ext.namespace('Ext.Caja.WindowAddModVehiculo');
Ext.Caja.WindowAddModVehiculo = Ext.extend(Ext.Window, {
//    Properties and Variables
//    accion
//    idioma
//    perfil
//    id
    //Functions
    constructor: function (params) {

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        params.runner = new Ext.util.TaskRunner();
        params.tarea;

        params.title = (params.accion === 'adicionar') ? params.idioma.titlewindowaddVeh
            : params.idioma.titlewindowmodVeh;

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
            anchor: '99%',
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xc1\xc9\xcd\xd3\xda\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            regexText: params.idioma.regexTextDenom,
            maxLength: 100,
            maxLengthText: params.idioma.maxLengthTextDenom,
            allowBlank: false,
            enableKeyEvents: true
        });

        params.tfmatricula = new Ext.form.TextField({
            fieldLabel: params.idioma.headerMatricula,
            disabled: false,
            id: 'tfmatricula' + params.id,
            anchor: '100%',
            maskRe: /^[A-Z0-9]+$/,
            regex: /^[0-9A-Z]+$/,
            regexText: params.idioma.regexTextMatricula,
            maxLength: 10,
            maxLengthText: params.idioma.maxLengthTextMAtricula,
            allowBlank: true,
            enableKeyEvents: true
        });

        params.cbresponsable = new Ext.form.ComboBox({
            fieldLabel: params.idioma.headerResponsable,
            disabledClass: 'disabled-component',
            id: 'cbresponsable' + params.id,
            tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>',
            resizable: true,
            mode: 'remote',
            allowBlank: false,
            hideTrigger: false,
            editable: true,
            readOnly: false,
            selectOnFocus: true,
            store: params.stresponsable = new Ext.data.Store({
                url: 'loadResponsable',
                reader: new Ext.data.JsonReader({
                        root: 'datos',
                        totalProperty: 'cantidad'
                    },
                    [{
                        name: 'id'
                    }, {
                        name: 'denomtipo',
                        type: 'string'
                    }, {
                        name: 'nombre'
                    }
                    ])
            }),
            valueField: 'id',
            displayField: 'nombre',
            disabled: false,
            forceSelection: true,
            minChars: 3,
            pageSize: 10,
            anchor: '99%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true
        });

        params.cbCentroCosto = new Ext.contabilidad.util.linkedCombo({
            id: 'cbCentroCosto',
            anchor: '100%',
            fieldLabel: params.idioma.headerCentroCosto,
            store: params.stCentroCosto = new Ext.data.Store({
                url: 'loadCentroCosto',
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'id'},
                    {name: 'text'},
                    {name: 'descripcion'},
                    {name: 'idtipo'}
                ])
            }),
            displayField: 'text',
            valueField: 'id',
            disabled: false,
            listHeight: 200,
            hideTbar: false,
            lazyRender: true,
            fnCreateNew: Ext.emptyFn
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
            height: 175,
            width: 700,
            keys: {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function () {
                }
            },
            buttons: arrbotones,
            items: [{
                layout: 'form',
                frame: true,
                border: false,
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .8,
                                layout: 'form',
                                labelAlign: 'top',
                                items: [params.tfdenominacion]
                            },
                            {
                                columnWidth: .2,
                                layout: 'form',
                                labelAlign: 'top',
                                items: [params.tfmatricula]
                            }
                        ]
                    },
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .4,
                                layout: 'form',
                                labelAlign: 'top',
                                items: [params.cbresponsable]
                            },
                            {
                                columnWidth: .6,
                                layout: 'form',
                                labelAlign: 'top',
                                items: [params.cbCentroCosto]
                            }
                        ]
                    }
                ]
            }
            ]
        });

        Ext.Caja.WindowAddModVehiculo.superclass.constructor.call(this);

        this.inicializarEventos(params.perfil, params.idioma);

        if (params.accion === 'modificar') {
            this.show();

            this.tfdenominacion.setValue(this.paramsMod.denominacion);
            this.tfmatricula.setValue(this.paramsMod.matricula);

            var recordTemp = Ext.data.Record.create([
                {
                    name: 'id'
                },
                {
                    name: 'denomtipo',
                    type: 'string'
                },
                {
                    name: 'nombre'
                }
            ]);
            var p = new recordTemp({
                id: this.paramsMod.idtrabajdorresponsable,
                denomtipo: this.paramsMod.denomtipo,
                nombre: this.paramsMod.responsable
            });
            this.stresponsable.add(p);
            this.cbresponsable.setValue(this.paramsMod.idtrabajdorresponsable);

            this.cbCentroCosto.setValue(this.paramsMod.idcentrocosto, this.paramsMod.centrocosto);

            //Variables que almacenan los valores cuando se cargan los datos al modificar
            this.oldDenominacion = this.tfdenominacion.getValue();
            this.oldMatricula = this.tfmatricula.getValue();
            this.oldResponsable = this.cbresponsable.getValue();
            this.oldCentroCosto = this.cbCentroCosto.getValue();
        } else {//entonces esta adicionando
            this.show();
        }
    },
    inicializarEventos: function (perfil, idioma) {

        this.on({
            show: function () {
                this.globalKeyMap.disable();

                var arrbotonesvalidate = (this.accion == 'adicionar') ? [this.btnaplicar, this.btnaccept] : [this.btnaccept];
                this.startTaskValidation(this.accion, arrbotonesvalidate);
            },
            close: function () {
                this.globalKeyMap.enable();

                this.stopTaskValidation();

                this.stVehiculo.reload();
            }
        });

        this.btncancelar.on({
            scope: this,
            click: function () {
                this.close();
            }
        });

        this.btnaccept.on({
            scope: this,
            click: function () {
                this.addModVehiculo(false);
            }
        });

        this.btnaplicar.on({
            scope: this,
            click: function () {
                this.addModVehiculo(true);
            }
        });

    },
    startTaskValidation: function (accion, arrbotones) {
        this.tarea = {
            run: function () {
                if (accion === 'adicionar') {
                    if (this.formValid()) {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(false);
                        }
                    } else {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(true);
                        }
                    }
                } else {
                    if (this.formValid() && this.fieldsModified()) {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(false);
                        }
                    } else {
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

        var denominacionvalid = this.tfdenominacion.isValid();

        var matriculavalid = this.tfmatricula.isValid();

        var responsablevalid = this.cbresponsable.isValid();

        var centrocostovalid = this.cbCentroCosto.isValid();

        return denominacionvalid && matriculavalid && responsablevalid && centrocostovalid;
    },
    fieldsModified: function () {

        var denominacioModified = this.oldDenominacion != this.tfdenominacion.getValue();

        var matriculaModified = this.oldMatricula != this.tfmatricula.getValue();

        var responsableModified = this.oldResponsable != this.cbresponsable.getValue();

        var centrocostoModified = this.oldCentroCosto != this.cbCentroCosto.getValue();

        return denominacioModified || matriculaModified || responsableModified || centrocostoModified;
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
    addModVehiculo: function (aplicar) {
        var denominacion = this.tfdenominacion.getValue().toUpperCase();
        var matricula = this.tfmatricula.getValue().toUpperCase();
        var responsable = this.cbresponsable.getValue();
        var centroCosto = this.cbCentroCosto.getValue();

        var idvehiculo = null;
        if (this.accion == 'modificar') {
            idvehiculo = this.paramsMod.idvehiculo;
        }

        var msgAddMod = (this.accion == 'adicionar') ? this.idioma.titleAdicionando : this.idioma.titleModificando;
        this.onloadMessageBox(msgAddMod, this.idioma.msgEspere);

        Ext.Ajax.request({
            method: "POST",
            url: "addModVehiculo",
            params: {
                denominacion: denominacion,
                matricula: matricula,
                responsable: responsable,
                centroCosto: centroCosto,
                idvehiculo: idvehiculo,
                idcombustible: this.idcombustible
            },
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var res = Ext.decode(response.responseText);

                if (res.success) {
                    var msgSuccess = (this.accion == 'adicionar') ? this.idioma.msgAddSuccessVehiculo : this.idioma.msgModSuccessVehiculo;
                    mostrarMensaje(1, msgSuccess);

                    if (aplicar) {
                        this.tfdenominacion.setValue('');
                        this.tfmatricula.setValue('');
                        this.cbresponsable.clearValue();
                        this.cbCentroCosto.reset();
                    } else {
                        this.close();
                    }
                } else {
                    if (res.codMg == -1)
                        mostrarMensaje(1, 'Ya existe un vehículo con esta matrícula.');
                }
            }
        });
    }
});