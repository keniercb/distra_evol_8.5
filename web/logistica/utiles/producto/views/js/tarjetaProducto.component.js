Ext.ns('LOG.lb.producto');
LOG.lb.producto.Tarjeta = Ext.extend(LOG.lb.producto.View, {
    singleSelect: false,
    idGridPrincipal: 'idindicador',
    inputCantidad: undefined,
    autoExpand: false,
    autoLoad: false,
    mostrarCategoria: false,
    /**
     * 
     * @param {type} config
     * @returns {undefined}
     * 
     */
    constructor: function(config) {
        LOG.lb.producto.Tarjeta.superclass.constructor.call(this, config);
        this.panelBotonesVisible = true;
        this.urlBusquedaGridPrincipal = 'cargarGridClasificador';
        this.parametros = {
            tipo: 1,
            almacenado: 1,
            estado : 1

        };
        this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
    },
    columnaCategoria: function() {
        return false;
    },
    /**
     * 
     * @returns {undefined}
     */
    init: function() {
        LOG.lb.producto.Tarjeta.superclass.init.call(this);
        var _this = this;
        this.busquedaAvanzada = false;
        this.listaColumnas.getItem(2).width = 350;
        this.listaColumnas.getItem(1).width = 90;
        this.getVistaPrincipal().setTitle(this.idioma.hdProductos);
        this.tabTarjeta = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            height: 200,
            enableTabScroll: true,
            minTabWidth: 135,
            tabWidth: 210,
            layoutOnTabChange: true,
            listeners: {
                render: function() {
                    this.hideTabStripItem(1);
                }
            }
        });
        var pDatosGenerales = LOG.util.UIManager.initColumnForm({
            columnas: 4,
            frame: true,
            title: this.idioma.tDatosGenerales,
            autoScroll: true
        });
        pDatosGenerales.addComponent(this.tMinimo = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.lbNfMinimo,
            name: 'minimo',
            allowBlank: true
        }));
        pDatosGenerales.addComponent(this.tMaximo = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.lbNfMaximo,
            name: 'maximo',
            allowBlank: true
        }));
        this.inputCantidad = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.lbNfCantidad,
            name: 'cantidad',
            allowBlank: true
        });
        if ((typeof usarCantidad == 'undefined' || usarCantidad == false)) {
            pDatosGenerales.addComponent(this.inputCantidad);
        }
        this.nfPrecio = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.lbNfPrecio + ' ' + codContable,
            name: 'preciocontable',
            allowBlank: false
        });
        this.nfPrecioAlt = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.lbNfPrecio + ' ' + codAlternativa,
            name: 'precioalternativo',
            allowBlank: false
        });
        pDatosGenerales.addComponent(this.nfPrecio);
        if (alternativa) {
            pDatosGenerales.addComponent(this.nfPrecioAlt);
        }
        var cbcategoria = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomCategoriasproducto',
            idnom: 'idcategoria',
            name: 'categoria',
            autoCargar: true,
            allowBlank: false,
            fieldLabel: this.idioma.lbCbCategoria,
        });
        if ((typeof usarCategoria !== 'undefined' && usarCategoria == true)) {
            pDatosGenerales.addComponent(cbcategoria);
        }

        this.comboUM = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarComboUM',
            valueField: 'idunidadmedida',
            name: 'idunidadmedida',
            selectOnlyLeaf: true,
            //id: this.idCmp + '_um',
            displayField: 'abreviaturaunidadmedida',
            fieldLabel: 'Unidad de medida',
            allowBlank: false,
            autoLoad: false
        });
        this.comboUM.getStore().on({
            beforeload: function() {
                _this.comboUM.reset();
                _this.comboUM.getStore().removeAll();
                if (_this.getSmPrincipal().hasSelection()) {
                    this.baseParams.idindicador = _this.getSmPrincipal().getSelected().data.idindicador;
                }
            },
            load: function() {
                if (_this.getSmPrincipal().hasSelection()) {
                    _this.comboUM.setRawValue(_this.getSmPrincipal().getSelected().data.umedida);
                }
                _this.comboUM.fireEvent('select');
            }
        });
        pDatosGenerales.addComponent(this.comboUM);
        this.nomClasificacioncontablelog = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomClasificacioncontablelog',
            idnom: 'idclasificacioncontable',
            name: 'denominacion',
            autoCargar: true,
            allowBlank: false,
            fieldLabel: this.idioma.lbClasificacion
        });
        pDatosGenerales.addComponent( this.nomClasificacioncontablelog);

        pDatosGenerales.addComponent(new LOG.util.ComboBox({
            url: 'obtenerElementos',
            name: 'idelementogasto',
            valueField: 'idelementoobjeto',
            displayField: 'descripcion',
            autoLoad: true,
            allowBlank: true,
            autoSelect: false,
            descField: 'desc',
            fieldLabel: 'Elemento de gasto',
            selectOnFocus: true,
            forceSelection: true,
            mode: 'local',
            minChars: 0,
            listWidth: 300,
            //pageSize: 20,
            isCombo: true
        }));
        pDatosGenerales.addComponent(new LOG.util.ComboBox({
            url: 'obtenerElementos',
            name: 'idelementogastoalt',
            valueField: 'idelementoobjeto',
            displayField: 'descripcion',
            allowBlank: true,
            autoLoad: true,
            autoSelect: false,
            descField: 'desc',
            fieldLabel: 'Elemento de gasto alternativo',
            selectOnFocus: true,
            forceSelection: true,
            mode: 'local',
            minChars: 0,
            listWidth: 300,
            //pageSize: 20,
            isCombo: true
        }));

        this.fechaFabricacion = new Ext.form.DateField({
            fieldLabel: this.idioma.cgFechaFabricacion,
            name: 'fechafabricacion',
            disabled: true,
            vtype: 'daterange',
            editable: false

        });
        this.fechaVencimiento = new Ext.form.DateField({
            fieldLabel: this.idioma.cgFechaVencimiento,
            name: 'fechavencimiento',
            disabled: true,
            vtype: 'daterange',
            editable: false

        });
        this.fechaFabricacion.endDateField = this.fechaVencimiento.id;
        this.fechaVencimiento.startDateField = this.fechaFabricacion.id;
        pDatosGenerales.addComponent(this.fechaFabricacion);
        pDatosGenerales.addComponent(this.fechaVencimiento);

        if (farmacia == 1) {
            this.nfNroLote = LOG.util.Prototipos.inputTexto({
                fieldLabel: 'Nº. lote',
                name: 'numerolote',
                disabled: true,
                allowBlank: false
            });

            this.fechaVencimientoLote = new Ext.form.DateField({
                fieldLabel: this.idioma.cgFechaVencimiento+' lote',
                name: 'fechavencelote',
                disabled: true,
                editable: false,
                allowBlank: false
            });
            pDatosGenerales.addComponent(this.nfNroLote);
            pDatosGenerales.addComponent(this.fechaVencimientoLote);
        }

        cbcategoria.getStore().on({
            'load': function(st, rd) {
                Ext.each(rd, function(rec, index) {
                    if (rec.json.pordefecto == 1) {
                        cbcategoria.setValue(rec.json.idcategoria);
                        cbcategoria.fireEvent('select');
                    }
                });
            }
        });
        this.tabTarjeta.add(pDatosGenerales).show();
        this.fpTarjeta = LOG.util.UIManager.initForm({
            region: 'south',
            height: 180,
            layout: 'border',
            frame: true,
            split: true,
            collapsible: true,
            labelAlign: 'top',
            items: [this.tabTarjeta]
        });
        this.modelo = new LOG.lb.producto.Model({
            form: this.fpTarjeta,
            idioma: this.idioma
        });
        var cbEspecialidad;
        this.insertToolbarButton(cbEspecialidad = new LOG.util.ComboBox({
            width: 200,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarEspecialidad?restringir=0',
            valueField: 'idespecialidad',
            displayField: 'denespecialidad',
            emptyText: 'S/D',
            listeners: {
                scope: this,
                'select': function(field, record, index) {
                    var params = this.storePrincipal.lastOptions.params || {};
                    params.start = 0;
                    this.storePrincipal.initBaseParams.idEspecialidad = record.id;
                    params.idEspecialidad = record.id;
                    field.blur();
                    this.storePrincipal.load({params: params});
                }
            }
        }), 1);
        cbEspecialidad.getStore().on({
            'load': function(st, rd) {
                var params = {};
                params.start = 0;
                var esta = false;
                Ext.each(rd, function(rec) {
                    if (rec.data.idespecialidad == idEspecialidad) {
                        esta = true;
                        return;
                    }
                });
                if (!esta) {
                    idEspecialidad = rd[0].data.idespecialidad;
                }
                _this.storePrincipal.initBaseParams.idEspecialidad = idEspecialidad;
                params.idEspecialidad = idEspecialidad;
                cbEspecialidad.setValue(idEspecialidad);
                _this.storePrincipal.load({params: params});
            }
        });
        this.insertToolbarButton('-', 1);
        this.insertToolbarButton(this.idioma.cgEspecialidad, 1);
        this.modelo.addActionButton(this.getVistaPrincipal().listaBotones.getItem(1));
        this.modelo.addActionButton(this.getVistaPrincipal().listaBotones.getItem(2));
        this.getVistaPrincipal().add(this.fpTarjeta);

    },
    render: function() {
        var vista = LOG.lb.producto.Tarjeta.superclass.render.call(this);
        if (this.idProducto != undefined) {
            vista.setSize(950, 280);
        }
        return vista;
    },
    getPanelContenido: function() {
        return this.idProducto != undefined ? LOG.util.UIManager.initPanel({
            layout: 'fit',
            split: true,
            region: 'center',
            items: [this.fpTarjeta]
        }) : this.getPanelGrid();
    },
    /**
     * 
     * @returns {undefined}
     */
    show: function() {
        this.init();
        var vistaProductos = this.view();
        this.modelo.bindGridPanel(this._parent.winGestionarDocumento.gridDetalles);
        this.getGridPrincipal().getSelectionModel().sigleSelect = true;
        if (this.idProducto != undefined) {
            vistaProductos.getButton(1).setVisible(false);
        }
        this.ocultarColumna('cantidad', true);
        this.ocultarColumna('disponible', true);
        this.ocultarColumna('nomcategoria', true);
        this.ocultarColumna('existencia', true);
        vistaProductos.show();
    },
    /**
     * 
     * @returns {undefined}
     */
    habilitarBotones: function() {
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            if (this.getGridPrincipal().getSelectionModel().getCount() > 1) {
                this.fpTarjeta.disable();
                this.getVistaPrincipal().listaBotones.getItem(1).enable();
                this.getVistaPrincipal().listaBotones.getItem(2).enable();
                return;
            }
            this.fpTarjeta.enable();
            if (this.modelo.isValid()) {
                this.getVistaPrincipal().listaBotones.getItem(1).enable();
                this.getVistaPrincipal().listaBotones.getItem(2).enable();
            }
            var record = this.getGridPrincipal().getSelectionModel().getSelected();
            if (record.data.tienelote == 1 || record.data.equipo == 1 || record.data.municion == 1) {
                this.inputCantidad.disable();
                this.inputCantidad.setValue(0);
                //this.fechaFabricacion.disable();
                //this.fechaVencimiento.disable();
            } else {
                this.inputCantidad.enable();
                //this.fechaFabricacion.enable();
                //this.fechaVencimiento.enable();
            }
			this.fechaFabricacion.disable();
            this.fechaVencimiento.disable();
        }
    },
    /**
     * 
     * @param {type} r
     * @returns {undefined}
     */
    doAction: function(r) {
        var _this = this;
        var params = {
            idestructura: this._parent.idDeposito, iddocumento: this._parent.modelo.iddocumento
        };
        _this.modelo.idindicador = r[0].id;
        if (r.length > 1) {
            params.arridindicador = new Array();
            Ext.each(r, function(rec) {
                rec.data.idestructura = params.idestructura;
                rec.data.iddocumento = params.iddocumento;
                params.arridindicador.push(rec.data);
            });
            params.arridindicador = Ext.encode(params.arridindicador);
        }
        if (params.iddocumento) {
            this.modelo.salvar(params, function() {
                _this.modelo.reset();
            });
        } else {
            this._parent.modelo.salvar({
                tarjeta: Ext.encode(_this.modelo.encode()),
                idestructuracomun: this._parent.idDeposito,
                arridindicador: params.arridindicador
            }, function(r) {
                _this.postSalvar.createDelegate(_this, [r]).call();
                _this.modelo.reset();
            });
        }
    },
    /**
     * @param {Object} r
     * @returns {undefined}
     */
    postSalvar: function(r) {
        var _scope = this._parent.winGestionarDocumento;
        _scope.cargarProductos();
        if (_scope.record == null) {
            _scope.record = {};
            Ext.apply(_scope.record, {
                data: {
                    iddocumento: r.iddocumento,
                    estado: "1"
                }
            });

        } else {
            _scope.record.data.estado = "1";
        }
        _scope.getTitleDocumento(r.iddocumento);
        _scope.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);
    },
    onShowHandler: function() {
        LOG.lb.producto.Tarjeta.superclass.onShowHandler.call(this);
        var _this = this;
        this.getGridPrincipal().getSelectionModel().on({
            'rowselect': function(sm, idx, rec) {
                _this.comboUM.idSeleccionado = rec.data.idumedida;
                _this.modelo.idunidadmedida = rec.data.idumedida;
                _this.modelo.idumedida = rec.data.idumedida;
                _this.comboUM.getStore().load();
                _this.modelo.minimo = 0;
                _this.modelo.maximo = 0;
                _this.nfPrecio.setValue(rec.data.precio);
                _this.tMaximo.setValue(0);
                _this.tMinimo.setValue(0);
                _this.tMinimo.fireEvent('keyup');
                _this.tMinimo.fireEvent('keyup');
                _this.nfPrecio.fireEvent('keyup');
                if (!_this.modelo.isValid()) {
                    _this.modelo.habilitarBotones();
                }
                if (farmacia == 1) {
                    if (rec.json.naturalezalote == 1) {
                        _this.nfNroLote.allowBlank = false;
                        _this.fechaVencimientoLote.allowBlank = false;
                        _this.nfNroLote.enable();
                        _this.fechaVencimientoLote.enable();
                    } else {
                        _this.nfNroLote.allowBlank = true;
                        _this.fechaVencimientoLote.allowBlank = true;
                        _this.nfNroLote.reset();
                        _this.fechaVencimientoLote.reset();
                        _this.nfNroLote.disable();
                        _this.fechaVencimientoLote.disable();
                    }
                }
            }
        });
    }
});