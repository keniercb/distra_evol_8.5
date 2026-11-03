Ext.ns('Pvd.Maestro.EstructuraControl');
//Vista del componente.
Pvd.Maestro.EstructuraControl.Vista = {

    init: function (idioma, modelo) {

        this.event = null;

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: idioma.btnAyuda,
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: idioma.lbBtninsertar,
            tooltip: idioma.ttBtnAdicionar,
            iconCls: 'adicionar'
        });

        //Botón para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: idioma.lbBtnmodificar,
            disabled: true,
            tooltip: idioma.ttBtnModificar,
            iconCls: 'modificar'
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            disabled: true,
            text: idioma.lbBtnEliminar,
            tooltip: idioma.ttBtnEliminar,
            iconCls: 'eliminar'
        });

        //Botón para diseñar.
        this.btnDisennar = new Ext.Button({
            id: 'btnDisenar',
            disabled: true,
            text: idioma.lbBtndisennar,
            tooltip: idioma.ttBtnDisennar,
            iconCls:'nuevo'
        });

        function mostrarTooltip(val, metaData, record, rowIndex, colIndex, store) {
            metaData.attr = 'ext:qtip="Doble click para diseñar la estructura de control."';
            return val;
        }

        //Listado de estructuras de control.
        this.gpEstControl = new Ext.grid.GridPanel({
            title: idioma.lbListadoEst,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Estructuras de control" : "Estructura de control"]})'
            }),
            store: modelo.stEstControl,
            loadMask:{msg: 'Cargando...'},
            border: false,
            columns: [{
                    header: '',
                    width: 100,
                    hidden: true,
                    dataIndex: 'entidad',
                    sortable : false
                },
                {
                    header: 'Denominación',
                    width:300,
                    dataIndex: 'denominacion',
                    renderer: mostrarTooltip
                },{
                    header: 'Estructura',
                    width:350,
                    dataIndex: 'estructura',
                    renderer: mostrarTooltip
                },{
                    header: 'Dominios',
                    width:600,
                    dataIndex: 'dominio',
                    renderer: mostrarTooltip
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stEstControl,
                displayInfo: true
            })
        });

        //Ventana para adicionar estructura

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id:'tfdenominacion',
            fieldLabel: 'Denominación',
            allowBlank : false,
            minLength: 3,
            maxLength: 255,
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            anchor:	'99%',
            name : 'denominacion'
        });

        this.cbDominios = new Ext.ux.form.LovCombo({
            store: modelo.stDominios,
            displayField: 'denominacion',
            fieldLabel: 'Dominios',
            disabled: true,
            mode: 'local',
            allowBlank : false,
            anchor: '99%',
            hiddenName: 'iddominio',
            typeAhead: true,
            enableQtip: true,
            triggerAction: 'all',
            editable: false,
            emptyText:'Seleccione...',
            listeners: {
                render: function(combo) {
                    this.triggers[1].remove();
                },
                beforeselect: function(combo, record, index) {
                    this.valueField = 'iddominio';
                },
                blur: function() {
                    this.valueField = 'iddominio';
                    this.isValid();
                    if (this.getRawValue() != '') {
                        this.clearInvalid();
                    }
                }
            }
        });

        this.tcbEntidad = new Ext.components.TreeComboBox({
            anchor:	'99%',
            allowBlank: false,
            emptyText: 'Seleccione...',
            fieldLabel: 'Estructura',
            id: 'tcbEntidad',
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlentidades,
                border: false,
                autoScroll: true
            }
        });

        this.cbEstructuras = new Ext.form.ComboBox({
            msgTarget: 'qtip',
            enableQtip: true,
            fieldLabel: 'Plantillas de estructuras de control',
            emptyText: 'Seleccione...',
            store: modelo.stEstControlPlantillas,
            displayField: 'denominacion',
            valueField: 'idestructuracontrol',
            name: 'valor',
            mode: 'local',
            triggerAction: 'all',
            typeAhead: true,
            forceSelection: true,
            anchor: '99%',
            allowBlank: true
        });

        this.fsEstructuras = new Ext.form.FieldSet({
            title: 'Utilizar plantilla de estructura de control existente',
            name: 'reutilizar',
            id: 'reutilizar',
            checkboxToggle: true,
            collapsed: true,
            layout: 'column',
            autoHeight: true,
            width: '93%',
            items: [
                {
                    columnWidth: 1.0,
                    layout: 'form',
                    items: this.cbEstructuras
                }
            ]
        });

        //Formulario de gestión.
        this.formularioGestion = new Ext.FormPanel({
            id: 'formulariogestion',
            labelAlign: 'top',
            frame:true,
            height: 340,
            bodyStyle:'padding:0px 0px 0px 5px',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tcbEntidad]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbDominios]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.fsEstructuras]
                    }
                ]
            }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.lbBtnCanc,
            text: idioma.lbBtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.lbBtnAcep,
            text: idioma.lbBtnAceptar
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: idioma.lbBtnAplic,
            text: idioma.lbBtnAplicar
        });

        //Ventana de gestión.
        this.ventanaGestion = new Ext.Window({
            id: 'ventanaGestion',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            width: 360,
            height: 260,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        this.vp = new Ext.Viewport({
            layout: 'fit',
            items: [{
                region: 'center',
                layout: 'fit',
                border: false,
                tbar:  [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnDisennar, '->', this.btnAyuda],
                items: [this.gpEstControl]
            }]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('estructcontrol', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Maestro.EstructuraControl.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Maestro.EstructuraControl.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Maestro.EstructuraControl.Controlador.init(idioma, vista, modelo);

});
