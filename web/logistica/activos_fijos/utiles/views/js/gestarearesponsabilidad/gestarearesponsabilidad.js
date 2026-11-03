/**
 * Created with JetBrains PhpStorm.
 * User: adrian
 * Date: 4/09/13
 * Time: 10:36
 * To change this template use File | Settings | File Templates.
 */

Ext.ns('Log.AF.Utiles.AreaResp');

Log.AF.Utiles.ArbolAreaResp = Ext.extend(Ext.tree.TreePanel, {
    ultimoSeleccionado: false,
    constructor: function (config) {
        var _this = this;
        this.height = 150;
        this.autoScroll = true;
        this.region = 'center';
        this.conCheck = config.check.conCheck;
        this.chequeados = config.check.chequeados;

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: (!config.url) ? '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/' + config.urlParams : config.url,
            listeners: {
                'beforeload': function (loader, nodo, fnCallBack) {
                    loader.baseParams.node = nodo.attributes.id;
                    loader.baseParams.conCheck = _this.conCheck;
                    loader.baseParams.soloEntidades = _this.soloEntidades;
                    loader.baseParams.nodosSeleccionados = Ext.encode(_this.chequeados);
                    loader.baseParams.marcaHijos = (nodo.attributes.checked) ? 2 : -1,
                    loader.baseParams.identidad = config.identidad;
                },
                'load': function(st, obj){
                    if(obj.childNodes.length == 0){
                         mostrarMensaje(2, 'Debe configurar las &aacute;reas de responsabilidad.');
                    }                    
                }
            }
        });

        this.ultimoSeleccionado = this.getRootNode();

        Log.AF.Utiles.ArbolAreaResp.superclass.constructor.apply(this, arguments);
    },
    initEventos: function (config) {
        var _this = this;

        _this.on('beforeexpandnode', function (node) {
            if (!node.isSelected()) {
                node.select();
            }
        }, this);

        _this.on('beforecollapsenode', function (node) {
            if (!node.isSelected()) {
                node.select();
            }
        }, this);

        if (_this.conCheck == -1) {
            _this.on('dblclick', function (node, e) {

                if (!_this.ultimoSeleccionado) {
                    _this.ultimoSeleccionado = _this.getRootNode();
                }

                _this.ultimoSeleccionado.setText(_this.ultimoSeleccionado.attributes.text.replace(/<[^>]*>?/g, ''));
                _this.ultimoSeleccionado = node;

                _this.getNodeById(node.id).attributes.nombre = _this.getNodeById(node.id).attributes.text;
                _this.getNodeById(node.id).setText('<b>' + _this.getNodeById(node.id).attributes.text + '</b>');

                var valorChk = node;
                var path = valorChk.getPath();
                var arrayPath = path.split("/");
                var denoPadres = "";
                for (var j = 1; j < arrayPath.length; j++) {

                    denoPadres += _this.getNodeById(arrayPath[j]).attributes.text.replace(/<[^>]*>?/g, '');
                    if (j + 1 < arrayPath.length) {
                        denoPadres += " / ";
                    }

                }
                valorChk.attributes.caminoDenominacion = denoPadres;

                config.doAction(valorChk);
            }, this);
        } else {
            _this.on('checkchange', function (node, checked) {
                if (checked && !node.isExpanded()) {
                    node.expand(true);
                }

            }, this);

            _this.removeListener('dblclick', function (node, e) {
            }, this);

        }
    },
    asignarNodoPadre: function (entidad, identidad) {
        var padreArea = new Ext.tree.AsyncTreeNode({
            text: '<b>' + entidad + '</b>',
            animate: false,
            draggable: false,
            expanded: true,
            id: identidad
        });
        this.setRootNode(padreArea);
    },
    // Devuelve el nodo entidad padre de una idestructura.
    // Si el idestructura es una entidad devuelve el mismo nodo.
    dameNodoEntidadPertenece: function (idestructura) {
        var nodo = this.getNodeById(idestructura);
        while (nodo.attributes.interna) {
            nodo = this.getNodeById(nodo.attributes._parent);
        }
        return nodo;
    },
    dameNodoSeleccionado: function (idestructura) {
        return this.getNodeById(idestructura);
    },
    cambiarConCheck: function () {
        var _this = this;
        if (_this.conCheck) {
            if (_this.conCheck == 2) {
                _this.conCheck = -1;
            } else if (_this.conCheck == -1) {
                _this.conCheck = 2;
            }
        } else {
            _this.conCheck = 2;
        }
    }
});
Log.AF.Utiles.WinContainer = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var _this = this;
        this.closable = false;
        this.buttonAlign = 'right';
        this.contrain = true;
        this.cambiar_stilo = (config.cambiar_stilo) ? true : false;
        this.url = (config.url) ? config.url : false;

        Ext.Ajax.request({
            url:  '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargaretiquetas',
            method: 'POST',
            callback: function (opt, scs, resp) {

                _this.idioma = Ext.decode(resp.responseText);
                _this.title = (config.entidadesdelDominio) ? _this.idioma.lbTitleWinEntidadesDominio : _this.idioma.lbTitleWin;
                _this.closeAction = 'hide';

                _this.layout = 'border';
                _this.height = 500;
                _this.width = 420;

                var urlParams = 'cargarcomboarea';

                if (config.entidadesdelDominio) {
                    urlParams = 'getEntidadesDelDominio';
                }
                _this.arbol = new Log.AF.Utiles.ArbolAreaResp({
                    doAction: config.doAction,
                    entidad: config.entidad,
                    identidad: config.identidad,
                    soloEntidades:(config && config.soloEntidades)?true:"",
                    urlParams: urlParams,
                    url: _this.url,
                    check: {
                        conCheck: (config.conCheck && config.conCheck != -1) ? 2 : -1,
                        chequeados: (config.chequeados && config.chequeados.length > 0) ? config.chequeados : new Array()
                    }
                });

                _this.arbol.initEventos(config);
                _this.items = [_this.arbol]

                Ext.apply(_this, config);
                _this.mostrar(config);
                Log.AF.Utiles.WinContainer.superclass.constructor.call(_this, arguments);
                _this.show();
            }
        });

    },
    mostrar: function (config) {

        var _this = this;

        _this.arbol.asignarNodoPadre(config.entidad, config.identidad);
        _this.buttons = [new Ext.Button({
            iconCls: 'cerrar',
            text: _this.idioma.lbBtnCerrar,
            tooltip: _this.idioma.lbTtBtnCerrar,
            handler: function () {
                _this.hide();
            }
        }),
            new Ext.Button({
                iconCls: 'cambiar',
                text: _this.idioma.lbBtnCambiar,
                hidden: !_this.cambiar_stilo,
                tooltip: _this.idioma.lbTtBtnCambiar,
                handler: function () {
                    _this.arbol.cambiarConCheck();
                    _this.arbol.initEventos(config);

                    var node = _this.arbol.getRootNode();
                    _this.arbol.getLoader().load(node, function () {
                        node.expand();
                    });
                    Ext.getCmp('idAceptarWinResposabilidad').purgeListeners();
                    Ext.getCmp('idAceptarWinResposabilidad').on('click', function () {
                        if (_this.conCheck != -1) {
                            var valoresChk = _this.arbol.getChecked();
                            for (var i = 0; i < valoresChk.length; i++) {
                                var path = valoresChk[i].getPath();
                                var arrayPath = path.split("/");
                                var denoPadres = "";
                                for (var j = 1; j < arrayPath.length; j++) {
                                    denoPadres += _this.arbol.getNodeById(arrayPath[j]).attributes.text;
                                    if (j + 1 < arrayPath.length) {
                                        denoPadres += " / ";
                                    }

                                }
                                valoresChk[i].attributes.caminoDenominacion = denoPadres;

                            }
                            _this.arbol.doAction(valoresChk);
                        } else {
                            var valorChk = _this.arbol.getSelectionModel().getSelectedNode();
                            var path = valoreChk.getPath();
                            var arrayPath = path.split("/");
                            var denoPadres = "";
                            for (var j = 1; j < arrayPath.length; j++) {
                                denoPadres += _this.arbol.getNodeById(arrayPath[j]).attributes.text;
                                if (j + 1 < arrayPath.length) {
                                    denoPadres += " / ";
                                }

                            }
                            valorChk.attributes.caminoDenominacion = denoPadres;
                            _this.arbol.doAction(valorChk);
                        }
                    });
                }
            }),
            new Ext.Button({
                iconCls: 'aceptar',
                id: 'idAceptarWinResposabilidad',
                text: _this.idioma.lbBtnAceptar,
                tooltip: _this.idioma.lbTtBtnAceptar,
                listeners: {
                    'click': function () {
                        if (_this.conCheck && _this.conCheck != -1) {
                            var valoresChk = _this.arbol.getChecked();
                            for (var i = 0; i < valoresChk.length; i++) {
                                var path = valoresChk[i].getPath();
                                var arrayPath = path.split("/");
                                var denoPadres = "";
                                for (var j = 1; j < arrayPath.length; j++) {
                                    denoPadres += _this.arbol.getNodeById(arrayPath[j]).attributes.text;
                                    if (j + 1 < arrayPath.length) {
                                        denoPadres += " / ";
                                    }
                                }
                                valoresChk[i].attributes.caminoDenominacion = denoPadres;
                            }
                            _this.arbol.doAction(valoresChk);
                        } else {
                            var valorChk = _this.arbol.getSelectionModel().getSelectedNode();
                            var path = valorChk.getPath();
                            var arrayPath = path.split("/");
                            var denoPadres = "";
                            for (var j = 1; j < arrayPath.length; j++) {
                                _this.arbol.getNodeById(arrayPath[j]).setText(_this.arbol.getNodeById(arrayPath[j]).attributes.text.replace(/<[^>]*>?/g, ''));
                                denoPadres += _this.arbol.getNodeById(arrayPath[j]).attributes.text;
                                if (j + 1 < arrayPath.length) {
                                    denoPadres += " / ";
                                }
                            }
                            valorChk.attributes.caminoDenominacion = denoPadres;
                            _this.arbol.doAction(valorChk);
                        }
                    }
                }
            })
        ];
    },
    cerrar: function () {
        this.close();
    },
    dameNodoEntidadPertenece: function (idestructura) {
        return this.arbol.dameNodoEntidadPertenece(idestructura);
    },
    dameNodoSeleccionado: function (idestructura) {
        return this.arbol.dameNodoSeleccionado(idestructura);
    }
});