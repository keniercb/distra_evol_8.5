Ext.ns('LOG.lb.lote');
/**
 * Plantilla configurable para la gestion de los lotes.
 * @type LOG.util.UITemplate
 */
LOG.lb.lote.Ventana = Ext.extend(Ext.Window,{
    /**
     * Indica si fueron cargados los datos de los combo Fabricante y Pais (2 = cargaron ambos).
     */
    cargado: 0,
    /**
     * Indica si se esta realizando la operacion modificar lote.
     */
    modificando: false,
    /**
     * Funcion que se ejecuta luego de cerrar la ventana.
     */
    cerrarFn: Ext.emtyFn,
    /**
     * Funcion que se ejecuta luego de eliminar o adicionar un lote.
     */
    _postEliminarFn: Ext.emtyFn,
    /**
     * Funcion que cambia las filas de color. Se hace uso de la funcion fly de Ext JS.
     * Lleva como parametro el record y devuelve el nombre de la clase css.
     */
    _colorFilaFn: Ext.emtyFn,
    /**
     * Direccion del controlador.
     */
    dirController: '/logistica/utiles/lote/index.php/lote',
    /**
     * URL de la que se carga el grid principal de la intefaz.
     */
    urlBusquedaGridPrincipal: 'cargarMovLote',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se muestra el panel con las campos de entrada de datos.
     */
    panelSuperior: true,
    /**
     * Determina si se muestran el boton eliminar lote.
     */
    btnEliminar: false,
    /**
     * Determina si cargar y se muestra la columna Ubicacion.
     */
    ubicacion: false,
    /**
     * Identificador del grid pricipal de lote.
     */
    idGridPrincipal: 'idmovlote',
    /**
     * selectionModel del grid al que esta asociado la ventana de lote.
     */
    sm: null,
    /**
     * Store del grid al que esta asociado la ventana de lote.
     */
    st: null,
    /**
     * Objeto con los parÃ¡metros adicionales para la busqueda.
     */
    parametros: {},
    /**
     * Objeto con los parametros adicionales para guardar.
     */
    datos: {},
    /**
     * Determina si se afecta la cantidad disponible del lote.
     */
    afectaLote: false,
    /**
     * Determina si se afecta la cantidad disponible del producto.
     */
    afectaProducto: false,
    /**
     * Determina si se actualiza la cantidad y el importecontable del producto.
     */
    actualizarMov: true,
    /**
     * Determina si usa la dualidad monetaria.
     */
    usaMonedas: false,
    /**
     * Tipo de operacion (compra o venta) para la canversion de entre monedas
     * (0 - no toma en cuenta la operacion, 1 - para la venta y 2 - para la compra).
     */
    compraVenta: 0,
    /**
     * Determina si se muestra el boton ayuda.
     */
    ayuda: false,
    indexProducto: 0,
    recMovimiento: null,
    constructor: function (config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(LOG.util.Idioma.init(), LOG.lb.lote.Idioma);
        var url = config.dirController ? config.dirController + '/' : null;
        this.modelo = new LOG.lb.lote.Model({
            idioma: this.idioma,
            urlController: url
        });
        this.usarAplicar = false;
        this.usarAceptar = false;
        this.config = config;
        this.config.formaVisualizacion = 'panel';
        this.config.modelo  = this.modelo;
        LOG.lb.lote.Ventana.superclass.constructor.call(this, config);

        Ext.apply(this,{
            region:'center',
            modal: true,
            //width: 950,
            //height: 500,
            title: this.idioma.tlVentanaLote
        });

        /*this.on({
         hide: function () {
         // _this.onCerrarHandler();
         },
         show: function () {
         _this.setTitle(_this.idioma.tlVentanaLote);
         }
         });*/

    },
    initComponent:function(){
        LOG.lb.lote.Ventana.superclass.initComponent.call(this);
        var _this = this;

        _this.clsLotes = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        _this.clsLotes.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbTfNroLote,
            name: 'numero',
            disabled: (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) ? false : true,
            allowBlank: false,
            listeners: {
                blur: function (_tf) {
                    console.info(_this)
                    if (!_this.gridProductos.modificando && _tf.getValue()) {
                        _this.modelo.cargaInicial({
                            url: '/logistica/utiles/lote/index.php/lote/cargarLotes',
                            idproducto: _this.recMovimiento.data.idproducto,
                            numero: _tf.getValue()
                        }, function (r) {
                            _this.gridProductos.habilitarCampos(r[0].length == 0);
                            _this.fPanel.getForm().loadRecord({data: r[0][0] || {}});
                            _this.modelo.loadRecord(r[0][0] || {idlote: null});
                        });
                    }
                }
            }
        }));
        var desde = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFechaFabricacion,
            name: 'fechafabricacion',
            vtype: 'daterange',
            format: "d/m/Y",
            disabled: (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) ? false : true,
            maxValue: Date.parseDate(_this.fecha, 'd/m/Y'),
            editable: false,
            allowBlank: true,
            listeners: {
                select: function () {
                    hasta.setMinValue(this.getValue());
                }
            }
        });
        var hasta = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFechaVencimiento,
            name: 'fechavencimiento',
            vtype: 'daterange',
            format: "d/m/Y",
            disabled: (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) ? false : true,
            editable: true,
            allowBlank: false,
            listeners: {
                select: function () {
                    var fecha;
                    if (Date.parseDate(_this.fecha, 'd/m/Y') < this.getValue()) {
                        fecha = Date.parseDate(_this.fecha, 'd/m/Y');
                    } else {
                        fecha = this.getValue();
                    }
                    desde.setMaxValue(fecha);
                }
            }
        });
        _this.clsLotes.addComponent(hasta);
        _this.clsLotes.addComponent(LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.lbNfCantidad,
            name: 'cantidad',
            allowBlank: false,
            disabled: (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) ? false : true,

            minText: _this.idioma.msgCantidadMinima,
            editor: new LOG.util.Prototipos.inputDecimal({
                minValue: 0.0000001
            }),
        }));

        /*_this.clsLotes.addComponent(desde);
         _this.clsLotes.addComponent(_this.fabricante);
         _this.clsLotes.addComponent(_this.pais);*/

        var btnGuardar = LOG.util.Prototipos.botonGuardar({
            tooltip: _this.idioma.ttBtnGuardar,
            handler: function () {
                var rec = _this.recMovimiento != null ? _this.recMovimiento : _this.sm.getSelected();
                Ext.apply(_this.datos, {
                    signo: _this.sm.getSelected().json.signo,
                    actualizarMov: _this.actualizarMov || null,
                    afectaLote: _this.afectaLote || null,
                    afectaProducto: _this.afectaProducto || null,
                    usaMonedas: _this.usaMonedas || null,
                    compraVenta: _this.compraVenta
                });
                _this.modelo.idproducto = rec.json.idproducto;
                _this.modelo.idmovimiento = rec.json.idmovimiento;
                _this.modelo.salvar({datos: Ext.encode(_this.datos)}, function () {
                    _this.fPanel.getForm().reset();
                    _this.modelo.reset();
                    _this.gridProductos.habilitarCampos(true);
                    _this.gridProductos.modificando = false;
                    //_this.modificando = false;
                    _this.st.reload();
                });
            }
        });
        _this.cbUbicacion = new LOG.util.TreeCombo({
            fieldLabel: _this.idioma.lbCbUbicacion,
            name: 'idubicacion',
            displayField: 'text',
            url: '/logistica/utiles/lote/index.php/lote/cargarComboUbicacion',
            node: _this.iddeposito,
            selectOnlyLeaf: _this.confubicacion,
            allowBlank: true,
            selectFn: function (_v) {
                this.displayedText = _v.text;
                _this.modelo.idarea = _v.attributes.idarea;
                if (_v.parentNode) {
                    if (_v.parentNode.attributes.id == 0) {
                        _this.modelo.esarea = true;
                    } else {
                        _this.modelo.esarea = null;
                    }
                }
            }
        });
        _this.fPanel = LOG.util.UIManager.initForm({
            border: false,
            items: [_this.clsLotes],
            region: 'center',
            buttons: [
                LOG.util.Prototipos.botonNuevo({
                    tooltip: _this.idioma.ttBtnNuevo,
                    disabled: (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) ? false : true,
                    handler: function () {
                        var rec = _this.recMovimiento != null ? _this.recMovimiento : _this.sm.getSelected();
                        _this.fPanel.getForm().reset();
                        _this.modelo.reset();
                        _this.gridProductos.habilitarCampos(true);
                        _this.modelo.idproducto = rec.json.idproducto;
                        _this.modelo.idmovimiento = rec.json.idmovimiento;
                        //_this.modificando = false;
                        _this.gridProductos.modificando = false;
                        desde.setMaxValue(Date.parseDate(_this.fecha, 'd/m/Y'));
                        hasta.setMinValue(null);
                    }
                }),
                btnGuardar
            ]
        });
        _this.modelo.bindForm(_this.fPanel);
        _this.modelo.addActionButton(btnGuardar);
        var panelIzquierdo = LOG.util.UIManager.initColumnForm({
            columnas: 1,
            //frame: true,
            border: false
        });
        _this.paneDatosProductos = LOG.util.UIManager.initForm({
            border: false,
            labelAlign: 'top',
            bodyStyle: 'padding:0px 10px 0px 5px',
            items: [
                new Ext.form.DisplayField({
                    fieldLabel: '<b>' + LOG.lb.producto.Idioma.hdProducto + '</b>',
                    name: 'textcodif',
                    anchor: '95%'
                }),
                new Ext.form.DisplayField({
                    fieldLabel: '<b>' + LOG.util.Idioma.lbLineaProducto + '</b>',
                    name: 'denomlineaprodfarm',
                    anchor: '95%'
                }),
                        /*new Ext.form.DisplayField({
                         fieldLabel: '<b>' + LOG.lb.producto.Idioma.cgCodigo + '</b>',
                         name: 'codigo',
                         anchor: '95%'
                         }),
                         new Ext.form.DisplayField({
                         fieldLabel: '<b>' + LOG.lb.producto.Idioma.cgDenominacion + '</b>',
                         name: 'denominacion',
                         anchor: '95%'
                         }),
                         new Ext.form.DisplayField({
                         fieldLabel: '<b>' + LOG.util.Idioma.lbLineaProducto + '</b>',
                         name: 'denomlineaprodfarm',
                         anchor: '95%'
                         }),*/
            ],
            buttons: [
                _this.btnAnterior = LOG.util.Prototipos.botonGeneral({
                    text: LOG.util.Idioma.lbBtnAnterior,
                    iconCls: 'anterior',
                    disabled: true,
                    handler: function () {
                        _this.selectProducto(false);
                    }
                }),
                _this.btnSiguiente = LOG.util.Prototipos.botonGeneral({
                    text: LOG.util.Idioma.lbBtnSiguiente,
                    iconCls: 'siguiente',
                    disabled: true,
                    handler: function () {
                        _this.selectProducto(true);
                    }
                })
            ]
        });

        panelIzquierdo.addComponent({
            xtype: 'fieldset',
            title: _this.idioma.tlDatosProducto,
            height: 200,
            autoScroll: true,
            items: [_this.paneDatosProductos]
        });
        panelIzquierdo.addComponent({
            xtype: 'fieldset',
            title: _this.idioma.tlDatosLote,
            autoHeight: true,
            items: [_this.fPanel]
        });

        this.contenedorGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            frame: true
        });

        this.contenedorGeneral.addComponent(panelIzquierdo);

        // Ext.each(_this.fPanel.buttons, function (btn) {
        //     LOG.util.UIManager.applyKey(btn, _this);
        // });
        _this.autoHeight = true;

        this.config.clsLotes = _this.clsLotes;
        this.config.fPanel = this.fPanel;
        this.config.cbUbicacion = this.cbUbicacion;

        this.gridProductos = new LOG.lb.lote.View(this.config);
        this.gridProductos.init();
        this.panelGrid = this.gridProductos.view();
        Ext.apply(this.panelGrid, {height: 400,
            minHeight: 400,
            autoHeight: false});
        this.contenedorGeneral.addComponent(this.panelGrid);
        this.storeProductos = new Ext.data.Store({
            autoLoad: true,
            url: this.dirController + '/getProductosDocumento',
            baseParams: this.parametros,
            listeners: {
                'beforeload': function () {
                    _this.body.mask(LOG.util.Idioma.msgCargaInicial + '.' + LOG.util.Idioma.msgEspere);
                },
                'load': function (cb, records) {
                    _this.body.unmask();
                    _this.btnAnterior.disable();
                    _this.btnSiguiente.disable();
                    _this.indexProducto = -1;
                    /*if (cb.getCount() > 1) {
                     _this.btnSiguiente.enable();
                     }*/

                    if(_this.parametros['idproducto']) {
                        Ext.each(records, function (rec, pos) {
                            if (_this.parametros['idproducto'] == rec.data.idproducto ){
                                _this.indexProducto = pos-1;
                            }
                        });
                    }

                    if (cb.getCount() > 0) {
                        _this.selectProducto(true);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idproducto'
            }, [
                {
                    name: 'idproducto'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'denomlineaprodfarm'
                }, {
                    name: 'textcodif'
                }, {
                    name: 'idmovimiento'
                }, {
                    name: 'signo'
                }
            ])
        });
        this.add(this.contenedorGeneral);
    },
    selectProducto: function (next) {
        var _this = this;
        next = next || false;
        if (next) {
            _this.indexProducto += 1;
        } else {
            _this.indexProducto -= 1;
        }
        if (_this.indexProducto == 0) {
            _this.btnAnterior.disable();
        } else {
            _this.btnAnterior.enable();
        }
        if (_this.indexProducto == _this.storeProductos.getCount() - 1) {
            _this.btnSiguiente.disable();
        } else {
            _this.btnSiguiente.enable();
        }
        _this.recMovimiento = _this.gridProductos.recMovimiento = _this.storeProductos.getAt(_this.indexProducto);
        _this.gridProductos.parametros['idproducto'] = _this.recMovimiento.data.idproducto;
        _this.paneDatosProductos.getForm().loadRecord(_this.recMovimiento);
        _this.gridProductos.getStorePrincipal().load({params: {start: 0}});
        _this.modelo.reset();
    }
});
LOG.lb.lote.View = Ext.extend(LOG.util.UITemplate, {
    /**
     * Indica si fueron cargados los datos de los combo Fabricante y Pais (2 = cargaron ambos).
     */
    cargado: 0,
    /**
     * Indica si se esta realizando la operacion modificar lote.
     */
    modificando: false,
    /**
     * Funcion que se ejecuta luego de cerrar la ventana.
     */
    cerrarFn: Ext.emtyFn,
    /**
     * Funcion que se ejecuta luego de eliminar un lote.
     */
    _postEliminarFn: Ext.emtyFn,
    /**
     * Funcion que cambia las filas de color. Se hace uso de la funcion fly de Ext JS.
     * Lleva como parametro el record y devuelve el nombre de la clase css.
     */
    _colorFilaFn: Ext.emtyFn,
    /**
     * Direccion del controlador.
     */
    dirController: '/logistica/utiles/lote/index.php/lote',
    /**
     * URL de la que se carga el grid principal de la intefaz.
     */
    urlBusquedaGridPrincipal: 'cargarMovLote',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se muestra el panel con las campos de entrada de datos.
     */
    panelSuperior: true,
    /**
     * Determina si se muestran el boton eliminar lote.
     */
    btnEliminar: false,
    /**
     * Determina si cargar y se muestra la columna Ubicacion.
     */
    ubicacion: false,
    /**
     * Identificador del grid pricipal de lote.
     */
    idGridPrincipal: 'idmovlote',
    /**
     * selectionModel del grid al que esta asociado la ventana de lote.
     */
    sm: null,
    /**
     * Objeto con los parÃ¡metros adicionales para la busqueda.
     */
    parametros: {},
    /**
     * Objeto con los parametros adicionales para guardar.
     */
    datos: {},
    /**
     * Determina si se afecta la cantidad disponible del lote.
     */
    afectaLote: false,
    /**
     * Determina si se afecta la cantidad disponible del producto.
     */
    afectaProducto: false,
    /**
     * Determina si se actualiza la cantidad y el importecontable del producto.
     */
    actualizarMov: true,
    /**
     * Determina si usa la dualidad monetaria.
     */
    usaMonedas: false,
    /**
     * Tipo de operacion (compra o venta) para la canversion de entre monedas
     * (0 - no toma en cuenta la operacion, 1 - para la venta y 2 - para la compra).
     */
    compraVenta: 0,
    /**
     * Determina si se muestra el boton ayuda.
     */
    ayuda: false,

    indexProducto: 0,

    recMovimiento: null,
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.idioma = LOG.util.UIManager.apply(LOG.util.Idioma.init(), LOG.lb.lote.Idioma);
        this.concepto = this.idioma.ttBtnBuscarLote;
        this.busquedaBasica = true;
        this.textBusquedaSimple = this.idioma.lbBuscar;
        this.autoLoad = false;
        this.listaFabricante = new LOG.util.List();
        this.listaPaises = new LOG.util.List();
        this.fPanel = config.fPanel;
        this.clsLotes = config.clsLotes;
        var url = config.dirController ? config.dirController + '/' : null;
        this.modelo = (config.modelo) ? config.modelo : new LOG.lb.lote.Model({
            idioma: this.idioma,
            urlController: url
        });
        LOG.lb.lote.View.superclass.constructor.call(this, config);
        var _this = this;
        if (!config.formaVisualizacion || config.formaVisualizacion == 'ventana') {
            /*this.getVistaPrincipal().maximized = false;
             this.getVistaPrincipal().modal = true;
             this.getVistaPrincipal().width = 950;
             this.getVistaPrincipal().height = 720;
             this.getVistaPrincipal().resizable = false;*/
            this.getVistaPrincipal().on({
                hide: function () {
                    _this.onCerrarHandler();
                }/*,
                 show: function () {
                 _this.getVistaPrincipal().setTitle(_this.idioma.tlVentanaLote);
                 }*/
            });
        }
    },
    /**
     * Inicializa los componentes de lote.
     * @returns {undefined}
     */
    init: function () {
        LOG.lb.lote.View.superclass.init.call(this);
        var _this = this;
        this.fabricante = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbFabricante,
            url: '/logistica/utiles/lote/index.php/lote/cargarComboFabricante',
            hiddenName: 'idfabricante',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            allowBlank: true,
            mode: 'remote',
            pageSize: 10,
            resizable: true
        });
        this.fabricante.getStore().on({
            load: function (_cb, _r) {
                _this.listaFabricante = new LOG.util.List(_r);
                _this.cargado++;
                if (_this.cargado == 2) {
                    _this.getStorePrincipal().load();
                }
            }
        });
        this.pais = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbPais,
            hiddenName: 'idpais',
            url: '/logistica/utiles/lote/index.php/lote/cargarComboPais',
            valueField: 'idpais',
            displayField: 'nombrepais',
            allowBlank: true
        });
        this.pais.getStore().on({
            load: function (_cb, _r) {
                _this.listaPaises = new LOG.util.List(_r);
                _this.cargado++;
                if (_this.cargado == 2) {
                    _this.getStorePrincipal().load();
                }
            }
        });
        /*if (this.panelSuperior && (this.grantedAction('CT') || this.grantedAction('RCRUD') || this.grantedAction('RAdicionar'))) {
         this.storeProductos = new Ext.data.Store({
         autoLoad: true,
         url: this.dirController + '/getProductosDocumento',
         baseParams: this.parametros,
         listeners: {
         'beforeload': function () {
         _this.getVistaPrincipal().getEl().mask(LOG.util.Idioma.msgCargaInicial + '.' + LOG.util.Idioma.msgEspere);
         },
         'load': function (cb, records) {
         _this.getVistaPrincipal().getEl().unmask();
         _this.btnAnterior.disable();
         _this.btnSiguiente.disable();
         _this.indexProducto = -1;
         /!*if (cb.getCount() > 1) {
         _this.btnSiguiente.enable();
         }*!/
         
         if(_this.parametros['idproducto']) {
         Ext.each(records, function (rec, pos) {
         if (_this.parametros['idproducto'] == rec.data.idproducto ){
         _this.indexProducto = pos-1;
         }
         });
         }
         
         if (cb.getCount() > 0) {
         _this.selectProducto(true);
         }
         }
         },
         reader: new Ext.data.JsonReader({
         root: 'datos',
         totalProperty: 'cantidad',
         id: 'idproducto'
         }, [
         {
         name: 'idproducto'
         }, {
         name: 'codigo'
         }, {
         name: 'denominacion'
         }, {
         name: 'denomlineaprodfarm'
         }, {
         name: 'idmovimiento'
         }, {
         name: 'signo'
         }
         ])
         });
         this.panelDatos();
         }*/
    },
    /**
     * Inicializa los botones del panel superior.
     * @returns {undefined}
     */

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            hidden: true,
            tooltip: _this.idioma.ttBtnModificarLote,
            handler: function () {
                _this.modificando = true;
                _this.fPanel.getForm().loadRecord(_this.getSmPrincipal().getSelected());
                _this.modelo.loadRecord();
                _this.cbUbicacion.setValue(_this.getSmPrincipal().getSelected().data.descripcion);
                _this.habilitarCampos(true);
                console.info(_this.clsLotes.getColumn(2));
                _this.clsLotes.getColumn(2).items.items[0].fireEvent('focus');
            },
            controlFn: function (b, _caller) {
                if (_this.panelSuperior && (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'modificarLote');
                } else {
                    b.hide();
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            hidden: true,
            tooltip: _this.idioma.ttBtnEliminarLote,
            handler: function () {
                var rec = _this.recMovimiento != null ? _this.recMovimiento : _this.sm.getSelected();
                Ext.apply(_this.datos, {
                    idmovimiento: rec.data.idmovimiento,
                    signo: _this.sm.getSelected().json.signo,
                    actualizarMov: _this.actualizarMov || null,
                    afectaLote: _this.afectaLote || null,
                    afectaProducto: _this.afectaProducto || null,
                    usaMonedas: _this.usaMonedas || null,
                    compraVenta: _this.compraVenta
                });
                _this.modelo.eliminar({datos: _this.datos}, function () {
                    _this.modificando = false;
                    if (_this.fPanel) {
                        _this.fPanel.getForm().reset();
                        _this.modelo.reset();
                        _this.habilitarCampos(true);
                    }
                    _this.modelo.idproducto = rec.json.idproducto || -1;
                    _this.modelo.idmovimiento = rec.json.idmovimiento;
                    _this.st.reload();
                    _this.onPostEliminarHandler();
                }, true);
            },
            controlFn: function (b, _caller) {
                if ((_this.panelSuperior || _this.btnEliminar) && (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminarLote');
                } else {
                    b.hide();
                }
            }
        }));
        Ext.apply(this.listaBotones.getBy('iconCls', 'eliminar'), {
            key: _this.panelSuperior ? {
                key: Ext.EventObject.DELETE,
                shift: false,
                alt: false,
                ctrl: false
            } : null
        });
        this.addToolbarButton(LOG.util.Prototipos.botonDuplicar({
            hidden: true,
            tooltip: _this.idioma.ttBtnDuplicarLote,
            handler: function () {
                _this.modificando = false;
                _this.fPanel.getForm().loadRecord(_this.getSmPrincipal().getSelected());
                _this.modelo.loadRecord();
                _this.cbUbicacion.setValue(_this.getSmPrincipal().getSelected().data.descripcion);
                _this.habilitarCampos();
                _this.modelo.idmovlote = null;
                _this.fPanel.getForm().setValues({cantidad: null});
                _this.clsLotes.getColumn(2).items.items[0].fireEvent('focus');
            },
            controlFn: function (b, _caller) {
                if (_this.panelSuperior && (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'duplicarLote');
                } else {
                    b.hide();
                }
            }
        }));
        if (this.ayuda) {
            this.addToolbarButton('->');
            this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
                id: (this.formaVisualizacion == 'panel' ? 'idLotePanel' : 'idLote'),
                referencia: '/logistica/utiles/lote/index.php/lote'
            }));
        }
        // Botones de accion de la ventana.
        if (this.formaVisualizacion != 'panel') {
            LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
                text: _this.idioma.lbBtnCerrar,
                key: {
                    key: 'X',
                    ctrl: true,
                    alt: true
                }
            });
            this.getVistaPrincipal().listaBotones.getItem(1).hide();
            this.getVistaPrincipal().listaBotones.getItem(2).hide();
        }
    },

    // selectProducto: function (next) {
    //     var _this = this;
    //     next = next || false;
    //     if (next) {
    //         _this.indexProducto += 1;
    //     } else {
    //         _this.indexProducto -= 1;
    //     }
    //     if (_this.indexProducto == 0) {
    //         _this.btnAnterior.disable();
    //     } else {
    //         _this.btnAnterior.enable();
    //     }
    //     if (_this.indexProducto == _this.storeProductos.getCount() - 1) {
    //         _this.btnSiguiente.disable();
    //     } else {
    //         _this.btnSiguiente.enable();
    //     }
    //     _this.recMovimiento = _this.storeProductos.getAt(_this.indexProducto);
    //     _this.paneDatosProductos.getForm().loadRecord(_this.recMovimiento);
    //     _this.getStorePrincipal().load({params: {start: 0}});
    //     _this.modelo.reset();
    // },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({dataIndex: 'idlote'});
        this.addGridColumn({dataIndex: 'idmovlote'});
        this.addGridColumn({dataIndex: 'idlotecomprometido'});
        this.addGridColumn({dataIndex: 'idubicacioncomprometida'});
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idmovimiento'});
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({
            header: this.idioma.cgNroLote,
            dataIndex: 'numero',
            width: 80,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgFechaVencimiento,
            width: 140,
            dataIndex: 'fechavencimiento',
            default: true
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            width: 80,
            dataIndex: 'existencia',
            align: 'right',
            default: true
        }));

        if (_this.sm.getSelected().json.idmovimiento) {
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: this.idioma.cgCantidad,
                width: 80,
                dataIndex: 'cantidad',
                align: 'right',
                renderer: function (_v, _mD, _r) {
                    _r.data.cantidad = _r.data.cantidad || 0;
                    return _r.data.cantidad;
                },
                default: true
            }));
        }

        this.addGridColumn({
            header: this.idioma.cgFechaFabricacion,
            width: 140,
            dataIndex: 'fechafabricacion',
            hidden: true,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgFabricante,
            autoExpand: true,
            dataIndex: 'idfabricante',
            renderer: function (_v) {
                var fabricante = _this.listaFabricante.getBy('id', _v);
                return fabricante ? fabricante.data.nombre : '-';
            },
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPais,
            width: 200,
            dataIndex: 'idpais',
            renderer: function (_v) {
                var pais = _this.listaPaises.getBy('id', _v);
                return pais ? pais.data.nombrepais : '-';
            },
            hidden: true,
            default: true
        });
        if (this.ubicacion) {
            this.addGridColumn({
                header: this.idioma.cgUbicacion,
                width: 140,
                dataIndex: 'descripcion',
                hidden: true,
                default: true
            });
            this.addGridColumn({dataIndex: 'idarea'});
            this.addGridColumn({dataIndex: 'idareaproducto'});
            this.addGridColumn({dataIndex: 'idarealote'});
            this.addGridColumn({dataIndex: 'idubicacion'});
            this.addGridColumn({dataIndex: 'idubicacionproducto'});
            this.addGridColumn({dataIndex: 'idubicacionlote'});
            this.addGridColumn({dataIndex: 'esarea'});
        }

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgDisponible,
            width: 80,
            dataIndex: 'disponible',
            align: 'right',
            hidden: true,
            default: true
        }));

    },
    /**
     * Renderiza los componente y reprograma los eventos.
     * @returns {Vista principal}
     */
    render: function () {
        var render = LOG.lb.lote.View.superclass.render.call(this);
        var _this = this;
        this.getGridPrincipal().on({
            beforeedit: function (e) {
                e.cancel = !(_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'));
            }
        });

        this.getStorePrincipal().on({
            beforeload: function () {
                this.commitChanges();
                var rec = _this.recMovimiento != null ? _this.recMovimiento : _this.sm.getSelected();
                this.initBaseParams.idproducto = _this.modelo.idproducto = rec.json.idproducto || -1;
                this.initBaseParams.idmovimiento = _this.modelo.idmovimiento = rec.json.idmovimiento;
                this.initBaseParams.ubicacion = _this.ubicacion ? 1 : null;
                this.initBaseParams.contabilizado = _this.contabilizado ? 1 : null;
                Ext.apply(this.initBaseParams, _this.parametros);
            },
            load: function () {
                if (typeof _this._colorFilaFn == 'function') {
                    this.each(function (_l, index) {
                        var css = _this._colorFilaFn.createDelegate(this, [_l]).call();
                        Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass(css);
                    });
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.sm, 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() == 1 && this.getSelected().json.tienelote == 1 && _this.cargado == 2) {
                    _this.getStorePrincipal().load();
                }
            }
        }, 'sm');
        return render;
    },
    // /**
    //  * Inicializa los campos de entrada de datos.
    //  * @returns {undefined}
    //  */
    // panelDatos: function () {
    //     var _this = this;
    //     this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function () {
    //         _this.clsLotes = LOG.util.UIManager.initColumnForm({
    //             columnas: 3
    //         });
    //         _this.clsLotes.addComponent(LOG.util.Prototipos.inputTexto({
    //             fieldLabel: _this.idioma.lbTfNroLote,
    //             name: 'numero',
    //             allowBlank: false,
    //             listeners: {
    //                 blur: function (_tf) {
    //                     if (!_this.modificando && _tf.getValue()) {
    //                         _this.modelo.cargaInicial({
    //                             url: '/logistica/utiles/lote/index.php/lote/cargarLotes',
    //                             idproducto: _this.modelo.idproducto,
    //                             numero: _tf.getValue()
    //                         }, function (r) {
    //                             _this.habilitarCampos(r[0].length == 0);
    //                             _this.fPanel.getForm().loadRecord({data: r[0][0] || {}});
    //                             _this.modelo.loadRecord(r[0][0] || {idlote: null});
    //                         });
    //                     }
    //                 }
    //             }
    //         }));
    //         var desde = new Ext.form.DateField({
    //             fieldLabel: _this.idioma.lbDfFechaFabricacion,
    //             name: 'fechafabricacion',
    //             vtype: 'daterange',
    //             format: "d/m/Y",
    //             maxValue: Date.parseDate(_this.fecha, 'd/m/Y'),
    //             editable: false,
    //             allowBlank: true,
    //             listeners: {
    //                 select: function () {
    //                     hasta.setMinValue(this.getValue());
    //                 }
    //             }
    //         });
    //         var hasta = new Ext.form.DateField({
    //             fieldLabel: _this.idioma.lbDfFechaVencimiento,
    //             name: 'fechavencimiento',
    //             vtype: 'daterange',
    //             format: "d/m/Y",
    //             editable: false,
    //             allowBlank: false,
    //             listeners: {
    //                 select: function () {
    //                     var fecha;
    //                     if (Date.parseDate(_this.fecha, 'd/m/Y') < this.getValue()) {
    //                         fecha = Date.parseDate(_this.fecha, 'd/m/Y');
    //                     } else {
    //                         fecha = this.getValue();
    //                     }
    //                     desde.setMaxValue(fecha);
    //                 }
    //             }
    //         });
    //         _this.clsLotes.addComponent(hasta);
    //
    //
    //         _this.clsLotes.addComponent(LOG.util.Prototipos.inputDecimal({
    //             fieldLabel: _this.idioma.lbNfCantidad,
    //             name: 'cantidad',
    //             allowBlank: false,
    //             minValue: 0.000001,
    //             minText: _this.idioma.msgCantidadMinima
    //         }));
    //
    //         /*_this.clsLotes.addComponent(desde);
    //         _this.clsLotes.addComponent(_this.fabricante);
    //         _this.clsLotes.addComponent(_this.pais);*/
    //
    //         var btnGuardar = LOG.util.Prototipos.botonGuardar({
    //             tooltip: _this.idioma.ttBtnGuardar,
    //             handler: function () {
    //                 var rec = _this.recMovimiento != null ? _this.recMovimiento : _this.sm.getSelected();
    //                 Ext.apply(_this.datos, {
    //                     signo: _this.sm.getSelected().json.signo,
    //                     actualizarMov: _this.actualizarMov || null,
    //                     afectaLote: _this.afectaLote || null,
    //                     afectaProducto: _this.afectaProducto || null,
    //                     usaMonedas: _this.usaMonedas || null,
    //                     compraVenta: _this.compraVenta
    //                 });
    //                 _this.modelo.idproducto = rec.json.idproducto;
    //                 _this.modelo.idmovimiento = rec.json.idmovimiento;
    //                 _this.modelo.salvar({datos: Ext.encode(_this.datos)}, function () {
    //                     _this.fPanel.getForm().reset();
    //                     _this.modelo.reset();
    //                     _this.habilitarCampos(true);
    //
    //                     _this.modificando = false;
    //                 });
    //             }
    //         });
    //         _this.cbUbicacion = new LOG.util.TreeCombo({
    //             fieldLabel: _this.idioma.lbCbUbicacion,
    //             name: 'idubicacion',
    //             displayField: 'text',
    //             url: '/logistica/utiles/lote/index.php/lote/cargarComboUbicacion',
    //             node: _this.iddeposito,
    //             selectOnlyLeaf: _this.confubicacion,
    //             allowBlank: true,
    //             selectFn: function (_v) {
    //                 this.displayedText = _v.text;
    //                 _this.modelo.idarea = _v.attributes.idarea;
    //                 if (_v.parentNode) {
    //                     if (_v.parentNode.attributes.id == 0) {
    //                         _this.modelo.esarea = true;
    //                     } else {
    //                         _this.modelo.esarea = null;
    //                     }
    //                 }
    //             }
    //         });
    //         //_this.clsLotes.addComponent(_this.cbUbicacion);
    //         _this.fPanel = LOG.util.UIManager.initForm({
    //             border: false,
    //             items: [_this.clsLotes],
    //             region: 'center',
    //             buttons: [
    //                 LOG.util.Prototipos.botonNuevo({
    //                     tooltip: _this.idioma.ttBtnNuevo,
    //                     handler: function () {
    //                         var rec = _this.recMovimiento != null ? _this.recMovimiento : _this.sm.getSelected();
    //                         _this.fPanel.getForm().reset();
    //                         _this.modelo.reset();
    //                         _this.habilitarCampos(true);
    //                         _this.modelo.idproducto = rec.json.idproducto;
    //                         _this.modelo.idmovimiento = rec.json.idmovimiento;
    //                         _this.modificando = false;
    //                         desde.setMaxValue(Date.parseDate(_this.fecha, 'd/m/Y'));
    //                         hasta.setMinValue(null);
    //                     }
    //                 }),
    //                 btnGuardar
    //             ]
    //         });
    //         _this.modelo.bindForm(_this.fPanel);
    //         _this.modelo.addActionButton(btnGuardar);
    //         var panelSuperior = LOG.util.UIManager.initColumnForm({
    //             columnas: 2,
    //             frame: true,
    //             border: false
    //         });
    //         _this.paneDatosProductos = LOG.util.UIManager.initForm({
    //             border: false,
    //             labelAlign: 'top',
    //             bodyStyle: 'padding:0px 10px 0px 5px',
    //             items: [
    //                 new Ext.form.DisplayField({
    //                     fieldLabel: '<b>' + LOG.lb.producto.Idioma.cgCodigo + '</b>',
    //                     name: 'codigo',
    //                     anchor: '95%'
    //                 }),
    //                 new Ext.form.DisplayField({
    //                     fieldLabel: '<b>' + LOG.lb.producto.Idioma.cgDenominacion + '</b>',
    //                     name: 'denominacion',
    //                     anchor: '95%'
    //                 }),
    //                 new Ext.form.DisplayField({
    //                     fieldLabel: '<b>' + LOG.util.Idioma.lbLineaProducto + '</b>',
    //                     name: 'denomlineaprodfarm',
    //                     anchor: '95%'
    //                 }),
    //             ],
    //             buttons: [
    //                 _this.btnAnterior = LOG.util.Prototipos.botonGeneral({
    //                     text: LOG.util.Idioma.lbBtnAnterior,
    //                     iconCls: 'anterior',
    //                     disabled: true,
    //                     handler: function () {
    //                         _this.selectProducto(false);
    //                     }
    //                 }),
    //                 _this.btnSiguiente = LOG.util.Prototipos.botonGeneral({
    //                     text: LOG.util.Idioma.lbBtnSiguiente,
    //                     iconCls: 'siguiente',
    //                     disabled: true,
    //                     handler: function () {
    //                         _this.selectProducto(true);
    //                     }
    //                 })
    //             ]
    //         });
    //
    //         panelSuperior.addComponent({
    //             xtype: 'fieldset',
    //             title: _this.idioma.tlDatosLote,
    //             autoHeight: true,
    //             items: [_this.fPanel]
    //         });
    //         panelSuperior.addComponent({
    //             xtype: 'fieldset',
    //             title: _this.idioma.tlDatosProducto,
    //             height: 180,
    //             autoScroll: true,
    //             items: [_this.paneDatosProductos]
    //         });
    //         _this.getPanelSuperior().add(panelSuperior);
    //         Ext.each(_this.fPanel.buttons, function (btn) {
    //             LOG.util.UIManager.applyKey(btn, _this.getPanelPrincipal());
    //         });
    //         _this.getPanelSuperior().autoHeight = true;
    //     });
    // },
    /**
     * Accion que se ejecuta luego de cerrar la ventana.
     * @returns {undefined}
     */
    onCerrarHandler: function () {
        if (typeof this.cerrarFn == 'function') {
            this.cerrarFn.createDelegate(this).call();
        }
    },
    /**
     * Accion que se ejecuta luego de eliminar un lote.
     * @returns {undefined}
     */
    onPostEliminarHandler: function () {
        if (typeof this._postEliminarFn == 'function') {
            this._postEliminarFn.createDelegate(this).call();
        }
    },
    /**
     * Habilita o deshabilita los campos de entrada datos comunes del lote.
     * @param {Boolean} habilitar
     * @returns {undefined}
     */
    habilitarCampos: function (habilitar) {
        if (habilitar) {
            //this.clsLotes.getColumn(0).items.items[1].enable();
            this.clsLotes.getColumn(1).items.items[0].enable();
            //this.clsLotes.getColumn(1).items.items[1].enable();
            //this.clsLotes.getColumn(2).items.items[0].enable();
        } else {
            //this.clsLotes.getColumn(0).items.items[1].disable();
            this.clsLotes.getColumn(1).items.items[0].disable();
            //this.clsLotes.getColumn(1).items.items[1].disable();
            //this.clsLotes.getColumn(2).items.items[0].disable();
        }
    }
});
