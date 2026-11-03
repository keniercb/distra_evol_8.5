var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.labels = Object();
UCID.portal.cargarEtiquetas('reccomplejas', cargarInterfaz);

/*
 * Ejemplo de como utilizar el componente de Recuperaciones Complejas
 */
function cargarInterfaz(){
    perfil.labels = arguments[1];

    var toolbarPanelReporte =new Ext.Toolbar({
        items:['->',{
            icon:perfil.dirImg+'ayuda.png',
            iconCls:'btn',
            text:perfil.labels.lbBtnAyuda,
            handler: mostrarFilaSeleccionada
        }]
    });
	this.idioma = Ext.idioma.es.cmpreccomplejas.reccomplejas.etiquetas;
    var self = this;
    var objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
        idconfiguracion: 13,
        tituloReporte: self.idioma.titleReporteIncidencias,
        tituloConfiguracion: self.idioma.titleConfigReporte,
        tituloGrid: 'Título de prueba',
        mainToolBar: toolbarPanelReporte,	//ToolBar aportado por la funcionalidad que utilice el componente
        noUsarGestAvisos: false	//False si voy a usar el componente de Gestionar avisos
    });

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[objRecComplejas]
    });
    objRecComplejas.setActiveTab(0);

    //Funcion de ejemlo de como acceder a las filas del GridPanel del reporte
    function mostrarFilaSeleccionada(){
        objRecComplejas.pReporte.gpReporte.getSelec
        var record = objRecComplejas.items.items[0].getFilaSeleccionada();
        if(record != false){
            alert(record.get('_idtablabase'));
        }
    }

}//Fin cargarInterfaz////
