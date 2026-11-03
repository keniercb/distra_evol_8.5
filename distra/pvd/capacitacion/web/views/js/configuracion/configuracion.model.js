/**
 * @name configuracion.model - Modelo de la interfaz.
 * @package   Pvd.Capacitacion
 * @uses      Pvd.Capacitacion.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Capacitacion.Configuracion');
Pvd.Capacitacion.Configuracion.Modelo = {
    init: function() {
        this.root = {
            text:'',
            expanded: true,
            children: [{
                text: 'Nomencladores',
                expanded: true,
                children:[{
                        text: 'Modo de formaci&oacute;n',
                        id: 'modoformacion',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    },{
                        text:'Necesidad de capacitaci&oacute;n',
                        id: 'necesidaddecapacitacion',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    },{
                        text: 'Curso',
                        id: 'curso',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    },{
                        text: 'Aseguramiento',
                        id: 'aseguramiento',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    },{
                        text: 'Tipo de acci&oacute;n',
                        id: 'tipoaccion',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    },{
                        text: 'Evaluaci&oacute;n de impacto',
                        expanded: true,
                        children: [{
                                text: 'Indicador',
                                id: 'indicadoramedir',
                                leaf: true,
                                checked: false,
                                iconCls: 'brick'
                            },{
                                text: 'Periodo',
                                id: 'periodo',
                                leaf: true,
                                checked: false,
                                iconCls: 'brick'
                            }
                        ]
                    }
                ]
            },{
                text: 'Configuraciones',
                expanded: true,
                children:[{
                    text: 'L&iacute;mites',
                    id: 'limites01',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                }]
            }]
        }
    }
};