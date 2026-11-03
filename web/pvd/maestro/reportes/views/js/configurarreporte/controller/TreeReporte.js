Ext.ns('Maestro.ConfigurarReporte.controller');

Maestro.ConfigurarReporte.controller.TreeReporte = Ext.extend(Maestro.ConfigurarReporte.base.Controller, {
    isWinStateInsert: true,
    init: function () {
        this.registerEvents({
            'treereporte': {
                render: this.onRenderList
            },
            'listmodule selModel': {
                selectionchange: this.onSelectionChangeModule
            },
            'treereporte selModel': {
                selectionchange: this.onSelectionChange
            },
            'tbarreporte btnInsert': {
                click: this.showWinInsert
            },
            'tbarreporte btnUpdate': {
                click: this.showWinUpdate
            },
            'tbarreporte btnDelete': {
                click: this.showWinDelete
            },
            'tbarreporte btnActivar': {
                click: this.showWinActivar
            },
            'tbarreporte btnDesActivar': {
                click: this.showWinDesActivar
            },
            'tbarreporte btnCrudFilter': {
                click: this.showWinCrudFilter
            },
            'editreporte checkbAgrupador': {
                check: this.onCheckFieldAgrupador,
            },
            'editreporte cbContentType': {
                select: this.onSelectContentType,
            },
            'editreporte btnAccept': {
                click: this.onClickBtnAccept
            },
            'editreporte btnCancel': {
                click: this.hideWinEdit
            }
        }, this);

    },
    onRenderList: function (list) {
        var me = this,
                tbarreporte = me.getView('tbarreporte'),
                store = me.getStore('reporte');
        tbarreporte.setEnableBtn(false, false, false, false, false, false);

        store.on('load', function (loader, node) {
            node.expand();
        });
    },
    onSelectionChangeModule: function (sm) {
        var me = this,
                store = me.getStore('reporte'),
                tree = me.getView('treereporte'),
                rootNode = tree.getRootNode(),
                idmodule, isLoadDistinctIdModule;

        tree.getSelectionModel().clearSelections();

        if (sm.getCount() == 1) {
            idmodule = sm.getSelected().get('idmodulo'),
                    isLoadDistinctIdModule = idmodule != store.baseParams.idmodulo;

            if (isLoadDistinctIdModule) {
                store.baseParams.idmodulo = idmodule;
                store.load(rootNode);
            }
        } else {
            if (store.isLoading()) {
                store.abort();
                tree.loadMask.hide();
            }

            store.baseParams.idmodulo = 0;
            while (rootNode.firstChild) {
                rootNode.removeChild(rootNode.firstChild);
            }
        }
    },
    onSelectionChange: function (sm, node) {
        var me = this,
                tbarreporte = me.getView('tbarreporte'),
                store = me.getStore('reporte'),
                isRootNode, isAgrupador;

        if (node && store.baseParams.idmodulo) {
            isRootNode = node.id == 'root';
            isAgrupador = node.attributes.agrupador == 1;
            isActivo = node.attributes.activo == 1;

            me.updateTbarReporte(isRootNode, isAgrupador, isActivo);
            me.updatePanelReporteDetails((isRootNode || isAgrupador) ? null : node.attributes);
        } else {
            tbarreporte.setEnableBtn(false, false, false, true, false, false);
            me.updatePanelReporteDetails();
        }
    },
    updateTbarReporte: function (isRootNode, isAgrupador, isActivo) {
        var me = this,
                tbarreporte = me.getView('tbarreporte');
        var activar = !isActivo, desactivar = isActivo;

        if (isRootNode)
            tbarreporte.setEnableBtn(true, false, false, false, false, false);
        else if (isAgrupador)
            tbarreporte.setEnableBtn(true, true, true, false, activar, desactivar);
        else
            tbarreporte.setEnableBtn(false, true, true, true, activar, desactivar);
    },
    updatePanelReporteDetails: function (data) {
        var me = this,
                paneldetails = me.getView('panelreportedetails'),
                el = paneldetails.body;
        if (data)
            paneldetails.detailsTpl.overwrite(el, data);
        else
            el.update(Maestro.ConfigurarReporte.idiom.lbEmptyReporteDetails);
    },
    showWinInsert: function () {
        this.isWinStateInsert = true;
        this.initActionWinEdit();
    },
    showWinUpdate: function () {
        var selectedNode = this.getView('treereporte').getSelectionModel().getSelectedNode();

        if (selectedNode) {
            this.isWinStateInsert = false;
            this.initActionWinEdit(new Ext.data.Record(selectedNode.attributes));
        }
    },
    showWinDelete: function () {
        var me = this,
                tree = me.getView('treereporte'),
                nodeSelected = tree.getSelectionModel().getSelectedNode(),
                store = me.getStore('reporte');

        if (nodeSelected) {
            this.getResource('reporte').deleteSelection({
                records: nodeSelected,
                fn: function () {
                    store.load(tree.getRootNode());
                    tree.getSelectionModel().clearSelections();
                },
                scope: this
            });
        }
    },
    showWinActivar: function () {
        console.log('Activar');
        var me = this,
                tree = me.getView('treereporte'),
                nodeSelected = tree.getSelectionModel().getSelectedNode(),
                store = me.getStore('reporte');

        if (nodeSelected) {
            this.getResource('reporte').activeSelection({
                records: nodeSelected,
                fn: function () {
                    store.load(tree.getRootNode());
                    tree.getSelectionModel().clearSelections();
                },
                scope: this
            });
        }
    },
    showWinDesActivar: function () {
        console.log('Desactivar');
        var me = this,
                tree = me.getView('treereporte'),
                nodeSelected = tree.getSelectionModel().getSelectedNode(),
                store = me.getStore('reporte');

        if (nodeSelected) {
            this.getResource('reporte').deactiveSelection({
                records: nodeSelected,
                fn: function () {
                    store.load(tree.getRootNode());
                    tree.getSelectionModel().clearSelections();
                },
                scope: this
            });
        }
    },
    showWinCrudFilter: function () {
        var nodeSelected = this.getView('treereporte').getSelectionModel().getSelectedNode();
        this.getView('crudfilter').show(nodeSelected.attributes.idreporte);
    },
    initActionWinEdit: function (record) {
        var winedit = this.getView('editreporte'),
                formEdit = winedit.form.getForm();

        winedit.setTitle(Maestro.ConfigurarReporte.idiom[(this.isWinStateInsert) ? 'titleWinInsertReporte' : 'titleWinUpdateReporte']);
        formEdit.reset();
        winedit.tfDenominacion.focus(false, 500);
        winedit.show();

        if (!this.isWinStateInsert) {
            this.formatViewContentType(record.get('tipocontenido'));
            formEdit.loadRecord(record);
        } else
            this.formatViewContentType(0);
    },
    onClickBtnAccept: function () {
        var me = this,
                winedit = me.getView('editreporte'),
                formEdit = winedit.form.getForm(),
                tree = me.getView('treereporte'),
                store = me.getStore('reporte'),
                nodeSelected = tree.getSelectionModel().getSelectedNode();

        me.getResource('reporte')[(me.isWinStateInsert) ? 'insertReporte' : 'updateReporte']({
            params: Ext.applyIf(formEdit.getValues(),
                    {
                        idmodulo: store.baseParams.idmodulo,
                        idpadre: (nodeSelected.id == 'root') ? null : nodeSelected.attributes[(me.isWinStateInsert) ? 'idreporte' : 'idpadre'],
                        general: 0,
                        agrupador: 0
                    }),
            success: function () {
                winedit.hide();
                store.load(tree.getRootNode());
                tree.getSelectionModel().clearSelections();
            },
            scope: me
        });
    },
    onCheckFieldAgrupador: function (comp, checked) {
        var winedit = this.getView('editreporte');

        if (checked) {
            winedit.tfIdentificador.reset();
            winedit.tfIdentificador.disable();

            winedit.checkbGeneral.reset();
            winedit.checkbGeneral.disable();

            winedit.cbContentType.reset();
            winedit.cbContentType.disable();
            this.formatViewContentType(0);
        } else {
            winedit.tfIdentificador.enable();
            winedit.checkbGeneral.enable();
            winedit.cbContentType.enable();
        }
    },
    onSelectContentType: function (field, record) {
        this.formatViewContentType(record.get('tipocontenido'));
    },
    formatViewContentType: function (type) {
        var compContentType = ['tfUrl', 'tfRecurso', 'tfComponentName'],
                winreporte = this.getView('editreporte'),
                comp;

        for (var i = 0; i < 3; i++) {
            comp = winreporte[compContentType[i]];

            if (type - 1 == i) {
                if (i == 0) {
                    winreporte['checkbFormatoExcel'].show();
                } else {
                    winreporte['checkbFormatoExcel'].hide();
                }
                comp.enable();
                comp.findParentByType('panel').show();
            } else {
                comp.findParentByType('panel').hide();
                comp.reset();
                comp.disable();
            }
        }
        winreporte.center();
    },
    hideWinEdit: function () {
        this.getView('editreporte').hide();
    },
});