Ext.ns('LOG.lb.plugin');

/**
 * 
 * @type LOG.util.UITemplate
 */
LOG.lb.plugin.VistaAgrupaciones = Ext.extend(Ext.util.Observable, {
    /**
     * Forma en la que se vizualiza el componente, 
     * default - Ext.Panel
     * tabpanel - Ext.TabPanel
     * ventana - Ext.Window
     * @type String
     */
    formaVisualizacion: 'panel',
    /**
     * Cantidad de columnas del panel.
     * @type Numeric
     */
    columnas: 4,
    /**
     * @type Boolean
     */
    autoShow: false,
    /**
     * @type Boolean
     */
    autoScroll: true,
    /**
     * @type Boolean
     */
    isInit: false,
    /**
     * @type Boolean
     */
    isShow: false,
    /**
     * @type Object
     */
    model: null,
    /**
     * Constructor del pluging.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.apply(config, {
            width: config.width || 700,
            height: Math.min((config.height || 180), 600)
        });
        this.formaVisualizacion = config.formaVisualizacion || this.formaVisualizacion;
        this.idioma = Ext.apply(config.idioma, LOG.lb.TreeAgrupaciones.Idioma);
        this.model = config.model;
        this.tablameta = config.tablameta || {esquema: '', tabla: '', columnaref: '', datoref: ''};
        this.columnas = config.columnas || 4;
        this.setTemplateView(config);
        if (this.formaVisualizacion == 'ventana') {
            this.initComponent();
        }
    },
    /**
     * Inicializa los campos de entrada de datos.
     * @param {Function} _fn
     * @returns {undefined}
     */
    initComponent: function(_fn) {
        if (this.model) {
            Ext.each(this.vistaPrincipal.find('campo', true), function(field) {
                this.model[field.getName()] = null;
                delete this.model[field.getName()];
            }, this);
        }
        this.panelPrincipal.removeAll();
        if (this.formaVisualizacion == 'tabpanel') {
            this.vistaPrincipal.removeAll();
        }
        this.cargaInicial({
            esquema: this.tablameta.esquema,
            tabla: this.tablameta.tabla,
            columnaref: this.tablameta.columnaref,
            datoref: this.tablameta.datoref
        }, function(r) {
            this.agrupaciones = r;
            this.panelItems = [];
            this.tieneAtributos = false;
            Ext.each(this.agrupaciones, function(agr) {
                this.tieneAtributos = true;
                if (agr.idagrupacion == 1) {
                    var panel = new LOG.util.ColumnForm({
                        columnas: this.columnas
                    });
                    Ext.each(agr.atributos, function(att) {
                        att = eval(att.codigoui.replace("{", "{name: 'id" + att.idatributo + "', campo: true, "));
                        if (att.tipo == 5) {
                            att.getStore().on({
                                load: function() {
                                    att.setValue(att.getValue());
                                }
                            });
                        }
                        panel.addComponent(att);
                    });
                    if (this.formaVisualizacion == 'tabpanel') {
                        this.vistaPrincipal.add(LOG.util.UIManager.initPanel({
                            title: agr['denominacion'],
                            frame: true,
                            items: panel
                        }));
                    } else {
                        this.panelItems.push(panel);
                    }
                }
            }, this);
            Ext.each(this.agrupaciones, function(agr) {
                if (agr.idagrupacion != 1) {
                    var panel = new LOG.util.ColumnForm({
                        columnas: this.columnas
                    });
                    Ext.each(agr.atributos, function(att) {
                        att = eval(att.codigoui.replace("{", "{name: 'id" + att.idatributo + "', campo: true, "));
                        if (att.tipo == 5) {
                            att.getStore().on({
                                load: function() {
                                    att.setValue(att.getValue());
                                }
                            });
                        }
                        panel.addComponent(att);
                    });
                    if (this.formaVisualizacion == 'tabpanel') {
                        this.vistaPrincipal.add(LOG.util.UIManager.initPanel({
                            title: agr['denominacion'],
                            frame: true,
                            items: panel
                        }));
                    } else {
                        var field = new Ext.form.FieldSet({
                            title: agr['denominacion'],
                            autoHeight: true,
                            // autoWidth: true,
                            collapsible: true,
                            items: panel
                        });
                        this.panelItems.push(field);
                    }
                }
            }, this);
            this.panelPrincipal.add(this.panelItems);
            this.panelPrincipal.doLayout();

            this.isInit = true;
            if (this.formaVisualizacion == 'ventana' && (this.autoShow || this.isShow)) {
                this.show();
            }
            if (this.model) {
                this.bindPanel();
            }
            if (typeof _fn == 'function') {
                _fn.createDelegate(this, [this.tieneAtributos]).call();
            }
        }, this);
    },
    /**
     * Devuelve la vista principal del componente en dependencia de la forma de 
     * visualizacion
     * @returns {void}
     */
    setTemplateView: function(config) {
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            frame: true,
            layout: 'form',
            region: 'center',
            autoScroll: this.autoScroll
        });
        switch (this.formaVisualizacion) {
            case 'ventana':
                config.usarAplicar = false;
                this.vistaPrincipal = LOG.util.UIManager.initWindow(config);
                this.vistaPrincipal.add(this.panelPrincipal);
                break;
            case 'tabpanel':
                Ext.apply(config, {
                    region: 'center',
                    border: false,
                    activeTab: 0
                });
                this.vistaPrincipal = new Ext.TabPanel(config);
                this.vistaPrincipal.doLayout();
                break;
            default:
                Ext.apply(config, {
                    region: 'center',
                    border: false,
                    layout: 'border'
                });
                this.vistaPrincipal = LOG.util.UIManager.initPanel(config);
                this.vistaPrincipal.add(this.panelPrincipal);
                this.vistaPrincipal.doLayout();
                break;
        }
        this.vistaPrincipal.on({
            show: function() {
                if (typeof this.onShowFn == 'function') {
                    this.onShowFn.createDelegate(this).call();
                }
            }
        });
    },
    /**
     * Reconfigura el panel de datos.
     * @param {Numeric} id
     * @param {Function} _fn
     * @returns {undefined}
     */
    reconfigurePanel: function(id, _fn) {
        this.tablameta.datoref = id;
        this.initComponent(_fn);
    },
    /**
     * Devuelve la vista principal.
     * @returns {LOG.util.Window|Ext.Panel}
     */
    getVistaPrincipal: function() {
        return this.vistaPrincipal;
    },
    /**
     * Muestra la interfaz.
     * @returns {LOG.util.Window|Ext.Panel}
     */
    show: function() {
        this.isShow = true;
        if (!this.isInit) {
            return null;
        }
        if (!this.tieneAtributos) {
            mostrarMensaje(1, this.idioma.msgNoAtributos);
        } else {
            this.vistaPrincipal.show();
            this.vistaPrincipal.doLayout();
        }
        return this.vistaPrincipal;
    },
    /**
     * Devuelve un objeto con los valores de los campos del panel.
     * @param {Boolean} dirtyOnly [Optional] True para devolver solo los campos que han sido modificados.
     * @return {Array} Los valores del panel
     */
    getFieldValues: function(dirtyOnly) {
        var a = [], n, l, key, val;
        Ext.each(this.vistaPrincipal.find('campo', true), function(f) {
            var o = {};
            if (!f.disabled && (dirtyOnly !== true || f.getValue())) {
                n = f.getName();
                l = f.fieldLabel || f.boxLabel;
                key = o[n];
                val = f.getValue();
                if (f.tipo == 4) {
                    val = val.format('d/m/Y');
                }

                if (Ext.isDefined(key)) {
                    if (Ext.isArray(key)) {
                        o['id'].push(n);
                        o['valor'].push(val);
                        o['denominacion'].push(l);
                        o['tipo'].push(f.tipo);
                        o['color'].push(f.color);
                    } else {
                        o['id'] = n;
                        o['valor'] = [key, val];
                        o['denominacion'] = ['denominacion', l];
                        o['tipo'] = ['tipo', f.tipo];
                        o['color'] = ['tipo', f.color];
                    }
                } else {
                    o['id'] = n;
                    o['valor'] = val;
                    o['denominacion'] = l;
                    o['tipo'] = f.tipo;
                    o['color'] = f.color;
                }
                a.push(o);
            }
        });
        return a;
    },
    /**
     * Establece los valores de los campos en este panel.
     * @param {Array/Object} values
     * @returns {Object}
     */
    setValues: function(values) {
        if (Ext.isArray(values)) { // array of objects
            for (var i = 0, len = values.length; i < len; i++) {
                var v = values[i];
                var f = this.vistaPrincipal.find('name', v.id)[0];
                if (f) {
                    f.setValue(v.valor);
                    f.originalValue = f.getValue();
                }
            }
        } else { // object hash
            var field, name;
            for (name in values) {
                field = this.vistaPrincipal.find('name', name)[0];
                if (!Ext.isFunction(values[name]) && field) {
                    field.setValue(values[name]);
                    field.originalValue = field.getValue();
                }
            }
        }
        return this;

    },
    /**
     * 
     * @returns {undefined}
     */
    bindPanel: function() {
        var scope = this.model;
        Ext.each(this.vistaPrincipal.find('campo', true), function(field) {
            if (scope.xtypesEvtents[field.getXType()] && scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup' && !field.enableKeyEvents) {
                field.enableKeyEvents = true;
            }
            LOG.util.UIManager.encadenaFn(field, 'fireEvent', function(e) {
                if ((scope.xtypesEvtents[field.getXType()] && e == scope.xtypesEvtents[field.getXType()]['evt']) || e == 'blur') {
                    scope[field.getName()] = field.getValue();
                    if (scope.isValid()) {
                        scope.habilitarBotones();
                    } else {
                        scope.habilitarBotones(true);
                    }
                }
                if (scope.xtypesEvtents[field.getXType()] && scope.xtypesEvtents[field.getXType()]['evt'] == 'check') {
                    scope[field.getName()] = 0;
                    if (field.getValue() == true) {
                        scope[field.getName()] = 1;
                    }
                }
            }, field.getName());
        });
    },
    /**
     * Carga las agrupaciones y sus atributos.
     * @param {Object} params
     * @param {Function} _fn
     * @param {Object} scope [Opcional]
     * @returns {undefined}
     */
    cargaInicial: function(params, _fn, scope) {
        if (this.transId && Ext.Ajax.isLoading(this.transId)) {
            Ext.Ajax.abort(this.transId);
        }
        this.transId = Ext.Ajax.request({
            url: '/logistica/utiles/plugin/index.php/plugintreeagrupaciones/getCodUiAtributos',
            params: params,
            callback: function(options, success, response) {
                if (typeof _fn == 'function') {
                    var resp = Ext.decode(response.responseText);
                    _fn.createDelegate(scope || this, [resp]).call();
                }
            }
        });
    }
});
