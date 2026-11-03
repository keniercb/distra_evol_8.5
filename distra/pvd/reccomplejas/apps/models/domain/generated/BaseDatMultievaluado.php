<?php

abstract class BaseDatMultievaluado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_multievaluado');
        $this->hasColumn('valor', 'character varying', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => false, 'primary' => true));
    }


}

