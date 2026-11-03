<?php

abstract class BaseDatColumnaconcepto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_columnaconcepto');
        $this->hasColumn(
            'idcolumna', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifimportacion.sec_columnaconcepto')
        );
        $this->hasColumn(
            'idconfiguracion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'orden', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'obligatorio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'etiqueta', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombrecampo', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

