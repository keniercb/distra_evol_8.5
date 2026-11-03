/**
 * Created by yoendy on 2/23/2016.
 */
Ext.ns('LOG.aft.Recuperaciones');

LOG.aft.Recuperaciones.Vista = Ext.extend(Ext.Viewport, {
    sufijoTab: 'tab',
    layout: 'border',
    constructor: function (config) {
        var _this = this;
        this.acciones = config.acciones;
        Ext.apply(this, config);
        /**
         *  Árbol para la navegación
         */
        this.treeMenu = new Ext.tree.TreePanel({
            title: "Reportes",
            region: 'west',
            id: 'idvprecuperaciones',
            width: 365,
            minSize: 175,
            maxSize: 500,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            animCollapse: false,
            collapsible: true,
            collapsed: false,
            split: true,
            titleCollapse: true,
            collapseMode: 'mini',
            root: new Ext.tree.TreeNode({
                text: '',
                draggable: false,
                expanded: true,
                id: '0'
            })
        });
        /**
         *  Panel central donde se mostrarán las recuperaciones correspondientes a
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

        this.items = [_this.treeMenu, _this.panelContenedor];
        LOG.aft.Recuperaciones.Vista.superclass.constructor.call(this, config);
    },
    /**
     *  NOTA: El id del nodo debe coincidor con el nombre de la clase que
     *        implementa el contenido del tab correpondiente Ej: Si la clase
     *        que implementa el contenido es Ext.erp.listadoactivos, el id del
     *        nodo debe ser listadoactivos.
     *
     *  @param text             Texto que mostrará el nodo en el árbol menú
     *  @param id               Identificador del nodo
     *  @param urlController    Dirección de la controladora correspondiente al componente
     *                           correspondiente al nodo Ejemplo:
     *                           '/activo_fijos/recuperaciones/index.php/recuperaciones/'
     */
    addNodoTree: function (text, id, urlController, deposito, isTemplate, isNew) {
        var _this = this;

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: isNew ? text + '<span style="color:#00CC66;"><b>(NUEVO)</b></span>' : text,
            id: id,
            iconCls: 'historial',
            urlController: urlController,
            deposito: deposito,
            isTemplate: isTemplate,
            listeners: {
                'click': function (nodo, evento) {
                    _this.selectTab(nodo);
                }
            }
        }));
    },
    /**
     *  Esta función permite seleccionar el componente relacionado a un elemento
     *  del menú, si el elemento esta creado, lo selecciona, sino lo crea y selecciona
     *
     *  @param nodo Elemento del menú
     */
    selectTab: function (nodo) {
        var _this = this;
        var idTab = this.sufijoTab + nodo.id;
        var neededTab = this.panelContenedor.getItem(idTab);
        if (neededTab) {
            this.panelContenedor.activate(neededTab);
        } else {
            _this.addTab(nodo, idTab);
        }
    },
    /*
     *  Crea componente correspondiente a un elemento del menú
     *
     *  @param nodo     Elemento del menú seleccionado
     *  @param idTab    Identificador del nuevo componente a crear ( sufijoTab + idnodo )
     */
    addTab: function (nodo, idTab) {
        var _this = this;
        var tabContenido = new LOG.aft[nodo.id].view({
            acciones: _this.acciones
        });
        if (nodo.attributes.deposito == true) {
            //tabContenido.attachPlugin(new LOG.lb.plugin.ComboDepositos());
        }
        if (nodo.attributes.isTemplate) {
            console.info(tabContenido);
            tabContenido.init();
            var vista = tabContenido.view();
            vista.setTitle(nodo.text);
            vista.id = idTab;
            vista.closable = true;
            _this.panelContenedor.add(vista).show();
        } else {
            tabContenido.setTitle(nodo.text);
            tabContenido.id = idTab;
            tabContenido.closable = true;
            _this.panelContenedor.add(tabContenido).show();
        }
        _this.doLayout();
    }
});

LOG.aft.obtenerGridAreas = function (idioma) {
    var listaAreas = new LOG.util.List();
    var checkAreas = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    listaAreas.add(checkAreas);
    listaAreas.add({
        header: idioma.gcArea,
        width: 250,
        dataIndex: 'deposito',
        autoExpand: true,
        default: true
    });

    var clsAreas = LOG.util.UIManager.proccessColumns(listaAreas);
    var cmAreas = new Ext.grid.ColumnModel(clsAreas.columns);
    var smAreas = checkAreas;
    var stAreas = new Ext.data.Store({
        url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad',
            fields: [
                {
                    name: 'iddeposito'
                },
                {
                    name: 'deposito'
                }
            ]
        })
    });

    var gridAreas = LOG.util.UIManager.initGrid(cmAreas, stAreas, smAreas, {
        style: '-moz-border-radius:5px',
        title: idioma.fsSelecAreas,
        height: 500,
        expanded: clsAreas.expanded
    });
    return gridAreas;
};
LOG.aft.obtenerGridUbicacion = function (idioma) {
    var listaUbicaciones = new LOG.util.List();
    var checkUbicaciones = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    listaUbicaciones.add(checkUbicaciones);
    listaUbicaciones.add({
        header: idioma.gcUbicacion,
        width: 250,
        dataIndex: 'deposito',
        autoExpand: true,
        default: true
    });

    var clsUbicaciones = LOG.util.UIManager.proccessColumns(listaUbicaciones);
    var cmUbicaciones = new Ext.grid.ColumnModel(clsUbicaciones.columns);
    var smUbicaciones = listaUbicaciones;
    var stUbicaciones = new Ext.data.Store({
        url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
        // autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad',
            fields: [
                {
                    name: 'iddeposito'
                },
                {
                    name: 'deposito'
                }
            ]
        })
    });

    var griUbicaciones = LOG.util.UIManager.initGrid(cmUbicaciones, stUbicaciones, smUbicaciones, {
        style: '-moz-border-radius:5px',
        height: 370,
        expanded: clsUbicaciones.expanded
    });
    return griUbicaciones;
};
LOG.aft.ventanaOperDoc = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(LOG.aft.listadodocumentos.Idioma, LOG.util.Idioma);
        // config.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadodocumentos';
        config.urlBusquedaGridPrincipal = 'getListadoOperaciones';
        config.modoSeleccion = 3;
        config.autoSelect = false;
        config.autoLoad = true;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config = Ext.apply(_this, config);
        LOG.aft.ventanaOperDoc.superclass.constructor.call(this, config);
        _this.concepto = this.idioma.operDoc;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;


    },
    init: function () {
        var _this = this;
        LOG.aft.ventanaOperDoc.superclass.init.call(this);
        _this.getVistaPrincipal().width = '100%';
        _this.getVistaPrincipal().height = 250;
        _this.getVistaPrincipal().title = this.idioma.fsSelecTipoDoc;

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.gcOperacion,
            width: 250,
            dataIndex: 'denominacion',
            autoExpand: true,

            default: true
        });
        this.addGridColumn({
            dataIndex: 'idoperacion'
        });
        this.addGridColumn({
            dataIndex: 'codigo'
        });
        this.addGridColumn({
            dataIndex: 'iddatosespecificos'
        });

    },
    render: function (conf) {
        var _this = this;
        var vista = LOG.aft.ventanaOperDoc.superclass.render.call(this, conf);
        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {
                console.info("cargando");
            } else if (e == 'load') {
                console.info("cargo");
            }
        });
        return vista;
    }
});


LOG.aft.cmbTipoReport = function (scope) {
    scope.cmbTipoReport = new LOG.util.ComboBox({
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        hiddenName: 'idtporeporte',
        valueField: 'idtporeporte',
        displayField: 'denominacion',
        store: new Ext.data.SimpleStore({
            fields: ['idtporeporte', 'denominacion'],
            data: [
                [1, 'Control de Utiles y Herramientas en Uso por Trabajador'],
                [2, 'Listado de activos por responsables'],
                [3, 'Modelo de activos fijos(Modelo SC-1-07)'],
                /*  [4, 'Modelo inventario f\xedsico de activos fijos'],*/
                [5, 'Modelo SC-1-08-Registro de depreciaci\xf3n']
            ]
        }),
        triggerAction: 'all',
        forceSelection: true,
        typeAhead: true,
        mode: 'local',
        width: 100,
        emptyText: 'Seleccione...',
        enableKeyEvents: true,
        listeners: {
            'select': function (cmp, record) {
                if (record.data.idtporeporte == 5) {
                    scope.dfHasta.enable();
                    scope.dfDesde.enable();
                } else {
                    scope.dfHasta.reset();
                    scope.dfDesde.reset();
                    scope.dfHasta.disable();
                    scope.dfDesde.disable();
                }
            }
        }



        /*,
         listeners: {
         'specialkey': function (cmp, e) {
         if (e.getKey() == Ext.EventObject.ENTER) {
         scope.gridFilter.btnFiltar.handler();
         }
         }
         }*/
    });
    /* scope.cmbBuscarEstado.fireEvent = scope.cmbBuscarEstado.fireEvent.createSequence(function(e, args) {
     if ('select' == e) {
     //if (String(v.idEntidad) !== String(args)) {
     var params = {};
     scope.getStorePrincipal().initBaseParams.idestado = args.getValue();
     Ext.apply(params, scope.getStorePrincipal().initBaseParams);
     Ext.apply(params, scope.getStorePrincipal().limitParams);
     scope.getStorePrincipal().load({
     params: params
     });
     //}
     }
     });*/
    return scope.cmbTipoReport;
};



Ext.ns("Ext.components");
Ext.components.TreeComboBox = Ext.extend(Ext.form.ComboBox, {
    tree: null,
    treeId: 0,
    callbackClick: null,
    fieldLabel: '',
    getTreeId: function (text) {
        return this.treeId;
    },
    initComponent: function () {
        var tplwidth = '';
        this.treeId = Ext.id();
        this.focusLinkId = Ext.id();
        if (this.width) {
            tplwidth = 'width:' + this.width;
        }
        var height = (this.height) ? this.height : '200px';
        Ext.apply(this, {
            store: new Ext.data.SimpleStore({
                fields: [],
                data: [[]]
            }),
            editable: false,
            shadow: false,
            mode: 'local',
            triggerAction: 'all',
            maxHeight: 200,
            tpl: '<tpl for="."><div style="height:' + height + ';' + tplwidth + '" id="' + this.treeId + '"><a href="#" class="x-grid3-focus" id="' + this.focusLinkId + '" tabIndex="-1"/></div></tpl>',
            selectedClass: '',
            onSelect: Ext.emptyFn,
            valueField: 'id'
        });

        var treeConfig = {
            border: false
        };

        Ext.apply(treeConfig, this.treeConfig);

        if (!treeConfig.root) {
            treeConfig.root = new Ext.tree.AsyncTreeNode({
                text: 'treeRoot',
                id: '0'
            });
        }

        this.tree = new Ext.tree.TreePanel(treeConfig);

        this.on('expand', this.onExpand);
        this.tree.on('click', this.onClick, this);

        Ext.components.TreeComboBox.superclass.initComponent.call(this);
    },
    onTriggerClick: function () {
        if (this.disabled) {
            return;
        }
        if (this.isExpanded()) {
            this.collapse();
        } else {
            this.onFocus({});
            if (this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            } else {
                this.doQuery(this.getRawValue());
            }
        }
    },
    onClick: function (node) {
        this.valueNotFoundText = node.text;
        var value = (node.attributes.leaf) ? node.id : node.parentNode.attributes.id,
                text = (node.attributes.leaf) ? node.text : node.parentNode.attributes.text;
        this.setValue(value);
        this.setRawValue(text);
//        if(this.callbackClick)this.callbackClick(node);
    },
    onExpand: function () {
        this.tree.render(this.treeId);
        this.tree.focus();
        var firstParent = Ext.get(this.treeId).dom.parentNode;
        var secondParent = firstParent.parentNode;
        firstParent.style.width = '100%';
        secondParent.style.width = this.width;
    },
    getValue: function () {
        if (this.tree.getSelectionModel().selNode) {
            return this.tree.getSelectionModel().selNode.id;
        }
    }
});

Ext.reg("treecombobox", Ext.components.TreeComboBox);