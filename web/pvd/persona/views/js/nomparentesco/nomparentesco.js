/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/

Ext.ns('PVD.Persona.NomParentesco');
PVD.Persona.NomParentesco.Lang = {
    titleGrid: 'Listado de parentesco',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de parentesco',
    titleWindMod: 'Modificar tipo de parentesco',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de parentesco <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de parentesco <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de parentesco <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar parentesco(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(es) de parentesco ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El tipo de parentesco seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de parentesco ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de parentesco que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de parentesco ya existe.',
    msgMod: 'El tipo de parentesco ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de parentesco',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(es) de parentesco seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de parentesco seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de parentesco seleccionados?',
    msgDelS: 'El parentesco ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los parentescos han sido eliminados satisfactoriamente.'



};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomParentesco.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.referencia = 'nomparentesco';
        this.lang = PVD.Persona.NomParentesco.Lang;
        this.title = this.lang.titleGrid;
        this.mapping = [
            //esperar los campos de la BD para id
            {name: 'idparentesco'},
            {name: 'inverso'},
            {name: 'cant', type: 'int'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomparentesco/getParentesco',
            add: '/pvd/persona/index.php/nomparentesco/addParentesco',
            mod: '/pvd/persona/index.php/nomparentesco/modParentesco',
            del: '/pvd/persona/index.php/nomparentesco/delParentesco',
            expt: '/pvd/persona/index.php/nomparentesco/showReport'
        };

        PVD.Persona.NomParentesco.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomParentesco.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomparentesco/getParentesco',
    //ver BD para id
    mapping: [
        {name: 'idparentesco', type: 'int'},
        {name: 'inverso'},
        {name: 'cant', type: 'int'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idparentesco';
        this.displayField = 'denominacion';
        PVD.Persona.NomParentesco.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_parentesco', PVD.Persona.NomParentesco.ViewCombo);