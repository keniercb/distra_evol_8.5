<?php

abstract class BaseDatDepreciacionequipo extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_depreciacionequipo');
        $this->hasColumn(
                'iddepreciacionequipo', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_depreciacionequipo')
        );
        $this->hasColumn(
                'idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cantidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'tasadepreciacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase


