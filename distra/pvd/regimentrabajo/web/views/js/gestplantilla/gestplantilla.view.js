Ext.ns('Pvd.ControlAsistencia.GestPlantilla');
//Vista del componente.
Pvd.ControlAsistencia.GestPlantilla.Vista = {

    init: function (idioma, modelo) {
        var self = this;
        this.externo = false
        this.event = null;
        this.languaje = idioma;

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaGestPlantilla',
            text: idioma.btnAyuda,
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });



        this.estructura = new Ext.estructura.panel.PanelEstructura({
            region: 'center',
            split: true,
            margins: '5 0 5 5',
            id: 'panelestructura',
            //isGestionProyecto:true,
            //Otros parametros
            inicial: perfil.idestructuracomun, // codigo|id, Indica a partir de que estructura debe abrir el arbol
            //cargos: false, //Para que no salgan los cargos
            checker: [7]//true | [2,7,9],  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
            //checked: {
            //  id:       [100000011],
            //  concepto: [3]
            //}  //Marca chequeado todos o las estructuras especificas
            //limit: [1,2,3,4,5,6,7,8,9]  //Define los conceptos que no se deben expandir
            //menu: false //Muestra u oculta el context menu por defecto true
        });
        this.estructura.tree.enableDD = true;

        var panelestructura = new Ext.Panel({
            items: [this.estructura],
            title: idioma.lbTitPanelEst,
            region: 'west',
            layout: 'fit',
            width: '27%',
            collapsible: true,
            frame: false,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0'
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            emptyText: idioma.lbMsgcriterioBuscar,
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.lbBtnBuscar,
            tooltip: idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.lbBtnLimpiar,
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });


        this.btnEliminarPersona = new Ext.Button({
            id: 'btnEliminarPersona',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipDelpersona,
            disabled: true,
            iconCls: 'eliminar'
        });

        this.btnCambiarPersona = new Ext.Button({
            id: 'btnCambiarPersona',
            text: idioma.lbBtnCambiar,
            tooltip: idioma.textToolTipCambiar,
            iconCls: 'cambiar',
            disabled: true

        });

        this.btnPFP = new Ext.Button({
            id: 'btnPFP',
            text: idioma.lbBtnAdicionarPFP,
            tooltip: idioma.textToolTipBtnAdicionarPFP,
            iconCls: 'adicionar',
            disabled: true
        });

       /* var smPersona = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });*/

        var smPersona = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });

        this.listado = new Ext.grid.GridPanel({
            id: 'listadoPersonas',
            title:idioma.lbTitleListadoPersonasAsociadas,
            store: modelo.fuenteDatosListado,
            loadMask: {msg: idioma.lbMsgmasklistado},
            sm: smPersona,
           // enableDragDrop: true,
            //ddGroup: 'grid2tree',
            region: 'east',
            collapsible:true,
            //collapsed:true,
            view: new Ext.grid.GroupingView({
                groupByText:' ',
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            split:true,
            width:'35%',
            stripeRows: true,
            height: 527,
            columns: [//new Ext.grid.RowNumberer(),
                smPersona,
                {header: 'idpersona', width: 100, hidden: true, dataIndex: 'idpersona', id: 'idpersona'},
               // {header: 'No identidad', width: 100,hidden: true, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', width: 150, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 225, dataIndex: 'denomcargo'},
                {header: 'Procedencia', width:100,hidden:true,hideable:false, dataIndex: 'subordinacion'},

            ],
            tbar: [this.btnPFP, this.btnCambiarPersona, this.btnEliminarPersona,'-',
                this.tfbuscar, '',
                this.btnBuscar,
                this.btnLimpiar,'-'
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.fuenteDatosListado,
                displayInfo: true

            })
        });


        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipDel,
            iconCls: 'eliminar',
            disabled: true
        });



        this.btnCambiar = new Ext.Button({
            id: 'btnCambiar',
            text: idioma.lbBtnCambiar,
            tooltip: idioma.textToolTipCambiar,
            iconCls: 'cambiar',
            disabled: true
        });

        var btnExpandAllNodes = new Ext.Button({
            tooltip: idioma.textToolTipExp,
            iconCls: 'expand_all',
            handler: function () {
                self.tree.expandAll();
            }
        });

        var btnColapseAllNodes = new Ext.Button({
            tooltip: idioma.textToolTipCont,
            iconCls: 'collapse_all',
            handler: function () {
                self.tree.collapseAll();
            }
        });

        Ext.override(Ext.tree.TreeDropZone, {
            completeDrop: function (de) {
                var ns = de.dropNode, p = de.point, t = de.target;
                if (!Ext.isArray(ns)) {
                    ns = [ns];
                }
                var n, node, ins = false;
                if (p != 'append') {
                    ins = true;
                    node = (p == 'above') ? t : t.nextSibling;
                }
                for (var i = 0, len = ns.length; i < len; i++) {
                    n = ns[i];
                    if (ins) {
                        t.parentNode.insertBefore(n, node);
                    } else {
                        t.appendChild(n);
                    }
                    if (Ext.enableFx && this.tree.hlDrop) {
                        n.ui.highlight();
                    }
                }
                ns[0].ui.focus();
                t.ui.endDrop();
                this.tree.fireEvent("nodedrop", de);
            }

        });
        this.maskara = new Ext.LoadMask(Ext.getBody(), {msg: idioma.lbMsgmaskGuardar});

        //Arbol de las personas
        //var _self = this;
        //var Tree = Ext.tree;
        //this.tree = new Ext.ux.MultiSelectTreePanel({
        //    title: idioma.lbTitPanelEstAsist,
        //    region: 'east',
        //    width: '45%',
        //    margins: '0 0 0 0',
        //    split:true,
        //    animate: true,
        //    useArrows: true,
        //    autoScroll: true,
        //    rootVisible: true,
        //    loader: modelo.fuenteDatos,
        //    containerScroll: true,
        //    listeners: {
        //        beforenodedrop: function (e) {
        //            if (Ext.isArray(e.data.selections)) {
        //
        //                var scope = this;
        //                e.dropNode = [];
        //                var r;
        //                var node;
        //                var res = new Array;
        //                var a = 0;
        //                var idspersonas = new Array;
        //                var camino = e.target.getPath();
        //                var str = camino.split("/");
        //                for (var i = 1; i < str.length; i++) {
        //                    res.push(str[i]);
        //                }
        //                for (var i = 0; i < e.data.selections.length; i++) {
        //                    a = 0;
        //                    r = e.data.selections[i];
        //                    if (e.data.selections[i].get('idpersona') != e.target.attributes.idpersona) {
        //                        Ext.each(res, function (rec) {
        //                            node = e.tree.getNodeById(rec);
        //                            if (node.attributes.idpersona == e.data.selections[i].get('idpersona')) {
        //                                a = 1;
        //                            }
        //                        });
        //                        if (a == 0) {
        //                            idspersonas.push(e.data.selections[i].get('idpersona'));
        //                        }
        //                    }
        //                }
        //
        //                e.cancel = false;
        //                _self.maskara.show();
        //                Ext.Ajax.request({
        //                    url: 'guardarPersonasAsistencia',
        //                    params: {
        //                        idspersonas: Ext.encode(idspersonas),
        //                        idpadre: e.target.attributes.id,
        //                    },
        //                    method: "POST",
        //                    callback: function () {
        //
        //                    },
        //                    success: function (r) {
        //                        var resp = Ext.decode(r.responseText);
        //                        _self.maskara.hide();
        //                        var aux = '';
        //                        var personas = '';
        //                        Ext.each(resp.array, function (rec) {
        //                            aux += rec + ', ';
        //                        });
        //                        personas = aux.substring(0, aux.length - 2);
        //
        //                        if (resp.msj == 1) {
        //                            if (resp.array.length > 1) {
        //                                mostrarMensaje(3, personas + ' no pueden ser adicionados porque no tienen régimen de trabajo.');
        //                            } else {
        //                                mostrarMensaje(3, personas + ' no puede ser adicionado porque no tiene régimen de trabajo.');
        //                            }
        //                        }
        //                        if (resp.existe == 0) {
        //                            var camino = e.target.getPath();
        //                            e.tree.getRootNode().reload(function () {
        //                                e.tree.expandPath(camino);
        //                            });
        //                            mostrarMensaje(1, idioma.lbMsgGuardarExito);
        //                        } else if (resp.existe == 1) {
        //                            mostrarMensaje(3, idioma.lbMsgPersonaExiste);
        //                        } else mostrarMensaje(3, idioma.lbMsgPersNoAdd);
        //                        return true;
        //                    }
        //                });
        //            }
        //        },
        //        beforemovenode: function (arbol, nodo, padre, padreNuevo) {
        //            _self.maskara.show();
        //            var nodoId = nodo.attributes.id;
        //            Ext.Ajax.request({
        //                url: 'cambiarOrden',
        //                params: {
        //                    idestructuraasistencia: nodoId,
        //                    idpadre: padreNuevo.attributes.id
        //                },
        //                success: function () {
        //                    if (arbol.getNodeById(padreNuevo.attributes.id).leaf == true) {
        //                        arbol.getNodeById(padreNuevo.attributes.id).leaf = false;
        //                        arbol.getNodeById(padreNuevo.attributes.id).ui.updateExpandIcon();
        //                    }
        //                    _self.maskara.hide();
        //                    mostrarMensaje(1, idioma.lbMsgEstOrdExito)
        //                }
        //            })
        //        }
        //    },
        //    tbar: [this.btnEliminarPersona, '-', ' ', this.btnCambiar, '->', btnExpandAllNodes, btnColapseAllNodes]
        //
        //});
        //
        //// add a tree sorter in folder mode
        //new Tree.TreeSorter(this.tree, {folderSort: true});
        //
        //// add the root node
        //var root = new Tree.AsyncTreeNode({
        //    text: idioma.lbTitPanelEstAsist,
        //    draggable: true,
        //    id: 'root',
        //});
        //this.tree.setRootNode(root);
        //this.tree.getRootNode().expand();
        //Arbol de las personas

        //Arbol de los cargos
        var _self1 = this;





        var Tree1 = Ext.tree;
        this.treeCargos = new Ext.ux.MultiSelectTreePanel({
            id: 'cargos',
            title: idioma.lbTitPanelEstAsistCargos,
            region: 'center',
            width: '27%',
            margins: '0 0 0 0',
            animate: true,
            useArrows: true,
            autoScroll: true,
            rootVisible: true,
            loader: modelo.fuenteDatosCargo,
            containerScroll: true,
            enableDD: true,
            dropConfig: {appendOnly: true},
            listeners: {
                beforenodedrop: function (e) {

                    if (_self1.externo) {
                       //console.info(e);
                        if (_self1.estructura.tree.getChecked().length > 0) {
                            if(_self1.estructura.tree.getChecked().length == 1 && e.target.attributes.id == 'rootCargos')
                            {
                               modelo.fuenteDatosListadoPersonacargo.load({params:{idcargo: e.dropNode.attributes.id}});
                                _self1.WinControlador.show();
                                _self1.event = e;
                            }
                            else
                            {
                                if(!Ext.isEmpty(e.target.attributes.idpersona))
                                    _self1.AddControladorOrCargo(e,-1);
                                else
                                    return false;
                            }
                        }
                        else {

                            return false;
                        }
                    }
                    else {

                        //if(e.target.attributes.id == 'rootCargos')
                        //    return false;
                        //if (_self1.treeCargos.getSelectionModel().getUniqueSelectedNodes().length > 0) {
                        //    var action = 'copy';
                        //    var childrens = _self1.treeCargos.getSelectionModel().getUniqueSelectedNodes();
                        //    Ext.Msg.show({
                        //        title: '¿Copiar o Cortar?',
                        //        msg: '¿Qué acción desea realizar? Para copiar los cargos seleccionados presione aceptar. Si desea cortar los cargos seleccionados presione cancelar.',
                        //        buttons: Ext.MessageBox.OKCANCEL,
                        //        buttonText: ['copiar', 'cortar'],
                        //
                        //        animEl: 'elId',
                        //        icon: Ext.MessageBox.QUESTION,
                        //        fn: function ButtonClick(btn) {
                        //            _self1.maskara.show();
                        //
                        //            var idestructurasToPaste = new Array();
                        //            Ext.each(childrens, function (nod) {
                        //                idestructurasToPaste.push(nod.attributes.id);
                        //            });
                        //            var action = 'false';
                        //            if (btn == 'ok')
                        //                action = 'copy';
                        //            else
                        //            if(btn == 'cancel')
                        //                action = 'cut';
                        //
                        //            if (action != 'false') {
                        //                Ext.Ajax.request({
                        //                    url: 'pegarCargos',
                        //                    params: {
                        //                        accion: action,
                        //                        idestructurasToPaste: Ext.encode(idestructurasToPaste),
                        //                        estructuraPadreToPaste: e.target.attributes.id
                        //                    },
                        //                    method: "POST",
                        //                    callback: function () {
                        //                        Ext.getBody().unmask();
                        //                    },
                        //                    success: function (r) {
                        //                        var resp = Ext.decode(r.responseText);
                        //                        if (resp.result) {
                        //                            if (action == 'cut') {
                        //                                Ext.each(childrens, function (child) {
                        //                                    child.remove();
                        //                                });
                        //                                mostrarMensaje(1, idioma.MsgCortarExitoso);
                        //                            }
                        //                            else {
                        //                                mostrarMensaje(1, idioma.MsgCopiarExitoso);
                        //                            }
                        //
                        //                            var nod = e.target;
                        //                            _self1.treeCargos.getLoader().load(nod, function () {
                        //                                nod.ui.updateExpandIcon();
                        //                                nod.expand(function(n){
                        //                                    //console.info(_self1.maskara);
                        //                                    _self1.maskara.hide();
                        //                                });
                        //                            });
                        //                        } else {
                        //                            _self1.maskara.hide();
                        //                            mostrarMensaje(3, idioma.MsgCopyCutFail);
                        //                        }
                        //                    },
                        //                    faliure:function(r){
                        //                        _self1.maskara.hide();
                        //                    }
                        //                });
                        //            }
                        //        }
                        //    });
                        //    if (action == 'copy')
                        //        return false;
                        //    else
                        //        return true;
                        //}
                    }


                },
                beforemovenode: function (arbol, nodo, padre, padreNuevo) {
                    _self1.maskara.show();
                    var nodoId = nodo.attributes.id;
                    if(!Ext.isEmpty(padreNuevo.attributes.idpersona) && Ext.isEmpty(nodo.attributes.idpersona))
                    {
                        Ext.Ajax.request({
                            url: 'cambiarOrden',
                            params: {
                                idestructuraasistencia: nodoId,
                                idpadre: padreNuevo.attributes.id
                            },
                            success: function () {
                                if (arbol.getNodeById(padreNuevo.attributes.id).leaf == true) {
                                    arbol.getNodeById(padreNuevo.attributes.id).leaf = false;
                                    arbol.getNodeById(padreNuevo.attributes.id).ui.updateExpandIcon();
                                }
                                _self1.maskara.hide();
                                mostrarMensaje(1, idioma.lbMsgEstOrdExito)
                            }
                        });
                    }
                    else
                    {
                        _self1.maskara.hide();
                        return false;
                    }


                }
            },
            tbar: [this.btnEliminar, '-', ' ', this.btnCambiar]

        });

        //this.treeCargos.dropZone.onNodeOver()

        // add a tree sorter in folder mode
        new Tree1.TreeSorter(this.treeCargos, {folderSort: true});

        // add the root node
        var rootCargos = new Tree1.AsyncTreeNode({
            text: idioma.lbTitPanelEstAsistCargos,
            draggable: true,
            id: 'rootCargos'
        });
        this.treeCargos.setRootNode(rootCargos);
        this.treeCargos.getRootNode().expand();
        //Arbol de los cargos

        //Panel de la derecha
        //this.panelDerecha = new Ext.Panel({
        //    id: 'panelDerecha',
        //    title: idioma.lbTitlePanelDerecha,
        //    collapsible: true,
        //    region:'east',
        //    layout: 'border',
        //    width: 500,
        //    split:true,
        //    //heigth: 1000,
        //    items: [
        //        this.listado,
        //        this.tree
        //    ]
        //});
        //Panel de la derecha

        this.estructurawin = new Ext.estructura.panel.PanelEstructura({
            region: 'center',
            split: true,
            //margins: '5 0 5 5',
            height : 300,
            id: 'panelestructurawin',
            //isGestionProyecto:true,
            //Otros parametros
            inicial: perfil.idestructuracomun, // codigo|id, Indica a partir de que estructura debe abrir el arbol
            //cargos: false, //Para que no salgan los cargos
            //checker: [7]//true | [2,7,9],  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
            //checked: {
            //  id:       [100000011],
            //  concepto: [3]
            //}  //Marca chequeado todos o las estructuras especificas
            //limit: [1,2,3,4,5,6,7,8,9]  //Define los conceptos que no se deben expandir
            //menu: false //Muestra u oculta el context menu por defecto true
        });
        this.estructurawin.tree.enableDD = true;

        this.smPersonaCargoWin = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.listadoPersonasInCargoWin = new Ext.grid.GridPanel({
            id: 'listadoPersonasInCargoWin',
            title:idioma.lbTitlePersonasOcupanCargo,
            region:'south',
            store: modelo.fuenteDatosListadoPersonacargoWin,
            loadMask: {msg: idioma.lbMsgmasklistadopeopleInCargo},
            sm: this.smPersonaCargoWin,
            width:'100%',
            stripeRows: true,
            height: 150,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width: 100, hidden: true,hiddeable:false, dataIndex: 'idpersona', id: 'idpersona'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', width: 150, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 225, dataIndex: 'denomcargo'},
                //{header: 'Procedencia', width:100,hidden:true,hideable:false, dataIndex: 'subordinacion'},

            ]
        });

        this.btnCancelarest = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            tooltip:idioma.lbBtnCanc,
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:idioma.lbBtnCancelar
        });

        this.btnAceptarest = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            disabled: true,
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:idioma.lbBtnAceptar,
            tooltip:idioma.lbBtnAcep
        });

        this.winCambiarCargo = new Ext.Window({
            title:idioma.lbTitPanelEst,
            layout:'border',
            width : 550,
            height : 450,
            closable:true,
            constrain: true,
            resizable:false,
            closeAction: 'hide',
            items:[this.estructurawin,this.listadoPersonasInCargoWin],
            modal: true,
            buttons: [this.btnCancelarest, this.btnAceptarest]

        });

        this.treeEstAsist = new Ext.tree.TreePanel({
            id:'treeEstAsist',
            border: false,
            rootVisible:true,
            layout: 'fit',
            animate:true,
            autoScroll:true,
            loader: modelo.fuenteDatosCargo,
            root: new Ext.tree.AsyncTreeNode({
                text:idioma.lbTitPanelEstAsistCargos,
                id: 'root'

            })
        });

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            tooltip:idioma.lbBtnCanc,
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:idioma.lbBtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:idioma.lbBtnAceptar,
            tooltip:idioma.lbBtnAcep
        });

        this.winCambiarPersona = new Ext.Window({
            title:idioma.lbTitPanelEstAsistCargos,
            layout:'fit',
            width : 450,
            height : 450,
            closable:true,
            constrain: true,
            resizable:false,
            closeAction: 'hide',
            items:[this.treeEstAsist],
            modal: true,
            buttons: [this.btnCancelar, this.btnAceptar]

        });
//ventana Agregar Controlador
        this.btnCancelarControlador = new Ext.Button({
            id:'btnCancelarControlador',
            iconCls:'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            tooltip:idioma.lbBtnCanc,
            prevTab: 'btnAceptarControlador',
            nextTab: 'btnAceptarControlador',
            text:idioma.lbBtnCancelar
        });

        this.btnAceptarControlador = new Ext.Button({
            id:'btnAceptarControlador',
            iconCls:'aceptar',
            disabled:true,
            //icon:perfil.dirImg+'aceptar.png',
            prevTab: 'btnCancelarControlador',
            nextTab: 'btnCancelarControlador',
            text:idioma.lbBtnAceptar,
            tooltip:idioma.lbBtnAcep
        });

        this.smPersonaCargo = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.listadoPersonasInCargo = new Ext.grid.GridPanel({
            id: 'listadoPersonasInCargo',
            store: modelo.fuenteDatosListadoPersonacargo,
            loadMask: {msg: idioma.lbMsgmasklistadopeopleInCargo},
            sm: this.smPersonaCargo,
            width:'100%',
            stripeRows: true,
            height: 527,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width: 100, hidden: true,hiddeable:false, dataIndex: 'idpersona', id: 'idpersona'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', width: 150, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 225, dataIndex: 'denomcargo'},
                //{header: 'Procedencia', width:100,hidden:true,hideable:false, dataIndex: 'subordinacion'},

            ]
        });

        this.WinControlador = new Ext.Window({
            title:idioma.lbTitleWinControlador,
            layout:'fit',
            width : 500,
            height : 280,
            closable:true,
            constrain: true,
            resizable:false,
            closeAction: 'hide',
            items:[this.listadoPersonasInCargo],
            modal: true,
            buttons: [this.btnCancelarControlador, this.btnAceptarControlador]

        });
//ventana Agregar Controlador

//ventana Agregar Personal Fuera de Pantilla
        this.btnCancelarPFP = new Ext.Button({
            id: 'btnCancelarPFP',
            iconCls: 'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            tooltip: idioma.lbBtnCanc,
            prevTab: 'btnAceptarPFP',
            nextTab: 'btnAceptarPFP',
            text: idioma.lbBtnCancelar
        });

        this.btnAceptarPFP = new Ext.Button({
            id: 'btnAceptarPFP',
            iconCls: 'aceptar',
            disabled: true,
            //icon:perfil.dirImg+'aceptar.png',
            prevTab: 'btnCancelarPFP',
            nextTab: 'btnCancelarPFP',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep
        });

        this.smPFP = new Ext.grid.CheckboxSelectionModel();

        this.listadoPFP = new Ext.grid.GridPanel({
            id: 'listadoPFP',
            store: modelo.fuenteDatosListadoPFP,
            loadMask: {msg: idioma.lbMsgmasklistadoPFP},
            sm: this.smPFP,
            width: '100%',
            stripeRows: true,
            height: 527,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width: 100, hidden: true, hiddeable: false, dataIndex: 'idpersona', id: 'idpersona'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Situaci&oacute;n', width: 150, dataIndex: 'denomsituacion'},
                this.smPFP
            ]
        });

        this.WinPFP = new Ext.Window({
            title: idioma.lbTitleWinPFP,
            layout: 'fit',
            width: 500,
            height: 280,
            closable: true,
            constrain: true,
            resizable: false,
            closeAction: 'hide',
            items: [this.listadoPFP],
            modal: true,
            buttons: [this.btnCancelarPFP, this.btnAceptarPFP]

        });
//ventana Agregar Personal Fuera de Pantilla


        this.pGeneral = new Ext.Panel({
            id: 'pGeneral',
            width : '100%',
            layout:'border',
            tbar:['->', this.btnAyuda],
            items: [panelestructura, this.treeCargos,  this.listado]
        });

        this.vp = new Ext.Viewport({
            layout: 'fit',
            items: [this.pGeneral]
            //items: [panelestructura, this.treeCargos,  this.listado]
        });
    },
     AddControladorOrCargo: function(e,idpersona)
    {
        _self1 = this;
        var idcargos = new Array();
        var nocargos = new Array();
        Ext.each(this.estructura.tree.getChecked(), function (nodo) {
            if (nodo.attributes.idconcepto == 7) {
                idcargos.push(nodo.attributes.id)
            }
            else {
                nocargos.push(nodo.attributes.denominacion);
            }
        });
        e.cancel = false;
        this.maskara.show();
        Ext.Ajax.request({
            url: 'guardarPersonasAsistencia',
            params: {
                idcargo: Ext.encode(idcargos),
                idpadre: e.target.attributes.id,
                idpersona:idpersona
            },
            method: "POST",
            callback: function () {
               // _self1.maskara.hide();
            },
            success: function (r) {
                var resp = Ext.decode(r.responseText);
                if (resp.guardar == true) {
                    var nodo = e.target;
                    if (!Ext.isEmpty(resp.existen))
                        if(resp.tipo == 2)
                            mostrarMensaje(1, _self1.languaje.lbMsgExisten + '<ul>' + resp.existen + '</ul>');
                        else
                            mostrarMensaje(3, resp.existen + _self1.languaje.lbMsgExisteControlador);
                    else
                    {
                        if(_self1.WinControlador.isVisible())
                            _self1.WinControlador.hide();
                        mostrarMensaje(1, _self1.languaje.lbMsgGuardarExito);
                        if (nodo.isExpanded()) {
                            _self1.treeCargos.getLoader().load(nodo,function(){
                                nodo.expand(false,true,function(n){
                                    _self1.treeCargos.doLayout();
                                    _self1.maskara.hide();
                                });
                            });
                        }
                        else
                        {
                            nodo.expand(false,true,function(n){
                                _self1.treeCargos.doLayout();
                                _self1.maskara.hide();
                            });
                        }
                    }
                    _self1.estructura.tree.getRootNode().cascade(function (n) {
                        var ui = n.getUI();
                        ui.toggleCheck(false);
                    });
                } else if (resp.guardar == false) {

                    mostrarMensaje(3, _self1.languaje.lbMsgPersonaExiste);
                } else mostrarMensaje(3, _self1.languaje.lbMsgPersNoAdd);
                if (nocargos.length > 0)
                    mostrarMensaje(3, _self1.languaje.lbElementosNoCargos + nocargos.join(',\n'));

                return true;
            },
            failure: function(){
                 _self1.maskara.hide();
            }

        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestplantilla', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.GestPlantilla.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.GestPlantilla.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.GestPlantilla.Controlador.init(idioma, vista, modelo);

});