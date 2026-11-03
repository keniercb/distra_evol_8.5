Ext.ns('LOG.tall.ordentrabajo');
LOG.tall.ordentrabajo.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    /**
     * formulario que contiene todos los campos de entrada estaticos
     */
    formularioGeneral: undefined,
    /**
     * recor de la solicitud seleccionada para dar origen al documento orden de trabajo
     */
    recordOrigen: null,

    recordOriginal: null,
    /**
     * arreglo con los tipos de moneda de la entidad
     */
    monedasEntidad: undefined,
    /**
     * denominacion del producto
     */
    producto: undefined,
    /**
     *identificador del producto
     */
    idProducto: undefined,
    /**
     *identificador del indicador
     */
    idIndicador: undefined,
    /**
     * array con las áreas internas de la entidad
     */
    arrAreasInternas: undefined,
    /**
     * array con las personas entidad
     */
    arrPersonas: undefined,
    /**
     *identificador padre del indicador del producto
     */
    idPadreIndicador: undefined,
    idEntidad: undefined,
    origen: undefined,
    servicios: undefined,
    arrIndicadores: undefined,
    /*variable  con la cantidad de componentes especificados que ya cargagor su store*/
    contador: 0,
    /*
     * saber si ya se cargo el store de fallas
     */
    loadFallas: false,
    /*
     * saber si ya se cargo el store de reclamaciones
     */
    loadReclamaciones: false,
    listaAcciones: undefined,
    campoIdentificador: undefined,
    constructor: function (config) {
        this.listaAcciones = new LOG.util.List(config.acciones);
        LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.VentanaAdicionar.superclass.constructor.call(this, config);
        this.values = config.values;
        this.addEvents('dinamicoscreados');
        this.addEvents('indicadorescargados');
        this.addEvents('componentescreados');
    },
    init: function () {
        this.findIndicador();
        this.builComponent();
        this.cargaInicialDeStores();
        this.started = true;
    },
    builComponent: function () {
        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        var _this = this;
        //Esto es para Transporte Occidente
        //handler: this.salvarHandler,
        this.usatodas = 0;
        this.on('indicadorescargados', function () {
            if (_this.origen == 1 && _this.recordOrigen) {
                var find = this.loadDatosMedioIncripcion();
                if (find) {
                    var dinam = Ext.decode(_this.recordOrigen.data.datosmedio);
                    _this.loadValueDatosMedios(dinam);
                } else {
                    //sugerir un mensaje mensaje
                }
            }
            if ((_this.origen == 0 || _this.origen == 2) && _this.recordOrigen) {
                var find = this.loadDatosMedioSolicitud();
                if (find) {
                    this.layoutDatosMedio(_this.idPadreIndicador);
                }
            }
        });
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'center',
            //region: 'north',
            //titleCollapse: true,
            //collapsible: true,
            //collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: this.idioma.tlPanelGeneral,
            autoHeight: true,
            frame: true
        });
        this.panelDerecho = LOG.util.UIManager.initPanel({
            region: 'east',
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: 'Panel derecho',
            autoHeight: true,
            frame: true
        });
        this.labelImporte = new Ext.form.Label({html: ' 0.00'});
        this.tfTotalImporte = new LOG.util.Prototipos.inputDecimal({
            name: 'importetotal',
            value: 0,
            disabled: true,
            hidden: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }

        });
        this.tfTotalImporte.on('valid', function (tf) {
            //_this.labelImporte.setText(_this.tfTotalImporte.getValue());
        });
        //se hizo para transgaviota
        this.labelImporteCUC = new Ext.form.Label({html: ' 0.00'});
//        this.tfTotalImporteCUC = new LOG.util.Prototipos.inputDecimal({
//            name: 'importetotalalternativo',
//            value: 0,
//            disabled: true,
//            hidden: true,
//            renderer: function (v) {
//                return Ext.util.Format.number(v, '0.00');
//            }
//        });
//        this.tfTotalImporteCUC.on('valid', function (tf) {
//            //_this.labelImporteCUC.setText(_this.tfTotalImporteCUC.getValue());
//        });
        //COmbo para el tipo de precio
        if (aperturadoFAC && _this.grantedAction('RIntegrarFac')) {
            this.comboTiposPrecio = new LOG.util.ComboBox({
                name: 'idtipoprecio',
                autoLoad: true,
                url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarTiposDePrecio',
                displayField: 'denominacion',
                allowblank: false,
                valueField: 'idtipoprecio',
                queryParam: 'criterio',
                fieldLabel: 'this.idioma.lbTipoPrecio',
                validarEnFormBasico: false,
                mode: 'remote',
                //minChars:1,
                //pageSize : 15,
                resizable: true,
                listeners: {
                    select: function (cb, recordS) {
                        var btnAddAct = _this.gridActividades.listaBotones.getItem(0);
                        btnAddAct.controlFn(btnAddAct, _this.gridActividades);
                        if (_this.datosLimpios())
                            _this.btnSalvar.disable();
                        else
                            _this.btnSalvar.enable();

                    }

                }
            });
            this.comboTiposPrecio.store.on({
                beforeload: function (st, obj) {
                    // obj.params.idcliente = _this.comboClientes.getValue();
                    obj.params.tipo = 2;
                },
                load: function (st, records) {
                    _this.comboTiposPrecio.setValue(_this.comboTiposPrecio.getValue());
                }
            })
            this.comboTiposPrecioMat = new LOG.util.ComboBox({
                name: 'idtipopreciomat',
                autoLoad: true,
                url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarTiposDePrecio',
                displayField: 'denominacion',
                valueField: 'idtipoprecio',
                allowblank: false,
                queryParam: 'criterio',
                fieldLabel: this.idioma.lbTipoPrecio,
                validarEnFormBasico: false,
                mode: 'remote',
                //minChars:1,
                //pageSize : 15,
                resizable: true,
                listeners: {
                    select: function (cb) {
                        var btnAddMat = _this.gridMateriales.listaBotones.getItem(0);
                        btnAddMat.controlFn(btnAddMat, _this.gridMateriales);

                        if (_this.datosLimpios())
                            _this.btnSalvar.disable();
                        else
                            _this.btnSalvar.enable();
                    }

                }
            });
            this.comboTiposPrecioMat.store.on({
                beforeload: function (st, obj) {
                     obj.params.tipo = 1;
                },
                load: function (st, records) {
                    if (_this.comboTiposPrecioMat.getValue())
                        _this.comboTiposPrecioMat.setValue(_this.comboTiposPrecioMat.getValue());
                    else
                        _this.comboTiposPrecioMat.setValue(-1);
                }
            });
        }
        //Panel de los grids materiales y servicios
        this.gridMateriales = new LOG.tall.ordentrabajo.GridMateriales({
            idioma: this.idioma,
            title: this.idioma.tlMateriales,
            columnasDinamicas: this.monedasEntidad,
            acciones: this.acciones,
            comboTiposPrecio: this.comboTiposPrecioMat,
            monedaContable: (this.monedasEntidad.codigoiso) ? this.monedasEntidad.codigoiso : null,
            scope: this.scope,
            operariosVarios: (typeof vg_operariosvarios !== 'undefined' && vg_operariosvarios == 1)
        });
        this.gridActividades = new LOG.tall.ordentrabajo.GridActividades({
            idioma: this.idioma,
            title: this.idioma.tlServicios,
            arrAreasInternas: this.arrAreasInternas,
            arrPersonas: this.arrPersonas,
            acciones: this.acciones,
            comboTiposPrecio: this.comboTiposPrecio,
            monedaContable: (this.monedasEntidad.codigoiso) ? this.monedasEntidad.codigoiso : null,
            labelImporte: this.labelImporte,
            labelImporteCUC: this.labelImporteCUC,
            operariosVarios: (typeof vg_operariosvarios !== 'undefined' && vg_operariosvarios == 1)
        });
        this.gridMateriales.init();
        this.materiales = this.gridMateriales.view();
        this.gridMateriales.setModelo(_this.modelo);
        this.gridActividades.init();
        this.actividades = this.gridActividades.view();
        this.gridActividades.setModelo(_this.modelo);
        this.gridActividades.getGridPrincipal().getSelectionModel().on({
            'rowselect': function (sm, index, record) {
                _this.gridMateriales.setActividad(record.data.idactividad, record.data.denominacion);
            },
            'rowdeselect': function () {
                _this.gridMateriales.setActividad(null);
            }
        });
        this.actividades.on({
            'deletedactividad': function (st, record) {
                if (record) {
                //    _this.gridMateriales.eliminarMaterialesPorActividad(record.data.idactividad);
                }
                _this.gridMateriales.setActividad(null);
                // Para habilitar los botenes  al hacer alguna modificacion en los grid
                _this.modelo.dirtyGrids = true;

                _this.habilitarBotonesAlModificarGrid();
                var value = (record[0]) ? record[0] : record;
                var resta = value.data['costo'];
                _this.actualizarImporteTotal(resta, 0);
            },
            'addedactividad': function (st, records, sumaCosto, norma) {
                _this.modelo.dirtyGrids = true;
                var suma = (sumaCosto) ? sumaCosto : 0;

                //_this.gridMateriales.adicionarMateriales(norma);
                _this.actualizarImporteTotal(0, suma);
                if (records)
                    _this.btnSalvar.fn.createDelegate(_this.btnSalvar, [records]).call();
            },
            'editgridactv': function () {
                _this.modelo.dirtyGrids = true;
                //_this.gridActividades.getGridPrincipal().initialConfig.bbar.setDisabled(true);
                _this.habilitarBotonesAlModificarGrid();
            }
        }, _this);
        this.gridActividades.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idordentrabajo: (_this.record) ? _this.record.data.iddocumento : null,
                    limit: limit
                }
            },
            'load': function (st) {
                if (st.getCount() == 0) {
                    _this.listaBotonesVentana.getItem(0).disable();
                    _this.gridMateriales.setActividad(null);
                } else {
                    _this.controlBotones(_this.listaBotonesVentana.getItem(0), _this.listaBotonesVentana.getItem(0).estado);
                }
            },
            'remove': function (st) {
                if (st.getCount() == 0) {
                    _this.gridMateriales.setActividad(null);
                }
            }
        });
        this.gridMateriales.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridMateriales.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idordentrabajo: (_this.record) ? _this.record.data.iddocumento : null,
                    pedidocita: (_this.record && _this.record.data.documentoorigen == 7) ? true : null,
                    limit: limit
                }
            },
            'load': function (store) {

            }
        });
        this.materiales.on({
            'addedmaterial': function (st, records, sumaBase, sumaAlternativa) {
                _this.actualizarImporteTotal(0, sumaBase);
                //_this.actualizarImporteTotalCUC(0, sumaAlternativa);
                _this.modelo.dirtyGrids = true;
                if (aperturadoFAC && _this.grantedAction('RIntegrarFac')) {
                    //_this.comboClientes.disable();
                }
            },
            'deletedmaterial': function (st, rec, ind) {
                _this.actualizarImporteTotal(rec.data.importecup, 0);
                //_this.actualizarImporteTotalCUC(rec.data.importecuc, 0);
                if (_this.gridMateriales.getStorePrincipal().getCount() == 0) {
                    _this.gridMateriales.listaBotones.getItem(1).disable();
                    _this.gridMateriales.listaBotones.getItem(2).disable();
                    _this.gridMateriales.listaBotones.getItem(3).disable();
                    _this.gridMateriales.listaBotones.getItem(4).disable();
                    _this.gridMateriales.listaBotones.getItem(5).disable();
                    if (aperturadoFAC && _this.grantedAction('RIntegrarFac') && (_this.record && _this.record.estado == 1 || _this.recordOrigen)) {
                        //_this.comboClientes.enable();
                    }
                }
                _this.modelo.dirtyGrids = true;
            },
            'recalcularimporte': function (oldImporte, nuevo) {
                _this.actualizarImporteTotal(oldImporte, nuevo);
                _this.modelo.dirtyGrids = true;
            },
            'recalcularimportecuc': function (oldImporte, nuevo) {
                //_this.actualizarImporteTotalCUC(oldImporte, nuevo);
                _this.modelo.dirtyGrids = true;
            },
            'modificado': function () {
                _this.modelo.dirtyGrids = true;
                if (_this.modelo.isValid()) {
                    _this.modelo.habilitarBotones();
                } else {
                    _this.modelo.habilitarBotones(true);
                }
            },
            'changeexistencia': function (val) {
                _this.modelo.estadoorden = val;
                //if(val == 1){
                //    _this.listaBotonesVentana.getItem(0).disable();
                //}
                //if(_this.record) {
                //    _this.record.data.estadoorden = val;
                //}
                if (_this.modelo.isValid()) {
                    _this.modelo.habilitarBotones();
                } else {
                    _this.modelo.habilitarBotones(true);
                }
            },
            'beforecalcularexistencia': function () {
                if (this.btnSalvar) {
                    this.btnSalvar.disable();
                }
            },
            'addpedido': function (materiales) {
                var params = {};
                params.idcliente = _this.comboClientes.getValue();
                var productos = new Array();
                Ext.each(materiales[0], function (rec) {
                    var existencia = (rec.data.existencia) ? parseFloat(rec.data.existencia) : 0;
                    if (parseFloat(rec.data.cantidad) > existencia) {
                        var obj = {};
                        obj['idindicador'] = rec.data.idindicador;
                        obj['cantidad'] = parseFloat(rec.data.cantidad) - existencia;
                        if (rec.data.capacidadliquida) {
                            obj['capacidadliquida'] = rec.data.capacidadliquida;
                        }
                        productos.push(obj);
                    }
                });
                params.productos = Ext.encode(productos);
                params.idordentrabajo = _this.record.data.iddocumento;
                _this.modelo.generarPedido(params);
            }
        });
        var contenMat = new LOG.util.Panel({
            title: this.idioma.tlPiezasMedios,
            autoHeight: true,
            items: [this.materiales]
        });
        var contenActividades = new LOG.util.Panel({
            title: this.idioma.tlActividades,
            autoHeight: true,
            collapsible: true,
            items: [this.actividades],
            listeners: {
                'expand' : function(p){
                    _this.materiales.setHeight(_this.materiales.getHeight()/2);
                },
                'collapse' : function(p){
                    _this.materiales.setHeight(_this.materiales.getHeight()*2);
                }
            }
        });
        if (monedaAlternativa) {
            var textAlternativo = '<b>Importe total' + ' ' + monedaAlternativa + ': </b>'
        }
        var panelGrids = new LOG.util.Panel({
            name: 'ordentrabajoPanel',
            frame: true,
            title: this.idioma.tlOrdenTrabajo,
            width: '98%',
            autoHeight: true,
            bbar: ['->', new Ext.form.Label({html: '<b>Importe total CUP: </b>'}),
                ' ', ' ', ' ', ' ', ' ',
                this.labelImporte,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                (monedaAlternativa && monedaAlternativa) ? new Ext.form.Label({html: textAlternativo}) : ' ',
                ' ', ' ', ' ', ' ', ' ',
                (monedaAlternativa && monedaAlternativa) ? this.labelImporteCUC : ' ',
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                this.tfTotalImporte/*, this.tfTotalImporteCUC*/],
            items: [contenActividades, contenMat]
        });
        panelGrids.doLayout();
        //tab que contiene los paneles
        this.formularioGeneral = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.tabDatosGenerales()]
        });
        this.formularioGeneral.add(panelGrids);
        this.formularioGeneral.add(this.tabGridServiciosTerceros());

        this.storeRegNum = new Ext.data.Store({
            //url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getCargarEnviadosATaller',
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/getCargarEnviadosATaller',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idregnumerico'
            }, [
                {name: 'idproducto'},
                {name: 'idindicador'},
                {name: 'idpadre'},
                {name: 'descripcionmarcamodelo'},
                {name: 'codigo'},
                {name: 'idregnumerico'}
            ])
        });
        this.storeRegNum.on('load', function (st, records) {
            _this.maskMedio();
            if (records.length == 1) {
                _this.modelo.idproducto = _this.idProducto;
                _this.idPadreIndicador = records[0].data.idpadre;
                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                _this.gridFallas.setIdMedio(_this.idPadreIndicador);
                _this.idIndicador = records[0].data.idindicador;
                _this.modelo.idindicador = _this.idIndicador;
                _this.modelo.producto = records[0].data.descripcionmarcamodelo;
                _this.producto = records[0].data.descripcionmarcamodelo;
                var rec = {};
                rec.data = records[0].json;
                _this.layoutDatosMedio(_this.idPadreIndicador, rec);
            } else {
                _this.tabPDatosMedio.body.unmask();
                mostrarMensaje(2, _this.idioma.msgRegNumericoNoEncontrado);
            }
        });

        _this.on('dinamicoscreados', function (rec) {
            if (_this.formDatosMedio) {
                if (rec) {
                    rec.data.matricula = (rec.data.matricula) ? rec.data.matricula : (rec.data.nromatricula) ? rec.data.nromatricula : null;
                    _this.formDatosMedio.getForm().loadRecord(rec);
                }
                var fieldIdentificador = _this.modelo.actualizarValoresDinamicos(_this.formDatosMedio);
                if (fieldIdentificador && _this.atributoidentificador) {
                    fieldIdentificador.setValue(_this.atributoidentificador);
                }
                /*   if (_this.idProducto)
                       _this.campoIdentificador.disable();*/

            }
        });

        this.btnSalvar = LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            disabled: (aperturadoFAC && _this.grantedAction('RIntegrarFac')) ? true : false,
            //Esto es para Transporte Occidente
            handler: this.salvarHandler,
            /*handler: function () {
                if (_this.usatodas == 1) {
                    if (_this.comboTiposPrecio.getValue()) {
                        _this.salvarHandler();
                    }
                    else {
                        _this.formularioGeneral.setActiveTab(1);
                        _this.btnSalvar.disable();
                        if (_this.comboTiposPrecio.getValue())
                            _this.btnSalvar.enable();
                    }
                }
                else {
                    _this.salvarHandler();
                }
            },*/

            scope: this
        }));
        this.btnNuevo = LOG.util.UIManager.apply(this.listaBotones.getItem(1), LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: this.onResetHandler,
            hidden: true,
            scope: this
        }));
        this.btnCerrar = LOG.util.UIManager.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonCancelar({
            handler: function () {
                _this.modelo.reset();
                _this.record = null;
                _this.recordOrigen = null;
                _this.setTitle(_this.idioma.tlCrearOrden);
                _this.lbNroDocGenera.setText('');
                _this.gridMateriales.getStorePrincipal().removeAll();
                _this.gridMateriales.getGridPrincipal().getView().refresh();
                _this.gridActividades.getStorePrincipal().removeAll();
                _this.gridActividades.getGridPrincipal().getView().refresh();
                _this.close();
            },
            text: this.idioma.lbBtnCerrar,
            scope: this
        }, true));

        this.modelo.addActionButton(this.btnSalvar);

        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items: [this.panelSuperior/*,this.panelDerecho*/],
            buttons: [this.btnCerrar, /*this.btnNuevo,*/ this.btnSalvar]
        });

        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
        this.fireEvent = this.fireEvent.createSequence(function (e) {
            if (e == 'resize') {
                _this.definirAltura();
            }
        });
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
        if (typeof vg_operariosvarios !== 'undefined' && vg_operariosvarios == 1) {
            this.chbGarantia.on({
                check: function (me, check) {
                    _this.gridActividades.gridPersonas.cambiarTipoOrden(!check);
                }
            });
        }

    },
    tabDatosGenerales: function () {
        var _this = this;
        //Panel  de los datos generales de la orden
        var row1 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        row1.getColumn(0).labelAlign = 'left';
        row1.getColumn(0).style = 'font: 12px tahoma,arial,helvetica,sans-serif;';
        this.lbNroDocGenera = new Ext.form.Label({
            labelAlign: 'left',
            //fieldLabel: this.idioma.lbNoDocOrigen,
            height: 2
        });
        row1.addComponent(this.lbNroDocGenera);
        this.comboClientes = new LOG.util.ComboBox({
            name: 'idcliente',
            autoLoad: false,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            forceSelection: false,
            queryParam: 'criterio',
            fieldLabel: this.idioma.lbCliente,
            allowBlank: false,
            disabled: true,
            validarEnFormBasico: true,
            mode: 'remote',
            minChars: 3,
            pageSize: 15,
            resizable: true,
            listeners: {
                change: function (cb, value, old) {
                    _this.gridMateriales.setIdCliente(value);
                    if (_this.comboResponsableMedio) {
                        cb.store.each(function (record) {
                            if (record.json.idclientesproveedores == value && record.json.entidad) {
                                _this.comboResponsableMedio.store.baseParams.identidad = record.json.idestructura;
                                _this.idclienteestructura = record.json.idestructura;
                                _this.comboResponsableMedio.store.baseParams.limit = 15;
                                _this.comboResponsableMedio.store.baseParams.start = 0;
                                _this.comboResponsableMedio.store.load();
                                _this.comboResponsableMedio.enable();
                                return;
                            } else if (record.json.idclientesproveedores == value && !record.json.entidad) {
                                _this.comboResponsableMedio.store.baseParams.identidad = null;
                                _this.comboResponsableMedio.setValue();
                                _this.comboResponsableMedio.reset();
                                _this.comboResponsableMedio.disable();
                                return;
                            }
                        })
                    }
                    _this.txtNroContrato.reset();

                    // if (_caller) {
                    //     var dataEstado = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                    //     if (dataEstado.estado != 9) {
                    //         this.comboClientes.enable();
                    //     } else {
                    //         this.comboClientes.disable();
                    //     }
                    // }
                },
                select: function (cb, recordS) {
                    _this.idclienteestructura = recordS.json.idestructura;
                    if (recordS.json.telefono) {
                        _this.telefonoCliente.setValue(recordS.json.telefono);
                        _this.modelo.telefonoCliente = recordS.json.telefono;
                        _this.telefonoCliente.setReadOnly(true);
                    } else {
                        _this.telefonoCliente.setValue("");
                        _this.telefonoCliente.setReadOnly(false);
                    }
                    if (recordS.json.correo) {
                        _this.textoCorreoCliente.setValue(recordS.json.correo);
                        _this.modelo.textoCorreoCliente = recordS.json.correo;
                        _this.textoCorreoCliente.setReadOnly(true);
                    } else {
                        _this.textoCorreoCliente.setValue("");
                        _this.textoCorreoCliente.setReadOnly(false);
                    }
                    Ext.apply(cb, { valueNotFoundText: recordS.json.nombre });
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.comboClientes.store.on('load', function () {
            if (_this.record && _this.record.data.idcliente) {
                _this.comboClientes.setValue(_this.comboClientes.getValue());
            }
            if (_this.recordOrigen && _this.recordOrigen.data.idcliente) {
                _this.comboClientes.setValue(_this.comboClientes.getValue());
            }
        });

        this.comboServicio = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbServicio,
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarActividadesExistentes',
            name: 'idservicio',
            displayField: 'denominacion',
            valueField: 'idactividad',
            queryParam: 'criterio',
            mode: 'remote',
            disabled: true,
            autoLoad: false,
            allowBlank: false,
            validarEnFormBasico: true,
            listeners: {
                change: function (combo, newValue, oldValue) {
                    if (_this.isInit()) {
                        if (_this.modelo.tipo != 1) {
                            _this.gridActividades.panelPrincipal.body.mask('cargando...');
                            //_this.gridActividades.eliminarActividadesDelServico();
                            //_this.gridActividades.getGridPrincipal().initialConfig.bbar.setDisabled(true);
                            _this.gridActividades.setIdServicio(newValue);
                            _this.gridActividades.panelPrincipal.body.unmask();
                        }
                    }
                },
                select: function (cb, recordS) {
                    Ext.apply(cb, {valueNotFoundText: recordS.json.denominacion});
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            },
            minChars: 3,
            pageSize: 15,
            resizable: true
        });
        this.comboServicio.store.on({
            'beforeload': function (store) {
                Ext.apply(store.baseParams, {nivel: 2});
            },
            'load': function (store) {
                if (_this.record && _this.record.data.idservicio) {
                    _this.comboServicio.setValue(_this.comboServicio.getValue());
                }
                if (_this.recordOrigen && _this.recordOrigen.data.idservicio) {
                    _this.comboServicio.setValue(_this.comboServicio.getValue());
                }
            }
        });
      /*  this.comboServicio.getStore.load({
            /!*params: {
                datos: cmb.getValue()
            },*!/
            callback: function () {
                console.info(_this.values);
                /!* if (_this.values) {
                     if (_this.values.cliente.idcuentabancliente)
                         _this.cmbCBC.setValue(_this.values.cliente.idcuentabancliente.substr(1, _this.values.cliente.idcuentabancliente.length - 2));
                 }*!/
            }

        });*/
        this.comboCentroCosto = new LOG.util.ComboBox({
            autoLoad: true,
            disabled: false,
            mode: 'remote',
            fieldLabel: this.idioma.lbCentroCosto,
            name: 'idcentrocosto',
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarComboCentroCosto',
            valueField: 'idcentrogrupo',
            displayField: 'text',
            queryParam: 'criterio',
            width: '98%',
            allowBlank: false,
            editable: true,
            autoSelect: true,
            typeAhead: true,
            //allowBlank: (_this.scope.getGridPrincipal().getSelectionModel().getSelected() && _this.scope.getGridPrincipal().getSelectionModel().getSelected().data.documentoorigen == 7) ? true : false,
            //validarEnFormBasico: true,
            campo: true,
            listeners: {
                select: function (cb, st) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            },
            resizable: true
        })/*this.comboCentroCosto.store.on({
            'load': function (store) {
                if (_this.record && _this.record.data.idcentrocosto) {
                    _this.comboCentroCosto.setValue(_this.record.data.idcentrocosto);
                }
                if (_this.recordOrigen && _this.recordOrigen.data.idcentrocosto) {
                    _this.comboCentroCosto.setValue(_this.recordOrigen.data.idcentrocosto);
                }
                _this.comboCentroCosto.expand();
            }
        });*/
        LOG.util.UIManager.encadenaFn(this.comboCentroCosto.getStore(), 'fireEvent', function (e) {
            if (e == 'load') {
                if (_this.record && _this.record.data.idcentrocosto) {
                    _this.comboCentroCosto.setValue(_this.record.data.idcentrocosto);
                }
                if (_this.recordOrigen && _this.recordOrigen.data.idcentrocosto) {
                    _this.comboCentroCosto.setValue(_this.recordOrigen.data.idcentrocosto);
                }

                _this.comboCentroCosto.expand();
            }
        });
        this.comboFechaInicio = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaComienzo,
            name: 'fechainicio',
            endDateField: this.comboFechaFin,
            allowBlank: false,
            vtype: 'daterange',
            editable: false,
            //minValue: new Date(),
            minText: this.idioma.ttMinTexto,
            validarEnFormBasico: true,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            listeners: {
                'select': function (campo, value) {
                    _this.comboFechaFin.setMinValue(campo.getValue());
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.comboFechaFin = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaTerminacion,
            name: 'fechafin',
            startDateField: this.comboFechaInicio,
            vtype: 'daterange',
            editable: false,
            validarEnFormBasico: true,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            listeners: {
                'select': function (campo, value) {
                    _this.comboFechaInicio.setMaxValue(campo.getValue());
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.comboFechaInicio.endDateField = this.comboFechaFin;
        this.comboProveedores = new LOG.util.ComboBox({
            name: 'idcliente',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            queryParam: 'criterio',
            fieldLabel: this.idioma.lblAgencia,
            allowBlank: false,
            hidden: true,
            disabled: true,
            autoLoad: false,
            minChars: 1,
            pageSize: 15,
            resizable: true,
            mode: 'remote',
            listeners: {
                select: function (cb, st) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.comboProveedores.store.on('load', function (store) {
            if (_this.record && _this.record.data.idcliente) {
                _this.comboProveedores.setValue(_this.comboProveedores.getValue());
            }
            if (_this.recordOrigen && _this.recordOrigen.data.idcliente) {
                _this.comboProveedores.setValue(_this.comboProveedores.getValue());
            }
        });
        this.txtNroContrato = new Ext.form.TriggerField({
            fieldLabel: this.idioma.lbNroContrato,
            name: 'numero',
            triggerClass: 'x-form-cliente-trigger',
            editable: false,
            emptyText: _this.idioma.cbEmtyText,
            tabular:true,
            listeners: {
                onSelect: function(record) {
                    if (record.combo.isDirty())
                    {

                    }
                    else
                        record.combo.setValue("");
                }
            }
        });

        if (contratoObligatorio) {
            this.txtNroContrato.onTriggerClick = function(e) {
                if (!_this.txtNroContrato.disabled)
                    _this.showContratos();//.Inicializar();
            };
        }

        this.telefonoCliente = new Ext.form.NumberField({
            fieldLabel: 'Número de teléfono',
            name: 'telefono',
            maxLength: 15,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true

        });
        this.textoCorreoCliente = new Ext.form.TextField({
            fieldLabel: 'Correo',
            name: 'correo',
            regex: /^(\w+([\.-]?\w+)*@[a-zA-Z0-9_]+\.[a-zA-Z]{2,6})/,
            maxLength: 50,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true//,
            // allowBlank: false

        });
        //Datos del Responsable de la entrega
        this.nombreResponsable = new Ext.form.TextField({
            fieldLabel: 'Nombre y apellidos',
            name: 'nombreresponsable',
            maxLength: 50,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true,
            allowBlank: false

        });

       /*  this.carnetResponsable = new LOG.util.ComboBox({
            fieldLabel: 'Número de identidad',
            hideTrigger: true,
            autoScroll: true,
            name: 'idcarnetresponsable',
            hiddenName: 'idcarnetresponsable',
            valueField: 'idcarnetresponsable',
            displayField: 'numeroidentidad',
            triggerAction: 'all',
            enableQtip: true,
           // mode: 'remote',
            // url
            maxLength: 11,
            width: 150,
            anchor: "98%",
            readOnly: false,
            emptyText: 'CI o Pasaporte',
           // validarEnFormBasico: true,
            allowBlank: false,
            regex: /^(([0-9]{6})|([0-9]{11})|([0-9]{5}))$/,

        }); */
        this.carnetResponsable = new Ext.form.TextField({
            fieldLabel: 'Número de identidad',
            name: 'idcarnetresponsable',
            maxLength: 11,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true,
            regex: /^(([0-9]{6})|([0-9]{11})|([0-9]{5}))$/,
            allowBlank: true
        });
        this.telefonoResponsable = new Ext.form.NumberField({
            fieldLabel: 'Número de teléfono particular',
            name: 'telefonoresponsable',
            maxLength: 15,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true


        });
        this.textoCorreoResponsable = new Ext.form.TextField({
            fieldLabel: 'Correo',
            name: 'textocorreoresponsable',
            regex: /^(\w+@[a-zA-Z_]+\.[a-zA-Z]{2,6})/,
            maxLength: 50,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true//,
            // allowBlank: false

        });

        var columnaCombos = new LOG.util.UIManager.initColumnForm({
            columnas: 4
        });

        columnaCombos.addComponent(this.comboServicio);
        columnaCombos.addComponent(this.comboClientes);
        if (contratoObligatorio) {
            columnaCombos.addComponent(this.txtNroContrato);
        }
        columnaCombos.addComponent(this.telefonoCliente);
        
        columnaCombos.addComponent(this.textoCorreoCliente);
        columnaCombos.addComponent(this.comboFechaInicio);
        columnaCombos.addComponent(this.comboFechaFin);
        if (existeINV && !centroCostosPorActividad) {
            columnaCombos.addComponent(this.comboCentroCosto);
            columnaCombos.addComponent({
                xtype: 'hidden',
                isFormField: true,
                name: 'idcentrocosto',
                id: 'idhdcentrocosto',
                campo: true
            });
        }        
        columnaCombos.addComponent(this.comboProveedores);

        var cls = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls.getColumn(0).labelAlign = '';
        cls.addComponent(row1);
        cls.addComponent(columnaCombos);

        var fsContenedor1 = new Ext.form.FieldSet({
            labelAlign: '',
            width: '98%',
            items: [cls]
        });

        var pluginnnn = new LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor: '100%'
        });
        pluginnnn.getColumn(0).columnWidth = 0.91;
        pluginnnn.getColumn(1).columnWidth = 0.09;
        var btnk = new Ext.Button({
            text: '...',
            handler: function () {
                if (!_this.nombreResponsable.disabled) {
                    var venta = new LOG.tall.ordentrabajo.GridSelectPersonaContacto({
                        idioma: _this.idioma,
                        url: 'cargarPersonasConContactos'
                    });
                    venta.init();
                    venta.view();
                    // venta.getStorePrincipal().load();
                    venta.getVistaPrincipal().aceptarFn = function () {
                        var selected = venta.getSmPrincipal().getSelected();
                        if (selected && !_this.nombreResponsable.disabled) {
                            _this.nombreResponsable.setValue(selected.get('nombreapellidos'));
                            _this.carnetResponsable.setValue(selected.get('idsuin'));
                            _this.telefonoResponsable.setValue(selected.get('telefono'));
                            _this.textoCorreoResponsable.setValue(selected.get('correo'));
                        }
                    }
                }
            }
        });
        var panel2ff = new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({height: 18}), btnk]
        });
        pluginnnn.addComponent(this.textoCorreoResponsable);
        if (_this.grantedAction('Rpersonacontacto')) {
            pluginnnn.addComponent(panel2ff);
        }

        var columnaCombosResponsable = new LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        columnaCombosResponsable.addComponent(this.nombreResponsable);
        columnaCombosResponsable.addComponent(this.carnetResponsable);
        columnaCombosResponsable.addComponent(this.telefonoResponsable);
        // columnaCombosResponsable.addComponent(this.textoCorreoResponsable);
        columnaCombosResponsable.addComponent(pluginnnn);


        var clsResponsable = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        clsResponsable.getColumn(0).labelAlign = '';
        clsResponsable.addComponent(columnaCombosResponsable);
        var fsContenedorCliente = new Ext.form.FieldSet({
            labelAlign: '',
            width: '98%',
            title: 'Responsable de la entrega',
            items: [clsResponsable]
        });
        var fsTipoMedio = new LOG.util.UIManager.initColumnForm({
            columnas: 5
        });

        //Datos del Medio
        this.textoMedio = new LOG.util.Prototipos.inputTexto({
            name: 'producto',
            allowBlank: false,
            fieldLabel: 'Medio',
            width: 410,
            minLength: 1,
            validarEnFormBasico: true,
            readOnly: true,
            maxLength: 150,
            maskRe: LOG.util.Regex.cadena,
            listeners: {
                change: function (cb, st) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.btnMedios = new Ext.Button({
            text: '...',
            handler: function () {
                var ventanaSeletMedio = new LOG.tall.ordentrabajo.VentanaSelecionMedio({
                    idioma: _this.idioma,
                    title: _this.idioma.tlVentanaSelectMedio,
                    isAFT: existeAFT,
                    idestructura: _this.idEntidad,
                    height: 420,
                    width: 855,
                    idcliente: _this.comboClientes.getValue(),
                    idclienteestructura: _this.idclienteestructura || null,
                    usarNomencladorProducto: _this.grantedAction('usarNomPrd'),
                    usarAFTTall: _this.grantedAction('usarAFTTall'),
                    usarTallAFT: _this.grantedAction('usarTallAFT')
                });
                ventanaSeletMedio.show();
                //ventanaSeletMedio.tabPanelGeneral.getListTemplate().each(function(temp){
                //    temp.getStorePrincipal().load();
                //});
                ventanaSeletMedio.validacionBtn();
                ventanaSeletMedio.aceptarFn = function () {
                    if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                        _this.limpiarComponentesMedio();
                        var recordSeleccionado = ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                        recordSeleccionado.data = recordSeleccionado.json;
                        var descripcionmarcamodelo = ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getTextoMedio();
                        _this.textoMedio.setValue(descripcionmarcamodelo);
                        _this.modelo.producto = descripcionmarcamodelo;
                        _this.idPadreIndicador = recordSeleccionado.data.idpadre;
                        _this.gridFallas.setIdMedio(_this.idPadreIndicador);
                        _this.modelo.idpadreindicador = _this.idPadreIndicador;
                        _this.producto = descripcionmarcamodelo;
                        let idGrid = ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador();
                        if (idGrid == 'indicadores' || idGrid == 'medioscliente') {
                            _this.idIndicador = recordSeleccionado.data.idindicador;
                            _this.modelo.idindicador = _this.idIndicador;
                            _this.modelo.idproducto = null;
                            _this.idProducto = null;
                            if (idGrid == 'medioscliente') {
                                _this.modelo.mediocliente = 1;
                                _this.idPadreIndicador = _this.idIndicador;
                            }
                        } else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            if (recordSeleccionado.data.DatProductoLogistica.CfgPlanificacionMantenimiento.idplanificacionmantenimiento) {
                                // es aqui
                                _this.textoMedio.setValue(recordSeleccionado.data.denominacion);
                                _this.modelo.producto = recordSeleccionado.data.denominacion;
                                _this.producto = recordSeleccionado.data.denominacion;
                                _this.idIndicador = recordSeleccionado.data.DatProductoLogistica.CfgPlanificacionMantenimiento.DatMedio.idindicador;
                                _this.modelo.idindicador = _this.idIndicador;
                                _this.idProducto = recordSeleccionado.data.idregnumerico;
                                _this.modelo.idproducto = _this.idProducto;
                                _this.modelo.iddocumentoorigen = recordSeleccionado.id;
                                _this.idPadreIndicador = _this.idIndicador;
                                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                                _this.modelo.documentoorigen = 5;
                            } else {
                                _this.idIndicador = recordSeleccionado.json.idindicador;
                                _this.modelo.idindicador = _this.idIndicador;
                                _this.idProducto = recordSeleccionado.data.idregnumerico;
                                _this.modelo.idproducto = _this.idProducto;
                                _this.modelo.iddocumentoorigen = recordSeleccionado.data.iddocumento;
                                _this.modelo.iddocumentoorigen = recordSeleccionado.id;
                                _this.modelo.documentoorigen = 5;
                            }
                        } else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            console.log(recordSeleccionado)
                            _this.idIndicador = recordSeleccionado.json.idindicador;
                            _this.modelo.idindicador = _this.idIndicador;
                            _this.idProducto = recordSeleccionado.data.idregnumerico;
                            _this.modelo.idproducto = _this.idProducto;
                            _this.modelo.documentoorigen = 6;
                            //_this.idPadreIndicador = _this.idIndicador;
                            //_this.modelo.iddocumentoorigen = recordSeleccionado.data.iddocumento;
                            // _this.modelo.documentoorigen = 5;
                        }
                        _this.layoutDatosMedio(_this.idPadreIndicador, recordSeleccionado, idGrid);
                    }
                }
            }
        });

        var plugin = new LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor: '100%'
        });
        plugin.getColumn(0).columnWidth = 0.91;
        plugin.getColumn(1).columnWidth = 0.09;
        var panel2 = new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({height: 19}), this.btnMedios]
        });
        plugin.addComponent(this.textoMedio);
        plugin.addComponent(panel2);
        fsTipoMedio.addComponent(plugin);
        this.chbGarantia = new Ext.form.Checkbox({
            name: 'garantia', boxLabel: _this.idioma.cgGarantia,
            listeners: {
                check: function (ch, valor) {
                    if (valor) {
                        if (_this.datosLimpios())
                            _this.btnNuevo.disable();
                        else
                            _this.btnNuevo.enable();
                    }
                }
            }
        });
        fsTipoMedio.addComponent(this.chbGarantia);

        this.gridActividades.valueChbGarantia = !this.chbGarantia.getValue();

        this.datDinamic = new LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        this.datNaturaleza = new LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        var tabDatosMedio = new LOG.util.Panel({
            frame: true,
            title: this.idioma.lbDatosMedio,
            autoScroll: true,
            items: [this.ponerEnColumna(fsTipoMedio)]
        });
        this.columFormMedioDinamico = this.ponerEnColumna(this.datDinamic);
        var tabDinamic = new LOG.util.Panel({
            frame: true,
            title: this.idioma.tlDinamicos,
            autoScroll: true,
            items: [this.columFormMedioDinamico]
        });
        this.columFormMedioNaturaleza = this.ponerEnColumna(this.datNaturaleza);
        var tabNaturaleza = new LOG.util.Panel({
            frame: true,
            title: this.idioma.tlPorNaturaleza,
            autoScroll: true,
            items: [this.columFormMedioNaturaleza]
        });
        this.tabPDatosMedio = new Ext.TabPanel({
            frame: true,
            height: 160,
            autoScroll: true,
            activeTab: 0,
            items: [tabDatosMedio, tabNaturaleza, tabDinamic]
        });
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls1.getColumn(0).labelAlign = '';
        cls1.addComponent(fsContenedor1);
        cls1.addComponent(fsContenedorCliente);
        cls1.addComponent(new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({height: 12})]
        }));
        cls1.addComponent(this.tabPDatosMedio);
        cls1.addComponent(new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({height: 12})]
        }));
        var inferior = new LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var inferior1 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.fallasClienteReport = new Ext.form.TextArea({
            name: 'fallascliente',
            height: 146,
            fieldLabel: this.idioma.lbFallasCliente,
            width: '98%',
            allowBlank: false,
            //allowBlank: (_this.scope.getGridPrincipal().getSelectionModel().getSelected() && _this.scope.getGridPrincipal().getSelectionModel().getSelected().data.documentoorigen == 7) ? true : false,
            validarEnFormBasico: true,
            maxLength: 255,
            minLength: 2,
            listeners: {
                change: function (cb, st) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
            //regex: LOG.util.Regex.cadena,
            //regexText :  _this.idioma.msgexpreAlfaNumRegexText,
        });
        this.comboTecnicoResponsable = new LOG.util.ComboBox({
            //xtype: 'combo',
            name: 'idtecnico',
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarPersonas',
            valueField: 'idpersona',
            displayField: 'nombreapellidos',
            fieldLabel: this.idioma.lbTecnicoDiagnostico,
            validarEnFormBasico: true,
            queryParam: 'criterio',
            mode: 'remote',
            width: '98%',
            allowBlank: true,
            minChars: 3,
            pageSize: 15,
            resizable: true,
            listeners: {
                select: function (cb, st) {
                    //Ext.apply(cb, {valueNotFoundText: st.json.nombreapellidos});
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                    _this.modelo.idtecnico = cb.getValue();
                },
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }

        });
        this.comboTecnicoResponsable.store.on('load', function (store) {
            /*root:data || null,
                fields ['value', 'label']*/
            if (_this.record && _this.record.data.idtecnico || _this.recordOrigen && _this.recordOrigen.idtecnico) {
                _this.comboTecnicoResponsable.setValue(_this.comboTecnicoResponsable.getValue());
            }
            if (_this.recordOrigen && _this.recordOrigen.data.idtecnico) {
                _this.comboTecnicoResponsable.setValue(_this.comboTecnicoResponsable.getValue());
            }
        });
        this.informeTecnico = new Ext.form.TextArea({
            name: 'dictamentecnico',
            fieldLabel: this.idioma.lbInformeTecnico,
            width: '98%',
            allowBlanck: false,
            validarEnFormBasico: true,
            height: 146,
            allowBlank: true,
            maxLength: 255,
            minLength: 2,
            listeners: {
                change: function (cb, st) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
            //regex: LOG.util.Regex.cadena,
            //regexText :  _this.idioma.msgexpreAlfaNumRegexText,
        });
        inferior.addComponent(this.ponerEnColumna(this.comboTecnicoResponsable));
        inferior1.addComponent(this.fallasClienteReport);
        inferior1.addComponent(this.informeTecnico);

        this.gridFallas = new LOG.tall.ordentrabajo.GridFallas({idioma: this.idioma});
        this.gridFallas.init();
        this.fallas = this.gridFallas.view();
        this.fallas.setHeight(400);
        this.fallas.on('addedfallas', function () {
            _this.habilitarBotonesAlModificarGrid();
        });
        this.fallas.on('deletedfallas', function () {
            _this.habilitarBotonesAlModificarGrid();
        });
        var contenFallas = new LOG.util.Panel({
            autoHeight: true,
            items: [this.fallas]
        });

        this.gridReclamaciones = new LOG.tall.ordentrabajo.GridReclamaciones({idioma: this.idioma});
        this.gridReclamaciones.init();
        this.pReclamaciones = this.gridReclamaciones.view();
        this.pReclamaciones.setHeight(400);
        this.gridReclamaciones.getStorePrincipal().on('beforeload', function (st) {
            st.initBaseParams = {id: _this.record.data.iddocumento};
        });
        var contenReclamaciones = new LOG.util.Panel({
            autoHeight: true,
            items: [this.pReclamaciones]
        });
        var tab1P = new LOG.util.Panel({
            frame: true,
            items: [inferior, inferior1],
            title: this.idioma.tlDatosEspecificos,
            autoHeight: true,
            name: 'tab1'
        });
        this.tab2P = new LOG.util.Panel({
            frame: true,
            items: [contenFallas],
            title: this.idioma.tlFallasDetectadas,
            autoHeight: true,
            name: 'tab2'
        });
        this.tab3P = new LOG.util.Panel({
            frame: true,
            items: [contenReclamaciones],
            title: this.idioma.tlReclamaciones,
            autoHeight: true,
            name: 'tab3'
        });

        var ob1 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.otobservacion = new Ext.form.TextArea({
            name: 'otobservacion',
            height: 146,
            // fieldLabel: this.idioma.lbFallasCliente,
            width: '98%',
            allowBlank: true,
            //allowBlank: (_this.scope.getGridPrincipal().getSelectionModel().getSelected() && _this.scope.getGridPrincipal().getSelectionModel().getSelected().data.documentoorigen == 7) ? true : false,
            validarEnFormBasico: true,
            // maxLength: 255,
            minLength: 2,
            // listeners: {
            //     change: function (cb, st) {
            //         if (_this.datosLimpios())
            //             _this.btnNuevo.disable();
            //         else
            //             _this.btnNuevo.enable();
            //     },
            //     'keyup': function (cb, e) {
            //         if (_this.datosLimpios())
            //             _this.btnNuevo.disable();
            //         else
            //             _this.btnNuevo.enable();
            //     }
            // }
        });

        ob1.addComponent(this.otobservacion);

        this.tab4P = new LOG.util.Panel({
            frame: true,
            items: [ob1],
            title: 'Observaciones',
            autoHeight: true,
            name: 'tab4'
        });

        this.tabPanelInferior = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            anchor: '98%',
            items: [tab1P],
            listeners: {
                tabchange: function (p, t) {
                    if (t.name == 'tab2' && !_this.loadFallas && _this.record) {
                        _this.gridFallas.getStorePrincipal().load({params: {idordentrabajo: _this.record.data.iddocumento}});
                        _this.loadFallas = true;
                    }
                    if (t.name == 'tab3' && !_this.loadReclamaciones) {
                        _this.gridReclamaciones.getStorePrincipal().load();
                        _this.loadReclamaciones = true;
                    }
                }
            }
        });
        this.tabPanelInferior.add(this.tab2P);
        this.tabPanelInferior.add(this.tab3P);
        this.tabPanelInferior.add(this.tab4P);

        var contenedorInferior = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        contenedorInferior.addComponent(this.tabPanelInferior);
        this.panelDatos = new LOG.util.Panel({
            name: 'datosPanel',
            frame: true,
            autoScroll: true,
            title: this.idioma.lbPnDatosGenerales,
            width: '98%',
            items: [cls1, new Ext.Panel({height: 10}), contenedorInferior]
        });
        this.tabPDatosMedio.on({
            render: function () {
                _this.maskMedio();
            },
            show: function () {
                _this.maskMedio();
            }
        });
        return this.panelDatos;
    },
    tabGridServiciosTerceros: function () {
        var _this = this;
        this.gridServTerceros = new LOG.util.UITemplate({
            idioma: this.idioma,
            formaVisualizacion: 'panel',
            busquedaBasica: true,
            modoSeleccion: 1,
            autoLoad: false,
            panelBotonesVisible: false,
            dirController: '/logistica/talleres/recepcion/index.php/solicitud',
            urlBusquedaGridPrincipal: 'devolverServios',
            idsolicitud: undefined,
            concepto: 'servicio(s)',
            textBusquedaSimple: 'Denominaci\xf3n',
            initDefaultColumns: function () {
                var _this = this;
                this.addGridColumn({
                    dataIndex: 'idindicador',
                    hidden: true
                });
                this.addGridColumn({
                    dataIndex: 'idservicio',
                    hidden: true
                });
                this.addGridColumn({
                    dataIndex: 'idplansolicitud',
                    hidden: true
                });
                this.addGridColumn({
                    header: this.idioma.cgServicio,
                    width: 200,
                    dataIndex: 'denominacion',
                    default: true
                });
            },
            setIdSolicitud: function (idsolicitud) {
                this.idsolicitud = idsolicitud;
            }
        });
        this.gridServTerceros.init();
        this.serviciosTerceros = this.gridServTerceros.view();
        this.gridServTerceros.getStorePrincipal().on('beforeload', function (st, obj) {
            obj.params = {}
            obj.params = {
                idplansolicitud: _this.gridServTerceros.idsolicitud,
                start: _this.gridServTerceros.getGridPrincipal().initialConfig.bbar.cursor,
                limit: _this.gridServTerceros.getGridPrincipal().initialConfig.bbar.pageSize
            };
        });
        this.tfFacturaTerceros = LOG.util.Prototipos.inputDecimal({
            name: 'factura',
            width: 200,
            enableKeyEvents: true,
            listeners: {
                keyup: function (tf, e) {
                    _this.tfTotalImporte.setValue(tf.getValue());
                    if (_this.modelo.isValidBasico()) {
                        if (_this.record && _this.tfFacturaTerceros.getValue() != _this.record.data.importetotal) {
                            _this.modelo.habilitarBotones();
                        }
                    } else _this.modelo.habilitarBotones(true);
                }
            }
        });
        //this.serviciosTerceros.height = 300;
        this.panelGridServTerceros = new LOG.util.Panel({
            name: 'gridServTercerosPanel',
            frame: true,
            autoScroll: true,
            title: this.idioma.lbPnServiciosTerceros,
            width: '98%',
            items: [this.serviciosTerceros],
            bbar: ['->', new Ext.form.Label({text: 'Factura: '}), '-', this.tfFacturaTerceros]

        });
        return this.panelGridServTerceros;
    },
    cargaInicialDeStores: function () {
        var _this = this;
        this.comboClientes.store.load({
            callBack: function (r) {
                _this.contador++;
                _this.fireEvent('componentescreados');
            }
        });
        this.comboServicio.store.load({
            callBack: function (r) {
                _this.contador++;
                _this.fireEvent('componentescreados');
            }
        });
        this.comboTecnicoResponsable.store.load({
            callBack: function (r) {
                _this.contador++;
                _this.fireEvent('componentescreados');
            }
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.tall.ordentrabajo.VentanaAdicionar.superclass.initDefaultButtons.call(this);
        this.listaBotonesVentana.deleteAll();
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            name: 'confirmar',
            estado: 1,
            // disabled: true,
            isEstadoOrden: false,
            //estadoorden:0,
            condicionEspecial: function () {
                if (_this.record) {
                    // if (_this.record.data.documentoorigen == 3)
                    if (_this.record.data.estado == 1 && _this.record.data.cantactvidades != 0)
                        return true;
                    else return false;
                } else return false;
            },
            handler: function () {
                _this.modelo.confirmar({iddocumento: _this.record.data.iddocumento}, function (r) {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                });
            }
            // controlFn: function (b, _caller) {
            //     if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
            //         b.setVisible(true);
            //     }
            //     else b.setVisible(false);
            //     b.disable();
            //     _caller.fireEvent = _caller.fireEvent.createSequence(function (e) {
            //         if (e == 'show') {
            //             _caller.controlBotones(b, b.estado);
            //         }
            //     });
            // }
        }));

        this.addToolbarButtonVentana(new Ext.Button({
            tooltip: this.idioma.ttBtnCerrarOrden,
            text: this.idioma.lbBtnCerrarOrden,
            iconCls: 'cerrarordendetrabajo',
            isContextual: true,
            disabled: true,
            name: 'cerrar',
            isEstadoOrden: true,
            estadoorden: 0,
            estado: 2,
            condicionEspecial: function () {
                if (_this.record) {
                    if (_this.record.data.estado == 2 && _this.record.data.estadoorden != 1 && _this.record.data.idtecnico != "") {
                        return true;
                    }

                } else return false;
            },
            handler: function () {
                _this.modelo.cerrarOrdenTrabajo({iddocumento: _this.record.data.iddocumento}, function (r) {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RCerrarDocumento')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.fireEvent = _caller.fireEvent.createSequence(function (e) {
                    if (e == 'show') {
                        _caller.controlBotones(b, b.estado);
                    }
                });
            }
        }));

        this.listaBotonesProductos.deleteAll();
    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.tall.ordentrabajo.VentanaAdicionar.superclass.initDefaultColumns.call(this);
        this.listaGridColumnsProductos.deleteAll();
    },
    setEntidad: function (arr) {
        this.idEntidad = arr['identidad'];
    },
    setPersonas: function (arr) {
        this.arrPersonas = arr;
    },
    setArrAreasInternas: function (arr) {
        this.arrAreasInternas = arr;

    },
    setOrigen: function (value) {
        this.origen = value;
    },
    ponerEnColumna: function (elemento) {
        var columna = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        columna.addComponent(elemento);
        return columna;
    },
    definirAltura: function () {
        var alto = this.getHeight() - 126;
        this.panelDatos.setHeight(alto);
        this.panelDatos.doLayout();
        this.panelGridServTerceros.setHeight(alto);
        this.panelGridServTerceros.doLayout();
        this.serviciosTerceros.setHeight(alto - 18);
        this.serviciosTerceros.doLayout();
        var altogrid = (alto - 82) / 2;
        this.materiales.setHeight(altogrid);
        this.materiales.doLayout();
        this.actividades.setHeight(altogrid);
        this.actividades.doLayout();
    },
    onCloseHandler: function (p) {
        var _this = this;
        _this.loadReclamaciones = false;
        _this.loadFallas = false;
        _this.modelo.listaDinamicos.deleteAll();
        _this.modelo.dirtyDinamic = false;
        _this.modelo.idagencia = undefined;
        _this.modelo.idcliente = undefined;
        _this.modelo.idtipoprecio = undefined;
        _this.comboTiposPrecio.setValue();
        _this.comboTiposPrecioMat.setValue();
        _this.modelo.documentoorigen = 0;
        if (_this.fromularioGestion) {
            Ext.apply(_this.comboClientes, { valueNotFoundText: "" });
            Ext.apply(_this.comboCentroCosto, { valueNotFoundText: "" });
            Ext.apply(_this.comboTecnicoResponsable, { valueNotFoundText: '' });
            Ext.apply(_this.comboServicio, { valueNotFoundText: "" });
            Ext.apply(_this.telefonoCliente, { valueNotFoundText: "" });
            Ext.apply(_this.textoCorreoCliente, { valueNotFoundText: "" });

            Ext.apply(_this.nombreResponsable, { valueNotFoundText: "" });
            Ext.apply(_this.carnetResponsable, { valueNotFoundText: "" });
            Ext.apply(_this.telefonoResponsable, { valueNotFoundText: "" });
            Ext.apply(_this.textoCorreoResponsable, { valueNotFoundText: "" });
            _this.modelo.reset();
            _this.modelo.dirtyGrids = false;
            _this.record = null;
            _this.recordOrigen = null;
            _this.atributoidentificador = null;
            _this.setTitle(_this.idioma.tlCrearOrden);
            _this.lbNroDocGenera.setText('');
            _this.comboFechaInicio.setMaxValue(null);
            _this.comboFechaFin.setMinValue(null);
            _this.limpiarComponentesMedio();
            _this.idIndicador = undefined;
            _this.idPadreIndicador = undefined;
            _this.idProducto = undefined;
            _this.producto = undefined;
            _this.origen = undefined;
            _this.listaBotonesVentana.each(function (b) {
                _this.controlBotones(b, b.estado);
            });
            _this.gridMateriales.limpiarListas();
            _this.gridMateriales.setActividad(undefined);
            _this.gridMateriales.limpiarListas();
            _this.gridMateriales.setActividad(undefined);
            _this.gridActividades.setRecordOrden(null);
            _this.gridActividades.limpiarListas();
            _this.gridMateriales.getStorePrincipal().removeAll();
            _this.gridMateriales.getGridPrincipal().getView().refresh();
            _this.gridActividades.getStorePrincipal().removeAll();
            _this.gridActividades.getGridPrincipal().getView().refresh();
            _this.gridServTerceros.getStorePrincipal().removeAll();
            _this.gridMateriales.controlBtnPedido();
            //_this.gridServTerceros.getGridPrincipal().getView().refresh();

        }
        _this.gridFallas.setIdMedio(_this.idPadreIndicador);
        _this.tfTotalImporte.setValue(0);
//        _this.tfTotalImporteCUC.setValue(0);
        if (_this.tfFacturaTerceros) {
            _this.tfFacturaTerceros.setValue(0);
            _this.tfFacturaTerceros.disable();
        }
        if (this.body.isMasked()) {
            this.body.unmask();
        }
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    onResetHandler: function () {
        var _this = this.scope || this;
        _this.loadReclamaciones = false;
        _this.loadFallas = false;
        _this.modelo.listaDinamicos.deleteAll();
        _this.modelo.idagencia = undefined;
        _this.modelo.idcliente = undefined;
        _this.modelo.idtipoprecio = undefined;
        _this.modelo.existiaactividad = undefined;
        _this.comboTiposPrecio.setValue();
        _this.comboTiposPrecioMat.setValue();
        _this.modelo.documentoorigen = 0;
        if (_this.fromularioGestion) {
            Ext.apply(_this.comboClientes, { valueNotFoundText: "" });
            Ext.apply(_this.comboCentroCosto, { valueNotFoundText: "" });
            Ext.apply(_this.comboTecnicoResponsable, { valueNotFoundText: '' });
            Ext.apply(_this.comboServicio, { valueNotFoundText: "" });

            Ext.apply(_this.telefonoCliente, { valueNotFoundText: "" });
            Ext.apply(_this.textoCorreoCliente, { valueNotFoundText: "" });

            Ext.apply(_this.nombreResponsable, { valueNotFoundText: "" });
            Ext.apply(_this.carnetResponsable, { valueNotFoundText: "" });
            Ext.apply(_this.telefonoResponsable, { valueNotFoundText: "" });
            Ext.apply(_this.textoCorreoResponsable, { valueNotFoundText: "" });
            _this.modelo.reset();
            _this.modelo.dirtyGrids = false;
            _this.modelo.dirtyDinamic = false;
            _this.record = null;
            _this.recordOrigen = null;
            _this.atributoidentificador = null;
            _this.tfTotalImporte.setValue(0);
//            _this.tfTotalImporteCUC.setValue(0);
            _this.setTitle(_this.idioma.tlCrearOrden);
            _this.listaBotonesVentana.getItem(0).disable();
            _this.idIndicador = undefined;
            _this.idPadreIndicador = undefined;
            _this.idProducto = undefined;
            _this.producto = undefined;
            _this.origen = undefined;
            _this.comboFechaInicio.setMaxValue(null);
            _this.comboFechaFin.setMinValue(null);
            _this.limpiarComponentesMedio();
            _this.habilitarComponentes();
            _this.lbNroDocGenera.setText('');
            _this.listaBotonesVentana.each(function (b) {
                _this.controlBotones(b, b.estado);
            });
            _this.gridMateriales.getStorePrincipal().removeAll();
            _this.gridActividades.getStorePrincipal().removeAll();
            _this.gridFallas.getStorePrincipal().removeAll();
            _this.gridMateriales.limpiarListas();
            _this.gridMateriales.controlBtnPedido();
            _this.gridActividades.limpiarListas();
            _this.gridMateriales.setActividad(undefined);
            _this.gridActividades.setRecordOrden(null);
            _this.gridMateriales.getGridPrincipal().getView().refresh();
            _this.gridActividades.getGridPrincipal().getView().refresh();
            // _this.gridFallas.getGridPrincipal().getView().refresh();
            if (_this.tfFacturaTerceros) {
                _this.tfFacturaTerceros.setValue(0);
                _this.tfFacturaTerceros.disable();
            }
        }
        _this.gridFallas.setIdMedio(_this.idPadreIndicador);
        _this.btnNuevo.disable();
    },
    onShowHandler: function () {
        LOG.lb.documento.ventanaGestionDocumentos.superclass.onShowHandler.call(this);
        this.gridActividades.getGridPrincipal().initialConfig.bbar.setDisabled(false);
        this.gridMateriales.getGridPrincipal().initialConfig.bbar.setDisabled(false);
        this.gridActividades.deshabilitar();
        this.gridActividades.setRecordOrden(this.record);
        this.gridMateriales.deshabilitar();
    },
    salvarHandlerAcciones: function (actvAdd) {
        var _this = this;
        var parametros = _this.prepararDatosSave(actvAdd);
        _this.modelo.atributoidentificador = _this.modelo.obtenerValorAtrbIdentificador();
        if (_this.record && _this.record.data.documentoorigen == 3 || _this.origen == 2) {
            _this.modelo.importetotal = _this.tfFacturaTerceros.getValue();
//            _this.modelo.importealternativo =  _this.tfFacturaTerceros.getValue();
            parametros.terceros = true;
        } else {
            _this.modelo.importetotal = _this.tfTotalImporte.getValue();
//            _this.modelo.importealternativo = _this.tfTotalImporteCUC.getValue();
        }
        if (_this.comboTiposPrecio && _this.comboTiposPrecio.getValue())
            _this.modelo.idtipoprecio = _this.comboTiposPrecio.getValue();

        if (_this.comboTiposPrecioMat && _this.comboTiposPrecioMat.getValue())
            _this.modelo.idtipopreciomat = _this.comboTiposPrecioMat.getValue();
        _this.modelo.salvar(parametros, function (r) {
            _this.record = _this.record || {};
            Ext.apply(_this.record, {
                data: r.datos
            });
            if (r.datos.nrodocorigen) {
                _this.lbNroDocGenera.setText(_this.idioma.lbNoDocOrigen + ': ' + r.datos.nrodocorigen);
            }

            _this.modelo.iddocumento = _this.record.data.iddocumento;
            _this.gridMateriales.setEstadoDocumento(_this.record.data.estado);
            _this.gridMateriales.controlBtnPedido();
            if (_this.record.data.documentoorigen != 3) {
                _this.gridActividades.despuesDeGuardar();
                _this.gridActividades.setRecordOrden(_this.record);
                _this.gridMateriales.despuesDeGuardar();
            }
            _this.gridFallas.limpiarListas();
            _this.gridFallas.getStorePrincipal().initBaseParams = {idordentrabajo: _this.record.data.iddocumento};
            _this.gridFallas.getStorePrincipal().load();
            _this.loadFallas = true;
            _this.tfTotalImporte.setValue(_this.record.data.importetotal);
//            _this.tfTotalImporteCUC.setValue(_this.record.data.importealternativo);
            if (_this.record && _this.record.data.documentoorigen == 3) {
                _this.tfFacturaTerceros.setValue(_this.record.data.importetotal);
            }
            _this.modelo.dirtyGrids = false;
            _this.listaBotonesVentana.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
            _this.getTitleDocumento(_this.record.data.iddocumento);
            _this.modelo.habilitarBotones(true);
        }, function () {
            _this.gridActividades.limpiarListas();
            _this.gridMateriales.limpiarListas();
            _this.gridFallas.limpiarListas();
        });
        _this.modelo.habilitarBotones(true);
    },
    salvarHandler: function (actvAdd) {
        var _this = this.scope || this;

        if (_this.usatodas == 1) {
            if (_this.comboTiposPrecio.getValue()) {
                _this.salvarHandlerAcciones(actvAdd);
            } else {
                _this.formularioGeneral.setActiveTab(1);
                _this.btnSalvar.disable();
                if (_this.comboTiposPrecio.getValue())
                    _this.btnSalvar.enable();
            }
        } else {
            _this.salvarHandlerAcciones(actvAdd);
        }

    },
    prepararDatosSave: function (actvAdd) {
        var _this = this;
        var parametros = new Array();
        var origen = null;
        if (this.record) {
            origen = this.record.data.documentoorigen;
        } else origen = this.origen + 1;
        parametros[0] = (origen == 3) ? {} : _this.gridActividades.salvarActividades();
        parametros[1] = (origen == 3) ? {} : _this.gridMateriales.salvarMateriales();
        parametros[3] = (origen == 3) ? null : _this.gridActividades.idServicioOld;
        parametros[2] = _this.gridFallas.salvarFallas();
        if (actvAdd) {
            Ext.each(actvAdd, function (act) {
                parametros[0]['actividadesadd'].push(act);

            });
        }
        return parametros;
    },
    cargarProductos: function (parametros) {

    },
    prepareDocModify: function (d) {
        var _this = this;
        if (_this.gridActividades.idServicioOld)
            d.data.idservicio = _this.gridActividades.idServicioOld;
        this.recordOriginal = d;
        _this.gridActividades.idservicio = undefined;
        _this.gridActividades.idServicioOld = undefined;
        Ext.apply(d.data.nomproducto, d.json.descripcionmarcamodelo);
        Ext.apply(d.data.producto, d.json.descripcionmarcamodelo);
        if (this.comboTiposPrecio) {
            if (d.json.idcita) {
                this.comboTiposPrecio.setValue(d.json.idtipoprecioactividad);
            } else {
                this.comboTiposPrecio.setValue(d.json.idtipoprecio);
            }
        }
        if (this.comboTiposPrecioMat) {
            if (d.json.idcita) {
                this.comboTiposPrecioMat.setValue(d.json.idtipopreciopiezas);
            } else {
                this.comboTiposPrecioMat.setValue(d.json.idtipopreciomat);
            }
        }
        //Cita
        if (d.json.idcita) {
            Ext.apply(d.data.nrodocorigen = d.json.numeroref);
            // Ext.apply(d.data.fechainicio = d.data.fechadocumento);
            Ext.apply(d.data.fechainicio = d.data.fechacita);
            Ext.apply(d.data.fechafin = d.data.fechaextimada);
            Ext.apply(d.json.correocliente = d.json.correo);
            Ext.apply(d.json.telefono = d.json.telefono);

            let idservicio = d.data.idservicio;
            idservicio = idservicio.substring(1, idservicio.length - 1);
            Ext.apply(_this.comboServicio, {valueNotFoundText: idservicio});
            /* this.gridActividades.getStorePrincipal().on({
                 'beforeload': function (store) {
                     var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                     store.initBaseParams = {
                       //  idcita: (d.json.idcita) ? d.json.idcita : null,
                        // idservicio: (d.data.idservicio) ? d.data.idservicio : null,
                         limit: limit
                     }
                 }
             });
             this.gridMateriales.getStorePrincipal().on({
                 'beforeload': function (store) {
                     var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                     store.initBaseParams = {
                         idcita: (d.json.idcita) ? d.json.idcita : null,
                         limit: limit
                     }
                 }
             });*/
            // this.modelo.documentoorigen = 7;
            this.modelo.iddocumentoorigen = d.json.idcita;
        }        
        Ext.apply(d.data.idcliente, (d.data.documentoorigen == 3 && d.json.idagencia) ? null : d.data.idcliente);
        if (d.data.idcliente) Ext.apply(_this.comboClientes, { valueNotFoundText: d.data.cliente });
        if (d.data.idcentrocosto) Ext.apply(_this.comboCentroCosto, { valueNotFoundText: d.data.denomcentrocosto });
        if (d.data.idservicio) Ext.apply(_this.comboServicio, { valueNotFoundText: d.data.servicio });

        if (d.data.idcliente) {
            _this.comboClientes.setValue(d.data.idcliente);
            _this.comboClientes.setRawValue(d.data.cliente);
        }

        if (d.data.idcentrocosto) {
            _this.comboCentroCosto.setValue(d.data.idcentrocosto);
            _this.comboCentroCosto.setRawValue(d.data.denomcentrocosto);
        }

        d.json.telefono = (d.json.telefono) ? d.json.telefono : null;
        _this.telefonoCliente.setValue(d.json.telefono);
        d.json.correo = (d.json.correo) ? d.json.correo : null;
        _this.textoCorreoCliente.setValue(d.json.correo);
        d.json.nombreresponsable = (d.json.nombreresponsable) ? d.json.nombreresponsable : null;
        _this.nombreResponsable.setValue(d.json.nombreresponsable);
        d.json.idcarnetresponsable = (d.json.idcarnetresponsable) ? d.json.idcarnetresponsable : null;
        _this.carnetResponsable.setValue(d.json.idcarnetresponsable);
        d.json.telefonoresponsable = (d.json.telefonoresponsable) ? d.json.telefonoresponsable : null;
        _this.telefonoResponsable.setValue(d.json.telefonoresponsable);
        d.json.textocorreoresponsable = (d.json.textocorreoresponsable) ? d.json.textocorreoresponsable : null;
        _this.textoCorreoResponsable.setValue(d.json.textocorreoresponsable);
        _this.otobservacion.setValue(d.json.otobservacion);

        

        this.gridMateriales.setIdCliente(d.data.idcliente);
        if (this.fromularioGestion) {
            this.habilitarComponentes();
            d.data.fechafin = (this.origen == 1 || this.origen == 0) ? null : d.data.fechafin;
            this.fromularioGestion.getForm().loadRecord(d);
            var valor = (d.data.nrodocorigen) ? d.data.nrodocorigen : '';
            this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
            this.limpiarComponentesMedio();
            if (this.origen == 0) {//Solicitud
                this.modelo.documentoorigen = this.origen + 1;
                this.prepareDocPorSolicitud(d);
            } else if (this.origen == 1) {//Inscripcion
                this.modelo.documentoorigen = this.origen + 1;
                this.recordOrigen = d;
                this.idIndicador = d.data.idmedio;
                this.fromularioGestion.getForm().loadRecord(d);
                this.modelo.idcliente = d.data.idcliente;
                //this.modelo.fechainicio = d.data.fechainicio;
                this.comboFechaFin.minValue = this.comboFechaInicio.getValue();
                this.modelo.iddocumentoorigen = d.data.iddocumento;
                var valor = (d.data.nrodoc) ? d.data.nrodoc : '';
                this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
                if (this.arrIndicadores) {
                    this.loadDatosMedioIncripcion();
                    //if(find){

                    // }
                }
                this.deshabilitarPorIncripcion();

            } else if (this.origen == 2) {// Solicitud a terceros
                this.recordOrigen = d;
                this.tfFacturaTerceros.setValue(0);
                this.tfFacturaTerceros.enable();
                var valor = (d.data.nrodoc) ? d.data.nrodoc : '';
                this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
                this.modelo.iddocumentoorigen = d.data.iddocumento;
                this.gridServTerceros.setIdSolicitud(d.data.iddocumento);
                //this.comboFechaInicio.setMinValue(this.recordOrigen.json.
                // );
                if (d.data.idagencia) {
                    this.comboProveedores.store.load();
                    this.comboProveedores.setValue(d.json.idagencia);
                    this.modelo.idcliente = d.json.idagencia;
                    this.modelo.idagencia = null;
                } else {
                    //para poder agregar aal combo
                    this.topicRecord = Ext.data.Record.create([
                        {name: 'idclientesproveedores'},
                        {name: 'nombre'}
                    ]);
                    var entidad = new this.topicRecord({
                        idclientesproveedores: d.json.idestructura,
                        nombre: d.json.entidad
                    });
                    this.comboProveedores.store.removeAll()
                    this.comboProveedores.store.insert(0, entidad);
                    this.comboProveedores.setValue(this.comboProveedores.store.getAt(0).data.idclientesproveedores);
                    this.modelo.idagencia = d.json.idestructura;
                    this.modelo.idcliente = null;
                }
                this.modelo.idindicador = d.data.idindicador;
                this.modelo.idproducto = d.data.idproducto;
                this.modelo.producto = d.json.descripcionmarcamodelo;
                this.textoMedio.setValue(d.json.descripcionmarcamodelo);
                this.producto = d.json.descripcionmarcamodelo;
                this.idProducto = d.data.idproducto;
                this.idIndicador = d.data.idindicador;
                this.modelo.documentoorigen = this.origen + 1;
                if (this.recordOrigen.data.idproducto) {
                    this.idProducto = this.recordOrigen.data.idproducto;
                    this.cargarRegNumericoPorId(this.recordOrigen.data.idproducto);
                } else {
                    if (this.arrIndicadores) {
                        var find = this.loadDatosMedioSolicitud();

                        if (find) {
                            this.layoutDatosMedio(_this.idPadreIndicador);
                        }
                    }
                }
                this.deshabilitarPorSolicitudTerceros();
                this.gridServTerceros.getStorePrincipal().load();
            } else if (this.origen == 4) {//Planificacion de mantenimiento
                this.record = d;
                this.modelo.tipo = 1;
                this.modelo.idplanificacionmantenimiento = d.data.idplanificacionmantenimiento;
                var storeActvPlanif = new Ext.data.Store({
                    url: '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento/cargarActvidadesPlanificadasParaOrden',
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                        id: 'idactividad',
                    }, [
                        {name: 'idordenactividad'},
                        {name: 'idactividad'},
                        {name: 'denominacion'},
                        {name: 'idpadre'},
                        {name: 'arraynorma'},
                    ])
                });
                storeActvPlanif.on({
                    'load': function (st) {
                        _this.gridActividades.adicionarRecords(st.getRange());
                    }
                });
                storeActvPlanif.load({params: {idplanificacionmantenimiento: d.data.idplanificacionmantenimiento}});
                this.tfTotalImporte.setValue(0);
//                this.tfTotalImporteCUC.setValue(0);
                this.textoMedio.setValue(this.record.data.denominacion);
                this.idIndicador = this.record.data.idindicador;
                this.idProducto = this.record.data.idregnumerico;
                this.idPadreIndicador = this.record.data.idpadre;
                this.gridFallas.setIdMedio(this.idPadreIndicador);
                this.producto = this.record.data.denominacion;
                this.modelo.idindicador = this.record.data.idindicador;
                this.modelo.idproducto = this.record.data.idregnumerico;
                this.modelo.idpadreindicador = this.record.data.idpadre;
                this.modelo.producto = this.record.data.denominacion;
                this.layoutDatosMedio(this.idPadreIndicador, d);
                this.deshabilitarPorMantenimiento();
            } else if (this.origen == 5) {//Pedido
                this.record = d;
                this.gridActividades.setOrigen(this.origen - 1);
                this.modelo.documentoorigen = this.origen - 1;
                this.modelo.iddocumentoorigen = d.data.iddocumentoorigen;
                var storeActvPlanif = new Ext.data.Store({
                    url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarServiciosPedido',
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                        id: 'idindicador',
                    }, [
                        {name: 'idordenactividad'},
                        {name: 'idindicador'},
                        {name: 'denominacion'},

                    ])
                });
                storeActvPlanif.on({
                    'load': function (st) {
                        _this.gridActividades.adicionarRecords(st.getRange());
                    }
                });
                storeActvPlanif.load({params: {idpedido: d.data.iddocumentoorigen}});
                this.deshabilitarPorPedido();
            } else {
                this.modelo.loadRecord();
                this.record = d;
                if (d.data.idcliente && !d.data.cliente)
                    this.comboClientes.store.load({
                        params: {idclientesproveedores: d.data.idcliente}, callback: function (resp) {
                            if (resp[0]) {
                                Ext.apply(_this.comboClientes, {valueNotFoundText: resp[0].json.nombre});
                            } else Ext.apply(_this.comboClientes, {valueNotFoundText: 'cliente no encontrado'});
                        }
                    });

                if (d.data.idtecnico)
                    this.comboTecnicoResponsable.store.load({
                        params: {idpersona: d.data.idtecnico}, callback: function (resp) {
                            if (resp[0]) {
                                Ext.apply(_this.comboTecnicoResponsable, {valueNotFoundText: resp[0].json.nombreapellidos});
                            } else Ext.apply(_this.comboTecnicoResponsable, {valueNotFoundText: 'técnico no encontrado'});
                        }
                    });
                if (d.data.idservicio && !d.data.servicio)
                    this.servicio = d.data.idservicio.split(',');
                this.comboServicio.store.load({
                    params: {idservicio: this.servicio}, callback: function (resp) {
                        if (resp[0]) {
                            Ext.apply(_this.comboServicio, {valueNotFoundText: resp[0].json.denominacion});
                        } else Ext.apply(_this.comboServicio, {valueNotFoundText: 'servicio no encontrado'});
                    }
                });
                if (this.comboResponsableMedio && this.record.data.idresponsablemedio) {
                    this.comboResponsableMedio.store.load({
                        params: {idclientesproveedores: this.record.data.idresponsablemedio},
                        callback: function (resp) {
                            _this.comboResponsableMedio.setValue(_this.record.data.idresponsablemedio);
                        }
                    });
                }
                this.gridMateriales.setEstadoDocumento(this.record.data.estado);
                if (this.record.json.idcita) {
                    this.textoMedio.setValue(this.record.json.descripcionmarcamodelo);
                } else {
                    this.textoMedio.setValue(this.record.data.descripcionmarcamodelo);
                }
                this.tfTotalImporte.setValue(this.record.data.importetotal ? this.record.data.importetotal : 0);
//                this.tfTotalImporteCUC.setValue(this.record.data.importealternativo ? this.record.data.importealternativo : 0);
                this.textoMedio.setValue(this.record.data.descripcionmarcamodelo);
                this.idIndicador = this.record.data.idindicador;
                this.idProducto = this.record.data.idproducto;
                this.idPadreIndicador = this.record.data.idpadreindicador;
                this.gridFallas.setIdMedio(this.idPadreIndicador);
                this.producto = this.record.data.descripcionmarcamodelo;
                this.getTitleDocumento(this.record.data.iddocumento);
                this.modelo.cargarDatosMedio({idordentrabajo: this.record.data.iddocumento}, function (resp) {
                    var dinamics = (resp['datos']) ? Ext.decode(resp['datos'].dinamicos) : null;
                    let idGrid = (resp['datos'].mediocliente && resp['datos'].mediocliente == 1) ? 'medioscliente' : null;
                    _this.loadValueDatosMedios(dinamics, idGrid);
                });
                this.gridActividades.setIdServicio(this.record.data.idservicio);
                _this.gridActividades.setRecordOrden(_this.record);
                if (d.data.documentoorigen != 3) {
                    this.gridActividades.getStorePrincipal().load();
                    this.gridMateriales.getStorePrincipal().load();
                } else {
                    this.tfFacturaTerceros.enable();
                    this.tfFacturaTerceros.setValue(this.record.data.importetotal);
                }
                if (this.record.data.tipo == 1) {
                    this.deshabilitarPorMantenimiento();
                }
                if (this.record.data.estado != 1) {
                    if (d.data.documentoorigen == 3) {
                        if (d.json.idagencia) {
                            //para poder agregar al combo
                            this.topicRecord = Ext.data.Record.create([
                                {name: 'idclientesproveedores'},
                                {name: 'nombre'}
                            ]);
                            var entidad = new this.topicRecord({
                                idclientesproveedores: d.json.idagencia,
                                nombre: d.json.agencia
                            });
                            _this.comboProveedores.store.insert(0, entidad);
                            _this.comboProveedores.setValue(this.comboProveedores.store.getAt(0).data.idclientesproveedores);
                            _this.modelo.idagencia = d.json.idagencia;
                            _this.modelo.idcliente = null;
                        } else {
                            _this.comboProveedores.store.load();
                            _this.modelo.idcliente = d.data.idcliente;
                            _this.comboProveedores.setValue(d.data.idcliente);
                            _this.modelo.idagencia = null;
                        }
                        this.deshabilitarPorSolicitudTerceros();
                        this.gridServTerceros.setIdSolicitud(d.json.iddocumentoorigen);
                        this.gridServTerceros.getStorePrincipal().load();
                    } else {
                        this.deshabilitarComponentes(this.record.data.estado);
                    }
                    this.btnSalvar.disable();
                    if (this.comboResponsableMedio) {
                        this.comboResponsableMedio.disable();
                    }
                } else {
                    if (d.data.documentoorigen == 1) {
                        this.deshabilitarPorSolicitud(d.data.estado);
                    } else if (d.data.documentoorigen == 2) {
                        this.deshabilitarPorIncripcion();
                    } else if (d.data.documentoorigen == 3) {
                        if (d.json.idagencia) {
                            //para poder agregar al combo
                            this.topicRecord = Ext.data.Record.create([
                                {name: 'idclientesproveedores'},
                                {name: 'nombre'}
                            ]);
                            var entidad = new this.topicRecord({
                                idclientesproveedores: d.json.idagencia,
                                nombre: d.json.agencia
                            });
                            this.comboProveedores.store.insert(0, entidad);
                            this.comboProveedores.setValue(this.comboProveedores.store.getAt(0).data.idclientesproveedores);
                            _this.modelo.idagencia = d.json.idagencia;
                            _this.modelo.idcliente = null;
                        } else {
                            _this.comboProveedores.store.load();
                            _this.modelo.idcliente = d.data.idcliente;
                            _this.comboProveedores.setValue(d.data.idcliente);
                            _this.modelo.idagencia = null;
                        }
                        _this.deshabilitarPorSolicitudTerceros();
                        _this.gridServTerceros.setIdSolicitud(d.json.iddocumentoorigen);
                        _this.gridServTerceros.getStorePrincipal().load();
                    }
                    if (this.comboResponsableMedio && this.record.data.idresponsablemedio) {
                        this.comboResponsableMedio.enable();
                    }
                }
                this.btnNuevo.hide();
            }
        }
        this.comboFechaFin.minValue = this.comboFechaInicio.getValue();
        this.comboFechaInicio.maxValue = this.comboFechaFin.getValue();
    },
    prepareDocPorSolicitud: function (d) {
        var _this = this;
        this.fromularioGestion.getForm().loadRecord(d);
        this.recordOrigen = d;
        var valor = (d.data.nrodoc) ? d.data.nrodoc : '';
        this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
        //this.comboFechaInicio.setMinValue(this.recordOrigen.json.fecha);
        this.modelo.idtecnico = d.data.idtecnico;
        this.comboTecnicoResponsable.setValue(d.data.idtecnico);
        this.modelo.idcliente = d.data.idcliente;
        this.comboClientes.setValue(d.data.idcliente);
        if (d.data.idcliente)
            this.comboClientes.store.load({
                params: {idclientesproveedores: d.data.idcliente}, callback: function (resp) {
                    if (resp[0]) {
                        Ext.apply(_this.comboClientes, {valueNotFoundText: resp[0].json.nombre});
                    } else Ext.apply(_this.comboClientes, {valueNotFoundText: 'cliente no encontrado'});
                }
            });
        this.modelo.dictamentecnico = d.data.fallostecnicos;
        this.informeTecnico.setValue(d.data.fallostecnicos);
        this.fallasClienteReport.setValue(d.data.falloscliente);
        this.modelo.fallascliente = d.data.falloscliente;
        this.modelo.iddocumentoorigen = d.data.iddocumento;
        this.textoMedio.setValue(this.recordOrigen.json.descripcionmarcamodelo);
        this.producto = this.recordOrigen.json.descripcionmarcamodelo;
        _this.atributoidentificador = (_this.recordOrigen.data.atributoidentificador) ? _this.recordOrigen.data.atributoidentificador : null;
        if (this.recordOrigen.data.idproducto) {
            this.idProducto = this.recordOrigen.data.idproducto;
            this.cargarRegNumericoPorId(this.recordOrigen.data.idproducto);
        } else {
            this.idIndicador = this.recordOrigen.data.idindicador;
            if (this.arrIndicadores) {
                var find = this.loadDatosMedioSolicitud();

                if (find) {
                    this.layoutDatosMedio(_this.idPadreIndicador);
                }
            }

        }
        this.deshabilitarPorSolicitud(1);
    },
    cargarRegNumericoPorId: function (idregnumerico) {
        var _this = this;
        this.storeRegNum.load({
            params: {
                idregnumerico: idregnumerico,
                busquedaavanzada: true/*, idestructura: _this.idEntidad*/
            }
        });
    },
    getTitleDocumento: function (iddocumento) {
        var _this = this;
        this.modelo.cargaInicial({
            url: '/logistica/utiles/documento/index.php/documentologistica/cargarEncabezado',
            iddocumento: iddocumento
        }, function (datos) {
            var encabezado = datos[0];
            _this.record.data.estado = encabezado.estado;
            encabezado.estado = LOG.lb.documento.Estado[encabezado.estado];
            if (_this.isVisible()) {
                _this.setTitle(encabezado.tipo + _this.idioma.lbSignoNumero + encabezado.numero + _this.idioma.lbDel
                    + encabezado.fecha + _this.idioma.lbEn + encabezado.estado);
            }
            _this.listaBotonesVentana.each(function (b) {
                _this.controlBotones(b, b.estado);
            });
            if (_this.record.data.estado != 1) {
                _this.deshabilitarComponentes(_this.record.data.estado);
            }
            _this.modelo.habilitarBotones(true);
        });
    },
    controlBotones: function (b, status) {
        var _caller = this;
        b.disable();
        if (_caller.record) {
            if (_caller.record.data.iddocumento && _caller.record.data.estado == status) {
                if (b.isEstadoOrden) {
                    if (b.estadoorden == _caller.record.data.estadoorden) {
                        if (b.condicionEspecial()) {
                            b.enable();
                        } else b.disable();
                    } else b.disable();
                } else {
                    if (b.condicionEspecial()) {
                        b.enable();
                    } else b.disable();
                }
            }
        }
    },
    setMonedasEntidad: function (datos) {
        this.monedasEntidad = datos;
    },
    setMonedasEntidadAlternativa: function (datos) {
        this.monedasEntidadAlternativa = datos;
    },
    habilitarBotonesAlModificarGrid: function () {
        var _this = this;
        _this.modelo.dirtyGrids = true;
        if (_this.modelo.isValid()) {
            _this.modelo.habilitarBotones();
        } else
            _this.modelo.habilitarBotones(true);
    },
    actualizarImporteTotal: function (resta, suma) {
        resta = (resta) ? resta : 0;
        suma = (suma) ? suma : 0;
        var total = this.tfTotalImporte.getValue();
        var valor = ((total - resta + suma) > 0) ? total - resta + suma : 0;
        this.tfTotalImporte.setValue(valor);
    },
//    actualizarImporteTotalCUC: function (resta, suma) {
//        resta = (resta) ? resta : 0;
//        suma = (suma) ? suma : 0;
//        var total = this.tfTotalImporteCUC.getValue();
//        var valor = ((total - resta + suma) > 0) ? total - resta + suma : 0;
//        this.tfTotalImporteCUC.setValue(valor);
//    },
    deshabilitarComponentes: function (estado) {
        this.comboFechaInicio.enable();
        this.comboFechaFin.enable();

        this.comboServicio.disable();

        this.telefonoCliente.disable();
        this.textoCorreoCliente.disable();
        this.nombreResponsable.disable();
        this.carnetResponsable.disable();
        this.telefonoResponsable.disable();
        this.textoCorreoResponsable.disable();
        //this.comboClientes.disable();
        if (estado > 2) {
			this.fallasClienteReport.disable();
            this.otobservacion.disable();  
        }
        if (estado > 2) {
            this.comboTecnicoResponsable.disable();
            this.informeTecnico.disable();
        }
        //this.chbGarantia.disable();
        this.btnMedios.disable();
        if (estado != 1 && estado != 2) {
            this.gridActividades.deshabilitar(1);
            this.gridMateriales.deshabilitar();
            this.gridFallas.deshabilitar();
            this.comboFechaInicio.disable();
            this.comboFechaFin.disable();
        } else if (estado == 2) {
            //this.gridActividades.deshabilitar(0);
            this.gridFallas.deshabilitar();
        }
        this.gridMateriales.setEstadoDocumento(estado);
        if (estado == 1) {
            this.comboCentroCosto.enable();
        } else {
            this.comboCentroCosto.disable();
            this.comboCentroCosto.disable();
        }
        if (estado != 9) {
            this.comboClientes.enable();
            this.chbGarantia.enable();
        } else {
            this.comboClientes.disable();
            this.chbGarantia.disable();
        }

    },
    habilitarComponentes: function () {
        /*if (contratoObligatorio) {
            this.comboClientes.disable();
        } else {
            this.comboClientes.enable();
        }*/
        this.comboClientes.show();
        this.comboClientes.enable();
        this.comboServicio.enable();
        this.comboServicio.show();
        this.comboCentroCosto.enable();
        this.comboCentroCosto.show();
        this.comboProveedores.hide();
        this.comboFechaInicio.enable();
        this.comboFechaFin.enable();
        this.fallasClienteReport.enable();
        this.fallasClienteReport.show();
        this.otobservacion.enable();
        this.comboTecnicoResponsable.enable();
        this.informeTecnico.enable();
        this.textoMedio.enable();
        this.btnMedios.enable();
        this.chbGarantia.enable();
        this.telefonoCliente.enable();
        this.textoCorreoCliente.enable();
        this.nombreResponsable.enable();
        this.carnetResponsable.enable();
        this.telefonoResponsable.enable();
        this.textoCorreoResponsable.enable();
        this.gridMateriales.habilitar();
        this.gridMateriales.setEstadoDocumento(1);
        this.gridActividades.habilitar();
        this.gridFallas.habilitar();
        this.formularioGeneral.unhideTabStripItem(1);
        this.formularioGeneral.hideTabStripItem(2);
        // this.comboFechaInicio.setMinValue();
    },
    deshabilitarPorSolicitudTerceros: function () {
        //this.comboClientes.disable();
        this.comboClientes.hide();
        this.comboProveedores.show();
        this.comboServicio.disable();
        this.comboServicio.hide();
        this.comboCentroCosto.disable();
        this.comboCentroCosto.hide();
        this.btnMedios.disable();
        this.telefonoCliente.disable();
        this.textoCorreoCliente.disable();
        this.nombreResponsable.disable();
        this.carnetResponsable.disable();
        this.telefonoResponsable.disable();
        this.textoCorreoResponsable.disable();
        this.formularioGeneral.hideTabStripItem(1);
        this.formularioGeneral.unhideTabStripItem(2);
        if (this.record && this.record.data.documentoorigen == 3 && this.record.data.estado == 9) {
            this.tfFacturaTerceros.disable();
        }
    },
    deshabilitarPorSolicitud: function (estado) {
        estado = (estado) ? estado : 1;
        this.comboTecnicoResponsable.disable();
        if (estado > 2) {
            //this.comboClientes.disable();
            this.informeTecnico.disable();
        }
        this.fallasClienteReport.disable();
        this.btnMedios.disable();
        //this.chbGarantia.disable();
    },
    deshabilitarPorIncripcion: function () {
        //this.comboClientes.disable();
        this.textoMedio.disable();
        this.btnMedios.disable();
        //this.comboFechaInicio.disable();
    },
    deshabilitarCamposDinamicos: function () {
        this.formDatosMedio.getForm().items.each(function (field) {
            if (field.isFormField) {
                field.disable();
            }
        });
    },
    deshabilitarPorMantenimiento: function () {
        this.fallasClienteReport.disable();
        this.fallasClienteReport.hide();
        this.textoMedio.disable();
        this.btnMedios.disable();
    },
    deshabilitarPorPedido: function () {
        this.fallasClienteReport.disable();
        this.fallasClienteReport.hide();
        this.textoMedio.disable();
        this.btnMedios.disable();
        this.comboServicio.disable();
        this.chbGarantia.disable();
        this.telefonoCliente.disable();
        this.textoCorreoCliente.disable();
        this.nombreResponsable.disable();
        this.carnetResponsable.disable();
        this.telefonoResponsable.disable();
        this.textoCorreoResponsable.disable();
    },
    crearTextDinamico: function (obj) {
        var _this = this;
        var campoTexto = undefined;
        obj.labelM = obj.label;
        if (obj.identificador == 1) {
            obj.labelM = '<span style="color:#008000">' + obj.label + '(identificador):</span>';
        }
        obj.name = (obj.name) ? obj.name : obj.nombretabla;
        console.log(obj)
        if (obj.tipocomp == 5) {
            campoTexto = new Ext.form.TextField({
                name: (obj.name) ? obj.name : obj.nombretabla,
                labelSeparator: (obj.identificador == 1) ? '' : ':',
                tabular: false,
                fieldLabel: obj.labelM,
                etiqueta: obj.label,
                identificador: obj.identificador,
                dinamico: false,
                allowBlank: false,
                enableKeyEvents: true,
                autoLoad: true,
                maxLength: (obj.longitud) ? obj.longitud : 50,
                maxLength: 50,
                maxLengthText: 50,
                maxLengthText: _this.idioma.msgErrortext((obj.longitud) ? obj.longitud : 50),
                regex: (_this.esMatricula(obj.label)) ? LOG.util.Regex.matriculaAll : LOG.util.Regex.general,
                regexText: (_this.esMatricula(obj.label)) ? _this.idioma.msgErrorMatricula : _this.idioma.msgexpreAlfaNumRegexText,
                listeners: {
                    keyup: function () {
                        _this.modelo.dirtyDinamic = true;

                    },
                    keypress: function (e) {
                        var venta = new LOG.tall.ordentrabajo.GridDinamicos({
                            idioma: _this.idioma,
                        });
                        venta.init();
                        venta.view();
                        venta.getStorePrincipal().load();
                        venta.getVistaPrincipal().aceptarFn = function () {
                            var Selected = venta.getGridPrincipal().getSelectionModel().getSelected();
                            if (Selected) {
                                Selected.data = Selected.json;
                                e.setValue(Selected.data.mod_datosmaestrosmeta_nom_tnu_3_denominaciontnu_3);
                                var attrdinamico = Selected.data.mod_datosmaestrosmeta_nom_tnu_3_denominaciontnu_3
                                _this.modelo.listaDinamicos.arrayData[0].num_1 = attrdinamico;
                            } else mostrarMensaje(2, 'Debe seleccionar el atributo.')


                        }
                    }

                }
            });
        } else {
            switch (obj.tipocomp) {
                case '1':
                    campoTexto = new LOG.util.Prototipos.inputDecimal({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        fieldLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        allowBlank: false,
                        enableKeyEvents: true,
                        tipo: 1,
                        listeners: {
                            keyup: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });
                    if (obj.longitud) {
                        Ext.apply(campoTexto, {
                            maxLength: obj.longitud,
                            maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.'
                        });
                    }
                    break;
                case '2':
                    campoTexto = new Ext.form.Checkbox({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        boxLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        enableKeyEvents: true,
                        tipo: 2,
                        listeners: {
                            change: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });
                    break;
                case '3':
                    campoTexto = new Ext.form.DateField({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        fieldLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        enableKeyEvents: true,
                        allowBlank: false,
                        editable: false,
                        format: 'd/m/Y',
                        tipo: 3,
                        setValue: function (date) {
                            if (date.substring)
                                date = date.substring(0, 10);
                            return Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
                        },
                        listeners: {
                            select: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });
                    break;
                default :
                    obj.longitud = (_this.esMatricula(obj.label)) ? 7 : obj.longitud;
                    campoTexto = new LOG.util.Prototipos.inputTexto({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        fieldLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        allowBlank: false,
                        enableKeyEvents: true,
                        maxLength: (obj.longitud) ? obj.longitud : 50,
                        maxLengthText: _this.idioma.msgErrortext((obj.longitud) ? obj.longitud : 50),
                        regex: (_this.esMatricula(obj.label)) ? LOG.util.Regex.matriculaAll : LOG.util.Regex.general,
                        regexText: (_this.esMatricula(obj.label)) ? _this.idioma.msgErrorMatricula : _this.idioma.msgexpreAlfaNumRegexText,
                        listeners: {
                            keyup: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });

                    break;
            }
        }


        return campoTexto;
    },
    layoutDatosMedio: function (idindicador, record, idGrid) {
        var _this = this;
        _this.maskMedio();
        //es este
        _this.modelo.cargarAtributosMedios(idindicador, function (val) {
            var cantidadNat = (val['datos'].naturaleza) ? val['datos'].naturaleza.length : 0;
            var cantidadDinam = val['datos'].dinamicos.length;
            if (cantidadNat > 0) {
                var listCheksNaturaleza = new LOG.util.List();
                _this.tabPDatosMedio.setActiveTab(1);
                Ext.each(val['datos'].naturaleza, function (t) {
                    t.name = (t.name) ? t.name : t.idatributonaturaleza;
                    t.label = (typeof t.label !== 'undefined') ? t.label : t.denominacion;
                    if (t.tipocomp != 2) {
                        var text = _this.crearTextDinamico(t);
                        _this.datNaturaleza.addComponent(text);
                        //if (text.identificador == 1 && _this.origen == 2) {
                        if (text.identificador == 1 && _this.atributoidentificador) {
                            text.setValue(_this.atributoidentificador);
                            text.disable();
                        }
                        if (text.identificador == 1) {
                            _this.campoIdentificador = text;
                        }
                        if (t.disabled) {
                            text.disable();
                        }
                    } else listCheksNaturaleza.add(t);
                });
                listCheksNaturaleza.each(function (t) {
                    var text = _this.crearTextDinamico(t);
                    _this.datNaturaleza.addComponent(text);
                });
                _this.tabPDatosMedio.unhideTabStripItem(1);
            }
            else if (cantidadDinam > 0) {
                var listCheksDinamicos = new LOG.util.List();
                _this.tabPDatosMedio.setActiveTab(2);
                Ext.each(val['datos'].dinamicos, function (t) {
                    if (t.tipocomp != 2) {
                        var text = _this.crearTextDinamico(t);
                        text.dinamico = true;
                        text.idtabla = t.idtabla;
                        _this.datDinamic.addComponent(text);
                        //if (text.identificador == 1 && _this.origen == 2) {
                        if (text.identificador == 1 && _this.atributoidentificador) {
                            text.setValue(_this.atributoidentificador);
                            text.disable();
                        }
                        if (text.identificador == 1) {
                            _this.campoIdentificador = text;
                        }
                        if (t.disabled) {
                            text.disable();
                        }
                        if (t.value) {
                            text.setValue(t.value);
                        }
                    } else {
                        listCheksDinamicos.add(t);
                    }

                });

                listCheksDinamicos.each(function (t) {
                    var text = _this.crearTextDinamico(t);
                    text.dinamico = true;
                    _this.datDinamic.addComponent(text);
                });
                _this.tabPDatosMedio.unhideTabStripItem(2);
            }
            if (cantidadNat > 0 || cantidadDinam > 0) {
                _this.datDinamic.doLayout();
                _this.tabPDatosMedio.setActiveTab(2);
                _this.datNaturaleza.doLayout();
                _this.tabPDatosMedio.setActiveTab(1);
                _this.tabPDatosMedio.setActiveTab(0);
                _this.formDatosMedio = LOG.util.UIManager.initForm({
                    items: [_this.columFormMedioDinamico.getColumn(0), _this.columFormMedioNaturaleza.getColumn(0)]
                });

                if (_this.record && _this.record.data.estado != 1) {
                    _this.deshabilitarCamposDinamicos();
                }
                _this.modelo.bindFormMedio(_this.formDatosMedio);
                _this.fireEvent('dinamicoscreados', record);
                _this.formDatosMedio.getForm().isValid();
                _this.datDinamic.doLayout();
            } else
                mostrarMensaje(1, _this.idioma.msjNoAtributosConfigurados);
            if (_this.tabPDatosMedio.body.isMasked()) {
                _this.tabPDatosMedio.body.unmask();
            }
            if (_this.body.isMasked()) {
                _this.body.unmask();
            }
        }, null, idGrid, (idGrid == 'tallaft' ? record.json.idregnumerico : false));
    },
    limpiarComponentesMedio: function () {
        this.modelo.formBasicMedio.deleteAll();
        this.datNaturaleza.items.each(function (e, p) {
            e.removeAll();
        });
        this.datNaturaleza.columnaActual = 1;
        this.datDinamic.items.each(function (e, p) {
            e.removeAll();
        });
        this.datDinamic.columnaActual = 1;
        if (this.tabPDatosMedio.getComponent(1)) {
            this.tabPDatosMedio.hideTabStripItem(1);
        }
        if (this.tabPDatosMedio.getComponent(2)) {
            this.tabPDatosMedio.hideTabStripItem(2);
        }
    },
    findIndicador: function () {
        var _this = this;
        var param = {};
        param['explotacion'] = 1;
        this.storeIndicadores = new Ext.data.Store({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            baseParams: param,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idpadre'
            }, [
                {name: 'idindicador'},
                {name: 'idpadre'},
                {name: 'descripcionmarcamodelo'},
                {name: 'codigo'},
            ])
        });
        this.storeIndicadores.on('load', function (st, records) {
            if (records.length > 0) {
                _this.arrIndicadores = records;
            }
            _this.fireEvent('indicadorescargados');
        });
        this.storeIndicadores.load();
    },
    loadDatosMedioIncripcion: function () {
        var _this = this;
        var find = false;
        var storeMedios = new Ext.data.Store({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idindicador',
            }, [
                {name: 'idindicador'},
                {name: 'idpadre'},
                {name: 'descripcionmarcamodelo'},
                {name: 'codigo'}
            ])
        });
        storeMedios.load({
            params: {idindicador: _this.recordOrigen.data.idmedio}
            , callback: function (res) {
                var record = res[0];
                find = true;
                _this.idPadreIndicador = record.data.idpadre;
                _this.gridFallas.setIdMedio(_this.idPadreIndicador);
                _this.producto = record.data.descripcionmarcamodelo;
                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                _this.modelo.idindicador = _this.idIndicador;
                _this.modelo.idProducto = null;
                _this.textoMedio.setValue(record.data.descripcionmarcamodelo);
                _this.modelo.producto = _this.producto;
                _this.loadValueDatosMedios(Ext.decode(_this.recordOrigen.data.datosmedio));
            }
        });
    },
    loadDatosMedioSolicitud: function () {
        var _this = this;
        var find = false;
        Ext.each(this.arrIndicadores, function (record) {
            if (_this.recordOrigen.data.idindicador == record.data.idindicador) {
                find = true;
                _this.idPadreIndicador = record.id;
                _this.gridFallas.setIdMedio(_this.idPadreIndicador);
                _this.producto = record.data.descripcionmarcamodelo;
                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                _this.modelo.idindicador = _this.idIndicador;
                _this.modelo.idProducto = null;
                _this.textoMedio.setValue(record.data.descripcionmarcamodelo);
                _this.modelo.producto = _this.producto;
                _this.atributoidentificador = (_this.recordOrigen.data.atributoidentificador) ? _this.recordOrigen.data.atributoidentificador : null;
                _this.modelo.atributoidentificador = (_this.recordOrigen.data.atributoidentificador) ? _this.recordOrigen.data.atributoidentificador : null;
            }
        });

        return find;
    },
    loadValueDatosMedios: function (dinamics, idGrid) {
        var _this = this;
        var map = [];
        var valores = {};
        this.modelo.listaDinamicos.deleteAll();
        Ext.each(dinamics, function (obj, pos) {
            map[pos] = {name: obj.name};
            valores[obj.name] = obj[obj.name];
            _this.modelo.listaDinamicos.add(obj);
        });
        var MapRecord = Ext.data.Record.create(map);
        var recordMedio = new MapRecord(valores);
        _this.layoutDatosMedio((idGrid) ? _this.idIndicador : _this.idPadreIndicador, recordMedio, idGrid);
    },
    maskMedio: function () {
        this.tabPDatosMedio.body.mask('Cargando...');
        this.btnSalvar.disable();
    },
    ocultarColumna: function () {
        //Redefinida porque la del padre da el gridDetalle indefinido y no abre la ventana
    },
    /**
     *
     * @param {type} idAccion
     * @returns {Boolean|Array.grantedAction.existe}
     */
    grantedAction: function (idAccion) {
        var existe = false;
        this.listaAcciones.each(function (a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    esMatricula: function (cadena) {
        if (cadena.indexOf('matricula') != -1 || cadena.indexOf('matrícula') != -1 || cadena.indexOf('matr\u00edcula') != -1) {
            return true;
        }
        return false;
    },
    datosLimpios: function () {
        var _this = this;
        if (this.comboServicio.getRawValue() || (this.comboClientes && this.comboClientes.getRawValue())
            || (this.comboProveedores && this.comboProveedores.getRawValue()) || this.comboFechaInicio.getValue()
            || this.comboFechaFin.getValue() || (this.comboCentroCosto && this.comboCentroCosto.getRawValue())
            || this.textoMedio.getValue()|| this.telefonoCliente.getValue() || this.textoCorreoCliente.getValue()
            || this.nombreResponsable.getValue() || this.carnetResponsable.getValue() || this.telefonoResponsable.getValue()
            || this.textoCorreoResponsable.getValue()|| this.comboTecnicoResponsable.getRawValue()
            || this.gridFallas.getStorePrincipal().getCount() > 0 || this.fallasClienteReport.getValue()
            || this.informeTecnico.getValue() || this.chbGarantia.getValue() || this.otobservacion.getValue()
        ) {
            return false;
        } else return true;
    },
    showContratos: function(){
        var _this = this;
        _this.windowContratos = new LOG.tall.contratos({
            idioma: _this.idioma,
            usarAplicar: false,
            title: _this.idioma.titlecontrato,
            idcliente: _this.comboClientes.getValue(),
            _parent: _this
        });
        _this.windowContratos.pGdList.getGridPrincipal().on('rowdblclick', function(g) {
            _this.windowContratos.aceptarFn();
            _this.windowContratos.close();
        });
        _this.windowContratos.show();

        _this.windowContratos.aceptarFn = function() {
            var contrato = _this.windowContratos.pGdList.getSmPrincipal().getSelected();
            _this.comboClientes.getStore().load({
                params:{
                    limit: null
                },
                callback: function(st){
                    _this.comboClientes.setValue(contrato.json.idclienteproveedor);
                    _this.comboClientes.fireEvent('select', _this.comboClientes,
                        _this.comboClientes.getStore().getById(contrato.json.idclienteproveedor),
                        _this.comboClientes.getStore().indexOfId(contrato.json.idclienteproveedor));
                }
            });
            //_this.comboClientes.setDisabled(true);
            //_this.fechaContrato.setValue(contrato.json.fechafirma);
            _this.idcontrato = contrato.json.idcontrato;

            _this.txtNroContrato.setValue(contrato.json.numerocontrato);
            _this.txtNroContrato.setRawValue(contrato.json.numerocontrato);
            _this.txtNroContrato.fireEvent('change', _this.txtNroContrato,
                contrato.json.numerocontrato,
                _this.txtNroContrato.originalValue);
        };
    }
});

LOG.tall.ordentrabajo.GridMateriales = Ext.extend(LOG.util.UITemplate, {
    /**
     * listado con los materiales que elimina el usuario
     */
    listaEliminados: undefined,
    /**
     * listado de los materiales adicionados por el usuario y los modificados
     */
    listaAdicionados: undefined,
    /**
     * prototipo del record a crear
     */
    topicRecord: undefined,
    /**
     * columnas que se crean a partir de los tipos de moneda
     */
    columnasDinamicas: undefined,
    /**
     * false: los botones se mantienen deshabilitados, true: se pueden habilitar
     */
    habilitado: true,
    /**
     * identificador de la actividad seleccionada.
     */
    idActividad: undefined,
    /**
     * lista con los ids de las actividades q se han eliminado y q podrian haber eliminado algun material.
     */
    listActvElim: undefined,
    estado: undefined,
    monedaContable: undefined,
    idCliente: undefined,
    comboTiposPrecio: undefined,
    almacenado: undefined,
    operariosVarios: undefined,
    constructor: function (config) {
        var _this = this;
        this.modoSeleccion = 2;
        this.autoLoad = false;
        this.gridEditable = true;
        this.listaAdicionados = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
        this.listActvElim = new LOG.util.List();
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarMaterialesOrden';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.GridMateriales.superclass.constructor.call(this, config);
        Ext.apply(Ext.grid.CheckColumn.prototype, {
            onMouseDown: function (e, t) {
                if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
                    e.stopEvent();
                    var index = this.grid.getView().findRowIndex(t);
                    var record = this.grid.store.getAt(index);
                    if ((record.data[this.dataIndex] == 1 && record.data.estado == 1 || record.data.estado != 1) && _this.grantedAction('AprMat')) {
                        record.set(this.dataIndex, record.data[this.dataIndex] == 0 ? true : false);
                        this.grid.getSelectionModel().selectRow(index);
                        this.grid.fireEvent('afteredit', {
                            field: this.dataIndex,
                            grid: this.grid,
                            originalValue: !record.data[this.dataIndex],
                            record: record,
                            row: index,
                            value: record.data[this.dataIndex]
                        });
                    }
                    return record;
                }
            },
            renderer: function (v, p, record) {
                p.css += ' x-grid3-check-col-td';
                return '<div class="x-grid3-check-col' + ((v == 1) ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
            }
        });
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idmaterial',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'porplan',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'estado',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idactividad',
            hidden: true
        });
        /*this.cmbOperacion = new LOG.util.ComboBox({
            mode: 'local',
            store:new Ext.data.SimpleStore({
                fields: ['idoperacionm', 'operacion'],
                data: [
                    [1, this.idioma.lbReservarMaterial],
                    [2, this.idioma.lbSolicitarMaterial]
                ]
            }),
            hiddenName: 'idoperacionm',
            valueField: 'idoperacionm',
            displayField: 'operacion',
            editable: false,
            emptyText: this.idioma.lbSeleccione,
            allowBlank: false,
            listeners: {
                'select': function (cb, record) {
                    var datos = Array();
                    var rec = _this.getSmPrincipal().getSelected();
                    rec.data.idoperacionm = record.data.idoperacionm;
                    rec.data.operacion = record.data.operacion;
                    datos.push(rec.data);
                    _this.getVistaPrincipal().fireEvent('addedmaterial', _this.getStorePrincipal(), datos);
                }
            }
        });
        this.addGridColumn({
            dataIndex: 'operacion',
            header: this.idioma.cgOperMateriales,
            width: 120,
            editor: this.cmbOperacion,
            renderer: function (val) {
                if (val == 1)
                    return _this.idioma.lbReservarMaterial;
                if (val == 2)
                    return _this.idioma.lbSolicitarMaterial;
                return val;
            }
        });*/
        this.addGridColumn({
            dataIndex: 'denominacionactividad',
            header: 'denominacionactividad',
            hidden: true,
            agrupador: this.operariosVarios,
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 120
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            width: 260,
            id: 'denominacionM',
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idunidadmedida',
            hidden: true
        });
        var checkColumn = new Ext.grid.CheckColumn({
            header: 'Aprobado',
            dataIndex: 'aprobado',
            width: 70,
            // default: true
        });
        this.addGridPlugin(checkColumn);
        this.addGridColumn(checkColumn);
        var mostrarCheckColumnNoAplicarGastoATrabajador = (_this.grantedAction('RAGT') && _this.operariosVarios);
        var checkColumnNoAplicarGastoATrabajador = new Ext.grid.CheckColumn({
            header: 'No aplicar gasto a T.',
            dataIndex: 'noaplicargastoatrabajador',
            width: 70,
            hidden: !mostrarCheckColumnNoAplicarGastoATrabajador,
            hideable: mostrarCheckColumnNoAplicarGastoATrabajador,
        });
        this.addGridPlugin(checkColumnNoAplicarGastoATrabajador);
        this.addGridColumn(checkColumnNoAplicarGastoATrabajador);
        this.addGridColumn({
            header: this.idioma.cgUM,
            dataIndex: 'nomunidamedida',
            width: 70,
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'cantidad',
            header: this.idioma.cgCantidad,
            align: 'right',
            width: 100,
            //default: true,
            editor: new LOG.util.Prototipos.inputDecimal({
                minValue: 0.000001
            })
        });
        this.addGridColumn({
            dataIndex: 'cantidadreal',
            align: 'right',
            header: this.idioma.cgReal,
            width: 100,
            //default: true,
            editor: new LOG.util.Prototipos.inputDecimal({
                minValue: 0,
                validateValue: function (val) {
                    if (_this.getSmPrincipal() && _this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.cantidad < val) {
                        return false;
                    }
                    return true;
                },
                listeners: {
                    keyup: function (tf) {
                        tf.validateValue(tf.getValue());
                    }
                }
            })
        });
        this.addGridColumn({
            header: this.idioma.cgExistencia,
            dataIndex: 'existencia',
            hidden: true
            //default:true
        });
        var cod = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'precio',
            align: 'right',
        });
        this.addGridColumn({
            dataIndex: 'importecup',
            align: 'right',
            header: _this.idioma.cgImporte + " " + cod,
            width: 100,
            //default: true
        });
        var ocultar = (monedaAlternativa != '') ? false : true;
        var codAlt = (monedaAlternativa) ? monedaAlternativa : "";
        this.addGridColumn({
            dataIndex: 'precioalternativo',
            align: 'right',
        });
        this.addGridColumn({
            dataIndex: 'importecuc',
            align: 'right',
            header: _this.idioma.cgImporte + ' ' + codAlt,
            width: 100,
            hidden: ocultar,
            //default: true
        });
        if (typeof ORDEN_ENTIDADES !== 'undefined') {
            this.addGridColumn({
                header: 'Entidad',
                dataIndex: 'entidad',
                width: 220
            });
            this.addGridColumn({
                dataIndex: 'idestructuracomun'
            });
        }
        this.addGridColumn({
            header: 'Dep\xf3sito',
            dataIndex: 'deposito',
            width: 220
        });
        this.addGridColumn({
            dataIndex: 'iddeposito'
        });
        /* if(existeINV) {
         this.addGridColumn({
         header: this.idioma.cgNroVale,
         dataIndex: 'nrosvales',
         default: true,
         renderer: function (val) {
         if (!val) {
         return 'no generado';
         }
         else return val;
         }
         });
         }
         else {*/
        this.addGridColumn({
            header: this.idioma.cgDocGenerado,
            dataIndex: 'nrosvales',
            //default: true,
            editor: new LOG.util.Prototipos.inputTexto({}),
            renderer: function (val) {
                if (!val) {
                    return 'no generado';
                } else return val;
            }
        });
        // }
        this.checkCapacidadLiquida = new LOG.grid.CheckColumn({
            header: this.idioma.cgCapacidadLiquida,
            dataIndex: 'capacidadliquida',
            align: 'center',
            rowSelection: true,
            value: false
        });
        this.addGridPlugin(this.checkCapacidadLiquida);
        this.addGridColumn(this.checkCapacidadLiquida);

        this.addGridColumn({
            dataIndex: 'ignorarexistencia',
            default: true,
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'datosmoneda',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        /*this.addGridColumn({
            dataIndex: 'idoperacionm',
            hidden: true
        });*/
        var temp = new Array();
        this.listaColumnas.each(function (col, pos) {
            var obj = {'name': col.dataIndex};
            temp[pos] = obj;
        });
        this.topicRecord = Ext.data.Record.create(temp);
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            text: LOG.util.Idioma.lbBtnAdicionar,
            disabled: (aperturadoFAC && _this.grantedAction('RIntegrarFac')) ? true : false,
            actvSelected: false,
            tooltip: this.idioma.ttBtnAdicionarProducto,
            handler: function () {
                if (_this.idActividad) {  //si está seleccionada la actv en la que se va a utilizar el material.
                    var idsExcluir = new Array();
                    _this.getStorePrincipal().each(function (r, pos) {
                        if (_this.idActividad == r.data.idactividad) {//si el material ya esta asociado a la actv
                            idsExcluir[pos] = r.data.idproducto;    //se excluye
                        }
                    });
                    var selecionarMaterial = new LOG.tall.ordentrabajo.GridSelectMateriales({
                        idioma: _this.idioma,
                        idsMateriales: idsExcluir,
                        idTipoPrecio: (_this.comboTiposPrecio) ? _this.comboTiposPrecio.getValue() : undefined,
                        idCliente: _this.idCliente,
                        integrarFac: _this.grantedAction('RIntegrarFac'),
                        almacenado: 1
                    });
                    selecionarMaterial.init();
                    selecionarMaterial.view();
                    // selecionarMaterial.getStorePrincipal().load();
                    selecionarMaterial.getVistaPrincipal().aceptarFn = function () {
                        if (selecionarMaterial.getSmPrincipal().hasSelection()) {
                            var sumaBase = 0;
                            var sumaAlternativa = 0;
                            var arrMateriales = [];
                            var records = selecionarMaterial.getSmPrincipal().getSelections();
							Ext.each(records, function (r) {
                                var myNewRecord = new _this.topicRecord({
                                    idmaterial: null,
                                    idindicador: r.data.idindicador,
                                    idactividad: _this.idActividad,//(r.data.idactividad)? r.data.idactividad:null,
                                    denominacionactividad:_this.denomActividad,
                                    codigo: (r.data.codigo) ? r.data.codigo : null,
                                    denominacion: (r.data.denominacion) ? r.data.denominacion : null,
                                    idunidadmedida: (r.data.idunidadmedida) ? r.data.idunidadmedida : null,
                                    cantidad: 0,
                                    nomunidamedida: (r.data.denominacionunidadmedida) ? r.data.denominacionunidadmedida : null,
                                    importecup: r.data.precioventa * 0/*parseFloat(r.data.cantplanif)*/,
                                    importecuc: r.data.precioalternativo * 0/*parseFloat(r.data.cantplanif)*/,
                                    precio: r.data.precioventa,
                                    precioalternativo: r.data.precioalternativo,
                                    estado: 0,
                                    porplan: 0,
                                    cantidadreal: 0,
                                    ignorarexistencia: 0,
                                    datosmoneda: (r.data.datosmoneda) ? Ext.encode(r.data.datosmoneda) : null,
                                    idproducto: r.json.idproducto,
                                    iddeposito: r.json.iddeposito,
                                    deposito: r.json.deposito,
                                    idestructuracomun: r.json.idestructuracomun,
                                    entidad: r.json.entidad,
                                    idproductoentidad: r.json.idproducto,
                                    //codigoproveedor: r.json.codigoproveedor,
                                });
                                _this.getStorePrincipal().add(myNewRecord);
                                arrMateriales.push(myNewRecord);
                                sumaBase += myNewRecord.data.importecup;
                                sumaAlternativa += myNewRecord.data.importecuc;
                                selecionarMaterial.getStorePrincipal().remove(r);
                                selecionarMaterial.idsMateriales.push(r.data.idindicador);
                            });
                            _this.getVistaPrincipal().fireEvent('addedmaterial', _this.getStorePrincipal(), arrMateriales, sumaBase, sumaAlternativa);
                            _this.comprobarExistencia();
                        }
                    }
                } else
                    mostrarMensaje(1, _this.idioma.msgSelectActividad);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if ((_caller.comboTiposPrecio && !_caller.comboTiposPrecio.getValue()) || !_caller.habilitado || !_this.idActividad) {
                        b.disable();
                    } else b.enable();
                } else b.setVisible(false);
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProductosNom,
            actvSelected: false,
            tooltip: this.idioma.ttBtnAdicionarProdNom,
            handler: function () {
                if (_this.idActividad) {  //si está seleccionada la actv en la que se va a utilizar el material.
                    var idsExcluir = new Array();
                    _this.getStorePrincipal().each(function (r, pos) {
                        if (_this.idActividad == r.data.idactividad) {//si el material ya esta asociado a la actv
                            idsExcluir[pos] = r.data.idproducto;    //se excluye
                        }
                    });

                    LOG.inv.maestroproductos.Loader.init(function () {
                        //var params = _this.collectRecords();
                        var winNomProd = new LOG.lb.maestroproductos.UIProductos({
                            tipo: 1,
                            //parametros: params,
                            usarAplicar: true,
                            doAction: function (i) {
                                var sumaBase = 0;
                                var sumaAlternativa = 0;
                                var arrMateriales = [];

                                Ext.each(i, function (r) {
                                    var myNewRecord = new _this.topicRecord({
                                        idmaterial: null,
                                        idindicador: r.data.idindicador,
                                        idactividad: _this.idActividad,//(r.data.idactividad)? r.data.idactividad:null,
                                        codigo: (r.json.codigo) ? r.json.codigo : null,
                                        denominacion: (r.data.denominacion) ? r.data.denominacion : null,
                                        idunidadmedida: (r.data.idumedida) ? r.data.idumedida : null,
                                        cantidad: 0,
                                        nomunidamedida: (r.data.umedida) ? r.data.umedida : null,
                                        importecup: r.data.precio * 0/*parseFloat(r.data.cantplanif)*/,
                                        importecuc: r.json.precioventa * 0/*parseFloat(r.data.cantplanif)*/,
                                        precio: r.data.precio,
                                        precioalternativo: r.json.precioventa,
                                        estado: 0,
                                        porplan: 0,
                                        cantidadreal: 0,
                                        ignorarexistencia: 0,
                                        datosmoneda: (r.data.datosmoneda) ? Ext.encode(r.data.datosmoneda) : null,
                                        idproducto: r.json.idproducto,
                                        iddeposito: r.json.iddeposito,
                                        deposito: r.json.deposito,
                                        codigoproveedor: r.json.codigoproveedor ? r.json.codigoproveedor : r.json.codigo,
                                        /*idoperacionm: _this.cmbOperacion.store.data.items[1].data.idoperacionm,*/
                                        operacion: _this.cmbOperacion.store.data.items[1].data.operacion
                                    });

                                    _this.getStorePrincipal().add(myNewRecord);
                                    arrMateriales.push(myNewRecord);
                                    sumaBase += myNewRecord.data.importecup;
                                    sumaAlternativa += myNewRecord.data.importecuc;
                                });

                                _this.getVistaPrincipal().fireEvent('addedmaterial', _this.getStorePrincipal(), arrMateriales, sumaBase, sumaAlternativa);
                                _this.comprobarExistencia();
                            }
                        });
                        winNomProd.show();
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if ((_caller.comboTiposPrecio && !_caller.comboTiposPrecio.getValue()) || !_caller.habilitado || !_this.idActividad) {
                        b.disable();
                    } else b.enable();
                } else b.setVisible(false);
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminarProducto,
            handler: function () {
                if (_this.getSmPrincipal().hasSelection()) {
                    mostrarMensaje(2, _this.idioma.msgEliminarMaterial, function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                            Ext.each(_this.getSmPrincipal().getSelections(), function (r) {
                                if (!r.data.idmaterial || !parseFloat(r.json.enproceso) && !parseFloat(r.json.facturado)) {
                                    if (r.data.idmaterial) {
                                        _this.listaEliminados.add(r.data.idmaterial);
                                        //_this.getGridPrincipal().initialConfig.bbar.setDisabled(true);
                                    }
                                    _this.getStorePrincipal().remove(r);
                                }
                            });
                            Ext.MessageBox.hide();
                            mostrarMensaje(1, _this.idioma.msgMaterialEliminado);
                            _this.comprobarExistencia();
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {

                        var selections = _caller.getGridPrincipal().getSelectionModel().getSelections();
                        if (_this.isValidEnabled(selections)) {
                            b.enable();
                        }
                        else {
                            b.disable();
                        }
                    }
                    if (e == 'rowdeselect' && this.getCount() == 0) {
                        b.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(new Ext.Button({
            text: 'Comprobar existencia',
            tooltip: 'Comprobar existencia',
            iconCls: 'revisar',
            hidden: true,
            handler: function () {
                _this.comprobarExistencia();
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        b.enable();
                    }
                });
            }
        }));
        this.addToolbarButton(new Ext.Button({
            text: 'Aprobar todos',
            tooltip: 'Aprobar todos los materiales',
            iconCls: 'aprobar',
            handler: function () {
                //aprobar todos los materiales en la vista del grid.
                _this.aprobarTodosVista();

            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('AprMat')) {
                    b.setVisible(true);
                } else b.setVisible(false);
            }
        }));
        this.addToolbarButton(new Ext.Button({
            text: 'Desaprobar todos',
            tooltip: 'Desaprobar todos los materiales',
            iconCls: 'desaprobar',
            handler: function () {
                //aprobar todos los materiales en la vista del grid.
                _this.desaprobarTodosVista();

            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('AprMat')) {
                    b.setVisible(true);
                } else b.setVisible(false);
            }
        }));
        this.addToolbarButton(new Ext.Button({
            text: 'Generar pedido',
            tooltip: 'Generar pedido',
            iconCls: 'generadorreportes',
            disabled: true,
            handler: function () {
                mostrarMensaje(2, _this.idioma.msgGenerarPedido, function (btn) {
                    if (btn == 'ok') {
                        _this.getVistaPrincipal().fireEvent('addpedido', [_this.getSmPrincipal().getSelections()]);
                    }
                });
            },
            fnEspecial: function () {
                if (_this.controlBtnPedido()) {
                    return true;
                } else return false;
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RGPedido') /*&& false*/) { //quitar el false para que se valide por recurso, esta asi por moncar
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        if (b.fnEspecial()) {
                            b.enable();
                        } else b.disable();
                    }
                    if (e == 'rowdeselect' && this.getCount() == 0) {
                        b.disable();
                    }
                });
                // b.setVisible(true);
            }
        }));
        this.btnIgnorar = new Ext.menu.Item({
            text: 'Ignorar',
            idItem: 'btnIgnorar',
            //iconCls:'activoSi',
            iconCls: 'incluir',
            scope: _this,
            handler: function () {
                mostrarMensaje(2, _this.idioma.msgIgnorarExistencia, function (btn) {
                    if (btn == 'ok') {
                        var grid = _this.getGridPrincipal();
                        var selections = _this.getSmPrincipal().getSelections();
                        Ext.each(selections, function (recSelected) {
                            recSelected.set('ignorarexistencia', 1);
                            recSelected.set('estado', 0);
                            grid.fireEvent('afteredit', {
                                field: 'ignorarexistencia',
                                grid: grid,
                                value: 1,
                                originalValue: 0
                            });
                        });
                        _this.controlBtnPedido();
                    }
                });
            },
            fnEspecial: function () {
                if (_this.controlBtnIgnorarEx()) {
                    return true;
                } else return false;
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        if (b.fnEspecial()) {
                            b.enable();
                        } else b.disable();
                    }
                    if (e == 'rowdeselect') {
                        if (this.getCount() == 0) {
                            b.disable();
                        } else {
                            b.setDisabled(!b.fnEspecial());
                        }
                    }
                });
                // b.setVisible(true);
            }
        });
        this.btnNoIgnorar = new Ext.menu.Item({
            text: 'No ignorar',
            iconCls: 'excluir',
            idItem: 'btnIgnorar',
            scope: _this,
            handler: function () {
                mostrarMensaje(2, _this.idioma.msgNoIgnorarExistencia, function (btn) {
                    if (btn == 'ok') {
                        var grid = _this.getGridPrincipal();
                        var selections = _this.getSmPrincipal().getSelections();
                        Ext.each(selections, function (recSelected) {
                            recSelected.set('ignorarexistencia', 0);
                            if (parseFloat(recSelected.data.cantidad) > parseFloat(recSelected.data.existencia) || !recSelected.data.existencia) {
                                recSelected.set('estado', 1);
                            }
                            grid.fireEvent('afteredit', {
                                field: 'ignorarexistencia',
                                grid: grid,
                                value: 0,
                                originalValue: 1
                            });
                        });
                        _this.controlBtnPedido();
                    }
                });
            },
            fnEspecial: function () {
                if (_this.controlBtnNoIgnorar()) {
                    return true;
                } else return false;
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        if (b.fnEspecial()) {
                            b.enable();
                        } else b.disable();
                    }
                    if (e == 'rowdeselect') {
                        if (this.getCount() == 0) {
                            b.disable();
                        } else {
                            b.setDisabled(!b.fnEspecial());
                        }

                    }
                });
            }
        });
        this.addToolbarButton(new Ext.Button({
            text: 'Ignorar existencia',
            tooltip: 'Ignorar existencia',
            iconCls: 'incluir',
            menu: [
                this.btnIgnorar,
                this.btnNoIgnorar
            ],
            handler: function () {
                _this.controlBtnNoIgnorar();
                _this.controlBtnIgnorarEx();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RIgnorarExistencia')) {
                    b.setVisible(true);
                    _caller.btnNoIgnorar.controlFn(_caller.btnNoIgnorar, _caller);
                    _caller.btnIgnorar.controlFn(_caller.btnIgnorar, _caller);
                } else b.setVisible(false);
                //b.disable();
                //_caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                //    if (e == 'rowselect' && _this.habilitado ) {
                //        b.enable();
                //    }
                //    if (e == 'rowdeselect' && this.getCount() == 0) {
                //        b.disable();
                //    }
                //});
            }
        }));
        if (typeof ORDEN_ENTIDADES !== 'undefined') {
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: 'Transferir productos',
                tooltip: 'Transferir los productos seleccionados que pertenecen a otra entidad',
                iconCls: 'gestionartransfentreareas',
                disabled: false,
                handler: function () {
                    _this.modelo.transfererirProductos(_this.scope.modelo.iddocumento, function(){
                        _this.getStorePrincipal().load()
                    })
                },
                controlFn: function (b, _caller) {
                    if ( _caller.grantedAction('RTransferir')) {
                        b.setVisible(true);
                        if (!_caller.habilitado) {
                            b.disable();
                        } else b.enable();
                    } else b.setVisible(false);
                }
            }));
        }
        if (aperturadoFAC && _this.grantedAction('RIntegrarFac')) {
            this.addToolbarButton('->');
            this.addToolbarButton(this.idioma.lbTipoPrecio + ':');
            this.addToolbarButton(this.comboTiposPrecio);
        }

    },
    comprobarExistencia: function () {
        var _this = this;
        if (_this.grantedAction('RUsarExistenciaMaterial')) {
            _this.getVistaPrincipal().fireEvent('beforecalcularexistencia');
            if (_this.getStorePrincipal().getCount() > 0) {
                var ids = [];
                var hay = false;
                _this.getStorePrincipal().each(function (r, pos) {
                    if (r.data.ignorarexistencia == 0) {
                        ids.push(r.data.idindicador);
                        hay = true;
                    }
                });
                if (hay) {
                    var faltante = false;
                    _this.getVistaPrincipal().body.mask(_this.idioma.msgComprobandoExistencia);
                    _this.modelo.comprobarExistencia(ids, function (resp) {
                        _this.getStorePrincipal().each(function (r, pos) {
                            var esta = false;
                            Ext.each(resp['datos'], function (arr) {
                                if (arr['idindicador'] == r.data.idindicador) {
                                    esta = true;
                                    r.data.existencia = arr['cantidad'];
                                    _this.getGridPrincipal().getView().refreshRow(pos);
                                    if (parseFloat(r.data.existencia) < parseFloat(r.data.cantidad) && r.data.ignorarexistencia == 0) {
                                        faltante = true;
                                        r.data.estado = 1;
                                    } else {
                                        r.data.estado = 0;
                                    }
                                }
                            });
                            if (!esta) {
                                r.data.existencia = 0;
                                if (r.data.ignorarexistencia == 0) {
                                    faltante = true;
                                    r.data.estado = 1;
                                } else r.data.estado = 1;
                                //_this.getGridPrincipal().getView().refreshRow(pos);
                            }
                        });
                        if (faltante) {
                            _this.getVistaPrincipal().fireEvent('changeexistencia', 1);
                        } else {
                            _this.getVistaPrincipal().fireEvent('changeexistencia', 0);
                        }
                        _this.getVistaPrincipal().body.unmask();
                        _this.controlBtnPedido();
                        _this.controlBtnsAprobar();
                    }, function (resp) {
                        _this.getVistaPrincipal().body.unmask();
                        _this.controlBtnPedido();
                        _this.controlBtnsAprobar();
                    });
                }
            } else {
                _this.getVistaPrincipal().fireEvent('changeexistencia', 0);
            }
        }
    },
    isValidEnabled: function (selections) {
        // var valid = true;
        var valid = false;
        Ext.each(selections, function (selected, index) {
            if (typeof selected.json === 'undefined') {
                valid = true;
            } else if ((selected.json.aprobado == "1" || selected.json.aprobado == "0") && !selected.json.nrosvales) {
                valid = true;
            }
        });
        return valid;
    },
    setModelo: function (modelo) {
        this.modelo = modelo;
    },
    salvarMateriales: function () {
        var _this = this;
        var allRecord = this.getStorePrincipal().getRange();
        Ext.each(allRecord, function (rm) {
            if (!rm.data.idmaterial || rm.dirty) {
                _this.listaAdicionados.add(rm);
            }
        });
        var materialesAdd = new Array();
        this.listaAdicionados.each(function (element, pos) {
            if (aperturadoFAC && _this.grantedAction('RIntegrarFac')) {
                element.data.idtipoprecio = _this.comboTiposPrecio.getValue();
            }
            materialesAdd[pos] = element.data;
        });
        var param = {};
        param['materialesadd'] = materialesAdd;
        param['materialeselim'] = this.listaEliminados.getArray();
        param['idsactvmat'] = this.listActvElim.getArray();
        return param;
    },
    limpiarListas: function () {
        this.listaAdicionados = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
    },
    adicionarMateriales: function (records) {
        var _this = this;
        var sumaBase = 0;
        var sumaAlternativa = 0;
        var arrMateriales = [];

        Ext.each(records, function (r, pos) {
            var myNewRecord = new _this.topicRecord({
                idmaterial: null,
                idindicador: r.idindicador,
                idactividad: (r.idactividad) ? r.idactividad : null,
                denominacionactividad: (r.denomActividad) ? r.denomActividad : null,
                codigo: (r.codigo) ? r.codigo : null,
                denominacion: (r.denominacion) ? r.denominacion : null,
                idunidadmedida: (r.idunidadmedida) ? r.idunidadmedida : null,
                cantidad: (r.cantplanif) ? r.cantplanif : 0,
                nomunidamedida: (r.denominacionunidadmedida) ? r.denominacionunidadmedida : null,
                cantidadreal: 0,
                precioventa: r.precioventa,
                precio: r.precioventa,
                precioalternativo: r.precioalternativo,
                importecup: (r.precioventa * ((r.cantplanif) ? parseFloat(r.cantplanif) : 0)).toFixed(2),
                importecuc: (r.precioalternativo * ((r.cantplanif) ? parseFloat(r.cantplanif) : 0)).toFixed(2),
                estado: 0,
                porplan: 1,
                ignorarexistencia: (r.ignorarexistencia) ? r.ignorarexistencia : 0
            });
            _this.getStorePrincipal().add(myNewRecord);
            //_this.getGridPrincipal().initialConfig.bbar.setDisabled(true);
            arrMateriales.push(myNewRecord);
            sumaBase += myNewRecord.data.importecup;
            sumaAlternativa += myNewRecord.data.importecuc;
        });
        _this.getVistaPrincipal().fireEvent('addedmaterial', _this.getStorePrincipal(), arrMateriales, sumaBase, sumaAlternativa);
        _this.comprobarExistencia();
    },
    eliminarMaterialesPorActividad: function (idactividad) {
        var _this = this;
        this.listActvElim.add(idactividad);
        Ext.each(_this.getStorePrincipal().getRange(), function (r) {
            if (r.data.idactividad == idactividad) {
                if (r.data.idordenmaterial) {
                    _this.listaEliminados.add(r.data.idordenmaterial);
                    //_this.getGridPrincipal().initialConfig.bbar.setDisabled(true);
                }
                //_this.getStorePrincipal().remove(r);
            }
        });
    },
    getListIdsActvMat: function () {
        return this.listActvElim;
    },
    getListaColumnas: function () {
        return this.listaColumnas;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridMateriales.superclass.render.call(this);
        vista.addEvents('addedmaterial');
        vista.addEvents('deletedmaterial');
        vista.addEvents('recalcularimporte');
        vista.addEvents('recalcularimportecuc');
        vista.addEvents('modificado');
        vista.addEvents('changeexistencia');
        vista.addEvents('beforecalcularexistencia');
        vista.addEvents('addpedido');
        this.storePrincipal.on({
            'add': function (st, records, index) {
                //vista.fireEvent('addedmaterial',st,records,index);
                if (st.getCount() == 0) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();

                } else {
                    _this.listaBotones.getItem(2).enable();
                }
                vista.fireEvent('modificado');
                _this.controlBtnsAprobar();
            },
            'remove': function (st, record, index) {
                vista.fireEvent('deletedmaterial', st, record, index);
                if (st.getCount() == 0) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                } else {
                    _this.listaBotones.getItem(2).enable();
                }
                vista.fireEvent('modificado');
                _this.controlBtnsAprobar();
            },
            'load': function (st) {
                _this.comprobarExistencia();
                if (st.getCount() == 0) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                } else {
                    _this.listaBotones.getItem(2).enable();
                }
                _this.controlBtnsAprobar();
                _this.controlBtnPedido();
            }
        });
        Ext.apply(_this.gpPrincipal, {
            viewConfig: {
                getRowClass: function (rec, index, rowParams, store) {
                    if (_this.grantedAction('RUsarExistenciaMaterial')) {
                        if (rec.data.aprobado != 1) {
                            if (parseFloat(rec.data.cantidad) > parseFloat(rec.data.existencia) && rec.data.ignorarexistencia == 0) {
                                rec.data.estado = 1;
                                return 'redrow-text';
                            }
                            if (!rec.data.existencia && rec.data.ignorarexistencia == 0) {
                                rec.data.estado = 1;
                                return 'redrow-text';
                            }
                        }
                    }
                }
            }
        });
        //this.gpPrincipal.autoExpandColumn = 'denominacionM';
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            if (e == 'afteredit') {
                var rec = obj.record;
                //_this.getGridPrincipal().initialConfig.bbar.setDisabled(true);
                if (obj.field == 'cantidad') {
                    if (obj.originalValue != obj.value) {
                        var oldImporte = rec.data.importecup;
                        rec.data.importecup = (rec.data.precio * obj.value).toFixed(2);
                        var oldImporteCUC = rec.data.importecuc;
                        rec.data.importecuc = (rec.data.precioalternativo * obj.value).toFixed(2);
                        _this.gpPrincipal.getView().refresh();
                        _this.comprobarExistencia();
                        vista.fireEvent('recalcularimporte', oldImporte, rec.data.importecup);
                        vista.fireEvent('recalcularimportecuc', oldImporteCUC, rec.data.importecuc);
                        _this.controlBtnsAprobar();
                    }
                    vista.fireEvent('modificado');
                } else if (obj.field == 'aprobado') {
                    vista.fireEvent('modificado');
                    _this.controlBtnsAprobar();
                } else if (obj.field == 'cantidadreal') {
                    if (rec.data.cantidad < obj.value) {
                        obj.value = obj.originalValue;
                        rec.data.cantidadreal = obj.originalValue;
                        obj.cancel = true;
                    } else
                        vista.fireEvent('modificado');
                } else if (obj.field == 'nrosvales') {
                    if (obj.value == "" || obj.value == null) {
                        rec.data.cantidadreal = 0;
                        _this.getGridPrincipal().getView().refresh();
                    }
                    vista.fireEvent('modificado');
                } else if (obj.field == 'ignorarexistencia') {
                    vista.fireEvent('modificado');
                } else if (obj.field == 'operacion') {
                    vista.fireEvent('modificado');
                } else if (obj.field == 'capacidadliquida') {
                    vista.fireEvent('modificado');
                }
            } else if (e == 'beforeedit') {
                var rec = obj.record;
                if (obj.field == 'cantidad' && obj.record.data.aprobado == 1) {
                    obj.cancel = true;
                } else {
                    if (obj.field == 'cantidadreal' && (rec.data.nrosvales == "" || rec.data.nrosvales == null)) {
                        obj.cancel = true;
                    }
                }
                /*if (obj.field == 'operacion' && (obj.record.data.aprobado == 1 || obj.record.data.idoperacionm == 2)) {
                    obj.cancel = true;
                }*/
            }
        });

        _this.getGridPrincipal().on({
            validateedit: function (obj) {
                if (obj.field == 'cantidad' && obj.record.data.idmaterial) {
                    var jso = obj.record.json;
                    var val = parseFloat(jso.enproceso) +parseFloat(jso.facturado);
                    if (obj.value < val) {
                        return false;
                    }
                }
            }
        });

        return vista;
    },
    controlBtnsAprobar: function () {
        var habilitados = false;
        var deshabilitados = false;
        if (this.habilitado) {
            this.getStorePrincipal().each(function (record) {
                if (/*record.data.estado != 1 &&*/ record.data.aprobado == 1) {
                    habilitados = true;
                } else if (record.data.estado != 1 && (record.data.aprobado == 0 || !record.data.aprobado)) {
                    deshabilitados = true;
                }
            });
            if (habilitados) {
                this.listaBotones.getItem(4).enable();
            } else this.listaBotones.getItem(4).disable();
            if (deshabilitados) {
                this.listaBotones.getItem(3).enable();
            } else this.listaBotones.getItem(3).disable();
        }
    },
    controlBtnPedido: function () {
        var _this = this;
        this.listaBotones.getItem(6).disable();
        if (this.estado == 2) {
            var selections = _this.getSmPrincipal().getSelections();
            if (selections.length > 0) {
                var cumple = true;
                Ext.each(selections, function (rec) {

                    if (/*parseFloat(rec.data.cantidad) <= parseFloat(rec.data.existencia)*/rec.data.aprobado == 1 || /*rec.data.idoperacionm == 1 ||*/ rec.data.ignorarexistencia == 1) {
                        cumple = false;
                    }
                    //mostrarMensaje(3, _this.idioma.msgErrorCantidadPedido);

                });

                this.listaBotones.getItem(6).setDisabled(!cumple);
                return cumple;
            } else return false;
        }
        return false;
    },
    controlBtnIgnorarEx: function () {
        var _this = this;
        if (this.estado < 3) {
            var selections = _this.getSmPrincipal().getSelections();
            if (selections.length > 0) {
                var cumple = true;
                Ext.each(selections, function (rec) {
                    if (parseFloat(rec.data.cantidad) <= parseFloat(rec.data.existencia) || rec.data.ignorarexistencia != 0) {
                        cumple = false;
                    }
                });
                _this.btnIgnorar.setDisabled(!cumple);
                return cumple;
            } else return false;
        }
        return false;
    },
    controlBtnNoIgnorar: function () {
        var _this = this;
        if (this.estado < 3) {
            var selections = _this.getSmPrincipal().getSelections();
            if (selections.length > 0) {
                var cumple = true;
                Ext.each(selections, function (rec) {
                    if (rec.data.ignorarexistencia != 1) {
                        cumple = false;
                    }
                });
                this.btnNoIgnorar.setDisabled(!cumple);
                return cumple;
            } else return false;
        }
        return false;
    },
    calcularImporteMateriales: function () {
        var _this = this;
        var records = this.getStorePrincipal().getRange();
        var suma = 0;
        Ext.each(records, function (rec) {
            // suma += rec.data[_this.listaColumnas.getItem(8).dataIndex] ;
            suma += parseFloat(rec.data.importecup);
        });
        return suma;
    },
    deshabilitar: function () {
        this.habilitado = false;
        this.listaBotones.getItem(0).disable();
        this.listaBotones.getItem(1).disable();
        this.listaBotones.getItem(2).disable();
        this.listaBotones.getItem(3).disable();
        this.listaBotones.getItem(4).disable();
        this.listaBotones.getItem(5).disable();
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('aprobado'), false);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('cantidad'), false);
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
    habilitar: function () {
        this.habilitado = true;
        if (this.idActividad) {
            this.listaBotones.getItem(0).controlFn(this.listaBotones.getItem(0), this);
            this.listaBotones.getItem(1).controlFn(this.listaBotones.getItem(1), this);
        }
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('aprobado'), true);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('cantidad'), true);
    },
    setActividad: function (idActiv, denomActiv) {
        this.idActividad = idActiv;
        this.denomActividad = denomActiv;
        if (idActiv){
            this.listaBotones.getItem(0).controlFn(this.listaBotones.getItem(0), this);
            this.listaBotones.getItem(1).controlFn(this.listaBotones.getItem(1), this);
        } else {
            this.listaBotones.getItem(0).disable();
            this.listaBotones.getItem(1).disable();
        }
    },
    despuesDeGuardar: function () {
        this.limpiarListas();
        this.listActvElim = new LOG.util.List();
        var start = this.getGridPrincipal().initialConfig.bbar.cursor;
        var limit = this.getGridPrincipal().initialConfig.bbar.pageSize;
        this.getStorePrincipal().load({params: {start: start, limit: limit}});
        this.getGridPrincipal().initialConfig.bbar.setDisabled(false);
    },
    aprobarTodosVista: function () {
        var grid = this.getGridPrincipal();
        var modif = false;
        this.getStorePrincipal().each(function (record, index) {
            var originalValue = record.data.aprobado == 1;
            if (record.data.estado != 1 && !originalValue) {
                record.set('aprobado', 1);
                modif = true;
            }
        });
        if (modif) {
            grid.fireEvent('afteredit', {
                field: 'aprobado',
                grid: grid
            });
        }

    },
    desaprobarTodosVista: function () {
        var grid = this.getGridPrincipal();
        var modif = false;
        this.getStorePrincipal().each(function (record, index) {
            var originalValue = record.data.aprobado == 1;
            if (/*record.data.estado != 1 &&*/ originalValue) {
                record.set('aprobado', 0);
                modif = true;
            }
        });
        if (modif) {
            grid.fireEvent('afteredit', {
                field: 'aprobado',
                grid: grid
            });
        }

    },
    setEstadoDocumento: function (estado) {
        this.estado = 2;
    },
    setIdCliente: function (id) {
        this.idCliente = id;
    }
});

LOG.tall.ordentrabajo.GridActividades = Ext.extend(LOG.util.UITemplate, {
    /**
     * listado con las actividades que elimina el usuario
     */
    listaEliminados: undefined,
    /**
     * listado de las actividades adicionadas por el usuario y las modificadas
     */
    listaAdicionados: undefined,
    /**
     * id servicio seleccionado
     */
    idservicio: undefined,
    /**
     * prototipo de los record a crear
     */
    topicRecord: undefined,
    /**
     * array con las áreas internas
     */
    arrAreasInternas: undefined,
    /**
     * array con las personas registradas
     */
    arrPersonas: undefined,
    /**
     * importe de las actividades
     */
    importe: 0,
    /**
     * false: los botones se mantienen deshabilitados, true: se pueden habilitar
     */
    habilitado: true,
    /**
     * 0 no a cerrado la orden, 1 orden cerrada
     */
    fin: 0,
    /**
     * function
     */
    fnControlBtnAbajo: undefined,
    restar: 0,
    origen: 0,
    recordOrden: undefined,
    comboTiposPrecio: undefined,
    servicios: undefined,
    idpadre: undefined,
    valueChbGarantia: undefined,
    pruneModifiedRecords: true,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        config.gridEditable = true;
        this.autoLoad = false;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarActividadesOrden';
        this.listaAdicionados = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.topicRecord = Ext.data.Record.create([
            {name: 'idordenactividad'},
            {name: 'idactividad'},
            {name: 'denominacion'},
            {name: 'fechainicio'},
            {name: 'fechafin'},
            {name: 'umedida'},
            {name: 'tiempoplanificado'},
            {name: 'idresponsable'},
            {name: 'observacion'},
            {name: 'idarea'},
            {name: 'prioridad'},
            {name: 'tiemporeal'},
            {name: 'tarifahora'},
            {name: 'precio'},
            {name: 'precioalternativo'},
            {name: 'idpadre'},
            {name: 'arraynorma'},
        ]);
        this.fnControlBtnAbajo = function (b, _caller) {
            b.disable();
            _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'rowselect') {
                    b.enable();
                }
                if (e == 'rowdeselect') {
                    b.disable();
                }
            });
        };

        this.gridPersonas = new LOG.tall.ordentrabajo.GridPersonasActividades({
            idioma: config.idioma,
            arrPersonas: config.arrPersonas,
            acciones: config.acciones,
            monedaContable: config.monedaContable,
            labelImporte: config.labelImporte,
            labelImporteCUC: config.labelImporteCUC
        });

        LOG.tall.ordentrabajo.GridActividades.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.cbUM = new LOG.util.ComboBox({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
            name: 'idunidadmedida',
            valueField: 'idunidadmedida',
            displayField: 'abreviaturaunidadmedida',
            selectOnlyLeaf: true,
            //autoLoad: false,
        });
        this.cbUM.getStore().on({
            'load': function (st) {
                _this.cargado = true;
            }
        });
        this.addGridColumn({
            dataIndex: 'idactividad',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idcentrodecosto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idordenactividad',
            hidden: true
        });
        
        this.addGridColumn({
            dataIndex: 'arraynorma',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'prioridad',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'arrayresponsables',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'gastomaterial',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgOperacionRealizada,
            id: 'denominacionA',
            width: 250,
            //default: true
        });
        // this.editorArea = new LOG.util.ComboBox({
        //     fieldLabel: _this.idioma.lbComboArea,
        //     url: '/logistica/talleres/configuracion/index.php/configuraciontalleres/cargarAreasDelServicio',
        //     valueField: 'id',
        //     validarEnFormBasico: false,
        //     autoLoad: false,
        //     displayField: 'text',
        //     mode: 'remote',
        //     listeners: {
        //         select: function (cb) {
        //             var recordSel = _this.getSmPrincipal().getSelected();
        //             var rowIndex = _this.getStorePrincipal().indexOf(recordSel);
        //             var colindex = _this.getGridPrincipal().getColumnModel().findColumnIndex('idresponsable');
        //             var newIdArea = cb.getValue();
        //             if (_this.getGridPrincipal().getColumnModel().isCellEditable(colindex, rowIndex) &&
        //                 _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column) {
        //                 var stResp = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column.editor.store;
        //                 stResp.initBaseParams = {idarea: newIdArea};
        //             }
        //         }
        //     },
        //     queryParam: 'criterio',
        //     minChars: 1,
        //     pageSize: 15,
        //     resizable: true
        // });
        // this.editorArea.store.on('beforeload', function (st, obj) {
        //     if (_this.getSmPrincipal().getSelected()) {
        //         var idP = _this.getSmPrincipal().getSelected().data.idactividad;
        //         //var idP =  _this.getSmPrincipal().getSelected().data.idpadre; //Anteriormente con planificacion
        //         st.baseParams = {idservicio: (idP) ? idP : null};
        //     }
        // });
        // this.editorArea.store.on('load', function (st) {
        //     if (st.getCount() == 1) {
        //         _this.editorArea.setValue(st.getRange()[0].data.id);
        //         _this.editorArea.fireEvent('select', _this.editorArea, st.getRange()[0], 0);
        //     } else {
        //         if (_this.getSmPrincipal().getSelected().data.idarea) {
        //             _this.editorArea.setValue(_this.getSmPrincipal().getSelected().data.idarea);
        //         }
        //     }
        // });
        this.addGridColumn({
            dataIndex: 'idarea',
            // header: this.idioma.cgArea,
            // width: 150,
            //default: true,
            hidden: true,
            // editor: _this.editorArea,
            // renderer: function (value, metaData, record, rowIndex, colIndex, store) {
            //     var nomarea = value;
            //     Ext.each(_this.arrAreasInternas, function (r) {
            //
            //         if (value == r['idfila']) {
            //             nomarea = r['text'];
            //         }
            //     });
            //     return nomarea;
            // }
        });

        this.addGridColumn({
            dataIndex: 'denomarea',
            header: this.idioma.cgArea,
            width: 120,
            hidden: !this.operariosVarios,
        });

        this.addGridColumn({
            dataIndex: 'denomcentrocosto',
            header: 'Centro de costo',
            width: 120,
            hidden: true,
        });

        var id = Ext.id();
        this.addGridColumn({
            dataIndex: 'fechainicio',
            header: this.idioma.cgFechaInicio,
            width: 100,
            minText: this.idioma.ttMinTexto,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            //default: true,
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            },
            editor: new Ext.form.DateField({
                name: 'fechainicio',
                id: id + 'idfechainicio',
                //minValue : new Date(),
                startDateField: this.comboFechaInicio,
                endDateField: id + 'idfechafin',
                vtype: 'daterange',
                validarEnFormBasico: false,
                format: 'd/m/Y',
                editable: false,
                invalidText: this.idioma.ttTextoFechaIncorrecto
            })
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            header: this.idioma.cgFechaFin,
            width: 100,
            startDateField: this.comboFechaInicio,
            //default: true,
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            },
            editor: new Ext.form.DateField({
                name: 'fechafin',
                startDateField: id + 'idfechainicio',
                id: id + 'idfechafin',
                vtype: 'daterange',
                validarEnFormBasico: false,
                format: 'd/m/Y',
                editable: false,
                invalidText: this.idioma.ttTextoFechaIncorrecto
            })
        });
        this.addGridColumn({
            dataIndex: 'tiempoplanificado',
            align: 'right',
            header: this.idioma.cgCantidadPlanificada,
            width: 100,
            editor: new LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2,
                validarEnFormBasico: false,
                minValue: 0
            })
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'umedida',
            header: this.idioma.cgUnidadMedida,
            width: 50,
            editor: _this.cbUM,
            renderer: function (_v, _mD, _r) {
                if (_this.cargado) {
                    _r.data.idunidadmedida = Ext.isNumber(parseInt(_v)) ? _v : _r.json.idunidadmedida;
                    var record = this.editor.getStore().getById(_r.data.idunidadmedida);
                }
                return record ? record.data.abreviaturaunidadmedida : _r.data.umedida;
            }
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'tiemporeal',
            header: this.idioma.cgTiempoReal,
            width: 100,
            align: 'right',
            //default: true,
            editor: new LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2,
                validarEnFormBasico: false,
                minValue: 0
            })
        });

        this.addGridColumn({
            dataIndex: 'minutosactividad',
            align: 'right',
            header: "Minutos",
            width: 100,
            hidden: !_this.operariosVarios,
            hideable: _this.operariosVarios,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            editor: new LOG.util.Prototipos.inputEntero({
                validarEnFormBasico: false,
                minValue: 0
            })
        });

        this.addGridColumn({
            dataIndex: 'tempario',
            align: 'right',
            header: "Tempario",
            width: 100,
            hidden: !_this.operariosVarios,
            hideable: _this.operariosVarios,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });

        var cod = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'precio',
            align: 'right',
            header: this.idioma.cgTarifaPor + " " + cod,
            width: 100,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            editor: new LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2,
                validarEnFormBasico: false,
                minValue: 0
            })
        });

        //var ocultar = (monedaAlternativa && monedaAlternativa) ? true : false;
        var codAlt = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'costo',
            align: 'right',
            header: _this.idioma.cgImporte + " " + cod,
            width: 120,
            hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
            /*  editor: new LOG.util.Prototipos.inputDecimal({
                  decimalPrecision: 2,
                  validarEnFormBasico: false,
                  minValue: 0
              })*/
        });
        var ocultar = (monedaAlternativa && monedaAlternativa != '') ? false : true;
        var codAlt = (monedaAlternativa && monedaAlternativa != '') ? monedaAlternativa : "";
        this.addGridColumn({
            dataIndex: 'precioalternativo',
            header: this.idioma.cgTarifaPor + " " + codAlt,
            width: 100,
            align: 'right',
            hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });


//        this.addGridColumn({
//            dataIndex: 'importealternativo',
//            header: _this.idioma.cgImporte + " " + codAlt,
//            width: 120,
//            hidden: ocultar,
//            align: 'right',
//            renderer: function (v) {
//                return Ext.util.Format.number(v, '0,000.00');
//            }
//            /*  editor: new LOG.util.Prototipos.inputDecimal({
//                  decimalPrecision: 2,
//                  validarEnFormBasico: false,
//                  minValue: 0
//              })*/
//        });

       

        this.editorResponsable = new LOG.util.ComboBox({
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarPersonasAreaInterna',
            valueField: 'idpersona',
            displayField: 'nombreapellidos',
            mode: 'remote',
            validarEnFormBasico: false,
            queryParam: 'criterio',
            resizable: true,
            listeners: {
                'focus': function (cb) {
                    /* var recordSel = _this.getSmPrincipal().getSelected();
                    var rowIndex = _this.getStorePrincipal().indexOf(recordSel);
                    var colindex = _this.getGridPrincipal().getColumnModel().findColumnIndex('idarea');
                    if(_this.getGridPrincipal().getColumnModel().isCellEditable(colindex,rowIndex) )
                    {
                        var newIdArea = undefined;
                        if(_this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column){
                            newIdArea = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column.editor.getValue();
                        }
                        else {
                            newIdArea = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.getValue();
                        }
                        cb.store.initBaseParams = {idarea: newIdArea};
                        cb.store.load();
                    }*/

                }
            },
            queryParam: 'criterio',
            minChars: 1,
            pageSize: 15,
            resizable: true
        });
        this.editorResponsable.store.on('beforeload', function (st) {
            var recordSel = _this.getSmPrincipal().getSelected();
            // var rowIndex = _this.getStorePrincipal().indexOf(recordSel);
            // var colindex = _this.getGridPrincipal().getColumnModel().findColumnIndex('idarea');
            // if (_this.getGridPrincipal().getColumnModel().isCellEditable(colindex, rowIndex) &&
            //     _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column) {
            //     var newIdArea = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column.editor.getValue();
            // }
            if (recordSel) {
                st.baseParams.idarea = recordSel.get('idarea');
            }
        });
        this.editorResponsable.store.on('load', function (st) {
            if (st.getCount() == 1) {
                _this.editorResponsable.setValue(st.getRange()[0].data.id);
                _this.editorResponsable.fireEvent('select', _this.editorResponsable, st.getRange()[0], 0);
            } else {
                if (_this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.idresponsable) {
                    _this.editorResponsable.setValue(_this.getSmPrincipal().getSelected().data.idresponsable);
                }
            }
        });
        this.addGridColumn({
            dataIndex: 'idresponsable',
            header: this.idioma.cgTecnico,
            width: 120,
            //default: true,
            renderer: function (val) {
                denom = val;
                Ext.each(_this.arrPersonas, function (r) {
                    if (val == r['idpersona']) {
                        denom = r['nombreapellidos'];
                    }
                });
                return denom;
            },
            editor: this.editorResponsable
        });
        this.addGridColumn({
            dataIndex: 'observacion',
            header: this.idioma.cgObservacion,
            width: 120,
            //default: true,
            editor: new LOG.util.Prototipos.inputTexto({name: 'descrip', maxLength: 100})
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'modificado',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idunidadmedida',
            hidden: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            disabled: true,
            text: LOG.util.Idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarActividad,
            handler: function () {
                if (!_this.comboTiposPrecio || _this.comboTiposPrecio && _this.comboTiposPrecio.getValue()) {
                    var excluir = new Array();
                    var excluirIndicador = new Array();
                    Ext.each(_this.getStorePrincipal().getRange(), function (rec) {
                        if (!rec.data.idordenactividad) { //es que no se ha guardado y por tanto no se puede excluir en el server
                            excluir.push(rec.data.idactividad);
                        }
                        excluirIndicador.push(rec.data.idindicador);
                    });
                    if (_this.origen != 4) {
                        var venta = new LOG.tall.ordentrabajo.GridSelectActividades({
                            idioma: _this.idioma,
                            idservicio: _this.idservicio,
                            idpadre: _this.recordOrden.data.idservicio,
                            idsExcluir: excluir,
                            idordentrabajo: _this.recordOrden.data.iddocumento,
                            idtipoprecio: (_this.comboTiposPrecio) ? _this.comboTiposPrecio.getValue() : undefined,
                            integrarFac: _this.grantedAction('RIntegrarFac'),
                            operariosVarios: _this.operariosVarios
                        });
                        venta.init();
                        venta.view();
                        // venta.getStorePrincipal().load();
                        venta.getVistaPrincipal().aceptarFn = function () {
                            var arrSelected = venta.getSmPrincipal().getSelections();
                            _this.adicionarRecords(arrSelected);
                            Ext.each(arrSelected, function (recDelete) {
                                venta.getStorePrincipal().remove(recDelete);
                            });
                        }
                    } else {
                        var ventana = new LOG.tall.ordentrabajo.GridIndicadores({
                            idioma: _this.idioma,
                            formaVisualizacion: 'ventana',
                            initDefaultColumns: function () {
                                var _this = this;
                                this.addGridColumn({
                                    dataIndex: 'idindicador',
                                    hidden: true,
                                    default: true
                                });
                                this.addGridColumn({
                                    dataIndex: 'idpadre',
                                    hidden: true,
                                    default: true
                                });
                                //this.addGridColumn({
                                //    header: this.idioma.cgCodigo,
                                //    width: 120,
                                //    dataIndex: 'codigo',
                                //    default: true
                                //});
                                this.addGridColumn({
                                    header: this.idioma.cgDenominacion,
                                    width: 120,
                                    dataIndex: 'denominacion',
                                    default: true,
                                    id: 'denomIndicador'
                                });
                            },
                            render: function () {
                                var _this = this;
                                var vista = LOG.tall.ordentrabajo.GridIndicadores.superclass.render.call(this);
                                //this.getStorePrincipal().initBaseParams.explotacion = 1;
                                this.getStorePrincipal().initBaseParams.tipo = 2;
                                this.gpPrincipal.autoExpandColumn = 'denomIndicador';
                                return vista;
                            }
                        });
                        ventana.init();
                        ventana.view({width: 800, height: 600});
                    }
                } else mostrarMensaje(2, 'Debe seleccionar el tipo de precio a utilizar.')
            },
            fnEspecialCondition: function () {
                if (_this.modelo[_this.modelo.primaryKeyField]) {
                    return false;
                }
                return true;
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if ((_caller.comboTiposPrecio && !_caller.comboTiposPrecio.getValue()) || !_caller.modelo[_caller.modelo.primaryKeyField]) {
                        b.disable();
                    } else b.enable();
                } else b.setVisible(false);
            }

        }));

        this.addToolbarButton(new Ext.Button({
                tooltip: this.idioma.ttBtnAbajo,
                iconCls: 'abajo',
                disabled: true,
                handler: function () {
                    var rowSelected = _this.getGridPrincipal().getSelectionModel().getSelections();
                    var indexSelected = _this.getStorePrincipal().indexOf(rowSelected[0]);
                    if (indexSelected < _this.getStorePrincipal().getCount() - 1) {
                        _this.getStorePrincipal().remove(rowSelected[0]);
                        _this.getGridPrincipal().getSelectionModel().clearSelections();
                        _this.getStorePrincipal().insert(indexSelected + 1, rowSelected);
                        _this.getGridPrincipal().getSelectionModel().selectRow(indexSelected + 1);
                    }
                },
                controlFn: function (b, _caller) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect' && _this.habilitado) {
                            b.enable();
                        }
                        if (e == 'rowdeselect' && this.getCount() == 0) {
                            b.disable();
                        }
                    });
                }
            })
        );
        this.addToolbarButton(new Ext.Button({
                tooltip: this.idioma.ttBtnArriba,
                iconCls: 'arriba',
                disabled: true,
                handler: function () {
                    var rowSelected = _this.getGridPrincipal().getSelectionModel().getSelections();
                    var indexSelected = _this.getStorePrincipal().indexOf(rowSelected[0]);
                    if (indexSelected > 0) {
                        _this.getStorePrincipal().remove(rowSelected[0]);
                        _this.getGridPrincipal().getSelectionModel().clearSelections();
                        _this.getStorePrincipal().insert(indexSelected - 1, rowSelected);
                        _this.getGridPrincipal().getSelectionModel().selectRow(indexSelected - 1);
                    }
                },
                controlFn: function (b, _caller) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect' && _this.habilitado) {
                            b.enable();
                        }

                        if (e == 'rowdeselect' && this.getCount() == 0) {
                            b.disable();
                        }
                    });
                }
            })
        );
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminarActividad,
            handler: function () {
                gridMateriales = new LOG.tall.ordentrabajo.GridMateriales({});
                let select = _this.getSmPrincipal().getSelections();
               
                var tienemate=false;

                for (let index = 0; index < select.length; index++) {
                    if (select[index].json.tienemat > 0) {
                        tienemate=true;
                        break;
                    }
                }
                
                if(tienemate){
                    mostrarMensaje(3, 'No se puede elimina la actividad si tiene materiales asociados.', function (btn) {
                    });
                }else{
                    var recordsSel = _this.getSmPrincipal().getSelections();
                    if (recordsSel.length) {
                        mostrarMensaje(2, _this.idioma.msgEliminarActividad, function (btn) {
                            if (btn == 'ok') {
                                Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                                var arrflag = [];
                                Ext.each(recordsSel,function(s){
                                    if (!parseFloat(s.json.enproceso) && !parseFloat(s.json.facturado)) {
                                        _this.eliminarRecords(s);
                                        arrflag.push(true);
                                    }
                                });
                               
                                if (_this.getStorePrincipal().getCount() == 0) {
                                    _this.listaBotones.getItem(1).disable();
                                    _this.listaBotones.getItem(2).disable();
                                    _this.listaBotones.getItem(3).disable();
                                }
                                Ext.MessageBox.hide();
                                if (arrflag.length) {
                                    mostrarMensaje(1, _this.idioma.msgActividadEliminada);
                                } else {
                                    mostrarMensaje(1, 'El servicio no se puede eliminar porque esta presente en una factura.');
                                }
                            }
                        });
                    }
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        var selected = _caller.getGridPrincipal().getSelectionModel().getSelected();
                        b.enable();
                    }
                    if (e == 'rowdeselect' && this.getCount() == 0) {
                        b.disable();
                    }
                });
            }
        }));

        if (aperturadoFAC && _this.grantedAction('RIntegrarFac')) {
            this.addToolbarButton('->');
            this.addToolbarButton(this.idioma.lbTipoPrecio + ':');
            this.addToolbarButton(this.comboTiposPrecio);
        }
    },
    getListaColumnas: function () {
        return this.listaColumnas;
    },
    render: function () {
        var _this = this;
        var iniciarPersonas = this.operariosVarios;
        var vista = LOG.tall.ordentrabajo.GridActividades.superclass.render.call(this);
        vista.addEvents('addedactividad');
        vista.addEvents('deletedactividad');
        vista.addEvents('editgridactv');
        this.storePrincipal.on({
            'remove': function (st, record, index) {
                vista.fireEvent('deletedactividad', st, record, index);
            },
            'load': function (st) {
                if (st.getCount()) {
                    _this.listaBotones.getItem(1).disable();
                    _this.listaBotones.getItem(2).disable();
                    _this.listaBotones.getItem(3).disable();
                    _this.labelImporte.setText(st.reader.jsonData.importes.importe);
//                    _this.labelImporteCUC.setText(st.reader.jsonData.importesalternativos.importealternativo);
                }
            }
        });
        //this.gpPrincipal.autoExpandColumn = 'denominacionA';
        this.gpPrincipal.getSelectionModel().on('rowselect', function (sm, rowIndex, rec) {
            //_this.editorArea.store.load();
        });
        if (iniciarPersonas) {
            this.gpPrincipal.getSelectionModel().on('selectionchange', function (sm) {
                var records = sm.getSelections();
                if (records.length && records.length === 1) {
                    //(Math.round((records[0].data.precio * (records[0].data.tiemporeal - (parseFloat(records[0].json.enproceso) + parseFloat(records[0].json.facturado)))) * 100) / 100),
                    // var precioactividad = records[0].data.minutosactividad > 0 ? ((Math.round((records[0].data.minutosactividad/60)*100)/ 100) * records[0].data.precio) : records[0].data.precio;
                    // var importeactividad = (Math.round((precioactividad * (parseFloat(records[0].data.tiemporeal) - (parseFloat(records[0].json.enproceso) + parseFloat(records[0].json.facturado)))) * 100) / 100);
                    var importeactividad = (Math.round((records[0].data.precio * (records[0].data.tiemporeal - (parseFloat(records[0].json.enproceso) + parseFloat(records[0].json.facturado)))) * 100) / 100);
                    _this.gridPersonas.iniciarDatosBase(
                        importeactividad,
                        records[0].json.minimo,
                        records[0].json.maximo,
                        (records[0].json.porcentual == 1),
                        (records[0].json.um == 1),
                        (records[0].json.porcentual != 1 && records[0].json.um != 1),
                        records[0].json.medida,
                        records[0].json.gastomaterial,
                        _this.valueChbGarantia,
                        (parseFloat(records[0].data.tiemporeal) - (parseFloat(records[0].json.enproceso) + parseFloat(records[0].json.facturado)))
                    );
                    _this.gridPersonas.iniciarPersonas(records[0].get('arrayresponsables') ? records[0].get('arrayresponsables') : Ext.encode(records[0].json.DatActividadOrdenPersonas), _this.habilitado);
                } else {
                    _this.gridPersonas.limpiarPersonas();
                }
            });

            this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('idresponsable'), true);
            this.getGridPrincipal().getColumnModel().setHidden(this.getGridPrincipal().getColumnModel().findColumnIndex('idresponsable'), true);
        }

        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            var rec = obj.record;
            if (e == 'afteredit') {
                vista.fireEvent('editgridactv');
                if(obj.field == 'precio' && rec.data.precio != rec.json.ConfActividad.precio){
                    rec.data.modificado = 1;
                }else{
                    rec.data.modificado = 0;
                }
            }
            if (e == 'beforeedit') {
                if(obj.field == 'umedida'){
                    if(_this.recordOrden.data.estado != 9){
                        if (!_this.grantedAction('ModUMServicio')) {
                            obj.cancel = true;
                        }  
                    }else{
                        obj.cancel = true;
                    }                                  
                }
                if(obj.field == 'tiempoplanificado'){
                    if(_this.recordOrden.data.estado != 9){
                        if (!_this.grantedAction('ModPlan')) {
                            obj.cancel = true;
                        }
                    }else{
                        obj.cancel = true;
                    }
                }
            }

        });

        _this.getGridPrincipal().on({
            validateedit: function (obj) {
                if (obj.field == 'tiemporeal' && obj.record.data.idordenactividad) {
                    var jso = obj.record.json;
                    var val = parseFloat(jso.enproceso) + parseFloat(jso.facturado);
                    if (obj.value < val) {
                        return false;
                    }
                }
            }
        });
        if (iniciarPersonas) {
            this.gridPersonas.init();
            var vistapersona = this.gridPersonas.view();
            vistapersona.on({
                addedpersonaactividad: function (datosencodado) {
                    _this.adicionarPersonasActividad(datosencodado);
                    vista.fireEvent('editgridactv');
                },
                deletedpersonaactividad: function (datosencodado) {
                    _this.adicionarPersonasActividad(datosencodado);
                    vista.fireEvent('editgridactv');
                },
                editgridpersonaactv: function (datosencodado) {
                    _this.adicionarPersonasActividad(datosencodado);
                    vista.fireEvent('editgridactv');
                }
            });

            var panel2 = new LOG.util.Panel({
                // autoHeight: true,
                border: true,
                frame: true,
                width: '35%',
                region: 'east',
                layout: 'border',
                items: [vistapersona],
            });

            this.storePrincipal.on({
                'beforeload': function (st) {
                    _this.gridPersonas.limpiarPersonas();
                }
            });

            _this.getGridPrincipal().on({
                afteredit: function (obj) {
                    var rec = obj.record;
                    if(obj.field == 'precio'){
                        // var precioactividad = rec.data.minutosactividad > 0 ? ((Math.round((rec.data.minutosactividad/60)*100)/ 100) * rec.data.precio) : rec.data.precio;
                        var precioactividad = rec.data.precio;
                        var importeactividad = (Math.round((precioactividad * (parseFloat(rec.data.tiemporeal) - (parseFloat(rec.json.enproceso) + parseFloat(rec.json.facturado)))) * 100) / 100);
                        _this.gridPersonas.importeActividad = importeactividad;
                        _this.gridPersonas.calcularImporte();
                        _this.adicionarPersonasActividad(_this.gridPersonas.prepararDatos());
                    } else if (obj.field == 'tiemporeal') {
                        // var precioactividad = rec.data.minutosactividad > 0 ? ((Math.round((rec.data.minutosactividad/60)*100)/ 100) * rec.data.precio) : rec.data.precio;
                        var precioactividad = rec.data.precio;
                        var importeactividad = (Math.round((precioactividad * (parseFloat(rec.data.tiemporeal) - (parseFloat(rec.json.enproceso) + parseFloat(rec.json.facturado)))) * 100) / 100);
                        _this.gridPersonas.importeActividad = importeactividad;
                        _this.gridPersonas.porcientoCompletado = (parseFloat(rec.data.tiemporeal) - (parseFloat(rec.json.enproceso) + parseFloat(rec.json.facturado)));
                        _this.gridPersonas.calcularImporte();
                        _this.adicionarPersonasActividad(_this.gridPersonas.prepararDatos());
                    } else if (obj.field == 'minutosactividad') {
                        // var precioactividad = rec.data.minutosactividad > 0 ? ((Math.round((rec.data.minutosactividad/60)*100)/ 100) * rec.data.precio) : rec.data.precio;
                        if (rec.data.minutosactividad === 0 || rec.data.minutosactividad === '') {
                            rec.set('tiemporeal', 1);
                            rec.set('tiempoplanificado', 1);
                        } else {
                            var porc = (Math.round((rec.data.minutosactividad/60)*100)/ 100);
                            rec.set('tiemporeal', porc);
                            rec.set('tiempoplanificado', porc);
                        }
                        var precioactividad = rec.data.precio;
                        var importeactividad = (Math.round((precioactividad * (parseFloat(rec.data.tiemporeal) - (parseFloat(rec.json.enproceso) + parseFloat(rec.json.facturado)))) * 100) / 100);
                        _this.gridPersonas.importeActividad = importeactividad;
                        _this.gridPersonas.porcientoCompletado = (parseFloat(rec.data.tiemporeal) - (parseFloat(rec.json.enproceso) + parseFloat(rec.json.facturado)));
                        _this.gridPersonas.calcularImporte();
                        _this.adicionarPersonasActividad(_this.gridPersonas.prepararDatos());
                    }
                },
                beforeedit: function (obj) {
                    if (obj.field == 'minutosactividad') {
                        var jso = obj.record.json;
                        var val = parseFloat(jso.enproceso) + parseFloat(jso.facturado);
                        if (val > 0) {
                            return false;
                        }
                    } else if (obj.field == 'tiemporeal') {
                        var minutosactividad = obj.record.data.minutosactividad;
                        if (minutosactividad) {
                            return false;
                        }
                    }
                }
            });
        }
        var panel1 = new LOG.util.Panel({
            // autoHeight: true,
            border: true,
            frame: true,
            region: 'center',
            layout: 'border',
            items: [vista],
        });
        var panelfinal = new LOG.util.Panel({
            // autoHeight: true,
            border: false,
            region: 'center',
            layout: 'border',
            items: iniciarPersonas ? [panel1, panel2] : [panel1],
        });

        panelfinal.addEvents('addedactividad');
        panelfinal.addEvents('deletedactividad');
        panelfinal.addEvents('editgridactv');

        vista.fireEvent = vista.fireEvent.createSequence(function (e, p1, p2, p3, p4) {
            if (e == 'addedactividad') {
                panelfinal.fireEvent('addedactividad', p1, p2, p3, p4);
            } else if (e == 'deletedactividad') {
                panelfinal.fireEvent('deletedactividad', p1, p2, p3);
            } else if (e == 'editgridactv') {
                panelfinal.fireEvent('editgridactv', p1);
            }
        });

        panelfinal.doLayout();

        return panelfinal;

    },
    formatDate: function (value, c, record) {
        if (value) {
            if (typeof value == "object") {
                return value.dateFormat('d/m/Y');
            }
        }
        return value;
    },
    salvarActividades: function () {
        var _this = this;
        //var allRecord = this.getStorePrincipal().getRange();
        var allRecord = this.getStorePrincipal().getModifiedRecords();
        var cursor = _this.getGridPrincipal().initialConfig.bbar.cursor;
        var listaAdicionados = new LOG.util.List();
        Ext.each(allRecord, function (rm, index) {
            if (rm.data.prioridad != (index + cursor)) {
                rm.data.prioridad = (index + cursor);
                rm.dirty = true;
            }
            if (!rm.data.idordenactividad || rm.dirty) {
                rm.data.arraynorma = null;// la norma ya se envia con los materiales.
                if (aperturadoFAC && _this.grantedAction('RIntegrarFac')) {
                    rm.data.idtipoprecio = _this.comboTiposPrecio.getValue();
                }
                listaAdicionados.add(rm);

            }
        });
        var actvAdd = new Array();
        listaAdicionados.each(function (element, pos) {
            actvAdd[pos] = element.data;

        });

        var param = {};
        param['actividadesadd'] = actvAdd;
        param['actividadeselim'] = this.listaEliminados.getArray();

        // this.listaAdicionados = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
        this.getStorePrincipal().commitChanges();
        return param;
    },
    limpiarListas: function () {
        this.listaAdicionados = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
    },
    setIdServicio: function (value) {
        this.idServicioOld = (!this.idServicioOld) ? this.idservicio : this.idServicioOld;
        this.idservicio = value;
    },
    adicionarRecords: function (records) {
        var _this = this;
        var cursor = _this.getGridPrincipal().initialConfig.bbar.cursor;
        //_this.getGridPrincipal().initialConfig.bbar.setDisabled(true);
        var temp = new Array();
        var norma = new Array();
        var mantenimiento = false;//ver como queda con el cambio
        var sumaCosto = 0;
        var cantidad = _this.getStorePrincipal().getCount();
        Ext.each(records, function (r, pos) {
            mantenimiento = false;//ver como queda al quitar el arbol
            //Si no tiene attributes es pq vienen del mantenimiento planif.
            /*if(!r.attributes){
                r.json.idpadre = (_this.origen==4)?null:r.json.idpadre;
                r.json.costo = (_this.origen==4)?r.json.precio:r.json.costo;
                r.attributes = r.json;
                mantenimiento = true;
            }*/
            r.data.prioridad = cantidad + cursor + pos;
            r.data.idtipoprecio = cantidad + cursor + pos;
            r.data.idindicador = r.json.idindicador;

            if (mantenimiento) {//revisar para que hace falta
                var myNewRecord = new _this.topicRecord({
                    idordenactividad: null,
                    idactividad: r.attributes.idactividad,
                    idindicador: r.attributes.idindicador,
                    denominacion: r.attributes.denominacion,
                    fechacomienzo: r.attributes.fechacomienzo,
                    fechaterminacion: r.attributes.fechaterminacion,
                    fechainicio: r.attributes.fechainicio,
                    fechafin: r.attributes.fechafin,
                    tiempoplanificado: (r.attributes.tiempo) ? r.attributes.tiempo : 0,
                    idresponsable: null,
                    observacion: null,
                    idarea: (r.attributes.idarea) ? r.attributes.idarea : null,
                    prioridad: _this.getStorePrincipal().getCount() + cursor + pos,
                    tiemporeal: (r.attributes.tiempo) ? r.attributes.tiempo : null,
                    tarifahora: (parseFloat(r.attributes.tiempo) == 0 || parseFloat(r.attributes.costo) == 0)
                        ? 0 : parseFloat(r.attributes.costo) / parseFloat(r.attributes.tiempo),
                    idpadre: r.attributes.idactividad,
                    //arraynorma: _this.tratarNorma(r.attributes.arraynorma, r.attributes.idactividad),
                    costo: (r.attributes.costo) ? r.attributes.costo : 0,
                    idindicador: (r.attributes.idindicador) ? r.attributes.idindicador : null
                });
                _this.getStorePrincipal().add(myNewRecord);
            } else {
                temp.push(r.data);
            }

            sumaCosto += (r.data.costo) ? parseFloat(r.data.costo) : 0;
            //sumaCosto += (r.attributes.costo)?parseFloat(r.attributes.costo):0;
            // norma = norma.concat(_this.tratarNorma(r.attributes.arraynorma, r.attributes.idactividad));
        });
        _this.getVistaPrincipal().fireEvent('addedactividad', _this.getStorePrincipal(), temp, sumaCosto, norma);
        if (_this.panelPrincipal.body.isMasked()) {
            _this.panelPrincipal.body.unmask();
        }
    },
    eliminarRecords: function (records) {
        var _this = this;
        Ext.each(records, function (r) {
            if (r.data.idordenactividad) {
                // _this.listaEliminados.add(r.data.idordenactividad);
                _this.listaEliminados.add(r.data.idactividad);
                //_this.getGridPrincipal().initialConfig.bbar.setDisabled(true);
            }
            _this.getStorePrincipal().remove(r);
        });
    },
    eliminarActividadesDelServico: function (value) {
        var rango = this.getStorePrincipal().getRange();
        this.eliminarRecords(rango);
    },
    getActividadesAdded: function () {
        return this.listaAdicionados.getArray();
    },
    getActividadesDeleted: function () {
        return this.listaEliminados.getArray();
    },
    getImporte: function () {
        return this.importe;
    },
    setModelo: function (modelo) {
        this.modelo = modelo;
        this.modelo.addActionButton(this.listaBotones.getItem(0), true);
    },
    calcularImporteActividades: function () {
        var _this = this;
        var allRecord = this.getStorePrincipal().getRange();
        this.importe = 0;
        Ext.each(allRecord, function (rm) {
            if (rm.data.tarifahora) {
                if (rm.data.tiemporeal) {//aki
                    _this.importe += rm.data.tiemporeal * rm.data.tarifahora;
                } else if (rm.data.tiempoplanificado) {
                    _this.importe += rm.data.tiempoplanificado * rm.data.tarifahora;
                }
            }
        });
        return this.importe;
    },
    deshabilitar: function (fin) {
        this.fin = (fin) ? fin : this.fin;
        this.habilitado = false;
        this.listaBotones.getItem(0).disable();
        this.listaBotones.getItem(1).disable();
        this.listaBotones.getItem(2).disable();
        this.listaBotones.getItem(3).disable();
        // this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('idarea'), false);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('fechainicio'), false);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('fechafin'), false);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('tiemporeal'), (this.fin == 1) ? false : true);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('idresponsable'), false);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('observacion'), false);
    },
    habilitar: function () {
        this.habilitado = true;
        this.fin = 0;
        if (this.recordOrden && this.recordOrden.data.iddocumento) {
            this.listaBotones.getItem(0).enable();
        }
        // this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('idarea'), true);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('fechainicio'), true);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('fechafin'), true);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('tiemporeal'), true);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('idresponsable'), true);
        this.getGridPrincipal().getColumnModel().setEditable(this.getGridPrincipal().getColumnModel().findColumnIndex('observacion'), true);

    },
    despuesDeGuardar: function () {
        this.limpiarListas();
        this.idServicioOld = null;
        this.listaBotones.getItem(0).controlFn(this.listaBotones.getItem(0), this);
        var start = this.getGridPrincipal().initialConfig.bbar.cursor;
        var limit = this.getGridPrincipal().initialConfig.bbar.pageSize;
        this.getStorePrincipal().load({params: {start: start, limit: limit}});
        this.getGridPrincipal().initialConfig.bbar.setDisabled(false);
    },
    esta: function (idactividad) {
        result = -1;
        Ext.each(this.getStorePrincipal().getRange(), function (rec, pos) {
            if (rec.data.idactividad == idactividad) {
                result = pos;
            }
        });
        return result;
    },
    setOrigen: function (value) {
        this.origen = value;
    },
    setRecordOrden: function (record) {
        this.recordOrden = record;
    },
    getServicioById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.servicios.length; i++) {
            if (_this.servicios[i].idactividad == id) {
                return _this.servicios[i].nombreServicio;
            }
        }
        return '-';
    },
    /**
     * Las normas en la actividad llegan repetidas por lo que se necesita
     * dejarlas una sola ves y modificar la cantidad...
     * @param arrNorma
     * @returns {Array}
     */
    tratarNorma: function (arrNorma, idactividad) {
        var nuevaNorma = new Array();
        //var posRepetidas = new Array();
        // var long = (arrNorma)?arrNorma.length:0;
        Ext.each(arrNorma, function (indicador, pos) {
            /* if(posRepetidas.indexOf(pos)==-1){
                 var cant = 1;
                 for(var j = pos+1; j < long; j++){
                     if(arrNorma[j]['idindicador'] == indicador['idindicador']){
                         posRepetidas.push(j);
                         cant++;
                     }
                 }
                 indicador.cantplanif += cant;
                 indicador.idactividad = idactividad;
                 nuevaNorma.push(indicador);
             }*/
            indicador.idactividad = idactividad;
            nuevaNorma.push(indicador);
        });
        return nuevaNorma;
    },
    adicionarPersonasActividad: function (datosecodados) {
        var record = this.getGridPrincipal().getSelectionModel().getSelected();
        if (record) {
            record.set('arrayresponsables', datosecodados);
        }
    }
});

LOG.tall.ordentrabajo.GridSelectActividades = Ext.extend(LOG.util.UITemplate, {
    /**
     * ids actividades ya seleccionadas
     */
    idsExcluir: undefined,
    idordentrabajo: undefined,
    /**
     * id del servicio seleccionado
     */
    idservicio: undefined,
    todo: 0,
    integrarFac: false,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = true;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarActividadesExistentes';
        this.busquedaBasica = true;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.GridSelectActividades.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = this.idioma.tlSelecioneActividades;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        //this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idactividad',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idcentrodecosto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'tempario',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idarea',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'arraynorma',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTrabajoRealizar,
            dataIndex: 'denominacion',
            id: 'denominacionSA',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgArea,
            width: 120,
            dataIndex: 'denomarea',
            hidden: !this.operariosVarios
        });
        this.addGridColumn({
            header: 'Centro de costo',
            width: 120,
            dataIndex: 'denomcentrodecosto',
            hidden: true
        });
        this.addGridColumn({
            header: 'Importe',
            dataIndex: 'costo',
            default: true,
            hidden: this.operariosVarios
        });
//        this.addGridColumn({
//            header: 'Importe CUC',
//            dataIndex: 'importealternativo',
//            default: true,
//            hidden: this.operariosVarios
//        });

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new Ext.Button({
            tooltip: this.idioma.ttBtnMostrarTodasActv,
            iconCls: 'mostrar',
            text: this.idioma.lbMostrarTodas,
            handler: function () {
                _this.todo = 1;
                _this.getStorePrincipal().load();
            }
        }));

        if (this.operariosVarios) {
            this.editorArea = new LOG.util.ComboBox({
                url: 'cargarAreasTaller',
                valueField: 'idarea',
                validarEnFormBasico: false,
                autoLoad: false,
                displayField: 'denominacion',
                mode: 'remote',
                emptyText: 'Area',
                listeners: {
                    select: function (cb) {
                        // var recordSel = _this.getSmPrincipal().getSelected();
                        // var rowIndex = _this.getStorePrincipal().indexOf(recordSel);
                        // var colindex = _this.getGridPrincipal().getColumnModel().findColumnIndex('idresponsable');
                        // var newIdArea = cb.getValue();
                        // if (_this.getGridPrincipal().getColumnModel().isCellEditable(colindex, rowIndex) &&
                        //     _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column) {
                        //     var stResp = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column.editor.store;
                        //     stResp.initBaseParams = {idarea: newIdArea};
                        // }
                    }
                },
                queryParam: 'criterio',
                minChars: 1,
                pageSize: 15,
                resizable: true,
                baseParams: {
                    areasconf: 1
                }
            });

            this.addToolbarButton('->');
            this.addToolbarButton(this.editorArea);
        }

    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridSelectActividades.superclass.render.call(this);
        //this.storePrincipal.initBaseParams={idsexcluir:Ext.encode(this.idsMateriales)};
        this.storePrincipal.on('beforeload', function (store) {
            store.initBaseParams = {
                idservicio: _this.idservicio, hijos: 1, nivel: 4, todo: _this.todo,
                excluir: Ext.encode(_this.idsExcluir), idordentrabajo: _this.idordentrabajo,
                idtipoprecio: _this.idtipoprecio, integrarFac: _this.integrarFac,
                idarea: _this.operariosVarios ? _this.editorArea.getValue() : ''
            };
        });
        this.storePrincipal.on('load', function (store, records) {
            //Esto era con las actividades de Planificacion
            // Ext.each(_this.idsActividades,function(v){
            //     Ext.each(records, function(record){
            //         if(record.data.idactividad == v){
            //             store.remove(record);
            //         }
            //     });
            // });
            if (store.getCount() == 0) {
                mostrarMensaje(1, _this.idioma.msjNoExistenActv);
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denominacionSA';
        if (this.operariosVarios) {
            this.editorArea.on({
                select: function (cb) {
                    _this.storePrincipal.reload();
                }
            });
        }
        return vista;
    }
});
LOG.tall.ordentrabajo.WinArbolActividades = Ext.extend(LOG.util.Window, {
    idServicio: 0,
    listaSeleccionados: undefined,
    idsExcluir: undefined,
    constructor: function (config) {
        var _this = this;
        this.listaSeleccionados = new LOG.util.List();
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        config.title = this.idioma.tlSelecioneActividades;
        this.height = 600;
        this.width = 400;
        this.idServicio = config.idservicio;
        this.usarAplicar = false;
        this.bildArbol();
        config.items = [
            {
                region: 'north',
                bbar: [new Ext.Button({
                    tooltip: this.idioma.ttBtnMostrarTodasActv,
                    iconCls: 'mostrar',
                    text: this.idioma.lbMostrarTodas,
                    handler: function () {
                        _this.cambiarRaizArbol(0);
                    }
                })
                ]
            },
            this.arbolActividades];
        LOG.tall.ordentrabajo.WinArbolActividades.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();

    },
    bildArbol: function () {
        var _this = this;
        Ext.tree.TreeNodeUICheckHideShow = Ext.extend(Ext.tree.TreeNodeUI, {
            toggleVisibleCheckbox: function (state) {
                this.checkbox.visible = state;
                Ext.DomHelper.applyStyles(this.checkbox, {visibility: 'hidden', display: 'none'});
            }
        });
        this.arbolActividades = new Ext.tree.TreePanel({
            change: false,
            autoScroll: true,
            region: 'center',
            split: true,
            margins: '2 2 2 0',
            width: '50%',
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'cargarActividadesExistentes',
                uiProviders: {
                    'ui': Ext.tree.TreeNodeUICheckHideShow
                },
                listeners: {
                    'beforeload': function (atreeloader, anode, obj) {
                        atreeloader.baseParams = {};
                        atreeloader.baseParams.nivel = (anode.isRoot) ? 3 : 4;
                        atreeloader.baseParams.arbol = 1;
                        atreeloader.baseParams.idsadicionados = Ext.encode(_this.idsExcluir);
                    },
                    'load': function (loader, node, respo) {
                        if (node.attributes.checked) {
                            Ext.each(node.childNodes, function (hijo) {
                                hijo.attributes.checked = true;
                                hijo.getUI().toggleCheck(true);
                                if (_this.esta(hijo, _this.listaSeleccionados) == -1) {
                                    _this.listaSeleccionados.add(hijo);
                                }
                            });
                        }
                    }
                }
            })
        });
        var padreArbolActividades = new Ext.tree.AsyncTreeNode({
            text: 'Actividades',
            expandable: true,
            expanded: true,
            id: this.idServicio
        });
        this.arbolActividades.setRootNode(padreArbolActividades);
        this.arbolActividades.on('checkchange', function (node) {
            _this.arbolActividades.change = true;
            if (!node.isLeaf()) {
                node.expand();
                if (node.attributes.checked) {
                    Ext.each(node.childNodes, function (hijo) {
                        hijo.attributes.checked = true;
                        hijo.getUI().toggleCheck(true);
                        if (_this.esta(hijo, _this.listaSeleccionados) == -1) {
                            _this.listaSeleccionados.add(hijo);
                        }
                    });
                } else {
                    Ext.each(node.childNodes, function (hijo) {
                        hijo.attributes.checked = false;
                        hijo.getUI().toggleCheck(false);
                        var pos = _this.esta(hijo, _this.listaSeleccionados);
                        {
                            _this.listaSeleccionados.delete(pos);
                        }
                    });
                }
            } else {
                if (node.attributes.checked) {
                    if (_this.esta(node, _this.listaSeleccionados) == -1) {
                        _this.listaSeleccionados.add(node);
                    }
                } else {
                    var pos = _this.esta(node, _this.listaSeleccionados);
                    {
                        _this.listaSeleccionados.delete(pos);
                    }
                }
            }
            if (_this.listaSeleccionados.count() > 0) {
                _this.listaBotones.getItem(2).enable();
            } else _this.listaBotones.getItem(2).disable();
        });
    },
    esta: function (elemnt, lista) {
        var result = -1;
        lista.each(function (it, pos) {
            if (it.id == elemnt.id) {
                result = pos;
            }
        });
        return result;
    },
    getListaSelected: function () {
        return this.listaSeleccionados;
    },
    cambiarRaizArbol: function (id) {
        var padreArbolActividades = new Ext.tree.AsyncTreeNode({
            text: 'Actividades',
            expandable: true,
            expanded: true,
            id: id
        });
        this.arbolActividades.setRootNode(padreArbolActividades);
        this.arbolActividades.getRootNode().expand();
        this.listaSeleccionados.deleteAll();
    }
});

LOG.tall.ordentrabajo.GridPersonasActividades = Ext.extend(LOG.util.UITemplate, {
    idordenactividad: undefined,
    idArea: undefined,
    importeActividad: undefined,
    // dimensionActividad: undefined,
    // tiempoActividad: undefined,
    datoMinimo: undefined,
    datoMaximo: undefined,
    actividadPorcentual: false,
    actividadUM: false,
    actividadFija: false,
    ordenExterna: false,
    gastoMaterial: 0,
    valueChbGarantia: undefined,
    arrEliminados: [],
    constructor: function (config) {
        this.idArea = config.idArea;
        this.ordenExterna = config.valueChbGarantia;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 1;
        config.gridEditable = true;
        this.bbarVisible = false;
        this.autoLoad = false;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarActividadesOrden';

        this.listaAdicionados = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        // this.topicRecord = Ext.data.Record.create([
        //     {name: 'idordenactividadpersona'},
        //     {name: 'idordenactividad'},
        //     {name: 'idresponsable'},
        //     {name: 'coeficiente'},
        //     {name: 'dimension'},
        //     {name: 'importeacobrar'},
        //     {name: 'observacion'},
        // ]);
        LOG.tall.ordentrabajo.GridPersonasActividades.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        //pa relacionar a la actividad
        this.addGridColumn({
            dataIndex: 'idordenactividadpersona',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idordenactividad',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'minimo',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'maximo',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'tipo',
            hidden: true
        });
        //al eliminar se le cambia a este estado para q quede el registro
        this.addGridColumn({
            dataIndex: 'estadoeliminado',
            hidden: true
        });

        this.editorResponsable = new LOG.util.ComboBox({
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarPersonasAreaInterna',
            valueField: 'idpersona',
            displayField: 'nombreapellidos',
            mode: 'remote',
            validarEnFormBasico: false,
            queryParam: 'criterio',
            resizable: true,
            listeners: {
                'focus': function (cb) {
                    /* var recordSel = _this.getSmPrincipal().getSelected();
                    var rowIndex = _this.getStorePrincipal().indexOf(recordSel);
                    var colindex = _this.getGridPrincipal().getColumnModel().findColumnIndex('idarea');
                    if(_this.getGridPrincipal().getColumnModel().isCellEditable(colindex,rowIndex) )
                    {
                        var newIdArea = undefined;
                        if(_this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column){
                            newIdArea = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column.editor.getValue();
                        }
                        else {
                            newIdArea = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.getValue();
                        }
                        cb.store.initBaseParams = {idarea: newIdArea};
                        cb.store.load();
                    }*/

                }
            },
            minChars: 1,
            pageSize: 15,
        });
        this.editorResponsable.store.on('beforeload', function (st) {
            var recordSel = _this.getSmPrincipal().getSelected();
            var rowIndex = _this.getStorePrincipal().indexOf(recordSel);
            var colindex = _this.getGridPrincipal().getColumnModel().findColumnIndex('idarea');
            if (recordSel && _this.getGridPrincipal().getColumnModel().isCellEditable(colindex, rowIndex) &&
                _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column) {
                var newIdArea = _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowIndex).field.column.editor.getValue();
            }
            st.baseParams.idarea = newIdArea;
        });
        this.editorResponsable.store.on('load', function (st) {
            if (st.getCount() == 1) {
                _this.editorResponsable.setValue(st.getRange()[0].data.id);
                _this.editorResponsable.fireEvent('select', _this.editorResponsable, st.getRange()[0], 0);
            } else {
                if (_this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.idresponsable) {
                    _this.editorResponsable.setValue(_this.getSmPrincipal().getSelected().data.idresponsable);
                }
            }
        });
        this.addGridColumn({
            dataIndex: 'idresponsable',
            header: this.idioma.cgTecnico,
            width: 120,
            //default: true,
            renderer: function (val) {
                var denom = val;
                Ext.each(_this.arrPersonas, function (r) {
                    if (val == r['idpersona']) {
                        denom = r['nombreapellidos'];
                    }
                });
                return denom;
            },
            // editor: this.editorResponsable
        });

        this.addGridColumn({
            dataIndex: 'coeficiente',
            align: 'right',
            header: 'Coeficiente',
            width: 100,
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
            editor: new LOG.util.Prototipos.inputDecimal({
                validarEnFormBasico: false,
                decimalPrecision: 2,
                minValue: 0,
                maxValue: _this.actividadPorcentual ? 100 : undefined
            }),
            renderer: function (v, metadata, record, rowIndex, colIndex, store) {
                if (!isNaN(v) && _this.actividadPorcentual) {
                    return v + ' %';
                } else {
                    return v;
                }
            },
        });

        this.addGridColumn({
            dataIndex: 'dimension',
            align: 'right',
            header: 'Dimensión',
            width: 100,
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
            editor: new LOG.util.Prototipos.inputDecimal({
                validarEnFormBasico: false,
                decimalPrecision: 2,
                minValue: 0
            }),
            renderer: function (v, metadata, record, rowIndex, colIndex, store) {
                if (v && _this.medida) {
                    return v + ' ' + _this.medida;
                } else {
                    return v;
                }
            },
        });

        this.addGridColumn({
            dataIndex: 'importecobrar',
            align: 'right',
            header: 'Importe a cobrar',
            width: 100,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            editor: new LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2,
                validarEnFormBasico: false,
                minValue: 0
            })
        });

        //para cuando quieran quitar a alguien pongan porque
        // this.addGridColumn({
        //     dataIndex: 'observacion',
        //     header: this.idioma.cgObservacion,
        //     width: 120,
        //     //default: true,
        //     editor: new LOG.util.Prototipos.inputTexto({name: 'descrip', maxLength: 100})
        // });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            disabled: true,
            text: LOG.util.Idioma.lbBtnAdicionar,
            // tooltip: this.idioma.ttBtnAdicionarActividad,
            handler: function () {
                var venta = new LOG.tall.ordentrabajo.GridSelectPersona({
                    idioma: _this.idioma,
                    idArea: _this.idArea,
                });
                venta.init();
                venta.view();
                // venta.getStorePrincipal().load();
                venta.getVistaPrincipal().aceptarFn = function () {
                    var arrSelected = venta.getSmPrincipal().getSelections();
                    _this.adicionarRecords(arrSelected);
                    // Ext.each(arrSelected, function (recDelete) {
                    //     venta.getStorePrincipal().remove(recDelete);
                    // });
                }
            },
            fnEspecialCondition: function () {
                if (_this.modelo[_this.modelo.primaryKeyField]) {
                    return false;
                }
                return true;
            },
            // controlFn: function (b, _caller) {
            //     if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
            //         b.setVisible(true);
            //         if ((_caller.comboTiposPrecio && !_caller.comboTiposPrecio.getValue()) || !_caller.modelo[_caller.modelo.primaryKeyField]) {
            //             b.disable();
            //         } else b.enable();
            //     } else b.setVisible(false);
            // }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: this.idioma.lbBtnEliminar,
            // tooltip: this.idioma.ttBtnEliminarActividad,
            handler: function () {

                // mostrarMensaje(2, _this.idioma.msgEliminarActividad, function (btn) {
                //     if (btn == 'ok') {
                //
                //         _this.eliminarRecords(_this.getSmPrincipal().getSelections());
                //         // if (_this.getStorePrincipal().getCount() == 0) {
                //         //     _this.listaBotones.getItem(1).disable();
                //         //     // _this.listaBotones.getItem(2).disable();
                //         //     // _this.listaBotones.getItem(3).disable();
                //         // }
                //
                //     }
                // });

                _this.eliminarRecords();

            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        var selected = _caller.getGridPrincipal().getSelectionModel().getSelected();
                        b.enable();
                    }
                    if (e == 'rowdeselect' && this.getCount() == 0) {
                        b.disable();
                    }
                });
            }
        }));

    },
    getListaColumnas: function () {
        return this.listaColumnas;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridPersonasActividades.superclass.render.call(this);
        vista.addEvents('addedpersonaactividad');
        vista.addEvents('deletedpersonaactividad');
        vista.addEvents('editgridpersonaactv');
        this.storePrincipal.on({
            // 'remove': function (st, record, index) {
            //     vista.fireEvent('deletedactividad', _this.prepararDatos());
            // },
            // 'add': function () {
            //     vista.fireEvent('addedpersonaactividad', _this.prepararDatos());
            // }
        });

        _this.getGridPrincipal().getSelectionModel().on({
            selectionchange: function (sm) {
                var records = sm.getSelections();
                if (records.length === 1) {
                    _this.onSelect(records[0]);
                } else {
                    _this.onDeselect();
                }
            }
        });

        _this.getGridPrincipal().on({
            beforeedit: function (obj) {
                if (obj.record.get('estadoeliminado') == 1) {
                    return false;
                }
            },
            afteredit: function (obj) {
                if (!(obj.field === 'observacion') && !(obj.field === 'importecobrar')) {
                    _this.calcularImporte();
                }
            }
        });

        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            // var rec = obj.record;
            if (e == 'afteredit') {
                vista.fireEvent('editgridpersonaactv', _this.prepararDatos());
            }
            /*if (e == 'beforeedit') {
                if(obj.field == 'precio'){
                    if(_this.recordOrden.data.estado != 9){
                        if (!_this.grantedAction('ModTarifaServ')) {
                            obj.cancel = true;
                        }
                    }else{
                        obj.cancel = true;
                    }
                }
            }*/

        });
        return vista;

    },
    prepararDatos: function () {
        var _this = this;
        var records = this.getStorePrincipal().getRange();
        var arrDatos = [];
        Ext.each(records, function (rm, index) {
            // rm.data.minimo = _this.getMinimoActividad();
            // rm.data.maximo = _this.getMaximoActividad();
            // rm.data.tipo = _this.getTipo();
            arrDatos.push(rm.data);
        });
        arrDatos = arrDatos.concat(_this.arrEliminados);
        return Ext.encode(arrDatos);
    },
    iniciarPersonas: function (datos, habilitadoGridActividades) {
        var _this = this;
        var datos = Ext.decode(datos);
        var datosacargar = [];
        _this.arrEliminados = [];
        // this.setOrdenActividad(datos.idordenactividad);
        Ext.each(datos, function (d) {
            if (d.eliminado == 1) {
                _this.arrEliminados.push(d);
            } else {
                datosacargar.push(d);
            }
        });

        if (datosacargar.length) {
            this.getGridPrincipal().getStore().loadData({datos: datosacargar});
            _this.calcularImporte();
            _this.getVistaPrincipal().fireEvent('editgridpersonaactv', _this.prepararDatos());
        }
        if (habilitadoGridActividades) {
            _this.habilitar();
        } else {
            _this.deshabilitar();
        }
    },
    iniciarDatosBase: function (
        importeActividad,
        datoMinimo,
        datoMaximo,
        actividadPorcentual,
        actividadUM,
        actividadFija,
        medida,
        gastoMaterial,
        ordenExterna,
        porcientoCompletado
    ) {
        this.importeActividad = importeActividad;
        this.datoMinimo = datoMinimo;
        this.datoMaximo = datoMaximo;
        this.actividadPorcentual = actividadPorcentual;
        this.actividadUM = actividadUM;
        this.actividadFija = actividadFija;
        if (actividadUM) {
            this.medida = medida;
        }
        this.gastoMaterial = gastoMaterial;
        this.ordenExterna = ordenExterna;
        this.porcientoCompletado = porcientoCompletado;
    },
    cambiarTipoOrden: function (check) {
        this.ordenExterna = check;
        this.calcularImporte();
        this.getVistaPrincipal().fireEvent('editgridpersonaactv', this.prepararDatos());
    },
    limpiarPersonas: function () {
        this.getGridPrincipal().getStore().removeAll();
        // this.setOrdenActividad(undefined);
        this.deshabilitar();
        this.importeActividad = undefined;
        this.datoMinimo = undefined;
        this.datoMaximo = undefined;
        this.actividadPorcentual = false;
        this.actividadUM = false;
        this.actividadFija = false;
        this.gastoMaterial = 0;
        this.medida = undefined;
        this.porcientoCompletado = undefined;
        this.arrEliminados = [];
        // this.ordenExterna = false;
    },
    adicionarRecords: function (records) {
        var _this = this;
        var flag = false;

        Ext.each(records, function (r, pos) {
            if (_this.getStorePrincipal().find('idresponsable', r.data.idpersona) === -1) {
                var myNewRecord = new _this.recStGridPrincipal({
                    idordenactividadpersona: null,
                    idordenactividad: _this.getOrdenActividad(),
                    idresponsable: r.data.idpersona
                });
                _this.getStorePrincipal().add(myNewRecord);
                flag = true;
            }

        });

        if (flag) {
            _this.calcularCoeficiente();
            _this.calcularImporte();
            _this.getVistaPrincipal().fireEvent('addedpersonaactividad', _this.prepararDatos());
        }

        if (_this.panelPrincipal.body.isMasked()) {
            _this.panelPrincipal.body.unmask();
        }
    },
    eliminarRecords: function () {
        // LOG.tall.ordentrabajo.VentanaEliminarPersonasActividades
        var _this = this;
        var records = _this.getSmPrincipal().getSelections();
        // var flag = false;
        mostrarMensaje(2, _this.idioma.msgEliminarActividad, function (btn) {
            if (btn == 'ok') {
                if (records[0].get('idordenactividadpersona')) {
                    records[0].data.eliminado = 1;
                    _this.arrEliminados.push(records[0].data);
                }
                _this.getStorePrincipal().remove(records[0]);
                _this.calcularCoeficiente();
                _this.calcularImporte();
                _this.getVistaPrincipal().fireEvent('deletedpersonaactividad', _this.prepararDatos());
                // mostrarMensaje(1, '');
            }
        });
        // if (!records[0].get('idordenactividadpersona')) {
        //
        // } else {
        //     var ventanaEliminar = new LOG.tall.ordentrabajo.VentanaEliminarPersonasActividades({
        //         idioma: _this.idioma
        //     });
        //
        //     ventanaEliminar.on({
        //         eliminarr: function (comentario) {
        //             records[0].set('estadoeliminado', 1);
        //             records[0].set('coeficiente', '');
        //             records[0].set('dimension', '');
        //             records[0].set('importecobrar', '');
        //             records[0].set('observacion', comentario);
        //             _this.calcularCoeficiente();
        //             _this.calcularImporte();
        //             _this.getVistaPrincipal().fireEvent('deletedpersonaactividad', _this.prepararDatos());
        //         }
        //     });
        //
        //     ventanaEliminar.init();
        //     ventanaEliminar.show();
        //     ventanaEliminar.doLayout();
        // }

        // Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
        // Ext.each(records, function (r) {
        //     if (r.data.idordenactividad) {
        //         // _this.listaEliminados.add(r.data.idordenactividad);
        //         // _this.listaEliminados.add(r.data.idactividad);
        //         // _this.getGridPrincipal().initialConfig.bbar.setDisabled(true);
        //
        //         // recordsCambiarAEliminado.push(r);
        //         r.set('estadoeliminado', 1);
        //         flag = true;
        //     } else {
        //         _this.getStorePrincipal().remove(r);
        //     }
        // });
        //
        // if (flag) {
        //     _this.getVistaPrincipal().fireEvent('deletedactividad', _this.prepararDatos());
        // }
        // Ext.MessageBox.hide();
        // mostrarMensaje(1, _this.idioma.msgActividadEliminada);

    },
    setModelo: function (modelo) {
        this.modelo = modelo;
        this.modelo.addActionButton(this.listaBotones.getItem(0), true);
    },
    setOrdenActividad: function (idordenactividad) {
        this.idordenactividad = idordenactividad;
    },
    getOrdenActividad: function () {
        return this.idordenactividad;
    },
    getMinimoActividad: function () {
        return this.datoMinimo;
    },
    getMaximoActividad: function () {
        return this.datoMaximo;
    },
    getTipo: function () {
        if (this.actividadPorcentual) {
            return 1;
        } else if (this.actividadUM) {
            return 2;
        } else if (this.actividadFija) {
            return 3;
        }
    },
    deshabilitar: function () {
        this.habilitado = false;
        this.listaBotones.getItem(0).disable();
        this.listaBotones.getItem(1).disable();
        // this.listaBotones.getItem(2).disable();
        // this.listaBotones.getItem(3).disable();
        var columnmodel = this.getGridPrincipal().getColumnModel();
        columnmodel.setEditable(columnmodel.findColumnIndex('idresponsable'), false);
        columnmodel.setEditable(columnmodel.findColumnIndex('coeficiente'), false);
        columnmodel.setEditable(columnmodel.findColumnIndex('dimension'), false);
        columnmodel.setEditable(columnmodel.findColumnIndex('importecobrar'), false);
        // columnmodel.setEditable(columnmodel.findColumnIndex('observacion'), false);
    },
    habilitar: function () {
        this.habilitado = true;
        this.listaBotones.getItem(0).enable();
        var columnmodel = this.getGridPrincipal().getColumnModel();
        columnmodel.setEditable(columnmodel.findColumnIndex('idresponsable'), true);
        columnmodel.setEditable(columnmodel.findColumnIndex('coeficiente'), true);
        columnmodel.setEditable(columnmodel.findColumnIndex('dimension'), true);
        columnmodel.setEditable(columnmodel.findColumnIndex('importecobrar'), true);
        // columnmodel.setEditable(columnmodel.findColumnIndex('observacion'), true);

    },
    onSelect: function (record) {
        if (record.get('estadoeliminado') != 1) {
            this.listaBotones.getItem(1).enable();
        } else {
            this.listaBotones.getItem(1).disable();
        }
    },
    onDeselect: function () {
        this.listaBotones.getItem(1).disable();
    },
    getImporteActividadPorcentual: function (ordenExterna, gastoMateriales, coeficiente) {
        //ordenInternaExterna 1 externa 0 interna
        // this.valorActividad //viene de la actividad q esta seleccionada
        // gastoMateriales //se usa cuando es externa
        var importe = 0;
        if (coeficiente && this.importeActividad) {
            if (ordenExterna && gastoMateriales) {
                importe = (this.importeActividad - gastoMateriales)*(coeficiente/100);
            } else {
                importe = (this.importeActividad)*(coeficiente/100);
            }
        }
        return importe ? (Math.round(importe * 100) / 100) : importe;
    },
    getImporteActividadUM: function (ordenExterna, gastoMateriales, coeficiente, dimension) {
        //ordenInternaExterna 1 externa 0 interna
        // this.valorActividad //viene de la actividad q esta seleccionada
        // gastoMateriales //se usa cuando es externa
        var importe = 0;
        if (coeficiente && dimension) {
            if (ordenExterna && gastoMateriales) {
                importe = (dimension*coeficiente) - gastoMateriales;
            } else {
                importe = dimension*coeficiente;
            }
        }
        return importe ? (Math.round(importe * 100) / 100) : importe;
    },
    getImporteActividadFija: function (ordenExterna, gastoMateriales, coeficiente) {
        //ordenInternaExterna 1 externa 0 interna
        // this.valorActividad //viene de la actividad q esta seleccionada
        // gastoMateriales //se usa cuando es externa
        var importe = 0;
        if (coeficiente) {
            var count = this.getGridPrincipal().getStore().getCount();
            if (ordenExterna && gastoMateriales) {
                // importe = (coeficiente) - gastoMateriales;
                importe = ((this.datoMaximo - gastoMateriales)*this.porcientoCompletado/count);
            } else {
                // importe = coeficiente;
                importe = ((this.datoMaximo)*this.porcientoCompletado/count);
            }
        }
        return importe ? (Math.round(importe * 100) / 100) : importe;
    },
    calcularImporteACobrar: function (tipoActividad, ordenExterna, gastoMateriales) {
        if (!tipoActividad) {
            console.info('no se define el tipo de actividad para calcular el importe');
            return;
        }
        var records = this.getGridPrincipal().getStore().getRange();
        var importeacobrar = 0;
        for (var i = 0; i < records.length; i++) {
            if (tipoActividad === 'porcentual') {
                importeacobrar = this.getImporteActividadPorcentual(
                    ordenExterna, gastoMateriales, records[i].get('coeficiente')
                );
            } else if (tipoActividad === 'um') {
                importeacobrar = this.getImporteActividadUM(
                    ordenExterna, gastoMateriales, records[i].get('coeficiente'),
                    records[i].get('dimension')
                );
            } else if (tipoActividad === 'fija') {
                importeacobrar = this.getImporteActividadFija(
                    ordenExterna, gastoMateriales, records[i].get('coeficiente')
                );
            }
            records[i].set('importecobrar', importeacobrar);
            importeacobrar = 0;
        }
    },
    calcularImporte: function () {
        if (this.actividadPorcentual) {
            this.calcularImporteACobrar('porcentual', this.ordenExterna, this.gastoMaterial);
        } else if (this.actividadUM) {
            this.calcularImporteACobrar('um', this.ordenExterna, this.gastoMaterial);
        } else if (this.actividadFija) {
            this.calcularImporteACobrar('fija', this.ordenExterna, this.gastoMaterial);
        }
    },
    calcularCoeficiente: function () {
        var coeficiente = 0;
        if (this.datoMaximo) {
            var records = this.getGridPrincipal().getStore().getRange();
            var contador = 0;
            for (var i = 0; i < records.length; i++) {
                // if (records[i].get('estadoeliminado') != 1) {
                    contador++;
                // }
            }
            if (contador) {
                coeficiente = Math.round((this.datoMaximo/contador)*100)/100;
            }
            for (var i = 0; i < records.length; i++) {
                if (records[i].get('estadoeliminado') != 1) {
                    records[i].set('coeficiente', coeficiente);
                }
            }
        }
    }
});

LOG.tall.ordentrabajo.VentanaEliminarPersonasActividades = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    /**
     * formulario que contiene los campos de entrada
     */
    formularioGeneral: undefined,
    constructor: function (config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.VentanaEliminarPersonasActividades.superclass.constructor.call(this, config);
        // this.modelo = new LOG.tall.ordentrabajo.ReclamacionesModel({
        //     idioma: this.idioma
        // });
        // this.modelo.posecionmedio = 1;
        this.addEvents('eliminarr');
    },
    builComponent: function () {
        var _this = this;
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            animCollapse: false,
            animate: false,
            autoHeight: true,
            frame: true
        });

        var cls5 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.taCausasReclamacion = new Ext.form.TextArea({
            fieldLabel: 'Causas que motivaron la eliminación de la persona',
            name: 'razoneliminacion',
            height: 150,
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true,
            allowBlank: false,
            listeners: {
                keydown: function () {
                    if (_this.taCausasReclamacion.isValid()) {
                        _this.btnSalvar.enable();
                    } else {
                        _this.btnSalvar.disable();
                    }
                }
            }
            //regex: LOG.util.Regex.cadena,
            //regexText :  _this.idioma.msgexpreAlfaNumRegexText,
        });
        cls5.addComponent(this.taCausasReclamacion);

        this.formularioGeneral = new LOG.util.Panel({
            frame: true,
            autoHeight: true,
            labelAlign: 'top',
            items: [cls5]
        });

        this.btnSalvar = LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonGuardar({
            key: {
                alt: true,
                key: 'G'
            },
            text: 'aceptar',
            handler: function () {
                if (_this.taCausasReclamacion.isValid()) {
                    _this.salvarHandler();
                    _this.record = null;
                    _this.close();
                }
            },
            scope: this,
            disabled: true,
            tooltip: this.idioma.ttBtnGuardarR
        }));
        this.btnCerrar = LOG.util.UIManager.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonCancelar({
            key: {
                ctrl: true,
                alt: true,
                key: 'X'
            },
            handler: function () {
                // _this.modelo.reset();
                _this.record = null;
                _this.close();
            },
            text: this.idioma.lbBtnCerrar,
            scope: this
        }));

        // _this.modelo.addActionButton(this.btnSalvar);

        LOG.util.UIManager.apply(this, {
            title: 'Eliminar',
            width: 400,
            height: 270,
            layout: 'border',
            constrain: true,
            resizable: false,
            items: [this.panelPrincipal],
            buttons: [this.btnCerrar, this.btnSalvar]
        });
        LOG.tall.ordentrabajo.VentanaEliminarPersonasActividades.superclass.initComponent.call(this);
        this.basicFormulario = new LOG.util.UIManager.initForm({autoHeight: true,});
        this.basicFormulario.add(this.formularioGeneral);
        this.panelPrincipal.add(this.basicFormulario);
    },
    // prepareForm: function (d) {
    //     if (this.basicFormulario) {
    //         this.record = d;
    //         this.basicFormulario.getForm().loadRecord(this.record);
    //         this.modelo.bindForm(this.basicFormulario);
    //         this.modelo.loadRecord();
    //         this.lbNroOrdenTrabajo.setText(this.idioma.lbNroOrdenTrabajo + ': ' + this.record.data.nrodoc);
    //
    //     }
    // },
    salvarHandler: function () {
        this.fireEvent('eliminarr', this.taCausasReclamacion.getValue());
    },
    onCloseHandler: function (p) {
        // var _this = this;
        // _this.modelo.reset();
        // _this.record = null;
        // this.gRadioDondeEquipo.reset();
        // return LOG.tall.ordentrabajo.VentanaReclamaciones.superclass.onCloseHandler.call(_this, p);
    },
    onShowHandler: function () {
    },
    ocultarColumna: function () {
        //Redefinida porque la del padre da el gridDetalle indefinido y no abre la ventana
    }

});

LOG.tall.ordentrabajo.GridSelectPersona = Ext.extend(LOG.util.UITemplate, {
    idArea: '',
    constructor: function (config) {
        this.idArea = config.idArea;
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        this.urlBusquedaGridPrincipal = config.url ? config.url : 'cargarPersonasAreaInterna';
        this.busquedaBasica = true;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.GridSelectPersona.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = 'Adicionar personas';
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idpersona',
            hidden: true
        });
        this.addGridColumn({
            header: 'Codigo',
            width: 120,
            dataIndex: 'numid',
            default: true
        });
        this.addGridColumn({
            header: 'Nombre',
            dataIndex: 'nombreapellidos',
            id: 'nombreapellidosCA',
            default: true
        });
        this.addGridColumn({
            header: 'Cargo',
            width: 200,
            dataIndex: 'denomcargo',
            id: 'denominacionCA',
            default: true
        });

    },
    // initDefaultButtons: function () {
    //     var _this = this;
    //     this.addToolbarButton(new Ext.Button({
    //         tooltip: this.idioma.ttBtnMostrarTodasActv,
    //         iconCls: 'mostrar',
    //         text: this.idioma.lbMostrarTodas,
    //         handler: function () {
    //             _this.todo = 1;
    //             _this.getStorePrincipal().load({params: {todo: 1}});
    //         }
    //     }));
    // },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridSelectPersona.superclass.render.call(this);
        //this.storePrincipal.initBaseParams={idsexcluir:Ext.encode(this.idsMateriales)};
        this.storePrincipal.on('beforeload', function (store) {
            store.initBaseParams = {
                idarea: _this.idArea
            };
        });
        // this.storePrincipal.on('load', function (store, records) {
        //     if (store.getCount() == 0) {
        //         mostrarMensaje(1, _this.idioma.msjNoExistenActv);
        //     }
        // });
        this.gpPrincipal.autoExpandColumn = 'nombreapellidosCA';
        return vista;
    }
});

LOG.tall.ordentrabajo.GridSelectPersonaContacto = Ext.extend(LOG.tall.ordentrabajo.GridSelectPersona, {
    idArea: '',
    constructor: function (config) {
        this.modoSeleccion = 1;
        LOG.tall.ordentrabajo.GridSelectPersonaContacto.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = 'Seleccionar persona';
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 400;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idpersona',
            hidden: true
        });
        this.addGridColumn({
            header: 'Codigo',
            width: 100,
            dataIndex: 'idsuin',
            default: true
        });
        this.addGridColumn({
            header: 'Nombre',
            dataIndex: 'nombreapellidos',
            id: 'nombreapellidosCA',
            default: true
        });
        this.addGridColumn({
            header: 'Telefono',
            width: 200,
            dataIndex: 'telefono',
            default: true
        });
        this.addGridColumn({
            header: 'Correo',
            width: 200,
            dataIndex: 'correo',
            default: true
        });

    },
    // render: function () {
    //     var _this = this;
    //     var vista = LOG.tall.ordentrabajo.GridSelectPersona.superclass.render.call(this);
    //     //this.storePrincipal.initBaseParams={idsexcluir:Ext.encode(this.idsMateriales)};
    //     this.storePrincipal.on('beforeload', function (store) {
    //         store.initBaseParams = {
    //             idarea: _this.idArea
    //         };
    //     });
    //     // this.storePrincipal.on('load', function (store, records) {
    //     //     if (store.getCount() == 0) {
    //     //         mostrarMensaje(1, _this.idioma.msjNoExistenActv);
    //     //     }
    //     // });
    //     this.gpPrincipal.autoExpandColumn = 'nombreapellidosCA';
    //     return vista;
    // }
});

LOG.tall.ordentrabajo.GridSelectMateriales = Ext.extend(LOG.util.UITemplate, {
    /**
     * ids de materiales ya seleccionados
     */
    idsMateriales: undefined,
    idTipoPrecio: undefined,
    idCliente: undefined,
    integrarFac: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = typeof ORDEN_ENTIDADES !== 'undefined' ? true : false;
        this.busquedaBasica = true;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarMaterialesExistentes';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbMaterial;
        this.textBusquedaSimple = this.idioma.cgCodigo + ' o ' + this.idioma.cgDenominacion;
        LOG.tall.ordentrabajo.GridSelectMateriales.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = this.idioma.tlMateriales;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        //this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);

    },
    initDefaultButtons: function() {
        if (typeof ORDEN_ENTIDADES !== 'undefined') {
            var _this = this;

            this.addToolbarButton('->');
            this.addToolbarButton('-');
            this.addToolbarButton('Entidades' + ':');

            this.cmbEstructuras = new LOG.util.ComboBox({
                fieldLabel: '',
                url:'getEstructuras',
                name:'idestructura',
                displayField : 'denominacion',
                valueField : 'idestructura',
                minChars:3,
                resizable:true,
                //hidden: (!_this.grantedAction('REntidades')) ? true : false
                listeners: {
                    select: function (combo,record,index) {
                        _this.storePrincipal.load()
                    }
                }
            });

            this.addToolbarButton(_this.cmbEstructuras);
        }
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'cantplanif',
            hidden: true
        });

        this.addGridColumn({
          header: "Imagen",
          width: 40,
          dataIndex: "imagen",
          default: true,
          renderer: function (value, metaData, record) {
            if (record.json.imagen) {
              return '<button class="icondistra-aceptar verde" style="background: transparent;border:none"></button>';
            }
            return '<button class="icondistra-cancelar rojo" style="background: transparent;border:none"></button>';
          },
        });

        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 80,
            filter:
                {
                    type: 'string',
                    dataIndex: 'codigo'
                }
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            //id:'denominacionSM',
            width: 200,
            default: true,
            filter:
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                }
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            dataIndex: 'denominacionunidadmedida',
            width: 60
        });
        this.addGridColumn({
            header: 'Dep\xf3sito',
            dataIndex: 'deposito',
            width: 220,
            filter:
                {
                    type: 'string',
                    dataIndex: 'deposito'
                }
        });
        this.addGridColumn({
            dataIndex: 'iddeposito'
        });
        this.addGridColumn({
            dataIndex: 'idpodructo'
        });
        this.addGridColumn({
            dataIndex: 'disponible',
            header: this.idioma.cgCantidadDisponible,
            width: 90,
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'precioventa',
            header: this.idioma.cgPrecio,
            width: 90,
            renderer: function (val, x, record) {
                if (val <= 0) {
                    return '<span style="color:red;">' + '-' + '</span>';
                }
                return val;
            }
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'precioalternativo',
            header: this.idioma.cgPrecio + ' alternativo',
            width: 90,
            renderer: function (val) {
                if (val <= 0)
                    return "-";
                return val;
            }
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idunidadmedida',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'datosmoneda',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'almacenado',
            hidden: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridSelectMateriales.superclass.render.call(this);

        Ext.apply(_this.gpPrincipal, {
            viewConfig: {
                getRowClass: function (rec, index, rowParams, store) {
                    if (rec.data.precioventa <= 0) {
                        return 'redrow-text';
                    }
                }
            }
        });
        //this.getStorePrincipal().initBaseParams.idnaturaleza = naturalezaPPA;
        vista.listaBotones.getItem(2).disable();
        vista.listaBotones.getItem(1).disable();
        this.storePrincipal.on(
            {
                'load': function (store, records) {
                    if (store.getCount() == 0) {
                        vista.listaBotones.getItem(2).disable();
                        vista.listaBotones.getItem(1).disable();
                        mostrarMensaje(1, _this.idioma.msjNoExistenMaterial);
                    }
                },
                beforeload: function (st, obj) {
                    obj.params.idtipoprecio = _this.idTipoPrecio;
                    obj.params.idcliente = _this.idCliente;
                    obj.params.integrarfacturacion = _this.integrarFac;
                    obj.params.idestructuracomun = _this.cmbEstructuras && _this.cmbEstructuras.getValue() ? _this.cmbEstructuras.getValue() : null;
                    var excluir = "-1";
                    Ext.each(_this.idsMateriales, function (v) {
                        excluir += ", " + v;
                    });
                    obj.params.excluir = excluir;
                }
            });
            this.getGridPrincipal().on(
                "celldblclick",
                function (grid, rowIndex, columnIndex, e) {
                  this.img = grid.store.data.items[rowIndex].data.imagen;
          
                  if (columnIndex == 2 && this.img) {
                      //if (!_this.winImagen) {
                          _this.winImagen = new LOG.util.Window({
                              usarAplicar: false,
                              usarAceptar: false,
                              resizable: false,
                              title: 'Vista previa',
                              width: 450,
                              height: 450,
                              items: [
                                  LOG.util.UIManager.initPanel({
                                      region: 'center',
                                      html: '<img src='+this.img+' style="width: 100%; height: 100%;">'
                                  })
                              ]
                          });
                          _this.winImagen.on({
                              'show': function () {
                                  _this.winImagen.base64Img = this.img;
                              },
                              'close':function() {
                                  _this.winImagen.destroy();
                              }
                          });
                      }
          
                      _this.winImagen.show();
                      _this.winImagen.doLayout();
                  //}
                }
              );
        this.getSmPrincipal().on({
            'rowselect': function (sm) {
                vista.listaBotones.getItem(2).enable();
                vista.listaBotones.getItem(1).enable();
            },
            'rowdeselect': function (sm) {

                if (this.getSelections().length == 0) {
                    vista.listaBotones.getItem(2).disable();
                    vista.listaBotones.getItem(1).disable();
                }
            }

        });
        //this.gpPrincipal.autoExpandColumn = 'denominacionSM';

        return vista;
    }
});

LOG.tall.ordentrabajo.VentanaReclamaciones = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    /**
     * formulario que contiene los campos de entrada
     */
    formularioGeneral: undefined,
    constructor: function (config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.VentanaReclamaciones.superclass.constructor.call(this, config);
        this.modelo = new LOG.tall.ordentrabajo.ReclamacionesModel({
            idioma: this.idioma
        });
        this.modelo.posecionmedio = 1;
    },
    builComponent: function () {
        var _this = this;
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            animCollapse: false,
            animate: false,
            autoHeight: true,
            frame: true
        });
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        cls1.getColumn(0).labelAlign = 'left';
        cls1.getColumn(0).style = 'font: 12px tahoma,arial,helvetica,sans-serif;';
        this.lbNroOrdenTrabajo = new Ext.form.Label({
            labelAlign: 'left',
            width: 500,
            //fieldLabel:this.idioma.lbNroOrdenTrabajo
        });
        cls1.addComponent(this.lbNroOrdenTrabajo);
        var cls2 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.comboClientesR = new LOG.util.ComboBox({
            name: 'idcliente',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            fieldLabel: this.idioma.lbCliente,
            allowBlank: false,
            queryParam: 'criterio',
            mode: 'remote',
            disabled: true,
            minChars: 1,
            pageSize: 15,
            resizable: true
        });
        this.comboClientesR.store.on('load', function () {
            if (_this.record && _this.record.data.idcliente) {
                _this.comboClientesR.setValue(_this.comboClientesR.getValue());
            }
        });

        this.comboFecha = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaDeReclamacion,
            name: 'fechareclamacion',
            allowBlank: false,
            editable: false,
            invalidText: this.idioma.ttTextoFechaIncorrecto
        });

        cls2.addComponent(this.comboClientesR);
        cls2.addComponent(this.comboFecha);

        var cls3 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        cls3.getColumn(0).labelAlign = 'left';
        cls3.getColumn(0).columnWidth = 0.3;
        cls3.addComponent(new Ext.form.Label({text: this.idioma.lbDondeSeEncuentraMedio}));
        this.gRadioDondeEquipo = new Ext.form.RadioGroup({
            name: 'radios',
            columns: 2,
            vertical: true,
            items: [{
                boxLabel: 'Taller',
                name: 'rb',
                inputValue: '0'
            }, {
                boxLabel: this.idioma.lbsCliente,
                name: 'rb',
                inputValue: '1',
                checked: true
            }],
            listeners: {
                change: function (rb, newValue, oldValue) {
                    _this.modelo.posecionmedio = newValue.inputValue;
                    if (_this.modelo.basicForm.isValid()) {
                        _this.modelo.habilitarBotones();
                    } else _this.modelo.habilitarBotones(true);
                }
            }
        });
        cls3.addComponent(this.gRadioDondeEquipo);

        var cls4 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        var cls5 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.taCausasReclamacion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbCausasReclamacion,
            name: 'reclamacion',
            height: 150,
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true,
            allowBlank: false,
            //regex: LOG.util.Regex.cadena,
            //regexText :  _this.idioma.msgexpreAlfaNumRegexText,
        });
        cls5.addComponent(this.taCausasReclamacion);

        this.formularioGeneral = new LOG.util.Panel({
            frame: true,
            labelAlign: 'top',
            items: [cls1, cls2, cls3, cls4, cls5]
        });

        this.btnSalvar = LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonGuardar({
            key: {
                alt: true,
                key: 'G'
            },
            handler: function () {
                _this.salvarHandler(),
                    _this.modelo.reset();
                _this.record = null;
                _this.close();
            },
            scope: this,
            tooltip: this.idioma.ttBtnGuardarR
        }));
        this.btnCerrar = LOG.util.UIManager.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonCancelar({
            key: {
                ctrl: true,
                alt: true,
                key: 'X'
            },
            handler: function () {
                _this.modelo.reset();
                _this.record = null;
                _this.close();
            },
            text: this.idioma.lbBtnCerrar,
            scope: this
        }));

        _this.modelo.addActionButton(this.btnSalvar);

        LOG.util.UIManager.apply(this, {
            title: this.idioma.tlReclamaciones,
            width: 600,
            height: 440,
            constrain: true,
            resizable: false,
            items: [this.panelPrincipal],
            buttons: [this.btnCerrar, this.btnSalvar]
        });
        LOG.tall.ordentrabajo.VentanaReclamaciones.superclass.initComponent.call(this);
        this.basicFormulario = new LOG.util.UIManager.initForm();
        this.basicFormulario.add(this.formularioGeneral);
        this.panelPrincipal.add(this.basicFormulario);
    },
    prepareForm: function (d) {
        if (this.basicFormulario) {
            this.record = d;
            this.basicFormulario.getForm().loadRecord(this.record);
            this.modelo.bindForm(this.basicFormulario);
            this.modelo.loadRecord();
            this.lbNroOrdenTrabajo.setText(this.idioma.lbNroOrdenTrabajo + ': ' + this.record.data.nrodoc);

        }
    },
    bindGridPanel: function (grid) {
        this.modelo.bindGridPanel(grid);
    },
    salvarHandler: function () {
        var _this = this.scope || this;
        _this.modelo.salvarReclamacion({}, function (result) {
            _this.comboFecha.reset();
            _this.taCausasReclamacion.reset();
        });
    },
    onCloseHandler: function (p) {
        var _this = this;
        _this.modelo.reset();
        _this.record = null;
        this.gRadioDondeEquipo.reset();
        return LOG.tall.ordentrabajo.VentanaReclamaciones.superclass.onCloseHandler.call(_this, p);
    },
    onShowHandler: function () {
    },
    setFechaInicioOrden: function (fecha) {
        this.comboFecha.setMinValue(fecha);
    },
    ocultarColumna: function () {
        //Redefinida porque la del padre da el gridDetalle indefinido y no abre la ventana
    }

});

LOG.tall.ordentrabajo.GridReclamaciones = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarReclamacionesOrden';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbReclamacion;
        this.textBusquedaSimple = this.idioma.cgDenominacion;
        LOG.tall.ordentrabajo.GridReclamaciones.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idordenreclamacion',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'descripcion',
            id: 'descripcionReclamacion'
        });
        this.addGridColumn({
            header: this.idioma.cgFechaReclamacion,
            dataIndex: 'fechareclamacion'
        });
        this.addGridColumn({
            header: this.idioma.cgPosecionMedio,
            dataIndex: 'posecionmedio',
            renderer: function (value) {
                if (value == 0)
                    return _this.idioma.lbTaller;
                return _this.idioma.lbsCliente;
            }
        });
    },
    render: function () {
        var vista = LOG.tall.ordentrabajo.GridReclamaciones.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'descripcionReclamacion';
        return vista;
    }
});

LOG.tall.ordentrabajo.GridFallas = Ext.extend(LOG.util.UITemplate, {
    /**
     * Prototipo de los record a crear
     */
    topicRecord: undefined,
    /**
     * lista de fallas eliminadas
     */
    listaEliminados: undefined,
    /**
     * lista de fallas adicionadas
     */
    listaAdicionados: undefined,
    /**
     * id producto seleccionado
     */
    idproducto: undefined,
    /**
     * true permite que se habiliten los componentes para modificar, false : no
     * */
    habilitado: true,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.panelBotonesVisible = true;
        this.busquedaBasica = true;
        this.modoSeleccion = 2;
        this.listaAdicionados = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarFallasDetectadasAlMedio';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbFallas;
        this.textBusquedaSimple = this.idioma.cgFallasDetectadas;
        this.topicRecord = Ext.data.Record.create([
            {name: 'idfallasordentrabajo'},
            {name: 'idfalla'},
            {name: 'denominacion'},
            {name: 'estado'},
            {name: 'idproducto'},
            {name: 'soluciones'},
        ]);
        LOG.tall.ordentrabajo.GridSelectMateriales.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idfallasordentrabajo',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idfalla',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgFallasDetectadas,
            dataIndex: 'denominacion',
            id: 'denominacionF',
            //default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnAdicionarFallas,
            iconCls: 'adicionar',
            text: LOG.util.Idioma.lbBtnAdicionar,
            handler: function () {
                if (_this.idproducto) {
                    var idsExcluir = new Array();
                    _this.getStorePrincipal().each(function (r, pos) {
                        idsExcluir[pos] = r.data.idfalla;
                    });
                    var selectFallas = new LOG.tall.ordentrabajo.GridSelectFallas({
                        idioma: _this.idioma,
                        idproducto: _this.idproducto,
                        idexcluir: idsExcluir
                    });
                    selectFallas.init();
                    selectFallas.view();
                    selectFallas.getStorePrincipal().load();
                    selectFallas.getVistaPrincipal().aceptarFn = function () {
                        var records = selectFallas.getSmPrincipal().getSelections();
                        if (selectFallas.getSmPrincipal().hasSelection()) {
                            _this.adicionarRecords(records);
                        }
                    }
                } else mostrarMensaje(2, _this.idioma.msgSelectMedio);
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: LOG.util.Idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminarFallas,
            isContextual: true,
            handler: function () {
                if (_this.getSmPrincipal().hasSelection()) {
                    if (_this.getSmPrincipal().hasSelection()) {
                        mostrarMensaje(2, _this.idioma.msgEliminarFalla, function (btn) {
                            if (btn == 'ok') {
                                Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                                _this.eliminarRecords(_this.getSmPrincipal().getSelections());
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, _this.idioma.msgFallaEliminado);
                            }

                        });
                    }
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado/*&& _caller.getGridPrincipal().getSelectionModel().getSelected().data.critico != 1*/) {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
    },
    adicionarRecords: function (records) {
        var _this = this;
        Ext.each(records, function (r) {
            var myNewRecord = new _this.topicRecord({
                idfallasordentrabajo: null,
                idfalla: r.json.idfalla,
                denominacion: r.data.denominacion,
                idproducto: r.data.idproducto,
                estado: r.data.estado,
                soluciones: r.json.soluciones
            });
            _this.getStorePrincipal().add(myNewRecord);
        });
    },
    eliminarRecords: function (records) {
        var _this = this;
        Ext.each(records, function (r) {
            if (r.data.idfallasordentrabajo) {
                _this.listaEliminados.add(r.data.idfallasordentrabajo);
            }
            _this.getStorePrincipal().remove(r);
        });
    },
    salvarFallas: function () {
        var _this = this;
        var allRecord = this.getStorePrincipal().getRange();
        Ext.each(allRecord, function (rm, index) {
            if (!rm.data.idfallasordentrabajo || rm.dirty) {
                _this.listaAdicionados.add(rm);
            }
        });

        var fallasAdd = new Array();
        this.listaAdicionados.each(function (element, pos) {
            fallasAdd[pos] = element.data;
        });

        var param = {};
        param['fallasadd'] = fallasAdd;
        param['fallaselim'] = this.listaEliminados.getArray();

        this.listaAdicionados.deleteAll();
        this.listaEliminados.deleteAll();
        return param;
    },
    eliminarFallasDelMedio: function () {
        this.getStorePrincipal().removeAll();
    },
    setIdMedio: function (idproducto) {
        this.idproducto = idproducto;
    },
    limpiarListas: function () {
        this.listaAdicionados.deleteAll();
        this.listaEliminados.deleteAll();
    },
    render: function () {
        var vista = LOG.tall.ordentrabajo.GridFallas.superclass.render.call(this);
        vista.addEvents('addedfallas');
        vista.addEvents('deletedfallas');
        this.storePrincipal.on('add', function (st, records, index) {
            vista.fireEvent('addedfallas', st, records, index);
        });
        this.storePrincipal.on('remove', function (st, record, index) {
            vista.fireEvent('deletedfallas', st, record, index);
        });
        this.gpPrincipal.autoExpandColumn = 'denominacionF';
        return vista;
    },
    habilitar: function () {
        this.habilitado = true;
        this.listaBotones.getItem(0).enable();
        this.listaBotones.getItem(1).enable();
    },
    deshabilitar: function () {
        this.habilitado = false;
        this.listaBotones.getItem(0).disable();
        this.listaBotones.getItem(1).disable();
    }
});

LOG.tall.ordentrabajo.GridSelectFallas = Ext.extend(LOG.util.UITemplate, {
    /**
     * identificador del producto para obtener sus tipos de fallas
     */
    idproducto: undefined,
    /**
     * array de ids de fallas ya seleccionadas
     */
    idexcluir: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarPosiblesFallasDelMedio';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbFallas;
        this.textBusquedaSimple = this.idioma.cgFallasDetectadas;
        LOG.tall.ordentrabajo.GridSelectFallas.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = this.idioma.tlAdicionarFallas;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idfallas',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgFallasDetectadas,
            dataIndex: 'denominacion',
            id: 'denominacionSF',
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'estado',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'soluciones',
            hidden: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridSelectFallas.superclass.render.call(this);
        this.storePrincipal.on({
            'beforeload': function (st) {
                st.initBaseParams = {idproducto: _this.idproducto, excluir: _this.idexcluir};
                vista.listaBotones.getItem(2).disable();
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denominacionSF';
        vista.listaBotones.getItem(2).disable();
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'rowselect') {
                if (_this.getGridPrincipal().getSelectionModel().getSelected()) {
                    vista.listaBotones.getItem(2).enable();
                }
            }
            if (e == 'rowdeselect') {
                vista.listaBotones.getItem(2).disable();
            }
        });
        return vista;
    }
});

LOG.tall.ordentrabajo.GridMedios = Ext.extend(LOG.util.UITemplate, {
    idexcluir: undefined,
    identidad: undefined,
    idindicador: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        config.urlBusquedaGridPrincipal = '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getCargarEnviadosATaller';
        // config.urlBusquedaGridPrincipal = '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.GridSelectMateriales.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = 'Seleccionar el medio';
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            id: 'denominacionM',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            //default: true
        });

    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridMedios.superclass.render.call(this);
        this.storePrincipal.on('beforeload', function (st) {
            st.initBaseParams = {idestructura: _this.identidad, idindicador: _this.idindicador};
        });
        this.gpPrincipal.autoExpandColumn = 'denominacionM';
        return vista;
    }
});

LOG.tall.ordentrabajo.VentanaRegistrarSolucion = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    formularioGeneral: undefined,
    idSolucionOrdenTrabajo: undefined,
    constructor: function (config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.VentanaRegistrarSolucion.superclass.constructor.call(this, config);
        this.modelo = new LOG.tall.ordentrabajo.SolucionModel({
            idioma: this.idioma
        });
    },
    builComponent: function () {
        var _this = this;
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            animCollapse: false,
            animate: false,
            autoHeight: true,
            frame: true
        });
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        cls1.getColumn(0).labelAlign = 'left';
        cls1.getColumn(0).style = 'font: 12px tahoma,arial,helvetica,sans-serif;';
        this.lbNroOrdenTrabajo = new Ext.form.Label({
            labelAlign: 'left',
            //fieldLabel: this.idioma.lbNroOrdenTrabajo
        });

        cls1.addComponent(this.lbNroOrdenTrabajo);
        var cls2 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.comboTecnico = new LOG.util.ComboBox({
            name: 'idtecnico',
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarPersonas',
            valueField: 'idpersona',
            displayField: 'nombreapellidos',
            fieldLabel: this.idioma.lbTecnico,
            mode: 'remote',
            disabled: true,
            width: '98%',
            queryParam: 'criterio',
            minChars: 1,
            pageSize: 15,
            resizable: true,
            allowBlank: false
        });
        this.comboTecnico.store.on('load', function (store) {
            if (_this.record && _this.record.data.idtecnico) {
                _this.comboTecnico.setValue(_this.comboTecnico.getValue());
            }
        });
        cls2.addComponent(this.comboTecnico);

        var cls5 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.textAreaSolucion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbSolucion,
            name: 'solucion',
            height: 150,
            allowBlank: false,
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true,
            //regex: LOG.util.Regex.cadena,
            //regexText :  _this.idioma.msgexpreAlfaNumRegexText,
        });
        cls5.addComponent(this.textAreaSolucion);

        this.formularioGeneral = new LOG.util.Panel({
            frame: true,
            labelAlign: 'top',
            items: [cls1, cls2, cls5]
        });

        this.btnSalvar = LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonGuardar({
            key: {
                alt: true,
                key: 'G'
            },
            handler: function () {
                _this.salvarHandler();
                _this.modelo.reset();
                _this.record = null;
                _this.close();
            },
            scope: this,
            tooltip: this.idioma.ttBtnGuardarS
        }));

        this.btnCerrar = LOG.util.UIManager.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonCancelar({
            key: {
                ctrl: true,
                alt: true,
                key: 'X'
            },
            handler: function () {
                _this.modelo.reset();
                _this.record = null;
                _this.close();
            },
            text: this.idioma.lbBtnCerrar,
            scope: this
        }));

        this.modelo.addActionButton(this.btnSalvar);

        LOG.util.UIManager.apply(this, {

            title: this.idioma.tlRegistrarSolucion,
            width: 600,
            height: 330,
            constrain: true,
            resizable: false,
            items: [this.panelPrincipal],
            buttons: [this.btnCerrar, this.btnSalvar]
        });
        LOG.tall.ordentrabajo.VentanaReclamaciones.superclass.initComponent.call(this);
        this.basicFormulario = new LOG.util.UIManager.initForm();
        this.basicFormulario.add(this.formularioGeneral);
        this.panelPrincipal.add(this.basicFormulario);
    },
    prepareForm: function (d) {
        var _this = this;
        if (this.basicFormulario) {
            this.body.mask(_this.idioma.msjLoadMask);
            this.record = d;
            this.modelo.bindForm(this.basicFormulario);
            this.modelo.loadRecord();

            this.modelo.idordentrabajo = d.data.iddocumento;
            this.lbNroOrdenTrabajo.setText(this.idioma.lbNroOrdenTrabajo + ': ' + this.record.data.nrodoc);
            this.modelo.cargarDatosSolucion({idordentrabajo: d.data.iddocumento}, function (valor) {
                if (valor.datos) {
                    _this.modelo.solucion = valor.datos.solucion;
                    _this.textAreaSolucion.setValue(valor.datos.solucion);
                    _this.comboTecnico.setValue(valor.datos.idtecnico);
                    _this.modelo.idtecnico = valor.datos.idtecnico;
                    _this.idSolucionOrdenTrabajo = valor.datos.idsolucionordentrabajo;
                }
                _this.body.unmask();
            });
        }
    },
    bindGridPanel: function (grid) {
        this.modelo.bindGridPanel(grid);
    },
    salvarHandler: function () {
        var _this = this.scope || this;
        _this.modelo.idsolucionordentrabajo = _this.idSolucionOrdenTrabajo;
        _this.modelo.idsolucionordentrabajo = _this.idSolucionOrdenTrabajo;
        _this.modelo.salvarSolucion({}, function (result) {
            _this.idSolucionOrdenTrabajo = result.datos.idsolucionordentrabajo;
        });
    },
    onCloseHandler: function (p) {
        var _this = this;
        _this.modelo.reset();
        _this.idSolucionOrdenTrabajo = undefined;
        _this.record = null;
        return LOG.tall.ordentrabajo.VentanaReclamaciones.superclass.onCloseHandler.call(_this, p);
    },
    onShowHandler: function () {
    },
    ocultarColumna: function () {
        //Redefinida porque la del padre da el gridDetalle indefinido y no abre la ventana
    },
    deshabilitar: function () {
        this.comboTecnico.disable();
        this.textAreaSolucion.disable();
        this.btnSalvar.disable();
    },
    habilitar: function () {
        this.comboTecnico.enable();
        this.textAreaSolucion.enable();
        if (this.modelo.isValid())
            this.modelo.habilitarBotones();
        else this.modelo.habilitarBotones(true);

    }

});


/**
 * Ventana de seleccion del documento que origina la orden de trabajo
 */
LOG.tall.ordentrabajo.ventanaDocumentoOrigen = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    panelGeneral: undefined,
    tabPanelGeneral: undefined,
    arrClientes: undefined,
    arrMedios: undefined,
    arrProveedores: undefined,
    usarInscripcion: true,
    usarPedido: true,
    listaAcciones: undefined,
    constructor: function (config) {
        this.usarAplicar = false;
        this.listaAcciones = new LOG.util.List(config.acciones);
        LOG.tall.ordentrabajo.ventanaDocumentoOrigen.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
    },
    initComponent: function () {
        var _this = this;
        LOG.tall.ordentrabajo.ventanaDocumentoOrigen.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
            // tbar: this.listaBotonesVentana.getArray()
        });
        this.tabPanelGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });
        if (this.grantedAction('docOrigenInscripcion')) {
            this.tab1 = new LOG.tall.ordentrabajo.GridIncripcion({
                idioma: _this.idioma,
                title: _this.idioma.tlPorIncripcion,
                height: 300,
                arrClientes: _this.arrClientes,
                arrMedios: _this.arrMedios,
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab1);
        }
        if (this.grantedAction('docOrigenSolicitud')) {
            this.tab2 = new LOG.tall.ordentrabajo.GridSolicitudes({
                idioma: _this.idioma,
                title: _this.idioma.tlPorSolicitud,
                height: 300,
                arrClientes: _this.arrClientes,
                arrMedios: _this.arrMedios
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab2);
        }
        if (this.grantedAction('docOrigenSolicitudTerceros')) {
            this.tab3 = new LOG.tall.ordentrabajo.GridSolicitudesTerceros({
                idioma: _this.idioma,
                title: _this.idioma.tlPorSolicitudTerceros,
                height: 300,
                arrProveedores: _this.arrProveedores,
                arrMedios: _this.arrMedios
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab3);
        }
        if (this.grantedAction('origenPlanifMantenimiento')) {
            this.tab4 = new LOG.tall.ordentrabajo.GridPlanificado({
                idioma: _this.idioma,
                title: _this.idioma.tlPorPlanificacion,
                height: 300,
                arrProveedores: _this.arrProveedores,
                arrMedios: _this.arrMedios
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab4);
        }
        if (this.grantedAction('docOrigenPedido')) {
            this.tab5 = new LOG.tall.ordentrabajo.GridPedido({
                idioma: _this.idioma,
                title: _this.idioma.tlPedido,
                height: 300,
                arrProveedores: _this.arrProveedores,
                arrMedios: _this.arrMedios
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab5);
        }
        //   if (this.grantedAction('docOrigenCita')) {
        this.tab6 = new LOG.tall.ordentrabajo.GridCita({
            idioma: _this.idioma,
            title: "Cita",
            height: 300,
            //estado: 1,
            //arrMedios: _this.arrMedios
        });
        this.tabPanelGeneral.addTabToTemplete(this.tab6);
        // }
        this.tabPanelGeneral.init();
        var x = this.tabPanelGeneral.view();
        x.height = 400;
        x.width = 800;
        x.frame = false;
        this.panelGeneral.add(x);
        this.add(this.panelGeneral);
        this.tabPanelGeneral.on({
            tabchange: function (p, tab) {
                if (tab && _this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().getCount() == 0)
                    _this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().load();
            }
        })
    },
    validacionBtn: function () {
        var _this = this;
        if (this.tab1) {
            this.tab1.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'incripcion') {
                        _this.listaBotones.getItem(2).enable();
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'incripcion') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
        }
        if (this.tab2) {
            this.tab2.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'solicitud') {
                        _this.listaBotones.getItem(2).enable()
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'solicitud') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
        }
        if (this.tab3) {
            this.tab3.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'solicitudterceros') {
                        _this.listaBotones.getItem(2).enable()
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'solicitudterceros') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
        }
        if (this.tab4) {
            this.tab4.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'planificacion') {
                        _this.listaBotones.getItem(2).enable();
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'planificacion') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
        }
        if (this.tab5) {
            this.tab5.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'pedido') {
                        _this.listaBotones.getItem(2).enable();
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'pedido') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
        }
        if (this.tab6) {
            this.tab6.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'cita') {
                        _this.listaBotones.getItem(2).enable();
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'cita') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
        }
        this.tabPanelGeneral.on({
            tabchange: function (p, tab) {
                if (tab && _this.tabPanelGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                    _this.listaBotones.getItem(2).enable();
                } else _this.listaBotones.getItem(2).disable();
            }
        });
    },
    cargarSolicitud: function () {
        this.tab2.getStorePrincipal().load();
    },
    cargarSolicitudTerceros: function () {
        this.tab3.getStorePrincipal().load();
    },
    cargarInscripcion: function () {
        this.tab1.getStorePrincipal().load();
    },
    cargarPlanificacion: function () {
        this.tab4.getStorePrincipal().load();
    },
    cargarPedido: function () {
        this.tab5.getStorePrincipal().load();
    },
    grantedAction: function (idAccion) {
        var existe = false;
        this.listaAcciones.each(function (a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    }
});

LOG.tall.ordentrabajo.GridDinamicos = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = true;
        this.dirController = '/configuracion/nomdinamicos/index.php/nomdinamicos';
        config.urlBusquedaGridPrincipal = 'getvalores';
        this.busquedaBasica = true;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.GridDinamicos.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = this.idioma.tlVentanaSelectAeropuerto;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        this.modoSeleccion = 1;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'id',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_denominaciontnu_3',
            anchor: '100%',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaInicio,
            width: 120,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_fechainicio',
            hidden: true
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaFin,
            width: 120,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_fechafin',
            hidden: true
            //default: true,
            // id: 'denomIndicador'
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_num_1',
            //default: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridDinamicos.superclass.render.call(this);
        /*  this.storePrincipal.on('load', function (store, records) {

              if (store.getCount() == 0) {
                  mostrarMensaje(1, _this.idioma.msjNoExistenActv);
              }
          });*/
        return vista;
    }
});


LOG.tall.ordentrabajo.GridSolicitudes = Ext.extend(LOG.util.UITemplate, {
    arrClientes: undefined,
    arrMedios: undefined,
    identificador: 'solicitud',
    idComponent: 'solicitud',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.dirController = "/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres";
        this.panelBotonesVisible = false;
        config.urlBusquedaGridPrincipal = 'cargarSolicitudesAprobadas';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbSolicitud;
        LOG.tall.ordentrabajo.GridSolicitudes.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgNumeroSolicitud;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'falloscliente',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fallostecnicos',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'garantia',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNumeroSolicitud,
            width: 120,
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idcliente',
            header: this.idioma.cgCliente,
            id: 'clienteSP',
            //default: true,
            renderer: function (val) {
                var resul = val;
                Ext.each(_this.arrClientes, function (r) {
                    if (r['idclientesproveedores'] == val) {
                        resul = r['nombre'];
                    }
                });
                return resul;
            }
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true

        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true

        });
        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            header: this.idioma.cgMedio,
            width: 210,
            //default: true,
            renderer: function (val) {
                var resul = val;
                Ext.each(_this.arrMedios, function (r) {
                    if (r['idindicador'] == val) {
                        resul = r['denominacion'];
                    }
                });
                return resul;
            }
        });
        this.addGridColumn({
            dataIndex: 'idtecnico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            hidden: true
        });
    },
    setArrayMedios: function (arrayM) {
        this.arrMedios = arrayM;
    },
    setArrayClientes: function (arrayC) {
        this.arrClientes = arrayC;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridSolicitudes.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'clienteSP';
        return vista;
    },
    getIdentificador: function () {
        return this.identificador;
    }
});
LOG.tall.ordentrabajo.ubicacionwin = Ext.extend(LOG.util.UITemplate, {
    panelGeneral: undefined,
    
    constructor : function(config){
        this.formaVisualizacion = 'ventana';
        this.autoLoad = true;
        this.autoSelect = false;
        this.modoSeleccion = 1;
        this.pruneModifiedRecords = true;
        this.panelBotonesVisible = true;
        this.baseParams = config.datos.data;
        this.gridEditable = true;
        this.dirController = "/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres";
        this.urlBusquedaGridPrincipal = 'cargarubicaciontalleres';
        this.busquedaBasica = false;
        config.viewConfig = {
            title: 'Ubicación de órdenes',
            height: Ext.lib.Dom.getViewHeight() * 0.5,
            width: Ext.lib.Dom.getViewWidth() * 0.5,
            usarAplicar: false,
            usarAceptar : false
        };
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.ordentrabajo.ubicacionwin.superclass.constructor.call(this, config);

        this.comboubicaciones = new LOG.util.ComboBox({
            name: 'ubicaciones',
            autoLoad: false,
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarnomubicaciontall',
            displayField: 'denominacion',
            allowblank: false,
            valueField: 'idubicaciontall',
            mode: 'remote',
            resizable: true
        });
        this.comboubicaciones.store.on('beforeload', function(store) {
            store.baseParams.todas =  0;
        });
        this.comboFecha = new Ext.form.DateField({
            name: 'fechainicio',
            vtype: 'daterange',
            editable: true,
            validarEnFormBasico: true,
            dateFormat : ('d/m/Y')
        });
        
     },
     initDefaultButtons: function(){
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            iconCls: 'adicionar',
            text: 'Adicionar ubicación',
            disabled : true,
            tooltip: 'Adcionar ubicación de la orden',
            handler: function(){
                var record = new _this.recStGridPrincipal();
                _this.getStorePrincipal().insert(0, record);
            },
            controlFn: function (b, _caller) {
                _caller.getStorePrincipal().fireEvent = _caller.getStorePrincipal().fireEvent.createSequence(function (s,r,i) {
                if (_caller.datos.data.estado == 1 || _caller.datos.data.estado == 2) {
                    if (r.getModifiedRecords()[0]) {
                        b.disable();
                    }else{
                        b.enable();
                       }
                    if(r.getCount() == 0){
                        b.disable();
                       }     
                }else{
                    b.disable();
                }  
                });
            }
            }))
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            iconCls: 'eliminar',
            text: 'Eliminar ubicación',
            disabled : true,
            tooltip: 'Eliminar ubicación de la orden',
            handler : function () {
                var selection =_this.getGridPrincipal().getSelectionModel().getSelected();
                if(!_this.getGridPrincipal().getSelectionModel().getSelected().json){
                    _this.getStorePrincipal().remove(_this.getGridPrincipal().getSelectionModel().getSelected());
                }
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        var selected = _caller.getGridPrincipal().getSelectionModel().getSelected().json;
                        if (!selected) {
                        b.enable();   
                        }else{
                            b.disable();
                        }
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (e == 'rowselect') {
                            var selected = _caller.getGridPrincipal().getSelectionModel().getSelected().json;
                            if (!selected) {
                            b.enable();   
                            }else{
                                b.disable();
                            }
                        }
                    }

                });
                _caller.getStorePrincipal().fireEvent = _caller.getStorePrincipal().fireEvent.createSequence(function (s,r,i) {
                    if (!r.getModifiedRecords()[0]) {
                        b.disable();
                    }
                });
            }
        }))
        this.addToolbarButton(LOG.util.Prototipos.botonGuardar({
            iconCls : 'guardar',
            text : 'Guardar ubicación',
            tooltip: 'Guardar la ubicación de la orden',
            disabled : true,
            handler : function(){
                Ext.MessageBox.wait('Guardando ubicación', _this.idioma.msgEspere || '...');
                var modifiedrecord = _this.getStorePrincipal().getModifiedRecords();
                var flag = true;
                for (let index = 0; index < modifiedrecord.length; index++) {
                    if(!modifiedrecord[index].data.fechainicio || !modifiedrecord[index].data.denominacion){
                        flag = false;
                        break;
                    }
                    index++;
                }
                
                if(flag){
                    var arr = new Array();
                    for(let index = 0; index < modifiedrecord.length; index++){
                        arr[index]=modifiedrecord[index].data;
                    };
                       Ext.Ajax.request({
                            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/insertarubicacionestall',
                            method: 'POST',
                            params: {
                                datos: Ext.encode(arr),
                                iddocumento : _this.baseParams.iddocumento
                            },
                            callback: function(o, s, r) {
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (!resp.success) {
                                    Ext.MessageBox.hide();
                                    mostrarMensaje(1,resp.responsetext);   
                                }else{
                                    Ext.MessageBox.hide();
                                    mostrarMensaje(1, 'Ubicación guardada con éxito');
                                    _this.getStorePrincipal().load();
                                }
                                
                            }.createDelegate(this)
                        });
                }else{
                    Ext.MessageBox.hide();
                    mostrarMensaje(2, 'No se puede guardar la ubicación sin una ubicación o fecha de inicio');
                }
            },  
            controlFn: function (b, _caller) {
                _caller.getStorePrincipal().fireEvent = _caller.getStorePrincipal().fireEvent.createSequence(function (s,r,i) {
                    if (r.getModifiedRecords()[0]) {
                        b.enable();
                    }else{
                        b.disable();
                    }

                });
            }
        }))
     },
     initDefaultColumns : function (){
        var _this = this;
        this.addGridColumn({
            header: 'Ubicación',
            width: 100,
            editable: true,
            dataIndex: 'idubicaciontall',
            default: true,
            editor : this.comboubicaciones,
            renderer: function (value, c, record) {
                return record.get('denominacion');
            },
        });
        this.addGridColumn({
            header: 'Fecha Inicio',
            width: 100,
            dataIndex: 'fechainicio',
            default: true,
            editor : this.comboFecha,
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            },
        });
        this.addGridColumn({
            header: 'Fecha Fin',
            width: 100,
            dataIndex: 'fechafin',
            default: true
        });
        this.addGridColumn({
            header: 'Estadía',
            width: 100,
            dataIndex: 'estadia',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'eliminable',
            hidden : true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            hidden : true
        });
     },
     
    formatDate: function (value, c, record) {
        if (value) {
            if (typeof value == "object") {
                return value.dateFormat('d/m/Y');
            }
        }
        return value;
    },
     render: function () {
        var _this = this;
        var vista =  LOG.tall.ordentrabajo.ubicacionwin.superclass.render.call(this);
        _this.getStorePrincipal().load();
        _this.getGridPrincipal().on({
            afteredit: function (e) {
                if (e.field == 'idubicaciontall') {
                    e.record.set('denominacion', _this.comboubicaciones.getRawValue());
                }
            },
            beforeedit : function (e) {
                if (e.field == 'idubicaciontall' && _this.getGridPrincipal().getSelectionModel().getSelected().json) {
                    return false;
                }
                if (e.field == 'fechainicio'  && _this.getGridPrincipal().getSelectionModel().getSelected().json ) {
                    return false;
                }
                if (e.field == 'fechainicio') {
                    var indexactual =  _this.getStorePrincipal().indexOf(_this.getGridPrincipal().getSelectionModel().getSelected()); 
                    var indexsiguiente = _this.getStorePrincipal().getAt(indexactual + 1)
                    if (indexsiguiente != -1 || indexsiguiente) {
                        var fechanterior = indexsiguiente.json.fechainicio;
                        _this.comboFecha.setMinValue(fechanterior);
                    }
                    let time = Date.now();
                    let hoy = new Date(time);
                    _this.comboFecha.setMaxValue(hoy);
                }
            }
        });
        return vista;
    }
});
LOG.tall.ordentrabajo.GridSolicitudesTerceros = Ext.extend(LOG.util.UITemplate, {
    arrProveedores: undefined,
    arrMedios: undefined,
    identificador: 'solicitudterceros',
    idComponent: 'solicitudterceros',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.dirController = "/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres";
        this.panelBotonesVisible = false;
        config.urlBusquedaGridPrincipal = 'cargarSolicitudesATercerosAprobadas';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbSolicitud;
        LOG.tall.ordentrabajo.GridSolicitudesTerceros.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgNumeroSolicitud;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'falloscliente',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fallostecnicos',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'garantia',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNumeroSolicitud,
            width: 120,
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idagencia',
            header: this.idioma.cgAgencia,
            id: 'clienteSP',
            //default: true,
            renderer: function (val, x, rec) {
                var resul = val;
                Ext.each(_this.arrProveedores, function (r) {
                    if (r['idclientesproveedores'] == val) {
                        resul = r['nombre'];
                    }
                });
                resul = resul ? resul : rec.json.entidad;
                return resul;
            }
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true

        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true

        });
        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            header: this.idioma.cgMedio,
            width: 210,
            //default: true,
            renderer: function (val) {
                var resul = val;
                Ext.each(_this.arrMedios, function (r) {
                    if (r['idindicador'] == val) {
                        resul = r['denominacion'];
                    }
                });
                return resul;
            }
        });
        this.addGridColumn({
            dataIndex: 'idtecnico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            hidden: true
        });
    },
    setArrayMedios: function (arrayM) {
        this.arrMedios = arrayM;
    },
    setArrayClientes: function (arrayC) {
        this.arrClientes = arrayC;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridSolicitudesTerceros.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'clienteSP';
        return vista;
    },
    getIdentificador: function () {
        return this.identificador;
    }
});

LOG.tall.ordentrabajo.GridIncripcion = Ext.extend(LOG.util.UITemplate, {
    arrClientes: undefined,
    arrMedios: undefined,
    identificador: 'incripcion',
    idComponent: 'incripcion',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/inscripciones/index.php/inscripcion';
        this.urlBusquedaGridPrincipal = 'generarDatos';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbIncripcion;
        LOG.tall.ordentrabajo.GridIncripcion.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgNoins;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgNoins,
            width: 110,
            dataIndex: 'nrodoc',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTipo,
            width: 160,
            dataIndex: 'tipo',
            //default: true,
            renderer: function (value) {
                if (value == '1') {
                    return _this.idioma.labelPermanente;
                }
                return _this.idioma.labelTemporal;
            }

        });
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
        this.addGridColumn({
            dataIndex: 'datosmedio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fechainicio',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgCliente,
            width: 210,
            dataIndex: 'idcliente',
            //default: true,
            renderer: function (val) {
                var resul = val;
                Ext.each(_this.arrClientes, function (r) {
                    if (r['idclientesproveedores'] == val) {
                        resul = r['nombre'];
                    }
                });
                return resul;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgMedio,
            width: 210,
            dataIndex: 'descripcionmarcamodelo',
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idmedio',
            hidden: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    }
});

LOG.tall.ordentrabajo.GridPlanificado = Ext.extend(LOG.util.UITemplate, {
    arrClientes: undefined,
    arrMedios: undefined,
    identificador: 'planificacion',
    idComponent: 'planificacion',
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/planificacionmantenimiento';
        this.urlBusquedaGridPrincipal = 'cargarRegNumMantenimiento';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.idGridPrincipal = 'idregnumerico';
        //this.concepto = this.idioma.lbIncripcion;
        LOG.tall.ordentrabajo.GridPlanificado.superclass.constructor.call(this, config);
        //this.textBusquedaSimple = this.idioma.cgNoins;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 210,
            dataIndex: 'codigo',
            //default: true

        });
        this.addGridColumn({
            header: this.idioma.cgMedio,
            width: 210,
            dataIndex: 'denominacion',
            //default: true

        });
        this.addGridColumn({
            header: this.idioma.cgMatricula,
            width: 210,
            dataIndex: 'nromatricula',
            //default: true,
            filter: {
                type: 'string',
                dataIndex: 'nromatricula'
            }

        });
        this.addGridColumn({
            header: this.idioma.cgIndicativo,
            width: 210,
            dataIndex: 'indicativo',
            //default: true,
            filter:
                {
                    type: 'string',
                    dataIndex: 'indicativo'
                }

        });
        this.addGridColumn({
            header: 'Nro serie',
            width: 100,
            dataIndex: 'nroserie',
            //default: true

        });
        this.addGridColumn({
            header: 'Explotaci\xf3n',
            width: 90,
            dataIndex: 'tiempoexplotacion',
            //default: true
        });
        this.addGridColumn({
            header: 'Recurso consumido',
            width: 90,
            dataIndex: 'cantidadrecursoconsumido',
            //default: true
        });
        this.addGridColumn({
            header: 'Per\xedodo/Recurso',
            width: 90,
            dataIndex: 'planfmantenim',
            agrupador: true,
            hidden: true,
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idplanificacionmantenimiento',
            hidden: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridPlanificado.superclass.render.call(this);
        Ext.apply(_this.gpPrincipal, {
            viewConfig: {
                getRowClass: function (rec, index, rowParams, store) {
                    if (store.getAt(index).json.estadoplanificacion == 1) {
                        return 'redrow-text';
                    }
                }
            }
        });
        return vista;
    }
});

LOG.tall.ordentrabajo.GridPedido = Ext.extend(LOG.util.UITemplate, {
    arrClientes: undefined,
    arrMedios: undefined,
    identificador: 'pedido',
    idComponent: 'pedido',
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        this.urlBusquedaGridPrincipal = 'cargarPedidos';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.idGridPrincipal = 'idregnumerico';
        //this.concepto = this.idioma.lbIncripcion;
        LOG.tall.ordentrabajo.GridPedido.superclass.constructor.call(this, config);
        //this.textBusquedaSimple = this.idioma.cgNoins;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idcliente',
            hidden: true,
            width: 120
        });
        this.addGridColumn({
            header: 'No. pedido',
            dataIndex: 'nrodoc',
            //default: true
        });
        this.addGridColumn({
            header: 'Cliente',
            dataIndex: 'cliente',
            //default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    }
});

LOG.tall.ordentrabajo.GridCita = Ext.extend(LOG.util.UITemplate, {
    identificador: 'cita',
    idComponent: 'cita',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        config.urlBusquedaGridPrincipal = 'cargarCitas';
        // this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = 'Citas';
        this.textBusquedaSimple = 'Citas';
        LOG.tall.ordentrabajo.GridCita.superclass.constructor.call(this, config);

        // this.getVistaPrincipal().title = 'Citas';
        // this.getVistaPrincipal().width = 825;
        // this.getVistaPrincipal().height = 473;
        //this.getVistaPrincipal().constrain = true;
        //this.getVistaPrincipal().resizable = false;
        // this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodocorigen',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: 'No. cita',
            width: 80,
            renderer: function (val, x, rec) {
                if (val != '')
                    return val;
                else return rec.json.numeroref;
            }
        });
        /* this.addGridColumn({
             dataIndex: 'estado',
             header: this.idioma.cgEstado,
             width: 150,
             renderer: function (v) {
                 return LOG.lb.documento.Estado[v];
             }
         });*/
        this.addGridColumn({
            dataIndex: 'fechadocumento',
            header: 'Fecha de creaci\xf3n',
            width: 140
        });
        this.addGridColumn({
            dataIndex: 'fechacita',
            header: 'Fecha cita',
            width: 140
        });
        this.addGridColumn({
            dataIndex: 'fechaextimada',
            header: this.idioma.cgFechaTerminacion,
            width: 140
        });
        this.addGridColumn({
            dataIndex: 'horaentrada',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idservicio',

        });
        /*  this.addGridColumn({
              dataIndex: 'idservicio',
              header: this.idioma.cgServicio,
              width: 150,
          });*/
        this.addGridColumn({
            dataIndex: 'idtipoprecio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idcliente',
            width: 80
        });
        this.addGridColumn({
            header: this.idioma.cgCliente,
            dataIndex: 'cliente',
            width: 200,
            //hidden:true
        });
        this.addGridColumn({
            dataIndex: 'idpadreindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'cantactvidades',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });

        var cod = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'importetotal',
            align: 'left',
            header: this.idioma.cgImporte + " " + cod,
            width: 100,
            hidden: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        var codAlt = (this.monedaContable) ? this.monedaContable : "";
        var ocultar = (monedaAlternativa && monedaAlternativa != '') ? false : true;
        var codAlt = (monedaAlternativa && monedaAlternativa != '') ? monedaAlternativa : "";
        this.addGridColumn({
            dataIndex: 'importetotalalternativo',
            align: 'right',
            header: "Importe alternativo " + " " + codAlt,
            width: 100,
            hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            dataIndex: 'idcentrocosto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'denomcentrocosto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fechacontable',
            hidden: true
        });
        /*this.addGridColumn({
            header: 'Creado por',
            width: 120,
            dataIndex: 'idusuario',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                // _this.usuarios = store.reader.jsonData.usuarios;
                var usuarios = new Array();
                usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
        });*/
        /*  this.addGridColumn({
              header: 'Aprobado por',
              width: 120,
              dataIndex: 'cerradopor',autoExpand
              default: true,
              renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                  // _this.usuarios = store.reader.jsonData.usuarios;
                  var usuarios = new Array();
                  usuarios = store.reader.jsonData.usuarios;
                  return _this.getUsuarioById(value);
              }
          });*/
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var vista = LOG.tall.ordentrabajo.GridCita.superclass.render.call(this);
        var _this = this;
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            estadoCita: 3
        });
        this.getStorePrincipal().load();
        return vista;
    }
});


/**
 * Ventana para seleccionar el medio de la orden.
 */

LOG.tall.ordentrabajo.VentanaSelecionMedio = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    panelGeneral: undefined,
    tabPanelGeneral: undefined,
    isAFT: undefined,
    usarNomencladorProducto: true,
    usarAFTTall: true,
    usarTallAFT: true,
    idestructura: undefined,
    busquedaAvanzadaAFT: false,
    constructor: function (config) {
        this.usarAplicar = false;
        this.resizable = false;
        this.idcliente = config.idcliente;
        this.idclienteestructura = config.idclienteestructura;
        LOG.tall.ordentrabajo.VentanaSelecionMedio.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();

    },
    initComponent: function () {
        var _this = this;
        LOG.tall.ordentrabajo.VentanaSelecionMedio.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.tabPanelGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });
        this.tab0 = new LOG.tall.ordentrabajo.GridMediosCliente({
            idioma: _this.idioma,
            title: 'Medios cliente',
            idcliente: _this.idcliente,
            height: 200
        });
        this.tabPanelGeneral.addTabToTemplete(this.tab0);
        if (this.usarNomencladorProducto) {
            this.tab1 = new LOG.tall.ordentrabajo.GridIndicadores({
                idioma: _this.idioma,
                title: 'Medios registrados',
                height: 200
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab1);
        }

        if (this.isAFT) {
            if (this.usarAFTTall) {
                this.tab2 = new LOG.tall.ordentrabajo.GridActivosFijos({
                    idioma: _this.idioma,
                    title: 'Enviados al taller',
                    height: 200,
                    textBusquedaSimple: 'denominaci\xf3n',
                    identificador: "aft",
                    idestructura: _this.idestructura,
                    idclienteestructura: _this.idclienteestructura,
                    busquedaAvanzadaAFT: _this.busquedaAvanzadaAFT
                });
                this.tabPanelGeneral.addTabToTemplete(this.tab2);
                this.tab4 = new LOG.tall.ordentrabajo.GridActivosFijosMantenimiento({
                    idioma: _this.idioma,
                    title: 'Mantenimiento',
                    height: 200,
                    textBusquedaSimple: 'denominaci\xf3n',
                    identificador: "aft",
                    idestructura: _this.idestructura,
                    busquedaAvanzadaAFT: _this.busquedaAvanzadaAFT
                });
                this.tabPanelGeneral.addTabToTemplete(this.tab4);
            }
            if (this.usarTallAFT) {
                this.tab3 = new LOG.tall.ordentrabajo.GridActivosFijos({
                    idioma: _this.idioma,
                    title: 'Activos fijos tangibles',
                    height: 200,
                    textBusquedaSimple: 'Identificador',
                    identificador: "tallaft",
                    idComponent: 'tallaft',
                    idestructura: _this.idestructura,
                    idclienteestructura: _this.idclienteestructura,
                    busquedaBasica: true,
                    busquedaAvanzadaAFT: _this.busquedaAvanzadaAFT
                });
                this.tabPanelGeneral.addTabToTemplete(this.tab3);
            }
        }
        this.tabPanelGeneral.init();
        var x = this.tabPanelGeneral.view();
        if (this.tab3) {
            this.tab3.on({
                'adicionarmedio': function () {
                    _this.aceptarFn();
                    _this.close();
                }
            });
        }
        x.height = 350;
        x.width = 830;
        x.frame = false;
        this.panelGeneral.add(x);
        this.add(this.panelGeneral);
        this.tabPanelGeneral.on({
            tabchange: function (p) {
                // if (_this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().getCount() == 0) {
                //     if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() != 'tallaft')
                //         _this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().load();
                // }
                if (_this.tabPanelGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                    _this.listaBotones.getItem(2).enable();
                } else _this.listaBotones.getItem(2).disable();
            }
        })
    },
    validacionBtn: function () {
        var _this = this;
        if (this.isAFT) {
            if (this.tab2) {
                this.tab2.getSmPrincipal().on({
                    rowselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.listaBotones.getItem(2).enable()
                        }
                    },
                    rowdeselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                });
                this.tab2.getStorePrincipal().on({
                    load: function (st) {
                        if (st.getCount() == 0) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                })
            }
            if (this.tab4) {
                this.tab4.getSmPrincipal().on({
                    rowselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.listaBotones.getItem(2).enable()
                        }
                    },
                    rowdeselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            _this.listaBotones.getItem(2).disable();
                        }
                    },
                });
                this.tab4.getStorePrincipal().on({
                    load: function (st) {
                        if (st.getCount() == 0) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                })

            }
            if (this.tab3) {
                this.tab3.getSmPrincipal().on({
                    rowselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            _this.listaBotones.getItem(2).enable()
                        }
                    },
                    rowdeselect: function () {
                        if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                });
                this.tab3.getStorePrincipal().on({
                    load: function (st) {
                        if (st.getCount() == 0) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                })
            }
        }
        this.tab0.getSmPrincipal().on({
            rowselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'medioscliente') {
                    _this.listaBotones.getItem(2).enable();
                }
            },
            rowdeselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'medioscliente') {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.tab0.getStorePrincipal().on({
            load: function (st) {
                if (st.getCount() == 0) {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        })
        if (this.usarNomencladorProducto) {
            this.tab1.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                        _this.listaBotones.getItem(2).enable();
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
            this.tab1.getStorePrincipal().on({
                load: function (st) {
                    if (st.getCount() == 0) {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            })
        }
    }

});

LOG.tall.ordentrabajo.GridActivosFijosMantenimiento = Ext.extend(LOG.util.UITemplate, {
    idComponent: 'aft',
    identificador: 'aft',
    idestructura: undefined,
    busquedaAvanzadaAFT: false,
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        config.busquedaAvanzada = false;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        this.urlBusquedaGridPrincipal = 'getCargarEnviadosAMantenimiento';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbActivo;
        this.idGridPrincipal = 'idregnumerico';
        LOG.tall.ordentrabajo.GridActivosFijos.superclass.constructor.call(this, config);
        this.identificador = config.identificador;
        this.addEvents('adicionarmedio');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMatricula,
            dataIndex: 'nromatricula',
            //default: true,
            hidden: true,
            filter: {
                type: 'string',
                dataIndex: 'nromatricula'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgIndicativo,
            dataIndex: 'indicativo',
            //default: true,
            hidden: true,
            filter:
                {
                    type: 'string',
                    dataIndex: 'indicativo'
                }
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            hidden: true,
            dataIndex: 'codigo',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'denominacion',
            //default: true,
            id: 'denomAFT'
        });
        this.addGridColumn({
            header: this.idioma.cgNroSerie,
            width: 120,
            dataIndex: 'nroserie',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroInventario,
            width: 120,
            dataIndex: 'nroinventario',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            // default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridActivosFijosMantenimiento.superclass.render.call(this);
        //vista.addEvents('adicionarmedio');
        this.getStorePrincipal().on({
            'beforeload': function (store) {
                Ext.apply(store.initBaseParams, {
                    idestructura: _this.idestructura,
                    ventana: _this.getIdentificador()
                });
                if (_this.busquedaAvanzadaAFT) {
                    Ext.apply(store.initBaseParams, {busquedaavanzada: true});
                }
            },
            'load': function (store, records) {
                var matricula = false;
                var indicativo = false;
                Ext.each(records, function (r) {
                    if (r.json.nromatricula) {
                        matricula = true;
                    }
                    if (r.json.indicativo) {
                        indicativo = true;
                    }
                });
                if (matricula) {
                    _this.getGridPrincipal().getColumnModel().setHidden(1, false);
                }
                if (indicativo) {
                    _this.getGridPrincipal().getColumnModel().setHidden(2, false);
                }
                if (_this.getIdentificador() == "tallaft") {
                    if (store.getCount() == 1) {
                        _this.getSmPrincipal().selectFirstRow();
                        _this.fireEvent('adicionarmedio');
                    }
                }
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denomAFT';

        return vista;
    },
    getTextoMedio: function () {
        var recordSeleccionado = this.getGridPrincipal().getSelectionModel().getSelected();
        return recordSeleccionado.json.descripcionmarcamodelo;
    }
});

LOG.tall.ordentrabajo.GridActivosFijos = Ext.extend(LOG.util.UITemplate, {
    idComponent: 'aft',
    identificador: 'aft',
    idestructura: undefined,
    busquedaAvanzadaAFT: false,
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        config.busquedaAvanzada = false;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        this.urlBusquedaGridPrincipal = 'getCargarEnviadosATaller';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbActivo;
        this.idGridPrincipal = 'idregnumerico';
        LOG.tall.ordentrabajo.GridActivosFijos.superclass.constructor.call(this, config);
        this.identificador = config.identificador;
        this.addEvents('adicionarmedio');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMatricula,
            dataIndex: 'nromatricula',
            //default: true,
            hidden: true,
            filter: {
                type: 'string',
                dataIndex: 'nromatricula'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgIndicativo,
            dataIndex: 'indicativo',
            //default: true,
            hidden: true,
            filter:
                {
                    type: 'string',
                    dataIndex: 'indicativo'
                }
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            hidden: true,
            dataIndex: 'codigo',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            //default: true,
            id: 'denomAFT'
        });
        this.addGridColumn({
            header: this.idioma.cgNroSerie,
            width: 120,
            dataIndex: 'nroserie',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            // default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridActivosFijos.superclass.render.call(this);
        //vista.addEvents('adicionarmedio');
        this.getStorePrincipal().on({
            'beforeload': function (store) {
                Ext.apply(store.initBaseParams, {
                    idestructura: _this.idestructura,
                    idclienteestructura: _this.idclienteestructura,
                    ventana: _this.getIdentificador()
                });
                if (_this.busquedaAvanzadaAFT) {
                    Ext.apply(store.initBaseParams, {busquedaavanzada: true});
                }
            },
            'load': function (store, records) {
                var matricula = false;
                var indicativo = false;
                Ext.each(records, function (r) {
                    if (r.json.nromatricula) {
                        matricula = true;
                    }
                    if (r.json.indicativo) {
                        indicativo = true;
                    }
                });
                if (matricula) {
                    _this.getGridPrincipal().getColumnModel().setHidden(1, false);
                }
                if (indicativo) {
                    _this.getGridPrincipal().getColumnModel().setHidden(2, false);
                }
                if (_this.getIdentificador() == "tallaft") {
                    if (store.getCount() == 1) {
                        _this.getSmPrincipal().selectFirstRow();
                        _this.fireEvent('adicionarmedio');
                    }
                }
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denomAFT';
        /* if(this.identificador == 'tallaft' ){
             this.textMatricula = new LOG.util.Prototipos.inputTexto({name:'nromatricula'});
             this.textIndicativo = new LOG.util.Prototipos.inputTexto({name:'indicativo'});
             this.btnBuscar = new LOG.util.Prototipos.botonBuscar({
                 text: this.idioma.lbBtnBuscar,
                 tooltip: this.idioma.ttBuscarActivo,
                 scope:this,
                 handler: function() {
                     _this.buscarBtn();
                 }
             });
             this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
                 text: this.idioma.lbBtnLimpiar,
                 tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt+L)</b>',
                 scope:this,
                 handler: function() {
                     _this.limpiarBtn();
                 }
             });
             vista.documentKeyMap = new Ext.KeyMap(document,
                 [
                     {
                         alt: true,
                         ctrl:false,
                         key: 'b',
                         fn: function() {
                             if (vista.isVisible() && (_this.textMatricula.getValue() || _this.textIndicativo.getValue())){
                                 _this.buscarBtn();
                             }

                         }
                     },
                     {
                         alt: true,
                         ctrl:false,
                         key: 'l',
                         fn: function() {
                             if (vista.isVisible()){
                                 _this.limpiarBtn();
                             }

                         }
                     }
                 ]);
             this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: 'Matricula: '}), this.textMatricula,
                 '-', new Ext.form.Label({text: 'Indicativo: '}), this.textIndicativo, '-', _this.btnBuscar, '-', _this.btnLimpiar);
         }*/
        return vista;
    },
    getTextoMedio: function () {
        var recordSeleccionado = this.getGridPrincipal().getSelectionModel().getSelected();
        return recordSeleccionado.json.descripcionmarcamodelo;
    }
});

LOG.tall.ordentrabajo.GridIndicadores = Ext.extend(LOG.util.UITemplate, {
    identificador: 'indicadores',
    idComponent: 'indicadores',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
        this.urlBusquedaGridPrincipal = 'cargarGridClasificador';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbIndicador;
        LOG.tall.ordentrabajo.GridIndicadores.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgCodigo;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            //default: true,
            id: 'denomIndicador'
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            //default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridIndicadores.superclass.render.call(this);
        this.getStorePrincipal().initBaseParams.explotacion = 1;
        this.gpPrincipal.autoExpandColumn = 'denomIndicador';
        return vista;
    },
    getTextoMedio: function () {
        var recordSeleccionado = this.getGridPrincipal().getSelectionModel().getSelected();
        return recordSeleccionado.json.descripcionmarcamodelo;
    }
});

LOG.tall.ordentrabajo.GridMediosCliente = Ext.extend(LOG.util.UITemplate, {
    identificador: 'medioscliente',
    idComponent: 'medioscliente',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.idcliente = config.idcliente;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        //this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
        this.urlBusquedaGridPrincipal = 'cargarMediosCliente';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbIndicador;
        LOG.tall.ordentrabajo.GridMediosCliente.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgCodigo;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            //default: true,
            id: 'denomIndicador'
        });
        this.addGridColumn({
            header: 'Matrícula',
            dataIndex: 'codigoaux',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            //default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridMediosCliente.superclass.render.call(this);
        this.getStorePrincipal().initBaseParams.explotacion = 1;
        this.getStorePrincipal().initBaseParams.idcliente = _this.idcliente;
        this.gpPrincipal.autoExpandColumn = 'denomIndicador';
        return vista;
    },
    getTextoMedio: function () {
        var recordSeleccionado = this.getGridPrincipal().getSelectionModel().getSelected();
        return recordSeleccionado.json.codigoaux;
    }
});


/**
 * Recuperacion de datos de las piezas retiradas
 *
 */

LOG.tall.ordentrabajo.WinRecuperacionPiezas = Ext.extend(LOG.util.Window, {
    panelCampos: undefined,
    gridMaterialesRecuperados: undefined,
    modelo: undefined,
    recordSeleccionado: undefined,
    idproducto: undefined,
    idordentrabajo: undefined,
    constructor: function (config) {
        var _this = this;
        config.cerrarAceptar = false;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        config.title = this.idioma.tlRecuperacionPiezas;
        config.height = 500;
        config.width = 1000;
        this.usarAplicar = false;
        this.usarAceptar = false;
        this.modelo = new LOG.tall.ordentrabajo.RecuperarPiezasModel({
            idioma: this.idioma,
            idordentrabajo: config.idordentrabajo
        });
        this.panelCampos = new LOG.tall.ordentrabajo.PanelCamposRecuperablesPiezas({
            modelo: this.modelo,
            idproducto: config.idproducto
        });
        this.gridMaterialesRecuperados = new LOG.tall.ordentrabajo.GridRecuperacionPiezas({
            idioma: this.idioma, modelo: this.modelo,
            idordentrabajo: config.idordentrabajo,
            idproducto: config.idproducto,
            fechacierreOrden: config.recordSeleccionado.json.fechacierre
        });
        this.gridMaterialesRecuperados.init();
        var vista = this.gridMaterialesRecuperados.view();
        config.items = [vista, this.panelCampos];
        this.gridMaterialesRecuperados.getSmPrincipal().on({
            rowselect: function (sm, index, record) {
                _this.panelCampos.showCampos(record.data);
            }
        });
        vista.on({
            'addrecord': function (datos) {
                datos[0]['datos'] = _this.panelCampos.prepareDatosToSave();
                var param = new Array()
                param[0] = datos;
                param[1] = datos;
                _this.modelo.salvarPiezas(param);
            },

            'delrecord': function () {
                _this.panelCampos.limpiarDatos();
            }
        });
        this.modelo.bindGridPanel(this.gridMaterialesRecuperados.getGridPrincipal());
        this.modelo.cargarDatosPieza(null, function (val) {
            var arr = new Array();
            Ext.each(val['datos'], function (v) {
                arr.push(v['indicador']);
            });
            _this.gridMaterialesRecuperados.setIdsRecuperables(arr);
        });
        LOG.tall.ordentrabajo.WinRecuperacionPiezas.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            scope: this,
            text: 'Cerrar'
            // tooltip:'Cerrar ventana'
        }, true)));
        this.gridMaterialesRecuperados.getStorePrincipal().on('beforeload', function (st, obj) {
            _this.gridMaterialesRecuperados.getStorePrincipal().initBaseParams.idordentrabajo = _this.idordentrabajo;
            //obj.params = {idordentrabajo:_this.idordentrabajo,
            //    start:_this.gridMaterialesRecuperados.getGridPrincipal().initialConfig.bbar.cursor,
            //    limit:_this.gridMaterialesRecuperados.getGridPrincipal().initialConfig.bbar.pageSize
            //};
        });
        this.gridMaterialesRecuperados.getStorePrincipal().load();
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                ctrl: false,
                shift: false,
                key: 'I',
                fn: function () {
                    var b = _this.gridMaterialesRecuperados.listaBotones.getItem(0);
                    _this.gridMaterialesRecuperados.listaBotones.getItem(0).handler(b);
                    //if (render.isVisible())
                    //    _this.btnBuscar();
                }
            },
                {
                    key: Ext.EventObject.DELETE,
                    shift: false,
                    alt: false,
                    ctrl: false,
                    fn: function () {
                        var b = _this.gridMaterialesRecuperados.listaBotones.getItem(1);
                        _this.gridMaterialesRecuperados.listaBotones.getItem(1).handler(b);
                        //if (render.isVisible())
                        //    _this.btnLimpiar();
                    }
                }]);
    },
    aceptarFn: function () {
    }
});

LOG.tall.ordentrabajo.GridRecuperacionPiezas = Ext.extend(LOG.util.UITemplate, {
    identificador: 'indicadores',
    idComponent: 'indicadores',
    idsRecuperables: undefined,
    idordentrabajo: undefined,
    idproducto: undefined,
    fechacierreOrden: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.idproducto = config.idproducto;
        this.gridEditable = true;
        this.panelBotonesVisible = true;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        this.urlBusquedaGridPrincipal = 'cargarPiezasRetiradas';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbPiezas;
        LOG.tall.ordentrabajo.GridRecuperacionPiezas.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgCodigo;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idpiezarecuperable',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpiezaagregado'
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'denominacion',
            default: true,
            id: 'denomIndicador'
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            width: 110,
            dataIndex: 'marca',
            default: true,
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            width: 110,
            dataIndex: 'modelo',
            default: true,
        });
        this.addGridColumn({
            header: this.idioma.cgVidaUtil,
            width: 110,
            dataIndex: 'vidautil',
            default: true,
        });
        this.addGridColumn({
            header: this.idioma.cgMotivo,
            width: 70,
            dataIndex: 'motivo',
            default: true,
            editor: new LOG.util.ComboBox({
                mode: 'local',
                valueField: 'motivo',
                displayField: 'denominacion',
                store: new Ext.data.SimpleStore({
                    fields: ['motivo', 'denominacion'],
                    data: [
                        [1, _this.idioma.lbStCbMotivoPerdida],
                        [2, _this.idioma.lbStCbMotivoRotura]
                    ]
                }),
                queryParam: 'criterio',
                minChars: 1,
                pageSize: 15,
                resizable: true,
                listeners: {
                    'select': function (cb, record) {
                        var datos = Array();
                        var rec = _this.getSmPrincipal().getSelected();
                        rec.data.motivo = record.data.motivo;
                        rec.data.denominacion = record.data.denominacion;
                        datos.push(rec.data);
                        _this.getVistaPrincipal().fireEvent('addrecord', datos);
                    }
                }
            }),
            renderer: function (val) {
                if (val == 1)
                    return _this.idioma.lbStCbMotivoPerdida;
                if (val == 2)
                    return _this.idioma.lbStCbMotivoRotura;
                return val;
            }
        });
        this.addGridColumn({
            dataIndex: 'destino',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgDestino,
            width: 120,
            dataIndex: 'iddestino',
            default: true,
            editor: new LOG.util.ComboBox({
                mode: 'remote',
                url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarDestinos',
                valueField: 'iddestino',
                displayField: 'denominacion',
                queryParam: 'criterio',
                minChars: 1,
                pageSize: 15,
                resizable: true,
                listeners: {
                    'select': function (cb, record) {
                        var datos = Array();
                        var rec = _this.getSmPrincipal().getSelected();
                        rec.data.destino = record.data.denominacion;
                        rec.data.iddestino = record.data.iddestino;
                        datos.push(rec.data);
                        _this.getVistaPrincipal().fireEvent('addrecord', datos);
                    }
                }
            }),
            renderer: function (a, b, record, d, ee) {
                return record.data.destino;
            }
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        //this.addToolbarButton( LOG.util.UIManager.createBtn({
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            iconCls: 'adicionar',
            text: LOG.util.Idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAddPiezaRecup,
            handler: function () {
                var winGridSelect = new LOG.tall.ordentrabajo.GridSelectIndicadoresRecuperables({
                    formaVisualizacion: 'ventana',
                    dirController: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres',
                    urlBusquedaGridPrincipal: 'cargarIndicadoresRecuperables',
                    busquedaBasica: true,
                    modoSeleccion: 2,
                    autoLoad: false,
                    panelBotonesVisible: false,
                    idioma: _this.idioma,
                    cerrarAceptar: false,
                    idsRecuperables: _this.idsRecuperables,
                    idproducto: _this.idproducto
                });
                winGridSelect.init();
                winGridSelect.view();
                winGridSelect.getStorePrincipal().load();
                winGridSelect.getVistaPrincipal().height = 400;
                winGridSelect.getVistaPrincipal().width = 500;
                winGridSelect.getVistaPrincipal().aceptarFn = function () {
                    var num = _this.getStorePrincipal().getCount() || 0;
                    var records = winGridSelect.getSmPrincipal().getSelections();
                    var arr = new Array();
                    Ext.each(records, function (rec, pos) {
                        arr[pos] = rec.data;
                        arr[pos].fechacierre = _this.fechacierreOrden;
                    });
                    var param = Array();
                    param[0] = arr;
                    param[1] = true;
                    _this.modelo.salvarPiezas(param);
                };
            }
        }));
        //this.addToolbarButton( LOG.util.UIManager.createBtn({
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            iconCls: 'eliminar',
            text: LOG.util.Idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnDelPiezaRecup,
            handler: function () {
                var records = _this.getSmPrincipal().getSelections();
                var arr = new Array();
                var arr2 = new Array();
                var arrIdAgrupado = new Array();
                Ext.each(records, function (rec) {
                    if (rec.data.idpiezarecuperable) {
                        arr.push(rec.data.idpiezarecuperable);
                        arr2.push(rec.json.idindicador);
                        arrIdAgrupado.push(rec.json.idpiezaagregado);
                    }
                });

                _this.modelo.eliminarPiezaRecup({
                    piezas: arr, idregnumerico: _this.idproducto, idindicador: arr2,

                    idpiezaagregado: arrIdAgrupado
                }, function () {
                    _this.getVistaPrincipal().fireEvent('delrecord');
                });
            },
            controlFn: function (b, _caller) {
                //if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RCerrarDocumento')){
                //    b.setVisible(true);
                //}
                //else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            b.enable();
                        }
                    }
                    if (e == 'rowdeselect' && !_caller.getGridPrincipal().getSelectionModel().hasSelection()) {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                            var dataSelect = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            b.enable();
                        }
                    }
                });
            }
        }));
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridRecuperacionPiezas.superclass.render.call(this);
        vista.addEvents('addrecord');
        vista.addEvents('delrecord');
        this.gpPrincipal.autoExpandColumn = 'denomIndicador';
        return vista;
    },
    setIdsRecuperables: function (arr) {
        this.idsRecuperables = arr;
    }
});

LOG.tall.ordentrabajo.PanelCamposRecuperablesPiezas = Ext.extend(LOG.util.Panel, {
    idioma: undefined,
    formularioBasico: undefined,
    panelContenedor: undefined,
    modelo: undefined,
    btnSalvar: undefined,
    idproducto: undefined,
    constructor: function (config) {
        var _this = this;
        config.region = 'east';
        config.width = 300;
        config.frame = true;
        config.title = 'Campos';
        config.collapsible = true;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.formularioBasico = new LOG.util.UIManager.initForm();
        this.panelContenedor = new LOG.util.UIManager.initColumnForm({columnas: 1});
        this.panelContenedor.getColumn(0).labelAlign = 'left';
        this.formularioBasico.add(this.panelContenedor);
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'G'
            },
            tooltip: _this.idioma.ttBtnGuardarDatosPiezas,
            handler: function () {
                var datos = _this.prepareDatosToSave();
                var pieza = {};
                pieza['idpiezarecuperable'] = config.modelo.sm.getSelected().data.idpiezarecuperable;
                pieza['datos'] = datos;
                var arrData = new Array();
                arrData.push(pieza);
                var params = new Array();
                params[0] = arrData;
                params[1] = false;
                config.modelo.salvarPiezas(params);
            }
        });
        config.items = [this.formularioBasico];
        config.buttons = [this.btnSalvar];
        LOG.tall.ordentrabajo.PanelCamposRecuperablesPiezas.superclass.constructor.call(this, config);
        this.modelo.bindForm(this.formularioBasico);
        this.modelo.addActionButton(this.btnSalvar);
    },
    showCampos: function (data) {
        var _this = this;
        this.panelContenedor.items.each(function (e, p) {
            e.removeAll();
        });
        this.panelContenedor.columnaActual = 1;
        this.doLayout();
        this.modelo.habilitarBotones(true);
        _this.body.mask('Cargando...');
        _this.modelo.cargarDatosPieza(data.idpadre, function (val) {
            if (val['cantidad'] > 0) {
                _this.panelContenedor.items.each(function (e, p) {
                    e.removeAll();
                });
                _this.panelContenedor.columnaActual = 1;
                _this.doLayout();
                Ext.each(val['datos'][0].atributos, function (t) {
                    var text = _this.crearTextDinamico(t);
                    _this.panelContenedor.addComponent(text);
                });
                _this.panelContenedor.doLayout();
                _this.modelo.bindForm(_this.formularioBasico);
                _this.modelo.devolverPieza(data.idpiezarecuperable, function (val) {
                    _this.formularioBasico.getForm().loadRecord(_this.loadDatos(Ext.decode(val['datos'][0]['datos'])));
                    //if(_this.idproducto){
                    //    _this.desabilitarForm(_this.formularioBasico.getForm(), true);
                    //}
                    //else _this.desabilitarForm(_this.formularioBasico.getForm(), false);
                    if (_this.body.isMasked()) {
                        _this.body.unmask();
                    }
                }, function () {
                    if (_this.body.isMasked()) {
                        _this.body.unmask();
                    }
                })
            } else {
                mostrarMensaje(2, _this.idioma.msjNoAtributosConfigurados);
                if (_this.body.isMasked()) {
                    _this.body.unmask();
                }
            }
        }, function () {
            if (_this.body.isMasked()) {
                _this.body.unmask();
            }
        });
    },
    crearTextDinamico: function (obj) {
        var _this = this;
        var campoTexto = undefined;
        obj.labelM = obj.label;
        switch (obj.idtipocomponente) {
            case '1':
                campoTexto = new LOG.util.Prototipos.inputDecimal({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    fieldLabel: obj.labelM,
                    etiqueta: obj.label,
                    identificador: obj.idcampo,
                    allowBlank: false,
                    enableKeyEvents: true,
                    isFormField: true,
                    tipo: 1

                });
                if (obj.longitud) {
                    Ext.apply(campoTexto, {
                        maxLength: obj.longitud,
                        maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.'
                    });
                    //maxLengthText: 'El tama\xf1o m\xe1ximo requerido es '+ obj.longitud +' d\xEDgitos.'});
                }
                break;
            case '2':
                campoTexto = new Ext.form.Checkbox({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    boxLabel: obj.labelM,
                    etiqueta: obj.label,
                    identificador: obj.idcampo,
                    enableKeyEvents: true,
                    isFormField: true,
                    tipo: 2
                });
                break;
            case '3':
                campoTexto = new Ext.form.DateField({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    labelSeparator: (obj.identificador == 1) ? '' : ':',
                    fieldLabel: obj.labelM,
                    etiqueta: obj.label,
                    identificador: obj.idcampo,
                    enableKeyEvents: true,
                    allowBlank: false,
                    editable: false,
                    format: 'd/m/Y',
                    tipo: 3,
                    isFormField: true,
                    setValue: function (date) {
                        if (date.substring)
                            date = date.substring(0, 10);
                        return Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
                    }
                });
                break;
            default :
                campoTexto = new LOG.util.Prototipos.inputTexto({
                    name: (obj.name) ? obj.name : obj.nombretabla,
                    fieldLabel: obj.labelM,
                    etiqueta: obj.label,
                    identificador: obj.idcampo,
                    allowBlank: false,
                    enableKeyEvents: true,
                    isFormField: true,
                    maxLength: 150,//(obj.longitud)?obj.longitud:50,
                    maxLengthText: _this.idioma.msgErrortext((obj.longitud) ? obj.longitud : 50),
                    //regex: LOG.util.Regex.general,
                    //regexText: _this.idioma.msgexpreAlfaNumRegexText
                });
                break;
        }

        return campoTexto;
    },
    prepareDatosToSave: function () {
        var arr = new Array();
        var pos = 0;
        this.formularioBasico.getForm().items.each(function (field) {
            var auxObj = {};
            if (field.isFormField) {
                auxObj[field.getName()] = field.getValue();
                auxObj['name'] = field.getName();
                auxObj['etiqueta'] = field.etiqueta;
                auxObj['identificador'] = field.identificador;
                arr[pos++] = auxObj;
            }
        });
        return arr;
    },
    limpiarDatos: function () {
        var _this = this;
        _this.panelContenedor.items.each(function (e, p) {
            e.removeAll();
        });
        _this.modelo.habilitarBotones(true);

    },
    loadDatos: function (dinamicos) {
        var map = [];
        var valores = {};
        if (typeof dinamicos == 'string')
            dinamicos = Ext.decode(dinamicos);
        Ext.each(dinamicos, function (obj, pos) {
            map[pos] = {name: obj.name};
            valores[obj.name] = obj[obj.name];
        });
        var MapRecord = Ext.data.Record.create(map);
        return new MapRecord(valores);
    },
    desabilitarForm: function (form, valor) {
        form.items.each(function (field) {
            if (field.isFormField) {

                if (valor)
                    field.disable();
                else
                    field.enable();
            }
        })
    }
});

LOG.tall.ordentrabajo.GridSelectIndicadoresRecuperables = Ext.extend(LOG.util.UITemplate, {
    identificador: 'indicadores',
    idComponent: 'indicadores',
    idsRecuperables: undefined,
    idproducto: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana',
            this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.idproducto = config.idproducto;
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres',
            this.urlBusquedaGridPrincipal = 'cargarIndicadoresRecuperables',
            this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        this.concepto = this.idioma.lbIndicador;
        LOG.tall.ordentrabajo.GridSelectIndicadoresRecuperables.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgCodigo;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().width = 700;
        this.getVistaPrincipal().title = this.idioma.tlAdicionarPiezas;
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'datos',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'denominacion',
            default: true,
            id: 'denomIndicador'
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            width: 120,
            dataIndex: 'marca',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            width: 120,
            dataIndex: 'modelo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaAdquisicion,
            width: 100,
            dataIndex: 'fechaadquisicion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroOrden,
            width: 90,
            dataIndex: 'nroorden',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpiezaagregado'
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.ordentrabajo.GridSelectIndicadoresRecuperables.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'denomIndicador';
        this.getStorePrincipal().initBaseParams.idnaturaleza = naturalezaPPA;
        this.getStorePrincipal().on('beforeload', function (st, obj) {
            obj.params = {
                idindicador: Ext.encode(_this.idsRecuperables),
                idproducto: _this.idproducto,
                disponible: true,
                start: _this.getGridPrincipal().initialConfig.bbar.cursor,
                limit: _this.getGridPrincipal().initialConfig.bbar.pageSize
            };
        });
        this.getSmPrincipal().on({
            rowselect: function (sm, index, record) {
                _this.getVistaPrincipal().listaBotones.getItem(2).enable();
            },
            rowdeselect: function () {
                if (this.getCount() == 0)
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();

            }
        });
        return vista;
    }
});
