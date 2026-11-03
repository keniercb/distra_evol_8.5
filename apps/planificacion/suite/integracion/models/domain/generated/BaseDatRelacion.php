<?php

abstract class BaseDatRelacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifplataforma.dat_relacion');

        $this->hasColumn(
            'idrelacion', 'numeric', null,
            array('notnull'  => false, 'primary' => true)
        );

        $this->hasColumn(
            'idtipoconceptopadre', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
            'idtipoconceptohijo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }


}

