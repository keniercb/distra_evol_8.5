/**
 * @name configuracion.model - Modelo de la interfaz.
 * @package   Pvd.Competencia
 * @uses      Pvd.Competencia.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Competencia.Configuracion');
Pvd.Competencia.Configuracion.Modelo = {
    init: function(idioma) {
		this.root = {
            text:'',
            expanded: true,
            children: [{
                text:'Nomencladores',
                expanded: true,
                children:[{
                    text:'Competencia',
                    id:'nomcompetencia',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Clasificaci&oacute;n de competencia',
                    id:'nomclasificaciondecompetencia',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                }]
            }/*,{
                text:'Configuraciones'
            }*/]
        }


    }
};