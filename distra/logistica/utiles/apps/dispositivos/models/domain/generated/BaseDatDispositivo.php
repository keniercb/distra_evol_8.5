<?php
abstract class BaseDatDispositivo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_integracion.dat_dispositivo');
        $this->hasColumn(
            'identificador', 'text', null, array(
                'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn('idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idalmacen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('activo', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}