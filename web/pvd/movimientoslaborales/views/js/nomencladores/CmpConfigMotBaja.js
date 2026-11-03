
/*
 * Componente CmpConfigMotBaja.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.CmpConfigMotBaja
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.MovimientosLaborales.CmpConfigMotBaja");
Pvd.MovimientosLaborales.CmpConfigMotBaja = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'configmotbaja',
    title: 'Configurar motivos de baja',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
        var idconfmotivobaja;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaMotivoBaja',
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

        //Fuente de datos del listado de configuraciones de los motivos de baja para el reporte
        this.stConfiguraciones = new Ext.data.Store({
            url: '/pvd/movimientoslaborales/index.php/configmotbaja/getConfiguraciones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idconfmotivobaja", totalProperty: "cantidad"},
                [{name:'idconfmotivobaja'}, {name:'idmotivobaja'}, {name: 'motivoreporte'}]
            ),
            listeners: {
                load: function () {
                    if (self.stConfiguraciones.getCount() > 0) {
                        self.gpConfiguraciones.getSelectionModel().selectFirstRow();
                    }
                }
            }
        });

        this.stConfiguraciones.load();

        this.smConfiguraciones = new Ext.grid.CheckboxSelectionModel({
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

        //Listado de las configuraciones de motivos para el reporte.
        this.gpConfiguraciones = new Ext.grid.GridPanel({
            title: 'Listado de motivos de baja para el reporte',
            store: this.stConfiguraciones,
            loadMask: {msg: 'Cargando...'},
            width: '50%',
            region: 'center',
            sm: this.smConfiguraciones,
            columns: [ this.smConfiguraciones,
                {
                    header: this.idioma.lbDenominacion,
                    width:500,
                    dataIndex: 'motivoreporte'
                }
            ]
        });

        this.gpConfiguraciones.getSelectionModel().on('rowselect', function (n) {
            idconfmotivobaja = n.getSelected().data.idconfmotivobaja;
            var objrec = [];
            var obj = self.stMotivoBaja.getById(self.gpConfiguraciones.getSelectionModel().getSelected().data.idmotivobaja);
            objrec.push(obj);
            self.smMotivoBaja.selectRecords(objrec);
        }, this);

        this.gpConfiguraciones.getSelectionModel().on('rowdeselect', function () {
            self.gpMotivoBaja.getSelectionModel().clearSelections();
        }, this);

        //Fuente de datos del listado.
        this.stMotivoBaja = new Ext.data.Store({
            url: '/pvd/movimientoslaborales/index.php/configmotbaja/getMotivosBaja',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmotivobaja", totalProperty: "cantidad"},
                [{name:'idmotivobaja'},{name:'denominacion'}]
            ),
            listeners: {
                load: function () {
                    self.btnGuardar.disable();
                    self.gpMotivoBaja.getSelectionModel().clearSelections();
                    if (self.gpConfiguraciones.getSelectionModel().getSelected()) {
                        if (self.gpConfiguraciones.getSelectionModel().getSelected().data.idmotivobaja) {
                            var objrec = [];
                            var obj = self.stMotivoBaja.getById(self.gpConfiguraciones.getSelectionModel().getSelected().data.idmotivobaja);
                            objrec.push(obj);
                            self.smMotivoBaja.selectRecords(objrec);
                        }
                    }
                }
            }
        });
        this.stMotivoBaja.load();

        this.smMotivoBaja = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    self.btnGuardar.enable();
                }.createDelegate(this)
            }
        });

        //Listado de periodos.
        this.gpMotivoBaja = new Ext.grid.GridPanel({
            title: 'Listado de Motivos de baja del nomenclador',
            loadMask: {msg: 'Cargando...'},
            width: '50%',
            region: 'east',
            store: this.stMotivoBaja,
            sm: this.smMotivoBaja,
            columns: [this.smMotivoBaja,
                {
                    header: this.idioma.lbDenominacion,
                    width:500,
                    dataIndex: 'denominacion'
                }
            ]
        });

        this.tbar = ['->', this.btnGuardar, this.btnAyuda];
        this.items = [this.gpConfiguraciones, this.gpMotivoBaja];

        this.on('render', function ()
        {
            self.btnGuardar.focus();
        });

		function guardarConfig()
        {
            Ext.Ajax.request({
                url: '/pvd/movimientoslaborales/index.php/configmotbaja/guardarConfiguracionNiveles',
                params: {
                    idconfmotivobaja: idconfmotivobaja,
                    idmotivobaja: self.gpMotivoBaja.getSelectionModel().getSelected().id
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'La configuración ha sido guardada satisfactoriamente');
                        self.stConfiguraciones.removeAll();
                        self.stMotivoBaja.removeAll();
                    }
                    self.stConfiguraciones.reload();
                    self.stMotivoBaja.reload();
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

        Pvd.MovimientosLaborales.CmpConfigMotBaja.superclass.initComponent.call(this);
    }
});
