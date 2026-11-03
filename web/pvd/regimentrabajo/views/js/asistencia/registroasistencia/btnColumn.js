Ext.ns('Ext.BtnRowComponent');
Ext.BtnRowComponent.RowAction = function (config) {
    Ext.apply(this, config);

    this.addEvents({
        /**
         * @event beforeaction
         * Fires before action event. Return false to cancel the subsequent action event.
         * @param {Ext.grid.GridPanel} grid
         * @param {Ext.data.Record} record Record corresponding to row clicked
         * @param {Integer} rowIndex
         */
        beforeaction: true
        /**
         * @event action
         * Fires when icon is clicked
         * @param {Ext.grid.GridPanel} grid
         * @param {Ext.data.Record} record Record corresponding to row clicked
         * @param {Integer} rowIndex
         */, action: true
    });

    Ext.BtnRowComponent.RowAction.superclass.constructor.call(this);
};

Ext.extend(Ext.BtnRowComponent.RowAction, Ext.util.Observable, {
    header: '', sortable: false, dataIndex: '', width: 20, fixed: true, lazyRender: true, iconCls: ''

    // private - plugin initialization
    , init: function (grid) {
        this.grid = grid;
        var view = grid.getView();
        grid.on({
            render: {scope: this, fn: function () {
                view.mainBody.on({
                    click: {scope: this, fn: this.onClick}
                });
            }}
        });
        if (!this.renderer) {
            this.renderer = function (value, cell, record, row, col, store) {
                cell.css += (cell.css ? ' ' : '') + 'ux-grid3-row-action-cell';
                var retval = '<div  class="' + this.getIconCls(record, row, col) + '"';
                retval += this.style ? ' style="' + this.style + '"' : '';
                retval += this.qtip ? ' ext:qtip="' + this.qtip + '"' : '';
                retval += '> </div>';
                if(Ext.isEmpty(record.data.fechahoraentrada) && Ext.isEmpty(record.data.fechahorasalida))
                    return '';
                else
                    return retval;
            }.createDelegate(this);
        }
    } // eo function init

    // override for custom processing
    , getIconCls: function (record, row, col) {
        return this.boundIndex ? record.get(this.boundIndex) : this.iconCls;
    } // eo function getIconCls

    // private - icon click handler
    , onClick: function (e, target) {
        var record, iconCls;
        var row = e.getTarget('.x-grid3-row');
        var col = this.grid.getView().getCellIndex(e.getTarget('.ux-grid3-row-action-cell'));

        if (false !== row && false !== col) {
            record = this.grid.store.getAt(row.rowIndex);
            iconCls = this.getIconCls(record, row.rowIndex, col);
            if (Ext.fly(target).hasClass(iconCls)) {
                if (false !== this.fireEvent('beforeaction', this.grid, record, row.rowIndex)) {
                    this.fireEvent('action', this.grid, record, row.rowIndex, e);
                }
            }
        }
    } // eo function onClick
});