Ext.define("Controlpanel.model.paquetes", {
    extend : 'Ext.data.Model',
    fields  : [
        {name: 'NAME'},
        {name: 'ID'},
        {name: 'ESTADO'},
        {name: 'DENOMINACION'},
        {name: 'VERSIONINSTALADA'},
        {name: 'VERSION'},
        {name: 'URI'},
        {name: 'DEPENDENCIAS'},
        {name: 'DESCRIPCION'},
        {name: 'DESCRIPCIONPRINCIPAL'},
        {name: 'NAMEPAQUETE'},
        {name: 'LOGO'},
        {name: 'NAMEPRODUCT'},
        {name: 'AUTOR'}
    ]
});