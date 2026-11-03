Ext.define('Reportes.config',{
    extend: 'ConfiguracionGral.config',
    config: {
        info: {
            version: '1.0',
            author:'Ing. Rodain Terrer Molina <rterrer@xetid.cu>'
        },
        name: 'Reportes',
        controller: 'configurarreportes',
        description: 'Configure los reportes',
        iconCls: 'icondistra-configuracioncrm',
        hideable: false
    }
});