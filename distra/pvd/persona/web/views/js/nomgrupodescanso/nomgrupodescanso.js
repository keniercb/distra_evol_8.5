/**
 * @Created por XETID-RRHH.
 * @Author: Ing. Miguel Antonio Cabreja Aldana
 * @Date: 14/10/2014
 * @Time: 15:49
 * @Version:1.0
 */
Ext.ns('PVD.Persona.NomGrupoDescanso');

PVD.Persona.NomGrupoDescanso.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de grupo descanso',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tpGrupoDescanso: 'Grupo descanso',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar grupo descanso',
    titleWindMod: 'Modificar grupo descanso',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar grupo descanso <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar grupo descanso <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar grupo descanso <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt + L)</b>',
    ttBuscar:'Buscar grupo(s) de descanso <b>(Alt + B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) grupo descanso(s) se ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'La(s) grupo descanso(s) seleccionado(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'La(s) grupo descanso(s) ha(n) sido adicionado satisfactoriamente.',
    msgNotAdd: 'El grupo descanso que quiere adicionar ya existe.',
    msgNotMod: 'El grupo descanso ya existe.',
    msgMod: 'El grupo descanso ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de grupo descanso',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) grupo(s) descanso seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el grupo descanso seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los grupos descanso seleccionados?',
    msgDelS: 'La grupo descanso se ha sido eliminado  satisfactoriamente.',
    msgDelP: 'Los grupos de descanso se han sido eliminados  satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomGrupoDescanso.NomTipoRegimen = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomGrupoDescanso.Lang;

        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.id,
            nextTab: 'tpGrupoDescanso' + self.id,
            prevTab: 'btnAcept' + self.id,
            fieldLabel: this.lang.tfDenomination,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%'
        });

        this.taDescription = new Ext.form.TextArea({
            id: 'taDescription' + self.id,
            nextTab: 'btnCancel' + self.id,
            prevTab: 'fhasta' + self.id,
            fieldLabel: this.lang.taDescription,
            name: 'descripcion',
            anchor: '100%',
            height: 90
        });

        this.dfFrom = new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.id,
            nextTab: 'fhasta' + self.id,
            prevTab: 'tpGrupoDescanso' + self.id,
            fieldLabel: this.lang.dfFrom,
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta' + self.id
        });

        this.dfUp = new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.id,
            nextTab: 'taDescription' + self.id,
            prevTab: 'fdesde' + self.id,
            fieldLabel: this.lang.dfUp,
            anchor: '100%',
            format: 'd/m/Y',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.id
        });

        this.cmbRegimen = new PVD.Persona.NomTipoRegimen.ViewCombo({
            xtype: 'combo_tiporegimen',
            id: 'tpGrupoDescanso' + self.id,
            nextTab: 'fdesde' + self.id,
            prevTab: 'tfDenomination' + self.id,
            fieldLabel: this.lang.tpGrupoDescanso,
            anchor: '100%',
            allowBlank: false
        });

        this.newConf = {
            //width: '70%',
            itemsForm: [
                this.tfDenomination, this.cmbRegimen,
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
            {name: 'idgrupodescanso'},
            {name: 'idregimentrabajo'},
            {name: 'denominacion'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomgrupodescanso/getGrupoDescanso',
            add: '/pvd/persona/index.php/nomgrupodescanso/addGrupoDescanso',
            mod: '/pvd/persona/index.php/nomgrupodescanso/modGrupoDescanso',
            del: '/pvd/persona/index.php/nomgrupodescanso/delGrupoDescanso',
            expt: '/pvd/persona/index.php/nomgrupodescanso/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomGrupoDescanso.NomTipoRegimen.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomGrupoDescanso.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomgrupodescanso/getGrupoDescanso',
    mapping: [
        {name: 'idgrupodescanso'},
        {name: 'idregimentrabajo'},
        {name: 'denominacion'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idgrupodescanso';
        this.hiddenName = 'idgrupodescanso';
        this.name = 'idgrupodescanso';
        this.displayField = 'denominacion';
        PVD.Persona.NomGrupoDescanso.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_grupodescanso', PVD.Persona.NomGrupoDescanso.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
PVD.Persona.NomGrupoDescanso.ViewGrid = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        this.regimen = new PVD.Persona.NomGrupoDescanso.NomTipoRegimen({
            region: 'east',
            margins: '5 5 5 0',
            split: true,
            border: true,
            width: '50%'
        });

        this.tpGrupoDescanso = new PVD.Persona.NomTipoRegimen.ViewGrid({
            region: 'center',
            margins: '5 0 5 5',
            border: true
        });

        this.items = [this.regimen, this.tpGrupoDescanso];

        this.tpGrupoDescanso.getStore().on('load', function () {
            this.regimen.cmbRegimen.bindStore(this.tpGrupoDescanso.getStore(), true);
        }, this);

        this.tpGrupoDescanso.getSelectionModel().on('selectionchange', function (sm) {
            if (sm.getCount() == 1) {
                this.regimen.getStore().baseParams.idregimentrabajo = sm.getSelected().get('idregimentrabajo');
                this.regimen.getStore().reload();
            } else {
                this.regimen.getStore().baseParams.idregimentrabajo = '';
                this.regimen.getStore().reload();
            }
        }, this);

        PVD.Persona.NomGrupoDescanso.ViewGrid.superclass.initComponent.call(this);
    },
    listeners: {
        resize: function () {
            this.regimen.setWidth('50%');
        }
    },
    enfocar: function () {

    }
});