<?php

abstract class BaseDatIndicadoruamtipodepreciacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_indicadoruamtipodepreciacion');
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipodepreciacion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipodepreciacion', array('local' => 'idtipodepreciacion',
                                         'foreign' => 'idtipodepreciacion')
        );
        $this->hasOne(
            'NomIndicadoruam',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}


