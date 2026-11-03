Ext.ns('Ext.erp');
/**
 * @type LOG.util.Window
 */
Ext.erp.winAreaResponsabilidad = Ext.extend(LOG.util.Window, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        Ext.apply(config, {
            closeAction: 'destroy',
            usarAplicar: !config.parent.modificar,
            title: !config.parent.modificar ? config.parent.idioma.lbTitVentAddEstructura : config.parent.idioma.lbTitVentUpdEstructura,
            height: 200,
            width: 360
        });
        this.modelo = new Ext.erp.winAreaResponsabilidad.Model({
            idioma: config.parent.idioma
        });
        Ext.erp.winAreaResponsabilidad.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.initPanelDatos();
        Ext.erp.winAreaResponsabilidad.superclass.initComponent.call(this);
        this.modelo.addActionButton(this.listaBotones.getItem(1));
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.cargarDatos();
    },
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
                    _this.doLayout();
                }
            }
        });
        
        this.nfCodigo = LOG.util.Prototipos.inputEntero({
            fieldLabel: this.parent.idioma.lbCmbCodigo,
            name: 'codigo',
            regex: LOG.util.Regex.cadena,
//            regexText: this.parent.idioma.lbRegexCodigoText,
            allowBlank: false,
            disabled: true
        });
        
        this.panelDatosAreaR = new LOG.util.ColumnForm({});
        this.panelDatosAreaR.addComponent(this.cbFormato);
        this.panelDatosAreaR.addComponent(this.nfCodigo);
        
        this.taDescripcion = new Ext.form.TextArea({
            fieldLabel: this.parent.idioma.lbCmbDescripcion,
            name: 'descripcion',
            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+([-_/.\s]{0,1}[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)+$/,
            regexText: this.parent.idioma.lbRegexDescripText,
            allowBlank: false,
            anchor: '99%',
            height: 30,
            minLength: 1,
            maxLength: 255,
            maxLengthText: this.parent.idioma.lbMsgMaxLongDescripcion,
            minLengthText: this.parent.idioma.lbMsgMinLongDescripcion
        });
        
        this.formularioDatos = LOG.util.UIManager.initForm({
            region: 'center',
            frame: true,
            trackResetOnLoad: true,
            labelAlign: 'top',
            items: [this.lbFormato, this.panelDatosAreaR, this.taDescripcion]
        });
        this.modelo.bindForm(this.formularioDatos);
        this.items = [this.formularioDatos];
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
                _this.nfCodigo.enable();
                if (record.tieneHijos || _this.parent.posicionArbol > 2) {
                    _this.cbFormato.disable();
                }
            });
        } else if (this.long_cod) {
            this.nfCodigo.minLength = this.nfCodigo.maxLength = this.long_cod;
            this.nfCodigo.minLengthText = this.nfCodigo.maxLengthText = this.parent.idioma.lbMaxLengthCodigo.replace('_', this.long_cod);
            this.modelo.idpadre = this.parent.tpEstructuras.getSelectionModel().selNode.attributes.id;
            this.modelo.idarea = this.parent.tpEstructuras.getSelectionModel().selNode.attributes.idarea;
            this.cbFormato.setValue(this.parent.tpEstructuras.getSelectionModel().selNode.attributes.idformato);
            this.cbFormato.disable();
            this.cbFormato.fireEvent('select', this.cmbFormato, this.cbFormato.getStore().getById(this.cbFormato.getValue()));
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
            if (r.codError) {
                mostrarMensaje(3, _this.parent.idioma.lbEstructuraDuplicadaMod);
            }
        }, this.parent.modificar);
    }
});


/**
 * @type LOG.util.Model
 */
Ext.erp.winAreaResponsabilidad.Model = Ext.extend(LOG.util.Model, {
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
            {name: 'codigo'},
            {name: 'descripcion'},
            {name: 'dimensiones'}
        ];
        Ext.erp.winAreaResponsabilidad.Model.superclass.constructor.call(this, config);
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
                        mostrarMensaje(1, modificar ? _this.idioma.msgModificarOkE : _this.idioma.msgAdicionarOkE);
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