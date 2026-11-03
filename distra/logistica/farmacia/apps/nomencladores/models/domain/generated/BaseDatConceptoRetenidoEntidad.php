<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatConceptoRetenidoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_conceptoreteentidad');
        $this->hasColumn(
            'idconceptoreteentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_datconceptoreteentidad')
        );
        $this->hasColumn('idconceptorete', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}