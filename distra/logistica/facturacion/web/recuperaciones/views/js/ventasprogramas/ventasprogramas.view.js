Ext.ns('Ext.erp.ventasprogramas');
Ext.erp.ventasprogramas = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,

    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.ventasprogramas.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('RB')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
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
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idFacturasEmitidas'}));

        this.addToolbarButtonDeposito('->');

        this.comboOperaciones = new LOG.util.LovCombo({ //---combobox Tipo de producto
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'subsistema',
            editable: false,
            url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarSubsistemas',
            width: 250,
            listeners: {
                select: function(cmb, rd) {
                    _this.idsubsistema = rd.json.idsubsistema;
                    if (_this.idsubsistema != 10) {
                        _this.comboDepositos.disable();
                        _this.comboDepositos.clearValue();
                    } else {
                        _this.comboDepositos.enable();
                    }
                }
            }
        });
        this.cmbCentroCosto = new LOG.util.LovCombo({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCentroCostos',
            hiddenName: 'idcentrocosto',
            fieldLabel: 'Centro de costo',
            valueField: 'idcentrogrupo',
            displayField: 'text',
            mode: 'local',
            pageSize: 20,
            resizable: true,
            width: 250
        });

        this.comboDepositos = new LOG.util.LovCombo({//---combobox Tipo de producto
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            mode: 'remote',
            disabled: true,
            editable: false,
            width: 250
        });
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbOperaciones
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.comboOperaciones);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbCentroCosto
        }));
        this.addToolbarButtonDeposito(this.cmbCentroCosto);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));
        this.addToolbarButtonDeposito(this.comboDepositos);


        /*--------------Fieldset RangoFecha-----------------*/
        this.dfDesde1 = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdeFacturas',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeFacturas1',
            endDateField: 'hastaFacturas',
            editable: false
        });
        this.dfHasta1 = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastaFacturas',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaFacturas1',
            startDateField: 'desdeFacturas',
            editable: false
        });
        this.dfDesde1.endDateField = this.dfHasta1.id; //-------validacion de fecha
        this.dfHasta1.startDateField = this.dfDesde1.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            
           // width: 520,
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde1);
        this.clsFecha.addComponent(this.dfHasta1);

        this.fsRangoFecha1 = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            items: [this.clsFecha]
        });
        /*--------------Fieldset Productos-----------------*/
        this.fsProducto = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecProducto,
            height: 350           
        });
        this.gdProducto = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            type: 'productos',
            tltWinAdd: this.idioma.ttWinAddProductos,
            header: this.idioma.gcProducto,
            ttBtnAdd: this.idioma.ttAddProduct,
            ttBtnDel: this.idioma.ttElimProduct,
            idItem:'producto'
        });

        this.btnSelecProd = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            iconCls: 'adicionar',
            tooltip:  _this.idioma.ttAddProd,
            handler: function () {
            
                LOG.inv.maestroproductos.Loader.init(function () {
                    var params = _this.collectRecords();
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        parametros: params,
                        usarAplicar: true,
                        doAction: function (i) {
                            var self = this;
                       
                            var record = [];

                            Ext.each(i, function (obj) {
                                record.push(obj);
                            });
                            _this.gdProducto.storePrincipal.on({
                                'add':function(store,r,i){
                                    LOG.util.UIManager.apply(self.parametros,_this.collectRecords());
                                    self.panelProductos.getStorePrincipal().reload();
                                }
                            });

                            LOG.util.UIManager.apply(this.parametros,_this.collectRecords());
                            _this.gdProducto.storePrincipal.add(record);
                            if(_this.gdProducto.storePrincipal.length > 0){
                                this.close();
                            }
                        }
                    });
                    v.show();
                });

            }
        });
        this.btnElimProd = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            iconCls: 'eliminar',
            tooltip:  _this.idioma.ttElimProd,
            disabled: true,
            handler: function () {
                console.info(_this)
                var seleccion = [];
                Ext.each(_this.gdProducto.smGridPrincipal.selections.items, function(otro){
                
                    seleccion.push(otro);
                

                });
                Ext.each(seleccion, function(selected){
                    _this.gdProducto.storePrincipal.remove(selected);
                });
                if (_this.gdProducto.storePrincipal.getCount() == 0) {
                    _this.btnElimProd.setDisabled(true);
                }
            }

        });
        this.gdProducto.addToolbarButton(this.btnSelecProd);
        this.gdProducto.addToolbarButton(this.btnElimProd);
        this.gdProducto.init();
        this.fsProducto.add(this.gdProducto.view());

         /*--------------Fieldset Organismo-----------------*/
        this.fsOrganismo = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecOrg,
            height: 350
        });
        this.gdOrganismo = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            tltWinAdd: this.idioma.ttWinAddOrganismo,
            header: this.idioma.gcOrganismo,
            ttBtnAdd: this.idioma.ttAddOrganismo,
            ttBtnDel: this.idioma.ttElimOrganismo,
            idItem:'organismo'
        });
        this.btnSelecOrganismo = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddSOrganismo,
            iconCls: 'adicionar',
            handler: function () {

                var ventanaOrganismo = new Ext.erp.ventanaOrganismo({
                   // idorganismo: Ext.encode(idorganismo),
                    tipocliente: 'organismo',
                    concepto: 'organismo(s)',
                    busquedaBasica: true,
                    busquedaAvanzada: true,
                    urlBusquedaGridPrincipal: 'cargarOrganismos',
                    initDefaultColumns: function(){
                        this.addGridColumn({
                            header: _this.idioma.gcOrganismo,
                            width: 200,
                            dataIndex: 'nombre',
                            default: true
                        });
                        this.addGridColumn({
                            dataIndex: 'idorganismo'
                        });
                        // this.addGridColumn({
                        //     dataIndex: 'idpadre'
                        // });
                        this.addGridColumn({
                            header: 'Código',
                            width: 200,
                            dataIndex: 'codigo',
                            default: true
                    
                        });
                    }
                });
                ventanaOrganismo.init();

                ventanaOrganismo.getVistaPrincipal().title = _this.idioma.tlventanaOrganismos;
                ventanaOrganismo.view();
                ventanaOrganismo.getGridPrincipal().store.load();
                var botonAceptar = ventanaOrganismo.getVistaPrincipal().listaBotones.getItem(2);

                ventanaOrganismo.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaOrganismo.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaOrganismo.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });

                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaOrganismo.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.gdOrganismo.storePrincipal, records);

                });
            }
        });
        this.btnElimOrganismo = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimOrganismo,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdOrganismo.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdOrganismo.storePrincipal.remove(selected);
                });
                if (_this.gdOrganismo.storePrincipal.getCount() == 0) {
                    _this.btnElimOrganismo.setDisabled(true);
                }
            }
        });
        this.gdOrganismo.addToolbarButton(this.btnSelecOrganismo);
        this.gdOrganismo.addToolbarButton(this.btnElimOrganismo);
        this.gdOrganismo.init();
        this.fsOrganismo.add(this.gdOrganismo.view());

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 1
        });
        this.clsGeneral.addComponent(this.fsRangoFecha1);
        this.clsGeneral.addComponent(this.fsProducto);
        this.clsGeneral.addComponent(this.fsOrganismo);
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
            id:'formularioCentralFacturas',
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

        Ext.erp.ventasprogramas.superclass.constructor.call(this, config);


    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    arrayToString: function(store){
        var stringGeneric = "";
        for (var i = 0; i < store.data.items.length; i++) {
            if (i != store.data.items.length - 1) {
                stringGeneric += (store.data.items[i].data.idorganismo )? store.data.items[i].data.idorganismo + "," : store.data.items[i].data.idindicador + ",";
            } else {
                stringGeneric += (store.data.items[i].data.idorganismo )? store.data.items[i].data.idorganismo + "" : store.data.items[i].data.idindicador + "";
            }
        }
        stringGeneric = "{" + stringGeneric + "}";
        if(stringGeneric== "{}") {
            stringGeneric = null;
        }
        return stringGeneric;
    },
    getReportes: function (_this) {
        var depositos = "";
        _this.entidades=[];
        _this.entidadesCheck=[];
        if(this.comboDepositos.view){
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
                depositos = null;
            }
        }
        else{
            for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            depositos = null;
        }

        var cadenaIdsT = "";
        var cadenaIdsC = "";
        var cadenaFinal = "";
        var cadenaIndicadores = "";
        for (var i = 0; i < _this.gdProducto.storePrincipal.data.items.length; i++) {
            if (i != _this.gdProducto.storePrincipal.data.items.length - 1) {
                cadenaIndicadores += _this.gdProducto.storePrincipal.data.items[i].data.idindicador + ",";
            } else {
                cadenaIndicadores += _this.gdProducto.storePrincipal.data.items[i].data.idindicador+ "";
            }
        }

        if(cadenaIdsC && cadenaIdsT)
        {
            cadenaFinal +=  cadenaIdsC+",";
        }else if (cadenaIdsC && !cadenaIdsT)
        {
            cadenaFinal +=  cadenaIdsC;
        }
        if(cadenaIdsT)
        {
            cadenaFinal += cadenaIdsT;
        }
        cadenaFinal="{"+ cadenaFinal +"}"
        if(cadenaFinal== "{}") {
            cadenaFinal = null;
        }
        this.tipoReportes =  new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/recuperaciones/ProgramasPriorizados',
                    isList: true,
                    params: {
                        p_idestructura: idEntidad,
                        p_operaciones: (_this.comboOperaciones.getValue())? "{" + _this.comboOperaciones.getValue() + "}": null,
                        p_depositos: depositos,
                        p_centrocostos: (_this.cmbCentroCosto.getValue())? "{" + _this.cmbCentroCosto.getValue() + "}": null,                        
                        p_fechainicio: (_this.dfDesde1.getValue()) ? _this.dfDesde1.getValue().format('d-m-Y') : null,   
                        p_fechafin: (_this.dfHasta1.getValue()) ? _this.dfHasta1.getValue().format('d-m-Y') : null,                                     
                        p_productos: _this.arrayToString(_this.gdProducto.storePrincipal),
                        p_organismos: _this.arrayToString(_this.gdOrganismo.storePrincipal)                       
                     }
                 
                }
            ]
        });
        this.tipoReportes.view();
    },
    collectRecords: function(){
        var _this = this;
        _this.recordProd = _this.gdProducto.storePrincipal.data.items;
        var idProdSeleccionados = [];
        var parametros = {};

        Ext.each(_this.recordProd, function (rec) {
            if (rec.data.idindicador) {
                idProdSeleccionados.push(rec.data.idindicador);
            }
        });
        parametros.idseleccionados = Ext.encode(idProdSeleccionados);
        return parametros;
    },
    btnLimpiar: function(){
        var _this=this;
        _this.dfDesde1.setValue(null);
        _this.dfHasta1.setValue(null);
        _this.dfDesde1.setMaxValue(null);
        _this.dfHasta1.setMinValue(null);
        _this.comboDepositos.clearValue();
        _this.comboDepositos.disable();
        _this.comboOperaciones.clearValue();
        _this.cmbCentroCosto.clearValue();
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
                } else {
                    recordType = new store.recordType({
                        idorganismo: record.get('idorganismo'),
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
            } else {
                if (nRecord.get('idorganismo') === record.get('idorganismo')) {
                    flags = true;
                }
            }
        });
        return flags;
    }

});
