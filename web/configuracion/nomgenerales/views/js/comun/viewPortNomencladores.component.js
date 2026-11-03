/**
 *  Jorge Luis Cuellar Mondeja
 *  24/07/2013
 */
Ext.ns('Ext.erp');

Ext.erp.viewPortNomencladores = Ext.extend(Ext.Viewport, {
    sufijoTab: 'tab',
    layout: 'border',
    constructor: function (config) {
        var _this = this;

        /*
         *  Árbol para la navegación por nomencladores
         */
        this.treeMenu = new Ext.tree.TreePanel({
            title: config.title,
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

        /*
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
        Ext.erp.viewPortNomencladores.superclass.constructor.call(this, arguments);
    },
    /*
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
    addNodoTree: function (text, id, urlController, modelo, texttab) {
        var _this = this;

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            id: id,
            //hidden: true,
            iconCls: 'historial',
            urlController: urlController,
            modelo: modelo,
            listeners: {
                'click': function (nodo, evento) {
                    _this.selectTab(nodo, texttab);
                }
            }
        }));
    },
    /*
     *  Esta función permite seleccionar el componente relacionado a un elemento
     *  del menú, si el elemento esta creado, lo selecciona, sino lo crea y selecciona
     *
     *  @param nodo Elemento del menú
     */
    selectTab: function (nodo, texttab) {

        var _this = this;

        var idTab = this.sufijoTab + nodo.id;

        var neededTab = this.panelContenedor.getItem(idTab);

        if (neededTab) {
            this.panelContenedor.activate(neededTab);
        } else {
            _this.addTab(nodo, idTab, texttab);
        }
    },
    /*
     *  Crea componente correspondiente a un elemento del menú
     *
     *  @param nodo     Elemento del menú seleccionado
     *  @param idTab    Identificador del nuevo componente a crear ( sufijoTab + idnodo )
     */
    addTab: function (nodo, idTab, texttab) {
        var _this = this;

        Ext.Ajax.request({
            url: nodo.attributes.urlController + 'cargaretiquetas',
            method: 'POST',
            params: {
                vista: nodo.id
            },
            callback: function (options, success, response) {
                if (success) {
                    var tabContenido = new Ext.erp[nodo.id]({
                        closable: true,
                        title: (texttab) ? texttab : nodo.text,
                        id: idTab,
                        idioma: Ext.decode(response.responseText),
                        urlController: nodo.attributes.urlController,
                        modelo: nodo.attributes.modelo || null
                    });
                    _this.panelContenedor.add(tabContenido).show();
                    _this.doLayout();
                }
            }
        });
    }
});