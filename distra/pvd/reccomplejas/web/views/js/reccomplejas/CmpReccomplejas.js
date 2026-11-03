/*
 * Componente de Recuperaciones complejas
 *
 * @author Ing. Javier Rodriguez Lopez
 * @version 1.0-0 *
 */
Ext.ns("Ext.components.CmpReccomplejas");
Ext.components.CmpReccomplejas.Interfaz = Ext.extend(Ext.TabPanel, {
    region: 'center',
    tituloReporte: 'Reporte',
    tituloConfiguracion: 'Configuración',
    tituloGrid: 'Grid',
    activeTab: 0,
    margins: '5, 5, 5, 5',
    initComponent: function ()
    {
        var self = this;
        this.limite = this.limite ? this.limite : 18;
        this.autocargar = 1;
        this.idioma = Ext.idioma.es.cmpreccomplejas.reccomplejas.etiquetas;

        this.pConfiguracion = new Ext.components.CmpReccomplejas.PanelConfiguracion({
            tabTip: self.idioma.tabtipPanelConfiguracion,
            idconfiguracion: this.idconfiguracion,
            idioma: self.idioma,
            title: this.tituloConfiguracion,
            parent: self,
            noUsarGestAvisos: self.hasOwnProperty('noUsarGestAvisos') ? self.noUsarGestAvisos : false,
            hideBtnOperCant: self.hasOwnProperty('hideBtnOperCant') ? self.hideBtnOperCant : true,
            referenciaAyuda: self.hasOwnProperty('referenciaAyuda') ? self.referenciaAyuda : ''
        });

        this.pReporte = new Ext.components.CmpReccomplejas.PanelReporte({
            tabTip: self.idioma.tabtipPanelReporte,
            idconfiguracion: this.idconfiguracion,
            title: this.tituloReporte,
            tituloGrid: this.tituloGrid,
            limite: self.limite,
            parent: self,
            idGrid: self.idGrid,
            idPanel: self.idPanel,
            gridMenu: self.gridMenu ? true : false,
            hideBtnRtf: self.hasOwnProperty('hideBtnRtf') ? self.hideBtnRtf : false,
            tbar: self.hasOwnProperty('mainToolBar') ? self.mainToolBar : new Ext.Toolbar(),
            singleSelect: self.hasOwnProperty('singleSelect') ? this.singleSelect : true,
            autoLoadList: self.hasOwnProperty('autoLoadList') ? self.autoLoadList : true,
            filters: self.filters || [],
            viewGridConfig: this.viewGridConfig || {}
        });

        this.items = [this.pReporte, this.pConfiguracion];
        Ext.components.CmpReccomplejas.Interfaz.superclass.initComponent.call(this);
    },
    /**
     * Modifica el arreglo de filtros de la preconfiguracion
     * @param filters
     */
    setFilters: function (filters)
    {
        this.pReporte.filters = filters;
    },
    /**
     * Devuelve el arreglo de filtros preconfigurados
     * @returns {*}
     */
    getFilters: function ()
    {
        return this.pReporte.filters;
    }
})
;
Ext.reg('CmpReccomplejas', Ext.components.CmpReccomplejas.Interfaz);