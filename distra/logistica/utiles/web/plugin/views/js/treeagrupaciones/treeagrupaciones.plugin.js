Ext.ns('LOG.lb.plugin');

LOG.lb.plugin.TreeAgrupaciones = Ext.extend(LOG.util.Panel, {
    region: 'east',
    width: 400,
    postSalvarFn: Ext.emptyFn,
    tablameta: {esquema: '', tabla: '', columnaref: '', datoref: ''},
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.layout = 'border';
        this.autoLoad = false;
        config.border = true;
        config.collapsible = true;
        this.idioma = Ext.apply(config.idioma, LOG.lb.TreeAgrupaciones.Idioma);
        config.title = this.idioma.tlAgrupaciones;
        this.adicionados = Array();
        this.eliminados = Array();
        LOG.lb.plugin.TreeAgrupaciones.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes del panel.
     * @returns {undefined}
     */
    initComponent: function() {
        var _this = this;
        LOG.lb.plugin.TreeAgrupaciones.superclass.initComponent.call(this);
        //Arbol de agrupaciones
        this.tpAgrupaciones = new Ext.tree.TreePanel({
            region: 'center',
            autoScroll: true,
            border: false,
            root: {
                text: this.idioma.lbDatosMedio,
                id: '0'
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/logistica/utiles/plugin/index.php/plugintreeagrupaciones/cargarTreeAgrupaciones',
                listeners: {
                    beforeload: function(loader, node) {
                        if (node.id == 0) {
                            _this.adicionados = Array();
                            _this.eliminados = Array();
                        }
                        this.baseParams = {
                            esquema: _this.tablameta.esquema,
                            tabla: _this.tablameta.tabla,
                            columnaref: _this.tablameta.columnaref,
                            datoref: _this.tablameta.datoref
                        };
                    }
                }
            }),
            tbar: [
                LOG.util.UIManager.createBtn({
                    text: this.idioma.lbBtnExpandir,
                    tooltip: this.idioma.ttBtnExpandir,
                    iconCls: 'expandir',
                    handler: function() {
                        _this.tpAgrupaciones.root.expand(true);
                    }
                }),
                LOG.util.UIManager.createBtn({
                    text: this.idioma.lbBtnContraer,
                    tooltip: this.idioma.ttBtnContraer,
                    iconCls: 'contraer',
                    handler: function() {
                        _this.tpAgrupaciones.root.collapse(true);
                    }
                }), '->',
                _this.btnGuarar = LOG.util.Prototipos.botonGuardar({
                    tooltip: this.idioma.ttBtnGuardar,
                    handler: function() {
                        _this.salvar();
                    },
                    controlFn: function(b, _caller) {
                        LOG.util.UIManager.encadenaFn(_caller, 'fireEvent', function(e) {
                            if (e == 'checkchange') {
                                if (_this.adicionados.length > 0 || _this.eliminados.length > 0) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, '_treeChange');
                        LOG.util.UIManager.encadenaFn(_caller.getLoader(), 'fireEvent', function(e) {
                            if (e == 'beforeload') {
                                if (_this.adicionados.length > 0 || _this.eliminados.length > 0) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, '_treeLoad');
                    }
                })
            ],
            bbar: [
                '-',
                LOG.util.UIManager.createBtn({
                    tooltip: this.idioma.ttBtnActualizar,
                    iconCls: 'actualizar',
                    handler: function() {
                        _this.tpAgrupaciones.root.reload();
                    }
                })
            ],
            listeners: {
                checkchange: function(node, checked) {
                    if (node.isLeaf()) {
                        if (checked) {
                            if (_this.eliminados.indexOf(node.id) == -1) {
                                _this.adicionados.push(node.id);
                            } else {
                                _this.eliminados.remove(node.id);
                            }
                        } else {
                            if (_this.adicionados.indexOf(node.id) == -1) {
                                _this.eliminados.push(node.id);
                            } else {
                                _this.adicionados.remove(node.id);
                            }
                        }
                        var padre = node.parentNode;
                        var agrupacion = padre.getUI().node.attributes.denominacion;
                        if (_this.adicionados.length > 0 || _this.eliminados.length > 0) {
                            padre.getUI().textNode.innerHTML = '<span style="font-weight: bold;">' + agrupacion + '</span>';
                        } else {
                            padre.getUI().textNode.innerHTML = '<span style="font-weight: normal;">' + agrupacion + '</span>';
                        }
                        padre.hijosMarcados = 0;
                        Ext.each(padre.childNodes, function(n) {
                            if (n.attributes.checked) {
                                padre.hijosMarcados++;
                            }
                        });
                        padre.recursivo = true;
                        if (padre.childNodes.length == padre.hijosMarcados) {
                            padre.getUI().toggleCheck(true);
                        } else {
                            padre.getUI().toggleCheck(false);
                        }
                        delete padre.recursivo;
                    } else {
                        node.expand(true, true, function(n) {
                            if (!node.recursivo) {
                                Ext.each(n.childNodes, function(_n) {
                                    if (_n.getUI().isChecked() != checked) {
                                        _n.getUI().toggleCheck(checked);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
        this.add(this.tpAgrupaciones);
        this.btnGuarar.controlFn.createDelegate(this, [this.btnGuarar, this.tpAgrupaciones]).call();
    },
    recargarTree: function(tablameta) {
        this.tablameta = tablameta;
        this.tpAgrupaciones.root.reload();
    },
    salvar: function() {
        if (this.adicionados.length > 0 || this.eliminados.length > 0) {
            var _this = this;
            Ext.MessageBox.wait(this.idioma.msgGuardando, this.idioma.msgEspere || '...');

            Ext.Ajax.request({
                url: '/logistica/utiles/plugin/index.php/plugintreeagrupaciones/guardarRelacAtributo',
                method: 'POST',
                params: {
                    adicionados: Ext.encode(_this.adicionados),
                    eliminados: Ext.encode(_this.eliminados),
                    esquema: _this.tablameta.esquema,
                    tabla: _this.tablameta.tabla,
                    columnaref: _this.tablameta.columnaref,
                    datoref: _this.tablameta.datoref
                },
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, _this.idioma.lbMsgObjetoSalvado);
                            _this.recargarTree(_this.tablameta);
                            if (typeof _this.postSalvarFn == 'function') {
                                _this.postSalvarFn.createDelegate(_this).call();
                            }
                        }
                    }
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(1, this.idioma.msgNoCambios);
        }
        this.adicionados = Array();
        this.eliminados = Array();
    }
});
