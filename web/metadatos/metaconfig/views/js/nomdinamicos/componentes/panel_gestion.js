/**
 * @Created with PhpStorm.
 * @Author: Roberto León Socarrás
 * @package Beta
 * @subpackage Wand
 * @Date: 3/3/16
 * @Version:1.0
 */
Ext.ns('Misitio.Panel_Gestion');

var Grid = -1;
/*Misitio.Panel_Gestion.GestionGridPanel111 = Ext.extend(Ext.Panel,
    {
        title: ''
        , id: ''
        , nombre: ''
        , urlListar: false
        , urlGuardar: false
        , urlEliminar: false
        , tabla: ''
        , idtabla: ''
        /!**
         * array de configuracion
         * ej:
         *  var configuracion = new Array(
         {nombre: 'id', index: 'id', tipo: 'texto'},
         {nombre: 'fecha', index: 'fecha', tipo: 'fecha'},
         {nombre: 'numero', index: 'numero', tipo: 'numero'},
         {nombre: 'sexo', index: 'sexo', tipo: 'bool'}
         );
         configuracion: configuracion,
         *!/
        , configuracion: new Array()
        , configuracionMensajes: false
        , filtro: false
        , autoCargar: true
        , anchoForm: false
        , singleSelect: false
        , ocultarbtnModificar: false
        , ocultarbtnAdicionar: false
        , ocultarbtnEliminar: false
        , ocultarbtnActualizar: false
        , ocultarbtnVerDetalles: false
        , ocultarbtnAsociarImagen: false
        ,
        initComponent: function () {

            var self = this;
            self.id = (self.id) ? self.id : Ext.id();
            self.configuracionMensajes = (self.configuracionMensajes)
                ? self.configuracionMensajes :
                {femenino: false, numero: ['concepto', 'conceptos']};
            self.nombre = self.nombre.toLowerCase();
            self.adicionar = true;
            self.mostrarBtnImagen = false;
            self.columnaImagen = null;
            self.cantCamposOcultos = 0;
            self.columnasFormulario = new Array();
            self.aplicar = false;
            self.cantCombos = 0;
            self.cantCombosCargados = 0;
            self.allCombosCargados = false;

            self.variables = {
                indiceId: undefined,
                campoamostrar: new Array(),
                campovalor: new Array(),
                filasAmodificar: new Array(),
                numColCampoLista: new Array(),
                filasStoreDelCombo: new Array()
            };

            self.btnModificar = new Ext.Button({
                text: "<u>M</u>odificar",
                hidden: self.ocultarbtnModificar,
                disabled: true,
                tooltip: "Modificar " + self.nombre + ' <b>(Alt+M)</b>',
                iconCls: 'modificar',
                id: "btnModificar" + self.id,
                handler: function () {
                    self.modificarFilas(self);
                }
            });

            self.btnAdicionar = new Ext.Button({
                text: "Ad<u>i</u>cionar",
                hidden: self.ocultarbtnAdicionar,
                tooltip: "Adicionar " + self.nombre + ' <b>(Alt+I)</b>',
                iconCls: 'adicionar',
                id: "btnAdicionar" + self.id,
                handler: function () {
                    self.adicionarFila(self);
                }
            });

            self.btnEliminar = new Ext.Button({
                text: "Eliminar",
                hidden: self.ocultarbtnEliminar,
                disabled: true,
                tooltip: "Eliminar " + self.nombre + ' <b>(DEL)</b>',
                iconCls: 'eliminar',
                id: "btnEliminar" + self.id,
                handler: function () {

                    var filasAeliminar = self.dameFilasAeliminar(self);
                    var tipoMensaje = 'confirmareliminar';
                    var plural = (filasAeliminar.length > 1) ? true : false;

                    var msg = self.dameMensaje(self, tipoMensaje, plural);

                    Ext.Msg.show({
                        title: 'Confirmación',
                        msg: msg,
                        buttons: Ext.Msg.YESNO,
                        fn: function (btn, text) {
                            if (btn == 'yes') {
                                self.eliminarFilas(self);
                            } else if (btn == 'no') {

                            }
                        },
                        animEl: 'elId',
                        icon: Ext.MessageBox.QUESTION
                    });


                }
            });

            self.btnActualizar = new Ext.Button({
                text: "Actualizar",
                hidden: self.ocultarbtnActualizar,
                tooltip: "Actualiza los datos",
                iconCls: 'actualizar',
                id: "btnActualizar" + self.id,
                handler: function () {
                    self.store.reload();
                    Ext.example.msg('Información', 'Vista actualizada correctamente.');
                }
            });

            self.btnVerDetalles = new Ext.Button({
                text: "Ver detalles",
                hidden: self.ocultarbtnVerDetalles,
                disabled: true,
                tooltip: "Muestra detalles del elemento seleccionado.",
                iconCls: 'detalles',
                id: "btnVerDetalles" + self.id,
                handler: function () {
                    self.verDetalles(self, self.lastFilaseleccionada);

                }
            });

            self.btnAsociarImagen = new Ext.Button({
                text: "Asociar imagen",
                hidden: self.ocultarbtnAsociarImagen,
                disabled: true,
                tooltip: "Asocia una imagen al elemento seleccionado",
                iconCls: 'asociar',
                id: "btnAsociarImagen" + self.id,
                handler: function () {
                    self.mostrarVentanaAsociarImagen(self);
                }
            });

            self.csm = new Ext.grid.RowSelectionModel({
                singleSelect: self.singleSelect,
                listeners: {
                    rowselect: function (sm, rowIndex, r) {
                        var seleccion = self.csm.getSelections();
                        if (seleccion.length > 0) {
                            self.btnEliminar.enable();
                            self.btnModificar.enable();
                            self.btnVerDetalles.enable();

                        } else {
                            self.btnEliminar.disable();
                            self.btnModificar.disable();
                            self.btnVerDetalles.disable();
                        }
                    },
                    rowdeselect: function (sm, rowIndex, r) {
                        var seleccion = self.csm.getSelections();
                        if (seleccion.length > 0) {
                            self.btnEliminar.enable();
                            self.btnModificar.enable();
                            self.btnVerDetalles.enable();
                        } else {
                            self.btnEliminar.disable();
                            self.btnModificar.disable();
                            self.btnVerDetalles.disable();

                        }
                    }
                }
            });


            self.camposGrid = new Array();
            self.contadorCamposFormulario = 0;
            self.contadorCamposResiduos = 0;
            self.columnaFormAncha = true;
            self.itemsFormulario = new Array();
            self.datosFiltro = new Array();
            self.columnasUnicas = new Array();
            self.itemsFormularioFiltro = new Array();
            self.elementosFormulario = {};
            self.camposStore = new Array();
            self.Filtros = new Array();
            self.nuevaConfiguracion = new Array();

            self.camposGrid.push(new Ext.grid.RowNumberer({header: "#", width: 23}));
            //self.camposGrid.push(self.csm);

            self.configuracion[0]['idelemento'] = self.id;
            for (var i = 0; i < self.configuracion.length; i++) {

                var campo = self.configuracion[i];
                var editor = undefined;
                var ancho = 200;
                var tipo = 'string';
                var hidden = false;
                var renderer = null;

                if (campo.nombre != 'id') {
                    switch (campo.tipo) {
                        case 'texto':
                            self.columnaTexto = campo.index;


                            var regexp = (campo.expresionregular) ? new RegExp(campo.expresionregular) : undefined;
                            var mensaje = (campo.expresionregular) ? campo.mensaje : undefined;


                            if (!campo.estextarea) {
                                if (!campo.espass) {
                                    self.campoTexto = new Ext.form.TextField({
                                        fieldLabel: campo.nombre,
                                        anchor: '99%',
                                        id: self.id + 'campoTexto' + campo.index,
                                        allowBlank: (campo.nulo == undefined) ? true : campo.nulo,
                                        regex: regexp,
                                        regexText: mensaje,
                                        maxLength: (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                        maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                        blankText: 'Este campo es obligatorio.',
                                        width: (campo.ancho) ? campo.ancho : ancho,
                                        name: campo.index,
                                    });
                                } else {
                                    self.campoTexto = new Ext.form.TextField({
                                        fieldLabel: campo.nombre,
                                        anchor: '99%',
                                        id: self.id + 'campoTexto' + campo.index,
                                        allowBlank: (campo.nulo == undefined) ? true : campo.nulo,
                                        regex: regexp,
                                        regexText: mensaje,
                                        blankText: 'Este campo es obligatorio.',
                                        maxLength: (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                        maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                        width: (campo.ancho) ? campo.ancho : ancho,
                                        inputType: 'password',
                                        name: campo.index,
                                    });
                                    renderer = function (val) {
                                        return "<center><img src='../imagenes/pass.PNG' /></center>";
                                    }
                                }

                            } else {

                                self.campoTexto = new Ext.form.TextArea({
                                    fieldLabel: campo.nombre,
                                    anchor: '99%',
                                    id: self.id + 'campoTexto' + campo.index,
                                    allowBlank: (campo.nulo == undefined) ? true : campo.nulo,
                                    regex: regexp,
                                    regexText: mensaje,
                                    maxLength: (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                    maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                    blankText: 'Este campo es obligatorio.',
                                    width: (campo.ancho) ? campo.ancho : ancho,
                                    name: campo.index
                                });
                            }


                            self.Filtros.push({
                                type: 'string',
                                dataIndex: campo.index
                            });

                            self.acomodarElementoFormGestion(self, self.campoTexto, campo, false);

                            self.elementosFormulario[campo.index] = self.campoTexto.id;
                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor: self.id + 'campoTexto' + campo.index,
                                        tipo: 'texto'
                                    });
                            }

                            break;
                        case 'numero':
                            self.campoNumero = campo.componente || new Ext.form.NumberField({
                                fieldLabel: campo.nombre,
                                id: self.id + 'campoNumero' + campo.index,
                                name: campo.index,
                                anchor: '99%',
                                allowBlank: (campo.nulo) ? campo.nulo : undefined,
                                width: (campo.ancho) ? campo.ancho : ancho,
                                allowDecimals: (campo.allowdecimals) ? campo.allowdecimals : undefined,
                                allowNegative: (campo.allownegative) ? campo.allownegative : undefined,
                                decimalPrecision: (campo.decimalprecision) ? campo.decimalprecision : undefined,
                                nanText: 'Este valor es incorrecto.',
                                blankText: 'Este campo es obligatorio.'
                            });
                            self.Filtros.push({
                                type: 'numeric',
                                dataIndex: campo.index
                            });
                            tipo = 'float';
                            self.acomodarElementoFormGestion(self, self.campoNumero, campo, false);

                            self.elementosFormulario[campo.index] = self.campoNumero.id;
                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor: self.campoNumero.id,
                                        tipo: 'numero'
                                    });
                            }
                            break;
                        case 'fecha':
                            self.campoFecha = (campo.componente) ? campo.componente : new Ext.form.DateField({
                                fieldLabel: campo.nombre,
                                id: self.id + 'campoFecha' + campo.index,
                                allowBlank: (campo.nulo) ? campo.nulo : undefined,
                                format: (campo.formato) ? campo.formato : 'd/m/Y',
                                editable: (campo.editable) ? campo.editable : false,
                                readOnly: (campo.readonly) ? campo.readonly : false,
                                anchor: '99%',
                                value: new Date().format('d/m/Y'),
                                blankText: 'Este campo es obligatorio.',
                                invalidText: 'Este valor es incorrecto.',
                                name: campo.index,
                                width: (campo.ancho) ? campo.ancho : ancho
                            });


                            self.campoFecha.fielLabel = campo.nombre;
                            self.campoFecha.name = campo.index;
                            //self.campoFecha.id=self.id + 'campoFecha' + campo.index;

                            self.Filtros.push({
                                type: 'date',
                                dataIndex: campo.index
                            });

                            //renderer = /!*(campo.formato)?Ext.util.Format.dateRenderer(campo.formato):*!/Ext.util.Format.dateRenderer('n/d/Y');
                            renderer = function formatDate(value, metaData, record, rowIndex, colIndex, store) {
                                if (value) {
                                    if (record.get('presente') == 0) {
                                        return (value instanceof Date) ? '<i><b>' + value.format('d/m/Y') + '</i></b>' : '<i><b>' + value + '</i></b>';
                                    } else {
                                        return (value instanceof Date) ? value.format('d/m/Y') : value;
                                    }
                                }
                            };
                            tipo = 'date';
                            self.acomodarElementoFormGestion(self, self.campoFecha, campo, false);

                            self.elementosFormulario[campo.index] = self.campoFecha.id;

                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor: self.campoFecha.id,
                                        tipo: 'fecha'
                                    });
                            }
                            break;
                        case 'lista':


                            self.camposStoreCombo = new Array({
                                    name: campo.campovalor
                                },
                                {
                                    name: campo.campoamostrar
                                }
                            );


                            self.StoreCombo = new Ext.data.Store({
                                storeId: campo.campovalor + campo.index + 'StoreCombo' + self.id,
                                id: campo.campovalor + campo.campoamostrar + 'StoreCombo' + self.id,
                                reader: new Ext.data.JsonReader({
                                    totalProperty: "cantidad",
                                    root: "datos",
                                    id: campo.campovalor + campo.index + 'readerCombo' + self.id,
                                    fields: self.camposStoreCombo
                                })
                            });

                            self.cantCombos++;
                            var campoamostrar = campo.campoamostrar;
                            var campovalor = campo.campoamostrar;
                            renderer = null;
                            if (campo.campovalor != campo.campoamostrar) {
                                renderer = function (val, metadata, record, rowIndex, colIndex, store) {

                                    var posGrid = colIndex - 1;
                                    if (posGrid > 0) {
                                        var campoamostrar = this.configuracion[posGrid].campoamostrar;
                                        var campovalor = this.configuracion[posGrid].campovalor;
                                        var storeComboActual = this.configuracion[posGrid].StoreCombo;
                                        if (storeComboActual) {
                                            var pos = storeComboActual.findBy(function (rec, id) {
                                                if (rec.data[campovalor] == val) {
                                                    return true;
                                                }
                                                else {
                                                    return false;
                                                }

                                            });

                                            //validar cuando se adiciona una fila no viene valor
                                            if (pos != -1) {
                                                return (storeComboActual.getAt(pos).data)[campoamostrar];
                                            } else {
                                                console.log('soy -1')
                                            }

                                        }
                                    }

                                }.createDelegate(self);
                                campoamostrar = campo.campoamostrar;
                                campovalor = campo.campovalor;
                            }

                            self.hiddencampoLista = new Ext.form.Hidden({
                                id: 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                                name: campo.index
                            });


                            self.campoLista = new Ext.form.ComboBox({
                                fieldLabel: campo.nombre,
                                id: 'campoLista' + self.id + campo.index,
                                idhiddencampoLista: 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                                width: (campo.ancho) ? campo.ancho : ancho,
                                tpl: (campo.tpl) ? campo.tpl : undefined,
                                name: campo.campoamostrar + '-combo',
                                triggerAction: 'all',
                                anchor: '99%',
                                emptyText: 'Seleccione...',
                                valueField: campo.campovalor,
                                displayField: campo.campoamostrar,
                                hiddenName: campo.campovalor + '-combo',
                                forceSelection: true,
                                typeAhead: true,
                                allowBlank: (campo.nulo != undefined) ? campo.nulo : true,
                                mode: 'local',
                                blankText: 'Este campo es obligatorio.',
                                readOnly: false,
                                store: self.StoreCombo,
                                listeners: {
                                    select: function (combo, record, index) {
                                        Ext.getCmp(this.idhiddencampoLista).setValue(combo.getValue());
                                        //combo.setRawValue(record.data[combo.campovalor]);
                                    }

                                }
                            });


                            tipo = 'string';
                            if (self.autoCargar) {
                                if (campo.consulta == undefined) {
                                    self.listarFilasCombo(self, campo, self.StoreCombo, false);
                                    self.configuracion[i]['traeconsulta'] = false;
                                } else {
                                    self.listarFilasCombo(self, campo, self.StoreCombo, true);
                                    self.configuracion[i]['traeconsulta'] = true;
                                }

                            }


                            /!* self.camposStore.push({
                                 name: campo.campovalor,
                                 type: tipo
                             });*!/


                            self.adicionarColumnaAncha(self, self.hiddencampoLista, true);
                            self.acomodarElementoFormGestion(self, self.campoLista, campo, false);
                            /!*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                                self.acomodarElementoForm(self, self.campoLista, campo);
                            }
                            else {
                                self.adicionarColumnaAncha(self, self.campoLista);
                            }*!/

                            self.elementosFormulario[campo.index] = self.hiddencampoLista.id;
                            self.elementosFormulario[campo.campovalor + '-combo'] = self.campoLista.id;

                            self.configuracion[i]['StoreCombo'] = self.StoreCombo;
                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor: 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                                        tipo: 'numero'
                                    });
                            }

                            break;
                        case 'logico':
                            self.campoBolean = new Ext.form.Checkbox(
                                {
                                    fieldLabel: campo.nombre,
                                    id: self.id + 'campoBolean' + campo.index,
                                    name: campo.index,
                                    width: (campo.ancho) ? campo.ancho : ancho,
                                    checked: (campo.checked) ? campo.checked : undefined,
                                    cls: 'campoBolean',
                                    anchor: '99%',
                                    listeners: {
                                        check: function (_this, checked) {

                                            if (checked) {
                                                this.setRawValue('on');
                                                console.log(this.getRawValue());
                                            } else {
                                                this.setRawValue('off');
                                                console.log(this.getRawValue());
                                            }
                                        }
                                    }
                                });
                            self.Filtros.push({
                                type: 'boolean',
                                dataIndex: campo.index
                            });
                            renderer = self.cambiarRadio;
                            ancho = 50;
                            tipo = 'boolean';
                            self.acomodarElementoFormGestion(self, self.campoBolean, campo, false);
                            /!*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                                self.acomodarElementoForm(self, self.campoBolean, campo);
                            }
                            else {
                                self.adicionarColumnaAncha(self, self.campoBolean);
                            }*!/
                            self.elementosFormulario[campo.index] = self.campoBolean.id;
                            break;
                        case 'imagen':
                            ancho = 100;
                            self.mostrarBtnImagen = true;
                            self.columnaImagen = campo.index;
                            self.campoImagenForm = new Ext.ux.ScreenshotField({
                                fieldLabel: campo.nombre,
                                hideLabel: false,
                                allowUpload: true,
                                name: campo.index,
                                anchor: '99%',
                                id: self.id + 'campoImagenForm' + campo.index,
                                allowBlank: true,
                                height: (campo.ancho) ? campo.ancho - 10 : ancho,
                                width: (campo.ancho) ? campo.ancho : ancho,
                            });

                            renderer = function (val) {
                                var size = 20;
                                if (val) {
                                    return "<img class='imagen' src=" + val + " width='" + size + "' height='" + size + "' />";
                                }
                                return "<center></center><img src=/metadatos/metaconfig/views/js/nomdinamicos/images/no-photo-male.png width='" + size + "' height='" + size + "' />";

                            }.createDelegate(self);
                            ancho = 100;
                            self.acomodarElementoFormGestion(self, self.campoImagenForm, campo, false);


                            self.elementosFormulario[campo.index] = self.campoImagenForm.id;
                            tipo = 'string';


                            break;
                        case 'oculto':
                            self.campoOculto = new Ext.form.Hidden({
                                id: 'campoOculto' + self.id + campo.index,
                                name: campo.index
                            });

                            self.adicionarColumnaAncha(self, self.campoOculto, true);

                            self.elementosFormulario[campo.index] = self.campoOculto.id;
                            hidden = true;
                            break;
                    }
                }

                self.camposStore.push({
                    name: campo.index,
                    type: tipo,
                    dateFormat: 'j/m/Y'
                });

                if (campo.nombre == 'id') {
                    self.configuracion[0]['idconfiguracion'] = campo.index;
                    self.variables.indiceId = campo.index;
                    self.camposGrid.push({
                        id: campo.index + 'campoGrid' + self.id,
                        header: campo.nombre,
                        dataIndex: campo.index,
                        sortable: false,
                        tooltip: (campo.descripcion) ? campo.descripcion : undefined,
                        hidden: true,
                        hideable: false
                    });
                    self.hiddencampoId = new Ext.form.Hidden({
                        id: 'hiddencampoId' + campo.campovalor + self.id + campo.index,
                        name: campo.index
                    });

                    self.adicionarColumnaAncha(self, self.hiddencampoId, true);
                    self.nuevaConfiguracion.push(self.configuracion[i]);
                    self.elementosFormulario[campo.index] = self.hiddencampoId.id;

                } else {

                    if (campo.tipo == 'lista') {
                        self.camposGrid.push({
                            id: campo.index + 'campoGrid' + self.id,
                            header: campo.nombre,
                            dataIndex: campo.index,
                            tooltip: (campo.descripcion) ? campo.descripcion : undefined,
                            renderer: renderer,
                            sortable: true,
                            hidden: (campo.oculto) ? campo.oculto : false,
                            width: (campo.ancho) ? campo.ancho : ancho,
                            hideable: (campo.oculto) ? false : true
                        });
                    } else {

                        self.camposGrid.push({
                            id: campo.index + 'campoGrid' + self.id,
                            header: campo.nombre,
                            hidden: hidden,
                            dataIndex: campo.index,
                            renderer: (campo.oculto) ? null : renderer,
                            tooltip: (campo.descripcion) ? campo.descripcion : undefined,
                            sortable: true,
                            width: (campo.ancho) ? (campo.tipo === 'imagen') ? 50 : campo.ancho : ancho,
                            hideable: (hidden) ? false : true
                        });
                    }
                }


            }

            for (var i = 0; i < self.configuracion.length; i++) {
                var campo = self.configuracion[i];
                var ancho = 200;
                var renderer = null;
                if (campo.nombre != 'id') {
                    switch (campo.tipo) {
                        case 'texto':
                            if (campo.mostraFiltro) {
                                self.campoTextoFiltro = new Ext.form.TextField({
                                    fieldLabel: campo.nombre,
                                    id: self.id + 'campoTextoFiltro' + campo.index,
                                    allowBlank: true,
                                    emptyText: 'Criterio a buscar...',
                                    width: 200,
                                    name: campo.index + 'filtro',
                                    /!*enableKeyEvents: true,
                                    listeners: {
                                        keyup: function () {
                                            var sucio=false;
                                            console.log(self.itemsFormularioFiltro);
                                            for (var i = 0; i < self.itemsFormularioFiltro.length; i++) {
                                                if (self.itemsFormularioFiltro[i].items[0].getValue() != '') {
                                                    sucio= true;
                                                    break;
                                                }
                                            }
                                            console.log(sucio);
                                            if (sucio) {
                                                self.btnBuscar.enable();
                                                self.btnLimpiar.enable();
                                            } else {

                                                self.btnBuscar.disable();
                                                self.btnLimpiar.disable();
                                            }
                                        }
                                    }*!/
                                });


                                self.itemsFormularioFiltro.push({
                                    layout: 'form',
                                    bodyStyle: 'padding:0 10px 0 0;',
                                    //columnWidth: 0.25,
                                    items: [self.campoTextoFiltro]
                                });
                                self.datosFiltro.push(
                                    {
                                        columna: campo.index,
                                        valor: self.id + 'campoTextoFiltro' + campo.index,
                                        tipo: 'texto'
                                    });
                            }
                            break;
                        case 'lista':
                            if (campo.mostraFiltro) {
                                var camposStoreCombo = new Array({
                                        name: campo.campovalor
                                    },
                                    {
                                        name: campo.campoamostrar
                                    }
                                );

                                var StoreComboFiltro = new Ext.data.Store({
                                    url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                                    autoLoad: true,
                                    baseParams: {
                                        metodo: 'listarGenerico',
                                        tabla: campo.tabla,
                                        consulta: (campo.consulta) ? campo.consulta : undefined,
                                        id: campo.idtabla
                                    },
                                    storeId: campo.campovalor + campo.index + 'StoreComboFiltro' + self.id,
                                    id: campo.campovalor + campo.campoamostrar + 'StoreComboFiltro' + self.id,
                                    reader: new Ext.data.JsonReader({
                                        totalProperty: "cantidad",
                                        root: "datos",
                                        id: campo.campovalor + campo.index + 'readerComboFiltro' + self.id,
                                        fields: camposStoreCombo
                                    })
                                });
                                var campoListaFiltro = new Ext.form.ComboBox({
                                    fieldLabel: campo.nombre,
                                    id: 'campoListaFiltro' + self.id + campo.index,
                                    width: (campo.ancho) ? campo.ancho : ancho,
                                    tpl: (campo.tpl) ? campo.tpl : undefined,
                                    name: campo.campoamostrar + 'filtro',
                                    triggerAction: 'all',
                                    emptyText: 'Seleccione...',
                                    valueField: campo.campovalor,
                                    displayField: campo.campoamostrar,
                                    hiddenName: campo.campovalor,
                                    forceSelection: false,
                                    typeAhead: true,
                                    allowBlank: true,
                                    mode: 'local',
                                    blankText: 'Este campo es obligatorio.',
                                    readOnly: false,
                                    store: StoreComboFiltro,

                                });


                                self.itemsFormularioFiltro.push({
                                    layout: 'form',
                                    bodyStyle: 'padding:0 10px 0 0;',
                                    //columnWidth: 0.25,
                                    items: [campoListaFiltro]
                                });
                                self.datosFiltro.push(
                                    {
                                        columna: campo.index,
                                        valor: 'campoListaFiltro' + self.id + campo.index,
                                        tipo: 'numero'
                                    });
                            }

                            break;


                    }
                }


            }

            self.btnCancelarVentana = new Ext.Button({
                id: 'idbtnCancelarVentana' + self.id,
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                prevTab: 'id' + self.id,
                nextTab: 'btnAplicarVentana' + self.id,
                handler: function () {
                    self.ventanaGestion.hide();
                }
            });

            self.btnAplicarVentana = new Ext.Button({
                id: 'idbtnAplicarVentana' + self.id,
                iconCls: 'aplicar',
                text: 'Aplicar',
                tooltip: 'Guardar datos sin cerrar ventana',
                handler: function () {
                    self.guardarFilas(self, self.adicionar);
                    self.aplicar = true;
                }
            });

            self.btnAceptarVentana = new Ext.Button({
                id: 'idbtnAceptarVentana' + self.id,
                iconCls: 'aceptar',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                prevTab: 'btnAplicarVentana' + self.id,
                nextTab: 'idtfDenomBilletes' + self.id,
                handler: function () {
                    self.guardarFilas(self, self.adicionar);
                    self.aplicar = false;
                }
            });

            self.formularioGestion = new Ext.FormPanel({
                monitorValid: true,
                autoHeight: true,
                width: (self.anchoForm) ? self.anchoForm : 500,
                frame: true,
                bodyStyle: 'padding: 5px;',
                labelAlign: 'top',
                items: {
                    layout: 'column',
                    items: self.itemsFormulario
                },
                listeners: {
                    'clientvalidation': function (_form, _valid) {
                        if (_form.getForm().isDirty() && _valid) {
                            self.btnAplicarVentana.enable();
                            self.btnAceptarVentana.enable();
                        } else {
                            self.btnAplicarVentana.disable();
                            self.btnAceptarVentana.disable();
                        }

                    }
                }
            });

            self.btnBuscar = new Ext.Button({
                tooltip: "Buscar " + self.nombre + " <b>(Alt+B)</b>",
                text: "<u>B</u>uscar",
                iconCls: 'buscar',
                id: 'btnBuscarf' + self.id,
                handler: function () {
                    self.store.reload();
                }
            });

            self.btnLimpiar = new Ext.Button({
                tooltip: "Limpiar filtros <b>(Alt+L)</b>",
                text: "<u>L</u>impiar",
                id: 'btnAllAf' + self.id,
                iconCls: 'limpiar',
                handler: function () {
                    self.formularioGestionFiltro.getForm().reset();
                    self.store.reload();
                }
            });

            self.itemsFormularioFiltro.push({
                columnWidth: '35px',
                bodyStyle: 'padding:19px 10px 0 0;',
                layout: 'form',
                items: [self.btnBuscar]
            });

            self.itemsFormularioFiltro.push({
                columnWidth: '35px',
                bodyStyle: 'padding:19px 0 0 0;',
                layout: 'form',
                items: [self.btnLimpiar]
            });


            self.formularioGestionFiltro = new Ext.FormPanel({
                layout: 'column',
                cls: 'x-toolbar',
                //bodyBorder  : false,
                // border      : false,
                //hideBorders : true,
                id: 'formularioGestionFiltro' + self.id,
                region: 'north',
                autoHeight: true,
                frame: true,
                bodyStyle: 'padding: 0 0 0 0;',
                labelAlign: 'top',
                items: self.itemsFormularioFiltro,
                keys: [{
                    key: Ext.EventObject.ENTER, fn: function () {
                        self.btnBuscar.handler.call();
                    }
                }, {
                    key: 'l', alt: true, fn: function () {
                        self.btnLimpiar.handler.call();
                    }
                }]
            });


            //Ventana de adicionar y modificar.
            self.ventanaGestion = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                autoHeight: true,
                closable: true,
                autoValidate: true,
                validateDefault: true,
                constrain: true,
                resizable: true,
                layout: 'fit',
                items: [self.formularioGestion],
                buttons: [self.btnCancelarVentana, self.btnAplicarVentana, self.btnAceptarVentana],
                keys: [
                    {
                        key: Ext.EventObject.ENTER,
                        stopEvent: true,
                        fn: function () {
                            if (!self.btnAceptarVentana.disabled) {
                                self.btnAceptarVentana.handler();
                            }

                        }
                    },
                    {
                        key: 'x',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            if (!self.btnCancelarVentana.disabled) {
                                self.btnCancelarVentana.handler();
                            }
                        }
                    },
                    {
                        key: 'p',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            if (!self.btnAplicarVentana.disabled) {
                                self.btnAplicarVentana.handler();
                            }
                        }
                    }
                ],
                listener: {
                    beforeshow: function (_this) {
                        self.btnAplicarVentana.disable();
                        self.btnAceptarVentana.disable();
                    }
                }
            });

            /!*self.ventanaGestion.on('show', function (store, options) {
                self.itemsFormulario[self.cantCamposOcultos].items[0].focus(true,10);
            });*!/


            self.store = new Ext.data.Store({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                autoLoad: self.autoCargar,
                remoteSort: true,
                reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos",
                    id: self.variables.indiceId,
                    fields: self.camposStore
                })
            });


            // self.mascaraGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});

            self.gpEditor = new Ext.grid.EditorGridPanel({
                region: 'center',
                id: self.id + 'gpEditor',
                store: self.store,
                layout: 'fit',
                border: false,
                autoScroll: true,
                loadMask: {msg: 'Cargando...'},
                clicksToEdit: 1,
                sm: self.csm,
                width: '100%',
                height: self.height - 10,
                columns: self.camposGrid,
                /!*viewConfig: {
                    getRowClass: function (record, rowIndex, p, store) {

                        if (record.get(self.variables.indiceId) == undefined) {
                            //return 'FilaMorada';
                            return 'FilaVerde';
                        }

                        if (record.get('esseguridad') == 1) {

                            return 'FilaRoja';
                        }

                        if (record.get('cambio') == 'modified') {
                            return 'FilaAzul';
                        }

                        return 'FilaGris';
                        //return 'FilaAzul';
                        //return 'FilaGrisClara';
                    }
                },*!/
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    store: self.store,
                    displayMsg: 'Mostrando del {0} al {1} de {2}',
                    emptyMsg: 'No hay datos que mostrar',
                    beforePageText: 'Página',
                    afterPageText: 'de {0}',
                    firstText: 'Primera página',
                    prevText: 'Página anterior',
                    nextText: 'Próxima página',
                    lastText: 'Útima página',
                    refreshText: 'Actualizar',
                    displayInfo: true
                }),
                plugins: new Ext.grid.GridFilters({
                    local: true,
                    store: self.store,
                    filters: self.Filtros
                }),
                keys: [{
                    key: Ext.EventObject.DELETE, fn: function () {
                        if (!self.btnEliminar.disabled && !self.btnEliminar.hidden) {
                            self.btnEliminar.handler.call();

                        }
                    }
                },
                    {
                        key: 'i', alt: true, stopEvent: true, fn: function () {
                        if (!self.btnAdicionar.disabled && !self.btnAdicionar.hidden) {
                            self.btnAdicionar.handler.call();
                        }
                    }
                    }, {
                        key: 'm', alt: true, stopEvent: true, fn: function () {
                            if (!self.btnModificar.disabled && !self.btnModificar.hidden) {
                                self.btnModificar.handler.call();
                            }
                        }
                    }, {
                        key: 'b', alt: true, stopEvent: true, fn: function () {

                            Ext.getCmp(self.datosFiltro[0].valor).focus(false, 10);
                        }
                    }]

            });


            self.store.on('update', function (store) {
                self.btnModificar.enable();
            });

            self.store.on('add', function (store) {
                self.btnModificar.enable();
            });

            self.store.on('beforeload', function (store, options) {


                var filtro = undefined;
                var filtroTemp = (self.filtro) ? self.filtro.slice() : new Array();


                if (self.datosFiltro.length > 0) {
                    for (var i = 0; i < self.datosFiltro.length; i++) {
                        var valor = Ext.getCmp(self.datosFiltro[i].valor).getValue();
                        if (!(valor == '' || valor == null || valor == undefined)) {
                            filtroTemp.push(
                                {
                                    columna: self.datosFiltro[i].columna,
                                    valor: valor,
                                    tipo: self.datosFiltro[i].tipo
                                }
                            );
                        }

                    }
                }
                if (filtroTemp.length > 0) {
                    filtro = Ext.encode(filtroTemp);
                }


                store.baseParams = {
                    metodo: (self.urlListar) ? self.urlListar : 'listarGenerico',
                    consulta: (self.consulta) ? self.consulta : undefined,
                    tabla: self.tabla,
                    idtabla: self.idtabla,
                    filtro: filtro
                    /!*,
                    start: (store.baseParams.start)?store.baseParams.start:
                        (self.store.lastOptions)?self.store.lastOptions.params.start:0,
                    limit: (store.baseParams.limit)?store.baseParams.limit:
                        (self.store.lastOptions)?self.store.lastOptions.params.limit:15*!/


                }
            });

            function esperarCombosCargados() {
                if (self.cantCombosCargados != self.cantCombos) {
                    esperarCombosCargados();
                }
            }

            self.store.on('load', function (store, options) {
                if (self.itemsFormularioFiltro.length > 2) {
                    self.itemsFormularioFiltro[0].items[0].focus(false, 10);
                }

            });


            //Codigo para mostrar la ventana imagen
            if (!self.mostrarBtnImagen) {
                self.btnAsociarImagen.hidden = true;
            }

            //Obtener la ultima fila seleccionada
            self.ultimaFilaSeleccionada = -1;
            var hisNodosSeleccionados = new Array();
            self.lastFilaseleccionada = null;
            var miArray = new Array();
            var indiceFila = -1;
            self.gpEditor.selModel.on('rowselect', function (_this, rowIndex, record) {
                var id = record.id;
                indiceFila = miArray.indexOf(id);
                if (indiceFila == -1) {
                    hisNodosSeleccionados.push(record);
                    miArray.push(id);
                    self.btnAsociarImagen.enable();
                }

                self.ultimaFilaSeleccionada = rowIndex;
                self.lastFilaseleccionada = record;
                self.fireEvent('elementochequeado', {
                    record: record,
                    rowindex: rowIndex
                });


            });

            self.gpEditor.selModel.on('rowdeselect', function (_this, rowIndex, record) {
                var id = record.id;
                indiceFila = miArray.indexOf(id);
                miArray.remove(id);
                hisNodosSeleccionados.remove(hisNodosSeleccionados[indiceFila]);
                if (miArray.length == 0) {
                    self.btnAsociarImagen.disable();
                }
                self.lastFilaseleccionada = hisNodosSeleccionados[hisNodosSeleccionados.length - 1];
                self.fireEvent('elementodeschequeado', {
                    record: record,
                    rowindex: rowIndex
                });
            });


            var items = (self.itemsFormularioFiltro.length > 2) ?
                [self.formularioGestionFiltro, self.gpEditor] :
                [self.gpEditor];
            var layout = (self.itemsFormularioFiltro.length > 2) ? 'border' : 'fit';
            var keys = [{
                key: Ext.EventObject.DELETE, fn: function () {
                    if (!self.btnEliminar.disabled && !self.btnEliminar.hidden) {
                        self.btnEliminar.handler.call();

                    }
                }
            },
                {
                    key: 'I', alt: true, stopEvent: true, fn: function () {
                    if (!self.btnAdicionar.disabled && !self.btnAdicionar.hidden) {
                        self.btnAdicionar.handler.call();
                    }
                }
                }, {
                    key: 'M', alt: true, stopEvent: true, fn: function () {
                        if (!self.btnModificar.disabled && !self.btnModificar.hidden) {
                            self.btnModificar.handler.call();
                        }
                    }
                }];


            Ext.apply(this, {
                layout: layout,
                collapsible: true,
                tbar: [self.btnAdicionar, self.btnModificar, self.btnEliminar/!*, self.btnActualizar*!/, self.btnVerDetalles],
                items: items
                , keys: keys
            });


            Misitio.Panel_Gestion.GestionGridPanel.superclass.initComponent.apply(this);

        }
        ,
        centrarValor: function (val) {
            if (val)
                return "<center>" + val + "</center>";
        }
        ,
        acomodarElementoForm: function (self, elementoForm, campo) {
            if (self.columnasForm && Ext.isArray(self.columnasForm)) {
                if (self.columnaFormAncha) {
                    for (var i = 0; i < self.columnasForm.length; i++) {
                        if ((campo.columnForm - 1) == i) {
                            self.itemsFormulario.push(
                                {
                                    layout: 'form',
                                    bodyStyle: 'padding:5px 5px 5px 5px;',
                                    columnWidth: self.columnasForm[i],
                                    items: [elementoForm]
                                }
                            );
                        } else {
                            self.itemsFormulario.push(
                                {
                                    layout: 'form',
                                    bodyStyle: 'padding:5px 5px 5px 5px;',
                                    columnWidth: self.columnasForm[i],
                                    items: new Array({})
                                }
                            );
                        }

                    }
                    self.columnaFormAncha = false;
                } else {
                    self.itemsFormulario[(self.itemsFormulario.length - self.columnasForm.length - 1) + (campo.columnForm)].items.push(elementoForm);
                }


            }
        }
        ,
        acomodarElementoFormGestion: function (self, elementoForm, campo, esOculto) {
            if (campo.tipo != 'imagen') {
                self.itemsFormulario.push(
                    {
                        layout: 'form',
                        bodyStyle: 'padding:3px;margin:auto;',
                        columnWidth: (campo.tamannoForm <= 1) ? campo.tamannoForm : 1,
                        items: [elementoForm]
                    }
                );
            } else {
                var anchoCampo = (campo.ancho) ? campo.ancho : 100;
                var ancho = self.anchoForm / 2 - anchoCampo / 2 - 20;
                //console.log(ancho);

                self.itemsFormulario.push(
                    {
                        layout: 'form',
                        bodyStyle: 'padding:0 0 0 ' + ancho + 'px',
                        columnWidth: (campo.tamannoForm <= 1) ? campo.tamannoForm : 1,
                        items: [elementoForm]
                    }
                );

            }

        }
        ,
        acomodarElementoFormGestionOld: function (self, elementoForm, campo, esOculto) {
            if (campo.columnForm && campo.columnForm > 0 && campo.columnForm <= self.columnasForm.length) {
                self.acomodarElementoForm(self, elementoForm, campo);
            }
            else {
                self.adicionarColumnaAncha(self, elementoForm);
            }
        }
        ,
        adicionarColumnaAncha: function (self, elementoForm, esOculto) {

            if (!esOculto) {
                self.itemsFormulario.push(
                    {
                        layout: 'form',
                        //bodyStyle: 'padding:5px 5px 5px 5px;',
                        columnWidth: .99,
                        items: [elementoForm]
                    }
                );
                self.columnaFormAncha = true;
            } else {

                self.itemsFormulario.unshift(elementoForm);
                self.cantCamposOcultos++;

            }

        }
        ,
        crearNodoLeyenda: function (accion, text) {
            var div = "<div class='animacionContenedor" + accion + " contenedorLeyendaProyecto'><div class='iconLeyenda " + accion + "Leyend rotateLeyend'></div><div class='textLeyenda " + accion + "LeyendColor'>" + text + "</div>";
            return div;
        }
        ,
        obtenerFiltro: function (self) {

            self.filtro.push();
        }

        ,
        cambiarRadio: function (val) {
            if (val) {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/checked.png' /></center>";
            } else {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/unchecked.png' /></center>";
            }
        }
        ,
        limpiarGrid: function (self) {
            self.btnModificar.disable();
            self.btnEliminar.disable();
            self.btnVerDetalles.disable();
            self.variables.filasAmodificar = new Array();
            self.variables.filasAguardar = new Array();
            self.variables.filasAeliminar = new Array();
            self.store.removeAll();
            self.csm.clearSelections();
            self.store.reload();
        }
        ,
        buscar: function (array, elemento) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == elemento) {
                    return true;
                }
            }
            return false;
        }
        ,
        adicionarFila: function (self) {
            self.adicionar = true;
            self.btnAplicarVentana.show();
            self.ventanaGestion.show();

            self.itemsFormulario[self.cantCamposOcultos].items[0].focus(false, 10);


            self.ventanaGestion.setTitle('Adicionar ' + self.nombre);
            self.formularioGestion.getForm().reset();

        }
        ,
        actualizarVista: function (self) {
            self.store.load({params: {limit: 15, start: 0}});
        }
        ,
        cargarElementos: function (self) {
            for (var i = 0; i < self.configuracion.length; i++) {
                if (self.configuracion[i].StoreCombo) {
                    self.listarFilasCombo(self, self.configuracion[i], self.configuracion[i].StoreCombo, self.configuracion[i].traeconsulta);
                }
            }
            self.actualizarVista(self);
        }
        ,
        listarFilasCombo: function (self, campo, store, traeconsulta) {
            var consulta = (traeconsulta) ? campo.consulta : undefined;
            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: 'listarGenerico',
                    tabla: campo.tabla,
                    consulta: consulta,
                    id: campo.idtabla
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        store.loadData(respuesta);
                        self.cantCombosCargados++;

                        if (self.cantCombosCargados == self.cantCombos && self.autoCargar) {
                            self.actualizarVista(self);
                        }
                    } else {
                        var error = respuesta.error;
                        self.mostrarError(error, self, 1);
                    }
                }
            });
        }
        ,
        guardarFilas: function (self, adicionar) {

            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});
            var filaAguardar = self.dameFilaAguardar(self, adicionar);
            //console.log(filaAguardar);return;

            var columnasunicas = undefined;
            var columnasTemp = new Array();
            if (self.columnasUnicas.length > 0) {
                for (var i = 0; i < self.columnasUnicas.length; i++) {
                    var valor = Ext.getCmp(self.columnasUnicas[i].valor).getValue();
                    if (!(valor == '' || valor == null || valor == undefined)) {
                        columnasTemp.push(
                            {
                                columna: self.columnasUnicas[i].columna,
                                valor: valor,
                                tipo: self.columnasUnicas[i].tipo
                            }
                        );
                    }

                }
                columnasunicas = Ext.encode(columnasTemp);
            }

            myMask.show();
            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: (self.urlGuardar) ? self.urlGuardar : 'guardarGenerico',
                    tabla: self.tabla,
                    idtabla: self.idtabla,
                    adicionar: adicionar,
                    filaAguardar: Ext.encode(filaAguardar),
                    columnasunicas: columnasunicas
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        myMask.hide();
                        if (!self.aplicar) {
                            self.ventanaGestion.hide();
                        }
                        var tipoMensaje = (adicionar) ? 'adicionar' : 'modificar';

                        self.dameMensaje(self, tipoMensaje, false);
                        self.limpiarGrid(self);

                    } else {
                        myMask.hide();
                        var error = respuesta.error;
                        var addOmod = (adicionar) ? 'adicionar' : 'modificar';
                        //8 advertencia,6 error, default informacion
                        self.dameMensaje(self, addOmod + 'existe', false);

                    }

                }
            });


        }
        ,

        modificarFilas: function (self) {
            self.adicionar = false;
            self.ventanaGestion.show();

            self.ventanaGestion.setTitle('Modificar ' + self.nombre);
            self.btnAplicarVentana.hide();
            self.cargarDatosFormulario(self);

            self.itemsFormulario[self.cantCamposOcultos].items[0].focus(true, 10);


        }
        ,
        cargarDatosFormulario: function (self) {

            self.formularioGestion.getForm().loadRecord(self.lastFilaseleccionada);


            for (var i = 0; i < self.configuracion.length; i++) {
                if (self.configuracion[i].StoreCombo != undefined) {
                    var filas = self.configuracion[i].StoreCombo.data.items;
                    //console.log(filas);
                    var filaSelection = self.lastFilaseleccionada.data;
                    //console.log(filaSelection);
                    for (var j = 0; j < filas.length; j++) {
                        //si el id de la tabla no existe es porque es nueva
                        if (filas[j].data[self.configuracion[i].campovalor] == filaSelection[self.configuracion[i].index]) {
                            var idElementoFormulario = self.elementosFormulario[self.configuracion[i].campovalor + '-combo'];


                            Ext.getCmp(idElementoFormulario).setValue(filas[j].data[self.configuracion[i].campoamostrar]);
                            //console.log(Ext.getCmp(idElementoFormulario));


                        }
                    }
                }
            }
            //console.log(self.formularioGestion.getForm().items);
        }
        ,
        eliminarFilas: function (self) {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});
            var filasAeliminar = self.dameFilasAeliminar(self);
            myMask.show();
            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: (self.urlEliminar) ? self.urlEliminar : 'eliminarGenerico',
                    tabla: self.tabla,
                    idtabla: self.idtabla,
                    filasAeliminar: Ext.encode(filasAeliminar)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        myMask.hide();
                        var tipoMensaje = 'eliminar';
                        var plural = (filasAeliminar.length > 1) ? true : false;

                        self.dameMensaje(self, tipoMensaje, plural);

                        self.limpiarGrid(self);
                    } else {
                        myMask.hide();
                        var error = respuesta.error;
                        self.mostrarError(error, self, 3);

                    }

                }
            });
        }
        ,
        dameFilaAguardar: function (self, adicionar) {
            var filaAguardar = {};

            var elementosForm = self.elementosFormulario;

            for (var propiedad in elementosForm) {
                /!* console.log(Ext.getCmp(elementosForm[propiedad]));
                 console.log(Ext.getCmp(elementosForm[propiedad]).getValue());*!/
                if (Ext.getCmp(elementosForm[propiedad]).getValue() === true) {
                    filaAguardar[propiedad] = 'on';
                } else if (Ext.getCmp(elementosForm[propiedad]).getValue() === false) {
                    filaAguardar[propiedad] = 'off';
                } else if (!Ext.getCmp(elementosForm[propiedad]).getValue()) {
                    if (self.configuracion[0]['idconfiguracion'] != propiedad) {
                        filaAguardar[propiedad] = 'vacio';
                    }
                } else {
                    filaAguardar[propiedad] = Ext.getCmp(elementosForm[propiedad]).getValue();
                }

            }

            return filaAguardar;
        }
        ,
        dameFilaAmodificar: function (self) {

            var filasmodificadas = self.store.modified;

            var filasAmodificar = new Array();
            for (var i = 0; i < filasmodificadas.length; i++) {
                if (filasmodificadas[i].data[self.variables.indiceId] != undefined) {
                    filasAmodificar.push(filasmodificadas[i].data);
                }
            }
            return filasAmodificar;
        }
        ,
        dameFilasAeliminar: function (self) {
            var filasmarcadas = self.csm.getSelections();
            var filasAeliminar = new Array();
            for (var i = 0; i < filasmarcadas.length; i++) {
                if (filasmarcadas[i].data[self.variables.indiceId] != undefined) {
                    filasAeliminar.push(filasmarcadas[i].data[self.variables.indiceId]);
                }
            }
            return filasAeliminar;
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
                msg = 'Ocurrió un error al seleccionar los datos: <br/>' /!*+ errorString*!/;
            } else if (tipomensaje == 2) {
                msg = 'Ocurrió un error al guardar los datos: <br/>' /!*+ errorString*!/;
            } else {
                msg = 'Ocurrió un error al eliminar los datos: <br/>' /!*+ errorString*!/;
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


            /!*Ext.Msg.show({
                title  : 'Fatal error',
                msg    : msg,
                buttons: Ext.Msg.OK,
                animEl : 'elId',
                icon   : Ext.MessageBox.ERROR
            });*!/
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
        modificaFiltro: function (self, filtro) {
            self.filtro = filtro;
        }
        ,
        addFiltro: function (self, nuevoElemento) {
            self.filtro.push(nuevoElemento);
        }
        ,
        dameUltimafilaSeleccionada: function (self) {
            return self.lastFilaseleccionada;
        }
        ,
        mostrarVentanaAsociarImagen: function (self) {
            var ventanaImagen = Misitio.Funciones.VentanaImagen(
                {
                    id: self.id + 'ventanaImagen'
                });

            var panelImagen = ventanaImagen.initialConfig.items[0];
            var campoImagen = panelImagen.damecampoImagen(panelImagen);

            campoImagen.setValue(self.lastFilaseleccionada.data[self.columnaImagen]);

            var ultimaFilaPuesta = undefined;
            var valorImagenSeleccionado = self.lastFilaseleccionada.data[self.columnaImagen];

            panelImagen.on('salvarimagen', function (datosImagen) {
                var columnaImagen = self.columnaImagen;

                self.lastFilaseleccionada.data[columnaImagen] = datosImagen.valorimagen;
                self.lastFilaseleccionada.commit();

                ultimaFilaPuesta = self.lastFilaseleccionada;
                if (datosImagen.esbotonguardar) {
                    self.store.getModifiedRecords().push(self.lastFilaseleccionada);
                    ventanaImagen.close();
                }
            });

            panelImagen.on('cancelar', function (val) {
                if (ultimaFilaPuesta != undefined) {
                    self.lastFilaseleccionada.data[self.columnaImagen] = valorImagenSeleccionado;
                    self.lastFilaseleccionada.commit();
                }
                ventanaImagen.close();

            });


        }
        ,
        verDetalles: function (self, record) {

            var data = new Array();

            for (var i = 0; i < self.configuracion.length; i++) {
                var columna = self.configuracion[i].nombre;
                var tipo = self.configuracion[i].tipo;
                var campovalor = self.configuracion[i].campovalor;
                var campoamostrar = self.configuracion[i].campoamostrar;
                var valor = record.data[self.configuracion[i].index];
                if (tipo == 'fecha') {
                    valor = (valor) ? new Date(valor).format('j-m-Y') : undefined;
                }
                if (tipo == 'lista') {
                    var pos = self.configuracion[i].StoreCombo.findBy(function (rec, id) {
                        if (rec.data[campovalor] == valor) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if (pos != -1) {
                        valor = (self.configuracion[i].StoreCombo.getAt(pos).data)[campoamostrar];
                    }
                }
                if (tipo == 'logico') {
                    valor = (valor == true) ? 'Sí' : 'No';
                }
                if (!valor) {
                    valor = 'No tiene ' + columna.toLowerCase();
                }

                data.push({
                    columna: columna, tipo: tipo, valor: valor
                });
            }

            Misitio.Funciones.VentanaDetalles({id: 'ventanaDetallesEditorGridPanel', configuracion: data});


        }
        ,
        dameStoreGrid: function (self) {
            return self.gpEditor.getStore();
        }
        ,
        dameConfiguracion: function (self) {
            return self.configuracion;
        }
        ,
        dameMensaje: function (self, tipo, plural) {

            var femenino = self.configuracionMensajes.femenino;
            var numeroConcepto = self.configuracionMensajes.numero;


            function damePosicionElementoVocabulario(elemento, plural, femenino) {
                var vocabulario = {
                    'El': ['El', 'La', 'Los', 'Las'],
                    'el': ['el', 'la', 'los', 'las'],
                    'un': ['un', 'una', 'unos', 'unas'],
                    'de': ['del', 'de la', 'de los', 'de las'],
                    'este': ['este', 'esta', 'estos', 'estas'],
                    'ha': ['ha', 'ha', 'han', 'han'],
                    'o': ['o', 'a', 'os', 'as'],
                    'caracter': ['caracter', 'caracter', 'caracteres', 'caracteres'],
                    'especial': ['especial', 'especial', 'especiales', 'especiales'],
                    'adicionado': ['adicionado', 'adicionada', 'adicionados', 'adicionadas'],
                    'modificado': ['modificado', 'modificada', 'modificados', 'modificados'],
                    'seleccionado': ['seleccionado', 'seleccionada', 'seleccionados', 'seleccionadas'],
                    'eliminado': ['eliminado', 'eliminada', 'eliminados', 'eliminadas'],
                    'guardado': ['guardado', 'guardada', 'guardados', 'guardadas'],
                    'puede': ['puede', 'puede', 'pueden', 'pueden'],
                    'está': ['está', 'está', 'están', 'están'],
                };

                var pos = (plural ? 2 : 0) + (femenino ? 1 : 0);

                return vocabulario[elemento][pos];

            };
            var mensaje = '';
            var tipoMensaje = 2;
            switch (tipo) {
                case 'adicionar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('adicionado', plural, femenino) + ' satisfactoriamente.';

                    break;
                case 'modificar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('modificado', plural, femenino) + ' satisfactoriamente.';
                    break;
                case 'eliminar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('eliminado', plural, femenino) + ' satisfactoriamente.';
                    break;
                case 'confirmareliminar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = '¿Está seguro que quiere eliminar ' + damePosicionElementoVocabulario('el', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' ' + damePosicionElementoVocabulario('seleccionado', plural, femenino) + '?';
                    return mensaje;
                    break;

                case 'adicionarexiste':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' que desea adicionar ya existe';
                    return mostrarMensaje(6, mensaje);
                    break;
                case 'modificarexiste':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' que desea modificar ya existe';
                    return mostrarMensaje(6, mensaje);
                    break;
            }
            return mostrarMensaje(tipoMensaje, mensaje);

        }


    }
);*/

Misitio.Panel_Gestion.GestionGridPanel = Ext.extend(Ext.Panel,
    {
        title                         : ''
        , id                          : ''
        , nombre                      : ''
        , urlListar                   : false
        , urlGuardar                  : false
        , urlEliminar                 : false
        , tabla                       : ''
        , idtabla                     : ''
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
        , configuracion               : new Array()
        , configuracionMensajes       : false
        , filtro                      : false
        , autoCargar                  : true
        , anchoForm                   : false
        , singleSelect                : false
        , ocultarbtnModificar         : false
        , ocultarbtnAdicionar         : false
        , ocultarbtnEliminar          : false
        , ocultarbtnActualizar        : false
        , ocultarbtnVerDetalles       : false
        , ocultarbtnAsociarImagen     : false
        ,
        initComponent                 : function () {

            var self = this;
            var url = '/metadatos/metaconfig/index.php/metaconfig/';
            self.id = (self.id) ? self.id : Ext.id();
            self.configuracionMensajes = (self.configuracionMensajes)
                ? self.configuracionMensajes :
                {femenino: false, numero: ['concepto', 'conceptos']};
            self.nombre = self.nombre.toLowerCase();
            self.adicionar = true;
            self.mostrarBtnImagen = false;
            self.columnaImagen = null;
            self.cantCamposOcultos = 0;
            self.columnasFormulario = new Array();
            self.aplicar = false;
            self.cantCombos = 0;
            self.cantCombosCargados = 0;
            self.allCombosCargados = false;

            self.variables = {
                indiceId          : undefined,
                campoamostrar     : new Array(),
                campovalor        : new Array(),
                filasAmodificar   : new Array(),
                numColCampoLista  : new Array(),
                filasStoreDelCombo: new Array()
            };

            self.btnModificar = new Ext.Button({
                text    : "<u>M</u>odificar",
                hidden  : self.ocultarbtnModificar,
                disabled: true,
                tooltip : "Modificar " + self.nombre + ' <b>(Alt+M)</b>',
                iconCls : 'modificar',
                id      : "btnModificar" + self.id,
                handler : function () {
                    self.modificarFilas(self);
                }
            });

            self.btnAdicionar = new Ext.Button({
                text   : "Ad<u>i</u>cionar",
                hidden : self.ocultarbtnAdicionar,
                tooltip: "Adicionar " + self.nombre + ' <b>(Alt+I)</b>',
                iconCls: 'adicionar',
                id     : "btnAdicionar" + self.id,
                handler: function () {
                    self.adicionarFila(self);
                }
            });

            self.btnEliminar = new Ext.Button({
                text    : "Eliminar",
                hidden  : self.ocultarbtnEliminar,
                disabled: true,
                tooltip : "Eliminar " + self.nombre + ' <b>(DEL)</b>',
                iconCls : 'eliminar',
                id      : "btnEliminar" + self.id,
                handler : function () {

                    var filasAeliminar = self.dameFilasAeliminar(self);
                    var tipoMensaje = 'confirmareliminar';
                    var plural = (filasAeliminar.length > 1) ? true : false;

                    var msg = self.dameMensaje(self, tipoMensaje, plural);

                    Ext.Msg.show({
                        title  : 'Confirmación',
                        msg    : msg,
                        buttons: Ext.Msg.YESNO,
                        fn     : function (btn, text) {
                            if (btn == 'yes') {
                                self.eliminarFilas(self);
                            } else if (btn == 'no') {

                            }
                        },
                        animEl : 'elId',
                        icon   : Ext.MessageBox.QUESTION
                    });


                }
            });

            self.btnActualizar = new Ext.Button({
                text   : "Actualizar",
                hidden : self.ocultarbtnActualizar,
                tooltip: "Actualiza los datos",
                iconCls: 'actualizar',
                id     : "btnActualizar" + self.id,
                handler: function () {
                    self.store.reload();
                    Ext.example.msg('Información', 'Vista actualizada correctamente.');
                }
            });

            self.btnVerDetalles = new Ext.Button({
                text    : "Ver detalles",
                hidden  : self.ocultarbtnVerDetalles,
                disabled: true,
                tooltip : "Muestra detalles del elemento seleccionado.",
                iconCls : 'detalles',
                id      : "btnVerDetalles" + self.id,
                handler : function () {
                    self.verDetalles(self, self.lastFilaseleccionada);

                }
            });

            self.btnAsociarImagen = new Ext.Button({
                text    : "Asociar imagen",
                hidden  : self.ocultarbtnAsociarImagen,
                disabled: true,
                tooltip : "Asocia una imagen al elemento seleccionado",
                iconCls : 'asociar',
                id      : "btnAsociarImagen" + self.id,
                handler : function () {
                    self.mostrarVentanaAsociarImagen(self);
                }
            });

            self.csm = new Ext.grid.RowSelectionModel({
                singleSelect: self.singleSelect,
                listeners   : {
                    rowselect  : function (sm, rowIndex, r) {
                        var seleccion = self.csm.getSelections();
                        if (seleccion.length > 0) {
                            self.btnEliminar.enable();
                            self.btnModificar.enable();
                            self.btnVerDetalles.enable();

                        } else {
                            self.btnEliminar.disable();
                            self.btnModificar.disable();
                            self.btnVerDetalles.disable();
                        }
                        if(r.get('gestion')==0){
                            self.btnEliminar.disable();
                            self.btnModificar.disable();
                        }
                    },
                    rowdeselect: function (sm, rowIndex, r) {
                        var seleccion = self.csm.getSelections();
                        if (seleccion.length > 0) {
                            self.btnEliminar.enable();
                            self.btnModificar.enable();
                            self.btnVerDetalles.enable();
                        } else {
                            self.btnEliminar.disable();
                            self.btnModificar.disable();
                            self.btnVerDetalles.disable();

                        }
                        if(r.get('gestion')==0){
                            self.btnEliminar.disable();
                            self.btnModificar.disable();
                        }
                    }
                }
            });


            self.camposGrid = new Array();
            self.contadorCamposFormulario = 0;
            self.contadorCamposResiduos = 0;
            self.columnaFormAncha = true;
            self.itemsFormulario = new Array();
            self.datosFiltro = new Array();
            self.columnasUnicas = new Array();
            self.itemsFormularioFiltro = new Array();
            self.elementosFormulario = {};
            self.camposStore = new Array();
            self.Filtros = new Array();
            self.nuevaConfiguracion = new Array();

            self.camposGrid.push(new Ext.grid.RowNumberer({header: "#", width: 23}));
            //self.camposGrid.push(self.csm);

            self.configuracion[0]['idelemento'] = self.id;
            for (var i = 0; i < self.configuracion.length; i++) {

                var campo = self.configuracion[i];
                var editor = undefined;
                var ancho = 200;
                var tipo = 'string';
                var hidden = false;
                var renderer = null;

                if (campo.nombre != 'id') {
                    switch (campo.tipo) {
                        case 'texto':
                            self.columnaTexto = campo.index;


                            var regexp = (campo.expresionregular) ? new RegExp(campo.expresionregular) : undefined;
                            var mensaje = (campo.expresionregular) ? campo.mensaje : undefined;


                            if (!campo.estextarea) {
                                if (!campo.espass) {
                                    self.campoTexto = new Ext.form.TextField({
                                        fieldLabel   : campo.nombre,
                                        anchor       : '99%',
                                        id           : self.id + 'campoTexto' + campo.index,
                                        allowBlank   : (campo.nulo == undefined) ? true : campo.nulo,
                                        regex        : regexp,
                                        regexText    : mensaje,
                                        maxLength    : (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                        maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                        blankText    : 'Este campo es obligatorio.',
                                        width        : (campo.ancho) ? campo.ancho : ancho,
                                        name         : campo.index,
                                    });
                                } else {
                                    self.campoTexto = new Ext.form.TextField({
                                        fieldLabel   : campo.nombre,
                                        anchor       : '99%',
                                        id           : self.id + 'campoTexto' + campo.index,
                                        allowBlank   : (campo.nulo == undefined) ? true : campo.nulo,
                                        regex        : regexp,
                                        regexText    : mensaje,
                                        blankText    : 'Este campo es obligatorio.',
                                        maxLength    : (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                        maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                        width        : (campo.ancho) ? campo.ancho : ancho,
                                        inputType    : 'password',
                                        name         : campo.index,
                                    });
                                    renderer = function (val) {
                                        return "<center><img src='../imagenes/pass.PNG' /></center>";
                                    }
                                }

                            } else {

                                self.campoTexto = new Ext.form.TextArea({
                                    fieldLabel   : campo.nombre,
                                    anchor       : '99%',
                                    id           : self.id + 'campoTexto' + campo.index,
                                    allowBlank   : (campo.nulo == undefined) ? true : campo.nulo,
                                    regex        : regexp,
                                    regexText    : mensaje,
                                    maxLength    : (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                    maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                    blankText    : 'Este campo es obligatorio.',
                                    width        : (campo.ancho) ? campo.ancho : ancho,
                                    name         : campo.index
                                });
                            }


                            self.Filtros.push({
                                type     : 'string',
                                dataIndex: campo.index
                            });

                            self.acomodarElementoFormGestion(self, self.campoTexto, campo, false);

                            self.elementosFormulario[campo.index] = self.campoTexto.id;
                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor  : self.id + 'campoTexto' + campo.index,
                                        tipo   : 'texto'
                                    });
                            }

                            break;
                        case 'numero':
                            self.campoNumero = campo.componente || new Ext.form.NumberField({
                                fieldLabel      : campo.nombre,
                                id              : self.id + 'campoNumero' + campo.index,
                                name            : campo.index,
                                anchor          : '99%',
                                allowBlank      : (campo.nulo) ? campo.nulo : undefined,
                                width           : (campo.ancho) ? campo.ancho : ancho,
                                allowDecimals   : (campo.allowdecimals) ? campo.allowdecimals : undefined,
                                allowNegative   : (campo.allownegative) ? campo.allownegative : undefined,
                                decimalPrecision: (campo.decimalprecision) ? campo.decimalprecision : undefined,
                                nanText         : 'Este valor es incorrecto.',
                                blankText       : 'Este campo es obligatorio.'
                            });
                            self.Filtros.push({
                                type     : 'numeric',
                                dataIndex: campo.index
                            });
                            tipo = 'float';
                            self.acomodarElementoFormGestion(self, self.campoNumero, campo, false);

                            self.elementosFormulario[campo.index] = self.campoNumero.id;
                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor  : self.campoNumero.id,
                                        tipo   : 'numero'
                                    });
                            }
                            break;
                        case 'fecha':
                            self.campoFecha = (campo.componente) ? campo.componente : new Ext.form.DateField({
                                fieldLabel : campo.nombre,
                                id         : self.id + 'campoFecha' + campo.index,
                                allowBlank : (campo.nulo) ? campo.nulo : undefined,
                                format     : (campo.formato) ? campo.formato : 'd/m/Y',
                                editable   : (campo.editable) ? campo.editable : false,
                                readOnly   : (campo.readonly) ? campo.readonly : false,
                                anchor     : '99%',
                                value      : new Date().format('d/m/Y'),
                                blankText  : 'Este campo es obligatorio.',
                                invalidText: 'Este valor es incorrecto.',
                                name       : campo.index,
                                width      : (campo.ancho) ? campo.ancho : ancho
                            });


                            self.campoFecha.fielLabel = campo.nombre;
                            self.campoFecha.name = campo.index;
                            //self.campoFecha.id=self.id + 'campoFecha' + campo.index;

                            self.Filtros.push({
                                type     : 'date',
                                dataIndex: campo.index
                            });

                            //renderer = /*(campo.formato)?Ext.util.Format.dateRenderer(campo.formato):*/Ext.util.Format.dateRenderer('n/d/Y');
                            renderer = function formatDate(value, metaData, record, rowIndex, colIndex, store) {
                                if (value) {
                                    if (record.get('presente') == 0) {
                                        return (value instanceof Date) ? '<i><b>' + value.format('d/m/Y') + '</i></b>' : '<i><b>' + value + '</i></b>';
                                    } else {
                                        return (value instanceof Date) ? value.format('d/m/Y') : value;
                                    }
                                }
                            };
                            tipo = 'date';
                            self.acomodarElementoFormGestion(self, self.campoFecha, campo, false);

                            self.elementosFormulario[campo.index] = self.campoFecha.id;

                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor  : self.campoFecha.id,
                                        tipo   : 'fecha'
                                    });
                            }
                            break;
                        case 'lista':


                            self.camposStoreCombo = new Array({
                                    name: campo.campovalor
                                },
                                {
                                    name: campo.campoamostrar
                                }
                            );


                            self.StoreCombo = new Ext.data.Store({
                                storeId: campo.campovalor + campo.index + 'StoreCombo' + self.id,
                                id     : campo.campovalor + campo.campoamostrar + 'StoreCombo' + self.id,
                                reader : new Ext.data.JsonReader({
                                    totalProperty: "cantidad",
                                    root         : "datos",
                                    id           : campo.campovalor + campo.index + 'readerCombo' + self.id,
                                    fields       : self.camposStoreCombo
                                })
                            });

                            self.cantCombos++;
                            var campoamostrar = campo.campoamostrar;
                            var campovalor = campo.campoamostrar;
                            renderer = null;
                            if (campo.campovalor != campo.campoamostrar) {
                                renderer = function (val, metadata, record, rowIndex, colIndex, store) {

                                    var posGrid = colIndex - 1;
                                    if (posGrid > 0) {
                                        var campoamostrar = this.configuracion[posGrid].campoamostrar;
                                        var campovalor = this.configuracion[posGrid].campovalor;
                                        var storeComboActual = this.configuracion[posGrid].StoreCombo;
                                        if (storeComboActual) {
                                            var pos = storeComboActual.findBy(function (rec, id) {
                                                if (rec.data[campovalor] == val) {
                                                    return true;
                                                }
                                                else {
                                                    return false;
                                                }

                                            });

                                            //validar cuando se adiciona una fila no viene valor
                                            if (pos != -1) {
                                                return (storeComboActual.getAt(pos).data)[campoamostrar];
                                            } else {
                                                console.log('soy -1')
                                            }

                                        }
                                    }

                                }.createDelegate(self);
                                campoamostrar = campo.campoamostrar;
                                campovalor = campo.campovalor;
                            }

                            self.hiddencampoLista = new Ext.form.Hidden({
                                id  : 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                                name: campo.index
                            });


                            self.campoLista = new Ext.form.ComboBox({
                                fieldLabel        : campo.nombre,
                                id                : 'campoLista' + self.id + campo.index,
                                idhiddencampoLista: 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                                width             : (campo.ancho) ? campo.ancho : ancho,
                                name              : campo.campoamostrar + '-combo',
                                triggerAction     : 'all',
                                anchor            : '99%',
                                emptyText         : 'Seleccione...',
                                valueField        : campo.campovalor,
                                displayField      : campo.campoamostrar,
                                hiddenName        : campo.campovalor + '-combo',
                                forceSelection    : true,
                                typeAhead         : true,
                                allowBlank        : (campo.nulo != undefined) ? campo.nulo : true,
                                mode              : 'local',
                                blankText         : 'Este campo es obligatorio.',
                                readOnly          : false,
                                store             : self.StoreCombo,
                                listeners         : {
                                    select: function (combo, record, index) {
                                        Ext.getCmp(this.idhiddencampoLista).setValue(combo.getValue());
                                        //combo.setRawValue(record.data[combo.campovalor]);
                                    }

                                }
                            });


                            tipo = 'string';
                            if (self.autoCargar) {
                                if (campo.consulta == undefined) {
                                    self.listarFilasCombo(self, campo, self.StoreCombo, false);
                                    self.configuracion[i]['traeconsulta'] = false;
                                } else {
                                    self.listarFilasCombo(self, campo, self.StoreCombo, true);
                                    self.configuracion[i]['traeconsulta'] = true;
                                }

                            }


                            /* self.camposStore.push({
                                 name: campo.campovalor,
                                 type: tipo
                             });*/


                            self.adicionarColumnaAncha(self, self.hiddencampoLista, true);
                            self.acomodarElementoFormGestion(self, self.campoLista, campo, false);
                            /*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                                self.acomodarElementoForm(self, self.campoLista, campo);
                            }
                            else {
                                self.adicionarColumnaAncha(self, self.campoLista);
                            }*/

                            self.elementosFormulario[campo.index] = self.hiddencampoLista.id;
                            self.elementosFormulario[campo.campovalor + '-combo'] = self.campoLista.id;

                            self.configuracion[i]['StoreCombo'] = self.StoreCombo;
                            if (campo.unico) {
                                self.columnasUnicas.push(
                                    {
                                        columna: campo.index,
                                        valor  : 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                                        tipo   : 'numero'
                                    });
                            }

                            break;
                        case 'logico':
                            self.campoBolean = new Ext.form.Checkbox(
                                {
                                    fieldLabel: campo.nombre,
                                    id        : self.id + 'campoBolean' + campo.index,
                                    name      : campo.index,
                                    width     : (campo.ancho) ? campo.ancho : ancho,
                                    checked   : (campo.checked) ? campo.checked : undefined,
                                    cls       : 'campoBolean',
                                    anchor    : '99%',
                                    listeners : {
                                        check: function (_this, checked) {

                                            if (checked) {
                                                this.setRawValue('on');
                                                console.log(this.getRawValue());
                                            } else {
                                                this.setRawValue('off');
                                                console.log(this.getRawValue());
                                            }
                                        }
                                    }
                                });
                            self.Filtros.push({
                                type     : 'boolean',
                                dataIndex: campo.index
                            });
                            renderer = self.cambiarRadio;
                            ancho = 50;
                            tipo = 'boolean';
                            self.acomodarElementoFormGestion(self, self.campoBolean, campo, false);
                            /*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                                self.acomodarElementoForm(self, self.campoBolean, campo);
                            }
                            else {
                                self.adicionarColumnaAncha(self, self.campoBolean);
                            }*/
                            self.elementosFormulario[campo.index] = self.campoBolean.id;
                            break;
                        case 'imagen':
                            ancho = 100;
                            self.mostrarBtnImagen = true;
                            self.columnaImagen = campo.index;
                            self.campoImagenForm = new Ext.ux.ScreenshotField({
                                fieldLabel : campo.nombre,
                                hideLabel  : false,
                                allowUpload: true,
                                name       : campo.index,
                                anchor     : '99%',
                                id         : self.id + 'campoImagenForm' + campo.index,
                                allowBlank : true,
                                height     : (campo.ancho) ? campo.ancho - 10 : ancho,
                                width      : (campo.ancho) ? campo.ancho : ancho,
                            });

                            renderer = function (val) {
                                var size = 20;
                                if (val) {
                                    return "<img class='imagen' src=" + val + " width='" + size + "' height='" + size + "' />";
                                }
                                return "<center></center><img src=/metadatos/metaconfig/views/js/nomdinamicos/images/no-photo-male.png width='" + size + "' height='" + size + "' />";

                            }.createDelegate(self);
                            ancho = 100;
                            self.acomodarElementoFormGestion(self, self.campoImagenForm, campo, false);


                            self.elementosFormulario[campo.index] = self.campoImagenForm.id;
                            tipo = 'string';


                            break;
                        case 'oculto':
                            self.campoOculto = new Ext.form.Hidden({
                                id  : 'campoOculto' + self.id + campo.index,
                                name: campo.index
                            });

                            self.adicionarColumnaAncha(self, self.campoOculto, true);

                            self.elementosFormulario[campo.index] = self.campoOculto.id;
                            hidden = true;
                            break;
                    }
                }

                self.camposStore.push({
                    name      : campo.index,
                    type      : tipo,
                    dateFormat: 'j/m/Y'
                });

                if (campo.nombre == 'id') {
                    self.configuracion[0]['idconfiguracion'] = campo.index;
                    self.variables.indiceId = campo.index;
                    self.camposGrid.push({
                        id       : campo.index + 'campoGrid' + self.id,
                        header   : campo.nombre,
                        dataIndex: campo.index,
                        sortable : false,
                        tooltip  : (campo.descripcion) ? campo.descripcion : undefined,
                        hidden   : true,
                        hideable : false
                    });
                    self.hiddencampoId = new Ext.form.Hidden({
                        id  : 'hiddencampoId' + campo.campovalor + self.id + campo.index,
                        name: campo.index
                    });

                    self.adicionarColumnaAncha(self, self.hiddencampoId, true);
                    self.nuevaConfiguracion.push(self.configuracion[i]);
                    self.elementosFormulario[campo.index] = self.hiddencampoId.id;

                } else {

                    if (campo.tipo == 'lista') {
                        self.camposGrid.push({
                            id       : campo.index + 'campoGrid' + self.id,
                            header   : campo.nombre,
                            dataIndex: campo.index,
                            tooltip  : (campo.descripcion) ? campo.descripcion : undefined,
                            renderer : renderer,
                            sortable : true,
                            hidden   : (campo.oculto) ? campo.oculto : false,
                            width    : (campo.ancho) ? campo.ancho : ancho,
                            hideable : (campo.oculto) ? false : true
                        });
                    } else {

                        self.camposGrid.push({
                            id       : campo.index + 'campoGrid' + self.id,
                            header   : campo.nombre,
                            hidden   : hidden,
                            dataIndex: campo.index,
                            renderer : (campo.oculto) ? null : renderer,
                            tooltip  : (campo.descripcion) ? campo.descripcion : undefined,
                            sortable : true,
                            width    : (campo.ancho) ? (campo.tipo === 'imagen') ? 50 : campo.ancho : ancho,
                            hideable : (hidden) ? false : true
                        });
                    }
                }


            }

            for (var i = 0; i < self.configuracion.length; i++) {
                var campo = self.configuracion[i];
                var ancho = 200;
                var renderer = null;
                if (campo.nombre != 'id') {
                    switch (campo.tipo) {
                        case 'texto':
                            if (campo.mostraFiltro) {
                                self.campoTextoFiltro = new Ext.form.TextField({
                                    fieldLabel: campo.nombre,
                                    id        : self.id + 'campoTextoFiltro' + campo.index,
                                    allowBlank: true,
                                    emptyText : 'Criterio a buscar...',
                                    width     : 200,
                                    name      : campo.index + 'filtro',
                                    /*enableKeyEvents: true,
                                    listeners: {
                                        keyup: function () {
                                            var sucio=false;
                                            console.log(self.itemsFormularioFiltro);
                                            for (var i = 0; i < self.itemsFormularioFiltro.length; i++) {
                                                if (self.itemsFormularioFiltro[i].items[0].getValue() != '') {
                                                    sucio= true;
                                                    break;
                                                }
                                            }
                                            console.log(sucio);
                                            if (sucio) {
                                                self.btnBuscar.enable();
                                                self.btnLimpiar.enable();
                                            } else {

                                                self.btnBuscar.disable();
                                                self.btnLimpiar.disable();
                                            }
                                        }
                                    }*/
                                });


                                self.itemsFormularioFiltro.push({
                                    layout   : 'form',
                                    bodyStyle: 'padding:0 10px 0 0;',
                                    //columnWidth: 0.25,
                                    items    : [self.campoTextoFiltro]
                                });
                                self.datosFiltro.push(
                                    {
                                        columna: campo.index,
                                        valor  : self.id + 'campoTextoFiltro' + campo.index,
                                        tipo   : 'texto'
                                    });
                            }
                            break;
                        case 'lista':
                            if (campo.mostraFiltro) {
                                var camposStoreCombo = new Array({
                                        name: campo.campovalor
                                    },
                                    {
                                        name: campo.campoamostrar
                                    }
                                );

                                var StoreComboFiltro = new Ext.data.Store({
                                    url       : '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                                    autoLoad  : true,
                                    baseParams: {
                                        metodo  : 'listarGenerico',
                                        tabla   : campo.tabla,
                                        consulta: (campo.consulta) ? campo.consulta : undefined,
                                        id      : campo.idtabla
                                    },
                                    storeId   : campo.campovalor + campo.index + 'StoreComboFiltro' + self.id,
                                    id        : campo.campovalor + campo.campoamostrar + 'StoreComboFiltro' + self.id,
                                    reader    : new Ext.data.JsonReader({
                                        totalProperty: "cantidad",
                                        root         : "datos",
                                        id           : campo.campovalor + campo.index + 'readerComboFiltro' + self.id,
                                        fields       : camposStoreCombo
                                    })
                                });
                                var campoListaFiltro = new Ext.form.ComboBox({
                                    fieldLabel    : campo.nombre,
                                    id            : 'campoListaFiltro' + self.id + campo.index,
                                    width         : (campo.ancho) ? campo.ancho : ancho,
                                    name          : campo.campoamostrar + 'filtro',
                                    triggerAction : 'all',
                                    emptyText     : 'Seleccione...',
                                    valueField    : campo.campovalor,
                                    displayField  : campo.campoamostrar,
                                    hiddenName    : campo.campovalor,
                                    forceSelection: false,
                                    typeAhead     : true,
                                    allowBlank    : true,
                                    mode          : 'local',
                                    blankText     : 'Este campo es obligatorio.',
                                    readOnly      : false,
                                    store         : StoreComboFiltro,

                                });


                                self.itemsFormularioFiltro.push({
                                    layout   : 'form',
                                    bodyStyle: 'padding:0 10px 0 0;',
                                    //columnWidth: 0.25,
                                    items    : [campoListaFiltro]
                                });
                                self.datosFiltro.push(
                                    {
                                        columna: campo.index,
                                        valor  : 'campoListaFiltro' + self.id + campo.index,
                                        tipo   : 'numero'
                                    });
                            }

                            break;


                    }
                }


            }

            self.btnCancelarVentana = new Ext.Button({
                id     : 'idbtnCancelarVentana' + self.id,
                iconCls: 'cancelar',
                text   : 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                prevTab: 'id' + self.id,
                nextTab: 'btnAplicarVentana' + self.id,
                handler: function () {
                    self.ventanaGestion.hide();
                }
            });

            self.btnAplicarVentana = new Ext.Button({
                id     : 'idbtnAplicarVentana' + self.id,
                iconCls: 'aplicar',
                text   : 'Aplicar',
                tooltip: 'Guardar datos sin cerrar ventana',
                handler: function () {
                    self.guardarFilas(self, self.adicionar);
                    self.aplicar = true;
                }
            });

            self.btnAceptarVentana = new Ext.Button({
                id     : 'idbtnAceptarVentana' + self.id,
                iconCls: 'aceptar',
                text   : 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                prevTab: 'btnAplicarVentana' + self.id,
                nextTab: 'idtfDenomBilletes' + self.id,
                handler: function () {
                    self.guardarFilas(self, self.adicionar);
                    self.aplicar = false;
                }
            });

            self.formularioGestion = new Ext.FormPanel({
                monitorValid: true,
                autoHeight  : true,
                width       : (self.anchoForm) ? self.anchoForm : 500,
                frame       : true,
                bodyStyle   : 'padding: 5px;',
                labelAlign  : 'top',
                items       : {
                    layout: 'column',
                    items : self.itemsFormulario
                },
                listeners   : {
                    'clientvalidation': function (_form, _valid) {
                        if (_form.getForm().isDirty() && _valid) {
                            self.btnAplicarVentana.enable();
                            self.btnAceptarVentana.enable();
                        } else {
                            self.btnAplicarVentana.disable();
                            self.btnAceptarVentana.disable();
                        }

                    }
                }
            });

            self.btnBuscar = new Ext.Button({
                tooltip: "Buscar " + self.nombre + " <b>(Alt+B)</b>",
                text   : "<u>B</u>uscar",
                iconCls: 'buscar',
                id     : 'btnBuscarf' + self.id,
                handler: function () {
                    self.store.reload();
                }
            });

            self.btnLimpiar = new Ext.Button({
                tooltip: "Limpiar filtros <b>(Alt+L)</b>",
                text   : "<u>L</u>impiar",
                id     : 'btnAllAf' + self.id,
                iconCls: 'limpiar',
                handler: function () {
                    self.formularioGestionFiltro.getForm().reset();
                    self.store.reload();
                }
            });

            self.itemsFormularioFiltro.push({
                columnWidth: '35px',
                bodyStyle  : 'padding:19px 10px 0 0;',
                layout     : 'form',
                items      : [self.btnBuscar]
            });

            self.itemsFormularioFiltro.push({
                columnWidth: '35px',
                bodyStyle  : 'padding:19px 0 0 0;',
                layout     : 'form',
                items      : [self.btnLimpiar]
            });


            self.formularioGestionFiltro = new Ext.FormPanel({
                layout    : 'column',
                id        : 'formularioGestionFiltro' + self.id,
                region    : 'north',
                autoHeight: true,
                frame     : true,
                bodyStyle : 'padding: 0 0 0 0;',
                labelAlign: 'top',
                items     : self.itemsFormularioFiltro,
                keys      : [{
                    key: Ext.EventObject.ENTER, fn: function () {
                        self.btnBuscar.handler.call();
                    }
                }, {
                    key: 'l', alt: true, fn: function () {
                        self.btnLimpiar.handler.call();
                    }
                }]
            });


            //Ventana de adicionar y modificar.
            self.ventanaGestion = new Ext.Window({
                modal          : true,
                closeAction    : 'hide',
                autoHeight     : true,
                closable       : true,
                autoValidate   : true,
                validateDefault: true,
                constrain      : true,
                resizable      : true,
                layout         : 'fit',
                items          : [self.formularioGestion],
                buttons        : [self.btnCancelarVentana, self.btnAplicarVentana, self.btnAceptarVentana],
                keys           : [
                    {
                        key      : Ext.EventObject.ENTER,
                        stopEvent: true,
                        fn       : function () {
                            if (!self.btnAceptarVentana.disabled) {
                                self.btnAceptarVentana.handler();
                            }

                        }
                    },
                    {
                        key      : 'x',
                        alt      : true,
                        stopEvent: true,
                        fn       : function () {
                            if (!self.btnCancelarVentana.disabled) {
                                self.btnCancelarVentana.handler();
                            }
                        }
                    },
                    {
                        key      : 'p',
                        alt      : true,
                        stopEvent: true,
                        fn       : function () {
                            if (!self.btnAplicarVentana.disabled) {
                                self.btnAplicarVentana.handler();
                            }
                        }
                    }
                ],
                listener       : {
                    beforeshow: function (_this) {
                        self.btnAplicarVentana.disable();
                        self.btnAceptarVentana.disable();
                    }
                }
            });

            /*self.ventanaGestion.on('show', function (store, options) {
                self.itemsFormulario[self.cantCamposOcultos].items[0].focus(true,10);
            });*/


            self.store = new Ext.data.Store({
                url       : '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                autoLoad  : self.autoCargar,
                remoteSort: true,
                reader    : new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root         : "datos",
                    id           : self.variables.indiceId,
                    fields       : self.camposStore
                })
            });


            // self.mascaraGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});

            self.gpEditor = new Ext.grid.EditorGridPanel({
                region      : 'center',
                id          : self.id + 'gpEditor',
                store       : self.store,
                layout      : 'fit',
                border      : false,
                autoScroll  : true,
                loadMask    : {msg: 'Cargando...'},
                clicksToEdit: 1,
                sm          : self.csm,
                width       : '100%',
                height      : self.height - 10,
                columns     : self.camposGrid,
                viewConfig: {
                    getRowClass: function (record, rowIndex, p, store) {
                        if (record.get('gestion') == 0) {
                            return 'FilaNoGestionable';
                        }
                    }
                },
                bbar        : new Ext.PagingToolbar({
                    pageSize      : 15,
                    store         : self.store,
                    displayMsg    : 'Mostrando del {0} - {1} de {2}',
                    emptyMsg      : 'No hay datos que mostrar',
                    beforePageText: 'Página',
                    afterPageText : 'de {0}',
                    firstText     : 'Primera página',
                    prevText      : 'Página anterior',
                    nextText      : 'Proxima página',
                    lastText      : 'Útima página',
                    refreshText   : 'Actualizar',
                    displayInfo   : true
                }),
                plugins     : new Ext.grid.GridFilters({
                    local  : true,
                    store  : self.store,
                    filters: self.Filtros
                }),
                keys        : [{
                    key: Ext.EventObject.DELETE, fn: function () {
                        if (!self.btnEliminar.disabled && !self.btnEliminar.hidden) {
                            self.btnEliminar.handler.call();

                        }
                    }
                },
                    {
                        key: 'i', alt: true, stopEvent: true, fn: function () {
                            if (!self.btnAdicionar.disabled && !self.btnAdicionar.hidden) {
                                self.btnAdicionar.handler.call();
                            }
                        }
                    }, {
                        key: 'm', alt: true, stopEvent: true, fn: function () {
                            if (!self.btnModificar.disabled && !self.btnModificar.hidden) {
                                self.btnModificar.handler.call();
                            }
                        }
                    }, {
                        key: 'b', alt: true, stopEvent: true, fn: function () {

                            Ext.getCmp(self.datosFiltro[0].valor).focus(false, 10);
                        }
                    }]

            });


            self.store.on('update', function (store) {
                self.btnModificar.enable();
            });

            self.store.on('add', function (store) {
                self.btnModificar.enable();
            });

            self.store.on('beforeload', function (store, options) {


                var filtro = undefined;
                var filtroTemp = (self.filtro) ? self.filtro.slice() : new Array();


                if (self.datosFiltro.length > 0) {
                    for (var i = 0; i < self.datosFiltro.length; i++) {
                        var valor = Ext.getCmp(self.datosFiltro[i].valor).getValue();
                        if (!(valor == '' || valor == null || valor == undefined)) {
                            filtroTemp.push(
                                {
                                    columna: self.datosFiltro[i].columna,
                                    valor  : valor,
                                    tipo   : self.datosFiltro[i].tipo
                                }
                            );
                        }

                    }
                }
                if (filtroTemp.length > 0) {
                    filtro = Ext.encode(filtroTemp);
                }


                store.baseParams = {
                    metodo : (self.urlListar) ? self.urlListar : 'listarGenerico',
                    tabla  : self.tabla,
                    idtabla: self.idtabla,
                    filtro : filtro
                    /*,
                    start: (store.baseParams.start)?store.baseParams.start:
                        (self.store.lastOptions)?self.store.lastOptions.params.start:0,
                    limit: (store.baseParams.limit)?store.baseParams.limit:
                        (self.store.lastOptions)?self.store.lastOptions.params.limit:15*/


                }
            });

            function esperarCombosCargados() {
                if (self.cantCombosCargados != self.cantCombos) {
                    esperarCombosCargados();
                }
            }

            self.store.on('load', function (store, options) {
                if (self.itemsFormularioFiltro.length > 2) {
                    self.itemsFormularioFiltro[0].items[0].focus(false, 10);
                }

            });


            //Codigo para mostrar la ventana imagen
            if (!self.mostrarBtnImagen) {
                self.btnAsociarImagen.hidden = true;
            }

            //Obtener la ultima fila seleccionada
            self.ultimaFilaSeleccionada = -1;
            var hisNodosSeleccionados = new Array();
            self.lastFilaseleccionada = null;
            var miArray = new Array();
            var indiceFila = -1;
            self.gpEditor.selModel.on('rowselect', function (_this, rowIndex, record) {
                var id = record.id;
                indiceFila = miArray.indexOf(id);
                if (indiceFila == -1) {
                    hisNodosSeleccionados.push(record);
                    miArray.push(id);
                    self.btnAsociarImagen.enable();
                }

                self.ultimaFilaSeleccionada = rowIndex;
                self.lastFilaseleccionada = record;
                self.fireEvent('elementochequeado', {
                    record  : record,
                    rowindex: rowIndex
                });


            });

            self.gpEditor.selModel.on('rowdeselect', function (_this, rowIndex, record) {
                var id = record.id;
                indiceFila = miArray.indexOf(id);
                miArray.remove(id);
                hisNodosSeleccionados.remove(hisNodosSeleccionados[indiceFila]);
                if (miArray.length == 0) {
                    self.btnAsociarImagen.disable();
                }
                self.lastFilaseleccionada = hisNodosSeleccionados[hisNodosSeleccionados.length - 1];
                self.fireEvent('elementodeschequeado', {
                    record  : record,
                    rowindex: rowIndex
                });
            });


            var items = (self.itemsFormularioFiltro.length > 2) ?
                [self.formularioGestionFiltro, self.gpEditor] :
                [self.gpEditor];
            var layout = (self.itemsFormularioFiltro.length > 2) ? 'border' : 'fit';
            var keys = [{
                key: Ext.EventObject.DELETE, fn: function () {
                    if (!self.btnEliminar.disabled && !self.btnEliminar.hidden) {
                        self.btnEliminar.handler.call();

                    }
                }
            },
                {
                    key: 'I', alt: true, stopEvent: true, fn: function () {
                        if (!self.btnAdicionar.disabled && !self.btnAdicionar.hidden) {
                            self.btnAdicionar.handler.call();
                        }
                    }
                }, {
                    key: 'M', alt: true, stopEvent: true, fn: function () {
                        if (!self.btnModificar.disabled && !self.btnModificar.hidden) {
                            self.btnModificar.handler.call();
                        }
                    }
                }];


            Ext.apply(this, {
                layout     : layout,
                collapsible: true,
                tbar       : [self.btnAdicionar, self.btnModificar, self.btnEliminar/*, self.btnActualizar*/, self.btnVerDetalles],
                items      : items
                , keys     : keys
            });


            Misitio.Panel_Gestion.GestionGridPanel.superclass.initComponent.apply(this);

        }
        ,
        centrarValor                  : function (val) {
            if (val)
                return "<center>" + val + "</center>";
        }
        ,
        acomodarElementoForm          : function (self, elementoForm, campo) {
            if (self.columnasForm && Ext.isArray(self.columnasForm)) {
                if (self.columnaFormAncha) {
                    for (var i = 0; i < self.columnasForm.length; i++) {
                        if ((campo.columnForm - 1) == i) {
                            self.itemsFormulario.push(
                                {
                                    layout     : 'form',
                                    bodyStyle  : 'padding:5px 5px 5px 5px;',
                                    columnWidth: self.columnasForm[i],
                                    items      : [elementoForm]
                                }
                            );
                        } else {
                            self.itemsFormulario.push(
                                {
                                    layout     : 'form',
                                    bodyStyle  : 'padding:5px 5px 5px 5px;',
                                    columnWidth: self.columnasForm[i],
                                    items      : new Array({})
                                }
                            );
                        }

                    }
                    self.columnaFormAncha = false;
                } else {
                    self.itemsFormulario[(self.itemsFormulario.length - self.columnasForm.length - 1) + (campo.columnForm)].items.push(elementoForm);
                }


            }
        }
        ,
        acomodarElementoFormGestion   : function (self, elementoForm, campo, esOculto) {
            if (campo.tipo != 'imagen') {
                self.itemsFormulario.push(
                    {
                        layout     : 'form',
                        bodyStyle  : 'padding:3px;margin:auto;',
                        columnWidth: (campo.tamannoForm <= 1) ? campo.tamannoForm : 1,
                        items      : [elementoForm]
                    }
                );
            } else {
                var anchoCampo = (campo.ancho) ? campo.ancho : 100;
                var ancho = self.anchoForm / 2 - anchoCampo / 2 - 20;
                //console.log(ancho);

                self.itemsFormulario.push(
                    {
                        layout     : 'form',
                        bodyStyle  : 'padding:0 0 0 ' + ancho + 'px',
                        columnWidth: (campo.tamannoForm <= 1) ? campo.tamannoForm : 1,
                        items      : [elementoForm]
                    }
                );

            }

        }
        ,
        acomodarElementoFormGestionOld: function (self, elementoForm, campo, esOculto) {
            if (campo.columnForm && campo.columnForm > 0 && campo.columnForm <= self.columnasForm.length) {
                self.acomodarElementoForm(self, elementoForm, campo);
            }
            else {
                self.adicionarColumnaAncha(self, elementoForm);
            }
        }
        ,
        adicionarColumnaAncha         : function (self, elementoForm, esOculto) {

            if (!esOculto) {
                self.itemsFormulario.push(
                    {
                        layout     : 'form',
                        //bodyStyle: 'padding:5px 5px 5px 5px;',
                        columnWidth: .99,
                        items      : [elementoForm]
                    }
                );
                self.columnaFormAncha = true;
            } else {

                self.itemsFormulario.unshift(elementoForm);
                self.cantCamposOcultos++;

            }

        }
        ,
        crearNodoLeyenda              : function (accion, text) {
            var div = "<div class='animacionContenedor" + accion + " contenedorLeyendaProyecto'><div class='iconLeyenda " + accion + "Leyend rotateLeyend'></div><div class='textLeyenda " + accion + "LeyendColor'>" + text + "</div>";
            return div;
        }
        ,
        obtenerFiltro                 : function (self) {

            self.filtro.push();
        }

        ,
        cambiarRadio    : function (val) {
            if (val) {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/checked.png' /></center>";
            } else {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/unchecked.png' /></center>";
            }
        }
        ,
        limpiarGrid     : function (self) {
            self.btnModificar.disable();
            self.btnEliminar.disable();
            self.btnVerDetalles.disable();
            self.variables.filasAmodificar = new Array();
            self.variables.filasAguardar = new Array();
            self.variables.filasAeliminar = new Array();
            self.store.removeAll();
            self.csm.clearSelections();
            self.store.reload();
        }
        ,
        buscar          : function (array, elemento) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == elemento) {
                    return true;
                }
            }
            return false;
        }
        ,
        adicionarFila   : function (self) {
            self.adicionar = true;
            self.btnAplicarVentana.show();
            self.ventanaGestion.show();

            self.itemsFormulario[self.cantCamposOcultos].items[0].focus(false, 10);


            self.ventanaGestion.setTitle('Adicionar ' + self.nombre);
            self.formularioGestion.getForm().reset();

        }
        ,
        actualizarVista : function (self) {
            self.store.load({params: {limit: 15, start: 0}});
        }
        ,
        cargarElementos : function (self) {
            for (var i = 0; i < self.configuracion.length; i++) {
                if (self.configuracion[i].StoreCombo) {
                    self.listarFilasCombo(self, self.configuracion[i], self.configuracion[i].StoreCombo, self.configuracion[i].traeconsulta);
                }
            }
            self.actualizarVista(self);
        }
        ,
        listarFilasCombo: function (self, campo, store, traeconsulta) {
            var consulta = (traeconsulta) ? campo.consulta : undefined;
            Ext.Ajax.request({
                url     : '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method  : 'POST',
                params  : {
                    metodo  : 'listarGenerico',
                    tabla   : campo.tabla,
                    consulta: consulta,
                    id      : campo.idtabla
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        store.loadData(respuesta);
                        self.cantCombosCargados++;

                        if (self.cantCombosCargados == self.cantCombos && self.autoCargar) {
                            self.actualizarVista(self);
                        }
                    } else {
                        var error = respuesta.error;
                        self.mostrarError(error, self, 1);
                    }
                }
            });
        }
        ,
        guardarFilas    : function (self, adicionar) {

            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});
            var filaAguardar = self.dameFilaAguardar(self, adicionar);
            //console.log(filaAguardar);return;

            var columnasunicas = undefined;
            var columnasTemp = new Array();
            if (self.columnasUnicas.length > 0) {
                for (var i = 0; i < self.columnasUnicas.length; i++) {
                    var valor = Ext.getCmp(self.columnasUnicas[i].valor).getValue();
                    if (!(valor == '' || valor == null || valor == undefined)) {
                        columnasTemp.push(
                            {
                                columna: self.columnasUnicas[i].columna,
                                valor  : valor,
                                tipo   : self.columnasUnicas[i].tipo
                            }
                        );
                    }

                }
                columnasunicas = Ext.encode(columnasTemp);
            }

            myMask.show();
            Ext.Ajax.request({
                url     : '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method  : 'POST',
                params  : {
                    metodo        : (self.urlGuardar) ? self.urlGuardar : 'guardarGenerico',
                    tabla         : self.tabla,
                    idtabla       : self.idtabla,
                    adicionar     : adicionar,
                    filaAguardar  : Ext.encode(filaAguardar),
                    columnasunicas: columnasunicas
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        myMask.hide();
                        if (!self.aplicar) {
                            self.ventanaGestion.hide();
                        }
                        var tipoMensaje = (adicionar) ? 'adicionar' : 'modificar';

                        self.dameMensaje(self, tipoMensaje, false);
                        self.limpiarGrid(self);

                    } else {
                        myMask.hide();
                        var error = respuesta.error;
                        var addOmod = (adicionar) ? 'adicionar' : 'modificar';
                        //8 advertencia,6 error, default informacion
                        self.dameMensaje(self, addOmod + 'existe', false);

                    }

                }
            });


        }
        ,

        modificarFilas       : function (self) {
            self.adicionar = false;
            self.ventanaGestion.show();

            self.ventanaGestion.setTitle('Modificar ' + self.nombre);
            self.btnAplicarVentana.hide();
            self.cargarDatosFormulario(self);

            self.itemsFormulario[self.cantCamposOcultos].items[0].focus(true, 10);


        }
        ,
        cargarDatosFormulario: function (self) {

            self.formularioGestion.getForm().loadRecord(self.lastFilaseleccionada);


            for (var i = 0; i < self.configuracion.length; i++) {
                if (self.configuracion[i].StoreCombo != undefined) {
                    var filas = self.configuracion[i].StoreCombo.data.items;
                    //console.log(filas);
                    var filaSelection = self.lastFilaseleccionada.data;
                    //console.log(filaSelection);
                    for (var j = 0; j < filas.length; j++) {
                        //si el id de la tabla no existe es porque es nueva
                        if (filas[j].data[self.configuracion[i].campovalor] == filaSelection[self.configuracion[i].index]) {
                            var idElementoFormulario = self.elementosFormulario[self.configuracion[i].campovalor + '-combo'];


                            Ext.getCmp(idElementoFormulario).setValue(filas[j].data[self.configuracion[i].campoamostrar]);
                            //console.log(Ext.getCmp(idElementoFormulario));


                        }
                    }
                }
            }
            //console.log(self.formularioGestion.getForm().items);
        }
        ,
        eliminarFilas        : function (self) {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});
            var filasAeliminar = self.dameFilasAeliminar(self);
            myMask.show();
            Ext.Ajax.request({
                url     : '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method  : 'POST',
                params  : {
                    metodo        : (self.urlEliminar) ? self.urlEliminar : 'eliminarGenerico',
                    tabla         : self.tabla,
                    idtabla       : self.idtabla,
                    filasAeliminar: Ext.encode(filasAeliminar)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        myMask.hide();
                        var tipoMensaje = 'eliminar';
                        var plural = (filasAeliminar.length > 1) ? true : false;

                        self.dameMensaje(self, tipoMensaje, plural);

                        self.limpiarGrid(self);
                    } else {
                        myMask.hide();
                        var error = respuesta.error;
                        self.mostrarError(error, self, 3);

                    }

                }
            });
        }
        ,
        dameFilaAguardar     : function (self, adicionar) {
            var filaAguardar = {};

            var elementosForm = self.elementosFormulario;

            for (var propiedad in elementosForm) {
                /* console.log(Ext.getCmp(elementosForm[propiedad]));
                 console.log(Ext.getCmp(elementosForm[propiedad]).getValue());*/
                if (Ext.getCmp(elementosForm[propiedad]).getValue() === true) {
                    filaAguardar[propiedad] = 'on';
                } else if (Ext.getCmp(elementosForm[propiedad]).getValue() === false) {
                    filaAguardar[propiedad] = 'off';
                } else if (!Ext.getCmp(elementosForm[propiedad]).getValue()) {
                    if (propiedad == "gestion") {
                        filaAguardar[propiedad] = 1;
                    }else
                    if (self.configuracion[0]['idconfiguracion'] != propiedad) {
                        filaAguardar[propiedad] = 'vacio';
                    }
                } else {
                    filaAguardar[propiedad] = Ext.getCmp(elementosForm[propiedad]).getValue();
                }

            }

            return filaAguardar;
        }
        ,
        dameFilaAmodificar   : function (self) {

            var filasmodificadas = self.store.modified;

            var filasAmodificar = new Array();
            for (var i = 0; i < filasmodificadas.length; i++) {
                if (filasmodificadas[i].data[self.variables.indiceId] != undefined) {
                    filasAmodificar.push(filasmodificadas[i].data);
                }
            }
            return filasAmodificar;
        }
        ,
        dameFilasAeliminar   : function (self) {
            var filasmarcadas = self.csm.getSelections();
            var filasAeliminar = new Array();
            for (var i = 0; i < filasmarcadas.length; i++) {
                if (filasmarcadas[i].data[self.variables.indiceId] != undefined) {
                    filasAeliminar.push(filasmarcadas[i].data[self.variables.indiceId]);
                }
            }
            return filasAeliminar;
        }
        ,

        errorAsString : function (error) {
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
        mostrarError  : function (error, self, tipomensaje) {
            var errorString = self.errorAsString(error);
            var msg = '';
            if (tipomensaje == 1) {
                msg = 'Ocurrió un error al seleccionar los datos: <br/>' /*+ errorString*/;
            } else if (tipomensaje == 2) {
                msg = 'Ocurrió un error al guardar los datos: <br/>' /*+ errorString*/;
            } else {
                msg = 'Ocurrió un error al eliminar los datos: <br/>' /*+ errorString*/;
            }

            if (error[0] && error[0].code == 23503) {
                Ext.Msg.show({
                    title  : 'Información',
                    msg    : 'El elemento no se puede eliminar porque se encuentra en uso.',
                    buttons: Ext.Msg.OK,
                    animEl : 'elId',
                    icon   : Ext.MessageBox.INFO
                });
            } else {
                self.mostrarMensaje(msg, errorString);
            }


            /*Ext.Msg.show({
                title  : 'Fatal error',
                msg    : msg,
                buttons: Ext.Msg.OK,
                animEl : 'elId',
                icon   : Ext.MessageBox.ERROR
            });*/
        }
        ,
        mostrarMensaje: function (msg, detalle) {
            var ventanaError = new Ext.Window({
                title      : ' Error ',
                modal      : true,
                width      : 500,
                minWidth   : 500,
                buttonAlign: 'center',
                autoHeight : true,
                bodyBorder : false,
                layout     : 'fit',
                defaults   : {
                    frame : true,
                    border: false
                },
                items      : new Ext.Panel({
                    frame        : true,
                    monitorResize: true,
                    autoHeight   : true,
                    layout       : 'column',
                    items        : [
                        {
                            columnWidth: .15,
                            items      : {
                                style: 'margin:2px 0px 0px 2px;',
                                html : '<div id="pIconoERROR" class="iconoERROR"></div>'
                            }
                        },
                        {
                            columnWidth: .75,
                            items      : {
                                xtype     : 'panel',
                                autoHeight: true,
                                html      : '<div id="pMSG">' + msg + '</div>'
                            }
                        },
                        {
                            columnWidth: 1,
                            items      : new Ext.form.FieldSet({
                                id         : 'ventanaError',
                                autoScroll : true,
                                layout     : 'form',
                                title      : ' Detalles : ',
                                autoWidth  : true,
                                html       : '<div id="pDetalle"><pre>' + detalle + '</pre></div>',
                                height     : 150,
                                collapsed  : true,
                                collapsible: true
                            })
                        }
                    ]
                }),
                buttons    : [
                    {
                        text   : 'Aceptar',
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
        modificaFiltro             : function (self, filtro) {
            self.filtro = filtro;
        }
        ,
        addFiltro                  : function (self, nuevoElemento) {
            self.filtro.push(nuevoElemento);
        }
        ,
        dameUltimafilaSeleccionada : function (self) {
            return self.lastFilaseleccionada;
        }
        ,
        mostrarVentanaAsociarImagen: function (self) {
            var ventanaImagen = Misitio.Funciones.VentanaImagen(
                {
                    id: self.id + 'ventanaImagen'
                });

            var panelImagen = ventanaImagen.initialConfig.items[0];
            var campoImagen = panelImagen.damecampoImagen(panelImagen);

            campoImagen.setValue(self.lastFilaseleccionada.data[self.columnaImagen]);

            var ultimaFilaPuesta = undefined;
            var valorImagenSeleccionado = self.lastFilaseleccionada.data[self.columnaImagen];

            panelImagen.on('salvarimagen', function (datosImagen) {
                var columnaImagen = self.columnaImagen;

                self.lastFilaseleccionada.data[columnaImagen] = datosImagen.valorimagen;
                self.lastFilaseleccionada.commit();

                ultimaFilaPuesta = self.lastFilaseleccionada;
                if (datosImagen.esbotonguardar) {
                    self.store.getModifiedRecords().push(self.lastFilaseleccionada);
                    ventanaImagen.close();
                }
            });

            panelImagen.on('cancelar', function (val) {
                if (ultimaFilaPuesta != undefined) {
                    self.lastFilaseleccionada.data[self.columnaImagen] = valorImagenSeleccionado;
                    self.lastFilaseleccionada.commit();
                }
                ventanaImagen.close();

            });


        }
        ,
        verDetalles                : function (self, record) {

            var data = new Array();

            for (var i = 0; i < self.configuracion.length; i++) {
                var columna = self.configuracion[i].nombre;
                var tipo = self.configuracion[i].tipo;
                var campovalor = self.configuracion[i].campovalor;
                var campoamostrar = self.configuracion[i].campoamostrar;
                var valor = record.data[self.configuracion[i].index];
                if (tipo == 'fecha') {
                    valor = (valor) ? new Date(valor).format('j-m-Y') : undefined;
                }
                if (tipo == 'lista') {
                    var pos = self.configuracion[i].StoreCombo.findBy(function (rec, id) {
                        if (rec.data[campovalor] == valor) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if (pos != -1) {
                        valor = (self.configuracion[i].StoreCombo.getAt(pos).data)[campoamostrar];
                    }
                }
                if (tipo == 'logico') {
                    valor = (valor == true) ? 'Sí' : 'No';
                }
                if (!valor) {
                    valor = 'No tiene ' + columna.toLowerCase();
                }

                data.push({
                    columna: columna, tipo: tipo, valor: valor
                });
            }

            Misitio.Funciones.VentanaDetalles({id: 'ventanaDetallesEditorGridPanel', configuracion: data});


        }
        ,
        dameStoreGrid              : function (self) {
            return self.gpEditor.getStore();
        }
        ,
        dameConfiguracion          : function (self) {
            return self.configuracion;
        }
        ,
        dameMensaje                : function (self, tipo, plural) {

            var femenino = self.configuracionMensajes.femenino;
            var numeroConcepto = self.configuracionMensajes.numero;


            function damePosicionElementoVocabulario(elemento, plural, femenino) {
                var vocabulario = {
                    'El'          : ['El', 'La', 'Los', 'Las'],
                    'el'          : ['el', 'la', 'los', 'las'],
                    'un'          : ['un', 'una', 'unos', 'unas'],
                    'de'          : ['del', 'de la', 'de los', 'de las'],
                    'este'        : ['este', 'esta', 'estos', 'estas'],
                    'ha'          : ['ha', 'ha', 'han', 'han'],
                    'o'           : ['o', 'a', 'os', 'as'],
                    'caracter'    : ['caracter', 'caracter', 'caracteres', 'caracteres'],
                    'especial'    : ['especial', 'especial', 'especiales', 'especiales'],
                    'adicionado'  : ['adicionado', 'adicionada', 'adicionados', 'adicionadas'],
                    'modificado'  : ['modificado', 'modificada', 'modificados', 'modificados'],
                    'seleccionado': ['seleccionado', 'seleccionada', 'seleccionados', 'seleccionadas'],
                    'eliminado'   : ['eliminado', 'eliminada', 'eliminados', 'eliminadas'],
                    'guardado'    : ['guardado', 'guardada', 'guardados', 'guardadas'],
                    'puede'       : ['puede', 'puede', 'pueden', 'pueden'],
                    'está'        : ['está', 'está', 'están', 'están'],
                };

                var pos = (plural ? 2 : 0) + (femenino ? 1 : 0);

                return vocabulario[elemento][pos];

            };
            var mensaje = '';
            var tipoMensaje = 2;
            switch (tipo) {
                case 'adicionar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('adicionado', plural, femenino) + ' satisfactoriamente.';

                    break;
                case 'modificar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('modificado', plural, femenino) + ' satisfactoriamente.';
                    break;
                case 'eliminar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('eliminado', plural, femenino) + ' satisfactoriamente.';
                    break;
                case 'confirmareliminar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = '¿Está seguro que quiere eliminar ' + damePosicionElementoVocabulario('el', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' ' + damePosicionElementoVocabulario('seleccionado', plural, femenino) + '?';
                    return mensaje;
                    break;

                case 'adicionarexiste':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' que desea adicionar ya existe';
                    return mostrarMensaje(6, mensaje);
                    break;
                case 'modificarexiste':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' que desea modificar ya existe';
                    return mostrarMensaje(6, mensaje);
                    break;
            }
            return mostrarMensaje(tipoMensaje, mensaje);

        }


    }
);

Misitio.Panel_Gestion.GestionGridPanelDetalle = Ext.extend(Ext.Panel,
    {
        title: ''
        , id: ''
        , nombre: ''
        , columnaDetalle: false
        , urlListar: false
        , urlGuardar: false
        , urlEliminar: false
        , tabla: ''
        , idtabla: ''
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
        , configuracionMensajes: false
        , filtro: new Array()
        , autoCargar: true
        , anchoForm: false
        , singleSelect: false
        , ocultarbtnModificar: false
        , ocultarbtnAdicionar: false
        , ocultarbtnEliminar: false
        , ocultarbtnActualizar: false
        , ocultarbtnVerDetalles: false
        , ocultarbtnAsociarImagen: false
        , initComponent: function () {

        var self = this;
        self.configuracionMensajes = (self.configuracionMensajes)
            ? self.configuracionMensajes :
            {femenino: false, numero: ['concepto', 'conceptos']};
        self.nombre = self.nombre.toLowerCase();
        self.adicionar = true;
        self.mostrarBtnImagen = false;
        self.columnaImagen = null;
        self.cantCamposOcultos = 0;
        self.valorMaestro = -1;

        self.valorcolumnaDetalle = null;
        self.columnasFormulario = new Array();
        self.aplicar = false;

        self.variables = {
            indiceId: undefined,
            campoamostrar: new Array(),
            campovalor: new Array(),
            filasAmodificar: new Array(),
            numColCampoLista: new Array(),
            filasStoreDelCombo: new Array()
        };

        self.btnModificar = new Ext.Button({
            text: "<u>M</u>odificar",
            hidden: self.ocultarbtnModificar,
            disabled: true,
            tooltip: "Modificar " + self.nombre + ' <b>(Alt+M)</b>',
            iconCls: 'modificar',
            id: "btnModificar" + self.id,
            handler: function () {
                self.modificarFilas(self);
            }
        });

        self.btnAdicionar = new Ext.Button({
            text: "Ad<u>i</u>cionar",
            hidden: self.ocultarbtnAdicionar,
            tooltip: "Adicionar " + self.nombre + ' <b>(Alt+I)</b>',
            iconCls: 'adicionar',
            id: "btnAdicionar" + self.id,
            handler: function () {
                self.adicionarFila(self);
            }
        });

        self.btnEliminar = new Ext.Button({
            text: "Eliminar",
            hidden: self.ocultarbtnEliminar,
            disabled: true,
            tooltip: "Eliminar " + self.nombre + ' <b>(DEL)</b>',
            iconCls: 'eliminar',
            id: "btnEliminar" + self.id,
            handler: function () {

                var filasAeliminar = self.dameFilasAeliminar(self);
                var tipoMensaje = 'confirmareliminar';
                var plural = (filasAeliminar.length > 1) ? true : false;

                var msg = self.dameMensaje(self, tipoMensaje, plural);

                Ext.Msg.show({
                    title: 'Confirmación',
                    msg: msg,
                    buttons: Ext.Msg.YESNO,
                    fn: function (btn, text) {
                        if (btn == 'yes') {
                            self.eliminarFilas(self);
                        } else if (btn == 'no') {

                        }
                    },
                    animEl: 'elId',
                    icon: Ext.MessageBox.QUESTION
                });


            }
        });

        self.btnActualizar = new Ext.Button({
            text: "Actualizar",
            hidden: self.ocultarbtnActualizar,
            tooltip: "Actualiza los datos",
            iconCls: 'actualizar',
            id: "btnActualizar" + self.id,
            handler: function () {
                self.store.reload();
                Ext.example.msg('Información', 'Vista actualizada correctamente.');
            }
        });

        self.btnVerDetalles = new Ext.Button({
            text: "Ver detalles",
            hidden: self.ocultarbtnVerDetalles,
            disabled: true,
            tooltip: "Muestra detalles del elemento seleccionado.",
            iconCls: 'detalles',
            id: "btnVerDetalles" + self.id,
            handler: function () {
                self.verDetalles(self, self.lastFilaseleccionada);

            }
        });

        self.btnAsociarImagen = new Ext.Button({
            text: "Asociar imagen",
            hidden: self.ocultarbtnAsociarImagen,
            disabled: true,
            tooltip: "Asocia una imagen al elemento seleccionado",
            iconCls: 'asociar',
            id: "btnAsociarImagen" + self.id,
            handler: function () {
                self.mostrarVentanaAsociarImagen(self);
            }
        });

        self.csm = new Ext.grid.RowSelectionModel({
            singleSelect: self.singleSelect,
            listeners: {
                rowselect: function (sm, rowIndex, r) {
                    var seleccion = self.csm.getSelections();
                    if (seleccion.length > 0) {
                        self.btnEliminar.enable();
                        self.btnModificar.enable();
                        self.btnVerDetalles.enable();

                    } else {
                        self.btnEliminar.disable();
                        self.btnModificar.disable();
                        self.btnVerDetalles.disable();
                    }
                },
                rowdeselect: function (sm, rowIndex, r) {
                    var seleccion = self.csm.getSelections();
                    if (seleccion.length > 0) {
                        self.btnEliminar.enable();
                        self.btnModificar.enable();
                        self.btnVerDetalles.enable();
                    } else {
                        self.btnEliminar.disable();
                        self.btnModificar.disable();
                        self.btnVerDetalles.disable();

                    }
                }
            }
        });


        self.camposGrid = new Array();
        self.contadorCamposFormulario = 0;
        self.contadorCamposResiduos = 0;
        self.columnaFormAncha = true;
        self.itemsFormulario = new Array();
        self.datosFiltro = new Array();
        self.columnasUnicas = new Array();
        self.itemsFormularioFiltro = new Array();
        self.elementosFormulario = {};
        self.camposStore = new Array();
        self.Filtros = new Array();
        self.nuevaConfiguracion = new Array();
        self.cantCombos = 0;
        self.camposGrid.push(new Ext.grid.RowNumberer({header: "#", width: 23}));
        // self.camposGrid.push(self.csm);

        self.configuracion[0]['idelemento'] = self.id;
        for (var i = 0; i < self.configuracion.length; i++) {

            var campo = self.configuracion[i];
            var editor = undefined;
            var ancho = 200;
            var tipo = 'string';

            var renderer = null;

            if (campo.nombre != 'id') {
                var hidden = false;
                if (campo.index == self.columnaDetalle) {
                    hidden = true;
                }
                switch (campo.tipo) {
                    case 'texto':
                        self.columnaTexto = campo.index;


                        var regexp = (campo.expresionregular) ? new RegExp(campo.expresionregular) : undefined;
                        var mensaje = (campo.expresionregular) ? campo.mensaje : undefined;


                        if (!campo.estextarea) {
                            if (!campo.espass) {
                                self.campoTexto = new Ext.form.TextField({
                                    fieldLabel: campo.nombre,
                                    anchor: '99%',
                                    hidden: hidden,
                                    hideLabel: hidden,
                                    disabled: hidden,
                                    id: self.id + 'campoTexto' + campo.index,
                                    allowBlank: (campo.nulo == undefined) ? true : campo.nulo,
                                    regex: regexp,
                                    regexText: mensaje,
                                    maxLength: (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                    maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                    blankText: 'Este campo es obligatorio.',
                                    width: (campo.ancho) ? campo.ancho : ancho,
                                    name: campo.index,
                                });
                            } else {
                                self.campoTexto = new Ext.form.TextField({
                                    fieldLabel: campo.nombre,
                                    hidden: hidden,
                                    hideLabel: hidden,
                                    disabled: hidden,
                                    anchor: '99%',
                                    id: self.id + 'campoTexto' + campo.index,
                                    allowBlank: (campo.nulo == undefined) ? true : campo.nulo,
                                    regex: regexp,
                                    regexText: mensaje,
                                    blankText: 'Este campo es obligatorio.',
                                    maxLength: (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                    maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                    width: (campo.ancho) ? campo.ancho : ancho,
                                    inputType: 'password',
                                    name: campo.index,
                                });
                                renderer = function (val) {
                                    return "<center><img src='../imagenes/pass.PNG' /></center>";
                                }
                            }

                        } else {

                            self.campoTexto = new Ext.form.TextArea({
                                fieldLabel: campo.nombre,
                                anchor: '99%',
                                hidden: hidden,
                                hideLabel: hidden,
                                disabled: hidden,
                                id: self.id + 'campoTexto' + campo.index,
                                allowBlank: (campo.nulo == undefined) ? true : campo.nulo,
                                regex: regexp,
                                regexText: mensaje,
                                maxLength: (campo.maxlengthtext) ? campo.maxlengthtext : undefined,
                                maxLengthText: (campo.maxlengthtext) ? 'El maximo número de caracteres es ' + campo.maxlengthtext : undefined,
                                blankText: 'Este campo es obligatorio.',
                                width: (campo.ancho) ? campo.ancho : ancho,
                                name: campo.index
                            });
                        }


                        self.Filtros.push({
                            type: 'string',
                            dataIndex: campo.index
                        });

                        self.acomodarElementoFormGestion(self, self.campoTexto, campo, false);
                        /*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                            self.acomodarElementoForm(self, self.campoTexto, campo);
                        }
                        else {
                            self.adicionarColumnaAncha(self, self.campoTexto);

                        }*/
                        self.elementosFormulario[campo.index] = self.campoTexto.id;
                        if (campo.unico) {
                            self.columnasUnicas.push(
                                {
                                    columna: campo.index,
                                    valor: self.id + 'campoTexto' + campo.index,
                                    tipo: 'texto'
                                });
                        }

                        break;
                    case 'numero':
                        self.campoNumero = new Ext.form.NumberField({
                            fieldLabel: campo.nombre,
                            id: self.id + 'campoNumero' + campo.index,
                            name: campo.index,
                            hidden: hidden,
                            hideLabel: hidden,
                            disabled: hidden,
                            anchor: '99%',
                            allowBlank: (campo.nulo) ? campo.nulo : undefined,
                            width: (campo.ancho) ? campo.ancho : ancho,
                            allowDecimals: (campo.allowdecimals) ? campo.allowdecimals : undefined,
                            allowNegative: (campo.allownegative) ? campo.allownegative : undefined,
                            decimalPrecision: (campo.decimalprecision) ? campo.decimalprecision : undefined,
                            nanText: 'Este valor es incorrecto.',
                            blankText: 'Este campo es obligatorio.'
                        });
                        self.Filtros.push({
                            type: 'numeric',
                            dataIndex: campo.index
                        });
                        tipo = 'float';
                        self.acomodarElementoFormGestion(self, self.campoNumero, campo, false);
                        /*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                            self.acomodarElementoForm(self, self.campoNumero, campo);
                        }
                        else {
                            self.adicionarColumnaAncha(self, self.campoNumero);
                        }*/
                        self.elementosFormulario[campo.index] = self.campoNumero.id;
                        if (campo.unico) {
                            self.columnasUnicas.push(
                                {
                                    columna: campo.index,
                                    valor: self.id + 'campoNumero' + campo.index,
                                    tipo: 'numero'
                                });
                        }
                        break;
                    case 'fecha':
                        self.campoFecha = new Ext.form.DateField({
                            fieldLabel: campo.nombre,
                            hidden: hidden,
                            hideLabel: hidden,
                            disabled: hidden,
                            id: self.id + 'campoFecha' + campo.index,
                            allowBlank: (campo.nulo) ? campo.nulo : undefined,
                            format: (campo.formato) ? campo.formato : 'j-m-Y',
                            editable: (campo.editable) ? campo.editable : false,
                            readOnly: (campo.readonly) ? campo.readonly : false,
                            anchor: '99%',
                            value: new Date().format('j-m-Y'),
                            blankText: 'Este campo es obligatorio.',
                            invalidText: 'Este valor es incorrecto.',
                            name: campo.index,
                            width: (campo.ancho) ? campo.ancho : ancho
                        });
                        self.Filtros.push({
                            type: 'date',
                            dataIndex: campo.index
                        });

                        renderer = /*(campo.formato)?Ext.util.Format.dateRenderer(campo.formato):*/Ext.util.Format.dateRenderer('j-m-Y');
                        tipo = 'date';
                        self.acomodarElementoFormGestion(self, self.campoFecha, campo, false);

                        self.elementosFormulario[campo.index] = self.campoFecha.id;

                        if (campo.unico) {
                            self.columnasUnicas.push(
                                {
                                    columna: campo.index,
                                    valor: self.id + 'campoFecha' + campo.index,
                                    tipo: 'fecha'
                                });
                        }
                        break;
                    case 'lista':


                        self.camposStoreCombo = new Array({
                                name: campo.campovalor
                            },
                            {
                                name: campo.campoamostrar
                            }
                        );


                        self.StoreCombo = new Ext.data.Store({
                            storeId: campo.campovalor + campo.index + 'StoreCombo' + self.id,
                            id: campo.campovalor + campo.campoamostrar + 'StoreCombo' + self.id,
                            reader: new Ext.data.JsonReader({
                                totalProperty: "cantidad",
                                root: "datos",
                                id: campo.campovalor + campo.index + 'readerCombo' + self.id,
                                fields: self.camposStoreCombo
                            })
                        });

                        self.cantCombos++;
                        var campoamostrar = campo.campoamostrar;
                        var campovalor = campo.campoamostrar;
                        renderer = null;
                        if (campo.campovalor != campo.campoamostrar) {
                            renderer = function (val, metadata, record, rowIndex, colIndex, store) {

                                var posGrid = colIndex - 1;
                                if (posGrid > 0) {
                                    var campoamostrar = this.configuracion[posGrid].campoamostrar;
                                    var campovalor = this.configuracion[posGrid].campovalor;
                                    var storeComboActual = this.configuracion[posGrid].StoreCombo;
                                    if (storeComboActual) {
                                        var pos = storeComboActual.findBy(function (rec, id) {
                                            if (rec.data[campovalor] == val) {
                                                return true;
                                            }
                                            else {
                                                return false;
                                            }

                                        });

                                        //validar cuando se adiciona una fila no viene valor
                                        if (pos != -1) {
                                            return (storeComboActual.getAt(pos).data)[campoamostrar];
                                        } else {
                                            console.log('soy -1')
                                        }

                                    }
                                }

                            }.createDelegate(self);
                            campoamostrar = campo.campoamostrar;
                            campovalor = campo.campovalor;
                        }

                        self.hiddencampoLista = new Ext.form.Hidden({
                            id: 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                            name: campo.index
                        });


                        self.campoLista = new Ext.form.ComboBox({
                            fieldLabel: campo.nombre,
                            hidden: hidden,
                            hideLabel: hidden,
                            disabled: hidden,
                            id: 'campoLista' + self.id + campo.index,
                            idhiddencampoLista: 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                            width: (campo.ancho) ? campo.ancho : ancho,
                            tpl: (campo.tpl) ? campo.tpl : undefined,
                            name: campo.campoamostrar + '-combo',
                            triggerAction: 'all',
                            anchor: '99%',
                            emptyText: 'Seleccione...',
                            valueField: campo.campovalor,
                            displayField: campo.campoamostrar,
                            hiddenName: campo.campovalor + '-combo',
                            forceSelection: true,
                            typeAhead: true,
                            allowBlank: (campo.nulo != undefined) ? campo.nulo : true,
                            mode: 'local',
                            blankText: 'Este campo es obligatorio.',
                            readOnly: false,
                            store: self.StoreCombo,
                            listeners: {
                                select: function (combo, record, index) {
                                    Ext.getCmp(this.idhiddencampoLista).setValue(combo.getValue());
                                    //combo.setRawValue(record.data[combo.displayField]);
                                }

                            }
                        });


                        tipo = 'string';
                        if (self.autoCargar) {
                            if (campo.consulta == undefined) {
                                self.listarFilasCombo(self, campo, self.StoreCombo, false);
                                self.configuracion[i]['traeconsulta'] = false;
                            } else {
                                self.listarFilasCombo(self, campo, self.StoreCombo, true);
                                self.configuracion[i]['traeconsulta'] = true;
                            }

                        }


                        /* self.camposStore.push({
                             name: campo.campovalor,
                             type: tipo
                         });*/


                        self.adicionarColumnaAncha(self, self.hiddencampoLista, true);
                        self.acomodarElementoFormGestion(self, self.campoLista, campo, false);
                        /*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                            self.acomodarElementoForm(self, self.campoLista, campo);
                        }
                        else {
                            self.adicionarColumnaAncha(self, self.campoLista);
                        }*/

                        self.elementosFormulario[campo.index] = self.hiddencampoLista.id;
                        self.elementosFormulario[campo.campovalor + '-combo'] = self.campoLista.id;

                        self.configuracion[i]['StoreCombo'] = self.StoreCombo;
                        if (campo.unico) {
                            self.columnasUnicas.push(
                                {
                                    columna: campo.index,
                                    valor: 'hiddencampoLista' + campo.campovalor + self.id + campo.index,
                                    tipo: 'numero'
                                });
                        }

                        break;
                    case 'logico':
                        self.campoBolean = new Ext.form.Checkbox(
                            {
                                fieldLabel: campo.nombre,
                                hidden: hidden,
                                hideLabel: hidden,
                                disabled: hidden,
                                id: self.id + 'campoBolean' + campo.index,
                                name: campo.index,
                                width: (campo.ancho) ? campo.ancho : ancho,
                                checked: (campo.checked) ? campo.checked : undefined,
                                cls: 'campoBolean',
                                anchor: '99%',
                                listeners: {
                                    check: function (_this, checked) {

                                        if (checked) {
                                            this.setRawValue('on');
                                            console.log(this.getRawValue());
                                        } else {
                                            this.setRawValue('off');
                                            console.log(this.getRawValue());
                                        }
                                    }
                                }
                            });
                        self.Filtros.push({
                            type: 'boolean',
                            dataIndex: campo.index
                        });
                        renderer = self.cambiarRadio;
                        ancho = 50;
                        tipo = 'boolean';
                        self.acomodarElementoFormGestion(self, self.campoBolean, campo, false);
                        /*if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                            self.acomodarElementoForm(self, self.campoBolean, campo);
                        }
                        else {
                            self.adicionarColumnaAncha(self, self.campoBolean);
                        }*/
                        self.elementosFormulario[campo.index] = self.campoBolean.id;
                        break;
                    case 'imagen':
                        ancho = 50;
                        self.mostrarBtnImagen = true;
                        self.columnaImagen = campo.index;
                        self.campoImagenForm = new Ext.ux.ScreenshotField({
                            fieldLabel: campo.nombre,
                            hideLabel: false,
                            allowUpload: true,
                            name: campo.index,
                            anchor: '99%',
                            id: self.id + 'campoImagenForm' + campo.index,
                            allowBlank: true,
                            height: (campo.ancho) ? campo.ancho - 10 : ancho,
                            width: (campo.ancho) ? campo.ancho : ancho,
                        });

                        renderer = function (val) {
                            var size = 20;
                            if (val) {
                                return "<img class='imagen' src=" + val + " width='" + size + "' height='" + size + "' />";
                            }
                            return "<center></center><img src=/metadatos/metaconfig/views/js/nomdinamicos/images/no-photo-male.png width='" + size + "' height='" + size + "' />";

                        }.createDelegate(self);
                        ancho = 100;
                        self.acomodarElementoFormGestion(self, self.campoImagenForm, campo, false);

                        /* if (campo.columnForm != -1 && campo.columnForm != 0 || !campo.columnForm) {
                             self.acomodarElementoForm(self, self.campoImagenForm, campo);
                         }
                         else {
                             self.adicionarColumnaAncha(self, self.campoImagenForm);
                         }*/
                        self.elementosFormulario[campo.index] = self.campoImagenForm.id;
                        tipo = 'string';


                        break;
                    case 'oculto':
                        self.campoOculto = new Ext.form.Hidden({
                            id: 'campoOculto' + self.id + campo.index,
                            name: campo.index
                        });

                        self.adicionarColumnaAncha(self, self.campoOculto, true);

                        self.elementosFormulario[campo.index] = self.campoOculto.id;
                        hidden = true;
                        break;
                }
            }

            self.camposStore.push({
                name: campo.index,
                type: tipo,
                dateFormat: 'j/m/Y'
            });

            if (campo.nombre == 'id') {
                self.configuracion[0]['idconfiguracion'] = campo.index;
                self.variables.indiceId = campo.index;
                self.camposGrid.push({
                    id: campo.index + 'campoGrid' + self.id,
                    header: campo.nombre,
                    dataIndex: campo.index,
                    sortable: false,
                    tooltip: (campo.descripcion) ? campo.descripcion : undefined,
                    hidden: true,
                    hideable: false
                });
                self.hiddencampoId = new Ext.form.Hidden({
                    id: 'hiddencampoId' + campo.campovalor + self.id + campo.index,
                    name: campo.index
                });

                self.adicionarColumnaAncha(self, self.hiddencampoId, true);
                self.nuevaConfiguracion.push(self.configuracion[i]);
                self.elementosFormulario[campo.index] = self.hiddencampoId.id;

            } else {

                if (campo.tipo == 'lista') {
                    self.camposGrid.push({
                        id: campo.index + 'campoGrid' + self.id,
                        header: campo.nombre,
                        dataIndex: campo.index,
                        tooltip: (campo.descripcion) ? campo.descripcion : undefined,
                        renderer: renderer,
                        sortable: true,

                        hidden: hidden,
                        width: (campo.ancho) ? campo.ancho : ancho,
                        hideable: (campo.oculto) ? false : true
                    });
                } else {

                    self.camposGrid.push({
                        id: campo.index + 'campoGrid' + self.id,
                        header: campo.nombre,
                        dataIndex: campo.index,
                        hidden: hidden,
                        renderer: (campo.oculto) ? null : renderer,
                        tooltip: (campo.descripcion) ? campo.descripcion : undefined,
                        sortable: true,
                        width: (campo.ancho) ? (campo.tipo === 'imagen') ? 50 : campo.ancho : ancho,
                        hideable: (hidden) ? false : true
                    });
                }
            }


        }

        for (var i = 0; i < self.configuracion.length; i++) {
            var campo = self.configuracion[i];
            var ancho = 200;
            var renderer = null;
            var hidden = false;
            if (campo.index == self.columnaDetalle) {
                hidden = true;
            }
            if (campo.nombre != 'id') {
                switch (campo.tipo) {
                    case 'texto':
                        if (campo.mostraFiltro && (campo.index !== self.columnaDetalle)) {
                            self.campoTextoFiltro = new Ext.form.TextField({
                                fieldLabel: campo.nombre,
                                hidden: hidden,
                                hideLabel: hidden,
                                id: self.id + 'campoTextoFiltro' + campo.index,
                                allowBlank: true,
                                emptyText: 'Criterio a buscar...',
                                width: 200,
                                name: campo.index + 'filtro',
                                /*enableKeyEvents: true,
                                listeners: {
                                    keyup: function () {
                                        var sucio=false;
                                        console.log(self.itemsFormularioFiltro);
                                        for (var i = 0; i < self.itemsFormularioFiltro.length; i++) {
                                            if (self.itemsFormularioFiltro[i].items[0].getValue() != '') {
                                                sucio= true;
                                                break;
                                            }
                                        }
                                        console.log(sucio);
                                        if (sucio) {
                                            self.btnBuscar.enable();
                                            self.btnLimpiar.enable();
                                        } else {

                                            self.btnBuscar.disable();
                                            self.btnLimpiar.disable();
                                        }
                                    }
                                }*/
                            });


                            self.itemsFormularioFiltro.push({
                                layout: 'form',
                                bodyStyle: 'padding:0 10px 0 0;',
                                //columnWidth: 0.25,
                                items: [self.campoTextoFiltro]
                            });
                            self.datosFiltro.push(
                                {
                                    columna: campo.index,
                                    valor: self.id + 'campoTextoFiltro' + campo.index,
                                    tipo: 'texto'
                                });
                        }
                        break;
                    case 'lista':
                        if (campo.mostraFiltro && (campo.index !== self.columnaDetalle)) {
                            var camposStoreCombo = new Array({
                                    name: campo.campovalor
                                },
                                {
                                    name: campo.campoamostrar
                                }
                            );

                            var StoreComboFiltro = new Ext.data.Store({
                                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                                autoLoad: true,
                                baseParams: {
                                    metodo: 'listarGenerico',
                                    tabla: campo.tabla,
                                    consulta: (campo.consulta) ? campo.consulta : undefined,
                                    id: campo.idtabla
                                },
                                storeId: campo.campovalor + campo.index + 'StoreComboFiltro' + self.id,
                                id: campo.campovalor + campo.campoamostrar + 'StoreComboFiltro' + self.id,
                                reader: new Ext.data.JsonReader({
                                    totalProperty: "cantidad",
                                    root: "datos",
                                    id: campo.campovalor + campo.index + 'readerComboFiltro' + self.id,
                                    fields: camposStoreCombo
                                })
                            });
                            var campoListaFiltro = new Ext.form.ComboBox({
                                fieldLabel: campo.nombre,
                                hidden: hidden,
                                hideLabel: hidden,
                                id: 'campoListaFiltro' + self.id + campo.index,
                                width: (campo.ancho) ? campo.ancho : ancho,
                                tpl: (campo.tpl) ? campo.tpl : undefined,
                                name: campo.campoamostrar + 'filtro',
                                triggerAction: 'all',
                                emptyText: 'Seleccione...',
                                valueField: campo.campovalor,
                                displayField: campo.campoamostrar,
                                hiddenName: campo.campovalor,
                                forceSelection: false,
                                typeAhead: true,
                                allowBlank: true,
                                mode: 'local',
                                blankText: 'Este campo es obligatorio.',
                                readOnly: false,
                                store: StoreComboFiltro,
                                /*listeners: {
                                    select : function () {
                                        var sucio=false;
                                        for (var i = 0; i < self.itemsFormularioFiltro.length; i++) {
                                            if (self.itemsFormularioFiltro[i].items[0].getValue() != '') {
                                                sucio= true;
                                                break;
                                            }
                                        }
                                        if (sucio) {
                                            self.btnBuscar.enable();
                                            self.btnLimpiar.enable();
                                        } else {

                                            self.btnBuscar.disable();
                                            self.btnLimpiar.disable();
                                        }
                                    }
                                }*/
                            });


                            self.itemsFormularioFiltro.push({
                                layout: 'form',
                                bodyStyle: 'padding:0 10px 0 0;',
                                //columnWidth: 0.25,
                                items: [campoListaFiltro]
                            });
                            self.datosFiltro.push(
                                {
                                    columna: campo.index,
                                    valor: 'campoListaFiltro' + self.id + campo.index,
                                    tipo: 'numero'
                                });
                        }

                        break;


                }
            }


        }

        self.btnCancelarVentana = new Ext.Button({
            id: 'idbtnCancelarVentana' + self.id,
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            prevTab: 'id' + self.id,
            nextTab: 'btnAplicarVentana' + self.id,
            handler: function () {
                self.ventanaGestion.hide();
            }
        });

        self.btnAplicarVentana = new Ext.Button({
            id: 'idbtnAplicarVentana' + self.id,
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos sin cerrar ventana',
            handler: function () {
                self.guardarFilas(self, self.adicionar);
                self.aplicar = true;
            }
        });

        self.btnAceptarVentana = new Ext.Button({
            id: 'idbtnAceptarVentana' + self.id,
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            prevTab: 'btnAplicarVentana' + self.id,
            nextTab: 'idtfDenomBilletes' + self.id,
            handler: function () {
                self.guardarFilas(self, self.adicionar);
                self.aplicar = false;
            }
        });

        self.formularioGestion = new Ext.FormPanel({
            monitorValid: true,
            autoHeight: true,
            width: (self.anchoForm) ? self.anchoForm : 500,
            frame: true,
            bodyStyle: 'padding: 5px;',
            labelAlign: 'top',
            items: {
                layout: 'column',
                items: self.itemsFormulario
            },
            listeners: {
                'clientvalidation': function (_form, _valid) {
                    if (_form.getForm().isDirty() && _valid) {
                        self.btnAplicarVentana.enable();
                        self.btnAceptarVentana.enable();
                    } else {
                        self.btnAplicarVentana.disable();
                        self.btnAceptarVentana.disable();
                    }

                }
            }
        });

        self.btnBuscar = new Ext.Button({
            tooltip: "Buscar " + self.nombre + " <b>(Alt+B)</b>",
            text: "<u>B</u>uscar",
            iconCls: 'buscar',
            id: 'btnBuscarf' + self.id,
            handler: function () {
                self.store.reload();
            }
        });

        self.btnLimpiar = new Ext.Button({
            tooltip: "Limpiar filtros <b>(Alt+L)</b>",
            text: "<u>L</u>impiar",
            id: 'btnAllAf' + self.id,
            iconCls: 'limpiar',
            handler: function () {
                self.formularioGestionFiltro.getForm().reset();
                self.store.reload();
            }
        });

        self.itemsFormularioFiltro.push({
            columnWidth: '35px',
            bodyStyle: 'padding:19px 10px 0 0;',
            layout: 'form',
            items: [self.btnBuscar]
        });

        self.itemsFormularioFiltro.push({
            columnWidth: '35px',
            bodyStyle: 'padding:19px 0 0 0;',
            layout: 'form',
            items: [self.btnLimpiar]
        });


        self.formularioGestionFiltro = new Ext.FormPanel({
            layout: 'column',
            id: 'formularioGestionFiltro' + self.id,
            region: 'north',
            cls: 'x-toolbar',
            autoHeight: true,
            frame: true,
            bodyStyle: 'padding: 0 0 0 0;',
            labelAlign: 'top',
            items: self.itemsFormularioFiltro,
            keys: [{
                key: Ext.EventObject.ENTER, fn: function () {
                    self.btnBuscar.handler.call();
                }
            }, {
                key: 'l', alt: true, fn: function () {
                    self.btnLimpiar.handler.call();
                }
            }]
        });


        //Ventana de adicionar y modificar.
        self.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [self.formularioGestion],
            buttons: [self.btnCancelarVentana, self.btnAplicarVentana, self.btnAceptarVentana],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarVentana.disabled) {
                            self.btnAceptarVentana.handler();
                        }

                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarVentana.disabled) {
                            self.btnCancelarVentana.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarVentana.disabled) {
                            self.btnAplicarVentana.handler();
                        }
                    }
                }
            ],
            listener: {
                beforeshow: function (_this) {
                    self.btnAplicarVentana.disable();
                    self.btnAceptarVentana.disable();
                }
            }
        });

        /*self.ventanaGestion.on('show', function (store, options) {
            self.itemsFormulario[self.cantCamposOcultos].items[0].focus(true,10);
        });*/


        self.store = new Ext.data.Store({
            url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
            autoLoad: self.autoCargar,
            remoteSort: true,
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: self.variables.indiceId,
                fields: self.camposStore
            })
        });


        // self.mascaraGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});

        self.gpEditor = new Ext.grid.EditorGridPanel({
            region: 'center',
            id: self.id + 'gpEditor',
            store: self.store,
            layout: 'fit',
            border: false,
            autoScroll: true,
            loadMask: {msg: 'Cargando...'},
            clicksToEdit: 1,
            sm: self.csm,
            width: '100%',
            height: self.height - 10,
            columns: self.camposGrid,
            /*viewConfig: {
                getRowClass: function (record, rowIndex, p, store) {

                    if (record.get(self.variables.indiceId) == undefined) {
                        //return 'FilaMorada';
                        return 'FilaVerde';
                    }

                    if (record.get('esseguridad') == 1) {

                        return 'FilaRoja';
                    }

                    if (record.get('cambio') == 'modified') {
                        return 'FilaAzul';
                    }

                    return 'FilaGris';
                    //return 'FilaAzul';
                    //return 'FilaGrisClara';
                }
            },*/
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: self.store,
                displayMsg: 'Mostrando del {0} - {1} de {2}',
                emptyMsg: 'No hay datos que mostrar',
                beforePageText: 'Página',
                afterPageText: 'de {0}',
                firstText: 'Primera página',
                prevText: 'Página anterior',
                nextText: 'Proxima página',
                lastText: 'Útima página',
                refreshText: 'Actualizar',
                displayInfo: true
            }),
            plugins: new Ext.grid.GridFilters({
                local: true,
                store: self.store,
                filters: self.Filtros
            }),
            keys: [{
                key: Ext.EventObject.DELETE, fn: function () {
                    if (!self.btnEliminar.disabled && !self.btnEliminar.hidden) {
                        self.btnEliminar.handler.call();

                    }
                }
            },
                {
                    key: 'i', alt: true, stopEvent: true, fn: function () {
                    if (!self.btnAdicionar.disabled && !self.btnAdicionar.hidden) {
                        self.btnAdicionar.handler.call();
                    }
                }
                }, {
                    key: 'm', alt: true, stopEvent: true, fn: function () {
                        if (!self.btnModificar.disabled && !self.btnModificar.hidden) {
                            self.btnModificar.handler.call();
                        }
                    }
                }, {
                    key: 'b', alt: true, stopEvent: true, fn: function () {

                        Ext.getCmp(self.datosFiltro[0].valor).focus(false, 10);
                    }
                }]

        });


        self.store.on('update', function (store) {
            self.btnModificar.enable();
        });

        self.store.on('add', function (store) {
            self.btnModificar.enable();
        });

        self.store.on('beforeload', function (store, options) {

            var filtro = undefined;

            var filtroTemp = (self.filtro) ? self.filtro.slice() : new Array();
            filtroTemp.push(
                {
                    columna: self.columnaDetalle,
                    valor: self.valorcolumnaDetalle,
                    tipo: 'numero'
                }
            );

            if (self.datosFiltro.length > 0) {
                for (var i = 0; i < self.datosFiltro.length; i++) {
                    var valor = Ext.getCmp(self.datosFiltro[i].valor).getValue();
                    if (!(valor == '' || valor == null || valor == undefined)) {
                        filtroTemp.push(
                            {
                                columna: self.datosFiltro[i].columna,
                                valor: valor,
                                tipo: self.datosFiltro[i].tipo
                            }
                        );
                    }

                }
            }
            if (filtroTemp.length > 0) {
                filtro = Ext.encode(filtroTemp);
            }


            store.baseParams = {
                metodo: (self.urlListar) ? self.urlListar : 'listarGenerico',
                tabla: self.tabla,
                idtabla: self.idtabla,
                filtro: filtro
                /*,
                start: (store.baseParams.start)?store.baseParams.start:
                    (self.store.lastOptions)?self.store.lastOptions.params.start:0,
                limit: (store.baseParams.limit)?store.baseParams.limit:
                    (self.store.lastOptions)?self.store.lastOptions.params.limit:15*/


            }
        });
        self.store.on('load', function (store, options) {
            if (self.itemsFormularioFiltro.length > 2) {
                self.itemsFormularioFiltro[0].items[0].focus(false, 10);
            }
            if (store.getTotalCount() == 0) {
                mostrarMensaje(2, 'No existen datos que mostar.');
            }
        });


        //Codigo para mostrar la ventana imagen
        if (!self.mostrarBtnImagen) {
            self.btnAsociarImagen.hidden = true;
        }

        //Obtener la ultima fila seleccionada
        self.ultimaFilaSeleccionada = -1;
        var hisNodosSeleccionados = new Array();
        self.lastFilaseleccionada = null;
        var miArray = new Array();
        var indiceFila = -1;
        self.gpEditor.selModel.on('rowselect', function (_this, rowIndex, record) {
            var id = record.id;
            indiceFila = miArray.indexOf(id);
            if (indiceFila == -1) {
                hisNodosSeleccionados.push(record);
                miArray.push(id);
                self.btnAsociarImagen.enable();
            }

            self.ultimaFilaSeleccionada = rowIndex;
            self.lastFilaseleccionada = record;
            self.fireEvent('elementochequeado', {
                record: record,
                rowindex: rowIndex
            });


        });

        self.gpEditor.selModel.on('rowdeselect', function (_this, rowIndex, record) {
            var id = record.id;
            indiceFila = miArray.indexOf(id);
            miArray.remove(id);
            hisNodosSeleccionados.remove(hisNodosSeleccionados[indiceFila]);
            if (miArray.length == 0) {
                self.btnAsociarImagen.disable();
            }
            self.lastFilaseleccionada = hisNodosSeleccionados[hisNodosSeleccionados.length - 1];
            self.fireEvent('elementodeschequeado', {
                record: record,
                rowindex: rowIndex
            });
        });


        var items = (self.itemsFormularioFiltro.length > 2) ?
            [self.formularioGestionFiltro, self.gpEditor] :
            [self.gpEditor];
        var layout = (self.itemsFormularioFiltro.length > 2) ? 'border' : 'fit';
        var keys = [{
            key: Ext.EventObject.DELETE, fn: function () {
                if (!self.btnEliminar.disabled && !self.btnEliminar.hidden) {
                    self.btnEliminar.handler.call();

                }
            }
        },
            {
                key: 'I', alt: true, stopEvent: true, fn: function () {
                if (!self.btnAdicionar.disabled && !self.btnAdicionar.hidden) {
                    self.btnAdicionar.handler.call();
                }
            }
            }, {
                key: 'M', alt: true, stopEvent: true, fn: function () {
                    if (!self.btnModificar.disabled && !self.btnModificar.hidden) {
                        self.btnModificar.handler.call();
                    }
                }
            }];


        Ext.apply(this, {
            layout: layout,
            collapsible: true,
            tbar: [self.btnAdicionar, self.btnModificar, self.btnEliminar/*, self.btnActualizar*/, self.btnVerDetalles],
            items: items
            , keys: keys
        });


        Misitio.Panel_Gestion.GestionGridPanelDetalle.superclass.initComponent.apply(this);

    }

        ,
        centrarValor: function (val) {
            if (val)
                return "<center>" + val + "</center>";
        }
        ,
        acomodarElementoForm: function (self, elementoForm, campo) {
            if (self.columnasForm && Ext.isArray(self.columnasForm)) {
                if (self.columnaFormAncha) {
                    for (var i = 0; i < self.columnasForm.length; i++) {
                        if ((campo.columnForm - 1) == i) {
                            self.itemsFormulario.push(
                                {
                                    layout: 'form',
                                    bodyStyle: 'padding:5px 5px 5px 5px;',
                                    columnWidth: self.columnasForm[i],
                                    items: [elementoForm]
                                }
                            );
                        } else {
                            self.itemsFormulario.push(
                                {
                                    layout: 'form',
                                    bodyStyle: 'padding:5px 5px 5px 5px;',
                                    columnWidth: self.columnasForm[i],
                                    items: new Array({})
                                }
                            );
                        }

                    }
                    self.columnaFormAncha = false;
                } else {
                    self.itemsFormulario[(self.itemsFormulario.length - self.columnasForm.length - 1) + (campo.columnForm)].items.push(elementoForm);
                }


            }
        }
        ,
        acomodarElementoFormGestion: function (self, elementoForm, campo, esOculto) {
            self.itemsFormulario.push(
                {
                    layout: 'form',
                    bodyStyle: 'padding:3px;',
                    columnWidth: (campo.tamannoForm <= 1) ? campo.tamannoForm : 1,
                    items: [elementoForm]
                }
            );
        }
        ,
        acomodarElementoFormGestionOld: function (self, elementoForm, campo, esOculto) {
            if (campo.columnForm && campo.columnForm > 0 && campo.columnForm <= self.columnasForm.length) {
                self.acomodarElementoForm(self, elementoForm, campo);
            }
            else {
                self.adicionarColumnaAncha(self, elementoForm);
            }
        }
        ,
        adicionarColumnaAncha: function (self, elementoForm, esOculto) {

            if (!esOculto) {
                self.itemsFormulario.push(
                    {
                        layout: 'form',
                        //bodyStyle: 'padding:5px 5px 5px 5px;',
                        columnWidth: .99,
                        items: [elementoForm]
                    }
                );
                self.columnaFormAncha = true;
            } else {

                self.itemsFormulario.unshift(elementoForm);
                self.cantCamposOcultos++;

            }

        }
        ,
        crearNodoLeyenda: function (accion, text) {
            var div = "<div class='animacionContenedor" + accion + " contenedorLeyendaProyecto'><div class='iconLeyenda " + accion + "Leyend rotateLeyend'></div><div class='textLeyenda " + accion + "LeyendColor'>" + text + "</div>";
            return div;
        }
        ,
        obtenerFiltro: function (self) {

            self.filtro.push();
        }

        ,
        cambiarRadio: function (val) {
            if (val) {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/checked.png' /></center>";
            } else {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/unchecked.png' /></center>";
            }
        }
        ,
        limpiarGrid: function (self) {
            self.btnModificar.disable();
            self.btnEliminar.disable();
            self.btnVerDetalles.disable();
            self.variables.filasAmodificar = new Array();
            self.variables.filasAguardar = new Array();
            self.variables.filasAeliminar = new Array();
            self.store.removeAll();
            self.csm.clearSelections();
            self.store.reload();
        }
        ,
        buscar: function (array, elemento) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == elemento) {
                    return true;
                }
            }
            return false;
        }
        ,
        adicionarFila: function (self) {
            self.adicionar = true;
            self.btnAplicarVentana.show();
            self.ventanaGestion.show();
            self.itemsFormulario[self.cantCamposOcultos].items[0].focus(false, 10);
            self.ventanaGestion.setTitle('Adicionar ' + self.nombre);
            self.formularioGestion.getForm().reset();

        }
        ,
        actualizarVista: function (self) {
            self.store.load({params: {limit: 15, start: 0}});
        }
        ,
        cargarElementos: function (self) {
            for (var i = 0; i < self.configuracion.length; i++) {
                if (self.configuracion[i].StoreCombo) {
                    self.listarFilasCombo(self, self.configuracion[i], self.configuracion[i].StoreCombo, self.configuracion[i].traeconsulta);
                }
            }
            self.actualizarVista(self);
        }
        ,
        listarFilasCombo: function (self, campo, store, traeconsulta) {
            var consulta = (traeconsulta) ? campo.consulta : undefined;
            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: 'listarGenerico',
                    tabla: campo.tabla,
                    consulta: consulta,
                    id: campo.idtabla
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {

                        /* var nuevaFila = {};
                         nuevaFila[campo.campovalor] = '-1';
                         nuevaFila[campo.campoamostrar] = 'Selecione...';
                         respuesta.datos.unshift(nuevaFila);
                         console.log(respuesta.datos);*/

                        store.loadData(respuesta);
                    } else {
                        var error = respuesta.error;
                        self.mostrarError(error, self, 1);
                    }
                }
            });
        }
        ,
        guardarFilas: function (self, adicionar) {

            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});
            var filaAguardar = self.dameFilaAguardar(self, adicionar);
            //console.log(filaAguardar);return;

            var filtro = undefined;

            var filtroTemp = (self.filtro) ? self.filtro.slice() : new Array();

            filtroTemp.push(
                {
                    columna: self.columnaDetalle,
                    valor: self.valorcolumnaDetalle,
                    tipo: 'numero'
                }
            );

            var columnasunicas = undefined;
            var columnasTemp = new Array();
            if (self.columnasUnicas.length > 0) {
                for (var i = 0; i < self.columnasUnicas.length; i++) {
                    var valor = Ext.getCmp(self.columnasUnicas[i].valor).getValue();
                    if (!(valor == '' || valor == null || valor == undefined)) {
                        columnasTemp.push(
                            {
                                columna: self.columnasUnicas[i].columna,
                                valor: valor,
                                tipo: self.columnasUnicas[i].tipo
                            }
                        );
                    }

                }
                columnasunicas = Ext.encode(columnasTemp);
            }

            myMask.show();
            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: (self.urlGuardar) ? self.urlGuardar : 'guardarGenerico',
                    tabla: self.tabla,
                    idtabla: self.idtabla,
                    adicionar: adicionar,
                    filaAguardar: Ext.encode(filaAguardar),
                    columnasunicas: columnasunicas,
                    filtro: Ext.encode(filtroTemp)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        myMask.hide();
                        if (!self.aplicar) {
                            self.ventanaGestion.hide();
                        }
                        var tipoMensaje = (adicionar) ? 'adicionar' : 'modificar';

                        self.dameMensaje(self, tipoMensaje, false);
                        self.limpiarGrid(self);

                    } else {
                        myMask.hide();
                        var error = respuesta.error;
                        var addOmod = (adicionar) ? 'adicionar' : 'modificar';
                        //8 advertencia,6 error, default informacion
                        self.dameMensaje(self, addOmod + 'existe', false);

                    }

                }
            });


        }
        ,

        modificarFilas: function (self) {
            self.adicionar = false;
            self.ventanaGestion.show();

            self.ventanaGestion.setTitle('Modificar ' + self.nombre);
            self.btnAplicarVentana.hide();
            self.cargarDatosFormulario(self);
            self.itemsFormulario[self.cantCamposOcultos].items[0].focus(true, 10);
        }
        ,
        cargarDatosFormulario: function (self) {

            self.formularioGestion.getForm().loadRecord(self.lastFilaseleccionada);

            for (var i = 0; i < self.configuracion.length; i++) {
                if (self.configuracion[i].StoreCombo != undefined) {
                    var filas = self.configuracion[i].StoreCombo.data.items;
                    var filaSelection = self.lastFilaseleccionada.data;
                    for (var j = 0; j < filas.length; j++) {
                        //si el id de la tabla no existe es porque es nueva
                        if (filas[j].data[self.configuracion[i].campovalor] == filaSelection[self.configuracion[i].index]) {
                            var idElementoFormulario = self.elementosFormulario[self.configuracion[i].campovalor + '-combo'];
                            Ext.getCmp(idElementoFormulario).setValue(filas[j].data[self.configuracion[i].campoamostrar]);
                        }
                    }
                }
            }
        }
        ,
        eliminarFilas: function (self) {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});
            var filasAeliminar = self.dameFilasAeliminar(self);
            myMask.show();
            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: (self.urlEliminar) ? self.urlEliminar : 'eliminarGenerico',
                    tabla: self.tabla,
                    idtabla: self.idtabla,
                    filasAeliminar: Ext.encode(filasAeliminar)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        myMask.hide();
                        var tipoMensaje = 'eliminar';
                        var plural = (filasAeliminar.length > 1) ? true : false;

                        self.dameMensaje(self, tipoMensaje, plural);

                        self.limpiarGrid(self);
                    } else {
                        myMask.hide();
                        var error = respuesta.error;
                        self.mostrarError(error, self, 3);

                    }

                }
            });
        }
        ,
        dameFilaAguardar: function (self, adicionar) {
            var filaAguardar = {};

            var elementosForm = self.elementosFormulario;

            for (var propiedad in elementosForm) {
                if (propiedad === self.columnaDetalle) {
                    Ext.getCmp(elementosForm[propiedad]).setValue(self.valorcolumnaDetalle);
                }

                if (Ext.getCmp(elementosForm[propiedad]).getValue() === true) {
                    filaAguardar[propiedad] = 'on';
                } else if (Ext.getCmp(elementosForm[propiedad]).getValue() === false) {
                    filaAguardar[propiedad] = 'off';
                } else if (!Ext.getCmp(elementosForm[propiedad]).getValue()) {
                    if (self.configuracion[0]['idconfiguracion'] != propiedad) {
                        filaAguardar[propiedad] = 'vacio';
                    }
                } else {
                    filaAguardar[propiedad] = Ext.getCmp(elementosForm[propiedad]).getValue();
                }


            }

            return filaAguardar;
        }

        ,
        dameFilasAeliminar: function (self) {
            var filasmarcadas = self.csm.getSelections();
            var filasAeliminar = new Array();
            for (var i = 0; i < filasmarcadas.length; i++) {
                if (filasmarcadas[i].data[self.variables.indiceId] != undefined) {
                    filasAeliminar.push(filasmarcadas[i].data[self.variables.indiceId]);
                }
            }
            return filasAeliminar;
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
            } else if (tipomensaje == 2) {
                msg = 'Ocurrió un error al guardar los datos: <br/>' /*+ errorString*/;
            } else {
                msg = 'Ocurrió un error al eliminar los datos: <br/>' /*+ errorString*/;
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


            /*Ext.Msg.show({
                title  : 'Fatal error',
                msg    : msg,
                buttons: Ext.Msg.OK,
                animEl : 'elId',
                icon   : Ext.MessageBox.ERROR
            });*/
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
        modificaFiltro: function (self, filtro) {
            self.filtro = filtro;
        }
        ,
        addFiltro: function (self, nuevoElemento) {
            self.filtro.push(nuevoElemento);
        }
        ,
        dameUltimafilaSeleccionada: function (self) {
            return self.lastFilaseleccionada;
        }
        ,
        mostrarVentanaAsociarImagen: function (self) {
            var ventanaImagen = Misitio.Funciones.VentanaImagen(
                {
                    id: self.id + 'ventanaImagen'
                });

            var panelImagen = ventanaImagen.initialConfig.items[0];
            var campoImagen = panelImagen.damecampoImagen(panelImagen);

            campoImagen.setValue(self.lastFilaseleccionada.data[self.columnaImagen]);

            var ultimaFilaPuesta = undefined;
            var valorImagenSeleccionado = self.lastFilaseleccionada.data[self.columnaImagen];

            panelImagen.on('salvarimagen', function (datosImagen) {
                var columnaImagen = self.columnaImagen;

                self.lastFilaseleccionada.data[columnaImagen] = datosImagen.valorimagen;
                self.lastFilaseleccionada.commit();

                ultimaFilaPuesta = self.lastFilaseleccionada;
                if (datosImagen.esbotonguardar) {
                    self.store.getModifiedRecords().push(self.lastFilaseleccionada);
                    ventanaImagen.close();
                }
            });

            panelImagen.on('cancelar', function (val) {
                if (ultimaFilaPuesta != undefined) {
                    self.lastFilaseleccionada.data[self.columnaImagen] = valorImagenSeleccionado;
                    self.lastFilaseleccionada.commit();
                }
                ventanaImagen.close();

            });


        }
        ,
        verDetalles: function (self, record) {

            var data = new Array();

            for (var i = 0; i < self.configuracion.length; i++) {
                var columna = self.configuracion[i].nombre;
                var tipo = self.configuracion[i].tipo;
                var campovalor = self.configuracion[i].campovalor;
                var campoamostrar = self.configuracion[i].campoamostrar;
                var valor = record.data[self.configuracion[i].index];
                if (tipo == 'lista') {
                    var pos = self.configuracion[i].StoreCombo.findBy(function (rec, id) {
                        if (rec.data[campovalor] == valor) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if (pos != -1) {
                        valor = (self.configuracion[i].StoreCombo.getAt(pos).data)[campoamostrar];
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
        dameStoreGrid: function (self) {
            return self.gpEditor.getStore();
        }
        ,
        dameConfiguracion: function (self) {
            return self.configuracion;
        }
        ,
        dameMensaje: function (self, tipo, plural) {

            var femenino = self.configuracionMensajes.femenino;
            var numeroConcepto = self.configuracionMensajes.numero;


            function damePosicionElementoVocabulario(elemento, plural, femenino) {
                var vocabulario = {
                    'El': ['El', 'La', 'Los', 'Las'],
                    'el': ['el', 'la', 'los', 'las'],
                    'un': ['un', 'una', 'unos', 'unas'],
                    'de': ['del', 'de la', 'de los', 'de las'],
                    'este': ['este', 'esta', 'estos', 'estas'],
                    'ha': ['ha', 'ha', 'han', 'han'],
                    'o': ['o', 'a', 'os', 'as'],
                    'caracter': ['caracter', 'caracter', 'caracteres', 'caracteres'],
                    'especial': ['especial', 'especial', 'especiales', 'especiales'],
                    'adicionado': ['adicionado', 'adicionada', 'adicionados', 'adicionadas'],
                    'modificado': ['modificado', 'modificada', 'modificados', 'modificados'],
                    'seleccionado': ['seleccionado', 'seleccionada', 'seleccionados', 'seleccionadas'],
                    'eliminado': ['eliminado', 'eliminada', 'eliminados', 'eliminadas'],
                    'guardado': ['guardado', 'guardada', 'guardados', 'guardadas'],
                    'puede': ['puede', 'puede', 'pueden', 'pueden'],
                    'está': ['está', 'está', 'están', 'están'],
                };

                var pos = (plural ? 2 : 0) + (femenino ? 1 : 0);

                return vocabulario[elemento][pos];

            };
            var mensaje = '';
            var tipoMensaje = 2;
            switch (tipo) {
                case 'adicionar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('adicionado', plural, femenino) + ' satisfactoriamente.';

                    break;
                case 'modificar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('modificado', plural, femenino) + ' satisfactoriamente.';
                    break;
                case 'eliminar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino) + ' ' + numeroConcepto[posNumero] +
                        ' ' + damePosicionElementoVocabulario('ha', plural, femenino) + ' sido '
                        + damePosicionElementoVocabulario('eliminado', plural, femenino) + ' satisfactoriamente.';
                    break;
                case 'confirmareliminar':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = '¿Está seguro que quiere eliminar ' + damePosicionElementoVocabulario('el', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' ' + damePosicionElementoVocabulario('seleccionado', plural, femenino) + '?';
                    return mensaje;
                    break;

                case 'adicionarexiste':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' que desea adicionar ya existe';
                    return mostrarMensaje(6, mensaje);
                    break;
                case 'modificarexiste':
                    var posNumero = (plural) ? 1 : 0;
                    mensaje = damePosicionElementoVocabulario('El', plural, femenino)
                        + ' ' + numeroConcepto[posNumero] + ' que desea modificar ya existe';
                    return mostrarMensaje(6, mensaje);
                    break;
            }
            return mostrarMensaje(tipoMensaje, mensaje);

        }


    }
);

Misitio.Panel_Gestion.GestionPanelMaestroDetalle = Ext.extend(Ext.Panel,
    {
        panelMaestro: false,
        panelDetalle: false,
        columnaMaestro: false,
        initComponent: function () {
            var self = this;
            var panelMaestro = self.panelMaestro.items.items[0];
            var panelDetalle = self.panelDetalle;
            panelDetalle.disable();
            panelMaestro.csm.on('rowselect', function (sm, rowIndex, r) {
                self.fireEvent('elementochequeadomaestro', {
                    record  : r,
                    rowindex: rowIndex
                });
                if (sm.getSelections().length > 0) {
                    panelDetalle.btnAdicionar.enable();
                    panelDetalle.enable();
                    panelDetalle.valorcolumnaDetalle = r.data[self.columnaMaestro];

                    panelDetalle.cargarElementos(panelDetalle);
                } else {
                    panelDetalle.btnAdicionar.disable();
                    panelDetalle.store.removeAll();
                    panelDetalle.disable();
                }
            });
            panelMaestro.csm.on('rowdeselect', function (sm, rowIndex, r) {
                if (sm.getSelections().length > 0) {
                    panelDetalle.btnAdicionar.enable();
                    panelDetalle.enable();
                } else {
                    panelDetalle.btnAdicionar.disable();
                    panelDetalle.store.removeAll();
                    panelDetalle.disable();
                }
            });


            var items = [self.panelMaestro, self.panelDetalle];

            Ext.apply(this, {
                layout: 'border',
                items: items
            });


            Misitio.Panel_Gestion.GestionPanelMaestroDetalle.superclass.initComponent.apply(this);

        }
    }
);

Misitio.Panel_Gestion.GestionPanelMaestroDetalleVariante = Ext.extend(Ext.Panel,
    {
        panelMaestro: false,
        panelDetalle: false,
        columnaMaestro: false,
        columnaDetalle: false,
        initComponent: function () {
            var self = this;
            var panelMaestro = self.panelMaestro.items.items[0];
            var panelDetalle = self.panelDetalle;
            panelDetalle.disable();
            panelMaestro.csm.on('rowselect', function (sm, rowIndex, r) {
                if (sm.getSelections().length > 0) {
                    panelDetalle.btnAdicionar.enable();
                    panelDetalle.enable();
                    panelDetalle.valorcolumnaDetalle = r.data[self.columnaMaestro];

                    panelDetalle.cargarElementos(panelDetalle);
                } else {
                    panelDetalle.btnAdicionar.disable();
                    panelDetalle.store.removeAll();
                    panelDetalle.disable();
                }
            });
            panelMaestro.csm.on('rowdeselect', function (sm, rowIndex, r) {
                if (sm.getSelections().length > 0) {
                    panelDetalle.btnAdicionar.enable();
                    panelDetalle.enable();
                } else {
                    panelDetalle.btnAdicionar.disable();
                    panelDetalle.store.removeAll();
                    panelDetalle.disable();
                }
            });


            var items = [self.panelMaestro, self.panelDetalle];

            Ext.apply(this, {
                layout: 'border',
                items: items
            });


            Misitio.Panel_Gestion.GestionPanelMaestroDetalle.superclass.initComponent.apply(this);

        }
    }
);


Misitio.Panel_Gestion.GestionPanelMaestroDetalleMultiple = Ext.extend(Ext.Panel,
    {
        pConceptos: false,
        tabPanelConceptos: false,
        columnaMaestro: false,
        initComponent: function () {
            var self = this;

            var panelMaestro = self.tabPanelConceptos.items.items[0].items.items[0];

            self.pConceptos.disable();
            panelMaestro.csm.on('rowselect', function (sm, rowIndex, r) {
                if (sm.getSelections().length > 0) {

                    self.pConceptos.enable();
                    var panelesDetalles = self.tabPanelConceptos.items.items[1].items.items;

                    for (var i = 0; i < panelesDetalles.length; i++) {
                        if (panelesDetalles[i].disabled) {
                            panelesDetalles[i].enable();
                        }
                        var panelDetalle = panelesDetalles[i].items.items[0];
                        panelDetalle.valorcolumnaDetalle = r.data[self.columnaMaestro];
                        panelDetalle.actualizarVista(panelDetalle);
                    }

                }
            });
            panelMaestro.csm.on('rowdeselect', function (sm, rowIndex, r) {
                if (sm.getSelections().length > 0) {
                    self.pConceptos.enable();
                } else {
                    var panelesDetalles = self.tabPanelConceptos.items.items[1].items.items;

                    for (var i = 0; i < panelesDetalles.length; i++) {
                        panelesDetalles[i].disable();
                    }

                    self.pConceptos.disable();
                }
            });


            var items = [self.pConceptos, self.tabPanelConceptos];

            Ext.apply(this, {
                layout: 'border',
                items: items
            });


            Misitio.Panel_Gestion.GestionPanelMaestroDetalleMultiple.superclass.initComponent.apply(this);

        }
    }
);

Misitio.Panel_Gestion.GestionNomenclador = Ext.extend(Misitio.Panel_Gestion.GestionGridPanel,
    {

        initComponent: function () {
            var self = this;

            this.dfFechaDesde = new Ext.form.DateField({
                name: 'fdesde',
                id: 'fdesde' + self.id,
                fieldLabel: 'Fecha desde',
                anchor: '98%',
                allowBlank: false,
                format: 'd/m/Y',
                value: new Date().format('d/m/Y'),
                vtype: 'daterange',
                endDateField: 'fhasta' + self.id
            });

            this.dfFechaHasta = new Ext.form.DateField({
                name: 'fhasta',
                id: 'fhasta' + self.id,
                fieldLabel: 'Fecha hasta',
                anchor: '98%',
                format: 'd/m/Y',
                vtype: 'daterange',
                startDateField: 'fdesde' + self.id
            });

            var configNomenclador = new Array(
                {

                    nombre: 'id',
                    index: self.idtabla,
                    tipo: 'numero',
                    nulo: true
                }
                , {
                    nombre: 'Denominación',
                    index: 'denominacion',
                    tipo: 'texto',
                    nulo: false,
                    unico: true,
                    ancho: 250,
                    mostraFiltro: true,
                    expresionregular: '^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\\\+./_-]+([-_/.\\s]*[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\\\+./_-])+$',
                    mensaje: 'Solo admite caracteres alfanuméricos y los caracteres especiales (espacio ()+-_/\\.).',
                    tamannoForm: 1

                }
                , {
                    nombre: 'Abreviatura',
                    index: 'abreviatura',
                    tipo: 'texto',
                    nulo: true,
                    unico: false,
                    ancho: 150,
                    mostraFiltro: false,
                    expresionregular: '(^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+)([ \\,]([a-zA-Z0-9ÁÉÍÓÚáéíóúñüÑ]+))*)$',
                    mensaje: 'Solo admite caracteres alfanuméricos.',
                    maxlengthtext: 5,
                    tamannoForm: 1
                }
                , {
                    nombre: 'Fecha desde',
                    index: 'fdesde',
                    tipo: 'fecha',
                    ancho: 150,
                    nulo: false,
                    unico: false,
                    mostraFiltro: false,
                    tamannoForm: .5,
                    componente: self.dfFechaDesde
                }
                , {
                    nombre: 'Fecha hasta',
                    index: 'fhasta',
                    tipo: 'fecha',
                    ancho: 150,
                    nulo: false,
                    unico: false,
                    mostraFiltro: false,
                    tamannoForm: .5,
                    componente: self.dfFechaHasta
                }
                , {
                    nombre: 'Gestion',
                    index: 'gestion',
                    tipo: 'oculto',
                    ancho: 120,
                    nulo: true,
                    tamannoForm: 1
                }
                , {
                    nombre: 'Descripción',
                    index: 'descripcion',
                    tipo: 'texto',
                    nulo: true,
                    unico: false,
                    ancho: 250,
                    mostraFiltro: false,
                    tamannoForm: 1,
                    estextarea: true

                }
            );


            Ext.apply(this, {
                anchoForm: 400,
                configuracion: configNomenclador
            });


            Misitio.Panel_Gestion.GestionNomenclador.superclass.initComponent.apply(this);

        }

    }
);

Ext.ns('Misitio.Panel');
Misitio.Panel.PanelDetalles = Ext.extend(Ext.Panel,
    {
        id: ''
        , configuracion: new Array()

        ,
        initComponent: function () {
            var self = this;

            var html = "<center> <table style='font-size:12px;' width='300'>" +
                '<tpl for="." >' +
                '<tpl if="tipo==\'imagen\'">' +
                '<tr><th>{columna}</th> <th></th><th></th><th></th> </tr>' +
                "<tr><td colspan='4'><img class='imagen' src='{valor}' style='border-radius: 10px;'  width='300' height='300'/></td>" +
                '</tr></tpl>' +
                '<tpl if="tipo!=\'imagen\'"><tr><th>{columna}</th> <th></th><th></th><th></th> </tr>' +
                '<tr><td>{valor}</td><td></td><td></td><td></td></tr></tpl>' +
                '</tpl>' +
                "</table></center>";

            self.tpl = new Ext.XTemplate(html);

            self.on('render', function (_this) {
                self.tpl.overwrite(_this.body, self.configuracion);
                _this.body.highlight('#c3daf9', {block: true});
            });

            Ext.apply(this, {
                title: 'Detalles'
            });

            Misitio.Panel.PanelDetalles.superclass.initComponent.apply(this);


        }


    }
);



