Ext.ns('Ext.erp');
/*Ext.override(Ext.PagingToolbar, {
    initComponent: Ext.PagingToolbar.prototype.initComponent.createInterceptor(function() {
        var self = this;
        this.displayMsg = this.special ? this.displayMsg : 'Mostrando de {0} - {1} de {2}';
        this.emptyMsg = this.special ? this.emptyMsg : "No hay resultados para mostrar.";
        var flag = true;
        this.arrSize = [
            [5],
            [10],
            [15],
            [20],
            [30],
            [50],
            [100],
            [1000]
        ];
        Ext.each(this.arrSize, function(size) {
            if (size == self.pageSize) {
                flag = false;
            }
        });
        if (flag) {
            this.arrSize.push([self.pageSize]);
        }
        this.stPageSize = new Ext.data.SimpleStore({
            fields: ['size'],
            data: this.arrSize,
            sortInfo: {field: "size", direction: "ASC"}
        });
        this.cbPageSize = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="Mostrar <b>{size}</b> filas por p&aacute;gina." class="x-combo-list-item">{size}</div></tpl>',
            width: 50,
            listWidth: 50,
            store: this.stPageSize,
            displayField: 'size',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            listeners: {
                select: function(cb, rc, index) {
                    self.setPageSize(rc.get('size'));
                }
            }
        });
        this.items = ['-', this.cbPageSize];
        //Establesco el valor por defecto definido por el usuario
        this.cbPageSize.setValue(self.pageSize);
    }),
    setPageSize: function(value) {
        this.pageSize = value;
        this.doLoad(0);
    }
});*/

Ext.erp.gridPanelNomenclador = Ext.extend(Ext.erp.nomencladorBase, {
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
    usarFecha: true,
    /**
     *
     */
    campoIdNomenclador: 'idnomenclador',
    /**
     *  Arreglo de nuevas fields que se quiera que el componente mapee
     */
    storeFields: [],
    /**
     *  Arreglo de nuevas columnas que se quiera que el componente adicione, el arreglo de nuevas columnas
     *  debe estar asociado al de storeFields
     */
    columnsFields: [],
    /**
     *  Fila seleccionada en el grid
     */
    rowSelect: false,
    /**
     *
     */
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.erp.gridPanelNomenclador.superclass.constructor.call(this, config);
        this.winGestionarNomenclador = false;
        this.buscar = false;
    },
    /**
     *
     */
    initComponent: function() {
        var _this = this;

        this.btnAdicionar.on({
            'click': function() {
                _this.onBtnAdicionarClick();
                _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinAdicionar);
                _this.btnAceptar.on({
                    'click': function() {
                        _this.onBtnAceptarClick(false, function() {
                            mostrarMensaje(1, _this.idioma.lbMsgNomencladorAdicionado);
                            _this.storeNomenclador.reload();
                            _this.winGestionarNomenclador.close();
                        });
                    }
                });

                _this.btnAplicar.on({
                    'click': function() {
                        _this.onBtnAceptarClick(false, function() {
                            mostrarMensaje(1, _this.idioma.lbMsgNomencladorAdicionado);
                            _this.storeNomenclador.reload();
                            _this.fpGestionarNomenclador.getForm().reset();
                        });
                    }
                });
            }
        });

        this.btnModificar.on({
            'click': function() {
                _this.onBtnModificarClick();
                //_this.storeNomenclador.reload();
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
                        _this.storeNomenclador.reload();
                    });
                }
            }
        });

        this.btnUsarEntidad.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getSelected()) {
                    mostrarMensaje(2, _this.idioma.lbMsgConfirmarUsar, function(btn) {
                        if (btn == 'ok') {
                            var idnomencladores = new Array();
                            Ext.each(_this.selectionModeNomenclador.getSelections(), function(item) {
                                idnomencladores.push(item.id);
                            });
                            _this.onAceptarUsarEntidad(idnomencladores, 1, function() {
                                _this.storeNomenclador.reload();
                            });
                        }
                    });

                }
            }
        });

        this.btnNoUsarEntidad.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getSelected()) {
                    mostrarMensaje(2, _this.idioma.lbMsgConfirmarNoUsar, function(btn) {
                        if (btn == 'ok') {
                            var idnomencladores = new Array();
                            Ext.each(_this.selectionModeNomenclador.getSelections(), function(item) {
                                idnomencladores.push(item.id);
                            });
                            _this.onAceptarUsarEntidad(idnomencladores, 2, function() {
                                _this.storeNomenclador.reload();
                            });
                        }
                    });

                }
            }
        });

        this.btnHabilitar.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getCount() > 0) {
                    mostrarMensaje(2, _this.idioma.lbMsgConfirmarHabilitar, function(btn) {
                        if (btn == 'ok') {
                            var idnomencladores = new Array();
                            Ext.each(_this.selectionModeNomenclador.getSelections(), function(item) {
                                idnomencladores.push(item.id);
                            });
                            _this.onAceptarActivar(idnomencladores, function() {
                                _this.storeNomenclador.reload();
                            });
                        }
                    });


                }
            }
        });

        this.btnBuscar.on({
            'click': function() {
                _this.buscar = true;

                var objParams = {
                    start: 0
                };
                if (_this.tfDenomFiltro.getValue() == "" && _this.tfDenomFiltro.getValue() == null) {

                } else {
                    if (_this.tfDenomFiltro.getValue()) {
                        objParams.denominacion = _this.tfDenomFiltro.getValue();
                        if (!_this.tfDenomFiltro.isValid()) {
                            mostrarMensaje(3, _this.idioma.lbMsgCampoIvalido);
                            return;
                        }
                    }

                    if (_this.tfCodigoFiltro.getValue()) {
                        objParams.codigo = _this.tfCodigoFiltro.getValue();
                        if (!_this.tfCodigoFiltro.isValid()) {
                            mostrarMensaje(3, _this.idioma.lbMsgCampoIvalido);
                            return;
                        }
                    }
                    _this.storeNomenclador.reload({
                        params: objParams
                    });
                }
            }
        });

        this.btnLimpiar.on({
            'click': function() {
                _this.buscar = false;
                _this.tfDenomFiltro.reset();
                _this.tfCodigoFiltro.reset();
                _this.storeNomenclador.load({
                    params: {
                        start: 0,
                        codigo: '',
                        denominacion: ''
                    }
                });
            }
        });

        var columns = [
            new Ext.LOG.PagingRowNumberer(), {
                header: _this.idioma.lbEstado,
                width: 55,
                dataIndex: 'estado',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmHabiltado + '"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmDeshabiltado + '"';
                    }
                }
            }, {
                header: _this.idioma.lbEntidad,
                width: 65,
                align: 'center',
                dataIndex: 'usarentidad',
                tooltip: _this.idioma.tipBtnUsar,
                renderer: function(value, metaData, record) {
                    if (value || record.id <= 0) {
                        metaData.css = 'icondistra-usarentidad verde';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmUsarEntidad + '"';
                    } else {
                        metaData.css = 'icondistra-usarentidad rojo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNoUsarEntidad + '"';
                    }
                }
            }, {
                header: _this.idioma.lbCodigo,
                hidden: !_this.codigo,
                hideable: _this.codigo,
                dataIndex: 'codigo',
                align: 'right',
                width: 60,
                renderer: function(value, metaData, record) {
                    if (record.id <= 0) {
                        return '<span style="color: green">' + value + '</span>';
                    }
                    return value;
                }
            }, {
                header: _this.idioma.lbDenominacion,
                dataIndex: 'denominacion',
                id: 'expandir',
                renderer: function(value, metaData, record) {
                    if (record.id <= 0) {
                        return '<span style="color: green">' + value + '</span>';
                    }
                    return value;
                }
            }, {
                header: 'Fecha inicio',
                dataIndex: 'fechainicio'
            }, {
                header: 'Fecha fin',
                dataIndex: 'fechafin'
            }
        ];

        if (this.columnsFields) {
            columns = columns.concat(_this.columnsFields);
        }

        this.columnasNomenclador = new Ext.grid.ColumnModel(columns);

        var fields = [
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
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            },
            {
                name: 'usarentidad'
            }
        ];

        if (this.storeFields) {
            fields = fields.concat(_this.storeFields);
        }

        this.storeNomenclador = new Ext.data.Store({
            url: this.urlController + 'cargarnomenclador',
            baseParams: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: _this.campoIdNomenclador,
                fields: fields
            })
        });

        this.storeNomenclador.on({
            'load': function(st, records, options) {
                if (records.length > 0) {
                    if (_this.rowSelect)
                        _this.selectionModeNomenclador.selectRow(_this.rowSelect);
                    else
                        _this.selectionModeNomenclador.selectFirstRow();

                } else {
                    if (_this.buscar)
                        mostrarMensaje(1, _this.idioma.lbSindatosBuscar);

                    _this.rowSelect = false;
                }
            }
        })

        this.selectionModeNomenclador = new Ext.grid.RowSelectionModel({
        });

        this.selectionModeNomenclador.on({
            'rowselect': function(st, number, record) {
                _this.rowSelect = number;
                _this.activarBotones();
            },
            'rowdeselect': function(st, number, record) {
                _this.rowSelect = false;
                _this.activarBotones();
            }
        });

        this.tfCodigoFiltro = new Ext.form.TextField({
            id: 'tfcodigo',
            hidden: !_this.codigo,
            maskRe: /^[0-9]/,
            regex: _this.idioma.lbRegexCodigo,
            regexText: _this.idioma.lbRegexCodigoText,
            maxLength: _this.idioma.lbMaxLengthCodigo,
            minLength: _this.idioma.lbMinLengthCodigo,
            maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
            minLengthText: _this.idioma.lbMsgMinLongCodigo,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(t, e) {
                    if (e.getKey() == 13) {
                        _this.btnBuscar.fireEvent('click');
                    }
                }
            }

        });
        this.tfDenomFiltro = new Ext.form.TextField({
            id: _this.idioma.idCampoDenominacion,
            maxLength: 255,
           // maskRe: /^[a-zA-ZáéíóúñüÑ0-9-_/.\s]*[a-zA-ZáéíóúñüÑ0-9]+[a-zA-ZáéíóúñüÑ0-9-_/.\s]*$/,
            // regex: /^[a-zA-ZáéíóúñüÑ0-9-_/.\s]*[a-zA-ZáéíóúñüÑ0-9]+[a-zA-ZáéíóúñüÑ0-9-_/.\s]*$/,
            enableKeyEvents: true,
            // regexText: _this.idioma.lbRegexDescripText,
            //regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+([-%º()_/.\s]{0,1}[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)+$/,
            //regex: LOG.util.Regex.general,
            regexText: _this.idioma.lbRegexDescripText,
            minLength: _this.idioma.lbMinLengthDescripcion,
            maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
            minLengthText: _this.idioma.lbMsgMinLongDescripcion,
            listeners: {
                'specialkey': function(t, e) {
                    if (e.getKey() == 13) {
                        _this.btnBuscar.fireEvent('click');
                    }
                }
            }
        });

        this.gridPanelNomenclador = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            tbar: [new Ext.menu.TextItem({
                    hidden: !_this.codigo,
                    text: _this.idioma.lbCodigo + ':'
                }), '', this.tfCodigoFiltro, '', new Ext.menu.TextItem({
                    text: _this.idioma.lbDenominacion + ':'
                }), '', this.tfDenomFiltro, '', _this.btnBuscar, '', this.btnLimpiar],
            autoExpandColumn: 'expandir',
            cm: _this.columnasNomenclador,
            store: _this.storeNomenclador,
            plugins: this.plugins || [],
            sm: _this.selectionModeNomenclador,
            loadMask: {
                store: _this.storeNomenclador
            },
            bbar: new Ext.PagingToolbar({
                store: _this.storeNomenclador,
                displayInfo: true,
                pageSize: 30
            })
        });

        Ext.applyIf(this, {
            layout: 'border',
            items: [this.panelBotones, this.gridPanelNomenclador]
        });
        Ext.erp.gridPanelNomenclador.superclass.initComponent.call(this);
        this.storeNomenclador.load({
            params: {
                start: 0
            }
        });
    },
    activarBotones: function() {
        this.btnModificar.disable();
        this.btnEliminar.disable();
        this.btnUsarEntidad.disable();
        this.btnNoUsarEntidad.disable();
        this.btnHabilitar.disable();
        var _this = this;
        var itemSeleccionado = _this.selectionModeNomenclador.getSelected();
        if (_this.selectionModeNomenclador.getCount() > 0 && itemSeleccionado && itemSeleccionado.id > 0) {
            if (_this.selectionModeNomenclador.getCount() == 1)
                this.btnModificar.enable();
            if (itemSeleccionado.data.estado == 1) {
                this.btnEliminar.enable();
                if (itemSeleccionado.data.usarentidad) {
                    this.btnNoUsarEntidad.enable();
                    this.btnNoUsarEntidad.setVisible(true);
                    this.btnUsarEntidad.setVisible(false);
                } else {
                    this.btnUsarEntidad.enable();
                    this.btnNoUsarEntidad.setVisible(false);
                    this.btnUsarEntidad.setVisible(true);
                }
            } else {
                this.btnHabilitar.enable();
            }

            if (itemSeleccionado.id <= 0) {
                this.btnModificar.disable();
                this.btnEliminar.disable();
                this.btnUsarEntidad.disable();
                this.btnNoUsarEntidad.disable();
                this.btnHabilitar.disable();
            }
            if (itemSeleccionado.json.inicial ==1 || itemSeleccionado.json.final == 1) {
                this.btnEliminar.disable();
                this.btnNoUsarEntidad.disable();
            }
        }
    }

});
