/**
 Uso:Componente para realizar la busqueda de personas.

 * ---------------------------------------------

 * 23 de Agosto 2011 |   Persona
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.pvd.persona.buscarpersona');
Ext.QuickTips.init();
Ext.pvd.persona.buscarpersona.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    }
};
var utils = new Ext.pvd.persona.buscarpersona.Utils();
var nombrefoto = '';
var idsituacionpersona = 0;
var idsituacionespecificapersona = -1;
Ext.QuickTips.init();

/*Componente panelBuscarpersona*/
Ext.pvd.persona.buscarpersona.panelBuscarpersona = Ext.extend(Ext.Panel, {
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'border'),
    frame: false,
    border: false,
    seguridad: (this.seguridad ? this.seguridad : -1),
    hideBorders: true,
    singleSelect: (this.hasOwnProperty('singleSelect') ? _this.singleSelect : 'true'),
    modulo: (this.modulo ? this.modulo : null ),
    funcionalidad: (this.funcionalidad ? this.funcionalidad : null),
    identidad: (this.identidad ? this.identidad : null),
    campocolores: (this.campocolores ? this.campocolores : null),
    cliente: (this.cliente ? this.cliente : null),
    esretencion: (this.esretencion ? this.esretencion : 0),
    cargoprincipal: (this.cargoprincipal ? this.cargoprincipal : 0),
    initComponent: function () {
        this.cantidadPorPaginas = (this.cantidadPorPaginas ? this.cantidadPorPaginas : 20);
        var _this = this;
        this.seleccion = null;
        var idCmp = this.id;
        var arrayidplantillas = new Array();
        // this.btnAyuda = new Ext.Button({
        //     hidden: (this.hideBtnAyuda ? true : false),
        //     id: 'btnAyudaTP'+idCmp,
        //     text:'Ayuda',
        //     icon:perfil.dirImg+'ayuda.png',
        //     iconCls:'btn',
        //     tooltip: 'Mostrar ayuda de la funcionalidad',
        //     handler : function(){
        //         var title	= 'Ayuda de buscar persona';
        //         var referencia	= 'persona/registro/buscarpersonacomponente';
        //         help.show(title,referencia);
        //     }
        // });

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar' + idCmp,
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar',
            name: 'tfbuscador',
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13) {
                        _this.Buscar();
                    }
                }
            }
        });

        this.btnAdicionar = new Ext.Button({
            hidden: (this.showBtnAdicionar ? !this.showBtnAdicionar : true),
            id: 'btnAdicionar' + idCmp,
            iconCls: 'adicionar',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar persona <b>(Alt+I)</b>',
            handler: function () {
                var win = new Ext.pvd.persona.buscarpersona.winAdicionarpersona();
                win.on('personaguardada', function (idpersona) {
                    _this.fireEvent('personaguardada', idpersona);
                })
                win.show();
            }
        });

        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar' + idCmp,
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar personas <b>(Alt+B)</b>',
            handler: function () {
                _this.Buscar();
            }
        });

        this.btnBuscarAvanzado = new Ext.Button({
            disabled: false,
            id: 'btnBuscarAvanzado' + idCmp,
            iconCls: 'buscaravanzada',
            text: 'B&uacute;s<u>q</u>ueda avanzada',
            tooltip: 'B&uacute;squeda avanzada de personas',
            handler: function () {
                _this.winBuscarAvanzado.show();
                _this.tfBuscarnoidentidad.focus();
            }
        });

        this.btnDarAlta = new Ext.Button({
            //disabled : true,
            id: 'btnDarAlta' + idCmp,
            iconCls: 'arriba',
            text: 'Sync. Altas',
            tooltip: 'Sincronizar altas a varias personas',
            hidden: (this.funcionalidad == 'GCO') ? false : true
        });

        this.btnHavilitar = new Ext.Button({
            id: 'btnHavilitar',
            text: 'Habilitar',
            tooltip: 'Habilitar persona.',
            iconCls: 'habilitar verde',
            disabled: true,
            hidden: (this.funcionalidad == 'GCO') ? false : true
        });

        this.btnNoHavilitar = new Ext.Button({
            id: 'btnNoHavilitar',
            text: 'No habilitar',
            tooltip: 'No habilitar persona.',
            iconCls: 'habilitar rojo',
            disabled: true,
            hidden: (this.funcionalidad == 'GCO') ? false : true
        });

        this.btnFiltrarActivo = new Ext.Toolbar.MenuButton({
            text: 'Filtro',
            tooltip: 'Filtrar personas.',
            hidden: (this.funcionalidad == 'GCO') ? false : true,
            iconCls: 'filtrar',
            menu: {
                items: [
                    {
                        text: 'Activar',
                        tooltip: 'Activar persona.',
                        iconCls: 'icondistra-true verde',
                        disabled: false,
                        handler: function () {
                            _this.FiltrarActivo(1);
                        }
                    }, {
                        text: 'Desactivar',
                        tooltip: 'Desactivar persona.',
                        iconCls: 'icondistra-false rojo',
                        disabled: false,
                        handler: function () {
                            _this.FiltrarActivo(0);
                        }
                    }
                ]
            }
        });

        this.btnSincMovimientos = new Ext.Button({
            disabled: true,
            id: 'btnSincMovimientos' + idCmp,
            iconCls: 'arriba',
            text: 'Sync. Movimientos',
            tooltip: 'Sincronizar movimientos laborales',
            hidden: true
        });

        this.btnDarBaja = new Ext.Button({
            disabled: true,
            id: 'btnDarBaja' + idCmp,
            iconCls: 'abajo',
            text: 'Sync. Bajas',
            tooltip: 'Sincronizar bajas a a varias personas',
            hidden: (this.cliente == 'MINFAR') ? false : true
        });

        this.btnLimpiar = new Ext.Button({
            text: '<u>L</u>impiar',
            tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                _this.tfbuscar.reset();
                _this.btnBuscar.handler();
//		      _this.stpersonabuscar.load({
//                        params:{
//                            start : 0,
//                            limit : _this.cantidadPorPaginas
//                        }
//                    });
            }
        });

        this.tfBuscarnoidentidad = new Ext.form.TextField({
            nextTab: 'tfBuscarnombre' + idCmp,
            prevTab: 'cbBuscartiponoidentidad' + idCmp,
            id: 'tfBuscarnoidentidad' + idCmp,
            fieldLabel: 'No. de identidad',
            blankText: 'Este campo es obligatorio.',
            maskRe: /^([a-zA-Z\d]+ ?[a-zA-Z\d]*)+$/,
            anchor: '80%',
            name: 'bnumid'
        });

        this.tfBuscarnombre = new Ext.form.TextField({
            id: 'tfBuscarnombre' + idCmp,
            maxLength: 50,
            fieldLabel: 'Nombre',
            nextTab: 'tfBuscarsnombre' + idCmp,
            prevTab: 'tfBuscarnoidentidad' + idCmp,
            name: 'bnombre',
            allowBlank: true,
            anchor: '80%',
            msgTarget: 'qtip',
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            blankText: 'Este campo es obligatorio'
        });

        this.tfBuscarsnombre = new Ext.form.TextField({
            maxLength: 50,
            fieldLabel: 'Segundo nombre',
            id: 'tfBuscarsnombre' + idCmp,
            name: 'bsnombre',
            nextTab: 'cbBuscarsexo' + idCmp,
            prevTab: 'cbBuscartiponoidentidad' + idCmp,
            allowBlank: true,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            msgTarget: 'qtip',
            anchor: '80%',
            blankText: 'Este campo es obligatorio'
        });

        this.tfBuscarpapellido = new Ext.form.TextField({
            fieldLabel: 'Primer apellido',
            id: 'tfBuscarpapellido' + idCmp,
            name: 'bpapel',
            nextTab: 'cbBuscarcategoria' + idCmp,
            prevTab: 'cbBuscarsexo' + idCmp,
            maxLength: 50,
            allowBlank: true,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            msgTarget: 'qtip',
            anchor: '80%',
            blankText: 'Este campo es obligatorio'
        });

        this.tfBuscarsapellido = new Ext.form.TextField({
            maxLength: 50,
            fieldLabel: 'Segundo apellido',
            id: 'tfBuscarsapellido' + idCmp,
            name: 'bsapel',
            nextTab: 'btnCancelarBusqueda' + idCmp,
            prevTab: 'cbBuscarcategoria' + idCmp,
            allowBlank: true,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            msgTarget: 'qtip',
            anchor: '80%',
            blankText: 'Este campo es obligatorio'
        });

        this.stBuscartiponoidentidad = new Ext.data.Store({
            url: '/pvd/comun/index.php/buscarpersonacomp/cargarcombotiponoidentidad',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idtipodocidentidad"
            }, [{
                name: 'idtipodocidentidad'
            }, {
                name: 'denom'
            }, {
                name: 'cantcaracteres'
            }, {
                name: 'alfanumerico'
            }]),
            listeners: {
                load: function () {
                    _this.cbBuscartiponoidentidad.enable();
                    _this.cbBuscartiponoidentidad.focus(true, 300);
                }
            }
        });

        this.cbBuscartiponoidentidad = new Ext.form.ComboBox({
            id: 'cbBuscartiponoidentidad' + idCmp,
            store: this.stBuscartiponoidentidad,
            tpl: '<tpl for="."><div ext:qtip="<p><b>{denom}</b></p>{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            fieldLabel: 'Tipo de identidad',
            displayField: 'denom',
            hiddenName: 'idtipodocidentidad',
            valueField: 'idtipodocidentidad',
            mode: 'local',
            nextTab: 'tfBuscarnoidentidad' + idCmp,
            prevTab: 'btnAceptarBusqueda' + idCmp,
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: true,
            selectOnFocus: true,
            anchor: '80%',
            msgTarget: 'qtip',
            blankText: 'Este campo es obligatorio',
            disabled: true
        });

        this.cbBuscartiponoidentidad.on('select', function (cb, rec, index) {
            Ext.getCmp('tfBuscarnoidentidad' + idCmp).minLength = rec.json.cantminima;
            Ext.getCmp('tfBuscarnoidentidad' + idCmp).maxLength = rec.json.cantmaxima;
        })

        this.stBuscarsexo = new Ext.data.Store({
            url: '/pvd/comun/index.php/buscarpersonacomp/cargarcombosexo',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idsexo"
            }, [{
                name: 'idsexo'
            }, {
                name: 'denom'
            }]),
            listeners: {
                load: function () {
                    _this.cbBuscarsexo.enable();
                }
            }
        });

        this.cbBuscarsexo = new Ext.form.ComboBox({
            id: 'cbBuscarsexo' + idCmp,
            store: this.stBuscarsexo,
            tpl: '<tpl for="."><div ext:qtip="<p><b>{denom}</b></p>{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            fieldLabel: 'Sexo',
            displayField: 'denom',
            hiddenName: 'idsexo',
            valueField: 'idsexo',
            nextTab: 'tfBuscarpapellido' + idCmp,
            prevTab: 'tfBuscarsnombre' + idCmp,
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: true,
            selectOnFocus: true,
            anchor: '80%',
            msgTarget: 'qtip',
            blankText: 'Este campo es obligatorio',
            disabled: true
        });

        this.stBuscarcategoria = new Ext.data.Store({
            url: '/pvd/comun/index.php/buscarpersonacomp/cargarcombocategoria',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idcategoriapersona"
            }, [{
                name: 'idcategoriapersona'
            }, {
                name: 'denominacion'
            }]),
            listeners: {
                load: function () {
                    _this.cbBuscarcategoria.enable();
                }
            }
        });

        this.cbBuscarcategoria = new Ext.form.ComboBox({
            id: 'cbBuscarcategoria' + idCmp,
            tpl: '<tpl for="."><div ext:qtip="<p><b>{denominacion}</b></p>{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: this.stBuscarcategoria,
            fieldLabel: 'Categor&iacute;a',
            displayField: 'denominacion',
            hiddenName: 'idcategoriapersona',
            valueField: 'idcategoriapersona',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: true,
            selectOnFocus: true,
            anchor: '80%',
            msgTarget: 'qtip',
            nextTab: 'tfBuscarsapellido' + idCmp,
            prevTab: 'tfBuscarpapellido' + idCmp,
            blankText: 'Este campo es obligatorio',
           // disabled: true
        });

        //Combo con las plantillas
        this.cbPlantillas = new Ext.components.TreeComboBox({
            anchor: "90%",
            fieldLabel: 'Plantillas nominales',
            id: 'cbPlantillas',
            allowBlank: true,
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: '/pvd/comun/index.php/buscarpersonacomp/cargarplantillasnominales',
                    preloadChildren: false,
                    listeners: {
                        beforeload: function (treeLoader, node, response) {
                            this.cbPlantillas.reset();
                            treeLoader.baseParams.idnodo = node.attributes.idnodo;
                            treeLoader.baseParams.idestructura = this.identidad;
                            //treeLoader.baseParams.idconfiguracion = this.idconfiguracion;
                        }.createDelegate(this)
                    }
                }),
                border: false,
                autoScroll: true,
                root: new Ext.tree.AsyncTreeNode({
                    id: '-1',
                    text: 'Reportes',
                    idnodo: '-1',
                    animate: false,
                    draggable: false,
                    expanded: false
                }),
                listeners: {
                    click: function (node, e) {
                        //this.cambio = 1;
                    }
                }
            }
        });

        this.fpBuscarAvanzado = new Ext.FormPanel({
            id: 'fpBuscarAvanzado' + idCmp,
            labelAlign: 'top',
            frame: true,
            labelWidth: 50,
            autoHeight: true,
            width: 500,
            heigth: 300,
            items: ((this.modulo == 'NOMINA') ? [{
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarnoidentidad]},
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarnombre]}

                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarsnombre]},
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarpapellido]}

                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarsapellido]},
                    {columnWidth: .5, layout: 'form', items: [this.cbBuscarcategoria]}

                ]
            },(this.cliente == 'MINFAR')? {
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarNumeroCuenta]},
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarGrado]}

                ]
            }:{},
             this.cbPlantillas] : [{
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarnoidentidad]},
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarnombre]}

                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarsnombre]},
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarpapellido]}

                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.tfBuscarsapellido]},
                    {columnWidth: .5, layout: 'form', items: [this.cbBuscarcategoria]}

                ]
            }])
        });

        this.primeraves = 1;
        this.winBuscarAvanzado = new Ext.Window({
            constrain: true,
            plain: true,
            title: 'B&uacute;squeda avanzada',
            closeAction: 'hide',
            modal: true,
            frame: true,
            width: 500,
            height: 300,
            items: [this.fpBuscarAvanzado],
            listeners: {
                show: function () {
                    if (_this.primeraves == 1) {
                        _this.stBuscarsexo.load();
                        _this.stBuscartiponoidentidad.load();
                        _this.stBuscarcategoria.load();
                        _this.primeraves = 0;
                    }
                    _this.cbBuscartiponoidentidad.focus(true, 300);
                },
                show: function () {
                    this.cbPlantillas.tree.getLoader().load(this.cbPlantillas.tree.getRootNode());
					_this.stBuscarcategoria.load();

                }.createDelegate(this)

            },
            buttons: [{
                text: 'Cancelar',
                id: 'btnCancelarBusqueda' + idCmp,
                iconCls: 'cancelar',
                nextTab: 'btnLimpiarBusqueda' + idCmp,
                prevTab: 'tfBuscarsapellido' + idCmp,
                tooltip: 'Cerrar ventana sin buscar las personas',
                handler: function () {
                    _this.winBuscarAvanzado.hide();
                    _this.LimpiarComponenteBuscar();
                }
            }, {
                text: 'Limpiar',
                iconCls: 'limpiar',
                tooltip: 'Limpiar filtros',
                nextTab: 'btnAceptarBusqueda' + idCmp,
                prevTab: 'btnCancelarBusqueda' + idCmp,
                id: 'btnLimpiarBusqueda' + idCmp,
                //disabled: true,
                handler: function () {
                    _this.LimpiarComponenteBuscar();
                }
            }, {
                text: 'Aceptar',
                iconCls: 'aceptar',
                //disabled: true,
                nextTab: 'tfBuscarnoidentidad' + idCmp,//'cbBuscartiponoidentidad'+idCmp,
                prevTab: 'btnLimpiarBusqueda' + idCmp,
                tooltip: 'B&uacute;squeda avanzada de personas',
                id: 'btnAceptarBusqueda' + idCmp,
                handler: function () {
                    var contplantillas = 0;

                    var arrayidplantillasarbol = _this.cbPlantillas.tree.getChecked();
                    arrayidplantillas = [];
                    
                    
                    for (var i = 0; i < arrayidplantillasarbol.length; i++) {
                        arrayidplantillas[contplantillas] = arrayidplantillasarbol[i].id;
                        contplantillas++;
                    }
                    if(_this.cliente == "MINFAR")
                    {
                        var persona = {
                            numid: _this.tfBuscarnoidentidad.getValue(),
                            tipoidentidad: _this.cbBuscartiponoidentidad.getValue(),
                            idsexo: _this.cbBuscarsexo.getValue(),
                            idcategoriapersona: _this.cbBuscarcategoria.getValue(),
                            nombre: _this.tfBuscarnombre.getValue(),
                            snombre: _this.tfBuscarsnombre.getValue(),
                            primerapellido: _this.tfBuscarpapellido.getValue(),
                            segundoapellido: _this.tfBuscarsapellido.getValue(),
                            numerocuenta: _this.tfBuscarNumeroCuenta.getValue(),
                            grado: _this.tfBuscarGrado.getValue(),
                            arrayidplantillas: arrayidplantillas,
                            cliente: _this.cliente,
                            cargoprincipal: _this.cargoprincipal
                        } 
                    }
                    else 
                    {
                        var persona = {
                            numid: _this.tfBuscarnoidentidad.getValue(),
                            tipoidentidad: _this.cbBuscartiponoidentidad.getValue(),
                            idsexo: _this.cbBuscarsexo.getValue(),
                            idcategoriapersona: _this.cbBuscarcategoria.getValue(),
                            nombre: _this.tfBuscarnombre.getValue(),
                            snombre: _this.tfBuscarsnombre.getValue(),
                            primerapellido: _this.tfBuscarpapellido.getValue(),
                            segundoapellido: _this.tfBuscarsapellido.getValue(),
                            arrayidplantillas: arrayidplantillas,
                            cliente: _this.cliente,
                            cargoprincipal: _this.cargoprincipal
                        }
                    
                    }

                    _this.fbuscarpersonacomp(persona);
                    _this.winBuscarAvanzado.hide();
                    _this.LimpiarComponenteBuscar();
                }
            }]
        });

        /*this.recPersonas = [{
         name : 'idpersona'
         }, {
         name : 'numid'
         }, {
         name : 'nombre'
         }, {
         name : 'snombre'
         }, {
         name : 'papel'
         }, {
         name : 'sapel'
         }, {
         name : 'idsexo'
         }, {
         name : 'idcategoriapersona'
         }, {
         name : 'idtipodocidentidad'
         }, {
         name : 'tipodocidentidad'
         }, {
         name : 'idpersonaidentidad'
         }, {
         name:'idfoto'
         }, {
         name:'extension'
         }, {
         name:'idusuario'
         }, {
         name:'nombreusuario'
         }, {
         name:'idplantillanominal'
         }, {
         name:'plantilla'
         }, {
         name:'cdgocontable'
         }, {
         name:'idinterrupto '
         }, {
         name:'iddisponible '
         }, {
         name:'idpersonaentidad '
         }];*/

        if (this.campocolores) {
            var c = {name: this.campocolores};
            //this.recPersonas.push(c);
        }

        this.stpersonabuscar = new Ext.data.GroupingStore({
            url: '/pvd/comun/index.php/buscarpersonacomp/cargarpersona',
            groupField: 'plantilla',
            sortInfo: {field: 'plantilla', direction: "ASC"},
            baseParams: {
                tipobusqueda: 1,
                texto: '',
                persona: new Array(),
                seguridad: this.seguridad,
                modulo: this.modulo,
                cliente: this.cliente,
                funcionalidad: this.funcionalidad,
                identidad: this.identidad,
                campocolores: this.campocolores,
                cliente: this.cliente,
                cargoprincipal: this.cargoprincipal
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                // id: (this.cargoprincipal == 2)?'idcargosocupados':'idpersona',
                id: 'idcargosocupados',
                totalProperty: 'cant'
            }, [{
                name: 'idpersona'
            }, {
                name: 'idcargosocupados'
            }, {
                name: 'numid'
            }, {
                name: 'nombre'
            }, {
                name: 'snombre'
            }, {
                name: 'papel'
            }, {
                name: 'sapel'
            }, {
                name: 'idsexo'
            }, {
                name: 'idcategoriapersona'
            }, {
                name: 'idtipodocidentidad'
            }, {
                name: 'tipodocidentidad'
            }, {
                name: 'idpersonaidentidad'
            }, {
                name: 'idfoto'
            }, {
                name: 'extension'
            }, {
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }, {
                name: 'idplantillanominal'
            }, {
                name: 'plantilla'
            }, {
                name: 'cdgocontable'
            }, {
                name: 'idinterrupto '
            }, {
                name: 'iddisponible '
            }, {
                name: 'idpersonaentidad '
            }, {
                name: 'orden'
            }, {
                name: 'idretencionpersona'
            }, {
                name: 'idcargo'
            }, {
                name: 'denomcargo'
            }, {
                name: 'activa'
            }])
        });


        this.stpersonabuscar.on('load', function (st) {
            this.arrayidplantillas = new Array();
            this.btnDarAlta.disable();
            this.btnDarBaja.disable();
        }.createDelegate(this));


        this.smpersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: _this.singleSelect,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.seleccion = record;
                },
                selectionchange: function (defsm) {
                    if (defsm.getSelected() != null) {
                        _this.fireEvent('personaselecionada', defsm.getSelected());
                        _this.seleccion = defsm.getSelected();
                    } else {
                        _this.fireEvent('personanoselecionada');
                        _this.seleccion = null;
                    }
                }
            }
        });

        this.pgtbBuscarpersona = new Ext.PagingToolbar({
            pageSize: _this.cantidadPorPaginas,
            store: this.stpersonabuscar,
            emptyMsg: '0 Resultados para mostrar',
            displayInfo: true,
            displayMsg: 'Resultados del {0} - {1} de {2}'
        });

        this.FnEstadoPersona = function (val, metaData, record, rowIndex, colIndex, store) {              
            if (record.get('activa') == 1) {
                metaData.css = 'icondistra-true verde';
            } else {
                metaData.css = 'icondistra-false rojo';
            }
        }.createDelegate(this);

        this.RenderizarColores = function (v, m, rec, rowIndex, colIndex, store) {
            if (this.modulo == 'NOMINA') {
                if (this.funcionalidad == 'GCO') {
                    if (rec.get('idcargosocupados') == null) {
                        return '<span style="color:red;">' + v + '</span>';
                    } else {
                        if (!isNaN(rec.get('idinterrupto'))) {
                            return '<span style="color:yellow;">' + v + '</span>';
                        } else if (!isNaN(rec.get('iddisponible'))) {
                            return '<span style="color:orange;">' + v + '</span>';
                        } else {
                            return '<span style="color:green;">' + v + '</span>';
                        }

                    }
                    /*var cc = eval ('rec.data.'+this.campocolores);
                     if( cc == null) return (v != null ? '<span style="color:red;">' + v + '</span>' : '');
                     else return (v != null ? '<span style="color:green;">' + v + '</span>' : '');*/
                } else if (this.funcionalidad == 'CESP') {
                    if (this.esretencion == 1) {
                        //console.info(rec.get('idretencionpersona'));
                        if (rec.get('idretencionpersona') != null && rec.get('idretencionpersona') != '') {
                            return '<span style="color:green;">' + v + '</span>';
                        } else return '<span style="color:black;">' + v + '</span>';
                    }else return v;
                } else return v;
            } else return v;
        }.createDelegate(this);

        this.cmpersonabuscar = [this.smpersonas, {
            hidden: true,
            hideable: false,
            dataIndex: 'idpersona'
        }, new Ext.grid.RowNumberer(), {
            header: 'C&oacute;digo',
            width: 25,
            dataIndex: 'cdgocontable',
            menuDisabled: true,
            renderer: this.RenderizarColores
        }, {
            header: 'idinterrupto',
            width: 50,
            dataIndex: 'idinterrupto',
            hidden: true,
            renderer: this.RenderizarColores
        }, {
            header: 'iddisponible',
            width: 50,
            dataIndex: 'iddisponible',
            hidden: true,
            renderer: this.RenderizarColores
        }, {
            header: 'No. de identidad',
            width: 50,
            dataIndex: 'numid',
            menuDisabled: true,
            renderer: this.RenderizarColores
        }, {
            header: 'Nombre',
            width: 60,
            dataIndex: 'nombre',
            menuDisabled: true,
            renderer: this.RenderizarColores
        }, {
            header: 'Segundo nombre',
            width: 60,
            dataIndex: 'snombre',
            menuDisabled: true,
            renderer: this.RenderizarColores
        }, {
            header: 'Primer apellido',
            width: 60,
            dataIndex: 'papel',
            menuDisabled: true,
            renderer: this.RenderizarColores
        }, {
            header: 'Segundo apellido',
            width: 60,
            dataIndex: 'sapel',
            menuDisabled: true,
            renderer: this.RenderizarColores
        }, {
            header: 'Cargo',
            width: 100,
            dataIndex: 'denomcargo',
            menuDisabled: true,
            renderer: this.RenderizarColores
        }, {
            header: 'Activo',
            hidden: (this.funcionalidad == 'GCO') ? false : true,
            hideable: false, 
            width: 60,
            dataIndex: 'activa',
            menuDisabled: false,
            renderer: this.FnEstadoPersona
        }, {
            header: 'Plantilla nominal',
            width: 60,
            dataIndex: 'plantilla',
            hidden: true,
            menuDisabled: true,
            renderer: function (val) {
                var arrval = val.split("-");
                return '<span style="color:green;">' + arrval[1] + '</span>';
            }
        }, {
            header: 'Orden',
            width: 60,
            dataIndex: 'orden',
            menuDisabled: true,
            hidden: true
        }, {
            header: 'Id sexo',
            hidden: true,
            width: 90,
            dataIndex: 'idsexo',
            menuDisabled: true
        }, {
            header: 'Id Categoria Persona',
            hidden: true,
            width: 90,
            dataIndex: 'idcategoriapersona',
            menuDisabled: true
        }, {
            header: 'Id Tipo Doc Identidad',
            hidden: true,
            width: 90,
            dataIndex: 'idtipodocidentidad',
            menuDisabled: true
        }, {
            header: 'Tipo Doc Identidad',
            hidden: true,
            width: 90,
            dataIndex: 'tipodocidentidad',
            menuDisabled: true
        }, {
            header: 'Id Persona Identidad',
            hidden: true,
            width: 90,
            dataIndex: 'idpersonaidentidad',
            menuDisabled: true
        }, {
            hidden: true,
            hideable: false,
            dataIndex: 'version',
            menuDisabled: true
        }, {
            hidden: true,
            hideable: false,
            dataIndex: 'idfoto',
            menuDisabled: true
        }, {
            hidden: true,
            hideable: false,
            dataIndex: 'extension',
            menuDisabled: true
        }, {
            hidden: true,
            hideable: false,
            dataIndex: 'idusuario',
            menuDisabled: true
        }, {
            hidden: true,
            hideable: false,
            dataIndex: 'nombreusuario',
            menuDisabled: true
        }, {
            hidden: true,
            hideable: false,
            dataIndex: 'idretencionpersona',
            menuDisabled: true
        }];

        if (this.campocolores) {
            var cm = {
                hidden: true,
                hideable: false,
                dataIndex: this.campocolores,
                menuDisabled: true
            };
            this.cmpersonabuscar.push(cm);
        }

        this.gpPersonabuscar = new Ext.grid.GridPanel({
            id: 'gpPersonabuscar' + idCmp,
            region: 'center',
            store: this.stpersonabuscar,
            frame: false,
            border: false,
            hideBorders: true,
            loadMask: 'Cargando...',
            stripeRows: true,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            enableColumnMove: false,
            sm: this.smpersonas,
            columns: this.cmpersonabuscar,
            bbar: _this.pgtbBuscarpersona,
            tbar: [this.btnAdicionar, 'Buscar persona: ', '', this.tfbuscar, ' ', this.btnBuscar, '', this.btnBuscarAvanzado, this.btnLimpiar, this.btnDarAlta, this.btnSincMovimientos, this.btnDarBaja, this.btnHavilitar, this.btnNoHavilitar, this.btnFiltrarActivo/*, '->', this.btnAyuda*/]
            /*listeners: {
             'render' : function(grid){

             var cantCalculado = Math.floor(grid.container.getBox().height / 20);
             var limit = (cantCalculado ? cantCalculado - 5 : 20);
             _this.cantidadPorPaginas = (_this.cantidadPorPaginas)?_this.cantidadPorPaginas:limit;
             _this.pgtbBuscarpersona.pageSize = _this.cantidadPorPaginas;
             _this.stpersonabuscar.baseParams.identidad = this.identidad;
             _this.stpersonabuscar.baseParams.campocolores = this.campocolores;
             _this.stpersonabuscar.load({
             params:{
             start : 0,
             limit : _this.cantidadPorPaginas
             }
             });
             }.createDelegate(this)
             }*/
        });

        this.FiltrarActivo = function (activo) {
            _this.stpersonabuscar.removeAll();
            _this.stpersonabuscar.baseParams.tipobusqueda = 1;
            _this.stpersonabuscar.baseParams.texto = '';
            _this.stpersonabuscar.baseParams.persona = '';
            _this.stpersonabuscar.baseParams.identidad = this.identidad;
            _this.stpersonabuscar.baseParams.campocolores = this.campocolores;
            _this.stpersonabuscar.baseParams.seguridad = _this.seguridad;
            _this.stpersonabuscar.baseParams.activo = activo;
            _this.stpersonabuscar.load({
                params: {
                    start: 0,
                    limit: _this.cantidadPorPaginas
                }
            });
        }

        this.Buscar = function () {
            if (_this.tfbuscar.getValue()) {
                if (_this.tfbuscar.isValid()) {
                    _this.stpersonabuscar.removeAll();
                    _this.stpersonabuscar.baseParams.tipobusqueda = 1;
                    _this.stpersonabuscar.baseParams.texto = _this.tfbuscar.getValue();
                    _this.stpersonabuscar.baseParams.persona = '';
                    _this.stpersonabuscar.baseParams.identidad = this.identidad;
                    _this.stpersonabuscar.baseParams.campocolores = this.campocolores;
                    _this.stpersonabuscar.baseParams.seguridad = _this.seguridad;
                    _this.stpersonabuscar.baseParams.activo = '';
                    _this.stpersonabuscar.load({
                        params: {
                            start: 0,
                            limit: _this.cantidadPorPaginas
                        }
                    });
                }
                /*else{
                 mostrarMensaje(1, perfil.etiquetas.lbcantidadcaract);
                 }*/
            }
            else {
                _this.stpersonabuscar.removeAll();
                _this.stpersonabuscar.baseParams.persona = '';
                _this.stpersonabuscar.baseParams.texto = '';
                _this.stpersonabuscar.baseParams.seguridad = _this.seguridad;
                _this.stpersonabuscar.baseParams.campocolores = this.campocolores;
                _this.stpersonabuscar.baseParams.identidad = this.identidad;
                _this.stpersonabuscar.baseParams.cliente = this.cliente;
                _this.stpersonabuscar.baseParams.cargoprincipal = this.cargoprincipal;
                _this.stpersonabuscar.baseParams.activo = '';
                _this.stpersonabuscar.load({
                    params: {
                        start: 0,
                        limit: _this.cantidadPorPaginas
                    }
                });
            }

        }.createDelegate(this);

        this.LimpiarComponenteBuscar = function () {
            this.fpBuscarAvanzado.getForm().reset();
        }

        this.fbuscarpersonacomp = function (persona) {
            _this.stpersonabuscar.removeAll();
            _this.stpersonabuscar.baseParams.persona = Ext.encode(persona);
            _this.stpersonabuscar.baseParams.texto = '';
            _this.stpersonabuscar.baseParams.identidad = this.identidad;
            _this.stpersonabuscar.baseParams.campocolores = this.campocolores;
            _this.stpersonabuscar.baseParams.tipobusqueda = 2;
            _this.stpersonabuscar.baseParams.seguridad = _this.seguridad;
            _this.stpersonabuscar.baseParams.cliente = _this.cliente;
            _this.stpersonabuscar.baseParams.cargoprincipal = _this.cargoprincipal;
            _this.stpersonabuscar.baseParams.categoriapersonabuscar = this.cbBuscarcategoria.getValue();
            _this.stpersonabuscar.baseParams.activo = '';
            _this.stpersonabuscar.load({
                params: {
                    arrayidplantillas: Ext.encode(arrayidplantillas),
                    start: 0,
                    limit: _this.cantidadPorPaginas
                }
            });
        }.createDelegate(this);


        this.items = [this.gpPersonabuscar];
        this.keys = [{
            key: 'b',
            alt: true,
            fn: function () {
                if (!_this.btnBuscar.disabled)
                    _this.btnBuscar.handler();
            }
        }, {
            key: 'l',
            alt: true,
            fn: function () {
                if (!_this.btnLimpiar.disabled)
                    _this.btnLimpiar.handler();
            }
        }, {
            key: 'q',
            alt: true,
            fn: function () {
                if (!_this.btnBuscarAvanzado.disabled) {
                    _this.btnBuscarAvanzado.handler();
                }
            }
        }];
        Ext.pvd.persona.buscarpersona.panelBuscarpersona.superclass.initComponent.call(this);
        _this.tfbuscar.focus(true, 500);
    },
    getSeleccion: function () {
        return this.seleccion;
    },
    limipiarSeleccion: function () {
        this.smpersonas.clearSelections();
    },
    //This function returns array of selected records.
    getSelectedRows: function () {
        return this.smpersonas.getSelections();
    },
    CambiarEntidad: function (pidentidad) {
        this.identidad = pidentidad;
    },
    BuscarPersonas: function () {
        this.stpersonabuscar.removeAll();
        this.stpersonabuscar.baseParams.persona = '';
        this.stpersonabuscar.baseParams.texto = '';
        this.stpersonabuscar.baseParams.seguridad = this.seguridad;
        this.stpersonabuscar.baseParams.campocolores = this.campocolores;
        this.stpersonabuscar.baseParams.identidad = this.identidad;
        this.stpersonabuscar.baseParams.cliente = this.cliente;
        this.stpersonabuscar.baseParams.cargoprincipal = this.cargoprincipal;
        this.stpersonabuscar.load({
            params: {
                start: 0,
                limit: this.cantidadPorPaginas
            }
        });
    }

});

//----------------------------------------------------------------------------------
//====================================================================================
//== ****************************************************************************** ==
//====================================================================================

/*Formulario de datos de la persona*/
Ext.pvd.persona.buscarpersona.panelAdicionarpersona = Ext.extend(Ext.FormPanel, {
    layout: 'form',
    title: 'Datos generales',
    frame: true,
    labelAlign: 'top',
    trackResetOnLoad: true,
    height: 180,
    bodyStyle: 'padding: 3px 0px 0px 5px',
    width: '100%',

    initComponent: function () {
        var self = this;
        var winFoto;
        var maximizarimg = new Ext.Button({
            disabled: false,
            id: 'maximizarimg',
            iconCls: 'mostrar',
            tooltip: 'Maximizar imagen'
        });

        this.cambiarimg = new Ext.Button({
            disabled: false,
            id: 'self.cambiarimg',
            iconCls: 'cambiar',
            tooltip: 'Cambiar imagen',
            handler: function () {
                VentanaFoto();
            }
        });

        this.pfoto = new Ext.Panel({
            width: 100,
            height: 100,
            border: true,
            autoShow: true,
            listeners: {
                render: function (p) {
                    //			      self.pfoto.getEl().on('click', function(e,t,o){VentanaFotoMax();});
                }

            }
        });

        this.tfnombre = new Ext.form.TextField({
            id: 'self.tfnombre',
            nextTab: 'self.tfsnombre',
            prevTab: 'btnAceptar',
            maxLength: 50,
            //		    maxLengthText: perfil.etiquetas.lbMaxlengNombre,
            fieldLabel: 'Nombre',//perfil.etiquetas.lbTextFieldNombre,
            name: 'nombre',
            //style : 'text-transform: capitalize',
            allowBlank: false,
            anchor: '90%',
            msgTarget: 'qtip',
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            // regexText : perfil.etiquetas.lbInvalidNombre,
            blankText: 'Este campo es obligatorio.'
        });

        //Primer apellido
        this.tfpapellido = new Ext.form.TextField({
            fieldLabel: 'Primer apellido',//perfil.etiquetas.lbTextFieldPApellido,
            id: 'self.tfpapellido',
            name: 'papel',
            nextTab: 'self.tfsapellido',
            prevTab: 'self.tfsnombre',
            maxLength: 50,
            //		    maxLengthText: perfil.etiquetas.lbMaxlengNombre,
            //style : 'text-transform: capitalize',
            allowBlank: false,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            //		    regexText : perfil.etiquetas.lbInvalidSegNombre,
            msgTarget: 'qtip',
            anchor: '90%',
            blankText: 'Este campo es obligatorio.'
        });

        //Segundo apellido
        this.tfsapellido = new Ext.form.TextField({
            maxLength: 50,
            //		    maxLengthText: perfil.etiquetas.lbMaxlengNombre,
            fieldLabel: 'Segundo apellido',//perfil.etiquetas.lbTextFieldSApellido,
            id: 'self.tfsapellido',
            name: 'sapel',
            nextTab: 'self.cbtiponoidentidad',
            prevTab: 'self.tfpapellido',
            //style : 'text-transform: capitalize',
            allowBlank: false,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            //		    regexText : perfil.etiquetas.lbInvalidSegNombre,
            msgTarget: 'qtip',
            anchor: '90%',
            blankText: 'Este campo es obligatorio.'
        });

        //Segundo nombre
        this.tfsnombre = new Ext.form.TextField({
            maxLength: 50,
            //maxLengthText: perfil.etiquetas.lbMaxlengNombre,
            fieldLabel: 'Segundo nombre',//perfil.etiquetas.lbTextFieldSNombre,
            id: 'self.tfsnombre',
            name: 'snombre',
            nextTab: 'self.tfpapellido',
            prevTab: 'self.tfnombre',
            //style : 'text-transform: capitalize',
            allowBlank: true,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            //		    regexText : perfil.etiquetas.lbInvalidSegNombre,
            msgTarget: 'qtip',
            anchor: '90%',
            blankText: 'Este campo es obligatorio.'
        });

        this.tfnoidentidad = new Ext.form.TextField({
            id: 'self.tfnoidentidad',
            nextTab: 'self.cbsexo',
            prevTab: 'self.cbtiponoidentidad',
            fieldLabel: 'No. de identidad',//perfil.etiquetas.lbTextFieldCarnet,
            allowBlank: false,
            maxLength: 11,
            blankText: 'Este campo es obligatorio.',
            maskRe: /^([a-zA-Z\d]+ ?[a-zA-Z\d]*)+$/,
            anchor: '90%',
            name: 'numid'
        });

        var stsexo = new Ext.data.Store({
            url: '/pvd/repositorio_persona/persona/index.php/registropersonavn/cargarcombosexo',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idsexo"
            }, [{
                name: 'idsexo'
            }, {
                name: 'denom'
            }])
        });
        stsexo.load();

        //combo sexo
        this.cbsexo = new Ext.form.ComboBox({
            id: 'self.cbsexo',
            nextTab: 'self.cbcategoria',
            prevTab: 'self.tfnoidentidad',
            store: stsexo,
            fieldLabel: 'Sexo',//perfil.etiquetas.lbComboSexo,
            displayField: 'denom',
            hiddenName: 'idsexo',
            valueField: 'idsexo',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: false,
            selectOnFocus: true,
            anchor: '90%',
            msgTarget: 'qtip',
            blankText: 'Este campo es obligatorio.',
            listeners: {
                //			    change : function() {cambio = 1; cambioadd = 1;}
            }
        })

        var stcategoria = new Ext.data.Store({
            url: '/pvd/repositorio_persona/persona/index.php/registropersonavn/cargarcombocategoria',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idcategoria"
            }, [{
                name: 'idcategoria'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }])
        });
        stcategoria.load();
        //combo categoria
        this.cbcategoria = new Ext.form.ComboBox({
            id: 'self.cbcategoria',
            nextTab: 'triggerFieldSituacion',
            prevTab: 'self.cbsexo',
            store: stcategoria,
            fieldLabel: 'Categoría',//perfil.etiquetas.lbComboCategoria,
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            hiddenName: 'idcategoria',
            valueField: 'idcategoria',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            editable: true,
            allowBlank: false,
            selectOnFocus: true,
            anchor: '90%',
            msgTarget: 'qtip',
            blankText: 'Este campo es obligatorio.',
            enableKeyEvents: true,
            listeners: {
                //change : function() {cambio = 1; cambioadd = 1;}
            }
        });

        this.sttiponoidentidad = new Ext.data.Store({
            url: '/pvd/repositorio_persona/persona/index.php/registropersonavn/cargarcombotiponoidentidad',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idtipodocidentidad"
            }, [{
                name: 'idtipodocidentidad'
            }, {
                name: 'denom'
            }, {
                name: 'cantmaxima'
            }, {
                name: 'cantminima'
            }, {
                name: 'alfanumerico'
            }]),
            listeners: {
                load: function () {
                    self.cbtiponoidentidad.enable();
                }
            }
        });
        self.sttiponoidentidad.load();
        // combo tipo de identidad
        this.cbtiponoidentidad = new Ext.form.ComboBox({
            id: 'self.cbtiponoidentidad',
            nextTab: 'self.tfnoidentidad',
            prevTab: 'self.tfsapellido',
            store: self.sttiponoidentidad,
            fieldLabel: 'Tipo de identidad',//perfil.etiquetas.lbComboTipoCI,
            displayField: 'denom',
            tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            hiddenName: 'idtipodocidentidad',
            valueField: 'idtipodocidentidad',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: false,
            selectOnFocus: true,
            anchor: '90%',
            msgTarget: 'qtip',
            blankText: 'Este campo es obligatorio.',
            listeners: {
                change: function () {
                    cambio = 1;
                    cambioadd = 1;
                },
                select: function (t, r, i) {
                    self.tfnoidentidad.enable();
                    if (r.data.alfanumerico != 1) {
                        self.tfnoidentidad.regex = new RegExp('(^([0-9])+([0-9]*))$');
                        if (r.data.cantmaxima == r.data.cantminima)
                            self.tfnoidentidad.regexText = 'Solo admite n&uacute;meros enteros de ' + r.data.cantmaxima + ' dígitos.';
                        else
                            self.tfnoidentidad.regexText = 'Solo admite n&uacute;meros enteros de hasta ' + r.data.cantmaxima + ' dígitos.';

                        self.tfnoidentidad.maxLength = r.data.cantmaxima;
                        self.tfnoidentidad.minLength = r.data.cantminima;
                        self.tfnoidentidad.minLengthText = 'El tama&ntilde;o m&iacute;nimo requerido es ' + r.data.cantminima + ' dígitos.';
                        self.tfnoidentidad.maxLengthText = 'El tama&ntilde;o m&aacute;ximo requerido es ' + r.data.cantmaxima + ' dígitos.';
                    }
                    else {
                        self.tfnoidentidad.regex = new RegExp('(^([a-zA-Z0-9])+([a-zA-Z0-9]*))$');
                        self.tfnoidentidad.regexText = 'Solo admite caracteres alfanum&eacute;ricos.';
                        self.tfnoidentidad.maxLength = r.data.cantmaxima;
                        self.tfnoidentidad.minLength = r.data.cantminima;
                        self.tfnoidentidad.minLengthText = 'El tama&ntilde;o m&iacute;nimo requerido es ' + r.data.cantminima + ' caracteres.';
                        self.tfnoidentidad.maxLengthText = 'El tama&ntilde;o m&aacute;ximo requerido es ' + r.data.cantmaxima + ' caracteres.';
                    }

                    self.tfnoidentidad.validate();
                }
            }
        });


        var randon = 0;
        var fpFoto = new Ext.FormPanel({
            fileUpload: true,
            baseCls: 'x-plain',
            id: 'fpFoto',
            labelAlign: 'right',
            labelWidth: 40,
            bodyStyle: 'padding: 10px',
            items: [{
                xtype: 'fileuploadfield',
                width: 200,
                id: 'photo_persona' + self.id,
                emptyText: 'Seleccione...',
                fieldLabel: 'Foto',
                regex: /^.+\.(jpg|png|bmp|JPG|PNG|BMP)$/i,
                regexText: 'Solo imagen de formato jpg ,png o bmp',
                name: 'nombrefoto',
                buttonText: '',
                buttonCfg: {
                    iconCls: 'buscar',
                    tooltip: perfil.etiquetas.lbBtnBuscarImg,
                }
            }],
        });


        winFoto = new Ext.Window({
            // plain : true,
            title: 'Buscar imagen',
            bodyBorder: true,
            autoHeight: true,
            closeAction: 'hide',
            modal: true,
            layout: 'form',
            hideBorders: true,
            width: 320,
            bodyStyle: 'padding: 10px',
            resizable: false,
            collapsible: false,
            items: [fpFoto],
            buttons: [{
                text: 'Cancelar',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbBtnCancelar,
                handler: function () {
                    winFoto.hide();
                }
            }, {
                text: 'Aceptar',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.lbBtnAceptar,
                id: 'aceptar',
                handler: function () {
                    if (Ext.getCmp('photo_persona').getRawValue() == '') {
                        mostrarMensaje(1, perfil.etiquetas.lbSeleccionarImagen);
                    }
                    else {
                        if (fpFoto.getForm().isValid()) {
                            var valor = Ext.getCmp('photo_persona').getValue();
                            extension = valor.substr(valor.lastIndexOf('.'));
                            fpFoto.getForm().submit({
                                url: '/pvd/repositorio_persona/persona/index.php/registropersonavn/guardarfoto',
                                waitMsg: perfil.etiquetas.lbEnviandoImagen,
                                params: {
                                    extension: extension
                                },
                                success: function (fpFoto, o) {
                                    nombrefoto = o.result.nombrefoto;
                                    elPanelfoto = pfoto.body;
                                    var datosf = new Objf(o.result.dirfoto);
                                    plantillaFoto.overwrite(elPanelfoto, datosf);
                                    elPanelfoto.slideIn('l', {
                                        stopFx: true,
                                        duration: .5
                                    });
                                    winFoto.hide();
                                    cambio = 1;
                                }
                            });
                        }
                    }


                }
            }]
        });

        this.items = [{
            layout: 'column',
            border: false,
            items: [{
                columnWidth: 0.14,
                anchor: '100%',
                id: 'padrefoto',
                bodyStyle: 'padding: 0px 0px 0px 15px',
                style: 'margin:0 5 5 5',
                layout: 'form',
                height: 155,
                border: true,
                frame: false,
                items: [{
                    layout: 'form',
                    border: false,
                    frame: true,
                    items: [self.pfoto]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        frame: false,
                        style: 'margin:5 0 0 20',
                        anchor: '50%',
                        items: [maximizarimg]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        style: 'margin:5 0 0 10',
                        frame: false,
                        items: [self.cambiarimg]
                    }]
                }]
            },
                {
                    xtype: 'fieldset',
                    id: 'fieldset',
                    columnWidth: .85,
                    bodyStyle: 'padding: 5px 0px 1px 20px',
                    width: 500,
                    style: '-moz-border-radius:5px',
                    height: 132,
                    layout: 'column',
                    items: [{
                        columnWidth: .25,
                        layout: 'form',
                        border: false,
                        items: [self.tfnombre, self.cbtiponoidentidad]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        border: false,
                        items: [self.tfsnombre, self.tfnoidentidad]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        border: false,
                        items: [self.tfpapellido, {
                            //columnWidth : .25,
                            layout: 'column',
                            items: [{
                                columnWidth: .45,
                                layout: 'form',
                                border: false,
                                items: self.cbsexo
                            }, {
                                columnWidth: .51,
                                layout: 'form',
                                border: false,
                                items: self.cbcategoria
                            }]
                        }]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        border: false,
                        items: [self.tfsapellido/*, triggerFieldSituacion*/]
                    }]
                }]
        }];

        Ext.pvd.persona.buscarpersona.panelAdicionarpersona.superclass.initComponent.call(this);

        function VentanaFoto() {
            fpFoto.getForm().reset();
            winFoto.show();
        }

        //function VentanaFotoMax() {winFotoMax.show();}
    }

});

Ext.pvd.persona.buscarpersona.winAdicionarpersona = Ext.extend(Ext.Window, {
    title: 'Adicionar persona',
    width: '100%',
    height: 250,
    modal: true,
    layout: 'border',

    initComponent: function () {
        var self = this;
        var btnCancelar = new Ext.Button({
            text: 'Cancelar',
            id: 'btnCancelar' + self.id,
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana sin guardar cambios',
            handler: function () {
                self.close();
            }
        });

        var btnAceptar = new Ext.Button({
            text: 'Aceptar',
            id: 'btnAceptar' + self.id,
            iconCls: 'aceptar',
            tooltip: 'Guardar cambios y cerrar ventana',
            handler: function () {
                adicionar('apc');
            }
        });

        var formpanel = new Ext.pvd.persona.buscarpersona.panelAdicionarpersona({
            region: 'center'
        });
        this.items = [formpanel];
        this.buttons = [btnCancelar, btnAceptar];
        Ext.pvd.persona.buscarpersona.winAdicionarpersona.superclass.initComponent.call(this);


        function adicionar(btnpress) {
            if (formpanel.getForm().isValid()) {
                var direccion = '';
                var idpersona = -1;
                var idpersonaid = -1;
                var idfotopersona = -1;
                if (!validarNumeroIdentidad()) {
                    mostrarMensaje(1, perfil.etiquetas.lbRectificarCarne);//perfil.etiquetas.lbRectificarCarne);
                    return;
                }
                PVD.mostrarMascara('idenviaraddmodfijos', 'Guardando datos', 'Por favor espere');
                formpanel.getForm().submit({
                    url: '/pvd/repositorio_persona/persona/index.php/registropersonavn/adicionarpersona',
                    params: {
                        idpersona: idpersona,
                        nombrefoto: nombrefoto,
                        idpersonaidentidad: idpersonaid,
                        idfoto: idfotopersona,
                        idcategoria: formpanel.cbcategoria.getValue(),
                        idsituacionpersona: idsituacionpersona,
                        idsituacionespecificapersona: idsituacionespecificapersona
                    },
                    failure: function (form, action) {
                        PVD.ocultarMascara('idenviaraddmodfijos');
                        if (action.result.codMsg == 3) {
                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        } else {
                            mostrarMensaje(action.result.codMsg, action.result.mensaje, function (btn) {
                                self.fireEvent('personaguardada', action.result.idpers);
                                if (btnpress == 'apc') {
                                    self.close();
                                } else {
                                    formpanel.getForm().reset();
                                }
                            });
                        }
                    }
                });
            }
        }

        function validarNumeroIdentidad() {
            var recordcombo = formpanel.sttiponoidentidad.getById(formpanel.cbtiponoidentidad.getValue());
            var alfanumerico = recordcombo.data.alfanumerico;
            var cantminima = recordcombo.data.cantminima;
            var cantmaxima = recordcombo.data.cantmaxima;
            var cant = formpanel.tfnoidentidad.getValue().length;
            if (cant < cantminima || cant > cantmaxima)    return false;
            if (alfanumerico == 1 || (alfanumerico == 0 && !isNaN(formpanel.tfnoidentidad.getValue()))) return true;
            else return false;
        }
    }

});
