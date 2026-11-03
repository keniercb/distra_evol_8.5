/**
 * Created by olorenzo on 26/06/16.
 */
Ext.ns('PVD.Persona.NomAsignacion');
PVD.Persona.NomAsignacion.Lang = {
    titleGrid: 'Listado de Asignación',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de asignación',
    titleWindMod: 'Modificar tipo de asignación',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de asignación <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de asignación <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de asignación <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(es) de asignación ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El tipo de asignación seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de asignación ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de asignación que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de asignación ya existe.',
    msgMod: 'El tipo de asignación ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de asignación',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de asignación seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de asignación seleccionados?',
    msgDelS: 'El tipo de asignación ha sido eliminada satisfactoriamente.',
    msgDelP: 'Los tipos de asignación han sido eliminadas satisfactoriamente.'
};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAsignacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomAsignacion.Lang;
        this.title = this.lang.titleGrid;
        this.referencia = 'nomasignacion';
        this.mapping = [
            //esperar los campos de la BD para id
            {name: 'idasignacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomasignacion/getAsignacion',
            add: '/pvd/persona/index.php/nomasignacion/addAsignacion',
            mod: '/pvd/persona/index.php/nomasignacion/modAsignacion',
            del: '/pvd/persona/index.php/nomasignacion/delAsignacion',
            expt: '/pvd/persona/index.php/nomasignacion/showReport'
        };

        PVD.Persona.NomAsignacion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAsignacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/personaindex.php/nomasignacion/getAsignacion',
    mapping: [
        {name: 'idasignacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idasignacion';
        this.displayField = 'denominacion';
        PVD.Persona.NomAsignacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_asignacion', PVD.Persona.NomAsignacion.ViewCombo);