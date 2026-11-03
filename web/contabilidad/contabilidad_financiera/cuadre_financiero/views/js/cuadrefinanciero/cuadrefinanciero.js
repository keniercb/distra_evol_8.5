Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('cuadrefinanciero', function() {
    cargarInterfaz(perfil.etiquetas);
});

var windowopen = false; //indica que se abrio una ventana
function cargarInterfaz(idioma) {
    MostrarEtiquetas(idioma.msgLoad);

    var btnadicionar = new Ext.Button({
        text: idioma.btnadicionar,
        tooltip: idioma.ttadicionar,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        handler: function() {
            mostrarAdicionar();
        }
    });
    var btnmodificar = new Ext.Button({
        text: idioma.btnmodificar,
        tooltip: idioma.ttmodificar,
        disabled: true,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        handler: function() {
            if (smcuadrefin.getSelected())
                mostrarModificar();
        }
    });
    var btneliminar = new Ext.Button({
        text: idioma.btneliminar,
        tooltip: idioma.tteliminar,
        disabled: true,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        handler: function() {
            if (smcuadrefin.getSelected())
                VerificaEliminar();
        }
    });
    var btnheredar = new Ext.Button({
        icon: '/contabilidad/comun/images/heredar.png',
        iconCls: 'btn',
        text: idioma.btnheredar,
        tooltip: idioma.ttheredar,
        handler: function() {
            mostrarHeredar();
        }
    });
    var btnayuda = new Ext.Button({
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: idioma.btnayuda,
        tooltip: idioma.ttayuda,
        handler: function() {
            var title = 'Mostrar ayuda de la funcionalidad';
            var referencia = 'confin/analisisEF/cuadreF/cuadreFinanciero';
            help.show(title, referencia);
        }
    });
    //stcuadrefin
    var stcuadrefin = new Ext.data.Store({
        url: 'cargarcuadresfinancieros',
        reader: new Ext.data.JsonReader({
            id: 'idRecord',
            root: 'campos',
            totalProperty: 'totalrecords'
        }, [{
                name: 'idcuadrefinanciero'
            }, {
                name: 'formula'
            }, {
                name: 'grupocuadre'
            }, {
                name: 'idgrupocuadre'
            }, {
                name: 'unidad'
            }, {
                name: 'idestructura'
            }, {
                name: 'idestructuraPadre'
            }, {
                name: 'fecha'
            }
        ]),
        listeners: {
            load: function(e)
            {
                if (stcuadrefin.getCount() > 0) {
                    smcuadrefin.selectFirstRow();
                } else {
                    btnmodificar.disable();
                    btneliminar.disable();
                }
                lMask.hide();
            }
        }
    });
    stcuadrefin.load({
        params: {
            start: 0,
            limit: 20
        }
    });
    // smcuadrefin
    var smcuadrefin = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    //gp cuadrefin
    var gpcuadrefin = new Ext.grid.GridPanel({
        id: 'gpCuadreFinanciero',
        tbar: [btnadicionar, btnmodificar, btneliminar, btnheredar, '->', btnayuda],
        layout: 'fit',
        border: false,
        autoExpandColumn: 'formula',
        sm: smcuadrefin,
        store: stcuadrefin,
        autoScroll: true,
        stripeRows: true,
        layoutConfig: {
            forceFit: true
        },
        loadMask: {
            store: stcuadrefin,
            msg: idioma.msgLoad
        },
        columns: [smcuadrefin,
            {
                id: 'idcuadrefinanciero',
                hidden: true,
                hideable: false,
                dataIndex: 'idcuadrefinanciero'
            }, {
                id: 'formula',
                header: idioma.lbformula,
                sortable: true,
                dataIndex: 'formula'
            }, {
                id: 'grupocuadre',
                header: idioma.lbgrupo,
                sortable: true,
                width: 280,
                dataIndex: 'grupocuadre'
            }, {
                id: 'idgrupocuadre',
                hidden: true,
                hideable: false,
                dataIndex: 'idgrupocuadre'
            }, {
                id: 'unidad',
                header: idioma.lbentidad,
                sortable: true,
                width: 260,
                dataIndex: 'unidad'
            }, {
                id: 'idestructura',
                hidden: true,
                hideable: false,
                dataIndex: 'idestructura'
            }, {
                id: 'idestructurapadre',
                hidden: true,
                hideable: false,
                dataIndex: 'idestructurapadre'
            }, {
                id: 'fecha',
                header: idioma.lbfecha,
                sortable: true,
                width: 100,
                dataIndex: 'fecha'
            }
        ],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stcuadrefin,
            displayInfo: true,
            displayMsg: 'Resultados de {0} - {1} de {2}',
            emptyMsg: "No hay resultados para mostrar."
        })
    });

    Ext.getCmp('gpCuadreFinanciero').on('render', function(t, r, re)
    {
        btnadicionar.focus();
    });

    new Ext.Viewport({
        layout: 'fit',
        border: false,
        items: gpcuadrefin
    });

//teclas calientes
    new Ext.KeyMap(Ext.getBody(), [{// ADICIONAR
            key: 'i',
            alt: true,
            fn: function() {
                if (!windowopen)
                    btnadicionar.handler();
            }
        }, {// Modificar
            key: 'm',
            alt: true,
            fn: function() {
                if (!windowopen && !btnmodificar.disabled) {
                    btnmodificar.handler();
                }
            }
        }, {// Eliminar
            key: Ext.EventObject.DELETE,
            fn: function() {
                if (!windowopen && !btneliminar.disabled) {
                    btneliminar.handler();
                }
            }
        }, {// Heredar
            key: 'e',
            alt: true,
            fn: function() {
                if (!windowopen && !btnheredar.disabled) {
                    btnheredar.handler();
                }
            }
        }, {// Ayuda
            key: 'h',
            alt: true,
            fn: function() {
                var title = 'Mostrar ayuda de la funcionalidad';
                var referencia = 'confin/analisisEF/cuadreF/cuadreFinanciero';
                help.show(title, referencia);
            }
        }
    ]);


    //muestra la ventana adicionar cuadre************************************************
    function mostrarAdicionar() {
        /*************FILA 1******************/
        // btn +
        var btnmas = new Ext.Button({
            id: 'btnmas',
            tooltip: idioma.btnSumar,
            icon: '/contabilidad/comun/images/sumar.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador o "("
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '(') {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' +');
                    }
                }
            }
        });
        // btn -
        var btnmenos = new Ext.Button({
            id: 'btnmenos',
            tooltip: idioma.btnRestar,
            icon: '/contabilidad/comun/images/restar.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter)) {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' -');
                    }

                }
            }
        });
        // btn /+/
        var btnentre = new Ext.Button({
            id: 'btnentre',
            tooltip: idioma.btnDividir,
            icon: '/contabilidad/comun/images/dividir.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '(') {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' /');
                    }
                }
            }
        });
        // btn *
        var btnpor = new Ext.Button({
            id: 'btnpor',
            tooltip: idioma.btnMultiplicar,
            icon: '/contabilidad/comun/images/multiplicar.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '(') {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' *');
                    }
                }
            }
        });
        /*******FILA 2*************/
        // btn (
        var btnpar1 = new Ext.Button({
            id: 'btnpar1',
            tooltip: idioma.btnParentisisA,
            icon: '/contabilidad/comun/images/parentesisA.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si realiza la validacion para el caso en que el campo formula este vacio
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=') {
                        //se agrega el parentesis con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' (');
                    }
                } else
                    Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '(');
            }
        });
        // btn )
        var btnpar2 = new Ext.Button({
            id: 'btnpar2',
            tooltip: idioma.btnParentisisC,
            icon: '/contabilidad/comun/images/parentesisC.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si realiza la validacion para el caso en que el campo formula este vacio
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador ni signo de igualdad o abrir parentesis
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=' && caracter != '(') {
                        //se agrega el parentesis con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' )');
                    }
                }
            }
        });
        // btn [
        var btncor1 = new Ext.Button({
            id: 'btncor1',
            tooltip: 'Abrir corchete',
            //text : '<b>[</b>',
            iconCls: 'abrircorchete',
            minWidth: 30,
            handler: function() {
                Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '[');
            }
        });
        // btn ]
        var btncor2 = new Ext.Button({
            id: 'btncor2',
            tooltip: 'Cerrar corchete',
            text: '<b>]</b>',
            iconCls: 'cerrarcorchete',
            minWidth: 30,
            handler: function() {
                Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ']');
            }
        });
        /*******FILA 3*************/
        // btn =
        var btnigual = new Ext.Button({
            id: 'btnigual',
            tooltip: idioma.btnIguala,
            icon: '/contabilidad/comun/images/igual.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    var caracterAnterior = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 2);
                    if (!isOperador(caracter) && caracter != '(' || (caracter == '<' || caracter == '>' || caracter == '=') && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<')) {
                        //si el operador es < o >
                        if ((caracter == '>' || caracter == '<') && caracter != '=') {
                            //se agrega el operador sin el espacio
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '=');
                        }
                        else if (!isOperador(caracter) && caracter != '(')
                        {
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' =');
                        }
                    }
                }
            }
        });
        // btn >
        var btnmayor1 = new Ext.Button({
            id: 'btnmayor1',
            tooltip: idioma.btnMayor,
            icon: '/contabilidad/comun/images/mayor.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    var caracterAnterior = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 2);
                    if (isOperador(caracter) && caracter != '(' && (caracter == '<' || caracter == '>' || caracter == '=') && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<')) {
                        //si el operador es < o >
                        if ((caracter != '>' || caracter != '<') && caracter == '=') {
                            //se agrega el operador sin el espacio
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '>');
                        }
                    }
                    //en caso de no se un operador el ultimo caracter se adiciona con espacio
                    else if (caracter != '>' && caracter != '(' && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<'))
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' >');
                }
            }
        });
        // btn <
        var btnmayor2 = new Ext.Button({
            id: 'btnmayor2',
            tooltip: idioma.btnMenor,
            icon: '/contabilidad/comun/images/menor.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    var caracterAnterior = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 2);
                    if (isOperador(caracter) && caracter != '(' && (caracter == '<' || caracter == '>' || caracter == '=') && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<')) {
                        //si el operador es < o >
                        if ((caracter != '>' || caracter != '<') && caracter == '=') {
                            //se agrega el operador sin el espacio
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '>');
                        }
                    }
                    //en caso de no se un operador el ultimo caracter se adiciona con espacio
                    else if (caracter != '<' && caracter != '(' && (caracterAnterior != '=' && caracterAnterior != '<' && caracterAnterior != '<'))
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' <');
                }
            }
        });
        // btn ||
        var btnborrar = new Ext.Button({
            id: 'btnborrar',
            tooltip: idioma.btnBorrar,
            icon: '/contabilidad/comun/images/deshacer.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //almaceno temporalmente el valor del campo formula
                var formtmp = Ext.getCmp('tfformula').getValue();
                //almacena la posicion hasta la cual se va a eliminar la cadena
                var pos = 0;
                //si el campo formula no esta vacio lo recorro de atras para alante
                if (formtmp.length != 0) {
                    for (var i = formtmp.length - 1; i >= 0; i--) {
                        if (formtmp.charAt(i) == ' ') {
                            pos = i;
                            break;
                        }
                    }
                }
                //corto la cadena original por pos  substring
                Ext.getCmp('tfformula').setValue(formtmp.substr(0, pos));
            }
        });
        /*******FILA 4*************/
        // btn Sup
        var btnsuprimir = new Ext.Button({
            id: 'btnsuprimir',
            tooltip: idioma.btnBorrarTodo,
            icon: '/contabilidad/comun/images/limpiar.png',
            iconCls: 'btn',
            minWidth: 65,
            handler: function() {
                Ext.getCmp('tfformula').setValue('');
            }
        });
        /*******fin FILA 4*************/
        //textfield formula  ^
        var tfformula = new Ext.form.TextArea({
            id: 'tfformula',
            readOnly: true,
            allowBlank: false,
            fieldLabel: idioma.lbformula,
            //regex:/^[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*(=|<|>)[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*$/,
            //
            //regex:/^[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*(=|<|>)[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*$/,
            //
            //(\([0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*\) PUEDO PONER UNA EXPRESION ENTRE PARENTESIS
            width: 415,
            height: 50
        });
        //btn aceptar
        var btnaceptar = new Ext.Button({
            id: 'btnaceptar',
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            text: idioma.btnaceptar,
            tooltip: idioma.ttaceptar,
            handler: function() {
                if (validaInterfaz()) {
                    if (ValidaEcuacion(Ext.getCmp('tfformula').getValue())) {
                        addCuadre();
                        win.destroy();
                    } else {
                        Ext.getCmp('tfformula').markInvalid(idioma.msgEcuacionInvalid);
                    }
                }
                btnadicionar.focus();
            }
        });
        //btn aplicar
        var btnaplicar = new Ext.Button({
            id: 'btnaplicar',
            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'btn',
            text: idioma.btnaplicar,
            tooltip: idioma.ttaplicar,
            handler: function() {
                if (validaInterfaz()) {
                    if (ValidaEcuacion(Ext.getCmp('tfformula').getValue())) {
                        addCuadre();
                        Ext.getCmp('tfformula').reset();
                    } else {
                        Ext.getCmp('tfformula').markInvalid(idioma.msgEcuacionInvalid);
                    }
                }
                btnadicionar.focus();
            }
        });
        //btn cancelar
        var btncancelar = new Ext.Button({
            id: 'btncancelar',
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            text: idioma.btncancelar,
            tooltip: idioma.ttcancelar,
            handler: function() {
                win.destroy();
                btnadicionar.focus();
            }
        });
        //store del cbgrupo
        var stgrupo = new Ext.data.Store({
            url: 'cargargrupocuadre',
            reader: new Ext.data.JsonReader({
                id: "idstgrupo"
            }, [{
                    name: 'idgrupocuadre'
                },
                {
                    name: 'denominacion'
                }
            ])
        });
        stgrupo.load();
        //combo grupo de explotacion
        var cbgrupo = new Ext.form.ComboBox({
            fieldLabel: idioma.lbgrupo,
            emptyText: idioma.lbseleccione,
            mode: 'local',
            id: 'cbgrupo',
            store: stgrupo,
            valueField: 'idgrupocuadre',
            displayField: 'denominacion',
            typeAhead: true,
            forceSelection: true,
            triggerAction: 'all',
            editable: false,
            resizable: true,
            allowBlank: false,
            listWidth: 240,
            width: 155
        });
        var tfEntidad = new Ext.form.TextArea({
            fieldLabel: idioma.lbentidad,
            name: 'entidad',
            id: 'entidad',
            disabled: true,
            emptyText: idioma.lbemptyentidad,
            width: 155,
            height: 100
        });
        tfEntidad.on('focus', function(t, e)
        {
            mostrarEntidades();
        }, this);
        //Creo el arbol de cuentas
        var treeLoader = new Ext.tree.TreeLoader({
            dataUrl: 'cargararbolcuenta'
        });
        var tpnomcta = new Ext.tree.TreePanel({
            title: idioma.lbnomcta,
            autoScroll: true,
            id: 'tpnomcta',
            enableDD: false,
            border: false,
            frame: true,
            style: 'margin: 5 0 0 5',
            height: 300,
            width: 240,
            root: new Ext.tree.AsyncTreeNode({
                text: idioma.lbcuentas,
                draggable: false,
                id: '0'
            }),
            loader: treeLoader,
            listeners: {
                dblclick: function(nodo) {
                    //si el nodo no es root
                    if (nodo.attributes.id != 0) {
                        //si esta vacio el campo formula agrego caracter sin espacio
                        if (Ext.getCmp('tfformula').getValue().length == 0) {
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + nodo.attributes.concatcta);
                        }
                        else {
                            var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                            //si lo que esta alante es caracter, '(', o signo se adiciona la cuenta con espacio
                            if (isOperador(caracter) || caracter == '(' || (caracter == '<' || caracter == '>' || caracter == '=')) {
                                Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' ' + nodo.attributes.concatcta);
                            }
                        }
                    }
                }
            }
        });
        var nodopadre = new Ext.tree.AsyncTreeNode({
            text: idioma.lbcuentas,
            draggable: false,
            id: '0',
            leaf: false
        });
        tpnomcta.setRootNode(nodopadre);//crear la lista de hijos
        //contiene los operadores
        var poperadores = new Ext.Panel({
            title: idioma.lboperadores,
            style: 'margin: 5 0 0 15',
            width: 150,
            frame: true,
            items: [{
                    layout: 'column',
                    items: [{
                            style: 'margin:5 0 0 0',
                            layout: 'form',
                            items: [btnmas]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnmenos]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnentre]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnpor]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            style: 'margin:5 0 0 0',
                            layout: 'form',
                            items: [btnpar1]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnpar2]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnmayor1]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnmayor2]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            style: 'margin:5 0 0 0',
                            layout: 'form',
                            items: [btnigual]
                        },
                        {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnborrar]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnsuprimir]
                        }]
                }]
        });
        //contiene los componentes del add cuadre
        var fpcuadre = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            style: 'margin: 10 0 0 10',
                            layout: 'form',
                            items: [cbgrupo, tfEntidad]
                        }, {
                            xtype: 'fieldset',
                            style: 'margin: 5 0 0 10',
                            title: idioma.lbformulas,
//                            title: 'Editor de f&oacute;rmulas',
                            autoHeight: true,
                            width: 450,
                            items: [{
                                    layout: 'column',
                                    items: [{
                                            items: [{
                                                    layout: 'form',
                                                    items: [tpnomcta]
                                                }]
                                        }, {
                                            items: [{
                                                    layout: 'form',
                                                    items: [poperadores]
                                                }]
                                        }]
                                }, {
                                    layout: 'form',
                                    style: 'margin: 5 0 0 5',
                                    items: tfformula
                                }]
                        }]
                }
            ]
        });

        var win = new Ext.Window({
            title: idioma.lbaddcuadre,
            resizable: false,
            width: 640,
            height: 500,
            layout: 'fit',
            buttons: [btncancelar, btnaplicar, btnaceptar],
            defaultButton: 'btnaceptar',
            listeners: {
                hide: function() {
                    windowopen = false;
                },
                destroy: function() {
                    windowopen = false;
                },
                show: function() {
                    windowopen = true;
                },
                render: function() {
                    win.focus();
                }
            }
        });
        win.add(fpcuadre);
        win.show();

        var winEntidades;
        //busca las estructuras hijas y crea el arbol
        function buscarEstructurae()
        {
            Ext.Ajax.request({
                url: 'obtenerestructurae',
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    idestructurae = responseData.idestructurae;
                    descripcion = responseData.descripcion;
                    nodopadre = new Ext.tree.AsyncTreeNode({
                        text: descripcion,
                        draggable: false,
                        id: idestructurae,
                        checked: true
                    });
                    treeLoader = new Ext.tree.TreeLoader({
                        dataUrl: 'cargararbolestructurae'
                    });
                    tpEstructurae = new Ext.tree.TreePanel({
                        autoScroll: true,
                        id: 'tpestructurae',
                        style: 'margin: 10 0 0 0',
                        enableDD: false,
                        border: false,
                        root: nodopadre,
                        loader: treeLoader
                    });
                    pEntidades = new Ext.Panel({
                        frame: false,
                        layout: 'fit',
                        labelWidth: 50,
                        height: 380,
                        width: 430,
                        items: tpEstructurae
                    });
                    if (idestructurae && descripcion)
                        tfEntidad.enable();
                }
            });
        }
        buscarEstructurae();
        //muestra la ventana con el arbol de estructuras
        function mostrarEntidades()
        {
            chequeados = new Array();
            entselec = new Array();
            var texto = '';
            if (!winEntidades) {
                winEntidades = new Ext.Window({
                    modal: true,
                    layout: 'fit',
                    closeAction: 'hide',
                    title: idioma.lbentidades,
                    buttons: [{
                            icon: perfil.dirImg + 'cancelar.png',
                            iconCls: 'btn',
                            text: idioma.btncancelar,
                            tooltip: idioma.ttcancelar,
                            handler: function() {
                                winEntidades.hide();
                            }
                        }, {
                            icon: perfil.dirImg + 'aceptar.png',
                            iconCls: 'btn',
                            handler: function() {
                                if (tpEstructurae.getChecked().length > 0) {
                                    chequeados = tpEstructurae.getChecked();
                                    for (var i = 0; i < chequeados.length; i++)
                                        entselec.push(chequeados[i]['id']);
                                    for (var j = 0; j < chequeados.length - 1; j++)
                                        texto += chequeados[j]['text'] + ', \n';
                                    texto += chequeados[chequeados.length - 1]['text'];
                                }
                                winEntidades.hide();
                                tfEntidad.reset();
                                tfEntidad.setValue(texto);
                                texto = '';
                            },
                            text: idioma.btnaceptar,
                            tooltip: idioma.ttaceptar
                        }]
                });
            }
            winEntidades.show();
            winEntidades.add(pEntidades);
            winEntidades.doLayout();
            winEntidades.center();
        }
    }//fin de la funcion mostrarAdicionar()
    //**********************************************************************/
    //muestra la ventana modificar cuadre
    function mostrarModificar() {
        /*************FILA 1******************/
        // btn +
        var btnmas = new Ext.Button({
            id: 'btnmas',
            tooltip: idioma.btnSumar,
            icon: '/contabilidad/comun/images/sumar.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador o "("
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '(') {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' +');
                    }
                }
            }
        });
        // btn -
        var btnmenos = new Ext.Button({
            id: 'btnmenos',
            tooltip: idioma.btnRestar,
            icon: '/contabilidad/comun/images/restar.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter)) {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' -');
                    }

                }
            }
        });
        // btn /+/
        var btnentre = new Ext.Button({
            id: 'btnentre',
            tooltip: idioma.btnDividir,
            icon: '/contabilidad/comun/images/dividir.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '(') {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' /');
                    }
                }
            }
        });
        // btn *
        var btnpor = new Ext.Button({
            id: 'btnpor',
            tooltip: idioma.btnMultiplicar,
            icon: '/contabilidad/comun/images/multiplicar.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '(') {
                        //se agrega el operador con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' *');
                    }
                }
            }
        });
        /*******FILA 2*************/
        // btn (
        var btnpar1 = new Ext.Button({
            id: 'btnpar1',
            tooltip: idioma.btnParentisisA,
            icon: '/contabilidad/comun/images/parentesisA.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si realiza la validacion para el caso en que el campo formula este vacio
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=') {
                        //se agrega el parentesis con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' (');
                    }
                } else
                    Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '(');
            }
        });
        // btn )
        var btnpar2 = new Ext.Button({
            id: 'btnpar2',
            tooltip: idioma.btnParentisisC,
            icon: '/contabilidad/comun/images/parentesisC.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si realiza la validacion para el caso en que el campo formula este vacio
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador ni signo de igualdad o abrir parentesis
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    if (!isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=' && caracter != '(') {
                        //se agrega el parentesis con el espacio
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' )');
                    }
                }
            }
        });
        // btn [
        var btncor1 = new Ext.Button({
            id: 'btncor1',
            tooltip: 'Abrir corchete',
            //text : '<b>[</b>',
            iconCls: 'abrircorchete',
            minWidth: 30,
            handler: function() {
                Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '[');
            }
        });
        // btn ]
        var btncor2 = new Ext.Button({
            id: 'btncor2',
            tooltip: 'Cerrar corchete',
            text: '<b>]</b>',
            iconCls: 'cerrarcorchete',
            minWidth: 30,
            handler: function() {
                Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ']');
            }
        });
        /*******FILA 3*************/
        // btn =
        var btnigual = new Ext.Button({
            id: 'btnigual',
            tooltip: idioma.btnIguala,
            icon: '/contabilidad/comun/images/igual.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    var caracterAnterior = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 2);
                    if (!isOperador(caracter) && caracter != '(' || (caracter == '<' || caracter == '>' || caracter == '=') && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<')) {
                        //si el operador es < o >
                        if ((caracter == '>' || caracter == '<') && caracter != '=') {
                            //se agrega el operador sin el espacio
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '=');
                        }
                        else if (!isOperador(caracter) && caracter != '(')
                        {
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' =');
                        }
                    }
                }
            }
        });
        // btn >
        var btnmayor1 = new Ext.Button({
            id: 'btnmayor1',
            tooltip: idioma.btnMayor,
            icon: '/contabilidad/comun/images/mayor.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    var caracterAnterior = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 2);
                    if (isOperador(caracter) && caracter != '(' && (caracter == '<' || caracter == '>' || caracter == '=') && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<')) {
                        //si el operador es < o >
                        if ((caracter != '>' || caracter != '<') && caracter == '=') {
                            //se agrega el operador sin el espacio
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '>');
                        }
                    }
                    //en caso de no se un operador el ultimo caracter se adiciona con espacio
                    else if (caracter != '>' && caracter != '(' && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<'))
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' >');
                }
            }
        });
        // btn <
        var btnmayor2 = new Ext.Button({
            id: 'btnmayor2',
            tooltip: idioma.btnMenor,
            icon: '/contabilidad/comun/images/menor.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //si esta vacio el campo formula no se agrega el caracter
                if (!(Ext.getCmp('tfformula').getValue().length == 0)) {
                    //se valida que el ultimo caracter no sea un operador
                    var caracter = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 1);
                    var caracterAnterior = Ext.getCmp('tfformula').getValue().charAt(Ext.getCmp('tfformula').getValue().length - 2);
                    if (isOperador(caracter) && caracter != '(' && (caracter == '<' || caracter == '>' || caracter == '=') && (caracterAnterior != '=' && caracterAnterior != '>' && caracterAnterior != '<')) {
                        //si el operador es < o >
                        if ((caracter != '>' || caracter != '<') && caracter == '=') {
                            //se agrega el operador sin el espacio
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + '>');
                        }
                    }
                    //en caso de no se un operador el ultimo caracter se adiciona con espacio
                    else if (caracter != '<' && caracter != '(' && (caracterAnterior != '=' && caracterAnterior != '<' && caracterAnterior != '<'))
                        Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' <');
                }
            }
        });
        // btn ||
        var btnborrar = new Ext.Button({
            id: 'btnborrar',
            tooltip: idioma.btnBorrar,
            icon: '/contabilidad/comun/images/deshacer.png',
            iconCls: 'btn',
            minWidth: 30,
            handler: function() {
                //almaceno temporalmente el valor del campo formula
                var formtmp = Ext.getCmp('tfformula').getValue();
                //almacena la posicion hasta la cual se va a eliminar la cadena
                var pos = 0;
                //si el campo formula no esta vacio lo recorro de atras para alante
                if (formtmp.length != 0) {
                    for (var i = formtmp.length - 1; i >= 0; i--) {
                        if (formtmp.charAt(i) == ' ') {
                            pos = i;
                            break;
                        }
                    }
                }
                //corto la cadena original por pos  substring
                Ext.getCmp('tfformula').setValue(formtmp.substr(0, pos));
            }
        });
        /*******FILA 4*************/
        // btn Sup
        var btnsuprimir = new Ext.Button({
            id: 'btnsuprimir',
            tooltip: idioma.btnBorrarTodo,
            icon: '/contabilidad/comun/images/limpiar.png',
            iconCls: 'btn',
            minWidth: 65,
            handler: function() {
                Ext.getCmp('tfformula').setValue('');
            }
        });
        /*******fin FILA 4*************/
        //textfield formula  ^
        var tfformula = new Ext.form.TextArea({
            id: 'tfformula',
            readOnly: true,
            allowBlank: false,
            fieldLabel: idioma.lbformula,
            //regex:/^[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*(=|<|>)[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*$/,
            //
            //regex:/^[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*(=|<|>)[0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*$/,
            //
            //(\([0-9]{1,8}(\.[0-9]{1,8})?((\+|-|\*|\/)([0-9]{1,8}(\.[0-9]{1,8})?))*\) PUEDO PONER UNA EXPRESION ENTRE PARENTESIS
            width: 415,
            height: 50
        });
        //se manda a cargar la formula de la fila seleccionada

        tfformula.setValue(smcuadrefin.getSelected().data.formula);

        //btn aceptar
        var btnaceptar = new Ext.Button({
            id: 'btnaceptar',
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            text: idioma.btnaceptar,
            tooltip: idioma.ttaceptar,
            handler: function() {
                if (validaInterfaz()) {
                    if (ValidaEcuacion(Ext.getCmp('tfformula').getValue())) {
                        modCuadre();
                        win.destroy();
                    } else {
                        Ext.getCmp('tfformula').markInvalid(idioma.msgEcuacionInvalid);
                    }
                }
            }
        });
        //btn cancelar
        var btncancelar = new Ext.Button({
            id: 'btncancelar',
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            text: idioma.btncancelar,
            tooltip: idioma.ttcancelar,
            handler: function() {
                win.destroy();
            }
        });
        //store del cbgrupo
        var stgrupo = new Ext.data.Store({
            url: 'cargargrupocuadre',
            reader: new Ext.data.JsonReader({
                id: "idstgrupo"
            }, [{
                    name: 'idgrupocuadre'
                },
                {
                    name: 'denominacion'
                }
            ])
        });
        stgrupo.load();
        //combo grupo de explotacion
        var cbgrupo = new Ext.form.ComboBox({
            fieldLabel: idioma.lbgrupo,
            emptyText: idioma.lbseleccione,
            mode: 'local',
            id: 'cbgrupo',
            store: stgrupo,
            valueField: 'idgrupocuadre',
            displayField: 'denominacion',
            typeAhead: true,
            forceSelection: true,
            triggerAction: 'all',
            editable: false,
            resizable: true,
            allowBlank: false,
            listWidth: 240,
            width: 155
        });
        //campo para mostrar las entidades
        var tfEntidad = new Ext.form.TextArea({
            fieldLabel: idioma.lbentidad,
            emptyText: idioma.lbemptyentidad,
            name: 'entidad',
            id: 'entidad',
            disabled: false,
            width: 155,
            height: 100
        });
        tfEntidad.setValue(smcuadrefin.getSelected().data.unidad);
        tfEntidad.on('focus', function(t, e)
        {
            mostrarEntidades();
        }, this);
        //Creo el arbol de cuentas
        var treeLoader = new Ext.tree.TreeLoader({
            dataUrl: 'cargararbolcuenta'
        });
        var tpnomcta = new Ext.tree.TreePanel({
            title: idioma.lbnomcta,
            autoScroll: true,
            id: 'tpnomcta',
            enableDD: false,
            border: false,
            frame: true,
            style: 'margin: 5 0 0 5',
            height: 300,
            width: 240,
            root: new Ext.tree.AsyncTreeNode({
                text: idioma.lbcuentas,
                draggable: false,
                id: '0'
            }),
            loader: treeLoader,
            listeners: {
                dblclick: function(nodo) {
                    //si el nodo no es root
                    if (nodo.attributes.id != 0) {
                        //si esta vacio el campo formula agrego caracter sin espacio
                        if (Ext.getCmp('tfformula').getValue().length == 0)
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + nodo.attributes.concatcta);
                        //si no esta vacio el campo formula agrego caracter con espacio
                        else
                            Ext.getCmp('tfformula').setValue(Ext.getCmp('tfformula').getValue() + ' ' + nodo.attributes.concatcta);
                    }
                }
            }
        });
        var nodopadre = new Ext.tree.AsyncTreeNode({
            text: idioma.lbcuentas,
            draggable: false,
            id: '0',
            leaf: false
        });
        tpnomcta.setRootNode(nodopadre);//crear la lista de hijos
        //contiene los operadores
        var poperadores = new Ext.Panel({
            title: idioma.lboperadores,
            style: 'margin: 5 0 0 15',
            width: 150,
            frame: true,
            items: [{
                    layout: 'column',
                    items: [{
                            style: 'margin:5 0 0 0',
                            layout: 'form',
                            items: [btnmas]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnmenos]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnentre]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnpor]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            style: 'margin:5 0 0 0',
                            layout: 'form',
                            items: [btnpar1]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnpar2]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnmayor1]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnmayor2]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            style: 'margin:5 0 0 0',
                            layout: 'form',
                            items: [btnigual]
                        },
                        {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnborrar]
                        }, {
                            style: 'margin:5 0 0 5',
                            layout: 'form',
                            items: [btnsuprimir]
                        }]
                }]
        });
        //contiene los componentes del add cuadre
        var fpcuadre = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            style: 'margin: 10 0 0 10',
                            layout: 'form',
                            items: [cbgrupo, tfEntidad]
                        }, {
                            xtype: 'fieldset',
                            style: 'margin: 5 0 0 10',
                            //title : idioma.lbformulas,
                            title: 'Editor de f&oacute;rmulas',
                            autoHeight: true,
                            width: 450,
                            items: [{
                                    layout: 'column',
                                    items: [{
                                            items: [{
                                                    layout: 'form',
                                                    items: [tpnomcta]
                                                }]
                                        }, {
                                            items: [{
                                                    layout: 'form',
                                                    items: [poperadores]
                                                }]
                                        }]
                                }, {
                                    layout: 'form',
                                    style: 'margin: 5 0 0 5',
                                    items: tfformula
                                }]
                        }]
                }
            ]
        });

        var win = new Ext.Window({
            title: idioma.lbmodcuadre,
            resizable: false,
            width: 640,
            height: 500,
            layout: 'fit',
            buttons: [btncancelar, btnaceptar],
            listeners: {
                hide: function() {
                    windowopen = false;
                },
                destroy: function() {
                    windowopen = false;
                },
                show: function() {
                    windowopen = true;
                }
            }
        });
        win.add(fpcuadre);
        win.show();

        var winEntidades;
        //busca las estructuras hijas y crea el arbol
        function buscarEstructurae()
        {
            Ext.Ajax.request({
                url: 'obtenerestructurae',
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    idestructurae = responseData.idestructurae;
                    descripcion = responseData.descripcion;
                    nodopadre = new Ext.tree.AsyncTreeNode({
                        text: descripcion,
                        draggable: false,
                        id: idestructurae,
                        checked: true
                    });
                    treeLoader = new Ext.tree.TreeLoader({
                        dataUrl: 'cargararbolestructurae'
                    });
                    tpEstructurae = new Ext.tree.TreePanel({
                        autoScroll: true,
                        id: 'tpestructurae',
                        style: 'margin: 10 0 0 0',
                        enableDD: false,
                        border: false,
                        root: nodopadre,
                        loader: treeLoader
                    });
                    pEntidades = new Ext.Panel({
                        frame: false,
                        labelWidth: 50,
                        height: 380,
                        width: 430,
                        items: tpEstructurae
                    });
                    if (idestructurae && descripcion)
                        tfEntidad.enable();
                }
            });
        }
        buscarEstructurae();
        //muestra la ventana con el arbol de estructuras
        function mostrarEntidades()
        {
            chequeados = new Array();
            entselec = new Array();
            var texto = '';
            if (!winEntidades) {
                winEntidades = new Ext.Window({
                    modal: true,
                    layout: 'fit',
                    closeAction: 'hide',
                    title: idioma.lbentidades,
                    buttons: [{
                            icon: perfil.dirImg + 'cancelar.png',
                            iconCls: 'btn',
                            text: idioma.btncancelar,
                            tooltip: idioma.ttcancelar,
                            handler: function() {
                                winEntidades.hide();
                            }
                        }, {
                            icon: perfil.dirImg + 'aceptar.png',
                            iconCls: 'btn',
                            handler: function() {
                                if (tpEstructurae.getChecked().length > 0) {
                                    chequeados = tpEstructurae.getChecked();
                                    for (var i = 0; i < chequeados.length; i++)
                                        entselec.push(chequeados[i]['id']);
                                    for (var j = 0; j < chequeados.length - 1; j++)
                                        texto += chequeados[j]['text'] + ', \n';
                                    texto += chequeados[chequeados.length - 1]['text'];
                                }
                                winEntidades.hide();
                                tfEntidad.reset();
                                tfEntidad.setValue(texto);
                                texto = '';
                            },
                            text: idioma.btnaceptar,
                            tooltip: idioma.ttaceptar
                        }]
                });
            }
            winEntidades.show();
            winEntidades.add(pEntidades);
            winEntidades.doLayout();
            winEntidades.center();
        }
        //se manda a cargar el grupo de cuadre seleccionado
        cbgrupo.setValue(smcuadrefin.getSelected().data.idgrupocuadre);
        //se le pasa como value el id del grupo seleccionado de la fila
        cbgrupo.setRawValue(smcuadrefin.getSelected().data.grupocuadre);
    }//fin de la funcion mostrarModificar

    /*****************************************************************************************/

    //funcion para adicionar un cuadre financiero
    function addCuadre() {
        progressBar(idioma.msgGuardando);//barra de progreso
        var estructuras = new Array();//array para almacenar los id estructuras
        if (tpEstructurae.getChecked().length > 0) {//se recorre el arbol de estructuras
            var chequeados = tpEstructurae.getChecked();//se obtienen los marcados
            for (var i = 0; i < chequeados.length; i++) {//se recorren los marcados y se adicionan los id al array estructuras
                estructuras.push(parseFloat(chequeados[i]['id']));
            }
        }

        Ext.Ajax.request({//se envian los datos
            url: 'adicionarcuadre',
            method: 'POST',
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.MessageBox.hide();//oculta la barra de progreso
                if (responseData == true) {//si se adiciono correctamente
                    mostrarMensaje(1, idioma.msgAdicionado, function() {
                        stcuadrefin.reload();
                    });
                }
                else {//si no se adiciono correctamente
                    mostrarMensaje(1, idioma.msgErrorAdicionar, function() {
                    });
                }
            },
            params: {
                formula: Ext.getCmp('tfformula').getValue(),
                idgrupo: Ext.getCmp('cbgrupo').getValue(),
                arrayestructuras: Ext.encode(estructuras)
            }
        });
    }//fin de la funcion addCuadre()

    //funcion para modificar un cuadre financiero
    function modCuadre() {
        progressBar(idioma.msgGuardando);//barra de progreso
        var estructuras = new Array();//array para almacenar los id estructuras
        if (tpEstructurae.getChecked().length > 0) {//se recorre el arbol de estructuras
            var chequeados = tpEstructurae.getChecked();//se obtienen los marcados
            for (var i = 0; i < chequeados.length; i++) {//se recorren los marcados y se adicionan los id al array estructuras
                estructuras.push(parseFloat(chequeados[i]['id']));
            }
        }
        Ext.Ajax.request({//se envian los datos
            url: 'modificarcuadre',
            method: 'POST',
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.MessageBox.hide();//oculta la barra de progreso
                if (responseData == true) {//si se modifico correctamente
                    mostrarMensaje(1, idioma.msgModificado, function() {
                        stcuadrefin.reload();
                    });
                }
                else {//si no se adiciono correctamente
                    mostrarMensaje(1, idioma.msgErrorModificar, function() {
                    });
                }
            },
            params: {
                formula: Ext.getCmp('tfformula').getValue(),
                idgrupo: Ext.getCmp('cbgrupo').getValue(),
                idcuadre: smcuadrefin.getSelected().data.idcuadrefinanciero,
                arrayestructuras: Ext.encode(estructuras)
            }
        });
    }//fin de la funcion modCuadre()


    function VerificaEliminar() {
        windowopen = true;
        mostrarMensaje(2, (smcuadrefin.getSelections().length <= 1) ? idioma.msgSingleDelcuadre : idioma.msgPluralDelcuadre, function(btn) {
            if (btn == 'ok') {
                eliminar();
            } else {
                windowopen = false;
            }
        });
    }
    //elimina los cuadres financieros
    function eliminar() {

        progressBar(idioma.msgDel);//barra de progreso
        var idcuadresselec = smcuadrefin.getSelections();//almacena los id de los cuadres seleccionados
        idcuadres = new Array();
        //se recorre el array seleccionados para obtener los idgrupo
        for (var i = 0; i < idcuadresselec.length; i++) {
            idcuadres.push(parseFloat(idcuadresselec[i].data.idcuadrefinanciero));
        }
        Ext.Ajax.request({
            url: 'eliminarcuadrefinanciero',
            method: 'POST',
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.MessageBox.hide();//oculta la barra de progreso
                btnmodificar.disable();
                btneliminar.disable();
                lMask.hide();
                if (responseData) {
                    if (idcuadres.length === 1)
                        mostrarMensaje(1, idioma.msgDelSingleOk, function() {
                        });
                    else
                        mostrarMensaje(1, idioma.msgDelPluralOk, function() {
                        });
                } else {
                    if (idcuadres.length === 1)
                        mostrarMensaje(1, idioma.msgDelSingleBad, function() {
                        });
                    else
                        mostrarMensaje(1, idioma.msgDelPluralBad, function() {
                        });
                }
                windowopen = false;
                stcuadrefin.reload();
            },
            params: {
                arrayidcuadres: Ext.encode(idcuadres)
            }
        });
    }//fin de la funcion eliminar

    //muestra la ventana para heredar los CF
    function mostrarHeredar() {
        MostrarEtiquetas(idioma.msgLoad);
        //stheredar
        var stheredar = new Ext.data.Store({
            url: 'cargarheredar',
            reader: new Ext.data.JsonReader({
                id: 'idRecord',
                root: 'campos',
                totalProperty: 'totalrecords'
            }, [{
                    name: 'idcuadrefinanciero'
                }, {
                    name: 'formula'
                }, {
                    name: 'grupocuadre'
                }, {
                    name: 'idgrupocuadre'
                }, {
                    name: 'unidad'
                }, {
                    name: 'fecha'
                }
            ]),
            listeners: {
                load: function(e)
                {
                    lMask.hide();
                    if (stheredar.getCount() < 1)
                        mostrarMensaje(1, idioma.msgNoCuadresHeredar);
                }
            }
        });
        stheredar.load();
        // smheredar
        var smheredar = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        //gp gpheredar
        var gpheredar = new Ext.grid.GridPanel({
            layout: 'fit',
            autoExpandColumn: 'formula',
            autoScroll: false,
            sm: smheredar,
            store: stheredar,
            columns: [smcuadrefin,
                {
                    id: 'idcuadrefinanciero',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcuadrefinanciero'
                },
                {
                    id: 'formula',
                    header: idioma.lbformula,
                    sortable: true,
                    dataIndex: 'formula'
                }, {
                    id: 'grupocuadre',
                    header: idioma.lbgrupo,
                    sortable: true,
                    width: 200,
                    dataIndex: 'grupocuadre'
                }, {
                    id: 'idgrupocuadre',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idgrupocuadre'
                },
                {
                    id: 'unidad',
                    header: idioma.lbentidad,
                    sortable: true,
                    width: 200,
                    dataIndex: 'unidad'
                },
                {
                    id: 'fecha',
                    header: idioma.lbfecha,
                    sortable: true,
                    width: 100,
                    dataIndex: 'fecha'
                }
            ]
        });

        var winheredar = new Ext.Window({
            title: idioma.tventheredar,
            id: 'winheredar',
            width: 800,
            height: 500,
            layout: 'fit',
            closeAction: 'close',
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    text: idioma.btncancelar,
                    tooltip: idioma.ttcancelar,
                    handler: function() {
                        winheredar.close();
                    }
                }, {
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    handler: function() {
                        if (smheredar.getSelections().length > 0)
                            heredarCF(smheredar.getSelections())
                    },
                    text: idioma.btnaceptar,
                    tooltip: idioma.ttaceptar
                }],
            listeners: {
                hide: function() {
                    windowopen = false;
                },
                destroy: function() {
                    windowopen = false;
                },
                show: function() {
                    windowopen = true;
                }
            }
        });
        winheredar.add(gpheredar);
        winheredar.show();
    }//fin de la funcion mostrarHeredar

    //hereda los CF del padre
    function heredarCF(selecciones) {
        progressBar(idioma.msgHeredando);//barra de progreso
        cuadres = new Array();
        //se recorre el array seleccionados para obtener los idgrupo y la formula
        for (var i = 0; i < selecciones.length; i++)
            cuadres.push({'formula': selecciones[i].data.formula, 'idgrupo': selecciones[i].data.idgrupocuadre});
        Ext.Ajax.request({
            url: 'heredarcuadre',
            method: 'POST',
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData == true) {//si se adiciono correctamente
                    Ext.MessageBox.hide();//oculta la barra de progreso
                    mostrarMensaje(1, idioma.msgHeredandoOk);
                    Ext.getCmp('winheredar').close();
                    stcuadrefin.reload();
                }
                else {//si no se adiciono correctamente
                    Ext.MessageBox.hide();//oculta la barra de progreso
                    mostrarMensaje(1, idioma.msgHeredandoBad);
                }
            },
            params: {
                arraycuadres: Ext.encode(cuadres)
            }
        });
    }//fin de la funcion heredarCF()

    //muestra la barra de progreso
    function progressBar(msg) {
        Ext.MessageBox.show({
            title: idioma.msgEspere,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    }//fn de la funcion progressBar

    //evento para habilitar el boton de modificar y eliminar al seleccionar una fila
    smcuadrefin.on({
        rowselect: function(selModel, rowIndex, record) {
            Ext.getCmp('gpCuadreFinanciero').getView().addRowClass(rowIndex, "negrita");
            var flag = false;//true si hay al menos un CF que lo agrego el padre
            if (selModel.getSelections().length == 1 && selModel.getSelected().data.idestructura == selModel.getSelected().data.idestructuraPadre) {
                btnmodificar.enable();
                btneliminar.enable();
            } else if (selModel.getSelections().length > 1) {
                for (var i = 0; i < selModel.getSelections().length; i++)
                    if (selModel.getSelections()[i].data.idestructura == selModel.getSelections()[i].data.idestructuraPadre)
                    {
                        btneliminar.disable();
                        flag = true;
                    }
                if (!flag)
                    btneliminar.enable();
                btnmodificar.disable();
            }
            else {
                btnmodificar.disable();
                btneliminar.disable();
            }
        },
        rowdeselect: function(selModel, rowIndex, record) {
            Ext.getCmp('gpCuadreFinanciero').getView().removeRowClass(rowIndex, "negrita");
            var flag = false;//true si hay al menos un CF que lo agrego el padre
            if (selModel.getSelections().length == 1 && selModel.getSelected().data.idestructura == selModel.getSelected().data.idestructuraPadre) {
                btnmodificar.enable();
                btneliminar.enable();
            } else if (selModel.getSelections().length > 1) {
                for (var i = 0; i < selModel.getSelections().length; i++)
                    if (selModel.getSelections()[i].data.idestructura == selModel.getSelections()[i].data.idestructuraPadre)
                    {
                        btneliminar.disable();
                        flag = true;
                    }
                if (!flag)
                    btneliminar.enable();
                btnmodificar.disable();
            }
            else {
                btnmodificar.disable();
                btneliminar.disable();
            }
        }
    });//fin del evento

    //muestra las etiquetas de cargando
    function MostrarEtiquetas(mensaje)
    {
        lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: mensaje
        });
        lMask.show();
    }//fin de la funcion MostrarEtiquetas

    /**
     * valida que los campos obligatorios tengan datos
     * @return {boolean} true si es valida, false si no
     */
    function validaInterfaz() {
        if (Ext.getCmp('cbgrupo').getValue() == '') {
            Ext.getCmp('cbgrupo').markInvalid(idioma.msgCampoInvalid);
            return false;
        }
        else if (Ext.getCmp('tfformula').getValue() == '') {
            Ext.getCmp('tfformula').markInvalid(idioma.msgCampoInvalid);
            return false;
        }
        else {
            return true;
        }

    }
    /**
     * valida que la ecuacion cumpla con la igualdad y no termine en operador
     * @param {string} formula cadena a analizar
     * @return {boolean} true si es valida, false si no
     */
    function ValidaEcuacion(formula) {
        if (!(formula.length === 0)) {
            //se valida que el ultimo caracter no sea un operador
            var caracter = formula.charAt(formula.length - 1);
            if (isOperador(caracter) || caracter === '(')
                return false;
            //se valida que no tenga mas de un signo (=)
            else
                return ContarSignoIgual(formula);
        }
    }
    /**
     * Cuenta la cantidad de signos (=)
     * @param {string} cadena formula a analizar
     * @return {boolean} false si hay mas de uno o ninguno, true si solo uno
     */
    function ContarSignoIgual(cadena) {
        var cant = 0;
        for (var i in cadena) {
            if (cadena[i] === '=')
                cant++;
        }
        return (cant === 0 || cant > 1) ? false : true;
    }
    //valida que el caracter es un operador
    function isOperador(oper) {
        if (oper == '+' || oper == '-' || oper == '*' || oper == '/' || oper == '=' || oper == '>' || oper == '<')
            return true;//es operador
        return false;//no es operador
    }
}//fin de la funcion cargar interfaz