   /*
 * Componente compatible con Genesig para agregarlo desde el marco de trabajo.
 */
Genesig.generatedTools.zeolides = function () {
    AjaxPlugins.locatePoint.show();
};

AjaxPlugins.locatePoint = {
    description: 'Este plugin sera annadido a Genesig desde el marco de trabajo Zeolides',

    /**
     *  Manejador de eventos
     */
    EVT_MANAGER:new Ext.util.Observable(),

    /**
     * Subcriccion a eventos
     */
    on:function(evt, fn, scope) {
        AjaxPlugins.locatePoint.EVT_MANAGER.on(evt, fn, scope);
    },
    init:function(){}
};

//Agregando evento para cuando se haga click en el boton Aceptar de la ventana ya capturado un punto
AjaxPlugins.locatePoint.EVT_MANAGER.addEvents({
    capture:true
});

AjaxPlugins.locatePoint.Execute = function (enSilencio) {

    var _this = AjaxPlugins.locatePoint;
    var mE = AjaxPlugins.Location.maxExtent;
    var msg = AjaxPlugins.CartoMessages;

    enSilencio = enSilencio == undefined ? true : enSilencio;
    // Validar por el componente que todos los campos sean validos
    if (_this.objCoordProj.validarCampos(enSilencio)) {

        var coord = _this.objCoordProj.obtenerComponenteGMS().obtenerCoordenadasGD();
        var proj = _this.objCoordProj.obtenerComponenteProjection().obtenerValoresProyeccion();
        if (coord && coord.x !== '' && coord.y !== '') {
            //if (coord.x != 0 || coord.y != 0)

            //Validando que las coordenadas del punto introducido en los campos este dentro de los limites del mapa
            if (coord.x > mE.left && coord.x < mE.right &&
                coord.y > mE.bottom && coord.y < mE.top) {

                //Disparando evento 'capture' que puede ser escuchado desde el marco de trabajo
                //Los datos enviados son los relacionados al punto capturado (Denominacion, coordenadas)
                AjaxPlugins.locatePoint.EVT_MANAGER.fireEvent("capture", {
                    'x':coord.x,
                    'y':coord.y,
                    /*'icono':_this.dv.icon,*/
                    'nombre':_this.locateCoordLabel.getValue()/*,
                    'projection':proj.codigo.toLowerCase(),
                    'zoom':_this.comboZoom1.getScaleValue(),
                    'flaglocate':true*/
                });
            }
            else {
                msg.mostrarMensaje(3, 'Las coordenadas del punto est&aacute;n fuera de los limites del mapa.');
            }
        }
        else {
            msg.mostrarMensaje(3, 'Por favor verifique nuevamente; hay campos con valores incorrectos.');
        }
    }
};

AjaxPlugins.locatePoint.show = function (map) {
    var _this = AjaxPlugins.locatePoint; //Referencia al plugin LocateCoord
    var location =AjaxPlugins.Location; //Referencia al plugin Location
    var cmps = Genesig.Componentes;
    var img= map.icon || map.defaultIcon;
    var name=map.name || '';
    _this._interfaceload = true;
    // Si la interfaz ya esta creada
    if (_this.window == null) {

        // instanciacion del componente de captura y su funcion de callback para escribir el resultado en los campos
        _this.objCatcherCoor = new cmps.PointCatcher({
            toolId: "locateCoordPointCatcher",
            llegada: function (obj) {
                var comp = _this.objCoordProj.obtenerComponenteGMS();
                comp.asignarCoordenadas(obj.x, obj.y);
                _this.window.focus();
                _this.window.expand();
            }
        });

        var catcherBrn = _this.objCatcherCoor.obtenerComponenteBoton({
            tooltip: 'Obtener las coordenadas de un punto sobre el mapa',
            style: 'margin:0 0 0 0',
            text: '',
            iconCls: 'gis_capturar_punto'
        }, function () {
            _this.window.collapse();
        });

        _this.objCoordProj = new cmps.FieldSetProjectionGMS({
            config_GMS: {
                catcherBtn:catcherBrn
            }
        });

        _this.objCoordProj.fieldSetGMS.fsGMS.width = 438;
        _this.objCoordProj.fieldSetProjection._cadena_proyeccion.width = 413;


        // Subscribir al cambio de proyeccion al componente de captura para tomar la proyeccion de destino
        _this.objCoordProj.obtenerComponenteProjection().on('cambioProyeccion',
            function (obj) {
                if(!obj.nueva){
                    return
                }
                var proj = 'epsg:' + obj.nueva.codigo;
                _this.objCatcherCoor.asignarProyeccionDestino(proj);
            });

        var store = new Ext.data.ArrayStore({
            autoDestroy:true,
            fields:[ 'url' ],
            data:[
                [img || map.defaultIcon]
            ]
        });
        _this.dv = new Ext.DataView({
            //overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
            emptyText:'No hay im&aacute;genes para mostrar',
            store:store,
            tpl:new Ext.XTemplate(
                '<style type="text/css"> .details { vertical-align:middle; overflow:hidden; border:0 none;  padding: 35px 0 0;} </style>',
                '<div style="text-align: center;">',
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{url}" title="{name}" style="width:30px;height:30px;padding:5px;" ></div>',
                '<span class="x-editable">{shortName}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div></center>'
            ),
            listeners:{
                click:function () {
                    var treeView = AjaxPlugins.base.ui.IconView({
                        id:'locatecoord-view-um',
                        width:400,
                        height:400,
                        symbol:"punto",
                        title:"Seleccionar s&iacute;mbolo",
                        node:'./images/icon',
                        cancelBtnTtip:'Cerrar ventana sin guardar los datos <span style="font-weight: bold;">(Alt+X)</span>',
                        okBtnTtip:'Guardar datos y cerrar ventana <span style="font-weight: bold;">(Enter)</span>',
                        callback:function (a) {
                            if (a.url != "-") {
                                _this.dv.getStore().loadData([
                                    [a.url]
                                ]);
                                _this.dv.icon = a.url;
                            }
                        }
                    });
                    treeView.show();
                }
            }
        });
        _this.dv.icon =img || map.defaultIcon;

        var data = [
            [ 1, "2000"],
            [ 2, "5000"],
            [ 3, "10000"],
            [ 4, "15000"],
            [ 5, "25000"],
            [ 6, "35000"],
            [ 7, "50000"],
            [ 8, "75000"],
            [ 9, "100000"],
            [ 10, "150000"],
            [ 11, "200000"],
            [ 12, "250000"],
            [ 13, "300000"],
            [ 14, "400000"],
            [ 15, "500000"],
            [ 16, "700000"],
            [ 17, "1000000"],
            [ 18, "2000000"],
            [ 19, "3000000"],
            [ 20, "7000000"]
        ];
        var store1 = new Ext.data.ArrayStore({
            autoDestroy:true,
            storeId:'myStore',
            idIndex:0,
            fields:[
                {
                    name:'id_escala'
                },
                {
                    name:'factor'
                }
            ],
            data:data
        });

        _this.onChangeScale = function () {
            var div = document.getElementById('labelXc');
            var value = _this.comboZoom1.getScaleValue();
            if (div) div.innerHTML = value;
        };

        _this.comboZoom1 = new Genesig.Componentes.fields.comboBox({
            id:'combozoom1',
            mode:'local',
            valueField:'id_escala',
            selectOnFocus:false,
            displayField:'factor',
            triggerAction:'all',
            forceSelection:false,
            value:location.comboEscala.getValue().replace(new RegExp("[\']", "g"), ""),
            editable:true,
            maskRe:/^[0-9]$/,
            //maskRe:new RegExp('[' + Ext.escapeRe("0123456789a") + ']'),
            width:110,
            store:store1,
            disabled:true,
            listeners:{
                select:function (/*comboEscala*/) {
                    _this.onChangeScale();
                },
                keyup:function (cb/*, e*/) {

                    /*Validando la entrada de caracteres extrannos para el navegador Google chrome*/
                    var str = cb.getRawValue(); //Obteniendo la cadena de texto del combo
                    var l = str[str.length - 1]; //Obteniendo el ultimo caracter de la cadena

                    var cr = "!:;.-\",'$%&()#"; //definiendo el grupo de caracteres extrannos
                    // no reconocidos por la expresion regular especificada
                    //  en la propiedad "maskRe" del combo

                    while (cr.indexOf(l) > -1) { //Si el ultimo caracter introducido es un caracter extranno
                        //Se elimina el ultimo caracter del valor del combo
                        str = str.substring(0, str.length - 1);
                        l = str[str.length - 1];
                    }
                    cb.setValue(str);
                    _this.onChangeScale();
                }
            }
        });
        _this.comboZoom1.getScaleValue = function () {
            var value = _this.comboZoom1.getRawValue();
            var scale = location.comboEscala.getValue();
            scale = scale.replace(new RegExp("[\']", "g"), "");
            var out = value * 100 / scale;
            return out.toFixed(2);
        };

        _this.comboZoom1.updateScale = function () {
            var scale = location.comboEscala.getValue();
            scale = scale.replace(new RegExp("[\']", "g"), "");
            _this.comboZoom1.setValue(scale);
        };
        _this.fieldSetGms = _this.objCoordProj.obtenerComponenteGMS();
        _this.fieldSetProjection = _this.objCoordProj.obtenerComponenteProjection();
        //console.log(map);

        _this.locateCoordLabel = new Genesig.Componentes.fields.fieldDenom({
            xtype:'textfield',
            value:name || '',
            id:'locatecoord-label',
            fieldLabel: 'Denominaci&oacute;n',
            selectOnFocus:true,
            maxLength:255,
            anchor:'98%',
            tooltip: 'Denominaci&oacute;n',
            allowBlank:false,
            readOnly: map.readOnly/*,
            blankText:'Este campo es obligatorio'*/
        });

        _this.panel = new Ext.form.FormPanel({
            labelAlign:'left',
            frame:true,
            items:[
                {
                    xtype:'fieldset',
                    //layout:'column',
                    title:'Datos del punto',
                    labelAlign: 'top',
                    items:[_this.locateCoordLabel
                        /*{
                            xtype:'fieldset',
                            title:'S&iacute;mbolo',
                            columnWidth:.20,
                            items:[_this.dv]
                        },*/
                        /*{
                            columnWidth:1,
                            layout:'form',
                            bodyStyle:'margin:0 0 0 5;',
                            items:[
                                _this.locateCoordLabel
                            ]
                        }*/
                    ]
                },
                {
                    xtype:'fieldset',
                    layout:'column',
                    title:'Sistema de referencia espacial',
                    items:[
                        /*{
                            columnWidth:1,
                            items:[_this.fieldSetProjection.obtenerComponente()]
                        },
                        // Invocar el componente de renderizado del fieldSet  para proyecciones
                        {
                            columnWidth:1,
                            style:'margin:2px; padding: 2px;'
                        },*/
                        {
                            columnWidth:1,
                            items:[_this.fieldSetGms.obtenerComponente()]
                        }  // Invocar el subcomponente del fieldSet para Grados Minutos Segundos
                    ]
                },
                /*{
                    xtype:'fieldset',
                    title:'Modificar nivel de zoom',
                    collapsible:true,
                    width:462,
                    collapsed:true,
                    listeners:{
                        expand:function (*//*p*//*) {
                            _this.comboZoom1.updateScale();
                            _this.comboZoom1.enable();
                        },
                        collapse:function (*//*p*//*) {
                            _this.comboZoom1.disable();

                        }
                    },
                    items:[
                        {
                            layout:'column',
                            items:[

                                {
                                    columnWidth:'.40',
                                    layout:'column',
                                    items:[
                                        {
                                            columnWidth:1,
                                            html:"<div class='labelStyle'>Escala: </div>"
                                        },

                                        {
                                            columnWidth:1,
                                            items:[_this.comboZoom1]
                                        }
                                    ]
                                },
                                {
                                    columnWidth:'.25',
                                    layout:'column',
                                    items:[
                                        {
                                            columnWidth:1,
                                            html:"<div class='labelStyle'>Escala en (%): </div>"
                                        },

                                        {
                                            columnWidth:1,
                                            html:"<div class='labelStyle' style='font-weight: bold; border:1px solid #bcbcbc; padding:2px;' id='labelXc'> 100 </div>"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }*/
            ]
        });

        _this.activarOkBtn = function () {
            _this.okBtn.enable();
        };
        _this.okBtn = new Genesig.Componentes.buttons.btnAceptar({
            tooltip:'Localizar un punto por sus coordenadas',
            handler:function () {
                // False para mostrar errores de validacion en los campos
                _this.Execute(true);
            }
        });

        this.cancelBtn = new Genesig.Componentes.buttons.btnCancelar({
            handler:function () {
                _this.window.close();
            }
        });

        //Creando un validador para activar el boton Aceptar de la ventana principal
        var fs = _this.fieldSetGms;

        _this.window = new Ext.GViewWindow({
            title: map.titleWindow || 'Localizar punto',
            layout:'fit',
            width:490,
            //height:550,
            height:330,
            collapsible:true,
            resizable:false,
            autoScroll:false,
            plain:true,
            items:_this.panel,
            listeners:{
                close:function (/*p*/) {
                    /*delete _this.window;*/
                    _this.window.destroy();
                    _this.window = null;
                }
            },
            buttons:[this.cancelBtn, this.okBtn ]
        });

        var formvalidator = new cmps.FormValidator({

            fields:[
                _this.objCoordProj
                /*_this.fieldSetProjection._proyeccion,
                 fs.nbfLatGra,
                 fs.nbfLonGra,
                 fs.nbfLatMin,
                 fs.nbfLonMin,
                 fs.nbfLatSeg,
                 fs.nbfLonSeg,
                 fs.nbfXCart,
                 fs.nbfXCart,
                 fs.rE,
                 fs.rW,
                 fs.rN,
                 fs.rS*/
            ],
            buttons:[
                _this.okBtn
            ],
            keyMapContainer:this.window,
            buttonsRegister:[_this.cancelBtn],
            checkDirty:false
        }).check();

        location.registerWindows(_this.window);
    }
    _this.window.show();
    _this.window.expand();
};

AjaxPlugins.initializablePlugins.push(AjaxPlugins.locatePoint);
