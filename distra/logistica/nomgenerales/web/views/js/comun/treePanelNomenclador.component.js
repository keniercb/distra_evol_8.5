Ext.ns('Ext.erp');
Ext.erp.treePanelNomenclador = Ext.extend(Ext.erp.nomencladorBase, {
    /**
     *
     */
    winGestionarNomenclador: false,
    /**
     *
     */
    fpGestionarNomenclador: false,
    /**
     *
     */
    urlController: '',
    /**
     *
     */
    idioma: '',
    /**
     *
     */
    codigo: true,
    /**
     *
     */
    idnodo: 0,
    /**
     *
     */
    usarFecha: true,
    /**
     *
     */
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.erp.treePanelNomenclador.superclass.constructor.call(this, config);
        this.winGestionarNomenclador = false;
    },
    initComponent: function() {
        var _this = this;

        this.btnUsarEntidad.setVisible(false);
        this.btnNoUsarEntidad.setVisible(false);

        this.tfDenomFiltro = new Ext.form.TextField({
            id: _this.idioma.idCampoDenominacion,
            maxLength: 255,
            maskRe: /^([\w\s\d\.\,\(\)\-\/ñÑ])+$/,
            regex: /^([\w\s\d\.\,\(\)\-\/ñÑ])+$/,
            regexText: _this.idioma.lbRegexDescripText,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(t, e) {
                    if (e.getKey() == 13) {
                       // _this.btnBuscar.fireEvent('click');
                    }
                }
            }
        });
        this.btnBuscar.on({
            'click': function() {
                _this.buscar = true;

                var objParams = {
                    start: 0
                };
                if (_this.tfDenomFiltro.getValue()) {
                    objParams.denominacion = _this.tfDenomFiltro.getValue();
                    if (!_this.tfDenomFiltro.isValid()) {
                        mostrarMensaje(3, _this.idioma.lbMsgCampoIvalido);
                        return;
                    }
                }
                _this.treeLoader.reload({
                    params: objParams
                });
            }
        });

        this.btnLimpiar.on({
            'click': function() {
                _this.buscar = false;
                _this.tfDenomFiltro.reset();               
                 _this.treeLoader.load(
//                         {
//                    params: {
//                        start: 0,
//                        codigo: '',
//                        denominacion: ''
//                    }
//                }
                        );
            }
        });
        this.tfFiltro = new Ext.form.TextField({
            id: 'tffiltro'
        });

        var fields = [
            {
                name: '_emptyval'
            },
            {
                name: _this.campoIdNomenclador
            },
            {
                name: 'codigo'
            },
            {
                name: 'estado'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idarbol'
            },
            {
                name: 'ordenizq'
            },
            {
                name: 'ordender'
            },
            {
                name: 'idpadre'
            },
            {
                name: '_is_leaf'
            },
            {
                name: '_parent'
            }
        ];
        if (this.storeFields) {
            fields = fields.concat(_this.storeFields);
        }
        this.treeLoader = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: 'cargarnomenclador',
            baseParams: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                treesearch: 1
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: _this.campoIdNomenclador,
                fields: fields
            })
        });
        _this.treeLoader.on({
            'load': function(st, recs) {
               if(_this.buscar && recs.length == 0){
                   mostrarMensaje(1, _this.idioma.lbSindatosBuscar);
               }
            }
        })
        var columns = [new Ext.grid.RowNumberer({
                header: 'No.',
                width: 30
            }), {
                header: _this.idioma.lbCodigo,
                hidden: !_this.codigo,
                hideable: _this.codigo,
                sorteable: true,
                dataIndex: 'codigo',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record) {
                    if (record.id <= 0) {
                        return '<span style="color: green">' + value + '</span>';
                    }
                    return value;
                }
            }, {
                header: _this.idioma.lbDenominacion,
                sorteable: true,
                dataIndex: 'denominacion',
                id: 'expandid',
                renderer: function(value, metaData, record) {
                    if (record.id <= 0) {
                        return '<span style="color: green">' + value + '</span>';
                    }
                    return value;
                }
            },
                {
                header: _this.idioma.lbEstado,
                width: 55,
                dataIndex: 'estado',
                sorteable: true,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                         metaData.attr ='ext:qtip="' +  _this.idioma.ttClmHabiltado+ '"'; 
                    } else {
                        metaData.css = 'inactivo';
                        metaData.attr ='ext:qtip="' +  _this.idioma.ttClmDeshabiltado+ '"'; 
                    }

                    
                }
                }];


        if (this.columnsFields) {
            columns = columns.concat(_this.columnsFields);
        }
        this.columnasNomenclador = new Ext.grid.ColumnModel(columns);

        this.selectionModeNomenclador = new Ext.grid.RowSelectionModel({
        });
        this.selectionModeNomenclador.on({
            'rowselect': function(sm, index, rec) {               
                _this.idnodo = rec.data.idpadre == rec.id ? 0 : rec.data.idpadre;
            },
            'rowdeselect': function(sm, index, rec) {
                _this.idnodo = 0;
            }
        });
        this.treePanelNomenclador = new Ext.ux.maximgb.treegrid.GridPanel({
            region: 'center',
            border: false,
            root_title: _this.idioma.lbNomenclador,
            stripeRows: true,
            tbar: [new Ext.menu.TextItem({
                    text: _this.idioma.lbDenominacion + ':'
                }), '', this.tfDenomFiltro, '', _this.btnBuscar, '', this.btnLimpiar],
            autoExpandColumn: 'expandid',
            master_column_id: 'expandid',
            cm: _this.columnasNomenclador,
            store: _this.treeLoader,
            sm: _this.selectionModeNomenclador,
            loadMask: {
                store: _this.treeLoader
            },
            bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
                store: _this.treeLoader,
                displayInfo: true,
                pageSize: 30
            })
        });
        /**
         * Acciones de los botones de la UI
         */
        this.btnAdicionar.on({
            'click': function() {
                _this.onBtnAdicionarClick();
                _this.fpGestionarNomenclador.getForm().on({
                    'beforeaction': function(fp, action) {
                        _this.fpGestionarNomenclador.getForm().baseParams = {
                            idpadre: _this.selectionModeNomenclador.getSelected() ? _this.selectionModeNomenclador.getSelected().id : null
                        }
                    }
                });
                _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinAdicionar);
                _this.btnAceptar.on({
                    'click': function() {
                        _this.onBtnAceptarClick(false, function() {
                            mostrarMensaje(1, _this.idioma.lbMsgNomencladorAdicionado);
                            _this.treeLoader.reload();
                            _this.winGestionarNomenclador.close();
                        });
                    }
                });

                _this.btnAplicar.on({
                    'click': function() {
                        _this.onBtnAceptarClick(false, function() {
                            mostrarMensaje(1, _this.idioma.lbMsgNomencladorAdicionado);
                            _this.treeLoader.reload();
                            _this.fpGestionarNomenclador.getForm().reset();
                        });
                    }
                });
            }
        });

        this.btnModificar.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getSelected()) {
                    _this.onBtnAdicionarClick();
                    _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinModificar);                    
                    _this.fpGestionarNomenclador.getForm().loadRecord(_this.selectionModeNomenclador.getSelected());
                    
                     _this.fpGestionarNomenclador.getForm().on({
                    'beforeaction': function(fp, action) {
                        _this.fpGestionarNomenclador.getForm().baseParams = {
                            idpadre: (_this.idnodo == 0)?_this.selectionModeNomenclador.getSelected().id:_this.idnodo,//_this.selectionModeNomenclador.getSelected() ? _this.selectionModeNomenclador.getSelected().id : null
                        }
                    }
                });
                    
                    _this.btnAceptar.on({
                        'click': function() {
                            _this.onBtnAceptarClick(true, function() {
                                mostrarMensaje(1, _this.idioma.lbMsgNomencladorModificado);                               
                                _this.treeLoader.reload({
                                    params: {
                                        anode: _this.idnodo                                       
                                    }
                                });

                                _this.winGestionarNomenclador.close();
                            });
                        }
                    });
                    _this.btnAplicar.setVisible(false);
                } else {
                    mostrarMensaje(3, _this.idioma.lbMsgSeleccionarModificar);
                }
            }
        });

        this.btnEliminar.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getSelected()) {
                    var idnomencladores = new Array();
                    Ext.each(_this.selectionModeNomenclador.getSelections(), function(item) {
                        idnomencladores.push(item.id);
                    });
                    _this.onAceptarEliminar(idnomencladores, function() {
                        //_this.treeLoader.baseParams.anode =  _this.idnodo;
                        _this.treeLoader.reload({
                            params: {
                                anode: _this.idnodo
                            }
                        });
                    });
                }
            }
        });

        this.btnHabilitar.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getCount() > 0) {
                    var idnomencladores = new Array();
                    mostrarMensaje(2, _this.idioma.lbMsgConfirmarHabilitar, function (btn) {
                        if (btn == 'ok') {
                        Ext.each(_this.selectionModeNomenclador.getSelections(), function (item) {
                            idnomencladores.push(item.id);
                        });
                        _this.onAceptarActivar(idnomencladores, function () {
                            _this.treeLoader.reload();
                        });
                        }
                    });

                }
            }
        });

        this.selectionModeNomenclador.on({
            'rowselect': function() {
                _this.activarBotones();
            },
            'rowdeselect': function() {
                _this.activarBotones();
            }
        });
        /**
         * Acciones de los botones de la UI
         */

        Ext.apply(this, {
            layout: 'border',
            items: [this.panelBotones, this.treePanelNomenclador]
        });

        Ext.erp.treePanelNomenclador.superclass.initComponent.call(this);
        _this.treeLoader.load({
            params: {
                start: 0
            }
        })
    },
    activarBotones: function() {
        this.btnModificar.disable();
        this.btnEliminar.disable();
        this.btnUsarEntidad.disable();
        this.btnHabilitar.disable();
        var _this = this;
        var itemSeleccionado = _this.selectionModeNomenclador.getSelected();
        if (_this.selectionModeNomenclador.getCount() > 0) {
            if (_this.selectionModeNomenclador.getCount() == 1)
                _this.btnModificar.enable();
            if (itemSeleccionado.data.estado == 1) {
                _this.btnEliminar.enable();
            } else {
                _this.btnHabilitar.enable();
            }

            if (itemSeleccionado.id <= 0) {
                this.btnModificar.disable();
                this.btnEliminar.disable();
                this.btnUsarEntidad.disable();
                this.btnHabilitar.disable();
            }
        }
    }
});
