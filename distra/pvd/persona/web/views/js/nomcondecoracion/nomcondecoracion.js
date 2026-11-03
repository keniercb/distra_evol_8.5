/**
 * Nomenclador de la persona Tipo de condecoración
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoCondecoracion');

PVD.Persona.NomTipoCondecoracion.Lang = {
    titleGrid: 'Listado de tipos de condecoraciones',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de condecoraci&oacute;n',
    titleWindMod: 'Modificar tipo de condecoraci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de condecoraci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de condecoraci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de tipo de condecoraci&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar tipo(s) de condecoración <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo de condecoraci&oacute;n(es) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El tipo de condecoraci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de condecoraci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de condecoración que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de condecoraci&oacute;n ya existe.',
    msgMod: 'El tipo de condecoraci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de tipo de condecoraci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de condecoraci&oacute;n(es) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de condecoraci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de condecoraciones seleccionados?',
    msgDelS: 'El tipo de condecoraci&oacute;n ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipo de condecoraciones han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoCondecoracion.TipoCondecoraciones = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoCondecoracion.Lang;
        this.referencia = 'nomtipocondecoracion';
        this.mapping = [
            {name: 'idtipocondecoracion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipocondecoracion/getTipoCondecoraciones',
            add: '/pvd/persona/index.php/nomtipocondecoracion/addTipoCondecoracion',
            mod: '/pvd/persona/index.php/nomtipocondecoracion/modTipoCondecoracion',
            del: '/pvd/persona/index.php/nomtipocondecoracion/delTipoCondecoracion',
            expt: '/pvd/persona/index.php/nomtipocondecoracion/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomTipoCondecoracion.TipoCondecoraciones.superclass.initComponent.call(this);
        this.on('render', function () {
            Ext.getCmp('btnHelp_' + this.referencia).setVisible(false);
        }, this);
        this.getStore().on('load',function(){
            this.btnAdd.focus(200);
        },this);
    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoCondecoracion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipocondecoracion/getTipoCondecoraciones',
    mapping: [
        {name: 'idtipocondecoracion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipocondecoracion';
        this.displayField = 'denominacion';
        this.name = 'idtipocondecoracion';
        this.hiddenName = 'idtipocondecoracion';
        PVD.Persona.NomTipoCondecoracion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipocondecoracion', PVD.Persona.NomTipoCondecoracion.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
/**
 * Nomenclador de la persona condecoracion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCondecoracion');

PVD.Persona.NomCondecoracion.Lang = {
    titleGrid: 'Listado de condecoraciones',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar condecoraci&oacute;n',
    titleWindMod: 'Modificar condecoraci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar condecoraci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar condecoraci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar condecoraci&oacute;n <b>(DEL)</b>',
    /**
     * Nombres de las labels del formulario
     */
    tfDenomination: 'Denominación',
    tfabr: 'Abreviatura',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tpCondecoracion: 'Tipo de condecoración',

    ttBuscar:'Buscar condecoración <b>(Alt+B)</b>',

    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) condecoración(es) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La condecoraci&oacute;n seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La condecoraci&oacute;n ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La condecoraci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'La condecoraci&oacute;n ya existe.',
    msgMod: 'La condecoraci&oacute;n ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la condecoraci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) condecoraci&oacute;n(es) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la condecoraci&oacute;n seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las condecoraciones seleccionadas?',
    msgDelS: 'La condecoración ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las condecoraciones han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCondecoracion.Condecoraciones = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomCondecoracion.Lang;
        this.referencia = 'nomcondecoracion';
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'tfCondecoracion' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            fieldLabel: this.lang.tfDenomination,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ%()\\+\-_/.\s]$/,
            maxLength: 255,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%',
            enableKeyEvents: true,
            vtype: 'denominacion',
            listeners: {                    
                keyup: function(tf, e) {
                    if (e.getKey() != 9) {
                        if (self.form.getForm().isValid()) {
                            self.btnApply.enable();
                            self.btnAcept.enable();
                        } else {
                            self.btnApply.disable();
                            self.btnAcept.disable();
                        }
                    }                    
                }
            }
        });

        this.tfAbbreviation = new Ext.form.TextField({
            fieldLabel: self.lang.tfabr,
            name: 'abreviatura',
            anchor: '100%',
            maxLength: 5
        });

        this.taDescription = new Ext.form.TextArea({
            id: 'taDescription' + self.referencia,
            nextTab: 'btnCancel' + self.referencia,
            prevTab: 'fhasta' + self.referencia,
            fieldLabel: this.lang.taDescription,
            name: 'descripcion',
            anchor: '100%',
            height: 90,
            maxLength: 255,
            enableKeyEvents: true,
            listeners: {                    
                keyup: function(tf, e) {
                    if (e.getKey() != 9) {
                        if (self.form.getForm().isValid()) {
                            self.btnApply.enable();
                            self.btnAcept.enable();
                        } else {
                            self.btnApply.disable();
                            self.btnAcept.disable();
                        }
                    }                    
                }
            }
        });

        this.dfFrom = new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.referencia,
            nextTab: 'fhasta' + self.referencia,
            prevTab: 'tfCondecoracion' + self.referencia,
            fieldLabel: this.lang.dfFrom,
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta' + self.referencia,
            enableKeyEvents: true,
            listeners: {
                keypress: function(tf, e) {
                    if (e.getKey() != 9) {
                        if (self.form.getForm().isValid()) {
                            self.btnApply.enable();
                            self.btnAcept.enable();
                        } else {
                            self.btnApply.disable();
                            self.btnAcept.disable();
                        }
                    }                    
                }
            }
        });

        this.dfUp = new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.referencia,
            nextTab: 'taDescription' + self.referencia,
            prevTab: 'fdesde' + self.referencia,
            fieldLabel: this.lang.dfUp,
            anchor: '100%',
            format: 'd/m/Y',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.referencia,
            enableKeyEvents: true,
            listeners: {
                keypress: function(tf, e) {
                    if (e.getKey() != 9) {
                        if (self.form.getForm().isValid()) {
                            self.btnApply.enable();
                            self.btnAcept.enable();
                        } else {
                            self.btnApply.disable();
                            self.btnAcept.disable();
                        }
                    }                    
                }
            }
        });

        this.cmbTipoCondecoracion = new PVD.Persona.NomTipoCondecoracion.ViewCombo({
            id: 'tfCondecoracion' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            emptyText:'Seleccione...',
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: this.lang.tpCondecoracion,
            anchor: '100%',
            enableKeyEvents:true,
            allowBlank: false,
            listeners: {
                select: function(combo, record, index) {
                    if (self.form.getForm().isValid()) {
                        self.btnApply.enable();
                        self.btnAcept.enable();
                    } else {
                        self.btnApply.disable();
                        self.btnAcept.disable();
                    }
                }
            }
        });

        this.newConf = {
            //width: '70%',
            itemsForm: [
                this.tfDenomination, this.tfAbbreviation, this.cmbTipoCondecoracion,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFrom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfUp]
                        }
                    ]
                }, this.taDescription
            ]
        };

        this.mapping = [
            {name: 'idcondecoracion'},
            {name: 'idtipocondecoracion'},
            {name: 'abreviatura'},
            {name: 'denominacion'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomcondecoracion/getCondecoration',
            add: '/pvd/persona/index.php/nomcondecoracion/addCondecoration',
            mod: '/pvd/persona/index.php/nomcondecoracion/modCondecoration',
            del: '/pvd/persona/index.php/nomcondecoracion/delCondecoration',
            expt: '/pvd/persona/index.php/nomcondecoracion/showReport'
        };

        this.title = this.lang.titleGrid;

        PVD.Persona.NomCondecoracion.Condecoraciones.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCondecoracion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcondecoracion/getCondecoration',
    mapping: [
        {name: 'idcondecoracion'},
        {name: 'idtipocondecoracion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcondecoracion';
        this.displayField = 'denominacion';
        PVD.Persona.NomCondecoracion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_condecoracion', PVD.Persona.NomCondecoracion.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
PVD.Persona.NomCondecoracion.ViewGrid = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        var ref=this;
        this.condecoraciones = new PVD.Persona.NomCondecoracion.Condecoraciones({
            region: 'east',
            margins: '5 5 5 0',
            split: true,
            border: true,
            width: '50%'
        });

        this.tpCondecoraciones = new PVD.Persona.NomTipoCondecoracion.TipoCondecoraciones({
            region: 'center',
            margins: '5 0 5 5',
            border: true
        });


        this.condecoraciones.on('settear',function(){
            ref.condecoraciones.cmbTipoCondecoracion.setValue(ref.tpCondecoraciones.getSelectionModel().getSelected().data.idtipocondecoracion);

        });

        this.condecoraciones.cmbTipoCondecoracion.bindStore(this.tpCondecoraciones.getStore(), true);

        this.items = [this.condecoraciones, this.tpCondecoraciones];

        this.tpCondecoraciones.getSelectionModel().on('selectionchange', function (sm) {
            if (sm.getCount() == 1) {
                this.condecoraciones.getStore().baseParams.idtipocondecoracion = sm.getSelected().get('idtipocondecoracion');
                this.condecoraciones.getStore().reload();
            } else {
                this.condecoraciones.getStore().baseParams.idtipocondecoracion = '';
                this.condecoraciones.getStore().reload();
            }
        }, this);

        ref.condecoraciones.cmbTipoCondecoracion.on('keypress', function (text,obj) {
            this.tpCondecoraciones.getStore().baseParams.query = text.getRawValue();
            this.tpCondecoraciones.getStore().reload();

        }, this);


        PVD.Persona.NomCondecoracion.ViewGrid.superclass.initComponent.call(this);
    },
    listeners: {
        resize: function () {
            this.condecoraciones.setWidth('50%');
        }
    },
    enfocar: function () {

    }
});





