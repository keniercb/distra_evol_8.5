<?php

abstract class BaseDatOrganosatisfaceentidad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.dat_organosatisfaceentidad');
        $this->hasColumn(
                'idorganosatisfaceentidad', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_organosatisfaceentidad')
        );
        $this->hasColumn(
                'idorganosatisface', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'prioridad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
