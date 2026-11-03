Ext.define('Clients.view.MainGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.clients-main-grid',
    requires: [
        'Clients.store.ClientProviderState'//,
        //'Ext.ux.grid.FiltersFeature'
    ],
    height: 245,
    layout: 'fit',
    quantityChange: function (val) {
        return '<div style="text-align:center;">' + val + '</div>';
    },
    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    meanChange: function (val) {
        var config = this.config;
        if (val > config.mean) {
            return '<div style="text-align:center;color:green;">' + val.toFixed(2) + '</div>';
        } else if (val < config.mean) {
            return '<div style="text-align:center;color:red;">' + val.toFixed(2) + '</div>';
        }
        return val && val.toFixed(2);
    },

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
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

        /*var filtersCfg = {
            ftype: 'filters',
            autoReload: true, //don't reload automatically
            local: false, //only filter locally
            // filters may be configured through the plugin,
            // or in the column definition within the headers configuration
            filters: [{
                type: 'string',
                dataIndex: 'client_name'
            }, {
                type: 'numeric',
                dataIndex: 'amount'
            }, {
                type: 'date',
                dataIndex: 'time'
            }, {
                type: 'list',
                dataIndex: 'quantity',
                options: ['extra small', 'small', 'medium', 'large', 'extra large'],
                phpMode: true
            }]
        };*/

        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: 'Clients.store.ClientProviderState',
            stripeRows: true,
            columnLines: true,
            features: [{
                ftype: 'summary'
            }/*, filtersCfg*/],
            columns: [{
                id: 'Clients-company-grid',
                text: labels.gridColumnName,
                //width: 120,
                flex: 1,
                sortable: true,
                dataIndex: 'client_name',
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
                }, {
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
