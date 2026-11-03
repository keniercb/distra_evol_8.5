Ext.ns('Ext.erp');
Ext.erp.treedeagrupaciones = Ext.extend(Ext.tree.TreePanel, {
    /*
     * valor que indica si el tree esta expandido totalmente o no
     */
    expandido: false,
    /*
     * valor que indica si cuando hago la instancia del tree voy a utilizar el 
     * tbar, cuando es una llamada externa desde indicadores.
     */
    useTbarExterno: false,
    /*
     * valor que indica si el componenet esta siendo instanciado desde
     *  un componenet externo o no
     */
    llamadaExterna: false,
    constructor: function (config) {
        //Ext.applyIf(this, config);
        var _this = this;
        _this.url = (config.url) ? config.url : "/configuracion/agrupaciones/index.php/atributosporagrupaciones/";
        if (config.llamadaExterna) {
            _this.llamadaExterna = config.llamadaExterna;
        }
        if (_this.llamadaExterna) {
            Ext.Ajax.request({
                url: _this.url + 'cargaretiquetas',
                method: 'POST',
                callback: function (options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    _this.idioma = rd;
                    //_this.layout = 'border';
                    _this._initComponent(config);
                }
            });
        } else {
            _this.idioma = config.idioma;
            _this._initComponent(config);
        }
        //Ext.apply(this, config);
        //Ext.erp.treedeagrupaciones.superclass.constructor.call(this, arguments);
        Ext.erp.treedeagrupaciones.superclass.constructor.apply(this, arguments);
    },
    _initComponent: function (config) {
        var _this = this;
        _this.mostrarTbar = config.mostrarTbar;
        _this.forceChildrenToParents = true;
        _this.cargando = false;
        _this.chequeada = "";
        _this.contador = 0;
        _this.modificandoHijos = false;
        if (_this.useTbarExterno == true) {
            _this.buildTbarExterno();
        }
        if (_this.concheck) {
            _this.arrayMarcadosBD = Array();
            _this.arrayAgrupacionesMarcadosBD = Array();
            _this.listeners = {
                'checkchange': function (nodo, checked) {
                    if (nodo.isLeaf()) {
                        var padre = nodo.parentNode;
                        var denomPapa = padre.getUI().node.attributes.denominacion;
                        padre.getUI().textNode.innerHTML = '<span style="font-weight: bold;">' + denomPapa + '</span>';
                        if (checked != padre.attributes.checked) {
                            if (!checked) {
                                var arregloHijosNodo = new Array();
                                for (var i = 0; i < padre.childNodes.length; i++) {
                                    arregloHijosNodo.push({
                                        idatributo: padre.childNodes[i].attributes.idatributo,
                                        valor: padre.childNodes[i].attributes.checked
                                    });
                                }
                                padre.getUI().toggleCheck(false);
                                var verificaPadreHijos = false;

                                for (var i = 0; i < arregloHijosNodo.length; i++) {
                                    var child = padre.findChild('idatributo', arregloHijosNodo[i].idatributo);
                                    child.getUI().toggleCheck(arregloHijosNodo[i].valor);
                                }

                            } else {
                                var marca = true;
                                for (var i = 0; i < padre.childNodes.length; i++) {
                                    if (checked && !padre.childNodes[i].attributes.checked) {
                                        marca = false;
                                        break;
                                    }
                                }
                                if (marca) {
                                    padre.getUI().toggleCheck(true);
                                }
                            }
                        } else {
                            var corrrigeDeno = true;
                            for (var i = 0; i < padre.childNodes.length; i++) {
                                if (padre.childNodes[i].attributes.checked) {
                                    corrrigeDeno = false;
                                    break;
                                }
                            }
                            if (corrrigeDeno) {
                                var arregloDen = padre.getUI().node.attributes.text.split('<span style="font-weight: bold;">');
                                var denomPapa = padre.getUI().node.attributes.text;
                                if (arregloDen.length == 2) {
                                    denomPapa = arregloDen[1].split('</span>')[0];
                                }
                                padre.getUI().textNode.innerHTML = '<span style="font-weight: normal;">' + denomPapa + '</span>';
                            }
                        }

                    }
                    if (!nodo.loaded) {
                        nodo.expand();
                        if (!checked) {
                            nodo.getUI().textNode.innerHTML = nodo.attributes.denominacion;
                        }

                    } else {
                        for (var i = 0; i < nodo.childNodes.length; i++) {
                            if (checked != nodo.childNodes[i].attributes.checked) {
                                nodo.childNodes[i].getUI().toggleCheck(checked);
                            }
                        }
                    }
                    //_this.fn(_this.getChecked(), _this.arrayMarcadosBD);
                }
            }

        } else {
            _this.getSelectionModel().on('selectionchange', function () {
                var nodo = _this.getNodoSeleccionado();
                if (nodo.id != 0) {
                    _this.habilitarBotones();
                } else {
                    _this.desabilitarBotones();
                }
                _this.fn(nodo);
            });
        }
        /*
         *  Creo el "TreeLoader" del árbol
         */
        /*_this.getEl()*/
        _this.LoadMaskTree = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando atributos din&aacute;micos asociados ..."});
        this.loader = new Ext.tree.TreeLoader({
            baseParams: {
                concheck: (config.concheck) ? 2 : -1
            },
            dataUrl: _this.url + 'cargaragrupaciones',
            listeners: {
                beforeload: function (Obj, node, callback) {
                    _this.cargando = true;
                    _this.LoadMaskTree.show();
                    if (config.concheck) {
                        if (node.attributes.checked) {
                            Obj.baseParams.marcaHijos = 2;
                        } else {
                            var comprobar = _this.arrayAgrupacionesMarcadosBD.indexOf(node.attributes.idagrupacion);
                            if (comprobar != -1) {
                                Obj.baseParams.marcaHijos = 1;
                            } else {
                                Obj.baseParams.marcaHijos = -1;
                            }
                        }
                    } else {
                        Obj.baseParams.marcaHijos = -1;
                    }
                    if (_this.idindicador) {
                        Obj.baseParams.idindicador = _this.idindicador;
                    }
                },
                load: function (obj, node, response) {
                    var valores = Ext.decode(response.responseText);
                    _this.cargando = false;
                    window.setTimeout(function () {
                        _this.LoadMaskTree.hide();
                    }, 200);
                    if (node.id == 0) {
                        _this.arrayMarcadosBD = Array();
                        _this.arrayAgrupacionesMarcadosBD = Array();
                    }
                    for (var i = 0; i < valores.length; i++) {
                        if (valores[i].marcado) {
                            _this.arrayMarcadosBD.push(valores[i].idatributo);
                            _this.arrayAgrupacionesMarcadosBD.push(valores[i].idagrupacion);
                        }
                    }
                    /*if (_this.concheck) {
                     _this.fn(_this.getChecked(), _this.arrayMarcadosBD);
                     }*/
                }
            }
        });

        /*
         *  Creo el nodo padre del árbol el cual se identificará por tener id 0
         */
        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            text: 'Datos del medio',
            expanded: false,
            animate: false,
            leaf: false
        });

        this.tfBusqueda = new Ext.form.TextField({
            width: 220,
            emptyText: 'Buscar',
            listeners: {
                'specialkey': function (t, e) {
                    if (e.getKey() == 13) {
                        _this.filtrarArbol();
                    }
                }
            }
        });

        _this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            disabled: false,
            text: _this.idioma.lbBtnAdicionar,
            //tooltip: _this.idioma.TooltbtnAdicionar,
            handler: function () {
                _this.gestAgrupAdd('adic');
            },
            listeners: {
                'render': function (p) {
                    var theTip = null;

                    p.getEl().on('mouseover', function () {
                        theTip = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.getPosition();
                        var x = pos[0] + 30;
                        var y = pos[1] + 50;
                        var text = "";
                        if (_this.getNodoSeleccionado().attributes.id == 0 || !_this.getNodoSeleccionado()) {
                            text = _this.idioma.TooltbtnAdicionar;
                        } else {
                            text = _this.idioma.TooltbtnAdicionarAtri;
                        }

                        theTip.html = text;
                        theTip.showAt([x, y]);
                    });

                    p.getEl().on('mouseout', function () {
                        if (theTip)
                            theTip.hide();
                    });
                }
            }
        });
        _this.btnModificar = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            text: _this.idioma.lbBtnModificar,
            //tooltip: _this.idioma.TooltbtnModificar,
            handler: function () {
                _this.gestAgrupAdd('modif');
            },
            listeners: {
                'render': function (p) {
                    var theTip2 = null;
                    p.getEl().on('mouseover', function () {
                        theTip2 = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.getPosition();
                        var x = pos[0] + 120;
                        var y = pos[1] + 50;
                        var text = "";
                        if (_this.getNodoSeleccionado().attributes.id == 0 || !_this.getNodoSeleccionado()) {
                            text = _this.idioma.TooltbtnModificar;
                        } else {
                            text = _this.idioma.TooltbtnModificarAtri;
                        }

                        theTip2.html = text;
                        theTip2.showAt([x, y]);
                    });

                    p.getEl().on('mouseout', function () {
                        if (theTip2)
                            theTip2.hide();
                    });
                }
            }
        });
        _this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            text: _this.idioma.lbBtnEliminar,
            //tooltip: _this.idioma.TooltbtnEliminar,
            handler: function () {
                if (_this.getNodoSeleccionado()) {
                    _this.eliminarAgrupacion();
                } else {
                    mostrarMensaje(1, _this.idioma.lbSeleccionarDel);
                }
            },
            listeners: {
                'render': function (p) {
                    var theTip3 = null;

                    p.getEl().on('mouseover', function () {
                        theTip3 = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.getPosition();
                        var x = pos[0] + 190;
                        var y = pos[1] + 50;
                        var text = "";
                        if (_this.getNodoSeleccionado().attributes.id == 0 || !_this.getNodoSeleccionado()) {
                            text = _this.idioma.TooltbtnEliminar;
                        } else {
                            text = _this.idioma.TooltbtnEliminarAtri;
                        }

                        theTip3.html = text;
                        theTip3.showAt([x, y]);
                    });

                    p.getEl().on('mouseout', function () {
                        if (theTip3)
                            theTip3.hide();
                    });
                }
            }
        });
        if (!config.tbar && _this.mostrarTbar) {
            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar];
        }

        if (config.utilizarDD) {
            this.enableDD = true;
            var padreDrop = "";
            this.listeners = {

                'dragdrop': function (cmp, node, dd, event) {

                }

                ,
                'nodedragover': function (dragOverEvent) {
                }

                ,
                'nodedrop': function (dropEvent) {
                    var nodo = dropEvent.dropNode;
                    var destino = dropEvent.target;
                    if (nodo.attributes.idatributo) {
                        mostrarMensaje(2, "\xbfEst\xe1 seguro que quiere modificar el atributo seleccionado\x3f", function (btn) {
                            if (btn == 'ok') {
                                Ext.Ajax.request({
                                    url: 'adicionarAtributo',
                                    method: 'POST',
                                    params: {
                                        drag: 1,
                                        idatributo: nodo.attributes.idatributo,
                                        idagrupacion: destino.id
                                    },
                                    callback: function (options, success, response) {
                                        response = Ext.util.JSON.decode(response.responseText);
                                        //Ext.getBody().unmask();
                                        // LoadMask.hide();
                                        if (response.codigoMsg == 3)
                                            mostrarMensaje(1, _this.idioma.lbGuardarError);
                                        if (response.codigoMsg == 2)
                                            mostrarMensaje(1, _this.idioma.lbModificarUso + response.denominaciones);
                                        else {
                                            mostrarMensaje(1, _this.idioma.lbModificarOk);

                                        }
                                        _this.getLoader().load(_this.getNodeById(padreDrop), function () {
                                            _this.getNodeById(padreDrop).expand();
                                        });
                                        _this.getLoader().load(destino, function () {
                                            destino.expand();
                                        });
                                    }
                                });

                            } else {
                                _this.getLoader().load(_this.getNodeById(padreDrop), function () {
                                    _this.getNodeById(padreDrop).expand();
                                });
                                _this.getLoader().load(destino, function () {
                                    destino.expand();
                                });
                            }
                        });
                    } else {
                        _this.getLoader().load(_this.getRootNode(), function () {
                            _this.getRootNode().expand();
                        });
                    }

                }

                ,
                'startdrag': function (TreePanel, TreeNode, event) {
                    padreDrop = TreeNode.attributes._parent;
                }

            };


        }
        this.autoScroll = true;
        if (_this.llamadaExterna) {
        Ext.erp.treedeagrupaciones.superclass.initComponent.call(this);
        this.show();
        }
        //this.show();
    },
    buildTbarExterno: function () {
        var _this = this;
        _this.btnExpandir = new Ext.Button({
            iconCls: 'cambiar',
            id: 'idbtnexpandirTree',
            text: 'Expandir',
            //tooltip: _this.idioma.lbTtBtnExpandir,
            handler: function (btn) {
                if (!_this.expandido) {
                    _this.expandAll();
                    btn.setText('Contraer');
                    _this.expandido = true;
                } else {
                    _this.collapseAll();
                    btn.setText('Expandir');
                    _this.expandido = false;
                }
            },
            listeners: {
                'render': function (p) {
                    //var theTip = null;
                    p.getEl().on('mouseover', function () {
                        theTipBt = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.getPosition();
                        var x = pos[0] + 30;
                        var y = pos[1] + 30;
                        var text = (!_this.expandido) ? 'Expandir' : 'contraer';
                        theTipBt.html = text;
                        theTipBt.showAt([x, y]);
                    });

                    p.getEl().on('mouseout', function () {
                        if (theTipBt)
                            theTipBt.hide();
                    });
                }
            }
        });
        var arrayEnviar = Array();
        var arrayEliminar = Array();
        var todosCheck = Array();

        function asociarIndicador(btn) {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Por favor espere..."});
            myMask.show();
            if (btn != 'cancel') {
                Ext.Ajax.request({
                    url: '/configuracion/nomdinamicos/index.php/indicadoresatributosdinamicos/asociarAtributos',
                    method: 'POST',
                    timeout: '9999999999999999',
                    params: {
                        idatributos: Ext.encode(arrayEnviar),
                        idObjeto: _this.content.selectedNode.data.id,
                        idtablageneral: _this.content.selectedNode.data.idtablageneral,
                        idtabla: _this.content.selectedNode.data.idtabla,
                        eliminarIdsAtri: Ext.encode(arrayEliminar),
                        prefijoTabla: "indicadores",
                        btn: btn,
                        schema: "mod_datosmaestrosmeta",
                        tftabla: "mod_datosmaestrosmeta."
                    },
                    callback: function (options, success, response) {
                        var res = Ext.decode(response.responseText);
                        myMask.hide();
                        if (res.cod == 1) {
                            mostrarMensaje(1, 'El(Los) atributo(s) ha(n) sido guardado(s) satisfactoriamente.');
                            var idtabla = null;
                            var columna = null;
                            if (res.datos.idtabla) {
                                idtabla = res.datos.idtabla;
                                columna = res.datos.columna;
                            }
                            _this.postAsociar(idtabla, columna);
                            _this.getLoader().load(_this.getRootNode(), function () {
                                _this.getRootNode().expand();
                            });
                        } else if (res.cod == 3) {
                            mostrarMensaje(1, 'Ha ocurrido un error mientras se guardaba(n) el(los) atributo(s).');
                        } else if (res.cod == 2) {
                            var stringduplicados = '';
                            for (var i = 0; i < res.arregloduplicados.length; i++) {
                                stringduplicados += res.arregloduplicados[i] + ", ";
                            }
                            mostrarMensaje(1, 'El(Los) atributo(s) ' + stringduplicados + ' ya se encontraba(n) asociado(s) al indicador.');
                            _this.getLoader().load(_this.getRootNode(), function () {
                                _this.getRootNode().expand();
                            });
                        }
                        else if (res.cod == 4) {
                            mostrarMensaje(1, 'El(Los) atributo(s) que quiere asociar (es)son de car&aacute;cter obligatorio y ya existen datos insertados en la tabla.');
                            _this.getLoader().load(_this.getRootNode(), function () {
                                _this.getRootNode().expand();
                            });
                        } else if (res.cod == 5) {
                            mostrarMensaje(2, 'El(Los) atributo(s) que quiere desasociar se encuentra(n) en uso, \xbfest\xe1 seguro que quiere modificarlo(s)\x3f', prepararAsociar);
                            /*_this.getLoader().load(_this.getRootNode(), function () {
                             _this.getRootNode().expand();
                             });*/
                        }
                        arrayEnviar = Array();
                        arrayEliminar = Array();
                        todosCheck = Array();
                    }
                });
            } else {
                myMask.hide();
            }
        }

        function prepararAsociar(btn) {
            for (var i = 0; i < _this.getChecked().length; i++) {
                if (_this.getChecked()[i].attributes.idatributo) {
                    var verificarAtri = _this.arrayMarcadosBD.indexOf(_this.getChecked()[i].attributes.idatributo);
                    if (verificarAtri == -1) {
                        var obj = {
                            idatributo: _this.getChecked()[i].attributes.idatributo,
                            idagrupacion: _this.getChecked()[i].attributes.idagrupacion
                        };
                        arrayEnviar.push(obj);
                    }
                    todosCheck.push(_this.getChecked()[i].attributes.idatributo);
                }
            }

            for (var j = 0; j < _this.arrayMarcadosBD.length; j++) {
                var verificarAtriDel = todosCheck.indexOf(_this.arrayMarcadosBD[j]);
                if (verificarAtriDel == -1) {
                    arrayEliminar.push(_this.arrayMarcadosBD[j]);
                }
            }
            if (arrayEnviar.length > 0 || arrayEliminar.length > 0) {

                asociarIndicador(btn);

            } else {
                mostrarMensaje(1, "No ha realizado cambios al medio.");
            }
        }

        _this.btnAsociar = new Ext.Button({
            iconCls: 'guardar',
            id: 'idbtnasociar',
            disabled: true,
            text: 'Guardar',
            tooltip: 'Guardar los cambios realizados', //_this.idioma.lbTtBtnAsociar,
            handler: function () {
                if (_this.content.selectedNode.data.id == 0 || _this.content.selectedNode.data.id == null) {
                    mostrarMensaje(1, "El nodo seleccionado no puede ser la raiz del arbol.");
                    return;
                }

                //_this.fn(_this.getChecked(), _this.arrayMarcadosBD);
                /*
                 * 
                 * fn: function(nodos, arrayMarcadosBD) {
                 _this.nodosChekeados = nodos;
                 _this.arrayMarcadosBD = arrayMarcadosBD;
                 }
                 */
                prepararAsociar();


            }
        });
        _this.tbar = [_this.btnExpandir, '->', _this.btnAsociar];
    },
    /**
     *  Devuelve el nodo padre del nodo seleccionado en el árbol
     *  @return node
     */
    getPadreNodoSeleccionado: function () {
        var node = this.getSelectionModel().selNode.parentNode;

        return (node) ? node : (this.getRootNode());
    },
    /**
     *  Devuelve el nivel en que se encuentra el nodo seleccionado en el árbol
     *  @return integer
     */
    getNivelSeleccionado: function () {
        return this.getNodoSeleccionado().getDepth();
    },
    eliminar: function (_function) {
        var _this = this;

        var nodo = this.getNodoSeleccionado();
        var nodoPadre = this.getPadreNodoSeleccionado();
        var arreglo = new Array();

        arreglo.push(nodo.id);

        _function(arreglo, function () {
            _this.loader.load(nodoPadre);
            nodoPadre.expand();
        });
    },
    /**
     *  Devuelve el nodo seleccionado en el árbol
     *  @return node
     */
    getNodoSeleccionado: function () {
        if (this.getSelectionModel().getSelectedNode())
            return this.getSelectionModel().getSelectedNode();

        return this.getRootNode();
    },
    getDataNodoSeleccionado: function () {
        return this.getNodoSeleccionado().attributes;
    },
    setDataNodoSeleccionado: function (columna, newValor) {
        var attributes = this.getNodoSeleccionado().attributes;
        attributes[columna] = newValor;

        this.getNodoSeleccionado().attributes = attributes;
    },
    gestAgrupAdd: function (opcion) {
        var _this = this;
        if (opcion == 'adic') {
            if (_this.getNodoSeleccionado().attributes.id == 0 || !_this.getNodoSeleccionado()) {
                if (!_this.ventanaAgrupacion || !_this.ventanaAgrupacion.isVisible()) {
                    _this.winGestAgrupacion(opcion);
                }
            } else {
                if (!_this.padre.panelAtributos.wingestAtrib || !_this.padre.panelAtributos.wingestAtrib.isVisible()) {
                    _this.padre.panelAtributos.winGestAtributo(opcion);
                }
            }
        } else {
            if (_this.getNodoSeleccionado().attributes.agrup == 1) {
                if (!_this.ventanaAgrupacion || !_this.ventanaAgrupacion.isVisible()) {
                    _this.winGestAgrupacion(opcion);
                }
            } else {
                if (!_this.padre.panelAtributos.ventanaMod || !_this.padre.panelAtributos.ventanaMod.isVisible()) {
                    _this.padre.panelAtributos.winGestAtributo(opcion);
                }
            }
        }
    },
    winGestAgrupacion: function (opcion) {
        var _this = this;
        _this.btnAceptarWinGestAgrupa = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtAceptar,
            handler: function () {
                _this.adicionarAgrupacion(opcion);
            }
        });
        _this.btnAplicarWinGestAgrupa = new Ext.Button({
            iconCls: 'aplicar',
            text: _this.idioma.lbBtnAplicar,
            tooltip: _this.idioma.lbTtAplicar,
            handler: function () {
                _this.adicionarAgrupacion(opcion, true);
            }
        });
        _this.btnCancelarWinGestAgrupa = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtCancelar,
            handler: function () {
                _this.ventanaAgrupacion.close();
            }
        });

        _this.ventanaAgrupacion = new Ext.erp.wingestDenomGener({
            idioma: _this.idioma,
            title: (opcion == 'adic') ? _this.idioma.lbTitleWinAddAgrup : _this.idioma.lbTitleWinModAgrup,
            //valueText: (opcion == 'modif') ? _this.getNodoSeleccionado().attributes.text : null,
            record: (opcion == 'modif') ? {data: _this.getNodoSeleccionado().attributes} : null,
            closeAction: 'close',
            btnCancelarWinGestAgrupa: _this.btnCancelarWinGestAgrupa,
            btnAplicarWinGestAgrupa: _this.btnAplicarWinGestAgrupa,
            btnAceptarWinGestAgrupa: _this.btnAceptarWinGestAgrupa,
            opcion: opcion,
            buttons: [_this.btnCancelarWinGestAgrupa, _this.btnAplicarWinGestAgrupa, _this.btnAceptarWinGestAgrupa]
        });
        if (opcion == 'modif') {
            _this.ventanaAgrupacion.buttons[1].hide();
        }
        /*
         var validador = new FormValidator({
         buttons: [_this.btnAceptarWinGestAgrupa, _this.btnAplicarWinGestAgrupa],
         buttonsRegister: [_this.btnCancelarWinGestAgrupa],
         fields: [_this.ventanaAgrupacion.textArea],
         keyMapContainer: _this.ventanaAgrupacion
         });
         */
        _this.ventanaAgrupacion.show();
    },
    trimvalores: function (cadena) {
        //  var valor1 = cadena.replace(/^\s+/g, '');
        //  var valor2 = valor1.replace(/\s/g, '');
        //  var result = valor2.replace(" ", "");
        return cadena.toLowerCase();
    },
    adicionarAgrupacion: function (option, aplicar) {
        var _this = this;
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: (option == 'modif') ? "Modificando..." : _this.idioma.lbAdicionando});

        if (_this.ventanaAgrupacion.form.getForm().isValid() && this.ventanaAgrupacion.textArea.valido == true) {
            //  var denominacion=_this.trimvalores(this.ventanaAgrupacion.textArea.getValue());            
            myMask.show();
            if (!aplicar)
                _this.ventanaAgrupacion.close();
            var idNodo = null;

            if (option == 'modif') {
                idNodo = _this.getNodoSeleccionado().attributes.id;
            }
            _this.ventanaAgrupacion.form.getForm().submit({
                url: 'adicionarAgrupacion',
                method: 'POST',
                params: {
                    denominacion: _this.ventanaAgrupacion.textArea.getValue(),
                    nodo: idNodo
                },
                waitMsg: _this.idioma.lbEsperand,
                failure: function (form, action) {
                    myMask.hide();
                    var response = Ext.util.JSON.decode(action.response.responseText);
                    if (response.Msg == 3) {
                        var mensaje = _this.idioma.lbMsgAdicionarError;
                        if (option == 'modif') {
                            mensaje = _this.idioma.lbMsgModificarError;
                        }
                        mostrarMensaje(1, mensaje);
                    }
                    if (response.Msg == 2) {
                        mensaje = _this.idioma.lbMsgAgrupacionDuplicadaError;
                        mostrarMensaje(1, mensaje);
                    }
                    else {
                        _this.btnAplicarWinGestAgrupa.disable();
                        _this.btnAceptarWinGestAgrupa.disable();
                        _this.ventanaAgrupacion.form.getForm().reset();
                        mostrarMensaje(1, (option == 'modif') ? _this.idioma.lbMsgModificar : _this.idioma.lbMsgAdicionar);
                        _this.getLoader().load(_this.getRootNode(), function () {
                            _this.getRootNode().expand();
                        });
                    }
                }
            })
        } else {
            mostrarMensaje(1, _this.idioma.lbCamposIncorrectos);
        }
    },
    eliminarAgrupacion: function () {
        var _this = this;
        var nodo = _this.getNodoSeleccionado();
        if (nodo.id != 0) {
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var myMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.lbWaitnMsgeliminar});
                    myMask.show();
                    Ext.Ajax.request({
                        url: 'eliminarAgrupacion',
                        method: 'POST',
                        params: {
                            idagrupacion: nodo.attributes.id
                        },
                        callback: function (options, success, response) {
                            response = Ext.util.JSON.decode(response.responseText);
                            myMask.hide();
                            if (response.Msg == 3) {
                                mostrarMensaje(1, _this.idioma.lbMsgEliminarError);

                            } else if (response.Msg == 1) {
                                mostrarMensaje(1, _this.idioma.lbMsgEliminar);
                                _this.getLoader().load(_this.getRootNode(), function () {
                                    _this.getRootNode().expand();
                                });
                                _this.padre.panelAtributos.setTitle("Datos del medio");
                                _this.padre.panelAtributos.grid.getStore().baseParams = {};
                                _this.padre.panelAtributos.grid.getStore().load();
                            } else if (response.Msg == 2) {
                                mostrarMensaje(1, _this.idioma.lbMsgEliminarErrorInd + response.denominaciones);
                            }

                        }
                    });
                }
            }

            if (nodo.attributes) {
                if (nodo.attributes.agrup == 0) {
                    _this.padre.panelAtributos.eliminarAtributo('tree');
                } else {
                    mostrarMensaje(2, _this.idioma.lbConfirmDelAgrupacion, elimina);
                }
            } else {
                mostrarMensaje(1, _this.idioma.lbSeleccionarDel);
            }
        }
    },
    habilitarBotones: function () {
        this.btnModificar.enable();
        this.btnEliminar.enable();
    },
    desabilitarBotones: function () {
        this.btnModificar.disable();
        this.btnEliminar.disable();
    },
    CascadeUnCheked: function (node, checked) {
        var _this = this;
        _this.checkParent(node, checked);
        node.cascade(function (n) {
            if (n.attributes.id != node.attributes.id) {
                n.getUI().toggleCheck(checked);
                n.attributes.checked = checked;
                this.fireEvent("checkchange", this, checked);
            }
        });
        if (node.parentNode && node.parentNode.attributes.checked
            && _this.checkedChild(node.parentNode) == 0) {

            node.parentNode.getUI().addClass('complete');
            node.parentNode.getUI().toggleCheck(checked);
        }
        _this.contador = 0;
        _this.chequeada = "";
    },
    UncheckOrCheckParent: function (node, checked, checkear) {
        var _this = this;
        if (checked) {
            _this.CascadeChecked(node, checked, checkear);

        } else {
            _this.CascadeUnCheked(node, checked);
        }
    },
    CascadeChecked: function (node, checked) {
        var _this = this;
        _this.checkParent(node, checked);
        if (node.childNodes)
            _this.checkChild(node, checked);
        if (_this.checkedChild(node) == node.childNodes.length
            && node.id == _this.chequeada)
            _this.chequeada = "";
    },
    checkParent: function (node, checked) {

        if (node.parentNode && !node.parentNode.attributes.checked) {
            node.parentNode.getUI().addClass('complete');
            node.parentNode.getUI().toggleCheck(checked);
        } else {
            node.parentNode.getUI().removeClass('complete');
            node.parentNode.getUI().toggleCheck(checked);
        }

    }, checkChild: function (node, checked) {

        var _this = this;
        node.getUI().toggleCheck(checked);
        /*if(checked)
         node.parentNode.getUI().addClass('complete');
         else
         node.parentNode.getUI().removeClass('complete');
         */

    },
    isAncestro: function (node, ancestro) {
        var _this = this;
        if (!node.parentNode)
            return false;
        return (node.parentNode.idatributo == ancestro || _this.isAncestro(
            node.parentNode, ancestro));
    }, checkedChild: function (parentNode) {
        var cantidad = 0;
        if (parentNode.childNodes) {
            var nodeList = parentNode.childNodes;
            for (var i in nodeList) {
                if (nodeList[i].attributes
                    && nodeList[i].attributes.id != parentNode.attributes.id)
                    if (nodeList[i].attributes.checked)
                        cantidad++;
            }
        }
        return cantidad;
    }
});
