<?php


class BaseDatPieFirmaDefDocumento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_piefirmadefectodocumento');

        $this->hasColumn(
            'idpiefirmadef', 'numeric', null, 
            array
            (
                'notnull'  => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_piefirmadefectodocumento'
            )
        );
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfuncionalidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valor', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}