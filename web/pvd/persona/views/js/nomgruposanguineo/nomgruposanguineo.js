/**
 * Nomenclador de la persona Bloodgroup
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomGrupoSanguineo');

PVD.Persona.NomGrupoSanguineo.Lang = {
    titleGrid: 'Listado de grupos sangu&iacute;neos',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar grupo sangu&iacute;neo',
    titleWindMod: 'Modificar grupo sangu&iacute;neo',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar grupo sangu&iacute;neo <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar grupo sangu&iacute;neo <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar grupo sangu&iacute;neo <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar grupo(s) sanguíneo(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) grupo(s) sangu&iacute;neo(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El grupo sangu&iacute;neo seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El grupo sangu&iacute;neo ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El grupo sangu&iacute;neo que quiere adicionar ya existe.',
    msgNotMod: 'El grupo sangu&iacute;neo ya existe.',
    msgMod: 'El grupo sangu&iacute;neo ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del grupo sangu&iacute;neo',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) grupo(s) sangu&iacute;neo(s) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el grupo sangu&iacute;neo seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los grupos sangu&iacute;neos seleccionados?',
    msgDelS: 'El grupo sangu&iacute;neo ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los grupos sangu&iacute;neos han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomGrupoSanguineo.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomGrupoSanguineo.Lang;
        this.referencia = 'nomgruposanguineo';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idgruposanguineo'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomgruposanguineo/getBloodgroup',
            add: '/pvd/persona/index.php/nomgruposanguineo/addBloodgroup',
            mod: '/pvd/persona/index.php/nomgruposanguineo/modBloodgroup',
            del: '/pvd/persona/index.php/nomgruposanguineo/delBloodgroup',
            expt: '/pvd/persona/index.php/nomgruposanguineo/showReport'
        };
        PVD.Persona.NomGrupoSanguineo.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomGrupoSanguineo.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomgruposanguineo/getBloodgroup',
    mapping: [
        {name: 'idgruposanguineo'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idgruposanguineo';
        this.displayField = 'denominacion';
        this.hiddenName = 'idgruposanguineo';
        PVD.Persona.NomGrupoSanguineo.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_gruposanguineo', PVD.Persona.NomGrupoSanguineo.ViewCombo);

