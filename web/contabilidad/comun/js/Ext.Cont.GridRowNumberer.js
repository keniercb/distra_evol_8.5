

Ext.ns('Ext.Cont');
Ext.Cont.GridRowNumberer = Ext.extend(Ext.grid.RowNumberer, {
    header: (this.header) ? this.header : 'N.\xBA',
    renderer: function(v, p, record, rowIndex, colIndex, store) {
        if (this.rowspan) {
            p.cellAttr = 'rowspan="' + this.rowspan + '"';
        }
        
        this.width = (this.nwidth) ? this.nwidth : 30;

        var so = store.lastOptions;
        var sop = so ? so.params : null;
        return ((sop && sop.start) ? sop.start : 0) + rowIndex + 1;
    }
});