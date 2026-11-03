<?php

abstract class BaseDatActividadalimentoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logalimento.dat_actividadalimentoentidad');
        $this->hasColumn(
            'idactividadalimentoentidad', 'numeric', null,
            array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logalimento.sec_datactividadalimento'
            )
        );
        $this->hasColumn('idactividadalimento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
