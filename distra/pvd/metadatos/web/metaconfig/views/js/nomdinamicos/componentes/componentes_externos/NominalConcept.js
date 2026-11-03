/*
 * NominalConcept
 * Componente para gestionar los conceptos basicos asociados a la persona
 * XETID
 *
 * Ultima modificacion: Noviembre 2013
 */
Ext.ns('Ext.components');

Ext.ux.Portlet = Ext.extend(Ext.Panel, {
    anchor: '100%',
    frame:true,
    collapsible:true,
    draggable:true,
    cls:'x-portlet'
});
Ext.reg('portlet', Ext.ux.Portlet);

Ext.ux.PortalColumn = Ext.extend(Ext.Container, {
    layout: 'anchor',
    autoEl: 'div',
    defaultType: 'portlet',
    cls: 'x-portal-column'
});
Ext.reg('portalcolumn', Ext.ux.PortalColumn);

Ext.components.NominalConcept = Ext.extend(Ext.Panel, {
    layout: 'column',
    autoScroll: true,
    cls: 'x-portal',
    defaultType: 'portalcolumn',

    initComponent: function () {
        var self = this;

        this.addEvents(
            'changeStatus'
        );

        this.listComponents = new Array();

        Ext.components.NominalConcept.superclass.initComponent.call(this);

        this.addEvents({
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true,
            contextmenu: true
        });

        this.on('resize', function () {
            if (this.listComponents.length > 0) {
                Ext.each(this.items.items[0].items.keys, function (key) {
                    Ext.getCmp(key).fireEvent('resize', Ext.getCmp(key));
                }, this);
            }
        }, this);

        this.on('changeStatus', function (datos) {
            this.setTitle(datos.nombre + ' ' + datos.papel + ' ' + datos.sapel, 'user_edit');
            Ext.apply(this.persona, datos);
            this.accion = 'MOD';
        }, this);

    },

    /**
     * Adiciona un nuevo elemento al panel
     * @param Ext.Panel
     */
    addConcept: function (cmp) {
        if (!this.existConcept(cmp)) {
            //Adiciona el componente si no esta creado en la posicion definida
            this.items.items[1].insert(0, cmp);
            //this.items.items[0].push( cmp);
            this.listComponents.push(cmp.id);
            this.doLayout();
            //Autoscroll hacia el componente
            document.location.href = '#' + cmp.id;
            return true;
        } else {
            document.location.href = '#' + cmp.id;
            this.expand(cmp, true);
            return false;
        }
        this.fireEvent('add', this, Ext.getCmp(cmp.id));

    },

    /**
     * Funcion para chequer si los conceptos mostrados tienen datos sin guardar
     * @returns {boolean}
     */
    isDirty: function () {
        var dirty = false;
        Ext.each(this.getConceptActivos(), function (id) {
            var cmp = Ext.getCmp(id);
            if (cmp.isDirty.call(cmp) === true) {
                dirty = true;
                return false;
            }
        }, this);
        return dirty;
    },

    /**
     * Obtiene un arreglo con los id de los componentes visibles
     * @returns {Array}
     */
    getConceptActivos: function () {
        var cmpIds = new Array();
        if (!this.rendered) {
            return cmpIds;
        }
        Ext.each(this.items.items[0].items.keys, function (key) {
            cmpIds.push(key);
        }, this);
        return cmpIds;
    },

    /**
     * Verifica si existe el componente en el panel
     * @param cmp
     * @returns {boolean}
     */
    existConcept: function (cmp) {
        var flag = false;
        Ext.each(this.items.items[0].items.keys, function (key) {
            if (key == cmp.id) {
                //Verifica que el componente no exista
                flag = true;
            }
        });
        return flag;
    },

    /**
     * Colapsa todos los componentes dado un arreglo de los mismos, si el arrelgo es vacio colapsa todos los
     * elementos del panel
     * @param arrCmp
     * @param bool
     */
    collapseAll: function (arrCmp, bool) {
        if (!Ext.isEmpty(arrCmp)) {
            Ext.each(arrCmp, function (rec) {
                if (this.existConcept(rec)) {
                    this.collapse(Ext.getCmp(rec.id), bool || false);
                }
            }, this);
        } else {
            Ext.each(this.items.items[0].items.keys, function (key) {
                this.collapse(Ext.getCmp(key), bool || false);
            }, this);
        }
        this.doLayout();
    },

    /**
     * Expand todos los componentes dado un arreglo de los mismos, si el arreglo es vacio expande todos
     * los elementos del panel
     * @param arrCmp
     * @param bool
     */
    expandAll: function (arrCmp, bool) {
        if (!Ext.isEmpty(arrCmp)) {
            Ext.each(arrCmp, function (rec) {
                if (this.existConcept(rec)) {
                    this.expand(rec, bool || false);
                }
            }, this);
        } else {
            Ext.each(this.items.items[0].items.keys, function (key) {
                this.expand(Ext.getCmp(key), bool || false);
            }, this);
        }
        this.doLayout();
    },

    /**
     * Colapsa un componente del panel
     * @param cmp
     * @param bool
     */
    collapse: function (cmp, bool) {
        if (!Ext.getCmp(cmp.id).collapsed) {
            Ext.getCmp(cmp.id).collapse(bool || false);
        }
    },

    /**
     * Expande un componente del panel
     * @param cmp
     * @param bool
     */
    expand: function (cmp, bool) {
        if (Ext.getCmp(cmp.id).collapsed) {
            Ext.getCmp(cmp.id).expand(bool || false);
        }
    },

    /**
     * Elimina un elemento del panel
     * @param cmp
     */
    removeConcept: function (cmp, force) {
        if (this.existConcept(cmp)) {
            if (force) {
                this.fireEvent('remove', this, Ext.getCmp(cmp.id));
                this.listComponents.remove(cmp.id);
                Ext.getCmp(cmp.id).ownerCt.remove(Ext.getCmp(cmp.id), true);
                this.doLayout();
            } else {
                Ext.getCmp(cmp.id).tools.close.handler(null, null, Ext.getCmp(cmp.id));
            }
        }
    },

    onContextMenu: function (e) {
        e.stopEvent();
        if (!this.menu) {
            this.menu = new Ext.menu.Menu([
                {
                    text: 'Colapsar todos',
                    iconCls: 'contraer',
                    handler: function () {
                        this.collapseAll();
                    }.createDelegate(this)
                },
                {
                    text: 'Expandir todos',
                    iconCls: 'expandir',
                    handler: function () {
                        this.expandAll();
                    }.createDelegate(this)
                }
            ]);
        }
        this.menu.showAt(e.getPoint());
    },

    initEvents: function () {
        Ext.components.NominalConcept.superclass.initEvents.call(this);
        this.dd = new Ext.components.NominalConcept.DropZone(this, this.dropConfig);
        this.getEl().on('contextmenu', this.onContextMenu, this);
    },

    beforeDestroy: function () {
        if (this.dd) {
            this.dd.unreg();
        }
        Ext.components.NominalConcept.superclass.beforeDestroy.call(this);
    }
});

Ext.components.NominalConcept.DropZone = function (portal, cfg) {
    this.portal = portal;
    Ext.dd.ScrollManager.register(portal.body);
    Ext.components.NominalConcept.DropZone.superclass.constructor.call(this, portal.bwrap.dom, cfg);
    portal.body.ddScrollConfig = this.ddScrollConfig;
};

Ext.extend(Ext.components.NominalConcept.DropZone, Ext.dd.DropTarget, {
    ddScrollConfig: {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },

    createEvent: function (dd, e, data, col, c, pos) {
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    notifyOver: function (dd, e, data) {
        var xy = e.getXY(), portal = this.portal, px = dd.proxy;

        // case column widths
        if (!this.grid) {
            this.grid = this.getGrid();
        }

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if (!this.lastCW) {
            this.lastCW = cw;
        } else if (this.lastCW != cw) {
            this.lastCW = cw;
            portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var col = 0, xs = this.grid.columnX, cmatch = false;
        for (var len = xs.length; col < len; col++) {
            if (xy[0] < (xs[col].x + xs[col].w)) {
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if (!cmatch) {
            col--;
        }

        // find insert position
        var p, match = false, pos = 0,
            c = portal.items.itemAt(col),
            items = c.items.items;

        for (var len = items.length; pos < len; pos++) {
            p = items[pos];
            var h = p.el.getHeight();
            if (h !== 0 && (p.el.getY() + (h / 2)) > xy[1]) {
                match = true;
                break;
            }
        }

        var overEvent = this.createEvent(dd, e, data, col, c,
            match && p ? pos : c.items.getCount());

        if (portal.fireEvent('validatedrop', overEvent) !== false &&
            portal.fireEvent('beforedragover', overEvent) !== false) {

            // make sure proxy width is fluid
            px.getProxy().setWidth('auto');

            if (p) {
                px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
            } else {
                px.moveProxy(c.el.dom, null);
            }

            this.lastPos = {c: c, col: col, p: match && p ? pos : false};
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);

            return overEvent.status;
            ;
        } else {
            return overEvent.status;
        }

    },

    notifyOut: function () {
        delete this.grid;
    },

    notifyDrop: function (dd, e, data) {
        delete this.grid;
        if (!this.lastPos) {
            return;
        }
        var c = this.lastPos.c, col = this.lastPos.col, pos = this.lastPos.p;

        var dropEvent = this.createEvent(dd, e, data, col, c,
            pos !== false ? pos : c.items.getCount());

        if (this.portal.fireEvent('validatedrop', dropEvent) !== false &&
            this.portal.fireEvent('beforedrop', dropEvent) !== false) {

            dd.proxy.getProxy().remove();
            dd.panel.el.dom.parentNode.removeChild(dd.panel.el.dom);
            if (pos !== false) {
                c.insert(pos, dd.panel);
            } else {
                c.add(dd.panel);
            }

            c.doLayout();

            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if (st) {
                var d = this.portal.body.dom;
                setTimeout(function () {
                    d.scrollTop = st;
                }, 10);
            }

        }
        delete this.lastPos;
    },

    // internal cache of body and column coords
    getGrid: function () {
        var box = this.portal.bwrap.getBox();
        box.columnX = [];
        this.portal.items.each(function (c) {
            box.columnX.push({x: c.el.getX(), w: c.el.getWidth()});
        });
        return box;
    },

    // unregister the dropzone from ScrollManager
    unreg: function () {
        //Ext.dd.ScrollManager.unregister(this.portal.body);
        Ext.components.NominalConcept.DropZone.superclass.unreg.call(this);
    }
});