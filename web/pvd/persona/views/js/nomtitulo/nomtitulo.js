/**
 * Nomenclador de la persona titulo
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTitulo');
PVD.Persona.NomTitulo.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de t&iacute;tulos',
    /**
     * Título del comboBox
     */
    cbxTitulo: 'T&iacute;tulo',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    tfAbr: 'Abreviatura',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    nfCodigo: 'C&oacute;digo',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar t&iacute;tulo',
    titleWindMod: 'Modificar t&iacute;tulo',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar t&iacute;tulo <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar t&iacute;tulo <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar t&iacute;tulo <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt + L)</b>',
    ttBuscar:'Buscar título(s) <b>(Alt + B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) título(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El t&iacute;tulo seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El t&iacute;tulo ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El t&iacute;tulo que quiere adicionar ya existe.',
    msgNotMod: 'El t&iacute;tulo ya existe.',
    msgMod: 'El t&iacute;tulo ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del título.',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) t&iacute;tulo(s) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el t&iacute;tulo seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los t&iacute;tulos seleccionados?',
    msgDelS: 'El título ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los títulos han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTitulo.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;

        this.lang = PVD.Persona.NomTitulo.Lang;
        this.referencia = 'nomtitulo';

        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.id,
            nextTab: 'tpCentroEstudio' + self.id,
            prevTab: 'btnAcept' + self.id,
            fieldLabel: this.lang.tfDenomination,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%'
        });

        this.tfAbbreviation = new Ext.form.TextField({
            id: 'tfAbbreviation' + self.id,
            fieldLabel: self.lang.tfAbr,
            name: 'abreviatura',
            anchor: '100%',
            maxLength:10
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
            prevTab: 'tpCentroEstudio' + self.id,
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

        this.nfCodigo = new Ext.form.NumberField({
            name: 'codigo',
            allowDecimals: false,
            allowNegative: false,
            maxLength: 10,
            id: 'codigo' + self.id,
            nextTab: 'taDescription' + self.id,
            prevTab: 'fdesde' + self.id,
            fieldLabel: this.lang.nfCodigo,
            anchor: '100%'
        });

        this.cbxNivelEduc = {
            xtype: 'combo_niveleducacional',
            id: 'tpCentroEstudio' + self.id,
            emptyText:'Seleccione...',
            nextTab: 'fdesde' + self.id,
            prevTab: 'tfDenomination' + self.id,
            anchor: '90%',
            allowBlank: true
        };

        this.idEspe = new Ext.form.Hidden({
            name: 'idespecialidad'
        });

        this.treeEspecialidades = {
            xtype: 'tree_combobox',
            fieldLabel: 'Especialidad',
            emptyText:'Seleccione...',
            name: 'especialidad',
            anchor: '100%',
            clickNode: function (node, e) {
                //if (node.isLeaf()) {
                this.setRawValue(node.text);
                self.idEspe.setValue(node.id);
                this.collapse();
                //}
            },
            treeConfig: {
                loader: {
                    dataUrl: '/pvd/persona/index.php/nomtitulo/getEspecialidadesArbol',
                    uiProviders: {
                        'columna': Ext.tree.TreeNodeUI
                    }
                },
                border: false,
                autoScroll: true,
                rootVisible: true,
                root: {
                    text: 'Especialidades',
                    id: 'root',
                    animate: false,
                    draggable: false,
                    expanded: true
                }
            }
        }

        this.newConf = {
            itemsForm: [
                this.tfDenomination, this.tfAbbreviation, this.treeEspecialidades, this.idEspe,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .6,
                            layout: 'form',
                            items: [this.cbxNivelEduc]
                        },
                        {
                            columnWidth: .4,
                            layout: 'form',
                            items: [this.nfCodigo]
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
            {name: 'idtitulo'},
            {name: 'idniveleducacional'},
            {name: 'idespecialidad'},
            {name: 'especialidad'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'codigo'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomtitulo/getTitle',
            add: '/pvd/persona/index.php/nomtitulo/addTitle',
            mod: '/pvd/persona/index.php/nomtitulo/modTitle',
            del: '/pvd/persona/index.php/nomtitulo/delTitle',
            expt: '/pvd/persona/index.php/nomtitulo/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomTitulo.ViewGrid.superclass.initComponent.call(this);
    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTitulo.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    fieldLabel: PVD.Persona.NomTitulo.Lang.cbxTitulo,
    url: '/pvd/persona/index.php/nomtitulo/getTitle',
    mapping: [
        {name: 'idtitulo'},
        {name: 'idniveleducacional'},
        {name: 'idespecialidad'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtitulo';
        this.hiddenName = 'idtitulo';
        this.name = 'idtitulo';
        this.displayField = 'denominacion';
        PVD.Persona.NomTitulo.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_titulo', PVD.Persona.NomTitulo.ViewCombo);