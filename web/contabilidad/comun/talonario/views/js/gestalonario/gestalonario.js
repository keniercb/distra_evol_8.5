if (window.parent.parent.UCID.portal.perfil)
    var perfil = window.parent.parent.UCID.portal.perfil;
else
    perfil = {};
perfil.etiquetas = Object();
Ext.QuickTips.init();
//UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
var windowParent, winReg;
if (window.idwiniframe)
    windowParent = window.parent.Ext.getCmp(window.idwiniframe);
if (window.params)
    parametros = window.params;
//UCID.portal.cargarEtiquetas('talonario', function(){cargarInterfaz();});
var winTalon, winMTalon, disp_padre, stctaBan, btnAdicionar, nodoselec, tlArbolTalonarios, identidad, tpArbolTalonarios, ptalonario, vpTalonario, tfnuminicio, tfnumfinal, tfdisponibles, cbtipoDoc, sttipoDoc, cbEntidad, stEntidad, cbcuentaBanc;
var temp_tal, idtipodocumento, cambio = 0;
var padicTalon;
function cargarInterfaz() {
    btnAdicionar = new Ext.Button({
        id: 'btnAdicionar',
        // hidden:true,
        tooltip: "Adicionar talonario",
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        text: 'Adicionar',
        disabled: true,
        handler: function()
        {
            if (sttipoDoc.getCount() == 0)
                mostrarMensaje(1, "No se puede adicionar un talonario porque no existen documentos configurados para el subsistema.");
            else
                WinAdicTalon();
        }
    });

    btnModificar = new Ext.Button({
        id: 'btnModificar',
        // hidden:true,
        tooltip: "Modificar talonario",
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        text: 'Modificar',
        disabled: true,
        handler: function()
        {
            cbtipoDoc.disable();
            if (sttipoDoc.getCount() == 0)
                mostrarMensaje(1, "No se puede modificar el talonario porque no existen documentos configurados para el subsistema.");
            else
                WinModTalon();
        }
    });

    btnEliminar = new Ext.Button({
        id: 'btnEliminar',
        // hidden:true,
        tooltip: "Eliminar talonario",
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        text: 'Eliminar',
        disabled: true,
        handler: function() {
            eliminarcondicion();
        }
    });

    btnAyuda = new Ext.Button({
        id: 'btnAyuda',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: "Ayuda",
        text: '<b> Ayuda </b>'
    });

    tlArbolTalonarios = new Ext.tree.TreeLoader({
        baseParams: {idsubsistema: parametros.idsubsistema},
        dataUrl: 'cargartalonarios'
    });

    var nodoPadre = new Ext.tree.AsyncTreeNode({
        text: 'Talonarios de ' + parametros.subsist,
        id: '0'
    });

    tpArbolTalonarios = new Ext.tree.TreePanel({
        autoScroll: true,
        animate: true,
        id: 'tpArbolTalon',
        border: false,
        autoShow: true,
        layoutConfig: {animate: true},
        enableDD: false,
        boxReady: true,
        tabIndex: 16,
        style: 'margin: 10 0 0 0',
        root: nodoPadre,
        margins: '2 2 2 2',
        loader: tlArbolTalonarios//,
                // listeners:
                // {
                // load:function(nodo)
                // {
                // nodo.on('expand',function()
                // {
                // nodo.eachChild(function(anodehijo)
                // {
                // if(anodehijo.attributes.disponible == 0)
                // {
                // anodehijo.disabled = true;
                // formatTextNodoColor(anodehijo,'node-yellow-class');
                // }
                // });
                // });
                // }
                // }
    });

    ptalonario = new Ext.Panel({
        labelWidth: 50,
        autoScroll: true,
        items: [tpArbolTalonarios],
        //tbar:[btnAdicionar,btnModificar,btnEliminar,'->',btnAyuda]  // poner despues aquiii
        tbar: [btnAdicionar, btnModificar, btnEliminar]
    });

    tfdisponibles = new Ext.form.NumberField({
        fieldLabel: 'Disponibles',
        name: 'disponibles',
        disabled: true,
        anchor: '100%'
    });

    tfnumfinal = new Ext.form.NumberField({
        fieldLabel: 'N&uacute;mero fin',
        name: 'tfnumfinal',
        maxLength: 16,
        maxLengthText: 'El tama&ntilde;o requerido es de 8 caracteres.',
        anchor: '95%',
        maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/, // Solo numeros y sin decimales
        regex: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/,
        regexText: 'Este campo solo permite n&uacute;meros.',
        style: 'text-align:left;',
        allowNegative: false,
        allowDecimals: false,
        enableKeyEvents: true,
        selectOnFocus: true,
        //allowBlank:false
        listeners: {
            change: function(tbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = 1;
            },
            keypress: function(tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 16)
                        e.stopEvent();  // Para que no escriba m�s de 8 caracteres
                }
            }
        }
    });

    tfnuminicio = new Ext.form.NumberField({
        fieldLabel: 'N&uacute;mero inicio',
        name: 'tfnuminicio',
        anchor: '95%',
        maxLength: 16,
        maxLengthText: 'El tama&ntilde;o requerido es de 16 caracteres.',
        style: 'text-align:left;',
        maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/, // Solo numeros y sin decimales
        regex: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9]*)+$/,
        regexText: 'Este campo solo permite n&uacute;meros.',
        allowNegative: false,
        allowDecimals: false,
        enableKeyEvents: true,
        selectOnFocus: true,
        listeners: {
            keyup: function(t, e) {
                if (tfnuminicio.getValue() > tfnumfinal.getValue())
                {
                    tfdisponibles.setValue('');
                    tfnumfinal.setValue('');
                    if (tfnuminicio.getValue().length == 0)
                        tfnumfinal.disable();
                    else
                        tfnumfinal.enable();
                } else
                    disponibles();

            },
            change: function(cbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = 1;
            },
            blur: function() {
                if (tfnuminicio.getValue() > tfnumfinal.getValue())
                {
                    tfdisponibles.setValue('');
                    tfnumfinal.setValue('');
                    disponibles();
                }
            },
            keypress: function(tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 16)
                        e.stopEvent();  // Para que no escriba m�s de 16 caracteres
                }
            }
        }
    });

    stctaBan = new Ext.data.Store({
        url: 'cargarctaBanAsoc',
        reader: new Ext.data.JsonReader({
            root: 'datos'
        }, [
            {name: 'idcuentabancaria', type: 'string'},
            {name: 'nombrecuentabancaria', type: 'string'}
        ]),
        sortInfo: {field: 'nombrecuentabancaria', direction: 'ASC'} // DESC
    });

    cbcuentaBanc = new Ext.form.ComboBox({
        id: 'cbcuentaBanc',
        emptyText: 'Seleccione...',
        fieldLabel: 'Cuenta bancaria',
        tpl: '<tpl for="."><div ext:qtip="{nombrecuentabancaria}" class="x-combo-list-item">{nombrecuentabancaria}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        forceSelection: true,
        editable: true,
        store: stctaBan,
        valueField: 'idcuentabancaria',
        displayField: 'nombrecuentabancaria',
        hiddenName: 'idcuentabancaria',
        typeAhead: true,
        mode: 'local',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '100%',
        disabled: true,
        listeners: {
            change: function(cbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = 1;
            }
        }
    });


    sttipoDoc = new Ext.data.Store({
        url: 'cargartiposdoc',
        reader: new Ext.data.JsonReader({
            id: 'tiposdoc'
        },
        [{name: 'iddoc'}, {name: 'denominacion'}]
                )
    });

    cbtipoDoc = new Ext.form.ComboBox({
        id: 'cbtipoDoc',
        fieldLabel: 'Tipo documento',
        emptyText: 'Seleccione...',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        forceSelection: true,
        editable: true,
        store: sttipoDoc,
        valueField: 'iddoc',
        displayField: 'denominacion',
        hiddenName: 'iddoc',
        typeAhead: true,
        mode: 'local',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '100%',
        listeners: {
            change: function(cbx, newValue, oldValue) {
                if (newValue != oldValue)
                    cambio = 1;
            },
            select: function(cbx, record, index) {
                if (parametros.cajban == 1)
                {
                    cbcuentaBanc.setValue('');
                }
            }
        }
    });

    padicTalon = new Ext.FormPanel({
        frame: true,
        id: 'padicTalon',
        labelAlign: 'top',
        height: 165,
        items: [{layout: 'column',
                items: [{columnWidth: .50,
                        layout: 'form',
                        items: [tfnuminicio]
                    }, {
                        columnWidth: .50,
                        layout: 'form',
                        items: [tfnumfinal]
                    }]}, tfdisponibles, cbtipoDoc]
    });

    vpTalonario = new Ext.Viewport({
        id: 'vpTalonario',
        layout: 'fit',
        autoScroll: true,
        items: ptalonario
    });


    function WinAdicTalon()
    {
        cambio = 0;
        tfnuminicio.setValue('');
        tfnumfinal.setValue('');
        if (cbtipoDoc.getValue())
            cbtipoDoc.clearValue();
        tfdisponibles.setValue('');
        padicTalon.getForm().reset(); // Aqui es donde se resetea el panel
        cbtipoDoc.clearInvalid();

        if (nodoselec && nodoselec.id != 0)
        {
            tfnuminicio.disable();
            tfnumfinal.enable();
            //tfnuminicio.setValue(nodoselec.attributes.numeroinicio);
            tfnuminicio.setValue(nodoselec.attributes.numerofin - nodoselec.attributes.disponible + 1);
            cbtipoDoc.setValue(nodoselec.attributes.documento);
            idtipodocumento = nodoselec.attributes.idtipodocumento;
        }
        else
        {
            if (parametros.cajban != 1)
            {
                tfnuminicio.disable();
                tfnumfinal.disable();
            }
            else
            {
                tfnuminicio.enable();
                tfnumfinal.enable();
//			tfnuminicio.setValue('');
            }
            cbcuentaBanc.disable();
        }
        if (!winTalon)
        {
            winTalon = new Ext.Window({modal: true, resizable: false, constrain: true, layout: 'fit', closeAction: 'hide', defaultButton: 0,
                title: 'Adicionar talonario', width: 280, autoHeight: true,
                buttons: [{icon: perfil.dirImg + 'cancelar.png',
                        iconCls: 'btn',
                        text: 'Cancelar',
                        handler: function() {
                            winTalon.hide();
                            //padicTalon.getForm().reset();
                        }
                    }, {icon: perfil.dirImg + 'aceptar.png',
                        iconCls: 'btn',
                        text: 'Aceptar',
                        handler: function() {
                            if (padicTalon.getForm().isValid() && tfnuminicio.getValue() && tfnumfinal.getValue())
                            {

                                if ((parametros.cajban == 1) && (!cbcuentaBanc.getValue()))
                                {
                                    cbcuentaBanc.markInvalid('Este campo es obligatorio.');
                                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                                }

                                else
                                {
                                    if (tfnumfinal.getValue() * 1 < tfnuminicio.getValue() * 1)
                                    {
                                        mostrarMensaje('3', 'El n&uacute;mero final del talonario debe ser mayor o igual que el n&uacute;mero de inicio.')
                                        tfnumfinal.setValue('');
                                        tfdisponibles.setValue('');
                                        tfnuminicio.clearInvalid();
                                    }
                                    else
                                        insertarTalonario();
                                }
                            } else
                            {
                                if (!tfnuminicio.getValue())
                                    if (tfnuminicio.getValue() == '0')
                                        tfnuminicio.markInvalid('Este campo no puede ser 0.');
                                    else
                                        tfnuminicio.markInvalid('Este campo es obligatorio.');
                                if (!tfnumfinal.getValue())
                                    if (tfnumfinal.getValue() == '0')
                                        tfnumfinal.markInvalid('Este campo no puede ser 0.');
                                    else
                                        tfnumfinal.markInvalid('Este campo es obligatorio.');
                                if (!cbtipoDoc.getValue())
                                    cbtipoDoc.markInvalid('Este campo es obligatorio.');
                                if ((parametros.cajban == 1) && (!cbcuentaBanc.getValue()))
                                    cbcuentaBanc.markInvalid('Este campo es obligatorio.');
                                mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                            }
                        }
                    }]
            });

            winTalon.show();
            winTalon.add(padicTalon);
            winTalon.doLayout();
            winTalon.center();
        } else
        {
//		tfnuminicio.setValue('');
            winTalon.show();
            winTalon.add(padicTalon);
            winTalon.doLayout();
            winTalon.center();
        }

    }

    function insertarTalonario()
    {
        id = (nodoselec) ? nodoselec.id : 0;
        //id = (nodoselec)? nodoselec.attributes.idpadre : 0;
        if (padicTalon.getForm().isValid()) {
            padicTalon.getForm().submit({
                url: 'insertartalonario',
                params: {
                    idnodop: id,
                    nivel: (nodoselec.getDepth() + 1),
                    disponibles: tfdisponibles.getValue(),
                    numinicio: tfnuminicio.getValue(),
                    numfinal: tfnumfinal.getValue(),
                    iddoc: nodoselec.attributes.idtipodocumento,
                    idsubsistema: parametros.idsubsistema
                },
                waitMsg: 'Adicionando el talonario...',
                failure: function(form, action) {
                    if (action.result.codMsg != 3) {
                        winTalon.hide();
                        nod = (nodoselec.id != 0) ? nodoselec.parentNode : nodoselec;
                        tlArbolTalonarios.load(nod, function() {
                            nod.expand();
                        });
                        padicTalon.getForm().reset();
                    }
                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                }
            });
        }
    }

    function WinModTalon()
    {
        Ext.getBody().mask('Cargando datos del talonario...');
        cambio = 0;
        tfnuminicio.setValue(nodoselec.attributes.numeroinicio);
        tfnumfinal.setValue(nodoselec.attributes.numerofin);
        tfdisponibles.setValue(nodoselec.attributes.disponible);
        cbtipoDoc.setValue(nodoselec.attributes.documento);
        idtipodocumento = nodoselec.attributes.idtipodocumento;
        tfnumfinal.enable();
        if (parametros.cajban == 1)
        {
            Ext.Ajax.request({url: 'obtenercuentabancaria',
                method: 'POST',
                params: {idtalonario: nodoselec.attributes.idtalonario},
                callback: function(options, success, response)
                {
                    responseData = Ext.decode(response.responseText);
                    var idcuentabancaria = responseData;
                    stctaBan.removeAll();
                    stctaBan.load({
                        params: {
                            idsubsistema: parametros.idsubsistema,
                            idtipodoc: nodoselec.attributes.idtipodocumento,
                            idcuenta: parseInt(idcuentabancaria)
                        },
                        callback: function() {
                            // Ext.getBody().unmask();
                            /*if (!stctaBan.getCount()){
                             cbcuentaBanc.setDisabled(true);
                             mostrarMensaje('1','Todas las cuentas bancarias est&aacute;n asociadas a este tipo de documento,<br>solo tiene permitido cambiar los n&uacute;meros de talonario');
                             }
                             else */{
                                cbcuentaBanc.setDisabled(false);
                                cbcuentaBanc.setValue(idcuentabancaria);
                            }
                            Ext.getBody().unmask();
                        }
                    });
                }
            });
        }
        else
            Ext.getBody().unmask();

        if (!winMTalon)
        {
            winMTalon = new Ext.Window({constrain: true, modal: true, resizable: false, layout: 'fit', closeAction: 'hide', defaultButton: 0,
                title: 'Modificar talonario', width: 280, autoHeight: true,
                buttons: [{
                        icon: perfil.dirImg + 'cancelar.png',
                        iconCls: 'btn',
                        text: 'Cancelar',
                        handler: function()
                        {
                            padicTalon.getForm().reset();
                            winMTalon.hide();
                            cambio = 0;
                        }
                    }, {
                        icon: perfil.dirImg + 'aceptar.png',
                        iconCls: 'btn',
                        text: 'Aceptar',
                        handler: function()
                        {
                            if (padicTalon.getForm().isValid() && tfnuminicio.getValue() && tfnumfinal.getValue())
                            {
                                if (cambio == 1)
                                {
                                    if (tfnumfinal.getValue() * 1 < tfnuminicio.getValue() * 1)
                                    {
                                        mostrarMensaje('3', 'El n&uacute;mero final del talonario debe ser mayor o igual que el n&uacute;mero de inicio.')
                                        tfnumfinal.setValue('');
                                        tfdisponibles.setValue('');
                                    }
                                    else
                                        modificarTalonario();
                                    padicTalon.getForm().reset();
                                } else
                                    mostrarMensaje(1, 'Debe realizar alg&uacute;n cambio en los datos.');
                            }
                            else
                            {
                                if (!tfnuminicio.getValue())
                                    if (tfnuminicio.getValue() == '0')
                                        tfnuminicio.markInvalid('Este campo no puede ser 0.');
                                    else
                                        tfnuminicio.markInvalid('Este campo es obligatorio.');
                                if (!tfnumfinal.getValue())
                                    if (tfnumfinal.getValue() == '0')
                                        tfnumfinal.markInvalid('Este campo no puede ser 0.');
                                    else
                                        tfnumfinal.markInvalid('Este campo es obligatorio.');
                                if ((parametros.cajban == 1) && (!cbcuentaBanc.getValue()))
                                    cbcuentaBanc.markInvalid('Este campo es obligatorio.');
                                mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                            }
                        }
                    }],
                listeners: {
                    hide: function(elem) {
                        cambio = 0;
                    },
                    close: function(elem) {
                        cambio = 0;
                    },
                    show: function()
                    {
                        winMTalon.center();
                    }
                }
            });


            winMTalon.add(padicTalon);
            winMTalon.doLayout();
            winMTalon.show();

        } else
        {

            winMTalon.add(padicTalon);
            winMTalon.doLayout();
            winMTalon.show();
            winMTalon.center();
        }
    }

    function modificarTalonario()
    {
        id = (nodoselec) ? nodoselec.id : 0;
        id = (nodoselec) ? nodoselec.attributes.idpadre : 0;
        if (padicTalon.getForm().isValid()) {

            Ext.getBody().mask('Modificando el talonario...');
            Ext.Ajax.request({
                url: 'modificartalonario',
                params: {
                    idnodop: id,
                    cajban: parametros.cajban,
                    idtalonario: nodoselec.attributes.idtalonario,
                    nivel: (nodoselec.getDepth() + 1),
                    disponibles: tfdisponibles.getValue(),
                    numinicio: tfnuminicio.getValue(),
                    numfinal: tfnumfinal.getValue(),
                    disp_padre: nodoselec.attributes.disponible,
                    iddoc: nodoselec.attributes.idtipodocumento,
                    idcuentabancaria: cbcuentaBanc.getValue(),
                    idsubsistema: parametros.idsubsistema
                },
                //waitMsg:'Eliminando el talonario...',
                callback: function(options, success, response) {
                    Ext.getBody().unmask();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg != 3) {
                        winMTalon.hide(); //nod = (nodoselec.id != 0) ? nodoselec.parentNode : nodoselec;
                        tlArbolTalonarios.load(nodoPadre, function() {
                            nodoPadre.expand();
                        });
                        padicTalon.getForm().reset();
                        btnModificar.setDisabled(true); // Inabilitar boton modificar
                        btnEliminar.setDisabled(true); // Inabilitar boton eliminar
                    }
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                }
            });
        }
    }

    function eliminarcondicion()
    {
        Ext.Msg.show({title: 'Confirmaci&oacute;n',
            buttons: Ext.Msg.OKCANCEL,
            msg: String.fromCharCode(191) + 'Est&aacute; seguro que desea eliminar el talonario seleccionado?',
            icon: Ext.MessageBox.QUESTION,
            fn: validaraccion
        });
    }

    function validaraccion(btn)
    {
        if (btn == 'ok')
        {
            eliminarTalonario();
        }
    }

    function eliminarTalonario()
    {


        //id = (nodoselec)? nodoselec.id : 0;
        id = (nodoselec) ? nodoselec.attributes.idpadre : 0;
        if (!nodoselec.attributes.asociado_caja)
        {
            Ext.getBody().mask('Eliminando el talonario...');
            Ext.Ajax.request({
                url: 'eliminartalonario',
                params: {
                    idnodop: id,
                    idtalonario: nodoselec.attributes.idtalonario,
                    cajban: parametros.cajban
                },
                //waitMsg:'Eliminando el talonario...',
                callback: function(options, success, response) {
                    Ext.getBody().unmask();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg != 3) {
                        nod = (nodoselec.id != 0) ? nodoselec.parentNode : nodoselec;
                        tlArbolTalonarios.load(nodoPadre, function() {
                            nodoPadre.expand();
                        });
                        padicTalon.getForm().reset();
                        btnModificar.setDisabled(true); // Inabilitar boton modificar
                        btnEliminar.setDisabled(true); // Inabilitar boton eliminar
                    }
                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                }
            });
        }
        else
        {
            mostrarMensaje(3, 'Este talonario se encuentra asociado a un fondo. No puede ser eliminado.');
        }
    }

    tpArbolTalonarios.on('expandnode', function(node, e)
    {
        if (nodoPadre.isLeaf())
            mostrarMensaje(1, 'No existen talonarios de banco para mostrar.');
    });

    tpArbolTalonarios.on('click', function(node, e)
    {
        nodoselec = node;
        disp_padre = nodoselec.attributes.disp_padre;
        if (nodoselec.disabled == false)
        {
            if (nodoselec.id == 0)
            {
                btnAdicionar.enable();
                btnModificar.disable();
                btnEliminar.disable();
                cbtipoDoc.enable();
            }
            else
            {
                if (parametros.cajban == 1)
                {
                    btnAdicionar.disable();
                    btnEliminar.enable();
                    btnModificar.enable();
                }
                else
                {
                    if (nodoselec.attributes.id == nodoselec.attributes.idpadre)
                        btnAdicionar.enable();
                    else
                        btnAdicionar.disable();
                    cbtipoDoc.disable();
                    if (nodoselec.attributes.leaf)
                    {
                        btnEliminar.enable();
                        btnModificar.enable();
                    }
                    else
                    {
                        btnEliminar.disable();
                        btnModificar.disable();
                    }
                }
            }
        }
        else
        {
            btnAdicionar.disable();
            btnModificar.disable();
            btnEliminar.disable();
        }
    });

    tfnumfinal.on('keyup', function(t, e)
    {

        disponibles();

    }, this);

    function disponibles()
    {
        temp_tal = (nodoselec.attributes.disp_padre * 1) + (nodoselec.attributes.disponible * 1);
        if (tfnuminicio.getValue() && (tfnumfinal.getValue() * 1 >= tfnuminicio.getValue() * 1))
            tfdisponibles.setValue((tfnumfinal.getValue() - tfnuminicio.getValue()) + 1);
        else
            tfdisponibles.setValue('');
        if ((tfnumfinal.getValue() * 1 > nodoselec.attributes.numerofin) && (nodoselec.attributes.id == nodoselec.attributes.idpadre))
        {
            mostrarMensaje('3', 'No puede exceder el n&uacute;mero fin original del talonario.');

            tfnumfinal.setValue('');
            tfdisponibles.setValue('');
            temp_tal = nodoselec.attributes.disponible;
        }
        else if (temp_tal < tfnumfinal.getValue() * 1 && (nodoselec.attributes.id != nodoselec.attributes.idpadre))
        {
            mostrarMensaje('3', 'No puede exceder la cantidad de: ' + temp_tal + ' talonarios disponibles.');
            tfnumfinal.setValue('');
            tfdisponibles.setValue('');
            temp_tal = nodoselec.attributes.disponible;
        }
    }

    cbtipoDoc.on('select', function(t)
    {
        if (parametros.cajban == 1)
        {
            lMaskCargando = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando cuentas bancarias...'});
            lMaskCargando.show();
            stctaBan.removeAll();
            Ext.Ajax.request
                    ({
                        url: 'Existencuentas',
                        method: 'POST',
                        callback: function(options, success, response)
                        {
                            responseData = Ext.decode(response.responseText);
                            if (responseData == 0)
                            {
                                lMaskCargando.hide();
                                mostrarMensaje('1', 'No se puede adicionar un talonario porque no existen cuentas bancarias configuradas para el subsistema.');
                            }
                            else
                            {
                                stctaBan.load({
                                    params: {
                                        idsubsistema: parametros.idsubsistema,
                                        idtipodoc: cbtipoDoc.getValue()
                                    },
                                    callback: function(options, success, response) {
                                        lMaskCargando.hide();
                                        if (!stctaBan.getCount())
                                            mostrarMensaje('1', 'Todas las cuentas bancarias tienen talonarios disponibles asociados a este tipo de documento.');
                                        else
                                            cbcuentaBanc.enable();
                                    }
                                });
                            }
                        }
                    });


        }
        else
        {
            lMaskCargando = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando n&uacute;mero inicio de talonario...'});
            lMaskCargando.show();

            Ext.Ajax.request
                    ({
                        url: 'buscarInicioTalonario',
                        method: 'POST',
                        params: {tipodoc: cbtipoDoc.getValue()},
                        callback: function(options, success, response)
                        {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg != 3)
                            {
                                tfnuminicio.setValue(responseData.numinicio);
                                tfnumfinal.enable();
                                lMaskCargando.hide();
                            }
                        }
                    });
        }
    }, this);

    function formatTextNodoColor(nodo, aclass)
    {
        Ext.get(nodo.getUI().getTextEl()).addClass(aclass);
    }

    if (parametros.cajban == 1)
    {
        padicTalon.add(cbcuentaBanc);
        padicTalon.setHeight(210);
    }

    lMaskTipoDoc = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando...'});
    lMaskTipoDoc.show();
    sttipoDoc.load({params: {subsistema: parametros.idsubsistema}, callback: function(options, success, response) {
            lMaskTipoDoc.hide();
        }});
    if (windowParent)
        Ext.UCID.integraInterfaz(ptalonario, windowParent);
}

//if(parametros.idsubsistema != 0)
cargarInterfaz();

