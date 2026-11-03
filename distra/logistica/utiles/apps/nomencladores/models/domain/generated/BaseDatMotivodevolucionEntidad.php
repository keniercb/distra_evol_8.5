<?php

/**
 * Class BaseDatDestinoEntidad
 */
abstract class BaseDatMotivodevolucionEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_motivodevolucionentidad');
        $this->hasColumn(
            'idmotivodevolucionentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_datmotivodevolucionentidad')
        );
        $this->hasColumn('idmotivodevolucion', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

//fin clase 

