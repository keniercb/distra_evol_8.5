/**
 * Nomenclador de la persona grupo estudio
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomGrupoEstudio');
/**
 * Vista en forma de formulario
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomGrupoEstudio.ViewForm = Ext.extend(PVD.Persona.CmpNomenclador.ViewForm, {
    initComponent: function () {
        PVD.Persona.NomGrupoEstudio.ViewForm.superclass.initComponent.call(this);
    }
});

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomGrupoEstudio.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        var lang = {};
        this.mapping = [
            {name: 'idgrupoestudio'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomgrupoestudio/getGroupStudy',
            add: '/pvd/persona/index.php/nomgrupoestudio/addGroupStudy',
            mod: '/pvd/persona/index.php/nomgrupoestudio/modGroupStudy',
            del: '/pvd/persona/index.php/nomgrupoestudio/delGroupStudy',
            expt: '/pvd/persona/index.php/nomgrupoestudio/showReport'
        };
        PVD.Persona.NomGrupoEstudio.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomGrupoEstudio.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomgrupoestudio/getGroupStudy',
    mapping: [
        {name: 'idgrupoestudio'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idgrupoestudio';
        this.displayField = 'denominacion';
        PVD.Persona.NomGrupoEstudio.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_grupoestudio', PVD.Persona.NomGrupoEstudio.ViewCombo);





