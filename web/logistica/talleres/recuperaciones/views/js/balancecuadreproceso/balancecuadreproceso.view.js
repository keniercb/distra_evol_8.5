Ext.ns('Ext.erp.balancecuadreproceso');
Ext.erp.balancecuadreproceso = Ext.extend(LOG.util.Panel, {
    periodos:undefined,
    entidades:[],
    panelGenereal:undefined,
    listaBotones:undefined,
    params:undefined,
    constructor: function (config) {
        var _this = this;
        this.acciones = config.acciones;
        this.idioma = LOG.util.UIManager.apply(this.idioma, Log.tall.balancecuadreproceso.Idioma);

        this.bindBody();
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            text:this.idioma.lbBtnImprimir,
            disabled:true,
            handler: function() {
                _this.getReportes(_this);
            }
        });
        this.listaBotones = new LOG.util.List();

        this.listaBotones.add(this.btnImprimir);

        config.layout = 'border';
        config.items = [{
            region:'north',
            tbar: this.listaBotones.getArray()
            },
            this.panelGeneral
        ];
        Ext.erp.balancecuadreproceso.superclass.constructor.call(this,config);
    },
    bindBody:function(){
        var _this = this;
        this.gridPrincipal = new Ext.erp.balancecuadreproceso.Grid({
            _parent: _this,
            formaVisualizacion:'panel'
        });
        this.gridPrincipal.init();
        var vista = this.gridPrincipal.view();

        this.gridSur = new Ext.erp.balancecuadreproceso.PanelDocumentos({
            _parent: _this,
            formaVisualizacion:'panel'
        });
        this.gridSur.init();
        var vistaSur = this.gridSur.view();

        this.gridDetallado = new Ext.erp.balancecuadreproceso.PanelDetallado({
            _parent: _this,
            formaVisualizacion:'panel'
        });
        this.gridDetallado.init();
        var vistaDetallado = this.gridDetallado.view();

        this.panelGeneral = new LOG.util.UIManager.initPanel({
            layout:'card',
            activeItem:0,
            region:'center',
            frame:true,
            items:[vista, vistaSur, vistaDetallado]
        });
    },
    getReportes:function(_this){
       
        var stringEnt = "";
        var estructuras = "";
        var ordenesn = [];
        _this.estructuras=[];

        for(var i=0; i < _this.gridPrincipal.getStorePrincipal().reader.jsonData.datos.length; i++){
            ordenesn.push(_this.gridPrincipal.getStorePrincipal().reader.jsonData.datos[i])
        }
        for(var i=0; i < _this.gridPrincipal.getStorePrincipal().reader.jsonData.datos.length; i++){
            _this.estructuras.push(_this.gridPrincipal.getStorePrincipal().reader.jsonData.datos[i].idestructura)
        }
        estructuras = "{"+_this.estructuras.join() + "}";
        if(estructuras== "{}") {
            estructuras = null;
        }

        stringEnt = "{" + _this.entidades.join() + "}";

        if(stringEnt== "{}") {
            stringEnt = null;
        }

        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/BalanceCuadreProceso',
                    isList:true,
                    params: {
                        idestructuras: estructuras,
                        fechainicio:_this.gridPrincipal.getStorePrincipal().reader.jsonData.datosPeriodo.inicio
                    }
                }
            ]
        });
        this.tipoReportes.view();

    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(this.acciones, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    onLoadMask: function(msg) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msg});
        myMask.show();
    },
    onUnMask: function() {
       var myMask = new Ext.LoadMask(Ext.getBody());
       myMask.hide();
    }
});

Ext.erp.balancecuadreproceso.Grid = Ext.extend(LOG.util.UITemplate, {
    cantColumnsEstaticas:0,
    params:undefined,
    constructor: function(config) {
        config.idioma = LOG.util.UIManager.apply(Log.tall.balancecuadreproceso.Idioma, LOG.util.Idioma);
        this.dirController = '/logistica/talleres/recuperaciones/index.php/balancecuadreproceso';
        this.urlBusquedaGridPrincipal = 'getBalancecuadreproceso';
        this.modoSeleccion = 1;
        this.busquedaBasica = false;
        this.formaVisualizacion = 'panel';
        this.params = {};
        this.idGridPrincipal = 'idcuadreproceso';
        this.idioma = config.idioma;

        this.onLoadMask('Cargando...');

        Ext.erp.balancecuadreproceso.Grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.balancecuadreproceso.Idioma);
    },
    render: function(config) {
        var render = Ext.erp.balancecuadreproceso.Grid.superclass.render.call(this, config);
        var _this = this;

        _this.periodo = '';

        _this.checkDetallado = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbcheckBalanceDetallado,
            name: 'detallado',
            style: 'margin:3px 0px 0px 35px',
            height: 20,
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked == true) {
                        _this.PanelRegionEast.expand();
                        _this.PanelRegionSouth.collapse();
                        _this.gridBalance.getStorePrincipal().removeAll();
                        _this.gridBalance.getGridPrincipal().getView().refresh();
                        _this.gridBalanceDetallado.getStorePrincipal().reload();
                        _this.getVistaPrincipal().doLayout();
                    } else {
                        _this.PanelRegionSouth.expand();
                         _this.PanelRegionEast.collapse();
                        _this.gridBalanceDetallado.getStorePrincipal().removeAll();
                        _this.gridBalanceDetallado.getGridPrincipal().getView().refresh();
                        _this.gridBalance.getStorePrincipal().reload();
                        _this.getVistaPrincipal().doLayout();
                    }
                }
            }
        });

        _this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            text: _this.idioma.lbBtnGuardarBalance,
            tooltip: _this.idioma.ttGuardar,
            handler: this.guardarBalance,
            scope: this
        });

        _this.btonHistorialBalance = LOG.util.UIManager.createBtn({
            iconCls: 'estado',
            text: _this.idioma.lbBtnHistorial,
            tooltip: _this.idioma.ttHistorial,
            isContextual: true,
            handler: function () {
                var winHistorialBalance = new Ext.erp.balancecuadreproceso.winHistorialBalance({
                    _parent: _this,
                    idioma: _this.idioma
                });
                winHistorialBalance.init();
                _this.vistawinHistorialBalance = winHistorialBalance.view();
                _this.vistawinHistorialBalance.show();
            }
        });

        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                key: 'b',
                fn: function () {
                    if(render.isVisible())
                       _this.Buscar();
                }
            }]);

            this.gpPrincipal.getTopToolbar().add(
                '-',
                _this.btnSalvar,
                 '-',
                _this.btonHistorialBalance,
                '-',
                _this.checkDetallado
            );

        this.getStorePrincipal().on({
            load: function(st, records, op) {
                _this.onUnMask();
                if (_this.getStorePrincipal().getCount() == 0) {
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                    _this._parent.btnImprimir.setDisabled(true);
                } else {
                    _this._parent.btnImprimir.setDisabled(false);
                }
            }
        });

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            _this.gridBalance = new Ext.erp.balancecuadreproceso.PanelDocumentos({
                idioma: this.idioma,
                modelo: this.modelo,
                _parent: this,
                stBalance: _this.getStorePrincipal() ? _this.getStorePrincipal() : _this.store
            });
            _this.gridBalance.init();

            _this.PanelRegionSouth = LOG.util.UIManager.initPanel({
                title: _this.idioma.tlDetalles,
                layout: 'fit',
                region: 'center',
                hideCollapseTool: true,
                titleCollapse: false,
                collapsible: true,
                collapseMode: 'mini',
                animCollapse: false,
                height: 350,
                split: true,
                //animate: true,
                collapsed: true,
                listeners: {
                    'collapse': function () {
                        this.hide();
                        _this.getPanelGrid().doLayout();
                    },
                    'beforeexpand': function () {
                        this.show();
                    }
                }
            });

            _this.PanelRegionSouth.add(_this.gridBalance.view());

            _this.gridBalanceDetallado = new Ext.erp.balancecuadreproceso.PanelDetallado({
                idioma: this.idioma,
                modelo: this.modelo,
                _parent: this
            });
            _this.gridBalanceDetallado.init();

            _this.PanelRegionEast = LOG.util.UIManager.initPanel({
                title: _this.idioma.tlDetallado,
                layout: 'fit',
                region: 'center',
                hideCollapseTool: true,
                titleCollapse: false,
                collapsible: true,
                collapseMode: 'mini',
                animCollapse: false,
                height: 350,
                //animate: true,
                split: true,
                collapsed: true,
                listeners: {
                    'collapse': function () {
                        this.hide();
                        _this.getPanelGrid().doLayout();
                    },
                    'beforeexpand': function () {
                        this.show();
                    }
                }
            });

            _this.PanelRegionEast.add(_this.gridBalanceDetallado.view());

            _this.panelSouth = LOG.util.UIManager.initPanel({
                layout: 'fit',
                region: 'south',
                hideCollapseTool: true,
                titleCollapse: true,
                collapsible: true,
                collapseMode: 'mini',
                animCollapse: false,
                height: 350,
                split: true,
                collapsed: true,
                items: [_this.PanelRegionSouth, _this.PanelRegionEast],
                listeners: {
                    'collapse': function () {
                        this.hide();
                        _this.getPanelGrid().doLayout();
                    },
                    'beforeexpand': function () {
                        this.show();
                        _this.getPanelGrid().doLayout();
                    },
                    'resize': function (panel, adjWidth, adjHeight, rawWidth, rawHeight) {
                        _this.PanelRegionEast.setHeight(adjHeight-2);
                        _this.PanelRegionEast.doLayout();
                    }
                }
            });

            _this.getPanelPrincipal().add(_this.panelSouth);

            _this.gridBalance.getStorePrincipal().on({
                'beforeload': function () {
                    this.initBaseParams.idcuenta = _this.getSmPrincipal().getSelected().json.idcuenta;
                }
            });

            _this.gridBalanceDetallado.getStorePrincipal().on({
                'beforeload': function () {
                    this.initBaseParams.idcuenta = _this.getSmPrincipal().getSelected().json.idcuenta;
                }
            });

            _this.getSmPrincipal().on('selectionchange', function(sm) {
                if (sm.getCount() == 1 && sm.getSelected().data.diff != 0 && sm.getSelected().data.importeorden != 0) {
                    _this.panelSouth.expand();
                    if (!_this.checkDetallado.getValue()) {
                        _this.PanelRegionSouth.expand();
                        _this.PanelRegionEast.collapse();
                        _this.gridBalance.idcuenta = sm.getSelected().get('idcuenta');
                        _this.gridBalance.getStorePrincipal().load();
                    } else {
                        _this.PanelRegionEast.expand();
                        _this.PanelRegionSouth.collapse();
                        _this.gridBalanceDetallado.idcuenta = sm.getSelected().get('idcuenta');
                        _this.gridBalanceDetallado.getStorePrincipal().load();
                    }
                } else {
                    _this.panelSouth.collapse();
                    if ( _this.gridBalance){
                        _this.gridBalance.getStorePrincipal().removeAll();
                    }
                    if (_this.gridBalanceDetallado){
                        _this.gridBalanceDetallado.getStorePrincipal().removeAll();
                    }
                }
            });
        });

        _this.getStorePrincipal().on('beforeload', function(sm) {
            _this.panelSouth.collapse();
            if ( _this.gridBalance){
                _this.gridBalance.getStorePrincipal().removeAll();
            }
            if (_this.gridBalanceDetallado){
                _this.gridBalanceDetallado.getStorePrincipal().removeAll();
            }
            _this.getSmPrincipal().clearSelections();
        });

        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams,_this);
        return render;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.cgCuenta,
            dataIndex: 'cuenta',
            width: 350,
            aling : 'left',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgSaldoContable,
            dataIndex: 'saldocontableot',
            width: 350,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: _this.idioma.cgSaldoOT,
            dataIndex: 'importeorden',
            width: 350,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            header: _this.idioma.cgDiferencia,
            dataIndex: 'diff',
            width: 350,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({dataIndex: 'idcuenta'});
    },
    getReportes: function (data) {
        var _this = this;

    },
    Buscar: function (){
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
    },
    Limpiar: function(){
        var _this = this;
        _this.getStorePrincipal().filtrado = false;
        _this.getStorePrincipal().load();
    },
    getIndexByDataIndexDinamic:function(header){
        var longitud = this.listaColumnas.count();
        for(var i= this.cantColumnsEstaticas; i < longitud; i++){
            var it = this.listaColumnas.getItem(i);
            if(it && it.dataIndex == header){
               return i;
            }
        }
        return false;
    },
    atIndex:function(list, item){
        var res = -1;
        list.each(function(elem, index){
            if(elem === item){
                res = index;
            }
        });
        return res
    },
    guardarBalance: function (params) {
        var _this = this;
        _this.arrayCuentas = new Array();
        var selecciones = this.scope.getGridPrincipal().getStore().data.items;
        Ext.MessageBox.wait('Guardando datos', 'Espere' || '...');
       
        if (selecciones.length > 0 ) {
        Ext.each(selecciones, function(dat) {
            _this.arrayCuentas.push({
                saldocontable:dat.data.saldocontableot,
                saldoot:dat.data.importeorden,
                diferencia:dat.data.diff,
                idcuenta:dat.data.idcuenta
            }) ;            
           })
        }
           var params = params || {
          //  arrayCuentas:_this.arrayCuentas
             arrayCuentas: Ext.encode(_this.arrayCuentas)
           };

        Ext.Ajax.request({
            url: '/logistica/talleres/recuperaciones/index.php/balancecuadreproceso/adicionarBalance',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, 'El balance ha sido guardado satisfactoriamente');
                }
            }
        });
    },
    setParams:function(newParams){
        this.params = newParams;
    },
    onLoadMask: function(msg) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msg});
        myMask.show();
    },
    onUnMask: function() {
        var myMask = new Ext.LoadMask(Ext.getBody());
        myMask.hide();
    }
});

Ext.erp.balancecuadreproceso.PanelDocumentos = Ext.extend(LOG.util.UITemplate, {
    _parent: undefined,
    stBalance: undefined,
    constructor: function (config) {
        config.autoLoad = false;
        config.concepto = 'documentos';
        config.busquedaBasica = false;
        config.textBusquedaSimple = 'No. VE';
        config.idGridPrincipal = 'iddocumento';
        config.dirController = '/logistica/talleres/recuperaciones/index.php/balancecuadreproceso';
        config.urlBusquedaGridPrincipal = 'cargardocumentoscuadre';
        config.gridEditable = true;
        config.pruneModifiedRecords = true;
        config.modoSeleccion = 1;
        config.idioma = Log.tall.balancecuadreproceso.Idioma;
        config.formaVisualizacion = 'panel';
        Ext.erp.balancecuadreproceso.PanelDocumentos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.cgNoOT,
            width: 80,
            dataIndex: 'nroorden',
            default: true,
            renderer: function (value, metaData, record) {
                if (record.json.nroorden != 0) {
                    return value;
                } else {
                    return '-';
                }
            },
            filter: {
                type: 'string',
                emptyText: _this.idioma.cgNoOT,
                dataIndex: 'nroorden'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgNoVE,
            width: 80,
            dataIndex: 'nrove',
            default: true,
            filter: {
                type: 'string',
                emptyText: _this.idioma.cgNoVE,
                dataIndex: 'nrove'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgTipoDocOrigen,
            width: 120,
            dataIndex: 'tipodocorigen',
            default: true,
            filter: {
                type: 'list',
                options: [[1, _this.idioma.lbFieldDistribucion], [2, _this.idioma.lbFieldOrdenTrabajo]],
                dataIndex: 'tipodocorigen'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgFechaVE,
            width: 80,
            dataIndex: 'fechave',
            default: true,
            filter: {
                type: 'date',
                dateFormat: 'd/m/Y',
                dataIndex: 'fechave'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgSubCuenta,
            width: 150,
            dataIndex: 'nombrecuenta',
            default: true,
            filter: {
                type: 'string',
                emptyText: _this.idioma.cgSubCuenta,
                dataIndex: 'nombrecuenta'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgDeposito,
            width: 350,
            dataIndex: 'deposito',
            default: true,
            autoExpand: true,
            filter: {
                type: 'combo',
                url: '/logistica/talleres/recuperaciones/index.php/balancecuadreproceso/cargarDepositos',
                autoLoad: false,
                valueField: 'iddeposito',
                displayField: 'text',
                dataIndex: 'deposito'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgNoComprobante,
            width: 100,
            dataIndex: 'nrocomprobante',
            default: true,
            filter: {
                type: 'string',
                emptyText: _this.idioma.cgNoComprobante,
                dataIndex: 'nrocomprobante'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgImporteVE,
            dataIndex: 'importeve',
            width: 120,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgEstadoComprobanteVE,
            dataIndex: 'textove',
            width: 120,
            align: "center",
            default : true,
            filter : {
                type : 'combo',
                store : new Ext.data.SimpleStore({
                    fields: ['corregidove', 'textove'],
                    data: [['-1','No'],['1', 'Si']]
                }),
                valueField : 'corregidove',
                displayField: 'textove',
                dataIndex : 'textove'
            },
            renderer: function (value, metaData, record) {
                if (record.json.corregidove == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttCorregido + '"';
                } else {
                    metaData.css = 'icondistra-cancelar rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttNoCorregido + '"';
                }
            }
        });

        _this.editorCantidadVE = new Ext.form.NumberField({
            allowBlank: true,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxValue: 100000000,
            minValue: 0,
            enableKeyEvents: true,
            listeners: {
                'focus': function (t) {
                    t.selectText(0, t.getValue().length);
                },
                'blur' : function() {
                    _this.btnGuardarComprobante.enable();
                }
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgNoComprobanteCorregidoVE,
            dataIndex: 'nrocomprobantecontve',
            width: 160,
            default : true,
            editor: _this.editorCantidadVE
        });

        this.addGridColumn({
            header: _this.idioma.cgNoVD,
            width: 80,
            dataIndex: 'nrovd',
            default: true,
            renderer: function (value, metaData, record) {
                if (record.json.nrovd != 0) {
                    return value;
                } else {
                    return '-';
                }
            },
            filter: {
                type: 'string',
                emptyText: _this.idioma.cgNoVD,
                dataIndex: 'nrovd'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgImporteVD,
            dataIndex: 'importevd',
            width: 120,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgEstadoComprobanteVD,
            dataIndex: 'textovd',
            width: 120,
            align: "center",
            default : true,
            filter : {
                type : 'combo',
                store : new Ext.data.SimpleStore({
                    fields: ['corregidovd', 'textovd'],
                    data: [['-1','No'],['1', 'Si']]
                }),
                valueField : 'corregidovd',
                displayField: 'textovd',
                dataIndex : 'textovd'
            },
            renderer: function (value, metaData, record) {
                if (record.json.corregidovd == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttCorregido + '"';
                } else {
                    metaData.css = 'icondistra-cancelar rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttNoCorregido + '"';
                }
            }
        });

        _this.editorCantidadVD = new Ext.form.NumberField({
            allowBlank: true,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxValue: 100000000,
            minValue: 0,
            enableKeyEvents: true,
            listeners: {
                'focus': function (t) {
                    t.selectText(0, t.getValue().length);
                },
                'blur' : function() {
                    _this.btnGuardarComprobante.enable();
                }
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgNoComprobanteCorregidoVD,
            dataIndex: 'nrocomprobantecontvd',
            width: 160,
            default : true,
            editor: _this.editorCantidadVD
        });

        this.addGridColumn({dataIndex: 'idcuenta'});

        this.addGridColumn({dataIndex: 'idestructura'});

        this.addGridColumn({dataIndex: 'iddocumento'});

        this.addGridColumn({dataIndex: 'idcomprobanteve'});

        this.addGridColumn({dataIndex: 'idcomprobantevd'});
    },
    render: function (config) {
        var render =  Ext.erp.balancecuadreproceso.PanelDocumentos.superclass.render.call(this, config);
        var _this = this;

        _this.textDesdeDetalles = new Ext.form.DateField({
            width: 100,
            editable: false,
            enableKeyEvents: true,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    _this.validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarDetalles();
                    }
                }
            }
        });

        _this.textHastaDetalles = new Ext.form.DateField({
            width: 100,
            editable: false,
            enableKeyEvents: true,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    _this.validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarDetalles();
                    }
                }
            }
        });

        _this.tFNroValeentrega = new Ext.form.TextField({
            autoCreate: true,
            id: 'idnove',
            width: 100,
            emptyText: _this.idioma.cgNoVE,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarDetalles();
                    }
                }
            }
        });

        _this.btnBuscar = new LOG.util.Prototipos.botonBuscar({text: _this.idioma.tBtnBuscar, tooltip: _this.idioma.ttBtnBuscar,  handler: function() {
                _this.btnBuscarDetalles();
            }});

        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({text: _this.idioma.lbBtnLimpiar, tooltip: _this.idioma.ttBtnLimpiar,  handler: function() {
                _this.btnLimpiarDetalles();
            }});

        _this.btnGuardarComprobante = LOG.util.Prototipos.botonGuardar({
            disabled: true,
            text: _this.idioma.lbBtnGuardarComprobante,
            tooltip: _this.idioma.ttGuardarComprobante,
            handler: this.guardarComprobante,
            scope: this
        });

        _this.cmbTipoVale = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCmbTipoVale,
            store: new Ext.data.SimpleStore({
                fields: ['idtipovale', 'tipovale'],
                data: [[1, _this.idioma.lbConCuentaProceso],
                      [2, _this.idioma.lbSinCuentaProceso],
                      [3, _this.idioma.lbDevolucionesConCP],
                      [4, _this.idioma.lbDevolucionesSinCP]]
            }),
            width: 320,
            hiddenName: 'tipovale',
            valueField: 'idtipovale',
            displayField: 'tipovale',
            emptyText: _this.idioma.lbCmbTipoVale,
            editable: false,
            listeners: {
                select: function (_cmbTipoVale, r, i) {
                    _this.getStorePrincipal().removeAll();
                    if (_cmbTipoVale.getValue() == '1' || _cmbTipoVale.getValue() == '2') {
                        _this.ocultarColumna('textove', false);
                        _this.ocultarColumna('nrocomprobantecontve', false);
                        _this.ocultarColumna('textovd', true);
                        _this.ocultarColumna('nrocomprobantecontvd', true);
                    } else if (_cmbTipoVale.getValue() == '3' || _cmbTipoVale.getValue() == '4')  {
                        _this.ocultarColumna('textove', true);
                        _this.ocultarColumna('nrocomprobantecontve', true);
                        _this.ocultarColumna('textovd', false);
                        _this.ocultarColumna('nrocomprobantecontvd', false);
                    } else {
                        _this.ocultarColumna('textove');
                        _this.ocultarColumna('nrocomprobantecontve');
                        _this.ocultarColumna('textovd');
                        _this.ocultarColumna('nrocomprobantecontvd');
                    }
                    _this.getStorePrincipal().reload();
                }
            }
        });

        this.gpPrincipal.getTopToolbar().add(
            '-',
            new Ext.form.Label({text: _this.idioma.lbTfDesde}),
            _this.textDesdeDetalles,
            '-',
            new Ext.form.Label({text: _this.idioma.lbTfHasta}),
            _this.textHastaDetalles,
            '-',
            _this.tFNroValeentrega,
            '-',
            _this.cmbTipoVale,
            '-',
            _this.btnBuscar,
            '-',
            _this.btnLimpiar,
            '->',
            _this.btnGuardarComprobante
        );

       this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                Ext.apply(obj.params, {
                    fechainicio: (_this.textDesdeDetalles.getValue()) ? _this.textDesdeDetalles.getValue().format('d/m/Y') : null,
                    fechafin: (_this.textHastaDetalles.getValue()) ? _this.textHastaDetalles.getValue().format('d/m/Y') : null,
                    criterio: (_this.tFNroValeentrega.getValue()) ? _this.tFNroValeentrega.getValue() : null,
                    tipovale: (_this.cmbTipoVale.getValue()) ? _this.cmbTipoVale.getValue() : null
                });
            },
            load: function(st, records, op) {
                if (_this.getStorePrincipal().getCount() == 0) {
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });

        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
        return render;
    },
    btnBuscarDetalles: function (){
        var _this = this;
        var desde = _this.textDesdeDetalles.getValue();
        var hasta = _this.textHastaDetalles.getValue();
        var nrovaleentrega = _this.tFNroValeentrega.getValue();
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().load();
    },
    btnLimpiarDetalles: function(){
        var _this = this;

        if(_this.textDesdeDetalles.getValue() || _this.textHastaDetalles.getValue() || _this.tFNroValeentrega.getValue() || _this.gpPrincipal.filters || _this.cmbTipoVale.getValue()) {
            _this.textDesdeDetalles.reset();
            _this.textHastaDetalles.reset();
            _this.tFNroValeentrega.reset();
            _this.cmbTipoVale.reset();
            _this.gpPrincipal.filters.clearFilters();
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();
        }
    },
    validarFecha: function () {
        var _this = this;
        if (_this.textDesdeDetalles.getValue()) {
            _this.textHastaDetalles.setMinValue(_this.textDesdeDetalles.getValue());
        }
        if (_this.textHastaDetalles.getValue()) {
            _this.textDesdeDetalles.setMaxValue(_this.textHastaDetalles.getValue());
        }
    },
    guardarComprobante: function (params) {
        var _this = this.scope || this;
        var record = _this.storePrincipal.getModifiedRecords();
        var arrayObj = new Array();

        Ext.MessageBox.wait(_this.idioma.msgGuardarDatosComp, _this.idioma.msgEspere || '...');

        Ext.each(record, function (rec) {
            arrayObj.push({
                iddocumento: rec.data.iddocumento,
                nrocomprobanteve: rec.data.nrocomprobantecontve ? rec.data.nrocomprobantecontve : null,
                nrocomprobantevd: rec.data.nrocomprobantecontvd ? rec.data.nrocomprobantecontvd : null
            });
        });

        var parametros = params || {
            arregloDatos: Ext.encode(arrayObj)
        };

        Ext.Ajax.request({
            url: '/logistica/talleres/recuperaciones/index.php/balancecuadreproceso/guardarComprobante',
            method: 'POST',
            params: parametros,
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                Ext.MessageBox.hide();
                if (resp.success) {
                    mostrarMensaje(1, _this.idioma.msgGuardarCompCorregido);
                    _this.stBalance.reload();
                    _this.getStorePrincipal().commitChanges();
                } else {
                    mostrarMensaje(3, _this.idioma.msgErrorComp);
                }
            }
        });
    }
});

Ext.erp.balancecuadreproceso.PanelDetallado = Ext.extend(LOG.util.UITemplate, {
    _parent: undefined,
    constructor: function (config) {
        config.autoLoad = false;
        config.concepto = 'detalles';
        config.busquedaBasica = false;
        config.idGridPrincipal = 'iddocumento';
        config.dirController = '/logistica/talleres/recuperaciones/index.php/balancecuadreproceso';
        config.urlBusquedaGridPrincipal = 'cargardocumentoscuadretallado';
        config.modoSeleccion = 1;
        config.idioma = Log.tall.balancecuadreproceso.Idioma;
        config.formaVisualizacion = 'panel';
        Ext.erp.balancecuadreproceso.PanelDetallado.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.cgNoOTDetallado,
            dataIndex: 'nrodoc',
            width: 150,
            aling : 'left',
            default: true,
            filter: {
                type: 'string',
                emptyText: _this.idioma.cgNoOTDetallado,
                dataIndex: 'nrodoc'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgFIDetallado,
            dataIndex: 'fechaini',
            width: 150,
            aling : 'left',
            default: true,
            filter: {
                type: 'date',
                dateFormat: 'd/m/Y',
                dataIndex: 'fechaini'
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgSaldoContableDetallado,
            dataIndex: 'saldocontableot',
            width: 200,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgSaldoOTDetallado,
            dataIndex: 'importeorden',
            width: 200,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgDiferenciaDetallado,
            dataIndex: 'diff',
            width: 200,
            align: "right",
            default : true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgEstadiaDetallado,
            dataIndex: 'estadia',
            width: 200,
            align: "right",
            default: true
        });

        this.addGridColumn({dataIndex: 'idcuenta'});

        this.addGridColumn({dataIndex: 'idestructura'});
    },
    render: function (config) {
        var render =  Ext.erp.balancecuadreproceso.PanelDetallado.superclass.render.call(this, config);
        var _this = this;

        _this.textDesdeDetalles = new Ext.form.DateField({
            width: 100,
            editable: false,
            enableKeyEvents: true,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    _this.validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarDetalles();
                    }
                }
            }
        });

        _this.textHastaDetalles = new Ext.form.DateField({
            width: 100,
            editable: false,
            enableKeyEvents: true,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    _this.validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarDetalles();
                    }
                }
            }
        });

        _this.tFNroOT = new Ext.form.TextField({
            autoCreate: true,
            id: 'idnoot',
            width: 100,
            emptyText: _this.idioma.cgNoOTDetalladoBS,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscarDetalles();
                    }
                }
            }
        });

        _this.checkOCerradasDiff = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbCheckOCerradasDif,
            name: 'ocdiferencia',
            style: 'margin:3px 0px 0px 10px',
            height: 20,
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    _this.getStorePrincipal().removeAll();
                    _this.getStorePrincipal().load();
                }
            }
        });

        _this.btnBuscar = new LOG.util.Prototipos.botonBuscar({text: _this.idioma.tBtnBuscar, tooltip: _this.idioma.ttBtnBuscar,  handler: function() {
                _this.btnBuscarDetalles();
            }});

        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({text: _this.idioma.lbBtnLimpiar, tooltip: _this.idioma.ttBtnLimpiar,  handler: function() {
                _this.btnLimpiarDetalles();
            }});

        this.gpPrincipal.getTopToolbar().add(
            '-',
            new Ext.form.Label({text: _this.idioma.lbTfDesdeDetallado}),
            _this.textDesdeDetalles,
            '-',
            new Ext.form.Label({text: _this.idioma.lbTfHastaDetallado}),
            _this.textHastaDetalles,
            '-',
            _this.tFNroOT,
            '-',
            _this.checkOCerradasDiff,
            '-',
            _this.btnBuscar,
            '-',
            _this.btnLimpiar
        );
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                Ext.apply(obj.params, {
                    fechainicio: (_this.textDesdeDetalles.getValue()) ? _this.textDesdeDetalles.getValue().format('d/m/Y') : null,
                    fechafin: (_this.textHastaDetalles.getValue()) ? _this.textHastaDetalles.getValue().format('d/m/Y') : null,
                    criterio: (_this.tFNroOT.getValue()) ? _this.tFNroOT.getValue() : null,
                    condiferencias: (_this.checkOCerradasDiff.getValue()) ? _this.checkOCerradasDiff.getValue() : null
                });
            }
        });

        LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
        return render;
    },
    btnBuscarDetalles: function (){
        var _this = this;
        var desde = _this.textDesdeDetalles.getValue();
        var hasta = _this.textHastaDetalles.getValue();
        var nroot = _this.tFNroOT.getValue();
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().load();
    },
    btnLimpiarDetalles: function(){
        var _this = this;
        if(_this.textDesdeDetalles.getValue() || _this.textHastaDetalles.getValue() || _this.tFNroOT.getValue()  || _this.gpPrincipal.filters || _this.checkOCerradasDiff.getValue()) {
            _this.textDesdeDetalles.reset();
            _this.textHastaDetalles.reset();
            _this.tFNroOT.reset();
            _this.checkOCerradasDiff.reset();
            _this.gpPrincipal.filters.clearFilters();
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();
        }
    },
    validarFecha: function () {
        var _this = this;
        if (_this.textDesdeDetalles.getValue()) {
            _this.textHastaDetalles.setMinValue(_this.textDesdeDetalles.getValue());
        }
        if (_this.textHastaDetalles.getValue()) {
            _this.textDesdeDetalles.setMaxValue(_this.textHastaDetalles.getValue());
        }
    }
});

Ext.erp.balancecuadreproceso.winHistorialBalance = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    constructor: function (config) {
        config.autoLoad = false;
        config.dirController = '/logistica/talleres/recuperaciones/index.php/balancecuadreproceso';
        config.urlBusquedaGridPrincipal = 'cargarHistorialBalance';
        config.modoSeleccion = 1;
        config.busquedaAvanzada = true;
        config.autoSelect = false;
        config.idioma = Log.tall.balancecuadreproceso.Idioma;
        config.formaVisualizacion = 'ventana';
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        config.record = config.record;
        Ext.erp.balancecuadreproceso.winHistorialBalance.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.cgCuentaHist,
            width: 180,
            dataIndex: 'concatcta',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgDescripcion,
            width: 180,
            dataIndex: 'cuenta',
            default: true,
            width:300
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgSaldo,
            width: 100,
            dataIndex: 'saldocontable',
            default: true,
            align: "right"
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgSaldoOTHist,
            width: 100,
            dataIndex: 'saldoot',
            default: true,
            align: "right"
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgDiferenciaHist,
            width: 100,
            dataIndex: 'diferencia',
            default: true,
            align: "right"
        }));

        this.addGridColumn({
            header: _this.idioma.cgFecha,
            width: 100,
            dataIndex: 'fecha',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgTipoCierre,
            width: 100,
            dataIndex: 'tipocierre',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgUsuario,
            width: 100,
            dataIndex: 'nombreusuario',
            default: true
        });

        this.addGridColumn({dataIndex: 'idestructura'});

        this.addGridColumn({dataIndex: 'idcuenta'});

    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            disabled: true,
            tooltip: _this.idioma.tlImprimirHist,
            handler: function() {
                    this.tipoReportes = new LOG.util.Report({
                        reports: [{
                            dirReport: '/distra/logistica/talleres/recuperaciones/HistorialBalanceProceso/HistorialBalanceProceso',
                            isList:true,
                            params: {

                            }
                        }]
                    });
                    this.tipoReportes.view();
            },
            controlFn: function(b, _this) {
                _this.getGridPrincipal().store.fireEvent = _this.getGridPrincipal().store.fireEvent.createSequence(function(e) {
                    if (e == 'load') {
                        if (_this.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
    },
    init: function () {
        var _this = this;
        Ext.erp.balancecuadreproceso.winHistorialBalance.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {


        });

        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
       this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
    },
    render: function () {
        var _this = this;
        var render =  Ext.erp.balancecuadreproceso.winHistorialBalance.superclass.render.call(this);

        this.getStorePrincipal().load();
        return render;
    },
    view:function(){
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
     
        var clsFsRangoFechaPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        var clsFsRFInternoPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.FechaDesdeBA = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbTfDesdeHist,
            name: 'desdeBA',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeBA',
            endDateField: 'hastaBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaDesdeBA);

        this.FechaHastaBA = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbTfHastaHist,
            name: 'hastaBA',
            //xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaBA',
            startDateField: 'desdeBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaHastaBA);

        clsFsRangoFechaPeriodo.addComponent(
            new Ext.form.FieldSet({
                title: _this.idioma.lbFsCierre,
                items: clsFsRFInternoPeriodo,
            })
        );
        _this.addFilterComponent(clsFsRangoFechaPeriodo);
        var view = Ext.erp.balancecuadreproceso.winHistorialBalance.superclass.view.call(this);
       return view;
    }
});