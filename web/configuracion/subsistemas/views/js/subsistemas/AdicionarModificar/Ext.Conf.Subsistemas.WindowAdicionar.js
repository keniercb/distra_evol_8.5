/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.Subsistemas.WindowAdicionar
 * @extends Ext.Window
 */
Ext.namespace('Ext.Conf.Subsistemas.WindowAdicionar');
Ext.Conf.Subsistemas.WindowAdicionar = Ext.extend(Ext.Window, {
//    Properties and Variables
    idioma: {},
    perfil: {},
    url: '',
    constrain:true,
    //Functions
    constructor: function(params) {

        params.title = (params.accion === 'adicionar') ? params.idioma.titlewindowaddsubsistema
                : params.idioma.titlewindowmodsubsistema;

        params.btnaccept = new Ext.Button({
            id: 'btnaccept' + params.id,
            text: params.idioma.textbtnAceptar,
            iconCls: 'aceptar',
            tooltip: params.idioma.tooltipbtnAceptar,
            disabled: true
        });

        params.btnaplicar = new Ext.Button({
            id: 'btnaplicar' + params.id,
            text: params.idioma.textbtnAplicar,
            iconCls: 'aplicar',
            tooltip: params.idioma.tooltipbtnAplicar,
            disabled: true
        });

        params.btncancelar = new Ext.Button({
            id: 'btncancelar' + params.id,
            text: params.idioma.textbtnCancelar,
            iconCls: 'cancelar',
            tooltip: params.idioma.tooltipbtnCancelar
        });

        params.firstElement = params.nfcodigosub = new Ext.form.NumberField({
            id: 'nfcodigosub' + params.id,
            allowBlank: false,
            allowDecimals: false,
            allowNegative: false,
            fieldLabel: params.idioma.lbnfcodigosub,
            anchor: '98%',
            enableKeyEvents: true,
            maxLength: 5,
            regex: /^[1-9][\d]*$/
        });

        /*params.nfprecedencia = new Ext.form.NumberField({
         id: 'nfprecedencia' + params.id,
         allowBlank: false,
         allowDecimals: false,
         allowNegative: false,
         fieldLabel: params.idioma.lbnfprecedencia,
         anchor: '98%',
         enableKeyEvents: true,
         maxLength: 2,
         regex: /^[1-9]?[0-9]$/
         });*/

        params.tfdenominacionsub = new Ext.form.TextField({
            id: 'tfdenominacion' + params.id,
            fieldLabel: params.idioma.lbtfdenominacionsub,
            anchor: '100%',
            allowBlank: false,
            enableKeyEvents: true,
            maxLength: 255,
            regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/,
            maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/
        });

        params.cbcierre = new Ext.form.ComboBox({
            id: 'cbcierre' + params.id,
            fieldLabel: params.idioma.lbcbcierre,
            anchor: '98%',
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            displayField: 'nombcierra',
            valueField: 'idcierra',
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: false,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idcierra', 'nombcierra', 'icono'],
                data: [
                    ['1', 'Cierra', 'icondistra-true verde'],
                    ['0', 'No cierra', 'icondistra-false rojo']
                ]
            }),
            lazyRender: true,
            tpl: '<tpl for="."><div class="x-combo-list-item"><span class="{icono}"/>{nombcierra}</div></tpl>'
        });

        params.cbestado = new Ext.form.ComboBox({
            id: 'cbestado' + params.id,
            fieldLabel: params.idioma.lbcbestado,
            anchor: '98%',
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            displayField: 'nombestado',
            valueField: 'idestado',
            triggerAction: 'all',
            enableKeyEvents: false,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'nombestado', 'icono'],
                data: [
                    ['1', 'Activo', 'icondistra-bandera verde'],
                    ['0', 'Inactivo', 'icondistra-bandera gris']
                ]
            }),
            lazyRender: true,
            tpl: '<tpl for="."><div class="x-combo-list-item"><span class="{icono}"/>{nombestado}</div></tpl>'
        });

        params.cbcontabiliza = new Ext.form.ComboBox({
            id: 'cbcontabiliza' + params.id,
            fieldLabel: params.idioma.lbcbcontabiliza,
            anchor: '100%',
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            displayField: 'nombcontabiliza',
            valueField: 'idcontabiliza',
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: false,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idcontabiliza', 'nombcontabiliza', 'icono'],
                data: [
                    ['1', 'Contabiliza', 'icondistra-registrogasto verde'],
                    ['0', 'No contabiliza', 'icondistra-registrogasto gris']
                ]
            }),
            lazyRender: true,
            tpl: '<tpl for="."><div class="x-combo-list-item"><span class="{icono}"/>{nombcontabiliza}</div></tpl>'
        });

        params.cbtreeUri = new Ext.form.ComboBox({
            id: 'cbtreeUri' + params.id,
            fieldLabel: params.idioma.lbcbtreeUri,
            anchor: '100%',
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: false,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: [],
                data: [[]]
            }),
            lazyRender: true,
            tpl: '<div id = \"rutafisica\" style = \"height:250px; !important;\"></div>'
        });

        params.tpDirectorios = new Ext.tree.TreePanel({
            id: 'tpDirectorios' + params.id,
            animate: true,
            autoScroll: true,
            height: 250,
            border: false,
            trackMouseOver: true,
            rootVisible: true,
            root: new Ext.tree.AsyncTreeNode({
                text: params.idioma.textraizArbolApp,
                id: '0',
                expanded: true
            }),
            loader: new Ext.tree.TreeLoader({
                url: params.url + 'cargardir'
            })
        });

        params.stPrecedencia = new Ext.data.Store({
            url: params.url + 'getSubsistemas',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idsubsistema"
            }, [{
                name: 'idsubsistema'
            }, {
                name: 'denominacion'
            }, {
                name: 'idestructurasubsist'
            }, {
                name: 'cierra'
            }
            ])
        });

        params.sm = new Ext.grid.CheckboxSelectionModel({singleSelect: false});

        params.gpPrecendencia = new Ext.grid.GridPanel({
            region: 'center',
            title:params.idioma.lbPrecedencia,
            autoExpandColumn: 'expandir',
            frame: false,
            border:false,
            viewConfig: {forceFit: true},
            store: params.stPrecedencia,
            sm: params.sm,
            stripeRows: true,
            floating: false,
            columns: [
                params.sm,{
                header: params.idioma.lbCodigo,
                width: 100,
                dataIndex: 'idsubsistema',
                sortable: true
            }, {
                header: params.idioma.lbDenominacion,
                width: 300,
                dataIndex: 'denominacion',
                sortable: true
            }]
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'window' + params.id,
            border: false,
            closeAction: 'close',
            layout: 'border',
            modal: true,
            resizable: false,
            height: 500,
            width: 450,
            keys: {
            },
            items: [
                {
                    region:'north',
                    frame: true,
                    layout: 'form',
                    height:160,
                    items: [
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .35,
                                    items: [{
                                            layout: 'form',
                                            labelAlign: 'top',
                                            items: [params.nfcodigosub]
                                        }]
                                },
                                /*{
                                    columnWidth: .20,
                                    items: [{
                                            layout: 'form',
                                            labelAlign: 'top',
                                            items: [params.nfprecedencia]
                                        }]
                                },*/
                                {
                                    columnWidth: .65,
                                    items: [{
                                            layout: 'form',
                                            labelAlign: 'top',
                                            items: [params.tfdenominacionsub]
                                        }]
                                }
                            ]
                        },
                        {
                            layout: 'form',
                            labelAlign: 'top',
                            items: [params.cbtreeUri]
                        },
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .33,
                                    items: [{
                                            layout: 'form',
                                            labelAlign: 'top',
                                            items: [params.cbcierre]
                                        }]
                                },
                                {
                                    columnWidth: .33,
                                    items: [{
                                            layout: 'form',
                                            labelAlign: 'top',
                                            items: [params.cbestado]
                                        }]
                                },
                                {
                                    columnWidth: .34,
                                    items: [{
                                            layout: 'form',
                                            labelAlign: 'top',
                                            items: [params.cbcontabiliza]
                                        }]
                                }
                            ]
                        }
                    ]
                },
                params.gpPrecendencia
            ]
        });

        //Condición para verificar si está modificando
        if (params.accion === 'modificar') {
            this.buttons = [params.btncancelar, params.btnaccept];

            //Llenar los valores de los campos para el modificar
            this.nfcodigosub.setValue(this.subSelected.idsubsistema);
            this.tfdenominacionsub.setValue(this.subSelected.denominacion);
            this.cbtreeUri.setValue(this.subSelected.uri);
            this.cbcierre.setValue(this.subSelected.cierra);
            this.cbestado.setValue(this.subSelected.idestado);
            this.cbcontabiliza.setValue(this.subSelected.contabiliza);
            this.nfcodigosub.readOnly = true;
        }
        else {//entonces esta adicionando
            this.buttons = [params.btncancelar, params.btnaplicar, params.btnaccept];
        }

        Ext.Conf.Subsistemas.WindowAdicionar.superclass.constructor.call(this);

        this.inicializarEventos(params.perfil, params.idioma);

        //Se almacenan los primeros valores de los campos del formulario para la validación
        //Almacenar el valor del campo código del subsistema
        this.oldvaluecodigo = this.nfcodigosub.getValue();
        //Almacenar el valor del campo precedencia
        /*this.oldvalueprecedencia = this.nfprecedencia.getValue();*/
        //Almacenar el valor del campo denominacion
        this.oldvaluedenominacion = this.tfdenominacionsub.getValue();
        //Almacenar el valor del campo uri
        this.oldvalueuri = this.cbtreeUri.getValue();
        //Almacenar el valor del campo cierre
        this.oldvaluecierre = this.cbcierre.getValue();
        //Almacenar el valor del campo estado
        this.oldvalueestado = this.cbestado.getValue();
        //Almacenar el valor del campo contabiliza
        this.oldvaluecontabiliza = this.cbcontabiliza.getValue();
        //*************************************************************************************

        this.show();
    },
    inicializarEventos: function(perfil, idioma) {

        this.btnaccept.on('click', function(button, e) {
            //El primer parámetro es para saber si acepta o aplica(true si acepta)
            this.addMod(true, idioma);
        }, this);


        this.btnaplicar.on('click', function(button, e) {
            this.addMod(false, idioma);
        }, this);


        this.btncancelar.on('click', function(button, e) {
            this.close();
        }, this);

        this.tpDirectorios.on('click', function(node, e) {
            if (!node.attributes.leaf && node.attributes.id !== '0') {
                this.cbtreeUri.setValue(node.attributes.rutanecesaria);
                this.cbtreeUri.collapse();
            }
            else {
                return false;
            }
        }, this);

        this.cbtreeUri.on({
            scope: this,
            expand: function(combo) {
                //Eventon que se llama cuando se expande el combo para cargar
                //el arbol de directorios
                if (!this.tpDirectorios.rendered) {
                    this.tpDirectorios.render('rutafisica');
                }
            },
            collapse: function() {
                this.validateForm();
            }
        });

        this.nfcodigosub.on({
            scope: this,
            keyup: function() {
                this.validateForm();
            }
        });

        this.stPrecedencia.on({
            scope:this,
            beforeload:function(store){
                store.baseParams.precedencia = 1;
                if(this.subSelected)
                store.baseParams.idestructurasubsist = this.subSelected.idestructurasubsist;
                this.gpMask.show();
            },
            load: function (store, records) {
                var precedencia = store.reader.jsonData.precedencia,
                    sm = this.sm;
                store.filterBy(function(record,id){
                    if (Ext.isEmpty(record.data.idestructurasubsist)
                        || record.data.idsubsistema == this.nfcodigosub.getValue()
                        || record.data.cierra == 0) {
                        return false;
                    }
                    return true;
                },this);
                if(precedencia){
                    //Se define esta variable para no habilitar los botones al incio
                    this.initSelect = true;
                    Ext.each(precedencia,function(item){
                        var record = store.getById(item.idprecedente);
                        if(record){
                            sm.selectRecords([record],true);
                        }
                    });
                    this.initSelect = false;
                }
                this.oldPrecedencia = Ext.encode(this.getPrecedencia());
                this.gpMask.hide();
            }
        });

        this.gpPrecendencia.on({
            scope: this,
            render: function (gp) {
                this.gpMask = new Ext.LoadMask(this.body,{
                    msg:this.idioma.lbMsgCargando
                });
                gp.getStore().load();
            }
        });

        this.sm.on({
            scope: this,
            selectionchange: function () {
                if (!this.initSelect) {
                    this.validateForm();
                }
            }
        });

        /*this.nfprecedencia.on({
            scope: this,
            keyup: function() {
                this.validateForm();
            }
        });*/

        this.tfdenominacionsub.on({
            scope: this,
            keyup: function() {
                this.validateForm();
            }
        });

        this.cbcierre.on({
            scope: this,
            collapse: function() {
                this.validateForm();
            }
        });

        this.cbestado.on({
            scope: this,
            collapse: function() {
                this.validateForm();
            }
        });

        this.cbcontabiliza.on({
            scope: this,
            collapse: function() {
                this.validateForm();
            }
        });
    },
    //Función necesaria para adicionar o modificar el subsistema
    addMod: function(aceptar, idioma) {
        var msgSalvando = (this.accion === 'modificar') ? idioma.msgModificando : idioma.msgAdicionando;
        Ext.MessageBox.wait(msgSalvando, idioma.msgEspere);
        this.tfdenominacionsub.setValue(this.tfdenominacionsub.getValue().trim());
        //Recuperar los datos del formulario
        var formdata = {
            codigo: this.nfcodigosub.getValue(),
            idestructurasubsist: (Ext.isEmpty(this.subSelected) || Ext.isEmpty(this.subSelected.idestructurasubsist)) ? ''
                    : this.subSelected.idestructurasubsist,
            precedencia: Ext.encode(this.getPrecedencia()),
            denominacion: this.tfdenominacionsub.getValue(),
            uri: this.cbtreeUri.getValue(),
            cierre: this.cbcierre.getValue(),
            estado: this.cbestado.getValue(),
            contabiliza: this.cbcontabiliza.getValue(),
            modifica: (this.accion === 'modificar') ? true : false
        };

        Ext.Ajax.request({
            scope: this,
            method: 'post',
            params: formdata,
            url: this.url + 'addmod',
            callback: function(options, success, response) {

                var response = Ext.decode(response.responseText);
                var arrErrores = response.errors;
                var arrSuccess = response.success;
                Ext.MessageBox.hide();

                this.mostrarMensajesAction(arrErrores, arrSuccess, idioma, aceptar);
            }
        });
    },
    //Función necesaria para validar el formulario
    validateForm: function() {
        //Se almacenan los últimos valores de los campos del formulario para la validación
        //y se crean variables para saber si tienen el mismo valor la nueva y vieja variable
        //Almacenar el valor del campo código del subsistema
        this.newvaluecodigo = this.nfcodigosub.getValue();
        var samevaluecodigo = (this.newvaluecodigo === this.oldvaluecodigo) ? true : false;
        //Almacenar el valor del campo precedencia
        /*this.newvalueprecedencia = this.nfprecedencia.getValue();
        var samevalueprecedencia = (this.newvalueprecedencia === this.oldvalueprecedencia) ? true : false;*/
        this.newPrecedencia = Ext.encode(this.getPrecedencia());
        var samevalueprecedencia = this.newPrecedencia === this.oldPrecedencia ? true : false;
        //Almacenar el valor del campo denominacion
        this.newvaluedenominacion = this.tfdenominacionsub.getValue();
        var samevaluedenominacion = (this.newvaluedenominacion === this.oldvaluedenominacion) ? true : false;
        //Almacenar el valor del campo uri
        this.newvalueuri = this.cbtreeUri.getValue();
        var samevalueuri = (this.newvalueuri === this.oldvalueuri) ? true : false;
        //Almacenar el valor del campo cierre
        this.newvaluecierre = this.cbcierre.getValue();
        var samevaluecierre = (this.newvaluecierre === this.oldvaluecierre) ? true : false;
        //Almacenar el valor del campo estado
        this.newvalueestado = this.cbestado.getValue();
        var samevalueestado = (this.newvalueestado === this.oldvalueestado) ? true : false;
        //Almacenar el valor del campo contabiliza
        this.newvaluecontabiliza = this.cbcontabiliza.getValue();
        var samevaluecontabiliza = (this.newvaluecontabiliza === this.oldvaluecontabiliza) ? true : false;
        //*************************************************************************************

        var fieldsValid = (this.nfcodigosub.isValid() /*&& this.nfprecedencia.isValid()*/ &&
                this.tfdenominacionsub.isValid() && this.cbtreeUri.isValid() && this.cbcierre.isValid() &&
                this.cbestado.isValid() && this.cbcontabiliza.isValid());

        var noSameValue = (!samevaluecodigo || !samevalueprecedencia || !samevaluedenominacion ||
                !samevalueuri || !samevaluecierre || !samevalueestado || !samevaluecontabiliza);

        var valid = fieldsValid && noSameValue;

        this.btnaccept.setDisabled(!valid);
        this.btnaplicar.setDisabled(!valid);
    },
    //Función necesaria para mostrar el mensaje de acción realizada satisfactoriamente
    //o para mostrar los errores
    mostrarMensajesAction: function(arrErrors, arrSuccess, idioma, aceptar) {
        var store = this.grid.getStore();
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});
        //No hubo errores
        if (arrErrors.length === 0) {
            var msgSuccess = (this.accion === 'modificar') ? idioma.msgModSuccess
                    : idioma.msgAddSuccess;
            mostrarMensaje(1, msgSuccess);

            myMask.show();

            //Si se cumple esta condición es porque está aceptando
            //Y se está adicionando
            if (aceptar && (this.accion === 'adicionar' || this.accion === 'modificar')) {
                this.close();
            }
            //Esto pasa cuando está aplicando
            //Y se está adicionando y no cuando modifica, pues en el modificar
            //no hay aplicar
            else if (!aceptar && this.accion === 'adicionar') {
                //Esto pasa cuando se aplica, se resetean los campos y no se
                //cierra la ventana, cuando se adiciona.
                this.nfcodigosub.reset();
                /*this.nfprecedencia.reset();*/
                this.tfdenominacionsub.reset();
                this.cbtreeUri.reset();
                this.cbcierre.reset();
                this.cbestado.reset();
                this.cbcontabiliza.reset();
                this.tpDirectorios.getSelectionModel().clearSelections();
                this.tpDirectorios.collapseAll();
                this.btnaccept.disable();
                this.btnaplicar.disable();
            }

            store.reload({
                callback: function() {
                    myMask.hide();
                }
            });
        }
        else {
            var textoMensajeError ='';
            // var textoMensajeError = (arrErrors.length === 1) ? idioma.msgErrorOne
            //         : idioma.msgErrorMany;
            // textoMensajeError += '</br></br>';
            console.log('Erroerrrr1')
            for (var i = 0, long = arrErrors.length; i < long; i++) {

                if (arrErrors[i].code === 1) {
                    /* Faltan datos para adicionar o modificar el subsistema */
                    var msgErrorCode12 = (this.accion === 'modificar') ? idioma.msgErrorCode1Mod
                            : idioma.msgErrorCode1Add;
                    textoMensajeError += msgErrorCode12;
                }
                else if (arrErrors[i].code === 2) {
                    //Existen las dos opciones
                    //O sea que ya existe el id del subsistema y la denominación del subsistema
                    var mensaje1 = idioma.msgErrorCode2.replace(/<#id>/g, arrErrors[i].idsubsistema);
                    var mensaje2 = mensaje1.replace(/<#denom>/g, arrErrors[i].denominacion);
                    textoMensajeError += mensaje2;
                }
                else if (arrErrors[i].code === 3) {
                    //Ya existe el id del subsistema
                    textoMensajeError += idioma.msgErrorCode3.replace(/<#id>/g, arrErrors[i].idsubsistema);
                }
                else if (arrErrors[i].code === 4) {
                    //Ya existe la denominación del subsistema
                    textoMensajeError += idioma.msgErrorCode4.replace(/<#denom>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 5) {
                    /* Ocurrió un error al insertar el subsistema X */
                    var msgErrorCode5 = (this.accion === 'modificar') ? idioma.msgErrorCode56Mod.replace(/<#>/g, arrErrors[i].denominacion)
                            : idioma.msgErrorCode56Add.replace(/<#>/g, arrErrors[i].denominacion);
                    textoMensajeError += msgErrorCode5;
                }
                else if (arrErrors[i].code === 6) {
                    /* Ocurrió un error al insertar la asociación de subsistema con la entidad */
                    /* Ocurrió un error al insertar el subsistema X */
                    var msgErrorCode6 = (this.accion === 'modificar') ? idioma.msgErrorCode56Mod.replace(/<#>/g, arrErrors[i].denominacion)
                            : idioma.msgErrorCode56Add.replace(/<#>/g, arrErrors[i].denominacion);
                    textoMensajeError += msgErrorCode6;
                }
            }
            /*
             * Acción necesaria para mostrar el mensaje de error.
             * Además recarga el store del grid en caso de que haya 
             * más de una acción satisfactoria.
             */
            mostrarMensaje(1, textoMensajeError, function() {
                if (arrSuccess.length > 0) {
                    myMask.show();
                    store.reload({
                        callback: function() {
                            myMask.hide();
                        }
                    });
                }
            });
        }
    },

    getPrecedencia: function(){
        var sm = this.gpPrecendencia.getSelectionModel(),
            selections = sm.getSelections(),
            result = new Array();
        Ext.each(selections,function(record){
            result.push(record.data);
        });
        return result;
    }
});




