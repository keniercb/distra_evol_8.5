/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.WindowAddModDesagregacionPresup
 * @extends Ext.Window
 */

Ext.namespace('Ext.Cont.WindowAddModDesagregacionPresup');
Ext.Cont.WindowAddModDesagregacionPresup = Ext.extend(Ext.Window, {
//    Properties and Variables
//    accion
//    idioma
//    perfil
//    id
    //Functions
    constructor: function(params) {

//        this.addEvents('');

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        params.runner = new Ext.util.TaskRunner();
        params.tarea;

        params.title = (params.accion === 'adicionar') ? params.idioma.titlewindowadd
                : params.idioma.titlewindowmod;

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

        params.cbAnalisis = new Ext.form.ComboBox({
            id: 'cbAnalisis',
            anchor: '100%',
            fieldLabel: params.idioma.lbAnalisis,
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: false,
            store: params.stAnalisis = new Ext.data.JsonStore({
                url: '',
                root: 'datos',
                fields: [
                    {
                        name: 'idparteformato'
                    }, {
                        name: 'nombre'
                    }
                ]
            }),
            valueField: 'idparteformato',
            displayField: 'nombre'
        });

        params.cbCuenta = new Ext.form.ComboBox({
            id: 'cbCuenta',
            anchor: '100%',
            fieldLabel: params.idioma.lbCuenta,
            allowBlank: false,
            forceSelection: true,
            //typeAhead: true,
            disabled: true,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 3,
            store: params.stCuenta = new Ext.data.JsonStore({
                url: 'loadCuentaByAnalisis',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idcuenta'
                    }, {
                        name: 'text'
                    }
                ]
            }),
            valueField: 'idcuenta',
            displayField: 'text'
        });

        params.stCuenta.on({
            scope: this,
            beforeload: function () {
                params.stCuenta.baseParams.idparteformato = params.cbAnalisis.getValue();
                this.myMask = new Ext.LoadMask(this.body, {msg: this.idioma.msgCargando});
                this.myMask.show();
            },
            load: function () {
                this.cbCuenta.enable();
                this.cbCuenta.focus(true, true);
                if(this.myMask)
                this.myMask.hide();
            }
        });

        params.nfSaldo = new Ext.form.NumberField({
            id: 'nfSaldo',
            allowBlank: false,
            allowDecimals: true,
            allowNegative: false,
            decimalPrecision: 2,
            selectOnFocus: true
        });

        params.nfSaldoTotal = new Ext.form.NumberField({
            id: 'nfSaldoTotal',
            allowBlank: false,
            allowDecimals: true,
            allowNegative: false,
            decimalPrecision: 2,
            disabled: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            minValue: 0.01,
            enableKeyEvents: true
        });

        params.nfSumaControl = new Ext.form.NumberField({
            id: 'nfSumaControl',
            allowBlank: false,
            allowDecimals: true,
            allowNegative: false,
            decimalPrecision: 2,
            readOnly: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true
        });

        params.gpPeriodos = new Ext.grid.EditorGridPanel({
            frame: true,
            border: false,
            autoScroll: true,
            stripeRows: true,
            id: 'gpPeriodos',
            clicksToEdit: 2,
            autoExpanColunm: 'nombreperiodo',
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            store: new Ext.data.Store({
                url: '',
                reader: new Ext.data.JsonReader({
                    id: 'idperiodo',
                    totalProperty: 'cant',
                    root: 'datos'
                }, [{
                        name: 'idperiodo'
                    }, {
                        name: 'saldo',
                        type: 'float'
                    }, {
                        name: 'nombreperiodo'
                    }, {
                        name: 'iddesagregacionpresupperiodo'
                    }
                ])
            }),
            cm: new Ext.grid.ColumnModel([
                {
                    id: 'nombreperiodo',
                    header: params.idioma.lbPeriodo,
                    dataIndex: 'nombreperiodo',
                    width: 160,
                    sortable: false,
                    align: 'left'
                }, {
                    header: params.idioma.lbSaldo,
                    dataIndex: 'saldo',
                    width: 160,
                    align: 'right',
                    sortable: true,
                    editor: params.nfSaldo
                }
            ]),
            tbar: [params.idioma.lbSaldoTotal, params.nfSaldoTotal],
            bbar: ['->', params.idioma.lbsumaControl, params.nfSumaControl]
        });

        var arrbotones = (params.accion == 'adicionar') ? [params.btncancelar, params.btnaplicar, params.btnaccept] : [params.btncancelar, params.btnaccept]

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'window' + params.id,
            border: false,
            closeAction: 'close',
            layout: 'border',
            constrain: true,
            modal: true,
            resizable: false,
            height: 540,
            width: 380,
            animateTarget: 'btnAdicionar',
            keys: {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function() {
                }
            },
            buttons: arrbotones,
            items: [{
                    layout: 'form',
                    region: 'north',
                    frame: true,
                    border: false,
                    labelAlign: 'top',
                    height: 110,
                    items: [params.cbAnalisis, params.cbCuenta]
                }, {
                    region: 'center',
                    layout: 'fit',
                    frame: true,
                    border: false,
                    items: params.gpPeriodos
                }
            ]
        });

        Ext.Cont.WindowAddModDesagregacionPresup.superclass.constructor.call(this);

        if (params.accion === 'modificar') {
            this.show();

            this.loadDataMod();
        }
        else {//entonces esta adicionando
            this.show();

            this.loadDataAdd();
        }

        this.inicializarEventos(params.perfil, params.idioma);
    },
    inicializarEventos: function(perfil, idioma) {

        this.on({
            show: function() {
                var arrbotonesvalidate = (this.accion == 'adicionar') ? [this.btnaplicar, this.btnaccept] : [this.btnaccept];
                this.startTaskValidation(this.accion, arrbotonesvalidate);
            },
            close: function() {
                this.stopTaskValidation();
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
                this.addModDesagregacion(false);
            }
        });

        this.btnaplicar.on({
            scope: this,
            click: function() {
                this.addModDesagregacion(true);
            }
        });

        this.cbAnalisis.on({
            scope: this,
            select: function(combo, record, index) {
                //this.loadCuentaByAnalisis(record.data.idparteformato);
                this.cbCuenta.store.load({
                    params: {
                        idparteformato: record.data.idparteformato,
                        start: 0,
                        limit: 100
                    }
                });
            }
        });

        this.cbCuenta.on({
            scope: this,
            beforeselect: function(combo, record, index) {
                var storeDesagregacion = this.storeDesagregacion;

                var index = storeDesagregacion.find('idcuenta', record.data.idcuenta);
                if (index !== -1) {
                    mostrarMensaje(1, this.idioma.msgCuentaExiste);
                    return false;
                }
            },
            select: function(combo, record, index) {
                this.nfSaldoTotal.focus(true, true);
            }
        });

        this.nfSaldoTotal.validator = function(value) {
            var sumtotal = this.fSaldo(this.gpPeriodos.getStore().sum('saldo'));
            if (parseFloat(value).toFixed(2) != parseFloat(sumtotal).toFixed(2)) {
                return this.idioma.sumDiferente;
            }
            this.nfSumaControl.validate();
            return true;
        }.bind(this);

        this.nfSaldoTotal.on({
            scope: this,
            keyup: function(field, event) {
                if (event.getKey() == 13) {
                    this.gpPeriodos.startEditing(0, 1);
                }
            }
        });

        this.nfSumaControl.validator = function(value) {
            if (value != this.nfSaldoTotal.getValue()) {
                return this.idioma.sumDiferente;
            }
            return true;
        }.bind(this);

        this.gpPeriodos.on({
            scope: this,
            afteredit: function(conf) {
                var sum = this.fSaldo(this.gpPeriodos.getStore().sum('saldo'));
                this.nfSumaControl.setValue(sum);
                this.nfSaldoTotal.validate();
                this.nfSumaControl.validate();

                if (conf.value == 0) {
                    conf.record.commit();
                }

                if (this.accion == 'modificar') {
                    var property = 'saldo' + conf.record.data.nombreperiodo + this.nombreejercicio;

                    var valorsinMod = this.paramsMod[property];

                    if (conf.value == valorsinMod) {
                        conf.record.commit();
                    }
                }
            }
        });

    },
    loadDataAdd: function() {
        var idejercicio = this.idejercicio;

        var myMask = new Ext.LoadMask(this.body, {msg: this.idioma.msgCargando});
        myMask.show();
        Ext.Ajax.request({
            method: "POST",
            url: "loadDataAdd",
            params: {
                idejercicio: idejercicio
            },
            scope: this,
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);

                if (responseData.dataParteFormato.cant == 0) {
                    mostrarMensaje(1, this.idioma.msgnoFormatos);
                    this.close();
                }
                else if (responseData.dataGrid.cant == 0) {
                    mostrarMensaje(1, this.idioma.msgnoPeriodos);
                    this.close();
                }
                else {
                    this.gpPeriodos.getStore().loadData(responseData.dataGrid);
                    this.cbAnalisis.store.loadData(responseData.dataParteFormato);
                    this.nfSumaControl.setValue(this.fSaldo(this.gpPeriodos.getStore().sum('saldo')));
                }

                this.cbAnalisis.focus(true, true);

                myMask.hide();
            }
        });
    },
	fSaldo: function (v) {
            if (v == '')
                return '0.00';
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v < 0) ? v * (-1) : v;
            if (isNaN(v))
                return '0.00';
            return v.toFixed(2);
	},
    loadDataMod: function() {

        var myMask = new Ext.LoadMask(this.body, {msg: this.idioma.msgCargando});
        myMask.show();
        Ext.Ajax.request({
            method: "POST",
            url: "loadDataMod",
            params: {
                iddesagregacionpresupejercicio: this.paramsMod.iddesagregacionpresupejercicio,
                idparteformato: this.paramsMod.idparteformato
            },
            scope: this,
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);

                if (responseData.dataParteFormato.cant == 0) {
                    mostrarMensaje(1, this.idioma.msgnoFormatos);
                    this.close();
                }
                else if (responseData.dataGrid.cant == 0) {
                    mostrarMensaje(1, this.idioma.msgnoPeriodos);
                    this.close();
                }
                else if (responseData.dataCuenta.cant == 0) {
                    mostrarMensaje(1, this.idioma.msgnoCuentaConfiguradas);
                    this.close();
                }
                else {
                    this.gpPeriodos.getStore().loadData(responseData.dataGrid);
                    this.cbAnalisis.store.loadData(responseData.dataParteFormato);
                    this.cbCuenta.enable();
                    this.cbCuenta.store.loadData(responseData.dataCuenta);

                    this.nfSumaControl.setValue(this.fSaldo(this.gpPeriodos.getStore().sum('saldo')));
                    this.nfSaldoTotal.setValue(this.paramsMod.saldototal);
                    this.cbAnalisis.setValue(this.paramsMod.idparteformato);
                    this.cbCuenta.setValue(this.paramsMod.idcuenta);

                    //Valores para la validacion del modificar
                    this.oldCuenta = this.paramsMod.idcuenta;
                    this.oldAnalisis = this.paramsMod.idparteformato;
                }

                this.cbAnalisis.focus(true, true);

                myMask.hide();
            }
        });

    },
    loadCuentaByAnalisis: function(idparteformato) {

        var myMask = new Ext.LoadMask(this.body, {msg: this.idioma.msgCargando});
        myMask.show();

        Ext.Ajax.request({
            method: "POST",
            url: "loadCuentaByAnalisis",
            params: {
                idparteformato: idparteformato
            },
            scope: this,
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);

                this.cbCuenta.clearValue();
                this.cbCuenta.store.loadData(responseData.dataCuenta);

                this.cbCuenta.enable();
                this.cbCuenta.focus(true, true);

                myMask.hide();
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
        var analisisValid = this.cbAnalisis.isValid();

        var cuentaValid = this.cbCuenta.isValid();

        var saldoTotalValid = this.nfSaldoTotal.isValid() && this.nfSaldoTotal.getValue() > 0;

        var sumaControlValid = this.nfSumaControl.isValid();

        return analisisValid && cuentaValid && saldoTotalValid && sumaControlValid;
    },
    fieldsModified: function() {
        var analisisModified = (this.oldAnalisis != this.cbAnalisis.getValue());

        var cuentaModified = (this.oldCuenta != this.cbCuenta.getValue());

        var recordsModificados = this.gpPeriodos.getStore().getModifiedRecords();
        var rModified = (recordsModificados.length > 0);

        return analisisModified || cuentaModified || rModified;
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
    addModDesagregacion: function(btnaplicar) {
///
        var arrfieldsstore = new Array();
        arrfieldsstore.push({name: 'idparteformato'});
        arrfieldsstore.push({name: 'nombreformato'});
        arrfieldsstore.push({name: 'idcuenta'});
        arrfieldsstore.push({name: 'cuenta'});
        arrfieldsstore.push({name: 'saldototal'});
        arrfieldsstore.push({name: 'iddesagregacionpresupejercicio'});
        arrfieldsstore.push({name: 'idejercicio'});
        arrfieldsstore.push({name: 'idestructuracomun'});
///
        var generalData = {
            iddesagregacionpresupejercicio: this.paramsMod.iddesagregacionpresupejercicio,
            idejercicio: this.idejercicio,
            idparteformato: this.cbAnalisis.getValue(),
            saldototal: this.nfSaldoTotal.getValue(),
            idcuenta: this.cbCuenta.getValue()
        };
///
        var data = generalData;
        data.nombreformato = this.cbAnalisis.getRawValue();
        data.cuenta = this.cbCuenta.getRawValue();
///
        var periodos = new Array();
        var rangoperiodos = this.gpPeriodos.getStore().getRange();

        for (var i = 0, long = rangoperiodos.length; i < long; i++) {
            periodos.push({
                iddesagregacionpresupperiodo: rangoperiodos[i].data.iddesagregacionpresupperiodo,
                idperiodo: rangoperiodos[i].data.idperiodo,
                saldo: rangoperiodos[i].data.saldo
            });
            ///
            arrfieldsstore.push({name: 'saldo' + rangoperiodos[i].nombre + this.nombreejercicio});
            data["saldo" + rangoperiodos[i].data.nombreperiodo + this.nombreejercicio] = rangoperiodos[i].data.saldo;
            ///
        }
        ///
        var tempData = new Ext.data.Record.create(arrfieldsstore);
        var a = new tempData(data);

        this.onloadMessageBox(this.idioma.msgAdicionando, this.idioma.msgEspere);

        Ext.Ajax.request({
            method: "POST",
            url: "addMod",
            params: {
                generalData: Ext.encode(generalData),
                periodos: Ext.encode(periodos)
            },
            scope: this,
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);

                if (responseData.success) {
                    var msg = (this.accion == 'adicionar') ? this.idioma.msgAdicionadoSuccess : this.idioma.msgModificadoSuccess;
                    mostrarMensaje(1, msg);
                    if (btnaplicar) {
                        ///
                        this.storeDesagregacion.add(a);
                        ///
                        this.cbAnalisis.clearValue();
                        this.cbCuenta.clearValue();
                        this.nfSaldoTotal.setValue(0.00);
                        this.nfSumaControl.setValue(0.00);

                        for (var j = 0, long = rangoperiodos.length; j < long; j++) {
                            rangoperiodos[j].set('saldo', 0.00);
                            rangoperiodos[j].commit();
                        }
                        ///
                        this.gridDesagregacion.getView().refresh();
                        ///
                    }
                    else {
                        this.close();
                    }
                }

                Ext.MessageBox.hide();
            }
        });

    }
});




