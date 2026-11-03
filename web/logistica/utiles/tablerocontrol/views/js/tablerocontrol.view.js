Ext.ns('LOG.lb.TableroControl');

LOG.lb.TableroControl.Vista = Ext.extend(Ext.Viewport, {
    sufijoTab: 'tab',
    layout: 'border',
    constructor: function(config) {
        var _this = this;
        var idioma = config.idioma;
        this.acciones = config.acciones;
        /**
         *  Árbol para la navegación
         */
        /*this.treeMenu = new Ext.tree.TreePanel({
            title: idioma.tlPanel,
            region: 'west',
            id: 'idvpnomencladores',
            width: 280,
            minSize: 175,
            maxSize: 500,
            collapsible: true,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            titleCollapse: true,
            root: new Ext.tree.TreeNode({
                text: '',
                draggable: false,
                expanded: true,
                id: '0'
            })
        });

        *//**
         *  Panel central donde se mostrarán los nomencladores correspondientes a
         *  los elementos seleccionados en el menú de la interfaz
         */
        this.panelContenedor = new Ext.TabPanel({
            region: 'center',
            frame: true,
            minTabWidth: 135,
            tabWidth: 210,
            enableTabScroll: true,
            layoutOnTabChange: true,
            id: 'tabPanelCentral'
        });
        this.groupTab = this.addGroupTabs();
        this.items = [this.groupTab];
        LOG.lb.TableroControl.Vista.superclass.constructor.call(this, arguments);
    },
    addGroupTabs: function(){
        var _this = this;
        var items = new Array();
        for (var i = 0; i < _this.acciones.length; i++) {
            switch (_this.acciones[i].abreviatura) {
                case 'TCPED':
                    items.push({
                        //mainItem: 1,
                        items: [{
                            title: 'Pedido',
                            layout: 'fit',
                            iconCls: 'x-icon-tickets',
                            tabTip: 'Grupo de pedido',
                            style: 'padding: 10px;'
                        },
                            {
                                title: 'Pedidos-Clientes',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcpedido'].tpp({})]
                            }, {
                                title: 'Cumplimiento',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcpedido'].cp({})]
                            },{
                                title: 'Con/Sin reclamos',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcpedido'].csr({})]
                            }]
                    });
                    break;
                case 'TCDIST':
                    items.push({
                        //mainItem: 1,
                        items: [{
                            title: 'Distribucion',
                            layout: 'fit',
                            iconCls: 'x-icon-tickets',
                            tabTip: 'Grupo de pedido',
                            style: 'padding: 10px;'
                        },
                            {
                                title: 'Clientes-Importes',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcdistribucion'].ci({})]
                            }, {
                                title: 'Pedidos-Facturas',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcdistribucion'].cf({})]
                            }, {
                                title: 'Entregas',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcdistribucion'].ep({})]
                            }]
                    });
                    //viewport.addNodoTree('Distribución', 'tcdistribucion', null, true);
                    break;
                case 'TCINV':
                    items.push({
                        //mainItem: 1,
                        items: [{
                            title: 'Inventario',
                            layout: 'fit',
                            iconCls: 'x-icon-tickets',
                            tabTip: 'Grupo de pedido',
                            style: 'padding: 10px;'
                        },
                            {
                                title: 'Rotacion',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcinventario'].rm({})]
                            }, {
                                title: 'Valor economico',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcinventario'].ve({})]
                            }, {
                                title: 'Duracion',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcinventario'].dur({})]
                            }, {
                                title: 'Lotes vencidos',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcinventario'].ilv({})]
                            }]
                    });
                    //viewport.addNodoTree('Inventario', 'tcinventario', null, true);
                    break;
                case 'TCTALL':
                    viewport.addNodoTree('Talleres', 'tctalleres', null, true);
                    break;
                case 'TCAFT':
                    viewport.addNodoTree('Activo fijo', 'tcaft', null, true);
                    break;
                case 'TCFAC':
                    items.push({
                        //mainItem: 1,
                        items: [{
                            title: 'Facturación',
                            layout: 'fit',
                            iconCls: 'x-icon-tickets',
                            tabTip: 'Grupo de facturación',
                            style: 'padding: 10px;'
                        },
                            {
                                title: 'Cliente-Facturas',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcfacturacion'].cf({})]
                            }, {
                                title: 'Cliente-Ofertas',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcfacturacion'].co({})]
                            }, {
                                title: 'Cliente-Notas',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcfacturacion'].cn({})]
                            },{
                                title: 'Cliente-Importes',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcfacturacion'].ci({})]
                            }]
                    });
                    break;
                case 'TCPTV':
                    viewport.addNodoTree('Punto de venta', 'tcpuntoventa', null, true);
                    break;
                case 'TCRESEST':
                    items.push({
                        //mainItem: 1,
                        items: [{
                            title: 'Reserva Estatal',
                            layout: 'fit',
                            iconCls: 'x-icon-tickets',
                            tabTip: 'Graficas de la reserva estatal',
                            style: 'padding: 10px;'
                        },
                            {
                                title: 'Movimientos',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcresest'].cf({title: 'Productos por movimientos'})]
                            }, {
                                title: 'Estado',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcresest'].co({title: 'Productos por estado de vencimiento'})]
                            }, {
                                title: 'Acumulaci\xf3n',
                                iconCls: 'x-icon-subscriptions',
                                tabTip: 'Subscriptions tabtip',
                                style: 'padding: 10px;',
                                layout: 'fit',
                                items: [new Ext.erp['tcresest'].cn({title: 'Acumulaci\xf3n del producto - Cantidad del producto'})]
                            }]
                    });
                    break;

            }
        }
        var groupTab = new Ext.ux.GroupTabPanel({
            //xtype: 'grouptabpanel',
            tabWidth: 130,
            region: 'center',
            activeGroup: 0,
            items: items
        });
        return groupTab;
    },
    /**
     *  NOTA: El id del nodo debe coincidor con el nombre de la clase que
     *        implementa el contenido del tab correpondiente Ej: Si la clase
     *        que implementa el contenido es Ext.erp.naturaleza, el id del
     *        nodo debe ser naturaleza.
     *
     *  @param text             Texto que mostrará el nodo en el árbol menú
     *  @param id               Identificador del nodo
     *  @param urlController    Dirección de la controladora correspondiente al componente
     *                           correspondiente al nodo Ejemplo:
     *                           '/configuracion/nomencladores/index.php/naturaleza/'
     */
    addNodoTree: function (text, id, urlController, deposito, isTemplate) {
        var _this = this;

        /*this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            id: id,
            iconCls: 'historial',
            urlController: urlController,
            deposito: deposito,
            isTemplate: (isTemplate != undefined) ? isTemplate : true,
            listeners: {
                'click': function (nodo, evento) {
                    _this.selectTab(nodo);
                }
            }
        }));*/
    },
    /**
     *  Esta función permite seleccionar el componente relacionado a un elemento
     *  del menú, si el elemento esta creado, lo selecciona, sino lo crea y selecciona
     *
     *  @param nodo Elemento del menú
     */
    selectTab: function (nodo) {
        /*var _this = this;
        var idTab = this.sufijoTab + nodo.id;
        var neededTab = this.panelContenedor.getItem(idTab);
        if (neededTab) {
            this.panelContenedor.activate(neededTab);
        } else {
            _this.addTab(nodo, idTab);
        }*/
    },
    /*
     *  Crea componente correspondiente a un elemento del menú
     *
     *  @param nodo     Elemento del menú seleccionado
     *  @param idTab    Identificador del nuevo componente a crear ( sufijoTab + idnodo )
     */
    addTab: function (nodo, idTab) {
        /*var _this = this;
        var tabContenido = new Ext.erp[nodo.id]({});

        tabContenido.setTitle(nodo.text);
        tabContenido.id = idTab;
        tabContenido.closable = true;
        _this.panelContenedor.add(tabContenido).show();

        _this.doLayout();*/
    }
});