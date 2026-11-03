Ext.define('ReporteContratacion.model.Contratos', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'denominacion'},
        {name: 'text'},
        {name: 'abreviatura'},
        {name: 'idestructuraop'},
        {name: 'id'},
        {name: 'idcontrato'},
        {name: 'idhito'},
        {name: 'idindicador'},
        {name: 'tipo'},
        {name: 'tipo_concepto'},
        {name: 'montototal'},
        {name: 'idconcepto'},
        {name: 'cantcontratos'},

        {name: 'children'},
        {name: 'expanded'},
        {name: 'leaf'},
        {name: 'icon'},

        {name: 'total_sinfirmar'},
        {name: 'total_contratado'},
        {name: 'total_sinejecutar'},
        {name: 'total_ejecutado'},
        {name: 'total_facturado'},

        {name: 'total_sinfirmar_contrato'},
        {name: 'total_contratado_contrato'},

        {name: 'e_aceptado'},
        {name: 'e_certificado'},
        {name: 'e_terminado'},

        {name: 'f_generada'},
        {name: 'f_firmada'},
        {name: 'f_cobrada'}

    ]
});
