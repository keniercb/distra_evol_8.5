/**
 * @author     Jorge Luis Cuellar Mondeja
 * @package    Configuración
 * @subpackage Comun
 * @copyright  XETID
 * @version    2.0-0 - (31/08/2013)
 */

Ext.ns('Ext.erp');

Ext.erp.gridAtribDinamicos = Ext.extend(Ext.grid.GridPanel, {
    /**
     *  Función que se ejecutará cuando se abra o cierre la ventana de gestionar atributos dinámicos
     */
    fnShowVentanaGestion: false,
    /**
     *  Esquema donde se gestionaran los atributos dinámicos (obligatorio)
     */
    schema: '',
    /**
     *  Dirección de la controladora del componente
     */
    urlControladora: '/configuracion/nomdinamicos/index.php/indicadoresatributosdinamicos/',
    /**
     *  Arreglo de etiquetas de la interfaz
     */
    idioma: '',
    /**
     *   Si la ventana de gestión está activa o no
     */
    ventanaGestion: false,
    /**
     *   idtabla del componente seleccionado
     */
    idtabla: false,
    /**
     *   idtablageneral del componente seleccionado
     */
    idtablageneral: false,
    /**
     *  Identificador (id) del objeto al cual se le va a crear atributos dinámicos
     */
    idObjeto: '',
    /**
     *  Prefijo de la tabla de atributos dinámicos (Al final el objetivo es que la tabla se llame "prefijoTabla_idObjeto" )
     */
    prefijoTabla: '',
    /**
     *  Descripción del componente que genera la nueva tabla metadatos
     */
    descripcionOrigen: '',
    /**
     *  Arreglos llaves foraneas a insertar por defecto en la tabla metadatos, si esta marcada la opción global
     */
    llavesGlobal: [],
    /**
     *  Arreglos llaves foraneas a insertar por defecto en la tabla metadatos, si no esta marcada la opción global
     */
    llavesHijos: [],
    /**
     *  Función a ejecutarse tras insertarse un nuevo atributo dinámico
     */
    postAdicionar: '',
    /**
     *  Función a ejecutarse tras modificarse un atributo dinámico
     */
    postModificar: '',
    /**
     *  Función a ejecutarse tras eliminarse un atributo dinámico
     */
    postEliminar: '',
    /**
     *  Función encaragada de actualizar los parámetros necesarios para el trabajo con el componente
     */
    preOperacion: '',
    /**
     *  Si el componente guarda los atributos globales por defecto
     */
    globalDefault: false,
    /**
     *  Si se muestra la opción de atributos globales por defecto
     */
    globalHide: true,
    /**
     *  Si se muestra la opción de valoresNulosHide
     */
    valoresNulosHide: true,
    /**
     *   Si se muestra la opción de valor No nulo
     */
    /**
     *   Si se muestra la opción de Fecha inicio - Fecha fin
     */
    fechasHide: true,
    /**
     *  Arreglo de identificadores de atributos dinámicos que no se pueden gestionar
     */
    valoresIntocables: [],
    constructor: function (config) {

        var _this = this;

        Ext.Ajax.request({
            url: ((config.urlControladora) ? config.urlControladora : _this.urlControladora) + 'cargaretiquetas',
            method: 'POST',
            callback: function (options, success, response) {
                if (success) {

                    _this.idioma = Ext.decode(response.responseText);
                    _this._initComponent();
                }
            }
        });

        Ext.erp.gridAtribDinamicos.superclass.constructor.apply(this, arguments);
    },
    _initComponent: function () {

        this.initTBar();
        this.initColumnModel();
        this.initSelectionModel();
        this.initStore();
        this.loadMask = true;
        if (this.valoresIntocables.indexOf('denominacion') == -1) {
            this.valoresIntocables.push('denominacion');
        }
        Ext.apply(Ext.form.VTypes, {
            daterange: function (val, field) {
                var date = field.parseDate(val);
                if (!date) {
                    return;
                }
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    var start = Ext.getCmp(field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    var end = Ext.getCmp(field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                return true;
            }
        });

        Ext.apply(this, {
            autoExpandColumn: 'denominacion'
        });

        this.LoadMask = new Ext.LoadMask(Ext.getBody(), {msg: this.idioma.lbLoadMaskCargando});
        //_this.LoadMask.show();
        //_this.LoadMask.hide();

        Ext.erp.gridAtribDinamicos.superclass.initComponent.call(this);
        this.show();
    },
    initColumnModel: function () {
        var _this = this;

        this.columns = [new Ext.grid.RowNumberer({
            header: 'No.',
            width: 35,
            id: 'numberer',
            renderer: function (v, p, recordActivo, rowIndex, colIndex, store) {
                if (this.rowspan) {
                    p.cellAttr = 'rowspan="' + this.rowspan + '"';
                }

                var so = store.lastOptions;
                var sop = so ? so.params : null;
                return ((sop && sop.start) ? sop.start : 0) + rowIndex + 1;
            }
        }), {
            hidden: true,
            hideable: false,
            dataIndex: 'idcampo'
        }, {
            id: 'denominacion',
            header: _this.idioma.lbDenominacion,
            width: 100,
            dataIndex: 'DatComponente.etiqueta',
            renderer: function (value, metaData, record) {

                if (_this.valoresIntocables.length > 0) {
                    for (var i = 0, length = _this.valoresIntocables.length; i < length; i++) {
                        if (_this.valoresIntocables[i] == record.get('denominacion')) {

                            return '<span style="color: green">' + value + '</span>';
                        }
                    }
                }

                if (record.get('idtabla') == _this.idtabla || record.get('idtabla') == _this.idtablageneral) {
                    return value;
                } else {
                    return '<span style="color: green">' + value + '</span>';
                }

            }
        }, {
            header: _this.idioma.lbTipoDato,
            width: 200,
            dataIndex: 'NomTipoDatoNomGestor.NomTipoDato.denominacion',
            renderer: function (value, metaData, record) {
                if (_this.valoresIntocables.length > 0) {
                    for (var i = 0, length = _this.valoresIntocables.length; i < length; i++) {
                        if (_this.valoresIntocables[i] == record.get('denominacion')) {
                            return '<span style="color: green">' + value + '</span>';
                        }
                    }
                }

                if (record.get('idtabla') == _this.idtabla || record.get('idtabla') == _this.idtablageneral) {
                    return value;
                } else {
                    return '<span style="color: green">' + value + '</span>';
                }
            }
        }, {
            header: _this.idioma.lbLongitud,
            width: 100,
            dataIndex: 'longitud', renderer: function (value, metaData, record) {

                if (_this.valoresIntocables.length > 0) {
                    for (var i = 0, length = _this.valoresIntocables.length; i < length; i++) {
                        if (_this.valoresIntocables[i] == record.get('denominacion')) {

                            return '<span style="color: green">' + value + '</span>';
                        }
                    }
                }

                if (record.get('idtabla') == _this.idtabla || record.get('idtabla') == _this.idtablageneral) {
                    return value;
                } else {
                    return '<span style="color: green">' + value + '</span>';
                }
            }
        }, {
            id: 'propios',
            header: _this.idioma.lbPropios,
            width: 70,
            dataIndex: 'idtabla',
            align: 'center',
            hidden: _this.globalHide,
            hideable: !_this.globalHide,
            renderer: function (value, metaData) {

                if (value == _this.idtabla || value == _this.idtablageneral) {
                    metaData.css = 'inactivo';
                } else {
                    metaData.css = 'activo';
                }
            }
        }, {
            id: 'general',
            header: _this.idioma.lbNivelNomenclador,
            width: 100,
            dataIndex: 'general',
            align: 'center',
            hidden: _this.globalHide,
            hideable: !_this.globalHide,
            renderer: function (value, metaData) {

                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        }];
    },
    initSelectionModel: function () {
        var _this = this;
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                'rowselect': function (sm, rowIndex, record) {
                    _this.btnEliminar.enable();
                    _this.btnModificar.enable();
                    var bandera = true;
                    if (_this.idtabla == record.get('idtabla') || _this.idtablageneral == record.get('idtabla')) {
                        if (_this.valoresIntocables.length > 0) {
                            for (var i = 0, length = _this.valoresIntocables.length; i < length; i++) {
                                var denom = record.get('denominacion');
                                var arrdenom = denom.split(_this.valoresIntocables[i]);
                                if (arrdenom.length == 2) {
                                    bandera = false;
                                    break;
                                }
                            }
                        }
                    } else {
                        bandera = false;
                    }
                    if (bandera == false) {
                        _this.btnEliminar.disable();
                        _this.btnModificar.disable();
                    }
                },
                'rowdeselect': function (sm) {
                    _this.btnEliminar.disable();
                    _this.btnModificar.disable();
                }
            }
        });
    },
    initStore: function () {
        var _this = this;

        this.store = new Ext.data.Store({
            url: _this.urlControladora + 'getGrid',
            listeners: {
                'beforeload': function () {

                    if (typeof (_this.preOperacion) == 'function') {
                        _this.preOperacion();
                    }

                    //_this.LoadMask.show();
                    _this.btnEliminar.disable();
                    _this.btnModificar.disable();
                },
                'load': function () {
                    //_this.LoadMask.hide();
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: "idcampo"
            }, [
                {
                    name: 'idcampo'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'etiqueta'
                },
                {
                    name: 'longitud'
                },
                {
                    name: 'NomTipoDatoNomGestor.NomTipoDato.denominacion'
                },
                {
                    name: 'DatComponente.etiqueta'
                },
                {
                    name: 'idtabla'
                },
                {
                    name: 'general'
                },
                {
                    name: 'DatComponente'
                },
                {
                    name: 'NomTipoDatoNomGestor'
                },
                {
                    name: 'NomTipoDato'
                }
            ])
        });

    },
    initTBar: function () {
        var _this = this;

        this.btnAdicionar = new Ext.Button({
            iconCls: 'adicionar',
            disabled: true,
            text: _this.idioma.lbBtnAdicionar,
            tooltip: _this.idioma.lbTtBtnAdicionar,
            handler: function () {
                _this.adicionar();
            }
        });

        this.btnModificar = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            text: _this.idioma.lbBtnModificar,
            tooltip: _this.idioma.lbTtBtnModificar,
            handler: function () {
                _this.modificar();
            }
        });

        this.btnEliminar = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.lbTtBtnEliminar,
            handler: function () {
                _this.eliminar();
            }
        });

        this.btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            id: 'idbtnAyudaAtribDinamicos',
            text: _this.idioma.lbBtnAyuda,
            tooltip: _this.idioma.lbTtBtnAyuda,
            referencia: '/configuracion/nomdinamicos/index.php/indicadoresatributosdinamicos/indicadoresatributosdinamicos'
        });

        this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];
    },
    trimvalores: function (cadena) {
        var valor1 = cadena.replace(/^\s+/g, '');
        var valor2 = valor1.replace(/\s/g, '');
        var result = valor2.replace(" ", "");
        return result.toLowerCase();
    },
    adicionar: function () {
        var _this = this;
        if (!_this.ventanaGestion) { // Si la ventana de gestión no esta activa

            // Actualizo el id del componente seleccionado
            _this.preOperacion();

            /*
             *  Función para configurar el formulario de la ventana en dependencia del tipo de atributo dinámico que se
             *  quiera adicionar
             */
            function configurarFormulario(op) {
                //_this.cmbExpreregular.disable();
                Ext.getCmp('rgex').hide();
                _this.cmbExpreregular.disable();
                Ext.getCmp('rgex').hide();
                Ext.getCmp('longitud').disable();
                Ext.getCmp('clongitud').hide();
                Ext.getCmp('cdecimal').hide();
                Ext.getCmp('decimales').hide();
                Ext.getCmp('cprecision').hide();
                Ext.getCmp('limite_inferior').disable();
                Ext.getCmp('mini').hide();
                Ext.getCmp('limite_superior').disable();
                Ext.getCmp('maxi').hide();
                Ext.getCmp('longitud').disable();
                Ext.getCmp('clongitud').hide();
                if (Ext.getCmp('fecha_inicio'))
                    Ext.getCmp('fecha_inicio').disable();
                Ext.getCmp('fini').hide();
                if (Ext.getCmp('fecha_fin'))
                    Ext.getCmp('fecha_fin').disable();
                Ext.getCmp('ffin').hide();
                _this.cmbNomDinamicos.disable();
                Ext.getCmp('ccmbtabla').hide();
                Ext.getCmp('ccmbcampovf').hide();

                // numero: 1 texto: 2 date: 3 chkbob: 4 nomenclador: 5
                if (op == 1) {
                    Ext.getCmp('maxi').show();
                    Ext.getCmp('cdecimal').show();
                    //Ext.getCmp('limite_superior').enable();
                    Ext.getCmp('mini').show();
                    Ext.getCmp('decimales').show();
                    //Ext.getCmp('limite_inferior').enable();
                    Ext.getCmp('clongitud').show();
                    var cmplongitud = Ext.getCmp('longitud');
                    cmplongitud.enable();
                    cmplongitud.maxLength = 2;
                    cmplongitud.maxLengthText = _this.idioma.lbLongitudMax.replace('_', 2);
                    cmplongitud.maxValue = 19;
                    cmplongitud.maxText = _this.idioma.lbValorMax.replace('_', 19);
                }
                if (op == 2) {
                    Ext.getCmp('rgex').show();
                    _this.cmbExpreregular.enable();
                    Ext.getCmp('clongitud').show();
                    var cmplongitud = Ext.getCmp('longitud');
                    cmplongitud.enable();
                    cmplongitud.maxLength = 2;
                    cmplongitud.maxLengthText = _this.idioma.lbLongitudMax.replace('_', 2);
                    cmplongitud.maxValue = 50;
                    cmplongitud.maxText = _this.idioma.lbValorMax.replace('_', 50);
                }
                if (op == 3) {
                    if (Ext.getCmp('fecha_inicio')) {
                        Ext.getCmp('fecha_inicio').enable();
                        Ext.getCmp('fini').show();
                    }
                    if (Ext.getCmp('ffin') && Ext.getCmp('fecha_fin')) {
                        Ext.getCmp('fecha_fin').enable();
                        Ext.getCmp('ffin').show();
                    }
                }
                if (op == 5) {
                    Ext.getCmp('ccmbtabla').show();
                    _this.cmbNomDinamicos.enable();
                    Ext.getCmp('ccmbcampovf').show();
                }
                if (op == 6) {
                    Ext.getCmp('clongitud').show();
                    var cmplongitud = Ext.getCmp('longitud');
                    cmplongitud.enable();
                    cmplongitud.maxLength = 3;
                    cmplongitud.maxLengthText = _this.idioma.lbLongitudMax.replace('_', 3);
                    cmplongitud.maxValue = 255;
                    cmplongitud.maxText = _this.idioma.lbValorMax.replace('_', 255);
                }
                ventana.doLayout();
            }

            /*
             *  Función para adicionar un nuevo atributo dinámico
             */
            function adicionarNuevoAtributo(_postFn) {
                function _guardarAtributo(pIdCampo, nombreNomTabla) {

                    var etiqueta = _this.denometiqueta.getValue();
                    var cadena = _this.trimvalores(etiqueta);
                    var result = _this.getStore().find('denominacion', cadena);
                    var result2 = _this.getStore().find('etiqueta', cadena);

                    if (result == -1 && result2 == -1) {
                        var parametros = {
                            idtabla: _this.idtabla,
                            idtablageneral: _this.idtablageneral,
                            idtablaNom: (_this.idtablaNom) ? _this.idtablaNom : -1,
                            idObjeto: _this.idObjeto,
                            prefijoTabla: _this.prefijoTabla,
                            descripcionAtributo: _this.descripcionAtributo,
                            schema: _this.schema,
                            llavesDefecto: Ext.encode((Ext.getCmp('global').getValue() == true) ? _this.llavesGlobal : _this.llavesHijos), // Que campos se debe crear en la tabla metadatos por defecto en cada caso
                            decimal: decimal,
                            tftabla: _this.schema + '.' + nombreNomTabla,
                            cmbcampodf: nombreNomTabla,
                            cmbcampovf: nombreNomTabla,
                            idcampovf: nombreNomTabla.replace('nom_', 'id'),
                            idcampo: pIdCampo
                        };

                        if (Ext.getCmp('longitud').getValue().length <= 0 && _this.cmbTipoDato.getValue() != 3) {
                            Ext.getCmp('longitud').enable();
                            Ext.getCmp('longitud').setValue(19);
                            Ext.getCmp('precision').setValue(0);
                        }

                        formPanel.getForm().submit({
                            url: _this.urlControladora + 'adicionarCampo',
                            params: parametros,
                            waitMsg: _this.idioma.lbWaitMsgInsertar,
                            waitTitle: _this.idioma.waintAdicionar,
                            success: function (form, action) {
                                var resp = Ext.decode(action.response.responseText);

                                mostrarMensaje(1, _this.idioma.lbGuardarOk);

                                _this.getStore().reload();

                                if (typeof (_this.postAdicionar) == 'function') {
                                    _this.postAdicionar(resp.idtabla, resp.columna);
                                }
                                _postFn.call();

                            },
                            failure: function (form, action) {
                                var resp = Ext.decode(action.response.responseText);
                                if (resp.cod == 4) {
                                    mostrarMensaje(1, _this.idioma.lbAtriOblegatorioInsertado);
                                } else {
                                    mostrarMensaje(1, _this.idioma.lbGuardarError);
                                }
                            }

                        });
                    } else {
                        mostrarMensaje(1, _this.idioma.lbGuardarCampoDuplicado);
                    }
                }

                if (formPanel.getForm().isValid() && (_this.idtabla || _this.idtablageneral)) {

                    var decimal = (Ext.getCmp('decimales').getValue() == true) ? 1 : 0;

                    if (_this.cmbTipoDato.getValue() == 5) {

                        stValueDisplay.load({
                            callback: function () {
                                var index = stValueDisplay.find('name', 'denominacion');
                                var idcampo = stValueDisplay.getAt(index).get('idcampo');
                                var nombreNomTabla = _this.cmbNomDinamicos.store.getById(_this.cmbNomDinamicos.getValue()).get('tabla');

                                _guardarAtributo(idcampo, nombreNomTabla);
                            }
                        });
                    } else {
                        _guardarAtributo('', '');
                    }

                } else
                    mostrarMensaje(3, _this.idioma.lbValoresIncorrectos);
            }

            var stValueDisplay = new Ext.data.Store({
                url: _this.urlControladora + 'getCamposTablas',
                listeners: {
                    'beforeload': function (st, rcs) {
                        st.baseParams.idtabla = _this.cmbNomDinamicos.getValue();
                    }
                },
                reader: new Ext.data.JsonReader({
                    root: "data",
                    id: "idcampo"
                }, [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'idcampo'
                    },
                    {
                        name: 'name'
                    }
                ])
            });
            _this.denometiqueta = new Ext.form.TextField({
                xtype: 'textfield',
                fieldLabel: _this.idioma.lbDenominacion,
                name: 'etiqueta',
                anchor: '95%',
                regexText: _this.idioma.lbValorIncorrectoDenomAtributo,
                allowBlank: false,
                regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\(\/]+([_/\s\)\/]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\)]+)+$/,
                maxLength: 50,
                maxLengthText: _this.idioma.lbMaxTextDenominacion,
                minLength: 2,
                minLengthText: _this.idioma.lbMinTextDenominacion,
            });
            _this.cmbTipoDato = new Ext.form.ComboBox({
                displayField: 'denominacion',
                valueField: 'idtipodato',
                hiddenName: 'idtipodato',
                triggerAction: 'all',
                anchor: '95%',
                fieldLabel: _this.idioma.lbTipoDato,
                forceSelection: true,
                allowBlank: false,
                mode: 'local',
                store: new Ext.data.Store({
                    url: _this.urlControladora + 'getTiposDatos',
                    autoLoad: true,
                    reader: new Ext.data.JsonReader({
                        totalProperty: "total",
                        root: "data",
                        id: "idtipodato"
                    }, [
                        {
                            name: 'idtipodato'
                        },
                        {
                            name: 'denominacion'
                        }
                    ]),
                    listeners: {
                        'load': function (st, rd, op) {
                            _this.cmbTipoDato.setValue(st.getAt(0).data.idtipodato);
                            _this.cmbTipoDato.fireEvent('select', _this.cmbTipoDato);
                        }
                    }
                }),
                listeners: {
                    select: function (cmb) {
                        configurarFormulario(cmb.getValue());
                    }
                }
            });
            _this.cmbExpreregular = new Ext.form.ComboBox({
                displayField: 'denominacion',
                //id: 'expresion_regular',
                valueField: 'idexpresionregular',
                triggerAction: 'all',
                hiddenName: 'idexpresionregular',
                mode: 'remote',
                anchor: '95%',
                fieldLabel: _this.idioma.lbExpRegular,
                editable: false,
                store: new Ext.data.Store({
                    url: _this.urlControladora + 'getExpresiones',
                    reader: new Ext.data.JsonReader({
                        root: "data",
                        id: "idexpresionregular"
                    }, [
                        {
                            name: 'idexpresionregular'
                        },
                        {
                            name: 'denominacion'
                        }
                    ])
                })
            });
            _this.cmbNomDinamicos = new Ext.form.ComboBox({
                displayField: 'alias',
                valueField: 'idtabla',
                hiddenName: 'tabla',
                //id: 'tftabla',
                fieldLabel: _this.idioma.lbTablas,
                xtype: 'combo',
                triggerAction: 'all',
                forceSelection: true,
                allowBlank: false,
                mode: 'local',
                anchor: '95%',
                editable: false,
                store: new Ext.data.Store({
                    autoLoad: true,
                    url: _this.urlControladora + 'getTablas',
                    reader: new Ext.data.JsonReader({
                        root: "data",
                        id: "idtabla"
                    }, [
                        {
                            name: 'idtabla'
                        },
                        {
                            name: 'tabla'
                        },
                        {
                            name: 'alias'
                        }
                    ])
                }), listeners: {
                    'select': function (combo, record, index) {
                        _this.idtablaNom = combo.getValue();
                    }
                }
            });
            var formPanel = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                autoHeight: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .70,
                                layout: 'form',
                                items: [_this.denometiqueta,
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: _this.idioma.lbNivelNomenclador,
                                        id: 'global',
                                        hidden: _this.globalHide,
                                        checked: _this.globalDefault,
                                        hideLabel: true,
                                        style: 'margin-top: 20px;'
                                    }
                                ]
                            },
                            {
                                columnWidth: .30,
                                layout: 'form',
                                items: [
                                    _this.cmbTipoDato
                                ]
                            },
                            {
                                columnWidth: 1,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: _this.idioma.lbValoresNulos,
                                        hidden: _this.valoresNulosHide,
                                        id: 'permite_nulo',
                                        name: 'permite_nulo',
                                        hideLabel: true,
                                        style: 'margin-top: 10px;'
                                    },
                                    new Ext.form.FieldSet({
                                        layout: 'column',
                                        id: 'fs_fieldset',
                                        autoHeight: true,
                                        items: [
                                            {
                                                columnWidth: .33,
                                                id: 'clongitud',
                                                hidden: true,
                                                layout: 'form',
                                                items: [
                                                    {
                                                        xtype: 'numberfield',
                                                        fieldLabel: _this.idioma.lbLongitud,
                                                        id: 'longitud',
                                                        minValue: 1,
                                                        invalidText: _this.idioma.lbInvalidText,
                                                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                                                        regex: /^([0-9]+ ?[0-9]*)+$/,
                                                        anchor: '95%',
                                                        enableKeyEvents: true,
                                                        listeners: {
                                                            'change': function (cmp) {
                                                                if (cmp.isValid()) {
                                                                    var longitud = cmp.getRawValue();
                                                                    var valor = '';

                                                                    if (Ext.getCmp('limite_inferior').isVisible()) {
                                                                        for (var i = 0; i < longitud - 1; i++) {
                                                                            valor += '9';
                                                                        }
                                                                        if (longitud == 1) {
                                                                            Ext.getCmp('limite_inferior').maxLength = longitud;
                                                                            Ext.getCmp('limite_inferior').maxLengthText = "El tama&ntilde;o m\xe1ximo requerido es 1 d&iacute;gito.";

                                                                            Ext.getCmp('limite_inferior').maxValue = valor + '8';
                                                                            Ext.getCmp('limite_inferior').maxText = _this.idioma.lbValorMax.replace('_', valor + '8');

                                                                            Ext.getCmp('limite_superior').maxLength = longitud;
                                                                            Ext.getCmp('limite_superior').maxLengthText = "El tama&ntilde;o m\xe1ximo requerido es 1 d&iacute;gito.",
                                                                                Ext.getCmp('limite_superior').maxValue = valor + '9';
                                                                            Ext.getCmp('limite_superior').maxText = _this.idioma.lbValorMax.replace('_', valor + '9');
                                                                        } else {
                                                                            Ext.getCmp('limite_inferior').maxLength = longitud;
                                                                            Ext.getCmp('limite_inferior').maxLengthText = _this.idioma.lbLongitudMax.replace('_', longitud);

                                                                            Ext.getCmp('limite_inferior').maxValue = valor + '8';
                                                                            Ext.getCmp('limite_inferior').maxText = _this.idioma.lbValorMax.replace('_', valor + '8');

                                                                            Ext.getCmp('limite_superior').maxLength = longitud;
                                                                            Ext.getCmp('limite_superior').maxLengthText = _this.idioma.lbLongitudMax.replace('_', longitud);

                                                                            Ext.getCmp('limite_superior').maxValue = valor + '9';
                                                                            Ext.getCmp('limite_superior').maxText = _this.idioma.lbValorMax.replace('_', valor + '9');

                                                                        }
                                                                        Ext.getCmp('limite_inferior').enable();
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        layout: 'column',
                                                        items: [
                                                            {
                                                                columnWidth: .5,
                                                                id: 'cdecimal',
                                                                hidden: true,
                                                                layout: 'form',
                                                                items: [new Ext.form.Checkbox({
                                                                    fieldLabel: _this.idioma.lbDecimal,
                                                                    id: 'decimales',
                                                                    listeners: {
                                                                        'check': function (th, ch) {
                                                                            Ext.getCmp('cprecision').hide(); // XXX
                                                                            if (ch)
                                                                                Ext.getCmp('cprecision').show(); // XXX
                                                                        }
                                                                    }
                                                                })]
                                                            },
                                                            {
                                                                columnWidth: .5,
                                                                id: 'cprecision',
                                                                hidden: true,
                                                                layout: 'form',
                                                                items: [
                                                                    {
                                                                        xtype: 'numberfield',
                                                                        fieldLabel: _this.idioma.lbPrecision,
                                                                        id: 'precision',
                                                                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                                                                        regex: /^([0-9]+ ?[0-9]*)+$/,
                                                                        maxLength: 1,
                                                                        maxLengthText: _this.idioma.lbTamanoUnDigito,
                                                                        maxText: _this.idioma.lbValorMax.replace('_', 6),
                                                                        minValue: 0,
                                                                        maxValue: 6,
                                                                        width: 50
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                columnWidth: .60,
                                                id: 'ccmbtabla',
                                                hidden: true,
                                                layout: 'form',
                                                items: [
                                                    _this.cmbNomDinamicos
                                                ]
                                            },
                                            {
                                                columnWidth: .40,
                                                id: 'ccmbcampovf',
                                                hidden: true,
                                                layout: 'form'
                                            },
                                            {
                                                columnWidth: 0.66,
                                                id: 'rgex',
                                                hidden: true,
                                                layout: 'form',
                                                items: [
                                                    _this.cmbExpreregular
                                                ]
                                            },
                                            {
                                                columnWidth: 0.33,
                                                id: 'mini',
                                                hidden: true,
                                                layout: 'form',
                                                items: [
                                                    {
                                                        xtype: 'numberfield',
                                                        fieldLabel: _this.idioma.lbLimitInferior,
                                                        id: 'limite_inferior',
                                                        disabled: true,
                                                        name: 'limiteinferior',
                                                        minValue: 0,
                                                        anchor: '95%',
                                                        enableKeyEvents: true,
                                                        listeners: {
                                                            'change': function (cmp) {
                                                                var valor = parseInt(cmp.getRawValue());

                                                                Ext.getCmp('limite_superior').minValue = valor;
                                                                Ext.getCmp('limite_superior').minText = _this.idioma.lbValorMin.replace('_', valor);

                                                                Ext.getCmp('limite_superior').enable();
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                columnWidth: 0.33,
                                                id: 'maxi',
                                                hidden: true,
                                                layout: 'form',
                                                items: [
                                                    {
                                                        xtype: 'numberfield',
                                                        fieldLabel: _this.idioma.lbLimitSuperior,
                                                        id: 'limite_superior',
                                                        name: 'limitesuperior',
                                                        disabled: true,
                                                        minValue: 1,
                                                        anchor: '95%'
                                                    }
                                                ]
                                            },
                                            {
                                                columnWidth: 0.33,
                                                id: 'fini',
                                                hidden: true,
                                                layout: 'form',
                                                items: (!_this.fechasHide) ? new Ext.form.DateField({
                                                    fieldLabel: _this.idioma.lbFechaInicio,
                                                    format: 'd/m/Y',
                                                    name: 'fecha_inicio',
                                                    id: 'fecha_inicio',
                                                    anchor: '95%',
                                                    vtype: 'daterange',
                                                    endDateField: 'fecha_fin'
                                                }) : ''
                                            },
                                            {
                                                columnWidth: 0.33,
                                                id: 'ffin',
                                                hidden: true,
                                                layout: 'form',
                                                items: (!_this.fechasHide) ? new Ext.form.DateField({
                                                    fieldLabel: _this.idioma.lbFechaFin,
                                                    format: 'd/m/Y',
                                                    name: 'fecha_fin',
                                                    id: 'fecha_fin',
                                                    vtype: 'daterange',
                                                    startDateField: 'fecha_inicio',
                                                    anchor: '95%'
                                                }) : ''
                                            }
                                        ]
                                    })
                                ]
                            }
                        ]
                    }
                ]
            });
            _this.btnAceptar = new Ext.Button({
                iconCls: 'aceptar',
                text: _this.idioma.lbBtnAceptar,
                tooltip: _this.idioma.lbTtBtnAceptar,
                handler: function () {
                    adicionarNuevoAtributo(function () {
                        formPanel.getForm().reset();
                        ventana.close();
                    });
                }
            });
            _this.btnAplicar = new Ext.Button({
                iconCls: 'aplicar',
                text: _this.idioma.lbBtnAplicar,
                tooltip: _this.idioma.lbTtBtnAplicar,
                handler: function () {
                    adicionarNuevoAtributo(function () {
                        formPanel.getForm().reset();
                    });
                }
            });
            _this.btnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                text: _this.idioma.lbBtnCancelar,
                tooltip: _this.idioma.lbTtBtnCancelar,
                handler: function () {
                    ventana.close();
                }
            });
            var ventana = new Ext.Window({
                title: _this.idioma.lbTitVentanaAdicionar,
                modal: true,
                layout: 'fit',
                constrain: true,
                width: 650,
                autoHeight: true,
                listeners: {
                    'show': function () {
                        _this.denometiqueta.focus(true, 500);
                        //_this.vAtributos.keymap.disable();
                        this.keymap.stopEvent = true;
                        this.keymap.enable();
                    },
                    'close': function () {
                        _this.ventanaGestion = false;
                        _this.fnShowVentanaGestion = false;
                        this.keymap.disable();
                        //_this.vAtributos.keymap.enable();
                    }
                },
                keymap: new Ext.KeyMap(document, [{
                    key: 13,
                    ctrl: false,
                    alt: false,
                    stopEvent: true,
                    fn: function () {
                        ventana.buttons[2].handler();
                    }
                }, {
                    key: 88,
                    ctrl: false,
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        ventana.buttons[0].handler();
                    }
                }, {
                    key: 80,
                    ctrl: true,
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        ventana.buttons[1].handler();
                    }
                }]),
                items: [formPanel],
                buttons: [
                    _this.btnCancelar,
                    _this.btnAplicar,
                    _this.btnAceptar
                ]
            });

            _this.ventanaGestion = true;
            //_this.fnShowVentanaGestion(true);
            _this.fnShowVentanaGestion = true;
            _this.validador = new FormValidator({
                buttons: [_this.btnAplicar, _this.btnAceptar],
                buttonsRegister: [_this.btnCancelar],
                fields: [_this.denometiqueta,
                    _this.cmbTipoDato],
                keyMapContainer: ventana
            });
            ventana.show();
        }
    },
    modificar: function () {
        var _this = this;
        _this.TextAreaDenominacion = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbDenominacion,
            name: 'etiqueta',
//            name: 'denominacion',
            anchor: '100%',
            autoValidate: true,
            //id: 'textareaden',
            allowBlank: false,
            regex: /^([a-zA-Z0-9\s_ÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\s_ÁÉÝÓÚÑáéíúóñ?]*){1,50}$/,
            maskRe: /^([a-zA-Z0-9\s_ÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\s_ÁÉÝÓÚÑáéíúóñ?]*){1,50}$/,
            maxLength: 50,
            maxLengthText: _this.idioma.lbMaxTextDenominacion,
            //value: _this.getSelectionModel().getSelected().get('DatComponente.etiqueta'),
            listeners: {
                'valid': function (field) {
                    if (field.getValue().charAt(0) == ' ') {
                        field.markInvalid('El contenido no puede comenzar con espacios.');
                    }
                    if (field.getValue().charAt(0) == '_') {
                        field.markInvalid('El contenido no puede comenzar con el caracter "-".');
                    }
                }
            }
        });
        var form = new Ext.FormPanel({
            url: _this.urlControladora + 'modificarDenominacion',
            frame: true,
            labelAlign: 'top',
            autoHeight: true,
            listeners: {
                'clientvalidation': function (fp, valid) {
                    var checkdirty = false;
                    fp.getForm().items.each(function (field) {
                        if (field.isDirty() && valid) {
                            checkdirty = true;
                            habilitarbtnmodificar();
                        }
                    });
                    if (!checkdirty) {
                        desabilitarbtnAdcionar();
                    }
                }
            },
            items: [_this.TextAreaDenominacion]
        });
        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            id: "idbtnWinmodificarAtrib",
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnAceptar,
            handler: function () {

                if (form.getForm().isValid()) {
                    var etiqueta = _this.TextAreaDenominacion.getValue();
                    var cadena = _this.trimvalores(etiqueta);
                    var result = _this.getStore().find('denominacion', cadena);
                    var result2 = _this.getStore().find('etiqueta', cadena);

                    if (result == -1 && result2 == -1) {

                        form.getForm().submit({
                            params: {
                                idcampo: _this.getSelectionModel().getSelected().get('idcampo')
                            },
                            success: function () {
                                mostrarMensaje(1, _this.idioma.lbModificarOk);

                                _this.getStore().reload();
                                ventana.close();

                                if (typeof (_this.postModificar) == 'function') {
                                    _this.postModificar.call();
                                }
                            },
                            failure: function (form, action) {
                            }
                        });
                    } else
                        mostrarMensaje(1, _this.idioma.lbGuardarModCampoDuplicado);
                } else {
                    mostrarMensaje(1, _this.idioma.lbMsgValoresIncorrectos);
                }
            }
        });
        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            id: 'idbtnWinmodificarAtribCan',
            tooltip: _this.idioma.lbTtBtnCancelar,
            handler: function () {
                ventana.close();
            }
        });
        var ventana = new Ext.Window({
            title: _this.idioma.lbTitVentanaModificar,
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 300,
            autoValidate: false,
            listeners: {
                'show': function () {
                    var val = _this.getSelectionModel().getSelected().get('DatComponente.etiqueta');
                    var record = {
                        data: {
                            etiqueta: val
                        }
                    };
                    form.getForm().loadRecord(record);
                    form.getForm().items.each(function (field) {
                        field.originalValue = field.getValue();
                    });
                    _this.TextAreaDenominacion.focus(true, 500);
                    _this.vAtributos.keymap.disable();
                    this.keymap.stopEvent = true;
                    this.keymap.enable();

                }, 'hide': function () {
                    this.keymap.disable();
                    _this.vAtributos.keymap.enable();
                }
            },
            keymap: new Ext.KeyMap(document, [{
                key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function () {
                    ventana.buttons[1].handler();
                }
            }, {
                key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function () {
                    ventana.buttons[0].handler();
                }
            }]),
            items: [form],
            buttons: [
                btnCancelar,
                btnAceptar
            ]
        });

        function habilitarbtnmodificar() {
            Ext.getCmp('idbtnWinmodificarAtrib').setDisabled(false);
        }

        function desabilitarbtnAdcionar() {
            Ext.getCmp('idbtnWinmodificarAtrib').setDisabled(true);
        }

//        var validador = new FormValidator({
//            buttons: [btnAceptar],
//            buttonsRegister: [btnCancelar],
//            fields: [_this.TextAreaDenominacion],
//            keyMapContainer: ventana
//        });
        ventana.show();
    },
    eliminar: function () {
        var _this = this;

        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                var loadMaskDelete = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.lbLoadMaskEliminando});
                loadMaskDelete.show();

                _this.preOperacion();

                Ext.Ajax.request({
                    url: _this.urlControladora + 'eliminarCampo',
                    params: {
                        idcampo: _this.getSelectionModel().getSelected().get('idcampo')
                    },
                    callback: function (options, success, response) {
                        loadMaskDelete.hide();
                        var rd = Ext.decode(response.responseText);
                        if (rd.success == true) {
                            mostrarMensaje(1, _this.idioma.lbMsgEliminarOk);

                            _this.getStore().load();

                            if (typeof (_this.postEliminar) == 'function') {
                                _this.postEliminar();
                            }

                        } else {
                            if (rd.enuso) {
                                mostrarMensaje(1, _this.idioma.lbEliminarCampoEnUso);
                            } else {
                                mostrarMensaje(1, _this.idioma.lbMsgEliminarError);
                            }
                        }
                    }
                });
            }

        }

        mostrarMensaje(2, _this.idioma.lbMsgConfEliminar, eliminar);
    },
//    initHotKeys: function() {
//        var _this = this;
//        document.onkeyup = function(e) {            
//                if (e.altKey) {
//                    if (e.which == Ext.EventObject.I) {
//                        if (!_this.treeNomDinamicos.vAtributos || (_this.treeNomDinamicos.vAtributos && !_this.treeNomDinamicos.vAtributos.isVisible())) {
//                            if (!Ext.getCmp('botonA1').disabled)
//                                Ext.getCmp('botonA1').handler();
//                        }
//                    }
//
//                    else if (e.which == Ext.EventObject.G) {
//                        if (!Ext.getCmp('botonG').disabled)
//                            Ext.getCmp('botonG').handler();
//                    }
//
//                    else if (e.which == Ext.EventObject.DELETE) {
//                       console.info("11111");
//                    }
//                }
//                if (e.which == Ext.EventObject.DELETE) {
//                    if (!Ext.getCmp('idbtnWinmodificarAtrib').disabled)
//                        console.info("2222");
//                }
//           
//        };
//    }
});