/**
 * @name configuracion.model - Modelo de la interfaz.
 * @package   Pvd.Sst.Riesgo
 * @uses      Pvd.Sst.Riesgo.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Beatriz Selema Alvarez
 * @version   1.0
 */
Ext.ns('Pvd.Sst.Medios.Configuracion');
Pvd.Sst.Medios.Configuracion.Modelo = {
    init: function () {
        this.root = {
            text: '',
            expanded: true,
            children: [
                {
                    text: 'Nomencladores',
                    expanded: true,
                    children: [
                        {
                            text: 'Medios de protección',
                            id: 'medio',
                            leaf: true,
                            checked: false,
                            iconCls: 'brick'
                        }
                    ]
                }/*,{
                 text: 'Configuraciones',
                 expanded: true,
                 children:[{
                 text: 'L&iacute;mites',
                 id: 'limites01',
                 leaf: true,
                 checked: false,
                 iconCls: 'brick'
                 }]
                 }*/
            ]
        }
    }
};