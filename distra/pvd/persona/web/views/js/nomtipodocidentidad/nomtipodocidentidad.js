/**
 * Nomenclador de la persona tipo de documento de identificacion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoDocIdentidad');
PVD.Persona.NomTipoDocIdentidad.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de documento de identificación',
    titleWindMod: 'Modificar tipo de documento de identificación',
    titleGrid: 'Listado de tipos de documentos de identificación',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de documento de identificación <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de documento de identificación <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de documento de identificación <b>(DEL)</b>',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tfExpregular: 'Expresión regular',
    cmbExpregular: 'Tipo de expresión regular',
    tfDenomination: 'Denominación',
    tfabr: 'Abreviatura',
    taDescription: 'Descripción',
    nflongitudMin: 'Longitud mínima',
    nflongitudMax: 'Longitud máxima',
    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar tipo(s) de documento(s) de identificación <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de documento(s) de identificación ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El tipo de documento de identificación seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de documento de identificación ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de documento de identificación que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de documento de identificación ya existe.',
    msgMod: 'El tipo de documento de identificación ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de documento de identificación',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de documento(s) de identificación seleccionado(s)?',
    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de documento de identificación seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de documentos de identificación seleccionados?',
    msgDelS: 'El tipo de documento de identificación ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de documentos de identificación han sido eliminados satisfactoriamente.'
};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoDocIdentidad.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoDocIdentidad.Lang;
        this.referencia = 'nomtipodocidentidad';
        this.title = this.lang.titleGrid;

        this.recVTypes = Ext.data.Record.create([
            {name: 'type'},
            {name: 'denom'}
        ]);
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'cmbExpregular' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            fieldLabel: this.lang.tfDenomination,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
//            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
//            regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
            maxLength: 100,
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
            prevTab: 'nflongitudMax' + self.referencia,
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
        this.cmbExpregular = new Ext.form.ComboBox({
            id: 'cmbExpregular' + self.referencia,
            nextTab: 'nflongitudMin' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            store: self.getStoreCmb(configVTypes),
            fieldLabel: this.lang.cmbExpregular,
            displayField: 'denom',
            name: 'type',
            hiddenName: 'type',
            allowBlank: false,
            anchor: '100%',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            valueField: 'type',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
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
        this.nflongitudMin = new Ext.form.NumberField({
            name: 'mincaracter',
            allowDecimals: false,
            allowNegative: false,
            minValue: 1,
            value: 1,
            maskRe: /[\d\-]/,
            allowBlank: false,
            // regex: /^\d{3}-\d{3}-\d{4}$/,
            id: 'nflongitudMin' + self.referencia,
            nextTab: 'nflongitudMax' + self.referencia,
            prevTab: 'cmbExpregular' + self.referencia,
            fieldLabel: this.lang.nflongitudMin,
            anchor: '98%',
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
        this.nflongitudMax = new Ext.form.NumberField({
            name: 'maxcaracter',
            allowDecimals: false,
            allowNegative: false,
            hideTrigger: false,
            maxValue: 20,
            maskRe: /[\d\-]/,
            allowBlank: false,
            //  regex: /^\d{3}-\d{3}-\d{4}$/,
            id: 'nflongitudMax' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'nflongitudMin' + self.referencia,
            fieldLabel: this.lang.nflongitudMax,
            anchor: '100%',
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
        this.newConf = {
            itemsForm: [
                this.tfDenomination, this.tfAbbreviation,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .99,
                            layout: 'form',
                            items: [this.cmbExpregular]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.nflongitudMin]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.nflongitudMax]
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
            {name: 'idtipodocidentidad'},
            {name: 'type'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'mincaracter'},
            {name: 'maxcaracter'},
            {name: 'descripcion'}
        ];
        this.title = this.lang.gpTitle;
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipodocidentidad/getTipoDocIdentidad',
            add: '/pvd/persona/index.php/nomtipodocidentidad/addDoctypeidentity',
            mod: '/pvd/persona/index.php/nomtipodocidentidad/modDoctypeidentity',
            del: '/pvd/persona/index.php/nomtipodocidentidad/delDoctypeidentity',
            expt: '/pvd/persona/index.php/nomtipodocidentidad/showReport'
        };
        PVD.Persona.NomTipoDocIdentidad.ViewGrid.superclass.initComponent.call(this);
    },
    getStoreCmb: function (VTypes) {
        var me = this;
        var myData = new Array();
        var store = new Ext.data.SimpleStore({
            fields: [
                {name: 'type'},
                {name: 'denom'}
            ]
        });
        for (var i = 0; i < configVTypes.length; i++) {
            myData = new me.recVTypes({
                type: configVTypes[i].type,
                denom: configVTypes[i].denom
            })
            store.add(myData);
        }
        store.commitChanges();
        return store;
    }
});
/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 *
 */
PVD.Persona.NomTipoDocIdentidad.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipodocidentidad/getTipoDocIdentidad',
    mapping: [
        {name: 'idtipodocidentidad'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'},
        {name: 'type'},
        {name: 'maxcaracter'},
        {name: 'mincaracter'},
    ],
    initComponent: function () {
        this.valueField = 'idtipodocidentidad';
        this.displayField = 'denominacion';
        PVD.Persona.NomTipoDocIdentidad.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipdocidentidad', PVD.Persona.NomTipoDocIdentidad.ViewCombo);
