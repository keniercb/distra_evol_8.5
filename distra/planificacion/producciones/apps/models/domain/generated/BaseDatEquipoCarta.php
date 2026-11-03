<?php

abstract class BaseDatEquipoCarta extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_equipocarta');
        $this->hasColumn(
                'idequipocarta', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_equipocarta')
        );

        $this->hasColumn(
                'idcartatecnologica', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddepreciacionequipo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'gastosmantenimiento', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'depreciasionperiodo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
        
    }

    public function Setup() {
        parent::setUp();
    }

}
