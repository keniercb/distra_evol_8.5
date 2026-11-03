/**
 * @Created with PhpStorm.
 * @Author: Roberto León Socarrás
 * @package Beta
 * @subpackage Wand
 * @Date: 3/3/16
 * @Version:1.0
 */
Ext.ns('Misitio.Panel');
Misitio.Panel.PanelReportes = Ext.extend(Ext.Panel,
    {
        id: ''
        , consulta: ''
        , metodo: ''
        /**
         * array de configuracion
         * ej:
         *  var configuracion = new Array(
         {nombre: 'id', index: 'id', tipo: 'texto'},
         {nombre: 'fecha', index: 'fecha', tipo: 'fecha'},
         {nombre: 'numero', index: 'numero', tipo: 'numero'},
         {nombre: 'sexo', index: 'sexo', tipo: 'bool'}
         );
         configuracion: configuracion,
         */
        , configuracion: new Array()
        , filtro: false
        , autoCargar: true
        , ocultarBtnActualizar: false
        ,
        initComponent: function () {
            var self = this;
            self.datosStore = null;
            self.variables = {
                indiceId: undefined,


                campoAmostrar: new Array(),
                campoValor: new Array(),
                filasAmodificar: new Array(),
                numColCampoLista: new Array(),
                filasStoreDelCombo: new Array()
            };


            self.btnActualizarReportes = new Ext.Button({
                text: "Actualizar",
                hidden: self.ocultarBtnActualizar,
                tooltip: "Actualiza la vista",
                iconCls: 'actualizar',
                id: "btnActualizarReportes" + self.id,
                handler: function () {
                    self.actualizarVista(self);
                    mostrarMensaje(1, 'Vista actualizada correctamente.');
                }
            });

            self.btnVerDetalles = new Ext.Button({
                text: "Ver detalles",
                hidden: false,
                disabled: true,
                tooltip: "Muestra detalles del elemento seleccionado.",
                iconCls: 'ver',
                id: "btnVerDetalles" + self.id,
                handler: function () {
                    self.verDetalles(self, self.lastFilaseleccionada);

                }
            });

            self.csm = new Ext.grid.CheckboxSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function (sm, rowIndex, r) {

                    },
                    rowdeselect: function (sm, rowIndex, r) {

                    }
                }
            });


            self.camposGrid = new Array();
            self.camposStore = new Array();
            self.Filtros = new Array();
            self.camposGrid.push(new Ext.grid.RowNumberer());
            // self.camposGrid.push(self.csm);

            for (var i = 0; i < self.configuracion.length; i++) {
                if (self.configuracion[i].nombre == 'id') {
                    self.configuracion[0]['idconfiguracion'] = self.configuracion[i].index;
                }
            }

            self.configuracion[0]['idelemento'] = self.id;
            for (var i = 0; i < self.configuracion.length; i++) {

                var campo = self.configuracion[i];
                var editor = '';
                var ancho = 200;
                var tipo = 'string';

                var renderer = null;
                switch (campo.tipo) {
                    case 'texto':

                        self.Filtros.push({
                            type: 'string',
                            dataIndex: campo.index
                        });

                        break;
                    case 'numero':

                        self.Filtros.push({
                            type: 'numeric',
                            dataIndex: campo.index
                        });

                        tipo = 'float';
                        break;
                    case 'fecha':

                        self.Filtros.push({
                            type: 'date',
                            dataIndex: campo.index
                        });
                        renderer = Ext.util.Format.dateRenderer('j-m-Y');
                        tipo = 'date';
                        break;
                    case 'lista':

                        self.Filtros.push(
                            {
                                type: 'string',
                                dataIndex: campo.index
                            }
                        );


                        tipo = 'string';
                        break;
                    case 'logico':

                        self.Filtros.push({
                            type: 'boolean',
                            dataIndex: campo.index
                        });
                        renderer = self.cambiarRadio;
                        ancho = 50;

                        tipo = 'boolean';
                        break;

                    case 'imagen':
                        ancho = campo.ancho;
                        self.Filtros.push({
                            type: 'string',
                            dataIndex: campo.index
                        });
                        renderer = function (val) {
                            var size = 30;
                            if (val) {
                                return "<img class='imagen' src=" + val + " width='" + size + "' height='" + size + "' />";
                            }
                            return "<center></center><img src=../imagenes/no-photo-male.png width='" + size + "' height='" + size + "' />";

                        }.createDelegate(self);

                        tipo = 'string';

                        break;

                    default:
                        self.Filtros.push({
                            type: 'string',
                            dataIndex: campo.index
                        });

                        tipo = 'string';
                        break;
                }


                self.camposStore.push({
                    name: campo.index,
                    type: tipo
                });

                if (campo.nombre == 'id') {
                    self.variables.indiceId = campo.index;
                    self.camposGrid.push({
                        id: campo.index + 'campoGrid' + self.id,
                        header: campo.nombre,
                        dataIndex: campo.index,
                        sortable: false,
                        hidden: true,
                        hideable: false
                    });
                } else {
                    self.camposGrid.push({
                        id: campo.index + 'campoGrid' + self.id,
                        header: campo.nombre,
                        dataIndex: campo.index,
                        editor: (campo.oculto) ? null : editor,
                        renderer: (campo.oculto) ? null : renderer,
                        sortable: true,
                        hidden: (campo.oculto) ? campo.oculto : false,
                        width: (campo.ancho) ? campo.ancho : ancho,
                        hideable: (campo.oculto) ? false : true
                    });

                }
            }

            self.store = new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos",
                    id: self.variables.indiceId,
                    fields: self.camposStore
                })
            });


            self.gpReportes = new Ext.grid.GridPanel({
                id: self.id + 'gpReportes',
                store: self.store,
                layout: 'fit',
                border: false,
                sm: self.csm,
                width: '100%',
                columns: self.camposGrid,
                viewConfig: {
                    getRowClass: function (record, rowIndex, p, store) {
                        if (record.get(self.variables.indiceId) == undefined) {
                            //return 'FilaMorada';
                            return 'FilaVerde';
                        }
                        if (record.get('cambio') == 'deleted') {
                            return 'FilaRoja';
                        }

                        if (record.get('cambio') == 'modified') {
                            return 'FilaAzul';
                        }
                        //return 'FilaGrisClara';
                        return 'FilaGris';
                        //return 'FilaAzul';
                    }
                },

                plugins: new Ext.grid.GridFilters({
                    local: true,
                    store: self.store,
                    filters: self.Filtros
                })
            });

            if (self.autoCargar) {
                self.listarFilas(self, false);
            }


            //Obtener la ultima fila seleccionada
            self.ultimaFilaSeleccionada = -1;
            var hisNodosSeleccionados = new Array();
            self.lastFilaseleccionada = null;
            var miArray = new Array();
            var indiceFila = -1;
            self.gpReportes.selModel.on('rowselect', function (_this, rowIndex, record) {
                var id = record.id;
                indiceFila = miArray.indexOf(id);
                if (indiceFila == -1) {
                    hisNodosSeleccionados.push(record);
                    miArray.push(id);
                    self.btnVerDetalles.enable();

                }

                self.ultimaFilaSeleccionada = rowIndex;
                self.lastFilaseleccionada = record;
                self.fireEvent('elementochequeado', {
                    record: record,
                    rowindex: rowIndex
                });

            });

            self.gpReportes.selModel.on('rowdeselect', function (_this, rowIndex, record) {
                var id = record.id;
                indiceFila = miArray.indexOf(id);
                miArray.remove(id);
                hisNodosSeleccionados.remove(hisNodosSeleccionados[indiceFila]);
                if (miArray.length == 0) {
                    self.btnVerDetalles.disable();
                }
                self.lastFilaseleccionada = hisNodosSeleccionados[hisNodosSeleccionados.length - 1];
                self.fireEvent('elementodeschequeado', {
                    record: record,
                    rowindex: rowIndex
                });
            });


            Ext.apply(this, {
                layout: 'fit',
                tbar: [self.btnActualizarReportes, self.btnVerDetalles],
                items: [self.gpReportes]
            });

            Misitio.Panel.PanelReportes.superclass.initComponent.apply(this);

        }
        ,
        actualizarVista: function (self) {
            self.listarFilas(self);
        }
        ,
        listarFilas: function (self, nuevaConsulta) {

            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: 'mostrarReporte',
                    consulta: (nuevaConsulta) ? nuevaConsulta : self.consulta
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    if (respuesta.success) {
                        self.store.loadData(respuesta);
                        self.datosStore = respuesta;

                        if (respuesta.datos.length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        }


                    } else {
                        var error = respuesta.error;
                        self.mostrarError(error, self, 1);
                    }

                }
            });
        }
        ,
        errorAsString: function (error) {
            var i = 0, errorString = '**';
            for (i = 0; i < error.length; i++) {

                errorString += '************** Error: ' + i + ' ********************' + '</br></br>';
                errorString += '-Basedato: ' + error[i].basedato + '</br>';
                errorString += '-Host: ' + error[i].host + '</br>';
                errorString += '-Código: ' + error[i].code + '</br>';
                errorString += '-Error: ' + error[i].error + '</br>';
                errorString += '-Línea: ' + error[i].linea + '</br>';
                errorString += '-Fichero: ' + error[i].script + '</br>';
                errorString += '-Sql: ' + error[i].sql + '</br>';
                errorString += '-Traza: ' + error[i].traza + '</br>';

            }

            return errorString;
        }
        ,
        mostrarError: function (error, self, tipomensaje) {
            var errorString = self.errorAsString(error);
            var msg = '';
            if (tipomensaje == 1) {
                msg = 'Ocurrió un error al seleccionar los datos: <br/>' /*+ errorString*/;
            }

            if (error[0] && error[0].code == 23503) {
                Ext.Msg.show({
                    title: 'Información',
                    msg: 'El elemento no se puede eliminar porque se encuentra en uso.',
                    buttons: Ext.Msg.OK,
                    animEl: 'elId',
                    icon: Ext.MessageBox.INFO
                });
            } else {
                self.mostrarMensaje(msg, errorString);
            }
        }
        ,
        mostrarMensaje: function (msg, detalle) {
            var ventanaError = new Ext.Window({
                title: ' Error ',
                modal: true,
                width: 500,
                minWidth: 500,
                buttonAlign: 'center',
                autoHeight: true,
                bodyBorder: false,
                layout: 'fit',
                defaults: {
                    frame: true,
                    border: false
                },
                items: new Ext.Panel({
                    frame: true,
                    monitorResize: true,
                    autoHeight: true,
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .15,
                            items: {
                                style: 'margin:2px 0px 0px 2px;',
                                html: '<div id="pIconoERROR" class="iconoERROR"></div>'
                            }
                        },
                        {
                            columnWidth: .75,
                            items: {
                                xtype: 'panel',
                                autoHeight: true,
                                html: '<div id="pMSG">' + msg + '</div>'
                            }
                        },
                        {
                            columnWidth: 1,
                            items: new Ext.form.FieldSet({
                                id: 'ventanaError',
                                autoScroll: true,
                                layout: 'form',
                                title: ' Detalles : ',
                                autoWidth: true,
                                html: '<div id="pDetalle"><pre>' + detalle + '</pre></div>',
                                height: 150,
                                collapsed: true,
                                collapsible: true
                            })
                        }
                    ]
                }),
                buttons: [
                    {
                        text: 'Aceptar',
                        handler: function () {
                            ventanaError.hide();
                            if (typeof (fn) == 'function')
                                fn();
                        }
                    }
                ]
            });

            Ext.getCmp('ventanaError').collapse();
            ventanaError.doLayout(true);
            ventanaError.show();
            document.getElementById("pMSG").innerHTML = msg;
            document.getElementById("pDetalle").innerHTML = detalle;
        }
        ,
        getGridPanel: function (self) {
            return self.gpReportes;
        }
        ,
        setGridPanel: function (self, gp) {
            self.gpReportes = gp;
        }
        ,
        dameDatosStore: function (self) {
            return self.datosStore;
        }
        ,
        verDetalles: function (self, record) {

            var data = new Array();

            for (var i = 0; i < self.configuracion.length; i++) {
                var columna = self.configuracion[i].nombre;
                var tipo = self.configuracion[i].tipo;
                var campoValor = self.configuracion[i].campoValor;
                var campoAmostrar = self.configuracion[i].campoAmostrar;
                var valor = record.data[self.configuracion[i].index];
                if (tipo == 'lista') {
                    var pos = self.configuracion[i].StoreCombo.findBy(function (rec, id) {
                        console.log(rec.data);
                        console.log(campoValor);
                        console.log(valor);
                        if (rec.data[campoValor] == valor) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if (pos != -1) {
                        valor = (self.configuracion[i].StoreCombo.getAt(pos).data)[campoAmostrar];
                    }
                }
                if (!valor) {
                    valor = 'No tiene ' + columna.toLowerCase();
                }
                if (tipo == 'fecha') {
                    valor = new Date(valor).format('j-m-Y');
                }

                if (tipo == 'logico') {
                    valor = (valor == true) ? 'Sí' : 'No';
                }
                data.push({
                    columna: columna, tipo: tipo, valor: valor
                });
            }

            Misitio.Funciones.VentanaDetalles({id: 'ventanaDetallesEditorGridPanel', configuracion: data});


        }
        ,
        cambiarConsulta: function (self, nuevaConsulta) {
            self.listarFilas(self, nuevaConsulta);
        }
        ,
        dameSelectionModel: function (self) {
            return self.csm;
        }

    }
);


Misitio.Panel.PanelReportesAvanzado = Ext.extend(Misitio.Panel_Gestion.GestionGridPanel,
    {

        consulta: ''
        , metodo: ''
        , autoCargar: false
        , ocultarbtnModificar: true
        , ocultarbtnAdicionar: true
        , ocultarbtnEliminar: true
        , ocultarBtnActualizar: false
        ,
        initComponent: function () {
            this.autoCargar = true;
            this.urlListar = 'mostrarReporte';
            var self = this;

            self.btnGenerarReporte = new Ext.Button({
                id: 'btnGenerarReporte' + self.id,
                text: 'Exportar',
                iconCls: 'exportar',
                tooltip: 'Exportar',
                handler: function () {
                     var winReporteEvento = new Misitio.Panel.ventanaReporte({
                         idioma: self.idioma,
                         parent: self
                     });
                     winReporteEvento.show();

                }
            });
            Ext.apply(this, {
                layout: 'fit',
                //tbar:[self.btnGenerarReporte]

            });
            self.listarFilas(self);

            self.on('render', function () {
                self.getTopToolbar().addButton(self.btnGenerarReporte);

               /* self.btnVerDetalles.on('enable', function () {
                    console.log(self.getTopToolbar().items.items);
                    self.getTopToolbar().items.items[4].enable();

                });

                self.btnVerDetalles.on('disable', function () {
                    console.log(self.getTopToolbar().items.items);
                    self.getTopToolbar().items.items[4].disable();
                });*/

            });

            Misitio.Panel.PanelReportesAvanzado.superclass.initComponent.apply(this);

        }
        , listarFilas: function (self, nuevaConsulta) {

        Ext.Ajax.request({
            url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
            method: 'POST',
            params: {
                metodo: 'mostrarReporte',
                consulta: (nuevaConsulta) ? nuevaConsulta : self.consulta
            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);

                if (respuesta.success) {
                    self.store.loadData(respuesta);
                    self.datosStore = respuesta;

                    if (respuesta.datos.length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    }


                } else {
                    var error = respuesta.error;
                    self.mostrarError(error, self, 1);
                }

            }
        });
    }


    }
);

Misitio.Panel.ventanaReporte = Ext.extend(Ext.Window, {
    initComponent : function () {
        var self = this;
        this.tiporeporte = 'Exel';
        this.tipovisualizacion = 'General';

        //this.formatExcel = false;
        this.formatExcel = '';

        var btnAcpReporte = new Ext.Button({
            nextTab: 'denominacion',
            id     : 'btnAcpReporte&',
            iconCls: 'aceptar',
            text   : 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            handler: function () {
                if (this.aceptarReporte(true))
                    this.destroy();
            }.createDelegate(this)
        });
        var btnCancReporte = new Ext.Button({
            disabled: false,
            id      : 'btnCancReporte&',
            tooltip : 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            iconCls : 'cancelar',
            text    : 'Cancelar',
            handler : function () {
                this.destroy();
            }.createDelegate(this)
        });
        this.layout = 'fit',
            this.modal = true;
        this.closeAction = 'destroy';
        this.title = 'Seleccionar formato';
        this.resizable = false;
        this.width = 385;
        this.height = 300;
        this.buttons = [btnCancReporte, btnAcpReporte];
        this.keys = [
            {
                key      : Ext.EventObject.ENTER,
                stopEvent: true,
                fn       : function () {
                    btnAcpReporte.handler();
                }
            },
            {
                key      : 'x',
                alt      : true,
                stopEvent: true,
                fn       : function () {
                    btnCancReporte.handler();
                }
            }
        ];

        this.radioGeneral = new Ext.form.Radio({
            disabled : true,
            hideLabel: true,
            id       : 'rad3',
            align    : 'center',
            boxLabel : 'General',
            name     : 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        if(self.formatExcel=='excel'){
                            self.tiporeporte = 'Excel';
                            self.tipovisualizacion = 'General';
                            btnAcpReporte.enable();
                        }
                        else if(self.formatExcel=='pdf')
                        {
                            self.tiporeporte = 'Pdf';
                            self.tipovisualizacion = 'General';
                            btnAcpReporte.enable();
                        }else{
                            self.tiporeporte = 'Word';
                            self.tipovisualizacion = 'General';
                            btnAcpReporte.enable();
                        }

                    }
                }.createDelegate(this)
            }
        });
        this.radioPlantillas = new Ext.form.Radio({
            disabled : true,
            hideLabel: true,
            id       : 'rad4',
            align    : 'center',
            boxLabel : 'Página actual',
            name     : 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        if(self.formatExcel=='excel'){
                            self.tiporeporte = 'Excel';
                            self.tipovisualizacion = 'Plantillas';
                            btnAcpReporte.enable();
                        }
                        else if(self.formatExcel=='pdf')
                        {   self.tiporeporte = 'Pdf';
                            self.tipovisualizacion = 'Plantillas';
                            btnAcpReporte.enable();
                        }else{
                            self.tiporeporte = 'Word';
                            self.tipovisualizacion = 'Plantillas';
                            btnAcpReporte.enable();
                        }

                    }
                }.createDelegate(this)
            }
        });

        this.radioSeleccionado = new Ext.form.Radio({
            disabled : true,
            hideLabel: true,
            id       : 'rad8',
            align    : 'center',
            boxLabel : 'Personas seleccionadas',
            name     : 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        if(self.formatExcel=='excel'){
                            self.tiporeporte = 'Excel';
                            self.tipovisualizacion = 'Seleccionado';
                            btnAcpReporte.enable();
                        }
                        else if(self.formatExcel=='pdf')
                        {   self.tiporeporte = 'Pdf';
                            self.tipovisualizacion = 'Seleccionado';
                            btnAcpReporte.enable();
                        }else{
                            self.tiporeporte = 'Word';
                            self.tipovisualizacion = 'Seleccionado';
                            btnAcpReporte.enable();
                        }

                    }
                }.createDelegate(this)
            }
        });

        this.fsRadiosPdf = new Ext.form.FieldSet({
            autoHeight : true,
            defaultType: 'radio',
            items      : [
                this.radioGeneral,
                this.radioPlantillas,
                this.radioSeleccionado
            ]
        });

        this.items = [
            {
                bodyStyle: 'padding-left:5px;',
                frame    : true,
                items    :

                    {
                        xtype      : 'fieldset',
                        title      : 'Formatos',
                        autoHeight : true,
                        defaultType: 'radio',  // each item will be a radio button
                        items      : [
                            {
                                xtype     : 'radio',
                                hideLabel : true,
                                id        : 'rad1',
                                align     : 'center',
                                boxLabel  : 'Hojas de c&aacute;lculo (EXEL)',
                                name      : 'tipoacceso',
                                inputValue: 'ultimo',
                                listeners : {
                                    'check': function (obj, ischeck) {
                                        if (ischeck) {
                                            btnAcpReporte.disable();
                                            this.radioGeneral.enable();
                                            this.radioPlantillas.enable();
                                            this.radioSeleccionado.enable();
                                            self.formatExcel = 'excel';

                                        }
                                    }.createDelegate(this)
                                }
                            },
                            {
                                xtype     : 'radio',
                                hideLabel : true,
                                align     : 'center',
                                boxLabel  : 'Formato de documento port&aacute;til (PDF)',
                                id        : 'rad2',
                                name      : 'tipoacceso',
                                inputValue: 'nuevo',
                                listeners : {
                                    'check': function (obj, ischeck) {
                                        if (ischeck) {
                                            btnAcpReporte.disable();
                                            self.formatExcel = 'pdf';
                                            this.radioGeneral.enable();
                                            this.radioPlantillas.enable();
                                            this.radioSeleccionado.enable();
                                        }
                                    }.createDelegate(this)
                                }
                            },
                            {
                                xtype     : 'radio',
                                hideLabel : true,
                                id        : 'rad',
                                align     : 'center',
                                boxLabel  : 'Formato word (DOC)',
                                name      : 'tipoacceso',
                                inputValue: 'ultimo',
                                listeners : {
                                    'check': function (obj, ischeck) {
                                        if (ischeck) {
                                            btnAcpReporte.disable();
                                            this.radioGeneral.enable();
                                            this.radioPlantillas.enable();
                                            this.radioSeleccionado.enable();
                                            self.formatExcel = 'word';

                                        }
                                    }.createDelegate(this)
                                }
                            },
                            this.fsRadiosPdf
                        ]
                    }
            }
        ];
        this.on('beforedestroy', function () {

        });
        Misitio.Panel.ventanaReporte.superclass.initComponent.call(this);
    },
    aceptarReporte:function(){
        this.parent.exportarReporte(this.tiporeporte,this.tipovisualizacion);
        self.close();

    }
});
