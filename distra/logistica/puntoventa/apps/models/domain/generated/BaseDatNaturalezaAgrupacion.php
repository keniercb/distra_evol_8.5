<?php
abstract class BaseDatNaturalezaAgrupacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_naturalezaagrupacion');
        $this->hasColumn(
            'idnaturalezaagrupacion', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpuntoventa.sec_datnaturalezaagrupacion'
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'enviado', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechaenvio', 'date', null, array(
                'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
