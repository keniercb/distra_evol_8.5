<?php

abstract class BaseDatNivelactprodcartatecporfecha extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_nivelactprodcartatecporfecha');
		 $this->hasColumn(
            'idnivelactprodcartatecporfecha', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_spouam.sec_nivelactprodcartatecporfecha')
        );
		 $this->hasColumn(
            'nivelactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'timestamp without time zone', null,
            array('notnull' => true, 'primary' => false)
        );    
		$this->hasColumn(
            'idactividadentidadprodcartatec', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idetapa', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatNivelactprodcartatecporfechareal',
            array('local'   => 'idnivelactprodcartatecporfecha',
                  'foreign' => 'idnivelactprodcartatecporfecha')
        );
        $this->hasOne(
            'DatActividadentidadprodcartatec',
            array('local'   => 'idactividadentidad',
                  'foreign' => 'idactividadentidad')
        );
       
    }

}


