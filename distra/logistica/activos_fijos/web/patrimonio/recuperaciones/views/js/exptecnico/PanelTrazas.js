Ext.ns('Ext.Log.ExpTec');
Ext.QuickTips.init();

Ext.Log.ExpTec.PanelTrazas = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        var _this = this;

        Ext.apply(this, config);
        this.height = 300;
        this.layout = 'fit';
        this.border = false;
        this.bodyBorder = false;
        this.idregnumerico=config.idregnumerico;
        this.banderaBusqueda = false;

        _this.selectionMp = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        var validarFecha = function () {
            if (_this.FechaDesde.getValue()) {
                _this.FechaHasta.setMinValue(_this.FechaDesde.getValue());
            }
            if (_this.FechaHasta.getValue()) {
                _this.FechaDesde.setMaxValue(_this.FechaHasta.getValue());
            }
        }

        _this.FechaDesde = new Ext.form.DateField({
            width: 90,
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.FechaHasta = new Ext.form.DateField({
            width: 90,
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function (datefield, newValue, oldValue) {
                    validarFecha();
                },
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        this.textfieldDenominacion = new Ext.form.TextField({
            autoCreate: true,
            id: 'idTxtModulo',
            width: 100,
            maxLength: '11',
            /*maskRe : /^([0-9]+ ?[0-9]*)+$/,
            regex : /^([0-9]+ ?[0-9]*)+$/,*/
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                            Ext.getCmp('idbtnBuscar').handler();
                    }
                }
            }
        });

        this.stComboUsuarios = new Ext.data.Store({
            url: 'getUsuarios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'usuario'
                },
                {
                    name: 'idusuario'
                }
            ]),
            listeners: {
                'load': function (st, records, options) {
                    if (records.length > 0) {
                        _this.comboUsuarios.enable();
                    }
                }
            }
        });

        this.comboUsuarios = new Ext.form.ComboBox({
            width: 100,
            valueField: 'idusuario',
            disabled: true,
            displayField: 'usuario',
            store: _this.stComboUsuarios,
            mode: 'local',
            autoCreate: true,
            triggerAction: 'all',
            editable: false,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });

        _this.tbarp = [
            _this.idioma.lbCMDenominacion + ':' + '', _this.textfieldDenominacion, '',_this.idioma.lbCmbDesde + ':' + '',_this.FechaDesde, '',_this.idioma.lbCmbHasta + ':' + '',_this.FechaHasta, '', _this.idioma.lbCMUsuarios + ':' + '', _this.comboUsuarios, '',
                new Ext.Button({
                id:'idbtnBuscarTrazas',    
                text: _this.idioma.btnBuscar,
                iconCls: 'buscar',
                tooltip: _this.idioma.btnTtBuscar,
                handler: function () {
                    _this.banderaBusqueda = true;
                    _this.stGrip.load({
                        params:{ 
                            denominacion : (_this.textfieldDenominacion.getValue()) ? _this.textfieldDenominacion.getValue(): '',                                       
                            fechainicio : (_this.FechaDesde.value ) ? _this.FechaDesde.value : '',
                            fechafin : (_this.FechaHasta.value ) ? _this.FechaHasta.value : '' ,
                            idusuario : ( _this.comboUsuarios.getValue() )?_this.comboUsuarios.getValue(): '',
                            start:0,
                            limit : _this.grid.getBottomToolbar().pageSize                 

                        }
                    });
                }
            }), new Ext.Button({
                id:'idbtnBusquedaAvanzada', 
                text: _this.idioma.lbTtBuscAvanzBtn,
                iconCls: 'buscaravanzada',
                tooltip: _this.idioma.btnTtBusquedaAvanzada,
                handler: function () {
                    _this.banderaBusqueda = true;
                    _this.textfieldDenominacion.reset();
                    _this.FechaDesde.reset();
                    _this.FechaHasta.reset();
                    _this.comboUsuarios.reset();
                    _this.winAvanzada = new Ext.Log.ExpTec.VentanaBusqAvanzadaGrid({
                        idioma: _this.idioma,
                        store: _this.stGrip                            
                    });
                    _this.winAvanzada.show();
                    _this.winAvanzada.doLayout();
                }
            }), new Ext.Button({
                id:'idbtnLimpiarTrazas',
                text: _this.idioma.btnLimpiar,
                iconCls: 'limpiar',
                tooltip: this.idioma.btnTtLimpiar,
                handler: function () {
                    _this.textfieldDenominacion.reset();
                    _this.FechaDesde.reset();
                    _this.FechaHasta.reset();
                    _this.comboUsuarios.reset();
                    _this.stGrip.load({
                        params:{
                            start:0,
                            limit : _this.grid.getBottomToolbar().pageSize
                        }
                    });
                }
            }) 
        ];

        _this.columnasp = new Ext.grid.ColumnModel([new Ext.LOG.PagingRowNumberer
            , {
                header: _this.idioma.lbFecha,
                width: 100,
                dataIndex: 'fecha'
            }, {
                header: _this.idioma.lbUsuario,
                width: 100,
                dataIndex: 'usuario'
            }, {
                header: _this.idioma.lbCMDenominacion,
                width: 100,
                dataIndex: 'denominacion',
                id:'denominacion'
            }, {
                header: _this.idioma.lbCmbMarcaModelo,
                width: 150,
                dataIndex: 'descripcionmarcamodelo'
            },{
                header: _this.idioma.lbCMNroInventario,
                width: 90,
                dataIndex: 'nroinventario',
            }, {
                header: _this.idioma.lbCMNroSeir,
                width: 90,
                dataIndex: 'nroserie',
            }, {
                header: _this.idioma.lbCMEstado,
                width: 120,
                dataIndex: 'estado'
            },{
                header: _this.idioma.lbTxtTipoMedio,
                width: 100,
                dataIndex: 'tipo_modulo'
            }
        ]);

        _this.stGrip = new Ext.data.GroupingStore({
            url: 'mostrarHistorial',
            autoLoad: true,
            groupField: 'fecha',
            sortInfo: {
                field: 'fecha',
                direction: 'DESC'
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
                }, [
                {
                    name: 'fecha'
                },
                {
                    name: 'usuario'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'descripcionmarcamodelo'
                },
                {
                    name: 'tipo_modulo'
                },
                {
                    name: 'nroinventario'
                },
                {
                    name: 'estado'
                },
                {
                    name: 'nroserie'
                }
            ]),
            listeners:{
                'beforeload':function(store){      
                    store.baseParams.idregnumerico = _this.idregnumerico;         
                },
                'load': function(st, obj) {
                    if (st.getTotalCount() == 0) {
                        if(_this.banderaBusqueda){
                            mostrarMensaje(1, _this.idioma.lbMsgExistenDatosBuscar);
                        }else {
                            mostrarMensaje(1, _this.idioma.lbMsgExistenDatos);
                        }
                    }                    
                }
            }
        });

        _this.view = new Ext.grid.GroupingView({
            forceFit: true,
            enableGrouping: false,
            getRowClass : function (record, index) {
                if (record.data.tipo_modulo == 'Fisico') {
                    return 'fondo-amarillo';
                }
                else{
                    return 'fondo-verde';
                }
            },
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "' + (_this.idioma.lbHijos) + 's" : "' + (_this.idioma.lbHijos) + '"]})'
        });

        _this.paginToolbar = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stGrip,
            displayInfo: true,
            displayMsg: this.idioma.lbMsgResultadosTrazas,
            emptyMsg: this.idioma.lbMsgNoResultadosTrazas
        });

        _this.grid = new Ext.grid.GridPanel({
            id:'idGrid',
            border: false,
            bodyBorder: false,
            autoExpandColumn: 'denominacion',
            cm: _this.columnasp,
            store: _this.stGrip,
            bbar: _this.paginToolbar,
            tbar: _this.tbarp,
            sm: _this.selectionMp,
            loadMask: true,
            view: _this.view
        });
        _this.items = [_this.grid];

        Ext.Log.ExpTec.PanelTrazas.superclass.constructor.apply(this, arguments);
    }
});
