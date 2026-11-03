/**
 * Nomenclador de la persona Situacion excepcional
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomSituacExcep');
//alert('sgfdh');
PVD.Persona.NomSituacExcep.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar estructura de situaci&oacute;n excepcional',
    titleWindMod: 'Modificar estructura de situaci&oacute;n excepcional',
    titleGrid: 'Listado de estructuras de situaciones excepcionales',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar estructura de situaci&oacute;n excepcional <b>(Alt+I)</b>',

    ttBtnChange: 'Modificar estructura de situaci&oacute;n excepcional <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar estructura de situaci&oacute;n excepcional <b>(DEL)</b>',
    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar estructura de situaci&oacute;n excepcional <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) situaci&oacute;n(nes) excepcional(es) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La(s) situaci&oacute;n(nes) excepcional(es) seleccionada(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'La estructura de situaci&oacute;n excepcional ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La estructura de situaci&oacute;n excepcional que quiere adicionar ya existe.',
    msgNotMod: 'La estructura de situaci&oacute;n excepcional ya existe.',
    msgMod: 'La estructura de situaci&oacute;n excepcional ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos...',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) situaci&oacute;n(nes) excepcional(es) seleccionada(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar la estructura de situaci&oacute;n excepcional seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las estructuras de situaciones excepcionales seleccionadas?',
    msgDelS: 'La estructura de situaci&oacute;n excepcional ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las estructuras de situaciones excepcionales han sido eliminadas satisfactoriamente.'
};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomSituacExcep.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomSituacExcep.Lang;
        this.referencia = 'nomsituacexcep';
        this.mapping = [
            {name: 'idsituacexcep'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomsituacexcep/getSituacExcep',
            add: '/pvd/persona/index.php/nomsituacexcep/addSituacExcep',
            mod: '/pvd/persona/index.php/nomsituacexcep/modSituacExcep',
            del: '/pvd/persona/index.php/nomsituacexcep/delSituacExcep',
            expt: '/pvd/persona/index.php/nomsituacexcep/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomSituacExcep.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomSituacExcep.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomsituacexcep/getSituacExcep',
    mapping: [
        {name: 'idsituacexcep'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idsituacexcep';
        this.displayField = 'denominacion';
        this.name = 'idsituacexcep';
        this.hiddenName = 'idsituacexcep';
        PVD.Persona.NomSituacExcep.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_situacexcep', PVD.Persona.NomSituacExcep.ViewCombo);