/**
 * Nomenclador de la persona facultad estudio
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomFacultadEstudio');

PVD.Persona.NomFacultadEstudio.Lang = {
    titleGrid: 'Listado de facultades de estudios',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar facultad de estudio',
    titleWindMod: 'Modificar facultad de estudio',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar facultad de estudio <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar facultad de estudio <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar facultad de estudio <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar facultad(es) de estudio <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) facultad(es) de estudio(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La facultad de estudio seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La facultad de estudio ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La facultad de estudio que quiere adicionar ya existe.',
    msgNotMod: 'La facultad de estudio ya existe.',
    msgMod: 'La facultad de estudio ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la facultad de estudio',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) facultad(es) de estudio(s) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la facultad de estudio seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las facultades de estudios seleccionadas?',
    msgDelS: 'La facultad de estudio ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las facultades de estudios han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomFacultadEstudio.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomFacultadEstudio.Lang;
        this.referencia = 'nomfacultadestudio';
        this.mapping = [
            {name: 'idfacultadestudio'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomfacultadestudio/getFacultyOfStudy',
            add: '/pvd/persona/index.php/nomfacultadestudio/addFacultyOfStudy',
            mod: '/pvd/persona/index.php/nomfacultadestudio/modFacultyOfStudy',
            del: '/pvd/persona/index.php/nomfacultadestudio/delFacultyOfStudy',
            expt: '/pvd/persona/index.php/nomfacultadestudio/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomFacultadEstudio.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomFacultadEstudio.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomfacultadestudio/getFacultyOfStudy',
    mapping: [
        {name: 'idfacultadestudio'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idfacultadestudio';
        this.displayField = 'denominacion';
        PVD.Persona.NomFacultadEstudio.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_facultadestudio', PVD.Persona.NomFacultadEstudio.ViewCombo);





