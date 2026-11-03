/**
 * Autor: Tte. Ing. Roberto León Socarrás
 */

Misitio.Funciones.PanelMaestroDetalleMultiple({
    id            : 'idMDM',
    identificadorconfiguracion: 'mdpersona'
}, function (panelMDM) {

    this.btnAyuda = new Ext.Button({
        text: "Ayuda",
        iconCls: 'ayuda',
        disabled: false
    });

    this.tbpActivo = new Ext.TabPanel({
        region: 'center',
        activeTab: 0,
        layoutOnTabChange: true,
        maskDisabled: false,
        enableTabScroll: true,
        border: true,
        items: [
            {
                id: 'panelNomencladoresSimples',
                title: 'Panel nomencladores',
                layout: 'fit',
                items: [Misitio.Funciones.VentanaNomencladoresSimples({
                    id: 'NomencladoresSimples',
                    identificadorconfiguracion: 'a'
                })]

            }
            ,{
                id: 'panelConceptos',
                title: 'Panel conceptos',
                layout: 'fit',
                items: [Misitio.Funciones.VentanaConceptos({
                    id: 'ida',
                    identificadorconfiguracion: 'a'
                })]

            }
            ,{
                id: 'panelConceptosMD',
                title: 'Panel maestro-detalle',
                layout: 'fit',
                items: [Misitio.Funciones.VentanaMaestroDetalleOptimizada({
                    id: 'pMD',
                    identificadorconfiguracion: 'a'
                })]

            }
            ,{
                id: 'panelMaestroDetalleMultiple',
                title: 'Panel maestro-detalle múltiple',
                layout: 'fit',
                items: [panelMDM]

            }
        ],
        listeners: {
            activate: function (p) {
                p.doLayout();
            }

        }
    });

    this.panelPrincipal = new Ext.Panel(
        {
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            tbar: ['->', this.btnAyuda],
            items: [this.tbpActivo]

        });



    this.Viewport = new Ext.Viewport(
        {
            layout: 'fit',
            region: 'center',
            // tbar  : ['->', self.btnAyuda],
            items: [this.panelPrincipal]

        });

});




