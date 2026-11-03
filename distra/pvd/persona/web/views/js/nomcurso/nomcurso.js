/**
 * Nomenclador de la persona cursos
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCurso');
PVD.Persona.NomCurso.Lang = {
    titleGrid: 'Listado de cursos',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar curso',
    titleWindMod: 'Modificar curso',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar curso <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar curso <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar curso <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar curso(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) curso(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El color de los ojos seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El curso ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El curso que quiere adicionar ya existe.',
    msgNotMod: 'El curso ya existe.',
    msgMod: 'El curso ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del curso',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) curso(s) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el curso seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los cursos seleccionados?',
    msgDelS: 'El curso ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los cursos han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCurso.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomCurso.Lang;
        this.referencia = 'nomcurso';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idcurso'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'curso'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'gestion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomcurso/getCurso',
            add: '/pvd/persona/index.php/nomcurso/addCurso',
            mod: '/pvd/persona/index.php/nomcurso/modCurso',
            del: '/pvd/persona/index.php/nomcurso/delCurso',
            expt: '/pvd/persona/index.php/nomcurso/showReport'
        };
        PVD.Persona.NomCurso.ViewGrid.superclass.initComponent.call(this);

    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCurso.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcurso/getCurso',
    mapping: [
        {name: 'idcurso'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcurso';
        this.displayField = 'denominacion';
        PVD.Persona.NomCurso.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_curso', PVD.Persona.NomCurso.ViewCombo);