 /*
   * Ext JS Library 2.2
   * Copyright(c) 2006-2008, Ext JS, LLC.
   * licensing@extjs.com
   *
   * http://extjs.com/license
   */

  /*
   * Note that this control will most likely remain as an example, and not as a core Ext form
   * control. However, the API will be changing in a future release and so should not yet be
   * treated as a final, stable API at this time.
   */

  /**
   * @class Ext.Cont.ItemSelector
   * @extends Ext.form.Field
   * A control that allows selection of between two Ext.Cont.MultiSelect controls. Modified by Ing. Miguel Diaz Rievaux.
   *
   *  @history
   *    2008-06-19 bpm Original code contributed by Toby Stuart.
   *    2014-11-10 Modified by Ing. Miguel Diaz Riveaux.
   *
   * @constructor
   * Create a new ItemSelector
   * @param {Object} config Configuration options
   */
  if(!Ext.Cont)
      Ext.namespace('Ext.Cont');
  Ext.Cont.ItemSelector = Ext.extend(Ext.form.Field, {
      msWidth: 200,
      msHeight: 300,
      hideNavIcons: false,
      imagePath: "",
      iconUp: "subir.png",
      iconDown: "bajar.png",
      iconLeft: "izquierda.png",
      iconRight: "derecha.png",
      iconInter: "inter.png",
      iconTop: "top.png",
      iconBottom: "bottom.png",
      iconAllRight: "topderecha.png",
      iconAllLeft: "topizquierda.png",
      drawUpIcon: true,
      drawDownIcon: true,
      drawLeftIcon: true,
      drawRightIcon: true,
      drawTopIcon: true,
      drawBotIcon: true,
      fromStore: null,
      toStore: null,
      fromData: null,
      toData: null,
      displayField: 0,
      valueField: 1,
      switchToFrom: false,
      allowDup: false,
      focusClass: undefined,
      delimiter: ',',
      readOnly: false,
      toLegend: null,
      fromLegend: null,
      toSortField: null,
      fromSortField: null,
      toSortDir: 'ASC',
      fromSortDir: 'ASC',
      toTBar: null,
      fromTBar: null,
      bodyStyle: null,
      border: false,
      initValue: Ext.emptyFn,
      defaultAutoCreate: {tag: "div"},
      initComponent: function() {
          this.addEvents({
              'rowdblclick': true,
              'change': true
          });
          return Ext.Cont.ItemSelector.superclass.initComponent.call(this);
      },
      onRender: function(ct, position) {
          Ext.Cont.ItemSelector.superclass.onRender.call(this, ct, position);

          this.fromMultiselect = new Ext.Cont.MultiSelect({
              legend: this.fromLegend,
              delimiter: this.delimiter,
              allowDup: this.allowDup,
              copy: this.allowDup,
              allowTrash: this.allowDup,
              dragGroup: this.readOnly ? null : "drop2-" + this.el.dom.id,
              dropGroup: this.readOnly ? null : "drop1-" + this.el.dom.id,
              width: this.msWidth,
              height: this.msHeight,
              dataFields: this.dataFields,
              data: this.fromData,
              displayField: this.displayField,
              valueField: this.valueField,
              store: this.fromStore,
              isFormField: false,
              tbar: this.fromTBar,
              appendOnly: true,
              sortField: this.fromSortField,
              sortDir: this.fromSortDir
          });
          this.fromMultiselect.on('dblclick', this.onRowDblClick, this);

//          if(this.fromStore) {
//              this.fromStore.load();
//              this.fromStore = new Ext.data.SimpleStore({
//                  fields: this.dataFields,
//                  data: this.fromData
//              });
//          }
          this.fromStore.on('load', this.valueChanged, this);

          if(!this.toStore) {
              this.toStore = new Ext.data.SimpleStore({
                  fields: this.dataFields,
                  data: this.toData
              });
          }
          this.toStore.on('add', this.valueChanged, this);
          this.toStore.on('remove', this.valueChanged, this);
          this.toStore.on('load', this.valueChanged, this);

          this.toMultiselect = new Ext.Cont.MultiSelect({
              legend: this.toLegend,
              delimiter: this.delimiter,
              allowDup: this.allowDup,
              dragGroup: this.readOnly ? null : "drop1-" + this.el.dom.id,
              dropGroup: this.readOnly ? null : "drop2-" + this.el.dom.id + ",drop1-" + this.el.dom.id,
              width: this.msWidth,
              height: this.msHeight,
              displayField: this.displayField,
              valueField: this.valueField,
              store: this.toStore,
              isFormField: false,
              tbar: this.toTBar,
              sortField: this.toSortField,
              sortDir: this.toSortDir
          });
          this.toMultiselect.on('dblclick', this.onRowDblClick, this);

          var p = new Ext.Panel({
              bodyStyle: this.bodyStyle,
              border: this.border,
              layout: "table",
              layoutConfig: {columns: 3}
          });
          p.add(this.switchToFrom ? this.toMultiselect : this.fromMultiselect);
          var icons = new Ext.Panel({header: false});
          p.add(icons);
          p.add(this.switchToFrom ? this.fromMultiselect : this.toMultiselect);
          p.render(this.el);
          icons.el.down('.' + icons.bwrapCls).remove();

          if(this.imagePath != "" && this.imagePath.charAt(this.imagePath.length - 1) != "/")
              this.imagePath += "/";
          this.iconUp = this.imagePath + ( this.iconUp || 'subir.png' );
          this.iconDown = this.imagePath + ( this.iconDown || 'bajar.png' );
          this.iconInter = this.imagePath + ( this.iconInter || 'inter.png' );
          this.iconLeft = this.imagePath + ( this.iconLeft || 'izquierda.png' );
          this.iconRight = this.imagePath + ( this.iconRight || 'derecha.png' );
          this.iconAllRight = this.imagePath + ( this.iconAllRight || 'topderecha.png' );
          this.iconAllLeft = this.imagePath + ( this.iconAllLeft || 'topizquierda.png' );
          this.iconTop = this.imagePath + ( this.iconTop || 'top.png' );
          this.iconBottom = this.imagePath + ( this.iconBottom || 'bottom.png' );
          var el = icons.getEl();
          this.toAllRightIcon = el.createChild({tag: 'img', src: this.iconAllRight, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Pasar todos a la derecha'});
          el.createChild({tag: 'br'});
          if(!this.toSortField) {
              this.toTopIcon = el.createChild({tag: 'img', src: this.iconTop, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Subir a la primera posici&oacute;n'});
              el.createChild({tag: 'br'});
              this.upIcon = el.createChild({tag: 'img', src: this.iconUp, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Subir una posici&oacute;n'});
              el.createChild({tag: 'br'});
          }
          this.addIcon = el.createChild({tag: 'img', src: this.switchToFrom ? this.iconLeft : this.iconRight, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Pasar a la derecha'});
          el.createChild({tag: 'br'});
          this.interIcon = el.createChild({tag: 'img', src: this.iconInter, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Intercambiar elementos seleccionados'});
          el.createChild({tag: 'br'});
          this.removeIcon = el.createChild({tag: 'img', src: this.switchToFrom ? this.iconRight : this.iconLeft, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Pasar a la izquierda'});
          el.createChild({tag: 'br'});
          if(!this.toSortField) {
              this.downIcon = el.createChild({tag: 'img', src: this.iconDown, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Bajar una posici&oacute;n'});
              el.createChild({tag: 'br'});
              this.toBottomIcon = el.createChild({tag: 'img', src: this.iconBottom, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Bajar a la &uacute;ltima posici&oacute;n'});
          }
          el.createChild({tag: 'br'});
          this.toAllLeftIcon = el.createChild({tag: 'img', src: this.iconAllLeft, style: {cursor: 'pointer', margin: '2px'}, qtip: 'Pasar todos a la izquierda'});
          if(!this.readOnly) {
              if(!this.toSortField) {
                  this.toTopIcon.on('click', this.toTop, this);
                  this.upIcon.on('click', this.up, this);
                  this.downIcon.on('click', this.down, this);
                  this.toBottomIcon.on('click', this.toBottom, this);
              }
              this.addIcon.on('click', this.fromTo, this);
              this.removeIcon.on('click', this.toFrom, this);
              this.toAllRightIcon.on('click', this.toRightAll, this);
              this.toAllLeftIcon.on('click', this.toLeftAll, this);
              this.interIcon.on('click', this.interBetween, this);
          }
          if(!this.drawUpIcon || this.hideNavIcons) {
              this.upIcon.dom.style.display = 'none';
          }
          if(!this.drawDownIcon || this.hideNavIcons) {
              this.downIcon.dom.style.display = 'none';
          }
          if(!this.drawLeftIcon || this.hideNavIcons) {
              this.addIcon.dom.style.display = 'none';
          }
          if(!this.drawRightIcon || this.hideNavIcons) {
              this.removeIcon.dom.style.display = 'none';
          }
          if(!this.drawTopIcon || this.hideNavIcons) {
              this.toTopIcon.dom.style.display = 'none';
          }
          if(!this.drawBotIcon || this.hideNavIcons) {
              this.toBottomIcon.dom.style.display = 'none';
          }

          var tb = p.body.first();
          this.el.setWidth(p.body.first().getWidth());
          p.body.removeClass();

          this.hiddenName = this.name;
          var hiddenTag = {tag: "input", type: "hidden", value: "", name: this.name};
          this.hiddenField = this.el.createChild(hiddenTag);
          this.valueChanged(this.toStore);
      },
      toTop: function() {
          var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
          var records = [];
          if(selectionsArray.length > 0) {
              selectionsArray.sort();
              for(var i = 0; i < selectionsArray.length; i++) {
                  record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                  records.push(record);
              }
              selectionsArray = [];
              for(var i = records.length - 1; i > -1; i--) {
                  record = records[i];
                  this.toMultiselect.view.store.remove(record);
                  this.toMultiselect.view.store.insert(0, record);
                  selectionsArray.push(( ( records.length - 1 ) - i ));
              }
          }
          this.toMultiselect.view.refresh();
          this.toMultiselect.view.select(selectionsArray);
      },
      toBottom: function() {
          var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
          var records = [];
          if(selectionsArray.length > 0) {
              selectionsArray.sort();
              for(var i = 0; i < selectionsArray.length; i++) {
                  record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                  records.push(record);
              }
              selectionsArray = [];
              for(var i = 0; i < records.length; i++) {
                  record = records[i];
                  this.toMultiselect.view.store.remove(record);
                  this.toMultiselect.view.store.add(record);
                  selectionsArray.push(( this.toMultiselect.view.store.getCount() ) - ( records.length - i ));
              }
          }
          this.toMultiselect.view.refresh();
          this.toMultiselect.view.select(selectionsArray);
      },
      up: function() {
          var record = null;
          var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
          selectionsArray.sort();
          var newSelectionsArray = [];
          if(selectionsArray.length > 0) {
              for(var i = 0; i < selectionsArray.length; i++) {
                  record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                  if(( selectionsArray[i] - 1 ) >= 0) {
                      this.toMultiselect.view.store.remove(record);
                      this.toMultiselect.view.store.insert(selectionsArray[i] - 1, record);
                      newSelectionsArray.push(selectionsArray[i] - 1);
                  }
              }
              this.toMultiselect.view.refresh();
              this.toMultiselect.view.select(newSelectionsArray);
          }
      },
      down: function() {
          var record = null;
          var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
          selectionsArray.sort();
          selectionsArray.reverse();
          var newSelectionsArray = [];
          if(selectionsArray.length > 0) {
              for(var i = 0; i < selectionsArray.length; i++) {
                  record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                  if(( selectionsArray[i] + 1 ) < this.toMultiselect.view.store.getCount()) {
                      this.toMultiselect.view.store.remove(record);
                      this.toMultiselect.view.store.insert(selectionsArray[i] + 1, record);
                      newSelectionsArray.push(selectionsArray[i] + 1);
                  }
              }
              this.toMultiselect.view.refresh();
              this.toMultiselect.view.select(newSelectionsArray);
          }
      },
      fromTo: function() {
          var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
          var records = [];
          if(selectionsArray.length > 0) {
              for(var i = 0; i < selectionsArray.length; i++) {
                  record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
                  records.push(record);
              }
              if(!this.allowDup)
                  selectionsArray = [];
              for(var i = 0; i < records.length; i++) {
                  record = records[i];
                  if(this.allowDup) {
                      var x = new Ext.data.Record();
                      record.id = x.id;
                      delete x;
                      this.toMultiselect.view.store.add(record);
                  } else {
                      this.fromMultiselect.view.store.remove(record);
                      this.toMultiselect.view.store.add(record);
                      selectionsArray.push(( this.toMultiselect.view.store.getCount() - 1 ));
                  }
              }
          }
          this.toMultiselect.view.refresh();
          this.fromMultiselect.view.refresh();
          if(this.toSortField)
              this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
          if(this.allowDup)
              this.fromMultiselect.view.select(selectionsArray);
          else
              this.toMultiselect.view.select(selectionsArray);
      },
      toRightAll: function() {
          var len = this.fromMultiselect.view.store.data.length;
          this.fromMultiselect.view.selectRange(0, len - 1);
          var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
          var records = [];
          if(selectionsArray.length > 0) {
              for(var i = 0; i < len; i++) {
                  record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
                  records.push(record);
              }
              if(!this.allowDup)
                  selectionsArray = [];
              for(var i = 0; i < records.length; i++) {
                  record = records[i];
                  if(this.allowDup) {
                      var x = new Ext.data.Record();
                      record.id = x.id;
                      delete x;
                      this.toMultiselect.view.store.add(record);
                  } else {
                      this.fromMultiselect.view.store.remove(record);
                      this.toMultiselect.view.store.add(record);
                      selectionsArray.push(( this.toMultiselect.view.store.getCount() - 1 ));
                  }
              }
          }
          this.toMultiselect.view.refresh();
          this.fromMultiselect.view.refresh();
          if(this.toSortField)
              this.toMultiselect.store.sort(this.toSortField, this.toSortDir);
          if(this.allowDup)
              this.fromMultiselect.view.select(selectionsArray);
          else
              this.toMultiselect.view.select(selectionsArray);
      },
      toFrom: function() {
          var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
          var records = [];
          if(selectionsArray.length > 0) {
              for(var i = 0; i < selectionsArray.length; i++) {
                  record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                  records.push(record);
              }
              selectionsArray = [];
              for(var i = 0; i < records.length; i++) {
                  record = records[i];
                  this.toMultiselect.view.store.remove(record);
                  if(!this.allowDup) {
                      this.fromMultiselect.view.store.add(record);
                      selectionsArray.push(( this.fromMultiselect.view.store.getCount() - 1 ));
                  }
              }
          }
          this.fromMultiselect.view.refresh();
          this.toMultiselect.view.refresh();
          if(this.fromSortField)
              this.fromMultiselect.store.sort(this.fromSortField, this.fromSortDir);
          this.fromMultiselect.view.select(selectionsArray);
      },
      toLeftAll: function() {
          var len = this.toMultiselect.view.store.data.length;
          this.toMultiselect.view.selectRange(0, len - 1);
          var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
          var records = [];
          if(selectionsArray.length > 0) {
              for(var i = 0; i < len; i++) {
                  record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                  records.push(record);
              }
              selectionsArray = [];
              for(var i = 0; i < records.length; i++) {
                  record = records[i];
                  this.toMultiselect.view.store.remove(record);
                  if(!this.allowDup) {
                      this.fromMultiselect.view.store.add(record);
                      selectionsArray.push(( this.fromMultiselect.view.store.getCount() - 1 ));
                  }
              }
          }
          this.fromMultiselect.view.refresh();
          this.toMultiselect.view.refresh();
          if(this.fromSortField)
              this.fromMultiselect.store.sort(this.fromSortField, this.fromSortDir);
          this.fromMultiselect.view.select(selectionsArray);
      },
      interBetween: function() {
          var selectedTo = this.toMultiselect.view.getSelectedIndexes();
          var lenTo = selectedTo.length;
          var selectedFrom = this.fromMultiselect.view.getSelectedIndexes();
          var lenFrom = selectedFrom.length;
          var recordsTo = [];
          var recordsFrom = [];
          if(lenTo > 0 && lenFrom > 0) {
              for(var i = 0; i < lenTo; i++) {
                  var recordTo = this.toMultiselect.view.store.getAt(selectedTo[i]);
                  recordsTo.push(recordTo);
              }
              for(var i = 0; i < lenFrom; i++) {
                  recordFrom = this.fromMultiselect.view.store.getAt(selectedFrom[i]);
                  recordsFrom.push(recordFrom);
              }
              selectedTo = [];
              for(var i = 0, lenRecordsTo = recordsTo.length; i < lenRecordsTo; i++) {
                  var record = recordsTo[i];
                  this.toMultiselect.view.store.remove(record);
                  if(!this.allowDup) {
                      this.fromMultiselect.view.store.add(record);
                      selectedTo.push((this.fromMultiselect.view.store.getCount() - 1));
                  }
              }
              selectedFrom = [];
              for(var i = 0, lenRecordsFrom = recordsFrom.length; i < lenRecordsFrom; i++) {
                  var record = recordsFrom[i];
                  this.fromMultiselect.view.store.remove(record);
                  if(!this.allowDup) {
                      this.toMultiselect.view.store.add(record);
                      selectedTo.push((this.toMultiselect.view.store.getCount() - 1));
                  }
              }
          }
//          this.fromMultiselect.view.refresh();
//          this.toMultiselect.view.refresh();
//          if(this.fromSortField)
//              this.fromMultiselect.store.sort(this.fromSortField, this.fromSortDir);
//          this.fromMultiselect.view.select(selectionsArray);
      },
      valueChanged: function(store) {
          var record = null;
          var values = [];
          for(var i = 0, len = store.getCount(); i < len; i++){
              record = store.getAt(i);
              values.push(record.get(this.valueField));
          }
          this.hiddenField.dom.value = values.join(this.delimiter);
          this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
      },
      getValue: function() {
          return this.hiddenField.dom.value;
      },
      getDataRight: function() {
          var len = this.toMultiselect.view.store.data.length;
          var selectionsArray = [];
          for(var i = 0; i < len; i++) {
              var record = this.toMultiselect.view.store.getAt(i);
              selectionsArray.push(record.data.id);
          }
          return selectionsArray;
      },
      getDataLeft: function() {
          var len = this.fromMultiselect.view.store.data.length;
          var selectionsArray = [];
          for(var i = 0; i < len; i++) {
              var record = this.fromMultiselect.view.store.getAt(i);
              selectionsArray.push(record.data.id);
          }
          return selectionsArray;
      },
      onRowDblClick: function(vw, index, node, e) {
          return this.fireEvent('rowdblclick', vw, index, node, e);
      },
      reset: function() {
          range = this.toMultiselect.store.getRange();
          this.toMultiselect.store.removeAll();
          if(!this.allowDup) {
              this.fromMultiselect.store.add(range);
              this.fromMultiselect.store.sort(this.displayField, 'ASC');
          }
          this.valueChanged(this.toMultiselect.store);
      }
  });
  Ext.reg("itemselector", Ext.Cont.ItemSelector);