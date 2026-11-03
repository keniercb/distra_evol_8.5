/**
 * Nomenclador de la persona Estratificacion Social
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomEstratificacionSocial');
PVD.Persona.NomEstratificacionSocial.Lang = {
    titleGrid: 'Listado de estratificaciones sociales',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar estratificaci&oacute;n social',
    titleWindMod: 'Modificar estratificaci&oacute;n social',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar estratificaci&oacute;n social <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar estratificaci&oacute;n social <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar estratificaci&oacute;n social <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar estratificación(es) social <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) estratificación(es) social(es) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La estratificaci&oacute;n social seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La estratificaci&oacute;n social ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La estratificaci&oacute;n social que quiere adicionar ya existe.',
    msgNotMod: 'La estratificaci&oacute;n social ya existe.',
    msgMod: 'La estratificaci&oacute;n social ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la estratificaci&oacute;n social',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) estratificaci&oacute;n(es) social(es) seleccionada(s)?',



    msgAskDelS: '¿Está seguro que quiere eliminar la estratificaci&oacute;n social seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las estratificaciones sociales seleccionadas?',
    msgDelS: 'La estratificación social ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las estratificaciónes sociales han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEstratificacionSocial.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomEstratificacionSocial.Lang;
        this.referencia = 'nomestratificacionsocial';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idestratificacionsocial'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomestratificacionsocial/getSocialStratification',
            add: '/pvd/persona/index.php/nomestratificacionsocial/addSocialStratification',
            mod: '/pvd/persona/index.php/nomestratificacionsocial/modSocialStratification',
            del: '/pvd/persona/index.php/nomestratificacionsocial/delSocialStratification',
            expt: '/pvd/persona/index.php/nomestratificacionsocial/showReport'
        };
        PVD.Persona.NomEstratificacionSocial.ViewGrid.superclass.initComponent.call(this);

    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEstratificacionSocial.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomestratificacionsocial/getSocialStratification',
    mapping: [
        {name: 'idestratificacionsocial'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idestratificacionsocial';
        this.displayField = 'denominacion';
        this.hiddenName = 'idestratificacionsocial';
        PVD.Persona.NomEstratificacionSocial.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_estratificacionsocial', PVD.Persona.NomEstratificacionSocial.ViewCombo);




