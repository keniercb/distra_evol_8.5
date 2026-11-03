/**
 * @name componentes.CmpEstructuraConcepto - Componente para la configuración de las estructuras por conceptos.
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Orestes Rodríguez Lorenzo
 *         Yaricel Guerra Velázquez
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpCategOcupacional = Ext.extend(Ext.Panel,{
    id: 'pCategOcupacional',
    title: 'Categorías Ocupacionales',
    tabTip: 'Categorías Ocupacionales',
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        //Boton para mostrar la ayuda del sistema.
        this.btnAyudaEstCncpt = new Ext.Button({
            id: 'btnAyudaEstCncpt',
            iconCls: 'ayuda',
            text: this.idioma.btnAyudaEstCncpt_text,
            tooltip: this.idioma.btnAyudaEstCncpt_tooltip
        });
        //Boton para limpiar la asociacion de la estructura al concepto.
        this.btnLimpiarEst = new Ext.Button({
            id: 'btnLimpiarEst',
            iconCls: 'limpiar',
            text: this.idioma.btnLimpiarEst_text,
            tooltip: this.idioma.btnLimpiarEst_tooltip,
            listeners: {
                click: function() {
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/categocupacionales/limpiarCategOcupParaReportes',
                        params: {
                            idmapeocategocup: self.gpCategOcup.getSelectionModel().getSelected().data.idmapeocategocup
                        },
                        success: function(r) {
                            self.stCateg2.reload();
                        }
                    });
                }
            }
        });


        this.sttipocateg = new Ext.data.SimpleStore({
            fields: [
                'idcategoriareporte', 'categreporte'

            ],
            data: [
                [1,'Operario'],
                [2,'Administrativo'],
                [3,'Servicio'],
                [4,'Técnico'],
                [5,'Cuadro']
            ]
        });
        
        this.stcategocupresumenmov = new Ext.data.SimpleStore({
            fields: [
                'idcategoriareporteresumenmov', 'categreporte'

            ],
            data: [
                [1,'Operario'],
                [2,'Administrativo'],
                [3,'Servicio'],
                [4,'Técnico'],
                [5,'Directivo'],
                [6,'Ejecutivo']
            ]
        });


        //Textfield de las denominaciones

        this.txfDenom= new Ext.form.TextField({
            anchor: '95%',
            id:'txfDenom',
            readOnly:false,
            disabled:false,
            validateOnBlur:false,
            name: 'denominacion'
        });


        //Combobox de las categorias ocupacionales
        this.cmbCatOcup = new Ext.form.ComboBox({
         //   fieldLabel: 'Tipo de orden',
            name: 'idcategoriareporte',
            id:'cmbCatOcup',
            emptyText: 'Seleccione...',
            typeAhead: true,
            store: self.sttipocateg,
            triggerAction: 'all',
            valueField: 'idcategoriareporte',
            hiddenName: 'idcategoriareporte',
            editable: false,
            forceSelection: true,
            anchor: '95%',
            displayField: 'categreporte',
            mode: 'local',
            listeners: {
                select: function(combo, r) {
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/categocupacionales/modCategoriasOcup',
                        params: {

                            idmapeocategocup: self.gpCategOcup.getSelectionModel().getSelected().data.idmapeocategocup,
                            idcategoriareporte: r.data.idcategoriareporte,
                            idcategocup: self.gpCategOcup.getSelectionModel().getSelected().data.idcategocup,
                          //  idcategoriareporte: r.data.idcategoriareporte

                        },
                        success: function(r) {
                            var responseData = Ext.decode(r.responseText);
                            self.stCateg2.reload();
                        }
                    });
                }
            }
        });
        
        //Combobox de las categorias ocupacionales para el reporte de resumen de movimiento:
        this.cmbCatOcupResumenMov = new Ext.form.ComboBox({
            name: 'idcategoriareporteresumenmov',
            id:'cmbCatOcupResumenMov',
            emptyText: 'Seleccione...',
            typeAhead: true,
            store: self.stcategocupresumenmov,
            triggerAction: 'all',
            valueField: 'idcategoriareporteresumenmov',
            hiddenName: 'idcategoriareporteresumenmov',
            editable: false,
            forceSelection: true,
            anchor: '95%',
            displayField: 'categreporte',
            mode: 'local',
            listeners: {
                select: function(combo, r) {
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/categocupacionales/modCategoriasOcupResumenMov',
                        params: {
                            idmapeocategocup: self.gpCategOcup.getSelectionModel().getSelected().data.idmapeocategocup,
                            idcategoriareporteresumenmov: r.data.idcategoriareporteresumenmov,
                            idcategocup: self.gpCategOcup.getSelectionModel().getSelected().data.idcategocup
                        },
                        success: function(r) {
                            var responseData = Ext.decode(r.responseText);
                            self.stCateg2.reload();
                        }
                    });
                }
            }
        });


        this.stCateg2 = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/categocupacionales/getCategoriasOcup',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [
                    {name: 'idmapeocategocup'},
                    {name: 'categreporte'},
                    {name: 'denominacion'},
                    {name: 'idcategocup'},
                    {name: 'idcategoriareporte'},
                    {name: 'idcategoriareporteresumenmov'}
                ])
        });

        this.stCateg2.load();
        this.smEstructConcepto = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });


        function comboValue(value, metaData, record)
        {
            var editor = metaData.column.getEditor(record);
            var storeRecord = editor.store.getById(value);
            if(storeRecord)
                return storeRecord.data[editor.displayField];
            else
                return null;
        }


        //Grid editable para el listado de conceptos.
        this.gpCategOcup = new Ext.grid.EditorGridPanel({
            store: this.stCateg2,
            tbar: [this.btnLimpiarEst, '->', this.btnAyudaEstCncpt],
            border: false,
            heigth:400,
            autoScroll: true,
            sm: this.smEstructConcepto,
            region: 'center',
            clicksToEdit:1,
            columns: [
                {dataIndex: 'idmapeocategocup', hidden: true},
                {header: 'Categorías Ocupacionales', width:300, dataIndex: 'denominacion'},
                {header: 'Categorías para el reporte', width:200, dataIndex: 'idcategoriareporte', editor: this.cmbCatOcup,renderer: function (valor) {
                    if (valor == 1) return 'Operario';
                    if (valor == 2) return 'Administrativo';
                    if (valor == 3) return 'Servicio';
                    if (valor == 4) return 'Técnico';
                    if (valor == 5) return 'Cuadro';
                    else return '';
                }},
                {header: 'Categorías para el reporte resumen de movimiento de la FT ', width:200, dataIndex: 'idcategoriareporteresumenmov', editor: this.cmbCatOcupResumenMov,renderer: function (valor) {
                    if (valor == 1) return 'Operario';
                    if (valor == 2) return 'Administrativo';
                    if (valor == 3) return 'Servicio';
                    if (valor == 4) return 'Técnico';
                    if (valor == 5) return 'Directivo';
                    if (valor == 6) return 'Ejecutivo';
                    else return '';
                }}
            ],
            viewConfig: {
                forceFit: true
            }
        });
        this.items = [this.gpCategOcup];
        Pvd.Maestro.Configuraciones.CmpCategOcupacional.superclass.initComponent.call(this);
    }
});