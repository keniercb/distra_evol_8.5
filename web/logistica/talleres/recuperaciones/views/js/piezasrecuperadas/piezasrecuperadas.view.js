Ext.ns('Ext.erp.piezasrecuperadas');

Ext.erp.piezasrecuperadas = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        this.region = 'center';
        this.idioma = {};
        LOG.util.UIManager.apply(this.idioma, Log.tall.piezasrecuperadas.Idioma);

        Ext.MessageBox.wait(this.idioma.msgCargandoDatosIniciales, this.idioma.msjLoadMask);
        var count = 0;
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionmediostaller/cargarTiposMedios',
            method: 'POST',
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.grid2.setTipoPieza(resp['datos']);
                _this.grid2.fireEvent('cargainicial');
            }
        });

        //Panel piezas especificas
        this.grid = new Ext.erp.gridPiezas({
            idioma: this.idioma
        });
        this.grid.init();
        this.grid.on({
            'limpiar': function() {
                _this.comboTipoMedioEspecifico.reset();
                _this.comboDestino.reset();
                _this.comboTipoPiezaEspecifica.reset();
                _this.comboTipoPiezaEspecifica.clearValue();
                Ext.apply(_this.btnExportar, {
                    objSubmit: {
                        idpadre: null,
                        idindicador: null,
                        columns: null
                    }
                });
            }
        });

        var piezasepecificas = this.grid.view();
        piezasepecificas.height = 600;
        this.grid.storePrincipal.on({
            load: function() {
                if (_this.grid.storePrincipal.getCount() != 0) {
                    _this.btnExportar.enable();
                }
                else {
                    _this.btnExportar.disable();
                }
            }
        });

        this.comboTipoMedioEspecifico = new LOG.util.ComboBox({
            mode: 'remote',
            url: '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas/obtenerPiezas',
            width: 250,
            resizable: true,
            minListWidth: 300,
            displayField: 'descripcionmarcamodelomedio',
            valueField: 'indicadormedio',
            queryParam: 'criterio',
            pageSize: 10,
            listeners: {
                select: function(cb, record) {
                    _this.grid.getStorePrincipal().load({
                        params: {
                            idindicadormedio: record.data.indicadormedio
                        }
                    });
                }
            }
        });

        this.comboDestino = new LOG.util.ComboBox({
            mode: 'remote',
            width: 250,
            resizable: true,
            minListWidth: 300,
            url: '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas/obtenerPiezas',
            displayField: 'destino',
            valueField: 'iddestino',
            queryParam: 'criterio',
            pageSize: 10,
            listeners: {
                select: function(cb, record) {
                    _this.grid.getStorePrincipal().load({
                        params: {
                            iddestino: record.data.iddestino
                        }
                    });

                }
            }
        });
        this.comboDestino.store.on({
            'load' : function(st, records, options) {
                st.each(function(r) {
                    if(r.data.iddestino == null)
                        st.remove(r)
                });
            }
        });

        this.comboTipoPiezaEspecifica = new LOG.util.ComboBox({
            mode: 'remote',
            width: 250,
            resizable: true,
            minListWidth: 300,
            url: '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas/obtenerPadresDePiezas',
            displayField: 'denominacion',
            valueField: 'idpadre',
            queryParam: 'criterio',
            pageSize: 10,
            listeners: {
                select: function(cb, record) {
                    _this.grid.actualizarColumnas({idindicador: record.data.idindicador, idpadre: record.json.idpadre}, _this.btnExportar);

                }
            }
        });

        var panelPiezasEspecificas = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'border',
            indice: 1,
            title: this.idioma.cgPiezasEspecificas,
            items: [{
                region: 'north',
                bbar: [
                    new Ext.form.Label({text: this.idioma.cgTipoMedio}),
                    ' ',
                    this.comboTipoMedioEspecifico,
                    ' ','-',' ',
                    new Ext.form.Label({text: this.idioma.cgDestino}),
                    ' ',
                    this.comboDestino,
                    ' ','-',' ',
                    new Ext.form.Label({text: this.idioma.cgPieza}),
                    ' ',
                    this.comboTipoPiezaEspecifica
                ]
            },piezasepecificas]
        });

        //Panel piezas generales
        this.grid2 = new Ext.erp.gridPiezasGeneral({
            idioma: this.idioma
        });
        this.grid2.on({
            'cargainicial': function () {
                Ext.MessageBox.hide();
                _this.grid2.getStorePrincipal().load();
            },

            'limpiar': function() {
                _this.comboTipoMedioGeneral.reset();
                _this.comboEntidad.reset();
                _this.comboTipoPiezaGeneral.reset();
                Ext.apply(_this.btnExportar, {
                    objSubmit: {
                        idpadre: null,
                        idindicador: null,
                        columns: null
                    }
                });
            }


        });
        this.grid2.init();


        var piezasgenerales = this.grid2.view();
        piezasgenerales.height = 600;

        this.comboTipoMedioGeneral = new LOG.util.ComboBox({
            mode: 'remote',
            width: 250,
            resizable: true,
            url: '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas/obtenerPiezas',
            minListWidth: 300,
            displayField: 'descripcionmarcamodelomedio',
            valueField: 'indicadormedio',
            queryParam: 'criterio',
            pageSize: 10,
            listeners: {
                select: function(cb, record) {
                    _this.grid2.getStorePrincipal().load({
                        params: {
                            idindicadormedio: record.data.indicadormedio
                        }
                    });
                }
            }
        });

        this.comboEntidad = new LOG.util.LovCombo({
            mode: 'remote',
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEstructurasPorDominio',
            width: 250,
            resizable: true,
            minListWidth: 300,
            displayField: 'text',
            valueField: 'id',
            queryParam: 'criterio',
            pageSize: 10,
            listeners: {
                select: function(cb, record) {
                    _this.grid2.getStorePrincipal().load({
                        params: {
                            idestructura: record.data.id
                        }
                    });
                }
            }
        });

        this.comboTipoPiezaGeneral = new LOG.util.ComboBox({
            mode: 'remote',
            width: 250,
            resizable: true,
            minListWidth: 300,
            url: '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas/obtenerPadresDePiezas',
            displayField: 'denominacion',
            valueField: 'idpadre',
            queryParam: 'criterio',
            pageSize: 10,
            listeners: {
                select: function(cb, record) {
                    _this.grid2.getStorePrincipal().load({
                        params: {
                            idpadre: record.data.idpadre
                        }
                    });
                }
            }
        });
        this.comboTipoPiezaGeneral.store.on({
            beforeload: function(st, obj) {
                Ext.apply(obj.params, {
                    indicadores: true
                });
            }
        });

        var panelPiezasGenerales = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'border',
            indice: 2,
            title: this.idioma.cgPiezasGenerales,
            items: [{
                region: 'north',
                bbar: [
                    new Ext.form.Label({text: this.idioma.cgTipoMedio}),
                    ' ',
                    this.comboTipoMedioGeneral,
                    ' ','-',' ',
                    new Ext.form.Label({text: this.idioma.cgEntidades}),
                    ' ',
                    this.comboEntidad,
                    ' ','-',' ',
                    new Ext.form.Label({text: this.idioma.cgPieza}),
                    ' ',
                    this.comboTipoPiezaGeneral,
                ]},
                piezasgenerales]
        });

        //Configurando de panel general
        this.panel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [panelPiezasEspecificas, panelPiezasGenerales]
        });

        this.panel.on({
            'tabchange': function (tb, p) {
                if(_this.panel.getActiveTab().indice == 1){
                    Ext.apply(_this.btnExportar, {
                        objSubmit:{piezas: "especificas"}
                    });
                }
                if(_this.panel.getActiveTab().indice == 2){
                    Ext.apply(_this.btnExportar, {
                        objSubmit:{piezas: "generales"}
                    });
                }

            }
        })

        this.listaBotonesGeneral = new LOG.util.List();
        this.btnExportar = LOG.util.Prototipos.botonExportar({
            url: '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas/exportarExcel',
            disabled: true,
            indice:1
        });

        this.listaBotonesGeneral.add(this.btnExportar);


        this.listaBotonesGeneral.add("->");
        this.listaBotonesGeneral.add(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'ayudaPiezasRecuperadas'
        }));

        config.layout = 'border';
        config.items = [{
                region: 'north',
                tbar: this.listaBotonesGeneral.getArray()
            },
            this.panel
        ];
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    ctrl: false,
                    key: 'l',
                    fn: function() {
                        if (_this.isVisible()) {
                            _this.grid.btnLimpiar();
                        }
                    }
                }
            ]);

        Ext.erp.piezasrecuperadas.superclass.constructor.call(this, config);

        this.on({
            'resize': function() {
                var altura = _this.getHeight() - 40;
                _this.panel.setHeight(altura);
            }
        });

    }
});

Ext.erp.gridPiezas = Ext.extend(LOG.util.UITemplate, {
    arrAgencias: undefined,
    arrServicios: undefined,
    id: undefined,
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas';
        config.urlBusquedaGridPrincipal = 'obtenerPiezas';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        this.idioma = {};
        Ext.erp.gridPiezas.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.penalizacionterceros.Idioma);
        this.addEvents('limpiar');
    },
    render: function(config) {
        var render = Ext.erp.gridPiezas.superclass.render.call(this, config);
        var _this = this;
        _this.textDesde = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdePieza',
            endDateField: 'hastaPieza'
        });
        _this.textHasta = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaPieza',
            endDateField: 'desdePieza'
        });
        _this.tiempoVida = new LOG.util.Prototipos.inputEntero({
            name: 'tiempovida'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;

        _this.btnBuscarPE = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBuscarPieza,
            handler: function() {
                _this.btnBuscar();
            }
        });
        _this.btnLimpiarPG = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar,
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function() {
                _this.btnLimpiar();
            }});

        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible())
                            _this.btnBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function() {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);


        this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: _this.idioma.cgDesde}), _this.textDesde,
            '-', new Ext.form.Label({text: _this.idioma.cgHasta}), _this.textHasta, '-',new Ext.form.Label({text: this.idioma.cgVidaUtil}),
            '-',this.tiempoVida,'-', _this.btnBuscarPE, '-', _this.btnLimpiarPG);

        this.getStorePrincipal().on({
            'beforeload' : function(st, obj) {
                Ext.apply(obj.params, {
                    fechainicio: _this.textDesde.getValue(),
                    fechafin: _this.textHasta.getValue(),
                    vidautil: _this.tiempoVida.getValue()
                })
            },

            'load': function(st, records, options) {
                options.callback = function(records) {
                    for (var i = 0; i < records.length; i++) {
                        var datos = Ext.decode(records[i].json.datos);
                        if (typeof (datos) == 'string') {
                            datos = Ext.decode(datos);
                        }
                        if (datos.length > 0) {
                            for (var j = 0; j < datos.length; j++) {
                                var name = datos[j].name;
                                var obj = datos[j];
                                _this.addValores(records[i], name, obj[name]);
                            }
                        }
                    }
                }
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });

        return render;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNoOrden,
            width: 120,
            default: true
        });//1

        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            header: this.idioma.cgIdentificador,
            width: 120,
            default: true
        });//2

        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            header: this.idioma.cgPiezaMedio,
            width: 350,
            default: true,
            id: 'piezas'
        });//3

        this.addGridColumn({
            dataIndex: 'marca',
            header: this.idioma.cgMarca,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//4

        this.addGridColumn({
            dataIndex: 'modelo',
            header: this.idioma.cgModelo,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//5

        this.addGridColumn({
            dataIndex: 'idpiezarecuperable',
            hidden: true
        });//6

        this.addGridColumn({
            dataIndex: 'motivo',
            header: this.idioma.cgMotivo,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                if(val == 1)
                    resul = 'Perdida';
                if(val == 2)
                    resul = 'Rotura';
                return resul;
            }
        });//7

        this.addGridColumn({
            dataIndex: 'destino',
            header: this.idioma.cgDestinos,
            width: 250,
            default: true
        });//8

        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelomedio',
            header: this.idioma.cgMedioRetirado,
            width: 250,
            agrupador: true,
            hidden: true,
            default: true
        });//9

        this.addGridColumn({
            dataIndex: 'vidautil',
            header: this.idioma.cgVidaUtilColumn,
            width: 250,
            default: true
        });//10

        for (var i = 0; i < 40; i++) {
            this.addGridColumn({
                header: i,
                width: 100,
                hidden: true,
                dataIndex: i,
                default: true
            });
        }//next

    },
    btnBuscar: function() {
        var _this = this;
        var desde = _this.textDesde.getValue();
        var hasta = _this.textHasta.getValue();
        var vida = _this.tiempoVida.getValue();
        if (desde || hasta || vida) {
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load({
                params: {
                    fechainicio: (desde) ? desde : null,
                    fechafin: (hasta) ? hasta : null,
                    vidautil: (vida) ? vida : null,
                    limit: 30,
                    start: 0
                }
            });

        }
    },
    btnLimpiar: function() {
        var _this = this;
        _this.id = null;
        _this.textDesde.reset();
        _this.textHasta.reset();
        _this.tiempoVida.reset();
        _this.fireEvent('limpiar');
        _this.getStorePrincipal().filtrado = false;
        _this.getStorePrincipal().load({
            params: {
                fechainicio: null,
                fechafin: null,
                vidautil: null,
                idpadre: null,
                iddestino: null,
                idindicadormedio: null
            }
        });
        _this.ocultarColumnas();

    },
    actualizarColumnas: function(id, btnExportar) {
        var _this = this;
        _this.ocultarColumnas();
        var param = {};
        param['idpadre'] = id.idpadre;
        Ext.Ajax.request({
            url: '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas/obtenerPiezas',
            method: 'POST',
            params: param,
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.mostrarColumnas(resp);
                if(s) {
                    _this.getStorePrincipal().load({
                        params: {
                            idpadre: id.idpadre
                        }
                    });
                }
                var datos = resp.datos, flag = false;
                for (var i = 0, length = datos.length; i < length; i++) {
                    if (datos[i].datos) {
                        flag = true;
                        Ext.apply(btnExportar, {
                            objSubmit: {
                                idpadre: id.idpadre,
                                columns: datos[i].datos ? datos[i].datos : null
                            }
                        });
                    }
                }
                if (!flag) {
                    Ext.apply(btnExportar, {
                        objSubmit: {
                            idpadre: id.idpadre
                        }
                    });
                }
            }
        });
    },
    mostrarColumnas: function(resp) {
        var _this = this;
        var array = resp.datos;
        var records = Array();
        var datos = Array();
        for (var i = 0; i < array.length; i++) {
            var conv = Ext.decode(array[i].datos);
            if (typeof (conv) == 'string') {
                conv = Ext.decode(conv);
            }
            datos.push(conv);
        }
        for (var i = 0; i < datos.length; i++) {
            var items = datos[i];
            for (var j = 0; j < items.length; j++) {
                var name = items[j].name;
                var obj = items[j];
                _this.getGridPrincipal().getColumnModel().setDataIndex(11 + j, name);
                _this.getGridPrincipal().getColumnModel().setColumnHeader(11 + j, items[j].etiqueta);
                _this.getGridPrincipal().getColumnModel().setHidden(11 + j, false);
            }
        }
        _this.getGridPrincipal().getView().refresh();
    },
    addValores: function(record, propiedad, valor) {
        var _this = this;
        record.set(propiedad.toString(), valor);
        _this.getGridPrincipal().getView().refreshRow(record);
    },
    ocultarColumnas: function() {
        var _this = this;
        for (var i = 10; i < 40; i++) {
            _this.getGridPrincipal().getColumnModel().setHidden(i, true);
        }
    }


});

Ext.erp.gridPiezasGeneral = Ext.extend(LOG.util.UITemplate, {
    arrTipoPiezas: undefined,
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/piezasrecuperadas';
        config.urlBusquedaGridPrincipal = 'obtenerPiezasGenerales';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.idioma = {};
        Ext.erp.gridPiezasGeneral.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.penalizacionterceros.Idioma);
        this.addEvents('limpiar');
        this.addEvents('cargainicial');
    },
    render: function(config) {
        var render = Ext.erp.gridPiezasGeneral.superclass.render.call(this, config);
        var _this = this;
        _this.textDesde = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdePiezaG',
            endDateField: 'hastaPieza'
        });
        _this.textHasta = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaPiezaG',
            endDateField: 'desdePieza'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;

        _this.btnBuscarPG = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBuscarPieza,
            handler: function() {
                _this.btnBuscar();
            }
        });
        _this.btnLimpiarPG = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar,
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function() {
                _this.btnLimpiar();
            }});

        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible())
                            _this.btnBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function() {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);


        this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: _this.idioma.cgDesde}), _this.textDesde,
            '-', new Ext.form.Label({text: _this.idioma.cgHasta}), _this.textHasta, '-', _this.btnBuscarPG, '-', _this.btnLimpiarPG);

        this.getStorePrincipal().on({
            'beforeload': function (st, obj) {
                Ext.apply(obj.params, {
                    fechainicio: _this.textDesde.getValue(),
                    fechafin: _this.textHasta.getValue()
                })
            },
            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });

        return render;
    },
    initDefaultColumns: function() {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            header: this.idioma.cgPiezaMedio,
            width: 350,
            default: true,
            id: 'piezas'
        });//1

        this.addGridColumn({
            dataIndex: 'marca',
            header: this.idioma.cgMarca,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//2

        this.addGridColumn({
            dataIndex: 'modelo',
            header: this.idioma.cgModelo,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//3

        this.addGridColumn({
            dataIndex: 'cantidad',
            header: this.idioma.cgCantidad,
            width: 250,
            default: true
        });//4

        this.addGridColumn({
            dataIndex: 'idpadre',
            header: this.idioma.cgTipoPieza,
            width: 250,
            agrupador: true,
            hidden: true,
            default: true,
            renderer: function(val, metaData, record) {
            var resul = val;
                Ext.each(_this.arrTipoPiezas, function(r) {
                    if (r['idindicador'] == val) {
                        resul = r['denominacion'];
                    }
                });
                return resul;
            }
        });//5
    },
    btnBuscar: function() {
        var _this = this;
        var desde = _this.textDesde.getValue();
        var hasta = _this.textHasta.getValue();
        if (desde || hasta) {
            _this.getStorePrincipal().load({
                params: {
                    fechainicio: (desde) ? desde : null,
                    fechafin: (hasta) ? hasta : null,
                    limit: 30,
                    start: 0
                }
            });
        }
    },
    btnLimpiar: function() {
        var _this = this;
        _this.id = null;
        _this.textDesde.reset();
        _this.textHasta.reset();
        _this.fireEvent('limpiar');
        _this.getStorePrincipal().filtrado = false;
        _this.getStorePrincipal().load({
            params: {
                fechainicio: null,
                fechafin: null,
                vidautil: null,
                idpadre: null,
                idestructura: null,
                idindicadormedio: null
            }
        });
    },
    setTipoPieza: function(tipospiezas) {
        this.arrTipoPiezas = tipospiezas;
    }
});

