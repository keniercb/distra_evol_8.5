Ext.ns('Ext.Persona');

Ext.Persona.Controller = function (idioma, vista, modelo) {
    Ext.apply(this, {
        idioma: idioma,
        vista: vista,
        modelo: modelo
    });
    Ext.Persona.Controller.superclass.constructor.call(this);
    this.init();
};

Ext.extend(Ext.Persona.Controller, Ext.util.Observable, {
    init: function () {
        this.variables = {
            path: '',
            idNode: null
        };
        this.estructuraEvents();
        this.actualidadEvent();
    },
    estructuraEvents: function () {
        this.vista.pEstructura.on('render', function (p) {
            p.setWidth('30%');
        }, this);

        this.vista.pEstructura.tree.getSelectionModel().on('selectionchange', function (selModel, n) {
            if (n) {
                var node = n.id !== this.vista.pEstructura.tree.getRootNode().id
                    ? n
                    : {id: null};
                var entidad = this.nodeIsEntidad(node) ? node : this.getEntidadByEstructuraNode(node);
                this.vista.pActualidad.setDatosEstructura(node, this.nodeIsCargo(node), entidad);
                this.vista.pReservaCargo.setDatosEstructura(node, this.nodeIsCargo(node), entidad);
                //this.vista.pContratacion.setDatosEstructura(node, this.nodeIsCargo(node), entidad);
                this.vista.pPersonas.getActiveTab().updateListado.call(this.vista.pPersonas.getActiveTab(), node, entidad);
            }
        }, this);
    },
    actualidadEvent: function () {
        this.vista.pActualidad.on('alta', function () {
            var n = this.vista.pEstructura.tree.getSelectionModel().getSelectedNode();
            this.variables.path = n.getPath();
            this.variables.idNode = n.id;
            var entidad = this.getEntidadByEstructuraNode(n);
            this.loadEntidadEstructura(entidad ? entidad.id : null);
        }, this);
        this.vista.pActualidad.on('normal', function () {
            this.loadEntidadEstructura(null, this.variables.path, this.variables.idNode);
        }, this);
        this.vista.pActualidad.on('expandirArbol', function (path, id) {
            this.expandPath(path, id);
        }, this);
    },
    nodeIsCargo: function (n) {
        var node = n instanceof Ext.tree.TreeNode ? n : this.vista.pEstructura.tree.getNodeById(n);

        if (Ext.isEmpty(node)) {
            return false;
        }

        return parseInt(node.attributes.idconcepto) === 7 || parseInt(node.attributes.idconcepto) === 10 ? true : false;
    },
    nodeIsEntidad: function (n) {
        var node = n instanceof Ext.tree.TreeNode ? n : this.vista.pEstructura.tree.getNodeById(n);

        if (Ext.isEmpty(node)) {
            return false;
        }

        if (parseInt(n.attributes.idconcepto) === 3 || parseInt(n.attributes.idtipo) === 3)
            return true;
        else
            return false;
    },
    getEntidadByEstructuraNode: function (n) {
        var identidad = false;
        if (n instanceof Ext.tree.TreeNode) {
            if (this.nodeIsEntidad(n)) {
                return n;
            }
            n.bubble(function (n) {
                if (parseInt(n.attributes.idconcepto) === 3 || parseInt(n.attributes.idtipo) === 3) {
                    identidad = n;
                    return false;
                }
            });
        }
        return identidad;
    },
    loadEntidadEstructura: function (id, path, selNode) {
        this.vista.pEstructura.inicial = id || null;
        this.vista.pEstructura.tree.getLoader().load(this.vista.pEstructura.tree.getRootNode(), function () {
            if (Ext.isEmpty(path)) {
                this.vista.pEstructura.tree.getRootNode().expand(false, true, function (root) {
                    this.vista.pEstructura.tree.getSelectionModel().select(root.firstChild);
                }.createDelegate(this));
            } else {
                this.expandPath(path, selNode);
            }
        }.createDelegate(this));
    },
    expandPath: function (path, selNode) {
        var tree = this.vista.pEstructura.tree;
        if (this.vista.pEstructura.collapsed) {
            this.vista.pEstructura.expand();
        }
        tree.expandPath(path, 'id', function () {
            tree.getSelectionModel().select(tree.getNodeById(selNode));
        });
    }
});