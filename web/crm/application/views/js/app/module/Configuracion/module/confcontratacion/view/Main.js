Ext.define('ConfContratacion.view.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.confcontratacionmain',
    requires: [
        'Ext.ux.form.field.ToggleSlide',
        'ConfContratacion.view.WesternTree',
        'ConfContratacion.view.CenterPanel',
        'ConfContratacion.view.ConfComiteTran',
        'ConfContratacion.view.ConfContrato',
        'ConfContratacion.view.ConfComiteGD',
        'ConfContratacion.view.ConfContratoGD',
        'ConfContratacion.view.ConfContratoImportacionGD',
        'ConfContratacion.view.ConfOfertaNegocioG',
        'ConfContratacion.view.ConfClientesproveedores',
        'ConfContratacion.view.ConfSolicitudNegocio',
        'ConfContratacion.view.ConfContratoPlanif',
        'ConfContratacion.view.ConfContratoCompart',
        'ConfContratacion.view.ConfComiteGeneral',
        'ConfContratacion.view.ConfContratoContabilidad',
        'ConfContratacion.view.ConfSolicitudPagoGD',
        'ConfContratacion.view.ConfContratoGeneral',
        'ConfContratacion.view.ConfSolicitudCompart',
        'ConfContratacion.view.ConfOfertaCompart',
        'ConfContratacion.view.ConfArchivoPHP',
        'ConfContratacion.view.ConfProforma',
        'ConfContratacion.view.ConfCache',
        'ConfContratacion.view.ConfProformaVariables'
    ],
    frame: false,
    border: false,
    closable: true,
    layout:'border',

    initComponent: function() {
        this.getLang();
        this.title = this.etiquetas.moduleName;

        this.tree = Ext.create('ConfContratacion.view.WesternTree',{
            etiquetas:this.etiquetas});
        this.centerpanel = Ext.create('ConfContratacion.view.CenterPanel');
        this.items = [this.tree,this.centerpanel];
        this.callParent();
    }
});
