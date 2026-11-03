<?php

abstract class BaseDatVariablecontrol extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_variablecontrol');
        $this->hasColumn(
                'idvariablecontrol', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_variablecontrol')
        );
        $this->hasColumn(
                'denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'descripcion', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidadcrea', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idtipomodelo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idpadre', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idarbol', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'ordender', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'variable', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'enuso', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
