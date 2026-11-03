Ext.define('Nomencladores.view.CmbActions', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmbactions',
    validateOnBlur: true,
    enableKeyEvents: true,
    pickerrender: false,
    multiSelect: true,
    queryMode: 'local',
    typeAhead: true,
    displayField: 'name',
    valueField: 'action',
    autoExpand: false,
    listLoadingText: 'Cargando...',
    listEmptyText: 'No existen datos que mostrar.',
    module: '',
    method: '',
    initComponent: function () {
        this.createStore();

        this.callParent();
    },
    createStore: function () {
        var me = this,
            data = [
                {
                    action: 'edit',
                    name: 'Modificar contrato'
                },
                {
                    action: 'del',
                    name: 'Eliminar contrato'
                },
                {
                    action: 'sign',
                    name: 'Firmar contrato'
                },
                {
                    action: 'document',
                    name: 'Adjuntar documento'
                },
                {
                    action: 'createsupl',
                    name: 'Crear suplemento'
                },
                {
                    action: 'historial',
                    name: 'Hist\xF3rico'
                },
                {
                    action: 'print',
                    name: 'Imprimir'
                },
                {
                    action: 'fact',
                    name: 'Listo para facturar'
                },
                {
                    action: 'createcontrato',
                    name: 'Crear contrato'
                },
                {
                    action: 'newfact',
                    name: 'Factura elaborada'
                },
                {
                    action: 'readyfact',
                    name: 'Factura Preparada'
                },
                {
                    action: 'postfact',
                    name: 'Factura Contabilizada'
                },
                {
                    action: 'chargefact',
                    name: 'Factura Cobrada'
                },
                {
                    action: 'endedwork',
                    name: 'Trabajo Terminado'
                },
                {
                    action: 'deletedcontrat',
                    name: 'Contrato eliminado'
                },
            ];

        Ext.define('Action', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'action'},
                {name: 'name'}
            ]
        });

        this.store = Ext.create('Ext.data.Store', {
            model: 'Action',
            data: data
        });
    },
    getSubmitValue: function () {
        return Ext.encode(this.getValue());
    },
    setValue:function(value){
        this.callParent(arguments);
        try{
            if(typeof value == 'string'){
                var value = Ext.decode(value),
                    temp = new Array();
                if(Ext.isArray(value)){
                    for(k in value){
                        var pos = this.store.find('action',value[k]),
                            record = this.store.getAt(pos);
                        temp.push(record);
                    }
                    this.setValue(temp);
                }
            }
        }catch (e){

        }
    }
});
