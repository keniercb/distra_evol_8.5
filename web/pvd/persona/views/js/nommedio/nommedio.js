/**
 * Created by olorenzo on 26/06/16.
 */
Ext.ns('PVD.Persona.NomMedio');
PVD.Persona.NomMedio.Lang = {
    titleGrid: 'Listado de Medios',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de medio',
    titleWindMod: 'Modificar tipo de medio',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de medio <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de medio <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de medio <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(es) de medio(s) ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El tipo de medio seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de medio ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de medio que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de medio ya existe.',
    msgMod: 'El tipo de medio ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de medio',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de medio seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de medio seleccionados?',
    msgDelS: 'El tipo de medio ha sido eliminada satisfactoriamente.',
    msgDelP: 'Los tipos de medios han sido eliminados satisfactoriamente.'
};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMedio.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomMedio.Lang;
        this.title = this.lang.titleGrid;
        this.mapping = [
            //esperar los campos de la BD para id
            {name: 'idmedio'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nommedio/getMedio',
            add: '/pvd/persona/index.php/nommedio/addMedio',
            mod: '/pvd/persona/index.php/nommedio/modMedio',
            del: '/pvd/persona/index.php/nommedio/delMedio',
            expt: '/pvd/persona/index.php/nommedio/showReport'
        };

        PVD.Persona.NomMedio.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMedio.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/personaindex.php/nommedio/getMedio',
    mapping: [
        {name: 'idmedio'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idmedio';
        this.displayField = 'denominacion';
        PVD.Persona.NomMedio.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_medio', PVD.Persona.NomMedio.ViewCombo);