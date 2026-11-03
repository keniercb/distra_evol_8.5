<?php

abstract class BaseDatTransicionConfEstructura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.dat_transicion_conf_estructura');
        $this->hasColumn(
            'simultaneo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idtransicion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

