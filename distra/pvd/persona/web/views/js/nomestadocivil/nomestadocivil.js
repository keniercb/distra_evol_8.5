/**
 * Nomenclador de la persona estado civil
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomEstadoCivil');
PVD.Persona.NomEstadoCivil.Lang = {
    titleGrid: 'Listado de estados civiles',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar estado civil',
    titleWindMod: 'Modificar estado civil',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar estado civil <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar estado civil <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar estado civil <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar estado(s) civil <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) estado(s) civil(es) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El estado civil seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El estado civil ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El estado civil que quiere adicionar ya existe.',
    msgNotMod: 'El estado civil ya existe.',
    msgMod: 'El estado civil ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del estado civil',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) estado(s) civil(es) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el estado civil seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los estados civiles seleccionados?',
    msgDelS: 'El estado civil ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los estado civiles han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEstadoCivil.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        this.lang = PVD.Persona.NomEstadoCivil.Lang;
        this.title = this.lang.titleGrid;
        this.referencia = 'nomestadocivil';
        this.mapping = [
            {name: 'idestadocivil'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomestadocivil/getMaritalStatus',
            add: '/pvd/persona/index.php/nomestadocivil/addMaritalStatus',
            mod: '/pvd/persona/index.php/nomestadocivil/modMaritalStatus',
            del: '/pvd/persona/index.php/nomestadocivil/delMaritalStatus',
            expt: '/pvd/persona/index.php/nomestadocivil/showReport'
        };
        PVD.Persona.NomEstadoCivil.ViewGrid.superclass.initComponent.call(this);
    }
});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEstadoCivil.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomestadocivil/getMaritalStatus',
    mapping: [
        {name: 'idestadocivil'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idestadocivil';
        this.displayField = 'denominacion';
        this.hiddenName = 'idestadocivil';
        PVD.Persona.NomEstadoCivil.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_estadocivil', PVD.Persona.NomEstadoCivil.ViewCombo);