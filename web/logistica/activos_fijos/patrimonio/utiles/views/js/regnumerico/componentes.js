/**
 * User: adrian
 * Date: 10/09/13
 * Time: 10:34
 * Info del componente: En el grid se crean las columnas y los records dinamicamente, segun las columnas que se le pasen por parametros.
 *                      Los componente editables de que contienen las columnas tambien son creados dinamicamente.
 *                      Para adicionar una nueva columna: (Teoricamente)
 *                          1- Ir a la modelo DatRegNumericoModel y en el metodo devolverColumnas agregar la columna.
 *                          2- En caso de que la columna sea de tipo combo porque los datos los carga de un nomenclador ya definido:
 *                              2.1- Ir a la misma modelo y en el metodo cargarCombo agregar la columna en el switch.
 *
 *                      Ojo: El guardar, el modificar etc, lo hace dinamicamente, lo que quiere decir que no se deberian tocar.
 */

Ext.ns('Ext.aft');
Ext.grid.CheckColumn = function(config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
    init: function(grid) {
        this.grid = grid;
        if (typeof (this.grid.editable) == 'undefined' || this.grid.editable) {
            this.grid.on('render', function() {
                var view = this.grid.getView();
                view.mainBody.on('mousedown', this.onMouseDown, this);
            }, this);
        }

    },
    onMouseDown: function(e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            this.grid.getSelectionModel().selectRow(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },
    renderer: function(v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + ((v == true || v == 1) ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};
if (!Ext.aft.regNumerico) {
    Ext.ns('Ext.aft.regNumerico');
}

/**
 * Grid generico
 */
Ext.aft.regNumerico.grid = Ext.extend(Ext.grid.EditorGridPanel, {
    filaSeleccionada: false,
    idEstadoUno: false,
    denomEstadoUno: false,
    constructor: function(config) {

        Ext.applyIf(this, config);
        var _this = this;
        this.datos = config.datos;
        this.idioma = config.idioma;
        this.clicksToEdit = 1;
        this.crearSelectionModel();
        this.editable = config.editable;
        this.array_columnas = new Array();
        this.array_plugins = new Array();
        this.array_pNivel = new Array();
        this.array_records = new Array();
        this.array_tbar = new Array();
        this.pluginsCMPS = new Array();
        for (var i = 0; i < arrCampos.length; i++) {
            this.attatchPlugin(arrCampos[i]);
        }
        this.campos = LOG.aft.RegOperativo.Campos;
        Ext.each(this.pluginsCMPS, function(plugin) {
            plugin.init(_this);
        });
        //this.array_columnas.push(_this.sm);
        this.array_columnas.push(new Ext.grid.RowNumberer({
            header: 'N\xBA.',
            width: 30
        }));
        this.array_pNivel.push({
            'header': _this.array_columnas[0].header
        });
        this.array_columnas[0].header = '';
        this.array_records.push({
            name: 'nro'
        });
        if (_this.datos.inventario) {
            this.array_records.push({
                name: 'color'
            });
            this.array_regnumeicos = new Array();
        }

        this.plugins = this.checkColumn;
        this.forzado = false;
        this.rowSeleccionada = 0;
        this.RellenarColumModel();
        var group = new Ext.ux.grid.ColumnHeaderGroup({
            rows: [_this.array_pNivel]
        });
        this.array_plugins.push(group);
        this.plugins = this.array_plugins;
        this.cm = new Ext.grid.ColumnModel(this.array_columnas);
        this.crearStore();
        /**
         * Componente de la busqueda basica
         */
        if (this.array_tbar.length > 0) {
            this.limpiarBtn = new Ext.Button({
                id: 'idLimpiarBtn',
                iconCls: 'limpiar',
                text: _this.idioma.lbBtnLimpiar
            });
            this.limpiarBtn.on('click', function() {
                var items = _this.array_tbar;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].identificador) {
                        if (items[i].getValue() != '') {
                            items[i].reset();
                        }
                    }
                }
                _this.getStore().load();
            });
            this.buscarBtn = new Ext.Button({
                id: 'idBuscarBtn',
                iconCls: 'buscar',
                text: this.idioma.lbBtnbuscar
            });
            this.buscarAvanzBtn = new Ext.Button({
                id: 'idBuscarAvanzBtn',
                iconCls: 'buscaravanzada',
                text: _this.idioma.lbBtnbuscarAvanz,
                tooltip: _this.idioma.lbTtBtnbuscarAvanz
            });
            this.buscarAvanzBtn.on('click', function() {
                _this.crearWinBsuquedaAvanzada();
            });
            this.buscarBtn.on('click', function() {
                _this.getStore().reload();
            });
            this.array_tbar.push(this.buscarBtn);
            this.array_tbar.push(this.buscarAvanzBtn);
            this.array_tbar.push(this.limpiarBtn);
            this.tbar = this.array_tbar;
        }
        if (_this.scope.datos.tipo_interfaz == 'no_entrada') {

            _this.btnBusAvanz = new Ext.Button({
                //id: 'btnBuscar',
                id: _this.url + 3,
                iconCls: 'buscaravanzada',
                disabled: false,
                text: 'B&uacute;squeda avanzada',
                tooltip: 'Buscar registro num&eacute;rico',
                handler: function() {
                    if (!_this.busqueda) {
                        _this.busqueda = new Ext.aft.regNumerico.BusquedaEstatica({
                            idioma: _this.idioma,
                            scope: _this,
                            cerrarAceptar: false,
                            tipo: 1
                        });
                    }

                    _this.busqueda.show();
                    _this.busqueda.center()
                    var tempPrimario = _this.busqueda.arrayAlturas[0];
                    var tempSecundario = 0;
                    Ext.each(_this.busqueda.arrayAlturas, function(o, p) {
                        tempSecundario = _this.busqueda.arrayAlturas[p + 1];
                        if (tempPrimario < tempSecundario)
                            tempPrimario = tempSecundario;
                    });

                    _this.busqueda.setHeight(tempPrimario + 115);
                    _this.busqueda.heitghInicial = tempPrimario + 115;
                    Ext.each(_this.busqueda.tabpanel.items.items, function(o, p) {
                        o.setHeight(tempPrimario);
                    });
                    //_this.busqueda.panelDatosG.setHeight(tempPrimario);
                    //_this.busqueda.panelDatosG.doLayout();
                    _this.busqueda.panelGeneral.doLayout();
                }
            });
            this.tbar = ['->', _this.btnBusAvanz];
        }

        this.bbar = new Ext.PagingToolbar({
            store: _this.store,
            pageSize: 20,
            displayInfo: true
        });
        this.clicksToEdit = 1;
        this.loadMask = {
            store: _this.store
        };
        this.listeners = {
            'rowdblclick': function(g, rowIndex, e) {
                if (_this.datos.inventario) {
                    var recordGrid = _this.store.getAt(rowIndex);
                    var add = true;
                    if (!recordGrid.data.color || recordGrid.data.color == 'rojo') {
                        for (var i = 0; i < _this.negros; i++) {
                            if (_this.negros[i] == recordGrid.data.idregnumerico) {
                                add = false;
                                break;
                            }
                        }

                        if (add) {
                            _this.negros.push(recordGrid.data.idregnumerico);
                            var nuevos = new Array();
                            for (var j = 0; j < _this.rojos.length; j++) {

                                if (_this.rojos[j] != recordGrid.data.idregnumerico) {
                                    nuevos.push(_this.rojos[j]);
                                }
                            }

                            _this.rojos = nuevos;
                        }
                    } else if (recordGrid.data.color == 'negro') {
                        var add2 = true;
                        for (var i = 0; i < _this.negros; i++) {
                            if (_this.rojos[i] == recordGrid.data.idregnumerico) {
                                add2 = false;
                                break;
                            }
                        }

                        if (add2) {
                            _this.rojos.push(recordGrid.data.idregnumerico);
                            var nuevos2 = new Array();
                            for (var l = 0; l < _this.negros.length; l++) {

                                if (_this.negros[l] != recordGrid.data.idregnumerico) {
                                    nuevos2.push(_this.negros[l]);
                                }
                            }

                            _this.negros = nuevos2;
                        }
                    }

                    if (_this.array_regnumeicos.length > 0 && recordGrid.data.idregnumerico) {
                        var banderaN = true;
                        for (var k = 0; k < _this.array_regnumeicos.length; k++) {

                            if (_this.array_regnumeicos[k] == recordGrid.data.idregnumerico) {
                                banderaN = false;
                                break;
                            }
                        }

                        if (banderaN) {
                            _this.array_regnumeicos.push(recordGrid.data.idregnumerico);
                        }


                    } else {

                        _this.array_regnumeicos.push(recordGrid.data.idregnumerico);
                    }


                    _this.first = 3
                    if (recordGrid.data.color != "verde") {
                        _this.store.reload();
                    }


                }
            },
            'rowclick': function(grid, index) {
                _this.rowSeleccionada = index;
            },
            'render': function() {
                if (_this.autoCargar) {
                    _this.getStore().load();
                }
            }
        };
        this.crearBotonesPropios();
        Ext.aft.regNumerico.grid.superclass.constructor.apply(this, arguments);
    },
    attatchPlugin: function(plugin) {
        this.pluginsCMPS.push(plugin);
    },
    crearSelectionModel: function() {
        var _this = this;
        var sm = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        sm.on({
            'rowselect': function(sm, rowIndex, r) {
                Ext.Ajax.abort();
                if (_this.filaSeleccionada != rowIndex || !_this.filaSeleccionada) {
                    _this.filaSeleccionada = rowIndex;
                }

                if (_this.datos.inventario) {
                    if (r.data.color != 'verde') {
                        _this.btnEliminar.disable();
                    } else {
                        _this.btnEliminar.enable();
                    }
                }


            },
            'rowdeselect': function(sm, rowIndex, r) {
                _this.filaSeleccionada = false;
            }

        });
        sm.rowspan = 2;
        this.sm = sm;
    },
    crearStore: function() {

        var _this = this;
        var Record = Ext.data.Record.create(_this.array_records);
        _this.verdes = new Array();
        _this.negros = new Array();
        _this.rojos = new Array();
        _this.first = "";

        this.store = new Ext.data.Store({
            url: _this.url,
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "datos",
                id: "idnumerosseriesalida"
            }, Record),
            listeners: {
                'beforeLoad': function(store) {

                    var params = new Object();
                    params.idmovimiento = _this.datos.idmovimiento;
                    params.idproducto = _this.datos.idproducto;
                    params.idoperacion = _this.datos.idoperacion;
                    params.tipo_interfaz = _this.datos.tipo_interfaz;
                    params.idestructuraop = _this.datos.idarearesp;
                    params.idestructurapadre = _this.datos.idestructurapadre;
                    if (_this.datos.inventario) {
                        if (_this.datos.idestado != "1") {
                            params.seriesdisponibles = 2;
                        } else {
                            params.seriesdisponibles = "";
                        }
                        params.inventario = 2;
                        params.verdes = _this.verdes;
                        params.negros = _this.negros;
                        params.rojos = _this.rojos;
                        params.first = _this.first;
                    }

                    var items = _this.array_tbar;
                    //Para las busquedas
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].identificador) {
                            if (items[i].getValue() != '') {
                                params[items[i].identificador] = items[i].getValue();
                            }
                        }
                    }
                    store.baseParams.parametros = Ext.encode(params);
                    _this.mascara = new Ext.LoadMask(_this.getEl(), {msg: "Cargando..."});
                    _this.mascara.show();
                },
                'load': function(st, records, opt) {
                    _this.mascara.hide();
                    if (records.length > 0) {
                        if ((_this.datos.inventario) && !_this.first) {
                            for (var i = 0; i < records.length; i++) {
                                if (!records[i].data.color) {
                                    _this.rojos.push(records[i].data.idregnumerico);
                                    _this.array_regnumeicos.push(records[i].data.idregnumerico);
                                    records[i].data.color = 'rojo';
                                }
                            }


                        }
                    } else {
                        var flag = false;
                        var params = Ext.decode(st.baseParams.parametros);
                        for (var i = 0; i < _this.array_columnas.length; i++) {


                            for (var property in params) {
                                if (property == _this.array_columnas[i].dataIndex) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                break;
                            }
                        }
                        if (flag) {
                            mostrarMensaje(1, _this.idioma.lbMsgNoHayDatosBusqueda);
                        }
                    }
                }
            }
        });
    },
    RellenarColumModel: function() {

        var _this = this;
        //  Poniendo records necesarios obligatorios en el grid

        this.array_records.push({
            name: 'idregnumerico'
        });
        this.array_records.push({
            name: 'idmovregnumerico'
        });
        this.array_records.push({
            name: 'idtabla'
        });
        this.array_records.push({
            name: 'arridtablas'
        });
        this.array_records.push({
            name: 'iddenomestadotecnico'
        });
        for (var i = 0; i < this.datos.columnas.length; i++) {
            var col = this.datos.columnas[i];
            var columna = _this.campos[col.name];

            if (columna) {
                columna.editable = col.editable;
                columna.renderer = function(value, dos, record) {
                    if (value != null) {
                        if (_this.datos.inventario) {
                            if (record.data.color == 'verde') {
                                return '<span style="color:#5fd419;">' + value + '</span>';
                            } else if (record.data.color == 'negro') {
                                return value;
                            } else {
                                return '<span style="color:#ff0800;">' + value + '</span>';
                            }
                        }
                        return value;
                    }
                };

                if (columna.xtype == 'textfield' || columna.xtype == 'numberfield') {
                    var cmpEditable = (this.editable == true) ? this.getCmp(columna) : null;
                    this.adicinarColumna(columna, cmpEditable);
                }

                else if (columna.xtype == 'datefield') {

                    var cmpEditable = (this.editable == true) ? this.getCmp(columna) : null;
//                columna[1].type = columna[1].tipo;
                    columna.renderer = function(value, otro, record) {
                        var retornar = "";
                        if (value != null) {
                            if (typeof (value) == 'object') {
                                retornar = value.dateFormat('d/m/Y');
                            } else {
                                retornar = value;
                            }
                            if (_this.datos.inventario) {
                                if (record.data.color == 'verde') {
                                    return '<span style="color:#5fd419;">' + value + '</span>';
                                } else if (record.data.color == 'negro') {
                                    return value;
                                } else {
                                    return '<span style="color:#ff0800;">' + value + '</span>';
                                }
                            }
                            return retornar;
                        }
                    };
                    this.adicinarColumna(columna, cmpEditable);
                }

                else if (columna.xtype == 'combobox' || columna.xtype == 'combustible') {
                    var cmpEditable = (this.editable == true) ? this.getCmp(columna) : null;
                    this.array_records.push({
                        name: 'id' + columna.dataIndex
                    });
                    this.adicinarColumna(columna, cmpEditable);
                }

                else if (columna.xtype == 'check') {
                    this.getCheck(columna);
                }

                //Columnas de tratamiento diferenciado
                else if (columna.xtype == 'win_ubicacion') {
                    this.crearColEditableWinUbicacion(columna);
                } else if (columna.xtype == 'win_responsable') {
                    this.crearColEditableWinResponsable(columna, false);
                }
            }
        }
    },
    getCmp: function(columna) {
        var _this = this;
        switch (columna.xtype) {
            case 'textfield':
                return this.getTextField(columna, 'text');
            case 'numberfield':
                return this.getTextField(columna, 'nro');
            case 'datefield':
                return this.getDateField(columna);
            case 'combobox':
                return this.getCombo(columna);
            case 'combustible':
                return this.getTreeCobustible(columna);
        }
    },
    getTextField: function(columna, tipo) {

        var errormsgmax = this.idioma.lbCantMaxCaracteres.replace('_A_', (tipo == 'text') ? 'caracteres' : 'cifras');
        var errormsgmin = this.idioma.lbCantMinCaracteres.replace('_A_', (tipo == 'text') ? 'caracteres' : 'cifras');
        var cmp = (tipo == 'text') ? (new Ext.form.TextField()) : (new Ext.form.NumberField());
        Ext.apply(cmp, columna[1]);
        if (cmp.readOnly != null && cmp.readOnly == true) {
            cmp.readOnly = true;
        }

        if (cmp.maskRe) {
            cmp.maskRe = Ext.decode(cmp.maskRe);
        }

        if (cmp.regex) {
            cmp.regex = Ext.decode(cmp.maskRe);
        }

        if (cmp.maxLength)
            cmp.maxLengthText = errormsgmax.replace('_C_', cmp.maxLength);
        if (cmp.minLengthText)
            cmp.minLengthText = errormsgmax.replace('_C_', cmp.minLengthText);
        /*if(this.datos.inventario)
         {
         cmp.editable = false;
         }*/
        return cmp;
    },
    getDateField: function(columna) {
        var _this = this;
        var cmpExpandidoFecha = Ext.extend(Ext.form.DateField, {
            constructor: function(config) {
                Ext.apply(this, config);
                this.ordenCronologico = config.ordenCronologico;
                cmpExpandidoFecha.superclass.constructor.call(this, arguments);
            },
            getOrdenCronologico: function() {
                return this.ordenCronologico;
            }
        });
        function setDateNull(cmp) {
            var record = _this.getSelectionModel().getSelected();
            record.set(cmp.id, null);
        }

        var cmpEditable = new cmpExpandidoFecha({
            format: 'd/m/Y',
            enableKeyEvents: true,
            ordenCronologico: columna.ordencronologico,
            listeners: {
                'change': function(cmp) {
                    setDateNull(cmp);
                }
            }
        });
        return cmpEditable;
    },
    getCombo: function(columna) {

        var _this = this;
        var propiedad_id = 'id';
        var propiedad_descripcion = 'denominacion';
        var propiedad_informacion = 'info';
//        var combo = new LOG.util.ComboBox(columna);
//        combo.url = '/logistica/activos_fijos/configuracion/index.php/nomactividad/' + columna.url,
        var combo = new LOG.util.ComboBox({
            valueField: 'denominacion',
            displayField: 'denominacion',
            triggerAction: 'all',
            selectOnFocus: true,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            resizable: true,
            listWidth: 300,
            store: new Ext.data.Store({
                url: _this.datos.urlControladora + 'cargarcombogrideditable',
                autoLoad: true,
                listeners: {
                    'beforeload': function(store) {
                        store.baseParams.tipocombo = columna.dataIndex;
                        store.baseParams.nombreid = propiedad_id;
                        store.baseParams.nombredenominacion = propiedad_descripcion;
                        store.baseParams.info = propiedad_informacion;
                        var parametros = new Object();
                        if (columna.dataIndex == 'denomestadotecnico') {
                            parametros.idoperacion = _this.datos.idoperacion;
                            if (_this.datos.tipo_interfaz == "no_entrada") {
                                if (_this.getSelectionModel().hasSelection()) {
                                    var idregnumerico = _this.getSelectionModel().getSelected().data.idregnumerico;
                                    parametros.idregnumerico = idregnumerico;
                                }
                            }
                        }
                        parametros.idestructura = _this.datos.idestructurapadre;
                        store.baseParams.parametros = Ext.encode(parametros);
                    },
                    load: function(st, records, options) {
                        if (records.length == 0) {
                            var tipo_combo = (columna.dataIndex == 'denomestadotecnico') ? _this.idioma.lbEstados : (columna.dataIndex == 'colorprim' || columna.dataIndex == 'colorsec') ? _this.idioma.lbColores : (columna.dataIndex == 'tipomotor') ? _this.idioma.lbTiposMotores : (columna.dataIndex == 'metododepreciacion') ? _this.idioma.lbMedodosDepreciacion : 'datos';
                            var msg = _this.idioma.lbMsgNoExistenDatos.replace('_replace_', tipo_combo);
                            //mostrarMensaje(3, msg);
                        }

                        if (columna.dataIndex == 'denomestadotecnico') {
                            _this.idEstadoUno = records[0].get('idestatustecnico');
                            _this.denomEstadoUno = records[0].get('denominacion');
                        }
                    }
                },
                reader: new Ext.data.JsonReader({
                    id: 'idcmb' + columna.dataIndex,
                    root: 'datos'
                }, [
                    {
                        name: propiedad_id
                    },
                    {
                        name: propiedad_descripcion
                    },
                    {
                        name: propiedad_informacion
                    },
                    {
                        name: "id" + columna.dataIndex
                    },
                    {
                        name: columna.name
                    }
                ])
            }),
            listeners: {
                'select': function(cmb, record, index) {
                    _this.getSelectionModel().getSelected().data['id' + columna.dataIndex] = (record.data.id) ? record.data.id : record.get(columna.name); /*['id'+columna[1].dataIndex];*/
                }
            }
        });
        Ext.applyIf(combo, columna);
        return combo;
    },
    getCheck: function(columna) {

        this.array_records.push({
            name: columna[1].dataIndex
        });
        var cmp = new Ext.grid.CheckColumn({
            id: columna[1].dataIndex,
            align: 'center'
        });
        Ext.applyIf(cmp, columna[1])

        this.array_columnas.push(cmp);
        this.array_plugins.push(cmp);
        this.array_pNivel.push({
            'header': this.idioma[columna[0].header]
        });
    },
    getTreeCobustible: function(columna) {

        var _this = this;
        var cmp = new Ext.aft.comboTipoCombustible({
            textRootNode: 'Tipos de combustible', // Texto del nodo padre  (obligatorio)
            modeTree: 'remote',
            fnDbClick: function(idtipocombustible) {
                _this.getSelectionModel().getSelected().set('idtipocombustible', idtipocombustible);
            },
            params: {}
        });
        Ext.applyIf(cmp, columna[1])

        return cmp;
    },
    crearColEditableWinUbicacion: function(columna) {

        var _this = this;
        var cmpEditable = (this.editable == true) ? new Ext.form.TextField({
            allowBlank: true,
            readOnly: true,
            editable: false,
            emptyText: 'lbSeleccione',
            listeners: {
                'focus': function(combo) {

                    Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                    if (!_this.Ubicacion) {
                        var objParams = new Object();
                        if (_this.datos.tipoubicacion == 'activos') {
                            objParams.tipoestructura = 2;
                            objParams.idubicacion = _this.datos.idarearesp;
                            objParams.arearesp = _this.datos.arearesp;
                        }
                        objParams.doAction = function(obj_nodoSeleccionado) {
                            if (obj_nodoSeleccionado.getDepth() != 0) {
                                _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set('id' + columna.dataIndex, obj_nodoSeleccionado.id);
                            } else {
                                _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set('id' + columna.dataIndex, null);
                            }
                            _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set(columna.dataIndex, obj_nodoSeleccionado.text);
                            _this.Ubicacion.hide();
                        }
                        objParams.listeners = {
                            'beforeshow': function() {
                                Ext.getBody().unmask();
                            }
                        }

                        _this.Ubicacion = new Ext.Log.Treestructuraubicacion.ventana(objParams);
                    } else {
                        _this.Ubicacion.show();
                    }
                }
            }
        }) : null;
        this.array_records.push({
            name: 'id' + columna.dataIndex
        });
        columna.renderer = function(value, dos, record) {
            var respuesta = "";
            if (value == null) {
                respuesta = _this.datos.arearesp;
            } else {
                respuesta = value;
            }

            if (_this.datos.inventario) {
                if (record.data.color == 'verde') {
                    return '<span style="color:#5fd419;">' + respuesta + '</span>';
                } else if (record.data.color == 'negro') {
                    return value;
                } else {
                    return '<span style="color:#ff0800;">' + respuesta + '</span>';
                }
            }
            return respuesta;
        };
        this.adicinarColumna(columna, cmpEditable);
    },
    crearColEditableWinResponsable: function(columna, busqueda) {

        var _this = this;
        var edit = (busqueda) ? true : this.editable;
        var cmpEditable = (edit) ? new Ext.form.TextField({
            allowBlank: true,
            readOnly: true,
            editable: false,
            emptyText: 'lbSeleccione',
            listeners: {
                'focus': function(field) {
                    Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                    if (!_this.Responsable) {
                        var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                            region: 'center',
                            id: 'panelBusPer',
                            singleSelect: true,
                            identidad: perfil.idestructuracomun,
                            showBtnAdicionar: true,
                            modulo: 'PERSONA',
                            showBtnAdicionar: false,
                                    hideBtnAyuda: true
                        });
                        var btnAceptar = new Ext.Button({
                            text: 'Aceptar',
                            iconCls: 'aceptar',
                            listeners: {
                                'click': function() {
                                    if (panelBusPer.getSeleccion()) {
                                        _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set('id' + columna.dataIndex, panelBusPer.getSeleccion().get('idpersona'));
                                        _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set(columna.dataIndex, (panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));
                                        field.setValue((panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));
                                        Ext.getCmp('idbtnGuardarReg').enable();
                                    } else {
                                        _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set('id' + columna.dataIndex, null);
                                        _this.store.getAt(_this.store.indexOf(_this.getSelectionModel().getSelected())).set(columna.dataIndex, '');
                                    }
                                    _this.Responsable.hide();
                                }

                            }
                        });
                        var btnCancelar = new Ext.Button({
                            text: 'Cancelar',
                            iconCls: 'cancelar',
                            listeners: {
                                'click': function() {
                                    _this.Responsable.hide();
                                }

                            }
                        });
                        _this.Responsable = new Ext.Window({
                            title: 'Personas',
                            width: 800,
                            height: 600,
                            resizable: false,
                            modal: true,
                            closeAction: 'close',
                            layout: 'border',
                            items: [panelBusPer],
                            buttons: [btnCancelar, btnAceptar],
                            listeners: {
                                'beforeshow': function() {
                                    Ext.getBody().unmask();
                                }
                            }
                        });
                        _this.Responsable.show();
                        panelBusPer.stpersonabuscar.load();
                    }
                    else {
                        _this.Responsable.show();
                    }
                }
            }
        }) : null;
        this.array_records.push({
            name: 'id' + columna.dataIndex
        });
        columna.renderer = function(value, dos, record) {

            var respuesta = "";
            if (value == null) {
                var responsable;
                if (_this.datos.PersonaResponsable && _this.datos.PersonaResponsable.datosPersona) {
                    responsable = _this.datos.PersonaResponsable.datosPersona;
                    respuesta = ((responsable.nombre) ? responsable.nombre : '') + ((responsable.papel) ? responsable.papel : '') + ((responsable.sapel) ? responsable.sapel : '');
                } else {
                    respuesta = '';
                }
            } else {
                respuesta = value;
            }

            if (_this.datos.inventario) {
                if (record.data.color == 'verde') {
                    return '<span style="color:#5fd419;">' + respuesta + '</span>';
                } else if (record.data.color == 'negro') {
                    return value;
                } else {
                    return '<span style="color:#ff0800;">' + respuesta + '</span>';
                }
            }
            return respuesta;
        };
        if (busqueda) {
            return cmpEditable;
        } else {
            this.adicinarColumna(columna, cmpEditable);
        }


    },
    adicinarColumna: function(col, cmpEditable) {
        var columna = {};
        Ext.applyIf(columna, col);
        var _this = this;
        columna.xtype = null;
        var c = new Object();
        Ext.applyIf(c, columna);
        if (typeof (columna.obligatorio) != 'undefined' && columna.obligatorio) {
            if (cmpEditable)
                cmpEditable.allowBlank = false;
        }

        if (columna.regex && cmpEditable) {
            var regExp = new RegExp(columna.regex);
            cmpEditable.regex = regExp;
            cmpEditable.maskRe = regExp;
        }

        c.editor = (cmpEditable) ? cmpEditable : null;
        if (!c.id)
            c.id = columna.dataIndex;
//        if (c.header)
//            c.header = _this.idioma[c.header];
//
//        if (c.tooltip)
//            c.tooltip = _this.idioma[c.tooltip];


        _this.array_columnas.push(c);
        if (columna) {
            var pNivel = new Object();
            Ext.applyIf(pNivel, columna);
            if (pNivel.header) {
                pNivel.header = _this.idioma[pNivel.header];
            }

            if (pNivel.tooltip)
                pNivel.tooltip = _this.idioma[pNivel.tooltip];
            _this.array_pNivel.push(pNivel);
        }
        _this.array_records.push({
            name: c.dataIndex
        });
        _this.buscarPor(columna);
    },
    buscarPor: function(columna) {
        var _this = this;
        //Aqui es donde se construye el TBAR de la busqueda.
        if (columna.dataIndex == 'nroinventario') {
            this.array_tbar.push(' ', {
                xtype: 'label',
                text: columna.fieldLabel + ':',
                novalor: true
            }, ' ');
            var field1 = new Ext.form.TextField({
                xtype: 'textfield',
                regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                fieldLabel: columna.fieldLabel,
                identificador: columna.dataIndex
            });
            this.array_tbar.push(field1);
        }
        else if (columna.dataIndex == 'nroserie') {
            this.array_tbar.push(' ', {
                xtype: 'label',
                text: columna.fieldLabel + ':',
                novalor: true
            }, ' ');
            var field2 = new Ext.form.TextField({
                xtype: 'textfield',
                regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                fieldLabel: columna.fieldLabel,
                identificador: columna.dataIndex
            });
            this.array_tbar.push(field2);
        }
    },
    crearBotonesPropios: function() {
        var _this = this;
        this.btnAdicionar = new Ext.Button({
            text: _this.idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            hidden: !_this._parent._parent.grantedAction('btnAdicionarRegistro'),
            disabled: true
        });
        this.btnEliminar = new Ext.Button({
            text: _this.idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            hidden: !_this._parent._parent.grantedAction('btnEliminarRegistro'),
            disabled: true
        });
        this.btnGuardar = new Ext.Button({
            text: _this.idioma.lbBtnGuardar,
            iconCls: 'guardar',
            id: 'idbtnGuardarReg',
            hidden: !_this._parent._parent.grantedAction('btnAdicionarRegistro'),
            disabled: true
        });
        this.btnAyuda = new Ext.Button({
            text: _this.idioma.lbBtnAyuda,
            tooltip: _this.idioma.lbTtBtnAyuda,
            iconCls: 'ayuda'
        });
    },
    adicionarFila: function() {
        var _this = this;
        if (_this.getStore().getCount() == 0) {
            var dataRecord = {};
            for (var i = 0, length = _this.array_columnas.length; i < length; i++) {

                if (_this.array_columnas[i].value != null) {
                    dataRecord[_this.array_columnas[i].dataIndex] = _this.array_columnas[i].value;
                } else {
                    dataRecord[_this.array_columnas[i].dataIndex] = null;
                }
            }

            if (_this.datos.inventario) {
                dataRecord.color = 'verde';
            }
            var Record = Ext.data.Record.create(_this.array_records);
            var tupla = new Record(dataRecord);
            tupla.set('iddenomestadotecnico', _this.idEstadoUno);
            tupla.set('denomestadotecnico', _this.denomEstadoUno);
            tupla.set('porcientorecuperacion', (this.datos.porcientorecuperacion) ? this.datos.porcientorecuperacion : "");
            tupla.set('vidautil', (this.datos.vidautil) ? this.datos.vidautil : "");
            tupla.set('coeficiente', (this.datos.coeficiente) ? this.datos.coeficiente : "");
            tupla.set('tasafiscal', (this.datos.tasafiscal) ? this.datos.tasafiscal : "");
            this.stopEditing();
            this.getStore().insert(0, tupla);
            this.startEditing(0, 1);
            this.getSelectionModel().selectFirstRow();
        } else {
            //if (_this.getStore().getAt(0).get('idregnumerico')) {

            var dataRecord = {};
            var primera_fila = _this.getStore().getAt(0);
            for (var i = 0; i < _this.array_columnas.length; i++) {

                if (_this.array_columnas[i].duplicar == true) {

                    if (primera_fila.get('id' + _this.array_columnas[i].dataIndex) || _this.array_columnas[i].dataIndex == 'iddenomestadotecnico') {
                        dataRecord['id' + _this.array_columnas[i].dataIndex] = primera_fila.get('id' + _this.array_columnas[i].dataIndex);
                    }
                    dataRecord[_this.array_columnas[i].dataIndex] = primera_fila.get(_this.array_columnas[i].dataIndex);
                } else {
                    dataRecord[_this.array_columnas[i].dataIndex] = null;
                }
            }

            if (_this.datos.inventario) {
                dataRecord.color = 'verde';
            }

            var Record = Ext.data.Record.create(_this.array_records);
            var tupla = new Record(dataRecord);
            this.stopEditing();
            this.getStore().insert(0, tupla);
            if (_this.datos.inventario) {
                for (var i = 1; i < _this.array_columnas.length; i++) {
                    _this.getColumnModel().setEditable(i, true);
                }
                _this.first = 3;
            }

            this.startEditing(0, 1);
            this.getSelectionModel().selectFirstRow();
            //}
        }

    },
    verificarDatos: function(r) {
        var _this = this;
        var camposVacios = false;
        var cm = _this.getColumnModel();
        _this.validarCampos(r.data);
        for (var i = 1; i < cm.getColumnCount(); i++) {
            var idColumn = cm.getColumnId(i);
            var c = cm.getColumnById(idColumn);
            if (typeof (c.obligatorio) != 'undefined' && c.editable && c.obligatorio && (r.get(idColumn) == null/* || (r.get(idColumn).toString().replace(' ', '').length) == 0*/)) {
                camposVacios = true;
                var rowIndex = _this.getStore().indexOf(r);
                _this.startEditing(rowIndex, i);
//                mostrarMensaje(3, _this.idioma.lbCampoOblig, function(btn) {
//                    if (r) {
//                        var rowIndex = _this.getStore().indexOf(r);
//                        _this.startEditing(rowIndex, i);
//                    }
//                });
                break;
            }
        }
        return camposVacios;
    },
    guardarFila: function() {
        var _this = this;
        var records = _this.getStore().getModifiedRecords();
        var obligatorios = false;
        if (_this.datos.inventario) {
            for (var i = 0; i < _this.array_regnumeicos.length; i++) {
                records.push(_this.getStore().getAt(_this.getStore().find("idregnumerico", _this.array_regnumeicos[i])));
            }
        }
        var cm = _this.getColumnModel();
        for (var h = 0; h < records.length; h++) {
            var r = records[h];
            for (var i = 1; i < cm.getColumnCount(); i++) {
                var idColumn = cm.getColumnId(i);
                var c = cm.getColumnById(idColumn);
                if (typeof (c.obligatorio) != 'undefined' && c.obligatorio && (r.get(idColumn) == null)) {
                    obligatorios = true;
                    break;
                }
            }
        }

//        if (r) {
//        }

        if (records.length > 0 || obligatorios) {

            var verificarAdd = false;
//            if (!_this.datos.inventario) {
//                var r = _this.getSelectionModel().getSelected();
//
//                if (r) {
//                    verificarAdd = _this.verificarDatos(r);
//                } else {
//                    alert('Tiene que seleccionar la fila que se va a guardar');
//                }
//
//            } else {
            var arrayDatos = new Array();
            for (var j = 0; j < records.length; j++) {

                if (records[j]) {
                    verificarAdd = _this.verificarDatos(records[j]);
                    if (verificarAdd) {
                        break;
                    }

                    records[j].data.idarearesp = _this.datos.idarearesp;
                    records[j].data.idcentrocosto = _this.datos.idcentrocosto;
                    records[j].data.idmovimiento = _this.datos.idmovimiento;
                    records[j].data.idnaturaleza = _this.datos.idnaturaleza;
                    records[j].data.idprod = _this.datos.idprod;
                    records[j].data.idproducto = _this.datos.idproducto;
                    records[j].data.forzado = _this.forzado;
                    arrayDatos.push(records[j].data);
                }

            }
            //}
            if (!verificarAdd) {

                Ext.getBody().mask(_this.idioma.lbMASkGuardando, 'x-mask-loading');
                var param = {};
                if (_this.datos.inventario) {
                    param['inventario'] = 2;
                }
                param['datos'] = Ext.encode(arrayDatos);
                Ext.Ajax.request({
                    url: this.datos.urlControladora + 'guardarserieentrada',
                    method: 'POST',
                    params: param,
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        var rd = Ext.decode(response.responseText);
                        _this.forzado = false;
                        if (_this.datos.inventario) {
                            _this.array_regnumeicos = new Array();
                            _this.rojos = new Array();
                            for (var i = 1; i < _this.array_columnas.length; i++) {
                                _this.getColumnModel().setEditable(i, false);
                            }
                            _this.first = null;
                        }

                        if (rd.failure == true) {

                            if (rd.repetidos) {
                                if (rd.repetidos.length > 1) {
                                    mostrarMensaje(1, "Los campos  " + rd.repetidos[1] + " y " + rd.repetidos[0] + " ya existen en el sistema");
                                } else {
                                    mostrarMensaje(1, "El campo " + rd.repetidos[0] + " ya existe en el sistema");
                                }

                            } else {
                                var nrsoSeries = "";
                                for (var i = 0; i < rd.datos.length; i++) {
                                    nrsoSeries += ' <li>' + rd.datos[i] + '</li> ';
                                }
                                var msg = _this.idioma.lbMsgExisteOk + '<div style="margin-left: 50px !Important;"><b>Los siguientes n&uacute;meros de series ya est&aacute;n registrados en el sistema:</b></br>' + nrsoSeries;
                                msg += '</br>';
                                msg += '<div style="margin-left: 50px !Important;">\xbfQuiere adicionarlo de todas maneras?</div>';
                                Ext.Msg.show({
                                    title: _this.idioma.lbTitleConfirmacion,
                                    msg: msg,
                                    width: 350,
                                    buttons: Ext.Msg.OKCANCEL,
                                    fn: function(btn) {
                                        if (btn == 'ok') {
                                            _this.forzado = true;
                                            _this.guardarFila();
                                        }
                                    },
                                    animEl: 'mb3',
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }

                        }
                        if (rd.success) {
                            if (_this.datos.inventario) {
                                mostrarMensaje(1, 'Los datos han sido modificado satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, _this.idioma.lbMsgGuardarOk);
                            }
                            _this.getStore().reload();
                            _this.getStore().rejectChanges();
                        }
                    }
                });
            }
        }
    },
    validarCampos: function(obj) {
        for (var i in obj) {
            if (typeof (obj[i]) == 'string' && obj[i].length == 0) {
                obj[i] = null;
            }
        }
    },
    ejecutaAccion: function(hotKey, grid) {

        if (!this.Ubicacion || !this.Ubicacion.isVisible() || !this.Responsable || this.Responsable.isVisible()) {
            switch (hotKey) {
                case 'Alt+I':
                    {
                        if (this.btnAdicionar) {
                            if (this.btnAdicionar.isVisible() && this.btnAdicionar.disabled == false) {
                                this.btnAdicionar.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'DEL':
                    {
                        if (this.btnEliminar) {
                            if (this.btnEliminar.isVisible() && this.btnEliminar.disabled == false) {
                                this.btnEliminar.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+G':
                    {

                        if (this.btnGuardar) {
                            if (this.btnGuardar.isVisible() && this.btnGuardar.disabled == false) {
                                this.btnGuardar.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+L':
                    {
                        if (this.limpiarBtn) {
                            if (this.limpiarBtn.isVisible() && this.limpiarBtn.disabled == false) {
                                this.limpiarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+L+R':
                    {
                        if (grid.limpiarBtn) {
                            if (grid.limpiarBtn.isVisible() && grid.limpiarBtn.disabled == false) {
                                grid.limpiarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+B':
                    {
                        if (this.buscarBtn) {
                            if (this.buscarBtn.isVisible() && this.buscarBtn.disabled == false) {
                                this.buscarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+B+R':
                    {
                        if (grid.buscarBtn) {
                            if (grid.buscarBtn.isVisible() && grid.buscarBtn.disabled == false) {
                                grid.buscarBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+B+A':
                    {
                        if (this.buscarAvanzBtn) {
                            if (this.buscarAvanzBtn.isVisible() && this.buscarAvanzBtn.disabled == false) {
                                this.buscarAvanzBtn.fireEvent('click');
                            }
                        }
                    }
                    break;
                case 'Alt+H':
                    {
                        if (this.btnAyuda) {
                            if (this.btnAyuda.isVisible() && this.btnAyuda.disabled == false) {
                                this.btnAyuda.fireEvent('click');
                            }
                        }
                    }
                    break;
            }
        }
    },
    createPropertyGrid: function(params) {
        var _this = this;
        var propertyGrid = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: params.editable,
            listeners: {
                'show': function(propertyGrid) {

                    params.panel.add(propertyGrid);
                    params.panel.doLayout(true);
                }
            },
            preOperacion: function() {
                var record = _this.getSelectionModel().getSelected();
                if (record) {
                    this.llavesForaneas = Array();
                    this.llavesForaneas = _this.llavesForaneas;
                    this.idtabla = record.get('idtabla');
                    this.ar_where = _this.ar_where;
                } else {
                    throw 'Record no seleccionado'
                }
            }
        });
        this.propertyGridAtribDinamicos = propertyGrid;
    },
    crearWinBsuquedaAvanzada: function() {
        var _this = this;
        var columnasHeader = Array();
        var columnasTipo = Array();
        var arrayscombos = Array();
        var bandera = 1;
        var item1 = [];
        var item2 = [];
        var item3 = [];
        var camposJs = _this.array_columnas;
        var formColumn = new LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        for (var i = 0; i < _this.datos.columnas.length; i++) {
            var columna = _this.datos.columnas[i];
            var nam = columna.name;
            for (var j = 0; j < camposJs.length; j++) {
                if (camposJs[j].name == nam) {
                    columna.regex = (camposJs[j].regex) ? camposJs[j].regex : null;
                    columna.minLength = (camposJs[j].minLength) ? camposJs[j].minLength : null;
                    columna.maxLength = (camposJs[j].maxLength) ? camposJs[j].maxLength : null;
                }
            }
            if (columna.tipo != 'win_ubicacion' && columna.tipo != 'combustible') {
                columnasTipo.push(columna.tipo);
                if (columna.label && columna.tipo == 'date') {

                    columnasHeader.push(_this.idioma.label);
                    var obj = new Ext.form.DateField({
                        fieldLabel: columna.label,
                        name: columna.name,
                        format: 'd/m/Y'

                    });
                } else {
                    columnasHeader.push(_this.idioma.label);
                    if (columna.tipo == 'combo') {

                        arrayscombos.push(columna.name);
                        var tipoC = columna.name;
                        var propiedad_id = 'id';
                        var propiedad_descripcion = 'denominacion';
                        var propiedad_informacion = 'info';
                        var obj = new Ext.form.ComboBox({
                            fieldLabel: columna.label,
                            displayField: propiedad_descripcion,
                            valueField: columna.name,
                            hiddenName: columna.name,
                            triggerAction: 'all',
                            selectOnFocus: true,
                            id: "id" + columna.name,
                            minChars: 0,
                            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                            resizable: true,
                            listWidth: 300,
                            store: new Ext.data.Store({
                                url: _this.datos.urlControladora + 'cargarcombogrideditable',
                                autoLoad: true,
                                baseParams: {
                                    tipocombo: tipoC,
                                    nombreid: propiedad_id + columna.name,
                                    nombredenominacion: propiedad_descripcion,
                                    info: propiedad_informacion
                                },
                                reader: new Ext.data.JsonReader({
                                    id: "id" + columna.name,
                                    root: 'datos'
                                }, [
                                    {
                                        name: propiedad_id
                                    },
                                    {
                                        name: propiedad_descripcion
                                    },
                                    {
                                        name: columna.name
                                    },
                                    {
                                        name: "id" + columna.name
                                    },
                                    {
                                        name: propiedad_informacion
                                    }
                                ])
                            })
                        });
                    } else if (columna.tipo == 'numberfield') {
                        var obj = new Ext.form.NumberField({
                            fieldLabel: columna.label,
                            name: columna.name,
                            minLength: columna.minLength,
                            maxLength: columna.maxLength,
                            regex: columna.regex,
                            maskRe: columna.regex

                        });
                    } else if (columna.tipo == 'win_responsable') {
                        var obj = this.crearColEditableWinResponsable(columna, true);
                        obj.fieldLabel = columna.label;
                        obj.name = columna.name;
                        obj.minLength = columna.minLength;
                        obj.maxLength = columna.maxLength;
                        obj.regex = columna.regex;
                        obj.maskRe = columna.regex;
                        obj.emptyText = ' ';
                    }
                    else {
                        // var regExp = (columna.regex) ? new RegExp(columna.regex) : null;
                        var obj = new Ext.form.TextField({
                            fieldLabel: columna.label,
                            name: columna.name,
                            minLength: columna.minLength,
                            maxLength: columna.maxLength,
                            regex: columna.regex,
                            maskRe: columna.regex


                        });
                    }
                }
                formColumn.addComponent(obj);
                /* switch (bandera) {
                 case 1:
                 item1.push(obj);
                 bandera = 2;
                 break;
                 case 2:
                 item2.push(obj);
                 bandera = 3;
                 break;
                 case 3:
                 item3.push(obj);
                 bandera = 1;
                 break;
                 }*/
            }
        }
        /*  var form1 = new Ext.Panel({
         columnWidth: 0.33,
         labelAlign: 'top',
         layout: 'form',
         defaults: {
         anchor: '95%'
         },
         items: item1
         });
         var form2 = new Ext.Panel({
         columnWidth: 0.33,
         labelAlign: 'top',
         layout: 'form',
         defaults: {
         anchor: '95%'
         },
         items: item2
         });
         var form3 = new Ext.Panel({
         columnWidth: 0.33,
         labelAlign: 'top',
         layout: 'form',
         defaults: {
         anchor: '95%'
         },
         items: item3
         });*/

        var formP = LOG.util.UIManager.initForm({
            anchor: '100%',
            region: 'center',
            border: false,
            frame: true,
            // items: [_this.fieldD, _this.ocultoD]
            items: [formColumn]


        });
        _this.btnCancelarWinFiltrar = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelarF,
            handler: function() {
                win.close();
                if (_this.getStore().getCount() == 0) {
                    _this.getStore().load();
                }
            }

        });
        _this.btnLimpiarWinFiltrar = new Ext.Button({
            iconCls: 'limpiar',
            text: _this.idioma.lbBtnLimpiarF,
            tooltip: _this.idioma.lbTtBtnLimpiarF,
            handler: function() {
                formP.getForm().reset();
                _this.getStore().load();
            }

        });
        _this.btnAceptarWinFiltrar = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnAceptarF,
            handler: function() {
                var valores = {};
                valores['start'] = 0;
                valores['limit'] = 10;
                if (formP.getForm().isValid()) {
                    var valores = formP.getForm().getValues();
                    for (var i = 0; i < arrayscombos.length; i++) {
                        valores[arrayscombos[i]] = Ext.getCmp("id" + arrayscombos[i]).getValue();
                    }

                    _this.getStore().load({
                        params: valores,
                        callback: function() {
                            if (_this.getStore().getTotalCount() == 0) {
                                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados');
                            }
                        }
                    });
                    // win.close();
                }
                else {
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            }
        });
        var win = new Ext.Window({
            width: 600,
            closeAction: 'close',
            title: _this.idioma.lbBtnbuscarAvanz,
            resizable: false,
            modal: true,
            frame: true,
            items: formP,
            buttons: [_this.btnCancelarWinFiltrar, _this.btnLimpiarWinFiltrar, _this.btnAceptarWinFiltrar]
        });
        win.show();
    }
});
/**
 * Region(es) contenedora(s) del/los grid(s) y los atributos dinamicos
 */
Ext.aft.regNumerico.Region = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        this.items = config.items;
        this.layout = (config.layout) ? config.layout : 'border';
        this.region = (config.region) ? config.region : 'center';
        this.border = (config.border) ? config.border : false;
        Ext.aft.regNumerico.Region.superclass.constructor.apply(this, arguments);
    }
});
Ext.aft.regNumerico.Ventana = Ext.extend(Ext.Window, {
    constructor: function(config) {


        Ext.apply(this, config);
        var _this = this;
        this.datos = config.params;
        this.idioma = config.idioma;
        this.modal = true;
        this.maximized = true;
        this.layout = 'border';
        this.crearRegiones();
        this.initEventos();
        this.buttons = [
            {
                iconCls: 'cancelar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                handler: function() {
                    _this.close();
                }
            }
        ];
        Ext.aft.regNumerico.fn.gestionarBotones(this);
        Ext.aft.regNumerico.Ventana.superclass.constructor.call(this, arguments);
    },
    crearRegiones: function() {
        var _this = this;
        this.array_items_norte = new Array();
        this.array_regiones = new Array();
        this.crearRegionNorte();
        if (this.datos.tipo_interfaz == 'no_entrada') {
            this.crearRegionSur();
        }

        this.regionGlobalNorte = new Ext.aft.regNumerico.Region({
            items: _this.array_items_norte,
            region: 'center'
        });
        this.array_regiones.push(this.regionGlobalNorte);
        if (this.datos.tipo_interfaz == 'no_entrada') {
            //this.crearCmpGestAtributosDinamicos();
        }
        this.items = this.array_regiones;
        this.initHotKeys();
    },
    crearRegionNorte: function() {

        var _this = this;
        var array_items = new Array();
        this.idRegNumNorteSeleccionado = null;
        this.funciones = Ext.aft.regNumerico.fn;
        //Grid norte
        var metodo = "";
        if (this.datos.tipo_interfaz == 'no_entrada') {
            metodo = 'cargarseriesdisponibles';
        } else if (this.datos.tipo_interfaz == 'inventario_total') {
            metodo = 'getregnumericosinventariototal';
        } else {
            metodo = 'cargarseriesdemovimiento';
        }

        var editable = false;
        if ((this.datos.idestado == 1 || this.datos.idestado == '1') && this.datos.tipo_interfaz != 'no_entrada') {
            editable = true;
        }
        if (_this.datos.inventario) {
            editable = true;
        }

        this.gridNorte = new Ext.aft.regNumerico.grid({
            idioma: _this.idioma,
            autoCargar: (_this.datos.tipo_interfaz != 'no_entrada'),
            datos: _this.datos,
            _parent: _this._parent,
            region: 'center',
            scope: _this,
            editable: editable,
            url: _this.datos.urlControladora + metodo
        });
        if (_this.gridNorte.getColumnModel().getColumnById('importe')) {
            _this.gridNorte.getColumnModel().setHidden(
                    _this.gridNorte.getColumnModel().getIndexById('importe'), true
                    );
        }

        if (_this.gridNorte.getColumnModel().getColumnById('usufructo')) {
            _this.gridNorte.getColumnModel().setHidden(
                    _this.gridNorte.getColumnModel().getIndexById('usufructo'), true
                    );
        }

        this.funciones.definirComportamientoBotonesNorte(_this);
        // Componente de atributos dinamicos que tendra el grid norte
        this.atibutosDinamicosNorte = new Ext.Panel({
            region: 'east',
            width: 300,
            layout: 'fit',
            border: true,
            collapsible: true,
            split: true,
            collapseMode: 'mini',
            collapsed: true
        });
        this.gridNorte.createPropertyGrid({
            panel: this.atibutosDinamicosNorte,
            editable: editable
        });
        array_items.push(this.gridNorte, this.atibutosDinamicosNorte);
        var propiedades = {};
        if (this.datos.tipo_interfaz == 'entrada') {
            propiedades = {
                items: array_items,
                region: 'center',
                height: 300,
                tbar: _this.funciones.getBotonesNorte(_this.gridNorte),
                id: 'idregionentrada'
            };
        } else {
            propiedades = {
                items: array_items,
                region: 'north',
                height: 300,
                // collapsible: true,
                split: true,
                collapseMode: 'mini',
                tbar: ['->', _this.gridNorte.btnAyuda],
                id: 'idregionentrada'
            };
        }
        propiedades.scope = this;
        this.regionNorte = new Ext.aft.regNumerico.Region(propiedades);
        this.array_items_norte.push(this.regionNorte);
    },
    crearRegionSur: function() {
        var _this = this;
        var array_items = new Array();
        this.idRegNumSurSeleccionado = null;
        var editable = false;
        if (this.datos.idestado == 1 || this.datos.idestado == '1') {
            if (this.datos.tipo_interfaz == 'no_entrada') {
                editable = true;
            }
        }

        this.gridSur = new Ext.aft.regNumerico.grid({
            region: 'center',
            idioma: _this.idioma,
            autoCargar: true,
            datos: _this.datos,
            scope: _this,
            _parent: _this._parent,
            editable: editable,
            url: _this.datos.urlControladora + 'cargarseriesdemovimiento'
        });
        this.funciones.definirComportamientoBotonesSur(_this);
        // Componente de atributos dinamicos que tendra el grid del sur
        this.atibutosDinamicosSur = new Ext.Panel({
            region: 'east',
            width: 300,
            layout: 'fit',
            border: true,
            collapsible: true,
            split: true,
            collapseMode: 'mini',
            collapsed: true
        });
        this.gridSur.createPropertyGrid({
            panel: this.atibutosDinamicosSur,
            editable: editable
        });
        array_items.push(this.gridSur, this.atibutosDinamicosSur);
        var btns_salida = (this.datos.tipo_interfaz == 'no_entrada') ? _this.funciones.getBotonesSur(_this.gridSur) : null;
        this.regionSur = new Ext.aft.regNumerico.Region({
            items: array_items,
            region: 'center',
            tbar: btns_salida,
            id: 'idregionsalida'
        });
        this.array_items_norte.push(this.regionSur);
    },
    crearCmpGestAtributosDinamicos: function() {
        this.regionGlobalSur = new Ext.aft.regNumerico.Region({
            region: 'south',
            height: 100,
            layout: 'fit',
            border: true,
            collapsible: true,
            collapsed: true,
            collapseMode: 'mini',
            split: true
        });
        this.array_regiones.push(this.regionGlobalSur);
    },
    initHotKeys: function() {
        var _this = this;
        var grid = (this.datos.tipo_interfaz == 'entrada') ? _this.gridNorte : _this.gridSur;
        var tempHotKeysDocument = [];
        function callkeydownhandler(evnt) {
            var ev = (evnt) ? evnt : event;
            var code = (ev.which) ? ev.which : event.keyCode;
            var busquedaAvanzada = '18|66|65'; // Alt|b|a
            var busquedaNormal = '18|66'; // Alt|b

            var limpiarGridSur = '18|76|82'; //Alt|L|R 

            var buscarGridSur = '18|66|82'; //Alt|B|R 

            if (code == 18) { // Alt
                tempHotKeysDocument = [18];
            } else if (code == 17) { //Ctrl
                tempHotKeysDocument = [17];
            } else {
                tempHotKeysDocument.push(code);
                if (tempHotKeysDocument.length == 3) {
                    if (tempHotKeysDocument.join('|') == busquedaAvanzada) {
                        grid.ejecutaAccion('Alt+B+A');
                    }
                    if (tempHotKeysDocument.join('|') == limpiarGridSur) {
                        grid.ejecutaAccion('Alt+L+R', grid);
                    }
                    if (tempHotKeysDocument.join('|') == buscarGridSur) {
                        grid.ejecutaAccion('Alt+B+R', grid);
                    }

                } else if (tempHotKeysDocument.length == 2) {
                    if (tempHotKeysDocument.join('|') == busquedaNormal) {
                        grid.ejecutaAccion('Alt+B');
                    }
                }

            }
        }

        if (window.document.addEventListener) {
            window.document.addEventListener("keydown", callkeydownhandler, false);
        } else {
            window.document.attachEvent("onkeydown", callkeydownhandler);
        }
        document.onkeyup = function(e) {
            if (e.altKey) {
                if (e.which == Ext.EventObject.I) {
                    grid.ejecutaAccion('Alt+I');
                }
                if (e.which == Ext.EventObject.G) {
                    grid.ejecutaAccion('Alt+G');
                }
                if (e.which == Ext.EventObject.L) {
                    grid.ejecutaAccion('Alt+L');
                }

                if (e.which == Ext.EventObject.H) {
                    grid.ejecutaAccion('Alt+H');
                }

            }
            if (e.which == Ext.EventObject.DELETE) {
                grid.ejecutaAccion('DEL');
            }
        }


    },
    initEventos: function() {
        var _this = this;
        if (this.datos.tipo_interfaz == 'no_entrada') {
            this.gridSur.getStore().on('load', function(store, rd) {
                //_this.gridSur.propertyGridAtribDinamicos.setContenido(); no poner esto porque se tufa
                _this.atibutosDinamicosSur.collapse();
                _this.idRegNumSurSeleccionado = null;
                _this.gridNorte.getStore().load();
            });
            this.gridNorte.getStore().on('beforeLoad', function(st, options) {
                if (_this.gridSur.getStore().getCount() > 0) {
                    st.baseParams.idregnumericos_quitar = Ext.encode(_this.gridSur.getStore().reader.jsonData.idregnumericos);
                }
            });
            this.gridNorte.getStore().on('load', function() {
                _this.gridNorte.getStore().baseParams.idregnumericos_quitar = new Array();
            });
            this.gridSur.getSelectionModel().on('rowdeselect', function() {
                _this.gridSur.propertyGridAtribDinamicos.setContenido();
                window.setTimeout(function() {
                    if (!_this.gridNorte.getSelectionModel().hasSelection()) {
                        _this.atibutosDinamicosSur.collapse();
                    }
                }, 20);
                _this.idRegNumSurSeleccionado = null;
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
        }

        this.gridNorte.getSelectionModel().on('rowdeselect', function() {
            _this.gridNorte.propertyGridAtribDinamicos.setContenido();
            window.setTimeout(function() {
                if (!_this.gridNorte.getSelectionModel().hasSelection()) {
                    _this.atibutosDinamicosNorte.collapse();
                }
            }, 20);
            _this.idRegNumNorteSeleccionado = null;
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        this.gridNorte.getSelectionModel().on('rowselect', function() {
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        this.gridNorte.on('afteredit', function() {
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        this.gridNorte.getStore().on('load', function() {
            Ext.getBody().unmask();
            //_this.gridNorte.propertyGridAtribDinamicos.setContenido(); no poner esto porque se tufa
            _this.atibutosDinamicosNorte.collapse();
            _this.idRegNumNorteSeleccionado = null;
            Ext.aft.regNumerico.fn.gestionarBotones(_this);
        });
        if (this.gridSur) {
            this.gridSur.getSelectionModel().on('rowdeselect', function() {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.getSelectionModel().on('rowselect', function() {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.on('afteredit', function() {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.getStore().on('load', function() {
                Ext.aft.regNumerico.fn.gestionarBotones(_this);
            });
            this.gridSur.on({
                'rowclick': function(grid, rowIndex, e) {
                    if (grid.getSelectionModel().getCount() > 0) {

                        if (_this.idRegNumSurSeleccionado != grid.getSelectionModel().getSelected().get('idregnumerico')) {
                            var record = grid.getSelectionModel().getSelected();
                            if (_this.datos.arridtablas.replace(/[\,\-1]/ig, '').length > 0) {
                                var record = grid.getSelectionModel().getSelected();
                                if (record) {
                                    grid.llavesForaneas = Array();
                                    grid.llavesForaneas[0] = {
                                        key: 'idregnumerico',
                                        value: record.get('idregnumerico')
                                    };
                                    grid.llavesForaneas[1] = {
                                        key: 'idmovregnumerico',
                                        value: record.get('idmovregnumerico')
                                    };
                                    grid.ar_where = 'idregnumerico = ' + record.get('idregnumerico') + ' and idmovregnumerico = ' + record.get('idmovregnumerico');
                                } else {
                                    throw 'Record no seleccionado';
                                }
                                grid.propertyGridAtribDinamicos.setContenido(_this.datos.arridtablas);
                                _this.atibutosDinamicosSur.expand();
                            } else {
                                _this.atibutosDinamicosSur.collapse();
                            }
                            _this.idRegNumSurSeleccionado = record.get('idregnumerico');
                        }
                    }
                }
            });
        }

        this.gridNorte.on({
            'rowclick': function(grid, rowIndex, e) {
                if (grid.getSelectionModel().getCount() > 0) {

                    if (_this.idRegNumNorteSeleccionado != grid.getSelectionModel().getSelected().get('idregnumerico')) {

                        var record = grid.getSelectionModel().getSelected();
                        if (_this.datos.arridtablas.replace(/[\,\-1]/ig, '').length > 0) {

                            if (this.datos.tipo_interfaz == 'no_entrada') {
                                Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                                Ext.Ajax.request({
                                    method: 'POST',
                                    url: _this.datos.urlControladora + 'getultimoidmov',
                                    params: {
                                        idregnumerico: record.get('idregnumerico')
                                    },
                                    callback: function(options, success, response) {
                                        Ext.getBody().unmask();
                                        var rd = Ext.decode(response.responseText);
                                        grid.llavesForaneas = Array();
                                        grid.llavesForaneas[0] = {
                                            key: 'idregnumerico',
                                            value: record.get('idregnumerico')
                                        };
                                        grid.llavesForaneas[1] = {
                                            key: 'idmovregnumerico',
                                            value: record.get('idmovregnumerico')
                                        };
                                        grid.ar_where = 'idregnumerico = ' + record.get('idregnumerico') + ' and idmovregnumerico = ' + rd.idmovregnumerico;
                                        grid.propertyGridAtribDinamicos.setContenido(_this.datos.arridtablas);
                                        _this.atibutosDinamicosNorte.expand();
                                    }
                                });
                            } else {
                                var record = grid.getSelectionModel().getSelected();
                                if (record && record.get('idregnumerico') && record.get('idmovregnumerico')) {

                                    grid.llavesForaneas = Array();
                                    grid.llavesForaneas[0] = {
                                        key: 'idregnumerico',
                                        value: record.get('idregnumerico')
                                    };
                                    grid.llavesForaneas[1] = {
                                        key: 'idmovregnumerico',
                                        value: record.get('idmovregnumerico')
                                    };
                                    grid.ar_where = 'idregnumerico = ' + record.get('idregnumerico');
                                } else {
                                    throw 'Record no seleccionado';
                                }
                                grid.propertyGridAtribDinamicos.setContenido(_this.datos.arridtablas);
                                _this.atibutosDinamicosNorte.expand();
                            }
                        } else {
                            _this.atibutosDinamicosNorte.collapse();
                        }
                        _this.idRegNumNorteSeleccionado = record.get('idregnumerico');
                    }
                }
            }
        });
    },
    getPropertyGridAtributosDinamicos: function() {

    }
});


Ext.aft.regNumerico.BusquedaEstatica = Ext.extend(LOG.util.Window, {
    grid: undefined,
    arearesp: undefined,
    idarearesp: undefined,
    cerrarAceptar: false,
    heitghInicial: 0,    
    arrayAlturas: Array(),
    tipo: 1,
    constructor: function(config) {
        var _this = this;
        this.idioma = config.idioma;
        this.title = this.idioma.lbBtnbuscarAvanz;
        this.tipo = config.tipo;
        this.resizable = true;
        //this.width = 700;
        this.scope = config.scope;
        this.x = 50;
        this.y = 50;
        // this.model = config.model;
        this.plugins = new LOG.util.List();
        this.corePlugins = {};
        this.closeAction = 'close';
        Ext.aft.regNumerico.BusquedaEstatica.superclass.constructor.call(this, config);
        this.addEvents('clean');
        this.addEvents('find');
        this.listaBotones.getItem(2).disable();
        this.setWidth(900);
        this.on({
            'resize': function(win, width, height) {

                if (_this.getHeight() != _this.heitghInicial && _this.heitghInicial > 0) {
                    Ext.each(_this.tabpanel.items.items, function(o) {
                        o.setHeight(_this.getHeight() - 110);
                    });
                    //_this.panelDatosG.setHeight(_this.getHeight() - 115);
                    _this.panelGeneral.doLayout();
                }
            },
            'show': function(cmp) {
                // _this.codigo.focus(false, 500);
                // _this.codigoReg.focus(false, 500);
                _this.tabpanel.setActiveTab(1);
                _this.tabpanel.setActiveTab(0);
            }
        })
        this.documentKeyMap = new Ext.KeyMap(document,
                [
                    {
                        key: Ext.EventObject.ENTER,
                        fn: function() {
                            if (_this.btnAvaible) {
                                _this.listaBotones.getItem(2).handler(_this.listaBotones.getItem(2));
                            }
                        }
                    }

                ]);

    },
    initComponent: function() {
        var _this = this;
        this.listaBotones.deleteAll();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            text: _this.idioma.btnCerrar,
            handler: function() {
                this.scope.hide();
            },
            scope: this
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function() {
                _this.LimpiarVRegNume();


            }
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonBuscar({
            disabled: false,
            handler: function() {
                _this.buscar();
            }
        })));

        Ext.aft.regNumerico.BusquedaEstatica.superclass.initComponent.call(this);
        //Añadiendo vistas        
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center',
            layout: 'card',
            activeItem: 0,
            items: [_this.camposBusquedaVistaRegNum()]
        });
        //Añadiendo plugins
        this.addPlugins();
        this.add(this.panelGeneral);
    },
    buscar: function() {
        var _this = this;
        var form = _this.formDatosMedioR.getForm();
        var arrayParametros = new Array();

        form.items.each(function(field, pos) {
            if (field.getValue()) {
                arrayParametros[pos] = {field: field.name, value: field.getValue()};
            }
        });
        _this.scope.store.on({
            'beforeload': function(st, obj) {
                obj.params.filter = Ext.encode(arrayParametros);
            }
        });
        _this.scope.store.load();
        _this.hide();
    },
    /**
     * Campos estáticos de la búsqueda para la vista de los regnumericos
     * **/
    camposBusquedaVistaRegNum: function() {
        var _this = this;        
        _this.initPlugin();        
        this.camposGenerales = LOG.aft.RegOperativo.Campos;
        this.generalesModif = Array();
        for (var prop in this.camposGenerales) {
                var cmp = this.camposGenerales[prop];
                if(cmp.nameplugin == 'Datos generales')
                    this.generalesModif.push(cmp);
        }
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var numerics = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        var array = Array();
        this.tabpanel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true
        });
        _this.formDatosMedioR = LOG.util.UIManager.initForm({
            items: [_this.tabpanel]
        });
        _this.crearCamposPlugins(_this.generalesModif, _this.scope.array_pNivel);
        return _this.formDatosMedioR;
    },
    /**
     * Campos dinámicos de la búsqueda para la vista de los regnumericos
     * **/
    crearCamposPlugins: function(campos, columnas) {
        var _this = this;
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var columnFechas = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        var arrCampos = _this.prepararCamposDin(campos, columnas);
        if (arrCampos.length > 0) {
            var title = '';

            for (var prop in arrCampos) {
                var cmp = arrCampos[prop];
                title = cmp.nameplugin;
                break;
            }
            var panelPlugin = new LOG.util.Panel({
                frame: true,
                region: 'center',
                title: title,
                height: 512,
                autoScroll: true,
                items: [cls/*, columnFechas*/]
            });
            var camposnull = Array();
            var fechas = Array();
            for (var prop in arrCampos) {
                var cmp = arrCampos[prop];
                if (cmp.name && cmp.xtype != 'datefield')
                    camposnull.push([cmp.fieldLabel, cmp.name]);
                if (cmp.xtype == 'datefield') {
                    fechas.push(cmp);
                } else {
                    _this.definirComponente(cmp, cls);
                }

            }

            var storeCampos = new Ext.data.SimpleStore({
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'id'
                    }
                ]
            });
            storeCampos.loadData(camposnull);
            var comboCampos = new LOG.util.LovCombo({
                fieldLabel: this.idioma.labelCamposNull,
                name: 'camposnullPlg',
                width: 360,
                nameplugin: title,
                store: storeCampos,
                resizable: true,
                minListWidth: 300,
                emptyText: this.idioma.lbSeleccione,
                displayField: 'denominacion',
                valueField: 'id',
                listeners: {
                    'select': function(cb, e) {
                        if (e.data.checked && cb.getValue()) {
                            _this.findById(e.data.id).reset();
                            _this.findById(e.data.id).disable();
                            _this.condicionButtons(true)
                        } else {
                            _this.model.listaCamposNull.each(function(o, p) {
                                if (o.valor == e.data.id && o.name == cb.nameplugin)
                                    this.delete(p)
                            });
                            if (!e.data.checked && !cb.getValue())
                                _this.condicionButtons(false)
                        }
                    },
                    'keyup': function(cb, e) {
                        if (e.getKey() != 9 && e.getKey() != 13) {
                            if (this.isDirty()) {
                                _this.listaBotones.getItem(2).disable();
                            }
                        }
                    }
                }
            });
            _this.elementosFechas(fechas, columnFechas);
            panelPlugin.add(cls);
            panelPlugin.doLayout();
            _this.tabpanel.add(panelPlugin);
            _this.tabpanel.doLayout();
            _this.arrayAlturas.push(250);
        }

    },
    /**
     * Auxiliar para rango de los elementos de fechas
     * **/
    elementosFechas: function(array, fechas) {
        var _this = this;
        Ext.each(array, function(o) {
            var columns = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            var minvalor = new Ext.form.DateField({
                fieldLabel: _this.idioma.labelMinFecha,
                name: 'min_' + o.name,
                allowBlank: true,
                vtype: 'daterange',
                format: 'm/d/Y',
                editable: false,
                validarEnFormBasico: true,
                listeners: {
                    'select': function(campo) {
                        maxvalor.setMinValue(campo.getValue());
                        _this.condicionButtons();
                    }
                }
            });
            columns.addComponent(minvalor);
            var maxvalor = new Ext.form.DateField({
                name: 'max_' + o.name,
                fieldLabel: _this.idioma.labelMaxFech,
                startDateField: minvalor,
                editable: false,
                format: 'm/d/Y',
                vtype: 'daterange',
                validarEnFormBasico: true,
                allowBlank: true,
                listeners: {
                    select: function(campo) {
                        minvalor.setMaxValue(campo.getValue());
                        _this.condicionButtons();
                    }
                }
            });
            columns.addComponent(maxvalor);
            var fieldValor = new Ext.form.FieldSet({
                title: o.fieldLabel,
                items: [columns]
            });
            fechas.addComponent(fieldValor);

        });
    },
    /**
     * Auxiliar para crear campos de los datos generales y plugins
     * **/
    definirComponente: function(cmp, cls) {
        var _this = this;
        switch (cmp.xtype) {
            case 'textfield':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    // id: cmp.name,
                    enableKeyEvents: true,
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'keyup': function(cb, e) {
                        _this.condicionButtons()

                    }
                });
                cls.addComponent(field)
                break;
            case 'numberfield':
                var field = new Ext.form.NumberField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    // id: cmp.name,
                    enableKeyEvents: true,
                    fieldLabel: cmp.fieldLabel,
                    maxLength: 30,
                    regexText: _this.idioma.ttnanTextEntero
                });
                field.on({
                    'keyup': function(cb, e) {
                        _this.condicionButtons()

                    }
                });
                cls.addComponent(field)
                break;
            case 'combobox':
                if (cmp.nameInRecord != 'idarearesp') {
                    var arrURL = cmp.url.split('/');
                    if (arrURL.length == 1) {
                        cmp.url = '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/' + arrURL[0];
                    }
                    var comboAux = new LOG.util.ComboBox(cmp);
                    var field = new Ext.form.ComboBox(cmp);
                    Ext.apply(field, {
                        allowBlank: true,
                        // id: cmp.valorEnviar,
                        name: cmp.valorEnviar,
                        resizable: true,
                        minListWidth: 300,
                        queryParam: 'criterio',
                        mode: 'remote',
                        enableKeyEvents: true,
                        emptyText: this.idioma.lbSeleccione,
                        url: comboAux.url,
                        store: comboAux.store,
                        fieldLabel: cmp.fieldLabel
                    });
                    if (cmp.nameInRecord == 'denomcolorprim') {
                        field.store.baseParams.colorPrimario = 1;
                    }
                }
                if (cmp.nameInRecord == 'idarearesp') {
                    var field = new Ext.aft.regNumerico.ComboDepositos({
                        allowBlank: true,
                        fieldLabel: cmp.fieldLabel,
                        valueField: cmp.valueField,
                        name: cmp.valorEnviar,
                        //  id: cmp.valorEnviar,
                        autoCreate: true,
                        typeAhead: true,
                        triggerAction: 'all',
                        resizable: true,
                        enableKeyEvents: true,
                        forceSelection: true,
                        idioma: _this.idioma,
                        width: 216,
                        editable: false,
                        emptyText: _this.idioma.lbCbVacio
                    });
                }
                field.on({
                    'select': function(cb, re) {
                        _this.arearesp = re.data.deposito;
                        _this.idarearesp = re.data.iddeposito;
                        //_this.findById('idubicacion').enable();
                        _this.condicionButtons()
                    },
                    'keyup': function(cb, e) {
                        if (e.getKey() != 9 && e.getKey() != 13) {
                            if (this.isDirty()) {
                                _this.listaBotones.getItem(2).disable();
                            }
                        }
                    }
                });
                cls.addComponent(field)
                break;
            case 'datefield':
                var field = new Ext.form.DateField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    //id: cmp.name,
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'select': function(cb, e) {
                        _this.condicionButtons()
                    }
                });
                cls.addComponent(field)
                break;

            case 'win_responsable':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    idresponsable: undefined,
                    //id: 'idresponsable',
                    name: 'idresponsable',
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'focus': function(field) {
                        Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                        if (!_this.Responsable) {
                            var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                region: 'center',
                                // id: 'panelBusPer',
                                singleSelect: true,
                                identidad: perfil.idestructuracomun,
                                showBtnAdicionar: true,
                                modulo: 'LOGISTICA',
                                showBtnAdicionar: false,
                                        showBtnAyuda: false
                            });
                            var btnAceptar = new Ext.Button({
                                text: 'Aceptar',
                                iconCls: 'aceptar',
                                listeners: {
                                    'click': function() {
                                        if (panelBusPer.getSeleccion()) {
                                            field.idresponsable = panelBusPer.getSeleccion().get('idpersona');
                                            var nombre = panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') +
                                                    ' ' + panelBusPer.getSeleccion().get('sapel');
                                            field.setValue(nombre);
                                            field.fireEvent('blur');
                                        }
                                        _this.condicionButtons();
                                        _this.Responsable.hide();
                                    }
                                }
                            });

                            var btnCancelar = new Ext.Button({
                                text: 'Cancelar',
                                iconCls: 'cancelar',
                                listeners: {
                                    'click': function() {
                                        _this.Responsable.hide();
                                    }
                                }
                            });
                            _this.Responsable = new Ext.Window({
                                title: 'Personas',
                                width: 600,
                                constrain: true,
                                height: 400,
                                resizable: false,
                                modal: true,
                                closeAction: 'close',
                                layout: 'border',
                                items: [panelBusPer],
                                buttons: [btnCancelar, btnAceptar],
                                listeners: {
                                    'beforeshow': function() {
                                        Ext.getBody().unmask();
                                    }
                                }
                            });
                        }
                        _this.Responsable.show();
                    }
                });
                cls.addComponent(field)
                break;

            case 'win_ubicacion':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    disabled: true,
                    idubicacion: undefined,
                    //id: 'idubicacion',
                    name: 'idubicacion',
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'focus': function(field) {
                        Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                        var objParams = new Object();
                        objParams.tipoestructura = 2;
                        objParams.arearesp = _this.arearesp;
                        objParams.idubicacion = _this.idarearesp;
                        objParams.doAction = function(obj_nodoSeleccionado) {
                            if (obj_nodoSeleccionado.getDepth() != 0) {
                                _this.Ubicacion.btnAceptar.enable()
                            } else {
                                _this.Ubicacion.btnAceptar.disable()
                            }
                            field.idubicacion = obj_nodoSeleccionado.id;
                            field.setValue(obj_nodoSeleccionado.text);
                            field.fireEvent('blur');
                            _this.Ubicacion.hide();
                        }
                        objParams.listeners = {
                            'beforeshow': function() {
                                _this.Ubicacion.idioma.lbMsgNoEstructuras = _this.idioma.lbMsgNoEstructuras;
                                _this.Ubicacion.tpEstructurae.on({
                                    'click': function(node, e) {
                                        _this.Ubicacion.btnAceptar.setDisabled(node.getDepth() == 0)
                                    }
                                });
                                Ext.getBody().unmask(_this.Ubicacion);
                                _this.Ubicacion.btnAceptar.disable()
                            }
                        }

                        _this.Ubicacion = new Ext.Log.Treestructuraubicacion.ventana(objParams);
                    }
                });
                cls.addComponent(field)
                break;
        }
    },
    /**
     * Auxiliar para preparar los campos dinámicos a crear
     * **/
    prepararCamposDin: function(obj1, obj2) {
        var array = Array();
        for (var prop1 in obj1) {
            Ext.each(obj2, function(prop2) {
                if (obj1[prop1].dataIndex == prop2.dataIndex) {
                    array.push(obj1[prop1]);
                }
            });
        }
        return array;
    },
    /**
     * Auxiliares para limpiar las vistas
     **/
    LimpiarVRegNume: function(cerrar) {
        var _this = this;

        var form = _this.formDatosMedioR.getForm();
        form.items.each(function(field) {
            if (field.isFormField) {
                field.reset();
                field.enable();
                field.originalValue = field.getValue();
            }
        });
        /*_this.model.limpiarLista();
         _this.model.reset();*/
        //_this.findById('idubicacion').disable();
        /* var param = {};
         param['idmarca'] = null;
         _this.modeloReg.store.load({params: param});*/
        _this.listaBotones.getItem(2).disable();
        _this.scope.store.on({
            'beforeload': function(st, obj) {
                obj.params.filter = [];
            }
        });
        _this.scope.store.load();
        if (!cerrar)
            _this.fireEvent('clean');
    },
    LimpiarTabPanel: function() {
        var _this = this;
        _this.tabpanel.items.each(function(o, p) {
            if (p > 1)
                _this.tabpanel.remove(o);
        });
    },
    /**
     * Auxiliar para validar boton buscar
     **/
    condicionButtons: function(check) {
        var _this = this;
        var form = _this.formDatosMedioR.getForm();

        if (check && form.isValid() && form.isDirty()) {
            _this.btnAvaible = true;
            _this.listaBotones.getItem(2).enable();
        } else {
            if (!check && form.isValid() && form.isDirty()) {
                _this.listaBotones.getItem(2).enable();
                _this.btnAvaible = true;
            } else {
                _this.listaBotones.getItem(2).disable();
                _this.btnAvaible = false;
            }

        }
    },
    /**
     * Tratamiento de plugins
     **/
    addPlugins: function() {
        for (var i = 0; i < arrCampos.length; i++) {
            this.attatchPlugin(arrCampos[i]);
        }
        this.arrayColumns = Array();

        for (var i = 0; i < arrElementosGridCodigoNew.length; i++) {
            this.arrayColumns.push(arrElementosGridCodigoNew[i]);
        }
    },
    attatchPlugin: function(plugin) {
        this.plugins.add(plugin);
    },
    initPlugin: function() {
        var _this = this;
        _this.corePlugins['campos'] = {};

        _this.plugins.each(function(plugin, pos) {
            plugin.init(_this.corePlugins);
            if (!_this.isEmpty(_this.corePlugins.campos)) {                
                _this.crearCamposPlugins(_this.corePlugins.campos, _this.scope.array_pNivel);//_this.array_pNivel
            }
        });
    },
    isEmpty: function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

});

Ext.aft.regNumerico.ComboDepositos = Ext.extend(LOG.util.ComboBox, {
    dirUrl: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/',
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        _this.url = _this.dirUrl + 'cargarareas';
        _this.valueField = 'iddeposito';
        _this.displayField = 'deposito';
        _this.name = 'idestructuracomun';
        _this.allowBlank = true;
        //_this.fieldLabel = config.idioma.lbCbDepositoBuscar;

        Ext.aft.regNumerico.ComboDepositos.superclass.constructor.call(this, config);
    }
});