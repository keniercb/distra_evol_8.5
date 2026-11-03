/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.namespace('Ext.Report.windows');
Ext.Report.windows = Ext.extend(Ext.Window, {
    name: 'mywin',
    id: 'mywin',
    width: 500,
    layout: 'fit',
    title: 'Formato salida',
    minimizable: true,
    maximizable: false,
    modal: true,
    closable: true,
    resizable: false,
    baseUrl: '/configuracion/reportejasper/index.php/reportesbasicos/',

    constructor: function(config) {
        var me = this;
        Ext.apply(this, config || {});
        if (!this.jrxmldirectory) {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Debe especificar la ruta al directorio que contiene el o los fichero(s) jrxml.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        } else {
            this.sqlquery;
            Ext.Ajax.request({
                url: this.baseUrl + 'scandirectory',
                //url: 'Utils.php',
                params: {
                    urlfolder: this.jrxmldirectory
                },
                callback: function(option, succes, response) {
                    var data = Ext.decode(response.responseText);
                    if (data === "0")
                    {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: 'Debe especificar la ruta al directorio que contiene el o los fichero(s) jrxml.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                    else {
                        if (data.length === 0) {
                            Ext.MessageBox.show({
                                title: 'Información',
                                msg: 'No existen ficheros jrxml en la ruta especificada',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                        else {
                            var array = [];
                            for (k in data)
                            {
                                if (data[k].url && data[k].name)
                                {
                                    array.push({url: data[k].url, namekind: data[k].name});
                                }
                            }
                            me.report.apply(me);
                            Ext.getCmp('idreport').store.removeAll();
                            Ext.getCmp('idreport').reset();
                            Ext.getCmp('idreport').store.loadData(array);
                            Ext.Report.windows.superclass.constructor.call(me, config);
                            me.show();
                        }
                    }

                }

            });

        }
    },
    report: function()
    {
        var me = this;
        me.chargereport = new Ext.Button({
            text: 'Cargar Reporte',
            minWidth: 93,
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            listeners: {
                scope: me,
                click: function() {
                    var url = Ext.getCmp("idreport").getValue();
                    var formato = Ext.getCmp('idformato').getValue();
                    if (url === "" || formato === "")
                    {
                        Ext.MessageBox.show({
                            title: 'Advertencia',
                            msg: 'Debe seleccionar al menos un elemento de cada campo',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                    }
                    else {
                        Ext.Ajax.request({
                            url: this.baseUrl + 'getSql',
                            params: {
                                urlxml: url
                            },
                            callback: function(option, succes, response)
                            {
                                var data = Ext.decode(response.responseText);
                                me.sqlquery = data[0];
                                var report = Ext.getCmp('idreport').getRawValue();
                                var method = 'genericReport';
                                var q = me.sqlquery;
                                var filters = {
                                    sql: q
                                };
                                var datas = {};
                                datas.format = Ext.getCmp('idformato').getValue();
                                datas.report = report;
                                datas.method = method;
                                datas.filters = filters;
                                datas.path = me.jrxmldirectory;
                                window.open(me.baseUrl + 'report' + '?datas=' + btoa(Ext.encode(datas)), '');
                            }
                        });
                    }

                }
            }
        }),
        me.reportcomb = new Ext.form.ComboBox({
            store: new Ext.data.JsonStore({
                fields: ['url', 'namekind']

            }),
            name: 'report',
            id: 'idreport',
            hiddenName: 'namekind',
            displayField: 'namekind',
            valueField: 'url',
            typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{namekind}" class="x-combo-list-item">{namekind}</div></tpl>',
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            fieldLabel: "Reporte",
            emptyText: 'Seleccione el reporte',
            selectOnFocus: true,
            allowBlank: false
        });
        me.combo = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['id', 'formato'],
                data: [['pdf', 'PDF'], ['xls', 'Excel'], ['odt', 'Open Offices'], ['rtf', 'Word'], ['html', 'HTML']] // from states.js
            }),
            name: 'formato',
            id: 'idformato',
            hiddenName: 'formato',
            displayField: 'formato',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            fieldLabel: "Formato",
            emptyText: 'Seleccione el formato',
            selectOnFocus: true,
            allowBlank: false
        });

        me.reportpanel = new Ext.FormPanel({
            labelAlign: 'top',
            labelWidth: 15,
            region: 'north',
            height: 110,
            width: 105,
            frame: true,
            defaults: {width: 470},
            items: [me.reportcomb, me.combo],
            //buttons: [me.chargereport],
            buttonAlign: 'right'
        });

        me.buttons = [me.chargereport],

        me.items = me.reportpanel;
    }
});
