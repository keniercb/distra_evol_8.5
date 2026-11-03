alert(puntossss);
Ext.ns('Ext.Log.Gestproducto');

Ext.QuickTips.init();

Ext.Log.Gestproducto.ventana = Ext.extend(Ext.Window, {
    idioma: '',
    baseDirController: '/logistica/utiles/producto/index.php/gestproducto/',
    constructor: function (config) {

        var _this = this;
        Ext.Ajax.request({
            url: _this.baseDirController + 'cargaretiquetas',
            callback: function (options, success, response) {
                if (success) {
                    _this.idioma = Ext.decode(response.responseText);
                    _this._initComponent();
                    _this.show();
                    _this.maximize();
                }
            }
        });
        Ext.Log.Gestproducto.ventana.superclass.constructor.call(this, config);
    },

    _initComponent: function () {
        var _this = this;

        this.stDatProductos = new Ext.data.Store({
            url: '',    //'cargarproductos',
            listeners: {
                beforeload: function (st, objeto) {
                    //busqueda simple
                    st.baseParams.codigo = (Ext.getCmp('cod').getValue()) ? Ext.getCmp('cod').getValue() : null;
                    st.baseParams.nropieza = (Ext.getCmp('pieza').getValue()) ? Ext.getCmp('pieza').getValue() : null;
                    st.baseParams.descripcion = (Ext.getCmp('descri').getValue()) ? Ext.getCmp('descri').getValue() : null;
                    /*st.baseParams.idespecialidad = (Ext.getCmp('idtipocompo').getValue()) ? Ext.getCmp('idtipocompo').getValue() : null;

                     if (reserva) {
                     stDatProductos.baseParams.reserva = reserva;
                     }
                     if (recepcionreserva) {
                     stDatProductos.baseParams.recepcionreserva = recepcionreserva;
                     }
                     if (idarea)
                     st.baseParams.idarea = idarea;
                     else
                     st.baseParams.idarea = (Ext.getCmp('idcbarea').getValue()) ? Ext.getCmp('idcbarea').getValue() : null;

                     st.baseParams.idestructuraop = (idestructuraop) ? idestructuraop : null;
                     st.baseParams.idoperacion = (idoperacion) ? idoperacion : null;
                     //busqueda avanzada datos producto
                     st.baseParams.codigoav = (Ext.getCmp('idcodigo').getValue()) ? Ext.getCmp('idcodigo').getValue() : null;
                     codigoauxiliar = (codigoauxiliar) ? codigoauxiliar : (Ext.getCmp('idcodigoauxiliar1').getValue()) ? Ext.getCmp('idcodigoauxiliar1').getValue() : null;
                     st.baseParams.codigoauxiliar = codigoauxiliar;
                     st.baseParams.alternativos = alternativos;
                     st.baseParams.idproducto = idproducto;
                     st.baseParams.idcategproducto = (Ext.getCmp('idcategproducto').getValue()) ? Ext.getCmp('idcategproducto').getValue() : null;
                     st.baseParams.existencia = (Ext.getCmp('existencia').getValue()) ? Ext.getCmp('existencia').getValue() : null;
                     st.baseParams.nropiezaav = (Ext.getCmp('idnropieza').getValue()) ? Ext.getCmp('idnropieza').getValue() : null;
                     st.baseParams.idtipoprod = (Ext.getCmp('idtproducto').getValue()) ? Ext.getCmp('idtproducto').getValue() : null;
                     st.baseParams.descripcionav = (Ext.getCmp('iddescr').getValue()) ? Ext.getCmp('iddescr').getValue() : null;
                     st.baseParams.idformafarmaceutica = (Ext.getCmp('idAvformafarmaceutica').getValue()) ? Ext.getCmp('idAvformafarmaceutica').getValue() : null;
                     st.baseParams.idgrupofarmacologico = (Ext.getCmp('idAvGrupoFarmacologico').getValue()) ? Ext.getCmp('idAvGrupoFarmacologico').getValue() : null;
                     st.baseParams.idlineaproducto = (Ext.getCmp('idAvlineaproducto').getValue()) ? Ext.getCmp('idAvlineaproducto').getValue() : null;
                     st.baseParams.iddocumento = iddocumento;*/

                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cantfilas",
                root: "datos",
                id: "idproducto"
            }, [
                {name: 'idproducto'},
                {name: 'nro'},
                {name: 'categoria'},
                {name: 'codigoprod'},
                {name: 'nropieza'},
                {name: 'descripcion'},
                {name: 'um'},
                {name: 'idumedida'},
                {name: 'existencia'},
                {name: 'cantidaddisponible'},
                {name: 'idestructuraop'},
                {name: 'tienelote'},
                {name: 'idprod'},
                {name: 'precio'}
            ])
        });

        this.smDatProductos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            moveEditorOnEnter: false,
            listeners: {

            }
        });

        this.cmDatProductos = new Ext.grid.ColumnModel([
            _this.smDatProductos, new Ext.LOG.PagingRowNumberer({ nwidth: 30}), {header: _this.idioma.hdCodigo, width: 70, dataIndex: 'codigoprod'}, {header: _this.idioma.hdNopieza, width: 70, dataIndex: 'nropieza'}, {id: 'expandir', header: _this.idioma.hdDescripcion, width: 120, dataIndex: 'descripcion'}, {header: _this.idioma.hdUM, width: 50, dataIndex: 'um'}, {header: _this.idioma.hdExistencia, width: 70, dataIndex: 'existencia'}, {header: _this.idioma.hdDisponibilidad, hidden: false, width: 80, dataIndex: 'cantidaddisponible'}, {header: _this.idioma.hdTienelote, width: 65, dataIndex: 'tienelote', align: 'center'/*, renderer: mostrarImagen*/}, {hidden: true, hideable: false, dataIndex: 'idproducto'}, {hidden: true, hideable: false, dataIndex: 'precio'}
        ]);

        // Defino el grid de Dat de Productos
        this.gpDatProductos = new Ext.grid.GridPanel({
            frame: true,
            iconCls: 'icon-grid',
            region: 'center',
            height: 240,
            autoExpandColumn: 'expandir',
            store: _this.stDatProductos,
            loadMask: false,
            sm: _this.smDatProductos,
            cm: _this.cmDatProductos,
            listeners: {
                'render': function () {
                    Ext.getCmp('cod').focus(true);
                }
            },
            tbar: [
                new Ext.Toolbar.TextItem(_this.idioma.tiCodigo), cod = new Ext.form.TextField({
                    autoCreate: true, id: 'cod', enableKeyEvents: true, width: 90,
                    maskRe: _this.idioma.maskRe,
                    regex: _this.idioma.regex,
                    regexText: _this.idioma.regexText
                }), '', new Ext.Toolbar.TextItem(_this.idioma.tiNopieza), pieza = new Ext.form.TextField({
                    autoCreate: true, id: 'pieza', enableKeyEvents: true, width: 90,
                    maskRe: _this.idioma.maskRe,
                    regex: _this.idioma.regex,
                    regexText: _this.idioma.regexText
                }), '', new Ext.Toolbar.TextItem(_this.idioma.tiDescripcion), desc = new Ext.form.TextField({
                    autoCreate: true, id: 'descri', enableKeyEvents: true, width: 90,
                    maskRe: _this.idioma.maskRe,
                    regex: _this.idioma.regex,
                    regexText: _this.idioma.regexText
                }), '', '', new Ext.Button({id: 'btnAvanz', iconCls: 'buscaravanzada', tooltip: _this.idioma.btnBuscaravanzada, handler: function () {
                    winFpProductos('Avanz')
                }}), new Ext.Button({id: 'btnReiniciarBusqueda', iconCls: 'limpiar', tooltip: _this.idioma.btnLimpiarbuscar,
                    handler: function () {
                        fpAvanzProductos.getForm().reset();
                        Ext.getCmp('descri').setValue('');
                        Ext.getCmp('pieza').setValue('');
                        Ext.getCmp('cod').setValue('');
                        _this.stDatProductos.removeAll();
                        _this.buscarproductos();
                    }
                }), new Ext.Button({id: 'idbtnClean', hidden: true, iconCls: 'limpiar', tooltip: _this.idioma.btnDeseleccionar, handler: function () {
                }})
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 50,
                store: _this.stDatProductos,
                displayInfo: true,
                displayMsg: _this.idioma.displayMsg,
                emptyMsg: _this.idioma.emptyMsg
            })
        });

        this.panel = new Ext.Panel({
            layout: 'fit',
            frame: false,
            items: [_this.gpDatProductos]
        });

        Ext.applyIf(this, {
            title: _this.idioma.TitlePanel,
            frame: true,
            layout: 'fit',
            items: [_this.panel]
        });

        Ext.Log.Gestproducto.ventana.superclass.initComponent.call(this, arguments);

    },

    buscarproductos: function () {
        _this.stDatProductos.load({params: {start: 0, limit: 50}});
    }

});	