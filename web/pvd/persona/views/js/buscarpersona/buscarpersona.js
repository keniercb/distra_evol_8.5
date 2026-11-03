/**
 * Componente Ligero de buscar y listar personas
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('Ext.pvd.persona.buscarpersona');

Ext.pvd.persona.buscarpersona.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de Personas',
    /**
     * Título del ColumnModel
     */
    lbNoIdentidad: 'No Identidad',
    lbNombreApellidos: 'Nombre  y apellidos',
    lbNombre: 'Nombre',
    lbSnombre: 'Segundo nombre',
    lbPapellido: 'Primer apellido',
    lbSapellido: 'Segundo apellido',
    lbSexo: 'Sexo',
    lbCategoria: 'Categor&iacute;a',
    /**
     * Títulos de los componentes del formulario
     */
    fpAdvancedSearch: 'B&uacute;squeda avanzada',
    tfMore: 'M&aacute;s',
    cbxFonetica: 'Suena como',
    cbxMaysMinus: 'Coincidir may&uacute;sculas y min&uacute;sculas',
    cbxPcompletas: 'S&oacute;lo palabras completas',
    cbCondiciones: 'Condiciones',
    /**
     * Títulos de las botones
     */
    lbBA: 'M&aacute;s',
    lbSearch: 'Buscar',
    lbCleanSearch: 'Limpiar',
    /**
     * Tooltip de los botones.
     */
    ttBtnBA: 'B&uacute;squeda avanzada',
    ttBtnCBA: 'Cerrar b&uacute;squeda avanzada',
    ttBtnSearch: 'Buscar persona',
    ttBtnCleanSearch: 'Limpiar filtro(s)'
   
};

Ext.pvd.persona.buscarpersona.panelBuscarpersona = Ext.extend(Ext.Panel, {
    layout: 'border',
    hasSearch: false,

    initComponent: function () {
        this.lang = Ext.pvd.persona.buscarpersona.Lang;
        this.initGrid();
        this.items = [this.gpPersonas];

        Ext.pvd.persona.buscarpersona.panelBuscarpersona.superclass.initComponent.call(this);
    },
    initGrid: function () {
        /**
         * Store del grid de Personas
         * @type {Store}
         */
        this.stPersonas = new Ext.data.GroupingStore({
            url: '/pvd/persona/index.php/buscarpersona/getPersons',
            baseParams: {
                identidad: Ext.encode(this.identidad),
                sincargo: this.sincargo
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idpersona'
            }, [
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'sexo'},
                {name: 'denomcategoria'},
                {name: 'foto'},{name: 'denomcargo'},
                {
                    name: 'nombreyapellidos', convert: function (v, re) {
                    var nya = Ext.isEmpty(re.snombre)
                        ? re.nombre + ' ' + re.papel
                        : re.nombre + ' ' + re.snombre + ' ' + re.papel;
                    return Ext.isEmpty(re.sapel)
                        ? nya
                        : nya + ' ' + re.sapel;
                }
                },
            ]),
            groupField: 'nombreyapellidos',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            listeners: {
                load: function (st) {
                    st.clearGrouping();
                }
            }
        });


        /**
         * Column Model del grid de Personas
         * @type {Array}
         */
        this.cmPersonas = [
            {
                header: this.lang.lbNoIdentidad,
                width: 50,
                dataIndex: 'numid'
            },
            {
                header: this.lang.lbNombreApellidos,
                width: 250,
                dataIndex: 'nombreyapellidos'
            },
            {
                header: this.lang.lbSexo,
                width: 20,
                dataIndex: 'sexo',
                renderer: function (val) {
                    if (val === 'Femenino' || val === '0') {
                        return '<center><img ext:qtip="<b>Femenina</b> "src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHgSURBVDjLjZLNbtNAFIXrJ8mL+QVQoVUWICFEFZCAbrJCAdpFWCC1i1QgVLEoZYFAgrY0rhPHTmwnThP/BKetU9vxT7I5zHWEhEBuWBxpFnO+c+6dWQGw8qfUisQNdnR+tD+ojQ9txz2wHPvdea1f7fDtssj9ff8fs7VnlCbCJRIzwsxNMfuZIuoGuPriwtjqlOSndS4XQMlkJuPcm2F+yXSxUGrHcD9YUDcbfC6AalMyGaNuiIvDEdx9C0FjwqAJfMGD/qRZywXQvFk6SxwfOOhvdwpGRSnYb/pslASxMYX6UHRuaDB0aGYCuO9N9J4rhW65VTC39AWgN0XnnpAPMHeN2lT1F3XrHqzXBsxXOq4+u0idGN7XMeTiaf4IvRcKP/5oIxlEWSKJjCTayeClhubaUf4SlWcCp5el0ujtEGHrOtt8asUIxQmGzCzdOS6JxW/5z5hBHguc9qjJdzekfqQGSM4jdFaFsHX7hG+sf7/5I5HaG2dV7UFD0+6K2lTxs8W1b536yuoPTVo72lwKUO+Lc6pP5nQYZ/uIeyGCMw+shbYUoBTrGYBE9UmhdI1A9CD/D0BaP6nKrC6rrZGRRGc5G+H401LAb5HBZ7WpOp3z7uUC2HtXqDKJJe/k3fsF8TkmWq5zP6gAAAAASUVORK5CYII=" /></center>';
                    } else {
                        return '<center><img ext:qtip="<b>Maculino</b>" src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIHSURBVDjLpVNNaxNRFH0fgzNxRlNIm6QVsSRQ1IUiVCSCS8FF4kokO/9BF7oUstBll4IuunBpl61RNy4suhgF21WhJVU0WiHUksmQr2bex/TeMJEoxog+uMzjzT3nnXPmDg3DkPzPMsY1PHrpdaWUZFBCDJ6C3L91NjaWAAH5SwkLhaJaTfBJyOOnmwf4no0lkIJUqg2hAKUAqKMKQMFfEdy5PhN7X/Ge1L22QqACCUFPhCIIvv6UwdJaiyopi1KqAnjMRZ5dUDBzbta5fDxuc99vafuYw9SQgj7B0qsmBeDdTJKXUhMWi5mcaRKSVrt30uCcHrFMtrv7Xb5wq8+uzp/Ip1MJLoYJ4KZiZsoozU5bBqWM9r8slO0c5bjvdrr6uVt9B6CF1dcfrgm5JVHhDwJIuoA3QyS0tteUGzueEtBwIRvnyXTC6HR76PnLw9tX0HdsOCMWJZ0zLZANt63v1NV+ozO377Xn3M2a0hCabdsMPOdGDhL60dFASthjQHgmOOufK/Az8PzrYhGB22wdaGw+n5ngjkkrjsUqF88kOZ75dV9jz2gFgSh/+ubfOJ012VR60sinJg0UhGApgnDrYw0IZHkkAUheXt/ey/aCoHRqOs4cx+7n4TcaehvAbzY+34PUl39HQAd/48KDtxT8FyH9ghQyhyOMgwRVRvDK4s3wjwT/ug4BPyZOkZTlSM0AAAAASUVORK5CYII=" /></center>';
                    }
                }
            },
            {
                header: this.lang.lbCategoria,
                width: 50,
                hidden:true,
                dataIndex: 'denomcategoria'
            }
        ];

        /**
         * View del grid de Personas
         * @type {GroupingView}
         */
        this.viewPersonas = new Ext.grid.GroupingView({
            groupTextTpl: '{text}',
            forceFit: true
        });

        this.smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: this.singleSelect === false ? false : true,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.getCount() > 0) {
                        this.fireEvent('personaselecionada', sm.getSelections());
                    } else {
                        this.fireEvent('personadeselecionada');
                    }
                }.createDelegate(this)
            }
        });

        if (this.singleSelect === false) {
            this.cmPersonas.unshift(this.smPersonas);
        }

        this.cmPersonas.unshift(new Ext.grid.RowNumberer());

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            enableKeyEvents: true,
            name: 'tfbuscar',
            listeners: {
                specialkey: function(field, e){
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        this.searchFieldHandler();
                    }
                }.createDelegate(this)
            }
        });

        this.btnLimpiarBusqueda = new Ext.Button({
            id: 'btnLimpiarBusqueda',
            tooltip: 'Limpiar',
            iconCls: 'limpiar',
            listeners: {
                'click': () => {
                    this.cleanSearch();
                    //this.generateConditions();
                }
            }
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            tooltip: 'Buscar persona',
            iconCls: 'buscar',
            listeners: {
                'click': () => {
                    this.searchFieldHandler()
                }
            }
        });

        // this.searchField = new Ext.app.SearchField({
        //     store: this.stPersonas,
        //     width: 180,
        //     toolTipTrigger1: 'Limpiar filtro <b>(Alt+L)</b>',
        //     toolTipTrigger2: 'Buscar persona <b>(Alt+B)</b>',
        //   //  validationEvent: 'keyup',
        //     validator: function (v) {
        //         if (!Ext.isEmpty(v)) {
        //             this.onTrigger2Click();
        //         } else {
        //             this.onTrigger1Click();
        //         }
        //         return true;
        //     },
        //     onTrigger1Click: function () {
        //         if (this.hasSearch === true) {
        //             this.cleanSearch.call(this);
        //             this.generateConditions.call(this);
        //         }
        //     }.createDelegate(this),
        //     onTrigger2Click: this.searchFieldHandler.createDelegate(this),
        //     setVisibleBtnClear: function (bool) {
        //         if (bool === true)
        //             this.triggers[0].show();
        //         else if (bool === false)
        //             this.triggers[0].hide();
        //     }
        // });

        /**
         * Grid de listar Personas
         * @type {Ext.grid.GridPanel}
         */
        this.gpPersonas = new Ext.grid.GridPanel({
            region: 'center',
            margins: '5 5 5 5',
            //title: this.lang.gpTitle,
            sm: this.smPersonas,
            columns: this.cmPersonas,
            store: this.stPersonas,
            loadMask:{store: this.stPersonas},
            stripeRows: true,
            view: this.viewPersonas,
            bbar: new Ext.PagingToolbar({
                store: this.stPersonas,
                displayInfo: true,
                pageSize: this.pageSize || 25
            }),
        tbar: [/*this.searchField*/ this.tfbuscar, this.btnBuscar, this.btnLimpiarBusqueda],
            listeners: {
                render: function (gp) {
                    gp.getStore().load({
                        params: {
                            start: 0,
                            limit: this.pageSize || 25
                        }						
                    });
                }.createDelegate(this)
            }
        });

       this.hotKeys = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'lb',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 76:{ //l para limpiar
                        this.cleanSearch()
                        break;
                    }
                    case 66:{ //b para buscar
                        this.searchFieldHandler();
                        break;
                    }
                }
            }.createDelegate(this)
        },{
            key: 13,//Enter para buscar
            fn: function(){
                this.searchFieldHandler();
            }.createDelegate(this)
        }]);

    },

    cleanSearch: function () {
        // this.searchField.reset();
        this.tfbuscar.reset();
		//this.stPersonas.baseParams.condiciones = '';
        this.stPersonas.load({params: {start: 0, limit: 25, identidad: this.identidad}});
    },
    searchFieldHandler: function () {
        // if(!Ext.isEmpty(this.searchField.getValue()))
        //     this.runSearch(this.searchField.getValue());
        if(!Ext.isEmpty(this.tfbuscar.getValue()))
            this.runSearch(this.tfbuscar.getValue());
    },
    generateConditions: function (values) {
        this.runSearch(values);
    },
    runSearch: function (condiciones) {       
        if (!Ext.isEmpty(condiciones)) {
            this.hasSearch = true;
            // this.searchField.setVisibleBtnClear(this.hasSearch);
        } else {
            this.hasSearch = false;
            // this.searchField.setVisibleBtnClear(this.hasSearch);
        }
        //this.stPersonas.baseParams.condiciones = condiciones;
        this.stPersonas.load({params: {start: 0, limit: 25, identidad: this.identidad, condiciones:condiciones}});
    },
    getSeleccion: function () {
        return this.gpPersonas.getSelectionModel().getCount() > 1
            ? this.gpPersonas.getSelectionModel().getSelections()
            : this.gpPersonas.getSelectionModel().getSelected();
    },
    limpiarSelection: function () {
        this.gpPersonas.getSelectionModel().clearSelections();
    }
});
