/**
 * @name configuracion.model - Modelo de la interfaz.
 * @package   Pvd.Sst.Accidente
 * @uses      Pvd.Sst.Accidente.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Sst.Accidente.Configuracion');
Pvd.Sst.Accidente.Configuracion.Modelo = {
    init: function() {
        this.root = {
            text:'',
            expanded: true,
            children: [{
                text: 'Nomencladores',
                expanded: true,
                children:[{
                    text: 'Tipo de accidente',
                    id: 'tipoaccidente',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text: 'Forma de accidente',
                    id: 'formaaccidente',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Parte del cuerpo',
                    id: 'partecuerpo',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text: 'Tipo de invalidez',
                    id: 'tipoinvalidez',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text: 'Naturaleza de la lesi&oacute;n',
                    id: 'naturalezalesion',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text: 'Agente',
                    id: 'agente',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text: 'Causa de accidente',
                    id: 'causaaccidente',
                    leaf: true,
                    checked: false,
                    iconCls: 'brick'
                }]
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
            }*/]
        }
    }
};