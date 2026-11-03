Ext.define('Modules.config',{
    extend: 'ConfiguracionGral.config',
    config: {
        info: {
            version: '1.0',
            author:'Ing. Rodain Terrer Molina <rterrer@xetid.cu>'
        },
        name: 'Habilitar m&oacute;dulos',
        controller: 'modulemanage',
        description: 'Defina los m&oacute;dulos que ser&aacute;n cargados',
        iconCls: 'icondistra-configuracioncrm',
        hideable: false
    }
});