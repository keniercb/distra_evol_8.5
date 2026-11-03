/**
 * @class Ext.DatMaest.ClientProveed
 * @extends Ext.panel
 * @author Ing. Alberto Mesa Martínez
 */
Ext.ns('Ext.DatMaest.ClientProveed');
Ext.DatMaest.ClientProveed.Panel = Ext.extend(Ext.Panel, {
    layout: 'border',
    border: true,
    autoScroll: true,
    modal: true,
    singleSelect: false,
    perfil: window.parent.UCID.portal.perfil,
    baseUrl: "/configuracion/clientesyproveedores/index.php/clientesyproveedores/",
    enuso: 1,
    constructor: function (params) {
        var me = this;
        this.addEvents('ready');

        this.loadMask = new Ext.LoadMask(Ext.getBody());
        this.loadMask.show();
        Ext.Ajax.request({
            url: '/crm/configuracion/index.php/confcontratacion/loadConfClientesproveedores',
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if (response.config && response.config['idconfclientesproveedores']) {
                    var datos = response.config['config'] ? Ext.decode(response.config['config']) : {};
                    datos['activo'] = response.config['activo'] == "1";
                    me.config = datos;
                }
                if (params && params.etiquetas) {
                    me.loadMask.hide();
                    me.etiquetas = params.etiquetas;
                    me.createComponent(params);
                } else {
                    Ext.Ajax.request({
                        method: "POST",
                        url: this.baseUrl + "cargaretiquetas",
                        params: {
                            vista: 'clientesyproveedores'
                        },
                        scope: this,
                        callback: function (options, success, response) {
                            me.etiquetas = Ext.decode(response.responseText);
                            me.loadMask.hide();
                            me.createComponent(params);
                        }
                    });
                }
            }
        });
    },
    createComponent: function (params) {
        Ext.apply(this, params);
        var _this = this;
        this.createItems();
        if (params && params.toolbar) {
            this.createToolbar()
        }


        Ext.DatMaest.ClientProveed.Panel.superclass.constructor.call(this, params);

        setTimeout(function () {
            _this.fireEvent('ready');
        }, 10);
    },
    createItems: function () {
        var _this = this;
        this.store = this.stClienteProveedor = new Ext.data.GroupingStore({    
		 //this.store = this.stClienteProveedor = new Ext.data.Store({    
            url: this.baseUrl + 'cargarclientesproveedor',
            baseParams: {
                start: 0,
                limit: 20,
                enuso: 'true'
            },
			sortInfo:{field: 'organismo'},
            groupField:'organismo',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: 'idclientesproveedores'
            },
                [
                {
                    name: 'idclientesproveedores'
                },
                {
                    name: 'foto'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'abreviatura'
                },
                {
                    name: 'telefono'
                },
                {
                    name: 'correo'
                },
                {
                    name: 'dpa'
                },
                {
                    name: 'descripciondpa'
                },
                {
                    name: 'direccion'
                },
                {
                    name: 'idtipo'
                },
                {
                    name: 'idclasificacioncontable'
                },
                {
                    name: 'idclasificacion'
                },
                {
                    name: 'enuso'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'idestructura'
                },
                {
                    name: 'idpersona'
                },
                {
                    name: 'idestructuracomun'
                },
                {
                    name: 'registrado'
                },
                {
                    name: 'entidad'
                },
                {
                    name: 'idcuentasacobrar'
                },
                {
                    name: 'cuentasacobrar'
                },
                {
                    name: 'idcuentasapagar'
                },
                {
                    name: 'cuentasapagar'
                },
                {
                    name: 'credito'
                },
                {
                    name: 'fechainicio'
                },
                {
                    name: 'fechafin'
                },
                {
                    name: 'idusuario'
                },
                {
                    name: 'nombreusuario'
                },
                {
                    name: 'idmapa'
                },
                {
                    name: 'codigonit'
                },
                {
                    name: 'certificourl'
                },
                {
                    name: 'idpadre'
                },
                {
                    name: 'nombrepadre'
                },
				{
                    name: 'organismo'
                },
                    {
                        name: 'idorganismo'
                    },{
                    name: 'sector'
                },
                    {
                        name: 'idsector'
                    },
                     {
                    name: 'idclienteproveedorentidad'
                },
                {
                    name: 'mayorista'
                },
                'identificadores','totalidentificadores', 'idespaciotrabajo',
                    'idclienteproveedorentidad',  'habilitado', 'argumento', 'argumentousuario', 'deuda',
                    'pnombre', 'snombre', 'papellido', 'sapellido', 'idpais', 'pais', 'codigopais', 'fechaaprobacion', 
                    'tipoproveedorproducto', 'tipoproveedortiempo'

            ])
        });

        this.stClienteProveedor.on({
            scope: this,
            beforeload: function () {
                this.enableButtons('beforeload');
            },
            load: function (store, records, options) {
                this.enableButtons('load');
                if (store.getCount() == 0) {
                    var message = (!Ext.isEmpty(this.stClienteProveedor.baseParams.filtro)) ? this.etiquetas.lbNoDataResults : this.etiquetas.lbNoResults;
                    mostrarMensaje(1, message);
                }
            }
        });

        this.cmbClasificacion = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: [
                    {'name': 'id'},
                    {'name': 'denominacion'}
                ],
                data: [
                    [3, 'Todos'],
                    [1, 'Clientes'],
                    [2, 'Proveedores']
                ]
            }),
            displayField: 'denominacion',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            listeners: {
                render: function () {
                    this.setValue(3);
                },
                beforeselect: function () {
                    this.oldvalue = this.getValue();
                },
                select: function () {
                    var newvalue = this.getValue();
                    if (this.oldvalue != newvalue) {
                        _this.store.baseParams.idtipo = newvalue;
                        var filtro = _this.sfClienteProveedor.getValue();
                        if (filtro) {
                            _this.store.baseParams.filtro = filtro;
                        }
                        if (_this.stClienteProveedor.baseParams.limit && _this.stClienteProveedor.baseParams.start != 0) {
                            _this.stClienteProveedor.baseParams.start = 0;
                            _this.stClienteProveedor.baseParams.limit = 20;
                        }
                        _this.store.load();
                    }
                }
            }
        });

        var menu = new Ext.menu.Menu({
            items: [
                {
                    text: this.etiquetas.lbrdcoincidencia,
                    checked: false,
                    group: 'condicion',
                    value: 1
                },
                {
                    text: this.etiquetas.lbrdcomienza,
                    checked: true,
                    group: 'condicion',
                    value: 2
                }, {
                    text: this.etiquetas.lbrdtermina,
                    checked: false,
                    group: 'condicion',
                    value: 3
                },
                {
                    text: this.etiquetas.lbchmaymin,
                    checked: false,
                    value: 4
                },
                {
                    text: this.etiquetas.lbchpalabras,
                    checked: false,
                    value: 5
                }
            ]
        });

        this.btnTipoBusqueda = new Ext.Button({
            text: this.etiquetas.lbbtncondicion,
            menu: menu
        });

        this.sm = this.smClienteProveedor = new Ext.grid.RowSelectionModel({
            singleSelect: this.singleSelect,
            listeners: {
                scope: this,
                rowselect: function (smodel, rowIndex, record) {
                    this.gpClienteProveedor.getView().addRowClass(rowIndex, "negrita");
                    this.showDetails();
                    this.enableButtons("rowselectdeselect");
                },
                rowdeselect: function (smodel, rowIndex, keepExisting, record) {
                    this.gpClienteProveedor.getView().removeRowClass(rowIndex, "negrita");
                    this.showDetails();
                    this.enableButtons("rowselectdeselect");
                },
                selectionchange :function(sm){
                    window.recordselected = sm.getSelections();
                }
            }
        });

        this.sfClienteProveedor = new Ext.Cont.SearchField({
            id: 'sfClienteProveedor',
            width: 250,
            emptyText: this.etiquetas.lbCriterioBuscar,
            searchTooltip: this.etiquetas.tooltipbuscar,
            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            regexText: _this.etiquetas.regexTextNombre,
            validationEvent: true,
            maxLength: 255,
            fnOnSearch: function () {
                _this.search();
            },
            fnOnClear: function () {
                _this.clear();
            }
        });

        this.filters = new Ext.grid.GridFilters({
            filtersText: this.etiquetas.lbFiltro,
            filters: [
                {type: 'string', dataIndex: 'codigo'},
                {type: 'string', dataIndex: 'codigonit'},
                {type: 'string', dataIndex: 'nombre'},
                {type: 'string', dataIndex: 'abreviatura'},
                {type: 'string', dataIndex: 'organismo'},
                {type: 'string', dataIndex: 'sector'},
                {
                    type: 'list',
                    dataIndex: 'idtipo',
                    options: [[1, this.etiquetas.lbCliente], [2, this.etiquetas.lbProveedor]]
                },
                {type: 'boolean', dataIndex: 'enuso'},
                {type: 'boolean', dataIndex: 'habilitado', yesText: _this.etiquetas.lbHabilitado,
                noText: _this.etiquetas.lbDeshabilitado},
            ]
        });

        this.grid = this.gpClienteProveedor = new Ext.grid.GridPanel({
            id: 'idgpClienteProveedor',
            loadMask: this.etiquetas.lbCargando || 'Cargando...',
            width: 690,
            region: 'center',
            height: 310,
            frame: false,
            border: false,
            stripeRows: true,
            iconCls: 'icon-grid',
            autoExpandColumn: 'expandir',
            store: this.stClienteProveedor,
            sm: this.smClienteProveedor,
            enableColumnHide: true,
            floating: false,
			view: new Ext.grid.GroupingView({
                emptyText: this.etiquetas.lbNoResults,
                forceFit:true,
                getRowClass: function (record, rowIndex, rowParams, store) {
                    var estilo='';
                    if(record.get('idpadre'))
                         estilo= 'hijo'
                    // if(record.get('habilitado')!=1)
                    //     estilo+= ' inhabilitado';
                    if(record.get('deuda')==true)
                        estilo+= ' deuda';
                    if(record.get('fechafin') && _this.config && _this.config['diasaviso']) {
                        var aux = record.get('fechafin').split('/'),
                            dias = Math.floor(Math.floor((new Date(aux[2], aux[1] - 1, aux[0])-new Date()) / 3.6e+6) / 24);
                        // var horas = Math.floor(diff /  3.6e+6);
                        if (dias <= 0) {
                            estilo += ' vencido'
                        } else if (dias < _this.config['diasaviso']) {
                            estilo += ' porvencer'
                        }
                    }
                    return estilo;
                }
            }),

          /*  viewConfig: {
                emptyText: this.etiquetas.lbNoResults,
                getRowClass: function (record, rowIndex, rowParams, store) {
                    if(record.get('idpadre'))
                        return 'hijo'
                    return '';
                }
            },*/
            plugins: this.filters,
            columns: [
                {
                    hidden: true,
                    dataIndex: 'idclientesproveedores',
                    hideable: false
                },
                {
                    header: this.etiquetas.lbCodigo,
                    width: 100,
                    dataIndex: 'codigo',
                    sortable: true,
                    fixed: true
                },
                {
                    header: this.etiquetas.lbCodigoNit,
                    width: 100,
                    dataIndex: 'codigonit',
                    sortable: true,
                    fixed: true
                },
                {
                    header: this.etiquetas.lbNombre,
                    id: 'expandir',
					dataIndex: 'nombre',
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        return '<span qtip="'+value+'">'+value+'</span>';
                    }
                },
				 {
                     header: 'Organismo',
                     width: 100,//140
                     dataIndex: 'organismo',
                     sortable: true,
                     hidden: true
                },
				{
                    header: 'Sector',
                    width: 50,//140
                    dataIndex: 'sector',
                    sortable: true
                },
                {
                    header: this.etiquetas.lbAbreviatura,
                    width: 50,//100
                    dataIndex: 'abreviatura'
                },
                {
                    header: this.etiquetas.lbClasificacion,
                    dataIndex: 'idtipo',
                    width: 50, //100
                    align: 'center',
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        var imagen = _this.getImagen(record.data.idtipo, record.data.idclasificacion, true);
                        return '<img qtip="<b>' + imagen.qtip + '</b>" src=' + imagen.ruta + '>';
                    }
                },
                {
                    header: this.etiquetas.lbEnUso,
                    dataIndex: 'enuso',
                    width: 50, //50
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        if (value == 1) {
                            metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbUsado + '</p>"';
                            metaData.css = 'icondistra-usarentidad verde';

                        } else {
                            metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbNoUsado + '</p>"';
                            metaData.css = 'icondistra-usarentidad rojo';
                        }
                    }
                },
                {
                    header: 'Habilitado',
                    dataIndex: 'habilitado',
                    width: 60,
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        if (value == 1 || value == 2) {
                            metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbHabilitado + '</p>"';
                            metaData.css = 'icondistra-true verde';
                        } else {
                            metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbDeshabilitado + '</p>"';
                            metaData.css = 'icondistra-false rojo';
                        }
                    }
                },
            ],
            tbar: [this.sfClienteProveedor],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: this.etiquetas.lbDisplayMsg,
                emptyMsg: this.etiquetas.lbNoResults,
                store: this.stClienteProveedor,
                firstText: this.etiquetas.lbPrimeraPagina || 'Primera P&aacute;gina',
                lastText: this.etiquetas.lbUltimaPagina || '&Uacute;ltima P&aacute;gina',
                listeners: {
                    render: function (cmp) {
                        this.addButton({
                            iconCls: 'limpiar',
                            tooltip: 'Limpiar filtros',
                            handler: _this.clearFilter.bind(_this)
                        })
                    }
                }
            })
        });

        this.pInformacion = new Ext.Panel({
            title: this.etiquetas.lbInformacionGeneral,
            autoScroll: true,
            expanded: true,
            name: 'pinfo',
            listeners: {
                scope: this,
                collapse: function (panel) {
                    //this.pBanco.expand();
                },
                expand: function (panel) {
                    sm = this.smClienteProveedor,
                        detailEl = this.pInformacion.body,
                        data = sm.getSelected().data,
                        idcliente = data.idclientesproveedores;
                    if(panel.idClienteActual!=idcliente){
                        panel.idClienteActual=idcliente;
                        this.data = data;
                        this.detailsTemplate.overwrite(detailEl, data);
                        detailEl.slideIn('l', {stopFx: true, duration: .2});
                        if (!data.certificourl) {
                            // mask.show();
                            this.obtenerdatosAdicionales({
                                idcliente: idcliente
                            }, function () {
                                // mask.hide();
                                _this.detailsTemplate.overwrite(detailEl, _this.data);
                            });
                        }
                    }
                    //this.pBanco.collapse();
                }
            }
        });

        this.pBanco = new Ext.Panel({
            title: this.etiquetas.lbContabilidad,
            autoScroll: true,
            name: 'pBanco',
            root: 'data',
            template: 'bancoTemplate',
            contactos: false,
            bodyStyle: 'padding: 5px;',
            layout: 'fit',
            listeners: {
                scope: this,
                expand: function (panel) {
                    var _this = this;
                    //this.pCobrosPagos.collapse();
                    setTimeout(function () {
                        panel.mask = new Ext.LoadMask(panel.getEl());
                        var sm = _this.smClienteProveedor,
                            record = sm.getSelected();
                        if (record) {
                            var idcliente = record.data.idclientesproveedores;
                            if(panel.idClienteActual!=idcliente){
                                panel.idClienteActual=idcliente;
                                if (panel.getComponent(0)) {
                                    var idcontactosactual = panel.getComponent(0).id.split('-')[1];
                                }
                                if (!panel.getComponent(0) || idcontactosactual != idcliente) {
                                    panel.mask.show();
                                    _this.createDataView(idcliente, function () {
                                        panel.mask.hide();
                                    }, panel);
                                }
                            }
                        }

                    }, 100);
                },
                collapse: function (panel) {
                    if(panel.mask)
                        panel.mask.hide();
                    //this.pContactos.expand();
                }
            }
        });

        this.pCobrosPagos = new Ext.Panel({
            // title: 'Cobros y pagos',
            title: this.etiquetas.lbCobrosPagos,
            autoScroll: true,
            bodyStyle: 'padding: 5px;',
            layout: 'fit',
            name: 'pCobrosPagos',
            root: 'cuentas',
            template: 'cobrospagoTemplate',
            contactos: false,
            listeners: {
                scope: this,
                expand: function (panel) {
                    var _this = this;
                    //this.pContactos.collapse();
                    setTimeout(function () {
                       panel.mask = new Ext.LoadMask(panel.getEl());
                        var sm = _this.smClienteProveedor,
                            record = sm.getSelected();
                        if (record) {
                            var idcliente = record.data.idclientesproveedores;
                            if(panel.idClienteActual!=idcliente){
                                panel.idClienteActual=idcliente;
                                if (panel.getComponent(0)) {
                                    var idcontactosactual = panel.getComponent(0).id.split('-')[1];
                                }
                                if (!panel.getComponent(0) || idcontactosactual != idcliente) {
                                    panel.mask.show();
                                    _this.createDataView(idcliente, function () {
                                        panel.mask.hide();
                                    }, panel);
                                }
                            }
                        }
                    }, 100);

                },
                collapse: function (panel) {
                    if(panel.mask)
                        panel.mask.hide();
                    //this.pContactos.expand();
                }
                /*,
                 beforecollapse: function () {
                 var sm = this.smClienteProveedor;
                 if (sm.hasSelection() && sm.getSelected().data.idclasificacion != 1) {
                 mostrarMensaje(1, this.etiquetas.msgNoContactos);
                 return false;
                 }
                 }*/
            }
        });

        this.pContratos = new Ext.Panel({
            // title: 'Cobros y pagos',
            title: this.etiquetas.lbContratos,
            autoScroll: true,
            bodyStyle: 'padding: 5px;',
            layout: 'fit',
            name: 'pContratos',
            root: 'data',
            template: 'contratosTemplate',
            contactos: false,
            contratos:true,
            listeners:{
                scope: this,
                expand: function (panel) {
                    var _this = this;
                    //this.pContactos.collapse();
                    setTimeout(function () {
                        panel.mask = new Ext.LoadMask(panel.getEl());
                        var sm = _this.smClienteProveedor,
                            record = sm.getSelected();
                        if (record) {
                            var idcliente = record.data.idclientesproveedores;
                            if(panel.idClienteActual!=idcliente){
                                panel.mask.show();
                                _this.obtenerDatosContratos(idcliente, function(){
                                    panel.idClienteActual=idcliente;
                                    panel.mask.hide();
                                });
                            }
                        }
                    }, 100);
                },
                collapse: function (panel) {
                    if(panel.mask)
                        panel.mask.hide();
                    //this.pContactos.expand();
                }
            }
        });

        this.pLineas = new Ext.Panel({
            title: this.etiquetas.lbTtLineas,
            bodyStyle: 'padding: 5px;',
            layout: 'fit',
            name: 'pLineas',
            root: 'data',
            template: 'lineasTemplate',
            contactos: false,
            contratos:false,
            listeners:{
                scope: this,
                expand: function (panel) {
                    var _this = this;
                    //this.pContactos.collapse();
                    setTimeout(function () {
                        panel.mask = new Ext.LoadMask(panel.getEl());
                        var sm = _this.smClienteProveedor,
                            record = sm.getSelected();
                        if (record) {
                            var idcliente = record.data.idclientesproveedores;
                            if(panel.idClienteActual!=idcliente){
                                panel.mask.show();
                                _this.obtenerDatosLineas(idcliente, function(){
                                    panel.idClienteActual=idcliente;
                                    panel.mask.hide();
                                });
                            }
                        }
                    }, 100);
                },
                collapse: function (panel) {
                    if(panel.mask)
                        panel.mask.hide();
                    //this.pContactos.expand();
                }
            }
        });

        this.otherstore= new Ext.data.Store({
            url: this.baseUrl + 'cargarclientesproveedor',
            baseParams:{
                'filter[0][data][type]':'numeric',
                'filter[0][data][value]': 0,
                'filter[0][field]':'idpadre',
                // idpadre: 990000009621
            },
            reader: new Ext.data.JsonReader({
                    totalProperty: 'cantidad',
                    root: 'datos',
                    id: 'idclientesproveedores'
                },
                [
                    {
                        name: 'idclientesproveedores'
                    },
                    {
                        name: 'foto'
                    },
                    {
                        name: 'codigo'
                    },
                    {
                        name: 'nombre'
                    },
                    {
                        name: 'abreviatura'
                    },
                    {
                        name: 'telefono'
                    },
                    {
                        name: 'correo'
                    },
                    {
                        name: 'dpa'
                    },
                    {
                        name: 'descripciondpa'
                    },
                    {
                        name: 'direccion'
                    },
                    {
                        name: 'idtipo'
                    },
                    {
                        name: 'idclasificacioncontable'
                    },
                    {
                        name: 'idclasificacion'
                    },
                    {
                        name: 'enuso'
                    },
                    {
                        name: 'descripcion'
                    },
                    {
                        name: 'idestructura'
                    },
                    {
                        name: 'idpersona'
                    },
                    {
                        name: 'idestructuracomun'
                    },
                    {
                        name: 'registrado'
                    },
                    {
                        name: 'entidad'
                    },
                    {
                        name: 'idcuentasacobrar'
                    },
                    {
                        name: 'cuentasacobrar'
                    },
                    {
                        name: 'idcuentasapagar'
                    },
                    {
                        name: 'cuentasapagar'
                    },
                    {
                        name: 'credito'
                    },
                    {
                        name: 'fechainicio'
                    },
                    {
                        name: 'fechafin'
                    },
                    {
                        name: 'idusuario'
                    },
                    {
                        name: 'nombreusuario'
                    },
                    {
                        name: 'idmapa'
                    },
                    {
                        name: 'codigonit'
                    },
                    {
                        name: 'certificourl'
                    },
                    {
                        name: 'idpadre'
                    },{
					 name: 'organismo'
                    },
                    {
                        name: 'idorganismo'
                    },
					{
					 name: 'sector'
                    },
                    {
                        name: 'idsector'
                    },
                    {
                        name: 'idclienteproveedorentidad'
                    },
                     
                    'identificadores','totalidentificadores', 'idespaciotrabajo', 'fechaaprobacion'

                ])
        })
        this.otherstore.load()

        this.pSubordinadas=new Ext.grid.GridPanel({
            title: 'Subordinadas',
            store: this.otherstore,
            name: 'pSubordinadas',
            columns:[
                {
                    header: this.etiquetas.lbNombre,
                    dataIndex: 'nombre',
                    width:190
                },
                {
                    header: this.etiquetas.lbAbreviatura,
                    dataIndex: 'abreviatura',
                    width:80
                }
            ],
            listeners:{
                expand: function (panel) {
                    // var _this = this;
                    //this.pContactos.collapse();
                    setTimeout(function () {
                        panel.mask = new Ext.LoadMask(panel.getEl());
                        var sm = _this.smClienteProveedor,
                            record = sm.getSelected();
                        if(record) {
                            panel.mask.show();
                            panel.store.baseParams['filter[0][data][type]'] = 'numeric';
                            panel.store.baseParams['filter[0][data][value]'] = record.data.idclientesproveedores;
                            panel.store.baseParams['filter[0][field]'] = 'idpadre';
                            panel.store.load({
                                callback: function () {
                                    panel.mask.hide();
                                }
                            });
                        }
                    }, 100);
                },
                collapse: function (panel) {
                    if(panel.mask)
                        panel.mask.hide();
                    //this.pContactos.expand();
                }
            }
        });

        this.pContactos = new Ext.Panel({
            title: this.etiquetas.lbContactos,
            // title: 'Contactos',
            autoScroll: true,
            //disabled: true,
            bodyStyle: 'padding: 5px;',
            layout: 'fit',
            contactos: true,
            listeners: {
                scope: this,
                /*beforeexpand: function () {
                 var sm = this.smClienteProveedor;
                 if (sm.hasSelection() && sm.getSelected().data.idclasificacion != 1) {
                 mostrarMensaje(1, this.etiquetas.msgNoContactos);
                 return false;
                 }
                 },*/
                expand: function (panel) {
                    var _this = this;
                    setTimeout(function () {
                        panel.mask = new Ext.LoadMask(panel.getEl());
                            var sm = _this.smClienteProveedor,
                            record = sm.getSelected();
                        if (record) {
                            var idcliente = record.data.idclientesproveedores;
                            if(panel.idClienteActual!=idcliente){

                                if (panel.getComponent(0)) {
                                    var idcontactosactual = panel.getComponent(0).id.split('-')[1];
                                }
                                if (!panel.getComponent(0) || idcontactosactual != idcliente) {
                                    panel.mask.show();
                                    _this.createDataView(idcliente, function () {
                                        panel.mask.hide();
                                        panel.idClienteActual=idcliente;
                                    });
                                }
                            }
                        }
                    }, 100);

                },
                collapse: function (panel) {
                    if(panel.mask)
                        panel.mask.hide();
                    //this.pContactos.expand();
                }
            }
        });

        this.panel = this.pDetalles = new Ext.Panel({
            layout: 'accordion',
            region: 'east',
            split: true,
            title: this.etiquetas.lbDetalles,
            collapsible: true,
            id: 'pDetallesPrincipal',
            layoutConfig: {
                titleCollapse: false,
                animate: true
            },
            items: [
                this.pInformacion, this.pBanco, this.pCobrosPagos,
                this.pContactos, this.pContratos, this.pLineas, this.pSubordinadas
            ]
        });

        this.items = [
            this.gpClienteProveedor, this.pDetalles
        ];
        this.initTemplates();
    },
    enableButtons: function (action) {
        if (this.toolbar) {
            switch (action) {
                case "beforeload":
                    this.btnAdicionar.disable();
                    this.btnModificar.disable();
                    this.btnEliminar.disable();
                    this.btnVista.disable();
                    this.btnVerMapa.disable();
                       this.btnHabilitar.disable();
                    this.btnDeshabilitar.disable();
                    this.btnVerArgumento.disable();
                    this.btnVerDeudas.disable();
                    break;
                case "load":
                    this.btnAdicionar.enable();
                    if (this.stClienteProveedor.getCount() != 0) {
                        this.btnVista.enable();
                    }
                    break;
                case "rowselectdeselect":
                    var cant = this.smClienteProveedor.getCount();
                    if (cant == 1) {
					    //this.btnHabilitar.enable();
                        //this.btnDeshabilitar.enable();
                        this.btnModificar.enable();
                        this.btnEliminar.enable();
                        this.btnVerMapa.enable();
                        if (this.enUso()) {
                            this.btnUsarEntidad.enable();
                        } else {
                            this.btnUsarEntidad.disable();
                        }
                        if (this.noEnUso()) {
                            this.btnNoUsarEntidad.enable();
                        } else {
                            this.btnNoUsarEntidad.disable();
                        }
                    if(this.habilitado() || this.enUso()){
                            this.btnHabilitar.disable();
                            this.btnDeshabilitar.enable();
                        }else{
                            this.btnHabilitar.enable();
                            this.btnDeshabilitar.disable();
                        }

                        if(this.tieneArgumento()){
                            this.btnVerArgumento.enable();
                        }else{
                            this.btnVerArgumento.disable();
                        }
                        if(this.noEnUso()){
                            this.btnVerDeudas.enable();
                        }else{
                            this.btnVerDeudas.disable();
                        }
                    } else if (cant > 1) {
                        this.btnModificar.disable();
                        this.btnVerMapa.disable();
                        this.btnEliminar.enable();
                        this.btnHabilitar.disable();
                        this.btnDeshabilitar.disable();
                        if (this.enUso()) {
                            this.btnUsarEntidad.enable();
                        } else {
                            this.btnUsarEntidad.disable();
                        }
                        if (this.noEnUso()) {
                            this.btnNoUsarEntidad.enable();
                        } else {
                            this.btnNoUsarEntidad.disable();
                        }
                        this.btnVerArgumento.disable();
                        this.btnVerDeudas.disable();
                    } else {
                        this.btnModificar.disable();
                        this.btnVerMapa.disable();
                        this.btnEliminar.disable();
                        this.btnUsarEntidad.disable();
                        this.btnNoUsarEntidad.disable();
                        this.btnHabilitar.disable();
                        this.btnDeshabilitar.disable();
                        this.btnVerArgumento.disable();
                        this.btnVerDeudas.disable();
                    }
                    break;
            }
        }
    },
    createToolbar: function () {
        this.btnAdicionar = new Ext.Button({
            id: 'addclient',
            iconCls: 'adicionar',
            hidden: true,
            text: this.etiquetas.lbBtnAdicionar,
            tooltip: this.etiquetas.lbTtAdicionar,
            handler: function () {
                //this.winGestionar('Add');
            }
        });

        this.btnModificar = new Ext.Button({
            id: 'editclient',
            hidden: true,
            disabled: true,
            iconCls: 'modificar',
            text: this.etiquetas.lbBtnModificar,
            tooltip: this.etiquetas.lbTtModificar,
            handler: function () {
                //this.winGestionar('Mod');
            }
        });

        this.btnEliminar = new Ext.Button({
            id: 'delclient',
            disabled: true,
            hidden: true,
            iconCls: 'eliminar',
            text: this.etiquetas.lbBtnEliminar,
            tooltip: this.etiquetas.lbTtEliminar,
            handler: function () {
                //this.winFpRegistrar('Del');
            }
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaClienteProveedor',
            iconCls: 'ayuda',
            text: this.etiquetas.lbBtnAyuda,
            tooltip: this.etiquetas.lbTtAyuda
        });

        this.btnVista = new Ext.menu.Item({
            id: 'report',
            hidden: true,
            iconCls: 'generadorreportes',
            text: this.etiquetas.lbBtnVista,
            tooltip: this.etiquetas.lbTtVista
        });

        this.btnVerMapa = new Ext.menu.Item({
            id: 'locclient',
            iconCls: 'localizar',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbBtnVermapa,
            tooltip: this.etiquetas.lbTtVermapa
        });

        this.btnUsarEntidad = new Ext.menu.Item({
            iconCls: 'usarentidad verde',
            id: 'useEntity',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbBtnUsarEntidad,
            tooltip: this.etiquetas.lbTtUsarEntidad
        });

        this.btnNoUsarEntidad = new Ext.menu.Item({
            iconCls: 'usarentidad rojo',
            id: 'notuse',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbBtnNoUsarEntidad,
            tooltip: this.etiquetas.lbTtNoUsarEntidad
        });

        this.btnHabilitar = new Ext.menu.Item({
            iconCls: 'icondistra-true verde',
            id: 'habilitar',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbHabilitar,
            tooltip: this.etiquetas.lbHabilitar
        });

        this.btnDeshabilitar = new Ext.menu.Item({
            iconCls: 'icondistra-false rojo',
            id: 'deshabilitar',
            disabled: true,
            hidden: true,
            text: this.etiquetas.lbDeshabilitar,
            tooltip: this.etiquetas.lbDeshabilitar
        });

        this.btnVerArgumento = new Ext.menu.Item({
            iconCls: 'usarentidad verde',
            id: 'verargumento',
            disabled: true,
            // hidden: true,
            text: this.etiquetas.lbVerArgumento,
            tooltip: this.etiquetas.lbVerArgumento
        });

        this.btnVerDeudas = new Ext.menu.Item({
            iconCls: 'usarentidad verde',
            id: 'verdeudas',
            disabled: true,
            // hidden: true,
            text: this.etiquetas.lbVerDeudas,
            tooltip: this.etiquetas.lbVerDeudas
        });

        this.btnEspacioTrabajo = new Ext.menu.Item({
            iconCls: 'configuracion',
            id: 'espaciotrabajo',
            hidden: true,
            text: this.etiquetas.lbBtnConfigurarEspacio,
            tooltip: this.etiquetas.lbTtConfigurarEspacio
        });
        this.btnConfigCorreo = new Ext.menu.Item({
            iconCls: 'configuracion',
            id: 'confcorreo',
            // hidden: true,
            text: 'Configuraración',
            tooltip: 'Configuraración'
        });

        this.cmbOrganos = new Ext.CmbOrganos({
            idioma: this.etiquetas,
            gridStore: this.store
        });


        //this, corresponde al objeto global window
        var existeGis = (function () {
            return this.existe_gis;
        })();

        var itemsmenu = [this.btnVerMapa, this.btnVista, this.btnUsarEntidad, this.btnNoUsarEntidad,this.btnHabilitar, this.btnDeshabilitar, this.btnVerArgumento,
            this.btnVerDeudas, this.btnEspacioTrabajo, this.btnConfigCorreo];

        if (!existeGis) {
            itemsmenu.splice(0, 1);
        }

        var menu = new Ext.menu.Menu({
            items: itemsmenu
        });

        this.btnAcciones = new Ext.Button({
            text: this.etiquetas.lbBtnAcciones,
            tooltip: this.etiquetas.lbTtAcciones,
            iconCls: 'contraer',
            id: 'acciones',
            menu: menu,
            hidden: true
        });

        this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnAcciones, '->', this.cmbOrganos, this.btnAyuda];
    },
    createDataView: function (idcliente, callback, panel, template, root) {
        var _this = this,
            panel = panel || _this.pContactos,
            root = panel.root || 'data',
            template = panel.template ? _this[panel.template] : _this.contactoTemplate,
            contactos = panel.contactos,
            contratos = panel.contratos,
            clasificacion = {
                "1": _this.etiquetas.lbCtaCobrar,
                "2": _this.etiquetas.lbCtaPagar,
                "3": _this.etiquetas.lbCtaCobrarAnticipado,
                "4": _this.etiquetas.lbCtaPagarAnticipado
            },
            stcontactos = new Ext.data.JsonStore({
                url: this.baseUrl + 'obtenerDatosAdicionales',
                root: root,
                fields: [
                    {
                        name: 'idcontacto'
                    },
                    {
                        name: 'nombre'
                    },
                    {
                        name: 'cargo'
                    },
                    {
                        name: 'correocontacto'
                    },
                    {
                        name: 'telefono'
                    },
                    {
                        name: 'movil'
                    },
                    {
                        name: 'direccionempresa'
                    },
                    {
                        name: 'dpa'
                    },
                    {
                        name: 'descripciondpa'
                    },
                    {
                        name: 'direccion'
                    },
                    {
                        name: 'idclientesproovedores'
                    },
                    {
                        name: 'foto'
                    },
                    {
                        name: 'nombreusuario'
                    },
                    {
                        name: 'nombrecuenta'
                    }, {
                        name: 'nombreterminodepago'
                    }, {
                        name: 'numerocuenta'
                    }, {
                        name: 'nombrecuenta'
                    }, {
                        name: 'nombrebanco'
                    }, {
                        name: 'numerosucursal'
                    }, {
                        name: 'predeterminado'
                    }, {
                        name: 'codigoiso'
                    }, {
                        name: 'idclasificacion'
                    }, {
                        name: 'direccionsucursal'
                    },
                    'identificadores', 'totalidentificadores',
                    'licenciabancaria', 'total', 'contratos',
                    'numerocontrato','facultades','totalfacultades',
                    'facultad', 'numeroidentidad'
                ],
                listeners: {
                    beforeload: function () {
                        Ext.Ajax.abort();
                    }
                }
            });
        var dv = new Ext.DataView({
            store: stcontactos,
            id: (panel.name || 'dvcontactos') + "-" + idcliente,
            itemSelector: 'div.details-contacto',
            tpl: template,
            prepareData: function (data) {
                if (Ext.isEmpty(data.foto)) {
                    data.foto = '/configuracion/comun/views/images/contacto.png';
                }
                if (data.idclasificacion) {
                    data.clasificacion = clasificacion[data.idclasificacion];
                }
                //data.shortName = Ext.util.Format.ellipsis(data.nombre, 50);
                //data.shortCharge = Ext.util.Format.ellipsis(data.cargo, 30);
                //data.shortEmail = Ext.util.Format.ellipsis(data.correocontacto, 30);
                // data.shortAddress = Ext.util.Format.ellipsis(data.direccion, 30);
                for (k in data) {
                    if (Ext.isEmpty(data[k])) {
                        data[k] = "<b style='color:#d9534f'>" + _this.etiquetas.lbEmpty + "</b>";
                    }
                }
                return data;
            }
        });
        if (panel.getComponent(0)) {
            panel.getComponent(0).store.removeAll();
            panel.remove(panel.getComponent(0));
            panel.doLayout();
        }

        stcontactos.load({
            params: {
                idcliente: idcliente,
                contactos: contactos,
                contratos: contratos,
            },
            callback: function (records) {
                if (callback && typeof callback == 'function') {
                    callback();
                }
                if (records.length != 0) {
                    panel.add(dv);
                    panel.doLayout();
                } else {
                    dv.destroy();
                }
            }
        });
    },
    initTemplates: function () {
        this.lineasTemplate = new Ext.XTemplate(
            '<div class="details">',
                '<tpl if="data">',
                    '<tpl for="data">',
                    // '<div class="details-info-item">',
                        '<div class="details-info">',
                        '<span>{linea} -- {tipolinea}</span>',
                        '<div>',
                    // '</div>',
                    '</tpl>',
                    '</tpl>',
                '</tpl>',
            // '</tpl>',
            '</div>'
        );
        this.lineasTemplate.compile();
        this.contratosTemplate = new Ext.XTemplate(
            '<div class="details">',
            // '<tpl for=".">',
                '<div class="details-info">',
                    '<span class="details-name">Cantidad de contratos asociados: {total}</span>',
                    // '<b>Cantidad de contratos asociados:</b>',
                    // '<span>{total}</span>',
                    // '</div>',
                    // '<div class="details-info">',
                    // '<span>aaaaaa</span>',
                    // '</div>',
                    '<tpl if="contratos">',
                        '<tpl if="total &gt; 0">',
                            '<span><b><u>Contratos:</u></b></span>',
                            '<tpl for="contratos">',
                                '<div class="details-contacto">',
								'<span><b><u>N&uacutemero:</b></u></span>',
                                '<span>{denominacion}</span>',
								'<span><b><u>Vigencia:</u></b></span>',
								'<span>{vigente}</span>',
								'<span><b><u>Fecha Fin:</u></b></span>',
								'<span>{fechafin}</span>',
								'</div>',
                            '</tpl>',
                         '</tpl>',
                    '</tpl>',
                '</div>',
            // '</tpl>',
            '</div>'
        );
        this.contratosTemplate.compile();
        this.detailsTemplate = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<div class="panel-title">',
            '<img src="{foto}" height="140px" width="140px">',
            '</div>',
            '<div class="details-info">',
            '<span class="details-name">{nombre}</span>',
            '<b>Usuario:</b>',
            '<span>{nombreusuario}</span>',
            '<b>C&oacute;digo:</b>',
            '<span>{codigo}</span>',
            '<b>Abreviatura:</b>',
            '<span>{abreviatura}</span>',
            '<b>C&oacute;digo NIT:</b>',
            '<span>{codigonit}</span>',
            '<b>Tel&eacute;fono:</b>',
            '<span>{telefono}</span>',
            '<b>Correo:</b>',
            '<span>{correo}</span>',
            '<b>DPA:</b>',
            '<span>{descripciondpa}</span>',
            '<b>Direcci&oacute;n:</b>',
            '<span>{direccion}</span>',
            '<b>Descripci&oacute;n:</b>',
            '<span>{descripcion}</span>',
            // '<b>Cambioss:</b>',
            '<tpl if="identificadores">',
                '<tpl if="totalidentificadores &gt; 0">',
                    // '<div class="details-info-item">',
                        '<b>Identificadores:</b>',
                            '<tpl for="identificadores">',
                                '<p>&nbsp;<u>{codigonombre}:</u>&nbsp; {denominacion}</p>',
                            '</tpl>',
                        '<span></span>',
                    // '</div>',
                '</tpl>',
            '</tpl>',
            '<tpl if="certificourl">',
             '<b>Certifico:</b>',
             '<span><a href="{certificourl}" target="_blank">{certificoname}</a></span>',
             '</tpl>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>'
        );
        this.detailsTemplate.compile();

        this.contactoTemplate = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<div class="details-contacto">',
            '<div class="panel-title">',
            '<img src="{foto}" height="100px" width="100px" style="border-radius: 4px;">',
            '</div>',
            '<div class="details-info">',
            '<div class="details-info-item">',
            '<b>Nombre:</b>',
            '<span>{nombre}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>N&uacute;mero de identidad:</b>',
            '<span>{numeroidentidad}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Usuario:</b>',
            '<span>{nombreusuario}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Cargo:</b>',
            '<span>{cargo}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Tel&eacute;fono:</b>',
            '<span>{telefono}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>M&oacute;vil:</b>',
            '<span>{movil}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Correo:</b>',
            '<span>{correocontacto}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>DPA:</b>',
            '<span>{descripciondpa}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Direcci&oacute;n:</b>',
            '<span>{direccion}</span>',
            '<tpl if="totalfacultades &gt; 0">',
                '<b>Tipos de facultades:</b>',
                '<tpl for="facultades">',
                    '<span>{denominacion}</span>',
                '</tpl>',
            '</tpl>',
			'<b>Facultad:</b>',
            '<span>{facultad}</span>',
            '</div>',
            '</div><div class="panel-footer"></div></div>',
            '</tpl>',
            '</div>'
        );
        this.contactoTemplate.compile();

        this.bancoTemplate = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<div class="details-contacto">',
            '<div class="details-info">',
            '<div class="details-info-item">',
            '<b>Moneda:</b>',
            '<span>{codigoiso}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>N&uacute;mero:</b>',
            '<span>{numerocuenta}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Titular:</b>',
            '<span>{nombrecuenta}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Banco:</b>',
            '<span>{nombrebanco}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Sucursal:</b>',
            '<span>{numerosucursal}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Direcci&oacuten sucursal:</b>',
            '<span>{direccionsucursal}</span>',
            '</div>',
            // '<tpl if="licenciabancaria">',
            '<tpl if="codigoiso == \'CUC\'">',
                '<div class="details-info-item">',
                    '<b>Licencia bancaria:</b>',
                    '<span>{licenciabancaria}</span>',
                '</div>',
            '</tpl>',
            '<div class="details-info-item">',
            '<b>Predeterminada:</b>',
            '<span><tpl if="predeterminado==true">Si</tpl><tpl if="predeterminado==false">No</tpl></span>',
            '</div>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>'
        );
        this.bancoTemplate.compile();

        this.cobrospagoTemplate = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<div class="details-contacto">',
            '<div class="details-info">',
            '<div class="details-info-item">',
            '<b>Cuenta:</b>',
            '<span>{nombrecuenta}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Clasificaci&oacute;n:</b>',
            '<span>{clasificacion}</span>',
            '</div>',
            '<div class="details-info-item">',
            '<b>Condici&oacute;n de pago:</b>',
            '<span>{nombreterminodepago}</span>',
            '</div>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>'
        );
        this.cobrospagoTemplate.compile();

        // this.contratosTemplate = new Ext.XTemplate(
        //     '<tpl for=".">',
        //     '<p>{numerocontrato}</p>',
        //     '<tpl>',
        // );

    },
    showDetails: function () {
        var _this = this,
            sm = this.smClienteProveedor,
            detailEl = this.pInformacion.body,
            panel = this.getPanelExpanded(),
            mask = new Ext.LoadMask(panel.getEl());
        console.log(panel.name);
        if (sm.hasSelection() && sm.getCount() == 1) {
            var data = sm.getSelected().data,
                idcliente = data.idclientesproveedores;
            for (k in data) {
                if (k == 'foto' && Ext.isEmpty(data[k])) {
                    data[k] = this.getImagen(data.idtipo, data.idclasificacion).ruta;
                }
                if (Ext.isEmpty(data[k]) && ['certificourl', 'idespaciotrabajo', 'idclienteproveedorentidad'].indexOf(k)==-1 && k!='argumento') {
                    data[k] = "<b style='color:#d9534f'>" + this.etiquetas.lbEmpty + "</b>";
                }
            }
            panel.idClienteActual=idcliente;
            if (panel.name == 'pinfo') {
                detailEl.hide();
                this.data = data;
                this.detailsTemplate.overwrite(detailEl, data);
                detailEl.slideIn('l', {stopFx: true, duration: .2});
                if (!data.certificourl) {
                    // mask.show();
                    this.obtenerdatosAdicionales({
                        idcliente: idcliente
                    }, function () {
                        // mask.hide();
                        _this.detailsTemplate.overwrite(detailEl, _this.data);
                    });
                }
            }
            else if(panel.name=='pSubordinadas'){
                panel.mask = new Ext.LoadMask(panel.getEl());
                panel.mask.show();
                this.otherstore.baseParams['filter[0][data][type]']='numeric';
                this.otherstore.baseParams['filter[0][data][value]']=idcliente;
                this.otherstore.baseParams['filter[0][field]']='idpadre';
                this.otherstore.load({
                    callback: function(){
                        panel.mask.hide();
                    }
                });
            }
            else if(panel.name == 'pContratos') {
                mask.show();
                _this.obtenerDatosContratos(idcliente, function () {
                    mask.hide();
                });
                // Ext.Ajax.request({
                //     url: this.baseUrl + 'obtenerDatosAdicionales',
                //     scope: this,
                //     params: {
                //         idcliente: idcliente, contratos:true
                //     },
                //     callback: function (options, success, response) {
                //         mask.hide();
                //         var json=Ext.decode(response.responseText);
                //         _this.contratosTemplate.overwrite(_this.pContratos.body, json.data);
                //     }
                // });
                // this.obtenerdatosAdicionales({
                //     idcliente: idcliente,
                //     contratos:true
                // }, function () {
                //     mask.hide();
                //     _this.contratosTemplate.overwrite(_this.pContratos.body, _this.data);
                // })
            }else if(panel.name == 'pLineas'){
                mask.show();
                _this.obtenerDatosLineas(idcliente, function () {
                    mask.hide();
                });
            } else {
                if (panel.getComponent(0)) {
                    var idcontactosactual = panel.getComponent(0).id.split('-')[1];
                }
                if (!panel.getComponent(0) || idcontactosactual != idcliente) {
                    mask.show();
                    this.createDataView(idcliente, function () {
                        mask.hide();
                    }, panel);
                }
            }
        } else {
            detailEl.update('');
        }
    },
    getImagen: function (idtipo, idclasificacion, min) {
        var tipo = 'cliente';
        var qtipTipo = this.etiquetas.lbCliente;
        var clasificacion = 'entidad';
        var qtipClasificaion = this.etiquetas.lbEntidad;
        if (idtipo == 2) {
            tipo = "proveedor";
            qtipTipo = this.etiquetas.lbProveedor;
        } else if (idtipo == 3) {
            tipo = "cliente-proveedor";
            qtipTipo = this.etiquetas.lbClienteProveedor;
        }
        if (idclasificacion == 2) {
            clasificacion = "persona";
            qtipClasificaion = this.etiquetas.lbPersona;
        }
        var imagen = clasificacion + "_" + tipo;
        if (min) {
            imagen += '_min';
        }
        var ruta = "/configuracion/comun/views/images/" + imagen + ".png";
        var qtip = qtipClasificaion + ' ' + qtipTipo;
        return {ruta: ruta, qtip: qtip};
    },
    search: function () {
        var filtro = this.sfClienteProveedor.getValue();
        this.filters.getFilter('nombre').setValue(filtro);
        this.filters.getFilter('nombre').setActive(true);
        if (this.stClienteProveedor.baseParams.limit && this.stClienteProveedor.baseParams.start != 0) {
            this.stClienteProveedor.baseParams.start = 0;
            this.stClienteProveedor.baseParams.limit = 20;
        }
    },
    clear: function () {
        this.filters.getFilter('nombre').setValue('');
        this.filters.getFilter('nombre').setActive(false);
        if (this.stClienteProveedor.baseParams.limit && this.stClienteProveedor.baseParams.start != 0) {
            this.stClienteProveedor.baseParams.start = 0;
            this.stClienteProveedor.baseParams.limit = 20;
        }
    },
    clearFilter: function () {
        this.filters.clearFilters();
        var filter = this.sfClienteProveedor;
        if (filter.getValue()) {
            filter.onTrigger1Click();
        }
    },
    enUso: function () {
        var records = this.smClienteProveedor.getSelections();
        for (k in records) {
            if (records[k].data && records[k].data.enuso == 0) {
                return true;
            }
        }
        return false;
    },
    noEnUso: function () {
        var records = this.smClienteProveedor.getSelections();
        for (k in records) {
            if (records[k].data && records[k].data.enuso == 1) {
                return true;
            }
        }
        return false;
    },
    habilitado: function () {
        var records = this.smClienteProveedor.getSelections();
        for (k in records) {
            if (records[k].data && records[k].data.habilitado == 1) {
                return true;
            }
        }
        return false;
    },
    tieneArgumento: function () {
        var records = this.smClienteProveedor.getSelections();
        for (k in records) {
            // console.log('argumento:', records[k].data && records[k].data.argumento)
            // console.log('argumento bool:', records[k].data && records[k].data.argumento!=null)
            if (records[k].data && records[k].data.argumento!=null) {
                return true;
            }
        }
        return false;
    },
    getConditions: function () {
        var menu = this.btnTipoBusqueda.menu.items.items,
            condition = new Array();
        for (var i = 0; i < menu.length; i++) {
            var cmp = menu[i];
            if (cmp.checked) {
                condition.push(cmp.value);
            }
        }
        return condition;
    },
    getPanelExpanded: function () {
        if (!this.pInformacion.collapsed) {
            return this.pInformacion;
        } else if (!this.pBanco.collapsed) {
            return this.pBanco;
        } else if (!this.pCobrosPagos.collapsed) {
            return this.pCobrosPagos;
        } else if(!this.pContactos.collapsed){
            return this.pContactos;
        } else if(!this.pSubordinadas.collapsed){
            return this.pSubordinadas;
        }else if(!this.pLineas.collapsed){
            return this.pLineas;
        }else if(!this.pContratos.collapsed){
            return this.pContratos;
        }
        else {
            return this.pSubordinadas;
        }
    },
    obtenerdatosAdicionales: function (parametros, callback) {
        Ext.Ajax.request({
            url: this.baseUrl + 'obtenerDatosAdicionales',
            scope: this,
            params: parametros,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if (response.certifico && this.data) {
                    this.data.certificourl = response.certifico.url;
                    this.data.certificoname = response.certifico.name;
                }
                if (response.identificadores && this.data) {
                    this.data.identificadores = response.identificadores.data;
                    this.data.totalidentificadores= response.identificadores.total;
                }
                if (callback && typeof callback == 'function') {
                    callback();
                }
            }
        })
    },
    obtenerDatosContratos: function(idcliente, callback){
        var _this=this;
		Ext.Ajax.request({
            url: this.baseUrl + 'obtenerDatosAdicionales',
            scope: this,
            params: {
                idcliente: idcliente, contratos:true
            },
            callback: function (options, success, response) {
                var json=Ext.decode(response.responseText);
                _this.contratosTemplate.overwrite(_this.pContratos.body, json.data);
                if (callback && typeof callback == 'function') {
                    callback();
                }
            }
        });
    },
    obtenerDatosLineas: function(idcliente, callback){
        var _this=this;
        Ext.Ajax.request({
            url: this.baseUrl + 'obtenerLineasClientes',
            scope: this,
            params: {
                idcliente: idcliente
            },
            callback: function (options, success, response) {
                var json=Ext.decode(response.responseText);
                _this.lineasTemplate.overwrite(_this.pLineas.body, json);
                if (callback && typeof callback == 'function') {
                    callback();
                }
            }
        });
    }
});
