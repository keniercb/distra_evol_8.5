<?php

abstract class BaseDatCalidadmovdiferenciaEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_calidadmovdiferenciaentidad');
        $this->hasColumn(
            'idcalidadmovdiferencia', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_datmovcalidaddiferencia')
        );
        $this->hasColumn(
            'idcalidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase

