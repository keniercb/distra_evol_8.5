<?php

abstract class BaseDatVariablecontrolentidad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_variablecontrolentidad');
        $this->hasColumn(
                'idvariablecontrolentidad', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_variablecontrolentidad')
        );

        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idvariablecontrol', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'valor', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
