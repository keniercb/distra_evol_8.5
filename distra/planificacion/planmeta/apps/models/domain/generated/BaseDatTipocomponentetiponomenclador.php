<?php

abstract class BaseDatTipocomponentetiponomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_tipocomponentetiponomenclador');
        $this->hasColumn(
            'idtipocomponente', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
