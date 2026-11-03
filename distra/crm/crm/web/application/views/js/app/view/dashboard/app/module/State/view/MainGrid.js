Ext.define('State.view.MainGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.state-main-grid',
    requires: ['State.store.AmountState'],
    height: 245,
    
    quantityChange: function (val) {
        return '<div style="text-align:center;">' + val + '</div>';
    },

    meanChange: function (val) {
        var config = this.config;
        if (val > config.mean) {
            return '<div style="text-align:center;color:green;">' + val.toFixed(2) + '</div>';
        } else if (val < config.mean) {
            return '<div style="text-align:center;color:red;">' + val.toFixed(2) + '</div>';
        }
        return val && val.toFixed(2);
    },

    chi2Change: function (val) {
        var config = this.config;
        if (val > config.chi2) {
            return '<div style="text-align:center;color:green;">' + val.toFixed(2) + '</div>';
        } else if (val < config.chi2) {
            return '<div style="text-align:center;color:red;">' + val.toFixed(2) + '</div>';
        }
        return val && val.toFixed(2);
    },

    initComponent: function () {
        var labels = this.isContained.$lang;
        Ext.apply(this, {
            height: this.height,
            store: 'State.store.AmountState',
            stripeRows: true,
            columnLines: true,
            features: [{
                ftype: 'summary'
            }],
            columns: [{
                text: labels.gridColumnName,
                flex: 1,
                sortable: true,
                dataIndex: 'state_name',
                summaryRenderer: function (value, summaryData, dataIndex) {
                    return labels.gridColumnNameTotal;
                }
            }, {
                header: labels.gridColumnHeader,
                columns: [{
                    text: labels.gridColumnQuantity,
                    width: 55,
                    sortable: true,
                    dataIndex: 'quantity',
                    renderer: this.quantityChange,
                    summaryType: 'sum',
                    summaryRenderer: function (value) {
                        return value;
                    }
                },{
                    text: labels.gridColumnAmount,
                    width: 75,
                    sortable: true,
                    renderer: this.meanChange,
                    dataIndex: 'amount',
                    summaryType: 'sum',
                    summaryRenderer: function (value) {
                        return value.toFixed(2);
                    }
                }, {
                    text: labels.gridColumnAvg,
                    width: 75,
                    sortable: true,
                    renderer: this.chi2Change,
                    dataIndex: 'mean',
                    summaryType: 'sum',
                    summaryRenderer: function (value) {
                        return value.toFixed(2);
                    }
                }]
            }]
        });

        this.callParent(arguments);
    }
});
