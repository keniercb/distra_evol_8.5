/*
 * Componente Reporte.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Maestro.EstructuraControl
 * @uses Pvd.Maestro.EstructuraControl.panelEstructuraControl
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.EstructuraControl'); Ext.QuickTips.init();
Pvd.Maestro.EstructuraControl.panelEstructuraControl = Ext.extend(Ext.Panel, {
    layout        : 'border',
	region        : 'center',
    border        : false,
	width         : '100%',
	closable      : true,
	iconCls       : 'reporte',
    initComponent : function() {
        var self = this;
        this.recordsLoaded = new Array();
        this.recordsLoadedPerwin = new Array();
        this.externo = false;
        var scope=this;
        var idpadre = null;
        this.idestructura = null;
        this.idtipo = null;
        this.idconcepto = null;
        this.idestructurawin = null;
        this.idpersonawin = null;
        this.idconceptowin = null;
        this.EstSelNodes = 0;
        this.Action = 'cut';
        var nodo = null;
        var wincambshow = 0;


        this.recQrElement = new Ext.data.Record.create(
            {name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'idcargo'},{name:'denomcargo'},{name:'idcontrolador'}
            ,{name:'add'},{name:'denomarea'},{name:'bandera'},{name:'padres'}
        );

        this.recQrElementPerTodas = new Ext.data.Record.create(
            {name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'denomsituacion'},{name:'denomcargo'},{name:'denomarea'}
        );

        this.estructura = new Ext.estructura.panel.PanelEstructura({
            title: self.idioma.lbTitPanelEst,
            region: 'west',
            width: '27%',
            collapsible: true,
            split: true,
            border: false,
            margins: '5 0 5 5',
            id: 'panelestructura',
            checker: [7],
            inicial: self.idestructurainicial
        });
        this.estructura.tree.enableDD = true;

        this.estructura.tree.on('click', function (n) {
            if (n.attributes.leaf && n.attributes.idconcepto == 7) {
                if (!Ext.isEmpty(n)) {
                    var nodeUI = n.ui;
                    nodeUI.checked = true;
                    nodeUI.checkbox.checked = true;
                    nodeUI.checkbox.defaultChecked = true;
                    n.attributes.checked = true;
                }
            }
        });

        this.estructura.on('dameseleccion', function (obj, data) {
            //console.info(data);
            if(data == false){
                this.idestructura = self.estructura.inicial;
                this.idconcepto = self.idtipo;
            }
            else{
                this.idestructura = data.id;
                this.idconcepto = data.idtipo;
            }
           }.createDelegate(this));

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            emptyText: self.idioma.lbMsgcriterioBuscar,
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            disabled: true,
            text: self.idioma.lbBtnBuscar,
            tooltip: self.idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            disabled: true,
            text: self.idioma.lbBtnLimpiar,
            tooltip: self.idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });


        this.btnEliminarPersona = new Ext.Button({
            id: 'btnEliminarPersona',
            text: self.idioma.lbBtnEliminar,
            tooltip: self.idioma.textToolTipDelpersona,
            disabled: true,
            iconCls: 'eliminar'
        });

        this.btnCambiarPersona = new Ext.Button({
            id: 'btnCambiarPersona',
            text: self.idioma.lbBtnMover,
            tooltip: self.idioma.textToolTipMover,
            iconCls: 'cambiar',
            disabled: true
        });

        this.btnPFP = new Ext.Button({
            id: 'btnPFP',
            text: self.idioma.lbBtnAdicionarPFP,
            tooltip: self.idioma.textToolTipBtnAdicionarPFP,
            iconCls: 'adicionar',
            disabled: true
        });

        var smPersona = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false
        });

        this.fuenteDatosListado = new Ext.data.GroupingStore({
            url: 'getPersonasporcargo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'idcargo'},{name:'denomcargo'},{name:'idcontrolador'}
                    ,{name:'add'},{name:'denomarea'},{name:'bandera'},{name:'padres'}]
            ),
            sortInfo:{field: 'denomarea', direction: "ASC"},
            groupField:'denomarea',
            remoteGroup: true,
        });

        this.listado = new Ext.grid.GridPanel({
            id: 'listadoPersonas',
            title:self.idioma.lbTitleListadoPersonasAsociadas,
            store: self.fuenteDatosListado,
            loadMask: {msg: self.idioma.lbMsgmasklistado},
            sm: smPersona,
            region: 'south',
            border: false,
            collapsible:true,
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                groupByText:' ',
                groupTextTpl: '{group} ({[values.rs.length]})'
            }),
            split:true,
            height: 300,
            columns: [
                smPersona,
                {header: 'idpersona', width: 100, hidden: true, dataIndex: 'idpersona', id: 'idpersona'},
                {header: 'No identidad', width: 100,hidden: false, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', width: 325, hidden: true, dataIndex: 'denomarea'},
                {header: 'Cargo', width: 325, dataIndex: 'denomcargo'}
            ],
            tbar: [this.btnPFP, this.btnCambiarPersona, this.btnEliminarPersona,'-',
                this.tfbuscar, '',
                this.btnBuscar,
                this.btnLimpiar,'-'
            ]
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: self.idioma.lbBtnEliminar,
            tooltip: self.idioma.textToolTipDel,
            iconCls: 'eliminar',
            disabled: true
        });

        this.btnCambiar = new Ext.Button({
            id: 'btnCambiar',
            text: self.idioma.lbBtnCambiar,
            tooltip: self.idioma.textToolTipCambiar,
            iconCls: 'cambiar',
            disabled: true
        });

        this.btnUpdate = new Ext.Button({
            iconCls: 'actualizar',
			text: 'Actualizar',
            tooltip: self.idioma.lbBtnUpdate,
            handler: function ()
            {
                self.treeCargos.getLoader().load(self.treeCargos.getRootNode());
                self.treeCargos.getRootNode().expand();
            }.createDelegate(this)
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
        this.maskara = new Ext.LoadMask(Ext.getBody(), {msg: self.idioma.lbMsgmaskGuardar});

        this.fuenteDatosCargo= new Ext.tree.TreeLoader({
            url:'obtenerCargos'
        });

        this.fuenteDatosCargo.on('beforeload', function (tl, n) {
            if (tl.isLoading()) {
                return false;
            }  else {
                tl.baseParams.idestructuracontrol = self.idestructuracontrol;
                if (wincambshow == 1) {
                    tl.baseParams.ctroldor = 1;
                } else {
                    tl.baseParams.ctroldor = 0;
                }
            }
        });

        var Tree1 = Ext.tree;
        this.treeCargos = new Ext.ux.MultiSelectTreePanel({
            id: 'cargos',
            title: self.idioma.lbTitPanelEstAsistCargos,
            region: 'center',
            border: false,
            width: '27%',
            margins: '0 0 0 0',
            animate: true,
            useArrows: true,
            autoScroll: true,
            rootVisible: true,
            loader: self.fuenteDatosCargo,
            containerScroll: true,
            enableDD: true,
            dropConfig: {appendOnly: true},
            listeners: {
                beforenodedrop: function (e) {
                    if (self.externo) {
                        if (self.estructura.tree.getChecked().length > 0 || self.estructura.tree.getSelectionModel().getSelectedNode()) {
                            if((self.estructura.tree.getChecked().length == 1 || self.estructura.tree.getSelectionModel().getSelectedNode())&& e.target.attributes.id == 'rootCargos') {
                                if (self.estructura.tree.getSelectionModel().getSelectedNode().attributes.idconcepto != 7) {
                                    mostrarMensaje(3, 'El elemento seleccionado no puede ser adicionado en esa posici&oacute;n.');
                                } else {
                                    self.event = e;
                                    self.fuenteDatosListadoPersonacargo.load({params:{idcargo: e.dropNode.attributes.id}, callback: function() {
                                        if (self.fuenteDatosListadoPersonacargo.getCount() > 1) {
                                            self.WinControlador.show();
                                        } else if (self.fuenteDatosListadoPersonacargo.getCount() == 1) {
                                            var resp = self.fuenteDatosListadoPersonacargo.getRange();
                                            self.AddControladorOrCargo(self.event,resp[0].data.idpersona);
                                        } else {
                                            mostrarMensaje(3, self.idioma.msgPlntillaVacia)
                                        }
                                    }});
                                }
                            } else if (self.estructura.tree.getChecked().length == 0 && self.estructura.tree.getSelectionModel().getSelectedNode() && e.target.attributes.id != 'rootCargos') {
                                self.AddControladorOrCargo(e,-1);
                            } else {
                                if(!Ext.isEmpty(e.target.attributes.idpersona))
                                    self.AddControladorOrCargo(e,-1);
                                else
                                    return false;
                            }
                        } else {
                            return false;
                        }
                    }
                },
                beforemovenode: function (arbol, nodo, padre, padreNuevo) {
                    self.maskara.show();
                    var nodoId = nodo.attributes.id;
                    if(!Ext.isEmpty(padreNuevo.attributes.idpersona) && Ext.isEmpty(nodo.attributes.idpersona))
                    {
                        Ext.Ajax.request({
                            url: 'cambiarOrden',
                            params: {
                                idcontrolado: nodoId,
                                idpadre: padreNuevo.attributes.id
                            },
                            success: function (r) {
                                var responseData = Ext.decode(r.responseText);
                                if (responseData == true) {
                                    if (arbol.getNodeById(padreNuevo.attributes.id).leaf == true) {
                                        arbol.getNodeById(padreNuevo.attributes.id).leaf = false;
                                        arbol.getNodeById(padreNuevo.attributes.id).ui.updateExpandIcon();
                                    }
                                    mostrarMensaje(1, self.idioma.lbMsgEstOrdExito)
                                } else {
                                    self.treeCargos.getLoader().load(self.treeCargos.getRootNode());
                                    self.treeCargos.getRootNode().expand();
                                    mostrarMensaje(3, self.idioma.lbMsgPersonaExiste)
                                }
                                self.maskara.hide();
                            }
                        });
                    } else {
                        self.maskara.hide();
                        return false;
                    }
                }
            },
            tbar: [this.btnEliminar, '-', ' ', this.btnCambiar, '-', ' ', this.btnUpdate]
        });

        // add a tree sorter in folder mode
        new Tree1.TreeSorter(this.treeCargos, {folderSort: true});

        // add the root node
        var rootCargos = new Tree1.AsyncTreeNode({
            text: self.idioma.lbTitPanelEstAsistCargos,
            draggable: true,
            id: 'rootCargos'
        });

        this.treeCargos.setRootNode(rootCargos);
        this.treeCargos.getRootNode().expand();

        this.estructurawin = new Ext.estructura.panel.PanelEstructura({
            region: 'center',
            split: true,
            height : 300,
            inicial: self.idestructurainicial,
            id: 'panelestructurawin'
        });
        this.estructurawin.tree.enableDD = true;

        this.smPersonaCargoWin = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.fuenteDatosListadoPersonacargoWin = new Ext.data.Store({
            url: 'getPersonasencargo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreyapellidos'},{name:'cargo'},{name:'area'}]
            )
        });

        this.listadoPersonasInCargoWin = new Ext.grid.GridPanel({
            id: 'listadoPersonasInCargoWin',
            title:self.idioma.lbTitlePersonasOcupanCargo,
            region:'south',
            border: false,
            store: self.fuenteDatosListadoPersonacargoWin,
            loadMask: {msg: self.idioma.lbMsgmasklistadopeopleInCargo},
            sm: this.smPersonaCargoWin,
            width:'100%',
            stripeRows: true,
            height: 150,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width: 100, hidden: true,hiddeable:false, dataIndex: 'idpersona', id: 'idpersona'},
                {header: 'Apellidos y nombres', width: 200, dataIndex: 'nombreyapellidos'},
                {header: 'Área', width: 200, dataIndex: 'area'},
                {header: 'Cargo', width: 225, dataIndex: 'cargo'}
            ]
        });

        this.btnCancelarest = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            tooltip:self.idioma.lbBtnCanc,
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:self.idioma.lbBtnCancelar
        });

        this.btnAceptarest = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            disabled: true,
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:self.idioma.lbBtnAceptar,
            tooltip:self.idioma.lbBtnAcep
        });

        this.winCambiarCargo = new Ext.Window({
            title:self.idioma.lbTitPanelEst,
            layout:'border',
            width : 650,
            height : 550,
            closable:true,
            resizable:false,
            closeAction: 'hide',
            items:[this.estructurawin,this.listadoPersonasInCargoWin],
            modal: true,
            buttons: [this.btnCancelarest, this.btnAceptarest],
            keys: [
                {
                    key: 'x',
                    ctrl: true,
                    alt: true,
                    fn: function ()
                    {
                        if(!self.btnCancelarest.disabled){
                            self.winCambiarCargo.hide();
                        }
                    }
                },{
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptarest.disabled) {
                            Cambiar();
                        }
                    }
                }
            ]
        });

        this.treeEstAsist = new Ext.tree.TreePanel({
            id:'treeEstAsist',
            border: false,
            rootVisible:true,
            layout: 'fit',
            animate:true,
            autoScroll:true,
            loader: self.fuenteDatosCargo,
            root: new Ext.tree.AsyncTreeNode({
                text:self.idioma.lbTitPanelEstAsistCargos,
                id: 'rootCargos'
            })
        });

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            tooltip:self.idioma.lbBtnCanc,
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:self.idioma.lbBtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:self.idioma.lbBtnAceptar,
            tooltip:self.idioma.lbBtnAcep
        });

        this.winCambiarPersona = new Ext.Window({
            title:self.idioma.lbTitPanelEstAsistCargos,
            layout:'fit',
            width : 450,
            height : 450,
            closable:true,
            resizable:false,
            closeAction: 'hide',
            items:[this.treeEstAsist],
            modal: true,
            buttons: [this.btnCancelar, this.btnAceptar],
            listeners: {
                show: function ()
                {
                    self.treeEstAsist.getSelectionModel().clearSelections();
                    wincambshow = 1;
                }.createDelegate(this),
                hide: function ()
                {
                    wincambshow = 0;
                }.createDelegate(this)
            },
            keys: [
                {
                    key: 'x',
                    ctrl: true,
                    alt: true,
                    fn: function ()
                    {
                        if(!self.btnCancelar.disabled){
                            self.winCambiarPersona.hide();
                        }
                    }
                },{
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            CambiarPersona();
                        }
                    }
                }
            ]
        });

        //ventana Agregar Controlador
        this.btnCancelarControlador = new Ext.Button({
            id:'btnCancelarControlador',
            iconCls:'cancelar',
            tooltip:self.idioma.lbBtnCanc,
            prevTab: 'btnAceptarControlador',
            nextTab: 'btnAceptarControlador',
            text:self.idioma.lbBtnCancelar
        });

        this.btnAceptarControlador = new Ext.Button({
            id:'btnAceptarControlador',
            iconCls:'aceptar',
            disabled:true,
            prevTab: 'btnCancelarControlador',
            nextTab: 'btnCancelarControlador',
            text:self.idioma.lbBtnAceptar,
            tooltip:self.idioma.lbBtnAcep
        });

        this.smPersonaCargo = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.fuenteDatosListadoPersonacargo = new Ext.data.Store({
            url: 'getPersonasencargo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreyapellidos'},{name:'cargo'},{name:'area'}]
            )
        });

        this.listadoPersonasInCargo = new Ext.grid.GridPanel({
            id: 'listadoPersonasInCargo',
            store: this.fuenteDatosListadoPersonacargo,
            border: false,
            loadMask: {msg: self.idioma.lbMsgmasklistadopeopleInCargo},
            sm: this.smPersonaCargo,
            width:'100%',
            stripeRows: true,
            height: 527,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width: 100, hidden: true,hiddeable:false, dataIndex: 'idpersona', id: 'idpersona'},
                {header: 'Apellidos y nombres', width: 200, dataIndex: 'nombreyapellidos'},
                {header: 'Área', width: 200, dataIndex: 'area'},
                {header: 'Cargo', width: 225, dataIndex: 'cargo'}
            ]
        });

        this.WinControlador = new Ext.Window({
            title:self.idioma.lbTitleWinControlador,
            layout:'fit',
            width : 650,
            height : 400,
            closable:true,
            resizable:false,
            closeAction: 'hide',
            items:[this.listadoPersonasInCargo],
            modal: true,
            buttons: [this.btnCancelarControlador, this.btnAceptarControlador],
            keys: [
                {
                    key: 'x',
                    alt: true,
                    fn: function ()
                    {
                        if(!self.btnCancelarControlador.disabled){
                            self.WinControlador.hide();
                        }
                    }
                },{
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptarControlador.disabled) {
                            self.AddControladorOrCargo(self.event,self.smPersonaCargo.getSelected().get('idpersona'));
                        }
                    }
                }
            ]
        });

        //ventana Agregar Personal Fuera de Pantilla
        this.btnCancelarPFP = new Ext.Button({
            id: 'btnCancelarPFP',
            iconCls: 'cancelar',
            tooltip: self.idioma.lbBtnCanc,
            prevTab: 'btnAceptarPFP',
            nextTab: 'btnAceptarPFP',
            text: self.idioma.lbBtnCancelar
        });

        this.btnAceptarPFP = new Ext.Button({
            id: 'btnAceptarPFP',
            iconCls: 'aceptar',
            disabled: true,
            prevTab: 'btnCancelarPFP',
            nextTab: 'btnCancelarPFP',
            text: self.idioma.lbBtnAceptar,
            tooltip: self.idioma.lbBtnAcep
        });

        var connObjPerDisponibles = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getPersonasAll',
            method : 'POST'
        });

        this.fuenteDatosListadoPFP = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjPerDisponibles),
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "quantity"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'},{name:'denomsituacion'},{name:'denomcargo'},{name:'denomarea'}]
            ),
            sortInfo:{field: 'denomarea', direction: "ASC"},
            groupField:'denomarea'
        });


        function mostrarArea(val, metaData, record, rowIndex, colIndex, store) {
            if (val) {
                return val;
            } else {
                return '<span style="color:#ff0b3a;"><b>' + 'NO ASIGNADO' + '</b></span>';
            }
        }

        //textfield para el buscar
        this.tfbuscarPersWin = new Ext.form.TextField({
            id: 'tfbuscarPersWin',
            allowBlank: true,
            emptyText: self.idioma.lbMsgcriterioBuscar,
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscarPersWin = new Ext.Button({
            id: 'btnBuscarPersWin',
            text: self.idioma.lbBtnBuscar,
            tooltip: self.idioma.textToolTipBusPersona,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiarPersWin = new Ext.Button({
            id: 'btnLimpiarPersWin',
            text: self.idioma.lbBtnLimpiar,
            tooltip: self.idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

        this.smPFP = new Ext.grid.CheckboxSelectionModel();

        this.listadoPFP = new Ext.grid.GridPanel({
            id: 'listadoPFP',
            tbar: [this.tfbuscarPersWin, this.btnBuscarPersWin, this.btnLimpiarPersWin],
            store: self.fuenteDatosListadoPFP,
            loadMask: {msg: self.idioma.lbMsgmasklistadoPFP},
            sm: this.smPFP,
            width: '100%',
            stripeRows: true,
            height: 527,
            view: new Ext.grid.GroupingView({
                groupByText:' ',
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            columns: [this.smPFP,
                {header: 'idpersona', width: 100, hidden: true, hiddeable: false, dataIndex: 'idpersona', id: 'idpersona'},
                {header: 'Nombre y apellidos', width: 225, dataIndex: 'nombreapellidos'},
                {header: 'Área', hidden: true, width: 200, dataIndex: 'denomarea'/*, renderer: mostrarArea*/},
                {header: 'Cargo', width: 300, dataIndex: 'denomcargo'}

            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: self.fuenteDatosListadoPFP,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: 'No hay resultado(s) que mostrar'
            }),
            keys: [
                {
                    key: 'b',
                    alt: true,
                    fn: function ()
                    {
                        if(!self.btnBuscarPersWin.disabled){
                            buscarpersonaAll();
                        }
                    }
                },{
                    key: 'l',
                    alt: true,
                    fn: function ()
                    {
                        if(!self.btnLimpiarPersWin.disabled){
                            self.tfbuscarPersWin.reset();
                            self.fuenteDatosListadoPFP.removeAll();
                            self.fuenteDatosListadoPFP.add(scope.recordsLoadedPerwin);
                        }
                    }
                }
            ]
        });

        this.WinPFP = new Ext.Window({
            title: self.idioma.lbTitleWinPFP,
            layout: 'fit',
            width: 700,
            height: 400,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [this.listadoPFP],
            modal: true,
            buttons: [this.btnCancelarPFP, this.btnAceptarPFP],
            keys: [
                {
                    key: 'x',
                    alt: true,
                    fn: function ()
                    {
                        if(!self.btnCancelarPFP.disabled){
                            self.WinPFP.hide();
                        }
                    }
                },{
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptarPFP.disabled) {
                            var idcontrolador = self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].id;
                            var idpersonas = new Array();
                            Ext.each(self.smPFP.getSelections(),function(rec){
                                idpersonas.push(rec.data.idpersona);
                            });
                            addPersona(idcontrolador,Ext.encode(idpersonas));
                        }
                    }
                }
            ]
        });

        var panelDerecha = new Ext.Panel({
            items: [this.treeCargos,  this.listado],
            region: 'center',
            layout: 'border',
            margins: '0 0 0 0',
            cmargins: '0 0 0 0'
        });

		this.items = [this.estructura, panelDerecha];

        this.keys = [
            {
                key: 46,//del para eliminar
                fn: function(){
                    if(!self.btnEliminarPersona.disabled){
                        EliminarPersona();
                    } else if(!self.btnEliminar.disabled){
                        self.eliminar();
                    }
                }
            },{
                key: 'i',
                alt: true,
                fn: function () {
                    if (!self.btnPFP.disabled) {
                        self.WinPFP.show();
                        if (self.fuenteDatosListadoPFP.getCount() == 0) {
                            self.fuenteDatosListadoPFP.load({params:{start:0,limit:15,filtro:this.tfbuscarPersWin.getValue(),idestructura: self.idestructura}, callback: function (r, opt, suc) {
                                scope.recordsLoadedPerwin = r;
                            }});
                        }
                    }
                }
            },{
                key: 'b',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (!self.btnCambiarPersona.disabled) {
                        self.winCambiarPersona.setTitle(self.idioma.lbTitPanelEstAsistCargos);
                        self.winCambiarPersona.show();
                        self.treeEstAsist.getRootNode().expand();
                    } else if (!self.btnCambiar.disabled) {
                        self.winCambiarCargo.setTitle(self.idioma.lbTitPanelEst);
                        self.winCambiarCargo.show();
                    }
                }
            },{
                key: 'b',
                alt: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        buscarpersona();
                    }
                }
            },{
                key: 'l',
                alt: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.tfbuscar.reset();
                        self.fuenteDatosListado.removeAll();
                        self.fuenteDatosListado.add(scope.recordsLoaded);
                    }
                }
            },{
                key: 'z',
                ctrl: true,
                alt: true,
                fn: function () {
                    if (!self.btnUpdate.disabled) {
                        self.btnUpdate.handler();
                    }
                }
            }
        ];
        this.estructura.tree.root.on('expand', function (nodo) {
            this.estructura.tree.getSelectionModel().select(nodo.childNodes[0]);
            this.idconcepto = nodo.childNodes[0].attributes.idtipo;

        },this);
        this.estructura.on('dameseleccion', function (obj, data) {
            this.EstSelNodes = data.length;
            if(data == false)
                this.idestructura = this.estructura.inicial;
            else{
                this.idestructura = data[0].id;
                this.idconcepto = data[0].attributes.idconcepto;
            }

            if(this.EstSelNodes == 1 && this.treeCargos.getSelectionModel().getUniqueSelectedNodes().length == 1 && this.idconcepto == 7){
                this.btnCambiar.enable();
            }else{
                this.btnCambiar.disable();
            }
        },this);

        this.estructura.tree.getSelectionModel().on('selectionchange',function(th,node){
            var estructuraAsistenciaSelected = this.treeCargos.getSelectionModel().getUniqueSelectedNodes();
            if (node.attributes.idtipo == 3 && (estructuraAsistenciaSelected.length == 1 && !Ext.isEmpty(estructuraAsistenciaSelected[0].attributes.idpersona)))
                this.btnPFP.enable();
            else
                this.btnPFP.disable();
        },this);

        this.btnEliminar.on('render',function(){
            self.btnEliminar.focus();
        });

        this.estructura.tree.on('startdrag',function(tp,n,e){
            self.externo = true;
        },this);

        this.treeCargos.on('startdrag',function(tp,n,e){
            self.externo = false;
        });

        this.btnLimpiar.on('click', function(){
            self.tfbuscar.reset();
            self.fuenteDatosListado.removeAll();
            self.fuenteDatosListado.add(scope.recordsLoaded);
        });

        this.btnLimpiarPersWin.on('click', function(){
            self.tfbuscarPersWin.reset();
            self.fuenteDatosListadoPFP.removeAll();
            //self.fuenteDatosListadoPFP.add(scope.recordsLoadedPerwin);
            self.fuenteDatosListadoPFP.load({params:{start:0,limit:15,filtro:self.tfbuscarPersWin.getValue(),idestructura: self.idestructura}, callback: function (r, opt, suc) {
                scope.recordsLoadedPerwin = r;
            }});
        });

        this.btnCancelar.on('click',function(){
            self.winCambiarPersona.hide();
        },this);

        this.btnCancelarest.on('click',function(){
            self.winCambiarCargo.hide();
        },this);

        this.btnAceptar.on('click',function(){
            CambiarPersona();
        },this);

        this.btnEliminarPersona.on('click',function(){
            EliminarPersona();
        },this);

        self.treeEstAsist.on('click', function(nds){
            nodo = nds;
            var temp = 0;
            var aux = 0;
            var mismoCargo = 0;
            var cargoold = self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idcargo;
            var cargonew = nds.attributes.idcargo;
            Ext.each(self.listado.getSelectionModel().getSelections(), function(rec){
                if(cargonew == rec.data.idcargo){
                    temp = 1;
                }
                Ext.each(rec.data.padres, function(r){
                    if(cargonew == r){
                        aux = 1;
                    }
                })
            });
            if(cargoold == cargonew ||  nds.attributes.id == 'root'){
                self.btnAceptar.disable();
            }else
                self.btnAceptar.enable();

        },this);

        this.btnAceptarest.on('click', function(){
            Cambiar();
        },this);

        this.btnBuscar.on('click', function(){
            buscarpersona();
        });

        this.btnBuscarPersWin.on('click', function(){
            //buscarpersonaAll();
            self.fuenteDatosListadoPFP.load({params:{start:0,limit:15,filtro:self.tfbuscarPersWin.getValue(),idestructura: self.idestructura}, callback: function (r, opt, suc) {
                scope.recordsLoadedPerwin = r;
            }});
        });

        this.btnCambiarPersona.on('click', function(){
            self.winCambiarPersona.setTitle(self.idioma.lbTitPanelEstAsistCargos);
            self.winCambiarPersona.show();
            self.treeEstAsist.getRootNode().expand();
        },this);

        this.listado.getSelectionModel().on('selectionchange', function () {
            if(self.listado.getSelectionModel().getSelections().length>0){
                self.btnCambiarPersona.enable();
                self.btnEliminarPersona.enable();
            }else{
                self.btnEliminarPersona.disable();
                self.btnCambiarPersona.disable();
            }
        }, this);

        this.treeCargos.getSelectionModel().on('selectionchange', function(th,nds,e){
            if(nds.length > 0){
                if (nds.length == 1 && self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id == 'rootCargos') {
                    self.btnEliminar.disable();
                }  else {
                    self.btnEliminar.enable();
                }
                if(nds.length == 1 && this.EstSelNodes == 1 && this.idconcepto == 7){
                    // vista.btnCambiar.enable();
                }else{
                    //vista.btnCambiar.disable();
                }
            } else {
                // vista.btnCambiar.disable();
                self.btnEliminar.disable();
            }
            if(nds.length == 1 && self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.leaf == false) {
                self.listado.expand();
                self.listado.enable();
                self.btnPFP.enable();
                self.btnBuscar.enable();
                self.btnLimpiar.enable();
                self.fuenteDatosListado.baseParams.idnode= self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id;
                self.fuenteDatosListado.baseParams.idcargo= self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idcargo;
                var idpersona = self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idpersona;
                self.fuenteDatosListado.baseParams.idpersona= (Ext.isEmpty(idpersona))?-1:idpersona;
                self.fuenteDatosListado.load({params:{start:0, limit:15}, callback: function (r, opt, suc) {
                    scope.recordsLoaded = r;
                }});

                self.btnCambiar.enable();
                if(!Ext.isEmpty(self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idpersona))
                    self.listadoPersonasInCargoWin.setVisible(true);
                else
                    self.listadoPersonasInCargoWin.setVisible(false);
            } else {
                self.listado.collapse();
                self.listado.disable();
                self.fuenteDatosListado.removeAll();
                self.btnCambiar.disable();
                self.btnPFP.disable();
                self.btnBuscar.disable();
                self.btnLimpiar.disable();
            }
        },this);

        this.btnCambiar.on('click', function(){
            self.winCambiarCargo.setTitle(self.idioma.lbTitPanelEst);
            self.winCambiarCargo.show();
        },this);

        this.btnCancelarControlador.on('click', function(){
            self.WinControlador.hide();
        },this);

        this.btnAceptarControlador.on('click', function(){
            self.AddControladorOrCargo(self.event,self.smPersonaCargo.getSelected().get('idpersona'));
        },this);

        this.estructurawin.on('dameseleccion', function (obj, data) {
            if(data == false)
                this.idestructurawin = self.estructurawin.inicial;
            else{
                this.idestructurawin = data.id;
                this.idconceptowin = data.attributes.idconcepto;
            }

            if(!Ext.isEmpty(self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idpersona))
            {
                if(this.idconceptowin == 7)
                    self.fuenteDatosListadoPersonacargoWin.load({params:{idcargo:data.id}});
                else
                    self.fuenteDatosListadoPersonacargoWin.removeAll();
            } else {
                if(this.idconceptowin == 7){
                    self.btnAceptarest.enable();
                }else{
                    self.btnAceptarest.disable();
                }
            }
        },this);

        this.btnEliminar.on('click', function(){
            this.eliminar();
        }, this);

        this.smPFP.on('selectionchange',function(th){
            if(th.getSelections().length > 0)
                self.btnAceptarPFP.enable();
            else
                self.btnAceptarPFP.disable();
        });

        this.smPersonaCargoWin.on('selectionchange',function(th){
            if(self.smPersonaCargoWin.getCount() == 1){
                this.idpersonawin = th.getSelected().get('idpersona');
                self.btnAceptarest.enable();
            }else{
                this.idpersonawin = null;
                self.btnAceptarest.disable();
            }
        },this);

        this.smPersonaCargo.on('selectionchange',function(th){
            if(self.smPersonaCargo.getCount() == 1){
                self.btnAceptarControlador.enable();
            }else{
                self.btnAceptarControlador.disable();
            }
        },this);

        this.btnPFP.on('click',function(){
            self.WinPFP.show();
            if (self.fuenteDatosListadoPFP.getCount() == 0) {
                self.fuenteDatosListadoPFP.load({params:{start:0,limit:15,idestructura: self.idestructura}, callback: function (r, opt, suc) {
                    scope.recordsLoadedPerwin = r;
                }});
            }
            self.listadoPFP.getSelectionModel().clearSelections();
        });

        this.btnCancelarPFP.on('click',function(){
            self.WinPFP.hide();
        });

        this.btnAceptarPFP.on('click',function(){
            var idcontrolador = self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].id;
            var idpersonas = new Array();
            Ext.each(self.smPFP.getSelections(),function(rec){
                idpersonas.push(rec.data.idpersona);
            });
            addPersona(idcontrolador,Ext.encode(idpersonas));
        });

        this.estructura.tree.on('click', function(n){
            if (n.isLeaf()) {
                if (!Ext.isEmpty(n)) {
                    var nodeUI = n.ui;
                    nodeUI.checked = true;
                    nodeUI.checkbox.checked = true;
                    nodeUI.checkbox.defaultChecked = true;
                    n.attributes.checked = true;
                }
            }
        });

        this.eliminar = function() {
            var mensdel = self.idioma.lbTitMsgSeguroEliminar;
            var mensex = self.idioma.lbMsgDelPersonaExito;
            if (self.treeCargos.getSelectionModel().selNodes.length > 1) {
                mensdel = self.idioma.lbTitMsgSeguroEliminarp;
                mensex = self.idioma.lbMsgDelPersonaExitop;
            }
            mostrarMensaje(2, mensdel, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask( self.idioma.lbTitMsgEliminando);
                    var nodesId = new Array();
                    Ext.each(self.treeCargos.getSelectionModel().selNodes,function(selnode){
                        nodesId.push(selnode.attributes.id);
                    });
                    Ext.Ajax.request({
                        url: 'deleteNodeEstructura',
                        params:{idnodos: Ext.encode(nodesId)},
                        callback: function() {
                        },
                        success: function (r) {
                            Ext.getBody().unmask();
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, mensex);
                                Ext.each(nodesId,function(nod){
                                    self.treeCargos.getNodeById(nod).remove();
                                });
                            } else {
                                if (nodesId.length > 1) {
                                    mostrarMensaje(3, self.idioma.lbMsgPersonaUsop);
                                } else {
                                    mostrarMensaje(3, self.idioma.lbMsgPersonaUso);
                                }
                            }
                        }
                    });
                }
            });
        };

        buscarpersona = function() {
            var estap = false;
            var tVal = self.tfbuscar.getRawValue().toLowerCase();
            self.fuenteDatosListado.filterBy(
                function(rec) {
                    var tStr =  rec.data.nombreapellidos.toString().toLowerCase();
                    var tStrnid =  rec.data.numid.toString();
                    if (tStr.indexOf(tVal)!=-1 || tStrnid.indexOf(tVal)!=-1) {
                        estap = true;
                        return true;
                    }
                }
            );
            if (estap==false) {
                mostrarMensaje(1, 'No existen resultados que coincidan con el criterio de búsqueda.');
            }
        };

        buscarpersonaAll = function() {
            var esta = false;
            var tVal = self.tfbuscarPersWin.getRawValue().toLowerCase();
            self.fuenteDatosListadoPFP.filterBy(
                function(rec) {
                    var tStr =  rec.data.nombreapellidos.toString().toLowerCase();
                    var tStrnid =  rec.data.numid.toString();
                    if (tStr.indexOf(tVal)!=-1 || tStrnid.indexOf(tVal)!=-1) {
                        esta = true;
                        return true;
                    }
                }
            );
            if (esta==false) {
                mostrarMensaje(1, 'No existen resultados que coincidan con el criterio de búsqueda.');
            }
        };

        function SaveChange(idcontrolador,idpercontrolados,idpermovimientos,idcargosmovimientos)
        {
            Ext.getBody().mask(self.idioma.lbMsgmaskGuardar);
            Ext.Ajax.request({
                url: 'moverPersona',
                params: {
                    idcontrolador: idcontrolador,
                    idcontroladorold: self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id,
                    idpercontrolados: idpercontrolados,
                    idpermovimientos: idpermovimientos,
                    idcargosmovimientos: idcargosmovimientos
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var resp = Ext.decode(r.responseText);
                    if(self.winCambiarPersona.isVisible())
                        self.winCambiarPersona.hide();
                    if(self.WinPFP.isVisible())
                        self.WinPFP.hide();
                    if (resp == true) {
                        mostrarMensaje(1, self.idioma.lbMsgGuardarExito);
                        self.fuenteDatosListado.reload();
                    } else
                        mostrarMensaje(3, 'Alguna(s) persona(s) no puede(n) ser movidas.');
                }
            });
        }

        function addPersona(idcontrolador,idpersonas)
        {
            Ext.getBody().mask(self.idioma.lbMsgmaskGuardar);
            Ext.Ajax.request({
                url: 'addMovimientoPersona',
                params: {
                    idcontrolador: idcontrolador,
                    idspersonas: idpersonas
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var resp = Ext.decode(r.responseText);
                    if(self.winCambiarPersona.isVisible())
                        self.winCambiarPersona.hide();
                    if(self.WinPFP.isVisible())
                        self.WinPFP.hide();
                    self.fuenteDatosListado.reload();
                    mostrarMensaje(1, self.idioma.lbMsgGuardarExito);

                }
            });
        }

        function CambiarPersona(){
            var percontrolados = new Array();
            var permovimientos = new Array();
            var cargosmovimientos = new Array();
            Ext.each(self.listado.getSelectionModel().getSelections(), function(rec){
                if(rec.data.add == 1){
                    permovimientos.push(
                        rec.data.idpersona
                    );
                    cargosmovimientos.push(
                        rec.data.idcargo
                    );
                }else{
                    percontrolados.push(
                        rec.data.idpersona
                    );
                    cargosmovimientos.push(
                        rec.data.idcargo
                    );
                }
            });
            if(nodo != null){
                SaveChange(self.treeEstAsist.getSelectionModel().selNode.attributes.id, Ext.encode(percontrolados),
                    Ext.encode(permovimientos),Ext.encode(cargosmovimientos));
            }else
                mostrarMensaje(3, self.idioma.lbSeleccionarCargo);

        }

        function EliminarPersona(){
            var mensd = self.idioma.lbTitMsgSeguroEliminarR;
            var mensdex = self.idioma.lbMsgDelExito;
            if (self.listado.getSelectionModel().getSelections().length > 1) {
                mensd = self.idioma.lbTitMsgSeguroEliminarRp;
                mensdex = self.idioma.lbMsgDelExitop;
            }
            mostrarMensaje(2, mensd, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var arreglo = new Array();
                    Ext.each(self.listado.getSelectionModel().getSelections(), function(rec){
                        arreglo.push({
                            idpersona:rec.data.idpersona,
                            idcargo:rec.data.idcargo,
                            add:rec.data.add
                        });
                    });
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminandoR);
                    Ext.Ajax.request({
                        url: 'delPersonas',
                        params:{array: Ext.encode(arreglo),
                                idcontrolador: self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id},
                        callback: function() {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, mensdex);
                                self.fuenteDatosListado.reload();
                            }
                        }
                    });

                }
            });
        }

        function Cambiar(){
            if(self.listadoPersonasInCargoWin.hidden && scope.idconceptowin != 7) {
                mostrarMensaje(3,self.idioma.lbMsgSelecPerson);
            } else {
                if(!self.listadoPersonasInCargoWin.hidden && self.smPersonaCargoWin.getCount() != 1)
                    mostrarMensaje(3,self.idioma.lbMsgSelecPerson);
                else {
                    Ext.getBody().mask(self.idioma.lbMsgmaskGuardar);
                    Ext.Ajax.request({
                        url: 'cambiarControlador',
                        params: {
                            idcargonew: scope.idestructurawin,
                            idpersona:scope.idpersonawin,
                            idcontrolador: self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id
                        },
                        method: "POST",
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var resp = Ext.decode(r.responseText);
                            if (resp == true) {
                                var nodo = self.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0];
                                mostrarMensaje(1, self.idioma.lbMsgGuardarExito);
                                nodo.parentNode.reload();
                                self.estructurawin.tree.getRootNode().reload();
                                self.winCambiarCargo.hide();
                                self.smPersonaCargoWin.clearSelections();
                            } else {
                                mostrarMensaje(3,self.idioma.lbMsgPersonaExi);
                            }
                            return true;
                        }
                    });
                }
            }
        }

        Pvd.Maestro.EstructuraControl.panelEstructuraControl.superclass.initComponent.call(this);
    },
    AddControladorOrCargo: function(e,idpersona)
    {
        if (e.target.attributes.id == 'rootCargos' && idpersona == -1) {
            mostrarMensaje(6, 'La plantilla del cargo seleccionado se encuentra vac&iacute;a.');
        } else {
            var _self1 = this;
            var idcargos = new Array();
            var nocargos = new Array();
            Ext.each(this.estructura.tree.getChecked(), function (nodo) {
                if (nodo.attributes.idconcepto == 7) {
                    idcargos.push(nodo.attributes.id)
                } else if (this.estructura.tree.getChecked() > 1) {
                    nocargos.push(nodo.attributes.denominacion);
                }
            });

            var idarea = null;
            if (idcargos.length == 0) {
                var idest = this.estructura.tree.getSelectionModel().getSelectedNode().id;
                if (this.estructura.tree.getSelectionModel().getSelectedNode().attributes.idconcepto == 7) {
                    idcargos.push(idest)
                }
                else {
                    idarea = idest;
                }
            }
            e.cancel = false;
            this.maskara.show();
            Ext.Ajax.request({
                url: 'guardarConfiguracion',
                params: {
                    idestructuracontrol: _self1.idestructuracontrol,
                    idcargo: Ext.encode(idcargos),
                    idarea: idarea,
                    idpadre: e.target.attributes.id,
                    idpersona:idpersona
                },
                method: "POST",
                callback: function () {
                    _self1.maskara.hide();
                },
                success: function (r) {
                    var resp = Ext.decode(r.responseText);
                    if (resp == true) {
                        var nodo = e.target;
                        if(_self1.WinControlador.isVisible())
                            _self1.WinControlador.hide();
                        mostrarMensaje(1, _self1.idioma.lbMsgGuardarExito);
                        if (nodo.isExpanded()) {
                            _self1.treeCargos.getLoader().load(nodo);
                        }
                        nodo.expand(false,true,function(n){
                            _self1.treeCargos.doLayout();
                            _self1.maskara.hide();
                        });
                        _self1.estructura.tree.getRootNode().cascade(function (n) {
                            var ui = n.getUI();
                            ui.toggleCheck(false);
                        });
                    } else if (resp == false) {
                        mostrarMensaje(3, _self1.idioma.lbMsgPersonaExiste);
                    } else mostrarMensaje(3, _self1.idioma.lbMsgPersNoAdd);
                    if (nocargos.length > 0)
                        mostrarMensaje(3, _self1.idioma.lbElementosNoCargos + nocargos.join(',\n'));
                    return true;
                }
            });
        }
    }
});
