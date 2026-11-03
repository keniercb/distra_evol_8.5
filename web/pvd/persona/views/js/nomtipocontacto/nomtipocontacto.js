/**
 * Nomenclador de la persona TypeContact
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoContacto');

PVD.Persona.NomTipoContacto.Lang = {
    titleGrid: 'Listado de tipos de contacto',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de contacto',
    titleWindMod: 'Modificar tipo de contacto',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tfExpregular: 'Expresión regular',
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    nflongitudMin: 'Longitud mínima',
    nflongitudMax: 'Longitud máxima',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de contacto <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de contacto <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de contacto <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar tipo(s) de conctacto <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de contacto ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El tipo de contacto seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de contacto ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de contacto que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de contacto ya existe.',
    msgMod: 'El tipo de contacto ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de contacto',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de contacto seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de contacto seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de contacto seleccionados?',
    msgDelS: 'El tipo de contacto ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de contacto han sido eliminados satisfactoriamente.'

};
/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoContacto.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomTipoContacto.Lang;
        this.referencia = 'nomtipocontacto';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idtipocontacto'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipocontacto/getTypeContact',
            add: '/pvd/persona/index.php/nomtipocontacto/addTypeContact',
            mod: '/pvd/persona/index.php/nomtipocontacto/modTypeContact',
            del: '/pvd/persona/index.php/nomtipocontacto/delTypeContact',
            expt: '/pvd/persona/index.php/nomtipocontacto/showReport'
        };
        PVD.Persona.NomTipoContacto.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoContacto.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipocontacto/getTypeContactMedium',
    mapping: [
        {name: 'idtipocontacto'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipocontacto';
        this.displayField = 'denominacion';
        this.hiddenName = 'idtipocontacto';
        PVD.Persona.NomTipoContacto.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipomediocontacto', PVD.Persona.NomTipoContacto.ViewCombo);



/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoContacto.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipocontacto/getTypeContact',
    mapping: [
        {name: 'idtipocontacto'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'},

    ],
    initComponent: function () {
        this.valueField = 'idtipocontacto';
        this.displayField = 'denominacion';
        this.hiddenName = 'idtipocontacto';
        PVD.Persona.NomTipoContacto.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipocontacto', PVD.Persona.NomTipoContacto.ViewCombo);

