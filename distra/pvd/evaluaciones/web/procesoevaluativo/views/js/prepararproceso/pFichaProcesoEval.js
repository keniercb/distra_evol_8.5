var tplInfoProceso = new Ext.XTemplate(
    '<table width="100%" ><tr>',
    '<td width="50%" class="row-title">Nombre del proceso </td>',
    '<td width="25%" class="row-title">Fecha inicio proceso </td>',
    '<td width="25%" class="row-title">Fecha fin proceso </td>',
    '</tr><tr>',
    '<td width="50%" class="row-detail">{denom}</td>',
    '<td width="25%" class="row-detail">{fechainicioproceso}</td>',
    '<td width="25%" class="row-detail">{fechafinproceso}</td>',
    '</tr><tr>',
    '<td width="50%" class="row-title">Tipo de proceso </td>',
    '<td width="25%" class="row-title">Fecha inicio evalúa </td>',
    '<td width="25%" class="row-title">Fecha fin evalúa </td>',
    '</tr><tr>',
    '<td width="50%" class="row-detail">{tipoproceso}</td>',
    '<td width="25%" class="row-detail">{fechainicioevalua}</td>',
    '<td width="25%" class="row-detail">{fechafinevalua}</td>',
    '</tr></table>'
);
tplInfoProceso.compile();

Ext.ns("Ext.PVD.Evaluaciones");
Ext.PVD.Evaluaciones.FichaProcesoEval = Ext.extend(Ext.Panel, {
    region: 'north',
    layout: 'fit',
    height: 100,
    initComponent: function () {
        var self = this;

        Ext.PVD.Evaluaciones.FichaProcesoEval.superclass.initComponent.call(this);
        this.on('render', function (cmp) {
            tplInfoProceso.overwrite(self.body, {
                denom: self.proceso.get('denom'),
                tipoproceso: self.proceso.get('tipoproceso'),
                fechainicioevalua: self.proceso.get('fechainicioevalua'),
                fechainicioproceso: self.proceso.get('fechainicioproceso'),
                fechafinevalua: self.proceso.get('fechafinevalua') != null ? self.proceso.get('fechafinevalua') : '',
                fechafinproceso: self.proceso.get('fechafinproceso') != null ? self.proceso.get('fechafinproceso') : ''
            });
        });
    }
});