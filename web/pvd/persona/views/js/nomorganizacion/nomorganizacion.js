/**
 * Nomenclador de la persona motivo tipo organizacion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoOrganizacion');

PVD.Persona.NomTipoOrganizacion.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de tipos de organizaci&oacute;n',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de organizaci&oacute;n',
    titleWindMod: 'Modificar tipo de organizaci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de organizaci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de organizaci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de organizaci&oacute;n <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar tipo(s) de organización <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de organización ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El tipo de organizaci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de organizaci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de organizaci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de organizaci&oacute;n ya existe.',
    msgMod: 'El tipo de organizaci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminando datos del tipo de organización',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de organizaci&oacute;n seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de organizaci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de organizaci&oacute;n seleccionados?',
    msgDelS: 'El tipo de organización ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de organización han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoOrganizacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoOrganizacion.Lang;
        this.referencia = 'nomtipoorganizacion';
        this.mapping = [
            {name: 'idtipoorganizacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomtipoorganizacion/getTypeOfOrganization',
            add: '/pvd/persona/index.php/nomtipoorganizacion/addTypeOfOrganization',
            mod: '/pvd/persona/index.php/nomtipoorganizacion/modTypeOfOrganization',
            del: '/pvd/persona/index.php/nomtipoorganizacion/delTypeOfOrganization',
            expt: '/pvd/persona/index.php/nomtipoorganizacion/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomTipoOrganizacion.ViewGrid.superclass.initComponent.call(this);
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
PVD.Persona.NomTipoOrganizacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipoorganizacion/getTypeOfOrganization',
    mapping: [
        {name: 'idtipoorganizacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipoorganizacion';
        this.displayField = 'denominacion';
        this.name = 'idtipoorganizacion';
        this.hiddenName = 'idtipoorganizacion';
        PVD.Persona.NomTipoOrganizacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipoorganizacion', PVD.Persona.NomTipoOrganizacion.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
/**
 * Nomenclador de la persona motivo organizacion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomOrganizacion');

PVD.Persona.NomOrganizacion.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de organizaciones',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    tfAbr: 'Abreviatura',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tpOrganizacion: 'Tipo de organizaci&oacute;n',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar organizaci&oacute;n',
    titleWindMod: 'Modificar organizaci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar organizaci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar organizaci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar organizaci&oacute;n <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) organización(es) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La organizaci&oacute;n seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La organizaci&oacute;n ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La organizaci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'La organizaci&oacute;n ya existe.',
    msgMod: 'La organizaci&oacute;n ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de organizaciones',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) organizaci&oacute;n(es) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la organizaci&oacute;n seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las organizaciones seleccionadas?',
    msgDelS: 'La organización ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las organizaciones han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomOrganizacion.NomOrganizacion = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomOrganizacion.Lang;
        this.referencia = 'nomorganizacion';
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'tpOrganizacion' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            fieldLabel: this.lang.tfDenomination,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
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
            id: 'tfAbbreviation' + self.referencia,
            nextTab: 'tpOrganizacion' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: self.lang.tfAbr,
            name: 'abreviatura',
            anchor: '100%',
            maxLength: 10
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
            prevTab: 'tpOrganizacion' + self.referencia,
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

        this.cmbTipoOrganizacion = new PVD.Persona.NomTipoOrganizacion.ViewCombo({
            id: 'tpOrganizacion' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            emptyText: 'Seleccione...',
            fieldLabel: this.lang.tpOrganizacion,
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
                this.tfDenomination, this.tfAbbreviation, this.cmbTipoOrganizacion,
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
            {name: 'idorganizacion'},
            {name: 'idtipoorganizacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomorganizacion/getOrganization',
            add: '/pvd/persona/index.php/nomorganizacion/addOrganization',
            mod: '/pvd/persona/index.php/nomorganizacion/modOrganization',
            del: '/pvd/persona/index.php/nomorganizacion/delOrganization',
            expt: '/pvd/persona/index.php/nomorganizacion/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomOrganizacion.NomOrganizacion.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomOrganizacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomorganizacion/getOrganization',
    mapping: [
        {name: 'idorganizacion'},
        {name: 'idtipoorganizacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idorganizacion';
        this.displayField = 'denominacion';
        PVD.Persona.NomOrganizacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_organizacion', PVD.Persona.NomOrganizacion.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
PVD.Persona.NomOrganizacion.ViewGrid = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        this.referencia = 'nomorganizacion';
        var ref=this;
        this.organizaciones = new PVD.Persona.NomOrganizacion.NomOrganizacion({
            region: 'east',
            margins: '5 5 5 0',
            split: true,
            border: true,
            width: '50%'
        });

        this.tpOrganizaciones = new PVD.Persona.NomTipoOrganizacion.ViewGrid({
            region: 'center',
            margins: '5 0 5 5',
            border: true
        });

        this.organizaciones.on('settear',function(){
            ref.organizaciones.cmbTipoOrganizacion.setValue(ref.tpOrganizaciones.getSelectionModel().getSelected().data.idtipoorganizacion);

        });

        this.organizaciones.cmbTipoOrganizacion.bindStore(this.tpOrganizaciones.getStore(), true);

        this.items = [this.organizaciones, this.tpOrganizaciones];

        this.tpOrganizaciones.getSelectionModel().on('selectionchange', function (sm) {
            if (sm.getCount() == 1) {
                this.organizaciones.getStore().baseParams.idtipoorganizacion = sm.getSelected().get('idtipoorganizacion');
                this.organizaciones.getStore().reload();
            } else {
                this.organizaciones.getStore().baseParams.idtipoorganizacion = '';
                this.organizaciones.getStore().reload();
            }
        }, this);
        ref.organizaciones.cmbTipoOrganizacion.on('keypress', function (text,obj) {
            this.tpOrganizaciones.getStore().baseParams.query = text.getRawValue();
            this.tpOrganizaciones.getStore().reload();

        }, this);


        PVD.Persona.NomOrganizacion.ViewGrid.superclass.initComponent.call(this);
    },
    listeners: {
        resize: function () {
            this.organizaciones.setWidth('50%');
        }
    },
    enfocar: function () {

    }
});





