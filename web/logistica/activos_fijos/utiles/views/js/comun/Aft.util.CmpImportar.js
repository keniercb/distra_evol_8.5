/**
 * Created by yoendy on 5/15/2017.
 *Componetes para importar datos desde un excel
 * se debe tener inicializados el arreglo de plugins
 */
/*
 **Clase que contiene todos los componentes visuales necesarios para importar datos desde un excel,
 * el módulo que lo use debe tener inicializado la variable plugins y la variable dirController, además de contar con los métodos
 * insertarDatosExcel
 */

Ext.ns('AFT.util');

/* Funcion que se encarga de corregir los valores del grid*/
AFT.util.corregirValores = function (valores, objProducto, scope) {
    var _this = scope;
    console.info(objProducto);
    /* Por cada valor del record que coincida con su valor en el objeto valores, toma el nuevo valor*/
    _this.gridExcel.getStore().each(function (record) {
        if ((valores.idmarca && record.data.marca == valores.marca)) {
            record.data.idmarca = valores.idmarca;
            record.data.marca = valores.newmarca;
        }
        if ((valores.idmodelo && record.data.modelo == valores.modelo)) {
            if (record.data.idmarca == valores.idmarca) {
                record.data.idmodelo = valores.idmodelo;
                record.data.modelo = valores.newmodelo;
            }
        }

        if (record.data.idmodelo == valores.idmodelo && record.data.idmarca == valores.idmarca) {
            if (objProducto) {
                record.data.tipomedio = objProducto.tipomedio;
                record.data.idindicador = objProducto.idindicador;
            }
        } else {
            if (objProducto && objProducto.idindicador && record.data.tipomedio == objProducto.tipomedio) {
                console.info("entra");
                record.data.idindicador = objProducto.idindicador;
                record.data.tipomedio = objProducto.newtipomedio;
            }
        }

        if (valores.idindicador && record.data.tipomedio == valores.tipomedio) {
            record.data.idindicador = valores.idindicador;
            record.data.tipomedio = valores.tipomedio;
        }

        if (valores.idcolorprim && record.data.colorP == valores.colorP) {
            record.data.idcolorprim = valores.idcolorprim;
            record.data.colorP = valores.newcolorP;
        }

        if (valores.idcolorsec && record.data.colorS == valores.colorS) {
            record.data.idcolorsec = valores.idcolorsec;
            record.data.colorS = valores.newcolorS;
        }
        if (valores.idactividad && record.data.actividad == valores.actividad) {
            record.data.idactividad = valores.idactividad;
            record.data.actividad = valores.newactividad;
        }
        if (valores.idestatustecnico && record.data.estado == valores.estado) {
            record.data.idestatustecnico = valores.idestatustecnico;
            record.data.estado = valores.newestado;
        }
        if (valores.idcategoria && record.data.categoria == valores.categoria) {
            record.data.idcategoria = valores.idcategoria;
            record.data.categoria = valores.newcategoria;
        }
        if (valores.idtipocombustible && record.data.combustible == valores.combustible) {
            record.data.idtipocombustible = valores.idtipocombustible;
            record.data.combustible = valores.newcombustible;
        }
    });

    _this.gridExcel.getView().refresh();//Refresco la vista del grid para visualizar los cambios
    _this.gridExcel.getSelectionModel().selectRow(valores.index);
    Ext.Msg.hide();
};

/*
 *Funcion que se encarga de obtener el producto dado marca y modelo
 * */
AFT.util.obtenerProducto = function (valores, dirController, scope, objProducto) {
    var objProducto = (objProducto) ? objProducto : {};

    if ((valores.idmarca && valores.idmodelo) || valores.idtipomedio) {
        var myMaskGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});
        myMaskGrid.show();
        Ext.Ajax.request({
            url: dirController + '/cargarProductosPorMarcamodelo',
            method: 'POST',
            params: {
                idmarca: valores.idmarca,
                idmodelo: valores.idmodelo,
                idtipomedio: valores.idtipomedio
            },
            callback: function (options, success, response) {
                myMaskGrid.hide();
                var rd = Ext.decode(response.responseText);
                rd = rd.datos;

                if (rd.idindicador) {
                    objProducto = {tipomedio: rd.tipomedio, idindicador: rd.idindicador};
                }
                AFT.util.corregirValores(valores, objProducto, scope);
            }
        });

    } else {
        AFT.util.corregirValores(valores, objProducto, scope);
    }

};
/*
 * Función que se encargar de asociar los campos leídos desde el excel con los de la base de datos
 * */
AFT.util.winConfigurarAsociacion = function (scope, parametros) {
    var _this = scope;//inicializar la variable en el ámbito del módulo que lo invoca
    var arrayDenominaciones = Array();//Variable que contiene los nombres de las columnas del excel
    _this.campos = LOG.aft.RegOperativo.Campos;
    for (var i = 0; i < _this.plugins.length; i++) {
        _this.plugins[i].init(_this)
    }
    for (var i = 0, emptyCol = false; i < parametros.total; i++) {
        if (parametros.datos[i].descripcion) {
            arrayDenominaciones.push({descripcion: parametros.datos[i].descripcion, posicion: i});
        } else {
            emptyCol = true;
            break;
        }
    }
    if (emptyCol) {
        mostrarMensaje(1, "EL encabezado de la columna " + (++i) + " est\xe1 vac\xedo.");
        Ext.Msg.hide();
        return;
    }

    var storeDenominaciones = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            //id: "descripcion"
        }, [
            {
                name: 'descripcion'
            },
            {
                name: 'posicion'
            }
        ])
    });
    storeDenominaciones.loadData(arrayDenominaciones);//Store que contiene las denominaciones de las columnas del excel

    var paneles = new Array();//Paneles por cada tab en dependencia de la cantidad plugins
    var pos = 1;
    for (var cmp  in _this.campos) {
        var objeto = _this.campos[cmp];
        //  console.info(objeto)
        //console.info(_this.campos[cmp])
        var nuevo = -1;
        for (var i = 0; i < paneles.length; i++) {
            if (paneles[i].nombrepanel == objeto['nameplugin']) {
                nuevo = i;
                break;
            }
        }
        var identificador = (objeto['dataIndex']) ? objeto['dataIndex'] : objeto['valueField'];

        if (identificador != 'iddeposito' && identificador != 'responsable' && identificador != 'ubicacion') {
            if (nuevo == -1) {
                paneles.push(LOG.util.UIManager.initColumnForm({
                    nombrepanel: objeto['nameplugin'],
                    // region:'center',
                    columnas: 4
                }));
                var valor = -1;
                for (var l = 0; l < arrayDenominaciones.length; l++) {
                    var deno = arrayDenominaciones[l].descripcion.toLowerCase();//Denominacion de la columna del excel en minúscula
                    if (objeto['header'].toLowerCase() == deno) {//Si es igual al header del campo, se machea automático
                        valor = l;
                        break;
                    }
                }

                paneles[paneles.length - 1].addComponent(new LOG.util.ComboBox({
                    fieldLabel: objeto['header'],
                    store: storeDenominaciones,
                    valueField: 'posicion',
                    hiddenName: identificador,
                    displayField: 'descripcion',
                    allowBlank: !(identificador == 'idactividad' || identificador == 'idestatustecnico'), //Solo son obligatorios estos dos campos
                    mode: 'local',
                    emptyText: "Seleccione...",
                    selectOnFocus: true,
                    value: (valor == -1) ? null : valor,
                    width: 150
                }));

            } else {
                var valorD = -1;
                for (var m = 0; m < arrayDenominaciones.length; m++) {
                    var denom = arrayDenominaciones[m].descripcion.toLowerCase();
                    // console.info(objeto['header'])
                    if (objeto['header'].toLowerCase() == denom) {
                        valorD = m;
                        break;
                    }
                }
                if (alternativa) {
                    if (objeto['contable'])
                        var label = objeto['header'] + ' ' + nommonedacontable;
                    else if (objeto['dataIndex'].indexOf('alternativo') != -1)
                        var label = objeto['header'] + ' ' + nommonedaalternativa;
                    else
                        var label = objeto['header'];

                    paneles[nuevo].addComponent(new LOG.util.ComboBox({
                        fieldLabel: label,
                        store: storeDenominaciones,
                        valueField: 'posicion',
                        hiddenName: identificador,
                        displayField: 'descripcion',
                        allowBlank: !(identificador == 'idactividad' || identificador == 'idestatustecnico'),
                        mode: 'local',
                        value: (valorD == -1) ? null : valorD,
                        emptyText: "Seleccione...",
                        selectOnFocus: true,
                        width: 150
                    }));
                } else if (objeto['dataIndex'].indexOf('alternativo') == -1) {
                    paneles[nuevo].addComponent(new LOG.util.ComboBox({
                        fieldLabel: objeto['header'],
                        store: storeDenominaciones,
                        valueField: 'posicion',
                        hiddenName: identificador,
                        displayField: 'descripcion',
                        allowBlank: !(identificador == 'idactividad' || identificador == 'idestatustecnico'),
                        mode: 'local',
                        value: (valorD == -1) ? null : valorD,
                        emptyText: "Seleccione...",
                        selectOnFocus: true,
                        width: 150
                    }));
                }
            }
        }

        pos++;


    }
    var valorM = -1;
    var valorMM = -1;
    var valorInd = -1;
    /*
     * Como marca, modelo y la denominacion del indicador no son campos de registro numerico
     * se hace una búsqueda aparte para ver si coincide la denominacion con lo leído del excel
     * */
    for (var p = 0; p < arrayDenominaciones.length; p++) {
        var denom = arrayDenominaciones[p].descripcion.toLowerCase();
        if (denom.search("marca") != -1) {
            valorM = p;
        }
        if (denom.search("modelo") != -1) {
            valorMM = p;
        }
        if (denom.search("tipo/clase") != -1) {
            valorInd = p;
        }
    }
    //Se adicionan los tres componentes antes mencionados al panel de datos generales
    paneles[0].addComponent(new LOG.util.ComboBox({
        fieldLabel: "Marca",
        store: storeDenominaciones,
        valueField: 'posicion',
        hiddenName: 'marca',
        displayField: 'descripcion',
        allowBlank: true,
        value: (valorM == -1) ? null : valorM,
        mode: 'local',
        emptyText: "Seleccione...",
        selectOnFocus: true,
        width: 150
    }));
    paneles[0].addComponent(new LOG.util.ComboBox({
        fieldLabel: "Modelo",
        store: storeDenominaciones,
        valueField: 'posicion',
        hiddenName: 'modelo',
        value: (valorMM == -1) ? null : valorMM,
        displayField: 'descripcion',
        allowBlank: true,
        mode: 'local',
        emptyText: "Seleccione...",
        selectOnFocus: true,
        width: 150
    }));
    paneles[0].addComponent(new LOG.util.ComboBox({
        fieldLabel: "Tipo/Clase",
        store: storeDenominaciones,
        valueField: 'posicion',
        hiddenName: 'indicador',
        value: (valorInd == -1) ? null : valorInd,
        displayField: 'descripcion',
        allowBlank: true,
        mode: 'local',
        emptyText: "Seleccione...",
        selectOnFocus: true,
        width: 150
    }));
    var tabPanel = new Ext.TabPanel({
        activeTab: 0,
        region: 'center'
    });
    for (var i = 0; i < paneles.length; i++) {//Se adicionan los paneles al tabpanel
        tabPanel.add(LOG.util.UIManager.initForm({
            region: 'center',
            title: paneles[i].nombrepanel,
            defaults: {
                region: 'center'
            },
            frame: true,
            items: [paneles[i]]
        }));
    }

    /*console.info(_this.campos);
     return;*/
    _this.btnAceptarWinConfgtDatos = LOG.util.UIManager.createBtn({
        iconCls: 'mostrar',
        text: "<u>M</u>ostrar",
        tooltip: "Mostrar los datos <b>(CtrlAlt+M)</b>",
        handler: function () {
            tabPanel.setActiveTab(0);
            var valores = {};
            var validos = true;
            for (var i = 0; i < paneles.length; i++) {
                tabPanel.setActiveTab(i);
                if (tabPanel.getActiveTab().getForm().isValid()) {
                    Ext.applyIf(valores, tabPanel.getActiveTab().getForm().getValues());//Guardo los datos en valores
                } else {
                    validos = false;
                    break;
                }
            }
            if (!validos) {
                mostrarMensaje(3, "Existen campos obligatorios vac\xedos.")
            } else {
                Ext.Msg.wait("Cargando los datos a mostrar.", "Por favor espere…");
                valores.datos = Ext.encode(parametros.datos);
                Ext.Ajax.request({
                    url: _this.dirController + '/validarExcel', //Funcion que se encarga de depurar los datos para ser leídos por el grid
                    params: valores,
                    callback: function (o, s, r) {
                        var resp = Ext.decode(r.responseText);
                        AFT.util.winMostrarDatosExcel(_this, resp);
                        _this.winMostrarDatos.show();
                        _this.winMostrarDatos.maximize();
                    }
                });
                /*tabPanel.getForm().submit({
                 url: _this.dirController + '/validarExcel',
                 params:{
                 datos: Ext.encode(parametros.datos)
                 },
                 method: 'POST',
                 success: function(form, action) {
                 var rd = action.result;
                 _this.mostrarGridExcel(rd);
                 }
                 
                 });*/
            }

        }
    });

    _this.btnCancelarWinConfgDatos = new LOG.util.Prototipos.botonCancelar({
        text: "Cerrar",
        tooltip: "Cerrar ventana sin mostrar los datos <b>(Alt+C)</b>",
        handler: function () {
            _this.winConfigurarDatos.close();
        }

    });
    _this.winConfigurarDatos = new LOG.util.UIManager.initWindow({
        bodyStyle: 'padding:5px 5px 0',
        title: "Configuraci\xf3n para carga de datos",
        width: 900,
        resizable: true,
        layout: 'fit',
        autoScroll: true,
        height: 530,
        modal: true,
        items: [
            tabPanel

        ],
        buttons: [_this.btnCancelarWinConfgDatos, _this.btnAceptarWinConfgtDatos

        ]
    });
    _this.winConfigurarDatos.on('show', function () {
        Ext.Msg.hide();
    });
    return _this.winConfigurarDatos;
};

/**
 * Función que se encarga de construir el grid que muestra la información final leída desde el excel
 *
 */
AFT.util.winMostrarDatosExcel = function (scope, parametros) {
    var _this = scope;//inicializar la variable en el ámbito del módulo que lo invoca
    Ext.Msg.hide();
    var datos = parametros['datos'];//Variable que contiene los records a adicionar
    var rowindex = 0;//Varibale que contiene la fila que se este editando

    /* Variables usadas a la hora de editar necesarias para modificar el resto de las filas*/
    var oldmarca = "";
    var oldmodelo = "";
    var oldcolorP = "";
    var oldindicador = "";
    var oldcolorS = "";
    var oldactividad = "";
    var oldestado = "";
    var oldcategoria = "";
    var oldcombustible = "";
    var fields = [
        {
            name: 'idmarca'
        },
        {
            name: 'marca'
        },
        {
            name: 'idmodelo'
        },
        {
            name: 'modelo'
        },
        {
            name: 'tipomedio'
        },
        {
            name: 'nroserie'
        },
        {
            name: 'idcolorprim'
        },
        {
            name: 'colorP'
        },
        {
            name: 'idcolorsec'
        },
        {
            name: 'colorS'
        },
        {
            name: 'idactividad'
        },
        {
            name: 'actividad'
        },
        {
            name: 'idcategoria'
        },
        {
            name: 'categoria'
        },
        {
            name: 'idestatustecnico'
        },
        {
            name: 'estado'
        },
        {
            name: 'idindicador'
        }
    ];

    var objetoDatos = datos[0];//Variable de muestra para saber que juego de datos se va a adicionar

    /* Campos del store del grid*/
    _this.camposOrdenados = [
        'idmarca',
        'marca',
        'idmodelo',
        'modelo',
        'tipomedio',
        'nroserie',
        'idcolorprim',
        'colorP',
        'idcolorsec',
        'colorS',
        'idactividad',
        'actividad',
        'idcategoria',
        'categoria',
        'idestatustecnico',
        'estado',
        'idindicador'
    ];
    if (parametros['combustible']) {//Si se va a insertar lo adiciono a los campos del grid
        fields = fields.concat([
            {
                name: 'idtipocombustible'
            },
            {
                name: 'combustible'
            }
        ]);
        _this.camposOrdenados = _this.camposOrdenados.concat(['idtipocombustible', 'combustible']);
    }
    for (var camposObj  in objetoDatos) {//Adicionar los campos que no se esten previamente adicionados al store
        if (_this.camposOrdenados.indexOf(camposObj) === -1) {
            _this.camposOrdenados.push(camposObj);
            fields.push({
                name: camposObj
            })
        }

    }

    /*Store del grid que contiene la muestra de los datos a adicionar*/
    var stgrid = new Ext.data.Store({
        reader: new Ext.data.ArrayReader({
            idIndex: "nroserie"
        }, fields)
    });

    /*Stores necesarios para rectificar los nomencladores en el grid*/
    var stmarcas = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            id: "idmarca"
        }, [
            {
                name: 'idmarca'
            },
            {
                name: 'denominacion'
            }
        ])
    });
    /*var stindicadores = new Ext.data.Store({
     reader: new Ext.data.JsonReader({
     id: "idindicador"
     }, [
     {
     name: 'idindicador'
     },
     {
     name: 'denominacion'
     }
     ])
     });*/
    var stmodelos = new Ext.data.Store({
        url: _this.dirController + '/cargarModelos',
        reader: new Ext.data.JsonReader({
            id: "idmodelo", root: "datos"

        }, [
            {
                name: 'idmodelo'
            },
            {
                name: 'denominacion'
            }
        ])
    });
    var stcolores = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            id: "idcolor"
        }, [
            {
                name: 'idcolor'
            },
            {
                name: 'denominacion'
            }
        ])
    });
    var stactividades = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            id: "idactividad"
        }, [
            {
                name: 'idactividad'
            },
            {
                name: 'denominacion'
            }
        ])
    });
    var stestados = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            id: "idestatustecnico"
        }, [
            {
                name: 'idestatustecnico'
            },
            {
                name: 'denominacion'
            }
        ])
    });
    var stcategorias = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            id: "idcategoria"
        }, [
            {
                name: 'idcategoria'
            },
            {
                name: 'denominacion'
            }
        ])
    });
    var stcombustibles = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            id: "idtipocombustible"
        }, [
            {
                name: 'idtipocombustible'
            },
            {
                name: 'denominacion'
            }
        ])
    });

    /*Se utilizan los datos de los nomencladores que vienen de la logica*/
    stmarcas.loadData(parametros['marcas']);
    stcolores.loadData(parametros['colores']);
    stactividades.loadData(parametros['actividades']);
    stestados.loadData(parametros['estados']);
    stcategorias.loadData(parametros['categorias']);
    //stindicadores.loadData(parametros['indicadores']);
    if (parametros['combustible']) {
        stcombustibles.loadData(parametros['combustible']);
    }

    var arrayGrid = new Array();//Records del grid
    /* Adicionar los datos del excel al grid*/
    for (var i = 0; i < datos.length; i++) {
        var obj = [];
        for (var j = 0; j < _this.camposOrdenados.length; j++) {
            obj.push(datos[i][_this.camposOrdenados[j]]);

        }
        arrayGrid.push(obj);
    }
    stgrid.loadData(arrayGrid);

    /* Columnas del grid*/
    var columnasObj = [
        new Ext.grid.RowNumberer({
            header: 'N\xba.',
            width: 30
        }),
        {
            header: "Denominación",
            width: 150,
            sortable: true,
            dataIndex: 'denominacion',
            id: 'denominacion',
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            header: "Naturaleza",
            width: 150,
            sortable: true,
            dataIndex: 'naturaleza',
            id: 'naturaleza',
            editor: new Ext.form.TextField({
                allowBlank: true
            })
        }, {
            header: "Grupo",
            width: 150,
            sortable: true,
            dataIndex: 'gruposubgrupo',
            id: 'gruposubgrupo',
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            header: "Categoría de transportación",
            width: 150,
            sortable: true,
            dataIndex: 'categoriatransp',
            id: 'idcategoriatransp',
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        },
        // {
        //     header: "Nro de chasis",
        //     width: 150,
        //     sortable: true,
        //     dataIndex: 'nrochasis',
        //     id: 'nrochasis',
        //     editor: new Ext.form.TextField({
        //         allowBlank: false
        //     })
        // },
        {
            header: "Valor residual",
            width: 150,
            sortable: true,
            dataIndex: 'valorresidual',
            id: 'valorresidual',
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        },
        // {
        //     header: "Área de responsabilidad",
        //     width: 150,
        //     sortable: true,
        //     dataIndex: 'denomarearesp',
        //     id: 'denomarearesp',
        //     editor: new Ext.form.TextField({
        //         allowBlank: false
        //     })
        // },
        {
            header: "Marca",
            dataIndex: 'marca',
            width: 100,
            sortable: true,
            editor: new LOG.util.ComboBox({
                store: stmarcas,
                valueField: 'denominacion',
                hiddenName: 'idmarcamodelo',
                displayField: 'denominacion',
                mode: 'local',
                emptyText: "Seleccione...",
                selectOnFocus: true,
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var idmarca = record.data.idmarca;
                        var idmodelo = _this.gridExcel.getSelectionModel().getSelected().data.idmodelo;
                        var marca = record.data.denominacion;

                        _this.gridExcel.getSelectionModel().getSelected().data.idmarca = idmarca;
                        _this.gridExcel.getSelectionModel().getSelected().data.marca = marca;
                        AFT.util.obtenerProducto({
                            index: rowindex, idmarca: idmarca, idmodelo: idmodelo,
                            marca: oldmarca, newmarca: marca, ordenColumnas: _this.camposOrdenados
                        }, _this.dirController, _this);

                    },
                    'beforeselect': function (combo, record, index) {

                    }
                }
            })
        },
        {
            header: "idindicador",
            dataIndex: 'idindicador',
            hidden: 'true',
        }, {
            header: "idactividad",
            dataIndex: 'idactividad',
            hidden: 'true',
        }, {
            header: "idestatustecnico",
            dataIndex: 'idestatustecnico',
            hidden: 'true',
        },

        {
            header: "Modelo",
            dataIndex: 'modelo',
            width: 100,
            sortable: true,
            editor: new LOG.util.ComboBox({
                editable: true,
                store: stmodelos,
                valueField: 'denominacion',
                displayField: 'denominacion',
                hiddenName: 'idmarcamodelo',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var idmodelo = record.data.idmodelo;
                        var idmarca = _this.gridExcel.getSelectionModel().getSelected().data.idmarca;
                        var modelo = record.data.denominacion;
                        _this.gridExcel.getSelectionModel().getSelected().data.idmodelo = idmodelo;
                        _this.gridExcel.getSelectionModel().getSelected().data.modelo = modelo;
                        AFT.util.obtenerProducto({
                            index: rowindex, idmodelo: idmodelo, idmarca: idmarca,
                            modelo: oldmodelo, newmodelo: modelo, ordenColumnas: _this.camposOrdenados
                        }, _this.dirController, _this);

                    }
                }
            })
        }, {
            header: "Tipo de medio",
            dataIndex: 'denominacion',
            width: 100,
            sortable: true,
            editor: new LOG.util.ComboBox({
                //store: stindicadores,
                valueField: 'idindicador',
                hiddenName: 'idindicador',
                displayField: 'denominacion',
                pageSize: 25,
                width: 240,
                mode: 'remote',
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/cargarProductosSql',
                emptyText: "Seleccione...",
                triggerAction: 'all',
                allowBlank: false,
                selectOnFocus: false,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        console.info(record.data);
                        _this.gridExcel.getSelectionModel().getSelected().data.idindicador = record.data.idindicador;
                        _this.gridExcel.getSelectionModel().getSelected().data.tipomedio = record.data.denominacion;
                        AFT.util.obtenerProducto({
                            ordenColumnas: _this.camposOrdenados
                        }, _this.dirController, _this, {
                            idindicador: record.data.idindicador,
                            tipomedio: oldindicador,
                            newtipomedio: record.data.denominacion
                        });
                    },
                    'beforeselect': function (combo, record, index) {

                    }
                }
            })
        }, {
            header: "N.\xb0 registro/serie",
            width: 150,
            sortable: true,
            dataIndex: 'nroserie',
            id: 'nroserie',
            editor: new Ext.form.TextField({
                allowBlank: true
            })
        }, {
            header: "Color primario",
            dataIndex: 'colorprim',
            sortable: true,
            width: 100,
            editor: new LOG.util.ComboBox({
                editable: true,
                store: stcolores,
                valueField: 'denominacion',
                displayField: 'denominacion',
                hiddenName: 'idcolorprim',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var colorP = record.data.denominacion;
                        var idcolorP = record.data.idcolor;
                        _this.gridExcel.getSelectionModel().getSelected().data.idcolorprim = idcolorP;
                        _this.gridExcel.getSelectionModel().getSelected().data.colorP = colorP;
                        AFT.util.corregirValores({
                            idcolorprim: idcolorP, colorP: oldcolorP, newcolorP: colorP,
                            ordenColumnas: _this.camposOrdenados
                        }, null, _this);


                    }
                }
            })
        }, {
            header: "Color secundario",
            dataIndex: 'colorsec',
            sortable: true,
            width: 100,
            editor: new Ext.form.ComboBox({
                editable: true,
                store: stcolores,
                valueField: 'denominacion',
                displayField: 'denominacion',
                hiddenName: 'idcolorsec',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var colorS = record.data.denominacion;
                        var idcolorS = record.data.idcolor;
                        _this.gridExcel.getSelectionModel().getSelected().data.idcolorsec = idcolorS;
                        _this.gridExcel.getSelectionModel().getSelected().data.colorS = colorS;

                        AFT.util.corregirValores({
                            idcolorsec: idcolorS,
                            colorS: oldcolorS,
                            newcolorS: colorS,
                            ordenColumnas: _this.camposOrdenados
                        }, null, _this);

                    }
                }
            })
        }, {
            header: "Grupo de explotación",
            dataIndex: 'actividad',
            sortable: true,
            width: 100,
            editor: new Ext.form.ComboBox({
                editable: true,
                store: stactividades,
                valueField: 'denominacion',
                displayField: 'denominacion',
                hiddenName: 'idactividad',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var actividad = record.data.denominacion;
                        var idactividad = record.data.idactividad;
                        _this.gridExcel.getSelectionModel().getSelected().data.idactividad = idactividad;
                        _this.gridExcel.getSelectionModel().getSelected().data.actividad = actividad;

                        AFT.util.corregirValores({
                            idactividad: idactividad,
                            actividad: oldactividad,
                            newactividad: actividad, ordenColumnas: _this.camposOrdenados
                        }, null, _this);
                    }
                }
            })
        }, {
            header: "Categor\xeda",
            dataIndex: 'categoria',
            sortable: true,
            width: 100,
            editor: new Ext.form.ComboBox({
                editable: true,
                store: stcategorias,
                valueField: 'denominacion',
                displayField: 'denominacion',
                hiddenName: 'idcategoria',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var categoria = record.data.denominacion;
                        var idcategoria = record.data.idcategoria;
                        _this.gridExcel.getSelectionModel().getSelected().data.idcategoria = idcategoria;
                        _this.gridExcel.getSelectionModel().getSelected().data.categoria = categoria;

                        AFT.util.corregirValores({
                            idcategoria: idcategoria,
                            categoria: oldcategoria,
                            newcategoria: categoria, ordenColumnas: _this.camposOrdenados
                        }, null, _this);
                    }
                }
            })
        }, {
            header: "Estado técnico",
            dataIndex: 'denomestadotecnico',
            sortable: true,
            width: 100,
            editor: new Ext.form.ComboBox({
                editable: true,
                store: stestados,
                valueField: 'idestatustecnico',
                displayField: 'denominacion',
                hiddenName: 'idestatustecnico',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var estado = record.data.denominacion;
                        var idestatustecnico = record.data.idestatustecnico;
                        _this.gridExcel.getSelectionModel().getSelected().data.idestatustecnico = idestatustecnico;
                        _this.gridExcel.getSelectionModel().getSelected().data.estado = estado;

                        AFT.util.corregirValores({
                            idestatustecnico: idestatustecnico,
                            estado: oldestado, newestado: estado, ordenColumnas: _this.camposOrdenados
                        }, null, _this);
                    }
                }
            })
        }
    ];
    if (parametros['combustible']) {
        columnasObj.push({
            header: "Tipo de combustible",
            dataIndex: 'combustible',
            width: 100,
            sortable: true,
            editor: new LOG.util.ComboBox({
                editable: true,
                store: stcombustibles,
                valueField: 'denominacion',
                displayField: 'denominacion',
                hiddenName: 'idtipocombustible',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '100%',
                listeners: {
                    'select': function (combo, record, index) {
                        var idtipocombustible = record.data.idtipocombustible;
                        var combustible = record.data.denominacion;
                        _this.gridExcel.getSelectionModel().getSelected().data.idtipocombustible = idtipocombustible;
                        _this.gridExcel.getSelectionModel().getSelected().data.combustible = combustible;

                        AFT.util.corregirValores({
                            index: rowindex, idtipocombustible: idtipocombustible, newcombustible: combustible,
                            combustible: oldcombustible,
                            ordenColumnas: _this.camposOrdenados, hayCmb: true
                        }, null, _this);

                    }
                }
            })
        });
    }
    for (var u = 0; u < _this.camposOrdenados.length; u++)
        for (var propiedadObj  in _this.campos) {
            var objetoCampo = _this.campos[propiedadObj];
            if (objetoCampo['name'] != 'idmarca' && objetoCampo['name'] != 'idmodelo' && objetoCampo['name'] != 'nroserie' &&
                    objetoCampo['name'] != 'idcolorprim' && objetoCampo['name'] != 'idcolorsec' && objetoCampo['name'] != 'idactividad'
                    && objetoCampo['name'] != 'idcategoria' && objetoCampo['name'] != 'idestatustecnico' &&
                    objetoCampo['name'] != 'idestatustecnico' && objetoCampo['name'] == _this.camposOrdenados[u]) {
                if (!(objetoCampo['valueField'] && objetoCampo['valueField'] != 'idtipocombustible' && objetoCampo['valueField'] != 'tipocombustible')) {
                    if (alternativa) {
                        if (objetoCampo['contable'])
                            var label = objetoCampo['fieldLabel'] + ' ' + nommonedacontable;
                        else if (objetoCampo['name'].indexOf('alternativo') != -1)
                            var label = objetoCampo['fieldLabel'] + ' ' + nommonedacontable;
                        else
                            var label = objetoCampo['fieldLabel'];
                        columnasObj.push({
                            header: label,
                            width: 90,
                            sortable: true,
                            dataIndex: objetoCampo['name'],
                            editor: new Ext.form.TextField({
                                allowBlank: objetoCampo['obligatorio']
                            })
                        });
                    } else if (objetoCampo['name'].indexOf('alternativo') == -1) {
                        columnasObj.push({
                            header: objetoCampo['fieldLabel'],
                            width: 90,
                            sortable: true,
                            dataIndex: objetoCampo['name'],
                            editor: new Ext.form.TextField({
                                allowBlank: objetoCampo['obligatorio']
                            })
                        });
                    }
                }
                break;
            }
        }

    /* Grid que muestra los datos antes de adicionarlos*/
    var colum = new Ext.grid.ColumnModel(columnasObj);
    _this.gridExcel = new Ext.grid.EditorGridPanel({
        clicksToEdit: 1,
        autoScroll: true,
        region: 'center',
        listeners: {
            'beforeedit': function (e) {
                /* Guardo el dato antiguo y pongo null para evitar el codigo html*/
                switch (e.column) {
                    case 1:
                        oldmarca = _this.gridExcel.getStore().getAt(rowindex).data.marca;
                        e.record.data.marca = "";
                        break;
                    case 2:
                        oldmodelo = _this.gridExcel.getStore().getAt(rowindex).data.modelo;
                        e.record.data.modelo = "";
                        var idpadre = _this.gridExcel.getSelectionModel().getSelected().data.idmarca;
                        stmodelos.load({params: {idpadre: idpadre}});

                        break;
                    case 3:
                        oldindicador = _this.gridExcel.getStore().getAt(rowindex).data.tipomedio;
                        e.record.data.tipomedio = "";
                        break;
                    case 5:
                        oldcolorP = _this.gridExcel.getStore().getAt(rowindex).data.colorP;
                        e.record.data.colorP = "";
                        break;
                    case 6:
                        oldcolorS = _this.gridExcel.getStore().getAt(rowindex).data.colorS;
                        e.record.data.colorS = "";
                        break;
                    case 8:
                        oldcategoria = _this.gridExcel.getStore().getAt(rowindex).data.categoria;
                        e.record.data.categoria = "";
                        break;
                    case 7:
                        oldactividad = _this.gridExcel.getStore().getAt(rowindex).data.actividad;
                        e.record.data.actividad = "";
                        break;
                    case 9:
                        oldestado = _this.gridExcel.getStore().getAt(rowindex).data.estado;
                        e.record.data.estado = "";
                        break;
                    case 10:
                        if (parametros['combustible']) {
                            oldcombustible = _this.gridExcel.getStore().getAt(rowindex).data.combustible;
                            e.record.data.combustible = "";
                        }
                        break;
                }

            }
        },
        autoExpandColumn: 'nroserie',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            moveEditorOnEnter: false,
            listeners: {
                'rowselect': function (sel, row, record) {
                    rowindex = row;

                }
            }
        }),
        store: stgrid,
        cm: colum
    });
    _this.btnAyudaMostrarDatos = new Ext.Button({
        iconCls: 'ayuda',
        hidden: false,
        tooltip: "Mostrar ayuda detallada de la funcionalidad",
        text: "Ayuda",
        listeners: {
            'click': function () {
                /*var title = _this.idioma.lbAyudaText;
                 var referencia = 'Logística/Gestión del transporte/Gestión de documentos';
                 help.show(title, referencia);*/
            }
        }
    });

    _this.btnAceptarWinMostDatos = LOG.util.UIManager.createBtn({
        iconCls: 'incluir',
        text: "Aceptar",
        tooltip: "Guardar los datos y cerrar ventana <b>(ENTER)</b>",
        handler: function () {
            Ext.Msg.wait("Guardando datos de los registros num\xe9ricos.", "Por favor espere…");
            var cant = stgrid.getTotalCount();
            var datos = stgrid.getRange(0, cant);
            var enviar = new Array();
            var bandera = true;

            /* Preparar y validar los datos para adicionar*/
            for (var i = 0; i < cant && bandera; i++) {
                /*Variables para validar los nomencladores*/
                var colorP = (datos[i].data.colorP) ? datos[i].data.colorP.split("=") : false;
                var combustible = (datos[i].data.combustible) ? datos[i].data.combustible.split("=") : false;
                var actividad = (datos[i].data.actividad) ? datos[i].data.actividad.split("=") : false;
                var colorS = (datos[i].data.colorS) ? datos[i].data.colorS.split("=") : false;
                var categoria = (datos[i].data.categoria) ? datos[i].data.categoria.split("=") : false;

                if (/*!datos[i].data.idmarca || !datos[i].data.idmodelo || !datos[i].data.nroserie || */!datos[i].data.denominacion || !datos[i].data.denomestadotecnico || !datos[i].data.actividad) {

                    bandera = false;
                    console.info(datos[i]);
                    Ext.Msg.hide();
                } else if (colorP && colorP[0] == "<span style") {
                    Ext.Msg.hide();
                    mostrarMensaje(3, "En la columna color primario hay datos incorrectos.");
                    bandera = false;
                } else if (colorS && colorS[0] == "<span style") {
                    Ext.Msg.hide();
                    mostrarMensaje(3, "En la columna color secundario hay datos incorrectos.");
                    bandera = false;
                } else if (combustible && combustible[0] == "<span style") {
                    Ext.Msg.hide();
                    mostrarMensaje(3, "En la columna tipo de combustible hay datos incorrectos.");
                    bandera = false;
                } else if (actividad && actividad[0] == "<span style") {
                    Ext.Msg.hide();
                    mostrarMensaje(3, "En la columna Actividad hay datos incorrectos.");
                    return;
                } else if (categoria && categoria[0] == "<span style") {
                    Ext.Msg.hide();
                    mostrarMensaje(3, "En la columna Categor\xeda hay datos incorrectos.");
                    bandera = false;
                }

                /* adicionar los objetos a adicionar*/
                var obj = {};
                for (var k = 0; k < (_this.camposOrdenados.length); k++) {
                    /*Necesario debido a que si se envia directo toma "" por un string y no por null*/
                    obj[_this.camposOrdenados[k]] = (datos[i].data[_this.camposOrdenados[k]]) ? datos[i].data[_this.camposOrdenados[k]] : null;
                }
                enviar.push(obj);
            }
            if (bandera) {//Si todo esta bien adicionar a la bds

                _this.insertarDatosExcel(enviar, scope);
            } else {
                mostrarMensaje(3, "Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).");
            }

        }
    });

    _this.btnCancelarWinMostDatos = new LOG.util.Prototipos.botonCancelar({
        tooltip: "Cerrar ventana sin guardar los datos <b>(Alt+C)</b>",
        handler: function () {
            _this.winMostrarDatos.close();
        }
    });

    _this.winMostrarDatos = new Ext.Window({
        title: "Vista previa de los datos",
        layout: 'fit',
        items: [_this.gridExcel],
        buttons: [_this.btnCancelarWinMostDatos, _this.btnAceptarWinMostDatos]


    });


};

/*
 * Funcion que se encarga de leer el fichero excel a importar,
 * funciona solo para ficheros tipo excel 97-2003
 * */
AFT.util.importarFileUploadField = function (scope) {
    var _this = scope;//inicializar la variable en el ambito del modulo que lo invoca
    var panel = LOG.util.UIManager.initForm({
        fileUpload: true,
        anchor: '95%',
        frame: true,
        region: 'center',
        border: false,
        autoHeight: true,
        hideLabels: true,
        defaults: {
            anchor: '90%',
            allowBlank: false,
            msgTarget: 'side'
        },
        items: [
            {
                xtype: 'logfileuploadfield',
                name: 'fichero',
                buttonCfg: {
                    icon: '../../../utiles/views/images/subirfichero.png'
                },
                emptyText: "Seleccione el archivo",
                listeners: {
                    'fileselected': function (cmp, v) {
                        if (!/\.xls$/.test(v) /*&& !/\.xlsx$/.test(v)*/) {
                            mostrarMensaje(1, 'Solo se pueden seleccionar ficheros de tipo excel 97-2003.');
                            cmp.markInvalid('Extensi\xf3n invalida');
                            _this.btnIncluirDatos.disable();

                        } else {
                            _this.btnIncluirDatos.enable();

                        }

                    }
                }
            }
        ]
    });

    _this.btnIncluirDatos = new LOG.util.Prototipos.botonAceptar({
        tooltip: "Importar los datos",
        inconCls: 'incluir',
        listeners: {
            'click': function () {
                if (panel.getForm().isValid()) {

                    Ext.Msg.wait("Cargando los campos a configurar.", "Por favor espere…");
                    panel.getForm().submit({
                        url: _this.dirController + '/importarDatos', //Funcion php que se encargar de separar la información leída
                        success: function (fp, response) {
                            var responseText = Ext.decode(response.response.responseText);
                            var ventana = AFT.util.winConfigurarAsociacion(_this, responseText);
                            ventana.show();
                        },
                        failure: function (fp, response) {
                            console.info("failure");
                        }
                    });
                } else {

                    mostrarMensaje(1, "Debe seleccionar un archivo.");
                }
            }
        }
    });

    _this.btnCancelarImportar = new LOG.util.Prototipos.botonCancelar({
        tooltip: "Cerrar la ventana <B>(Alt+X)</B>",
        listeners: {
            'click': function () {
                _this.winImportar.close();
            }
        }
    });
    _this.winImportar = new LOG.util.Window({
        title: "Seleccionar fichero a importar",
        width: 320,
        height: 120,
        layout: 'form',
        resizable: false,
        modal: true,
        usarAplicar: false,
        usarAceptar: false,
        buttons: [_this.btnCancelarImportar, _this.btnIncluirDatos],
        items: [panel]
    });
    _this.winImportar.doLayout();
    _this.winImportar.show();

};

