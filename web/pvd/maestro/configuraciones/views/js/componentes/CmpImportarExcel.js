/**
 * @name componentes.CmpPieFirma - Componente para la configuración de excel a iportar en el sistema.
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *  Tte. Ing. Roberto León Socarrás
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpImportarExcel = Ext.extend(Ext.Panel, {
    id           : 'pImportarExcel',
    title        : 'Configuración de la importartación de excel',
    tabTip       : 'Importar Excel',
    layout       : 'fit',
    region       : 'center',
    height       : '100%',
    closable     : true,
    initComponent: function () {
        var self = this;


        var variables = {
            identidad          : null,
            denominacionentidad: '',
            idmodulo           : -1,
            idelemento         : -1,
            obtencioncampos    : 2,
            accion             : '',
            cambio             : 0
        };


        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            //nivel : 5
        });


        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id      : 'btnAceptarEntidades',
            text    : this.idioma.btnAceptar,
            tooltip : 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls : 'aceptar'
        });

        //Vista para el componente Buscar estructura
        this.winEstEntidades = new Ext.Window({
            title    : 'Entidades',
            modal    : true,
            height   : 350,
            width    : '30%',
            closable : true,
            constrain: true,
            resizable: false,
            layout   : 'fit',
            items    : [this.pEstEntidades],
            buttons  : [this.btnAceptarEntidades],
            keys     : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarEntidades.handler();
                    }
                }
            ]
        });

        this.winEstEntidades.show();


        /********************************Modulos**********************************/
        this.stModulos = new Ext.data.Store({
            url   : '/pvd/maestro/configuraciones/index.php/importarexcel/obtenerModulos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad",
                    root      : "datos",
                    id        : "iddominio"}, [
                    {name: 'iddominio'},
                    {name: 'denominacion'}
                ])
        });

        this.smModulos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpModulos = new Ext.grid.GridPanel({
            store        : this.stModulos,
            region       : 'center',
            collapsible  : true,
            autoExpandMax: 200,
            border       : true,
            loadMask     : {text: 'Cargando...'},
            width        : 300,
            columns      : [
                {header: 'iddominio', dataIndex: 'iddominio', hidden: true},
                {header: 'Denominación', dataIndex: 'denominacion', width: 250}
            ],
            sm           : this.smModulos
        });

        this.pModulos = new Ext.Panel({
            title      : 'Módulos',
            region     : 'west',
            layout     : 'fit',
            width      : '50%',
            collapsible: false,
            split      : true,
            items      : [this.gpModulos]
        });

        /********************************Modulos**********************************/

        /********************************Elementos**********************************/

        this.stElementos = new Ext.data.Store({
            url   : '/pvd/maestro/configuraciones/index.php/importarexcel/obtenerElementos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad",
                    root      : "datos",
                    id        : "idelemento"}, [
                    {name: 'idelemento'},
                    {name: 'denominacion'}
                ])
        });

        this.smElementos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpElementos = new Ext.grid.GridPanel({
            store        : this.stElementos,
            region       : 'center',
            collapsible  : true,
            autoExpandMax: 200,
            border       : true,
            loadMask     : {text: 'Cargando...'},
            width        : 300,
            columns      : [
                {header: 'idelemento', dataIndex: 'idelemento', hidden: true},
                {header: 'Denominación', dataIndex: 'denominacion', width: 250}
            ],
            sm           : this.smElementos
        });

        this.pElementos = new Ext.Panel({
            title      : 'Elementos',
            region     : 'center',
            layout     : 'fit',
            width      : '50%',
            collapsible: false,
            split      : true,
            items      : [this.gpElementos]
        });
        /********************************Elementos**********************************/

        this.pOeste = new Ext.Panel({
            //title      : 'Listado de configuraciones por documentos',
            region     : 'west',
            layout     : 'border',
            width      : '30%',
            collapsible: false,
            split      : true,
            items      : [this.pModulos, this.pElementos]
        });


        //Panel de Documentos
        this.rbLineal = new Ext.form.Radio({
            boxLabel  : 'Lineal',
            name      : 'formacalculo',
            inputValue: 1

        });

        this.rbRango = new Ext.form.Radio({
            boxLabel  : 'Rango',
            name      : 'formacalculo',
            inputValue: 2,
            checked   : true
        });

        this.rgObtencionCampo = new Ext.form.RadioGroup({
            fieldLabel: 'Tipo de obtención de los campos',
            height    : 50,
            width     : 350,
            hideLabel : false,
            items     : [this.rbRango, this.rbLineal]
        });

        this.nfFilaInicial = new Ext.form.NumberField({
            id           : 'idnfFilaInicial',
            fieldLabel   : 'Fila Inicial',
            name         : 'filainicial',
            allowBlank   : false,
            width        : 60,
            blankText    : 'Este campo es obliglatorio',
            maxLength    : 6,
            maxLengthText: 'El máximo permitido es de 6 caracteres'
        });

        this.nfFilaFinal = new Ext.form.NumberField({
            id           : 'idnfFilaFinal',
            fieldLabel   : 'Fila Final',
            name         : 'filafinal',
            allowBlank   : false,
            width        : 60,
            blankText    : 'Este campo es obliglatorio',
            maxLength    : 6,
            maxLengthText: 'El máximo permitido es de 6 caracteres'
        });

        this.tfColumnaMacheo = new Ext.form.TextField({
            id           : 'idtfColumnaMacheo',
            fieldLabel   : 'Columna de macheo',
            name         : 'columnamacheo',
            allowBlank   : false,
            width        : 120,
            blankText    : 'Este campo es obliglatorio',
            maxLength    : 6,
            maxLengthText: 'El máximo permitido es de 6 caracteres'
        });
        this.tfFormato = new Ext.form.TextField({
            id           : 'idtfFormato',
            fieldLabel   : 'Formato',
            name         : 'formato',
            allowBlank   : false,
            width        : 60,
            blankText    : 'Este campo es obliglatorio',
            maxLength    : 6,
            maxLengthText: 'El máximo permitido es de 6 caracteres'
        });

        this.btnAyuda = new Ext.Button({
            id     : 'btnAyudaImpExcel',
            text   : 'Ayuda',
            tooltip: 'Ayuda',
            iconCls: 'ayuda'

        });

        this.btnGuardarConfiguracion = new Ext.Button({
            id      : 'btnGuardarConfiguracion',
            text    : 'Guardar',
            tooltip : 'Guardar',
            disabled: true,
            iconCls : 'guardar'
        });

        var anchoFP = document.width - (0.30 * document.width - 10);

        this.fpConfiguracion = new Ext.FormPanel({
            region    : 'north',
            height    : '30%',
            width     : '100%',
            labelAlign: 'top',
            frame     : true,
            bodyStyle : {
                padding: '10px 10px 10px 10px'
            },
            items     : [
                {
                    xtype     : 'fieldset',
                    title     : 'Elementos de configuración',
                    autoHeight: true,
                    width     : '99%',
                    region    : 'center',
                    items     : [
                        {
                            layout: 'column',
                            region: 'center',
                            width : 800,
                            items : [
                                {columnWidth: .45, layout: 'form', items: [this.rgObtencionCampo]},
                                {columnWidth: .10, layout: 'form', items: [this.nfFilaInicial]},
                                {columnWidth: .10, layout: 'form', items: [this.nfFilaFinal]},
                                {columnWidth: .2, layout: 'form', items: [this.tfColumnaMacheo]},
                                {columnWidth: .15, layout: 'form', items: [this.tfFormato]}
                            ]
                        }
                    ]
                }
            ]
        });

        this.stCamposReporte = new Ext.data.Store({
            //url   : '/pvd/maestro/configuraciones/index.php/importarexcel/obtenerElementos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cant",
                    root      : "datos",
                    id        : "idcampo"}, [
                    {name: 'idcampo'},
                    {name: 'denominacion'},
                    {name: 'columna'},
                    {name: 'fila'}
                ])
        });

        this.smCamposReporte = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.tfColumnaExcel = new Ext.form.TextField({
            id           : 'idnfColumnaExcel',
            name         : 'columnaexcel',
            allowBlank   : false,
            width        : 60,
            blankText    : 'Este campo es obliglatorio',
            maxLength    : 6,
            maskRe       : /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            regex        : /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            maxLengthText: 'El máximo permitido es de 6 caracteres'
        });

        this.nfFilaExcel = new Ext.form.NumberField({
            id           : 'idtfFilaExcel',
            name         : 'formato',
            allowBlank   : false,
            width        : 60,
            blankText    : 'Este campo es obliglatorio',
            maxLength    : 6,
            maxLengthText: 'El máximo permitido es de 6 caracteres'
        });

        this.gpCamposReporte = new Ext.grid.EditorGridPanel({
            title           : 'Listado de campos',
            store           : this.stCamposReporte,
            region          : 'center',
            collapsible     : true,
            autoExpandMax   : 300,
            autoExpandcolumn: 'denominacion',
            height          : '70%',
            border          : true,
            loadMask        : {text: 'Cargando...'},
            width           : 300,
            columns         : [
                {header: 'idcampo', dataIndex: 'idcampo', hidden: true},
                {header: 'Denominación', dataIndex: 'denominacion', id: 'denominacion', width: 250, renderer: centrarValor},
                {header: 'Columna', dataIndex: 'columna', width: 70, editor: this.tfColumnaExcel, renderer: centrarValor},
                {header: 'Fila', dataIndex: 'fila', width: 60, editor: this.nfFilaExcel, renderer: centrarValor}
            ],
            sm              : this.smCamposReporte
        });

        this.pCentral = new Ext.Panel({
            title      : 'Configuración de importación de excel',
            tbar       : [this.btnGuardarConfiguracion, '->', this.btnAyuda],
            region     : 'center',
            layout     : 'border',
            width      : '70%',
            collapsible: true,
            split      : true,
            items      : [this.fpConfiguracion, this.gpCamposReporte]
        });


        //Ventana principal
        this.winImportarExcelPrincipal = new Ext.Window({
            title      : 'Configuraci&oacute;n de la importación de excel',
            modal      : true,
            constrain  : true,
            resizable  : false,
            layout     : 'border',
            closeAction: 'hide',
            items      : [this.pCentral, this.pOeste]
        });


        /*********************Eventos**************************/
        function obtenerConfiguracion() {
            PVD.mostrarMascara('idmaskobtenerconfig', 'Por favor espere...', 'Cargando datos de configuración');
            Ext.Ajax.request({
                url     : '/pvd/maestro/configuraciones/index.php/importarexcel/obtenerConfiguracion',
                method  : 'POST',
                params  : {
                    identidad : variables.identidad,
                    iddominio : variables.idmodulo,
                    idelemento: variables.idelemento
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    self.stCamposReporte.loadData(responseData.datos.listadocampos);
                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmaskobtenerconfig');
                    if (responseData.datos.elementosconfiguracion.length > 0) {
                        var extension = responseData.datos.elementosconfiguracion[0]['extension'];
                        var tipoconfiguracion = responseData.datos.elementosconfiguracion[0]['tipoconfiguracion'];
                        var columnaclavebusqueda = responseData.datos.elementosconfiguracion[0]['columnaclavebusqueda'];
                        var filainicial = responseData.datos.elementosconfiguracion[0]['filainicial'];
                        var filafinal = responseData.datos.elementosconfiguracion[0]['filafinal'];

                        if (tipoconfiguracion == 1) {
                            self.rbLineal.setValue(true);
                            self.rbRango.setValue(false);
                        } else {
                            self.rbLineal.setValue(false);
                            self.rbRango.setValue(true);
                        }
                        self.tfFormato.setValue(extension);
                        self.tfColumnaMacheo.setValue(columnaclavebusqueda);
                        self.nfFilaInicial.setValue(filainicial);
                        self.nfFilaFinal.setValue(filafinal);
                    }


                    mostrarMensaje(1, "Los datos de configuración han sido cargados satisfactoriamente.");

                }
            });
        }

        function dameListadoCamposModificados() {
            var filasModificadas = self.stCamposReporte.getModifiedRecords();
            var arrayFilasModificadas = new Array();

            for (var i = 0; i < filasModificadas.length; i++) {
                arrayFilasModificadas[i] = filasModificadas[i].data;
            }
            return arrayFilasModificadas;
        }

        function dameObjetoElementosConfiguracion() {
            var arrayElementosConfiguracion = {
                tipoconfiguracion   : variables.obtencioncampos,
                filainicial         : self.nfFilaInicial.getValue(),
                filafinal           : self.nfFilaFinal.getValue(),
                columnaclavebusqueda: self.tfColumnaMacheo.getValue(),
                extension           : self.tfFormato.getValue()
            };
            //console.log(arrayElementosConfiguracion); return;
            return arrayElementosConfiguracion;
        }

        function guardarConfiguracion() {
            var arrayElementosConfiguracion = dameObjetoElementosConfiguracion();
            var arrayFilasModificadas = dameListadoCamposModificados();
            PVD.mostrarMascara('idmaskguardarconfig', 'Por favor espere...', 'Guardando datos de configuración');
            Ext.Ajax.request({
                url     : '/pvd/maestro/configuraciones/index.php/importarexcel/guardarConfiguracion',
                method  : 'POST',
                params  : {
                    identidad                  : variables.identidad,
                    iddominio                  : variables.idmodulo,
                    idelemento                 : variables.idelemento,
                    arraycamposmodificados     : Ext.encode(arrayFilasModificadas),
                    arrayelementosconfiguracion: Ext.encode(arrayElementosConfiguracion)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmaskguardarconfig');
                    if (responseData.codigo == 1) {
                        mostrarMensaje(1, "Los datos de configuración han sido guardado satisfactoriamente.");
                    } else {
                        mostrarMensaje(3, "Hubo un error al guardar los datos de configuración.");
                    }


                }
            });
        }

        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }


        //Eventos del objeto del ábol de entidades.
        this.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            if (nodo.attributes.tipoestructura == 3
                || nodo.attributes.tipoestructura == 1 ||
                nodo.attributes.tipoestructura == 2 ||
                nodo.attributes.tipoestructura == 4 ||
                nodo.attributes.tipoestructura == 5) {
                variables.identidad = nodo.id;
                variables.denominacionentidad = nodo.text;
                self.btnAceptarEntidades.enable();
            } else {
                variables.identidad = null;
                variables.denominacionentidad = '';
                self.btnAceptarEntidades.disable();
            }
        });

        this.btnAceptarEntidades.setHandler(function () {
            if (variables.identidad != null) {
                //Cargar los documentos firmas
                // self.winEstEntidades.hide();
                self.winImportarExcelPrincipal.show();
                self.winImportarExcelPrincipal.maximize();
                self.stModulos.load();

            }
        });

        this.smModulos.on('rowselect', function (sm, index, record) {
            variables.idmodulo = record.data.iddominio;
            self.stElementos.load({
                params: {
                    idmodulo: variables.idmodulo
                }});

        });

        this.rbRango.on('check', function (_this, checked) {
            if (checked) {
                self.nfFilaFinal.enable();
                variables.obtencioncampos = 2;
            }

        });

        this.rbLineal.on('check', function (_this, checked) {
            if (checked) {
                self.nfFilaFinal.disable();
                variables.obtencioncampos = 1;
            }

        });

        this.smElementos.on('rowselect', function (sm, index, record) {
            if (variables.idmodulo == 4) {
                variables.idelemento = record.data.idelemento;
                //console.log(record.data);
                obtenerConfiguracion();
            }
        });

        this.stCamposReporte.on('beforeload', function (st_this, options) {
            self.btnGuardarConfiguracion.disable();
        });

        self.btnGuardarConfiguracion.setHandler(function () {
            if(self.fpConfiguracion. getForm().isValid()){
                guardarConfiguracion();
            }else{
                mostrarMensaje(1, "Existen campos sin llenar.");
            }

        });

        this.stCamposReporte.on('load', function (Store, records, options) {
            self.btnGuardarConfiguracion.enable();
        });

        /*********************FIN Eventos**************************/
        Pvd.Maestro.Configuraciones.CmpImportarExcel.superclass.initComponent.call(this);
    }
});