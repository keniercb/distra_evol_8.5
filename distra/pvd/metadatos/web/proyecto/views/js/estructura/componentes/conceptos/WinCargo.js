Ext.ns('Estructura');
Estructura.Cargo = Ext.extend(Ext.Window, {
    /**
     * Identificador del elemento a gestionar (1, 2, 5, 6)
     * */
    idconcepto: false, /**
     * Nodo padre del elemento para la recarga en caso de inserción
     * o el nodo a modificar en caso de modificacion
     * */
    nodo: null, /**
     * TreeLoader de la estructura que se gestiona
     * */
    loaderTreeEstructura: null, /**
     * Nombre del tipo de elemento para la label del tipo del mismo
     * */
    tipoElemento: null, /**
     * Identificador del proyecto al que pertenece
     * */
    proyecto: null, /**
     * Store del grid de proyecto para recargar el cambio en el proyecto
     * */
    storeProyecto: null, /**
     * Título de la ventana
     * */
    title: '', /**
     * Para conocer si se esta modificando o adicionando un nuevo elemento
     * */
    modificar: false, /**
     * Name del elemento para los identificadores de sus componentes
     * */
    name: null, /**
     * Etiquetas del sistema
     * */
    etiquetas: etiquetas.estructura, /**
     * Identificador de la escala salarial
     */
    escala: null, /**
     * Denominación de la escala salarial
     */
    tipoescala: null, /**
     * Mensaje de la acción de modificar e insertar
     */
    message: this.etiquetas.lbSaveCargo,
    idsector: null,

    sector: null,
    initComponent: function () {
        var _this = this;
        _this.cargosOcupados = 0;
        _this.rutaUrl = 'estructura';
        if (_this.proyecto) {
            _this.isGestionProyecto = true;
        }
        if (_this.isGestionProyecto) {
            _this.rutaUrl = 'proyecto';
        }
        /**
         * @cfg {String} url
         * Cambia la ruta para las peticiones de estructura en el panel
         */
        _this.urlReal = '/metadatos/' + _this.rutaUrl + '/index.php/' + _this.rutaUrl + '/';
        /**BOTON APLICAR DEL FORMULARIO*/
        _this.btnAplicar = new Ext.Button({
            text: _this.etiquetas.lbBtnAplicar,
            iconCls: 'aplicar',
            id: "btnAplicar",
            nextTab: "btnAceptar",
            prevTab: "btnCancelar",
            minWidth: 75,
            hidden: _this.modificar,
            tooltip: _this.etiquetas.lbtooltipaplicar,
            handler: function () {
                _this.enviar();
            }
        });
        _this.btnAceptar = new Ext.Button({
            text: _this.etiquetas.lbBtnAceptar,
            iconCls: 'aceptar',
            id: "btnAceptar",
            nextTab: 'denominacion_' + _this.name,
            prevTab: "btnAplicar",
            minWidth: 75,
            tooltip: _this.etiquetas.lbtooltipaceptar,
            handler: function () {
                _this.enviar(true);
            }
        });
        _this.esMilitar = false;
        if (_this.idconcepto == 10) {
            _this.esMilitar = true;
        }
        _this.stSalario = new Ext.data.Store({
            url: _this.urlReal + 'mostrarSalario',
            reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idsalario'}, {name: 'salario'}]),
            listeners: {
                load: function (store) {
                    if (store.data.length == 0) {
                        mostrarMensaje(6, 'No existen salarios asociados al cargo.');
                        _this.cbSalario.setValue('');
                        _this.hiddenIdSalario.setValue('');
                    }
                }
            }
        });
        _this.stPreparacion = new Ext.data.Store({
            url: _this.urlReal + 'mostrarPreparacion', autoLoad: true, reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idpreparacion'}, {name: 'denominacion'}])
        });
        _this.stGrado = new Ext.data.Store({
            url: _this.urlReal + 'mostrarGrado', reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idgrado'}, {name: 'icono'}, {name: 'denominacion'}])
        });
        _this.stCategoria = new Ext.data.GroupingStore({
            url: _this.urlReal + 'mostrarCategoria',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'datos'
            }, [{name: 'idcategocup'}, {name: 'idcategoria'}, {name: 'categoria'}, {name: 'denominacion'}]),
            sortInfo: {field: 'idcategoria', direction: "DESC"},
            groupField: 'categoria'
        });
        /**DENOMINACION DEL CARGO*/
        _this.denominacion = new Ext.form.TextField({
            fieldLabel: _this.etiquetas.lbdenominacion,
            name: 'denominacion',
            hiddenName: 'denominacion',
            id: 'denominacion_' + _this.name,
            prevTab: "btnAceptar",
            nextTab: "combotipoescala",
            maxLength: 100,
            allowBlank: false,
            anchor: '99%',
            vtype: 'vtdenominacionesCargo',
            listeners: {
                focus: function () {
                    _this.mostrarCargos();
                }
            }
        });
        _this.storeTipoEscala = new Ext.data.Store({
            url: _this.urlReal + 'mostrarTipoEscala', autoLoad: true, baseParams: {
                idconcepto: _this.idconcepto
            }, reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{
                name: 'idtipoescala'
            }, {
                name: 'denominacion'
            }])
        });
        /**TIPO DE ESCALA*/
        _this.escalaCombo = new Ext.form.ComboBox({
            id: 'combotipoescala',
            autoCreate: true,
            value: !_this.modificar ? _this.tipoescala : '',
            store: _this.storeTipoEscala,
            forceSelection: true,
            mode: 'local',
            nextTab: 'comboTipos' + _this.name,
            prevTab: 'denominacion_' + _this.name,
            disabled: false,
            anchor: '99%',
            enableQtip: true,
            allowBlank: true,
            fieldLabel: _this.etiquetas.lbTipoDe + 'escala',
            name: 'tipoescala',
            hiddenName: 'tipoescala',
            displayField: 'denominacion',
            valueField: 'denominacion',
            emptyText: _this.etiquetas.lbMsgSeleccione,
            triggerAction: 'all',
            handler: function () {
            },
            listeners: {
                select: function (combo, record) {
                    _this.escala = record.data.idtipoescala;
                    if (_this.denominacion.getValue()) {
                        _this.enabledSalario();
                        _this.cbSalario.setValue('');
                        _this.hiddenIdEscalaSalarial.setValue(record.data.idtipoescala);
                    } else {
                        mostrarMensaje(1, "Debe seleccionar un cargo para validar salario según grupo complejidad y escala salarial");
                    }
                }
            }
        })
        /**CONDICION DETERMINADO O INDETERMINADO DEL CARGO*/
        _this.temporal = new Ext.form.Checkbox({
            boxLabel: _this.etiquetas.lbTemporal,
            hideLabel: true,
            name: 'temporal',
            hiddenName: 'temporal',
            id: 'temporal_' + _this.name
        });

        /** ALIAS*/
        _this.alias = new Ext.form.TextField({
            fieldLabel: "Alias",
            name: 'alias',
            id: 'alias' + _this.name,
            anchor: '99%',
            allowBlank: true
        });

        /**CONDICION DIRECTO - INDIRECTO DEL CARGO*/
        _this.directo = new Ext.form.Checkbox({
            boxLabel: _this.etiquetas.lbIndirecto,
            hideLabel: true,
            name: 'directo',
            hiddenName: 'directo',
            id: 'directo_' + _this.name
        });
        /**ID GRUPO OCUPACIONAL*/
        _this.hiddenIdGrupoComplejidad = new Ext.form.Hidden({
            id: 'hiddenIdGrupoComplejidad_' + _this.name, name: 'idgrupocomplejidad'
        });
        /**ID DENOMINACION DEL CARGO*/
        _this.hiddenIdNomCargo = new Ext.form.Hidden({
            id: 'hiddenIdNomCargo_' + _this.name, name: 'idnomcargo'
        });
        /**ID DE ESCALA SALARIAL DEL CARGO*/
        _this.hiddenIdEscalaSalarial = new Ext.form.Hidden({
            name: 'idtipoescala', id: 'hiddenIdTipoEscala', value: _this.escala
        });
        /**SALARIO*/
        _this.hiddenIdSalario = new Ext.form.Hidden({
            id: 'hiddenIdSalario_' + _this.name, name: 'idsalario'
        });
        _this.cbSalario = new Ext.form.ccoe.ComboBox({
            id: 'combosalario_' + _this.name,
            autoCreate: true,
            disabled: true,
            store: _this.stSalario,
            forceSelection: true,
            enableQtip: true,
            allowBlank: false,
            nextTab: 'especialidad_preparacion' + _this.name,
            prevTab: 'comboTipos' + _this.name,
            maxLength: 50,
            fieldLabel: _this.etiquetas.lbsalario,
            mode: 'local',
            displayField: 'salario',
            valueField: 'idsalario',
            hiddenName: 'salario',
            name: 'salario',
            emptyText: _this.etiquetas.lbMsgSeleccione,
            triggerAction: 'all',
            listeners: {
                select: function (c, record) {
                    _this.hiddenIdSalario.setValue(record.data.idsalario);
                }
            }
        });
        /**CANTIDAD O CANTIDAD EN TIEMPO DE PAZ DEL CARGO*/
        _this.hiddenCantidadReal = new Ext.form.Hidden({
            id: 'hiddenCantidadReal' + _this.name, name: 'cantidad_real'
        });
        _this.nfCantidad = new Ext.form.NumberField({
            fieldLabel: _this.etiquetas.lbcantidad,
            allowDecimals: false,
            allowNegative: false,
            allowBlank: false,
            prevTab: 'especialidad_empleo' + _this.name,
            nextTab: "cbCategoria",
            maxLength: 19,
            vtype: 'vtnumeroReales',
            name: 'cantidad',
            hiddenName: 'cantidad',
            id: 'cantidad'
        });
        /**PREPARACION*/
        _this.hiddenIdPreparacion = new Ext.form.Hidden({
            id: 'hiddenIdPreparacion_' + _this.name, name: 'idpreparacion'
        });
        _this.cbPreparacion = new Ext.form.ccoe.ComboBox({
            id: 'cbPreparacion_' + _this.name,
            autoCreate: true,
            store: _this.stPreparacion,
            forceSelection: true,
            enableQtip: true,
            allowBlank: false,
            prevTab: 'especialidad_preparacion' + _this.name,
            nextTab: 'especialidad_empleo' + _this.name,
            maxLength: 100,
            mode: 'local',
            fieldLabel: _this.etiquetas.lbNivelEstudios,
            displayField: 'denominacion',
            valueField: 'denominacion',
            hiddenName: 'preparacion',
            name: 'preparacion',
            emptyText: _this.etiquetas.lbMsgSeleccione,
            triggerAction: 'all',
            handler: function () {
                this.store.removeAll();
                this.store.load();
                _this.hiddenIdPreparacion.setValue('');
            },
            listeners: {
                select: function (c, record) {
                    _this.hiddenIdPreparacion.setValue(record.data.idpreparacion);
                }
            }
        });
        /**ESPECIALIDAD DE PREPARACION*/
        _this.hiddenIdEspecialidadPreparacion = new Ext.form.Hidden({
            id: 'hiddenIdEspecialidad_preparacion' + _this.name, name: 'idespecialidad_preparacion'
        });
        _this.tfEspecialidadPreparacion = new Ext.form.TextField({
            fieldLabel: etiquetas.estructura.lbEspecialidadPreparacion,
            name: 'especialidad_preparacion',
            id: 'especialidad_preparacion' + _this.name,
            prevTab: 'combosalario_' + _this.name,
            nextTab: 'cbPreparacion_' + _this.name,
            vtype: 'vtdenomest',
            maxLength: 100,
            closable: true,
            emptyText: etiquetas.estructura.lbMsgSeleccione,
            allowBlank: false,
            listeners: {
                focus: function () {
                    var winEspecialidad = new Go.Int.Especialidad.Ventana({
                        componentForValue: _this.tfEspecialidadPreparacion,
                        componentForValueID: _this.hiddenIdEspecialidadPreparacion
                    });
                    winEspecialidad.show();
                }
            }
        });
        /**ESPECIALIDAD DE EMPLEO*/
        _this.hiddenIdEspecialidadEmpleo = new Ext.form.Hidden({
            id: 'hiddenIdEspecialidad_empleo' + _this.name, name: 'idespecialidad_empleo'
        });
        _this.tfEspecialidadEmpleo = new Ext.form.TextField({
            fieldLabel: etiquetas.estructura.lbEspecialidadEmpleo,
            name: 'especialidad_empleo',
            id: 'especialidad_pempleo' + _this.name,
            prevTab: 'cbPreparacion_' + _this.name,
            nextTab: 'cantidad',
            vtype: 'vtdenomest',
            maxLength: 100,
            closable: true,
            emptyText: etiquetas.estructura.lbMsgSeleccione,
            allowBlank: false,
            listeners: {
                focus: function () {
                    var winEspecialidad = new Go.Int.Especialidad.Ventana({
                        componentForValue: _this.tfEspecialidadEmpleo,
                        componentForValueID: _this.hiddenIdEspecialidadEmpleo
                    });
                    winEspecialidad.show();
                }
            }
        });
        /**GRADO MILITAR*/
        _this.hiddenIdGrado = new Ext.form.Hidden({
            id: 'hiddenIdGrado_' + _this.name, name: 'idgrado'
        });
        _this.cbGrado = new Nomenclador.ImagenCombo({
            forceSelection: true,
            enableQtip: true,
            fieldLabel: etiquetas.estructura.lbGradomilitar,
            name: 'grado',
            prevTab: 'cantidad',
            nextTab: 'btnCancelar',
            allowBlank: false,
            store: _this.stGrado,
            valueField: 'denominacion',
            handler: function () {
                this.store.removeAll();
                this.store.load();
            },
            listeners: {
                select: function (c, record) {
                    _this.hiddenIdGrado.setValue(record.data.idgrado);
                }
            }
        });
        /**CATEGORIA OCUPACIONAL*/
        _this.hiddenIdCategoriaOcupacional = new Ext.form.Hidden({
            id: 'hiddenIdCategoriaOcupacional_' + _this.name, name: 'idcategocup'
        });
        _this.cbCategoriaOcupacional = new Ext.form.GroupComboBox({
            fieldLabel: _this.etiquetas.lbcategoriaocup,
            mode: 'local',
            store: _this.stCategoria,
            typeAhead: false,
            name: 'categocup',
            id: "cbCategoria",
            prevTab: 'cantidad',
            nextTab: 'btnCancelar',
            triggerAction: 'all',
            displayField: 'denominacion',
            valueField: 'denominacion',
            allowBlank: false,
            triggerClass: 'x-combo-selected',
            loadingText: 'Cargando...',
            emptyText: etiquetas.estructura.lbMsgSeleccione,
            tpl: '<tpl for=".">' + '<div ext:qtip="<b>{categoria} | {denominacion}</b>" class="x-combo-list-item"> {denominacion}</div></tpl>',
            groupTextTpl: '{gvalue} ({[values.rs.length]} {[values.rs.length > 1 ? "Categorias" : "Categoria"]})',
            startCollapsed: false,
            handler: function () {
                this.store.removeAll();
                this.store.load();
            },
            listeners: {
                select: function (c, record) {
                    _this.hiddenIdCategoriaOcupacional.setValue(record.data.idcategocup);
                }
            }
        });
        _this.storeTipos = new Ext.data.SimpleStore({
            fields: ['idtipo', 'tipo'], data: [[1, 'Temporal'], [2, 'Indirecto']]
        })
        _this.comboTipos = new Ext.form.MultiComboSelect({
            id: 'comboTipos' + _this.name,
            fieldLabel: 'Tipo de cargo',
            name: 'tcargo',
            hideOnSelect: false,
            emptyText: "Seleccione...",
            anchor: '99%',
            nextTab: 'combosalario_' + _this.name,
            prevTab: 'combotipoescala',
            store: _this.storeTipos,
            triggerAction: 'all',
            valueField: 'idtipo',
            displayField: 'tipo',
            hiddenName: 'idtipo',
            mode: 'local',
            editable: false,
            allowBlank: true
        });

        /** DECISORIO*/
        _this.decisorio = new Ext.form.Checkbox({
            labelAlign: 'left',
            name: 'decisorio',
            fieldLabel: 'Decisorio'
        })
        /**CARGO FACULTADO*/
        _this.hiddenIdCargoFacultado = new Ext.form.Hidden({
            id: 'hiddenIdCargoFacultado' + _this.name,
            name: 'idfacultado'
        });
        _this.storeFacultado = new Ext.data.Store({
            id: 'idfacultadoStore',
            url: 'mostrarcargosfacultado',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "datos",
                id: "idfacultado"
            }, [
                {
                    name: 'idfacultado', mapping: 'idcargofacultado'
                },
                {
                    name: 'denominacion'
                },
            ])
        });
        _this.comboFacultado = {
            xtype: 'combo2',
            fieldLabel: etiquetas.estructura.lbfacultado,
            labelAlign: 'top',
            id: 'comboFacultado',
            anchor: '100%',
            autoCreate: true,
            store: _this.storeFacultado,
            forceSelection: true,
            mode: 'local',
            enableQtip: true,
            name: 'facultado',
            hiddenName: 'facultado',
            displayField: 'denominacion',
            valueField: 'denominacion',
            mode: 'local',
            emptyText: _this.etiquetas.lbMsgSeleccione,
            triggerAction: 'all',
            handler: function () {
                this.store.removeAll();
                this.store.load();
                Ext.getCmp('hiddenIdCargoFacultado' + _this.name).setValue('');
            },
            listeners: {
                select: function (combo, record) {
                    Ext.getCmp('hiddenIdCargoFacultado' + _this.name).setValue(record.data.idfacultado);
                }
            }
        };
        /**NIVEL CARGO*/
        _this.hiddenIdnivel = new Ext.form.Hidden({
            id: 'hiddenIdnivel' + _this.name,
            name: 'idnivelcargo'
        });
        _this.storeNivel = new Ext.data.Store({
            id: 'idNivel',
            url: 'mostrarnivelcargo',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "datos",
                id: "idnivelcargo"
            }, [
                {
                    name: 'idnivelcargo'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'abreviatura'
                }
            ])
        });
        _this.comboNivel = {
            xtype: 'combo2',
            anchor: '100%',
            fieldLabel: etiquetas.estructura.lbnivelCargo,
            id: 'comboNivel',
            labelAlign: 'top',
            autoCreate: true,
            store: _this.storeNivel,
            forceSelection: true,
            mode: 'local',
            enableQtip: true,
            name: 'nivelcargo',
            hiddenName: 'nivelcargo',
            displayField: 'denominacion',
            valueField: 'denominacion',
            mode: 'local',
            emptyText: _this.etiquetas.lbMsgSeleccione,
            triggerAction: 'all',
            handler: function () {
                this.store.removeAll();
                this.store.load();
                Ext.getCmp('hiddenIdnivel' + _this.name).setValue('');
            },
            listeners: {
                select: function (combo, record) {
                    Ext.getCmp('hiddenIdnivel' + _this.name).setValue(record.data.idnivelcargo);
                }
            }
        };

        /** PRINCIPAL*/
        _this.principal = new Ext.form.Checkbox({
            labelAlign: 'left',
            name: 'principal',
            fieldLabel: 'Especialista principal (EP)',
            id: 'principal',
            listeners: {
                check : function (_this,checked) {
                    if(checked){
                        Ext.getCmp('jefebrigada').disable();
                    }else{
                        Ext.getCmp('jefebrigada').enable();
                    }
                }
            }
        });

        _this.jefeBrigada = new Ext.form.Checkbox({
            labelAlign: 'left',
            name: 'jefebrigada',
            fieldLabel: 'Jefe Brigada (JB)',
            id: 'jefebrigada',
            listeners: {
                check : function (self,checked) {
                    if(checked){
                        _this.principal.disable();
                    }else{
                        _this.principal.enable();
                    }
                }
            }
        });

        _this.fieldSet = new Ext.form.FieldSet({
            title: 'Datos adicionales',
            anchor: '100%',
            collapsed: true,
            collapsible: true,
            autoHeight: true,
            items: [{
                layout: 'column',
                defaults: {
                    labelAlign: 'top',
                    bodyStyle: 'padding:5px 5px 0'
                },
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.comboNivel, _this.decisorio,_this.principal]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.comboFacultado, _this.hiddenIdCargoFacultado, _this.alias,_this.jefeBrigada]
                }]
            }]
        })


        _this.storeSector = new Ext.data.Store({
            id: 'idsectorEntidad',
            url: 'mostrarsector',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "datos",
                id: "idsector"
            }, [
                {
                    name: 'idsector'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'abreviatura'
                }
            ])
        });
        /**SECTOR*/
        _this.hiddenIdSector = new Ext.form.Hidden({
            id: 'hiddenIdSector' + _this.name,
            name: 'idsector',
            value: (!_this.modificar) ? _this.idsector : ''
        });




        /**
         * COLUMNAS DEL FORMULARIO*/
        /**COLUMNA IZQUIERDA*/
        _this.columnLeft = [_this.denominacion, _this.escalaCombo, _this.cbSalario, _this.cbPreparacion, _this.nfCantidad];
        /**COLUMNA DERECHA*/
        _this.columnRight = [
            {
                xtype: 'combo2',
                id: 'combosector',
                autoCreate: true,
                store: _this.storeSector,
                forceSelection: true,
                mode: 'local',
                enableQtip: true,
                allowBlank: false,
                fieldLabel: _this.etiquetas.lbsector,
                name: 'sector',
                hiddenName: 'sector',
                displayField: 'denominacion',
                valueField: 'denominacion',
                mode: 'local',
                emptyText: _this.etiquetas.lbMsgSeleccione,
                triggerAction: 'all',
                handler: function () {
                    this.store.removeAll();
                    this.store.load();
                    Ext.getCmp('hiddenIdSector' + _this.name).setValue('');
                },
                listeners: {
                    select: function (combo, record) {
                        Ext.getCmp('hiddenIdSector' + _this.name).setValue(record.data.idsector);
                    }
                }
            }, _this.comboTipos, _this.tfEspecialidadPreparacion, _this.tfEspecialidadEmpleo, _this.hiddenIdEscalaSalarial];
        /**SI ES MILITAR SE ADICIONA EL GRADO SINO LA CATEGORIA OCUPACIONAL*/
        if (_this.esMilitar) {
            _this.columnRight.push(_this.cbGrado);
            _this.stGrado.load();
        } else {
            _this.columnRight.push(_this.cbCategoriaOcupacional);
            _this.stCategoria.load();
        }
        _this.formulario = new Ext.form.FormPanel({
            border: false,
            //height          : 370,
            autoHeight: true,
            region: 'center',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            monitorValid: true,
            listeners: {
                'clientvalidation': function (form, valid) {
                    if (form.getForm().isDirty() && valid) {
                        _this.btnAplicar.enable();
                        _this.btnAceptar.enable();
                    } else {
                        _this.btnAplicar.disable();
                        _this.btnAceptar.disable();
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "datos", successProperty: "success"
            }, [{
                name: 'denominacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'cantidad_real'
            }, {
                name: 'idsalario'
            }, {
                name: 'salario'
            }, {
                name: 'temporal'
            }, {
                name: 'directo'
            }, {
                name: 'especialidad_preparacion'
            }, {
                name: 'idespecialidad_preparacion'
            }, {
                name: 'especialidad_empleo'
            }, {
                name: 'idespecialidad_empleo'
            }, {
                name: 'idpreparacion'
            }, {
                name: 'preparacion'
            }, {
                name: 'idnomcargo'
            }, {
                name: 'idgrado'
            }, {
                name: 'idgrupocomplejidad'
            }, {
                name: 'grado'
            }, {
                name: 'idcategocup'
            }, {
                name: 'categocup'
            }, {
                name: 'escala'
            }, {
                name: 'tipoescala'
            }, {
                name: 'tcargo'
            }, {
                name: 'sector'
            }, {
                name: 'idsector'
            }, {
                name: 'idfacultado'
            }, {
                name: 'facultado'
            }, {
                name: 'idcargofacultado'
            }, {
                name: 'idnivelcargo'
            }, {
                name: 'nivelcargo'
            }, {
                name: 'decisorio'
            },
                {
                    name: 'alias'
                }
                , {
                    name: 'principal'
                },
                 {
                    name: 'jefebrigada'
                }
            ]),
            closable: true,
            constrain: true,
            trackResetOnLoad: true,
            layout: 'form',
            labelAlign: 'top',
            items: [{
                layout: 'column', labelWidth: 40, labelAlign: 'top', items: [{
                    columnWidth: .5, layout: 'form', labelWidth: 40, labelAlign: 'top', defaults: {
                        anchor: '95%'
                    }, items: _this.columnLeft
                }, {
                    columnWidth: .5, layout: 'form', labelWidth: 40, labelAlign: 'top', defaults: {
                        anchor: '98%'
                    }, items: _this.columnRight
                }]
            }, _this.fieldSet,
                _this.hiddenIdNomCargo,
                _this.hiddenIdSector,
                _this.hiddenIdGrupoComplejidad,
                _this.hiddenIdSalario,
                _this.hiddenIdPreparacion,
                _this.hiddenIdEspecialidadPreparacion,
                _this.hiddenIdEspecialidadEmpleo, _this.hiddenIdnivel,
                _this.hiddenIdGrado,
                _this.hiddenIdCategoriaOcupacional]
        })
        Ext.apply(this, {
            width: 500,
            // height       : 500,
            autoHeight: true,
            layout: 'fit',
            autoValidate: false,
            modal: true,
            resizable: false,
            items: [_this.formulario],
            keys: [{
                key: Ext.EventObject.ENTER, fn: function () {
                    _this.btnAceptar.handler.call();
                }
            }, {
                key: Ext.EventObject.INSERT, fn: function () {
                    if (!_this.btnAplicar.hidden) {
                        _this.btnAplicar.handler.call();
                    }
                }
            }],
            buttons: [{
                text: _this.etiquetas.lbBtnCancelar,
                iconCls: 'cancelar',
                id: 'btnCancelar',
                prevTab: 'cbCategoria',
                nextTab: (_this.modificar) ? _this.btnAceptar.id : _this.btnAplicar.id,
                minWidth: 75,
                tooltip: _this.etiquetas.lbtooltipcancelar,
                handler: function () {
                    _this.destroy();
                }
            }, _this.btnAplicar, _this.btnAceptar]
        });
        if (_this.modificar) {
            _this.url = _this.urlReal + 'modificarCargo';
            _this.title = 'Modificar ' + _this.tipoElemento;
            _this.btnAplicar.hidden = true;
        } else {
            _this.title = 'Adicionar ' + _this.tipoElemento;
            _this.url = _this.urlReal + 'insertarCargo';
        }
        Estructura.Cargo.superclass.initComponent.apply(this);
        _this.addEvents('afterInsert');
    }, enabledSalario: function () {
        var _this = this;
        if (_this.stSalario.data.length > 0) {
            _this.stSalario.removeAll();
        }
        _this.stSalario.load({
            params: {
                escala: _this.escala,
                grupocomplejidad: Ext.getCmp('hiddenIdGrupoComplejidad_' + _this.name).getValue()
            }
        });
        _this.cbSalario.enable();
    }, mostrarCargos: function () {
        var _this = this;
        var win = new Win.Selection.Grid({
            listeners: {
                destroy: function () {
                    if (_this.denominacion.getValue() != '') {
                        _this.enabledSalario();
                    } else {
                        _this.cbSalario.disable();
                    }
                }
            },
            title: 'Cargos',
            name: 'cargo',
            fireOnSelect: true,
            foco: _this.escalaCombo,
            idComponenteForId: _this.hiddenIdNomCargo.id,
            idComponenteForText: _this.denominacion.id,
            idComponenteForIdGrupo: _this.hiddenIdGrupoComplejidad.id,
            store: new Ext.data.Store({
                url: _this.urlReal + 'mostrarCargos',
                baseParams: {
                    idescala: _this.escala,

                },
                reader: new Ext.data.JsonReader({
                    root: 'datos', totalProperty: 'cant'
                }, [{name: 'id'}, {name: 'idnomcargo'}, {name: 'idgrupocomplejidad'}, {name: 'grupocomplejidad'}, {name: 'idnormajuridica'}, {name: 'normajuridica'}, {name: 'idcondicion'}, {name: 'condicion'}, {name: 'denominacion'}, {name: 'abreviatura'}, {name: 'actual'}, {name: 'visible'}]),
                listeners: {
                    beforeload: function () {
                        Secodena.mostrarMascara('cargaini', '', _this.etiquetas.lbMsgporfavorespere)
                    }, load: function (store) {
                        store.filter('visible', 1);
                        Secodena.ocultarMascara('cargaini')
                    }
                }
            }),
            columns: [{
                dataIndex: 'grupocomplejidad',
                header: "Grupo de escala",
                sortable: true,
                align: 'center',
                width: Go.Column.Config.Width('dencategocup')
            }, {
                dataIndex: 'normajuridica',
                header: "Norma jurídica",
                sortable: true,
                align: 'center',
                width: Go.Column.Config.Width('dencategocup')
            }, {
                dataIndex: 'condicion',
                header: "Condición",
                sortable: true,
                align: 'center',
                renderer: Go.Column.Render.changeValorCondicion,
                width: Go.Column.Config.Width('actual')
            }, {
                id: 'denominacion',
                dataIndex: 'denominacion',
                header: "Denominación",
                sortable: true,
                width: Go.Column.Config.Width('denominacion')
            }, {
                dataIndex: 'abreviatura',
                header: 'Abreviatura',
                sortable: true,
                width: Go.Column.Config.Width('abreviatura')
            }]
        });
        win.show();
    }, enviar: function (destroy) {
        var _this = this;
        function enviarDatos() {
            Secodena.mostrarMascara('maskGuardar', '', _this.etiquetas.lbSaveCargo);
            _this.formulario.getForm().submit({
                url: _this.url, params: {
                    idnodo: _this.nodo.id
                    , idconcepto: 7
                    , proyecto: _this.proyecto
                    ,principal: (Ext.getCmp('principal').getValue()) ? 1 : 0
                    ,jefebrigada: (Ext.getCmp('jefebrigada').getValue()) ? 1 : 0
                }, failure: function (form, action) {
                    var codMsg = action.result.codMsg;
                    Secodena.ocultarMascara('maskGuardar');
                    if (codMsg != 6) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        _this.formulario.getForm().reset();
                        if (_this.storeProyecto) {
                            _this.storeProyecto.load({params: {start: 0, limit: 18}});
                        }
                        if (destroy) {
                            _this.destroy();
                        }
                    }
                    if (codMsg != 6 && codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        var node;
                        if (!_this.modificar) {
                            node = _this.nodo;
                            node.leaf = false;
                            if (node.isExpanded() || node.attributes.leaf == true) {
                                _this.loaderTreeEstructura.load(node);
                            }
                            node.expand();
                            _this.fireEvent('afterInsert', _this);
                        } else {
                            node = _this.nodo.parentNode;
                            _this.loaderTreeEstructura.load(node);
                            node.expand();
                        }
                    }
                }
            });
        }
        if (_this.formulario.getForm().isValid()) {
            if (_this.formulario.getForm().isDirty()) {
                if (_this.nfCantidad.getValue() < _this.cargosOcupados) {
                    mostrarMensaje(5,'La cantidad de cargos es menor que la cantidad de personas ocupándolos.' +
                        '¿Estás seguro que desea cambiarlo?',enviarDatos);
                }else{
                    enviarDatos();
                }
            } else {
                mostrarMensaje(6, _this.etiquetas.lbMsgNoModifico);
            }
        }
    }, loadDatos: function () {

        var _this = this;
        _this.formulario.getForm().load({
            url: _this.urlReal + 'cargarDatos', waitMsg: _this.etiquetas.lbload, params: {
                identificador: _this.nodo.id, idconcepto: 7, proyecto: _this.nodo.attributes.idproyecto
            }, success: function (action, response) {
                var formulario = _this.formulario.getForm();
                // formulario.setValues(formulario.getValues());
                var responseData = response.result.data;
                _this.cargosOcupados = responseData.cantidad_real;
                //console.log(responseData);
                /*if (responseData.cantidad_real != 0) {
                    // _this.nfCantidad.minValue = responseData.cantidad_real;
                    _this.nfCantidad.render();
                }*/
                if (responseData.tipoescala) {
                    _this.escalaCombo.setValue(responseData.tipoescala);
                    _this.escala = responseData.escala;
                    _this.hiddenIdEscalaSalarial.setValue(responseData.escala);
                }
                _this.comboTipos.setValue(responseData.tcargo);
                if (responseData.idsalario) {
                    _this.enabledSalario();
                } else {
                    mostrarMensaje(1, 'La escala del cargo ha sido modificada, deberá actualizar su clasificación y salario.')
                }
            }
        })
    }
})
