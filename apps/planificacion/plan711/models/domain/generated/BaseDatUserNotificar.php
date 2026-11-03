<?php

abstract class BaseDatUserNotificar extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_usernotificar');
        $this->hasColumn(
                'idusernotificar', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_usernotificar')
        );
        $this->hasColumn(
                'nombreusuario', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'rol', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idrol', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'entidad', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idpersona', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
        
    }

}

?>