Ext.ns('LOG.fac.puntoventa.recuperaciones');
LOG.fac.puntoventa.recuperaciones.cintaauditora = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/facturacion/puntoventa/index.php/cintaauditora',
    urlBusquedaGridPrincipal: 'cargarauditoras',
    formaVisualizacion: 'panel',
    busquedaBasica: true,
    autoLoad: false,
    modoSeleccion: 1,
    idGridPrincipal : "nroventa",
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = 'Identificador';
        LOG.fac.puntoventa.recuperaciones.cintaauditora.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'iddescarga'
        });
        this.addGridColumn({
            header: 'Identificador',
            width: 100,
            dataIndex: 'identificador',
			//autoExpand: true,
            default: true,
            sortable: true,
            filter : {
                type: 'string',
                dataIndex: 'identificador'
            }
        });
		this.addGridColumn({
            header: 'Caja',
            width: 250,
			dataIndex: 'denominacion',
            agrupador: true,
			default: true
        });
        this.addGridColumn({
            header: 'Fecha',
            width: 200,
            dataIndex: 'fecha',
            default: true,
            filter : {
                type: 'date',
                dataIndex: 'fecha'
            }
        });
    },
	 initDefaultButtons: function () {
        var me = this;
        this.btnDescargar = LOG.util.UIManager.createBtn({
            text: 'Descargar',
            tooltip: 'Descargar cinta auditora de las cajas asociadas al \xe1rea de venta seleccionada',
            iconCls: 'descargar',
            idItem: 'Descargar',
            disabled: true,
            hidden: true,
            //scope: this,
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RDESCARGA')) {
                    btn.show();
                    if (me.cajasregistradoras != undefined && me.cajasregistradoras > 0) {
                        btn.enable();
                    } else {
                        btn.disable();
                    }
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                me.descargarAuditora();
            }
        });
         this.addToolbarButton(me.btnDescargar);
         this.addToolbarButton('-');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Exportar csv',
            disabled: true,
            iconCls: 'exportar',
            tooltip: 'Exportar informaci\xf3n en formato csv',
            handler: function () {
                me.exportarCsv(me.getSmPrincipal().getSelected().data.iddescarga)
            },
            controlFn: function (b, _caller) {
                if (me.grantedAction('CT') || me.grantedAction('RExportar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(me.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.enable();
                        }
                    }, 'ExportarCSV');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({id: 'idayudaproductotpv'}));
    },
    exportarCsv: function (iddescarga) {
        var _this = this;
        var objSubmit = {iddescarga: iddescarga};
        Ext.MessageBox.wait('Exportando a CSV', _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: '/logistica/facturacion/puntoventa/index.php/cintaauditora/exportarCsv',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                //_this.apply(resp);
                if (resp.success) {
                    if (resp.url) {
                        var file_path = resp.url;
                        var a = document.createElement('A');
                        a.href = file_path;
                        a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(_this, [resp]).call();
                    }
                }
            }.createDelegate(_this)
        });
    },
    descargarAuditora: function(_fn) {
        var _this = this;
        var objSubmit = {idareaventa: _this.idareaventa, idestructuraop: _this.idestructuraop};
        Ext.MessageBox.wait('Descargando auditora', _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: '/logistica/facturacion/puntoventa/index.php/cintaauditora/descargarAuditora',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, 'La informaci\xf3n ha sido descargada satisfactoriamente');
                    _this.getGridPrincipal().getStore().reload();
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp.datos]).call();

                    }
                }
            }.createDelegate(this)
        });
    },
    view: function () {
        var _this = this;
        this.cmbArea = new LOG.util.ComboBox({
            autoLoad: true,
            name: 'idareaventa',
            url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarAreas',
            valueField: 'idestructuraop',
            displayField: 'coddenominacion',
            width: 250,
            anchor: '90%',
            listWidth: 350,
            //pageSize: 10,
            //mode: 'remote',
            allowBlank: false,
            editable: true,
            listeners: {
                /*expand: function () {
                this.store.reload();
                },*/
                select: function (combo,record,index) {
                    _this.idareaventa = record.json.idareaventa;
                    _this.tiendavirtual = record.json.tiendavirtual;
                    _this.tipotienda = record.json.tipo;
                    _this.cajasregistradoras = record.json.cr;
                    _this.idestructuraop = combo.getValue();

                    _this.getStorePrincipal().load({
                        params: {
                            idestructuraop: combo.getValue(),
                            idareaventa: record.json.idareaventa
                        }
                    });
                    if (typeof _this.btnDescargar.controlFn == 'function') {
                        _this.btnDescargar.controlFn.createDelegate(_this, [_this.btnDescargar, _this]).call();
                    }
                }
            }
        });


        this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function () {
                _this.onBtnLimpiar();
            }
        });

        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: [
                '-', '\xc1rea de venta' + ':', this.cmbArea,
                '-', this.btnLimpiar

            ]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: '50%'
        });


        return LOG.fac.puntoventa.recuperaciones.cintaauditora.superclass.view.call(this);

    },
    render: function() {
        var _this = this;
        var vis = LOG.fac.puntoventa.recuperaciones.cintaauditora.superclass.render.call(this);

        this.getGridPrincipal().getStore().on({
            'beforeload': function (st) {
                st.baseParams.idareaventa = _this.idareaventa || -1;
                st.initBaseParams.idareaventa = _this.idareaventa || -1;

            }
        });

        if (typeof _this.btnDescargar.controlFn == 'function') {
            _this.btnDescargar.controlFn.createDelegate(this, [_this.btnDescargar, this]).call();
        }
        return vis;
    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    getPanelEste: function () {
        var _this = this;

        this.panelEste = LOG.util.UIManager.initPanel({
            region: 'east',
            title: 'Informaci\xf3n',
            border: true,
            layout: 'fit',
            collapsible: true,
            //collapsed: true,
            split: true,
            width: 600,
            listeners: {
                /*expand: function (p) {
                    p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
                }*/
            }
        });
        this.pnGridEste = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            view: function () {
                return this;
            }
        });

        this.columnasEste = new LOG.util.List();
        this.columnasEste.add({
            dataIndex: 'idinfo'
        });
        this.columnasEste.add({
            header: 'Fecha',
            width: 120,
            dataIndex: 'fecha',
            default: true
        });
        this.columnasEste.add({
            header: 'Hora',
            width: 120,
            dataIndex: 'hora',
            default: true,
        });
        this.columnasEste.add(LOG.util.Prototipos.inputTexto({
            header: 'Informaci\xf3n',
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true,
            width: 500,
            renderer: function (v, md, rd) {

                return v;
            }
        }));


        this.smGridEste = LOG.util.UIManager.initSelectionModel(3, true);

        var clsEste = LOG.util.UIManager.proccessColumns(this.columnasEste, this.smGridEste);
        this.cmGridEste = new Ext.grid.ColumnModel(clsEste.columns);
        this.recStGridEste = Ext.data.Record.create(clsEste.fields);

        this.storeEste = new Ext.data.Store({
            //autoLoad: true,
            url: '/logistica/facturacion/puntoventa/index.php/cintaauditora/devolverInformacion',
            reader: new Ext.data.JsonReader({
                id: "idinfo",
                root: "datos"
            }, this.recStGridEste),
            listeners: {
                load: function(st){

                }
            }
        });

        this.storeEste.on({
            'beforeload': function () {
                _this.storeEste.baseParams.iddescarga = _this.getSmPrincipal().getSelected().data.iddescarga;
                _this.storeEste.initBaseParams.iddescarga = _this.getSmPrincipal().getSelected().data.iddescarga;

            }
        });

        this.gpEste = LOG.util.UIManager.initEditableGridPanel(this.cmGridEste, this.storeEste, this.smGridEste, {nobbar: true});

        this.pnGridEste.add(this.gpEste);

        this.panelEste.add(this.pnGridEste);

        //this.tabGeneral.view();

        return this.panelEste;
    },
    init: function() {
        var _this = this;
        LOG.fac.puntoventa.recuperaciones.cintaauditora.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            _this.getPanelPrincipal().add(_this.getPanelEste());

            _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(
                function (e) {
                    if (e == 'rowclick') {
                        if (_this.getSmPrincipal().getSelections().length == 1) {
                            _this.storeEste.load();
                        } else {
                            _this.storeEste.removeAll();
                        }
                    }
                }
            );
        });
    }
});