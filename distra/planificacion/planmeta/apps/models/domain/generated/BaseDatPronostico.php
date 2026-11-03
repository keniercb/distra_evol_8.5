<?php

abstract class BaseDatPronostico extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('dat_pronostico');
        $this->hasColumn(
                'idpronostico', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_pronostico')
        );
        $this->hasColumn(
                'idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idorganosatisface', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'pronostico', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idmes', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
