Utilidades.Cmp.CmpCrudFondoTiempo = function () {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.identidadselected = null;
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    //componente para el manejo de los mensajes de espera
    this.barraProgreso = new BarraEstado();
    //objeto del componente "gestion documental"

    this.CrearWinCrudFondoTiempo = function (parametros) {
        this.loaderTreeBaseEstructura = new Ext.tree.TreeLoader({
            dataUrl: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/cargarEntidades',
            listeners: {
                beforeload: function (tl, n) {
                    this.baseParams = {
                        idEstructuraPadre: n.attributes.idEstructuraPadre

                    };
                }
            }
        });

        this.tpBaseEstructura = new Ext.tree.TreePanel({
            autoScroll: true,
            layout: 'fit',
            height: 400, //Para modificar tener en cuenta el tamanno de la ventana de Compartir configuracion
            border: false,
            id: 'tpestructura',
            tbar: [
                {
                    iconCls: 'expandir',
                    tooltip: 'Expandir todas las entidades',
                    handler: function () {
                        _this.tpBaseEstructura.root.expand(true);
                    }
                },
                {
                    iconCls: 'contraer',
                    tooltip: 'Contraer todas las entidades',
                    handler: function () {
                        _this.tpBaseEstructura.root.collapse(true);
                    }
                },
                {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar todas las entidades',
                    handler: function () {
                        _this.tpBaseEstructura.root.reload(true);
                        _this.tpBaseEstructura.getSelectionModel().select(_this.tpBaseEstructura.root);
                        _this.identidadselected = 0;
                    }
                },
                '-',
                {
                    xtype: 'textfield',
                    emptyText: 'Buscar entidad',
                    width: 150,
                    id: 'idfiltroent',
                    regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                    maskRe: /^([a-zA-Z0-9��������������"' ,./()_-])$/,
                    regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                    vtype: 'validarEspaciosEnBlanco',
                    listeners: {
                        specialkey: function (t, e) {
                            if (e.getKey() == '13') {
                                _this.buscarNodo(_this.tpBaseEstructura);
                                _this.actualizarArbol(_this.tpBaseEstructura);

                            }
                        }
                    }
                }
            ],
            listeners: {
                click: function (n, e) {
                    _this.tpBaseEstructura.getSelectionModel().select(n);
                    _this.identidadselected = n.id;
                    if (n.leaf) {
                        eshoja = 1;
                    } else {
                        eshoja = 0;
                    }

                }

            },
            loader: _this.loaderTreeBaseEstructura,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Entidades',
                tipo: 0,
                expanded: true,
                id: '0'
            })

        });

        if (_this.winCompartir) {
            _this.winCompartir.destroy();
        }
        this.winCompartir = new Ext.Window({
            title: 'Compartir configuraci&oacute;n',
            closable: true,
            draggable: true,
            modal: true,
            closeAction: 'destroy',
            resizable: false,
            width: 350,
            height: 450,
            cls: 'winCompartirConf',
            items: [_this.tpBaseEstructura],
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    handler: function () {
                        _this.winCompartir.destroy();
                    },
                    tooltip: 'Cerrar ventana sin guardar los datos'
                },{
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    handler: function () {
                        _this.compartirConf(parametros, 'aplicar');
                    },
                    tooltip: 'Guardar datos y limpiar los campos'
                }, {
                    iconCls: 'aceptar',
                    id: 'btnAceptarCompartir',
                    tooltip: 'Guardar datos y cerrar ventana',
                    text: 'Aceptar',
                    handler: function () {
                        _this.compartirConf(parametros, 'adicionar');
                    }
                }],
            listeners: {}
        });
        _this.winCompartir.show();
    };

    this.compartirConf = function (parametros, accion) {
        if (_this.identidadselected != null && _this.identidadselected != 0) {
            var idEntidadCompartir = parametros.idEntidadCompartir;
            if (_this.identidadselected != idEntidadCompartir) {
                var anno = parametros.anno;
                _this.barraProgreso.show('Guardando datos.');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/compartirConfiguracion',
                    method: 'POST',
                    params: {
                        idestructura: _this.identidadselected,
                        idestructuracompartir : idEntidadCompartir,
                        anno: anno
                    },
                    callback: function (options, success, response) {
                        _this.barraProgreso.hide();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.cod == 1) {
                            mostrarMensaje(1, 'La configuraci&oacute;n de la entidad seleccionada ha sido guardada satisfactoriamente.');
                        } else if (responseData.cod == 2) {
                            mostrarMensaje(1, 'Ha ocurrido un error al guardar la configuraci&oacute;n de alguno(s) tipo(s) de d&iacute;a(s).');
                        } else if (responseData.cod == 3) {
                            mostrarMensaje(1, 'Ha ocurrido un error al guardar la configuraci&oacute;n.');
                        }
                        if (accion == 'adicionar') {
                            _this.winCompartir.destroy();
                        } else {
                            _this.tpBaseEstructura.getSelectionModel().select(_this.tpBaseEstructura.root);
                            _this.identidadselected = 0;
                        }
                    }
                });
            } else {
                mostrarMensaje(1, 'No puede seleccionar la misma entidad para compartir su configuraci&oacute;n.');
            }
        } else {
            mostrarMensaje(1, 'Debe seleccionar una entidad para cambiar su configuraci&oacute;n.');
        }
    }

    this.actualizarArbol = function (arbol, valor) {
        if (arbol.getSelectionModel().getSelectedNode() != undefined) {
            if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                arbol.getSelectionModel().getSelectedNode().reload({
                    params: {
                        valor: valor
                    }
                });
            }
        } else
            arbol.root.reload({
                params: {
                    valor: valor
                }
            });
    }

    this.buscarNodo = function (tree) {
        _this.buscarNodoTreeX(tree, _this.identidadselected, 'idfiltroent');
    }

    this.buscarNodoTreeX = function (trEnt, idselected, idcampobusq) {

        var rootNode = null;
        var idRootNode = null;
        if (idselected == null) {
            idRootNode = trEnt.getRootNode().firstChild.id;
            rootNode = trEnt.getNodeById(idRootNode);
            trEnt.getSelectionModel().select(rootNode);
        }
        else {
            if (idRootNode == null)
                idRootNode = idselected;
            rootNode = trEnt.getNodeById(idRootNode);
        }

        function contarCoinc(t1, t2) {
            var cont = 0;
            for (var index = 0; index < t1.length && index < t2.length; index++) {
                if (t1.charAt(index).toLowerCase() == t2.charAt(index).toLowerCase()) {
                    cont++;
                } else {
                    break;
                }
            }
            return cont;
        }
        ;
        var idmayor = -1;
        var cantConincMayor = 0;
        var node = null;
        rootNode.eachChild(function (n) {
            var cont = null;
            cont = contarCoinc(n.attributes.text, Ext.getCmp(idcampobusq).getValue());
            if (cont > cantConincMayor) {
                cantConincMayor = cont;
                idmayor = n.id;
                node = n;
            }
        }, null, null);
        if (node != null)
            trEnt.getSelectionModel().select(node);

    }
};
