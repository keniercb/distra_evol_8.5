Ext.define('PanelControlMarketing.controller.Charts', {
    extend: 'Ext.app.Controller',

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#stOportunidadesMes': {
                    load: this.onLoad
                }
            },
            component: {
                'oportmeschart': {
                    render: function () {
                        this.generateMonth();
                    }
                }
            }
        });
    },
    onLoad: function (store) {
        Ext.each(this.meses, function (mes) {
            var pos = store.find('mes', mes.id);
            if (pos == -1) {
                var record = Ext.create('PanelControlMarketing.model.OportunidadMes', {
                    mes: mes.id,
                    nombremes: mes.name,
                    cant:0
                });
                store.insert(mes.id, record);
            } else {
                store.getAt(pos).set('nombremes', mes.name);
            }
        });
        store.sort('mes','asc');
    },
    generateMonth: function () {
        this.meses = new Array();
        for (var i = 0; i < 12; i++) {
            this.meses.push({
                id: i+1,
                name: Ext.Date.monthNames[i]
            });
        }
    }
});
