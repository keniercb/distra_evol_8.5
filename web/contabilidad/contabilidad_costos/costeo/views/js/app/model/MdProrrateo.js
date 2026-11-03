Ext.define('PRT.model.MdProrrateo', {
    extend: 'Ext.data.Model',

    idProperty: 'idprorrateo',
    fields: [
        {
            name: 'idprorrateo'
        },
        {
            name: 'descripcion'
        },
        {
            name: 'idelementogastotraspaso'
        },
        {
            name: 'elementogastotraspaso'
        },
        {
            name: 'idestado'
        },
        {
            name: 'fecha'
        },
        {
            name: 'idcuentaemisor'
        },
        {
            name: 'cuentaemisor'
        },
        {
            name: 'idinductor'
        },
        {
            name: 'inductor'
        },
        {
            name: 'idorigenBD'
        },
        {
            name: 'nocomprobante'
        },
        {
            name: 'idcomprobante'
        },
        {
            name: 'porcientotraspasar'
        },
        {
            name: 'receptores'
        },
        {
            name: 'idelementogastoaprorratear'
        },
        {
            name: 'elementogastoaprorratear'
        },
        {
            name: 'idnivelprorrateo'
        }
    ]/*,Esta configuración iría si qusieras hacer un save con el modelo creado
    proxy: {
        type: 'ajax',
        api: {
            //read: 'loadProrrateos',
            create: 'addModProrrateo',
            update: 'addModProrrateo'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }*/
});