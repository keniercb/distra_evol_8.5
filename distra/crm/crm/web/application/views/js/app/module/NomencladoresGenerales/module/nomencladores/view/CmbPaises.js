Ext.define('Nomencladores.view.CmbPaises', {
    // extend: 'Ext.ux.CmbSelectField',
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmbpaises',
    validateOnBlur: true,
    enableKeyEvents: true,
    // pickerrender: false,
    multiSelect: false,
    queryMode: 'local',
    typeAhead: true,
    localId: 'idpais',
    displayField: 'nombrepais',
    valueField: 'nombrepais',
    autoExpand: false,
    listLoadingText: 'Cargando...',
    listEmptyText: 'No existen datos que mostrar.',
    blankText: 'Seleccione',
    module: '',
    method: '',
    initComponent: function () {
        var me = this;
        me.createStore();
        me.callParent();
    },
    createStore: function () {
        var me = this;

        Ext.define('Pais', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'idpais'},
                {name: 'nombrepais'}
            ]
        });

        me.store = Ext.create('Ext.data.Store', {
            // remoteFilter: false,
            autoLoad: true,
            fields: ['idpais', 'nombrepais'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'obtenerPaises'}, ModuleMgr.get('Nomencladores')),
                actionMethods: {read: 'POST'},
                reader: {
                    root: 'datos',
                    totalProperty: 'cantidad',
                    successProperty: 'success'
                },
            },
        });
    },
    getSubmitValue: function () {
        return this.getValue();
    },
    setValue: function(value){
        this.callParent(arguments);
        console.log(value)
        this.trueValue = value;
        if (typeof value == 'object') {
            var temp = new Array(),
                data;
            for (k in value) {
                if (value[k].data) {
                    data = value[k].data[this.valueField];
                } else {
                    data = value[k];
                }
                temp.push(data);
            }
            this.trueValue = temp.join(',');
        }
    }
    // setValue:function(value){
    //     this.callParent(arguments);
    //     try{
    //         if(typeof value == 'string'){
    //             var value = Ext.decode(value),
    //                 temp = new Array();
    //             if(Ext.isArray(value)){
    //                 for(k in value){
    //                     var pos = this.store.find('idpais',value[k]),
    //                         record = this.store.getAt(pos);
    //                     temp.push(record);
    //                 }
    //                 this.setValue(temp);
    //             }
    //         }
    //     }catch (e){
    //
    //     }
    // }
});
