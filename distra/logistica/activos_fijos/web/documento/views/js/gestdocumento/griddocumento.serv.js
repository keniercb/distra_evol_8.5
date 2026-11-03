Ext.ns('Ext.aft');

Ext.aft.getGridDocumentoServs = Ext.extend(Ext.grid.GridPanel, {
    /*
     * identificador del area donde se esta trabajando
     */
    idarearesp: null,
    /*
     * identificador del padre del arear donde se esta trabajando
     */
    idestructurapadre: null,
    /*
     * tipo de area seleccionada, "Entidad, Area de responsabilidad, Otra"
     */
    tipo_area_seleccionada: 'entidad',
    /*
     * Parametros que por defecto se filtraran en el grid.
     */
    validar_usuario: false,
    /*
     * parametro para que el store cargue solo
     * los documentos que son el usuario autenticado
     * que pertenecen al usuario auntenticado
     */
    filtros: {},
    constructor: function(config) {
        var _this = this;
        this.region = 'center';
        this.border = false;
        this.bodyBorder = false;
        _this.arregloOperaciones = Array();
        _this.arregloDocumentosAFT = Array();
        _this.arregloUsuarios = Array();
        Ext.apply(this, config);
        this._initComponenet();
        Ext.aft.getGridDocumentoServs.superclass.constructor.apply(this, arguments);
    },
    _initComponenet: function() {
        var _this = this;
        this.loadMask = true;
        _this.getOperacionesEntrada();
        function renderGetuser(value) {
            if (value != null) {
                for (var i = 0; i < _this.arregloUsuarios.length; i++) {
                    if (_this.arregloUsuarios[i].idusuario == value) {
                        return _this.arregloUsuarios[i].denominacion;
                    }
                }
                if (perfil)
                    return perfil.usuario;
            }
        }

        _this.comboAreaResp = new LOG.aft.documento.ComboDepositos({
            allowBlank: true,
            autoCreate: true,
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            idioma: _this.idioma,
            anchor: '95%',
            emptyText: _this.idioma.lbCbVacio
        });
        _this.cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'N.\xb0',
                width: 30
            }), {
                header: this.idioma.hdNroDoc,
                width: 90,
                align: 'right',
                dataIndex: 'numeroref'
            }, {
                header: this.idioma.hdTipoDoc,
                width: 120,
                dataIndex: 'iddoc',
                renderer: function(value) {
                    var i = 0;
                    while (i < _this.arregloDocumentosAFT.length) {
                        if (_this.arregloDocumentosAFT[i].iddoc == value) {
                            return _this.arregloDocumentosAFT[i].denominacion;
                        }
                        i += 1;
                    }
                }
            }, {
                header: this.idioma.hdOperacion,
                width: 120,
                dataIndex: 'idoperacion',
                id: 'expandirDocserv',
                renderer: function(value) {
                    var i = 0;
                    while (i < _this.arregloOperaciones.length) {
                        if (_this.arregloOperaciones[i].idoperacion == value) {
                            return _this.arregloOperaciones[i].denominacion;
                        }
                        i += 1;
                    }
                }
            }, {
                header: this.idioma.lbEntidad,
                width: 120,
                align: 'left',
                dataIndex: 'estructura'
            }, {
                header: this.idioma.lbCmAreaResp,
                width: 150,
                align: 'left',
                dataIndex: 'arearesp'
            }, {
                header: this.idioma.hdYear,
                width: 60,
                align: 'center',
                dataIndex: 'anno'
            }, {
                header: this.idioma.hdEstado,
                width: 60,
                dataIndex: 'estado',
                id: 'cmestado',
                renderer: function(v) {
                    return LOG.lb.documento.Estado[v];
                }
            }, {
                header: this.idioma.hdMedios,
                width: 85,
                align: 'right',
                dataIndex: 'cant_medios'
            }, {
                header: this.idioma.hdFecha,
                width: 75,
                align: 'center',
                dataIndex: 'fechacontable'
            }, {
                header: this.idioma.hdCreador,
                width: 110,
                dataIndex: 'idusuario',
                renderer: function(value) {
                    var i = 0;
                    while (i < _this.arregloUsuarios.length) {
                        if (_this.arregloUsuarios[i].idusuario == value) {
                            return _this.arregloUsuarios[i].nombreusuario;
                        }
                        i += 1;
                    }
                }
            }, {
                header: this.idioma.hdAprobador,
                width: 110,
                id: 'cmaprobadopor',
                dataIndex: 'aprobadopor',
                renderer: function(value) {
                    var i = 0;
                    while (i < _this.arregloUsuarios.length) {
                        if (_this.arregloUsuarios[i].idusuario == value) {
                            return _this.arregloUsuarios[i].denominacion;
                        }
                        i += 1;
                    }
                }
            }
        ]);
        this.autoExpandColumn = 'expandirDocserv';
        if (_this.columnasOcultar.length > 0) {
            for (var i = 0; i < _this.columnasOcultar.length; i++) {
                _this.cm.getColumnById(_this.columnasOcultar[i]).hidden = true;
                _this.cm.getColumnById(_this.columnasOcultar[i]).hideable = false;
            }
        }
        _this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        _this.store = new Ext.data.GroupingStore({
            sortInfo: {field: 'nrodoc', direction: "ASC"},
            groupField: 'iddoc',
            // autoLoad:true,
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/cargardocumentos',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'iddocumento'
                    },
                    {
                        name: 'icondoc'
                    },
                    {
                        name: 'nrodoc'
                    },
                    {
                        name: 'numeroref'
                    },
                    {
                        name: 'tipodoc'
                    },
                    {
                        name: 'iddoc'
                    },
                    {
                        name: 'operacion'
                    },
                    {
                        name: 'idoperacion'
                    },
                    {
                        name: 'anno'
                    },
                    {
                        name: 'estado'
                    },
                    {
                        name: 'cant_medios'
                    },
                    {
                        name: 'fechacontable'
                    },
                    {
                        name: 'idusuario'
                    },
                    {
                        name: 'idusuario'
                    },
                    {
                        name: 'idcreadopor'
                    },
                    {
                        name: 'aprobadopor'
                    },
                    {
                        name: 'idaprobadopor'
                    },
                    {
                        name: 'observaciones'
                    },
                    {
                        name: 'idcentrocosto'
                    },
                    {
                        name: 'idestructuradocgenerado'
                    },
                    {
                        name: 'idcentrocostodocgenerado'
                    },
                    {
                        name: 'denomestructuradocgenerado'
                    },
                    {
                        name: 'tipo_interfaz'
                    },
                    {
                        name: 'entidad'
                    },
                    {
                        name: 'direccion'
                    },
                    {
                        name: 'entidadAlquiler'
                    },
                    {
                        name: 'direccionAlquiler'
                    },
                    {
                        name: 'fechainicio'
                    },
                    {
                        name: 'fechafin'
                    },
                    {
                        name: 'nrocontrato'
                    },
                    {
                        name: 'codigooperacion'
                    },
                    {
                        name: 'idnaturalezasInventario'
                    },
                    {
                        name: 'idpersonasIventarioParcial'
                    },
                    {
                        name: 'mediosInventario'
                    },
                    {
                        name: 'naturalezasInventario'
                    },
                    {
                        name: 'personasInventario'
                    },
                    {
                        name: 'idmediosInventario'
                    },
                    {
                        name: 'mensualInventario'
                    },
                    {
                        name: 'iddocinventario'
                    },
                    {
                        name: 'idareasInventario'
                    },
                    {
                        name: 'idespecialidadesInventario'
                    },
                    {
                        name: 'areasInventario'
                    },
                    {
                        name: 'especialidadesInventario'
                    },
                    {
                        name: 'idcliente'
                    },
                    {
                        name: 'idestructuracomun'
                    },
                    {
                        name: 'estructuracomun'
                    },
                    {
                        name: 'idarearesp'
                    },
                    {
                        name: 'arearesp'
                    },
                    {
                        name: 'idestructura'
                    },
                    {
                        name: 'estructura'
                    },
                    {
                        name: 'clave'
                    },
                    {
                        name: 'fecha'
                    },
                    {
                        name: 'numero'
                    },{
                        namo: 'condicionPago'
                    }
                ]
            }),
            listeners: {
                'beforeload': function(_st, _opts) {
                    if (_this.maskTodos) {
                        _this.maskTodos.hide();
                    }
                    if (_this.comboAreaResp.getValue()) {
                        _st.baseParams.idestructuracomun = _this.comboAreaResp.getValue();
                        if (!_this.idestructurapadre) {
                            _st.baseParams.idestructurapadre = _this.comboAreaResp.getValue()

                        } else {
                            _st.baseParams.idestructurapadre = _this.idestructurapadre;
                        }
                    } else {
                        //  Id del area de responsabilidad
                        _st.baseParams.idestructuracomun = _this.idarearesp;

                        //  Id de la estructura padre del area de responsabilidad
                        _st.baseParams.idestructurapadre = _this.idestructurapadre;
                    }

                    // parametro si quiero filtrar los documnetos por el user autenticado
                    _st.baseParams.validar_usuario = _this.validar_usuario;

                    _st.baseParams.ejecutar_validacion_centrocosto = (_this.tipo_area_seleccionada == 'arearesp') ? 1 : 0;

                    //  Arreglo de operaciones pasados por parametro
                    if (_this.operaciones.length > 0)
                        _st.baseParams.idoperacion = Ext.encode(_this.operaciones);

                    Ext.apply(_st.baseParams, _this.filtros);
                },
                'load': function(st, obj) {
                    if (st.getCount() == 0) {
                        mostrarMensaje(1, _this.idioma.msgNoExistDatos);
                    }
                }
            }
        });
        _this.bbar = new Ext.PagingToolbar({
            store: _this.store,
            pageSize: 20,
            displayInfo: true,
            displayMsg: _this.idioma.lbMsgResultados,
            emptyMsg: _this.idioma.lbMsgNoResultads
        });
        _this.view = new Ext.grid.GroupingView({
            forceFit: true,
            enableGrouping: true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "' + (_this.idioma.lbCMDocumentos)
                    + '" : "' + (_this.idioma.lbCMDocumento) + '"]})'
        });
        /**
         * Componentes de la búsqueda básica
         */
        this.tfNro = new Ext.form.NumberField({
            width: 40,
            enableKeyEvents: true,
            maskRe: /^[0-9]/,
            maxLength: 11,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buscarBtn.handler();
                    }
                }
            }
        });
        this.cmbBuscarOperaciones = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            hiddenName: 'idoperacion',
            valueField: 'idoperacion',
            id: 'idcmboperacionesserv',
            displayField: 'denominacion',
            store: _this.getStoreOperaciones(),
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            width: 200,
            emptyText: _this.idioma.lbCbVacio,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buscarBtn.handler();
                    }
                }
            }
        });
        this.cmbBuscarEstado = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            hiddenName: 'idestatus',
            valueField: 'idestatus',
            displayField: 'denominacion',
            id: 'idcmbestadoserv',
            store: new Ext.data.SimpleStore({
                fields: ['idestatus', 'denominacion'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [3, LOG.lb.documento.Estado[3]]
                ]
            }),
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            width: 100,
            emptyText: _this.idioma.lbCbVacio,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buscarBtn.handler();
                    }
                }
            }
        });
        this.limpiarBtn = new Ext.Button({
            iconCls: 'limpiar',
            text: _this.idioma.lbLimpiarBtn,
            tooltip: _this.idioma.lbTtLimpiarBtn,
            handler: function() {
                _this.tfNro.reset();
                _this.cmbBuscarOperaciones.reset();
                _this.cmbBuscarEstado.reset();
                _this.comboAreaResp.reset();
                _this.store.load();
            }
        });
        this.buscarBtn = new Ext.Button({
            iconCls: 'buscar',
            text: _this.idioma.lbBuscarBtn,
            tooltip: _this.idioma.lbTtBuscarBtn,
            handler: function() {
                if (_this.tfNro.isValid() && _this.comboAreaResp.isValid() && _this.cmbBuscarOperaciones.isValid() && _this.cmbBuscarEstado.isValid()) {
                    _this.store.load({
                        params: {
                            start: 0,
                            limit: _this.getBottomToolbar().cbPageSize.getValue(),
                            nrodoc: (_this.tfNro.getValue() != '') ? _this.tfNro.getValue() : null,
                            idoperacion: (_this.operaciones.length > 0) ? Ext.encode(_this.operaciones) : _this.cmbBuscarOperaciones.getValue(),
                            idestado: (_this.idestadoPorDefecto) ? _this.idestadoPorDefecto : _this.cmbBuscarEstado.getValue()
                        }
                    });
                }
            }
        });
        this.tbar = [
            {xtype: 'tbtext', text: _this.idioma.hdNroDoc + ':'},
            '',
            _this.tfNro,
            '',
            {xtype: 'tbtext', id: 'idlabelarearespserv', text: _this.idioma.lbCbDepositoBuscar + ':'},
            '',
            _this.comboAreaResp,
            '',
            {xtype: 'tbtext', id: 'idlabeloperacionserv', text: _this.idioma.hdOperacion + ':'},
            '',
            _this.cmbBuscarOperaciones,
            '',
            {xtype: 'tbtext', id: 'idlabelestadoserv', text: _this.idioma.hdEstado + ':'},
            '',
            _this.cmbBuscarEstado,
            '',
            _this.buscarBtn,
            _this.limpiarBtn
        ];

    },
    getStoreOperaciones: function() {
        this.stOperaciones = new Ext.data.SimpleStore({
            fields: ['idoperacion', 'denominacion', 'idconcepto', 'operacioncontable', 'idcuenta'],
            data: [],
            autoLoad: false
        });
        return this.stOperaciones;
    },
    getUsuarios: function() {
        var _this = this;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/damecombousuarios',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.arregloUsuarios = rd;
                _this.getOperaciones();
            }
        });
    },
    getOperaciones: function() {
        var _this = this;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getoperaciones',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.arregloOperaciones = Array();
                for (var i = 0; i < rd.length; i++) {
                    var obj = {
                        idoperacion: rd[i].idoperacion,
                        denominacion: rd[i].denominacion
                    }
                    _this.arregloOperaciones.push(obj);
                }
                _this.store.load();
            }
        });
    },
    getOperacionesEntrada: function() {
        var _this = this;
        var codigos = new Array();
        _this.maskTodos = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando datos...'});
        _this.maskTodos.show();
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getOperacionesEntrada',
            method: 'POST',
            params: {
                idarearesp: _this.idestructurapadre
            },
            callback: function(option, success, response) {
                var record = Ext.decode(response.responseText);
                _this.operaciones = new Array();
                for (var i = 0; i < record.datos.length; i++) {
                    _this.operaciones.push(record.datos[i].idoperacion);
                }
                _this.cargarDatosNecesarios({
                    fn: function() {
                        _this.store.load();
                    }
                });
            }
        });
    },
    cargarDatosNecesarios: function(params) {
        var _this = this;

        Ext.Ajax.request({
            method: 'POST',
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/cargarnecesario',
            params: {
                idestructura: _this.idestructurapadre,
                usuarios: (_this.arregloUsuarios.length == 0) ? 'cargausuarios' : 'nocargausuarios'
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.entidadSeleccionada = {
                    entidadCodigo: rd.entidadCodigo,
                    entidadDireccion: rd.entidadDireccion

                };

                if (rd.documentos && rd.documentos.length > 0) {
                    _this.arregloDocumentosAFT = rd.documentos;
                }
                if (rd.operaciones.length > 0) {
                    var records = Array();
                    var i = 0;
                    while (i < rd.operaciones.length) {

                        var obj = {
                            idoperacion: rd.operaciones[i].idoperacion,
                            denominacion: rd.operaciones[i].denominacion,
                            idconcepto: rd.operaciones[i].idconcepto,
                            operacioncontable: rd.operaciones[i].operacioncontable,
                            idcuenta: rd.operaciones[i].idcuenta,
                            icono: rd.operaciones[i].icono,
                            tipo_interfaz: rd.operaciones[i].tipo,
                            codigo_operacion: rd.operaciones[i].codigo
                        }
                        _this.arregloOperaciones.push(obj);

                        //  Para llenar el combo operaciones general
                        var record = new Ext.data.Record({});
                        record.data = {
                            idoperacion: rd.operaciones[i].idoperacion,
                            denominacion: rd.operaciones[i].denominacion,
                            idconcepto: rd.operaciones[i].idconcepto,
                            operacioncontable: rd.operaciones[i].operacioncontable,
                            idcuenta: rd.operaciones[i].idcuenta
                        };
                        records.push(record);

                        i += 1;
                    }
                    _this.stOperaciones.add(records);
                }
                if (rd.usuarios.length > 0) {
                    _this.arregloUsuarios = rd.usuarios;
                }

                if (typeof params !== 'undefined' && typeof params.fn === 'function') {
                    params.fn();
                }
            }
        });
    }
});
LOG.aft.documento.ComboDepositos = Ext.extend(LOG.util.ComboBox, {
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

        LOG.aft.documento.ComboDepositos.superclass.constructor.call(this, config);
    }
});