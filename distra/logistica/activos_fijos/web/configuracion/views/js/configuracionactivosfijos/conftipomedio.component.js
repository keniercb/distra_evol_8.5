Ext.ns('Ext.aft.Conf');

Ext.aft.Conf.GridTiposMedios = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config) {
        var _this = this;
        this.region = 'center';
        this.tipo = config.scope.tipo;
        this.btnModificarTipoMedio = config.btnModificarTipoMedio;
        this.loadMask = true;
        this.listPlugins = Array();

        if (_this.tipo == 0) {

            for (var i = 0; i < arrConfDatosNaturalezas.length; i++) {
                this.attatchPlugin(arrConfDatosNaturalezas[i]);
            }
        }

        this.tfDescripcion = new Ext.form.TextField({
            maxLength: '255',
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
        });
        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: config.etiquetas.btnTtBuscar,
            handler: function() {
                if (_this.tfDescripcion.isDirty()) {
                    _this.buscar();
                }
            }
        })

        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: config.etiquetas.lbBtnLimpiar,
            tooltip: config.etiquetas.btnTtLimpiar,
            handler: function() {
                ;
                _this.tfDescripcion.reset();
                _this.store.load();

            }
        });
        this.tbar = [new Ext.Toolbar.TextItem(config.etiquetas.hdDenomProd + ':'), _this.tfDescripcion, ' ', _this.btnBuscar, _this.btnLimpiar];
        this.stColumnReader = [
            {
                name: 'idtipomedio'
            }, {
                name: 'idestructura'
            }, {
                name: 'desctipomedio'
            }, {
                name: 'numinventario'
            }, {
                name: 'numserie'
            }, 
            // {
            //      name: 'denominacion'
            // },{
            //     name: 'denominacionlarga'
            //  },{
            //     name: 'idnaturaleza'
            // },
            {
                name: 'colorprim'
            },
             {
                name: 'colorsec'
            }, {
                name: 'valorcontable'
            }, {
                name: 'fechaadq'
            }, {
                name: 'fechaexpini'
            }, {
                name: 'fechaexpfin'
            }, {
                name: 'ubicacion'
            }, {
                name: 'estado'
            }, {
                name: 'annofabricacion'
            }, {
                name: 'garantia'
            }, {
                name: 'actividad'
            }, {
                name: 'categoria'
            }, {
                name: 'responsable'
            },{
                name: 'cantidadrecursoconsumido'
            }];

        this.columsCM = [
            new Ext.LOG.PagingRowNumberer(),
          
            {
                width: 180,
                header: config.etiquetas.lbCmDescripcion,
                dataIndex: 'desctipomedio',
                id: 'desctipomedio'
            },
            // {
            //     header: config.etiquetas.lbDenominacion,
            //     width: 100,
            //     dataIndex: 'denominacion',
            //     renderer: _this.columRender,
            //     align: 'center',
            //     id: 'denominacion'
            // }, 
            // {
            //     header: config.etiquetas.lbGrupo,
            //     width: 100,
            //     dataIndex: 'idgruposubgrupo',
            //     renderer: _this.columRender,
            //     align: 'center',
            //     id: 'idgruposubgrupo'
            // },  
            // {
            //     header: config.etiquetas.lbNaturaleza,
            //     width: 100,
            //     dataIndex: 'idnaturaleza',
            //     renderer: _this.columRender,
            //     align: 'center',
            //     id: 'idnaturaleza'
            // },
            {
                header: config.etiquetas.lbNroSerie,
                width: 100,
                dataIndex: 'numserie',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'numserie'
            }, {
                header: config.etiquetas.lbNroInventario,
                width: 100,
                dataIndex: 'numinventario',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'numinventario'
            }, {
                header: config.etiquetas.lbValorContable,
                width: 100,
                dataIndex: 'valorcontable',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'valorcontable'
            }, {
                header: config.etiquetas.lbColor1,
                width: 100,
                dataIndex: 'colorprim',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'colorprim'
            }, {
                header: config.etiquetas.lbColor2,
                width: 100,
                dataIndex: 'colorsec',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'colorsec'
            }, {
                header: config.etiquetas.lbFechaAdq,
                width: 100,
                dataIndex: 'fechaadq',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'fechaadq'
            }, {
                header: config.etiquetas.lbEstado,
                width: 100,
                dataIndex: 'estado',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'estado'
            }, {
                header: config.etiquetas.lbAnnoFabrica,
                width: 100,
                dataIndex: 'annofabricacion',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'annofabricacion'
            }, {
                header: config.etiquetas.lbGarantia,
                width: 100,
                dataIndex: 'garantia',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'garantia'
            }, {
                header: config.etiquetas.lbActividad,
                width: 130,
                dataIndex: 'actividad',
                renderer: _this.columRender,
                align: 'center',
                hidden: true,
                id: 'actividad'
            }, {
                header: config.etiquetas.lbCategoria,
                width: 130,
                dataIndex: 'categoria',
                renderer: _this.columRender,
                align: 'center',
                hidden: false,
                id: 'categoria'
            }, {
                header: config.etiquetas.lbResponsable,
                width: 130,
                dataIndex: 'responsable',
                renderer: _this.columRender,
                align: 'center',
                hidden: false,
                id: 'responsable'
            }, {
                header: config.etiquetas.lbUbicacion,
                width: 130,
                dataIndex: 'ubicacion',
                renderer: _this.columRender,
                align: 'center',
                hidden: false,
                id: 'ubicacion'
            }, {
                header: config.etiquetas.lbCantRecursosCons,
                width: 130,
                dataIndex: 'cantidadrecursoconsumido',
                renderer: _this.columRender,
                align: 'center',
                hidden: false,
                id: 'cantidadrecursoconsumido'
            }
        ];
        this.checkItems = [
            // {
            //     xtype: 'checkbox',
            //     boxLabel: config.etiquetas.lbDenominacion,
            //     id: 'denominacion',
            //     hideLabel: true,
            //     name: 'denominacion',
            //     checked: true,

            // },
            // {
            //     xtype: 'checkbox',
            //     boxLabel: config.etiquetas.lbGrupo,
            //     id: 'idgruposubgrupo',
            //     hideLabel: true,
            //     name: 'idgruposubgrupo',
            //     checked: true,

            // },
            // {
            //     xtype: 'checkbox',
            //     boxLabel: config.etiquetas.lbNaturaleza,
            //     id: 'idnaturaleza',
            //     hideLabel: true,
            //     name: 'idnaturaleza',
            //     checked: true,

            // },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbNroSerie,
                id: 'rbnumserie',
                hideLabel: true,
                name: 'numserie',
                checked: true,
                hidden: (_this.tipo == 1) ? true : false
                        //inputValue: '1'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbNroInventario,
                id: 'chknuminv',
                hideLabel: true,
                name: 'numinventario'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbPuntoFuego,
                id: 'chpuntofuego',
                hideLabel: true,
                name: 'puntofuego',
                hidden: (_this.tipo == 1) ? false : true
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbValorContable,
                id: 'chkvalor',
                hideLabel: true,
                name: 'valorcontable'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbAnnoFabrica,
                id: 'chkannofabricacion',
                hideLabel: true,
                name: 'annofabricacion'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbColor1,
                id: 'chkcolor1',
                hideLabel: true,
                name: 'colorprim'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbColor2,
                id: 'chkcolor2',
                hideLabel: true,
                name: 'colorsec'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbGarantia,
                id: 'chkgarantia',
                hideLabel: true,
                name: 'garantia'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbResponsable,
                id: 'chkresponsable',
                hideLabel: true,
                name: 'responsable'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbUbicacion,
                id: 'chkubicacion',
                hideLabel: true,
                name: 'ubicacion',
                hidden: (_this.tipo == 1) ? true : false
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbActividad,
                id: 'chkactividad',
                hideLabel: true,
                name: 'actividad'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbEstado,
                id: 'chkestado',
                hideLabel: true,
                name: 'estado',
                checked: true,
                disabled: true
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbCategoria,
                id: 'chkcategoria',
                hideLabel: true,
                name: 'categoria'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbFechaAdq,
                id: 'chkfechaadq',
                hideLabel: true,
                name: 'fechaadq'
            },
            {
                xtype: 'checkbox',
                boxLabel: config.etiquetas.lbCantRecursosCons,
                id: 'chkcantidadrecursoconsumido',
                hideLabel: true,
                name: 'cantidadrecursoconsumido'
            }

        ];
        
        this.datos = {};
        Ext.each(this.listPlugins, function(plugin) {
            plugin.init(_this);
        });
        this.store = new Ext.data.Store({
            url: '/logistica/activos_fijos/configuracion/index.php/conftipomedio/cargartiposmedios',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: "total",
                id: 'idstgridtiposmedios'
            }, _this.stColumnReader),
            listeners: {
                'beforeload': function(st) {
                    _this.store.baseParams.tipo = _this.scope.tipo;
                },
                'load': function(st, records, options) {
                    _this.store.baseParams.tipo = _this.scope.tipo;
                    if (st.getCount() > 0) {
                        _this.getSelectionModel().selectFirstRow();

                        //Oculto todas las columnas exepto el pagin row number, por eso i = 1
                        for (var i = 1; i < _this.getColumnModel().getColumnCount(); i++) {
                            _this.getColumnModel().setHidden(i, true);
                        }

                        _this.getColumnModel().setHidden(_this.getColumnModel().getIndexById('desctipomedio'), false);

                        //Muestro solo las columnas que debo mostrar
                        for (var i = 0; i < st.reader.jsonData.col_muestra.length; i++) {
                            if (st.reader.jsonData.col_muestra[i] != 0) {
                                if (_this.getColumnModel().findColumnIndex(st.reader.jsonData.col_muestra[i]) > 0) {
                                    _this.getColumnModel().setHidden(_this.getColumnModel().findColumnIndex(st.reader.jsonData.col_muestra[i]), false);
                                }
                            }
                        }
                    }
                }
            }
        });

        this.sm = new Ext.grid.RowSelectionModel({
            id: 'smgridtiposmedios',
            singleSelect: true,
            listeners: {
                'rowselect': function() {
                    Ext.getCmp('btnModificarTipoMedio').enable();
                },
                'rowdeselect': function() {
                    Ext.getCmp('btnModificarTipoMedio').disable();
                }
            }
        });

        this.cm = new Ext.grid.ColumnModel(_this.columsCM);
        this.autoExpandColumn = 'desctipomedio';
        this.bbar = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.store,
            displayInfo: true,
            displayMsg: config.etiquetas.lbGpMsgBBar,
            emptyMsg: config.etiquetas.lbGpMsgBBar2
        });
        Ext.aft.Conf.GridTiposMedios.superclass.constructor.apply(this, arguments);
    },
    OrganizarCheckElements: function(cant_columnas) {
        var items = [];
        var cant_elements_por_col = parseInt(this.checkItems.length / cant_columnas);
        var resto_de_la_division = this.checkItems.length % cant_columnas;
        var cont = 0;
        var i = 0;
        var ancho = parseInt(99 / cant_columnas) / 100;
        while (i < cant_columnas) {
            items.push({columnWidth: ancho, items: []});
            var j = 0;
            while (j < cant_elements_por_col) {
                items[i].items.push(this.checkItems[cont]);
                cont += 1;
                j += 1;
            }
            if (resto_de_la_division > 0) {
                items[i].items.push(this.checkItems[cont]);
                resto_de_la_division -= 1;
                cont += 1;
            }
            i += 1;
        }
        return items;
    },
    getWinGestionar: function(config, concepto) {

        var _this = this;
        if (concepto === 'mod' || concepto === 'add') {

            var cant_columnas = 3;
            var filas = parseInt(this.checkItems.length / cant_columnas);
            if ((this.checkItems.length % cant_columnas) > 0) {
                filas += 1;
            }
            var height = 80 + (filas * 21);

            if (!this.formulario) {
                this.formulario = new Ext.form.FormPanel({
                    height: height,
                    frame: true,
                    layout: 'form',
                    items: [
                        {
                            id: 'tfdesctipomedio',
                            xtype: 'textfield',
                            allowBlank: false,
                            fieldLabel: config.etiquetas.lbTftipomedio,
                            anchor: '100%',
                            disabled: (concepto === 'mod') ? true : false,
                            name: 'desctipomedio'
                        }, {
                            xtype: 'hidden',
                            id: 'hfidtipomedio',
                            value: -1,
                            name: 'idtipomedio'
                        }, {
                            xtype: 'fieldset',
                            autoHeight: true,
                            name: 'fieldset',
                            layout: 'column',
                            title: config.etiquetas.lbColEspecificas,
                            items: _this.OrganizarCheckElements(cant_columnas)
                        }
                    ]

                });
            }

            if (!this.win_gestionar) {
                this.win_gestionar = new Ext.Window({
                    layout: 'fit',
                    width: 550,
                    modal: true,
                    resizable: false,
                    closeAction: 'hide',
                    buttons: [
                        {
                            iconCls: 'cancelar',
                            text: config.etiquetas.lbBtnCancelar,
                            tooltip: config.etiquetas.lbTtbtnCancelar,
                            id: 'idwincancelar',
                            handler: function() {
                                _this.win_gestionar.hide();
                            }
                        },
                        {
                            iconCls: 'aceptar',
                            text: config.etiquetas.lbBtnAceptar,
                            tooltip: config.etiquetas.lbTtbtnAceptar,
                            id: 'idwinaceptar',
                            handler: function() {
                                _this.gestionarTipoMedio(config, concepto);
                                _this.win_gestionar.hide();
                            }
                        }
                    ],
                    items: [_this.formulario],
                    listeners: {
                        'show': function() {
                            if (concepto === 'add') {
                                _this.win_gestionar.setTitle(config.etiquetas.lbWinAddColTitle);
                            } else if (concepto === 'mod') {
                                _this.win_gestionar.setTitle(config.etiquetas.lbWinModColTitle);
                                var record = _this.getSelectionModel().getSelected();
                                if (record.get('numchasis') == '1') {
                                    record.data.numserie = '2';
                                }
                                _this.formulario.getForm().loadRecord(record);
                            }
                        }
                    }
                });
            }

            this.win_gestionar.show();
        } else if (concepto === 'elim') {
            mostrarMensaje(2, config.etiquetas.lbMsgPregElimTipoMdio, function(btnpresionado) {
                if (btnpresionado == 'ok') {
                    _this.eliminarTipoMedio(config);
                }
            });
        }
    },
    eliminarTipoMedio: function(config) {
        var _this = this;
        var datos = {};
        datos['idtipomedio'] = this.getSelectionModel().getSelected().get('idtipomedio');
        var concepto = 'elim';
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/configuracion/index.php/conftipomedio/gestionartiposmedios',
            method: 'POST',
            params: {
                parametros: Ext.encode(datos),
                concepto: concepto
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.codMsg == 1) {
                    mostrarMensaje(1, config.etiquetas.lbMsgElimTipoMedioOK);
                    _this.getStore().load();
                } else {
                    mostrarMensaje(1, config.etiquetas.lbMsgElimTipoMedioError);
                }
            }
        });

    },
    gestionarTipoMedio: function(config, concepto) {
        var _this = this;
        if(_this.tipo == 0){
             _this.datos['numserie'] = (Ext.getCmp('rbnumserie').getValue()) ? 1 : 0;
             _this.datos['ubicacion'] = (Ext.getCmp('chkubicacion').getValue()) ? 1 : 0;
        }
      //  _this.datos['denominacion'] = (Ext.getCmp('denominacion').getValue()) ? 1 : 0;
       // _this.datos['idgruposubgrupo'] = (Ext.getCmp('idgruposubgrupo').getValue())  ? 1 : 0;
       // _this.datos['idnaturaleza'] = (Ext.getCmp('idnaturaleza').getValue())  ? 1 : 0;
        _this.datos['desctipomedio'] = Ext.getCmp('tfdesctipomedio').getValue();
        _this.datos['numinventario'] = (Ext.getCmp('chknuminv').getValue()) ? 1 : 0;

        _this.datos['colorprim'] = (Ext.getCmp('chkcolor1').getValue()) ? 1 : 0;
        _this.datos['colorsec'] = (Ext.getCmp('chkcolor2').getValue()) ? 1 : 0;

        _this.datos['valorcontable'] = (Ext.getCmp('chkvalor').getValue()) ? 1 : 0;
        _this.datos['fechaadq'] = (Ext.getCmp('chkfechaadq').getValue()) ? 1 : 0;
        // _this.datos['fechaexpini'] = (Ext.getCmp('chkfechaexplini').getValue()) ? 1 : 0;
        //  _this.datos['fechaexpfin'] = (Ext.getCmp('chkfechaexplfin').getValue()) ? 1 : 0;
        _this.datos['annofabricacion'] = (Ext.getCmp('chkannofabricacion').getValue()) ? 1 : 0;
        _this.datos['garantia'] = (Ext.getCmp('chkgarantia').getValue()) ? 1 : 0;
        _this.datos['actividad'] = (Ext.getCmp('chkactividad').getValue()) ? 1 : 0;
        _this.datos['categoria'] = (Ext.getCmp('chkcategoria').getValue()) ? 1 : 0;
        _this.datos['responsable'] = (Ext.getCmp('chkresponsable').getValue()) ? 1 : 0;
        _this.datos['cantidadrecursoconsumido'] = (Ext.getCmp('chkcantidadrecursoconsumido').getValue()) ? 1 : 0;
        if (concepto === 'mod') {
            _this.datos['idtipomedio'] = this.getSelectionModel().getSelected().get('idtipomedio');
        }
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/configuracion/index.php/conftipomedio/gestionartiposmedios',
            method: 'POST',
            params: {
                parametros: Ext.encode(_this.datos),
                concepto: concepto,
                tipo: _this.tipo
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.CodMsg == 1) {
                    if (concepto === 'add') {
                        _this.getStore().load();
                        mostrarMensaje(1, config.etiquetas.lbMsgAdicionarOK);
                    } else if (concepto === 'mod') {
                        _this.getStore().load();
                        mostrarMensaje(1, config.etiquetas.lbMsgModificarOK);
                    }
                } else {
                    if (concepto === 'add') {
                        mostrarMensaje(1, config.etiquetas.lbMsgAdicionarError);
                    } else if (concepto === 'mod') {
                        mostrarMensaje(1, config.etiquetas.lbMsgModificarError);
                    }
                }
            }
        });
    },
    columRender: function(valor) {
        if (valor == 1) {
            return '<img src="/configuracion/comun/images/cierresi.png">';
        } else {
            return '<img src="/configuracion/comun/images/cierreno.png">';
        }
    },
    attatchPlugin: function(plugin) {
        this.listPlugins.push(plugin);
    },
    buscar: function() {
        var _this = this;
        _this.store.load({
            params: {
                denominacion: _this.tfDescripcion.getValue()
            }
        });
    }
});
/**
 *  Crear el tab de tipos de medios
 **/
Ext.aft.Conf.tiposMedios = new Ext.extend(Ext.Panel, {
    constructor: function(config) {
        this.title = config.etiquetas.lbTitleTabConfColNroSerie;
        this.layout = 'border';
        this.id = 'tabtiposmedios';
        this.tipo = (config.tipo) ? config.tipo : 0;
        var _this = this;
        var gridtiposmedios = new Ext.aft.Conf.GridTiposMedios({
            etiquetas: config.etiquetas,
            scope: _this
        });
        this.btnModificarTipoMedio = new Ext.Button({
            id: 'btnModificarTipoMedio',
            iconCls: 'modificar',
            text: config.etiquetas.lbBtnModificar,
            tooltip: config.etiquetas.lbTtBtnModificar,
            disabled: false,
            handler: function() {
                gridtiposmedios.getWinGestionar(config, 'mod');
            }
        });

        this.tbar = [_this.btnModificarTipoMedio];

        this.items = [gridtiposmedios];

        this.listeners = {
            'activate': function() {
                gridtiposmedios.store.load();
            }
        };

        Ext.aft.Conf.tiposMedios.superclass.constructor.apply(this, arguments);
    },
    activarHotKeys: function(e) {
        var _this = this;
        if (e.altKey) {
            if (e.which == Ext.EventObject.M) {
                _this.btnModificarTipoMedio.handler();
            }
        }
    }
});
