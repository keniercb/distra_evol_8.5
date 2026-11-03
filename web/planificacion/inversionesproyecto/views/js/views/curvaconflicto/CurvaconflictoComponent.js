/**
 * Componente Curva de conflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Planificacion.Integracion.CurvaconflictoComponent = ExtExtend.Class({
    $extend: Ext.Panel,
    border: false,
    //frame: true,
    layout: 'border',
    initComponent: function() {
        var me = this;
        var idCmp = this.id;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.CurvaconflictoController();
        me.etiquetas = me.controller._getLabel('Curvaconflicto');
        me.directorioImagenes = me.controller._getGlobals('dirImg');

        me.objproyecto = this.objproyecto ? this.objproyecto : new DatCurvaconflicto();

        me.conceptoproyecto = me.conceptoproyecto ? me.conceptoproyecto : null;
        me.recordproyectos = me.recordproyectos ? me.recordproyectos : null;

        me.btnExportar = new me.comps.buttons.btnExportar({
            handler: function() {
                me.generarGraficoCurvaconflicto({
                    native: false,
                    type: 'line-smoothed',
                    title: 'Diagrama',
                    uri: '/planificacion/herramientasintegracion/index.php/curvaconflicto/obtenerdatosgrafico',
                    idestudio: me.objproyecto.get('idestudiocurvaconflicto'),
                    idproyecto: me.recordproyectos.idproyecto,
                    denominacion: me.recordproyectos.nombreproyecto,
                    chartid: 'report_curva'
                });
            }
        });

        me.btnAyuda = new me.comps.buttons.btnAyuda({
            tooltip: me.etiquetas.ttpAyuda,
            handler: function() {
                me.controller.mostrarAyuda('curva');
            }
        });

        me.lbTitle = new Ext.form.Label({
            text: 'Proyecto: ' + me.objproyecto.get('denominacion')
        });

        me.tbar = [me.lbTitle, '->', me.btnExportar, me.btnAyuda];

        me.panelConfiguracion = new Planificacion.Integracion.ConfiguracionPanel({
            region: 'west',
            width: '60%',
            layout: 'border',
            objproyecto: me.objproyecto,
            idestudiocurvaconflicto: me.objproyecto.get('idestudiocurvaconflicto')
        });

        me.panelMedicion = new Planificacion.Integracion.MedicionesPanel({
            region: 'center',
            width: '40%',
            layout: 'border',
            objproyecto: me.objproyecto,
            idestudiocurvaconflicto: me.objproyecto.get('idestudiocurvaconflicto'),
            recordproyectos: me.recordproyectos,
            stIntensidades: me.panelConfiguracion.stIntensidades
        });

        me.items = [me.panelConfiguracion, me.panelMedicion];

        me.panelMedicion.stMediciones.on('update', function(obj, record, operation){
            var long = me.panelConfiguracion.stIntensidades.getCount();
            var menor = me.panelConfiguracion.stIntensidades.getAt(0).data.nivelintensidad;
            var mayor = me.panelConfiguracion.stIntensidades.getAt(long - 1).data.nivelintensidad;

            var medicion = menor;
            var probOld = (record.modified.valormedicion) ? record.modified.valormedicion : menor;

            if ((record.data.valormedicion < menor || record.data.valormedicion > mayor) && me.isNumber(record.modified.valormedicion)) {
                var mensaje = "El valor de la medición debe estar en el rango desde " + menor + " hasta " + mayor + ".";
                if(record.modified.valormedicion){
                    mensaje += "\n Se establecerá el valor anterior.";
                }else{
                    mensaje += "\n Se establecerá el mínimo valor permitido.";
                }

                if(!me.objproyecto.get('escala')){
                    mostrarMensaje(1, mensaje, function(){
                        record.set('valormedicion', probOld);
                    });
                }
            }
        });

        me.panelConfiguracion.on('habilitar', function() {
            if (me.panelConfiguracion.stIntensidades.getCount() > 0 && me.panelConfiguracion.dfFechaInicio.value) {
                //me.panelMedicion.enable();
                if(!me.objproyecto.get('fromproblema')){
                    me.panelMedicion.gpMediciones.hideShowAddDelButtons(true);
                }
                me.panelMedicion.btnGenerarDiagrama.enable(true);
            }
        });

        me.panelConfiguracion.on('desabilitar', function() {
            //me.panelMedicion.disable();
            me.panelMedicion.gpMediciones.hideShowAddDelButtons(false);
            me.panelMedicion.btnGenerarDiagrama.disable(true);
        });
        Planificacion.Integracion.CurvaconflictoComponent.superclass.initComponent.call(me);
    },
    isNumber: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    generarGraficoCurvaconflicto: function(ob) {

        var chartController = new Ext.incidencia.chart.representacion.ChartController();
        chartController.generarGrafico({
            uri: ob.uri,
            type: ob.type,
            theme: ob.theme,
            native: ob.native,
            graphic: ob.graphic,
            idproyecto: ob.idproyecto,
            idsituacion: ob.idsituacion,
            idestructura: ob.idestructura,
            idsituacionactual: ob.idsituacionactual,
            idsujetoestrategico: ob.idsujetoestrategico,
            idestudio: ob.idestudio,
            concepto: ob.concepto,
            denominacion: ob.denominacion,
            chartid: ob.chartid,
            report: true
        });

    }
});
Ext.reg('Planificacion.Integracion.CurvaconflictoComponent', Planificacion.Integracion.CurvaconflictoComponent);