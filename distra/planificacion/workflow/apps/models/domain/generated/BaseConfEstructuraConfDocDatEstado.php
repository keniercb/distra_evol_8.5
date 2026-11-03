<?php

abstract class BaseConfEstructuraConfDocDatEstado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_flujotrabajo.conf_estructura_conf_doc_dat_estado'
        );
        $this->hasColumn(
            'idtransicion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idtipodoc', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

