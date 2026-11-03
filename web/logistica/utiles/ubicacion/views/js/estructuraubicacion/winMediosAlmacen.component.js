Ext.ns('Ext.erp');
/**
 * @type LOG.util.Window
 */
Ext.erp.winMediosAlmacen = Ext.extend(LOG.util.Window, {
    cargado: 0,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        Ext.apply(config, {
            closeAction: 'destroy',
            usarAplicar: !config.parent.modificar,
            title: !config.parent.modificar ? config.parent.idioma.lbTitVentAddArea : config.parent.idioma.lbTitVentUpdArea,
            height: config.parent.modificar ? 325 : 360,
            width: 500
        });
        this.modelo = new Ext.erp.winMediosAlmacen.Model({
            idioma: config.parent.idioma
        });
        Ext.erp.winMediosAlmacen.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa el componente.
     * @returns {undefined}
     */
    initComponent: function() {
        this.initPanelDatos();
        Ext.erp.winMediosAlmacen.superclass.initComponent.call(this);
        this.modelo.addActionButton(this.listaBotones.getItem(1));
        this.modelo.addActionButton(this.listaBotones.getItem(2));
    },
    /**
     * Inicializa campos de entrada de datos.
     * @returns {undefined}
     */
    initPanelDatos: function() {
        var _this = this;
        // Etiqueta informativa (tipo de formato).
        this.lbFormato = new Ext.form.Label({text: this.parent.idioma.lbCmbFormato + ': -'});
        
        this.cbFormato = new LOG.util.ComboBox({
            fieldLabel: this.parent.idioma.lbCmbFormato,
            hiddenName: 'idformato',
            valueField: 'idformato',
            displayField: 'nombre',
            store: this.parent.stFormato,
            autoCreate: true,
            allowBlank: false,
            lazyRender: true,
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            emptyText: this.parent.idioma.lbTxtSelect,
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{nombre}</div></tpl>',
            listeners: {
                select: function(_cb, _r, _i) {
                    var formato = '';
                    var pos = _this.modelo.nivel = (_this.parent.modificar ? _this.parent.posicionArbol -1 : _this.parent.posicionArbol);
                    var ultimoNodo = (_this.parent.modificar && _this.parent.tpEstructuras.getSelectionModel().selNode.attributes.ultimonivel) 
                        || (!_this.parent.modificar && _this.parent.tpEstructuras.getSelectionModel().selNode.attributes.nivel == _r.data.partes.length - 1);
                    _this.cbTipoUbicacion.setVisible(_r.data.partes.length == 1 || _this.parent.estructuraTotal || ultimoNodo);
                    _this.cbTipoUbicacion.setDisabled((_r.data.partes.length != 1 && !_this.parent.estructuraTotal && !ultimoNodo));
                    for (var i = 0; i < _r.data.partes.length; i++) {
                        formato += '' + _r.data.partes[i].nombre;
                        if (i < _r.data.partes.length - 1) {
                            formato += ', ';
                        }
                        if (_r.data.partes[i].nivel == pos) {
                            _this.nfCodigo.minLength = _this.nfCodigo.maxLength = _r.data.partes[i].longitud;
                            _this.nfCodigo.minLengthText = _this.nfCodigo.maxLengthText = _this.parent.idioma.lbMaxLengthCodigo.replace('_', _r.data.partes[i].longitud);
                        }
                    }
                    _this.lbFormato.setText(_this.parent.idioma.lbCmbFormato + ': ' + formato);
                    _this.nfCodigo.enable();
                    _this.tpUbicacion.doLayout();
                    _this.doLayout();
                }
            }
        });
        
        this.cbTipoArea = new Ext.erp.comboNomenclador({
            fieldLabel: this.parent.idioma.lbCmbTipoArea,
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTipoarea',
            idnom: 'idnomtipoarea',
            hiddenName: 'idnomtipoarea',
            allowBlank: false,
            editable: false,
            emptyText: this.parent.idioma.lbTxtSelect
        });
        this.cbTipoArea.getStore().on({
            load: function() {
                _this.cargado++;
                if (_this.cargado == 2) {
                    _this.cargarDatos();
                }
            }
        });
        this.cbTipoArea.getStore().load();
        
        this.nfCodigo = LOG.util.Prototipos.inputTexto({
            fieldLabel: this.parent.idioma.lbCmbCodigo,
            name: 'codigo',
            maskRe: /^[0-9]/,
            regex: LOG.util.Regex.codigo,
            regexText: this.parent.idioma.lbRegexCodigoText,
            allowBlank: false,
            disabled: true
        });
        
        this.cbTipoUbicacion = new Ext.erp.comboNomenclador({
            fieldLabel: this.parent.idioma.lbCmbTipoUbicacion,
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTipoubicacion',
            bussines: 'NomTipoubicModel',
            idnom: 'idtipoubicacion',
            hiddenName: 'idtipoubicacion',
            hidden: !this.mostrarTipoUbicacion,
            allowBlank: false,
            editable: false,
            emptyText: this.parent.idioma.lbTxtSelect,
            listeners: {
                select: function (_cb, _r, _i, _o) {
                    if ((_this.parent.estructuraTotal || _this.parent.nodoSeleccionadoArbol.attributes.ultimonivel) 
                        && (_r.json.peso == '1' || _r.json.capacidad == '1' || _r.json.volumen == '1' || _r.json.um == '1' || _r.json.producto == '1')) {
                        _this.tabPanel.unhideTabStripItem(1);
                    } else {
                        _this.tabPanel.hideTabStripItem(1);
                    }
                    _this.habilitarCamposTab(_r.json, (parseInt(_this.parent.nodoSeleccionadoArbol.attributes.leaf) == 0 && _this.parent.modificar));
                    Ext.each(_this.tpUbicacion.find('campo', true), function(item) {
                        if (_o) {
                            item.reset();
                        } else {
                            item.setValue(null);
                            _this.modelo[item.getName()] = null;
                        }
                    });
                },
                blur: function() {
                    if (!this.getValue()) {
                        _this.tabPanel.hideTabStripItem(1);
                    }
                }
            }
        });
        this.cbTipoUbicacion.getStore().on({
            load: function() {
                _this.cargado++;
                if(_this.cargado == 2) {
                    _this.cargarDatos();
                }
            }
        });
        this.cbTipoUbicacion.getStore().load();
        
        this.taDescripcion = new Ext.form.TextArea({
            fieldLabel: this.parent.idioma.lbCmbDescripcion,
            name: 'descripcion',
            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+([-_/.\s]{0,1}[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)+$/,
            regexText: this.parent.idioma.lbRegexDescripText,
            allowBlank: false,
            anchor: '100%',
            height: 50,
            minLength: 1,
            maxLength: 255,
            maxLengthText: this.parent.idioma.lbMsgMaxLongDescripcion,
            minLengthText: this.parent.idioma.lbMsgMinLongDescripcion
        });
        
        
        this.panelDescripcion = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            region: 'south',
            items: [this.taDescripcion]
        });
        
        this.panelDatosArea = new LOG.util.ColumnForm({});
        this.panelDatosArea.addComponent(this.cbFormato);
        this.panelDatosArea.addComponent(this.cbTipoArea);
        this.panelDatosArea.addComponent(this.nfCodigo);
        this.panelDatosArea.addComponent(this.cbTipoUbicacion);
        
        this.tpArea = LOG.util.UIManager.initPanel({
            title: this.parent.idioma.tabArea,
            frame: true,
            autoHeight: true,
            items: [this.lbFormato, this.panelDatosArea, this.panelDescripcion]
        });
        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.tpArea, this.initTabUbicacion()],
            listeners: {
                render: function() {
                    this.hideTabStripItem(1);
                }
            }
        });
        this.formularioDatos = LOG.util.UIManager.initForm({
            region: 'center',
            frame: true,
            trackResetOnLoad: true,
            labelAlign: 'top',
            items: [this.tabPanel]
        });
        this.modelo.bindForm(this.formularioDatos);
        this.items = [this.formularioDatos];
        this.tabPanel.doLayout();
        this.doLayout();
    },
    /**
     * 
     * @returns {undefined}
     */
    initTabUbicacion: function() {
        var _this = this;
        this.panelDatosUbicacion = new LOG.util.ColumnForm({});
        
        this.nfCapacidad = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.parent.idioma.lbCapacidad,
            name: 'capacidad',
            allowBlank: false,
            disabled: true,
            campo: true,
            validator: function(_v) {
                return parseFloat(_v) > 0;
            }
        });
        this.panelDatosUbicacion.addComponent(this.nfCapacidad);

        this.cbUnidadMedida = new LOG.util.TreeCombo({
            fieldLabel: this.parent.idioma.hdUMProd,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarArlboUM',
            hiddenName: 'idunidadmedida',
            valueField: 'idum',
            displayField: 'um',
            selectOnlyLeaf: true,
            allowBlank: false,
            disabled: true,
            campo: true
        });
        this.panelDatosUbicacion.addComponent(this.cbUnidadMedida);

        this.nfPeso = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.parent.idioma.lbPeso,
            name: 'peso',
            allowBlank: false,
            disabled: true,
            campo: true,
            validator: function(_v) {
                return parseFloat(_v) > 0;
            }
        });
        this.panelDatosUbicacion.addComponent(this.nfPeso);

        this.nfProducto = LOG.util.Prototipos.inputTexto({
            fieldLabel: this.parent.idioma.lbProducto,
            name: 'denomproducto',
            allowBlank: false,
            disabled: true,
            campo: true,
            listeners: {
                focus: function() {
                    var obj = this;
                    LOG.inv.maestroproductos.Loader.init(function() {
                        var v = new LOG.lb.maestroproductos.UIProductos({
                            tipo: 1,
                            modoSeleccion: 1,
                            doAction: function(r) {
                                obj.setValue(r[0].data.denominacion);
                                _this.modelo.idproducto = obj.idproducto = r[0].data.idindicador;
                                obj.fireEvent('blur', obj);
                            }
                        });
                        v.show();
                    });
                }
            }
        });
        this.panelDatosUbicacion.addComponent(this.nfProducto);

        this.nfAlto = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.parent.idioma.lbAlto,
            name: 'alto',
            allowBlank: false,
            disabled: true,
            campo: true,
            validator: function(_v) {
                return parseFloat(_v) > 0;
            }
        });
        this.panelDatosUbicacion.addComponent(this.nfAlto);
        this.nfAncho = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.parent.idioma.lbAncho,
            name: 'ancho',
            allowBlank: false,
            disabled: true,
            campo: true,
            validator: function(_v) {
                return parseFloat(_v) > 0;
            }
        });
        this.panelDatosUbicacion.addComponent(this.nfAncho);
        this.nfLargo = LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.parent.idioma.lbLargo,
            name: 'largo',
            allowBlank: false,
            disabled: true,
            campo: true,
            validator: function(_v) {
                return parseFloat(_v) > 0;
            }
        });
        this.panelDatosUbicacion.addComponent(this.nfLargo);

        this.tpUbicacion = LOG.util.UIManager.initPanel({
            title: this.parent.idioma.lbDatosUbicacion,
            frame: true,
            region: 'center',
            autoHeight: true,
            items: [this.panelDatosUbicacion]
        });
        return this.tpUbicacion;
    },
    /**
     * Habilita o deshabilita los campos del tab de ubicacion.
     * @param {Object} datos
     * @param {Boolean} deshabilitar [Opcional] Deshabilita todos los campos.
     * @returns {undefined}
     */
    habilitarCamposTab: function(datos, deshabilitar) {
        this.nfCapacidad.setDisabled(datos.capacidad != '1' || deshabilitar);
        this.nfCapacidad.setVisible(datos.capacidad == '1');
        this.cbUnidadMedida.setDisabled(datos.um != '1' || deshabilitar);
        this.cbUnidadMedida.setVisible(datos.um == '1');
        this.nfPeso.setDisabled(datos.peso != '1' || deshabilitar);
        this.nfPeso.setVisible(datos.peso == '1');
        this.nfProducto.setDisabled(datos.producto != '1' || deshabilitar);
        this.nfProducto.setVisible(datos.producto == '1');
        this.nfAlto.setDisabled(datos.volumen != '1' || deshabilitar);
        this.nfAlto.setVisible(datos.volumen == '1');
        this.nfAncho.setDisabled(datos.volumen != '1' || deshabilitar);
        this.nfAncho.setVisible(datos.volumen == '1');
        this.nfLargo.setDisabled(datos.volumen != '1' || deshabilitar);
        this.nfLargo.setVisible(datos.volumen == '1');
    },
    /**
     * @returns {undefined}
     */
    cargarDatos: function() {
        if (this.parent.modificar) {
            var _this = this;
            this.modelo.cargaInicial({
                url: '/logistica/utiles/ubicacion/index.php/estructuraubicacion/obtenerEstructura',
                id: this.parent.nodoSeleccionadoArbol.attributes.id
            }, function(r) {
                var record = {};
                Ext.apply(record, r[0][0]);
                _this.formularioDatos.getForm().loadRecord({data: record});
                Ext.apply(_this.modelo, record);
                _this.cbFormato.fireEvent('select', _this.cmbFormato, _this.cbFormato.getStore().getById(_this.cbFormato.getValue()));
                _this.cbTipoUbicacion.fireEvent('select', _this.cbTipoUbicacion, _this.cbTipoUbicacion.getStore().getById(record.idtipoubicacion), _this.cbTipoUbicacion.getStore().indexOfId(record.idtipoubicacion), true);
                _this.cbUnidadMedida.setValue(r[0][0].umedida);
                _this.modelo.idunidadmedida = _this.cbUnidadMedida.idSeleccionado = r[0][0].idunidadmedida;
                _this.modelo.idproducto = _this.nfProducto.idproducto = r[0][0].idproducto;
                _this.nfCodigo.enable();
                if (record.tieneHijos || _this.parent.posicionArbol > 2) {
                    _this.cbFormato.disable();
                    _this.cbTipoArea.disable();
                    _this.cbTipoUbicacion.disable();
                }
                if (record.tieneHijos) {
                    _this.nfCapacidad.disable();
                    _this.nfAlto.disable();
                    _this.nfAncho.disable();
                    _this.nfLargo.disable();
                    _this.nfPeso.disable();
                    _this.cbUnidadMedida.disable();
                    _this.nfProducto.disable();

                }
            });
        } else if (this.long_cod) {
            this.nfCodigo.minLength = this.nfCodigo.maxLength = this.long_cod;
            this.nfCodigo.minLengthText = this.nfCodigo.maxLengthText = this.parent.idioma.lbMaxLengthCodigo.replace('_', this.long_cod);
            this.modelo.idpadre = this.parent.tpEstructuras.getSelectionModel().selNode.attributes.id;
            this.modelo.idarea = this.parent.tpEstructuras.getSelectionModel().selNode.attributes.idarea;
            this.modelo.idnomtipoarea = this.parent.tpEstructuras.getSelectionModel().selNode.attributes.idnomtipoarea;
            this.cbFormato.setValue(this.parent.tpEstructuras.getSelectionModel().selNode.attributes.idformato);
            this.cbFormato.disable();
            this.cbFormato.fireEvent('select', this.cmbFormato, this.cbFormato.getStore().getById(this.cbFormato.getValue()));
            this.cbTipoArea.setValue(this.parent.tpEstructuras.getSelectionModel().selNode.attributes.idnomtipoarea);
            this.cbTipoArea.disable();
            this.cbTipoUbicacion.setValue(this.parent.tpEstructuras.getSelectionModel().selNode.attributes.idtipoubicacion);
            this.cbTipoUbicacion.disable();
            this.cbTipoUbicacion.fireEvent('select', this.cbTipoUbicacion, this.cbTipoUbicacion.getStore().getById(this.cbTipoUbicacion.getValue()), this.cbTipoUbicacion.getStore().indexOfId(this.cbTipoUbicacion.getValue()), true);
        } else {
            this.modelo.idestructuracomun = this.parent.tpEstructuras.getSelectionModel().selNode.attributes.id;
        }
    },
    /**
     * @returns {undefined}
     */
    aceptarFn: function() {
        var _this = this;
        this.modelo.salvar({}, function() {
            if (_this.parent.posicionArbol == 1) {
                _this.formularioDatos.getForm().reset();
            } else {
                _this.nfCodigo.setValue(null);
                _this.taDescripcion.setValue(null);
                _this.modelo.idproducto = _this.nfProducto.idproducto = null;
                Ext.each(_this.tpUbicacion.find('campo', true), function(item) {
                    item.setValue(null);
                    _this.modelo[item.getName()] = null;
                });
            }
            var idnode = _this.parent.nodoSeleccionadoArbol.id;
            _this.parent.treeLoader.load(_this.parent.nodoSeleccionadoArbol.parentNode, function(parentNode) {
                parentNode.expand();
                _this.parent.nodoSeleccionadoArbol = _this.parent.tpEstructuras.getNodeById(idnode);
                _this.parent.tpEstructuras.fireEvent('click', _this.parent.nodoSeleccionadoArbol);
                _this.parent.tpEstructuras.getSelectionModel().select(_this.parent.nodoSeleccionadoArbol);
                _this.parent.treeLoader.load(_this.parent.nodoSeleccionadoArbol, function() {
                    _this.parent.nodoSeleccionadoArbol.expand();
                });
            });
        }, function(r) {
            switch (r.codError) {
                case 2:
                    mostrarMensaje(3, _this.parent.idioma.lbAreaDuplicada);
                    break;
                case 3:
                    mostrarMensaje(3, _this.parent.idioma.lbMsgVolumenError);
                    break;
                case 4:
                    mostrarMensaje(3, _this.parent.idioma.lbMsgPesoError);
                    break;
                case 5:
                    mostrarMensaje(3, _this.parent.idioma.lbMsgCapacidadError);
                    break;
                case 6:
                    mostrarMensaje(3, _this.parent.idioma.lbEstructuraDuplicada);
                    break;
            }
        }, this.parent.modificar);
    }
});


/**
 * @type LOG.util.Model
 */
Ext.erp.winMediosAlmacen.Model = Ext.extend(LOG.util.Model, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.urlController = '/logistica/utiles/ubicacion/index.php/estructuraubicacion/';
        config.urlAccionGuardar = 'adicionarEstructura';
        config.fields = [{
                name: 'idestructuraubicacion',
                primary: true
            },
            {name: 'idarea'},
            {name: 'idpadre'},
            {name: 'idestructuracomun'},
            {name: 'idformato'},
            {name: 'idnomtipoarea'},
            {name: 'idtipoubicacion'},
            {name: 'idproducto'},
            {name: 'idunidadmedida'},
            {name: 'codigo'},
            {name: 'descripcion'},
            {name: 'largo'},
            {name: 'ancho'},
            {name: 'alto'},
            {name: 'capacidad'},
            {name: 'peso'},
            {name: 'nivel'},
            {name: 'dimensiones'}
        ];
        Ext.erp.winMediosAlmacen.Model.superclass.constructor.call(this, config);
    },
    /**
     * 
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvar: function(parametros, _fn, _fnFail, modificar) {
        if (this.isValid()) {
            var _this = this;
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(objSubmit.data || this.encode());

            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        mostrarMensaje(1, modificar ? _this.idioma.msgModificarOk : _this.idioma.msgAdicionarOk);
                        if (this.st) {
                            this.st.reload();
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnFail == 'function') {
                            _fnFail.createDelegate(this, [resp]).call();
                        }
                    }
                    this.setDefaulFormValues();
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    },
    /**
     * 
     * @param {Object} obj
     * @returns {Object}
     */
    encode: function(obj) {
        obj = obj || this;
        var objTemp = {};
        for (var property in obj) {
            if (typeof obj[property] != 'function' && this.keys.indexOf(property) == -1) {
                if (!(!obj[property] && (property == 'idestructuracomun' || property == 'idpadre'))) {
                    objTemp[property] = obj[property];
                }
            }
        }
        return objTemp;
    }
});