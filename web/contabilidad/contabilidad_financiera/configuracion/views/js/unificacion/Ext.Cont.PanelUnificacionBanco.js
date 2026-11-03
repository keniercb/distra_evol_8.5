/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.PanelUnificacionBanco
 * @extends Ext.Window
 */
Ext.namespace('Ext.Cont.PanelUnificacionBanco');
Ext.Cont.PanelUnificacionBanco = Ext.extend(Ext.Panel, {
//    Properties and Variables
    //Functions
    constructor: function(params) {

        params.arrCBFinalTemp = new Array();

        params.btnUnificarBanco = new Ext.Button({
            icon: '/contabilidad/comun/images/unificacionmonetaria.png',
            iconCls: 'btn',
            text: params.idioma.lbUnificar,
            tooltip: params.idioma.lbToolUnificar,
            disabled: true
        });

        params.lbFechaCont = new Ext.form.Label({
            hidden: true,
            text: '',
            style: 'font-weight:bold;'
        });

        params.lbTexCajaunificada = new Ext.form.Label({
            hidden: true,
            text: params.idioma.lbTexCajaunificada,
            style: 'font-weight:bold'
        });

        params.lbTexBancounificada = new Ext.form.Label({
            hidden: true,
            text: params.idioma.lbTexBancounificada1,
            style: 'font-weight:bold;'
        });

        params.lbSiCaja = new Ext.form.Label({
            hidden: true,
            text: params.idioma.lbSi,
            style: 'font-weight:bold;color:green;'
        });

        params.lbNoCaja = new Ext.form.Label({
            hidden: true,
            text: params.idioma.lbNo,
            style: 'font-weight:bold;color:red;'
        });

        params.lbSiBanco = new Ext.form.Label({
            hidden: true,
            text: params.idioma.lbSi,
            style: 'font-weight:bold;color:green;'
        });

        params.lbNoBanco = new Ext.form.Label({
            hidden: true,
            text: params.idioma.lbNo,
            style: 'font-weight:bold;color:red;'
        });

        params.stCBFinal = new Ext.data.Store({
            url: '',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idcuentabancariafinal'
            }, [
                {name: 'idcuentabancariafinal'},
                {name: 'cuentabancariafinal'}
            ])
        });

        params.cbCBFinal = new Ext.form.ComboBox({
            id: 'cbCBFinal',
            selectOnFocus: true,
            editable: false,
            allowBlank: false,
            store: params.stCBFinal,
            valueField: 'idcuentabancariafinal',
            displayField: 'cuentabancariafinal',
            enableKeyEvents: true,
            typeAhead: true,
            readOnly: true,
            anchor: '100%',
            mode: 'local',
            triggerAction: 'all'
        });

        params.stConfCB = new Ext.data.Store({
            id: 'stConfCB',
            url: '',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idcuentabancariaunif'
            }, [
                {
                    name: 'idcuentabancariaunif'
                },
                {
                    name: 'cuentabacariaunif'
                },
                {
                    name: 'importebanco'
                },
                {
                    name: 'importelibro'
                },
                {
                    name: 'diferencia'
                },
                {
                    name: 'idcuentabancariafinal'
                },
                {
                    name: 'cuentabancariafinal'
                }
            ])
        });

        params.smConfCB = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        params.gpConfCB = new Ext.grid.EditorGridPanel({
            frame: false,
            border: false,
            //loadMask: true,
            store: params.stConfCB,
            region: 'center',
            sm: params.smConfCB,
            id: 'gpConfCB',
            //autoExpandColumn: 'expandir',
            stripeRows: true,
            clicksToEdit: 2,
            columns: [
                {
                    header: params.idioma.headerCBUnif,
                    width: 350,
                    sortable: true,
                    dataIndex: 'cuentabacariaunif'
                },
                {
                    header: params.idioma.headerImpBanco,
                    sortable: true,
                    width: 150,
                    align: 'right',
                    dataIndex: 'importebanco',
                    renderer: formatoMoneda
                },
                {
                    header: params.idioma.headerImpLibro,
                    sortable: true,
                    width: 150,
                    align: 'right',
                    dataIndex: 'importelibro',
                    renderer: formatoMoneda
                },
                {
                    header: params.idioma.headerDif,
                    sortable: true,
                    width: 150,
                    align: 'right',
                    dataIndex: 'diferencia',
                    renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                        if (parseFloat(value) > 0) {
                            return '<span style="color:red">' + formatoMoneda(value) + '</span>';
                        }
                    }
                },
                {
                    header: params.idioma.headerCBFinal,
                    width: 350,
                    sortable: false,
                    dataIndex: 'cuentabancariafinal',
                    editor: params.cbCBFinal,
                    renderer: function(value, metadata, record, rowIndex, colIndex, store) {

                        var valTemp = '';
                        if (Ext.isEmpty(record.data.idcuentabancariafinal)) {
                            valTemp = value;
                        }
                        else {
                            valTemp = record.data.idcuentabancariafinal;
                        }

                        var index = params.stCBFinal.find('idcuentabancariafinal', valTemp);
                        if (index > -1) {
                            var CBfinal = params.stCBFinal.getAt(index).data.cuentabancariafinal;

                            record.set('idcuentabancariafinal', valTemp);
                            record.set('cuentabancariafinal', CBfinal);
                            return CBfinal;
                        }
                        else {
                            return '';
                        }

                    }
                }
            ]
        });


        params.stoperaciones = new Ext.data.GroupingStore({
            url: '',
            id: 'stoperaciones',
            sortInfo: {
                field: 'nodocumento',
                direction: 'ASC'
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'iddocumento'
            }, [
                {
                    name: 'iddocumento'
                },
                {
                    name: 'tipooperacion'
                },
                {
                    name: 'nodocumento'
                },
                {
                    name: 'idtipodocumento'
                },
                {
                    name: 'tipodocumento'
                },
                {
                    name: 'idmoneda'
                },
                {
                    name: 'importe'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'idcuentabancaria'
                },
                {
                    name: 'cuentabancaria'
                },
                {
                    name: 'fecha'
                }
            ]),
            groupField: 'idcuentabancaria'
        });

        params.smoperaciones = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        params.gpoperaciones = new Ext.grid.GridPanel({
            frame: false,
            border: false,
            autoScroll: true,
            //loadMask: true,
            store: params.stoperaciones,
            region: 'center',
            sm: params.smoperaciones,
            id: 'gpoperaciones',
//            autoExpandColumn: 'expandir',
            stripeRows: true,
            columns: [
                {
                    header: params.idioma.headerFecha,
                    width: 30,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'fecha'
                },
                {
                    header: params.idioma.headerTipOper,
                    width: 50,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'tipooperacion',
                    renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                        if (value == '1') {
                            return '<span>' + params.idioma.lbEntrada + '</span>';
                        }
                        else {
                            return '<span>' + params.idioma.lbSalida + '</span>';
                        }
                    }
                },
                {
                    header: params.idioma.headerNoDoc,
                    width: 60,
                    sortable: true,
                    dataIndex: 'nodocumento'
                },
                {
                    header: params.idioma.headerTipDoc,
                    sortable: true,
                    width: 60,
                    dataIndex: 'tipodocumento'
                },
                {
                    header: params.idioma.headerImporte,
                    width: 40,
                    sortable: true,
                    align: 'right',
                    dataIndex: 'importe',
                    renderer: formatoMonedaABS
                },
                {
                    header: params.idioma.headerDescrip,
                    width: 200,
                    sortable: true,
                    dataIndex: 'descripcion'
                },
                {
                    header: '',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcuentabancaria'
                }
            ],
            view: new Ext.grid.GroupingView({
                groupTextTpl: params.idioma.lbCuentaBancaria + ': {[values.rs[0].data.cuentabancaria]}',
                forceFit: true
            })
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: params.id,
            border: false,
            frame: false,
            layout: 'border',
            tbar: [params.btnUnificarBanco, '->', params.lbTexBancounificada, ' ', params.lbSiBanco, params.lbNoBanco, '-', params.lbTexCajaunificada, ' ', params.lbSiCaja, params.lbNoCaja, '-', params.lbFechaCont],
            items: [
                {
                    region: 'north',
                    // region: 'center',
                    height: 250,
                    title: params.idioma.titlePanelConfCB,
                    border: false,
                    split: true,
                    layout: 'border',
                    items: [params.gpConfCB]
                },
                {
                    region: 'center',
                    title: /*params.idioma.titleOperacionesNoCargadas*/ 'Operaciones bancarias no cargadas por estado de cuenta con anticipos pendientes a liquidar(moneda a unificar)',
                    border: false,
                    layout: 'border',
                    items: [params.gpoperaciones]
                }
            ]
        });

        //Agregando eventos
//        this.addEvents('loadend', 'valselected');

        Ext.Cont.PanelUnificacionBanco.superclass.constructor.call(this);

        this.inicializarEventos(params.idioma);
    },
    inicializarEventos: function() {

        this.btnUnificarBanco.on({
            scope: this,
            click: function() {
                this.unificarBanco(2);
            }
        });

        this.gpConfCB.on({
            scope: this,
            afteredit: function(options) {
                if (this.arrCBFinalTemp.length === 0) {
                    this.arrCBFinalTemp.push(options.record.data);
                }
                else {
                    var coincidencia = false;
                    Ext.each(this.arrCBFinalTemp, function(item, index, allItems) {
                        if (item.idcuentabancariafinal == options.record.data.idcuentabancariafinal && item.idcuentabancariaunif == options.record.data.idcuentabancariaunif) {
                            coincidencia = true;
                            return false;
                        }
                    }, this);

                    //Esto es si no hubo coincidencia
                    if (!coincidencia) {
                        this.arrCBFinalTemp.push(options.record.data);
                    }
                }
            }
        });

    },
    unificarBanco: function(fuente) {
        // this.btnUnificarBanco.disable();
        //Si la fuente es 1 entonces viene del combo de moneda
        //Si la fuente es 2 entonces viene botón unificar
        if (this.cbMoneda.isValid()) {
            this.loadDataProblemBanco(this.cbMoneda.getValue(), fuente);
        }
        else {
            mostrarMensaje(1, this.idioma.msgSinMoneda);
        }
    },
    loadDataProblemBanco: function(idmoneda, fuente) {

        if (fuente != 1) {
            if (this.cbTasa.isValid()) {
                var myMask = new Ext.LoadMask(this.getEl(), {msg: this.idioma.msgCargando});
                myMask.show();
            }
            else {
                mostrarMensaje(1, this.idioma.msgSinTasa);
                // this.btnUnificarBanco.enable();
                return;
            }
        }

        Ext.Ajax.request({
            method: 'POST',
            url: 'loadDataProblemBanco',
            scope: this,
            params: {
                idmoneda: idmoneda
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                // this.btnUnificarBanco.enable();

                if (myMask) {
                    myMask.hide();
                }

                //Para rellenar la columna de la cuenta bancaria final si ya ha sido configurada alguna
                if (this.arrCBFinalTemp.length > 0) {
                    Ext.each(responseData.resCBUnif.datos, function(item1, index1, allItems1) {
                        Ext.each(this.arrCBFinalTemp, function(item2, index2, allItems2) {
                            if (item1.idcuentabancariaunif == item2.idcuentabancariaunif) {
                                responseData.resCBUnif.datos[index1].idcuentabancariafinal = item2.idcuentabancariafinal;
                                responseData.resCBUnif.datos[index1].cuentabancariafinal = item2.cuentabancariafinal;
                                return false;
                            }
                        }, this);
                    }, this);
                }

                this.lbFechaCont.show();
                this.lbFechaCont.setText(this.idioma.lbTextFecha + responseData.fechaContBanco);

                if (responseData.cajalisto == 0) {
                    this.lbTexCajaunificada.show();
                    this.lbNoCaja.show();
                    this.lbSiCaja.hide();
                }
                else {
                    this.lbTexCajaunificada.show();
                    this.lbNoCaja.hide();
                    this.lbSiCaja.show();
                }

                if (responseData.bancolisto == 0) {
                    this.lbTexBancounificada.show();
                    this.lbNoBanco.show();
                    this.lbSiBanco.hide();
                }
                else {
                    this.lbTexBancounificada.show();
                    this.lbNoBanco.hide();
                    this.lbSiBanco.show();
                }

                this.stCBFinal.removeAll();
                this.stCBFinal.loadData(responseData.resCBFinal);

                this.stConfCB.removeAll();
                this.stConfCB.loadData(responseData.resCBUnif);

                this.stoperaciones.removeAll();
                this.stoperaciones.loadData(responseData.resOperTrans);

                if (fuente == 2) {
                    if (responseData.resOperTrans.cantidad > 0) {
                        var msg = (responseData.resOperTrans.cantidad == 1) ? this.idioma.msgOperTransOne : this.idioma.msgOperTransMany;
                        mostrarMensaje(1, msg);
                    }
                    else {
                        if (responseData.resCBUnif.cantidad > 0) {
                            //Validar los problemas de las cuentas bancarias
                            //Si hay diferencias entre el banco y el libro
                            //Si las cuentas bancarias finales están configuradas
                            var validateCB = this.validateCB();
                            if (validateCB.haydiferencias) {
                                var msgDif = (validateCB.variasdiferencias) ? this.idioma.msgManyDiferencia : this.idioma.msgOneDiferencia;
                                mostrarMensaje(1, msgDif);
                            }
                            else if (validateCB.hayCBFinalesNoConf) {
                                var msgCBF = (validateCB.variasCBFinalesNoConf) ? this.idioma.msgManyCBFNoConf : this.idioma.msgOneCBFNoConf;
                                mostrarMensaje(1, msgCBF);
                            }
                            else if (responseData.cajalisto == 0) {
                                //Validar que Caja esté unificada
                                mostrarMensaje(1, this.idioma.msgCajaNoListo);
                            }
                            else {
                                //Unificar Banco, preguntar si está seguro de realizar la unificación
                                mostrarMensaje(2, this.idioma.preguntaSiUnifica, function(btn) {
                                    if (btn == 'ok') {
                                        //el 1 es porque la unificacion va con cuentas
                                        this.unificacionFinalBanco(1);
                                    }
                                }.bind(this));
                            }
                        }
                        else if (responseData.bancolisto == 0) {
                            //Esto pasa cuando banco no está unificado y no se cargan cuentas bancarias aquí

                            //Ahora verificamos si hay cuentas bancarias a unificar cerradas
                            if (responseData.haycuentasaunificarcerradas) {
                                mostrarMensaje(1, this.idioma.msgSinCuenBanc1);
                            }
                            else {
                                //Sino es porque no hay cuentas bancarias a unificar configuradas para el subsistema
                                //o las mismas están inactivas
                                //Aquí lo que se hace es preguntar si quiere unificar Banco y así
                                //se escribe en la tabla mod_contabilidad.dat_unificacionsubsistema y se unifica
                                mostrarMensaje(2, this.idioma.preguntaSiUnifica1, function(btn) {
                                    if (btn == 'ok') {
                                        //el 0 es porque la unificacion va sin cuentas
                                        this.unificacionFinalBanco(0);
                                    }
                                }.bind(this));
                            }
                        }
                        else if (responseData.bancolisto == 1) {
                            //Esto pasa cuando banco está unificado y no se cargan cuentas bancarias aquí
                            mostrarMensaje(1, this.idioma.msgSinCuenBanc2);
                        }
                    }
                }
            }
        });
    },
    validateCB: function() {
        var arrdata = this.stConfCB.getRange();

        var contDif = 0;
        var contCBF = 0;
        Ext.each(arrdata, function(item, index, allItems) {
            if (parseFloat(item.data.diferencia) > 0) {
                // contDif++;
            }
            if (Ext.isEmpty(item.data.idcuentabancariafinal)) {
                contCBF++;
            }
        }, this);

        var objreturn = {};
        objreturn.haydiferencias = (contDif == 0) ? false : true;
        objreturn.variasdiferencias = (contDif > 1) ? true : false;

        objreturn.hayCBFinalesNoConf = (contCBF == 0) ? false : true;
        objreturn.variasCBFinalesNoConf = (contCBF > 1) ? true : false;

        return objreturn;
    },
    unificacionFinalBanco: function(unificacionconcuentas) {
        var idmoneda = this.cbMoneda.getValue();
        var idtasa = this.cbTasa.getValue();

        var arrdatastore = this.stConfCB.getRange();
        var arrcuentabancarias = new Array();
        Ext.each(arrdatastore, function(item, index, allItems) {
            arrcuentabancarias.push({
                idcuentabancariaunif: item.data.idcuentabancariaunif,
                importecuentabancariaunif: item.data.importebanco,
                idcuentabancariafinal: item.data.idcuentabancariafinal
            });
        }, this);

        var params = {
            idmoneda: idmoneda,
            idtasa: idtasa,
            datacuentas: Ext.encode(arrcuentabancarias),
            unificacionconcuentas: unificacionconcuentas
        };

        Ext.Ajax.request({
            method: 'POST',
            url: 'unificarBanco',
            scope: this,
            params: params,
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);

                if (responseData.success == 1) {
                    mostrarMensaje(1, this.idioma.msgBancoUnificadoBien);
                    this.loadDataProblemBanco(idmoneda, 1);
                }
                else {
                    mostrarMensaje(1, this.idioma.msgBancoNohaUnificado);
                }
            }
        });
    }
});
