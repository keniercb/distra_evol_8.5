Ext.ns('Ext.Contabilidad');

Ext.Contabilidad.TreeNomenclador = Ext.extend(Ext.tree.TreePanel, {
    region: 'west',
    id: 'idtreenomencladores',
    width: 280,
    minSize: 175,
    maxSize: 300,
    // split: true,
    // collapseMode: 'mini',
    // collapsible: true,
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
    }),
    constructor: function (config) {
        this.title = config.title;
        Ext.Contabilidad.TreeNomenclador.superclass.constructor.call(this);
        this.addEvents({
            seleccion: true
        });
    },
    adicionarItem: function (item) {
        var _this = this;
        var node = new Ext.tree.TreeNode({
            text: item.prototype.textnomenclador,
            id: item.prototype.idnomenclador,
            //hidden: true,
            iconCls: 'historial',
            listeners: {
                'click': function (nodo, evento) {
                    _this.fireEvent('seleccion', nodo);
                }
            }
        });
        node.itemm = item;
        this.getRootNode().appendChild(node);

    }
});