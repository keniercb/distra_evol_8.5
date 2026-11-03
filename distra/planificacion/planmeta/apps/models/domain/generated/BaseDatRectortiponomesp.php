<?php

class BaseDatRectortiponomesp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_rectortiponomesp');

        $this->hasColumn(
            'idrectortiponomesp', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_rectortiponomesp')
        );
        $this->hasColumn(
            'idtiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

}
