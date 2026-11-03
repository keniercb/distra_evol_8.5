Ext.ns('LOG.util');
/**
 * Modelo
 * @type @exp;Ext@call;Extend
 */
LOG.util.Model = Ext.extend(Object, {
    /**
     * Objeto del formulario que representa el modelo de la vista
     */
    basicForm: null,
    /**
     *
     */
    primaryKeyField: null,
    /**
     *
     */
    xtypesEvtents: null,
    /**
     *
     */
    urlController: null,
    /**
     *
     */
    urlAccionGuardar: null,
    /**
     *
     */
    urlAccionEliminar: null,
    /**
     *
     */
    idioma: null,
    /**
     *
     */
    keys: null,
    /**
     *
     */
    sm: null,
    /**
     *
     * @type type
     */
    actionButtons: undefined,
    /**
     *
     */
    st: null,
    /**
     *
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.xtypesEvtents = {
            checkbox: {
                evt: ['check']
            },
            combobox: {
                evt: ['select']
            },
            selectortf: {
                evt: ['select']
            },
            combousuariosdoc: {
                evt: ['select']
            },
            combo: {
                evt: ['select']
            },
            combotipodoc: {
                evt: ['select']
            },
            combologistica: {
                evt: ['select']
            },
            trigger: {
                evt: ['change']
            },
            combonomenclador: {
                evt: ['select']
            },
            textarea: {
                evt: ['keyup']
            },
            textfield: {
                evt: ['keyup']
            },
            numberfield: {
                evt: ['keyup']
            },
            radio: {
                evt: ['check']
            },
            field: {
                evt: ['keyup']
            },
            datefield: {
                evt: ['select']
            },
            treecombologistica: {
                evt: ['select']
            }
        };
        this.idioma = config.idioma;
        this.urlAccionGuardar = config.urlAccionGuardar;
        this.urlAccionEliminar = config.urlAccionEliminar;
        this.urlController = config.urlController || '';
        this.keys = null;
        this.basicForm = null;
        this.actionButtons = new LOG.util.List();
        this.sm = null;
        this.st = null;
        this.keys = Object.getOwnPropertyNames(this);
        this.initDefaults(config);
    },
    /**
     *
     * @param {Object} config
     * @returns {undefined}
     */
    initDefaults: function (config) {
        if (config.form) {
            this.bindForm(config.form);
        }
        if (config.grid) {
            this.bindGridPanel(config.grid);
        }
        this.initFields(config.fields);
    },
    /**
     *
     * @param {Object} fields
     * @returns {undefined}
     */
    initFields: function (fields) {
        var o = {};
        if (fields) {
            Ext.each(fields, function (f) {
                o[f.name] = LOG.util.DataTypes.defaultValue(f.type);
                if (f.primary) {
                    this.setPrimaryField(f);
                }
            }, this);
        }
        LOG.util.UIManager.apply(this, o);
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function () {
        if (!this.basicForm) {
            return;
        }
        this.basicForm.items.each(function (field) {
            field.originalValue = field.getValue();
        });
        this.habilitarBotones(true);
    },
    /**
     *
     * @param {type} basicForm
     * @returns {undefined}
     */
    bindForm: function (basicForm) {
        var _scope = this;
        this.basicForm = basicForm.getForm();
        Ext.apply(this.basicForm, {
            loadRecord: function (record) {
                this.setValues(record.data);
                _scope.setDefaulFormValues();
                return this;
            }
        });
        this.basicForm.items.each(function (field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;
                }
                LOG.util.UIManager.encadenaFn(field, 'fireEvent', function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        _scope[field.getName()] = field.getValue();
                        if (_scope.isValid()) {
                            _scope.habilitarBotones();
                        } else {
                            _scope.habilitarBotones(true);
                        }
                    }
                    if (_scope.xtypesEvtents[field.getXType()]
                        && _scope.xtypesEvtents[field.getXType()]['evt'] == 'check') {
                        _scope[field.getName()] = 0;
                        if (field.getValue() == true) {
                            _scope[field.getName()] = 1;
                        }
                    }
                });
            }
        });
        return basicForm;
    },
    /**
     *
     * @param {type} grid
     * @returns {undefined}
     */
    bindGridPanel: function (grid) {
        this.sm = grid.getSelectionModel();
        this.st = grid.getStore();
    },
    /**
     *
     * @param {type} f
     * @returns {void}
     */
    setPrimaryField: function (f) {
        if (this.primaryKeyField == null) {
            this.primaryKeyField = f.name;
        }
    },
    /**
     *
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvar: function (parametros, _fn, _fnFail, msgMostrar, passFormValidation) {
        if (this.isValid() || passFormValidation) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(objSubmit.data || this.encode());

            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, msgMostrar || this.idioma.lbMsgObjetoSalvado);
                            if (this.st) {
                                this.st.reload();
                            }
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
     * @param {Object} parametros
     * @param {function} _fn
     * @param {Boolean} loadStore
     * @returns {undefined}
     */
    eliminar: function (parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection() && !parametros.id) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgDeleteObjeto, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoObjeto, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.id) ? Ext.encode([objSubmit.id]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgObjetoEliminado);
                                loadStore = loadStore || true;
                                if (loadStore) {
                                    this.st.reload({
//                                        params : {
//                                            start : 0
//                                        }
                                    });
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    /**
     *
     * @returns {Boolean}
     */
    isValid: function () {
        if (this[this.primaryKeyField]) {
            return this.basicForm.isValid() && this.basicForm.isDirty();
        } else {
            return this.basicForm.isValid();
        }
    },
    /**
     *
     * @param {Object} obj
     * @returns {Object}
     */
    encode: function (obj) {
        obj = obj || this;
        var objTemp = {};
        for (var property in obj) {
            if (typeof obj[property] != 'function' && this.keys.indexOf(property) == -1) {
                objTemp[property] = obj[property];
            }
        }
        return objTemp;
    },
    /**
     *
     * @returns {Array}
     */
    getSelectedId: function () {
        var _this = this;
        var _selecteId = [];
        if (this.sm.hasSelection()) {
            Ext.each(this.sm.getSelections(), function (r) {
                _selecteId.push(r.get(_this.primaryKeyField));
            });
        }
        return _selecteId;
    },
    /**
     *
     * @param {Button} b
     * @param {Boolean} hasEspecialCondition [Opcional]
     * @returns {undefined}
     */
    addActionButton: function (b, hasEspecialCondition) {
        b.especialCondition = hasEspecialCondition;
        if (hasEspecialCondition && typeof b.fnEspecialCondition == 'function') {
            b.setDisabled(b.fnEspecialCondition());
        } else {
            b.disable();
        }
        this.actionButtons.add(b);
        return b;
    },
    /**
     * @param {Boolean} enabled [Opcional]
     * @returns {undefined}
     */
    habilitarBotones: function (enabled) {
        this.actionButtons.each(function (b) {
            if (b.especialCondition && typeof b.fnEspecialCondition == 'function') {
                b.setDisabled(b.fnEspecialCondition());
            } else {
                b.setDisabled(enabled || false);
            }
        });
    },
    /**
     *
     * @returns {undefined}
     */
    reset: function () {
        for (var property in this) {
            if (typeof this[property] != 'function'
                && this.keys.indexOf(property) == -1
                && property != 'primaryKeyField') {
                this[property] = null;
            }
        }
        if (this.basicForm) {
            this.basicForm.items.each(function (field) {
                if (field.isFormField) {
                    field.setValue(null);
                    field.originalValue = field.getValue();
                }
            });
        }
        this.habilitarBotones(true);
    },
    /**
     *
     * @param {Object} parametros
     * @param {function} _fn
     * @param {String} msg
     * @returns {undefined}
     */
    cargaInicial: function (parametros, _fn, msg) {
        var _this = this;
        if (!parametros.cargando) {
            Ext.MessageBox.wait(msg || 'Obteniendo datos.', _this.idioma.msgEspere);
        }
        var objSubmit = parametros || {};
        objSubmit.exception = false;
        Ext.Ajax.request({
            url: parametros.url,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [[resp.datos], resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    /**
     * @param {Object} data
     * @returns {undefined}
     */
    loadRecord: function (data) {
        if (!this.sm.hasSelection() && !data) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        var record = this.sm.getSelected();
        this.apply(data || record.json);
    },
    /**
     *
     * @param {Object} o
     * @returns {undefined}
     */
    apply: function (o) {
        for (var p in o) {
            if (typeof o[p] != 'function' && this.hasOwnProperty(p)) {
                this[p] = o[p];
            }
        }
    },
    /**
     *
     * @returns {unresolved}
     */
    getStore: function () {
        return this.st;
    }
});

LOG.util.ModelBusquedaAvanzada = Ext.extend(LOG.util.Model, {
    constructor: function (config) {
        LOG.util.ModelBusquedaAvanzada.superclass.constructor.call(this, config);
    },
    bindForm: function (basicForm) {
        var _scope = this;
        this.basicForm = basicForm.getForm();
        Ext.apply(this.basicForm, {
            loadRecord: function (record) {
                this.setValues(record.data);
                _scope.setDefaulFormValues();
                return this;
            }
        });
        this.basicForm.items.each(function (field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;

                    field.mon(field.el, {
                        scope: field,
                        keyup: function () {
                            _scope[field.getName()] = field.getValue();
                            if (_scope.isValid() && _scope.existedatosParaFiltrar()) {
                                _scope.habilitarBotones();
                            } else {
                                _scope.habilitarBotones(true);
                            }
                        }
                    });
                }

                LOG.util.UIManager.encadenaFn(field, 'fireEvent', function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        _scope[field.getName()] = field.getValue();
                        if (_scope.isValid() && _scope.existedatosParaFiltrar()) {
                            _scope.habilitarBotones();
                        } else {
                            _scope.habilitarBotones(true);
                        }
                    }
                });
            }
        });
    },
    existedatosParaFiltrar: function () {
        var result = false;
        this.basicForm.items.each(function (field) {
            if (field.getValue() != "" && field.getValue() != null) {
                result = true;
            }
        });
        return result;
    }
});