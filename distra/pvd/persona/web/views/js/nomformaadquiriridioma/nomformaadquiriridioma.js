/**
 * Nomenclador de la persona forma adquirir idioma
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomFormaAdquirirIdioma');

PVD.Persona.NomFormaAdquirirIdioma.Lang = {
    titleGrid: 'Listado de v&iacute;as de aprendizaje del idioma',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar v&iacute;a de aprendizaje del idioma',
    titleWindMod: 'Modificar v&iacute;a de aprendizaje del idioma',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar v&iacute;a de aprendizaje del idioma <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar v&iacute;a de aprendizaje del idioma <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar v&iacute;a de aprendizaje del idioma <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar vía(s) de aprendizaje del idioma <b>(Alt+B)</b>',

    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) v&iacute;a(s) de aprendizaje del idioma ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La v&iacute;a de aprendizaje del idioma seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La v&iacute;a de aprendizaje del idioma ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La v&iacute;a de aprendizaje del idioma que quiere adicionar ya existe.',
    msgNotMod: 'La v&iacute;a de aprendizaje del idioma ya existe.',
    msgMod: 'La v&iacute;a de aprendizaje del idioma ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de v&iacute;a de aprendizaje del idioma',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) v&iacute;a(s) de aprendizaje del idioma seleccionada(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar la v&iacute;a de aprendizaje del idioma seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las v&iacute;as de aprendizaje del idioma seleccionadas?',
    msgDelS: 'La v&iacute;a de aprendizaje del idioma ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las v&iacute;as de aprendizaje del idioma han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomFormaAdquirirIdioma.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomFormaAdquirirIdioma.Lang;
        this.referencia = 'nomformaadquiriridioma';
        this.mapping = [
            {name: 'idformaadquiriridioma'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.title = this.lang.titleGrid;
        this.url = {
            getAll: '/pvd/persona/index.php/nomformaadquiriridioma/getWayAcquiringLanguage',
            add: '/pvd/persona/index.php/nomformaadquiriridioma/addWayAcquiringLanguage',
            mod: '/pvd/persona/index.php/nomformaadquiriridioma/modWayAcquiringLanguage',
            del: '/pvd/persona/index.php/nomformaadquiriridioma/delWayAcquiringLanguage',
            expt: '/pvd/persona/index.php/nomformaadquiriridioma/showReport'
        };
        PVD.Persona.NomFormaAdquirirIdioma.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomFormaAdquirirIdioma.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomformaadquiriridioma/getWayAcquiringLanguage',
    mapping: [
        {name: 'idformaadquiriridioma'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idformaadquiriridioma';
        this.displayField = 'denominacion';
        PVD.Persona.NomFormaAdquirirIdioma.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_formaadquiriridioma', PVD.Persona.NomFormaAdquirirIdioma.ViewCombo);





