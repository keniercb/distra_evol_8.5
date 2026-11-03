<?php

abstract class BaseDatPostconaccesoestructura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.dat_postconaccesoestructura');
        $this->hasColumn(
            'idpostconacceso', 'numeric', null,
            array('notnull'  => false, 'primary' => true,
                  'sequence' => 'mod_flujotrabajo.sec_datpostconaccesoestructura')
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'eliminar', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'modificar', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcondicion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );

    }


}

