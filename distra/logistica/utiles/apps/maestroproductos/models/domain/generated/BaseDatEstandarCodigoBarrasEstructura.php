<?php

abstract class BaseDatEstandarCodigoBarrasEstructura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_estandarcodigobarras_estructuraseq');
        $this->hasColumn(
            'idestandaracodbestructuraseq', 'numeric', null,
                array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datestandarcodigobarras_estructura')
        );
        $this->hasColumn(
            'idestandarcodigobarra', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'secuenciaactual', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}