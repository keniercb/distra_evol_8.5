/**
 * Nomenclador de la persona procedencia social
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomProcedenciaSocial');
PVD.Persona.NomProcedenciaSocial.Lang = {
    titleGrid: 'Listado de procedencias sociales',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar procedencia social',
    titleWindMod: 'Modificar procedencia social',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar procedencia social <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar procedencia social <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar procedencia social <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar procedencia(s) social <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) prodecencia(s) social(es) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La procedencia social seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La procedencia social ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La procedencia social que quiere adicionar ya existe.',
    msgNotMod: 'La procedencia social ya existe.',
    msgMod: 'La procedencia social ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la procedencia social',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) prodecencia(s) social(es) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la prodecencia social seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las prodecencias sociales seleccionadas?',
    msgDelS: 'La prodecencia sociales han sido eliminadas satisfactoriamente.',
    msgDelP: 'Las prodecencias sociales han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomProcedenciaSocial.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomProcedenciaSocial.Lang;
        this.referencia = 'nomprocedenciasocial';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idcolorpiel'},
            {name: 'denominacion'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomprocedenciasocial/getSocialOrigin',
            add: '/pvd/persona/index.php/nomprocedenciasocial/addSocialOrigin',
            mod: '/pvd/persona/index.php/nomprocedenciasocial/modSocialOrigin',
            del: '/pvd/persona/index.php/nomprocedenciasocial/delSocialOrigin',
            expt: '/pvd/persona/index.php/nomprocedenciasocial/showReport'
        };
        PVD.Persona.NomProcedenciaSocial.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomProcedenciaSocial.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomprocedenciasocial/getSocialOrigin',
    mapping: [
        {name: 'idprocedenciasocial', type: "int"},
        {name: 'denominacion', type: "string"},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        /*this.valueField = 'idprocedenciasocial';
        this.displayField = 'denominacion';
        this.hiddenName = 'idprocedenciasocial';*/
        PVD.Persona.NomProcedenciaSocial.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_procedenciasocial', PVD.Persona.NomProcedenciaSocial.ViewCombo);

