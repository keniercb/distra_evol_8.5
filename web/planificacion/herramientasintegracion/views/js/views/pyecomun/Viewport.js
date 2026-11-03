/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */

Ext.QuickTips.init();
Planificacion.Integracion.PanelComun.mostrarInterfaz = function() {
    var me = this;

    me.tabPanel = new Ext.TabPanel({
        region: 'center',
        layoutOnTabChange: true,
        activeTab: 0
    });

    me.nuevo      = null;
    me.jerarquico = 1;
    me.valorativo = 2;
    me.intervalo  = 3;

    me.concepto = {concepto:"DatSituacioncuestionario", campoid: "idsituacion", idconcepto: 38573}

    /*me.cuestionarioNuevo = new Secodena.Prospectiva.PanelCuestionario({idcuestionario: me.nuevo, enunciado: false, descripcion: true, color: false, alerta: false});
     me.cuestionarioNuevo.setTitle('Cuestionario Nuevo');*/

    /*me.cuestionarioValorativo = new Secodena.Prospectiva.PanelCuestionario({idcuestionario: me.valorativo});
     me.cuestionarioValorativo.setTitle('Cuestionario valorartivo');*/

    /*me.cuestionarioIntervalo = new Secodena.Prospectiva.PanelCuestionario({idcuestionario: me.intervalo});
     me.cuestionarioIntervalo.setTitle('Cuestionario intervalo');*/

    /*me.cuestionarioJerarquico = new Secodena.Prospectiva.PanelCuestionario({idcuestionario: me.jerarquico, enunciado: false, descripcion: false});
     me.cuestionarioJerarquico.setTitle('Cuestionario jerarquico');*/

    //me.conceptovariable = {concepto:"DatProyectomorfologicovariable", campoid: "idproyectomorfologico", idconcepto: 1};

    /*me.conceptovariable = {concepto:"DatCuestionariovariable", campoid: "idcuestionario", idconcepto: 2};
     me.btnContinuarVariables = new Ext.Button({
     text: 'Nuevo',
     handler: function () {
     }
     });
     me.botones = [me.btnContinuarVariables];
     me.variables = new Secodena.Prospectiva.PanelVariables({concepto: me.conceptovariable, botones: me.botones});
     me.variables.setTitle('Variables');*/

    //me.conceptoproyecto = {concepto:"DatProyectodelphi", campoid: "idproyectodelpi", nativo: true};
    /*me.conceptoproyecto = {concepto:"DatProyectomorfologico", campoid: "idproyectomorfologico", nativo: true};
     me.proyecto = new Secodena.Prospectiva.PanelProyecto({concepto: me.conceptoproyecto});
     me.proyecto.setTitle('Proyectos');*/

    //------------------------------------------------------------------------------------------------------------------ VARIABLES - ESCENARIOS
    /*me.variablesescenarios = new Secodena.Prospectiva.PanelGridVariablesHipotesis();
     me.variablesescenarios.setTitle('Variables hipotesis');*/

    /*me.matrizproximidad = new Secodena.Prospectiva.PanelMatrizProximidad();
    me.matrizproximidad.setTitle('Matriz proximidad');*/

    /*me.graficoproximidad = new Secodena.Prospectiva.PanelGraficoProximidad();
    me.graficoproximidad.setTitle('Gráfico proximidad');*/

    //me.tabPanel.add(me.cuestionarioNuevo).show();
    //me.tabPanel.add(me.cuestionarioValorativo).show();
    //me.tabPanel.add(me.cuestionarioIntervalo).show();
    //me.tabPanel.add(me.cuestionarioJerarquico).show();
    //me.tabPanel.add(me.variables).show();
    //me.tabPanel.add(me.proyecto).show();
    //me.tabPanel.add(me.variablesescenarios).show();
    //me.tabPanel.add(me.graficoproximidad).show();

    /*me.proyecto.on('verproyecto', function(record){
     console.log(record)
     });*/

    /*Ext.Ajax.request({
     url: '/prospectiva/index.php/prospectivacomun/getcuestionarios',
     method: 'POST',
     params: {concepto: Ext.encode(me.concepto)},
     callback: function (options, success, response) {

     }
     });*/

    var vpPrincipal = new Ext.Viewport({
        layout: 'border',
        items:[me.tabPanel]

    });

}
Ext.onReady(function() {
    Planificacion.Integracion.PanelComun.mostrarInterfaz();
});