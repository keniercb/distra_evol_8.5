<?php

abstract class BaseDatUnidadSaludDispensacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_unidadsaluddispensacion');

        $this->hasColumn(
            'idunidadsaluddispensacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_datunidadsaluddispensacion")
        );
        $this->hasColumn(
            'idtipounidadsalud', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipodispensacion', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcuadrobasico', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
