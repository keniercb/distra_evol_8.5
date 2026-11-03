
Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();
var gridbusqueda;
// function CargarInterfaz
function buscargenerico(store, micombo, variante) {
    var lMaskbusctemp;
    function MostrarmsgEtiquetas(componente, mensaje)
    {
        lMaskbusctemp = new Ext.LoadMask(componente, {
            msg: mensaje
        });
        lMaskbusctemp.show();
    }

    // Store de Tipos 
    // Create data store para el Tipos elementos
    var sttipobenef = new Ext.data.SimpleStore({
        // autoload:true,
        //fields:['tipo', 'descripcion'],
        fields: [{
                name: 'tipo',
                type: 'int'
            },
            {
                name: 'descripcion',
                type: 'string'
            }]
                //data:[[1, 'Cliente'],[2, 'Proveedor'],[3, 'Persona externa'],[4, 'Trabajador']]
    });

    var cbxtipobeneficiario = new Ext.form.ComboBox({
        id: 'cbxtipobeneficiario',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', // Paramostrar los datos como detalle
        resizable: true,
        style: 'margin:0 0 0 -8',
        emptyText: 'Seleccione...',
        mode: 'local',
        editable: true,
        store: sttipobenef,
        valueField: 'tipo',
        displayField: 'descripcion',
        hiddenName: 'tipo',
        forceSelection: true,
        anchor: '100%',
        enableKeyEvents: true,
        triggerAction: 'all',
        typeAhead: true,
        listeners: {
            select: function(combo, r, index) {
                stelementos.removeAll();
                switch (cbxtipobeneficiario.getValue())
                {
                    case 3:
                        btnfindav.setDisabled(true);
                        btnAdd.setDisabled(false); // 3, 'Persona externa'
                        gridbusqueda.getTopToolbar().items.items[7].setVisible(true);	//Nombre
                        gridbusqueda.getTopToolbar().items.items[8].setVisible(false); 	// Nombre completo
                        gridbusqueda.getTopToolbar().items.items[10].setVisible(true);
                        gridbusqueda.getTopToolbar().items.items[11].setVisible(true);	//Apellido
                        gridbusqueda.getTopToolbar().items.items[12].setVisible(true);
                        gridbusqueda.getTopToolbar().items.items[13].setVisible(true);
                        break;
                    case 4:
                        btnfindav.setDisabled(false);
                        btnAdd.setDisabled(true); //  4, 'Trabajador'
                        gridbusqueda.getTopToolbar().items.items[7].setVisible(true);	//Nombre
                        gridbusqueda.getTopToolbar().items.items[8].setVisible(false); 	// Nombre completo
                        gridbusqueda.getTopToolbar().items.items[10].setVisible(true);
                        gridbusqueda.getTopToolbar().items.items[11].setVisible(true);	//Apellido
                        gridbusqueda.getTopToolbar().items.items[12].setVisible(true);
                        gridbusqueda.getTopToolbar().items.items[13].setVisible(true);
                        break;
                    default:
                        btnfindav.setDisabled(true);
                        btnAdd.setDisabled(true);
                        gridbusqueda.getTopToolbar().items.items[7].setVisible(false);
                        gridbusqueda.getTopToolbar().items.items[8].setVisible(true);
                        gridbusqueda.getTopToolbar().items.items[10].setVisible(false);
                        gridbusqueda.getTopToolbar().items.items[11].setVisible(false);
                        gridbusqueda.getTopToolbar().items.items[12].setVisible(false);
                        gridbusqueda.getTopToolbar().items.items[13].setVisible(false);
                        break;
                }
            },
            keypress: function(tf, e) {
                var charCode = e.charCode;
                if (e.getKey() == 13) // Enter
                {
                    //var comp = Ext.getCmp('winAvanzada').buttons[1].getId();   capturar dinamincamente el boton
                    var comp = Ext.getCmp('winbusquedagenerica').buttons[1].focus();  // POner el focus en el boton aceptar de la ventana
                    if (!cbxtipobeneficiario.getValue())
                        cbxtipobeneficiario.setValue(sttipobenef.getAt(0).get('tipo'));
                    cbxtipobeneficiario.fireEvent('select', this.cbxtipobeneficiario);
                    reloadAll();
                    return;
                } else
                    cbxtipobeneficiario.fireEvent('select', this.cbxtipobeneficiario);

                if ((e.getKey() == 8) || (e.getKey() == 46))
                {
                    cbxtipobeneficiario.clearValue();
                    stelementos.removeAll();
                    return;
                    // btnAdd.setDisable(false);  y btnfindav.setDisabled(false);  150
                }

                var value = cbxtipobeneficiario.getRawValue();
                if (value.length >= 18 && charCode != 8 && charCode != 46)
                {
                    e.stopEvent();  // Para que no escriba m�s de 18 caracteres
                } else
                {
                    // a-z (97-122) y A-Z 65 al 90
                    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode == 32) {
                        var i = 0;
                        delete i;
                    } else
                        e.stopEvent();
                }
            }
        }
    });

    var btnAyuda = new Ext.Button({
        id: 'btnAyuda',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: "Ayuda",
        tooltip: "Ayuda"
    });

    var btnAdd = new Ext.Button({
        id: 'btnAdd',
//        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'adicionar',
        disabled: true,
        text: "Adicionar",
        tooltip: "Adicionar persona externa",
        handler: function() {
            if (cbxtipobeneficiario.getValue() != 3)
                mostrarMensaje(1, "S&oacute;lo se pueden adicionar personas externas.", function() {
                });
            else
                winadicionarpersona(stelementos);
            //  btnModAper.disable();btnEliAper.disable();btnCancAper.disable();btnImpAper.enable();winFpRegAperturas('Ins');
        }
    });

    /*  Para el Grid */
    /*********************************Declaracion componentes***********************************************************/
    var tfidentificador = new Ext.form.TextField({
        id: 'tfidentificador',
        maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/, // Solo n�meros
        regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
        regexText: 'Este campo solo permite n&uacute;meros.',
        enableKeyEvents: true,
        allowBlank: true,
        maxLength: 11,
        maxLengthText: 'El tama&ntilde;o requerido es de 11 caracteres.',
        name: 'tfidentificador',
        width: 78,
        listeners: {
            keypress: function(tf, e) {
                if ((e.getKey() == 13))
                {
                    BuscarconEnter(13)
                    return;
                }
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 11)
                        e.stopEvent();  // Para que no escriba m�s de 11 caracteres
                }
            }
        }
    });

    var tfnombres = new Ext.form.TextField({
        id: 'tfnombres',
        maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/, // Solo letras y espacios
        regex: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
        regexText: 'Este campo solo permite letras.',
        enableKeyEvents: true,
        allowBlank: true,
        maxLength: 30,
        maxLengthText: 'El tama&ntilde;o requerido es de 30 caracteres.',
        name: 'tfnombres',
        width: 178,
        listeners: {
            'specialkey': function(tf, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey)
            },
            keypress: function(tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 30)
                        e.stopEvent();  // Para que no escriba m�s de 30 caracteres
                }
            },
            blur: function() {
                tfnombres.setValue(DeleteSpace(tfnombres.getValue(), false));
            },
            keyup: function(tf, e) {
                var value = new String(tf.getValue());
                if (value.charAt(value.length - 1) == " ")
                    tfnombres.setValue(DeleteSpace(tfnombres.getValue(), true));
                else
                    tfnombres.setValue(DeleteSpace(tfnombres.getValue(), false));
            }
        }
    });

    var tfnombresCP = new Ext.form.TextField({
        id: 'tfnombresCP',
        maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/, // Solo letras y espacios
        regex: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
        regexText: 'Este campo solo permite letras.',
        enableKeyEvents: true,
        allowBlank: true,
        hidden: true,
        maxLength: 100,
        maxLengthText: 'El tama&ntilde;o requerido es de 100 caracteres.',
        name: 'tfnombresCP',
        width: 422,
        listeners: {
            'specialkey': function(tf, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey)
            },
            keypress: function(tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 100)
                        e.stopEvent();  // Para que no escriba m�s de 30 caracteres
                }
            },
            blur: function() {
                tfnombresCP.setValue(DeleteSpace(tfnombresCP.getValue(), false));
            },
            keyup: function(tf, e) {
                var value = new String(tf.getValue());
                if (value.charAt(value.length - 1) == " ")
                    tfnombresCP.setValue(DeleteSpace(tfnombresCP.getValue(), true));
                else
                    tfnombresCP.setValue(DeleteSpace(tfnombresCP.getValue(), false));
            }
        }
    });

    var tfapellidos = new Ext.form.TextField({
        id: 'tfapellidos',
        maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/, // Solo letras y espacios
        regex: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
        regexText: 'Este campo solo permite letras.',
        enableKeyEvents: true,
        allowBlank: true,
        maxLength: 30,
        maxLengthText: 'El tama&ntilde;o requerido es de 30 caracteres.',
        name: 'tfapellidos',
        width: 178,
        listeners: {
            'specialkey': function(tf, e) {
                var hotKey = e.getCharCode();
                BuscarconEnter(hotKey)
            },
            keypress: function(tf, e) {
                if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
                {
                    var value = new String(tf.getValue());
                    if (value.length >= 30)
                        e.stopEvent();  // Para que no escriba m�s de 30 caracteres
                }
            },
            blur: function() {
                tfapellidos.setValue(DeleteSpace(tfapellidos.getValue(), false));
            },
            keyup: function(tf, e) {
                var value = new String(tf.getValue());
                if (value.charAt(value.length - 1) == " ")
                    tfapellidos.setValue(DeleteSpace(tfapellidos.getValue(), true));
                else
                    tfapellidos.setValue(DeleteSpace(tfapellidos.getValue(), false));
            }
        }
    });

    function DeleteSpace(str, espacio) {
        if (str.length != 0) {
            var words = str.split(" ");
            var pos = 0;
            var Twords = "";
            for (var i = 0; i < words.length; i++) {
                if (words[i])
                {
                    if (pos == 0)
                        Twords += words[i];
                    else
                        Twords += " " + words[i];
                    pos++;
                }
            }
            if (espacio)
                Twords += " ";
            return Twords;
        }
    }

    var btnbuscar = new Ext.Button({
        id: 'btnbuscar',
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        tooltip: 'Buscar',
        text: "Buscar",
        handler: function() {
            reloadAll();
        }
    });

    var btnfindav = new Ext.Button({
        id: 'btnfindav',
//        icon: perfil.dirImg + 'buscaravanzada.png',
        iconCls: 'buscaravanzada',
        tooltip: 'Avanzado',
        disabled: true,
        text: "Avanzado",
        handler: function() {
            if (cbxtipobeneficiario.getValue() == 4)
                if (tfidentificador.isValid() && tfnombres.isValid() && tfapellidos.isValid())
                    CargarVentanaTrabajador();
                else
                    mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).', function() {
                    });
            else
                mostrarMensaje(1, "La b&uacute;squeda avanzada es s&oacute;lo para trabajadores.", function() {
                });
        }
    });

    /*  El reader del grid liquidar */
    var rdliquidar = new Ext.data.JsonReader({// Estudiante, Profesor, Trabajador, Cliente, Persona Externa
        root: 'datos',
        id: 'rdliquidar',
        totalProperty: 'cantidad'
    },
    [{
            name: 'id'
        },
        {
            name: 'nro',
            type: 'string'
        },
        {
            name: 'nombre'
        },
        {
            name: 'abreviatura'
        },
        {
            name: 'descripcion'
        }
    ]);

    /* Tipo de seleccion del grid instrumento    */
    var smbusqueda = new Ext.grid.RowSelectionModel({
        id: 'smbusqueda',
        singleSelect: true
    });

    /*  Store del grid liquidar */
    var stelementos = new Ext.data.Store({
        url: 'buscarbeneficiario',
        id: 'stelementos',
        reader: rdliquidar,
        sortInfo: {
            field: 'nro',
            direction: 'ASC'
        }, // DESC
        baseParams: {
            tipo: cbxtipobeneficiario.getValue(),
            identificador: tfidentificador.getValue(),
            nombre: tfnombres.hidden ? tfnombresCP.getValue() : tfnombres.getValue(),
            apellidos: tfapellidos.getValue()
        },
        listeners: {
            beforeload: function(s, options)
            {   //tipo = 1; cliente -> tipo = 2; Proveedor -> tipo = 3; Persona externa -> tipo = 4; Trabajador
                stelementos.clearFilter(true);
                stelementos.baseParams.tipo = cbxtipobeneficiario.getValue();
                stelementos.baseParams.identificador = tfidentificador.getValue();
                stelementos.baseParams.nombre = tfnombres.hidden ? tfnombresCP.getValue() : tfnombres.getValue();
                stelementos.baseParams.apellidos = tfapellidos.getValue();
            },
            load: function(e)
            {
                if (stelementos.getCount() > 0) {
                    gridbusqueda.getSelectionModel().selectFirstRow();// Para que aparezca marcado por defecto la primera fila
                    gridbusqueda.getView().focusEl.focus();//para que permita desplazarse con el teclado
                }
            }
        }
    });

    /*  Columnas del Grid Liquidar */
    var cm0 = new Ext.grid.ColumnModel([
        {
            hidden: true,
            dataIndex: 'id',
            hideable: false
        },
        {
            header: "C&oacute;digo",
            sortable: true,
            width: 100,
            dataIndex: 'nro'
        },
        {
            header: "Abreviatura",
            sortable: true,
            width: 100,
            dataIndex: 'abreviatura'
        },
        {
            header: "Nombre completo",
            sortable: true,
            width: 300,
            id: 'idnombre',
            dataIndex: 'nombre'
        }/*,
         {
         header : "Descripci&oacute;n", 
         sortable: true, 
         width: 315, 
         id : 'descripcion',
         dataIndex : 'descripcion'
         }*/
    ]);

    var toolbar = new Ext.Toolbar([new Ext.Toolbar.TextItem(' '), new Ext.Toolbar.TextItem(' C&oacute;digo: '), new Ext.Toolbar.TextItem(' '), tfidentificador,
        new Ext.Toolbar.TextItem(' '), new Ext.Toolbar.TextItem(' Nombre(s): '), new Ext.Toolbar.TextItem(' '), tfnombres, tfnombresCP,
        new Ext.Toolbar.TextItem(' '), new Ext.Toolbar.TextItem(' Apellido(s): '), new Ext.Toolbar.TextItem(' '), tfapellidos, new Ext.Toolbar.TextItem(' '),
        new Ext.Toolbar.TextItem(' '), new Ext.Toolbar.TextItem(' '), new Ext.Toolbar.TextItem(' '), btnbuscar,
        new Ext.Toolbar.TextItem(' ')/*, btnfindav*/]);

    /*  GridPanel Liquidar  */
    gridbusqueda = new Ext.grid.GridPanel({
        store: stelementos,
        autoExpandColumn: 'idnombre',
        id: 'gridbusqueda',
        width: 640,
        height: 340,
        enableKeyEvents: true,
        autoScroll: true,
        frame: true,
        loadMask: true,
        cm: cm0,
        selModel: smbusqueda,
        tbar: toolbar,
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stelementos,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "Ning&uacute;n resultado para mostrar."
        }),
        listeners: {
            rowdblclick: function(Grid, rowIndex, e)
            {
                RowDblClick(Grid, rowIndex, e); /** Evento para cargar los Tab**/
            },
            keypress: function(e) {
                if (e.getKey() == 13) //para que adicione con el enter
                    aceptarTrabajador()
            }
        }
    });

    /*  Panel Agrupador del grid de busqueda */
    var fpbusqueda = new Ext.FormPanel({
        id: 'fpbusqueda',
        frame: false,
        autoHeight: true,
        border: false,
        layout: 'fit',
        items: [gridbusqueda],
        tbar: ['', btnAdd, '', '', '->', new Ext.Toolbar.TextItem("Elemento: "),
            new Ext.menu.Separator(), new Ext.menu.Separator(), cbxtipobeneficiario
        ]
    });

    /******************** ventana Liquidar  *************************/
    var winbusquedagenerica = new Ext.Window({
        id: 'winbusquedagenerica',
        layout: 'fit',
        title: '  Buscar',
        width: 840,
        height: 430,
        resizable: false,
        modal: true,
        closeAction: 'destroy',
        items: fpbusqueda,
        buttons: [
            {
//                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                handler: function() {
                    winbusquedagenerica.close();
                }
            },
            {
//                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                text: 'Aceptar ',
                tooltip: 'Guardar datos y cerrar ventana',
                id: 'btnAceptarbusq',
                handler: function() {
                    aceptarTrabajador();
                }
            }],
        listeners: {
            'show': function(Grid, rowIndex, e)
            {//se comentaron los trabajadores para la feria
                var myData = [[1, 'Cliente'], [2, 'Proveedor']/*,[3, 'Persona externa'],[4, 'Trabajador'],[5, 'Caja']*/];
                var data2 = [[2, 'Proveedor']/*,[4, 'Trabajador']*/];
                var data3 = [[3, 'Persona externa']];
                var data4 = [[3, 'Persona externa']/*, [4,'Trabajador']*/];
                var data5 = [[1, 'Cliente'], [2, 'Proveedor'], [4, 'Trabajador']];
                cbxtipobeneficiario.focus(true, true);
                switch (variante)
                {
                    case 1:
                        sttipobenef.loadData(myData);
                        break;
                    case 2:
                        sttipobenef.loadData(data2);
                        break;
                    case 3: // Persona externa
                        sttipobenef.loadData(data3);
                        break;
                    case 4: // Persona externa  y trabajador
                        sttipobenef.loadData(data4);
                        break;
                    case 5: // Cliente, Proveedor y Trabajador: Para el Beneficiario cambiado para Derechos y Obligaciones
                        sttipobenef.loadData(data5);
                        break;
                    default:
                        sttipobenef.loadData(myData);
                        break;
                }
            }
        }
    });

    /********************************* BUSQUEDA AVANZADA DE TRABAJADOR ************************************/
    /******************************************************************************************************/

    //* Reader Combo Area
    var rdautorizaarea = new Ext.data.JsonReader({
        root: 'valor',
        id: 'rdautorizaarea'
    }, [{
            name: 'idarea',
            mapping: 'idestructuraop'
        }, {
            name: 'nombre',
            mapping: 'denominacion'
        }]);

    //* Store Combo Area
    var starea = new Ext.data.Store({
        url: 'cargarAreas',
        reader: rdautorizaarea,
        sortInfo: {
            field: 'nombre',
            direction: 'ASC'
        }
    });

    //* Combo Area
    var cbarea = new Ext.form.ComboBox({
        emptyText: 'Seleccione...',
        editable: false,
        style: 'margin:0 0 0 10',
        labelStyle: 'margin:0 0 0 10',
        width: 50,
        allowBlank: false,
        store: starea,
        valueField: 'idarea',
        displayField: 'nombre',
        hiddenName: 'idarea',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        fieldLabel: '\xc1rea',
        anchor: '95%',
        listeners: {
            select: function(combo, record, index)
            {
                CargarAutorizaCargo(combo, record, index); // Cargar los cargos por el area seleccionada
            }
        }
    });

    // Reader Combo Cargo
    var rdautorizacargo = new Ext.data.JsonReader({
        root: 'valor',
        id: 'rdautorizacargo'
    }, [{
            name: 'idcargo'
        }, {
            name: 'nombre',
            mapping: 'Asignacion.denominacion'
        }]);

    // Store Combo Cargo
    var stcargo = new Ext.data.Store({
        url: 'cargarCargos',
        reader: rdautorizacargo,
        sortInfo: {
            field: 'nombre',
            direction: 'ASC'
        }
    });

    // Combo Cargo Anticipo
    var cbcargo = new Ext.form.ComboBox({
        emptyText: 'Seleccione...',
        editable: false,
        style: 'margin:0 0 0 10',
        labelStyle: 'margin:0 0 0 10',
        width: 50,
        disabled: true,
        allowBlank: true,
        store: stcargo,
        valueField: 'idcargo',
        displayField: 'nombre',
        hiddenName: 'idcargo',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        fieldLabel: 'Cargo',
        anchor: '95%',
        listeners: {
            select: function(combo, record, index)
            {
                verificarSiExisteWorker(combo, record, index); // Cargar el trabajador por el cargo seleccionado
            }
        }
    });
    //cbcargo.on('select', CargarAutorizaWorker);

    // Panel Autoriza
    var panelautoriza = new Ext.FormPanel({
        id: 'panelautoriza',
        labelAlign: 'top',
        frame: true,
        region: 'center',
        width: 100,
        height: 60,
        items: [cbarea, cbcargo]
    });

    //  Ventana Autoriza :: Trabajador que autoriza

    /* BOTON Aceptar    */
    var btnAceptar = new Ext.Button({
        text: 'Aceptar',
        id: 'btnAceptar',
        tooltip: 'Guardar datos y cerrar ventana',
//        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        handler: function() {
            if (cbarea.getValue())
                CargarWorker(cbarea.getValue(), cbcargo.getValue());
            else
            {
                mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).', function() {
                });
                panelautoriza.getForm().isValid();
                //panelautoriza.getForm().markInvalid();
                //var myArray = [{id:'cbarea', msg:'Este campo es obligatorio'}{id:'cbarea', msg:'Este campo es obligatorio'}];
                //formularioDatos.getForm().markInvalid(myArray);	 
            }
        }
    }

    );

    var winAvanzada = new Ext.Window({
        layout: 'border',
        id: 'winAvanzada',
        width: 300,
        height: 200,
        frame: true,
        modal: true,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        items: [panelautoriza],
        buttonAlign: 'right',
        buttons: [{
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
//                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                handler: function() {
                    winAvanzada.hide();
                    panelautoriza.getForm().reset();
                    cbcargo.disable();
                }
            },
            {
                text: 'Aceptar',
//                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                handler: function() {
                    if (cbarea.getValue())
                        CargarWorker(cbarea.getValue(), cbcargo.getValue());
                    else
                    {
                        mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).', function() {
                        });
                        panelautoriza.getForm().isValid();
                        //panelautoriza.getForm().markInvalid();
                        //var myArray = [{id:'cbarea', msg:'Este campo es obligatorio'}{id:'cbarea', msg:'Este campo es obligatorio'}];
                        //formularioDatos.getForm().markInvalid(myArray);	 
                    }
                }
            }]
    });

    /*********************************** FUNCIONES PARA EL BUSCADOR ***********************************/
    /**************************************************************************************************/

    /************************************* DE VENTANA PRINCIPAL ***************************************/
    //accion de btn aceptar
    function aceptarTrabajador() {
        if (stelementos.getCount() == 0) {
//            mostrarMensaje(1, "Debe tener seleccionado un elemento sobre alguna b&uacute;squeda exitosa.", function() {
            mostrarMensaje(1, "Debe seleccionar al menos un elemento para realizar la b&uacute;squeda.", function() {
            });
        }
        else {
            var selection = smbusqueda.getSelected(); //= new Array();
            store.removeAll();
            // ---------- Inserta -------------
            var recordTemp = Ext.data.Record.create([
                {
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'tipo',
                    type: 'int'
                }, {
                    name: 'denominacion',
                    type: 'string'
                }]);

            var p = new recordTemp({
                id: selection.data.id, //stautorizatrabajador.getAt(index).data.fullname,
                tipo: cbxtipobeneficiario.getValue(), //stautorizatrabajador.getAt(index).data.idpuestotrabajo, // idestructuracliente es el puesto de trabajo
                denominacion: selection.data.nro + "  " + selection.data.nombre //stautorizatrabajador.getAt(index).data.idtrabajador,   // id persona es el de estructura cliente
            });
            store.addSorted(p);
            micombo.setValue(selection.data.id);

            winbusquedagenerica.close();
            return;
        }

    }
    function BuscarconEnter(eventoObject)
    {
        if (eventoObject == 13)
            reloadAll();
    }

    function reloadAll()
    {
        if (cbxtipobeneficiario.getValue() != 0)
        {
            if (tfidentificador.isValid() && ((tfnombres.hidden && tfnombresCP.isValid()) || (!tfnombres.hidden && tfnombres.isValid() && tfapellidos.isValid())))
            {
                stelementos.load({
                    params: {
                        start: 0,
                        limit: 10,
                        tipo: cbxtipobeneficiario.getValue(),
                        identificador: tfidentificador.getValue(),
                        nombre: tfnombres.hidden ? tfnombresCP.getValue() : tfnombres.getValue(),
                        apellidos: tfapellidos.getValue()
                    },
                    callback: function(options, success, response) {
                        smbusqueda.selectRow(0, true);
                        if ((tfidentificador.getValue() != '' || (tfnombres.hidden && tfnombresCP.getValue() != '') || (!tfnombres.hidden && (tfnombres.getValue() != '' || tfapellidos.getValue() != ''))) && stelementos.getCount() == 0)
                        {
                            mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.", function() {
                            });
                        } else {
                            if (stelementos.getCount() == 0)
                                mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.", function() {
                                });
                        }
                    }
                })
            } else
                mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).', function() {
                });
        } else
        {
            cbxtipobeneficiario.markInvalid('Este campo es obligatorio.');
            cbxtipobeneficiario.focus(true, true);
            mostrarMensaje(1, "Debe seleccionar el elemento que desea para realizar la b&uacute;squeda.", function() {
            });
        }
    }

    /****************************** FUNCION QUE SE INTEGRA CON OTROS FICHEROS y COMPONENTES ****************/
    function RowDblClick(sm, indiceFila, record)
    {
        // idelemento = stelementos.data.items[indiceFila].get('id');
        var selection = sm.getSelections(); //= new Array();

        // ---------- Inserta -------------
        //strecibidopor.removeAll();  
        store.removeAll();
        var recordTemp = Ext.data.Record.create([
            {
                name: 'id',
                type: 'int'
            }, {
                name: 'tipo',
                type: 'int'
            }, {
                name: 'denominacion',
                type: 'string'
            }]);

        var p = new recordTemp({
            id: selection[0].data.id, //stautorizatrabajador.getAt(index).data.fullname,
            tipo: cbxtipobeneficiario.getValue(), //stautorizatrabajador.getAt(index).data.idpuestotrabajo, // idestructuracliente es el puesto de trabajo
            denominacion: selection[0].data.nro + "  " + selection[0].data.nombre //stautorizatrabajador.getAt(index).data.idtrabajador,   // id persona es el de estructura cliente
        });
        store.addSorted(p);
        micombo.setValue(selection[0].data.id);
        //strecibidopor.addSorted(p);  //strecibidopor.add(p);  
        //cbrecibidopor.setValue(selection[0].data.id);
        //cbrecibidopor.setValue(selection[0].data.nro+" - "+selection[0].data.nombre);
        //objdata = stFondo.getAt(stFondo.find('idfondo', cbFondo.getValue())).data;
        //cbxcliente.setRawValue(stautorizatrabajador.getAt(index).data.fullname);
        //cbxcliente.setValue(storecliente.getAt(0).get('idestructuracliente'));  este adicionar se pasa para el boton aceptar

        // ---------- Cierra --------------
        winbusquedagenerica.close();
        return;
    }

    /**************************** FUNCIONES PARA BUSQUEDA AVANZADA *******************************************/
    function CargarVentanaTrabajador() {
        panelautoriza.getForm().reset();
        winAvanzada.setTitle('B&uacute;squeda avanzada');
        if (starea.getCount() == 0)
        {
            MostrarmsgEtiquetas(Ext.getBody(), 'Cargando &aacute;reas...');
            starea.load({
                callback: function() {
                    lMaskbusctemp.hide();
                }
            });
        }
        winAvanzada.show();
    }

    function CargarAutorizaCargo(combo, record, index) {
        MostrarmsgEtiquetas(Ext.getBody(), 'Cargando cargos...');
        cbcargo.enable();
        cbcargo.clearValue();
        stcargo.removeAll();
        stcargo.load(
                {
                    params: {
                        idarea: record.data.idarea
                    },
                    callback: function() {
                        lMaskbusctemp.hide();
                    }
                });
    }

    function verificarSiExisteWorker(combo, record, index) {
        MostrarmsgEtiquetas(Ext.getBody(), 'Verificando existencia...');
        Ext.Ajax.request({
            url: 'buscarbeneficiario',
            method: 'POST',
            params: {
                start: 0,
                limit: 10,
                tipo: 4,
                idcargo: record.data.idcargo
            },
            callback: function(options, success, response) {
                lMaskbusctemp.hide();
                var result = response.responseText;
                data = Ext.decode(result);
                if (data.cantidad == 0)
                    mostrarMensaje(1, "No se encontraron resultados para el criterio de b&uacute;squeda.", function() {
                    });
            }
        });
    }

    function CargarWorker(idarea, idcargo) {
        cbcargo.disable();
        winAvanzada.hide();
        stelementos.load({
            params: {
                start: 0,
                limit: 10,
                idarea: idarea,
                idcargo: idcargo,
                tipo: cbxtipobeneficiario.getValue(),
                identificador: tfidentificador.getValue(),
                nombre: tfnombres.getValue(),
                apellidos: tfapellidos.getValue()
            },
            callback: function(options, success, response) {
                if (stelementos.getCount() == 0)
                    mostrarMensaje(1, "No se encontraron resultados para el criterio de b&uacute;squeda.", function() {
                    });
                else
                    smbusqueda.selectRow(0, true);
            }
        });
    }

    function winadicionarpersona(stelementos)
    {
        WinFpGestionarTrabajador(stelementos);
    }
    winbusquedagenerica.show();
}