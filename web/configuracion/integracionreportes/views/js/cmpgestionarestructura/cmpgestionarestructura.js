Utilidades.Cmp.Cmpgestionarestructura = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.estructuracompleta = (opcionesConfig && opcionesConfig.estructuracompleta) ? opcionesConfig.estructuracompleta : 0;
    this.start = 0;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.idEstructura = null;

    //funcion que me construye el árbol de Estructuras
    this.CrearArbolEstructura = function (st, sm, panel, formpanel, actualizarBarraHerramientas) {
        this.tfbuscarEstructuras = new Ext.form.TextField(
            {
                id: 'tfbuscarEstructuras',
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 130,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid() && tf.getValue() != '') {
                                _this.tpEstructuras.getRootNode().reload();
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.getValue() != '') {
                            _this.btnLimpiarEstructuras.enable();
                            if (tf.isValid()) {
                                _this.btnbuscarEstructuras.enable();
                            } else {
                                _this.btnbuscarEstructuras.disable();
                            }
                        } else {
                            _this.btnLimpiarEstructuras.disable();
                        }
                    }
                }
            });

        this.btnbuscarEstructuras = new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Buscar estructura',
            disabled: true,
            handler: function () {
                _this.tpEstructuras.getRootNode().reload();
            },
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiarEstructuras = new Ext.Button({
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s)',
            disabled: true,
            handler: function () {
                _this.tfbuscarEstructuras.reset();
                _this.btnbuscarEstructuras.disable();
                _this.btnLimpiarEstructuras.disable();
                _this.tpEstructuras.getRootNode().reload();
            },
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });
        this.tpEstructuras = new Ext.tree.TreePanel({
            tbar: ['Buscar:', '', _this.tfbuscarEstructuras, _this.btnbuscarEstructuras,
                _this.btnLimpiarEstructuras, '-',
                {
                    id: 'btnExpandirEntidad',
                    iconCls: 'expandir',
                    tooltip: 'Expandir &aacute;rbol de entidades',
                    handler: function () {
                        _this.tpEstructuras.root.expand(true);
                        _this.actualizarBarraHerramientasEstructura('expandir');
                    }
                }, {
                    id: 'btnContraerEntidad',
                    iconCls: 'contraer',
                    tooltip: 'Contraer &aacute;rbol de entidades',
                    handler: function () {
                        _this.tpEstructuras.root.collapse(true);
                        _this.actualizarBarraHerramientasEstructura('contraer');
                    }
                }, {
                    id: 'btnActualizarEntidad',
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar &aacute;rbol de entidades',
                    handler: function () {
                        _this.tfbuscarEstructuras.reset();
                        _this.tpEstructuras.getRootNode().reload();
                        _this.actualizarBarraHerramientasEstructura('actualizar');
                    }
                }
            ],
            autoScroll: true,
            split: true,
            root: {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Estructuras'
            },
            listeners: {
                click: function (node) {
                    _this.idEstructura = node.id;
                    if (_this.idEstructura && _this.idEstructura != 'nodo2') {
                        if (formpanel.getForm().items.length > 0)
                            panel.enable();
                        else panel.disable();
                        /*st.reload({
                            params: {
                                idEstructura: _this.idEstructura,
                                padre: []
                            }
                        });*/
                    } else {
                        panel.disable();
                    }
                    //actualizarBarraHerramientas();
                    if (sm != null)
                        sm.clearSelections();

                },
                beforeexpandnode: function (node) {
                    _this.actualizarBarraHerramientasEstructura('expandir');
                },
                beforecollapsenode: function (node) {
                    _this.actualizarBarraHerramientasEstructura('contraer');
                },
                load: function (node) {
                    _this.actualizarBarraHerramientasEstructura('actualizar');
                },
                render: function (tpanel) {
                    if (_this.tpEstructuras) _this.tpEstructuras.getRootNode().reload();
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/configuracion/integracionreportes/index.php/cmpfiltro/cargarArbolEstructuras',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        var text = _this.tfbuscarEstructuras.getValue();
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            denominacion: text,
                            estructuracompleta: _this.estructuracompleta
                        };
                    },
                    'load': function (atreeloader, anode) {
                        var text = _this.tfbuscarEstructuras.getValue();
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            denominacion: text,
                            estructuracompleta: _this.estructuracompleta
                        };
                    }
                }
            })
        });

        return _this.tpEstructuras;
    };

    this.actualizarBarraHerramientasEstructura = function (accion) {
        if (_this.tpEstructuras.getRootNode().childNodes.length == 0) {
            Ext.getCmp('btnExpandirEntidad').setDisabled(true);
            Ext.getCmp('btnContraerEntidad').setDisabled(true);
        } else {
            if (accion == 'contraer') {
                Ext.getCmp('btnExpandirEntidad').setDisabled(false);
                Ext.getCmp('btnContraerEntidad').setDisabled(true);
            } else if (accion == 'expandir' || accion == 'actualizar') {
                Ext.getCmp('btnExpandirEntidad').setDisabled(true);
                Ext.getCmp('btnContraerEntidad').setDisabled(false);
                if (accion == 'actualizar') {
                    _this.tfbuscarEstructuras.reset();
                    _this.btnbuscarEstructuras.disable();
                    _this.btnLimpiarEstructuras.disable();
                }
            }
        }
    };


}


