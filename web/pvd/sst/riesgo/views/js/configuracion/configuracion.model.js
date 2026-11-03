/**
 * @name configuracion.model - Modelo de la interfaz.
 * @package   Pvd.Sst.Riesgo
 * @uses      Pvd.Sst.Riesgo.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
Ext.ns('Pvd.Sst.Riesgo.Configuracion');
Pvd.Sst.Riesgo.Configuracion.Modelo = {
    init: function() {
        this.root = {
            text:'',
            expanded: true,
            children: [{
                text: 'Riesgos laborales',
                expanded: true,
                children:[{
                    text: 'Nomencladores',
                    expanded: true,
                    children:[{
                        text: 'Riesgo',
                        id: 'riesgo',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Probabilidad',
                        id: 'probabilidad',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    },{
                        text:'Nivel de riesgo',
                        id: 'nivelriesgo',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Frecuencia',
                        id: 'frecuencia',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Recurso',
                        id: 'recurso',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Evento',
                        id: 'evento',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Peligro',
                        id: 'peligro',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Consecuencia',
                        id: 'consecuencia',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Sistema',
                        id: 'sistema',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }]
                }, {
                    text: 'Configuraciones',
                    expanded: true,
                    children:[{
						text: 'Grado de peligrosidad',
                        id: 'grado',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    },{
                        text: 'Magnitud de riesgo',
                        id: 'magnitud',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }]
                }]
            }, {
                text: 'Equipos de alto riesgo industrial',
                expanded: true,
                children: [{text: 'Nomencladores',
                    expanded: true,
                    children:[{
                        text: 'Clasificación de equipos',
                        id: 'clasifequipo',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }, {
                        text: 'Tipo de inspección',
                        id: 'tipoinspeccion',
                        leaf: true,
                        checked: false,
                        iconCls: 'brick'
                    }]}]
            }]
        }
    }
};