<?php

abstract class BaseDatDesgviaadquisorgsat extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planificacion.dat_desgviaadquisorgsat');
        $this->hasColumn(
            'cantidad', 'numeric', null,
            array('notnull'  => true, 'primary' => false,
                  'secuence' => 'mod_planificacion.sec_desgviaadquisorgsat')
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddesgviaadquisorgsat', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idindicadorviaadquisicionorganosatisface', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idorganosatisface', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatIndicadorviaadquisicionorganosatisface',
            array('local'   => 'idindicadorviaadquisicionorganosatisface',
                  'foreign' => 'idindicadorviaadquisicionorganosatisface')
        );
        $this->hasOne(
            'NomAprobacion',
            array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );

        $this->hasOne(
            'NomOrganosatisface', array('local'   => 'idorganosatisface',
                                        'foreign' => 'idorganosatisface')
        );
    }

}


