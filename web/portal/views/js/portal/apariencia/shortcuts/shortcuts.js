/* @ Ultima modificación: 28/Noviembre/2014 por Juan Luis R.guez H.dez*/

function $(id) {
    return document.getElementById(id);
}

function ExtractNumber(value) {
    var n = parseInt(value);

    return n == null || isNaN(n) ? 0 : n;
}

Ext.ns('Ext.apariencia.shortcuts');

Ext.apariencia.shortcuts._dragAttibutes = {
    _startX: 0,
    _startY: 0,
    _offsetX: 0,
    _offsetY: 0,
    _oldZIndex: 0,
    _dragElement: null,
    init: function() {
        this._startX = 0;
        this._startY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._oldZIndex = 0;
        this._dragElement = null;
    },
    mouseDown: function(e) {
        if (e == null)
            e = window.event;
        var target = e.target != null ? e.target : e.srcElement;
        if ((e.button == 1 && window.event != null || e.button == 0) /*
         * &&
         * target.className ==
         * 'drag'
         */) {
            // grab the mouse position
            Ext.apariencia.shortcuts._dragAttibutes.init();

            Ext.apariencia.shortcuts._dragAttibutes._startX = e.clientX;
            Ext.apariencia.shortcuts._dragAttibutes._startY = e.clientY;

            // grab the clicked element's position
            Ext.apariencia.shortcuts._dragAttibutes._offsetX = ExtractNumber(target.style.left);
            Ext.apariencia.shortcuts._dragAttibutes._offsetY = ExtractNumber(target.style.top);

            // bring the clicked element to the front while it is being dragged
            Ext.apariencia.shortcuts._dragAttibutes._oldZIndex = target.style.zIndex;
            target.style.zIndex = 10000;

            // we need to access the element in OnMouseMove
            Ext.apariencia.shortcuts._dragAttibutes._dragElement = target;

            Ext.apariencia.shortcuts._dragAttibutes._dragElement.style.cursor = 'move';

            // tell our code to start moving the element with the mouse
            // document.onmousemove =
            // Ext.apariencia.shortcuts._dragAttibutes.mouseMove;
            Ext.apariencia.shortcuts._dragAttibutes._dragElement.onmousemove = Ext.apariencia.shortcuts._dragAttibutes.mouseMove;
            Ext.apariencia.shortcuts._dragAttibutes._dragElement.onmouseup = Ext.apariencia.shortcuts._dragAttibutes.mouseUp;

            // cancel out any text selections
            document.body.focus();

            // prevent text selection in IE
            document.onselectstart = function() {
                return false;
            };
            // prevent IE from trying to drag an image
            target.ondragstart = function() {
                // return false;
            };

            // prevent text selection (except IE)
            return false;
        }
    },
    mouseMove: function(e) {
        if (e == null)
            var e = window.event;

        // this is the actual "drag code"
        if (Ext.apariencia.shortcuts._dragAttibutes._dragElement) {
            Ext.apariencia.shortcuts._dragAttibutes._dragElement.style.left = (Ext.apariencia.shortcuts._dragAttibutes._offsetX
                    + e.clientX - Ext.apariencia.shortcuts._dragAttibutes._startX)
                    + 'px';
            Ext.apariencia.shortcuts._dragAttibutes._dragElement.style.top = (Ext.apariencia.shortcuts._dragAttibutes._offsetY
                    + e.clientY - Ext.apariencia.shortcuts._dragAttibutes._startY)
                    + 'px';
        }
    },
    mouseUp: function(e) {
        if (Ext.apariencia.shortcuts._dragAttibutes._dragElement != null) {
            Ext.apariencia.shortcuts._dragAttibutes._dragElement.style.zIndex = Ext.apariencia.shortcuts._dragAttibutes._oldZIndex;

            // we're done with these events until the next OnMouseDown
            document.onmousemove = null;
            document.onselectstart = null;
            Ext.apariencia.shortcuts._dragAttibutes._dragElement.ondragstart = null;

            Ext.apariencia.shortcuts._dragAttibutes._dragElement.style.cursor = 'pointer';

            // this is how we know we're not dragging
            Ext.apariencia.shortcuts._dragAttibutes.init();
        }
    }
};
Ext.apariencia.shortcuts.Desktop = {
    rows: 0,
    organize: 'name',
    columns: 0,
    divId: null,
    cells: [],
    ddGroup: 'dd-group-' + Ext.id(),
    cellDim: 100,
    calculateRows: function() {
        var winDimention = this.calculateWindowDimentions();
        this.rows = Math.ceil(winDimention.height
                / Ext.apariencia.shortcuts.Desktop.cellDim);
    },
    calculateColumns: function() {
        var winDimention = this.calculateWindowDimentions();
        this.columns = Math.ceil(winDimention.width
                / Ext.apariencia.shortcuts.Desktop.cellDim);
    },
    calculateWindowDimentions: function() {
        var width = window.outerWidth - this.cellDim;
        var height = window.outerHeight - (100 + this.cellDim);
        return {
            width: width,
            height: height
        };
    },
    createCells: function() {
        this.calculateRows();
        this.calculateColumns();
        for (var col = 0; col < this.columns; col++) {
            var xaxis = col * this.cellDim;
            for (var row = 0; row < this.rows; row++) {
                var yayis = row * this.cellDim;
                if (!this.createCell(col, row, xaxis, yayis))
                    return false;
            }
        }
        return true;
    },
    getAviablePosition: function() {
        for (var col = 0; col < this.columns; col++) {
            for (var row = 0; row < this.rows; row++) {
                if (this.isAviableCell(col, row)) {
                    return [col, row];
                }
            }
        }
        return false;
    },
    isAviableCell: function(col, row) {
        if (this.existCell(col, row) && (!this.cells[col][row].element))
            return true;
        return false;
    },
    ocupatePosition: function(el, col, row) {
        if (this.isAviableCell(col, row)) {
            var posAbs = this.getPositionCell(col, row);
            if (posAbs[0] > -1 && posAbs[1] > -1) {
                this.cells[col][row].element = el;
                return true;
            }
        }
        return false;
    },
    clearPosition: function(col, row) {
        if (this.existCell(col, row)) {
            this.cells[col][row].element = null;
            return true;
        }
        return false;
    },
    autoUbicateEl: function(el) {
        var aviable = this.getAviablePosition();
        if (aviable) {
            if (this.ocupatePosition(el, aviable[0], aviable[1]))
                return true;
        }
        return false;
    },
    dropElement: function(el, xaxis, yayis) {
        var col = this.getColumnFromXaxis(xaxis);
        var row = this.getRowFromYayis(yayis);
        if (this.isAviableCell(col, row)) {
            this.ocupatePosition(el, col, row);
        } else {
            this.autoUbicateEl(el);
        }
    },
    getColumnFromXaxis: function(xaxis) {
        if (this.xaxisInRange(xaxis)) {
            for (var col = 0; col < this.columns; col++) {
                var xaxisCol = this.getXaxisCell(col, 0);
                if (xaxisCol > -1 && xaxisCol <= xaxis
                        && (xaxisCol + this.cellDim) > xaxis) {
                    return col;
                }
            }
        } else {
            return this.columns - 1;
        }
        return -1;
    },
    xaxisInRange: function(xaxis) {
        if (this.existCell(0, 0) && this.existCell(this.columns - 1, 0)) {
            var xposIni = this.getXaxisCell(0, 0);
            var xposFin = this.getXaxisCell(this.columns - 1, 0);
            if (xposIni != -1 && xposFin != -1 && xaxis >= xposIni
                    && xaxis <= (xposFin + this.cellDim)) {
                return true;
            }
        }
        return false;
    },
    getRowFromYayis: function(yayis) {
        if (this.yayisInRange(yayis)) {
            for (var row = 0; row < this.rows; row++) {
                var yayisRow = this.getYayisCell(0, row);
                if (yayisRow > -1 && yayisRow <= yayis
                        && (yayisRow + this.cellDim) > yayis) {
                    return row;
                }
            }
        } else {
            return this.rows - 1;
        }
        return -1;
    },
    yayisInRange: function(yayis) {
        if (this.existCell(0, 0) && this.existCell(0, this.rows - 1)) {
            var yposIni = this.getYayisCell(0, 0);
            var yposFin = this.getYayisCell(0, this.rows - 1);
            if (yposIni != -1 && yposFin != -1 && yayis >= yposIni
                    && yayis <= (yposFin + this.cellDim)) {
                return true;
            }
        }
        return false;
    },
    getLocationCell: function(xaxis, yayis) {
        var col = this.getColumnFromXaxis(xaxis);
        var row = this.getRowFromYayis(yayis);
        return [col, row];
    },
    setColumns: function(cols) {

    },
    setRows: function(row) {

    },
    splitDesktopArea: function() {

    },
    existCell: function(col, row) {
        if (this.inRange(col, row) && this.cells[col] && this.cells[col][row]
                && this.cells[col][row].id) {
            return true;
        }
        return false;
    },
    inRange: function(col, row) {
        if (col > -1 && row > -1 && col < this.columns && row < this.rows)
            return true;
        return false;
    },
    createCell: function(col, row, xaxis, yayis) {
        if (this.inRange(col, row)) {
            if (!this.existCell(col, row)) {
                /*
                 * var cell = { position: [ xaxis , yayis ], id : Ext.id(),
                 * element : null }
                 */
                if (!this.cells[col]) {
                    this.cells[col] = [];
                }
                var cell = this.createDivCell(xaxis, yayis);
                if (cell) {
                    cell.column = col;
                    cell.row = row;
                    this.cells[col][row] = cell;
                    return true;
                }
            }
        }
        return false;
    },
    createDivCell: function(xaxis, yayis) {
        // var cell = document.createElement( 'div' );
        var cell = {};
        cell.id = Ext.id();
        cell.width = this.cellDim;
        cell.height = this.cellDim;
        cell.xaxis = xaxis;
        cell.yayis = yayis;
        cell.position = [xaxis, yayis];
        cell.element = null;

        cell.style = {};

        cell.style.position = 'absolute';
        cell.style.top = yayis;
        cell.style.left = xaxis;
        cell.style.height = this.cellDim;
        cell.style.width = this.cellDim;
        return cell;
        var desktopArea = document.getElementById('x-desktop');
        if (desktopArea) {
            desktopArea.appendChild(cell);
            return cell;
        }
        return false;
    },
    getXaxisCell: function(col, row) {
        if (this.existCell(col, row)) {
            return this.cells[col][row].xaxis;
        }
        return -1;
    },
    getYayisCell: function(col, row) {
        if (this.existCell(col, row)) {
            return this.cells[col][row].yayis;
        }
        return -1;
    },
    getPositionCell: function(col, row) {
        if (this.existCell(col, row)) {
            return this.cells[col][row].position;
        }
        return [-1, -1];
    },
    getCell: function(col, row) {
        if (this.existCell(col, row)) {
            return this.cells[col][row];
        }
        return false;
    },
    getAviableCell: function() {
        var position = this.getAviablePosition();
        if (position) {
            return this.getCell(position[0], position[1]);
        }
        return false;
    },
    itemsContextMenu: function() {
        var items = [];
        var organize = {
            id: 'organize-x-desktop',
            text: 'Ordenar por',
            icon: perfil.dirImg + 'diferenciaconbanco.png',
            menu: {
                items: [{
                        id: 'name-organize-x-desktop',
                        text: 'Nombre',
                        checked: (this.organize == 'name'),
                        group: 'organize-desktop',
                        checkHandler: function() {
                            this.organizeIconsFor('name');
                        }.createDelegate(this)
                    }, {
                        id: 'date-organize-x-desktop',
                        text: 'Fecha de modificaci&oacute;n',
                        checked: (this.organize == 'date'),
                        group: 'organize-desktop',
                        checkHandler: function() {
                            this.organizeIconsFor('date');
                        }.createDelegate(this)
                    }]
            }
        };
        var refresh = {
            id: 'refresh-x-desktop',
            text: 'Actualizar',
            icon: perfil.dirImg + 'actualizar.png',
            handler: this.refreshDesktop.createDelegate(this)
        };

        var newElement = {
            id: 'createelement-x-desktop',
            text: 'Nuevo',
            icon: perfil.dirImg + 'nuevo.png',
            menu: {
                items: [{
                        id: 'createnote-x-desktop',
                        text: 'Nota',
                        icon: perfil.dirImg + 'informe.png',
                        handler: function() {
                            this.createElement('note');
                        }.createDelegate(this)
                    }, {
                        id: 'createshortcut-x-desktop',
                        text: 'Acceso directo',
                        icon: perfil.dirImg + 'lote.png',
                        handler: function() {
                            this.createElement('shortcut');
                        }.createDelegate(this)
                    }]
            }
        };
        var customize = {
            id: 'customize-x-desktop',
            text: 'Apariencia',
            icon: '/portal/views/js/portal/images/portal.gif',
            handler: this.customizeDesktop.createDelegate(this)
        };
        items = [customize/*organize, refresh, '-', newElement, '-', customize*/];
        return items;
    },
    organizeIconsFor: function(params) {
        this.organize = params;
    },
    refreshDesktop: function() {
   
    },
    customizeDesktop: function() {
        var flag = false;
        if(!Ext.getCmp('winApariencia')) {
            winApariencia = new Ext.comun.apariencia.Ventana({
                title: 'Apariencia'
            });
            flag = true;
        }
        flag ? winApariencia.show() : Ext.getCmp('winApariencia').show();
    //}else{
    //        winApariencia.hide();
    //        winApariencia       = new Ext.comun.apariencia.Ventana({
    //            title               : 'Apariencia'
    //        });
    //        winApariencia.show();
    //
    //    }
    //
    },
    createElement: function(type) {

    },
    contextMenu: function(evt) {
        var xaxis = evt.clientX;
        var yayis = evt.clientY;
        if (evt.target.name != 'shortcut') {
            var items = Ext.apariencia.shortcuts.Desktop.itemsContextMenu();
            var contextMenu = new Ext.menu.Menu({
                id: 'contextmenu-x-desktop',
                items: items
            });
            contextMenu.showAt([xaxis, yayis]);
            return false;
        }
    },
    init: function() {
        if (this.createCells()) {
            // Mando a cargar los accesos directos
            return true;
        }
    }
}

Ext.apariencia.shortcuts.AccesoDirecto = function(config) {
    var EVT_MANAGER = new Ext.util.Observable();
    EVT_MANAGER.addEvents({
        drag: true,
        render: true,
        drop: true,
        select: true,
        click: true,
        dbclick: true,
        launch: true,
        add: true,
        update: true,
        remove: true
    });
    var idShortCut = config.id ? config.id : 'shortcut-' + Ext.id();
    if (config.type == 'menu') {
        config.icon = config.icon ? config.icon
                : '/lib/ExtJS/temas/default/images/iconos/abrirventana.png';
    } else if (config.type == 'note') {
        config.icon = '';
    } else {
        config.icon = config.icon ? config.icon
                : '/lib/ExtJS/temas/default/images/iconos/funcionalidad.png';
    }
    var shortCut = {
        EVT_MNGR: EVT_MANAGER,
        draggable: config.draggable ? config.draggable : false,
        id: idShortCut,
        resizable: config.resizable ? config.resizable : false,
        disabled: config.disabled ? config.disabled : false,
        href: config.href ? config.href : null,
        xaxis: config.xaxis ? config.xaxis : 0,
        yayis: config.yayis ? config.yayis : 0,
        type: config.type ? config.type : 'shortcut',
        cellContain: null,
        icon: config.icon,
        text: config.text ? config.text : '',
        hidden: config.hidden ? config.hidden : false,
        hiddeable: config.hiddeable ? config.hiddeable : false,
        qtip: config.qtip ? config.qtip : '',
        index: config.index ? config.index : 0,
        qtipCfg: config.qtipCfg ? config.qtipCfg : '',

        init: function() {
            if (this.render()) {
                this.html.onmousedown = this.initDrag;
                // this.html.onmouseup = this.endDrag;
            }
        },
      
        render: function() {
            var that = this;
            var cellElement = this.getAviableCell(that.xaxis, that.yayis);
            var desktopArea = document.getElementById('x-desktop');
            if (cellElement) {
                this.xaxis = cellElement.xaxis;
                this.yayis = cellElement.yayis;
                this.height = cellElement.cellDim;
                this.width = cellElement.cellDim;
                var cell = cellElement;
                if (cell) {
                    if (this.html) {
                        var idDiv = 'div-img-' + cell.id;
                        var htmlElement = Ext.get(idDiv);
                        if (htmlElement) {
                            var oldCell = this.cellContain;
                            desktopArea.removeChild(htmlElement);
                            htmlElement.remove();
                            if (oldCell) {
                                Ext.apariencia.shortcuts.Desktop.clearPosition(
                                        oldCell.column, oldCell.row);
                                this.html = null;
                            }
                        }
                    }
                    return this.createHtmlElement(cell);
                }
            }
            this.html = null;
            this.cellContain = null;
            this.ddElement = null;
            return false;
        },
        createHtmlElement: function(cell) {
            var that = this;
            var interElement = null;
            var interElementD = null;
            var interElementS = null;
            var texto = null;
            var tooltip = null;
            switch (this.type) {
                case 'note':
                    {

                    }
                    ;

                    break;
                default:
                    {
                        interElement = document.createElement("span");
                        interElement.className = this.icon.indexOf("/") == -1 ? 'acceso-directo icondistra-'+this.icon : this.icon;
                        interElement.style = 'text-align: center; width: 68px; height: 48px; top: 0px; left: 0px; display:block; overflow: hidden;';
                        interElement.name = 'shortcut';
                        //interElement.align = 'center';
                        //interElement.width = 48;
                        //interElement.height = 48;
                        interElement.id = Ext.id();

                    }
                    ;

                    break;
            }
            this.html = document.createElement("div");
            this.html.id = 'div-' + interElement.id;
            this.html.setAttribute('name',config.id);
            this.html.setAttribute('column',cell.column);
            this.html.setAttribute('row',cell.row);
            this.html.style.height = this.height;
            this.html.style.cursor = 'pointer';
            this.html.style.width = this.width;
            this.html.style.top = this.yayis;
            this.html.style.left = this.xaxis;
            // this.html.className = 'drag';
            this.html.style.position = 'absolute';
            this.html.style.clear = 'left';
            this.html.style.display = 'block';
            this.html.style.float = 'left';
            this.html.style.font = '10px tahoma,arial,verdana,sans-serif';
            this.html.style.margin = '15px 0 0 15px';
            this.html.style.width = '64px';
            this.html.style.textAlign = 'center';
            if (!Ext.isEmpty(this.qtip))
                this.html.setAttribute('ext:qtip', this.qtip);
            this.html.ondblclick = this.openReference.createDelegate(this);
            this.html.oncontextmenu = this.contextmenu.createDelegate(this);
            //Para crear el div con el texto
            texto = document.createElement("div");
            texto.style.cssText = "color:black;width:100%;overflow:hidden;text-overflow:ellipsis; font: 10px tahoma,arial,verdana,sans-serif;text-align: center; margin: 0;padding: 0;";
            texto.innerHTML = this.text;
            //Para crear el tooltip con el nombre completo de la funcionalidad
            tooltip = document.createElement("acronym");
            tooltip.title= this.text;
            tooltip.lang= 'es';

            if (Ext.apariencia.shortcuts.Desktop.ocupatePosition(that,
                    cell.column, cell.row)) {
                this.cellContain = cell;
                var desktopArea = document.getElementById('x-desktop');
                tooltip.appendChild(that.html);
                desktopArea.appendChild(tooltip);
                this.html.appendChild(interElement);
                this.html.appendChild(texto);

                this.dropElement = this.createDDEl('div-' + interElement.id);
                return true;
            }
            return false;
        },
        openReference: function(evt) {
            var src = {
                aWinConfig: {
                    id: this.id,
                    text: this.text,
                    referencia: this.href,
                    index: 0,
                    icon: this.icon
                }
            };
            if (this.type == 'shortcut') {
                if (!Ext.isEmpty(this.href)) {
                    var desktop = MyDesktop.getDesktop();
                    var win = desktop.getWindow('win' + src.aWinConfig.id);
                    if (!win) {
                        win = desktop.createWindow({
                            id: 'win' + src.aWinConfig.id,
                            title: src.aWinConfig.text,
                            config: src,
                            layout: 'fit',
                            items: new Ext.Panel({
                                id: 'iframe' + src.aWinConfig.id,
                                border: false,
                                html: '<iframe id="' + src.aWinConfig.id + '" style="width:100%; height: 100%; border:none;"></iframe>',
                                layout: 'fit'
                            }),
                            width: 800,
                            maximized: true,
                            height: 490,
                            minWidth: 800,
                            minHeight: 480,
                            iconCls: 'bogus',
                            shim: false,
                            animCollapse: false,
                            constrainHeader: true,
                            dirHelps : {
                                pathHelp:"",
                                pathAction:"",
                                pathAcercad:""
                            },
                            referencia: src.aWinConfig.referencia,
                            tools : [{
                                id:'incidencia',
                                qtip: 'Soporte del sistema <b>(Ctrl+F3)</b>',
                                handler: function(event, toolEl, panel){
                                     var ginc = new UCID.cein.GestorreportesView({referencia: src.aWinConfig.referencia});
                                    // var ginc = new UCID.gestornc.GestorreportesView({referencia: win.referencia});
                                    ginc.show();
                                }
                            },{
                                id:'infor',
                                qtip: 'Acerca de <b>(Ctrl+F2)</b>',
                                handler: function(event, toolEl, panel){
                                    var desk2 = desktop.getManager().getActive();
                                    acercaDe.show(desk2.dirHelps.pathAcercad);
                                }
                            },{
                                id:'ayuda',
                                qtip: 'Mostrar ayuda de la funcionalidad <b>(Ctrl+F1)</b>',
                                handler: function(event, toolEl, panel){
                                    var desk2 = desktop.getManager().getActive();
                                    ayuda.show('2', desk2.dirHelps.pathHelp,  desk2.dirHelps.pathAction);
                                }
                            },{
                                id:'arrowh',
                                qtip:'Ayuda del sistema',
                                handler: function(event, toolEl, panel){
                                    var el1 = Ext.get(src.aWinConfig.id+'-infor');
                                    var el2 = Ext.get(src.aWinConfig.id+'-incidencia');
                                    var el3 = Ext.get(src.aWinConfig.id+'-ayuda');
                                    var el4 = Ext.get(src.aWinConfig.id+'-arrowl');

                                    if(panel.displayHelp){

                                        el1.removeClass('deactiveh');
                                        el2.removeClass('deactiveh');
                                        el3.removeClass('deactiveh');
                                        el4.removeClass('x-tool-arrowl');

                                        el1.addClass('activeh');
                                        el2.addClass('activeh');
                                        el3.addClass('activeh');

                                        el4.addClass('x-tool-arrowr');

                                    }else{

                                        el1.removeClass('activeh');
                                        el2.removeClass('activeh');
                                        el3.removeClass('activeh');
                                        el4.removeClass('x-tool-arrowr');

                                        el1.addClass('deactiveh');
                                        el2.addClass('deactiveh');
                                        el3.addClass('deactiveh');
                                        el4.addClass('x-tool-arrowl');
                                    }

                                    panel.displayHelp =  !panel.displayHelp;

                                }
                            },{
                                id:'arrowl',
                                handler: function(event, toolEl, panel){
                                    // whatever
                                }
                            }],
                            toolTemplate: new Ext.XTemplate(
                                '<tpl if="0 == this.test(id)">',
                                '<div id='+src.aWinConfig.id+'-{id} class="x x-tool-{id} deactiveh"></div>',
                                '</tpl>',

                                '<tpl if="1 == this.test(id)">',
                                '<div class="x-tool x-tool-{id}">&#160;</div>',
                                '</tpl>',

                                '<tpl if="2 == this.test(id)">',
                                '<div id='+src.aWinConfig.id+'-{id} class="x x-tool-{id}"></div>',
                                '</tpl>',
                                {
                                    test: function(a){
                                        switch(a) {
                                            case 'incidencia':
                                                return 0;
                                                break;
                                            case 'infor':
                                                return 0;
                                                break;
                                            case 'arrowh':
                                                return 2;
                                                break;
                                            case 'arrowd':
                                                return 2;
                                                break;
                                            case 'arrowl':
                                                return 2;
                                                break;
                                            case 'arrowr':
                                                return 2;
                                                break;
                                            case 'ayuda':
                                                return 0;
                                                break;
                                            default:
                                                return 1;
                                        }
                                    }
                                })
                        });
                    }
                    win.show();
                    idFuncionalidad = src.aWinConfig.id;
                    document.getElementById(src.aWinConfig.id).src = src.aWinConfig.referencia + '?opcion=' + src.aWinConfig.index;
                    document.getElementById(src.aWinConfig.id).referencia = src.aWinConfig.referencia;

                }
            } else if (this.type == 'menu') {
                this.loadMenuSystem(evt);
            } else if (this.type == 'note') {

            }
        },
        loadMenuSystem: function(evt) {
            var xaxis = evt.clientX;
            var yayis = evt.clientY;
            var id = this.id;
            var items = this.createContextMenuItems();
            var contextMenu = new Ext.menu.Menu({
                id: 'subsystemmenu-' + id,
                items: items
            });
            contextMenu.showAt([xaxis, yayis]);
            return false;
        },
       
        contextmenu: function(evt) {
            var xaxis = evt.clientX;
            var yayis = evt.clientY;
            var id = this.id;
            var items = this.createContextMenuItems();
            var contextMenu = new Ext.menu.Menu({
                id: 'contextmenu-' + id,
                items: items
            });
            contextMenu.showAt([xaxis, yayis]);

            return false;
        },
       createContextMenuItems: function() {
            var items = [];
            var open = {
                id: 'open' + this.id,
                text: 'Abrir',
                //icon: perfil.dirImg + 'abrir.png',
                iconCls: 'abrir',
                handler: this.openReference.createDelegate(this)
            };
            var edit = {
                id: 'edit' + this.id,
                text: 'Editar',
                //icon: perfil.dirImg + 'modificar.png',
                iconCls: 'modificar',
                handler: this.rename.createDelegate(this)
            };
            var rename = {
                id: 'rename' + this.id,
                text: 'Renombrar',
                //icon: perfil.dirImg + 'crearreporte.png',
                iconCls: 'crearreporte',
                handler: this.rename.createDelegate(this)
            };
               var reicon = {
                id: 'reicon' + this.id,
                text: 'Cambiar ícono',
                //icon: perfil.dirImg + 'cambiar.png',
                iconCls: 'cambiar',
                handler: this.reicon.createDelegate(this)
            };
            var remove = {
                id: 'remove' + this.id,
                text: 'Eliminar',
                //icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                handler: this.remove.createDelegate(this)
            };
            var details = {
                id: 'details' + this.id,
                text: 'Acerca de',
                //icon: perfil.dirImg + 'info.png',
                iconCls: 'info',
                handler: this.showDetails.createDelegate(this)
            };
            items = [open, '-', rename, reicon, '-', remove,'-',details/*open, edit, '-', remove, rename, '-', details*/];
            return items;
        },
        rename: function() {
            var rename = new Ext.comun.wind.Rename({
                renderTo : 'x-desktop',
                constrain : true,
                name: this
            });
            rename.show();
        },
        reicon: function() {
            if(Ext.getCmp('winReicon')){
                Ext.getCmp('winReicon').fireEvent('close');
                Ext.getCmp('winReicon').destroy();

            }
            var reicon = new Ext.comun.wind.Reicon({
                renderTo: 'x-desktop',
                constrain: true,
                name: this
            });
            reicon.show();
        },
        remove: function() {
            var self=this;
            mostrarMensaje(2,"¿Está seguro que quiere eliminar el acceso directo seleccionado?",function(param){
                if(param=='ok'){
                    var  myMaskelim = new Ext.LoadMask(Ext.getBody(), {msg:'Eliminando...'});
                    myMaskelim.show();
                    Ext.get(self.html.id).remove();

                    Ext.apariencia.shortcuts.Desktop.clearPosition( self.cellContain.column,self.cellContain.row)
                    var src = {
                        aWinConfig: {
                            id: self.id,
                            text: self.text,
                            referencia: self.href,
                            index: 0,
                            estado: 'eliminar'
                        }
                    };
                    Ext.Ajax.request({
                        url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                        method: 'POST',
                        params: {
                            acceso: Ext.encode(src),
                            bandera: 'accesos'
                        },
                        callback: function(options, success, response) {
                            var  responseData = Ext.decode(response.responseText);
                            mostrarMensaje(responseData.cod,responseData.mensaje);
                            myMaskelim.hide();

                        }
                    });
                } else return ;
            })


        },
        showDetails: function() {
            if(this.href.indexOf('../../..')!=-1){
                var cadena=this.href.split('../../..');
                this.href=cadena[1];
            }
            var ref=this.href;
            ref=ref.split('index.php');
            var result=ref[0];
            result=result.substring(1,result.length-1);
            acercaDe.show(result);
        },
        getAviableCell: function(xaxis, yayis) {
            var cellPosition = Ext.apariencia.shortcuts.Desktop
                    .getLocationCell(xaxis, yayis);
            var cellElement = (Ext.apariencia.shortcuts.Desktop.isAviableCell(
                    cellPosition[0], cellPosition[1])) ? Ext.apariencia.shortcuts.Desktop
                    .getCell(cellPosition[0], cellPosition[1])
                    : Ext.apariencia.shortcuts.Desktop.getAviableCell();
            return cellElement;
        },
        createDDEl: function(id) {
            var ddElement = new Ext.dd.DD(id, 'x-desktop-drop');
            ddElement.endDrag = this.endDrag.createDelegate(this);
            return ddElement;
        },
        doLayout: function() {

        },
        initDrag: function(e) {
            Ext.apariencia.shortcuts._dragAttibutes.mouseDown(e);
        },
        endDrag: function(evt) {
            var xaxis = evt.clientX ? evt.clientX : evt.xy[0];
            var yayis = evt.clientY ? evt.clientY : evt.xy[1];
            return this.setPosition(xaxis, yayis);
        },
        setPosition: function(xaxis, yayis) {
            if (this.html) {
                var oldCell = this.cellContain;
                var newPosition = Ext.apariencia.shortcuts.Desktop
                        .getLocationCell(xaxis, yayis);
                if (!Ext.apariencia.shortcuts.Desktop.isAviableCell(
                        newPosition[0], newPosition[1])) {
                    xaxis = this.xaxis;
                    yayis = this.yayis;
                }
                if (Ext.apariencia.shortcuts.Desktop.clearPosition(
                        oldCell.column, oldCell.row)) {
                    var cellElement = this.getAviableCell(xaxis, yayis);
                    if (cellElement) {
                        if (Ext.apariencia.shortcuts.Desktop.ocupatePosition(
                                this, cellElement.column, cellElement.row)) {
                            this.xaxis = cellElement.xaxis;
                            this.yayis = cellElement.yayis;

                            this.html.style.top = this.yayis;
                            this.html.style.left = this.xaxis
                            this.html.setAttribute('column',cellElement.column);
                            this.html.setAttribute('row',cellElement.row);
                            this.cellContain = cellElement;
                            return true;
                        }
                    }
                }
            } else {
                return this.render();
            }

            return false;
        },
        fireEvent: function(evt, arg1, arg2, arg3, arg4, arg5) {
            EVT_MNGR.fireEvent(evt, arg1, arg2, arg3, arg4, arg5);
        },
        on: function(evt, fn) {
            EVT_MNGR.on(evt, function(arg1, arg2, arg3, arg4, arg5) {
                fn(arg1, arg2, arg3, arg4, arg5);
            });
        }
    };
    return shortCut;
}

Ext.apariencia.shortcuts.Desktop.init();

Ext.apariencia.shortcuts.desktopArea = document.getElementById('x-desktop').getElementsByTagName('table')[0];
Ext.apariencia.shortcuts.desktopArea.oncontextmenu = Ext.apariencia.shortcuts.Desktop.contextMenu
Ext.apariencia.shortcuts.dropArea = new Ext.dd.DDTarget('x-desktop', 'x-desktop-drop');
/**
 * @name	crearAccesos
 * @author 	Liván A Capote Valdés
 * @uses  	Para crear los accesos directos
 * @Ultima modificación: 28/Noviembre/2014 por Juan Luis R.guez H.dez
 */
function crearAccesos() {

    Ext.Ajax.request({
        url: '/portal/index.php/apariencia/obtenerConfiguracion',
        method: 'POST',
        params: {
            inicio: 'inicio'
          },
        callback: function(options, success, response) {
            var obj = Ext.decode(response.responseText);
            var accesos = Ext.decode(obj.accesosdirectos);
            var inicio = Ext.decode(obj.iniciosrapidos);

            var aplicaciones= Ext.decode(obj.iniciosautomaticos);
            if(aplicaciones){
                 for (var i = 0; i < aplicaciones.length; i++) {

                     var app=aplicaciones[i];
                     if (!Ext.isEmpty(app.referencia)) {
                         var desktop = MyDesktop.getDesktop();
                         var win = desktop.getWindow('win' + app.id);
                         if (!win) {
                             win = desktop.createWindow({
                                 id: 'win' + app.id,
                                 title: app.text,
                                 config: app,
                                 layout: 'fit',
                                 items: new Ext.Panel({
                                     id: 'iframe' + app.id,
                                     border: false,
                                     html: '<iframe id="' + app.id + '" style="width:100%; height: 100%; border:none;"></iframe>',
                                     layout: 'fit'
                                 }),
                                 width: 800,
                                 maximized: true,
                                 height: 490,
                                 minWidth: 800,
                                 minHeight: 480,
                                 iconCls: 'bogus',
                                 shim: false,
                                 animCollapse: false,
                                 constrainHeader: true
                             });
                         }
                        if(app.modo=='minimizado'){
                             win.minimize();
                         }else{
                             win.show();
                         }

                         idFuncionalidad = app.id;
                         document.getElementById(app.id).src = app.referencia + '?opcion=' + app.index;
                         document.getElementById(app.id).referencia = app.referencia;

                     }
                 }

             }
            /*if(dirfondo){

                document.body.style.background="#f3f3f3 url('"+dirfondo+"')no-repeat left top";
                console.log('FLASH');
            }*/

            if (accesos) {
                for (var i = 0; i < accesos.length; i++) {
                    var src = {
                        aWinConfig: {
                            id: accesos[i].id,
                            text: accesos[i].text,
                            referencia: accesos[i].referencia,
                            index: 0,
                            icono: (accesos[i].icono != "") ? accesos[i].icono : '/lib/ExtJS/temas/default/images/iconos/funcionalidad.png'
                        }
                    };

                    crearAcceso(src);
                }

            }
     /**Creando iconos de acceso rapido**/
            if (inicio) {
                for (var i = 0; i < inicio.length; i++) {
                    var src = {
                        aWinConfig: {
                            id: inicio[i].id,
                            text: inicio[i].text,
                            referencia: inicio[i].referencia,
                            index: 0,
                            icono: inicio[i].icono
                        }
                    };
                    inicioRapido(src);
                }

            }
     /**********************************/
            // cargando el fondo de escritorio
            /*if (obj.fondo != null) {
                document.body.style.background = "#f3f3f3 url('" + obj.fondo + "')";
            }*/
        }
    })

    Ext.Ajax.request({
        url: 'cargarfotoperfil',
        method: 'POST',
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (success) {
                this.perfil.foto = responseData;
            }
        }

    });

    Ext.Ajax.request({
        url: '/seguridad/index.php/configuracion/tieneModuloCein',
        method: 'POST',
        callback: function (options, success, response) {
            var response = Ext.decode(response.responseText);
            if (response.success) {
                Ext.Ajax.request({
                    url: '/seguridad/index.php/configuracion/testSoapService',
                    method: 'POST',
                    callback: function (options, success, response) {
                        var response = Ext.decode(response.responseText);
                        if (!response.success) {
                            mostrarMensaje(8, "Los servicios SOAP del Centralizador de incidencias no se encuentran configurados correctamente.");
                        }
                    }

                });
            }
        }

    });
}
/**
 * @name	crearAcceso
 * @author 	Liván A Capote Valdés
 * @uses  	Para crear el acceso directo
 * @Ultima modificación: 28/Noviembre/2014 por Juan Luis R.guez H.dez
 */
function crearAcceso(v) {
    var shortcut = Ext.apariencia.shortcuts.AccesoDirecto({
        xaxis: 0,
        yayis: 0,
        type: 'shortcut',
        href: v.aWinConfig.referencia,
        text: v.aWinConfig.text,
        id: v.aWinConfig.id,
        index: v.aWinConfig.index,
        icon: v.aWinConfig.icono

    })
    shortcut.init();
   
}

function inicioRapido(node) {

    var obj2 = document.getElementById("ux-taskbar-start");//     width: 94px; left: 0px; top: 0px; height: 30px;
    var obj1 = document.getElementById("TaskBarStart-xsplit");//  left: 94px; top: 0px; height: 30px;
    var obj3 = document.getElementById("ux-taskbuttons-panel");// left: 102px; top: 0px; width: 1254px; height: 30px;
    if(obj1.offsetLeft < 100) {
        obj1.style.left = obj1.offsetLeft+40+"px";
        obj3.style.left = obj3.offsetLeft+40+"px";
        obj3.style.width = obj3.offsetWidth-40+"px";
        obj2.style.width = obj2.offsetWidth+40+"px";
    } else {
        obj1.style.left = obj1.offsetLeft+32+"px";
        obj3.style.left = obj3.offsetLeft+32+"px";
        obj3.style.width = obj3.offsetWidth-32+"px";
        obj2.style.width = obj2.offsetWidth+32+"px";
    }

    var desktop = MyDesktop.getDesktop();
    var btn = new Ext.Button({
        id: "shortcut"+node.aWinConfig.id,
        ctCls : 'x-btn-icon',
        iconCls: 'inicio-rapido icondistra-'+node.aWinConfig.icono,
        cls:'btn',
        height: 80,
        menuAlign: 'bl-tl',
        renderTo: 'ux-taskbar-start',
        scale: 'large',
        icon: '',
        style : 'margin-left:20px;margin-top:-5px',
        tooltip:node.aWinConfig.text,
        width: 40,
        iconAlign: 'center',
        listeners: {
            'mouseover': function(elem) {
                var button=  document.getElementById(elem.id).getElementsByTagName('button')[0];
                 button.oncontextmenu = function(evt) {
                 var xaxis = evt.clientX;
                 var yayis = evt.clientY;
                 var contextMenu = new Ext.menu.Menu({
                     id: 'contextmenu',
                     items: [{
                         id: 'cambiaricon',
                         text: 'Cambiar ícono',
                         iconCls: 'cambiar',
                         handler: function() {
                            var reicon = new Ext.comun.wind.ReiconMenu({
                                 name:button.id,
                                 srcrapido:node
                             });
                             reicon.show();
                            }
                           },{
                         id: 'eliminar',
                         text: 'Eliminar',
                         iconCls: 'eliminar',
                         handler: function() {
                             mostrarMensaje(2,"¿Está seguro que quiere eliminar el inicio rápido seleccionado?",function(param){
                                 if(param=='ok'){
                                     var myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Eliminando...'});
                                     myMask.show();
                                     var obj1 = document.getElementById("TaskBarStart-xsplit");
                                     var obj2 = document.getElementById("ux-taskbar-start");
                                     var obj3 = document.getElementById("ux-taskbuttons-panel");

                                     if (obj1.offsetLeft - 32 < 100) {
                                         obj1.style.left = obj1.offsetLeft - 40 + "px";
                                         obj2.style.width = obj2.offsetWidth - 40 + "px";
                                         obj3.style.left = obj3.offsetLeft - 40 + "px";
                                         obj3.style.width = obj3.offsetWidth + 40 + "px";
                                     } else {
                                         obj1.style.left = obj1.offsetLeft - 32 + "px";
                                         obj2.style.width = obj2.offsetWidth - 32 + "px";
                                         obj3.style.left = obj3.offsetLeft - 32 + "px";
                                         obj3.style.width = obj3.offsetWidth + 32 + "px";
                                     }

                                    Ext.getCmp(elem.id).destroy();
                                     myMask.hide();
                                     var src = {
                                         aWinConfig: {
                                             id: node.aWinConfig.id,
                                             text: node.aWinConfig.text,
                                             referencia: node.aWinConfig.referencia,
                                             index: 0,
                                             estado: 'eliminar'
                                         }
                                     };
                                     Ext.Ajax.request({
                                         url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                                         method: 'POST',
                                         params: {
                                             acceso: Ext.encode(src),
                                             bandera: 'inicios'
                                         },
                                         callback: function (options, success, response) {
                                             var  responseData = Ext.decode(response.responseText);
                                             mostrarMensaje(responseData.cod,responseData.mensaje);
                                             myMask.hide();
                                         }
                                     });
                                 } else return ;
                             })

                         }
                     },{
                         id: 'acercade',
                         text: 'Acerca de',
                         iconCls: 'info',
                         handler: function() {
                             var referencia=node.aWinConfig.referencia;
                             if(referencia.indexOf('../../..')!=-1){
                                 var cadena=referencia.split('../../..');
                                 referencia=cadena[1];
                             }
                             var ref=referencia;
                             ref=ref.split('index.php');
                             var result=ref[0];
                             result=result.substring(1,result.length-1);
                             acercaDe.show(result);
                         }
                     }]
                 });
                 contextMenu.showAt([xaxis, yayis]);
                 return false;

             }
            }
        },
        handler:function(){

            var win = desktop.getWindow('win'+node.aWinConfig.id);
            if(!win){
                win = desktop.createWindow({
                    id: 'win'+node.aWinConfig.id,
                    title:node.aWinConfig.text,
                    config:node,
                    layout:'fit',
                    items:new Ext.Panel({
                        id: 'iframe'+node.aWinConfig.id,
                        border:false,
                        html: '<iframe id="' + node.aWinConfig.id + '" style="width:100%; height: 100%; border:none;"></iframe>',
                        layout:'fit'
                    }),
                    width:800,
                    maximized:true,
                    height:490,
                    minWidth :800,
                    minHeight:480,
                    iconCls: 'bogus',
                    shim:false,
                    animCollapse:false,
                    constrainHeader:true
                });
            }
            win.show();
            idFuncionalidad = node.aWinConfig.id;
            document.getElementById(node.aWinConfig.id).src = node.aWinConfig.referencia + '?opcion=' + node.aWinConfig.index;
            document.getElementById(node.aWinConfig.id).referencia = node.aWinConfig.referencia;
        }//.createDelegate(this)
    });
   // this.accesos.push(btn);
}
