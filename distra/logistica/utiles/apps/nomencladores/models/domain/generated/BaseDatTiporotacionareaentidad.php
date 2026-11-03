<?php

abstract class BaseDatTiporotacionareaentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.dat_tiporotacionareaentidad');
        $this->hasColumn(
            'idtiporotacionentidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_nomtipotransferenciaareaentidad')
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtiporotacion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 
