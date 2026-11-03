Ext.grid.BtnColumn = function (config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
        this.hideable = false;
        this.menuDisabled = true;
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.BtnColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        this.grid.on('render', function () {
            var view = this.grid.getView();
            this.colIndex = this.grid.getColumnModel().getIndexById(this.id);
            this.showCol(true); //para que se oculte
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);

        this.grid.getStore().on('update', function (st, rec, strop) {
            this.draw = rec.id;
            this.showCol(false); //para mostar la columna
        }, this);
        this.grid.getStore().on('load', function () {
            this.draw = null;
            if (!this.hidden) {
                this.showCol(true);
            }
        }, this);
        this.grid.getStore().on('add', function (st, rec, index) {
            this.draw = rec[0].id;
            this.showCol(false); //para mostar la columna
        }, this);
    },

    setHandler: function (handler, scope) {
        this.handler = handler;
        this.scope = scope;
    },

    showCol: function (action) {
        if (this.grid.isVisible()) {
            this.grid.getColumnModel().setHidden(this.colIndex, action);
        }
    },

    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            this.onClick(e);
            //this.grid.getColumnModel().setHidden(this.colIndex,true);
            /*e.stopEvent();
             var index = this.grid.getView().findRowIndex(t);
             var record = this.grid.store.getAt(index);
             record.set(this.dataIndex, !record.data[this.dataIndex]);*/
        }
    },

    onClick: function(e){
        if (this.handler) {
            this.handler.call(this.scope || this, this, e);
        }
    },

    renderer: function (v, p, record) {
        if (this.draw == record.id) {
            return '<div class="x-grid3-btn-col x-grid3-cc-' + this.id + '">&#160;</div>';
        } else {
            return '<div class="x-grid3-btn-col-off x-grid3-cc">&#160;</div>';
        }
    }
};