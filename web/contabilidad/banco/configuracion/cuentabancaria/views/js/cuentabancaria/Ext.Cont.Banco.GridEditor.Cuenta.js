/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.Banco.GridEditor.Cuenta
 * @extends Ext.grid.EditorGridPanel
 */
Ext.namespace('Ext.Cont.Banco.GridEditor.Cuenta');
Ext.Cont.Banco.GridEditor.Cuenta = Ext.extend(Ext.grid.EditorGridPanel, {
    perfil: {},
    idioma: {},
    arreliminados: new Array(),
    //Functions
    constructor: function(params) {

        this.addEvents('gridvalid', 'insertrow', 'afterrowedit', 'afterrowdeleted', 'beforerowedit');
        this.arreliminados = new Array();
        this.mapaTeclas = null;

        //Variable necesaria para saber  si la cuenta bancaria
        //al modificar esta libre
        this.cuentabancarialibre = true;

        var rowaction = new Ext.grid.RowActions({
            id: 'ra' + params.id,
            actions: [
                {
                    id: 'eliminar',
                    tooltip: params.idioma.tooltipEliminar,
//                    icon: params.perfil.dirImg + 'eliminar.png',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });
        rowaction.on('action', function(grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    this.deleteRows(params.idioma);
                    break;
            }
        }, this);

        var roweditor = params.roweditor = new Ext.Cont.RowEditor({
            id: 'roweditor' + params.id,
            saveText: params.idioma.textbtnaceptarRoweditor,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            cancelText: params.idioma.textbtncancelarRoweditor
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'geditor' + params.id,
            selModel: new Ext.grid.RowSelectionModel({id: 'sm' + params.id}),
            autoScroll: true,
            clicksToEdit: 2
        });

        //Botones que van en el tbar del grid editor
        var btnadd = this.btnadd = new Ext.Button({
            id: 'btnadd' + params.id,
            text: params.idioma.lbbtnaddbtnadd,
//            icon: params.perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            tooltip: params.idioma.tooltipbtnadd
        });

        var btndel = this.btndel = new Ext.Button({
            id: 'btndel' + params.id,
            text: params.idioma.lbtndel,
//            icon: params.perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            hidden: true,
            tooltip: params.idioma.tooltipbtndel
        });

        //Saldo de la cuenta contable seleccionada
        var tfsaldocontable = this.tfsaldocontable = new Ext.form.TextField({
            id: 'tfsaldocontable' + params.id,
            allowBlank: false,
            disabled: true,
            emptyText: '0.00',
            disabledClass: 'disabled-component',
            style: 'text-align:right;'
        });

        var stcuenta = this.stcuenta = new Ext.data.Store({
            url: 'cargarCuentas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuenta'},
                {name: 'denominacion', mapping: 'text'}
            ])
        });

        var cbcuenta = this.cbcuenta = new Ext.contabilidad.util.linkedCombo({
            id: 'combocuentascontables',
            store: stcuenta,
            displayField: 'denominacion',
            valueField: 'idcuenta',
            listHeight: 200,
            lazyRender: true,
            fnCreateNew: Ext.emptyFn
        });

        Ext.apply(this, {
            store: new Ext.data.Store({
                id: 'steditor' + params.id,
//                url: '',
                reader: new Ext.data.JsonReader({
//                    totalProperty: 'total',
                    root: 'datos',
                    id: 'jr' + params.id
                }, [
                    {name: 'idcuenta'},
                    {name: 'denominacion'},
                    {name: 'saldo'},
                    {name: 'valid', type: 'boolean'},
                    {name: 'loaded', type: 'boolean'},
                    {name: 'ctacontlibre', type: 'boolean'},
                    {name: 'idmoneda'}
                ])
            }),
            columns: [
                {
                    id: 'cuenta',
                    header: params.idioma.headerCuentaCont,
                    dataIndex: 'idcuenta',
                    width: 200,
                    editor: cbcuenta,
                    renderer: function(value, metadata, record, rowIndex, colIndex, storegrid) {
                        if (!Ext.isEmpty(record.data.idcuenta)) {
                            var valueField = this.cbcuenta.valueField;
                            var store = this.cbcuenta.getStore();

                            var index = store.find(valueField, record.data.idcuenta);
                            var denominacion = '';
                            if (index === -1) {
                                denominacion = record.data.denominacion;
                            }
                            else {
                                denominacion = store.getAt(index).data.denominacion;
                            }

                            return denominacion;
                        }

                    }.bind(this)
                },
                {
                    id: 'saldoC',
                    header: params.idioma.headerSaldo,
                    dataIndex: 'saldo',
                    width: 60,
                    align: 'right',
                    editor: tfsaldocontable,
                    renderer: function(value, metadata, record, rowIndex, colIndex, storegrid) {
                        var saldo = formatoMoneda(cleanComa(value.toString()));
                        return saldo;
                    }
                },
                rowaction
            ],
            autoExpandColumn: 'cuenta',
            plugins: [rowaction, roweditor],
            tbar: [btnadd, btndel]
        });

        Ext.Cont.Banco.GridEditor.Cuenta.superclass.constructor.call(this);

        this.inicioEventos(this.perfil, this.idioma);
    },
    //Esta función es necesaria para verificar si el grid editor es válido o no
    gridValid: function() {
        return this.getStore().find('valid', false) === -1;
    },
    inicioEventos: function(perfil, idioma) {
        //Este es el primer boton que aparece en el tbar del grid
        this.btnadd.on({
            scope: this,
            click: function(button, e) {
                this.insertarRow();
            }
        });

        this.btndel.on('click', function(button, e) {
            this.deleteRows(idioma);
        }, this);

        this.roweditor.on({
            scope: this,
            afteredit: function(editor, grid, changes, record, rowIndex) {
                record.data.valid = true;
                record.data.denominacion = this.cbcuenta.displayFieldTemp;

                //Poniendo el idmoneda en store del grid
                var nodeselected = this.cbcuenta.tree.getSelectionModel().getSelectedNode();
                record.data.idmoneda = nodeselected.attributes.idmoneda;
                this.cbMoneda.setValue(nodeselected.attributes.idmoneda);

                var gridvalid = this.gridValid();
                this.fireEvent("gridvalid", gridvalid, this, record);
                this.fireEvent("afterrowedit", this, this.getStore().getRange(), record);
            },
            beforeedit: function(roweditor, grid, record, rowIndex) {
                return this.fireEvent("beforerowedit", this, this.getStore().getRange(), record);
            },
            canceledit: function(roweditor, record, rowIndex) {
            },
            validateedit: function(roweditor, grid, changes, record, rowIndex) {
            },
            hide: function() {
                if (this.cbcuenta.tree) {
                    this.cbcuenta.tree.getSelectionModel().clearSelections();
                }
            },
            oninitsetvalue: function(roweditor, field, record) {
                if (field.id === 'combocuentascontables') {
                    field.setValue(record.data.idcuenta, record.data.denominacion);
                    return false;
                }

                if (field.id === 'tfsaldocontablecuentascontables') {
                    field.setValue(formatoMoneda(cleanComa(record.data.saldo.toString())));
                    return false;
                }
            }
        });

        //Evento para el linkedcombo necesario para cuando selecciono un elemnto
        this.cbcuenta.on({
            scope: this,
            select: function(combo, datos) {
                var idcuenta = datos.data.idcuenta;
                var idmoneda = datos.data.idmoneda;

                var store = this.getStore();
                var indexCuenta = store.find('idcuenta', idcuenta);

                if (indexCuenta === -1) {

                    var monedacuentasbien = true;
                    if (store.getCount() > 1) {
                        //Yo compruebo que la cantidad de elementos en el grid de cuentas contables
                        //sea mayor que uno, por lo tanto luego analizo si las cuentas que quiere adicionar
                        //tienen la misma moneda
                        //Si tienen la misma moneda bien, si no tienen la misma moneda lanzar un mensaje
                        //planteando que todas deben ser de una sola moneda
                        var arrcuentas = store.getRange();
                        var cont = 0;
                        Ext.each(arrcuentas, function(item, index, allItems) {
                            if (!Ext.isEmpty(item.data.idmoneda) && item.data.idmoneda != idmoneda) {
                                cont++;
                            }
                        }, this);
                        monedacuentasbien = (cont > 0) ? false : true;
                    }

                    if (!monedacuentasbien) {
                        //Esto pasa cuando las cuentas contables no tienen la misma moneda
                        mostrarMensaje(1, idioma.msgErrorCuentasConMonedaDif);
                        combo.setValue('', '');
                        combo.reset();
                    }
                    else {
                        var myMask = new Ext.LoadMask(this.getGridEl(), {msg: idioma.msgCargandoSaldo});
                        myMask.show();
                        Ext.Ajax.request({
                            url: 'cargarSaldoContable',
                            scope: this,
                            params: {
                                idcuenta: idcuenta,
                                idmoneda: idmoneda
                            },
                            callback: function(options, success, response) {
                                var respuesta = Ext.decode(response.responseText);

                                myMask.hide();
                                if (respuesta.saldo == 'existe') {
                                    //Esta condición se cumple cuando ya existe la 
                                    //contable referida, asociada a una cuenta bancaria
                                    mostrarMensaje(1, idioma.msgErrorCuentaContAsociada);
                                    combo.setValue('', '');
                                    combo.reset();
                                }
                                else {
                                    if (respuesta.saldo == 'no') {
                                        //Esto pasa cuando la cuenta contable no tiene saldo o no se han hecho operaciones.
                                        /*mostrarMensaje(1, idioma.msgErrorCuentaSinSaldo);
                                         combo.setValue('', '');
                                         combo.reset();
                                         this.tfsaldocontable.reset();*/
                                        this.tfsaldocontable.setValue('0.00');
                                    }
                                    else if (respuesta.saldo == 'notasa') {
                                        //Esto es cuando la moneda de la cuenta contable seleccionada no tiene tasa del cierre del día
                                        //asociada
                                        mostrarMensaje(1, idioma.msgErrorTasaCierredelDia);
                                        combo.setValue('', '');
                                        combo.reset();
                                    }
                                    else if (parseFloat(respuesta.saldo) < 0) {
                                        //Esto pasa cuando el saldo de la cuenta contable es negativo
                                        //La cuenta posee saldo contrario a su naturaleza
                                        //Lo que significa que no se le puede asociar a la cuenta bancaria
                                        mostrarMensaje(1, idioma.msgErrorCuentaSaldoNegativo.replace(/<#>/g, formatoMoneda(respuesta.saldo)));
                                        combo.setValue('', '');
                                        combo.reset();
                                    }
                                    else {
                                        this.tfsaldocontable.setValue(formatoMoneda(respuesta.saldo));
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    //Si no se cumple la condición anterior fue que selecciono una cuenta ya existente
                    mostrarMensaje(1, idioma.msgErrorCuentaRepetida);
                    combo.setValue('', '');
                    combo.reset();
                }
            }
        });

        //Evento para mostrar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowselect', function(selmodel, rowIndex, record) {
            if (selmodel.getCount() > 1) {
                this.btndel.show();
            }
        }, this);


        //Evento para ocultar el boton para eliminar varios elementos
        this.getSelectionModel().on('rowdeselect', function(selmodel, rowIndex, record) {
            if (selmodel.getCount() <= 1) {
                this.btndel.hide();
            }
        }, this);

        this.on({
            scope: this,
            gridvalid: function(state, grideditor) {
                this.btnadd.setDisabled(!state);
            },
            insertrow: function() {
                this.cbcuenta.focus(true, true);
            }
        });

        this.getStore().on({
            scope: this,
            remove: function(store, record, index) {
                if (!this.gridValid()) {
                    this.btnadd.setDisabled(true);
                }
                else {
                    this.btnadd.setDisabled(false);
                }
                
                if(store.getCount() === 0) {
                    this.cbMoneda.clearValue();
                }

            },
            clear: function(store) {
                this.btnadd.setDisabled(false);
                
                if(store.getCount() === 0) {
                    this.cbMoneda.clearValue();
                }
            },
            beforeload: function(store, options) {
                this.arreliminados = new Array();
                this.getStore().commitChanges();
            },
            load: function(store, datarecord, options) {
            }
        });
    },
    //Función necesaria para insertar una fila dinámicamente,
    //para luego se salven las operaciones contables.
    insertarRow: function() {
        this.btnadd.setDisabled(true);

        var arrdinamico = new Array();
        var objdinamico = {};
        for (var i = 0; i < this.getStore().fields.keys.length; i++) {

            arrdinamico.push({name: this.getStore().fields.keys[i]});
            objdinamico[this.getStore().fields.keys[i]] = '';
        }
        objdinamico.valid = false;
        objdinamico.loaded = false;
        objdinamico.ctacontlibre = true;

        var Recdinamico = Ext.data.Record.create(arrdinamico);
        var total = this.getStore().getCount();
        this.stopEditing();
        var recdinamico = new Recdinamico(objdinamico);
//            this.getStore().insert(total, recdinamico);
        /* Empezar a editar */;
        this.roweditor.stopEditing();
        this.getStore().insert(total, recdinamico);
        this.getView().refresh();
        this.getSelectionModel().selectRow(total);
        this.roweditor.startEditing(total);
//            this.startEditing(total, 0);
        //Evento que se dispara cuando se inserta una fila
        this.fireEvent('insertrow', this, recdinamico);
    },
    //Función necesaria para eliminar las filas seleccionadas
    //para luego se salven las operaciones contables.
    deleteRows: function(idioma) {
        var seleccionados = this.getSelectionModel().getSelections();
        var cantseleccionados = seleccionados.length;
        if (cantseleccionados > 0) {
            var arrctadenom = new Array();
            for (var i = 0; i < cantseleccionados; i++) {

                if (!seleccionados[i].data.ctacontlibre && seleccionados[i].data.loaded) {
                    arrctadenom.push({denominacion: seleccionados[i].data.denominacion});
                }
                else {
                    this.arreliminados.push(seleccionados[i]);
                    seleccionados[i].commit();

                    //Disparando el evento despues que se elimina el row para actualizar el saldo
                    this.fireEvent('afterrowdeleted', this, seleccionados[i]);

                    this.getStore().remove(seleccionados[i]);
                }
            }

            if (this.getSelectionModel().getCount() === 0) {
                this.btndel.hide();
            }

            if (arrctadenom.length > 0) {
                //Si se cumple esto esa porque la cuenta bancaria a modificar
                //no está libre(tiene operaciones) y el row es cargado del servidor
                var cant = arrctadenom.length;
                var errormsg = (cant === 1) ? idioma.msgErrorCuentaBancNoLibreOne : idioma.msgErrorCuentaBancNoLibreMany;
                errormsg += '</br></br>';
                for (var i = 0; i < cant; i++) {
                    errormsg += '<b style="margin-left:47px;">' + '- ' + arrctadenom[i].denominacion + '</b>';
                    if (i < cant - 1) {
                        errormsg += '</br>';
                    }
                }

                mostrarMensaje(1, errormsg);
            }
        }
    },
    //Funcion necesaria para eliminar todas las tuplas del grid
    deleteAllRows: function() {
        var elementos = this.getStore().getRange();
        var cantelementos = elementos.length;
        this.arreliminados = new Array();

        if (cantelementos > 0) {
            for (var i = 0; i < cantelementos; i++) {
                elementos[i].commit();
                this.getStore().remove(elementos[i]);
            }
            this.btndel.hide();
        }
    },
    //Función necesaria para limpiar el arreglo de los eliminados
    //Es quitar del arreglo de eliminados los que no tienen el idcuenta con valor
    cleanEliminadosArrObjCuenta: function() {
        var arreliminados = this.arreliminados;
        var cant = arreliminados.length;

        if (cant > 0) {
            var arreliminadostemp = new Array();

            for (var i = 0; i < cant; i++) {
                if (!Ext.isEmpty(arreliminados[i].data.idcuenta)) {
                    arreliminadostemp.push(arreliminados[i]);
                }
            }
            return arreliminadostemp;
        }
        return arreliminados;
    },
    cleanEliminadosArrIdCuentas: function() {
        var arreliminados = this.arreliminados;
        var cant = arreliminados.length;

        if (cant > 0) {
            var arreliminadostemp = new Array();

            for (var i = 0; i < cant; i++) {
                if (!Ext.isEmpty(arreliminados[i].data.idcuenta)) {
                    arreliminadostemp.push(arreliminados[i].data.idcuenta);
                }
            }
            return arreliminadostemp;
        }
        return arreliminados;
    }
});