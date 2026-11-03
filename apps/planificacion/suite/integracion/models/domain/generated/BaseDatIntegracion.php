<?php

abstract class BaseDatIntegracion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifplataforma.dat_integracion');

        $this->hasColumn(
            'idintegracion', 'numeric', null,
            array('notnull'  => false, 'primary' => true)
        );

        $this->hasColumn(
            'idmodulofuente', 'numeric', null,
            array('notnull'  => false, 'primary' => true)
        );

        $this->hasColumn(
            'idmodulodestino', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );



    }


}

