/**
 * Jorge Luis Cuellar Mondeja - 15/02/2012
 **/
Ext.ns('Ext.LOG');
Ext.LOG.gpDatosEspc = Ext.extend(Ext.grid.EditorGridPanel, {
    /**
     *  Esquema donde se gestionaran los atributos dinámicos (obligatorio)
     */
    schema: '',
    /**
     *  Dirección de la controladora del componente
     */
    urlController: '/configuracion/nomencladores/index.php/indicadoresatributosdinamicos/',
    /**
     *  Arreglo de etiquetas de la interfaz
     */
    idioma: '',
    /**
     *  Saber si se ha realizado algún cambio en la interfaz
     */
    cambioPropertyGrid: false,
    /**
     *  Saber si el componente será editable
     */
    editable: false,
    /**
     *  Condición que debe cuplir la búsqueda de los datos asociados a los atributos dinámicos del objeto seleccionado (string)
     *  Ej: ( idindicador = 1, idmovimiento > 3 ). Este string se utilizará para picarlo por la (,) para crear un arreglos de
     *  condiciones
     */
    ar_where: '',
    /**
     *
     */
    fecha: new Date(),
    /**
     *
     */
    data: [],
    /**
     *  Arreglo de llaves foranes con su valor para condicionar la búsqueda array({ key: 'idindicador', value: dataRecord.idindicador }, {})
     */
    llavesForaneas: [],
    /**
     *  Función encaragada de actualizar los parámetros necesarios para el trabajo con el componente
     */
    preOperacion: '',
    enableColumnMove: false,
    stripeRows: false,
    trackMouseOver: false,
    //clicksToEdit: 1,
    enableHdMenu: false,
    viewConfig: {
        forceFit: true
    },
    constructor: function(config) {

        var _this = this;
        _this._initComponent();

        Ext.LOG.gpDatosEspc.superclass.constructor.apply(this, arguments);
    },
    _initComponent: function() {

        var _this = this;
        this.LoadMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.lbLoadMaskCargando});

        this.initColumnModel();

        this.customEditors = this.customEditors || {};
        this.lastEditRow = null;
        var B = new Ext.grid.PropertyStore(this);
        this.propStore = B;
        var A = new Ext.grid.PropertyColumnModel(this, B);
       // B.store.sort("name", "ASC");
        this.addEvents("beforepropertychange", "propertychange");
        this.cm = A;
        this.ds = B.store;

        Ext.erp.PropertyGrid.superclass.initComponent.call(this);

       this.selModel.on("beforecellselect", function (E, D, C) {
         if (C === 0) {
         this.startEditing.defer(200, this, [D, 1]);
         return false
         }
         }, this);

        this.source = {};

        this.show();
    },
    initColumnModel: function() {

        var _this = this;

        Ext.extend(Ext.grid.PropertyColumnModel, Ext.grid.ColumnModel, {
            nameText: 'Atributos din&aacute;mico', //_this.idioma.lbPropiedad,
            valueText: 'Valor', //_this.idioma.lbValor,
            dateFormat: 'd/m/Y', //_this.idioma.lbDateFormat,
            renderDate: function(A) {
                return A.dateFormat(this.dateFormat);
            },
            renderBool: function(A) {
                return A ? _this.idioma.lbSi : _this.idioma.lbNo;
            },
           isCellEditable: function(A, B) {
                return A == 1
            },
            getRenderer: function(A) {
                return A == 1 ? this.renderCellDelegate : this.renderPropDelegate;
            },
            renderProp: function(A) {
                return this.getPropertyName(A);
            },
            renderCell: function(A) {
                var B = A;
                if (Ext.isDate(A)) {
                    B = this.renderDate(A);
                } else {
                    if (typeof A == "boolean") {
                        B = this.renderBool(A);
                    }
                }
                return Ext.util.Format.htmlEncode(B);
            },
            getPropertyName: function(B) {
                var A = this.grid.propertyNames;
                return A && A[B] ? A[B] : B;
            },
            getCellEditor: function(A, E) {

                var B = this.store.getProperty(E);
                var D = B.data["name"], C = B.data["value"];

                C = (C == _this.idioma.lbSi) ? true : C;
                C = (C == _this.idioma.lbNo) ? false : C;

                if (this.grid.customEditors[D]) {
                    var editor = this.grid.customEditors[D];

                    if (typeof(C) == 'boolean') {
                        editor.on({
                            'show': function() {
                                editor.setValue(C);
                            }
                        });
                    }

                    return editor;
                }
                if (Ext.isDate(C)) {
                    return this.editors["date"];
                } else {
                    if (typeof C == "number") {
                        return this.editors["number"];
                    } else {
                        if (typeof C == "boolean") {

                            return this.editors["boolean"];
                        } else {
                            return this.editors["string"];
                        }
                    }
                }
            }
        });
    },
    onRender: function() {
        Ext.grid.PropertyGrid.superclass.onRender.apply(this, arguments);
        this.getGridEl().addClass("x-props-grid");
    },
    afterRender: function() {
        Ext.grid.PropertyGrid.superclass.afterRender.apply(this, arguments);
        if (this.source) {
            this.setSource(this.source);
        }
    },
    setSource: function(A) {
        this.propStore.setSource(A);
    },
    getSource: function() {
        if (this.propStore)
            return this.propStore.getSource();

        return {};
    },
    /**
     *  Llenar el propertyGrid
     *  @param string arrIdesTablas String de idesTablasGenerales separado por coma Ej, "1,2,3,4"
     *  @param string ar_where String de condiciones para condicionar el resultado, separado por coma Ej, "idindicador = 1, idmovimiento > 3 "
     */
    setContenido: function(iddocumento, idoperacion) {
        var _this = this;
        var ArraySource = {};
        var ArrayCustomEditors = {};

        if (iddocumento && iddocumento.length > 0 && idoperacion && idoperacion.length > 0) {
            _this.LoadMask.show();
            Ext.Ajax.request({
                url: 'getdatosEspecificosDoc',
                method: 'POST',
                params: {
                    iddocumento: iddocumento,
                    idoperacion: idoperacion
                },
                callback: function(options, success, response) {

                    var rd = Ext.decode(response.responseText);
                    
                    if (rd.data.length != 0) {
                        for (var i = 0, length = rd.data.length; i < length; i++) {
                            var record = rd.data[i];

                            if (record.fieldLabel) {
                                _this.data[i] = {
                                    nombre: record.fieldLabel || record.hiddenName,
                                    idcampo: record.id,
                                    campo: record.name || record.hiddenName,
                                    idtabla: record.idtabla,
                                    xtype: record.xtype
                                };

                                var data = record.data;
                                var field = _this.getCmpfromData(record);

                                /**
                                 *  Caso especial de atributos dinámicos de tipo nomencladores
                                 */
                                if (record.xtype == 'combo') {

                                    var combo = field.field;
                                    var store = combo.store;

                                    var index = store.find(combo.initialConfig.hiddenName, data);
                                    if (index != -1)
                                        data = store.getAt(index).get(combo.initialConfig.displayField);
                                }

                                ArraySource[_this.data[i].nombre] = (record.data) ? (data) : '';
                                ArrayCustomEditors[_this.data[i].nombre] = field;
                            }
                        }

                        _this.customEditors = ArrayCustomEditors;
                        _this.setSource(ArraySource);
                        Ext.getCmp('idpaneldatosespesificosdoc').expand();
                    } else {
                        Ext.getCmp('idpaneldatosespesificosdoc').collapse();
                    }
                    _this.LoadMask.hide();
                }
            });
        } else {
            _this.setSource({});
        }
    },
    getCmpfromData: function(pTupla) {


        var _expresionReg = function _expresionReg(tupla) {

            if (pTupla['regex'] && pTupla['regex'] != "" && pTupla['regex'] != "//") {
                tupla['maskRe'] = Ext.decode(pTupla['regex']);
                tupla['regex'] = Ext.decode(pTupla['regex']);
            }
            return tupla;
        };

        var _adecuarStore = function _adecuarStore(tupla) {
            var str = tupla.store.replace("new Ext.data.JsonStore({", '');
            str = str.replace("})", '');

            var config = Ext.decode("{" + str + "}");

            var _data = Array();
            var _fields = Array();

            for (var i = 0; i < config.data.length; i++) {
                var _subData = Array();

                for (var key in config.data[i]) {
                    _subData.push(config.data[i][key]);
                }

                if (_subData.length > 0) {
                    _data.push(_subData.reverse());
                }

                _fields.push(config.fields[i]);
            }

            var store = new Ext.data.SimpleStore({
                fields: _fields,
                data: _data
            });

            return store;
        }

        var _adecuarCombo = function _adecuarCombo(tupla, _adecuarStore) {
            var store = _adecuarStore(tupla);

            var combo = new Ext.form.ComboBox({
                tpl: '<tpl for="."><div ext:qtip="{' + tupla.displayField + '}" class="x-combo-list-item">{' + tupla.displayField + '}</div></tpl>',
                hiddenName: tupla.valueField,
                valueField: tupla.displayField,
                displayField: tupla.displayField,
                id: tupla.id,
                name: tupla.hiddenName,
                fieldLabel: tupla.hiddenName,
                lazyRender: true,
                store: store,
                mode: 'local',
                typeAhead: true,
                triggerAction: 'all'
            });

            return combo;
        }

        var tupla = {};
        for (var item in pTupla) {
            if (item != 'xtype' && item != 'anchor' && item != 'fieldLabel' && item != 'regex') {
                tupla[item] = pTupla[item];
            }
        }

        /*if (! this.editable) {
         //var store = _adecuarStore(tupla);
         //var field = new Ext.grid.GridEditor(pTupla)
         //field.store = store;
         return new Ext.grid.GridEditor(pTupla);
         }*/

        function _getCmp(pTupla, tupla, _expresionReg, _adecuarCombo, _adecuarStore) {

            var date = new Date();
            var idcomponente = 'idcomp_' + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();

            tupla.enableKeyEvents = true;
            if (pTupla['maxLength']) {
                tupla.listeners = {
                    'keypress': function(t, e) {
                        // validarCantidadCaracteres(t, pTupla['maxLength'], e); //Jorge
                    }
                }
            }

            var componente;
            switch (pTupla.xtype) {
                case 'numberfield' :
                    componente = new Ext.form.NumberField(_expresionReg(tupla));
                    break;

                case 'textarea' :
                    componente = new Ext.form.TextArea(_expresionReg(tupla));
                    break;

                case 'combo' :

                    componente = _adecuarCombo(tupla, _adecuarStore);
                    break;

                case 'checkbox' :

                    componente = new Ext.form.Checkbox(tupla);
                    break;

                case 'datefield' :
                    componente = new Ext.form.DateField(tupla);
                    componente.format = 'd/m/Y';
                    break;

                default :
                    componente = new Ext.form.TextField(_expresionReg(tupla));
                    break;
            }

            componente.id = idcomponente;
            return componente;
        }

        return new Ext.grid.GridEditor(_getCmp(pTupla, tupla, _expresionReg, _adecuarCombo, _adecuarStore));
    }
});
