/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */
Ext.ns('Pvd.Nomina.Submayor.GestReintegros');
Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    isValidParent: function (c, target) {
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout     : function (ct, target) {
        var rs = ct.items.items, len = rs.length, r, i;

        if (!this.innerCt) {
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls: 'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if (size.width < 1 && size.height < 1) { // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height: h});

        // some rows can be percentages while others are fixed
        // so we need to make 2 passes

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (!r.rowHeight) {
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (r.rowHeight) {
                r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
            }
        }
    }

    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;

Ext.QuickTips.init();

//Vista del componente Gestionar registro de salarios y tiempo de servicios.
Pvd.Nomina.Submayor.GestReintegros.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar registro de salarios y tiempo de servicios(Tipo: Pvd.Nomina.Submayor.GestReintegros.Modelo).
     */
    init: function (perfil, idioma, modelo) {

        this.idestructura = 0;
        this.idpersona = 0;
        this.idregistrosalario = 0;

        //Componenete para seleccionar la entidad de la cual obtener las personas.
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout       : 'border',
            region       : 'center',
            nivel        : 5,
            nivelchequear: 3
        });

        //Ventana para seleccionar la entidad.
        this.btnAceptarEntidad = new Ext.Button({
            text    : idioma.lbBtnAceptar,
            tooltip : idioma.lbBtnAceptar,
            icon    : perfil.dirImg + 'aceptar.png',
            disabled: true,
            iconCls : 'btn'
        });

        this.winEstructura = new Ext.Window({
            title    : idioma.lbTitleWinEstructura,
            modal    : true,
            height   : 350,
            width    : 300,
            closable : false,
            resizable: false,
            layout   : 'fit',
            items    : [this.pobjestructura],
            buttons  : [this.btnAceptarEntidad]
        });

        //componente persona
        this.gpPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            heigth            : '50%',
            width             : '100%',
            split             : true,
            region            : 'center',
            modulo            : 'NOMINA',
            funcionalidad     : 'RG',
            identidad         : this.idestructura,
            cantidadPorPaginas: 25
        });

        //Ficha de la persona.
        this.pfichadelapersona = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id     : 'pfichadelapersona',
            region : 'north',
            idficha: 'pfichadelapers',
            width  : '100%',
            heigth : 250,
            border : true,
            split  : true,
            idCmp  : 'pfichadelapersona'
        });
        // boton ayuda
        this.btnAyuda = new Ext.Button({
            id     : 'btnAyuda',
            text   : 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            iconCls: 'ayuda',
            handler: function () {
                var title = 'Ayuda de la gesti&oacute;n reintegros';
                var referencia = '';
                help.show(title, referencia);
            }
        });

        /*function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }*/

        function operacion(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('operacion') == 1) {
                return '<center><span style="color:#008000;">' + 'Acumulaci&oacute;n' + '</span></center>';
            } else {
                return '<center><span style="color:red;">' + 'Liquidaci&oacute;n' + '</span></center>';
            }
        }

        function centrarValor (val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('operacion') == 1) {
                return '<center><span style="color:#008000;">' + val + '</span></center>';
            } else {
                return '<center><span style="color:red;">' + val + '</span></center>';
            }
        }


        this.smReintegros = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        //grid de gestion de reintegros
        this.gpReintegros = new Ext.grid.GridPanel({
            id              : 'gpReintegros',
            title           : 'Listado de acumulaci&oacute;n/liquidaci&oacute;n',
            autoExpandColumn: 'idFecha',
            region          : 'center',
            columns         : [
                {
                    header   : 'Fecha',
                    id       : 'idFecha',
                    fixed    : false,
                    width    : 50,
                    sortable : true,
                    dataIndex: 'fecha',
                    renderer : centrarValor
                },
                {
                    header   : 'Operacion',
                    fixed    : false,
                    width    : 100,
                    sortable : true,
                    dataIndex: 'operacion',
                    renderer : operacion
                },
                {
                    header   : 'Tipo nomina',
                    fixed    : false,
                    sortable : true,
                    width    : 250,
                    dataIndex: 'tiponomina',
                    renderer : centrarValor
                },
                {
                    header   : 'Tipo moneda',
                    fixed    : false,
                    sortable : true,
                    dataIndex: 'moneda',
                    renderer : centrarValor
                },
                {
                    header   : 'Importe',
                    fixed    : false,
                    width    : 100,
                    sortable : true,
                    dataIndex: 'importe',
                    renderer : centrarValor
                },
                {
                    header   : 'idpersona',
                    fixed    : false,
                    sortable : true,
                    hidden   : true,
                    dataIndex: 'idpersona',
                    renderer : centrarValor
                },
                {
                    header   : 'idestructura',
                    fixed    : false,
                    sortable : true,
                    hidden   : true,
                    dataIndex: 'idestructura',
                    renderer : centrarValor
                },
                {
                    header   : 'idreintegropersona',
                    fixed    : false,
                    sortable : true,
                    hidden   : true,
                    dataIndex: 'idreintegropersona',
                    renderer : centrarValor
                },
                {
                    header   : 'idfechacierre',
                    fixed    : false,
                    sortable : true,
                    hidden   : true,
                    dataIndex: 'idfechacierre',
                    renderer : centrarValor
                }
            ],
            stripeRows      : true,
            autoScroll      : true,
            border          : false,
            width           : '20%',
            heigth          : '70%',
            store           : modelo.storeReintegros,
            sm              : this.smReintegros,
            loadMask        : {msg: idioma.lbMaskGridCargando},
            bbar            : new Ext.PagingToolbar({
                pageSize   : 20,
                store      : modelo.storeReintegros,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            })
        });
        //Ventana para gestionar las retenciones de las personas por entidades.
        this.winReintegros = new Ext.Window({
            title      : 'Gestionar reintegros',
            modal      : true,
            height     : '100%',
            width      : '100%',
            closeAction: 'hide',
            maximized  : true,
            closable   : true,
            resizable  : false,
            layout     : 'border',
            items      : [this.gpPersonas, {
                region: 'east',
                height: '100%',
                width : '60%',
                layout: 'ux.row',
                items : [
                    {
                        rowHeight: .3,
                        width    : '100%',
                        border   : false,
                        layout   : 'fit',
                        items    : [this.pfichadelapersona]
                    },
                    {
                        rowHeight: .7,
                        width    : '100%',
                        border   : false,
                        layout   : 'fit',
                        items    : [this.gpReintegros]
                    }
                ]
            }]
        });


    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestreintegros', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Submayor.GestReintegros.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Submayor.GestReintegros.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Submayor.GestReintegros.Controlador.init(idioma, vista, modelo);
});
