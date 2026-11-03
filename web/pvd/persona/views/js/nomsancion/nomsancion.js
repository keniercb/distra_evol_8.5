/**
 * Nomenclador de la persona Tipo de condecoración
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoSancion');
PVD.Persona.NomTipoSancion.Lang = {
    titleGrid: 'Listado de tipos de sanciones',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de sanci&oacute;n',
    titleWindMod: 'Modificar tipo de sanci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de sanci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de sanci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de sanci&oacute;n <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar tipo(s) de sanción <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de sanci&oacute;n(es) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El tipo de sanci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de sanci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de sanci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de sanci&oacute;n ya existe.',
    msgMod: 'El tipo de sanci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de tipo de sanci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de sanci&oacute;n(es) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de sanci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de sanciones seleccionados?',
    msgDelS: 'El tipo de sanci&oacute;n ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de sanci&oacute;nes han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoSancion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoSancion.Lang;
        this.referencia = 'nomtiposancion';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idtiposancion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtiposancion/getTypeOfSanction',
            add: '/pvd/persona/index.php/nomtiposancion/addTypeOfSanction',
            mod: '/pvd/persona/index.php/nomtiposancion/modTypeOfSanction',
            del: '/pvd/persona/index.php/nomtiposancion/delTypeOfSanction',
            expt: '/pvd/persona/index.php/nomtiposancion/showReport'
        };
        PVD.Persona.NomTipoSancion.ViewGrid.superclass.initComponent.call(this);
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
PVD.Persona.NomTipoSancion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtiposancion/getTypeOfSanction',
    mapping: [
        {name: 'idtiposancion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtiposancion';
        this.displayField = 'denominacion';
        this.name = 'idtiposancion';
        this.hiddenName = 'idtiposancion';
        PVD.Persona.NomTipoSancion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tiposancion', PVD.Persona.NomTipoSancion.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
/**
 * Nomenclador de la persona sancion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomSancion');
PVD.Persona.NomSancion.Lang = {
    titleGrid: 'Listado de sanciones',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar sanci&oacute;n',
    titleWindMod: 'Modificar sanci&oacute;n',
    /**
     * Labels del Formulario
     */
    tfDenomination: 'Denominación',
    tfabr: 'Abreviatura',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    nfRehabli: 'Tiempo de rehabilitaci&oacute;n',
    unTime: 'Unidad de tiempo',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar sanci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar sanci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar sanci&oacute;n <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar sanción(es) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) sanci&oacute;n(es) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La sanci&oacute;n seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La sanci&oacute;n ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La sanci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'La sanci&oacute;n ya existe.',
    msgMod: 'La sanci&oacute;n ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de sanci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) sanci&oacute;n(es) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la sanci&oacute;n seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las sanciones seleccionadas?',
    msgDelS: 'La sanción ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las sanciones han sido eliminadas satisfactoriamente.'

};
/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomSancion.Sanciones = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomSancion.Lang;
        this.title = this.lang.titleGrid;
        this.referencia = 'nomsancion';
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'tpSancion' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            fieldLabel: this.lang.tfDenomination,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
//            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
//            regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
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
            prevTab: 'cbUnidadTiempo' + self.referencia,
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

        this.cmbTipoSancion = new PVD.Persona.NomTipoSancion.ViewCombo({
            id: 'tpSancion' + self.referencia,
            nextTab: 'nfTiempoRehab' + self.referencia,
            emptyText: 'Seleccione...',
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: 'Tipo de sanci&oacute;n',
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

        this.nfTiempoRehab = new Ext.form.NumberField({
            id: 'nfTiempoRehab' + self.referencia,
            nextTab: 'cbUnidadTiempo' + self.referencia,
            prevTab: 'tpSancion' + self.referencia,
            fieldLabel: this.lang.nfRehabli,
            name: 'tiemporehabilitacion',
            allowDecimals: false,
            allowNegative: false,
            maxLength: 10,
            anchor: '90%',
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

        this.cbUnidadTiempo = new Ext.form.ComboBox({
            id: 'cbUnidadTiempo' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'nfTiempoRehab' + self.referencia,
            store: new Ext.data.SimpleStore({
                fields: [
                    {name: "unidadtiempo"},
                    {name: "denom"}
                ],
                data: [
                    ["0", "Días"],
                    ["1", "Meses"],
                    ["1", "Años"]
                ]
            }),
            valueField: 'unidadtiempo',
            displayField: 'denom',
            hiddenName: 'unidadtiempo',
            emptyText: 'Seleccione...',
            triggerAction: 'all',
            mode: 'local',
            fieldLabel: this.lang.unTime,
            anchor: '100%',
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
                this.tfDenomination, this.tfAbbreviation, this.cmbTipoSancion,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.nfTiempoRehab]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.cbUnidadTiempo]
                        },
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
            {name: 'idsancion'},
            {name: 'idtiposancion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'tiemporehabilitacion'},
            {name: 'unidadtiempo'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomsancion/getSanction',
            add: '/pvd/persona/index.php/nomsancion/addSanction',
            mod: '/pvd/persona/index.php/nomsancion/modSanction',
            del: '/pvd/persona/index.php/nomsancion/delSanction',
            expt: '/pvd/persona/index.php/nomsancion/showReport'
        };
        this.title = 'Listado de sanciones';
        PVD.Persona.NomSancion.Sanciones.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomSancion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomsancion/getSanction',
    mapping: [
        {name: 'idsancion'},
        {name: 'idtiposancion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'},
        {name: 'tiemporehabilitacion'},
        {name: 'unidadtiempo'}
    ],
    initComponent: function () {
        this.valueField = 'idsancion';
        this.displayField = 'denominacion';
        PVD.Persona.NomSancion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_sancion', PVD.Persona.NomSancion.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
PVD.Persona.NomSancion.ViewGrid = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        this.referencia = 'nomsancion';
        var ref=this;
        this.sanciones = new PVD.Persona.NomSancion.Sanciones({
            region: 'east',
            margins: '5 5 5 0',
            split: true,
            border: true,
            width: '50%'
        });

        this.tpSanciones = new PVD.Persona.NomTipoSancion.ViewGrid({
            region: 'center',
            margins: '5 0 5 5',
            border: true
        });

        this.sanciones.on('settear',function(){
            ref.sanciones.cmbTipoSancion.setValue(ref.tpSanciones.getSelectionModel().getSelected().data.idtiposancion);

        });

        this.sanciones.cmbTipoSancion.bindStore(this.tpSanciones.getStore(), true);

        this.items = [this.sanciones, this.tpSanciones];

        this.tpSanciones.getSelectionModel().on('selectionchange', function (sm) {
            if (sm.getCount() == 1) {
                this.sanciones.getStore().baseParams.idtiposancion = sm.getSelected().get('idtiposancion');
                this.sanciones.getStore().reload();
            } else {
                this.sanciones.getStore().baseParams.idtiposancion = '';
                this.sanciones.getStore().reload();
            }
        }, this);

        ref.sanciones.cmbTipoSancion.on('keypress', function (text,obj) {
            this.tpSanciones.getStore().baseParams.query = text.getRawValue();
            this.tpSanciones.getStore().reload();

        }, this);


        PVD.Persona.NomSancion.ViewGrid.superclass.initComponent.call(this);
    },
    listeners: {
        resize: function () {
            this.sanciones.setWidth('50%');
        }
    },
    enfocar: function () {

    }
});