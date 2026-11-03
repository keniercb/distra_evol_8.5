Ext.ns('LOG.fac.recupuntoventa');

LOG.fac.recupuntoventa.Viewer = Ext.extend(Ext.Viewport, {
    sufijoTab: 'tab',
    layout: 'border',
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        /**
         *  Árbol para la navegación
         */
        this.treeMenu = new Ext.tree.TreePanel({
            title: this.idioma.tlPanel,
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

        /**
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
        this.items = [_this.treeMenu, _this.panelContenedor];
        LOG.fac.recupuntoventa.Viewer.superclass.constructor.call(this, arguments);
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
    addNodoTree: function (text, id, urlController) {
        var _this = this;
        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            id: id,
            iconCls: 'historial',
            urlController: urlController,
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
            neededTab.getPanelGrid().focus()
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
        var tabContenido = new LOG.fac.puntoventa.recuperaciones[nodo.id]({idioma: this.idioma});
        tabContenido.init();
        var vista = tabContenido.view();
        vista.setTitle(nodo.text);
        vista.id = idTab;
        vista.closable = true;
        this.panelContenedor.add(vista).show();
        tabContenido.getPanelGrid().focus()
        this.doLayout();
    }
});

