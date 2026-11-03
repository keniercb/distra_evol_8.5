
/*
 * Componente CompNivelPreparacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.CompNivelPreparacion
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.MovimientosLaborales.CompNivelPreparacion");
Pvd.MovimientosLaborales.CompNivelPreparacion = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'confignivelprep',
    title: 'Nivel de preparación',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
        var idpreparacion;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaCompNivelPreparacion',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        //Botón para Guardar.
        this.btnGuardar = new Ext.Button({
            text: 'Guardar',
            disabled: true,
            tooltip: 'Guardar configuración <b>(Alt+G)</b>',
            iconCls: 'guardar',
            handler: function ()
            {
                guardarConfig();
            }.createDelegate(this)
        });

        //Fuente de datos del listado de niveles de preparacion del cargo
        this.stNivelesP = new Ext.data.Store({
            url: '/pvd/movimientoslaborales/index.php/confignivelesprep/getNivelesPreparacion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idpreparacion", totalProperty: "cantidad"},
                [{name:'idpreparacion'},{name:'denominacion'}]
            ),
            listeners: {
                load: function () {
                    if (self.stNivelesP.getCount() > 0) {
                        self.gpNivelesP.getSelectionModel().selectFirstRow();
                    }
                }
            }
        });

        this.stNivelesP.load();

        this.smNivelesP = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.hasSelection()) {
                        self.btnGuardar.enable();
                    } else {
                        self.btnGuardar.disable();
                    }
                }.createDelegate(this)
            }
        });

        //Listado de los niveles de preparacion del cargo.
        this.gpNivelesP = new Ext.grid.GridPanel({
            title: 'Listado de niveles de preparación del cargo',
            store: this.stNivelesP,
            loadMask: {msg: 'Cargando...'},
            width: '50%',
            region: 'center',
            sm: this.smNivelesP,
            columns: [ this.smNivelesP,
                {
                    header: this.idioma.lbDenominacion,
                    width:500,
                    dataIndex: 'denominacion'
                }
            ]
        });

        this.gpNivelesP.getSelectionModel().on('rowselect', function (n) {
            idpreparacion = n.getSelected().data.idpreparacion;
            this.stNivelesEdu.reload();
        }, this);

        this.gpNivelesP.getSelectionModel().on('rowdeselect', function (n) {
            self.gpNivelesEdu.getSelectionModel().clearSelections();
        }, this);

        //Fuente de datos del listado.
        this.stNivelesEdu = new Ext.data.Store({
            url: '/pvd/movimientoslaborales/index.php/confignivelesprep/getNivelesEdu',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idniveleducacional", totalProperty: "cantidad"},
                [{name:'idniveleducacional'},{name:'denominacion'}]
            ),
            listeners: {
                load: function () {
                    self.btnGuardar.disable();
                    self.gpNivelesEdu.getSelectionModel().clearSelections();
                    if (self.gpNivelesP.getSelectionModel().getSelected()) {
                        Ext.Ajax.request({
                            url: '/pvd/movimientoslaborales/index.php/confignivelesprep/getNivelesEduByIdNivelP',
                            params: {idpreparacion:idpreparacion},
                            callback: function (){
                            },
                            success: function (r){
                                var responseData = Ext.decode(r.responseText);
                                var objrec = [];
                                for (i=0; i<responseData.length; i++) {
                                    var obj = self.stNivelesEdu.getById(responseData[i].idniveleducacional);
                                    objrec.push(obj);
                                }
                                self.smNivelesEdu.selectRecords(objrec);
                            }
                        });
                    }
                }
            }
        });

        this.smNivelesEdu = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    self.btnGuardar.enable();
                }.createDelegate(this)
            }
        });

        //Listado de periodos.
        this.gpNivelesEdu = new Ext.grid.GridPanel({
            title: 'Listado de niveles educacionales de la persona',
            loadMask: {msg: 'Cargando...'},
            width: '50%',
            region: 'east',
            store: this.stNivelesEdu,
            sm: this.smNivelesEdu,
            columns: [this.smNivelesEdu,
                {
                    header: this.idioma.lbDenominacion,
                    width:500,
                    dataIndex: 'denominacion'
                }
            ]/*,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stNivelesEdu,
                displayInfo: true
            }) */
        });

        this.tbar = ['->', this.btnGuardar, this.btnAyuda];
        this.items = [this.gpNivelesP, this.gpNivelesEdu];

        this.on('render', function ()
        {
            self.btnGuardar.focus();
        });

		function guardarConfig()
        {
            var arrayconceptos = new Array();
            var select = self.gpNivelesEdu.getSelectionModel().getSelections();
            for (i = 0; i<select.length;i++) {
                arrayconceptos.push(select[i].data.idniveleducacional);
            }
            Ext.Ajax.request({
                url: '/pvd/movimientoslaborales/index.php/confignivelesprep/guardarConfiguracionNiveles',
                params: {
                    idpreparacion: idpreparacion,
                    nivelesedu: Ext.encode(arrayconceptos)
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'La configuración ha sido guardada satisfactoriamente');
                        self.stNivelesEdu.removeAll();
                    } else {
                        mostrarMensaje(6, 'Alguno(s) de los niveles ya se encuentra(n) asociado(s). ');
                    }
                    self.stNivelesEdu.reload();
                }
            });
        }


        this.keys = [
            {
                key: 'g',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnGuardar.disabled) {
                        self.btnGuardar.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            }
        ];

        Pvd.MovimientosLaborales.CompNivelPreparacion.superclass.initComponent.call(this);
    }
});
