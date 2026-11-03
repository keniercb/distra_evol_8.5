Utilidades.Cmp.Cmpcrudasignarentidades = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.idrelacionmodif = null;
    this.arr_tempNodos = [];

    this.CrearVentanaCrudAsignar = function (PostAccionesGestionar, idusuario, idestrctura, accion) {
        this.tfbuscarInvPreCond = new Ext.form.TextField(
            {
                id: 'tfbuscarInvPreCond',
                enableKeyEvents: true,
                regex: /^([a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?-]+ ?[a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?-]*)+$/,
                maxLength: 255,
                width: 110,
                prevTab: 'btnAceptar'
            });
        this.tfbuscarInvPreCondicion = new Ext.form.TextField(
            {
                id: 'tfbuscarInvPreCondicion',
                enableKeyEvents: true,
                regex: /^([a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?-]+ ?[a-zA-Z0-9áéíóúñüÑÁÉÍÓÚ '"%#@!*()_;:,.?-]*)+$/,
                maxLength: 255,
                width: 110
            });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            handler: function () {
                asociarUserEntidad('acep', PostAccionesGestionar, accion);
            },
            text: 'Aceptar',
            nextTab: 'tfbuscarInvPreCond',
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true,
            prevTab: 'btnAplicar'
        });
        ////esto es cosa de julio
        this.BuscarInvolucrados = function (e) {
            _this.BarraProgreso.show('Buscando involucrados');
            var text = _this.tfbuscarInvPreCondicion.getValue();
            if (text) {
                Ext.Ajax.request({
                    url: 'buscarinvolucrados',
                    params: {
                        denominacion: text,
                        permiso: 'adicionar'
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.msj == 3) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        } else
                            _this.setChildren(responseData.nodos, _this.tpUserSubord);
                    }
                });
            } else {
                _this.BarraProgreso.hide();
                _this.tpUserSubord.getRootNode().reload();
                _this.tfbuscarInvPreCondicion.setValue(null);
                _this.tfbuscarInvPreCondicion.focus();
            }
        };

        this.BuscarEstructuras = function (e) {
            _this.BarraProgreso.show('Buscando estructuras');
            var text = _this.tfbuscarInvPreCond.getValue();
            if (text) {
                Ext.Ajax.request({
                    url: 'cargarArbolEntidades',
                    params: {
                        denominacion: text
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.length == 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        } else
                            _this.setChildren(responseData, _this.tpEntidadSubord);
                    }
                });
            } else {
                _this.BarraProgreso.hide();
                _this.tpEntidadSubord.getRootNode().reload();
                _this.tfbuscarInvPreCond.setValue(null);
                _this.tfbuscarInvPreCond.focus();
            }
        };

        this.setChildren = function (childrenNodos, tree) {
            _this.newRootChild = childrenNodos;
            tree.root.eachChild(function (n) {
                if (n.isExpanded())
                    n.collapse(true, false);
                if (n.ui.ctNode.offsetHeight < 3) {
                    if (n.id == 'nodo1' || n.id == 'nodo2' || n.id == 'nodo3' || n.id == 'nodo4')
                        _this.arr_tempNodos.push(n);
                    n.ui.hide();
                }
            });
            tree.root.appendChild(_this.newRootChild);
            tree.render();
        };
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            handler: function () {
                asociarUserEntidad('apl', PostAccionesGestionar, accion);
                _this.btnAplicar.disable();
                _this.btnAceptar.disable();
            },
            text: 'Aplicar',
            nextTab: 'btnAceptar',
            iconCls: 'aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            disabled: true,
            prevTab: 'btnCancelar'
        });

        this.menuNode = new Ext.menu.Menu({
            id: 'menuNode'
        });
        this.btnUserSubord = new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Buscar subordinados',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this,
            handler: function () {
                _this.BuscarInvolucrados();
            }
        });
        this.tpUserSubord = new Ext.tree.TreePanel({
            title: 'Usuarios',
            tbar: ['Buscar:', '', _this.tfbuscarInvPreCondicion, '-',
                _this.btnUserSubord, {
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        _this.tpUserSubord.root.expand(true);
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        _this.tpUserSubord.root.collapse(true);
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        _this.tpUserSubord.getRootNode().reload();
                        _this.tfbuscarInvPreCondicion.setValue(null);
                        _this.tfbuscarInvPreCondicion.focus();
                    }
                }
            ],
            autoScroll: true,
            width: 280,
            split: true,
            root: {
                nodeType: 'async',
                id: 'nodo2',
                idgrupo: 'nodo2',
                text: 'Usuarios subordinados',
                leaf: false
            },
            listeners: {
                'checkchange': function (node, ch) {
                    if (ch) {
                        _this.tpUserSubord.getRootNode().cascade(function (n) {
                            var ui = n.getUI();
                            if (n.id != node.attributes.idusuario)
                                ui.toggleCheck(false);
                        });
                        if (_this.tpEntidadSubord.getChecked()[0]) {
                            _this.btnAceptar.enable();
                            _this.btnAplicar.enable();
                        }
                    } else {
                        _this.btnAceptar.disable();
                        _this.btnAplicar.disable();
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarpermisos/cargargruposyusuarioscheckpara',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            funcionalidadAsoc: (accion == 'mod') ? true : 'no'
                        };
                    },
                    'load': function (atreeloader, anode) {
                        if (accion == 'mod') {
                            _this.tpUserSubord.getRootNode().cascade(function (n) {
                                var ui = n.getUI();
                                if (n.id == idusuario)
                                    ui.toggleCheck(true);
                            });
                        }
                    }
                }
            })
        });
        this.btnEntidadSubord = new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Buscar estructuras',
            handler: function () {
                _this.BuscarEstructuras();
            },
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.tpEntidadSubord = new Ext.tree.TreePanel({
            title: 'Estructuras',
            tbar: ['Buscar:', '', _this.tfbuscarInvPreCond, '-', this.btnEntidadSubord,
                {
                    iconCls: 'expandir',
                    tooltip: 'Expandir agrupación',
                    handler: function () {
                        _this.tpEntidadSubord.root.expand(true);
                    }
                }, {
                    iconCls: 'contraer',
                    tooltip: 'Contraer agrupación',
                    handler: function () {
                        _this.tpEntidadSubord.root.collapse(true);
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar agrupación',
                    handler: function () {
                        _this.tpEntidadSubord.getRootNode().reload();
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
                'checkchange': function (node, ch) {
                    if (ch) {
                        _this.tpEntidadSubord.getRootNode().cascade(function (n) {
                            var ui = n.getUI();
                            if (n.id != node.id)
                                ui.toggleCheck(false);
                        });
                        if (_this.tpUserSubord.getChecked()[0]) {
                            _this.btnAceptar.enable();
                            _this.btnAplicar.enable();
                        }
                    } else {
                        _this.btnAceptar.disable();
                        _this.btnAplicar.disable();
                    }
                },
                'contextmenu': function (node, event) {
                    if (node.attributes.cls) {
                        event.stopEvent();
                        _this.Mostrarmenuarbol(node, event.xy, PostAccionesGestionar);
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/cmpasignarentidades/cargarArbolEntidades',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        var text = _this.tfbuscarInvPreCond.getValue();
                        atreeloader.baseParams = {
                            tipo: anode.attributes.tipo,
                            idgrupo: anode.attributes.idgrupo,
                            denominacion: text
                        };
                    },
                    'load': function (atreeloader, anode) {
                        if (accion == 'mod') {
                            _this.tpEntidadSubord.getRootNode().cascade(function (n) {
                                var ui = n.getUI();
                                if (n.id == idestrctura) {
                                    ui.toggleCheck(true);
                                    _this.idrelacionmodif = n.attributes.idrelacion;
                                } else {
                                    if (n.attributes.idrelacion) {
                                        n.disable();
                                    }
                                }
                            });
                        }
                    }
                }
            })
        });

        if (accion == 'mod') {
            _this.btnAplicar.hide();
            this.titulo = 'Modificar relación estructura/usuario';
        } else {
            this.titulo = 'Adicionar relación estructura/usuario';
        }
        _this.tpPUserSubord = new Ext.Panel({
            width: '50%',
            layout: 'fit',
            region: 'center',
            items: [_this.tpUserSubord],
            usarKeymap: true,
            botonesKeymap: [_this.btnUserSubord]

        });
        _this.tpPEntidadSubord = new Ext.Panel({
            width: '50%',
            region: 'west',
            layout: 'fit',
            items: [_this.tpEntidadSubord],
            usarKeymap: true,
            botonesKeymap: [_this.btnEntidadSubord]
        });
        this.WinCrudRelacion = new Ext.Window({
            title: _this.titulo,
            layout: 'border',
            modal: true,
            constrain: true,
            width: 600,
            closeAction: 'destroy',
            height: 510,
            items: [_this.tpPEntidadSubord, _this.tpPUserSubord],
            buttons: [
                {
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    iconCls: 'cancelar',
                    nextTab: 'btnAplicar',
                    id: 'btnCancelar',
                    handler: function () {
                        _this.WinCrudRelacion.destroy();
                        PostAccionesGestionar(1);
                    }
                },
                _this.btnAplicar,
                _this.btnAceptar
            ]
        });
        _this.WinCrudRelacion.show();
        _this.tfbuscarInvPreCond.focus(false, 1024);
        _this.tpUserSubord.getRootNode().reload();
        _this.tpEntidadSubord.getRootNode().reload();
    };

    function asociarUserEntidad(opcion, PostAccionesGestionar, accion) {
        _this.BarraProgreso.show('Asociando usuario entidad');
        Ext.Ajax.request({
            url: 'adicioanarAsocUserEntidad',
            params: {
                idusuario: _this.tpUserSubord.getChecked()[0].id,
                idestrctura: _this.tpEntidadSubord.getChecked()[0].id,
                accion: accion,
                idrelacion: _this.idrelacionmodif
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.resp == 1 && opcion == 'acep') {
                    if (accion == 'add')
                        mostrarMensaje(1, 'La relación estructura/usuario ha sido adicionada satisfactoriamente.');
                    else
                        mostrarMensaje(1, 'La asociación ha sido modificada satisfactoriamente.');
                    _this.WinCrudRelacion.destroy();
                    PostAccionesGestionar(responseData.resp, 'add');
                } else if (responseData.resp == 1 && opcion == 'apl') {
                    _this.tpUserSubord.getRootNode().reload();
                    _this.tpEntidadSubord.getRootNode().reload();
                    PostAccionesGestionar(responseData.resp, 'apl');
                } else if (responseData.resp == 2) {
                    msje = 'Existe una relación de este usuario con la estructura' + ' ' + responseData.estrucutura + ' ' + 'realizada por' + ' ' + responseData.autor + ' ' + 'el' + ' ' + responseData.fecha + '.' + ' ' + '¿Desea ignorar el conflicto?';
                    mostrarMensaje(2, msje, function (btnoprimido) {
                        if (btnoprimido == 'ok') {
                            _this.BarraProgreso.show('Modificando relación');
                            Ext.Ajax.request({
                                url: 'actualizarUserEstructura',
                                params: {
                                    idusuario: _this.tpUserSubord.getChecked()[0].id,
                                    idrelacion: responseData.idrelacion,
                                    idestrctura: _this.tpEntidadSubord.getChecked()[0].id
                                },
                                callback: function (options, success, response) {
                                    _this.BarraProgreso.hide();
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.mensaje != 1) {
                                        mostrarMensaje(3, 'La asociación que usted quiere modificar ya no se encuentra en los registros.');
                                    }
                                    if (responseData.mensaje == 1) {
                                        mostrarMensaje(1, 'La asociación ha sido modificada satisfactoriamente.');
                                        PostAccionesGestionar(responseData.mensaje, 'add')
                                        _this.WinCrudRelacion.destroy();
                                    }
                                }
                            });
                        }
                    });
                } else if (responseData.resp == 3) {
                    msje = 'Existe una relación de esta estructura con el usuario' + ' ' + responseData.usuario + ' ' + 'realizada por' + ' ' + responseData.autor + ' ' + 'el' + ' ' + responseData.fecha + '.' + ' ' + '¿Desea ignorar el conflicto?';
                    mostrarMensaje(2, msje, function (btnoprimido) {
                        if (btnoprimido == 'ok') {
                            _this.BarraProgreso.show('Modificando relacion');
                            Ext.Ajax.request({
                                url: 'actualizarUserEstructura',
                                params: {
                                    idestrctura: _this.tpEntidadSubord.getChecked()[0].id,
                                    idrelacion: responseData.idrelacion,
                                    idusuario: _this.tpUserSubord.getChecked()[0].id
                                },
                                callback: function (options, success, response) {
                                    _this.BarraProgreso.hide();
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.mensaje != 1) {
                                        mostrarMensaje(3, 'La asociación que usted quiere modificar ya no se encuentra en los registros.', function () {
                                        });
                                    }
                                    if (responseData.mensaje == 1) {
                                        mostrarMensaje(1, 'La asociación ha sido modificada satisfactoriamente.');
                                        _this.WinCrudRelacion.destroy();
                                        PostAccionesGestionar(responseData.mensaje, 'mod')
                                    }
                                }
                            });
                        }
                    });
                } else {
                    msje = 'Existe una relación de esta estructura con el usuario <b>' + responseData.usuario + '</b> y de este usuario con la estructura <b>' + responseData.estructura + '</b>. Presione <b>Aceptar</b> para eliminar dichas relaciones y crear una nueva o <b>Cancelar</b> para desasociar manualmente.';
                    mostrarMensaje(2, msje, function (btnoprimido) {
                        if (btnoprimido == 'ok') {
                            _this.BarraProgreso.show('Realizando cambios');
                            Ext.Ajax.request({
                                url: 'actualizarUserEstructura',
                                params: {
                                    idestrctura: _this.tpEntidadSubord.getChecked()[0].id,
                                    idrelacion: responseData.idrelacion,
                                    idusuario: _this.tpUserSubord.getChecked()[0].id,
                                    idrelacionestruc: responseData.idrelacionestruc
                                },
                                callback: function (options, success, response) {
                                    _this.BarraProgreso.hide();
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.mensaje != 1) {
                                        MostrarMensaje(3, 'La asociación que usted quiere modificar ya no se encuentra en los registros.');
                                    }
                                    if (responseData.mensaje == 1) {
                                        mostrarMensaje(1, 'La asociación ha sido modificada satisfactoriamente.');
                                        _this.WinCrudRelacion.destroy();
                                        PostAccionesGestionar(responseData.mensaje, 'mod')
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    this.Mostrarmenuarbol = function (node, xy, PostAccionesGestionar) {
        if (_this.menuNode.items.length == 0) {
            _this.menuNode.addMenuItem({
                text: 'Desasociar',
                iconCls: 'eliminar',
                tooltip: 'Desasociar estructura al usuario',
                handler: function () {
                    _this.BarraProgreso.show('Desasociando');
                    Ext.Ajax.request({
                        url: 'eliminarAsociacion',
                        params: {
                            idrelacion: node.attributes.idrelacion
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.resp == 1) {
                                mostrarMensaje(1, 'Se ha desasociado satisfactoriamente.');
                                _this.tpEntidadSubord.getRootNode().reload();
                                _this.tpUserSubord.getRootNode().reload();
                                PostAccionesGestionar(1, 'elim');
                            } else {
                                mostrarMensaje(3, 'La asociación que usted quiere modificar ya no se encuentra en los registros.', function () {
                                    _this.tpEntidadSubord.getRootNode().reload();
                                });
                            }
                        }
                    });
                }
            });
        } else {
            _this.menuNode.removeAll();
            _this.Mostrarmenuarbol(node, xy, PostAccionesGestionar);
        }
        _this.menuNode.showAt(xy);
    }

};
