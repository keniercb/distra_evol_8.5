/**
 * Nomenclador de la persona motivo sancion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoSancion');
/**
 * Vista en forma de formulario
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoSancion.ViewForm = Ext.extend(PVD.Persona.CmpNomenclador.ViewForm, {
    initComponent: function () {
        PVD.Persona.NomTipoSancion.ViewForm.superclass.initComponent.call(this);
    }
});

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoSancion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        var lang = {};
        this.mapping = [
            {name: 'idtiposancion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'codigo'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtiposancion/getTypeOfSanction',
            add: '/pvd/persona/index.php/nomtiposancion/addTypeOfSanction',
            mod: '/pvd/persona/index.php/nomtiposancion/modTypeOfSanction',
            del: '/pvd/persona/index.php/nomtiposancion/delTypeOfSanction',
            expt: '/pvd/persona/index.php/nomtiposancion/showReport'
        };
        PVD.Persona.NomTipoSancion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoSancion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtiposancion/getTypeOfSanction',
    mapping: [
        {name: 'idtiposancion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'codigo'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtiposancion';
        this.displayField = 'denominacion';
        PVD.Persona.NomTipoSancion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tiposancion', PVD.Persona.NomTipoSancion.ViewCombo);





