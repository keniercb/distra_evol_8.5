Ext.define('Nomencladores.view.CmbLineas', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmblineas',
    validateOnBlur: true,
    enableKeyEvents: true,
    pickerrender: false,
    multiSelect: true,
    queryMode: 'local',
    editable: false,
    typeAhead: true,
    displayField: 'denominacion',
    valueField: 'id',
    queryParam: 'denominacion',
    autoExpand: false,
    listLoadingText: 'Cargando...',
    listEmptyText: 'No existen datos que mostrar.',
    module: '',
    method: '',
    listeners: {
        change: function (cb, nv, ov, opt) {
            cb.viejo = ov;
        }
    },
    viejo: '',
    initComponent: function () {
        var me = this;
        me.createStore();
        me.callParent();
    },
    createStore: function () {
        var me = this;
            // data = [
            //     {
            //         id: '1',
            //         denominacion: 'YHUNDAI'
            //     },
            //     {
            //         id: '2',
            //         denominacion: 'LADA'
            //     },
            //     {
            //         id: '3',
            //         denominacion: 'NEUMATICOS'
            //     },
            // ];

        Ext.define('Linea', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id'},
                {name: 'denominacion'}
            ]
        });

        me.store = Ext.create('Ext.data.Store', {
            // remoteFilter: false,
            autoLoad: true,
            fields: ['id', 'denominacion'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getNomencladoresDinamicos'}, ModuleMgr.get('SolicitudNegocio')),
                actionMethods: {read: 'POST'},
                reader: {
                    root: 'datos',
                    totalProperty: 'cantidad',
                    successProperty: 'success'
                },
                // extraParams: {
                //     alias: 'Lineas'
                // },
            }, listeners: {
                load: function (st, rd, succ, opt) {
                    me.setValue(me.viejo[0]);
                }
            }
        });
    },
    getSubmitValue: function () {
        return Ext.encode(this.getValue());
    },
    setValue: function (value) {
        this.callParent(arguments);
        try {
            if (typeof value == 'string') {
                var value = Ext.decode(value),
                    temp = new Array();
                if (Ext.isArray(value)) {
                    for (k in value) {
                        var pos = this.store.find('id', value[k]),
                            record = this.store.getAt(pos);
                        temp.push(record);
                    }
                    this.setValue(temp);
                }
            }
        } catch (e) {

        }
    }
});
