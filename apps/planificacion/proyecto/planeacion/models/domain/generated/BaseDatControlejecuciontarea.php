<?php

abstract class BaseDatControlejecuciontarea extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifproyecto.dat_controlejecuciontarea');
        $this->hasColumn(
                'idtarea', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'date', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cantidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
?>

