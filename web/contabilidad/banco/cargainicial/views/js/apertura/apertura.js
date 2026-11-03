Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('gestionarapertura', cargarInterfaz);

//variables globales
var winConciliacionBancaria;
var idcuentabancaria, gridinsttransito;
var arraystdiferenciabanc, arraystinstdepositar, arraystinsttransito;
var windowopen = false; //Me dice si hay alguna ventana abierta no

function cargarInterfaz(perfil, etiquetas) {

    //Objeto para ejecutar una tarea
    //esto me sirve para validar el formulario en el modificar
    var runner = new Ext.util.TaskRunner();
    var tarea;

    function startTaskValidation(form, accion, arrbotones) {
        tarea = {
            run: function() {
                if (accion === 'add') {
                    if (form.isValid()) {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(false);
                        }
                    }
                    else {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(true);
                        }
                    }
                }
                else {
                    if (form.isValid() && form.isDirty()) {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(false);
                        }
                    }
                    else {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(true);
                        }
                    }
                }
            },
            interval: 300
        };

        runner.start(tarea);
    }

    function stopTaskValidation() {
        if (!Ext.isEmpty(tarea)) {
            runner.stop(tarea);
        }
    }

    //mensaje de mascara para la interfaz completa
    var lMask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiquetas.lbload
    });

    var globalKeyMap = new Ext.KeyMap(document);
    globalKeyMap.accessKey = function (key, handler, scope) {
        var h = function (n, e) {
            e.preventDefault();
            handler.call(scope || this, n, e);
        };
        this.on(key, h, scope);
    };


    //    Ext.Ajax.request({
    //        method: "POST",
    //        url: "loadTreeEspecialidad",
    //        callback: function(options, success, response) {
    //            responseData = Ext.decode(response.responseText);
    //            if (responseData)
    //                Ext.getCmp('gpEspecialidad').getStore().loadData(responseData/*.especialidades*/);
    //        }
    //    });

    /*******************************************************************************/
    //////////////////////      ANTIGUO JS CONCILIACIONBANCARIA.JS //////////////////
    /*******************************************************************************/

    //*******************variables************************
    var loadMask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando datos...'
    });
    var loadMaskSaldo = new Ext.LoadMask(Ext.getBody(), {
        msg: etiquetas.lbloadS
    });
    var lMaskSave = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Guardando datos...'
    });
    var lMaskPeriodo = new Ext.LoadMask(Ext.getBody(), {
        msg: etiquetas.lbloadP
    });

    var lMasktemp;

    function MostrarEtiquetas(componente, mensaje) {
        lMasktemp = new Ext.LoadMask(componente, {
            msg: mensaje
        });
        lMasktemp.show();
    }

    var tfsalactlibro = new Ext.form.TextField({
        style: 'text-align: right',
        fieldLabel: etiquetas.lbtextSaldoA,
        disabledClass: 'disabled-component',
        readOnly: true,
        name: 'tfsalactlibro',
        width: 140
    });
    var tfsalactbanco = new Ext.form.TextField({
        style: 'text-align: right',
        fieldLabel: etiquetas.lbtextSaldoA,
        disabledClass: 'disabled-component',
        readOnly: true,
        name: 'tfsalactbanco',
        width: 140
    });
    var tfcredlibro = new Ext.form.TextField({
        style: 'text-align: right',
        disabledClass: 'disabled-component',
        readOnly: true,
        name: 'tfcredlibro',
        width: 130
    });
    var tfcredbanco = new Ext.form.TextField({
        style: 'text-align: right',
        disabledClass: 'disabled-component',
        readOnly: true,
        name: 'tfcredbanco',
        width: 130
    });
    var tfdeblibro = new Ext.form.TextField({
        style: 'text-align: right',
        disabledClass: 'disabled-component',
        readOnly: true,
        name: 'tfdeblibro',
        width: 130
    });
    var tfdebbanco = new Ext.form.TextField({
        style: 'text-align: right',
        disabledClass: 'disabled-component',
        readOnly: true,
        name: 'tfdebbanco',
        width: 130
    });
    var tfsaldoajbanco = new Ext.form.TextField({
        style: 'text-align: right',
        disabledClass: 'disabled-component',
        fieldLabel: etiquetas.lbtextSaldoAj,
        readOnly: true,
        name: 'tfsaldoajbanco',
        width: 140
    });
    var tfsaldoajlibro = new Ext.form.TextField({
        style: 'text-align: right',
        disabledClass: 'disabled-component',
        fieldLabel: etiquetas.lbtextSaldoAj,
        readOnly: true,
        name: 'tfsaldajlibro',
        width: 140
    });
    var data, datasaldos, saldolibro, saldobanco, libro, bancotransito, bancodepositar, dblibro, datosconc, idviejos, grid, idbancouno, idbancodos,
        idlibrouno, idlibrodos, gridlibro, gridbanco,
        crlibro, dbbanco, crbanco, jsonlibrobanco, jsonsaldosact, idmoneda, datahistconc, histlibro, histbanco;
    var arrGrid = new Array();
    var winConciliacionBancaria;
    var modificar = false;
    var fechainicioperiodo = '0000-00-00';

// ************ variables de la ventana de conciliacion *************
    var cbxbeneficiario, stentregadoa, cbrecibidopor;

//para el uso de la especialidad
    var idespecialidad, oldvalue;
//*********        ComboCuenta         **********************
    var StcomboCuenta = new Ext.data.Store({
        id: 'StcomboCuenta',
        url: 'cargarcombocuentas',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'idcuenta'
        }, [{
            name: 'idcuenta',
            type: 'string'
        }, {
            name: 'nombre'
        }, {
            name: 'numero'
        }, {
            name: 'moneda'
        }, {
            name: 'codigoiso'
        }, {
            name: 'banco'
        }, {
            name: 'nombanco'
        }, {
            name: 'sucursal'
        }, {
            name: 'nomsucursal'
        }
        ]),
        listeners: {
            load: function (store, r, options) {
                if (acc == 'mod') {
                    comboCuenta.disable();
                } else {
                    comboCuenta.enable();
                }
            }
        }
    });

    var comboCuenta = new Ext.form.ComboBox({
        fieldLabel: etiquetas.lbtextC,
        id: 'comboCuenta',
        disabledClass: 'disabled-component',
        name: 'comboCuenta',
        tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        anchor: '100%',
        editable: true,
        selectOnFocus: true,
        //emptyText: etiquetas.lbEmptyMsg,
        triggerAction: 'all',
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n�meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n\xFAmeros.',*/
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        displayField: 'nombre',
        valueField: 'idcuenta',
        hiddenName: 'idcuenta',
        store: StcomboCuenta,
        mode: 'local',
        forceSelection: true,
        enableKeyEvents: true,
        //typeAhead: true,
        listeners: {
            keypress: function (t, e) {
                if (e.getKey() == 13) {
                    if (!comboCuenta.getValue()) {
                        comboCuenta.setValue(StcomboCuenta.getAt(0).get('idcuenta'));
                        comboCuenta.fireEvent('select', this.comboCuenta);
                    }

                }
            }
        }

    });

    var stEspecialidad = this.stEspecialidad = new Ext.data.Store({
        url: 'getcomboiframeespecialidad',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {name: 'idespecialidad'},
            {name: 'descripcionespecialidad', mapping: 'text'}
        ])
    });

    var cbEspecialidad = this.cbcuenta = new Ext.contabilidad.util.linkedCombo({
        id: 'cbEspecialidad',
        fieldLabel: etiquetas.lbtextEsp,
        store: stEspecialidad,
        displayField: 'descripcionespecialidad',
        valueField: 'idespecialidad',
        allowBlank: true,
        listHeight: 200,
        lazyRender: true,
        fnCreateNew: Ext.emptyFn,
        enableKeyEvents: true,
        tabIndex: 9,
        listeners: {
            keypress: function (tf, event) {
                if (event.getKey() == 13) {
                    tacomentario.focus(true, 100);
                }
            },
            select: function () {
                tacomentario.focus(true, 100);
            }
        }
    });


//DateField Fechaconciliacion
    var dfdateconc = new Ext.form.DateField({
        fieldLabel: etiquetas.lbCamFechaconc,
        readOnly: true,
        disabledClass: 'disabled-component',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        editable: false,
        name: 'dfdateconc',
        anchor: '100%',
        format: 'd/m/Y',
        enableKeyEvents: true,
        selectOnFocus: true,
        listeners: {
            keypress: function (tf, event) {
                if (event.getKey() == 13) {
                    var date = dfdateconc.minValue;
                    if (!dfdateconc.getValue()) {
                        dfdateconc.setValue(date);
                    }
                    comboCuenta.focus(false, 10);// darle foco  a  ESTE CAMPO

                }
            }
        }
    });

    function conciliacionqueguardar() {
        return (dfdateconc.getValue() && comboCuenta.getValue() && (stbancouno.getCount() || stbancodos.getCount() || stlibrouno.getCount() || stlibrodos.getCount()))
    }

// ************  RECORDS ********************
    var recbancouno = Ext.data.Record.create(
        {
            name: 'idinstrumentobancario',
            type: 'string'
        },
        {
            name: 'numerodocumento',
            type: 'int'
        },
        {
            name: 'fecharecepcion'
        },
        {
            name: 'importemo'
        },
        {
            name: 'importemb'
        },
        {
            name: 'denominacion',
            type: 'string'
        },
        {
            name: 'comentario',
            type: 'string'
        },
        {
            name: 'idtipodocumento',
            type: 'string'
        },
        {
            name: 'idbeneficiario',
            type: 'string'
        },
        {
            name: 'beneficiario',
            type: 'string'
        },
        {
            name: 'tipob'
        },
        {
            name: 'idrecibe',
            type: 'string'
        },
        {
            name: 'recibe',
            type: 'string'
        },
        {
            name: 'tipor'
        },
        {
            name: 'idsolicitud',
            type: 'string'
        },
        {
            name: 'idespecialidad'
        },
        {
            name: 'descripcionespecialidad'
        }
    );

    var stbancouno = new Ext.data.JsonStore({
        id: 'stbancouno',
        fields: recbancouno
    });

    var smbancouno = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowdeselect: function (sm, rowIndex, r) {
                btnMbancouno.setDisabled(true);
                btnCbancouno.setDisabled(true);
            },
            rowselect: function (sm, rowIndex, r) {
                btnMbancouno.setDisabled(false);
                btnCbancouno.setDisabled(false);
            }

        }


    });


    var recbancodos = Ext.data.Record.create(
        {
            name: 'idinstrumentobancario',
            type: 'string'
        },
        {
            name: 'numerodocumento',
            type: 'int'
        },
        {
            name: 'fecharecepcion'
        },
        {
            name: 'importemo'
        },
        {
            name: 'importemb'
        },
        {
            name: 'denominacion',
            type: 'string'
        },
        {
            name: 'comentario',
            type: 'string'
        },
        {
            name: 'idtipodocumento',
            type: 'string'
        },
        {
            name: 'idbeneficiario',
            type: 'string'
        },
        {
            name: 'beneficiario',
            type: 'string'
        },
        {
            name: 'tipob'
        },
        {
            name: 'idrecibe',
            type: 'string'
        },
        {
            name: 'recibe',
            type: 'string'
        },
        {
            name: 'tipor'
        },
        {
            name: 'idsolicitud',
            type: 'string'
        },
        {
            name: 'idespecialidad'
        },
        {
            name: 'descripcionespecialidad'
        }
    );

    var stbancodos = new Ext.data.JsonStore({
        id: 'stbancodos',
        fields: recbancodos
    });

    var smbancodos = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowdeselect: function (sm, rowIndex, r) {
                btnMbancodos.setDisabled(true);
                btnCbancodos.setDisabled(true);
            },
            rowselect: function (sm, rowIndex, r) {
                btnMbancodos.setDisabled(false);
                btnCbancodos.setDisabled(false);
            }
        }

    });


//********          Record Reclibro     *********
    var reclibro = Ext.data.Record.create([
        'iddiferencia',
        'nroestado',
        'diferenciamo'
    ]);


//******************* Grid Derecha Arriba ******************
    var btnAbancouno = new Ext.Button({
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        tooltip: etiquetas.lbTitleAddInsD,
        handler: function () {
            aplicarmodinst.show();

            if (comboCuenta.getValue()) {
                modificar = false;
                //fpInstTrans.getForm().reset();
                cleanForm(true);
                gridbanco = 1;
                if (sttipoinstrumento.getCount()) {
                    winInstTrans.setTitle(etiquetas.lbTitleAddInsD);
                    winInstTrans.show();
                    cbxtipoinstrumento.focus(false, 100);//(darle el foco a este combo);
                }
                else
                    mostrarMensaje(1, etiquetas.lbMsgSinDocC);
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }

    });
    var btnCbancouno = new Ext.Button({
//        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        tooltip: etiquetas.lbTitleElimInsD,
        disabled: true,
        handler: function () {
            if (comboCuenta.getValue()) {
                if (stbancouno.getCount()) // no hay elementos
                {
                    if (smbancouno.getCount() == 0) {
                        mostrarMensaje(1, etiquetas.lbMsgSinElemElim);
                        //mostrarMensaje(1,'Debe seleccionar el elemento para ser eliminado.');
                    } else {
                        var records = smbancouno.getSelections();
                        stbancouno.remove(records[0]);
                        CalcularSaldos();
                        if (!stbancouno.getCount()) {
                            btnMbancouno.setDisabled(true);
                            btnCbancouno.setDisabled(true);
                        }
                    }
                }
                else {
                    //mostrarMensaje(1,'No hay elementos a eliminar.');
                    btnMbancouno.setDisabled(true);
                    btnCbancouno.setDisabled(true);
                }
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }
    });
    var btnMbancouno = new Ext.Toolbar.Button({
//        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        disabled: true,
        tooltip: etiquetas.lbTitleModInsD,
        handler: function () {
            aplicarmodinst.hide();
            cargamodInstrumDepositar();
        }
    });

    function cargamodInstrumDepositar() {
        if (comboCuenta.getValue()) {
            if (stbancouno.getCount()) // no hay elementos
            {
                if (smbancouno.getCount() == 0) // Si no ha seleccionado ninguno
                {
                    //mostrarMensaje(1, 'Debe seleccionar el elemento para ser modificado.');
                    mostrarMensaje(1, etiquetas.lbMsgSinElemMod);
                    return;
                }
                if (sttipoinstrumento.getCount() == 0) {
                    mostrarMensaje(1, etiquetas.lbMsgSinDocCMod);
                    return;
                }
                modificar = true;
                //fpInstTrans.getForm().reset();
                cleanForm(true);
                gridbanco = 1;
                winInstTrans.setTitle(etiquetas.lbTitleModInsD);

                winInstTrans.show();
                var importemo = smbancouno.getSelected().get('importemo');
                var importemb = smbancouno.getSelected().get('importemb');
                var importeletras = convertir_a_letras(importemo);
                var importeletrascont = convertir_a_letras(importemb);

                var objModInstDepositar = {
                    idinstrumentobancario: smbancouno.getSelected().get('idinstrumentobancario'),
                    cbxtipoinstrumento: smbancouno.getSelected().get('idtipodocumento'),
                    nroinstrumento: smbancouno.getSelected().get('numerodocumento'),
                    nrosolicitud: smbancouno.getSelected().get('idsolicitud'),
                    fecharecepcion: smbancouno.getSelected().get('fecharecepcion'),
                    tfimporteinst: saldo(smbancouno.getSelected().get('importemo')),
                    tfimporteinstcont: saldo(smbancouno.getSelected().get('importemb')),
                    importeletras: importeletras,
                    importeletrascont: importeletrascont,
                    comentarioinstxdepositar: smbancouno.getSelected().get('comentario'),
                    cbEspecialidad: smbancouno.getSelected().get('idespecialidad'),
                    cbxbeneficiario: smbancouno.getSelected().get('idbeneficiario'),
                    cbxtipobeneficiario: smbancouno.getSelected().get('tipob'),
                    cbrecibidopor: smbancouno.getSelected().get('idrecibe'),
                    cbxtiporecibidopor: smbancouno.getSelected().get('tipor')
                };
                fpInstTrans.getForm().setValues(objModInstDepositar);

                //Este componente se deja porque sino no setea la especialidad
                cbEspecialidad.setValue(smbancouno.getSelected().get('idespecialidad'), smbancouno.getSelected().get('descripcionespecialidad'));
                idespecialidad = '';
                idespecialidad = smbancouno.getSelected().get('idespecialidad');
                oldvalue = idespecialidad;//se almacena el valor viejo de la especialidad para comparar si se modifico
                cbxbeneficiario.setRawValue(smbancouno.getSelected().get('beneficiario'));
                //cbrecibidopor.setRawValue(smbancouno.getSelected().get('recibe'));
                if (!stbancouno.getCount()) {
                    btnMbancouno.setDisabled(true);
                    btnCbancouno.setDisabled(true);
                }
            }
            else {
                //mostrarMensaje(1,'No hay elementos a modificar.');
                btnMbancouno.setDisabled(true);
                btnCbancouno.setDisabled(true);
            }

        }
        else
            mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
    }


    var grdbancouno = new Ext.grid.GridPanel({
        store: stbancouno,
        region: 'north',
        tbar: [btnAbancouno, btnMbancouno, btnCbancouno, etiquetas.lbinstpordep, '->', etiquetas.lbtextDenLibro, tfdeblibro],
        frame: true,
        rowHeight: .50,
        loadMask: true,
        autoExpandColumn: 'comentario',
        sm: smbancouno,
        disableSelection: true,
        style: 'margin:5 0 5 0',
        columns: [
            {
                id: 'numerodocumento',
                header: etiquetas.lbCamNodoc,
                width: 95,
                sortable: true,
                dataIndex: 'numerodocumento'
            },
            {
                id: 'denominacion',
                header: etiquetas.lbtextTipodoc,
                width: 200,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: 'Acreedor/Deudor',
                width: 200,
                sortable: true,
                dataIndex: 'beneficiario'
            }, {
                id: 'comentario',
                header: 'Comentario',
                width: 200,
                sortable: true,
                dataIndex: 'comentario'
            }/*, {
                id: 'especialidad',
                header: etiquetas.lbtextEsp,
                sortable: true,
                dataIndex: 'descripcionespecialidad'
            }*/,
            {
                header: etiquetas.lbCamFecha,
                width: 80,
                sortable: true,
                dataIndex: 'fecharecepcion',
                align: 'center'
            },
            {
                id: 'importemo',
                header: etiquetas.lbCamImporte,
                width: 100,
                sortable: true,
                align: 'right',
                renderer: saldo,
                dataIndex: 'importemo'
            }
        ],
        listeners: {
            rowclick: function (sm, indiceFila, record) {
                idbancouno = indiceFila;
            },
            rowdblclick: function (t, rowIndex, e) {
                cargamodInstrumDepositar();
            }
        }
    });


//****************** Grid Derecho Abajo *********************
    var btnAbancodos = new Ext.Button({
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        tooltip: etiquetas.lbTitleAddInsT,
        handler: function () {
            aplicarmodinst.show();
            if (comboCuenta.getValue()) {
                modificar = false;
                //fpInstTrans.getForm().reset();
                cleanForm(true);
                gridbanco = 2;
                if (sttipoinstrumento.getCount()) {
                    winInstTrans.setTitle(etiquetas.lbTitleAddInsT);
                    winInstTrans.show();
                    cbxtipoinstrumento.focus(false, 100);//(darle el foco a este combo);
                }
                else
                    mostrarMensaje(1, etiquetas.lbMsgSinDocC);
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }
    });
    var btnCbancodos = new Ext.Button({
//        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        tooltip: etiquetas.lbTitleElimInsT,
        disabled: true,
        handler: function () {
            if (comboCuenta.getValue()) {
                if (stbancodos.getCount()) {  // si no hay elementos
                    if (smbancodos.getCount() == 0) {
                        // mostrarMensaje(1, 'Debe seleccionar el elemento para ser eliminado.');
                        mostrarMensaje(1, etiquetas.lbMsgSinElemElim);
                    } else {
                        var records = smbancodos.getSelections();
                        stbancodos.remove(records[0]);
                        CalcularSaldos();
                        if (!stbancodos.getCount()) {
                            btnMbancodos.setDisabled(true);
                            btnCbancodos.setDisabled(true);
                        }
                    }
                } else {
                    // mostrarMensaje(1,'No hay elementos a eliminar.');
                    btnMbancodos.setDisabled(true);
                    btnCbancodos.setDisabled(true);
                }
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }
    });
    var btnMbancodos = new Ext.Toolbar.Button({
//        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        disabled: true,
        tooltip: etiquetas.lbTitleModInsT,
        handler: function () {
            aplicarmodinst.hide();
            cargamodInstrumTransito();
        }
    });

    function cargamodInstrumTransito() {
        if (comboCuenta.getValue()) {
            if (stbancodos.getCount()) {  // si no hay elementos
                if (smbancodos.getCount() == 0)  // si no ha seleccionado
                {
                    //mostrarMensaje(1, 'Debe seleccionar el elemento para ser modificado.');
                    mostrarMensaje(1, etiquetas.lbMsgSinElemMod);
                    return;
                }
                if (sttipoinstrumento.getCount() == 0) {
                    mostrarMensaje(1, etiquetas.lbMsgSinDocCMod);
                    return;
                }
                modificar = true;
                //fpInstTrans.getForm().reset();
                cleanForm(true);
                winInstTrans.setTitle(etiquetas.lbTitleModInsT);
                winInstTrans.show();

                var importemo = smbancodos.getSelected().get('importemo');
                var importemb = smbancodos.getSelected().get('importemb');
                var importeletras = convertir_a_letras(importemo);
                var importeletrascont = convertir_a_letras(importemb);

                var objModInstTransito = {
                    idinstrumentobancario: smbancodos.getSelected().get('idinstrumentobancario'),
                    cbxtipoinstrumento: smbancodos.getSelected().get('idtipodocumento'),
                    nroinstrumento: smbancodos.getSelected().get('numerodocumento'),
                    nrosolicitud: smbancodos.getSelected().get('idsolicitud'),
                    fecharecepcion: smbancodos.getSelected().get('fecharecepcion'),
                    tfimporteinst: saldo(smbancodos.getSelected().get('importemo')),
                    tfimporteinstcont: smbancodos.getSelected().get('importemb'),
                    importeletras: importeletras,
                    importeletrascont: importeletrascont,
                    comentarioinstxdepositar: smbancodos.getSelected().get('comentario'),
                    cbEspecialidad: smbancodos.getSelected().get('idespecialidad'),
                    cbxbeneficiario: smbancodos.getSelected().get('idbeneficiario'),
                    cbxtipobeneficiario: smbancodos.getSelected().get('tipob'),
                    cbrecibidopor: smbancodos.getSelected().get('idrecibe'),
                    cbxtiporecibidopor: smbancodos.getSelected().get('tipor')
                };
                fpInstTrans.getForm().setValues(objModInstTransito);

                //Este componente se queda porque sino no se setea la descripcion de la especialidad
                cbEspecialidad.setValue(smbancodos.getSelected().get('idespecialidad'), smbancodos.getSelected().get('descripcionespecialidad'));
                idespecialidad = '';
                idespecialidad = smbancodos.getSelected().get('idespecialidad');
                oldvalue = idespecialidad;//se almacena el valor viejo de la especialidad para comparar si se modifico
                cbxbeneficiario.setRawValue(smbancodos.getSelected().get('beneficiario'));
                // cbrecibidopor.setRawValue(smbancodos.getSelected().get('recibe'));
                gridbanco = 2;
                if (!stbancodos.getCount()) {
                    btnMbancodos.setDisabled(true);
                    btnCbancodos.setDisabled(true);
                }
            } else {
                //mostrarMensaje(1,'No hay elementos a modificar.');
                btnMbancodos.setDisabled(true);
                btnCbancodos.setDisabled(true);
            }
        }
        else
            mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
    }

    var grdbancodos = new Ext.grid.GridPanel({
        store: stbancodos,
        region: 'center',
        tbar: [btnAbancodos, btnMbancodos, btnCbancodos, etiquetas.lbinstentran, '->', etiquetas.lbtextCenLibro, tfcredlibro],
        frame: true,
        //height:190,
        rowHeight: .50,
        //width:535,
        //autoWidth:true,
        autoExpandColumn: 'comentario',
        loadMask: true,
        disableSelection: true,
        sm: smbancodos,
        style: 'margin:5 0 5 0',
        columns: [
            {
                header: etiquetas.lbCamNodoc,
                width: 95,
                sortable: true,
                dataIndex: 'numerodocumento'
            },
            {
                id: 'denominacion',
                header: etiquetas.lbtextTipodoc,
                width: 200,
                sortable: true,
                dataIndex: 'denominacion'
            },{
                header: 'Acreedor/Deudor',
                width: 200,
                sortable: true,
                dataIndex: 'beneficiario'
            }, {
                id: 'comentario',
                header: 'Comentario',
                width: 200,
                sortable: true,
                dataIndex: 'comentario'
            }/*, {
                id: 'especialidad',
                header: etiquetas.lbtextEsp,
                sortable: true,
                dataIndex: 'descripcionespecialidad'
            }*/,
            {
                header: etiquetas.lbCamFecha,
                width: 80,
                sortable: true,
                dataIndex: 'fecharecepcion',
                align: 'center'
            },
            {
                header: etiquetas.lbCamImporte,
                width: 100,
                sortable: true,
                align: 'right',
                renderer: saldo,
                dataIndex: 'importemo'
            }
        ],
        listeners: {
            rowclick: function (sm, indiceFila, record) {
                idbancodos = indiceFila;
            },
            rowdblclick: function (t, rowIndex, e) {
                cargamodInstrumTransito();
            }
        }
    });


//****************  Grid Izquierdo Arriba *****************
    var btnAlibrouno = new Ext.Button({
        tooltip: etiquetas.lbTitleAddCred,
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        handler: function () {
            if (comboCuenta.getValue()) {
                modificar = false;
                fpdebitocred.getForm().reset();
                tfnroestadocuenta.setValue('');
                tfdiferencia.setValue('');
                tfdiferenciacontable.setValue('');
                tacomentario.setValue('');
                tfcuentabancaria.setValue(comboCuenta.getRawValue());
                // fpdebitocred.getForm().clearInvalid();
                gridlibro = 1;
                winDebitoCred.setTitle(etiquetas.lbTitleAddCred);
                winDebitoCred.show();
                Ext.getCmp('winDebitoCredAplicar').show();
                tfnroestadocuenta.focus(false, 100);
                // fpdebitocred.getForm().clearInvalid();
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }
    });
    var btnClibrouno = new Ext.Button({
        tooltip: etiquetas.lbTitleElimCred,
//        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            if (comboCuenta.getValue()) {
                if (stlibrouno.getCount()) {  // si no hay elementos
                    if (smlibrouno.getCount() == 0) {
                        mostrarMensaje(1, etiquetas.lbMsgSinElemElim);
                    } else {
                        var records = smlibrouno.getSelections();
                        stlibrouno.remove(records[0]);
                        CalcularSaldos();
                    }
                    if (!stlibrouno.getCount()) {
                        btnMlibrouno.setDisabled(true);
                        btnClibrouno.setDisabled(true);
                    }
                } else {
                    // mostrarMensaje(1,'No hay elementos a eliminar.');
                    btnMlibrouno.setDisabled(true);
                    btnClibrouno.setDisabled(true);
                }
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }
    });
    var btnMlibrouno = new Ext.Toolbar.Button({
//        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        disabled: true,
        tooltip: etiquetas.lbTitleModCred,
        handler: function () {
            cargamodDiferenciacredito();
        }
    });

    var reclibrouno = Ext.data.Record.create([
        {
            name: 'nroestado',
            type: 'string'
        },
        {
            name: 'iddiferencia',
            type: 'string'
        },
        {
            name: 'diferenciamo',
            type: 'string'
        },
        {
            name: 'diferenciamocontable',
            type: 'string'
        },
        {
            name: 'comentario',
            type: 'string'
        }
    ]);

    var stlibrouno = new Ext.data.Store({
        reader: new Ext.data.ArrayReader({
            id: "iddiferencia"
        }, reclibrouno)
    });
    var smlibrouno = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowdeselect: function (sm, rowIndex, r) {
                btnMlibrouno.setDisabled(true);
                btnClibrouno.setDisabled(true);
            },
            rowselect: function (sm, rowIndex, r) {
                btnMlibrouno.setDisabled(false);
                btnClibrouno.setDisabled(false);
            }
        }
    });


    var grdlibrouno = new Ext.grid.GridPanel({
        store: stlibrouno,
        tbar: [btnAlibrouno, btnMlibrouno, btnClibrouno, etiquetas.lbdifcred, '->', etiquetas.lbtextCenBanco, tfcredbanco],
        frame: true,
        //height:185,
        rowHeight: .50,
        //autoWidth:true,
        //width:320,
        loadMask: true,
        sm: smlibrouno,
        disableSelection: true,
        //autoScroll: true,
        style: 'margin:5 0 5 0',
        columns: [
            {
                header: etiquetas.lbCamNoestadocta,
                width: 115,
                sortable: true,
                dataIndex: 'nroestado'
            },
            {
                id: 'comentario',
                header: etiquetas.lbtextComentario,
                width: 95,
                sortable: true,
                dataIndex: 'comentario'
            },
            {
                id: 'dif',
                header: etiquetas.lbCamDiferencia,
                width: 100,
                align: 'right',
                sortable: true,
                renderer: saldo,
                dataIndex: 'diferenciamo'
            }
        ],
        autoExpandColumn: 'comentario',
        listeners: {
            rowclick: function (sm, indiceFila, record) {
                idlibrouno = indiceFila;
            },
            rowdblclick: function (t, rowIndex, e) {
                cargamodDiferenciacredito();
            }
        }
    });

    function cargamodDiferenciacredito() {
        if (comboCuenta.getValue()) {
            if (stlibrouno.getCount()) {  // si no hay elementos
                if (smlibrouno.getCount()) {
                    modificar = true;
                    fpdebitocred.getForm().reset();

                    var objModDiferenciacredito = {
                        tfcuentabancaria: comboCuenta.getRawValue(),
                        iddiferencia: stlibrouno.data.items[idlibrouno].get('iddiferencia'),
                        tfdiferencia: saldo(stlibrouno.data.items[idlibrouno].get('diferenciamo')),
                        importedifcontdebito: saldo(stlibrouno.data.items[idlibrouno].get('diferenciamocontable')),
                        nroestadocuentadifdebito: stlibrouno.data.items[idlibrouno].get('nroestado'),
                        comentarioadicdifdebito: stlibrouno.data.items[idlibrouno].get('comentario')
                    };
                    fpdebitocred.getForm().setValues(objModDiferenciacredito);

//                    tfcuentabancaria.setValue(comboCuenta.getRawValue());
//                    iddiferencia.setValue(stlibrouno.data.items[idlibrouno].get('iddiferencia'));
//                    tfdiferencia.setValue(saldo(stlibrouno.data.items[idlibrouno].get('diferenciamo')));
//                    tfdiferenciacontable.setValue(saldo(stlibrouno.data.items[idlibrouno].get('diferenciamocontable')));//id:importedifcontdebito
//                    tfnroestadocuenta.setValue(stlibrouno.data.items[idlibrouno].get('nroestado'));//id:nroestadocuentadifdebito
//                    tacomentario.setValue(stlibrouno.data.items[idlibrouno].get('comentario'));//id:comentarioadicdifdebito
                    gridlibro = 1;
                    winDebitoCred.setTitle(etiquetas.lbTitleModCred);
                    winDebitoCred.show();
                    Ext.getCmp('winDebitoCredAplicar').hide();
                    tfnroestadocuenta.focus(false, 100);

                    if (!stlibrouno.getCount()) {
                        btnMlibrouno.setDisabled(true);
                        btnClibrouno.setDisabled(true);
                    }
                } else
                    mostrarMensaje(1, etiquetas.lbMsgSinElemMod);
            } else {
                // mostrarMensaje(1,'No hay elementos a modificar.');
                btnMlibrouno.setDisabled(true);
                btnClibrouno.setDisabled(true);
            }
        }
        else
            mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
    }


//**************** Grid Izquierda Abajo *****************
    var btnAlibrodos = new Ext.Button({
        tooltip: etiquetas.lbTitleAddDeb,
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        handler: function () {
            if (comboCuenta.getValue()) {
                modificar = false;
                fpdebitocred.getForm().reset();
                tfnroestadocuenta.setValue('');
                tfdiferencia.setValue('');
                tfdiferenciacontable.setValue('');
                tacomentario.setValue('');
                tfcuentabancaria.setValue(comboCuenta.getRawValue());
                // fpdebitocred.getForm().clearInvalid();
                gridlibro = 2;
                winDebitoCred.setTitle(etiquetas.lbTitleAddDeb);
                winDebitoCred.show();
                Ext.getCmp('winDebitoCredAplicar').show();
                tfnroestadocuenta.focus(false, 100);
                // fpdebitocred.getForm().clearInvalid();
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }

    });
    var btnClibrodos = new Ext.Button({
        tooltip: etiquetas.lbTitleElimDeb,
//        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            if (comboCuenta.getValue()) {
                if (stlibrodos.getCount()) {  // si no hay elementos
                    if (smlibrodos.getCount() == 0)
                        mostrarMensaje(1, etiquetas.lbMsgSinElemElim);
                    else {
                        var records = smlibrodos.getSelections();
                        stlibrodos.remove(records[0]);
                        CalcularSaldos();
                        if (!stlibrodos.getCount()) {
                            btnMlibrodos.setDisabled(true);
                            btnClibrodos.setDisabled(true);
                        }
                    }

                }
                else {
                    //mostrarMensaje(1,'No hay elementos a eliminar.');
                    btnMlibrodos.setDisabled(true);
                    btnClibrodos.setDisabled(true);
                }
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        }
    });
    var btnMlibrodos = new Ext.Toolbar.Button({
//        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        disabled: true,
        tooltip: etiquetas.lbTitleModDeb,
        handler: function () {
            cargamodDiferenciaDebito();
        }
    });

    var reclibrodos = Ext.data.Record.create([
        {
            name: 'nroestado',
            type: 'string'
        },
        {
            name: 'iddiferencia',
            type: 'string'
        },
        {
            name: 'diferenciamo',
            type: 'string'
        },
        {
            name: 'diferenciamocontable',
            type: 'string'
        },
        {
            name: 'comentario',
            type: 'string'
        }
    ]);

    var stlibrodos = new Ext.data.Store({
        reader: new Ext.data.ArrayReader({
            id: "iddiferencia"
        }, reclibrodos)
    });
    var smlibrodos = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowdeselect: function (sm, rowIndex, r) {
                btnMlibrodos.setDisabled(true);
                btnClibrodos.setDisabled(true);
            },
            rowselect: function (sm, rowIndex, r) {
                btnMlibrodos.setDisabled(false);
                btnClibrodos.setDisabled(false);
            }
        }
    });


    var grdlibrodos = new Ext.grid.GridPanel({
        store: stlibrodos,
        tbar: [btnAlibrodos, btnMlibrodos, btnClibrodos, etiquetas.lbdifdeb, '->', {
            xtype: 'tbtext',
            text: etiquetas.lbtextDenBanco
        }, tfdebbanco],
        frame: true,
        //height:185,
        rowHeight: .50,
        //width:320,
        //autoWidth:true,
        loadMask: true,
        sm: smlibrodos,
        disableSelection: true,
        //autoScroll: true,
        style: 'margin:5 0 5 0',
        columns: [
            {
                header: etiquetas.lbCamNoestadocta,
                width: 115,
                sortable: true,
                dataIndex: 'nroestado'
            },
            {
                id: 'comentario',
                header: etiquetas.lbtextComentario,
                width: 95,
                sortable: true,
                dataIndex: 'comentario'
            },
            {
                id: 'dif',
                header: etiquetas.lbCamDiferencia,
                width: 100,
                align: 'right',
                sortable: true,
                renderer: Ext.util.Format.erpMoney,
                dataIndex: 'diferenciamo'
            }
        ],
        autoExpandColumn: 'comentario',
        listeners: {
            rowclick: function (sm, indiceFila, record) {
                idlibrodos = indiceFila;
            },
            rowdblclick: function (t, rowIndex, e) {
                idlibrodos = rowIndex;
                cargamodDiferenciaDebito();
            }
        }
    });

    function cargamodDiferenciaDebito() {
        if (comboCuenta.getValue()) {
            if (stlibrodos.getCount()) {  // si no hay elementos
                if (smlibrodos.getCount()) {
                    modificar = true;
                    fpdebitocred.getForm().reset();

                    var objModDiferenciadebito = {
                        tfcuentabancaria: comboCuenta.getRawValue(),
                        iddiferencia: stlibrodos.data.items[idlibrodos].get('iddiferencia'),
                        tfdiferencia: saldo(stlibrodos.data.items[idlibrodos].get('diferenciamo')),
                        importedifcontdebito: saldo(stlibrodos.data.items[idlibrodos].get('diferenciamocontable')),
                        nroestadocuentadifdebito: stlibrodos.data.items[idlibrodos].get('nroestado'),
                        comentarioadicdifdebito: stlibrodos.data.items[idlibrodos].get('comentario')
                    };
                    fpdebitocred.getForm().setValues(objModDiferenciadebito);

//                    tfcuentabancaria.setValue(comboCuenta.getRawValue());
//                    iddiferencia.setValue(stlibrodos.data.items[idlibrodos].get('iddiferencia'));
//                    tfdiferencia.setValue(saldo(stlibrodos.data.items[idlibrodos].get('diferenciamo')));
//                    tfdiferenciacontable.setValue(saldo(stlibrodos.data.items[idlibrodos].get('diferenciamocontable')));
//                    tfnroestadocuenta.setValue(stlibrodos.data.items[idlibrodos].get('nroestado'));
//                    tacomentario.setValue(stlibrodos.data.items[idlibrodos].get('comentario'));
                    gridlibro = 2;
                    winDebitoCred.setTitle(etiquetas.lbTitleModDeb);
                    winDebitoCred.show();
                    Ext.getCmp('winDebitoCredAplicar').hide();
                    tfnroestadocuenta.focus(false, 10);
                    if (!stlibrodos.getCount()) {
                        btnMlibrodos.setDisabled(true);
                        btnClibrodos.setDisabled(true);
                    }
                }
                else
                    mostrarMensaje(1, etiquetas.lbMsgSinElemMod);
            }
            else {
                // mostrarMensaje(1,'No hay elementos a modificar.');
                btnMlibrodos.setDisabled(true);
                btnClibrodos.setDisabled(true);
            }
        }
        else
            mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
    }

//label para simular column vacia
    var lfDatos = new Ext.form.Label({
        id: 'lfvacio',
        text: etiquetas.lbtextMonSuc,
        style: 'font:12px tahoma,arial,verdana,sans-serif;',
        anchor: '100%'
    });

    /** Form panel **/
    var fpconcbancaria = new Ext.FormPanel({
        frame: true,
        id: 'fpconcbancaria',
        name: 'fpconcbancaria',
        layout: 'border',
        defaults: {
            split: true
        },
        items: [{
            region: 'north',
            height: 70,
            frame: true,
            items: [{
                layout: 'column',
                items: [{
                    layout: 'form',
                    labelWidth: 120,
                    columnWidth: .25,
                    items: dfdateconc
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .75,
                    items: comboCuenta
                }]
            }, {
                style: 'margin:10 0 0 0',
                layout: 'form',
                items: lfDatos
            }]
        }, {
            xtype: 'fieldset',
            region: 'west',
            width: 500,
            title: etiquetas.lbCamSaldolibro,
            layout: 'row',
            labelAlign: 'right',
            tbar: ['->', etiquetas.lbtextSaldoAI, tfsalactlibro],
            //tbar: ['->', '= Saldo actual:', tfsalactlibro],
            bbar: ['->', etiquetas.lbtextSaldoAjI, tfsaldoajlibro],
            //bbar: ['->', '= Saldo ajustado:', tfsaldoajlibro],
            items: [{
                rowHeight: .99,
                layout: 'row',
                items: [
                    grdlibrouno,
                    grdlibrodos
                ]
            }]
        }, {
            xtype: 'fieldset',
            region: 'center',
            layout: 'row',
            title: etiquetas.lbCamSaldobanco,
            labelAlign: 'right',
            tbar: ['->', etiquetas.lbtextSaldoAI, tfsalactbanco],
            //tbar: ['->', '= Saldo actual:', tfsalactbanco],
            bbar: ['->', etiquetas.lbtextSaldoAjI, tfsaldoajbanco],
            //bbar: ['->', '= Saldo ajustado:', tfsaldoajbanco],
            items: [{
                layout: 'row',
                rowHeight: .99,
                items: [grdbancouno, grdbancodos]
            }]
        }]
    });

//********          Botones       ***********
    var btnG = new Ext.Button({
        name: 'btnG',
        text: etiquetas.lbBtnAceptar,
        tooltip: etiquetas.lbBtnTooltipAceptar,
//        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        handler: function () {
            SalvarConciliacion();
        }
    });
    var btnC = new Ext.Button({
        name: 'btnC',
        text: etiquetas.lbBtnCancelar,
        tooltip: etiquetas.lbBtnTooltipCancelar,
//        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        handler: function () {
            windowopen = false;
            winConciliacionBancaria.hide();
            limpiarformulario();
            lfDatos.setText(etiquetas.lbtextMonSuc);
        }
    });
    var btnA = new Ext.Button({
        name: 'btnA',
//        icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        text: etiquetas.lbBtnAplicar,
        tooltip: etiquetas.lbBtnTooltipAplicar,
        handler: function () {
            SalvarConciliacion(true);
        }
    });

    function cargarDatosiniciales(idctab) {
        if (!winConciliacionBancaria) {
            winConciliacionBancaria = new Ext.Window({
                autoValidate: true,
                layout: 'fit',
                width: 900,
                height: 510,
                modal: true,
                constrain: true,
                closeAction: 'hide',
                items: fpconcbancaria,
                buttons: [btnC, btnA, btnG],
                listeners: {
                    beforehide: function (win) {
                        lfDatos.setText(etiquetas.lbtextMonSuc);
                        fpconcbancaria.getForm().reset();
                    },
                    hide: function () {
                        windowopen = false;// para indicar que la ventana fue cerrada
                    },
                    close: function () {
                        windowopen = false;// para indicar que la ventana fue cerrada
                    }
                }
            });
        }

        MostrarEtiquetas(Ext.getBody(), etiquetas.lbload);

        StcomboCuenta.load({
            params: {
                idcuentabancaria: idctab
            },
            callback: function (options, success, response) {
                if (StcomboCuenta.getCount() == 0) {
                    lMask.hide();
                    if (stbanco.getCount())
                        mostrarMensaje(1, etiquetas.lbMsgCBconCA);
                    else
                        mostrarMensaje(1, etiquetas.lbMsgSinCB);
                } else {
                    winConciliacionBancaria.show();
                    winConciliacionBancaria.maximize();
                    winConciliacionBancaria.doLayout();
                    dfdateconc.focus(false, 100);

                    comboCuenta.enable();
                    limpiarformulario();//dejar o no

                    DameFechaPeriodo();
                    if (idctab > 0 && acc == 'mod') { // si cuenta bancaria se cargo y voy a modificar....
                        winConciliacionBancaria.setTitle(etiquetas.lbTitleModC);
                        btnA.hide();
                        Ext.getCmp('comboCuenta').fireEvent('select', this);
                        /*se dispara el evento que carga el grid*/
                        comboCuenta.disable();
                    } else {
                        winConciliacionBancaria.setTitle(etiquetas.lbTitleAddC);
                        btnA.show();
                        if (StcomboCuenta.getCount() == 1) {
                            Ext.getCmp('comboCuenta').setValue(StcomboCuenta.data.items[0].data.idcuenta);
                            Ext.getCmp('comboCuenta').setRawValue(StcomboCuenta.data.items[0].data.nombre);
                            Ext.getCmp('comboCuenta').fireEvent('select', this);
                            /*se dispara el evento que carga el grid*/
                        }
                    }
                }
            } // del calback
        });
    }

    function DameFechaPeriodo() {
        lMaskPeriodo.show();
        Ext.Ajax.request({
            url: 'buscarfechacontable',
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (acc == 'ins')
                    lMaskPeriodo.hide();
                if (responseData == undefined) {
                    mostrarMensaje(1, etiquetas.lbMsgSinP);
                } else if (responseData.fechai) {
                    // Fecha de inicio y fecha de fin
                    fechainicioperiodo = responseData.fechai;
                    dfdateconc.setMinValue(responseData.fechai);
                    dfdateconc.setValue(responseData.fecha);
                    dfdateconc.setMaxValue(responseData.fechafin);
                    if (acc != 'mod')
                        dffecharecepcion.setMinValue(responseData.fechai);
                    dffecharecepcion.setMaxValue(responseData.fechafin);
                }
                else
                    mostrarMensaje(1, etiquetas.lbMsgSinP);
                lMaskPeriodo.hide();
            }
        });
    }

    function cargandoDatosCta() {
        loadMaskSaldo.show();
        sttipoinstrumento.load();
        Ext.Ajax.request({
            url: 'cargardatos',
            method: 'POST',
            params: {
                idcuenta: comboCuenta.getValue()
            },
            success: function (response) {
                jsonlibrobanco = response.responseText;
                data = Ext.decode(jsonlibrobanco);
                if (data == undefined) {
                    mostrarMensaje(3, etiquetas.lbMsgSinD);
                    winConciliacionBancaria.hide();
                    loadMaskSaldo.hide();
                }
                else {
                    if (data.codMsg == undefined) {
                        tfsalactlibro.setValue(saldo(data.saldolibro));
                        tfsalactbanco.setValue(saldo(data.saldobanco));
                        dfdateconc.setMinValue(fechainicioperiodo);
                        if (dfdateconc.minValue.format('Y-m-d') < data.fechaapertura)
                            dfdateconc.setMinValue(data.fechaapertura);
                        dffecharecepcion.setMinValue(data.fechaapertura);
                        CalcularSaldos();
                        loadMaskSaldo.hide();
                        if (acc == 'mod')
                            cargardatosmodificar();
                    }
                    else {
                        mostrarMensaje(data.codMsg, data.mensaje);
                        winConciliacionBancaria.hide();
                        loadMaskSaldo.hide();
                    }
                }
            },
            failure: function (response) {
                loadMaskSaldo.hide();
                mostrarMensaje(1, etiquetas.lbMsgSinD);
                return false;
            }
        });
    }

    comboCuenta.on('select', function cargar(Tpan, tab) {

        /*  if(acc == 'mod')
         {
         idcuentabancaria = StcomboCuenta.getAt(0).get('idcuenta');
         comboCuenta.setValue(idcuentabancaria);
         var objdata = StcomboCuenta.getAt(0).data;
         // myitems = fpconcbancaria.getTopToolbar().items;
         if(objdata.nomsucursal){
         //myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';

         lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Sucursal: ' + objdata.nomsucursal + '.');
         }else{
         // myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';
         lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Banco: ' + objdata.nombanco + '.');
         }
         cargandoDatosCta();
         }else // se va a adicionar
         {
         var objdata = StcomboCuenta.getAt(StcomboCuenta.find('idcuenta', comboCuenta.getValue())).data;
         /*myitems = fpconcbancaria.getTopToolbar().items;
         if(objdata.nomsucursal)
         myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';
         else
         myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';	  */
        /*if(objdata.nomsucursal){
         //myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';
         lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Sucursal: ' + objdata.nomsucursal + '.');
         }else{
         // myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';
         lfDatos.setText('Moneda: ' + objdata.codigoiso + '. ' + 'Banco: ' + objdata.nombanco + '.');
         }
         cargandoDatosCta();*/ // la asignacion del  texto es igual  independientemente de la accion add o  mod
        if (acc == 'mod') {
            idcuentabancaria = StcomboCuenta.getAt(0).get('idcuenta');
            comboCuenta.setValue(idcuentabancaria);
            var objdata = StcomboCuenta.getAt(0).data;
        } else // se va a adicionar
        {
            var objdata = StcomboCuenta.getAt(StcomboCuenta.find('idcuenta', comboCuenta.getValue())).data;
        }

        if (objdata.nomsucursal) {
            //myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Sucursal: <b>'+objdata.nomsucursal+'</b>.';
            lfDatos.setText(etiquetas.lbTextMoneda + objdata.codigoiso + '. ' + etiquetas.lbTextSucursal + objdata.nomsucursal + '.');
        } else {
            // myitems.itemAt(0).getEl().innerHTML = 'Moneda: <b>'+objdata.codigoiso+'</b>. Banco: <b>'+objdata.nombanco+'</b>.';
            lfDatos.setText(etiquetas.lbTextMoneda + objdata.codigoiso + '. ' + etiquetas.lbTextBanco + objdata.nombanco + '.');
        }
        cargandoDatosCta();
    });

    function limpiarformulario() {
        fpconcbancaria.getForm().reset();
        //fpconcbancaria.getTopToolbar().items.itemAt(6).getEl().innerHTML = '';
        //if(fpconcbancaria.getTopToolbar()) fpconcbancaria.getTopToolbar().items.clear();
        comboCuenta.reset();
        if (StcomboCuenta.getCount())
            comboCuenta.clearValue();
        stbancouno.removeAll();
        stbancodos.removeAll();
        stlibrouno.removeAll();
        stlibrodos.removeAll();
        dblibro = 0;
        crlibro = 0;
        dbbanco = 0;
        crbanco = 0;
        tfsalactlibro.setValue(0.00);
        tfsalactbanco.setValue(0.00);
        tfcredlibro.setValue(0.00);
        tfcredbanco.setValue(0.00);
        tfdeblibro.setValue(0.00);
        tfdebbanco.setValue(0.00);
        tfsaldoajbanco.setValue(0.00);
        tfsaldoajlibro.setValue(0.00);
        dfdateconc.reset();
    }

    function cleanForm(windowinst) {
        if (windowinst) {
            var objInst = {
                idinstrumentobancario: '',
                cbxtipoinstrumento: '',
                nroinstrumento: '',
                nrosolicitud: '',
                fecharecepcion: '',
                tfimporteinst: '',
                tfimporteinstcont: '',
                importeletras: '',
                importeletrascont: '',
                comentarioinstxdepositar: '',
                cbEspecialidad: '',
                cbxbeneficiario: '',
                cbxtipobeneficiario: '',
                cbrecibidopor: '',
                cbxtiporecibidopor: ''
            };
            fpInstTrans.getForm().setValues(objInst);
        }
        else {
            var objDiferencia = {
                tfcuentabancaria: comboCuenta.getRawValue(),
                iddiferencia: '',
                tfdiferencia: '',
                importedifcontdebito: '',
                nroestadocuentadifdebito: '',
                comentarioadicdifdebito: ''
            };
            fpdebitocred.getForm().setValues(objDiferencia);
        }
    }

    function CalcularSaldos() {
        //gestionando arreglo Libro primer grid
        var creditobanco = 0;
        if (stlibrouno.getCount())
            for (var i = 0; i < stlibrouno.getCount(); i++)
                creditobanco += parseFloat(stlibrouno.data.items[i].get('diferenciamo'));

        //gestionando arreglo Libro segundo grid
        var debitobanco = 0;
        if (stlibrodos.getCount())
            for (var i = 0; i < stlibrodos.getCount(); i++)
                debitobanco += parseFloat(stlibrodos.data.items[i].get('diferenciamo'));

        tfcredbanco.setValue(saldo(creditobanco));
        tfdebbanco.setValue(saldo(debitobanco));
        // Saldo ajustado = saldo de la cuenta + (diferencia  grid abajo_debito - grid arriba_credito)
        sldobook = parseFloat(tfsalactlibro.getValue())
        sldorestabook = sldobook + creditobanco - debitobanco;
        tfsaldoajlibro.setValue(saldoformateado(sldorestabook));

        /*** SEGUN BANCO - INSTRUMENTO ***/
        //gestionando arreglo banco primer grid
        var debitolibro = 0;
        if (stbancouno.getCount())
            for (var i = 0; i < stbancouno.getCount(); i++)
                debitolibro += parseFloat(stbancouno.data.items[i].get('importemo'));

        //gestionando arreglo banco segundo grid
        var creditolibro = 0;
        if (stbancodos.getCount())
            for (var i = 0; i < stbancodos.getCount(); i++)
                creditolibro += parseFloat(stbancodos.data.items[i].get('importemo'));

        tfcredlibro.setValue(saldo(creditolibro));
        tfdeblibro.setValue(saldo(debitolibro));
        tfsaldoajbanco.setValue(saldoformateado(parseFloat(tfsalactbanco.getValue()) + debitolibro - creditolibro));
    }

    function Agrupargrid() {

        //gestionando arreglo Libro primer grid
        var arrLibrouno = new Array();
        if (stlibrouno.getCount()) {
            for (var i = 0; i < stlibrouno.getCount(); i++) {
                arrLibrouno[i] = {
                    'nroestado': stlibrouno.data.items[i].get('nroestado'),
                    'iddiferencia': stlibrouno.data.items[i].get('iddiferencia'),
                    'diferenciamo': stlibrouno.data.items[i].get('diferenciamo'),
                    'diferenciamocontable': stlibrouno.data.items[i].get('diferenciamocontable'),
                    'comentario': stlibrouno.data.items[i].get('comentario')
                };
            }
        }
        arrGrid[0] = arrLibrouno;

        //gestionando arreglo Libro segundo grid
        var arrLibrodos = new Array();
        if (stlibrodos.getCount()) {
            for (var i = 0; i < stlibrodos.getCount(); i++) {
                arrLibrodos[i] = {
                    'nroestado': stlibrodos.data.items[i].get('nroestado'),
                    'iddiferencia': stlibrodos.data.items[i].get('iddiferencia'),
                    'diferenciamo': stlibrodos.data.items[i].get('diferenciamo'),
                    'diferenciamocontable': stlibrodos.data.items[i].get('diferenciamocontable'),
                    'comentario': stlibrodos.data.items[i].get('comentario')
                };
            }
        }
        arrGrid[1] = arrLibrodos;

        //gestionando arreglo Banco primer grid
        var arrBancouno = new Array();
        if (stbancouno.getCount()) {
            for (var i = 0; i < stbancouno.getCount(); i++) {
                arrBancouno[i] = {
                    numerodocumento: stbancouno.data.items[i].get('numerodocumento'),
                    idinstrumentobancario: stbancouno.data.items[i].get('idinstrumentobancario'),
                    fecharecepcion: stbancouno.data.items[i].get('fecharecepcion'),
                    importemo: stbancouno.data.items[i].get('importemo'),
                    importemb: stbancouno.data.items[i].get('importemb'),
                    denominacion: comboCuenta.getRawValue(),
                    comentario: stbancouno.data.items[i].get('comentario'),
                    idtipodocumento: stbancouno.data.items[i].get('idtipodocumento'),
                    idbeneficiario: stbancouno.data.items[i].get('idbeneficiario'),
                    beneficiario: stbancouno.data.items[i].get('beneficiario'),
                    tipob: stbancouno.data.items[i].get('tipob'),
                    idrecibe: stbancouno.data.items[i].get('idrecibe'),
                    recibe: stbancouno.data.items[i].get('recibe'),
                    tipor: stbancouno.data.items[i].get('tipor'),
                    idsolicitud: stbancouno.data.items[i].get('idsolicitud'),
                    idespecialidad: stbancouno.data.items[i].get('idespecialidad'),
                    descripcionespecialidad: stbancouno.data.items[i].get('descripcionespecialidad')
                };
            }
        }
        arrGrid[2] = arrBancouno;

        //gestionando arreglo Banco primer grid
        var arrBancodos = new Array();
        if (stbancodos.getCount()) {
            for (var i = 0; i < stbancodos.getCount(); i++) {
                arrBancodos[i] = {
                    numerodocumento: stbancodos.data.items[i].get('numerodocumento'),
                    idinstrumentobancario: stbancodos.data.items[i].get('idinstrumentobancario'),
                    fecharecepcion: stbancodos.data.items[i].get('fecharecepcion'),
                    importemo: stbancodos.data.items[i].get('importemo'),
                    importemb: stbancodos.data.items[i].get('importemb'),
                    denominacion: comboCuenta.getRawValue(),
                    comentario: stbancodos.data.items[i].get('comentario'),
                    idtipodocumento: stbancodos.data.items[i].get('idtipodocumento'),
                    idbeneficiario: stbancodos.data.items[i].get('idbeneficiario'),
                    beneficiario: stbancodos.data.items[i].get('beneficiario'),
                    tipob: stbancodos.data.items[i].get('tipob'),
                    idrecibe: stbancodos.data.items[i].get('idrecibe'),
                    recibe: stbancodos.data.items[i].get('recibe'),
                    tipor: stbancodos.data.items[i].get('tipor'),
                    idsolicitud: stbancodos.data.items[i].get('idsolicitud'),
                    idespecialidad: stbancodos.data.items[i].get('idespecialidad'),
                    descripcionespecialidad: stbancodos.data.items[i].get('descripcionespecialidad')
                };
            }
        }
        arrGrid[3] = arrBancodos;

        return arrGrid;
    }

    function Idviejos() {
        //gestionando arreglo Libro primer grid
        var arrLibrouno = new Array();
        if (stlibrouno.getCount())
            for (var i = 0; i < stlibrouno.getCount(); i++)
                arrLibrouno.push(stlibrouno.data.items[i].get('iddiferencia'));
        arrGrid[0] = arrLibrouno;

        //gestionando arreglo Libro segundo grid
        var arrLibrodos = new Array();
        if (stlibrodos.getCount())
            for (var i = 0; i < stlibrodos.getCount(); i++)
                arrLibrodos.push(stlibrodos.data.items[i].get('iddiferencia'));
        arrGrid[1] = arrLibrodos;

        //gestionando arreglo Banco primer grid
        var arrBancouno = new Array();
        if (stbancouno.getCount())
            for (var i = 0; i < stbancouno.getCount(); i++)
                arrBancouno.push(stbancouno.data.items[i].get('idinstrumentobancario'));
        arrGrid[2] = arrBancouno;

        //gestionando arreglo Banco primer grid
        var arrBancodos = new Array();
        if (stbancodos.getCount())
            for (var i = 0; i < stbancodos.getCount(); i++)
                arrBancodos.push(stbancodos.data.items[i].get('idinstrumentobancario'));
        arrGrid[3] = arrBancodos;

        return arrGrid;
    }

    function SalvarConciliacion(apli) {
        if (!comboCuenta.getValue()) {
            mostrarMensaje(1, etiquetas.lbMsgDIncorr);
            comboCuenta.markInvalid(etiquetas.lbMsgReq);
        }
        else if (!dfdateconc.getValue()) {
            mostrarMensaje(1, etiquetas.lbMsgDIncorr);
            comboCuenta.markInvalid(etiquetas.lbMsgReq);
        }
        else {
            var conciliado = 0;
            if (saldounformat(tfsaldoajlibro.getValue()) == saldounformat(tfsaldoajbanco.getValue()))
                conciliado = 1;
            lMaskSave.show();
            Ext.Ajax.request({
                url: 'InsMod',
                method: 'POST',
                params: {
                    acc: acc,
                    idcuentabancaria: comboCuenta.getValue(),
                    idconciliacion: (acc !== 'ins') ? Ext.getCmp('gpbanco').getSelectionModel().getSelected().data.idconciliacion : '',
                    conciliado: conciliado,
                    saldo: tfsalactbanco.getValue(),
                    fechaconcil: dfdateconc.getRawValue(),
                    gridsviejo: Ext.encode(idviejos),
                    grids: Ext.encode(Agrupargrid())
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);

                    if (responseData == undefined) {
                        mostrarMensaje(3, etiquetas.lbMsgSinG);
                        winConciliacionBancaria.hide();
                        lMaskSave.hide();
                    }
                    else {
                        if (responseData.codMsg != undefined) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            lMaskSave.hide();
                        }
                        else {
                            var result = eval(response.responseText);

                            var temp = (acc == 'mod') ? etiquetas.lbMsgAdjetivoM : etiquetas.lbMsgAdjetivoA;
                            var temp1 = (acc == 'mod') ? etiquetas.lbMsgInfinitivoM : etiquetas.lbMsgInfinitivoA;
                            switch (result) {
                                case -1 :
                                    mostrarMensaje(1, etiquetas.lbMsgGpartA + temp + etiquetas.lbMsgGpartB);
                                    cierraylimpia(apli);
                                    stbanco.reload();
                                    break;
                                case -3 :
                                    mostrarMensaje(3, etiquetas.lbMsgNoGpartA + temp1 + etiquetas.lbMsgNoGpartB);
                                    lMaskSave.hide();
                                    break;
                                case -4 :
                                    mostrarMensaje(3, etiquetas.lbMsgNoGpartA + temp1 + etiquetas.lbMsgNoGpartC);
                                    lMaskSave.hide();
                                    break;
                                case -5 :
                                    mostrarMensaje(3, etiquetas.lbMsgNoGpartA + temp1 + etiquetas.lbMsgNoGpartD);
                                    lMaskSave.hide();
                                    break;
                                case -6 :
                                    mostrarMensaje(1, etiquetas.lbMsgNoGpartA + temp1 + etiquetas.lbMsgNoGpartF);
                                    comboCuenta.reset();
                                    StcomboCuenta.load({
                                        callback: function (options, success, response) {
                                            if (StcomboCuenta.getCount() == 0) {
                                                winConciliacionBancaria.hide();
                                            }
                                        } // del calback
                                    });
                                    lfDatos.setText(etiquetas.lbtextMonSuc);
                                    fpconcbancaria.getForm().reset();
                                    limpiarformulario();
                                    lMaskSave.hide();
                                    break;
                                case -7 :
                                    mostrarMensaje(1, etiquetas.lbMsgNoGpartA + temp1 + etiquetas.lbMsgNoGpartF);
                                    cargandoDatosCta();
                                    lMaskSave.hide();
                                    break;
                                default :
                                    mostrarMensaje(3, etiquetas.lbMsgNoGpartA + temp1 + etiquetas.lbMsgNoGpartH);
                                    lMaskSave.hide();
                                    break;
                            }
                        }
                    }
                }
            });
            return true;
        }
    }

    function cierraylimpia(apli) {
        if (!apli)
            winConciliacionBancaria.hide();
        else
            dfdateconc.focus(false, 100);
        lfDatos.setText(etiquetas.lbtextMonSuc);
        fpconcbancaria.getForm().reset();
        limpiarformulario();
    }

    function cargardatosmodificar() {
        loadMask.show();
        Ext.Ajax.request({
            url: 'cargargrids',
            method: 'POST',
            params: {
                idcuenta: idcuentabancaria
            },
            callback: function (options, success, response) {
                data = Ext.decode(response.responseText);
                if (data == undefined) {
                    mostrarMensaje(3, etiquetas.lbMsgSinD);
                    winConciliacionBancaria.hide();
                    loadMask.hide();
                }
                else {
                    if (data.codMsg == undefined) {
                        idviejos = new Array();
                        var dblibro = 0, crlibro = 0, saldolibro = 0, saldobanco = 0;
                        jsonlibrobanco = response.responseText;

                        /*conciliacion = data.conciliacion;*************** PQ es esto
                         if(conciliacion.length)
                         {
                         dfdateconc.setMinValue(conciliacion.fecha);
                         dfdateconc.setValue(conciliacion.fecha);
                         }else
                         {
                         dfdateconc.setMinValue(new Date());
                         dfdateconc.setValue(new Date());
                         }*/

                        dfdateconc.setMinValue(data.fecha);
                        dfdateconc.setValue(data.fecha);

                        libro = data.libro;
                        for (var i = 0; i < libro.length; i++) {
                            if (libro[i].tipo < 0) { //  diferenciamo < 0   ya se trae el valor absoluto
                                crlibro += parseFloat(libro[i].diferenciamo);
                                stlibrouno.add(new reclibrouno(libro[i]));
                            } else {
                                dblibro += parseFloat(libro[i].diferenciamo);
                                stlibrodos.add(new reclibrodos(libro[i]));
                            }
                        }

                        tfcredbanco.setValue(saldo(crlibro));
                        tfdebbanco.setValue(saldo(dblibro));

                        var dbbanco = 0;
                        var crbanco = 0;

                        if (data.banco != 0) {
                            bancotransito = data.banco.transito;   // (-) negativos
                            bancodepositar = data.banco.depositar; // (+) depositar
                            stbancouno.removeAll();  // Arriba, grid depositar
                            stbancodos.removeAll();  // Arriba, grid transito

                            // Por depositar, los positivos (arriba)
                            for (var i = 0; i < bancodepositar.length; i++) {
                                dbbanco += parseFloat(bancodepositar[i].importemo);
                                stbancouno.add(new recbancouno(bancodepositar[i]));
                            }
                            // Transito, los negativos (abajo)
                            for (var i = 0; i < bancotransito.length; i++) {
                                crbanco += parseFloat(bancotransito[i].importemo);
                                stbancodos.add(new recbancodos(bancotransito[i]));
                            }
                        }

                        tfcredlibro.setValue(saldo(crbanco));
                        tfdeblibro.setValue(saldo(dbbanco));
                        tfsaldoajlibro.setValue(saldoformateado(parseFloat(tfsalactlibro.getValue()) + crlibro - saldo(dblibro)));
                        tfsaldoajbanco.setValue(saldoformateado(parseFloat(tfsalactbanco.getValue()) + dbbanco - saldo(crbanco)));

                        for (var i = 0; i < Idviejos().length; i++)
                            idviejos.push(Idviejos()[i]);

                        if (saldounformat(tfsaldoajlibro.getValue()) == saldounformat(tfsaldoajbanco.getValue())) {
                            mostrarMensaje(1, etiquetas.lbMsgConciliada);
                            loadMask.hide();
                        }
                        else {
                            mostrarMensaje(1, etiquetas.lbMsgNoConciliada);
                            loadMask.hide();
                        }

                    }
                    else {
                        mostrarMensaje(data.codMsg, data.mensaje);
                        winConciliacionBancaria.hide();
                        loadMask.hide();
                    }
                }
            }
        });
    }

    /*******************************************************************************/
    //////////////////////      ANTIGUO JS VENTANASCONCILIACION.JS //////////////////
    /*******************************************************************************/

    /*************Adicionar diferencia de debito o credito***************/
    var tfdiferencia = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextImpOriginal,
        style: 'text-align: right',
        name: 'tfdiferencia',
        id: 'tfdiferencia',
        disabledClass: 'disabled-component',
        maskRe: /^([0-9.]?[0-9.]*)+$/,
        regex: /^([0-9.]?[0-9.]*)+$/,
        regexText: etiquetas.regexText19,
        maxLength: 24,
        maxLengthText: etiquetas.LbCampomaxLengthText24,
        msgTarget: 'qtip',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        anchor: '100%',
        enableKeyEvents: true,
        tabIndex: 2,
        validator: function(value) {
            var val = parseFloat(value);
            if(val == 0.00) {
                return perfil.etiquetas.lbMsgInvalidIO;
            }
            return true;
        },
        listeners: {
            blur: function (tf) {
                if (tf.isValid())
                    tfdiferencia.setRawValue(saldo(tfdiferencia.getValue()));
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                if (e.getKey() != 8) //
                {
                    var value = new String(tf.getValue());
                    var position = value.indexOf(".", 0);
                    if (position > -1 && (e.getKey() == 37 || e.getKey() == 39))// Para que no permita desplazarse hacia izq o der
                        e.stopEvent();
                    if (position > -1 && e.getKey() == 46)// Para que solo permita un punto
                        e.stopEvent();
                    if (position > -1 && (value.length - position) > 2)// Para que solo permita 2 lugares decimales
                        e.stopEvent();
                    if (position == -1 && value.length >= 16 && e.getKey() != 46)// Para que escriba solo 16 caracteres antes del '.'
                        e.stopEvent();
                    if (value.length >= 19)// Para que escriba solo 19 caracteres
                        e.stopEvent();
                    if ((e.getKey() == 13) && (tf.getValue())) {
                        tfdiferenciacontable.focus(false, 100);// darle foco  a fecha
                    }
                }
            }
        }
    });

    var tfdiferenciacontable = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextImpContable,
        style: 'text-align: right',
        name: 'importedifcontdebito',
        id: 'importedifcontdebito',
        disabledClass: 'disabled-component',
        maskRe: /^([0-9.]?[0-9.]*)+$/,
        regex: /^([0-9.]?[0-9.]*)+$/,
        regexText: etiquetas.regexText19,
        maxLength: 24,
        maxLengthText: etiquetas.LbCampomaxLengthText24,
        msgTarget: 'qtip',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        anchor: '100%',
        enableKeyEvents: true,
        tabIndex: 3,
        validator: function(value) {
            var val = parseFloat(value);
            if(val == 0.00) {
                return perfil.etiquetas.lbMsgInvalidIC;
            }
            return true;
        },
        listeners: {
            keyup: function (t, e) {
                var num = tfdiferenciacontable.getValue();
                // verificar los lugares decimalesdecimales
            },
            blur: function (tf) {
                if (tf.isValid())
                    tfdiferenciacontable.setRawValue(saldo(tfdiferenciacontable.getValue()));
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                if (e.getKey() != 8) //
                {
                    var value = new String(tf.getValue());
                    var position = value.indexOf(".", 0);
                    if (position > -1 && (e.getKey() == 37 || e.getKey() == 39))// Para que no permita desplazarse hacia izq o der
                        e.stopEvent();
                    if (position > -1 && e.getKey() == 46)// Para que solo permita un punto
                        e.stopEvent();
                    if (position > -1 && (value.length - position) > 2)// Para que solo permita 2 lugares decimales
                        e.stopEvent();
                    if (position == -1 && value.length >= 16 && e.getKey() != 46)// Para que escriba solo 16 caracteres antes del '.'
                        e.stopEvent();
                    if (value.length >= 19)// Para que escriba solo 19 caracteres
                        e.stopEvent();
                    if ((e.getKey() == 13) && (tf.getValue())) {
                        tacomentario.focus(false, 100);// darle foco  a fecha
                    }
                }
            }
        }
    });

    var tfcuentabancaria = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextC,
        disabledClass: 'disabled-component',
        name: 'tfcuentabancaria',
        id: 'tfcuentabancaria',
        disabled: true,
        readOnly: true,
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        anchor: '100%'
    });

    var tfnroestadocuenta = new Ext.form.TextField({
        fieldLabel: etiquetas.lbCamNoestadocta,
        name: 'nroestadocuentadifdebito',
        id: 'nroestadocuentadifdebito',
        disabledClass: 'disabled-component',
        msgTarget: 'qtip',
        maskRe: /^([0-9]+?[0-9]*)+$/,
        regex: /^([0-9\xf3]+?[0-9]*)+$/,
        regexText: etiquetas.regexText16,
        maxLength: 16,
        maxLengthText: etiquetas.maxLengthText16,
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        anchor: '100%',
        enableKeyEvents: true,
        tabIndex: 1,
        listeners: {
            keypress: function (tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 16)
                        e.stopEvent();  // Para que no escriba m�s de 16 caracteres
                }
                if ((e.getKey() == 13) && (tf.getValue())) {
                    tfdiferencia.focus(false, 100);// darle foco  a fecha
                }
            }
        }
    });

    var tacomentario = new Ext.form.TextArea({
        fieldLabel: etiquetas.lbtextComentario,
        name: 'comentarioadicdifdebito',
        id: 'comentarioadicdifdebito',
        disabledClass: 'disabled-component',
        msgTarget: 'qtip',
        // maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-\.\:\(\)\_\+\;]+$/,
        // regex: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-\.\:\(\)\_\+\;]+$/,
        maxLength: 255,
        // regexText: etiquetas.regexText,
        maxLengthText: etiquetas.maxLengthText255,
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        anchor: '100%',
        enableKeyEvents: true,
        tabIndex: 4,
        listeners: {
            keypress: function (tf, event) {
                var key = event.getKey();
                if (key == event.ENTER)
                    event.stopEvent();  // Para que no escriba ENTER
                if ((event.getKey() == 13) && (tacomentario.getValue())) {
                    probar();
                }
            },
            invalid: function(cmp, msg) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            },
            blur: function(cmp) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            }
        }
    });

    var iddiferencia = new Ext.form.Hidden({
        name: 'iddiferencia',
        id: 'iddiferencia'
    });

    var fpdebitocred = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        border: true,
        layout: 'form',
        autoHeight: true,
        modal: true,
        plain: true,
        trackResetOnLoad: true,
        bodyStyle: 'padding:10px 10px 10px 10px',
        anchor: '100%',
        items: [{
            layout: 'column',
            items: [{
                /*
                 layout: 'form',
                 columnWidth:.5,
                 items: [tfnroestadocuenta]

                 },{*/
                layout: 'form',
                columnWidth: 1,
                items: [tfcuentabancaria]
            }]
        }, {
            layout: 'column',
            items: [{
                layout: 'form',
                //style : 'margin:0 0 0 5',
                columnWidth: .3,
                items: [tfnroestadocuenta]

            }, {
                layout: 'form',
                style: 'margin:0 0 0 10',
                columnWidth: .35,
                items: [tfdiferencia]
            }, {
                layout: 'form',
                columnWidth: .35,
                style: 'margin:0 0 0 10',
                items: [tfdiferenciacontable]
            }, iddiferencia]
        }, {
            layout: 'form',
            columnWidth: 1,
            items: [tacomentario]
        }]
    });

    var winDebitoCred = new Ext.Window({
        autoValidate: true,
        modal: true,
        resizable: true,
        constrain: true,
        closeAction: 'hide',
        layout: 'fit',
        autoHeight: true,
        width: 600,
        height: 300,
        items: [fpdebitocred],
        buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: 'btnCancelarCrDb',
            text: etiquetas.lbBtnCancelar,
            tooltip: etiquetas.lbBtnTooltipCancelar,
            tabIndex: 5,
            handler: function () {
                modificar = false;
                winDebitoCred.hide();
                //fpdebitocred.getForm().reset();
                cleanForm(false);
            }
        }, {
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            id: 'winDebitoCredAplicar',
            text: etiquetas.lbBtnAplicar,
            tooltip: etiquetas.lbBtnTooltipAplicar,
            tabIndex: 6,
            handler: function () {
                probar(true);
            }
        }, {
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            id: 'btnAceptarCrDb',
            text: etiquetas.lbBtnAceptar,
            tooltip: etiquetas.lbBtnTooltipAceptar,
            tabIndex: 7,
            handler: function () {
                probar();
            }
        }],
        listeners: {
            show: function(window) {
                var btnaccept = Ext.getCmp('btnAceptarCrDb');
                var btncancel = Ext.getCmp('btnCancelarCrDb');

                btnaccept.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        stopEvent: true,
                        fn: function() {
                            tfnroestadocuenta.focus(true, true);
                        }
                    }
                ]);

                btncancel.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        //stopEvent: true,
                        fn: function() {
                            if(btnaccept.disabled) {
                                tfnroestadocuenta.focus(true, true);
                            }
                        }
                    }
                ]);

                tfnroestadocuenta.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        shift: true,
                        stopEvent: true,
                        fn: function() {
                            if(btnaccept.disabled) {
                                btncancel.focus();
                            }
                            else {
                                btnaccept.focus();
                            }
                        }
                    }
                ]);

                if(modificar) {
                    window.autoValidate = false;
                    btnaccept.setDisabled(true);
                    startTaskValidation(fpdebitocred.getForm(), 'mod', [btnaccept]);
                }
                else {
                    window.autoValidate = true;
                }
                fpdebitocred.getForm().isValid();
            },
            hide: function() {
                stopTaskValidation();
            }
        }
    });


    function probar(apli) {
        var flag = true;
        if (tfdiferencia.getValue() == 0.00 || tfdiferenciacontable.getValue() == 0.00)
            flag = false;
        if (fpdebitocred.getForm().isValid() && verificaDecimales(tfdiferencia) && verificaDecimales(tfdiferenciacontable) && flag) {
            if (gridlibro == 1) {
                newRecord = new reclibrouno({
                    nroestado: tfnroestadocuenta.getValue(),
                    iddiferencia: 0,
                    diferenciamo: tfdiferencia.getValue(),
                    diferenciamocontable: tfdiferenciacontable.getValue(),
                    comentario: tacomentario.getValue()
                });
                if (modificar == true) {
                    index = stlibrouno.indexOf(smlibrouno.getSelected());
                    stlibrouno.remove(smlibrouno.getSelected());
                    newRecord.set('iddiferencia', iddiferencia.getValue());
                    stlibrouno.insert(index, newRecord);
                }
                else
                    stlibrouno.add(newRecord);
            }
            else {
                newRecord = new reclibrodos({
                    nroestado: tfnroestadocuenta.getValue(),
                    iddiferencia: 0,
                    diferenciamo: tfdiferencia.getValue(),
                    diferenciamocontable: tfdiferenciacontable.getValue(),
                    comentario: tacomentario.getValue()
                });
                if (modificar == true) {
                    index = stlibrodos.indexOf(smlibrodos.getSelected());
                    stlibrodos.remove(smlibrodos.getSelected());
                    newRecord.set('iddiferencia', iddiferencia.getValue());
                    stlibrodos.insert(index, newRecord);
                }
                else
                    stlibrodos.add(newRecord);
            }
            modificar = false;
            if (!apli) {
                winDebitoCred.hide();
            }
            else {
                tfnroestadocuenta.focus(true, true);
            }
            //fpdebitocred.getForm().reset();
            cleanForm(false);
            CalcularSaldos();
        } else {
            mostrarMensaje(1, etiquetas.lbMsgDIncorr);
            if (tfdiferencia.getValue() == '0.00')
                tfdiferencia.markInvalid(etiquetas.lbMsgInvalidIO);
            if (tfdiferenciacontable.getValue() == '0.00')
                tfdiferenciacontable.markInvalid(etiquetas.lbMsgInvalidIC);
        }
    }


    /*************Adicionar instrumento por depositar o en transito***************/
    var sttipoinstrumento = new Ext.data.Store({
        url: 'cargartipoDocumento',
        reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'iddoc',
                totalProperty: 'cant'
            },
            [
                {
                    name: 'iddoc',
                    type: 'string'
                },
                {
                    name: 'iddocumentos',
                    type: 'string'
                },
                {
                    name: 'denominacion'
                }
            ])
    });

    var cbxtipoinstrumento = new Ext.form.ComboBox({
        id: 'cbxtipoinstrumento',
        fieldLabel: etiquetas.lbtextTipodoc,
        mode: 'local',
        name: 'iddocumentos',
        hiddenName: 'iddoc',
        emptyText: etiquetas.lbEmptyMsg,
        store: sttipoinstrumento,
        valueField: 'iddoc',
        displayField: 'denominacion',
        forceSelection: true,
        editable: true,
        resizable: true,
        //typeAhead: true,
        msgTarget: 'qtip',
        /*maskRe : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n�meros y espacios
         regex : /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
         regexText : 'Este campo solo permite letras y n&uacute;meros.',*/
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        anchor: '100%',
        triggerAction: 'all',
        enableKeyEvents: true,
        tabIndex: 1,
        listeners: {
            keypress: function (t, e) {
                if (e.getKey() == 13) {
                    if (!cbxtipoinstrumento.getValue()) {
                        cbxtipoinstrumento.setValue(sttipoinstrumento.getAt(0).get('iddoc'));
                    }
                    if ((cbxtipoinstrumento.getValue()) && (cbxtipoinstrumento.isValid())) {
                        tfnroinstrumento.focus(false, 100);// darle foco  a fecha
                    }
                }
            }
        }

    });

    var tfnroinstrumento = new Ext.form.TextField({
        fieldLabel: etiquetas.lbCamNodoc,
        name: 'nroinstrumento',
        id: 'nroinstrumento',
        disabledClass: 'disabled-component',
        msgTarget: 'qtip',
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        regex: /^([0-9]+ ?[0-9]*)+$/,
        regexText: etiquetas.regexText16,
        maxLength: 16,
        maxLengthText: etiquetas.maxLengthText16,
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        width: '100%',
        enableKeyEvents: true,
        tabIndex: 2,
        listeners: {
            keypress: function (tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 16)
                        e.stopEvent();  // Para que no escriba m�s de 16 caracteres
                }
                if (e.getKey() == 13) {
                    if (tfnroinstrumento.getValue()) {
                        dffecharecepcion.focus(false, 100);// darle foco  a fecha
                    }
                }
            }
        }
    });

    var tfnrosolicitud = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextNoSolicitud,
        name: 'nrosolicitud',
        id: 'nrosolicitud',
        disabledClass: 'disabled-component',
        msgTarget: 'qtip',
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        regex: /^([0-9]+ ?[0-9]*)+$/,
        regexText: etiquetas.regexText16,
        maxLength: 8,
        maxLengthText: etiquetas.maxLengthText16,
        allowBlank: true,
        blankText: etiquetas.lbMsgReq,
        width: '100%',
        enableKeyEvents: true,
        tabIndex: 4,
        listeners: {
            keypress: function (tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 16)
                        e.stopEvent();  // Para que no escriba m�s de 16 caracteres
                }
                if ((e.getKey() == 13) && (tf.getValue())) {
                    tfimporteinst.focus(false, 100);// darle foco  a este campo
                }
            }

        }

    });

    var dffecharecepcion = new Ext.form.DateField({
        fieldLabel: etiquetas.lbtextFRecepcion,
        readOnly: true,
        msgTarget: 'qtip',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        format: 'd/m/Y',
        name: 'fecharecepcion',
        id: 'fecharecepcion',
        anchor: '100%',
        enableKeyEvents: true,
        tabIndex: 3,
        listeners: {
            keypress: function (tf, event) {
                if (event.getKey() == 13) {
                    var date = dffecharecepcion.minValue;
                    if (!dffecharecepcion.getValue()) {
                        dffecharecepcion.setValue(date);
                    }
                    if (dffecharecepcion.getValue()) {
                        tfnrosolicitud.focus(false, 100);//para darle foco a este campo
                    }

                }
            }
        }
    });

    var tfimporteinst = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextImpOriginal,
        style: 'text-align: right',
        name: 'tfimporteinst',
        id: 'tfimporteinst',
        msgTarget: 'qtip',
        disabledClass: 'disabled-component',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        width: '100%',
        maxLength: 19,
        maxLengthText: etiquetas.maxLengthText19,
        maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
        regex: /^([0-9.]+ ?[0-9.]*)+$/,
        regexText: etiquetas.regexText19,
        allowNegative: false,
        allowDecimals: true,
        enableKeyEvents: true,
        selectOnFocus: true,
        tabIndex: 5,
        validator: function(value) {
            var val = parseFloat(value);
            if(val == 0.00) {
                return perfil.etiquetas.lbMsgInvalidIO;
            }
            return true;
        },
        listeners: {
            keyup: function (tf, e) {
                if (tf.isValid())
                    tfimporteletras.setValue(convertir_a_letras(tfimporteinst.getValue()));
                else
                    tfimporteletras.setValue('');
            },
            blur: function (tf) {
                if (tf.isValid())
                    tfimporteinst.setRawValue(saldo(tfimporteinst.getValue()));
                else
                    tfimporteletras.setValue('');
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                if (e.getKey() != 8) //
                {
                    var value = new String(tf.getValue());
                    var position = value.indexOf(".", 0);
                    if (position > -1 && (e.getKey() == 37 || e.getKey() == 39))// Para que no permita desplazarse hacia izq o der
                        e.stopEvent();
                    if (position > -1 && e.getKey() == 46)// Para que solo permita un punto
                        e.stopEvent();
                    if (position > -1 && (value.length - position) > 2)// Para que solo permita 2 lugares decimales
                        e.stopEvent();
                    if (position == -1 && value.length >= 16 && e.getKey() != 46)// Para que escriba solo 16 caracteres antes del '.'
                        e.stopEvent();
                    if (value.length >= 19)// Para que escriba solo 19 caracteres
                        e.stopEvent();
                    if ((e.getKey() == 13) && (tf.getValue())) {
                        tfimporteinstcont.focus(false, 100);// darle foco  a este campo
                    }
                }
            }
        }
    });

    var tfimporteinstcont = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextImpContable,
        style: 'text-align: right',
        name: 'tfimporteinstcont',
        id: 'tfimporteinstcont',
        disabledClass: 'disabled-component',
        msgTarget: 'qtip',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        width: '100%',
        maxLength: 19,
        maxLengthText: etiquetas.maxLengthText19,
        maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
        regex: /^([0-9.]+ ?[0-9.]*)+$/,
        regexText: etiquetas.regexText19,
        allowNegative: false,
        allowDecimals: true,
        enableKeyEvents: true,
        selectOnFocus: true,
        tabIndex: 6,
        validator: function(value) {
            var val = parseFloat(value);
            if(val == 0.00) {
                return perfil.etiquetas.lbMsgInvalidIC;
            }
            return true;
        },
        listeners: {
            keyup: function (tf, e) {
                if (tf.isValid())
                    tfimporteletrascont.setValue(convertir_a_letras(tfimporteinstcont.getValue()));
                else
                    tfimporteletrascont.setValue('');
            },
            blur: function (tf) {
                if (tf.isValid())
                    tfimporteinstcont.setRawValue(saldo(tfimporteinstcont.getValue()));
                else
                    tfimporteletrascont.setValue('');
            },
            keypress: function (tf, e) { // Para dejar solo 2 decimales
                if (e.getKey() != 8) //
                {
                    var value = new String(tf.getValue());
                    var position = value.indexOf(".", 0);
                    if (position > -1 && (e.getKey() == 37 || e.getKey() == 39)) {// Para que no permita desplazarse hacia izq o der
                        e.stopEvent();
                    }
                    if (position > -1 && e.getKey() == 46) {// Para que solo permita un punto
                        e.stopEvent();
                    }
                    if (position > -1 && (value.length - position) > 2) {// Para que solo permita 2 lugares decimales
                        e.stopEvent();
                    }
                    if (position == -1 && value.length >= 16 && e.getKey() != 46) {// Para que escriba solo 16 caracteres antes del '.'
                        e.stopEvent();
                    }
                    if (value.length >= 19) {// Para que escriba solo 19 caracteres
                        e.stopEvent();
                    }
//                    if ((e.getKey() == 13) && (tf.getValue())) {
//                        triggBeneficiario.focus(false, 100);// darle foco  a este campo
//                    }
                }
            }
        }
    });

    var tfimporteletras = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextImpLetras,
        disabledClass: 'disabled-component',
        name: 'importeletras',
        id: 'importeletras',
        msgTarget: 'qtip',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        readOnly: true,
        disabled: true,
        anchor: '100%'
    });

    var tfimporteletrascont = new Ext.form.TextField({
        fieldLabel: etiquetas.lbtextImpLetras,
        disabledClass: 'disabled-component',
        name: 'importeletrascont',
        id: 'importeletrascont',
        msgTarget: 'qtip',
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        readOnly: true,
        disabled: true,
        anchor: '100%'
    });

    var tacomentarioinst = new Ext.form.TextArea({
        fieldLabel: etiquetas.lbtextComentario,
        name: 'comentarioinstxdepositar',
        id: 'comentarioinstxdepositar',
        disabledClass: 'disabled-component',
        msgTarget: 'qtip',
        // maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-\.\:\(\)\_\+\;]+$/,
        // regex: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-\.\:\(\)\_\+\;]+$/,
        // regexText: etiquetas.regexText,
        maxLength: 255,
        maxLengthText: etiquetas.maxLengthText255,
        allowBlank: false,
        blankText: etiquetas.lbMsgReq,
        anchor: '100%',
        enableKeyEvents: true,
        tabIndex: 10,
        listeners: {
            keypress: function(tf, event) {
                var key = event.getKey();
                if (key == event.ENTER)
                    event.stopEvent();  // Para que no escriba ENTER
            },
            invalid: function(cmp) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            },
            blur: function(cmp) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            }
        }
    });

    //------------------------------------
    //---Nuevo---
    // Store de Tipos
    // Create data store para el Tipos elementos
    sttipo = new Ext.data.SimpleStore({
        //fields:['tipo', 'descripcion'],
        fields: [{
            name: 'tipo',
            type: 'int'
        }, {
            name: 'descripcion',
            type: 'string'
        }],
        data: [[1, 'Cliente'], [2, 'Proveedor'], /*[3, 'Cliente proveedor'], */[4, 'Trabajador']]
    });

    cbxtipobeneficiario = new Ext.form.ComboBox({
        fieldLabel: 'Acreedor/Deudor',
        id: 'cbxtipobeneficiario',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        //style: 'margin:0 0 0 -8',
        emptyText: 'Seleccione...',
        mode: 'local',
        readOnly: true,
        allowBlank: false,
        store: sttipo,
        valueField: 'tipo',
        displayField: 'descripcion',
        hiddenName: 'tipo',
        forceSelection: true,
        anchor: '98%',
        enableKeyEvents: true,
        triggerAction: 'all',
        //typeAhead: true,
        tabIndex: 7,
        listeners: {
            select: function (combo, r, index) {
                //stelementos.removeAll();
            },
            keypress: function (tf, e) {
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
                }
            }
        }
    });

    cbxtipobeneficiario.on('select', function () {
        cbxbeneficiario.clearValue();
        cbxbeneficiario.markInvalid();
        cbxbeneficiario.focus();
        stbeneficiario.reload();
        cbxbeneficiario.enable();
    });
    //------------------

    //Combox "Beneficiario"
    stbeneficiario = new Ext.data.Store({
        url: 'buscarbeneficiario',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'idtipo'
            }, {
                name: 'denomtipo',
                type: 'string'
            }, {
                name: 'nombre'
            }, {
                name: 'codigo'
            }
            ])
    });

    stbeneficiario.on('beforeload', function () {
        stbeneficiario.baseParams.tipo = cbxtipobeneficiario.getValue()
    });

    cbxbeneficiario = new Ext.form.ComboBox({
        //fieldLabel: 'Beneficiario', //perfil.etiquetas.lbcbxbeneficiario,
        hideLabel: true,
        disabledClass: 'disabled-component',
        id: 'cbxbeneficiario',
        tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{codigo} {nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'remote',
        allowBlank: false,
        hideTrigger: false,
        //disabled: true,
        editable: true,
        readOnly: false,
        selectOnFocus: true,
        store: stbeneficiario,
        valueField: 'id',
        displayField: 'nombre',
        labelSeparator: '',
        //hiddenName: 'id',
        forceSelection: true,
        minChars: 1, //Para la nueva busqueda poner contraria esta linea
        pageSize: 10, //Para la nueva busqueda poner contraria esta linea
        anchor: '100%',
        enableKeyEvents: true,
        triggerAction: 'all',
        //typeAhead: true,
        listeners: {
            keypress: function (t, e) {
                if ((e.getKey() == 8) || (e.getKey() == 46)) { // Limpiar el combo
                    cbxbeneficiario.clearValue();
                } else if (e.getKey() == 13) {
                    if (!cbxbeneficiario.getValue())
                        cbxbeneficiario.expand();
                    else
                        cbrecibidopor.focus(false, 100);
                }
            }
        }
    });
    //---------------------------------------

    /*triggBeneficiario = new Ext.form.TriggerField({
        anchor: '100%',
        id: 'triggBeneficiario',
        name: 'triggBeneficiario',
        fieldLabel: etiquetas.lbtextBeneficiario,
        blankText: etiquetas.lbMsgReq,
        triggerClass: 'x-form-search-trigger',
        allowBlank: false,
        maxLength: 255,
        regexText: etiquetas.regexTextLetras,
        enableKeyEvents: true,
        readOnly: true,
        listeners: {
            keypress: function (t, e) {
                if (e.getKey() == 13 && t.getValue() == '') {// Buscar con enter
                    buscarClienteProvedor(triggBeneficiario);
                } else
                    triggEntregadoa.focus();
                if ((e.getKey() == 8) || (e.getKey() == 46)) {// Limpiar el campo
                    triggBeneficiario.reset();
                }
            }
        }
    });

    triggBeneficiario.onTriggerClick = function () {
        buscarClienteProvedor(triggBeneficiario);
    }

    buscarClienteProvedor = function (triggerField) {
        var clienteProvedor = new Ext.DatMaest.ClientProveed.Panel({
            singleSelect: true,
            listeners: {
                scope: this,
                ready: function () {
                    this.windowClienteProveedor.add(clienteProvedor);
                    this.windowClienteProveedor.doLayout();
                    clienteProvedor.stClienteProveedor.load();
                    this.windowClienteProveedor.show();

                    clienteProvedor.grid.on({
                        scope: this,
                        rowdblclick: function (grid, rowIndex, e) {
                            triggerField.value = clienteProvedor.sm.getSelected().data.idclientesproveedores;
                            triggerField.setRawValue(clienteProvedor.sm.getSelected().data.nombre);
                            triggerField.clearInvalid();
                            this.windowClienteProveedor.close();
                            triggerField.focus();
                        },
                        keypress: function (e) {
                            if (e.getKey() == 13) {// Aceptar con enter
                                triggerField.value = clienteProvedor.sm.getSelected().data.idclientesproveedores;
                                triggerField.setRawValue(clienteProvedor.sm.getSelected().data.nombre);
                                triggerField.clearInvalid();
                                this.windowClienteProveedor.close();
                                triggerField.focus();
                            }
                        }
                    });
                }
            }
        });

        this.windowClienteProveedor = new Ext.Window({
            modal: true,
            layout: 'fit',
            id: 'windowPersona',
            title: 'Cliente o proveedor',
            height: Ext.lib.Dom.getViewHeight() * 0.6,
            width: Ext.lib.Dom.getViewWidth() * 0.8,
            closeAction: 'close',
            closable: true,
            plain: false,
            items: [clienteProvedor],
            resizable: true
        });
    }*/
    //--------------------------------------------------
    //-------------
    cbxtiporecibidopor = new Ext.form.ComboBox({
        fieldLabel: 'Recibido por',
        id: 'cbxtiporecibidopor',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        //style: 'margin:0 0 0 -8',
        emptyText: 'Seleccione...',
        mode: 'local',
        readOnly: true,
        store: sttipo,
        allowBlank: true,
        valueField: 'tipo',
        displayField: 'descripcion',
        hiddenName: 'tipo',
        forceSelection: true,
        anchor: '98%',
        enableKeyEvents: true,
        triggerAction: 'all',
        //typeAhead: true,
        tabIndex: 8,
        listeners: {
            select: function (combo, r, index) {
                //stelementos.removeAll();
            },
            keypress: function (tf, e) {
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
                }
            }
        }
    });

    cbxtiporecibidopor.on('select', function () {
        cbrecibidopor.enable();
        cbrecibidopor.clearValue();
        cbrecibidopor.focus(false, 100);
        cbrecibidopor.markInvalid();
        strecibidopor.reload();
    });

    strecibidopor = new Ext.data.Store({
        url: 'buscarbeneficiario',
        //autoLoad: true,
        reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            },
            [{
                name: 'id'
            }, {
                name: 'idtipo'
            }, {
                name: 'denomtipo',
                type: 'string'
            }, {
                name: 'nombre'
            }
            ])
    });

    strecibidopor.on('beforeload', function () {
        strecibidopor.baseParams.tipo = cbxtiporecibidopor.getValue();
    });

    cbrecibidopor = new Ext.form.ComboBox({
        //fieldLabel: 'Recibido por',
        hideLabel: true,
        disabledClass: 'disabled-component',
        id: 'cbrecibidopor',
        tpl: '<tpl for="."><div ext:qtip="{denomtipo}" class="x-combo-list-item">{nombre}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        mode: 'remote',
        hideTrigger: false,
        //allowBlank:false,
        //disabled: true,
        //  editable: true,
        readOnly: false,
        selectOnFocus: true,
        //store: strecibidopor,
        store: strecibidopor,
        valueField: 'id',
        displayField: 'nombre',
        //hiddenName: 'id',
        forceSelection: true,
        anchor: '100%',
        minChars: 1, //Para la nueva busqueda poner contraria esta linea
        pageSize: 10, //Para la nueva busqueda poner contraria esta linea
        enableKeyEvents: true,
        triggerAction: 'all',
        //typeAhead: true,
        /*allowBlank: false,
         blankText :'Este campo es obligatorio.',*/
        listeners: {
            keypress: function (t, e) {
                if (e.getKey() == 8 || e.getKey() == 46) {
                    cbrecibidopor.clearValue();
                } else if (e.getKey() == 13) {
                    if (!cbrecibidopor.getValue())
                        cbxbeneficiario.expand();
                    else
                        cbEspecialidad.focus(false, 100);
                }
            }
        }
    });
    //-----------------------------------------------------

    /*triggEntregadoa = new Ext.form.TriggerField({
        anchor: '100%',
        id: 'triggEntregadoa',
        name: 'triggEntregadoa',
        fieldLabel: etiquetas.lbtextRecibido,
        blankText: etiquetas.lbMsgReq,
        triggerClass: 'x-form-search-trigger',
        allowBlank: false,
        maxLength: 255,
        regexText: etiquetas.regexTextLetras,
        enableKeyEvents: true,
        readOnly: true,
        listeners: {
            keypress: function (t, e) {
                if (e.getKey() == 13 && t.getValue() == '') {// Buscar con enter
                    buscarPersona(triggEntregadoa);
                } else
                    cbEspecialidad.focus();
                if ((e.getKey() == 8) || (e.getKey() == 46)) {// Limpiar el campo
                    triggEntregadoa.reset();
                }
            }
        }
    });

    triggEntregadoa.onTriggerClick = function () {
        buscarPersona(triggEntregadoa);
    }

    buscarPersona = function (triggerField) {

        this.btnCancelarBusPer = new Ext.Button({
            text: etiquetas.lbCancelar,
            tooltip: etiquetas.lbToolCancelar,
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: 'btnCancelarBusPer',
            scope: this,
            handler: function () {
                this.windowPersona.close();
            }
        });

        this.btnAceptarBusPer = new Ext.Button({
            text: etiquetas.lbAceptar,
            tooltip: etiquetas.lbToolAceptar,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this,
            id: 'btnAceptarBusPer',
            handler: function () {
                if (this.panelPersona.getSeleccion()) {
                    var idPersona = this.panelPersona.getSeleccion().get('idpersona');
                    var nombre = '';
                    if (this.panelPersona.getSeleccion().get('snombre')) {
                        nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('snombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                    } else {
                        nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                    }
                    this.windowPersona.close();
                }
            }
        });

        this.windowPersona = new Ext.Window({
            modal: true,
            layout: 'fit',
            id: 'windowPersona',
            title: 'Buscar persona',
            height: Ext.lib.Dom.getViewHeight() * 0.5,
            width: Ext.lib.Dom.getViewWidth() * 0.7,
            closeAction: 'close',
            closable: true,
            plain: false,
            items: [this.panelPersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                seguridad: 0,
                limit: 15,
                start: 0
            })],
            resizable: true
            //buttons: [this.btnCancelarBusPer, this.btnAceptarBusPer]
        });
        this.windowPersona.show();

        this.panelPersona.gpPersonas.on({
            scope: this,
            rowdblclick: function (grid, rowIndex, e) {
                triggerField.value = this.panelPersona.getSeleccion().get('idpersona');
                var nombre = '';
                if (this.panelPersona.getSeleccion().get('snombre')) {
                    nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('snombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                } else {
                    nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                }
                triggerField.setRawValue(nombre);
                triggerField.clearInvalid();
                this.windowPersona.close();
                triggerField.focus();
            },
            keypress: function (e) {
                if (e.getKey() == 13) {// Aceptar con enter
                    triggerField.value = this.panelPersona.getSeleccion().get('idpersona');
                    var nombre = '';
                    if (this.panelPersona.getSeleccion().get('snombre')) {
                        nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('snombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                    } else {
                        nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                    }
                    triggerField.setRawValue(nombre);
                    triggerField.clearInvalid();
                    this.windowPersona.close();
                    triggerField.focus();
                }
            }
        });

    }*/

    var panelcomboxcuenta = new Ext.Panel({
        layout: 'fit',
        items: [{
            items: [{
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .33,
                    items: [tfnroinstrumento]
                }, {
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .33,
                    items: [dffecharecepcion]
                }, {
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .34,
                    items: [tfnrosolicitud]
                }]
            }]
        }]
    });


//Panel q agrupa Beneficiaro/Botón, Recibido por/Botón, Especialidad
    var beneficiariopnel = new Ext.Panel({
        layout: 'form',
        items: [{
            items: [{
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    //columnWidth: .87,
                    columnWidth: .20,
                    style: 'margin:0 0 0 0',
                    layout: 'form',
                    //items: [cbxbeneficiario, cbrecibidopor, cbEspecialidad2]
                    items: [/*btnbeneficiario, */cbxtipobeneficiario/*, cbxtiporecibidopor*/]
                }, {
                    style: 'margin:15 0 0 0',
                    layout: 'form',
                    columnWidth: .80,
                    //items: [triggBeneficiario, triggEntregadoa]
                    items: [cbxbeneficiario/*, cbrecibidopor*/]
                }]
            },
//            {
//                labelAlign: 'top',
//                autoHeight: true,
//                layout: 'column',
//                items: [{
//                    //columnWidth: .87,
//                    columnWidth: .20,
//                    style: 'margin:0 0 0 5',
//                    layout: 'form',
//                    //items: [cbxbeneficiario, cbrecibidopor, cbEspecialidad2]
//                    items: [/*btnbeneficiario, cbxtipobeneficiario,*/ cbxtiporecibidopor]
//                }, {
//                    style: 'margin:15 0 0 0',
//                    layout: 'form',
//                    columnWidth: .80,
//                    //items: [triggBeneficiario, triggEntregadoa]
//                    items: [/*cbxbeneficiario, */cbrecibidopor]
//                }]
//            },
            {
                layout: 'form',
                columnWidth: 1,
                items: [cbEspecialidad]
            }
            ]
        }]
    });

    var idinstrumentobancario = new Ext.form.Hidden({
        name: 'idinstrumentobancario',
        id: 'idinstrumentobancario'
    });
    var fpInstTrans = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        border: true,
        layout: 'form',
        autoHeight: true,
        modal: true,
        plain: true,
        trackResetOnLoad: true,
        bodyStyle: 'padding:10px 10px 0px 10px',
        items: [{
            items: [{
                labelAlign: 'top',
                layout: 'column',
                items: [{
                    labelAlign: 'top',
                    layout: 'form',
                    columnWidth: .30,
                    items: [{
                        items: [{
                            layout: 'form',
                            items: [cbxtipoinstrumento]
                        }, {
                            layout: 'form',
                            items: [tfimporteinst]
                        }/*, {
                            layout: 'form',
                            items: [tfimporteinstcont]
                        }*/]
                    }]
                }, {
                    layout: 'form',
                    columnWidth: .70,
                    items: [{
                        items: [{
                            autoHeight: true,
                            items: [{
                                labelAlign: 'top',
                                layout: 'column',
                                items: [{
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .3,
                                    items: [tfnroinstrumento]
                                }, {
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .35,
                                    items: [dffecharecepcion]
                                }, {
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .35,
                                    items: [tfnrosolicitud]
                                }]
                            }]
                        }, {
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            columnWidth: 1,
                            items: [tfimporteletras]
                        }/*, {
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            columnWidth: 1,
                            items: [tfimporteletrascont]
                        }*/]
                    }]
                }]
            }, {
                layout: 'form',
                autoHeight: true,
                columnWidth: 1,
                items: [beneficiariopnel]
            }, {
                layout: 'form',
                autoHeight: true,
                columnWidth: 1,
                items: [tacomentarioinst]
            }
            ]
        }
        ]

    });


    var aplicarmodinst = new Ext.Button({
//        icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        text: etiquetas.lbBtnAplicar,
        tooltip: etiquetas.lbBtnTooltipAplicar,
        tabIndex: 12,
        handler: function () {
            //triggBeneficiario.isValid(false);
            //triggEntregadoa.isValid(false);
            var flag = true;
            if ((tfimporteinst.getValue() == 0.00) || (tfimporteinstcont.getValue() == 0.00))
                flag = false;
            if (fpInstTrans.getForm().isValid() && cbxbeneficiario.getRawValue() && verificaDecimales(tfimporteinst) /*&& verificaDecimales(tfimporteinstcont)*/ && flag) {
                if (gridbanco == 1) {
                    newRecord = new recbancouno({
                        numerodocumento: tfnroinstrumento.getValue(),
                        idinstrumentobancario: 0,
                        fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                        importemo: tfimporteinst.getValue(),
                        importemb: tfimporteinstcont.getValue(),
                        denominacion: cbxtipoinstrumento.getRawValue(),
                        comentario: tacomentarioinst.getValue(),
                        idtipodocumento: cbxtipoinstrumento.getValue(),
                        idbeneficiario: cbxbeneficiario.getValue(),
                        beneficiario: cbxbeneficiario.getRawValue(),
                        tipob: cbxtipobeneficiario.getValue(),
                        //tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                        idrecibe: cbrecibidopor.getValue(),
                        recibe: cbrecibidopor.getRawValue(),
                        tipor: cbxtiporecibidopor.getValue(),
                        //tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                        idsolicitud: tfnrosolicitud.getValue(),
                        idespecialidad: cbEspecialidad.getValue(),
                        descripcionespecialidad: cbEspecialidad.getRawValue()
                    });
                    if (modificar == true) {
                        index = stbancouno.indexOf(smbancouno.getSelected());
                        stbancouno.remove(smbancouno.getSelected());
                        newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                        stbancouno.insert(index, newRecord);
                        smbancouno.selectRow(index);
                    }
                    else {
                        stbancouno.add(newRecord);
                        //fpInstTrans.getForm().reset();
                        cleanForm(true);
                    }
                }
                else {
                    newRecord = new recbancodos({
                        numerodocumento: tfnroinstrumento.getValue(),
                        idinstrumentobancario: 0,
                        fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                        importemo: tfimporteinst.getValue(),
                        importemb: tfimporteinstcont.getValue(),
                        denominacion: cbxtipoinstrumento.getRawValue(),
                        comentario: tacomentarioinst.getValue(),
                        idtipodocumento: cbxtipoinstrumento.getValue(),
                        idbeneficiario: cbxbeneficiario.getValue(),
                        beneficiario: cbxbeneficiario.getRawValue(),
                        tipob: cbxtipobeneficiario.getValue(),
                        //tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                        idrecibe: cbrecibidopor.getValue(),
                        recibe: cbrecibidopor.getRawValue(),
                        tipor: cbxtiporecibidopor.getValue(),
                        //tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                        idsolicitud: tfnrosolicitud.getValue(),
                        idespecialidad: cbEspecialidad.getValue(),
                        descripcionespecialidad: cbEspecialidad.getRawValue()
                    });
                    if (modificar == true) {
                        index = stbancodos.indexOf(smbancodos.getSelected());
                        stbancodos.remove(smbancodos.getSelected());
                        newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                        stbancodos.insert(index, newRecord);
                        smbancodos.selectRow(index);
                    }
                    else {
                        stbancodos.add(newRecord);
                        //fpInstTrans.getForm().reset();
                        cleanForm(true);
                    }
                }
                CalcularSaldos();
                cbxtipoinstrumento.focus(true, true);
            } else {
                mostrarMensaje(1, perfil.etiquetas.lbMsgDIncorr);
                if (tfimporteinst.getValue() == '0.00')
                    tfimporteinst.markInvalid(perfil.etiquetas.lbMsgInvalidIO);
                if (tfimporteinstcont.getValue() == '0.00')
                    tfimporteinstcont.markInvalid(perfil.etiquetas.lbMsgInvalidIC);
            }
        }
    });

    var winInstTrans = new Ext.Window({
        autoValidate: true,
        modal: true,
        resizable: true,
        constrain: true,
        closeAction: 'hide',
        layout: 'fit',
        autoHeight: true,
        plain: true,
        width: 780,
        height: 300,
        items: [fpInstTrans],
        listeners: {
            show: function(window) {
                var btnaccept = window.buttons[2];
                var btncancel = window.buttons[0];

                btnaccept.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        stopEvent: true,
                        fn: function() {
                            cbxtipoinstrumento.focus(true, true);
                        }
                    }
                ]);

                btncancel.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        //stopEvent: true,
                        fn: function() {
                            if(btnaccept.disabled) {
                                cbxtipoinstrumento.focus(true, true);
                            }
                        }
                    }
                ]);

                cbxtipoinstrumento.getEl().addKeyMap([
                    {
                        key: Ext.EventObject.TAB,
                        shift: true,
                        stopEvent: true,
                        fn: function() {
                            if(btnaccept.disabled) {
                                btncancel.focus();
                            }
                            else {
                                btnaccept.focus();
                            }
                        }
                    }
                ]);

                if(modificar) {
                    window.autoValidate = false;
                    btnaccept.setDisabled(true);
                    startTaskValidation(fpInstTrans.getForm(), 'mod', [btnaccept]);
                }
                else {
                    window.autoValidate = true;
                }
                fpInstTrans.getForm().isValid();
            },
            hide: function() {
                stopTaskValidation();
                cbEspecialidad.setValue('');
            }
        },
        buttons: [{
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: etiquetas.lbBtnCancelar,
            tooltip: etiquetas.lbBtnTooltipCancelar,
            tabIndex: 11,
            handler: function () {
                modificar = false;
                winInstTrans.hide();
                //fpInstTrans.getForm().reset();
                cleanForm(true);
            }
        },
            aplicarmodinst,
            {
//                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                text: etiquetas.lbBtnAceptar,
                tooltip: etiquetas.lbBtnTooltipAceptar,
                tabIndex: 13,
                handler: function () {
                    //triggBeneficiario.isValid(false);
                    //triggEntregadoa.isValid(false);
                    var flag = true;
                    if ((tfimporteinst.getValue() == 0.00) || (tfimporteinstcont.getValue() == 0.00))
                        flag = false;
                    if (fpInstTrans.getForm().isValid() && cbxtipobeneficiario.getValue() && verificaDecimales(tfimporteinst) /*&& verificaDecimales(tfimporteinstcont)*/ && flag) {
                        if (gridbanco == 1) {
                            newRecord = new recbancouno({
                                numerodocumento: tfnroinstrumento.getValue(),
                                idinstrumentobancario: 0,
                                fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                                importemo: tfimporteinst.getValue(),
                                importemb: tfimporteinst.getValue(), //tfimporteinstcont.getValue(),
                                denominacion: cbxtipoinstrumento.getRawValue(),
                                comentario: tacomentarioinst.getValue(),
                                idtipodocumento: cbxtipoinstrumento.getValue(),
                                idbeneficiario: cbxbeneficiario.getValue(),
                                beneficiario: cbxbeneficiario.getRawValue(),
                                tipob: cbxtipobeneficiario.getValue(),
                                //tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                                idrecibe: cbrecibidopor.getValue(),
                                recibe: cbrecibidopor.getRawValue(),
                                tipor: cbxtiporecibidopor.getValue(),
                                //tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                                idsolicitud: tfnrosolicitud.getValue(),
                                idespecialidad: cbEspecialidad.getValue(),
                                descripcionespecialidad: cbEspecialidad.getRawValue()
                            });
                            if (modificar == true) {
                                index = stbancouno.indexOf(smbancouno.getSelected());
                                stbancouno.remove(smbancouno.getSelected());
                                newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                                stbancouno.insert(index, newRecord);
                            }
                            else
                                stbancouno.add(newRecord);
                        }
                        else {
                            newRecord = new recbancodos({
                                numerodocumento: tfnroinstrumento.getValue(),
                                idinstrumentobancario: 0,
                                fecharecepcion: dffecharecepcion.getValue().format('d/m/Y'),
                                importemo: tfimporteinst.getValue(),
                                importemb: tfimporteinst.getValue(), //tfimporteinstcont.getValue(),
                                denominacion: cbxtipoinstrumento.getRawValue(),
                                comentario: tacomentarioinst.getValue(),
                                idtipodocumento: cbxtipoinstrumento.getValue(),
                                idbeneficiario: cbxbeneficiario.getValue(),
                                beneficiario: cbxbeneficiario.getRawValue(),
                                tipob: cbxtipobeneficiario.getValue(),
                                //tipob: stbeneficiario.getAt(0).get('tipo'), // Persona Ext, Cliente, Proveed, etc
                                idrecibe: cbrecibidopor.getValue(),
                                recibe: cbrecibidopor.getRawValue(),
                                tipor: cbxtiporecibidopor.getValue(),
                                //tipor: (cbxentregadoa.getValue()) ? stentregadoa.getAt(0).get('tipo') : '', // Persona Ext, Cliente, Proveed, etc
                                idsolicitud: tfnrosolicitud.getValue(),
                                idespecialidad: cbEspecialidad.getValue(),
                                descripcionespecialidad: cbEspecialidad.getRawValue()
                            });
                            if (modificar == true) {
                                var index = stbancodos.indexOf(smbancodos.getSelected());
                                stbancodos.remove(smbancodos.getSelected());
                                newRecord.set('idinstrumentobancario', idinstrumentobancario.getValue());
                                stbancodos.insert(index, newRecord);
                            }
                            else
                                stbancodos.add(newRecord);
                        }
                        modificar = false;
                        winInstTrans.hide();
                        //fpInstTrans.getForm().reset();
                        cleanForm(true);
                        CalcularSaldos();
                    } else {
                        mostrarMensaje(1, etiquetas.lbMsgDIncorr);
                        if (tfimporteinst.getValue() == '0.00')
                            tfimporteinst.markInvalid(etiquetas.lbMsgInvalidIO);
                        if (tfimporteinstcont.getValue() == '0.00')
                            tfimporteinstcont.markInvalid(etiquetas.lbMsgInvalidIO);
                    }
                }
            }]
    });


    /*******************************************************************************/
    //////////////////////      INTERFAZ PRINCIPAL (GRID banco) //////////////////
    /*******************************************************************************/

    /* BOTON Adicionar    */
    var btnnuevo = new Ext.Button({
        text: etiquetas.lbBtnAdicionar,
        disabled: false,
        id: 'btnnuevo',
        tooltip: etiquetas.lbTooltipAdd,
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        handler: function () {
            addconcilcargaI();
        },
        abreviatura: 'add_conciliacionesiniciales'

    });
    validate.addButton(btnnuevo);
    // alt:true, shift: true, ctrl: true     ->   ctrlKey: true,   Esc Key = 27
    globalKeyMap.accessKey({
        key: 'i',
        alt: true
    }, function () {
        if (!btnnuevo.disabled && !Ext.getCmp('viewPort').disabled && !windowopen)
            addconcilcargaI();
    }, Ext.getBody());


    function addconcilcargaI() {
        windowopen = true;
        // if (idcuentabancaria){
        acc = 'ins';
        cambio = false;
        //btnA.setDisabled(false);
        cargarDatosiniciales(0);
        /* 	  }
         else
         mostrarMensaje(1,'Seleccione una cuenta bancaria primero.');  */
    }

    /* BOTON Modificar    */
    var btnmodificar = new Ext.Button({
        text: etiquetas.lbBtnModificar,
        disabled: true,
        id: 'btnmodificar',
        tooltip: etiquetas.lbTooltipMod,
        //hidden:true,
//        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        handler: function () {
            modconcilcargaI();

        },
        abreviatura: 'add_conciliacionesiniciales'

    });
    validate.addButton(btnmodificar);

    function modconcilcargaI() {
        windowopen = true;
        if (idcuentabancaria != 0) {
            acc = 'mod';
            cambio = false;
            // btnA.setDisabled(true);
            cargarDatosiniciales(idcuentabancaria);
        } else
            //mostrarMensaje(1, 'Seleccione una cuenta bancaria primero.');
            mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
    }

    globalKeyMap.accessKey({
        key: 'm',
        alt: true
    }, function () {
        if (!btnmodificar.disabled && !Ext.getCmp('viewPort').disabled && !windowopen)
            modconcilcargaI();
    }, Ext.getBody());

    /*  BOTON para cambiar el estado del banco (Estado Cancelar)  */
    var btneliminar = new Ext.Button({
        text: etiquetas.lbBtnEliminar,
        tooltip: etiquetas.lbTooltipElim,
        disabled: true,
        id: 'btneliminar',
        //hidden:true,
//        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        handler: function () {
            windowopen = true;
            if (idcuentabancaria) {
                mostrarMensaje(2, etiquetas.lbMsgEliminando, elimina);
            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
        },
        abreviatura: 'del_conciliacionesiniciales'

    });
    validate.addButton(btneliminar);
    //Ocultando primero todos los botones
    //Validando permisos de acceso a los recurdos en los botones
    validate.checkPermisos();

    globalKeyMap.accessKey({
        key: Ext.EventObject.DELETE
    }, function () {
        if (!btneliminar.disabled && !windowopen) {
            windowopen = true;
            if (idcuentabancaria) {
                mostrarMensaje(2, etiquetas.lbMsgEliminando, elimina);
                // mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere eliminar la conciliaci&oacute;n de la cuenta bancaria seleccionada?', elimina);

            }
            else
                mostrarMensaje(1, etiquetas.lbMsgSinseleccion);
            // mostrarMensaje(1, 'Seleccione una cuenta bancaria primero.');
        }

    }, Ext.getBody());

    //barra de progreso  //Ext.MessageBox.hide(); para ocultar  la  mask
    function loadMessageBox(msg) {
        Ext.MessageBox.show({
            title: etiquetas.lbMsgEspere,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    }
    ;

    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            loadMessageBox(etiquetas.lbMsgtitleElim);

            Ext.Ajax.request({
                url: 'eliminar',
                method: 'POST',
                params: {
                    idcuenta: idcuentabancaria,
                    idconciliacion: Ext.getCmp('gpbanco').getSelectionModel().getSelected().data.idconciliacion
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData == undefined) {
                        Ext.MessageBox.hide();
                        windowopen = false;
                        mostrarMensaje(3, etiquetas.lbMsgElimNA);
                    }
                    else {
                        if (responseData.n_codMsg != undefined) {
                            Ext.MessageBox.hide();
                            windowopen = false;
                            mostrarMensaje(responseData.n_codMsg, responseData.mensaje);
                        }
                        else {
                            var result = eval(response.responseText);
                            //var result = response.responseText;
                            switch (result) {
                                case 1:
                                    windowopen = false;
                                    Ext.MessageBox.hide();
                                    mostrarMensaje(1, etiquetas.lbMsgExistoElim);
                                    stbanco.reload();
                                    // Limpiar los grid de abajo aquii
                                    gridinsttransito.getStore().removeAll();
                                    gpinstdepositar.getStore().removeAll();
                                    gpdiferenciabanc.getStore().removeAll();
                                    break;
                                case 2:
                                    Ext.MessageBox.hide();
                                    windowopen = false;
                                    mostrarMensaje(3, etiquetas.lbMsgElimNA);
                                    break;
                                default:
                                    Ext.MessageBox.hide();
                                    windowopen = false;
                                    mostrarMensaje(3, etiquetas.lbMsgElimErrores);
                                    break;
                            }
                        }
                    }
                }
            });
        } else {
            windowopen = false;
        }
    }

    // boton ayuda apertura
    var btnAyuda = new Ext.Button({
        id: 'btnAyudaCI',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: etiquetas.lbTooltipAyuda,
        text: etiquetas.lbBtnAyuda
    });

    //Label para mostrar el período actual
    var labelPeriodo = new Ext.form.Label({
        id: 'labelPeriodo',
        style: 'font-weight: bold;'
    });

    globalKeyMap.accessKey({
        key: 'h',
        alt: true
    }, function () {
        if (!Ext.getCmp('viewPort').disabled && (Ext.EventObject.ctrlKey == 0))
            help.show(etiquetas.lbTitleAyuda, 'confin/banco/carga_inicial/apertura');
    }, Ext.getBody());

    /* Json de grid banco    */
    var rdbanco = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cantidad',
            id: 'rdbanco'
        },
        [
            {
                name: 'idcuentabancaria',
                type: 'string'
            },
            {
                name: 'nrocuenta'
            },
            {
                name: 'idmoneda',
                type: 'string'
            },
            {
                name: 'nombremoneda'
            },
            {
                name: 'tieneconciliacion',
                type: 'int'
            },
            {
                name: 'fecha'
            },
            {
                name: 'saldoenlibromo'
            },
            {
                name: 'saldoenbancomo'
            },
            {
                name: 'idconciliacion'
            },
            {
                name: 'conciliado'
            },
            {
                name: 'imgconciliado'
            }//,
            //{name : 'estado'}
        ]);

    /* tipo de seleccion del grid banco    */
    var smbanco = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });


    /* store de grid banco    */
    stbanco = new Ext.data.Store({
        url: 'cargargridcuentas',
        sortInfo: {
            field: 'fecha',
            direction: 'ASC'
        }, // DESC
        reader: rdbanco
    });


    /* grid de grid banco    */
    var gpbanco = new Ext.grid.GridPanel({
        store: stbanco,
        id: 'gpbanco',
        border: false,
        region: 'center',
        //width: screen.width < 1024 ? 400 : 980,
        //height: screen.height < 768 ? 215 : 360,
        selModel: smbanco,
        autoScroll: true,
        loadMask: lMask,
        columns: [
            {
                header: etiquetas.lbCamNocta,
                width: 200,
                sortable: true,
                dataIndex: 'nrocuenta'
            },
            {
                header: etiquetas.lbCamMoneda,
                width: 140,
                sortable: true,
                dataIndex: 'nombremoneda'
            },
            {
                header: etiquetas.lbCamSaldolibro,
                width: 200,
                sortable: true,
                dataIndex: 'saldoenlibromo',
                renderer: formatoMoneda,
                align: 'right'
            },
            {
                header: etiquetas.lbCamSaldobanco,
                width: 200,
                sortable: true,
                dataIndex: 'saldoenbancomo',
                renderer: formatoMoneda,
                align: 'right'
            },
            {
                header: etiquetas.lbCamFechaconc,
                width: 200,
                sortable: true,
                dataIndex: 'fecha',
                //renderer: 'erpFecha',
                align: 'center'
            }, {
                header: etiquetas.lbCamConc,
                align: 'center',
                renderer: showImage,
                width: 60,
                dataIndex: 'imgconciliado'
            }

            //,
            //{header : 'Estado', width : 200, sortable : true, dataIndex : 'estado', align:'center'}
        ],
        viewConfig: {
            forceFit: true
        },
        tbar: [btnnuevo, btnmodificar, btneliminar, '->', labelPeriodo, '-', btnAyuda],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stbanco,
            displayInfo: true
        }),
        listeners: {
            rowclick: function (grid, rowIndex, e) {
                /* evento de seleccion grid instrumento    */
                idcuentabancaria = stbanco.data.items[rowIndex].get('idcuentabancaria');

                var seleccionados = smbanco.getSelections();
                if (seleccionados.length == 1) {
                    btnmodificar.setDisabled(false);
                    btneliminar.setDisabled(false);
                }
                else if (seleccionados.length > 1) {
                    btnmodificar.setDisabled(true);
                    btneliminar.setDisabled(true);

                    fpdatosconciliacion.collapse();
                    vaciarTab();
                }
                else {
                    btnmodificar.setDisabled(true);
                    btneliminar.setDisabled(true);

                    fpdatosconciliacion.collapse();
                    vaciarTab();
                }
            },
            rowdblclick: function (Grid, rowIndex, e) {
                /* Evento para cargar los Tab  */
                cargarTab();
            }
        }
    });

    stbanco.on('beforeload', function (s, options) {
        stbanco.clearFilter(true);
        if (stbanco.getCount()) {
            smbanco.selectFirstRow();
            gpbanco.fireEvent('rowclick', this.gpbanco, 0, 0);
        }
        btnmodificar.setDisabled(true);
        btneliminar.setDisabled(true);
    });

    stbanco.on('load', function (store, records, opt) {
        stbanco.clearFilter(true);
        if (stbanco.getCount()) {
            smbanco.selectFirstRow();
            gpbanco.fireEvent('rowclick', this.gpbanco, 0, 0);
        }
    });

    /* grid instrumento en transito para mostrar informaci�n */
    var rdinsttransito = new Ext.data.Record.create([
        {
            name: 'iddocumento',
            type: 'string'
        },
        {
            name: 'numerodocumento',
            type: 'string'
        },
        {
            name: 'denominacion',
            type: 'string'
        },
        {
            name: 'importemo',
            type: 'float'
        },
        {
            name: 'fecharecepcion'
        }
    ]);


    var rdmgrid = new Ext.data.JsonReader({
        totalProperty: 'cant',
        root: "rows"
    }, [
        {
            name: 'iddocumento',
            type: 'string'
        },
        {
            name: 'numerodocumento',
            type: 'string'
        },
        {
            name: 'denominacion',
            type: 'string'
        },
        {
            name: 'importemo',
            type: 'float'
        },
        {
            name: 'fecharecepcion'
        },
        {
            name: 'comentario'
        }
    ]);

    //-------------------JsonReader del grid de las operaciones Modificar---------------------//
    /*  Store del grid instrumento en transito */
    var stinsttransito = new Ext.data.Store({
        url: ' cargarTabinsttransito',
        sortInfo: {
            field: 'fecharecepcion',
            direction: 'ASC'
        }, // DESC
        id: 'stinsttransito',
        /*
         reader : new Ext.data.ArrayReader({
         id : 'readerinstrumtransito'
         }, rdinsttransito),
         */
        reader: rdmgrid,
        listeners: {
            beforeload: function (s, options) {
                stinsttransito.clearFilter(true);
                if (smbanco.getSelected())
                    stinsttransito.baseParams.idcuenta = smbanco.getSelected().data.idcuentabancaria;
                else
                    return false;
            }
        }
    });

    var sminsttransito = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    /*  Columnas del Grid instrumento en transito */
    var cminsttransito = new Ext.grid.ColumnModel([
        {
            header: etiquetas.lbCamNodoc,
            sortable: true,
            width: 200,
            dataIndex: 'numerodocumento'
        },
        {
            header: etiquetas.lbCamTopo,
            sortable: true,
            width: 200,
            dataIndex: 'denominacion'
        },
        {
            header: etiquetas.lbCamImporte,
            sortable: true,
            width: 150,
            align: 'right',
            dataIndex: 'importemo',
            renderer: formatoMonedaABS
        },
        {
            header: etiquetas.lbCamFecha,
            sortable: true,
            width: 100,
            align: 'center',
            dataIndex: 'fecharecepcion'
            //renderer: 'erpFecha'
        },
        {
            header: etiquetas.lbCamDescrip,
            sortable: true,
            width: 200,
            id: 'comentario',
            dataIndex: 'comentario'
        }
    ]);

    gridinsttransito = new Ext.grid.GridPanel({
        id: 'gridinsttransito',
        store: stinsttransito,
        sm: sminsttransito,
        autoExpandColumn: 'comentario',
        height: 100,
        width: 980,
        autoScroll: true,
        frame: true,
        loadMask: true,
        cm: cminsttransito
    });

    /* grid instrumento por depositar para mostrar informaci�n */
    var rdinstdepositar = new Ext.data.Record.create(
        [
            {
                name: 'iddocumento',
                type: 'string'
            },
            {
                name: 'numerodocumento',
                type: 'string'
            },
            {
                name: 'denominacion',
                type: 'string'
            },
            {
                name: 'importemo',
                type: 'float'
            },
            {
                name: 'fecharecepcion'
            },
            {
                name: 'comentario'
            }
        ]);
    /*  Store del grid instrumento por depositar */
    var stinstdepositar = new Ext.data.Store({
        url: 'cargarTabinstdepositar',
        sortInfo: {
            field: 'fecharecepcion',
            direction: 'ASC'
        }, // DESC
        id: 'stinstdepositarr',
        reader: new Ext.data.JsonReader({
            totalProperty: 'cant',
            root: "rows"
        }, rdinstdepositar),
        listeners: {
            beforeload: function (s, options) {
                stinstdepositar.clearFilter(true);
                if (smbanco.getSelected())
                    stinstdepositar.baseParams.idcuenta = smbanco.getSelected().data.idcuentabancaria;
                else
                    return false;
            }
        }
    });

    var sminstdepositar = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    /*  Columnas del Grid instrumento por depositar */
    var cminstdepositar = new Ext.grid.ColumnModel([
        {
            header: etiquetas.lbCamNodoc,
            sortable: true,
            width: 200,
            dataIndex: 'numerodocumento'
        },
        {
            header: etiquetas.lbCamTopo,
            sortable: true,
            width: 200,
            dataIndex: 'denominacion'
        },
        {
            header: etiquetas.lbCamImporte,
            sortable: true,
            width: 150,
            dataIndex: 'importemo',
            align: 'right',
            renderer: formatoMonedaABS
        },
        {
            header: etiquetas.lbCamFecha,
            sortable: true,
            width: 100,
            dataIndex: 'fecharecepcion',
            align: 'center'
            //renderer: 'erpFecha'
        },
        {
            header: etiquetas.lbCamDescrip,
            sortable: true,
            width: 200,
            id: 'comentario',
            dataIndex: 'comentario'
        }
    ]);


    var gpinstdepositar = new Ext.grid.GridPanel({
        store: stinstdepositar,
        sm: sminstdepositar,
        autoExpandColumn: 'comentario',
        height: 100,
        width: 300,
        autoScroll: false,
        shadow: false,
        frame: true,
        loadMask: true,
        cm: cminstdepositar
    });


    /* grid diferencias con banco para mostrar informaci�n */
    var rddiferenciabanc = new Ext.data.Record.create([
        {
            name: 'nroestado',
            type: 'string'
        },
        {
            name: 'debito',
            type: 'float'
        },
        {
            name: 'credito',
            type: 'float'
        },
        {
            name: 'comentario',
            type: 'string'
        }
    ]);

    /*  Store del grid diferencias con banco */
    var stdiferenciabanc = new Ext.data.Store({
        url: 'cargarTabdiferenciabanc',
        sortInfo: {
            field: 'nroestado',
            direction: 'ASC'
        }, // DESC
        id: stdiferenciabanc,
        reader: new Ext.data.JsonReader({
            totalProperty: 'cant',
            root: "rows"
        }, rddiferenciabanc),
        listeners: {
            beforeload: function (s, options) {
                stdiferenciabanc.clearFilter(true);
                if (smbanco.getSelected())
                    stdiferenciabanc.baseParams.idcuenta = smbanco.getSelected().data.idcuentabancaria;
                else
                    return false;
            }
        }
    });

    var smdiferenciabanc = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    /*  Columnas del Grid Liquidar */
    var cmdiferenciabanc = new Ext.grid.ColumnModel([
        {
            header: etiquetas.lbCamNoestadocta,
            sortable: true,
            width: 200,
            dataIndex: 'nroestado'
        },
        {
            header: etiquetas.lbCamDebito,
            sortable: true,
            width: 200,
            align: 'right',
            dataIndex: 'debito',
            renderer: formatoMonedaABS
        },
        {
            header: etiquetas.lbCamCredito,
            sortable: true,
            width: 200,
            align: 'right',
            dataIndex: 'credito',
            renderer: formatoMonedaABS
        },
        {
            header: etiquetas.lbCamDescrip,
            sortable: true,
            width: 200,
            id: 'comentario',
            dataIndex: 'comentario'
        }
    ]);

    var gpdiferenciabanc = new Ext.grid.GridPanel({
        store: stdiferenciabanc,
        autoShow: true,
        sm: smdiferenciabanc,
        autoExpandColumn: 'comentario',
        height: 100,
        width: 300,
        autoScroll: false,
        shadow: false,
        frame: true,
        loadMask: true,
        cm: cmdiferenciabanc
    });

    // *************************Grid(fin)*********************************************************************************************************************************************
    var tpbanco = new Ext.TabPanel({
        activeTab: 0,
        defaults: {
            autoScroll: true
        },
        border: false,
        items: [{
            id: 'tab1',
            title: etiquetas.lbTabpTPIT,
            layout: 'fit',
            items: gridinsttransito
        }, {
            id: 'tab2',
            title: etiquetas.lbTabpTPID,
            layout: 'fit',
            items: gpinstdepositar
        }, {
            id: 'tab3',
            title: etiquetas.lbTabpTPD,
            layout: 'fit',
            items: gpdiferenciabanc
        }]
    });

    var fpdatosconciliacion = new Ext.FormPanel({
        region: 'south',
        title: etiquetas.lbTitleTabp,
        split: true,
        height: screen.height / 3,
        collapsible: true,
        collapsed: true,
        layout: 'fit',
        items: [tpbanco]
    });

    var vp = new Ext.Viewport({
        layout: 'border',
        id: 'viewPort',
        items: [gpbanco, fpdatosconciliacion/*tpbanco*/]
    });
    /*******************************************************************************/
    /////////////////////////    Funciones   ////////////////////////
    /*******************************************************************************/


    function MostrarEtiquetas(componente, mensaje) {
        lMask = new Ext.LoadMask(componente, {
            msg: mensaje
        });
        lMask.show();
    }

    /*stbanco.load({
     callback: function(options, success, response) {
     lMask.hide();
     if (stbanco.getCount()) {
     smbanco.selectFirstRow();
     gpbanco.fireEvent('rowclick', this.gpbanco, 0, 0);
     }
     }
     });*/

    //muestra la img de si esta conciliado o no
    function showImage(value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.conciliado == 1) {
            metaData.attr = 'ext:qtip="' + '<b>Conciliada</b>"';
            return '<img ext:qtip="<b>Conciliada</b>" src="' + value + '" alt="' + record.get('imgconciliado') + '" style="width:16px">';
        } else {
            metaData.attr = 'ext:qtip="' + '<b>No conciliada</b>"';
            return '<img ext:qtip="<b>No conciliada</b>" src="' + value + '" alt="' + record.get('imgconciliado') + '" style="width:16px">';
        }
    }

    function cargarTab() {
        stdiferenciabanc.reload();
        stinstdepositar.reload();
        stinsttransito.reload();
        fpdatosconciliacion.expand();
        /*se expande el panel de las operaciones*/ //Adry
    }


    function vaciarTab() {
        var array = new Array();
        stdiferenciabanc.loadData({
            'cant': 0,
            'rows': array
        });
        stinstdepositar.loadData({
            'cant': 0,
            'rows': array
        });
        stinsttransito.loadData({
            'cant': 0,
            'rows': array
        });
    }

    vaciarTab();

    function cargarTabs() {
        arraystinsttransito = new Array();
        arraystinstdepositar = new Array();
        arraystdiferenciabanc = new Array();
        stdiferenciabanc.removeAll();
        stinstdepositar.removeAll();
        stinsttransito.removeAll();
        MostrarEtiquetas(tpbanco.id, etiquetas.lbload);
        Ext.Ajax.request({
            url: 'cargartabs',
            method: 'POST',
            params: {
                idcuenta: idcuentabancaria
            },
            callback: function (options, success, response) {
                if (success) {
                    jsonlibrobanco = response.responseText;
                    data = Ext.decode(response.responseText);
                    libro = data.libro;
                    //banco = data.banco;
                    //if ((libro.length == 0) && (banco.length == 0)) ??????
                    //para diferencias
                    for (var i = 0; i < libro.length; i++) {
                        if (libro[i].diferenciamo > 0) {
                            newRecord = {
                                'nroestado': libro[i].nroestado,
                                'debito': libro[i].diferenciamo,
                                'credito': 0,
                                'comentario': libro[i].comentario
                            };
                            arraystdiferenciabanc.push(newRecord);  //grid diferencias banco
                        }
                        else {
                            newRecord = {
                                'nroestado': libro[i].nroestado,
                                'debito': 0,
                                'credito': libro[i].diferenciamo,
                                'comentario': libro[i].comentario
                            };
                            arraystdiferenciabanc.push(newRecord);//grid diferencias banco
                        }
                    }
                    stdiferenciabanc.loadData({
                        'cant': libro.length,
                        'rows': arraystdiferenciabanc
                    });

                    var array = new Array();
                    array = {
                        'id': 2,
                        'elem': 34
                    };
                    //Para instrumentos
                    if (data.banco == 0) {
                        lMask.hide();
                        return;
                    }
                    bancotransito = data.banco.transito;
                    bancodepositar = data.banco.depositar;
                    for (var i = 0; i < bancotransito.length; i++) {
                        arraystinsttransito.push(bancotransito[i]);
                    }
                    stinsttransito.loadData({
                        'cant': bancotransito.length,
                        'rows': arraystinsttransito
                    });

                    for (var i = 0; i < bancodepositar.length; i++) {
                        arraystinstdepositar.push(bancodepositar[i]);
                    }
                    stinstdepositar.loadData({
                        'cant': bancodepositar.length,
                        'rows': arraystinstdepositar
                    });
                }
                else {
                    Ext.Msg.alert(r.statusText, r.responseText);
                }
                lMask.hide();
            }//callback
        });
    }

    function loadDataIni() {
        lMask.show();
        Ext.Ajax.request({
            url: 'loadDataIni',
            method: 'POST',
            params: {
                start: 0,
                limit: gpbanco.getBottomToolbar().pageSize
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                btnmodificar.setDisabled(true);
                btneliminar.setDisabled(true);
                if (responseData.aperturado == 1) {//0=ci, 1=aperturado
                    mostrarMensaje(1, etiquetas.lbCerradaCI, function (btn) {
                        if (btn == 'ok' || btn == 'cancel') {
                            Ext.getCmp('viewPort').setDisabled(true);
                            gpbanco.disable();
                            fpdatosconciliacion.disable();
                        }
                    });
                }
                else {
                    stbanco.loadData(responseData.gridctas);

                    var msg = 'Período actual: ' + responseData.periodo.nombre;
                    msg += ' desde ' + responseData.periodo.inicio + ' hasta ' + responseData.periodo.fin + ' | Fecha contable: ' + responseData.periodo.fechacontable;
                    labelPeriodo.setText(msg);
                }
                lMask.hide();
            }//callback
        });
    }

    loadDataIni();

}