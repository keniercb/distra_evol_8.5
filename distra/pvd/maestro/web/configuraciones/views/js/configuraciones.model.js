/**
 * @name configuracion.model - Modelo de la interfaz.
 * @package   Pvd.Maestro
 * @uses      Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Ing. Orestes Rodríguez Lorenzo
 * @modify 18/10/2017 Ing. Orestes Rodríguez Lorenzo. Modificación del modelo del árbol. Gestión estática de los
 *                    elementos.
 * @version   1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.Modelo = {
    init: function() {
        this.root = {
            text:'',
            expanded: true,
            children: [{
                text:'Nomencladores',
                expanded: true,
                children:[{
                    text:'Cargos para comisiones',
                    id:'nomcargocomision',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Valor cualitativo',
                    id:'pValorCualitativo',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Per&iacute;odo Vacacional',
                    id:'pPeriodoVacacional',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                }]
            },{
                text:'Configuraciones',
                expanded: true,
                children: [{
                    text:'Estructuras por conceptos',
                    id:'pEstructConcepto',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Categor&iacute;as ocupacionales',
                    id:'pCategOcupacional',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Criterios de unicidad de las personas',
                    id:'pRegUnico',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Configuraci&oacute;n de conceptos de n&oacute;mina',
                    id:'pConfconceptos',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Firmas',
                    id:'pAprueba',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Pie de firma',
                    id:'pPieFirma',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Importar excel',
                    id:'pImportarExcel',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Comisi&oacute;n',
                    id:'pComision',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Notificaciones',
                    id:'pNotificacion',
                    leaf:true,
                    checked: false,
                    qtip: 'Configurar notificaciones por correo electr&oacute;nico',
                    iconCls: 'brick'
                },{
                    text:'Escala',
                    id:'pEscala',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Estructuras para idoneidad',
                    id:'pidoneidad',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                },{
                    text:'Configurar rango de edades',
                    id:'pRangoEdades',
                    leaf:true,
                    checked: false,
                    iconCls: 'brick'
                }]
            }]
        }
    }
};