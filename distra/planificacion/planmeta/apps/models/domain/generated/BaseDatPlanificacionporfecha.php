<?php

abstract class BaseDatPlanificacionporfecha extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_planificacionporfecha');
        $this->hasColumn(
            'fechafin', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idplanificacionporfecha', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_planificacionporfecha')
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

}


