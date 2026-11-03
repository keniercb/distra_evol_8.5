<?php

abstract class BaseDatNotificaciones711 extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_notificaciones711');
        $this->hasColumn(
                'idnotificaciones711', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_notificaciones711')
        );
        $this->hasColumn(
                'idtipoplan', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idestadoaprobacion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idsituacionpedido', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idconceptocompra', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'textonotificacion', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'listaidrol', 'array', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'listaroles', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'paraconsolidacion', 'boolean', null, array('notnull' => false, 'primary' => false)
        );      
    }

    public function Setup() {
        parent::setUp(); 
        
    }

}
