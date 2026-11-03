/**
 * Fichero que contiene el objeto del Window que contiene la vista previa del reporte.
 * 
 * @author dtejeda
 * @version 1.0
 */

Ext.namespace('Planificacion.Sistemas');
Planificacion.Sistemas.ReportesWindow = ExtExtend.Class({
    $extend: Ext.Window,
    title: 'Vista previa del reporte',
    maximized: true,
    autoScroll: true,
    bodyStyle: 'background: #fff;',
    style: 'z-index:10000000 !important;',
    initComponent: function() {
        var _this = this;

        /**
         * Crear el objeto controller - ReporteController
         * @type Std.Base.Controller
         */
        _this.controller = (_this.controller) ? _this.controller : new Planificacion.Sistemas.ReportesController();
        _this.tbar = (_this.tbar) ? _this.tbar : new Planificacion.Sistemas.ReportesToolbar({
            exportTo: this.params.baseParams.exportFormat,
            beforeExportTo: this.params.beforeExportTo ? this.params.beforeExportTo : null,
            pbeforeExportTo: this.params.pbeforeExportTo ? this.params.pbeforeExportTo : null,
            view: this.params.view,
            owner: this,
            titulo: this.params.baseParams.titulo
        });

        _this.manager = new Ext.WindowGroup({zseed : 10000000});

        /**
         * Crear el objeto idioma
         * @type json
         */
        _this.idioma = _this.controller._getLabel('Reportesge');

        /**
         * Instanciar los componentes comunes
         * @type function
         */
        _this.extendCmp = ExtExtend.Components;



        _this.on('beforeshow', function(){
                this.params.container = this;
                this.obtenerReporte(this.params);
        });

        _this.on('show', function(){

            this.body.setStyle(
                {
                    'background-image': 'url("../../../reportes/comun/recursos/images/loading.gif")',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'width': '100%'
                });

            _this.toFront();
        });

        Planificacion.Sistemas.ReportesWindow.superclass.initComponent.call(Ext.apply(_this, arguments));
    },

    obtenerReporte: function(params) {
        this.controller.obtenerReporte(this.params);
    }

});
Ext.reg('Planificacion.Sistemas.ReportesWindow', Planificacion.Sistemas.ReportesWindow);

