Ext.ns('LOG.lb.numeroserie');

/**
 * Plantilla tipo ventana para gestionar los numeros de serie.
 * @type LOG.util.UITemplate
 */
LOG.lb.numeroserie.View = Ext.extend(LOG.util.UITemplate, {
    /**
     * Direccion de la clase controladora.
     * @type String
     */
    dirController: '/logistica/utiles/producto/index.php/numeroserie',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarNumeroserie',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se muestran los datos de marca y modelo.
     * @type Boolean
     */
    usarMarcaModelo: false,
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    idGridPrincipal: 'idnroserie',
    /**
     * Cantidad de numeros de series del movimiento.
     * @type Integer
     */
    cantidad: 0,
    /**
     * Determina si se cargan todos los numeros de serie del store.
     * @type Boolean
     */
    allnroserie: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.idioma = Ext.apply(LOG.lb.numeroserie.Idioma, LOG.util.Idioma.init());
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.autoSelect = false;
        this.concepto = this.idioma.lbConcepto;
        this.textBusquedaSimple = this.idioma.lbBuscar;
        this.modelo = new LOG.lb.numeroserie.Model({
            idioma: this.idioma
        });
        LOG.lb.numeroserie.View.superclass.constructor.call(this, config);
        var _this = this;
        if (!config.formaVisualizacion || config.formaVisualizacion == 'ventana') {
            this.getVistaPrincipal().maximized = true;
            this.getVistaPrincipal().resizable = false;
            this.getVistaPrincipal().on({
                hide: function() {
                    _this.onCerrarHandler({});
                },
                show: function() {
                    var titulo = String.format("{0}: {1} - {2} {3}", _this.idioma.tlNumeroserie, _this.producto.denominacion, _this.idioma.lbCantidad, _this.cantidad);
                    _this.getVistaPrincipal().setTitle(titulo);
                }
            });
        }
    },
    /**
     * Inicializa los componentes de numero de serie.
     * @returns {undefined}
     */
    init: function() {
        LOG.lb.numeroserie.View.superclass.init.call(this);
        this.initAvanzada();
    },
    /**
     * Inicializa los botones del panel superior.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        var _this = this;

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: _this.idioma.ttBtnEliminar,
            hidden: true,
            handler: function() {
                var eliminar = false;
                var arrayId = new Array();
                var arrayP = new Array();

                Ext.each(_this.getSmPrincipal().getSelections(), function (item) {
                    if (item.data.estado == 2) {
                        arrayId.push({
                            idmovnumeroserie: item.data.idmovnumeroserie
                        });
                    }
                });

                if (arrayId.length == 0) {
                    eliminar = true;
                }

                if (eliminar) {
                    _this.modelo.eliminar({afecta: _this.afecta || null});
                } else {

                    Ext.each(_this.getSmPrincipal().getSelections(), function (item) {
                        if (item.data.estado == 1) {
                            arrayP.push({
                                idmovnumeroserie: item.data.idmovnumeroserie
                            });
                        }
                    });

                    if (arrayId.length == 1 && arrayP.length == 0) {
                        mostrarMensaje(3, _this.idioma.msgErrorEliminandoUna);
                    } else {
                        mostrarMensaje(3, _this.idioma.msgErrorEliminando);
                    }
                }
            },
            controlFn: function(b, _caller) {
                if (/*(_this.grantedAction('CT') || _this.grantedAction('RCRUD')) &&*/ _this.documento.estado == '1' && _this.ocultarPanel == 0) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'btnEliminar');
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'E'
            },
            iconCls: 'exportar',
            text: LOG.util.Idioma.lbBtnExcel,
            tooltip: LOG.util.Idioma.ttBtnExcel,
            disabled: true,
            handler: function() {
                Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                var params = _this.panelBusquedaAvanzada.getForm().getFieldValues(true);
                Ext.apply(params, {
                    criterio: _this.gridFilter.tfBusqueda.getValue(),
                    idmovimiento: _this.producto.idmovimiento,
                    idproducto: _this.producto.idproducto,
                    idestructura: _this.idestructura
                });
                Ext.Ajax.request({
                    url: '/logistica/utiles/producto/index.php/numeroserie/cargarNumeroserieExportar',
                    method: 'POST',
                    params: params,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                        window.open(resp.dirFichero, 'ventana', wCfg);
                    }
                });
            },
            controlFn: function(b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function(e) {
                    if (e == 'load') {
                        if (this.getCount() > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'cargarStore');
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.btnAplicarTodos,
            iconCls: 'aplicar',
            disabled: true,
            tooltip: _this.idioma.ttBtnAplicarTodos,
            handler: function() {
                var record = _this.storePrincipal.getModifiedRecords();
                console.info(record)
                if (record.length > 0) {
                    var arrayP = new Array();
                    Ext.each(record, function (r) {
                        if (_this.getSmPrincipal().getSelected().data.idmovnumeroserie == r.data.idmovnumeroserie) {
                            arrayP.push({
                                annofab: (r.data.annofab) ? r.data.annofab : 0,
                                descrip: (r.data.descrip) ? r.data.descrip : 0,
                                num: (r.data.num) ? r.data.num : 0,
                                annocons: (r.data.annocons) ? r.data.annocons : 0,
                                tipoconser: (r.data.tipoconser) ? r.data.tipoconser : 0
                            });
                        }
                    });
                }

                _this.modelo.salvar({lista: true, idaplicar: _this.getSmPrincipal().getSelected().data.idmovnumeroserie, aplicar: Ext.encode(arrayP)}, function() {

                });
            },
            controlFn: function(b, _caller) {
                if (/*(_this.grantedAction('CT') || _this.grantedAction('RCRUD')) &&*/ _this.documento.estado == '1' || _this.ocultarPanel == 1) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && (this.getSelected().isModified('annofabricacion') ||
                                this.getSelected().isModified('descripcion') || this.getSelected().isModified('numero') ||
                                this.getSelected().isModified('annoconservacion')/*&& this.getSelected().data.estado == 2*/)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'btnAplicar');
                }
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idnumeroserie',
            referencia: '/logistica/utiles/producto/index.php/numeroserie',
            btn: 'ayuda'
        }));

        Ext.apply(this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({}, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        this.addGridColumn({dataIndex: 'idmovnumeroserie'});
        this.addGridColumn({dataIndex: 'idnroserie'});
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idmovimiento'});
        this.addGridColumn({dataIndex: 'idestructuraubicacion'});
        this.addGridColumn({dataIndex: 'idconservacion'});
        this.addGridColumn({dataIndex: 'idmarca'});
        this.addGridColumn({dataIndex: 'idmodelo'});
        this.addGridColumn({
            header: this.idioma.gcNroserie,
            dataIndex: 'nroserie',
            width: 90,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFechaFabricacion,
            dataIndex: 'annofabricacion',
            width: 120,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcUbicacion,
            dataIndex: 'descripcion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcNumero,
            dataIndex: 'numero',
            width: 100,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcAnno,
            dataIndex: 'annoconservacion',
            width: 100,
            default: true
        });
        this.addGridColumn({dataIndex: 'estado'});
        this.addGridColumn({
            header: this.idioma.gcTipo,
            dataIndex: 'tipoconservacion',
            width: 120,
            default: true
        });
        if (this.usarMarcaModelo) {
            this.addGridColumn({
                header: this.idioma.gcMarca,
                dataIndex: 'marca',
                width: 120,
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcModelo,
                dataIndex: 'modelo',
                width: 120,
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcNroPieza,
                dataIndex: 'nropieza',
                width: 100,
                default: true
            });
        }
    },
    /**
     * Inicializa el panel de busqueda avanzada.
     * @returns {undefined}
     */
    initAvanzada: function() {
        var _this = this;
        this.getPanelBusqueda().setColumns(2);

        if (!this.salida) {//Verificar componente con Kenier...
            this.addFilterComponent(LOG.util.Prototipos.inputTexto({
                fieldLabel: _this.idioma.lbNroserie,
                name: 'nroserie'
            }));
        }
        var cbAnnoFabricacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbTfFechaFabricacion,
            name: 'annofabricacion',
            url: '/logistica/utiles/producto/index.php/numeroserie/cargarAnnosNroSerie',
            displayField: 'denominacion',
            valueField: 'denominacion',
            autoLoad: false
        });
        cbAnnoFabricacion.getStore().on({
            beforeload: function() {
                this.baseParams.tipo = 1;
                this.baseParams.idestructura = _this.idestructura;
                this.baseParams.idproducto = _this.producto.idproducto;
            }
        });
        cbAnnoFabricacion.getStore().load();
        var cbAnnoConservacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbTfAnno,
            name: 'annoconservacion',
            url: '/logistica/utiles/producto/index.php/numeroserie/cargarAnnosNroSerie',
            displayField: 'denominacion',
            valueField: 'denominacion',
            autoLoad: false
        });
        cbAnnoConservacion.getStore().on({
            beforeload: function() {
                this.baseParams.tipo = 2;
                this.baseParams.idestructura = _this.idestructura;
                this.baseParams.idproducto = _this.producto.idproducto;
            }
        });
        cbAnnoConservacion.getStore().load();
        this.addFilterComponent(cbAnnoFabricacion);
        this.addFilterComponent(new LOG.util.TreeCombo({
            fieldLabel: this.idioma.lbCbUbicacion,
            url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
            name: 'idestructuraubicacion',
            node: this.idestructura,
            selectOnlyLeaf: this.confubicacion
        }));
        if (!this.salida) {//Verificar componente con Kenier...
            this.addFilterComponent(LOG.util.Prototipos.inputTexto({
                fieldLabel: this.idioma.lbTfNumero,
                name: 'numero'
            }));
        }
        this.addFilterComponent(cbAnnoConservacion);
        this.addFilterComponent(new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbTipo,
            hiddenName: 'idconservacion',
            store: this.stConservacion,
            displayField: 'denominacion',
            valueField: 'idconservacion',
            autoLoad: true,
            editable: false
        }));
        if (this.usarMarcaModelo) {
            this.addFilterComponent(new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbMarca,
                hiddenName: 'idmarca',
                url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
                valueField: 'idmarca',
                displayField: 'denominacion'
            }));
            this.addFilterComponent(new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbModelo,
                hiddenName: 'idmodelo',
                url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
                valueField: 'idmodelo',
                displayField: 'denominacion'
            }));
            if (!this.salida) {//Verificar componente con Kenier...
                this.addFilterComponent(LOG.util.Prototipos.inputTexto({
                    fieldLabel: this.idioma.lbTfNroPieza,
                    name: 'nropieza'
                }));
            }
        }
    },
    /**
     * Renderiza los componente y reprograma los eventos.
     * @returns {Vista principal}
     */
    render: function() {
        var render = LOG.lb.numeroserie.View.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            beforeload: function() {
                this.initBaseParams.idmovimiento = _this.modelo.idmovimiento = _this.producto.idmovimiento;
                this.initBaseParams.idproducto = _this.modelo.idproducto = _this.producto.idproducto;
                 if (_this.allnroserie) {
                     this.initBaseParams.allnroserie = _this.modelo.allnroserie = _this.allnroserie;
                 }
                _this.modelo.resetList();
                _this.modelo.habilitarBotones(!_this.modelo.isValid());
            },
            load: function(st) {
                _this.cantidad = parseInt(st.reader.jsonData.cantidad);
                var titulo = String.format("{0}: {1} - {2} {3}", _this.idioma.tlNumeroserie, _this.producto.denominacion, _this.idioma.lbCantidad, _this.cantidad);
                _this.getVistaPrincipal().setTitle(titulo);
            }
        });
        this.getStorePrincipal().load();
        return render;
    },
    /**
     * Accion que se ejecuta luego de cerrar la ventana.
     * @returns {undefined}
     */
    onCerrarHandler: function(r) {
        if (typeof this.cerrarFn == 'function') {
            this.cerrarFn.createDelegate(this, [r]).call();
        }
    }
});

/**
 * Plantilla tipo ventana para gestionar los numeros de serie entrantes.
 * @type LOG.util.UITemplate
 */
LOG.lb.numeroserie.Entrada = Ext.extend(LOG.lb.numeroserie.View, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    ocultarPanel: 0,
    /**
     * Determina si se oculta el panel de los numeros de serie de la interfaz.
     * @type Boolean
     */
    constructor: function(config) {
        this.gridEditable = true;
        LOG.lb.numeroserie.Entrada.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes de numero de serie.
     * @returns {undefined}
     */
    init: function() {
        var _this = this;
        this.stConservacion = new Ext.data.Store({
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad',
            autoLoad: true,
            baseParams: {
                modelo: 'NomConservacion',
                idnom: 'idconservacion'
            },
            reader: new Ext.data.JsonReader({
                id: 'idconservacion',
                root: "datos",
                fields: [
                    {name: 'idconservacion'},
                    {name: 'denominacion'}
                ]
            }),
            listeners: {
                load: function() {
                    _this.cargado = true;
                }
            }
        });
        LOG.lb.numeroserie.Entrada.superclass.init.call(this);
        if (this.documento.estado == '1' && this.ocultarPanel == 0) {
            this.panelDatos();
        }
    },
    /**
     * Inicializa los botones del panel superior.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        LOG.lb.numeroserie.Entrada.superclass.initDefaultButtons.call(this);
        var _this = this;
        Ext.apply(this.getVistaPrincipal().listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
            disabled: true,
            tooltip: _this.idioma.ttBtnGuardarSerie,
            handler: function() {
                _this.modelo.salvar({lista: true});
            },
            fnEspecialCondition: function() {
                return !_this.modelo.isValidList();
            }
        }));
        this.modelo.addActionButton(this.getVistaPrincipal().listaBotones.getItem(2), true);
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        LOG.lb.numeroserie.Entrada.superclass.initDefaultColumns.call(this);
        var _this = this;
        Ext.apply(this.listaColumnas.getBy('dataIndex', 'nroserie'), {
            editor: LOG.util.Prototipos.inputTexto({})
        });
        
        Ext.apply(this.listaColumnas.getBy('dataIndex', 'numero'), {
            editor: LOG.util.Prototipos.inputTexto({}),
            renderer: function(_v, _mD, _r) {
                if(!_v){
                    _r.data.numero = null;
                }
                return _r.data.numero;
            }
        });
        if (this.documento.estado == '1' || this.ocultarPanel  == 1) {
            Ext.apply(this.listaColumnas.getBy('dataIndex', 'annofabricacion'), {
                editor: LOG.util.Prototipos.inputEntero({
                    minLength: 4,
                    maxLength: 4,
                    minValue: 1900,
                    maxValue: _this.getYear(_this.fecha)
                })
            });

            _this.ubicacion = {};
            this.cbUbicacion = new LOG.util.TreeCombo({
                fieldLabel: _this.idioma.lbCbUbicacion,
                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                node: _this.idestructura,
                displayedText: 'text',
                selectOnlyLeaf: _this.confubicacion,
                listeners: {
                    select: function() {
                        _this.ubicacion = {
                            idubicacion: this.getValue(),
                            descripcion: this.getNodeText()
                        };
                    }
                }
            });
            Ext.apply(this.listaColumnas.getBy('dataIndex', 'descripcion'), {
                editor: _this.cbUbicacion,
                renderer: function(_v, _mD, _r) {
                    _r.data.idestructuraubicacion = _this.ubicacion.idubicacion ||_r.data.idestructuraubicacion;
                    _r.data.descripcion = _this.ubicacion.descripcion || _r.data.descripcion;
                    _this.ubicacion = {};
                    return _r.data.descripcion;
                }
            });

            Ext.apply(this.listaColumnas.getBy('dataIndex', 'annoconservacion'), {
                editor: LOG.util.Prototipos.inputEntero({
                    minLength: 4,
                    maxLength: 4,
                    minValue: 1900,
                    maxValue: _this.getYear(_this.fecha)
                })
            });
            Ext.apply(this.listaColumnas.getBy('dataIndex', 'tipoconservacion'), {
                editor: new LOG.util.ComboBox({
                    hiddenName: 'idconservacion',
                    store: _this.stConservacion,
                    valueField: 'idconservacion',
                    displayField: 'denominacion',
                    editable: false
                }),
                renderer: function(_v, _mD, _r) {
                    if (_this.cargado) {
                        var record = _this.stConservacion.getById(_v);
                    }
                    if (record) {
                        _r.data.idconservacion = record.data.idconservacion;
                        _r.data.tipoconservacion = record.data.denominacion;
                    }
                    return _r.data.tipoconservacion;
                }
            });
            if (_this.usarMarcaModelo) {
                Ext.apply(this.listaColumnas.getBy('dataIndex', 'marca'), {
                    editor: new LOG.util.ComboBox({
                        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
                        valueField: 'idmarca',
                        displayField: 'denominacion'
                    }),
                    renderer: function(_v, _mD, _r) {
                        if (this.editor.getStore().getCount() > 0 && _r.data.idmarca) {
                            var record = this.editor.getStore().getById(_r.data.idmarca);
                            _r.data.marca = record.data.denominacion;
                        }
                        return _r.data.marca;
                    }
                });
                Ext.apply(this.listaColumnas.getBy('dataIndex', 'modelo'), {
                    editor: new LOG.util.ComboBox({
                        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
                        valueField: 'idmodelo',
                        displayField: 'denominacion'
                    }),
                    renderer: function(_v, _mD, _r) {
                        if (this.editor.getStore().getCount() > 0 && _r.data.idmodelo) {
                            var record = this.editor.getStore().getById(_r.data.idmodelo);
                            _r.data.modelo = record.data.denominacion;
                        }
                        return _r.data.modelo;
                    }
                });
                Ext.apply(this.listaColumnas.getBy('dataIndex', 'nropieza'), {
                    editor: LOG.util.Prototipos.inputTexto({})
                });
            }
        }
    },
    /**
     * Renderiza los componente y reprograma los eventos.
     * @returns {Vista principal}
     */
    render: function() {
        var render = LOG.lb.numeroserie.Entrada.superclass.render.call(this);
        var _this = this;
        this.getGridPrincipal().on({
            beforeedit: function(o) {
                _this.ubicacion = {
                    idubicacion: o.record.data.idestructuraubicacion,
                    descripcion: o.record.data.descripcion
                };
            },
            afteredit: function(o) {
                if (o.field == 'marca' || o.field == 'modelo') {
                    o.record.data['id' + o.field] = o.value;
                } else if (o.field != 'descripcion') {
                    o.record.data[o.field] = o.value || null;
                }
                o.record.data['annofabricacion'] = o.record.data['annofabricacion'] || null;
                o.record.data['nropieza'] = o.record.data['nropieza'] || null;
                o.record.data['idmarca'] = o.record.data['idmarca'] || null;
                o.record.data['idmodelo'] = o.record.data['idmodelo'] || null;
                if (o.field == 'annofabricacion') {
                    o.record.data['annofab'] = 1;
                }
                if (o.field == 'descripcion') {
                    o.record.data['descrip'] = 1;
                }
                if (o.field == 'numero') {
                    o.record.data['num'] = 1;
                }
                if (o.field == 'annoconservacion') {
                    o.record.data['annocons'] = 1;
                }
                if (o.field == 'tipoconservacion') {
                    o.record.data['tipoconser'] = 1;
                }
                _this.modelo.adicionarProducto(o.record.data);
                o.grid.view.refresh();
            }
        });
        return render;
    },
    /**
     * Inicializa los componentes de entrada de datos.
     * @returns {undefined}
     */
    panelDatos: function() {
        var _this = this;
        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function() {
            _this.formFields = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });
            var txtNumeroSerie = LOG.util.Prototipos.inputTexto({
                fieldLabel: _this.idioma.lbNroserie,
                name: 'nroserie',
                allowBlank: false,
                enableKeyEvents: true
            });
            _this.formFields.addComponent(txtNumeroSerie);
            _this.formFields.addComponent(LOG.util.Prototipos.inputEntero({
                fieldLabel: _this.idioma.lbTfFechaFabricacion,
                name: 'annofabricacion',
                minLength: 4,
                maxLength: 4,
                minValue: 1900,
                maxValue: _this.getYear(_this.fecha)
            }));
            _this.formFields.addComponent(new LOG.util.TreeCombo({
                fieldLabel: _this.idioma.lbCbUbicacion,
                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                name: 'idestructuraubicacion',
                node: _this.idestructura,
                allowBlank: false,
                selectOnlyLeaf: _this.confubicacion
            }));
            _this.formFields.addComponent(LOG.util.Prototipos.inputTexto({
                fieldLabel: _this.idioma.lbTfNumero,
                name: 'numero',
                allowBlank: true,
                enableKeyEvents: true
            }));
            _this.formFields.addComponent(LOG.util.Prototipos.inputEntero({
                fieldLabel: _this.idioma.lbTfAnno,
                name: 'annoconservacion',
                allowBlank: false,
                minLength: 4,
                maxLength: 4,
                minValue: 1900,
                maxValue: _this.getYear(_this.fecha)
            }));
            _this.formFields.addComponent(new LOG.util.ComboBox({
                fieldLabel: _this.idioma.lbCbTipo,
                hiddenName: 'idconservacion',
                store: _this.stConservacion,
                displayField: 'denominacion',
                valueField: 'idconservacion',
                autoLoad: true,
                allowBlank: false,
                editable: false
            }));
            
            if (_this.usarMarcaModelo) {
                _this.formFields.addComponent(new LOG.util.ComboBox({
                    fieldLabel: _this.idioma.lbCbMarca,
                    hiddenName: 'idmarca',
                    url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
                    valueField: 'idmarca',
                    displayField: 'denominacion',
                    allowBlank: false,
                    pageSize: 10,
                    minChars: 0,
                    resizable: true
                }));

                _this.formFields.addComponent(new LOG.util.ComboBox({
                    fieldLabel: _this.idioma.lbCbModelo,
                    hiddenName: 'idmodelo',
                    url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
                    valueField: 'idmodelo',
                    displayField: 'denominacion',
                    allowBlank: false,
                    pageSize: 10,
                    minChars: 0,
                    resizable: true
                }));

                 _this.formFields.addComponent(LOG.util.Prototipos.inputTexto({
                    fieldLabel: _this.idioma.lbTfNroPieza,
                    name: 'nropieza',
                    allowBlank: false
                }));
            }

            _this.nfCantidad = LOG.util.Prototipos.inputEntero({
                name: 'cantidad',
                allowBlank: false,
                enableKeyEvents: true,
                disabled: true,
                minValue: 1,
                maxValue: _this.ajuste && parseInt(_this.producto.diferencia || 0) > 0 ? parseInt(_this.producto.diferencia) - _this.cantidad : Number.MAX_VALUE,
                emptyText: _this.idioma.lbCantidad
            });
            _this.rdSinRestringir = new Ext.form.Checkbox({
                boxLabel: _this.idioma.lbSinRestringir,
                name: 'restringir',
                listeners: {
                    check: function(_radio, checked) {
                        if (checked) {
                            _this.nfCantidad.enable();
                            txtNumeroSerie.disable();
                        } else {
                            _this.nfCantidad.disable();
                            txtNumeroSerie.enable();
                            _this.nfCantidad.setValue(null);
                            _this.nfCantidad.fireEvent('keyup');
                        }
                    }
                }
            });

            _this.formRadios = new Ext.form.FieldSet({
                style: '-moz-border-radius:5px',
                autoHeight: true,
                layout: 'column',
                items: [_this.rdSinRestringir, _this.nfCantidad]
            });

            _this.btnGuardarNroSerie = LOG.util.Prototipos.botonGuardar({
                text: _this.idioma.textBtnGuardarSerie,
                tooltip: _this.idioma.ttBtnGuardarSerie,
                handler: function() {
                    if (_this.ajuste && parseInt(_this.producto.diferencia || 0) > 0 && parseInt(_this.producto.diferencia) == _this.cantidad) {
                        mostrarMensaje(3, _this.idioma.msgDiferenciaConteo);
                        return;
                    }
                    _this.modelo.salvar({}, function(r) {
                        _this.fPanel.getForm().reset();
                        _this.modelo.reset();
                        _this.modelo.idproducto = _this.producto.idproducto;
                        _this.modelo.idmovimiento = _this.producto.idmovimiento;
                    });
                }
            });
            _this.fPanel = LOG.util.UIManager.initForm({
                frame: true,
                items: [_this.formRadios, _this.formFields],
                region: 'center',
                buttons: [
                    LOG.util.Prototipos.botonNuevo({
                        text: _this.idioma.textBtnNuevoSerie,
                        tooltip: _this.idioma.ttBtnNuevoSerie,
                        handler: function() {
                            _this.fPanel.getForm().reset();
                            _this.modelo.reset();
                            _this.modelo.idproducto = _this.producto.idproducto;
                            _this.modelo.idmovimiento = _this.producto.idmovimiento;
                        }
                    }),
                    _this.btnGuardarNroSerie
                ]
            });
            _this.modelo.bindForm(_this.fPanel);
            _this.modelo.addActionButton(_this.btnGuardarNroSerie);
            _this.getPanelSuperior().add(_this.fPanel);
            Ext.each(_this.fPanel.buttons, function(btn) {
                LOG.util.UIManager.applyKey(btn, _this.getPanelPrincipal());
            });
            _this.getPanelSuperior().autoHeight = true;
        });
    },
    /**
     * Devuelve el años de la fecha.
     * @param {String} fecha
     * @returns {String}
     */
    getYear: function(fecha) {
        return fecha.split('/')[2];
    }
});

/**
 * Plantilla para gestionar los numeros de serie salientes.
 * @type LOG.util.UITemplate
 */
LOG.lb.numeroserie.Salida = Ext.extend(LOG.lb.numeroserie.View, {
    /**
     * Determina si afecta la dicponibilidad del producto.
     * @type Boolean
     */
    afecta: true,
    /**
     * Determina si se realiza una devolucion de numeros de serie.
     * @type Boolean
     */
    devolucion: false,
    /**
     * Determina si puede adicionar numeros de serie ilimitadamente.
     * @type Boolean
     */
    sinlimite: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        LOG.lb.numeroserie.Salida.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes de numero de serie.
     * @returns {undefined}
     */
    init: function() {
        LOG.lb.numeroserie.Salida.superclass.init.call(this);
        this.panelDatos();
    },
    /**
     * Inicializa los botones del panel superior.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        LOG.lb.numeroserie.Salida.superclass.initDefaultButtons.call(this);
        var _this = this;

        this.insertToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.ttBtnAdicionarSerie,
            hidden: true,
            handler: function() {
                if (!_this.vistaProductos || !_this.vistaProductos.isVisible()) {
                    var _p = new LOG.lb.numeroserie.Ventana({
                        idestructura: _this.idestructura,
                        confubicacion: _this.confubicacion,
                        salida: true,
                        parametros: {
                            idproducto: _this.producto.idproducto,
                            iddocumento: _this.devolucion ? _this.documento.iddocumento : null,
                            idpadre: _this.devolucion ? _this.documento.idpadre : null,
                            salida: true,
                            existencia: _this.existencia || null
                        },
                        doAction: function(r) {
                            _this.adicionarNroSerie(r);
                        }
                    });
                    _p.init();
                    _this.vistaProductos = _p.view();
                    _this.vistaProductos.show();
                }
            },
            controlFn: function(b) {
                if (/*(_this.grantedAction('CT') || _this.grantedAction('RCRUD')) &&*/ _this.documento.estado == '1') {
                    b.show();
                }
            }
        }), 0);

        Ext.apply(this.listaBotones.getBy('btn', 'ayuda'), {
            id: 'idnumeroseriesalida'
        });
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    /**
     * 
     * @returns {undefined}
     */
    panelDatos: function() {
        var _this = this;
        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function() {
            var lbPrincipal, lbSecundario;
            if (_this.salida) {
                lbPrincipal = _this.idioma.lbTipoDoc;
                lbSecundario = _this.salida;
            } else {
                lbPrincipal = _this.idioma.lbTipoAjuste;
                lbSecundario = _this.ajuste;
            }
            _this.formFields = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            _this.formFields.addComponent({html: String.format("<b>{0}:</b> {1}", _this.idioma.lbNroDoc, (_this.documento.nrodoc || _this.documento.numeroref))});
            _this.formFields.addComponent({html: String.format("<b>{0}:</b> {1}", _this.idioma.lbFechaContable, _this.documento.fechacontable)});
            _this.formFields.addComponent({html: String.format("<b>{0}:</b> {1}", lbPrincipal, lbSecundario)});
            _this.fPanel = LOG.util.UIManager.initPanel({
                frame: true,
                items: [_this.formFields],
                region: 'center'
            });
            _this.getPanelSuperior().add(_this.fPanel);
            _this.getPanelSuperior().autoHeight = true;
        });
    },
    /**
     * 
     * @param {Array} records
     * @returns {undefined}
     */
    adicionarNroSerie: function(records) {
        var _this = this, series = Array();
        var diferencia = parseInt(this.producto.diferencia) > 0 ? parseInt(this.producto.diferencia) : parseInt(this.producto.disponible);
        var cantidad = parseInt(this.producto.pendiente || diferencia);
        if (this.producto.ordenado) {
            cantidad = parseFloat(this.producto.ordenado || cantidad) - parseFloat(this.producto.resto || 0);
        }
        if (cantidad < this.cantidad + records.length && !this.sinlimite) {
            mostrarMensaje(3, _this.idioma.msgAddMayorOrdenado);
            return;
        }
        Ext.each(records, function(item) {
            series.push({
                idnroserie: item.get('idnroserie'),
                idproducto: item.get('idproducto'),
                idmovimiento: _this.producto.idmovimiento
            });
        });
        this.modelo.salvar({
            data: series,
            salida: true,
            afecta: this.afecta || null
        });
    }
});


/**
 * Template que se muestra en el submayor de productos
 * @type LOG.util.UITemplate
 */
LOG.lb.numeroserie.Ventana = Ext.extend(LOG.util.UITemplate, {
    /**
     * Direccion de la clase controladora.
     * @type String
     */
    dirController: '/logistica/utiles/producto/index.php/numeroserie',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarNumeroserie',
    /**
     * Forma en la que se vizualiza el componente, 
     * default - Ext.Viewport
     * "panel" - Ext.Panel
     * "ventana" - Ext.Window
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se muestran los datos de marca y modelo.
     * @type Boolean
     */
    usarMarcaModelo: false,
    /**
     * Determina si se selecciona automaticamente el primer elemento.
     * @type Boolean
     */
    autoSelect: false,
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Determina si se muestra automaticamente la interfaz.
     * @type Boolean
     */
    autoShow: false,
    idGridPrincipal: 'idnroserie',
    /**
     * Datos de busqueda.
     * @type Object
     */
    parametros: {},
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.idioma = Ext.apply(LOG.lb.numeroserie.Idioma, LOG.util.Idioma.init());
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.concepto = config.idioma.lbConcepto;
        this.textBusquedaSimple = config.idioma.lbBuscar;
        this.modoSeleccion = (!config.formaVisualizacion || config.formaVisualizacion == 'ventana' ? 3 : 1);
        LOG.lb.numeroserie.Ventana.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes de numero de serie.
     * @returns {undefined}
     */
    init: function() {
        var _this = this;
        LOG.lb.numeroserie.Ventana.superclass.init.call(this);
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            title: this.idioma.tlNumeroserie,
            width: 900,
            height: 450,
            resizable: false,
            aceptarFn: function() {
                if (typeof _this.doAction == 'function') {
                    _this.doAction.createDelegate(_this, [_this.getSmPrincipal().getSelections()]).call();
                }
            }
        });
        this.initAvanzada();

    },
    /**
     * Configura los botones de la plantilla.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        if (this.formaVisualizacion == 'ventana') {
            this.getVistaPrincipal().listaBotones.getItem(1).hide();
            Ext.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
                disabled: true,
                controlFn: function(b, _caller) {
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'btnAceptar');
                }
            });
        }
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        this.addGridColumn({dataIndex: 'idnroserie'});
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idestructuraubicacion'});
        this.addGridColumn({dataIndex: 'idmarca'});
        this.addGridColumn({dataIndex: 'idmodelo'});
        this.addGridColumn({
            header: this.idioma.gcUbicacion,
            dataIndex: 'descripcion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcNumero,
            dataIndex: 'numero',
            width: 100,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcNroserie,
            dataIndex: 'nroserie',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcFechaFabricacion,
            dataIndex: 'annofabricacion',
            width: 130,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcAnno,
            dataIndex: 'annoconservacion',
            width: 130,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcTipo,
            dataIndex: 'tipoconservacion',
            width: 130,
            default: true
        });
        if (!this.salida) {
            this.addGridColumn({
                header: this.idioma.gcEstado,
                dataIndex: 'estado',
                width: 80,
                renderer: function(_v) {
                    return LOG.lb.numeroserie.Estado[_v];
                },
                default: true
            });
        }
        if (this.usarMarcaModelo) {
            this.addGridColumn({
                header: this.idioma.gcMarca,
                dataIndex: 'marca',
                width: 120,
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcModelo,
                dataIndex: 'modelo',
                width: 120,
                default: true
            });
            this.addGridColumn({
                header: this.idioma.gcNroPieza,
                dataIndex: 'nropieza',
                width: 100,
                default: true
            });
        }
    },
    /**
     * Renderiza los componente y reprograma los eventos.
     * @returns {Vista principal}
     */
    render: function() {
        var render = LOG.lb.numeroserie.Ventana.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            beforeload: function() {
                _this.parametros.idproducto = _this.idproducto || _this.parametros.idproducto;
                _this.parametros.existencia = _this.existencia || true;
                Ext.apply(this.initBaseParams, _this.parametros);
                if (_this.idestructuraUbic != _this.idestructura) {
                    _this.idestructuraUbic = _this.idestructura;
                    _this.cbUbicacion.setBaseNode({_node: _this.idestructura});
                }
                if (_this.idestructura != _this.idestructuraOld || _this.parametros.idproducto != _this.idproductoOld) {
                    _this.gridFilter.tfBusqueda.reset();
                    _this.panelBusquedaAvanzada.getForm().reset();
                    _this.annoFabricacion.getStore().load();
                    _this.annoConservacion.getStore().load();
                    _this.idestructuraOld = _this.idestructura;
                    _this.idproductoOld = _this.parametros.idproducto;
                }
            }
        });
        this.getStorePrincipal().load();
        if (this.formaVisualizacion == 'ventana') {
            this.getVistaPrincipal().listaBotones.each(function(b) {
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(this, [b, _this]).call();
                }
            }.createDelegate(this));
        }
        return render;
    },
    /**
     * Inicializa el panel de busqueda avanzada.
     * @returns {undefined}
     */
    initAvanzada: function() {
        var _this = this;
        this.getPanelBusqueda().setColumns(2);
        this.addFilterComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbNroserie,
            name: 'nroserie'
        }));
        this.annoFabricacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbTfFechaFabricacion,
            hiddenName: 'annofabricacion',
            url: '/logistica/utiles/producto/index.php/numeroserie/cargarAnnosNroSerie',
            displayField: 'denominacion',
            valueField: 'denominacion',
            autoLoad: false
        });
        this.annoFabricacion.getStore().on({
            beforeload: function() {
                Ext.apply(this.baseParams, {
                    tipo: 1,
                    idestructura: _this.idestructura || 0,
                    idproducto: _this.parametros.idproducto || 0
                });
            }
        });
        this.cbUbicacion = new LOG.util.TreeCombo({
            fieldLabel: this.idioma.lbCbUbicacion,
            name: 'idestructuraubicacion',
            url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
            node: this.idestructura || 0,
            selectOnlyLeaf: this.confubicacion
        });
        this.annoConservacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbTfAnno,
            name: 'annoconservacion',
            url: '/logistica/utiles/producto/index.php/numeroserie/cargarAnnosNroSerie',
            displayField: 'denominacion',
            valueField: 'denominacion',
            autoLoad: false
        });
        this.annoConservacion.getStore().on({
            beforeload: function() {
                Ext.apply(this.baseParams, {
                    tipo: 2,
                    idestructura: _this.idestructura || 0,
                    idproducto: _this.parametros.idproducto || 0
                });
            }
        });
        this.addFilterComponent(this.annoFabricacion);
        this.addFilterComponent(this.cbUbicacion);
        this.addFilterComponent(this.annoConservacion);
        this.addFilterComponent(new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbTipo,
            hiddenName: 'idconservacion',
            store: new Ext.data.Store({
                url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad',
                autoLoad: true,
                baseParams: {
                    modelo: 'NomConservacion',
                    idnom: 'idconservacion'
                },
                reader: new Ext.data.JsonReader({
                    id: 'idconservacion',
                    root: "datos",
                    fields: [
                        {name: 'idconservacion'},
                        {name: 'denominacion'}
                    ]
                })
            }),
            displayField: 'denominacion',
            valueField: 'idconservacion',
            autoLoad: true,
            editable: false
        }));
        /*if (!this.parametros.salida) {
            this.addFilterComponent(new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbEstado,
                hiddenName: 'estado',
                valueField: 'estado',
                displayField: 'destado',
                triggerAction: 'all',
                editable: false,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['estado', 'destado'],
                    data: [
                        [2, LOG.lb.numeroserie.Estado[2]],
                        [3, LOG.lb.numeroserie.Estado[3]]
                    ]
                })
            }));
        }*/
        if (this.usarMarcaModelo) {
            this.addFilterComponent(new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbMarca,
                hiddenName: 'idmarca',
                url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
                valueField: 'idmarca',
                displayField: 'denominacion'
            }));
            this.addFilterComponent(new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbCbModelo,
                hiddenName: 'idmodelo',
                url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
                valueField: 'idmodelo',
                displayField: 'denominacion'
            }));
            this.addFilterComponent(LOG.util.Prototipos.inputTexto({
                fieldLabel: this.idioma.lbTfNroPieza,
                name: 'nropieza'
            }));
        }
    }
});