Ext.ns('PVD.Persona.NomTipoIngreso');
PVD.Persona.NomTipoIngreso.Lang = {
    titleGrid: 'Listado de tipo de ingreso',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de ingreso',
    titleWindMod: 'Modificar tipo de ingreso',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de ingreso <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de ingreso <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de ingreso <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar tipo(s) de ingreso <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de ingreso ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El tipo de tipo de ingreso seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de ingreso ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de ingreso que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de ingreso ya existe.',
    msgMod: 'El tipo de ingreso ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de ingreso',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de ingreso seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de ingreso seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de ingreso seleccionados?',
    msgDelS: 'El ingreso ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los ingresos han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoIngreso.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoIngreso.Lang;
        this.title = this.lang.titleGrid;
        this.referencia = 'nomtipoingreso';
        this.mapping = [
            //esperar los campos de la BD para id
            {name: 'idtipoingreso'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipoingreso/getTipoingreso',
            add: '/pvd/persona/index.php/nomtipoingreso/addTipoingreso',
            mod: '/pvd/persona/index.php/nomtipoingreso/modTipoingreso',
            del: '/pvd/persona/index.php/nomtipoingreso/delTipoingreso',
            expt: '/pvd/persona/index.php/nomtipoingreso/showReport'
        };

        PVD.Persona.NomTipoIngreso.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoIngreso.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipoingreso/getTipoingreso',
    //ver BD para id
    mapping: [
        {name: 'idtipoingreso', type: 'int'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipoingreso';
        this.displayField = 'denominacion';
        PVD.Persona.NomTipoIngreso.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipoingreso', PVD.Persona.NomTipoIngreso.ViewCombo);