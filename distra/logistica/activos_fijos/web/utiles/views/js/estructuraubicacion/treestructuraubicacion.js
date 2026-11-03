Ext.ns('Ext.Log.Treestructuraubicacion');

Ext.QuickTips.init();

Ext.Log.Treestructuraubicacion.ventana = Ext.extend(Ext.Window, {
    idioma: '',
    constructor: function (config) {
        var _this = this;

        this.doAction = config.doAction;        
        this.baseDirController = '/logistica/utiles/ubicacion/index.php/estructuraubicacion/';
        this.layout = 'fit', this.closeAction = 'hide';
        this.modal = true;
        this.idubicacion = config.idubicacion;
       
        Ext.Ajax.request({
            url: _this.baseDirController + 'cargaretiquetas',
            callback: function (options, success, response) {
                if (success) {
                    _this.idioma = Ext.decode(response.responseText);
                    _this._initComponent(config);
                    _this.show();

                }
            }
        });
        Ext.Log.Treestructuraubicacion.ventana.superclass.constructor.call(this, config);
    },
    _initComponent: function (config) {
        var _this = this;
        this.height = 400;
        this.width = 320;
        this.title = _this.idioma.titleArbolEstructuraU;

        this.btnCancelar = new Ext.Button({
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbBtnCancelar,
            iconCls: 'cancelar',
            handler: function () {
                _this.close();
            }
        });
        this.btnAceptar = new Ext.Button({
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbBtnAceptar,
            iconCls: 'aceptar'
        });

        this.treeLoader = new Ext.tree.TreeLoader({
            dataUrl: _this.baseDirController + 'cargarArbol',
            listeners: {
                load: function (This, node, response) {
                    var datos = Ext.decode(response.responseText);
                    //if(typeof(node.isRoot)!='undefine')
                    if (node.isRoot) {
                        if (datos.length == 0) {
                            mostrarMensaje(3, _this.idioma.lbMsgNoEstructuras);
                        }
                    }
                },
                beforeload: function (loader, nodo, fnCallBack) {
                    // tipo estructura 1 -> Deposito
                    // tipo estructura 2 -> Area Responsabilidad
                    loader.baseParams.medios1 = (config.tipoestructura) ? config.tipoestructura : 1;
                    loader.baseParams.ultimonivel = (config.ultimonivel) ? config.ultimonivel : - 1;
                }
            }

        });

        this.tpEstructurae = new Ext.tree.TreePanel({
            enableDD: false,
            autoScroll: true,
            collapsible: true,
            style: 'margin: 2 0 0 0',
            margins: '1 1 1 1',
            id: 'tree',
            loader: _this.treeLoader,
            frame: false
        });

        this.nodopadre = new Ext.tree.AsyncTreeNode({
            text: _this.arearesp,//_this.idioma.lbEstructuraUbicacion,
            draggable: false,
            id: _this.idubicacion,
            animate: false,
            expanded: true
        });

        this.tpEstructurae.setRootNode(_this.nodopadre);

        this.panel = new Ext.Panel({
            border: true,
            frame: false,
            layout: 'fit',
            items: [this.tpEstructurae]
        });

        this.initEventos();

        Ext.applyIf(this, {
            frame: false,
            buttons: [_this.btnCancelar, _this.btnAceptar],
            items: [_this.panel]
        });

        Ext.Log.Treestructuraubicacion.ventana.superclass.initComponent.call(this, arguments);

    },
    initEventos: function () {

        var _this = this;

        _this.tpEstructurae.on('beforeexpandnode', function (node) {
            if (! node.isSelected()) {
                node.select();
            }
        }, this);

        this.tpEstructurae.on('dblclick', function (node, e) {
            _this.doAction(node);
        }, this);

        this.btnCancelar.on('click', function () {
            _this.hide();
        });

        this.btnAceptar.on('click', function () {
            _this.doAction(_this.tpEstructurae.getSelectionModel().getSelectedNode());
        });
    }
});	