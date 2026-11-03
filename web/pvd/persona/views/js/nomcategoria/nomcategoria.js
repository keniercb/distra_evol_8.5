/**
 * Nomenclador de la persona categor&iacute;a
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCategoria');

PVD.Persona.NomCategoria.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de categor&iacute;as',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tfAbr: 'Abreviatura',
    tpCategoria: 'Tipo de categor&iacute;a',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar categor&iacute;a',
    titleWindMod: 'Modificar categor&iacute;a',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar categor&iacute;a <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar categor&iacute;a <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar categor&iacute;a <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar categoría(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) categor&iacute;a(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La(s) categor&iacute;a(s) seleccionada(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'La categor&iacute;a ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La categoría que quiere adicionar ya existe.',
    msgNotMod: 'La categoría ya existe.',
    msgMod: 'La categor&iacute;a ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la categor&iacute;a',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) categor&iacute;a(s) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la categor&iacute;a seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las categor&iacute;as seleccionadas?',
    msgDelS: 'La categor&iacute;a ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las categor&iacute;as han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCategoria.NomCategoria = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomCategoria.Lang;

        this.referencia = 'nomcategoria';
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'tpCategoria' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
//            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
//            regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
            fieldLabel: this.lang.tfDenomination,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%',
            maxLength: 100,
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
            id: 'tfAbbreviation' + self.referencia,
            nextTab: 'tpOrganizacion' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: self.lang.tfAbr,
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
            prevTab: 'tpCategoria' + self.referencia,
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

        this.cmbTipoCategoria = new PVD.Persona.NomTipoCategoria.ViewCombo({
            xtype: 'combo_tipocategoria',
            id: 'tpCategoria' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            emptyText: 'Seleccione...',
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: this.lang.tpCategoria,
            enableKeyEvents:true,
            anchor: '100%',
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
                this.tfDenomination, this.tfAbbreviation, this.cmbTipoCategoria,
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
            {name: 'idcategoria'},
            {name: 'idtipocategoria'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomcategoria/getCategoria',
            add: '/pvd/persona/index.php/nomcategoria/addCategoria',
            mod: '/pvd/persona/index.php/nomcategoria/modCategoria',
            del: '/pvd/persona/index.php/nomcategoria/delCategoria',
            expt: '/pvd/persona/index.php/nomcategoria/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomCategoria.NomCategoria.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCategoria.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcategoria/getCategoria',
    mapping: [
        {name: 'idcategoria'},
        {name: 'idtipocategoria'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcategoria';
        this.hiddenName = 'idcategoria';
        this.name = 'idcategoria';
        this.displayField = 'denominacion';
        PVD.Persona.NomCategoria.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_categoria', PVD.Persona.NomCategoria.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
PVD.Persona.NomCategoria.ViewGrid = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        var ref=this;
        this.referencia = 'nomcategoria';
        this.categoria = new PVD.Persona.NomCategoria.NomCategoria({
            region: 'east',
            margins: '5 5 5 0',
            split: true,
            border: true,
            width: '50%'
        });

        this.tpCategoria = new PVD.Persona.NomTipoCategoria.ViewGrid({
            region: 'center',
            margins: '5 0 5 5',
            border: true
        });

        this.categoria.on('settear',function(){
            ref.categoria.cmbTipoCategoria.setValue(ref.tpCategoria.getSelectionModel().getSelected().data.idtipocategoria);

        });
        this.items = [this.categoria, this.tpCategoria];

        this.tpCategoria.getStore().on('load', function () {
            this.categoria.cmbTipoCategoria.bindStore(this.tpCategoria.getStore(), true);
        }, this);

        this.tpCategoria.getSelectionModel().on('selectionchange', function (sm) {
            if (sm.getCount() == 1) {
                this.categoria.getStore().baseParams.idtipocategoria = sm.getSelected().get('idtipocategoria');
                this.categoria.getStore().reload();
            } else {
                this.categoria.getStore().baseParams.idtipocategoria = '';
                this.categoria.getStore().reload();
            }

        }, this);

        ref.categoria.cmbTipoCategoria.on('keypress', function (text,obj) {
            this.tpCategoria.getStore().baseParams.query = text.getRawValue();
            this.tpCategoria.getStore().reload();

        }, this);


        PVD.Persona.NomCategoria.ViewGrid.superclass.initComponent.call(this);
    },
    listeners: {
        resize: function () {
            this.categoria.setWidth('50%');
        }
    },
    enfocar: function () {

    }
});