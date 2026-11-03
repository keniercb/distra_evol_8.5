Ext.ns('LOG.lb.plugin');

LOG.lb.plugin.Sustituto = function() {
    function initWindowSustituto(v, scope) {
        scope.Sustituto = Ext.extend(LOG.util.Window, {
            usarAplicar: false,
            usarAceptar: false,
            cerrarAceptar: true,
            resizable: false,
            height: 370,
            width: 680,
            constructor: function(config) {
                config.idioma = LOG.util.UIManager.apply(LOG.util.Idioma, LOG.lb.sustituto.Idioma);
                scope.Sustituto.superclass.constructor.call(this, config);
            },
            initComponent: function() {
                var _this = this;
                var listaBotones = new LOG.util.List();
                listaBotones.add(LOG.util.Prototipos.botonAdicionar({
                    scope: this,
                    tooltip: '',
                    handler: function () {
                        _this.ventanaIndicador();
                    },
                    controlFn: function (b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_this.gridSustituto.getStorePrincipal(), 'fireEvent', function (e) {
                            if (e == 'load') {
                                if (_this.dfFecha.getValue() && _this.dfFecha.isValid() && this.getCount() == 0) {//preguntar por el padre scope.view.getSmPrincipal().getSelected().data
                                    b.enable();
                                } else if (this.reader.jsonData.directo == 0 && _this.dfFecha.getValue() && _this.dfFecha.isValid()) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'adicionar');
                        LOG.util.UIManager.encadenaFn(_this.dfFecha, 'fireEvent', function (e) {
                            if (e == 'change') {
                                if (_this.dfFecha.getValue() && _this.dfFecha.isValid() && _this.gridSustituto.getStorePrincipal().getCount() == 0) {//preguntar por el padre scope.view.getSmPrincipal().getSelected().data
                                    b.enable();
                                } else if (_this.dfFecha.getValue() && _this.dfFecha.isValid() && _this.gridSustituto.getStorePrincipal().reader.jsonData.directo == 0) {
                                    b.enable();
                                }
                                else {
                                    b.disable();
                                }
                            }
                        }, 'adicionar');
                    }
                }));

                listaBotones.add(LOG.util.Prototipos.botonEliminar({
                    scope: this,
                    tooltip: '',
                    handler: function () {
                        var seleccion = _this.gridSustituto.getSmPrincipal().getSelections();
                        _this.eliminarSustituto(seleccion);
                    },
                    controlFn: function(b, _caller) {
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_this.gridSustituto.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0) {//preguntar por el padre scope.view.getSmPrincipal().getSelected().data
                                    if (this.getSelected().data.idsustituto == this.getSelected().json.directo) {
                                        b.enable();
                                    }
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'eliminar');
                    }
                }));
                this.dfFecha = new Ext.form.DateField({
                    fieldLabel: _this.idioma.lbFecha,
                    name: 'fecha',
                });
                this.gridSustituto = new LOG.util.UITemplate({
                    busquedaBasica: false,
                    autoSelect: false,
                    autoLoad: false,
                    dirController: '/logistica/utiles/plugin/index.php/pluginsustituto',
                    urlBusquedaGridPrincipal: 'getSustitutos',
                    idGridPrincipal: 'idsustituto',
                    formaVisualizacion: 'panel',
                    listaBotones: listaBotones
                });
                this.gridSustituto.addGridColumn({
                    header: this.idioma.lbCodigo,
                    dataIndex: 'codigo'
                });
                this.gridSustituto.addGridColumn({
                    header: this.idioma.lbCodigoProveedor,
                    dataIndex: 'numeropieza'
                });
                this.gridSustituto.addGridColumn({
                    header: this.idioma.lbDenominacion,
                    dataIndex: 'denominacion',
                    autoExpand: true
                });
                this.gridSustituto.addGridColumn({
                    header: this.idioma.lbFecha,
                    dataIndex: 'fecha'
                });
                this.gridSustituto.addGridColumn({
                    dataIndex: 'idindicador'
                });
                this.gridSustituto.addGridColumn({
                    dataIndex: 'idsustituto'
                });
                this.gridSustituto.init();
                this.items = [{
                    region: 'north',
                    labelWidth: 40,
                    frame: true,
                    layout: 'form',
                    height: 35,
                    items: [this.dfFecha]
                },this.gridSustituto.view()];
                this.setTitle(this.idioma.lbTituloSustituto+scope.view.getSmPrincipal().getSelected().data.denominacion);
                var _this = this;
                this.gridSustituto.getSmPrincipal().on({
                    'rowselect': function(sm, pos, rec) {

                    },
                    'rowdeselect': function(sm, pos, rec) {

                    }
                });
                this.gridSustituto.getStorePrincipal().on({
                    'beforeload': function(st) {
                        st.initBaseParams.idindicador = scope.view.getSmPrincipal().getSelected().data.idindicador;
                        st.baseParams.idindicador = scope.view.getSmPrincipal().getSelected().data.idindicador;
                    }
                });

                scope.Sustituto.superclass.initComponent.call(this, arguments);
                listaBotones.each(function(b) {
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(this, [b, this]).call();
                    }
                }.createDelegate(this));
            },
            aceptarFn: function() {

            },
            ventanaIndicador: function() {
                var _this = this;
                var idseleccionados = _this.gridSustituto.getStorePrincipal().reader.jsonData.sustitutos;
                idseleccionados = idseleccionados.concat([scope.view.getSmPrincipal().getSelected().data.idindicador]);
                var parametros = {};
                parametros.idseleccionados = Ext.encode(idseleccionados);
                LOG.inv.maestroproductos.Loader.init(function() {
                    var ventana = new LOG.lb.maestroproductos.UIProductos({
                        tipo: scope.view.getSmPrincipal().getSelected().data.tipo,
                        constrain: true,
                        //usarAplicar: true,
                        modoSeleccion: 1,
                        parametros: parametros,
                        doAction: function(r) {
                            Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');
                            var idsustituto = undefined;
                            Ext.each(r, function(rec) {
                                idsustituto = rec.json.idindicador;
                            });
                            Ext.Ajax.request({
                                url: '/logistica/utiles/plugin/index.php/pluginsustituto/adicionarSustituto',
                                method: 'post',
                                params: {
                                    idsustituto: idsustituto,
                                    idindicador: scope.view.getSmPrincipal().getSelected().data.idindicador,
                                    fecha: _this.dfFecha.getValue()
                                },
                                success: function(rp) {
                                    Ext.MessageBox.hide();
                                    _this.gridSustituto.getStorePrincipal().reload();
                                }
                            });
                        }
                    });
                    ventana.show();
                })
            },
            eliminarSustituto: function(seleccion) {
                var _this = this;
                mostrarMensaje(2, _this.idioma.msgEliminarSustituto, function(btn){
                    if(btn == 'ok'){
                        var sustitutos = new Array();
                        Ext.each(seleccion, function(sel) {
                            sustitutos.push(sel.json.idindicador);
                        });
                        Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/utiles/plugin/index.php/pluginsustituto/eliminarSustituto',
                            method: 'post',
                            params: {
                                datos: Ext.encode(sustitutos)
                            },
                            success: function(rp) {
                                Ext.MessageBox.hide();
                                _this.gridSustituto.getStorePrincipal().reload();
                            }
                        });
                    }
                });
            }
        });
    }
    return {
        init: function (v) {
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'cambiar',
                text: LOG.lb.sustituto.Idioma.lbSustituto,
                tooltip: LOG.lb.sustituto.Idioma.ttBtnSustituto,
                isContextual: true,
                view: v,
                handler: function (v) {
                    initWindowSustituto(v, this);
                    this.winSustituto = new this.Sustituto({
                        idioma: LOG.lb.sustituto.Idioma
                    });
                    this.winSustituto.show();
                    this.winSustituto.gridSustituto.getStorePrincipal().load();
                    this.winSustituto.doLayout();
                },
                controlFn: function (btn, vista) {
                    /*if (vista.grantedAction('RGESTI') || vista.grantedAction('RASOCIAR')) {
                        btn.setVisible(true);
                    } else {
                        btn.setVisible(false);
                    }*/
                    btn.disable();

                    vista.getSmPrincipal().fireEvent = v.getSmPrincipal().fireEvent.createSequence(function (e, args) {
                        if (e == 'rowselect' ) {
                            btn.enable();
                        }
                        if (e == 'rowdeselect') {
                            btn.disable();
                        }
                    });
                }
            }), v.listaBotones.count() - 2);
        }
    }
};
