Ext.ns('Caja.Operaciones.Cierre');
Caja.Operaciones.Cierre.View = {
    init: function (perfil, etiquetas, model, cargaInicial) {

        this.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        this.btnCierreCaja = new Ext.Button({
            //id:'btnCEC',
            //icon: perfil.dirImg + 'aceptar.png',
            tooltip: etiquetas.lbTooCierreCaja,
            iconCls: 'cierre',
            text: etiquetas.lbCierreCaja,
            disabled: true
        });

        this.btnVistaPrevia = new Ext.Button({
            id: 'btnVP',
            tooltip: 'Vista previa',
            icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'btn',
            text: 'Vista previa',
            //disabled: true,
        });

        this.btnAperturar = new Ext.Button({
            id: 'btnCierrarCI',
            //icon: perfil.dirImg + 'aceptar.png',
            tooltip: etiquetas.lbTooCierreCI,
            //tooltip: etiquetas.lbTooAperturar,
            //iconCls: 'apertura',
            iconCls: 'cierre',
            text: etiquetas.lbCierreCI
            //text: etiquetas.lbAperturar
            // disabled: true
        });

        this.btnCierrePeriodo = new Ext.Button({
            id: 'btnCPC',
            //icon: perfil.dirImg + 'aceptar.png',
            tooltip: etiquetas.lbTooCierrePeriodo,
            iconCls: 'cierre',
            text: etiquetas.lbCierrePeriodo,
            // disabled: true
        });

        this.btnCierreEjercicio = new Ext.Button({
            id: 'btnCEC',
            //icon: perfil.dirImg + 'aceptar.png',
            tooltip: etiquetas.lbTooCierreEjercicio,
            iconCls: 'cierreejercicio',
            disabled: true,
            text: etiquetas.lbCierreEjercicio
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaCierre',
            iconCls: 'ayuda',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda
        });

        this.btnAyudaCI = new Ext.Button({
            id: 'btnAyudaCierreCI',
            iconCls: 'ayuda',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda
        });

        this.gpCierre = new Ext.grid.GridPanel({
            store: model.stCierre,
            columns: [
                {
                    width: 22, sortable: false, dataIndex: 'motivos',
                    renderer: function (value, attr, record) {
                        switch (url) {
                            case 'ComprobarCuentaContabilidad':
                                var text = record.json.nombre;//"La cuenta " + record.json.cuenta + " posee saldo contable de " + Math.abs(record.json.saldoC).toFixed(2) + " y un saldo en Cobros y Pagos de " + Math.abs(record.json.saldo).toFixed(2);
                                arrayData.push({type: 1, text: text});
                                return text;
                            case 'CerrarPeriodo':
                                var text = record.json.nombre;//"La cuenta " + record.json.cuenta + " posee saldo contable de " + Math.abs(record.json.saldoC).toFixed(2) + " y un saldo en Cobros y Pagos de " + Math.abs(record.json.saldo).toFixed(2);
                                arrayData.push({type: 2, text: text});
                                return text;
                            case 'CerrarEjercicio':
                                var text = record.json.nombre;//"La cuenta " + record.json.cuenta + " posee saldo contable de " + Math.abs(record.json.saldoC).toFixed(2) + " y un saldo en Cobros y Pagos de " + Math.abs(record.json.saldo).toFixed(2);
                                arrayData.push({type: 3, text: text});
                                return text;
                        }
                    }
                },
                {
                    header: "<font color=\"FF0000\">ERROR",
                    hidden: true,
                    hiddeable: false,
                    sortable: false,
                    dataIndex: 'texto', renderer: function (value, attr, record) {
                        switch (url) {
                            case 'ComprobarCuentaContabilidad':
                                return "El  saldo de los fondos no coincide con los saldos de las cuentas en contabilidad. Verifique los datos del arqueo en los siguientes fondos:";
                            case 'CerrarPeriodo':
                                return "Las siguientes cajas no han sido cerradas:";
                            case 'CerrarEjercicio':
                                return "Las siguientes cajas no han sido cerradas:";
                        }
                    }
                }
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            border: false,
            autoScroll: true,
            stripeRows: true,
            //frame: true,
            width: 300,
            collapsible: true,
            animCollapse: false,
            //renderTo: document.body
            tbar: [/*this.btnCierreCaja,*/ this.btnCierrePeriodo, this.btnCierreEjercicio, this.btnVistaPrevia, '->', this.lfdPeriodo, '-', this.btnAyuda]
        });

        //**********

        this.smCierre = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.grdlistadocajas2 = new Ext.grid.GridPanel({
            id: 'idGridListCajas',
            collapsible: true,
            //region : 'north',
            loadMask: true,
            sm: this.smCierre,
            store: model.stCajaFondo,
            //sm: this.smlistadocajas,
            viewConfig: {
                forceFit: true
            },
            autoExpandColumn: 'descripcion',
            height: 700,
            width: 500,
            autoScroll: false,
            columns: [{
                header: "Caja",
                //width: 50,
                dataIndex: 'caja',
                sortable: true,
                hidden: true,
                hideable: false
            }, /*{
                header: "C&oacute;digo",
                width: 20,
                sortable: true,
                dataIndex: 'codigo'
            },*/ {
                header: "An&aacute;lisis",
                width: 25,
                sortable: true,
                dataIndex: 'nomcuenta'
            }, {
                // header: "Fondo",
                header: "Denominaci&oacute;n",
                width: 30,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: "Observaci&oacute;n",
                sortable: true,
                dataIndex: 'descripcion',
                id: 'descripcion'
            }, {
                header: "Moneda",
                width: 10,
                sortable: true,
                align: 'center',
                dataIndex: 'codigoiso'
            }, {
                header: "Saldo en caja",
                width: 15,
                sortable: true,
                dataIndex: 'saldofondo',
                align: 'right',
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (value < 0) {
                        return '(' + formatoMonedaABS(value) + ')';
                    } else return formatoMoneda(value);
                }
            }, {
                header: "Saldo contable",
                width: 15,
                sortable: true,
                dataIndex: 'saldocuenta',
                align: 'right',
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (value < 0) {
                        return '(' + formatoMonedaABS(value) + ')';
                    } else return formatoMoneda(value);
                }
            }, {
                header: "Arqueo de cierre",
                width: 15,
                sortable: true,
                dataIndex: 'arqueocierre',
                align: 'center',
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (value == true) {
                        metadata.css = 'icondistra-true';
                    } else if (value == false)
                        metadata.css = 'icondistra-cancelar';
                }
            }, /*{
             header: "Cierre",
             width: 15,
             sortable: true,
             dataIndex: 'cerrado',
             align: 'center',
             renderer: function (value, metadata, record, rowIndex, colIndex, store) {
             if (value) {
             metadata.css = 'icondistra-cierre';
             } else metadata.css = 'icondistra-cancelar';
             }
             }*/],
            tbar: [/*this.btnCierreCaja,*/ cargaInicial ? this.btnAperturar : '', !cargaInicial ? this.btnCierrePeriodo : '', !cargaInicial ? this.btnCierreEjercicio : ''/*, this.btnVistaPrevia*/, '->', this.lfdPeriodo, '-', cargaInicial ? this.btnAyudaCI : this.btnAyuda],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 100,
                store: model.stCajaFondo,
                displayInfo: true,
                displayMsg: 'Resultados de {0} - {1} de {2}', //etiquetas.lbResultPag,
                emptyMsg: "No hay resultados para mostrar."//etiquetas.lbNoResult
            }),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                ShowGroupName: true,
                enableRowBody: true,
                enableNoGroup: false,
                enableGropingMenu: true,
                hideGroupedColumn: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "An&aacute;lisis" : "An&aacute;lisis"]})'
            })
        });

        this.grdlistadocajas2.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.data.arqueocierre == false || record.data.saldocuenta != record.data.saldofondo)
                rowParams.tstyle = "background-color: #f2e2e2;";
            /*return 'FilaRoja';*/
            else return rowParams.tstyle = '';
        };

        this.grdlistadocajas2.contextmenu = new Ext.menu.Menu({
            id: 'contextMenu',
            items: [
                {
                    id: 'selectCaja',
                    //iconCls: 'x-menu-item-icon',
                    iconCls: 'cierre',
                    //icon: 'aceptar',
                    hidden: false,
                    scope: this,
                    handler: function () {
                        controller.clickCerrarCaja();
                    }
                }]
        });

        this.grdlistadocajas2.on({
            scope: this,
            rowcontextmenu: function (grid, rowIndex, eventObject) {
                eventObject.stopEvent();
                var record = model.stCajaFondo.getAt(rowIndex);
                if (!record.data.cerrado) {
                    Ext.getCmp('selectCaja').setText('<b>' + "Cerrar Caja: " + record.data.caja + '<b>');
                    this.grdlistadocajas2.idcaja = record.data.idcaja;

                    //this.grdlistadocajas2.contextmenu.showAt(eventObject.getXY());//Para q no salga el Menu
                }
            }
        });

        //***************

        this.view = new Ext.Viewport({
            border: true,
            layout: 'fit',
            items: [this.grdlistadocajas2]
            //items: [this.gpCierre]
            //renderTo: document.body
        });

        //*************************************************
        //VENTANA de Pendiente
        this.pPreView = new Ext.Panel({
            autoScroll: true
        });

        this.winVerdetalles = new Ext.Window({
            title: etiquetas.lbTitTVerDetalles,
            width: '40%',
            height: 400,
            layout: 'fit',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            maximizable: true,
            frame: true,
            items: this.pPreView,
            buttons: [
                this.btnCerrar = new Ext.Button({
                    iconCls: 'cerrar',
                    tooltip: etiquetas.lbBtnTooltipCerrar,
                    text: etiquetas.lbBtnCerrar,
                    handler: function () {
                        this.winVerdetalles.hide();
                    }.bind(this)
                })
            ]
        });
        //*************************************************
    },
    Window: function (etiquetas) {
        this.smlistadocajas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.grdlistadocajas = new Ext.grid.GridPanel({
            id: 'idGridListCajas',
            collapsible: true,
            //region : 'north',
            store: model.stCajaFondo,
            sm: this.smlistadocajas,
            autoExpandColumn: 'direccion',
            height: 700,
            width: 500,
            autoScroll: false,
            columns: [{
                header: "C&oacute;digo",
                width: 110,
                sortable: true,
                dataIndex: 'codigo'
            }, {
                header: "Nombre",
                width: 100,
                sortable: true,
                dataIndex: 'nombre'
            }, {
                header: "Observaci&oacute;n",
                width: 65,
                sortable: true,
                dataIndex: 'descripcion',
                id: 'direccion'
            }],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: model.stCajaFondo,
                displayInfo: true,
                displayMsg: 'Resultados de {0} - {1} de {2}', //etiquetas.lbResultPag,
                emptyMsg: "No hay resultados para mostrar."//etiquetas.lbNoResult
            })
        });

        this.btnaceptar = new Ext.Button({
            id: 'btnaceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            tooltips: 'Guardar datos y cerrar ventana',
            iconCls: 'aceptar',
            text: 'Aceptar',
            disabled: true
        });
        this.btncancelar = new Ext.Button({
            id: 'cancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar'
        });

        this.window = new Ext.Window({
            title: 'Listado de cajas',
            layout: 'fit',
            width: 600,
            height: 500,
            modal: true,
            closeAction: 'hide',
            items: this.grdlistadocajas,
            buttons: [this.btncancelar, this.btnaceptar]
        });
    },
    windowCacelar: function (etiquetas) {
        this.btnAceptarCancel = new Ext.Button({
            text: etiquetas.lbAceptar,
            tooltip: etiquetas.tooltipAceptar,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar'
        });

        this.btnCancelarCancel = new Ext.Button({
            text: "Cerrar",
            tooltip: etiquetas.tooltipCancelar,
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar'
        });

        this.cbxmotivo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            editable: true,
            width: 50,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            store: model.stMotivo,
            valueField: 'idmotivocancelacion',
            displayField: etiquetas.lbmotivo,
            hiddenName: 'idmotivocancelacion',
            selectOnFocus: true,
            resizable: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            fieldLabel: etiquetas.lbmotivoCancelacion,
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
            enableKeyEvents: true
        });

        this.dffechac = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Fecha',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            width: 248,
            anchor: '100%',
            readOnly: false,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            editable: true
        });

        this.pcancelacion = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'pcancelacion',
            region: 'north',
            autoHeight: true,
            frame: true,
            items: [this.cbxmotivo, this.dffechac]
        });

        this.winCancelar = new Ext.Window({
            title: etiquetas.lbCancelar,
            frame: true,
            border: false,
            modal: true,
            width: 400,
            closeAction: 'hide',
            autoHeight: true,
            layout: 'fit',
            resizable: false,
            items: [this.pcancelacion],
            buttons: [this.btnCancelarCancel, this.btnAceptarCancel]
        });
    }
};

Caja.Cierre = Ext.extend(Ext.Component, {
    constructor: function (cargaInicial) {
//Inicializando la vista.
        Ext.QuickTips.init();
        var perfil = window.parent.perfil;
        perfil.etiquetas = Object();

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            callback: function (options, success, response) {
                var etiquetas = Ext.decode(response.responseText);

                Ext.Msg.wait(etiquetas.lbCargando, etiquetas.lbEspere);
                Ext.Ajax.request({
                    url: 'loadDataIni',
                    callback: function (options, success, response) {
                        if (success) {
                            var response = Ext.decode(response.responseText);
                            fechaContable = response.dataFecha.fechacontable;
                            periodoActual = response.dataFecha.nombre;
                            fechaInicio = response.dataFecha.inicio;
                            fechaFin = response.dataFecha.fin;
                            ultimoPeriodo = response.dataFecha.ultimoPeriodo;
                            ejercicioActual = response.ejercicio;
                            cargaInicial = cargaInicial;

                            //Inicializar el modelo
                            model = Caja.Operaciones.Cierre.Model;
                            model.init(cargaInicial);

                            //Inicializar la vista.
                            var view = Caja.Operaciones.Cierre.View;
                            view.init(perfil, etiquetas, model, cargaInicial);

                            //Si es el ultimo periodo(Siempre el ultimo es de cierre de ejercicio)
                            if (ultimoPeriodo) {
                                view.btnCierrePeriodo.disable();
                                view.btnCierreEjercicio.enable();
                            }

                            //Verifica apertura
                            if (response.aperturado == 1 && cargaInicial == 1) {
                                //view.grdlistadocajas2.disable();
                                mostrarMensaje(1, etiquetas.lbCargaInicialCerrada, function (btn) {
                                    // if (btn == 'ok' || btn == 'cencel')
                                    view.grdlistadocajas2.disable();
                                });
                                return;
                            }
                            if (response.aperturado != 1 && cargaInicial != 1) {
                                //view.grdlistadocajas2.disable();
                                mostrarMensaje(1, etiquetas.lbCargaInicial, function (btn) {
                                    //if (btn == 'ok' || btn == 'cencel')
                                    view.grdlistadocajas2.disable();
                                });
                                return;
                            }

                            //Inicializar controlador.
                            controller = Caja.Operaciones.Cierre.Controller;
                            controller.init(perfil, etiquetas, view, model, cargaInicial);
                            model.stCajaFondo.load({
                                callback: function (records, options, success) {
                                    if (!model.stCajaFondo.reader.jsonData.cajas) {
                                        view.grdlistadocajas2.disable();
                                        mostrarMensaje(1, 'No existen cajas configuradas para su usuario.');
                                        Ext.MessageBox.hide();
                                    }
                                }
                            });

                            // view.lfdPeriodo.setText(response.estructura + '|' + 'Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                            view.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                            Ext.Msg.hide();
                        }
                    }
                });
            }
        });
    }
});