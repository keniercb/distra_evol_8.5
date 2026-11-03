Ext.ns('Ext.erp.ordendespacho');
Ext.erp.ordendespacho = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,
    idCmp : null,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.ordendespacho.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/';
this.idCmp = Ext.id();
        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
            },
            /*controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_this.gdCliente.storePrincipal, 'fireEvent', function (e, st, rd) {
                    if (e == 'add') {
                        if (_this.txtNroDespacho.getValue()!= "" && _this.dfFecha.getValue() && _this.comboDepositos.getValue()) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                    if (e == 'remove') {
                        if (st.data.length > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }

                }, 'WINDOCUMENTOS');
                LOG.util.UIManager.encadenaFn(_this.comboDepositos, 'fireEvent', function (e) {
                    if (e == 'select') {
                        if (_this.txtNroDespacho.getValue() != "" && _this.dfFecha.getValue() && _this.gdCliente.storePrincipal.data.length > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }

                }, 'CMBDEP');
                LOG.util.UIManager.encadenaFn(_this.txtNroDespacho, 'fireEvent', function (e) {
                    if (_this.comboDepositos.getValue() && _this.dfFecha.getValue() && _this.gdCliente.storePrincipal.data.length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }

                }, 'NRODESP');
                LOG.util.UIManager.encadenaFn(_this.dfFecha, 'fireEvent', function (e) {
                    if (_this.comboDepositos.getValue() && _this.txtNroDespacho.getValue()!= "" && _this.gdCliente.storePrincipal.data.length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }

                }, 'FECHA');
            }*/
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.btnLimpiar();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.btnLimpiar();
                    }
                },
                {
                    alt: true,
                    key: 'p',
                    fn: function () {
                        _this.getReportes(_this)

                    }
                }
            ]);
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idOrdenDespacho' + this.idCmp}));

        //this.addToolbarButtonDeposito('->');

        this.comboOperaciones = new LOG.util.LovCombo({ //---combobox Tipo de producto
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'subsistema',
            editable: false,
            url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarSubsistemas',
            listeners: {
                select: function(cmb, rd) {
                    _this.idsubsistema = rd.json.idsubsistema;
                    /*if (_this.idsubsistema != 10) {
                        _this.comboDepositos.disable();
                        _this.comboDepositos.clearValue();
                    } else {
                        _this.comboDepositos.enable();
                    }*/
                }
            }
        });
       /* this.comboDepositos = new LOG.util.LovCombo({
            mode:'remote',
            url:  '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            displayField:'deposito',
            valueField:'iddeposito'
        });*/

        this.comboDepositos = new LOG.util.ComboBox({
            editable: false,
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            hiddenName: 'iddeposito',
            valueField: 'iddeposito',
            displayField: 'deposito',
            mode: 'remote',
            editable: false,
            listeners: {
                select: function (cmb, rd) {
                    _this.gdCliente.storePrincipal.removeAll();
                }
            }
        });
        this.txtNroDespacho = new LOG.util.Prototipos.inputTexto({
            name: 'nrodespacho',
            fieldLabel: 'No. Despacho'
        });
        this.dfFecha = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: 'Fecha',
            name: 'fecha',
            xtype: 'datefield',
            id: 'fechaOrden' + this.idCmp,
            editable: false
        });
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: 'Nro. Despacho'
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.txtNroDespacho);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: 'Fecha'
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.dfFecha);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.comboDepositos);
        /*this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbOperaciones
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.comboOperaciones);*/



        /*--------------Fieldset RangoFecha-----------------*/
        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdedocD',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeOrden' + this.idCmp,
            endDateField: 'hastaOrden' + this.idCmp,
            editable: false
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastadocD',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaOrden' + this.idCmp,
            startDateField: 'desdeOrden' + this.idCmp,
            editable: false
        });
        this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        this.dfHasta.startDateField = this.dfDesde.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde);
        this.clsFecha.addComponent(this.dfHasta);

        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            width: 200,
            items: [this.clsFecha]
        });

        /*--------------Fieldset Clientes-----------------*/
        this.fsCliente = new Ext.form.FieldSet({
            layout: 'border',
            title: 'Selecci\xf3n de \xf3rden de despacho',
            height: 350
        });
        this.gdCliente = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            tltWinAdd: this.idioma.ttWinAddCliente,
            header: this.idioma.gcCliente,
            ttBtnAdd: this.idioma.ttAddClient,
            ttBtnDel: this.idioma.ttElimClient,
            idItem:'documento',
            region: 'center',
            type: 'documento'
        });
        this.btnSelecCliente = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddSumin,
            iconCls: 'adicionar',
            handler: function () {
                _this.recordClientes = _this.gdCliente.storePrincipal.data.items;
                var iddocumentos = [];

                Ext.each(_this.recordClientes, function (rec) {
                    if (rec.data.iddocumento) {
                        iddocumentos.push(rec.data.iddocumento);
                    }
                });

                var ventanaDocumento = new Ext.erp.ventanaDocumento({
                    iddocumentos: Ext.encode(iddocumentos),
                    iddeposito: _this.comboDepositos.getValue(),
                    concepto: 'documentos',
                    urlBusquedaGridPrincipal: 'cargarOrdenDespacho',
                    initDefaultColumns: function(){
                        this.addGridColumn({
                            dataIndex: 'iddocumento',
                            default: true
                        });
                        this.addGridColumn({
                            header: 'No. documento',
                            width: 200,
                            dataIndex: 'nrodoc',
                            default: true
                        });
                        this.addGridColumn({
                            header: 'Fecha',
                            width: 200,
                            dataIndex: 'fechacontable',
                            default: true
                        });
                    }
                });
                ventanaDocumento.init();
                /*ventanaDocumento.getPanelSuperior().onRender = ventanaDocumento.getPanelSuperior().onRender.createSequence(function() {
                    ventanaDocumento.getPanelSuperior().add(ventanaDocumento.createComboDeposito());
                    ventanaDocumento.getPanelSuperior().doLayout();
                });*/
                ventanaDocumento.getVistaPrincipal().title = 'Listado de documentos';
                ventanaDocumento.view();
                //ventanaDocumento.getGridPrincipal().store.load();
                var botonAceptar = ventanaDocumento.getVistaPrincipal().listaBotones.getItem(2);

               /* ventanaClientes.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });*/
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaDocumento.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.gdCliente.storePrincipal, records);

                });


            }
        });
        this.btnElimCliente = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimSumin,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdCliente.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdCliente.storePrincipal.remove(selected);
                });
                if (_this.gdCliente.storePrincipal.getCount() == 0) {
                    _this.btnElimCliente.setDisabled(true);
                }
            }
        });
        this.gdCliente.addToolbarButton(this.btnSelecCliente);
        this.gdCliente.addToolbarButton(this.btnElimCliente);
        this.gdCliente.init();
        this.fsCliente.add(this.gdCliente.view());



        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 1
        });
        //this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsCliente);

        //this.clsGeneral.getColumn(0).getComponent(0).anchor = '30%';
        //this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
            region: 'center',
            style: '-moz-border-radius:20px',
            items: [this.clsGeneral]
        });
        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            this.fpCentral
        ];

        Ext.erp.ordendespacho.superclass.constructor.call(this, config);

        this.listaBotonesVentanaToolbar.each(function(b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));

    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    arrayToString: function(store, nrodoc){
        var stringGeneric = "";
        for (var i = 0; i < store.data.items.length; i++) {
            if (i != store.data.items.length - 1) {
                stringGeneric += (nrodoc) ? store.data.items[i].data.nrodoc + "," : store.data.items[i].data.iddocumento + ",";
            } else {
                stringGeneric += (nrodoc) ? store.data.items[i].data.nrodoc + "" : store.data.items[i].data.iddocumento + "";
            }
        }
        stringGeneric = (nrodoc) ? stringGeneric : "{" + stringGeneric + "}";
        if(stringGeneric== "{}") {
            stringGeneric = null;
        }
        return stringGeneric;
    },
    getReportes: function (_this) {
        var depositos = "";
        _this.entidades=[];
        _this.entidadesCheck=[];
        /*if(this.comboDepositos.view){
            for(var i=0; i < this.comboDepositos.view.store.data.items.length; i++) {
                if (this.comboDepositos.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboDepositos.view.store.data.items[i].data.iddeposito);
                }
                _this.entidades.push(_this.comboDepositos.view.store.data.items[i].data.iddeposito);
            }
            if(_this.entidadesCheck.length > 0){
                depositos = "{" + _this.entidadesCheck.join() + "}";
            }
            else{
            //    depositos = "{" + _this.entidades.join() + "}";
                depositos = null;
            }
        }
        else{
            for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            //depositos = "{" + _this.entidades.join() + "}";
            depositos = null;
        }*/

        var cadenaIdsT = "";
        var cadenaIdsC = "";
        var cadenaFinal = "";
        for (var i = 0; i < _this.gdCliente.storePrincipal.data.items.length; i++) {
            if (i != _this.gdCliente.storePrincipal.data.items.length - 1) {
                cadenaIdsC += _this.gdCliente.storePrincipal.data.items[i].data.iddocumento + "," ;
            } else {
                cadenaIdsC += _this.gdCliente.storePrincipal.data.items[i].data.iddocumento + "" ;
            }
        }


        if(cadenaIdsC)
        {
            cadenaFinal +=  cadenaIdsC+",";
        }
        cadenaFinal="{"+ cadenaFinal +"}"
        if(cadenaFinal== "{}") {
            cadenaFinal = null;
        }
        var dual = (alternativa) ? 'Dual' : '';
        this.tipoReportes =  new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/recuperaciones/OrdenDespacho'+dual,
                    isList: true,
                    params: {
                        //iddoc: iddocFac,
                        //fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                        //fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                        fecha: (_this.dfFecha.getValue()) ? _this.dfFecha.getValue().format('d-m-Y') : null,
                        idestructura: idEntidad,
                        arrayidnomoperaciones: (_this.comboOperaciones.getValue())? "{" + _this.comboOperaciones.getValue() + "}": null,
                        arraydocumento: _this.arrayToString(_this.gdCliente.storePrincipal),//cadenaFinal,
                        arraynrodoc: _this.arrayToString(_this.gdCliente.storePrincipal, true),//cadenaFinal,
                        //arraydeposito: depositos,
                        deposito: _this.comboDepositos.getValue(),
                        nrodespacho: _this.txtNroDespacho.getValue(),
                        monedacontable: monedacontable,
                        monedaalternativa: (monedaalternativa) ? monedaalternativa: null
                    }

                }
            ]
        });
        this.tipoReportes.view();
    },
    btnLimpiar: function(){
        var _this=this;
        _this.dfFecha.setValue(null);
        _this.comboDepositos.reset();
        _this.txtNroDespacho.reset();
        _this.txtNroDespacho.reset();
        _this.gdCliente.storePrincipal.removeAll();
    },
    addRecords: function (store, records) {
        var _this = this;

        Ext.each(records, function (record, index) {
            if (!_this.existsRecord(store, record)) {
                var recordType;
                if (store.idItem === 'producto') {
                    recordType = new store.recordType({
                        idproducto: record.get('idproducto'),
                        codigoproveedor: record.get('codigoproveedor'),
                        codigo: record.get('codigo'),
                        denominacion: record.get('denominacion')
                    });
                } else if(store.idItem === 'documento'){
                    recordType = new store.recordType({
                        iddocumento: record.get('iddocumento'),
                        nrodoc: record.get('nrodoc'),
                        fechacontable: record.get('fechacontable')
                    });
                } else {
                    recordType = new store.recordType({
                        idclientesproveedores: record.get('idclientesproveedores'),
                        nombre: record.get('nombre')
                    });
                }
                store.add(recordType);
            }
        });

    },
    existsRecord: function (store, record) {

        var flags = false;
        Ext.each(store.data.items, function (nRecord, index) {
            if (store.idItem === 'producto') {
                if ( nRecord.get('idproducto') === record.get('idproducto')) {
                    flags = true;
                }
            } else if (store.idItem === 'documento') {
                if ( nRecord.get('iddocumento') === record.get('iddocumento')) {
                    flags = true;
                }
            } else {
                if (nRecord.get('idclientesproveedores') === record.get('idclientesproveedores')) {
                    flags = true;
                }
            }
        });
        return flags;
    }

});
