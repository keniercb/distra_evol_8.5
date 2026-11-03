/**
 * @name reportes.CmpRecuperacionCompleja.
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Reportes
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Yaricel Guerra Velázquez
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Reportes');
Pvd.Seleccion.Reportes.CmpRecuperacionCompleja = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'reccompleja',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        this.Objreccomplejas = new Ext.components.CmpReccomplejas.Interfaz({
            title: 'Listado de personas',
            disabled: false,
            width: '100%',
            region: 'center',
            margins: '5 0 5 5 ',
            border: true,
            idconfiguracion: 'seleccion',
            tituloReporte: 'Listado de candidatos',
            tituloConfiguracion: 'Configuración de la búsqueda',
            tituloGrid: 'Listado de candidatos',
            hideBtnRtf: true,
            singleSelect: false,
            noUsarGestAvisos: true,
            useMap: false,
            autoLoadList: true,
            hideBtnOperCant: true,
            renderers: getRenderes()
        });
        function getRenderes() {
            return Ext.apply({
                showSexo: function (val) {
                    if (val === 'Femenino') {
                        return 'F';
                    }
                    return 'M';
                }
            });
        }

        this.items = [this.Objreccomplejas];
        Pvd.Seleccion.Reportes.CmpRecuperacionCompleja.superclass.initComponent.call(this);
    }
});