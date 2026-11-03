Ext.ns('Pvd.Nomina.Configuraciones.ConfConceptosGeneralesNomina');
Ext.QuickTips.init();
//Modelo
Pvd.Nomina.Configuraciones.ConfConceptosGeneralesNomina.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function (idioma) {
        //Store
        this.stConceptosGenerales = new Ext.data.Store({
            url: 'obtenerconfiguracionesconceptosgeneralesnomina',
            baseParams: {identidad: -1, idsistemapago: -1, idtipopago: -1, sedesglosa: 1},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idconfconceptosgeneralesnomina"},
                [{name: 'idconfconceptosgeneralesnomina'}
                    , {name: 'idconceptorm'}
                    , {name: 'idsistemapago'}
                    , {name: 'conceptorm'}
                    , {name: 'idexpresionmatematica'}
                    , {name: 'expresionmatematica'}
                    , {name: 'identidad'}
                    , {name: 'calcularpluriempleo'}
                    , {name: 'calcularperiodomensual'}
                    , {name: 'lugaresdecimales'}
                ])
        });
        this.CargarConceptosGenerales = function (identidad, idsistemapago, idtipopago, sedesglosa) {
            this.stConceptosGenerales.removeAll();
            this.stConceptosGenerales.baseParams.identidad = identidad;
            this.stConceptosGenerales.baseParams.idsistemapago = idsistemapago;
            this.stConceptosGenerales.baseParams.idtipopago = idtipopago;
            this.stConceptosGenerales.baseParams.sedesglosa = sedesglosa;
            this.stConceptosGenerales.load({params: {limit: 1000, start: 0}});
        }.createDelegate(this);
        this.stComboConceptosGenerales = new Ext.data.Store({
            url: 'obtenerconceptosgeneralesnomina',
            reader: new Ext.data.JsonReader({
                id: "idconceptorm"
            }, [{name: 'idconceptorm'}
                , {name: 'denominacion'}
                , {name: 'descripcion'}
            ])
        });
        this.datosModelo = null;
        this.ConvertiraArreglo = function (arrObj) {
            var a = new Array();
            for (var i = 0; i < arrObj.length; i++) {
                var arr = new Array();
                if (arrObj[i].idindicador == 'SPC' || arrObj[i].idindicador == 'RET_0' || arrObj[i].idindicador == 'VAC_0') {
                    arr[0] = arrObj[i].idindicador;
                    arr[1] = arrObj[i].indicador;
                    arr[2] = arrObj[i].tipo;
                } else {
                    arr[0] = 'CPD_' + arrObj[i].idindicador;
                    arr[1] = arrObj[i].indicador;
                    arr[2] = 'Concepto - ' + arrObj[i].tipo;
                }
                a[i] = arr;
            }
            return a;
        }
    }
};
//Vista del componente Nomencladores de nóminas.
Pvd.Nomina.Configuraciones.ConfConceptosGeneralesNomina.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;

        //Buscador
        this.tfbuscarConceptoGeneral = new Ext.form.TextField({
            id: 'tfBuscarConceptoGeneral',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar...',
            name: 'tfbuscador'
        });
        this.btnBuscarConceptoGeneral = new Ext.Button({
            disabled: false,
            id: 'btnBuscarConceptoGeneral',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar concepto general<b>(Alt+C)</b>',
            handler: function () {

            }
        });

        this.objTiposPago = new Pvd.nomina.nomencladores.ListarTiposPagoComp({
            title: 'Tipos de pago',
            border: true,
            region: 'center',
            split: true,
            width: '25%',
            height: '50%'
        });
        this.pTiposyFormasSistemasPago = new Ext.Panel({
            region: 'west',
            layout: 'border',
            border: false,
            height: '50%',
            width: '30%',
            items: [this.objTiposPago]
        });
        this.cbConceptosGenerales = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.cmConceptosGenerales = new Ext.grid.ColumnModel([this.cbConceptosGenerales, {
            header: "idconfconceptosgeneralesnomina",
            dataIndex: 'idconfconceptosgeneralesnomina',
            hidden: true,
            hideable: false
        }, {
            header: "lugaresdecimales",
            dataIndex: 'lugaresdecimales',
            hidden: true,
            hideable: false
        }, {
            header: "idconceptorm",
            dataIndex: 'idconceptorm',
            hidden: true,
            hideable: false
        }, {
            header: "Conceptos generales de n&oacute;mina",
            dataIndex: 'conceptorm',
            width: 200
        }, {
            header: "idexpresionmatematica",
            dataIndex: 'idexpresionmatematica',
            hidden: true,
            hideable: false
        }, {
            header: "pluriempleo",
            dataIndex: 'calcularpluriempleo',
            hidden: true,
            hideable: true
        }, {
            header: "periodomensual",
            dataIndex: 'calcularperiodomensual',
            hidden: true,
            hideable: true
        }, {
            header: "F&oacute;mula",
            dataIndex: 'expresionmatematica',
            width: 400
        }
        ]);
        this.cmConceptosGenerales.defaultSortable = true;
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar concepto general de n&oacute;mina (<b>Alt+I</b>)',
            iconCls: 'adicionar',
            handler: function () {
            }.createDelegate(this)
        });
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: "<u>M</u>odificar",
            tooltip: 'Modificar concepto general de n&oacute;mina (<b>Alt+M</b>)',
            disabled: true,
            iconCls: 'modificar',
            handler: function () {
            }.createDelegate(this)
        });
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            //tooltip: 'Eliminar',
            tooltip: 'Eliminar concepto general de n&oacute;mina (<b>DEL</b>)',
            disabled: true,
            iconCls: 'eliminar'
        });
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda',
            iconCls: 'ayuda',

        });
        //*******Replicar****
        this.btnReplicar = new Ext.Button({
            id: 'btnreplicar',
            text: 'Replicar',
            tooltip: 'Replicar',
            disabled: true,
//            icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });
        this.btnAceptarEntidadReplicar = new Ext.Button({
            id: 'btnAceptarEntidadReplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
//            icon: perfil.dirImg+'aceptar.png',
            disabled: true,
            iconCls: 'aceptar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });
        this.pobjestructuraReplicar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 7,
            nivelachequear: [3,5]

        });
        this.winEstructuraReplicar = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closeAction: 'hide',
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructuraReplicar],
            buttons: [this.btnAceptarEntidadReplicar]
        });

        //Tipo de replica, por entidades o por tipos de pago
        this.rbEntidades = new Ext.form.Radio({
            id: 'rbEntidades',
            boxLabel: 'Entidades',
            name: 'tiporeplica',
            checked: true,
            inputValue: 1
        });

        this.rbTiposPago = new Ext.form.Radio({
            id: 'rbTiposPago',
            boxLabel: 'Tipos de pago',
            name: 'tiporeplica',
            inputValue: 2
        });

        this.rgTipoReplica = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.5, .5],
            style: 'padding-left: 20px;',
            items: [this.rbEntidades, this.rbTiposPago]
        });

        this.formularioTipoReplica = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 500,
            heigth: 450,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: '',
                height: 65,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoReplica
                ]
            }]
        });

        this.btnAceptarTipoReplica = new Ext.Button({
            id: 'btnAceptarTipoReplica',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.btnCancelarTipoReplica = new Ext.Button({
            id: 'btnCancelarTipoReplica',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoReplica = new Ext.Window({
            region: 'center',
            title: 'Tipos de replica',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoReplica],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarTipoReplica, this.btnAceptarTipoReplica]
        });

        //Tipos de pago a replicar
        this.objTiposPagoReplicar = new Pvd.nomina.nomencladores.ListarTiposPagoComp({
            title: 'Tipos de pago',
            border: true,
            multiselect: true,
            region: 'center',
            split: true,
            width: '100%',
            height: '100%'
        });

        this.btnAceptarTiposPagoreplicar = new Ext.Button({
            id: 'btnAceptarTiposPagoreplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btCancelarTiposPagoreplicar = new Ext.Button({
            id: 'btCancelarTiposPagoreplicar',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {
            }.createDelegate(this)
        });

        this.winTiposPagosreplicar = new Ext.Window({
            title: 'Tipos de pago',
            modal: true,
            height: 500,
            width: 600,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.objTiposPagoReplicar],
            buttons: [this.btCancelarTiposPagoreplicar, this.btnAceptarTiposPagoreplicar]
        });


        /**********************************************************************************************/
        this.filasSelecionadas = new Array();
        this.idEstructura = null;
        this.gpConceptosGenerales = new Ext.grid.GridPanel({
            title: 'Listado de conceptos generales de n&oacute;mina',
            region: 'center',
            layout: 'fit',
            split: true,
            store: modelo.stConceptosGenerales,
            autoScroll: true,
            cm: this.cmConceptosGenerales,
            sm: this.cbConceptosGenerales,//new Ext.grid.RowSelectionModel({singleSelect: true}),
            width: '70%',
            height: 600,
            border: false,
            viewConfig: {forceFit: true},
            loadMask: {msg: 'Cargando...'},
            disabled: true,
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stConceptosGenerales,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });
        this.pConceptosGenerales = new Ext.Panel({
            region: 'center',
            layout: 'border',
            disabled: true,
            items: [this.gpConceptosGenerales],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.tfbuscarConceptoGeneral, this.btnBuscarConceptoGeneral, '->', this.btnReplicar, '->', this.btnAyuda],
            keys: [
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionar.handler();
                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificar.disabled) {
                            self.btnModificar.handler();
                        }

                    }
                },
                {
                    key: 46,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminar.disabled) {
                            self.btnEliminar.handler();
                        }
                    }
                },
                {
                    key: 'h',
                    stopEvent: true,
                    alt: true,
                    fn: function () {
                        self.btnAyuda.handler();
                    }
                }
            ]
        });
        this.cbConceptosGenerales = new Ext.form.ComboBox({
            fieldLabel: 'Conceptos generales de n&oacute;mina',
            anchor: '98%',
            triggerAction: 'all',
            valueField: 'idconceptorm',
            displayField: 'denominacion',
            hiddenName: 'idconceptorm',
            allowBlank: false,
            mode: 'local',
            blankText: 'Este campo es obligatorio.',
            readOnly: true,
            store: modelo.stComboConceptosGenerales
        });
        this.tfFormula = new Ext.form.TextField({
            id: 'tfFormula',
            fieldLabel: 'F&oacute;mula',
            allowBlank: false,
            anchor: '98%',
            blankText: 'Este campo es obligatorio.'
        });
        this.tfLugaresdecimales = new Ext.form.TextField({
            id: 'tfLugaresdecimales',
            fieldLabel: 'Lugares decimales',
            name: 'lugaresdecimales',
            anchor: '98%',
            blankText: 'Este campo es obligatorio.'
        });
        this.cbCalcPluriEmpleo = new Ext.form.Checkbox({
            id: 'idcbCalcPluriEmpleo',
            fieldLabel: 'Calcular en pluriempleo',
            anchor: '50%',
            name: 'pluriempleo',
            //listeners: {
            //    check: function (tf, n) {
            //        self.pluriempleo = (self.cbCalcPluriEmpleo.checked ? true : false);
            //}}
        });
        this.cbCalcPeriodoMensual = new Ext.form.Checkbox({
            id: 'idcbCalcPeriodoMensual',
            fieldLabel: 'Calcular en per&iacute;odo mensual',
            anchor: '50%',
            name: 'periodomensual',
        });
        this.fpConceptosGenerales = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            width: 350,
            autoHeight: true,
            items: [
                this.cbConceptosGenerales,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .50, layout: 'form', items: [this.tfFormula]},
                        {columnWidth: .50, layout: 'form', items: [this.tfLugaresdecimales]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .50, layout: 'form', items: [this.cbCalcPluriEmpleo]},
                        {columnWidth: .50, layout: 'form', items: [this.cbCalcPeriodoMensual]}
                    ]
                }
            ]
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: 'Aplicar',
            iconCls: 'aplicar',
            handler: function () {
            }.createDelegate(this)
        });
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {

            }.createDelegate(this)
        });
        this.winConceptosGenerales = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.fpConceptosGenerales],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelar.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicar.handler();
                    }
                }
            ]
        });
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelchequear: 3

        });
        this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });
        this.winEstructura = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructura],
            buttons: [this.btnAceptarEntidad]
        });
        this.winMostrarConceptosGenerales = new Ext.Window({
            title: 'Configuraci&oacute;n de conceptos de n&oacute;mina',
            modal: true,
            height: 600,
            width: 800,
            constrain: true,
            closeAction: 'hide',
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.pTiposyFormasSistemasPago, this.pConceptosGenerales]
        });

        /************************************Eliminar multiple*******************************/
        this.btnAceptarEliminar = new Ext.Button({
            id: 'btnAceptarEliminar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.pobjestrucEliminar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelachequear: [3,5]
        });

        this.winEstructuraEliminar = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closeAction: 'hide',
            //closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestrucEliminar],
            buttons: [this.btnAceptarEliminar]
        });
        /************************************Eliminar multiple*******************************/
    }
};
//Controlador de la vista del componente Nomencladores de nóminas.
Pvd.Nomina.Configuraciones.ConfConceptosGeneralesNomina.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Vista)
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo)
     */
    init: function (idioma, vista, modelo) {
        var self = this;
        this.identidad = null;
        this.pluriempleo = false;
        this.periodomensual = false;
        this.nodosseleccionados = new Array();
	this.nodosseleccionadosaeliminar = new Array();
        var cambioFormPanel = 0;
        var tiporeplica = 1;

        //**************Replicar
        vista.btnReplicar.setHandler(function () {
            vista.ventanaTipoReplica.show();
        }.createDelegate(this));

        vista.btnCancelarTipoReplica.on('click', function(){
            vista.ventanaTipoReplica.hide();
        });

        vista.btnAceptarTipoReplica.on('click', function(){
            if (vista.rbTiposPago.getGroupValue() == 1) {
                tiporeplica = 1;//Entidades
                vista.winEstructuraReplicar.show();
            } else {
                tiporeplica = 2;//Tipos pagos
                vista.winTiposPagosreplicar.show();
                vista.objTiposPagoReplicar.Cargar();
            }
        });

        vista.btCancelarTiposPagoreplicar.on('click', function(){
            vista.winTiposPagosreplicar.hide();
        });

        //Replicar los conceptos para otros tipos de pagos de la misma entidad
        vista.btnAceptarTiposPagoreplicar.on('click', function(){
            replicarDatos(this.identidad);
        }.createDelegate(this));

        vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().on('rowselect', function(sm, index, r){
            vista.btnAceptarTiposPagoreplicar.enable();
        });

        vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().on('rowdeselect', function(sm, index, r){
            vista.btnAceptarTiposPagoreplicar.disable();
        });
//*****************************************************************************************************************
        vista.pobjestructuraReplicar.on('checkednode', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            vista.btnAceptarEntidadReplicar.enable();
            vista.idEstructura = nodo.id;
            //}
            if (nodo.attributes.id != this.identidad) {
                this.nodosseleccionados.push(nodo.attributes.id);
            }
        }.createDelegate(this));

        vista.btnAceptarEntidadReplicar.setHandler(function () {
            replicarDatos();
        }.createDelegate(this));

        function replicarDatos(identidad){
            var arrEntidades = new Array();
            var arrTiposPagosReplicar = new Array();
            if(tiporeplica == 1){
                var s = vista.pobjestructuraReplicar.getSeleccionados();
                if (s.length <= 0) {
                    mostrarMensaje(3, 'Debe seleccionar una entidad.');
                    return;
                }

                for (var i = 0; i < s.length; i++) {
                    if (s[i].id != this.identidad) {
                        arrEntidades.push(s[i].id);
                    }
                }
                arrTiposPagosReplicar[0] = vista.objTiposPago.gpTiposPago.getSelectionModel().getSelected().data.idtipopago;
            }else if(tiporeplica == 2){
                arrEntidades[0] = identidad;
                if(vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().hasSelection()){
                    var datostipospago = vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().getSelections();
                    Ext.each(datostipospago, function (rec) {
                        arrTiposPagosReplicar.push(rec.get('idtipopago'));
                    });
                }
            }


            var idconceptogno = new Array();
            var datos = vista.gpConceptosGenerales.getSelectionModel().getSelections();
            Ext.each(datos, function (rec) {

                idconceptogno.push({
                    idconceptorm: rec.get('idconceptorm'),
                    idconceptogeneralesnomina: rec.get('idconfconceptosgeneralesnomina')

                });
            });
            console.info(arrEntidades);console.info(arrTiposPagosReplicar);
            if ((tiporeplica == 1 && arrEntidades.length > 0) || (tiporeplica == 2 && arrTiposPagosReplicar.length>0)) {
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Replicando datos'
                });
                winload.showMask();
                Ext.Ajax.request({
                    url: 'replicarConceptosGeneralesNomina',
                    method: 'POST',
                    params: {
                        tiporeplica: tiporeplica,
                        idConceptos: Ext.encode(idconceptogno),
                        idEstructura: Ext.encode(arrEntidades),
                        arrtipospagoreplicar: Ext.encode(arrTiposPagosReplicar),

                    },
                    callback: function (options, success, response) {
                        winload.hideMask();
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'El concepto de percepci&oacute;n y descuento se replic&oacute; satisfactoriamente.');

                        }
                        vista.winEstructuraReplicar.hide();
                        vista.ventanaTipoReplica.hide();
                        vista.winTiposPagosreplicar.hide();
                    }
                })

            }else{
                mostrarMensaje(3, 'Por favor seleccione las entidades o los tipos de pagos');
            }
        }

        //**************Replicar
        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            vista.btnAceptarEntidad.enable();
            this.identidad = nodo.id;
            //}
        }.createDelegate(this));
        vista.btnAceptarEntidad.setHandler(function () {
            vista.gpConceptosGenerales.disable();
            vista.pConceptosGenerales.disable();
            modelo.stConceptosGenerales.removeAll();
            vista.winMostrarConceptosGenerales.show();
            vista.objTiposPago.Cargar();
        });
        vista.winEstructura.show();
        this.accion = '';
        this.idsistemapago = null;
        vista.btnAdicionar.on('click', function () {
            this.accion = 'ADD';
            this.MostrarADDMODConfConceptosGenerales(this.accion);
        }.createDelegate(this));
        vista.btnModificar.on('click', function () {
            this.accion = 'MOD';
            this.MostrarADDMODConfConceptosGenerales(this.accion);
        }.createDelegate(this));
        vista.btnEliminar.setHandler(function () {
            this.accion = 'DEL';
            // console.info(this.DatosCampoConceptosGenerales(this.accion));return;

            //console.info(idconfconceptosgeneralesnomina);return;
            if (this.seleccionconfiguracionconceptosgenerales) {
                mostrarMensaje(2, ' ¿Está seguro que desea eliminar la configuración del concepto general de n&oacute;mina seleccionada?', function (btn) {
                    if (btn == 'ok') {
                        this.DatosCampoConceptosGenerales('DEL');
                        vista.winEstructuraEliminar.show();
                        // DELConfiguracionConceptosGenerales();
                    } else return;
                }.createDelegate(this));
            } else {
                mostrarMensaje(1, 'Debe seleccionar una configuraci&oacute;n de concepto general de n&oacute;mina.');
            }
        }.createDelegate(this));

        //eliminar multiple
        function DELConfiguracionConceptosGenerales(_this){
            var arridconfconceptos = new Array();
            var arrDatos = vista.gpConceptosGenerales.getSelectionModel().getSelections();
            for (var i = 0; i < arrDatos.length; i++) {
                arridconfconceptos.push(arrDatos[i]['data']['idconfconceptosgeneralesnomina']);
            }
            PVD.mostrarMascara('iddelcgn', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'eliminarconfiguracionesconceptosgeneralesnomina',
                method: 'POST',
                params: {
                    arrayidconceptos: Ext.encode(arridconfconceptos),
                    idtipopago      : (_this.idtipopago)?_this.idtipopago:-1,
                    arrayidentidades:  Ext.encode(_this.nodosseleccionadosaeliminar)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('iddelcgn');
                    if(Ext.decode(response.responseText) == 'OK'){
                        mostrarMensaje(1, 'La configuraci&oacute;n del concepto se elimin&oacute; satisfactoriamente.');
                        modelo.stConceptosGenerales.reload();
                        vista.winEstructuraEliminar.hide();

                    }else if(Ext.decode(response.responseText) == 'ERR-NO-EST'){
                        mostrarMensaje(3, 'Por favor seleccione una estructura para poder eliminar.');
                    }
                }.createDelegate(this)
            });
        }

        vista.btnAceptar.setHandler(function () {
            if (vista.cbConceptosGenerales.getValue() != "" && vista.tfFormula.getValue() != "") {
                this.accion == 'ADD';
                this.ADDMODDELConfiguracionConceptosGenerales(this.accion, 'ACEPTAR', this.DatosCampoConceptosGenerales(this.accion));
            }
        }.createDelegate(this));
        vista.btnAplicar.setHandler(function () {
            if (vista.cbConceptosGenerales.getValue() != "" && vista.tfFormula.getValue() != "") {
                this.accion == 'ADD';
                this.ADDMODDELConfiguracionConceptosGenerales(this.accion, 'APLICAR', this.DatosCampoConceptosGenerales(this.accion));
            }
        }.createDelegate(this));
        vista.btnCancelar.setHandler(function () {
            vista.winConceptosGenerales.hide();
        }.createDelegate(this));
        vista.btnBuscarConceptoGeneral.setHandler(function () {
            modelo.stConceptosGenerales.baseParams.criterio = vista.tfbuscarConceptoGeneral.getValue();
            modelo.CargarConceptosGenerales(this.identidad, this.idsistemapago, this.idtipopago, this.tipopagoseleccionado.data.sedesglosa);
        }.createDelegate(this));
        this.idtipopago = null;
        this.tipopagoseleccionado = null;
        vista.objTiposPago.on('tipopagoseleccionado', function (fila) {
            vista.gpConceptosGenerales.disable();
            vista.pConceptosGenerales.disable();
            modelo.stConceptosGenerales.removeAll();
            this.idtipopago = fila.data.idtipopago;
            this.tipopagoseleccionado = fila;
            this.idsistemapago = null;
            vista.gpConceptosGenerales.enable();
            vista.pConceptosGenerales.enable();
            modelo.CargarConceptosGenerales(this.identidad, this.idsistemapago, this.idtipopago, this.tipopagoseleccionado.data.sedesglosa);
            PVD.mostrarMascara('idmaskcargardatosconceptosgenerales', 'Por favor espere...', 'Cargando datos de conceptos generales de n&oacute;mina');
            Ext.Ajax.request({
                url: 'obtenerconfiguracioninicial',
                method: 'POST',
                params: {
                    identidad: this.identidad,
                    idtipopago: this.idtipopago
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskcargardatosconceptosgenerales');
                    modelo.datosModelo = Ext.decode(response.responseText);
                }.createDelegate(this)
            });
        }.createDelegate(this));
        this.seleccionconfiguracionconceptosgenerales = null;
        var arrayConceptos = new Array();
        vista.gpConceptosGenerales.getSelectionModel().on('rowselect', function (t, index, r) {
            this.seleccionconfiguracionconceptosgenerales = r;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnReplicar.enable();
            var id = r.id;
            var indiceFila = vista.filasSelecionadas.indexOf(id);
            if (indiceFila == -1) {
                vista.filasSelecionadas.push(id);
            }
            arrayConceptos = vista.filasSelecionadas;

        }.createDelegate(this));
        vista.gpConceptosGenerales.getSelectionModel().on('rowdeselect', function (sm, index, rec) {

            var id = rec.id;
            var indiceFila = vista.filasSelecionadas.indexOf(id);
            vista.filasSelecionadas.remove(id);
            if (vista.filasSelecionadas == 0) {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
                vista.btnReplicar.disable();
            }
            arrayConceptos = vista.filasSelecionadas;
        }.createDelegate(this));
        this.idexpresionmatematica = null;
        vista.tfFormula.on('focus', function () {
            var ind = modelo.ConvertiraArreglo(modelo.datosModelo.conceptos);
            modelo.stConceptosGenerales.each(function (r) {
                var a = new Array();
                a[0] = 'CRM_' + r.data.idconceptorm;
                a[1] = r.data.conceptorm;
                a[2] = 'Conceptos generales de n&oacute;mina';
                ind.push(a);
            });
            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (this.accion == 'ADD' ? -1 : this.idexpresionmatematica),
                indicadores: ind,
                agrupado: 1,
                mostrarCondicionales: true,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                operadoresMostrar: [],
                mostrarDenominacion: false
            });
            this.objExpMat.on('expresionsalvada', function (arr) {
                this.idexpresionmatematica = arr.idexpresionmatematica;
                vista.tfFormula.setValue(arr.elementosMostrar);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }.createDelegate(this));
        this.DatosCampoConceptosGenerales = function (accion) {
            var pluriempleo = (vista.cbCalcPluriEmpleo.checked == true) ? 1 : 0;
            var periodomensual = (vista.cbCalcPeriodoMensual.checked == true) ? 1 : 0;
            if (accion == 'ADD') {
                return {
                    idconfconceptosgeneralesnomina: null,
                    idsistemapago: this.idsistemapago,
                    idtipopago: this.idtipopago,
                    sedesglosa: this.tipopagoseleccionado.data.sedesglosa,
                    idconceptorm: vista.cbConceptosGenerales.getValue(),
                    pluriempleo: (vista.cbCalcPluriEmpleo.checked == true) ? 1 : 0,
                    periodomensual: (vista.cbCalcPeriodoMensual.checked == true) ? 1 : 0,
                    idexpresionmatematica: this.idexpresionmatematica,
                    identidad: this.identidad,
                    lugaresdecimales: vista.tfLugaresdecimales.getValue()
                };
            } else if (accion == 'MOD') {
                return {
                    idconfconceptosgeneralesnomina: this.seleccionconfiguracionconceptosgenerales.data.idconfconceptosgeneralesnomina,
                    idsistemapago: this.idsistemapago,
                    sedesglosa: this.tipopagoseleccionado.data.sedesglosa,
                    idtipopago: this.idtipopago,
                    idconceptorm: vista.cbConceptosGenerales.getValue(),
                    pluriempleo: pluriempleo,
                    periodomensual: periodomensual,
                    idexpresionmatematica: this.idexpresionmatematica,
                    identidad: this.identidad,
                    lugaresdecimales: vista.tfLugaresdecimales.getValue()
                };
            } else if (accion == 'DEL') {
                var idconfconceptosgeneralesnomina = new Array();
                var datos = vista.gpConceptosGenerales.getSelectionModel().getSelections();
                Ext.each(datos, function (rec) {
                    // console.info(rec);return;
                    idconfconceptosgeneralesnomina.push(rec.get('idconfconceptosgeneralesnomina'));
                });

                return {
                    idconfconceptosgeneralesnomina: Ext.encode(idconfconceptosgeneralesnomina) //this.seleccionconfiguracionconceptosgenerales.data.idconfconceptosgeneralesnomina
                };
            }
        }.createDelegate(this);
        this.limpiarFormularioConceptosGenerales = function () {
            vista.fpConceptosGenerales.getForm().reset();
        }.createDelegate(this);
        this.MostrarADDMODConfConceptosGenerales = function (boton) {
            var titulo = '';
            modelo.stComboConceptosGenerales.load();
            this.limpiarFormularioConceptosGenerales();
            if (this.accion == 'ADD') {
                titulo = 'Adicionar configuraci&oacute;n de concepto general de n&oacute;mina';
                vista.cbConceptosGenerales.setValue("");
                vista.tfFormula.setValue("");
                vista.btnAplicar.setVisible(true);
                //vista.cbCalcPluriEmpleo.checked = false;
                //vista.cbCalcPeriodoMensual.checked = false;
            } else {
                titulo = 'Modificar configuraci&oacute;n de concepto general de n&oacute;mina';
                vista.btnAplicar.setVisible(false);
                if (this.seleccionconfiguracionconceptosgenerales) {
                    vista.cbConceptosGenerales.setValue(this.seleccionconfiguracionconceptosgenerales.data.idconceptorm);
                    vista.tfFormula.setValue(this.seleccionconfiguracionconceptosgenerales.data.expresionmatematica);
                    //   vista.tfLugaresdecimales.setValue(this.seleccionconfiguracionconceptosgenerales.data.lugaresdecimales);
                    this.idexpresionmatematica = this.seleccionconfiguracionconceptosgenerales.data.idexpresionmatematica;
                } else {
                    mostrarMensaje(3, 'Debe seleccionar una configuraci&oacute;n de concepto general de n&oacute;mina.');
                    return;
                }

                //var form = vista.fpConceptosGenerales.getForm().loadRecord(vista.gpConceptosGenerales.getSelectionModel().getSelected()).items;
                //console.info(form);
                //console.info(form.items[0]);

                this.pluriempleo = (vista.gpConceptosGenerales.getSelectionModel().getSelected().data.calcularpluriempleo == 1) ? true : false;
                this.periodomensual = (vista.gpConceptosGenerales.getSelectionModel().getSelected().data.calcularperiodomensual == 1) ? true : false;
                //console.info(this.pluriempleo);
                //console.info(this.periodomensual);
                vista.cbCalcPluriEmpleo.checked = this.pluriempleo;
                vista.cbCalcPeriodoMensual.checked = this.periodomensual;
                vista.tfLugaresdecimales.setValue(vista.gpConceptosGenerales.getSelectionModel().getSelected().data.lugaresdecimales);
            }
            vista.winConceptosGenerales.setTitle(titulo);
            vista.cbConceptosGenerales.focus(true, 500);
            vista.winConceptosGenerales.show();
        }.createDelegate(this);

        this.ADDMODDELConfiguracionConceptosGenerales = function (accion, boton, datos) {

            var url = '';
            if (accion == 'ADD') {
                url = 'adicionarconfiguracionesconceptosgeneralesnomina';
                PVD.mostrarMascara('idmaskadicionarconfiguracionesconceptosgeneralesnomina', 'Por favor espere...', 'Adicionando datos de la configuraci&oacute;n');
            } else if (accion == 'MOD') {
                url = 'modificarconfiguracionesconceptosgeneralesnomina';
                PVD.mostrarMascara('idmaskmodificarconfiguracionesconceptosgeneralesnomina', 'Por favor espere...', 'Modificando datos de la configuraci&oacute;n');
            } else if (accion == 'DEL') {
                url = 'eliminarconfiguracionesconceptosgeneralesnomina';
                PVD.mostrarMascara('idmaskeliminarconfiguracionesconceptosgeneralesnomina', 'Por favor espere...', 'Eliminando datos de la configuraci&oacute;n');
            }
            if (vista.fpConceptosGenerales.getForm().isValid()) {
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idconfconceptosgeneralesnomina: (datos.idconfconceptosgeneralesnomina ? datos.idconfconceptosgeneralesnomina : null),
                        idsistemapago: (datos.idsistemapago ? datos.idsistemapago : null),
                        idtipopago: (datos.idtipopago ? datos.idtipopago : null),
                        sedesglosa: (datos.sedesglosa ? datos.sedesglosa : null),
                        idconceptorm: (datos.idconceptorm ? datos.idconceptorm : null),
                        idexpresionmatematica: (datos.idexpresionmatematica ? datos.idexpresionmatematica : null),
                        identidad: (datos.identidad ? datos.identidad : null),
                        pluriempleo: datos.pluriempleo,
                        periodomensual: datos.periodomensual,
                        lugaresdecimales: datos.lugaresdecimales

                    },
                    callback: function (options, success, response) {
                        if (accion == 'ADD') {
                            PVD.ocultarMascara('idmaskadicionarconfiguracionesconceptosgeneralesnomina');
                        } else if (accion == 'MOD') {
                            PVD.ocultarMascara('idmaskmodificarconfiguracionesconceptosgeneralesnomina');
                        } else if (accion == 'DEL') {
                            PVD.ocultarMascara('idmaskeliminarconfiguracionesconceptosgeneralesnomina');
                        }
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 'EXISTE') {
                            mostrarMensaje(3, 'La configuraci&oacute;n de conceptos generales de n&oacute;mina existe.');
                            return;
                        }
                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'La configuraci&oacute;n de conceptos generales de n&oacute;mina se adicion&oacute; satisfactoriamente.');

                        } else if (respuesta.codigo == 'MOD-1') {
                            mostrarMensaje(1, 'La configuraci&oacute;n de conceptos generales de n&oacute;mina se modific&oacute; satisfactoriamente.');
                        }
                        else if (respuesta.codigo == 'DEL-1') {
                            mostrarMensaje(1, 'La configuraci&oacute;n de conceptos generales de n&oacute;mina se elimin&oacute; satisfactoriamente.');
                        }
                        if (boton == 'APLICAR' && accion == 'ADD') {
                            this.limpiarFormularioConceptosGenerales();
                        } else if (boton == 'ACEPTAR' && accion != 'DEL') {
                            vista.winConceptosGenerales.hide();
                        }
                        if (accion == 'MOD' || accion == 'DEL') {
                            vista.btnModificar.disable();
                            vista.btnEliminar.disable();
                        }
                        modelo.CargarConceptosGenerales(this.identidad, this.idsistemapago, this.idtipopago, this.tipopagoseleccionado.data.sedesglosa);
                    }.createDelegate(this)
                });
            }
        };

        /*********************************Eliminar multiple*******************************/
        vista.pobjestrucEliminar.on('uncheckednode', function (sm, nodo) {
            var index = this.nodosseleccionadosaeliminar.indexOf(nodo.attributes.id);
            if (index > -1) {
                this.nodosseleccionadosaeliminar.splice(index, 1);
                estanNodosSeleccionados(this.nodosseleccionadosaeliminar);
                //console.info(this.nodosseleccionadosaeliminar);
            }
        }.createDelegate(this));

        vista.pobjestrucEliminar.on('checkednode', function (sm, nodo) {

            if(nodo.attributes.id!='idraiz'){
                this.nodosseleccionadosaeliminar.push(nodo.attributes.id);
            }else{
                this.nodosseleccionadosaeliminar.push(nodo.id);
            }
            estanNodosSeleccionados(this.nodosseleccionadosaeliminar);
            //console.info(this.nodosseleccionadosaeliminar);
        }.createDelegate(this));

        vista.pobjestrucEliminar.on('estructuraselecionada', function (sm, nodo) {
            //console.log(nodo.attributes.tipoestructura);
            if (nodo.attributes.tipoestructura == 3) {
                vista.btnAceptarEliminar.enable();
            }
        }.createDelegate(this));

        vista.btnAceptarEliminar.setHandler(function () {
            DELConfiguracionConceptosGenerales(this);
        }.createDelegate(this));

        //eliminar multiple
        function ejecutarEliminar(_this) {
            if(_this.nodosseleccionadosaeliminar.length>0){
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminar);
                //Enviando los datos al servidor.
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/estructurarmodelosnomina/eliminarEstructurasNomina',
                    method: 'POST',
                    params: {
                        idestructuramodelodomina: Ext.encode(arrayConceptos),
                        idestructura:  Ext.encode(_this.nodosseleccionadosaeliminar)
                    },
                    callback: function (options, success, response) {
                        //Se oculta la máscara de espera.
                        PVD.ocultarMascara('idmaskeleminartipopago');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg) {
                            //Mostrando el mensaje de que se ha el tipo de nómina.
                            mostrarMensaje(1, idioma.lbMsgCorrectoEliminado, function () {

                            });
                            //Recargando el grid de tipos de nómina.
                            vista.gpEstructurarNomina.getStore().removeAll();
                            vista.gpEstructurarNomina.getStore().load({
                                params: {
                                    idtiponomina: vista.idtiponomina,
                                    idestructura: vista.idestructura
                                }
                            });
                        }
                    }
                });
            }
        }

        function estanNodosSeleccionados(nodos){
            if(nodos.length>0){
                vista.btnAceptarEliminar.enable();
            }else{
                vista.btnAceptarEliminar.disable();
            }
        }
        /*********************************Eliminar multiple*******************************/
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('confconceptosgeneralesnomina', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    /*Configuracion inicial*/
    //Hago la peticion para cargar los datos iniciales
    /*PVD.mostrarMascara('idmaskcargardatosconceptosgenerales', 'Por favor espere...', 'Cargando datos de conceptos generales de n&oacute;mina');
     Ext.Ajax.request({
     url: 'obtenerconfiguracioninicial',
     method: 'POST',
     params: {identidad: this.identidad,
     idtipopago: this.idtipopago
     },
     callback: function (options, success, response) {
     PVD.ocultarMascara('idmaskcargardatosconceptosgenerales');*/
    //Inicializando el modelo
    var modelo = Pvd.Nomina.Configuraciones.ConfConceptosGeneralesNomina.Modelo;
    modelo.init(idioma);

    //modelo.datosModelo = Ext.decode(response.responseText);

    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuraciones.ConfConceptosGeneralesNomina.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Configuraciones.ConfConceptosGeneralesNomina.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
    //}.createDelegate(this)
    //});
});
