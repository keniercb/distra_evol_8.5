/**
 * Nomenclador de la persona TypeContactMedium
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */
Ext.ns('PVD.Persona.NomTipoMedioContacto');
PVD.Persona.NomTipoMedioContacto.Lang = {
    titleGrid: 'Listado de medios de contacto',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar medio de contacto',
    titleWindMod: 'Modificar medio de contacto',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tfExpregular: 'Expresión regular',
    tfDenomination: 'Denominación',
    tfabr: 'Abreviatura',
    taDescription: 'Descripción',
    nflongitudMin: 'Longitud mínima',
    nflongitudMax: 'Longitud máxima',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tfExpregular: 'Expresión regular',
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    nflongitudMin: 'Longitud mínima',
    nflongitudMax: 'Longitud máxima',
    cmbExpregular: 'Tipo de expresión regular',
    tfExpregular:'Expresión regular',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar medio de contacto <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar medio de contacto <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar medio de contacto <b>(DEL)</b>',
    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar tipo(s) de conctacto <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El medio de contacto ha sido eliminado satisfactoriamente.',
    msgNotDel: 'El medio de contacto seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El medio de contacto ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El medio de contacto que quiere adicionar ya existe.',
    msgNotMod: 'El medio de contacto ya existe.',
    msgMod: 'El medio de contacto ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del medio de contacto',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el medio de contacto seleccionado(s)?',
    msgAskDelS: '¿Está seguro que quiere eliminar el medio de contacto seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los medios de contacto seleccionados?',
    msgDelS: 'El medio de contacto ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los medios de contacto han sido eliminados satisfactoriamente.'
};
/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoMedioContacto.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        var self = this;
        this.lang = PVD.Persona.NomTipoMedioContacto.Lang;
        this.referencia = 'nomtipomediocontacto';
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
        this.cmbExpregular = new Ext.form.ComboBox({
            id: 'cmbExpregular' + self.referencia,
            nextTab: 'nflongitudMin' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            store: this.getStoreCmb(configVTypes),
            fieldLabel: this.lang.cmbExpregular,
            displayField: 'denom',
            name: 'type',
            hiddenName: 'type',
            anchor: '100%',
            valueField: 'type',
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            forceSelection: true,
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
            maxValue: 100,
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
            {name: 'idtipomediocontacto'},
            {name: 'type'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'mincaracter'},
            {name: 'maxcaracter'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipomediocontacto/getTypeContactMedium',
            add: '/pvd/persona/index.php/nomtipomediocontacto/addTypeContactMedium',
            mod: '/pvd/persona/index.php/nomtipomediocontacto/modTypeContactMedium',
            del: '/pvd/persona/index.php/nomtipomediocontacto/delTypeContactMedium',
            expt: '/pvd/persona/index.php/nomtipomediocontacto/showReport'
        };
        PVD.Persona.NomTipoMedioContacto.ViewGrid.superclass.initComponent.call(this);

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
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoMedioContacto.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipomediocontacto/getTypeContactMedium',
    mapping: [
        {name: 'idtipomediocontacto'},
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
        this.valueField = 'idtipomediocontacto';
        this.displayField = 'denominacion';
        this.hiddenName = 'idtipomediocontacto';
        PVD.Persona.NomTipoMedioContacto.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipomediocontacto', PVD.Persona.NomTipoMedioContacto.ViewCombo);
