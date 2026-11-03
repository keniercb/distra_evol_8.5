<?php

abstract class BaseDatMotivoModificacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_motivomodificacion');
        $this->hasColumn(
                'idmotivomodif', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_motivomodificacion')
        );
        $this->hasColumn(
                'identificador', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'motivo', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'usuario', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechamodificacion', 'timestamp', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
        
    }

}

?>