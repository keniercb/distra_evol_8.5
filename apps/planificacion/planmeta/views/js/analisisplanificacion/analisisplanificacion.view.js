/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yosniel Montes de Oca González
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Ext.ns('Gestionar.analisisplanificacion');
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));

Gestionar.analisisplanificacion.Vista = {
    init: function (idioma, modelo) {
        _this = this;
        _this.entidadSeleccionada = null;

        _this.btnAyudaAnalisisplanificacion = new Ext.Button({
            text: idioma.btnAyuda,
            tooltip: 'idioma.btnAyudatoll',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            id: 'btnAyudaAnalisisplanificacion'
        });
        //----------------------Tree Panel Organismos----------------------------------------

        //nueva version de estructura
        this.treePanelinversion = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 600

            });
        _this.treePanelinversion.btnBuscar.setText("");
        _this.treePanelinversion.btnLimpiar.setText("");
        _this.treePanelinversion = _this.treePanelinversion.items.items[0];
        _this.treePanelinversion.getRootNode().expand();
        _this.treePanelinversion.region = 'west';

        this.Graficas = new Utilidades.Cmp.CmpGrafica({
            idioma: idioma,
            nodeEntidad: this.entidadSeleccionada,
            arbolEntidad: _this.treePanelinversion,
            componente: 'analisis',
            disabledTabAnalisis: true
        });

        _this.pGraficas = this.Graficas.panelGraficas();
        _this.pGeneralll = new Ext.Panel({
            scope: this,
            layout: 'border',
            border: false,
            width: 200,
            items: [_this.treePanelinversion, _this.pGraficas/*,ptestructuras*/]
        });

        _this.view = new Ext.Viewport({
            layout: 'fit',
            items: [_this.pGeneralll]
        });
    }
};

