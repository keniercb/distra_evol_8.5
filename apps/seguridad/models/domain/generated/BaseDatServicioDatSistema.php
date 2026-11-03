<?php

abstract class BaseDatServicioDatSistema extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_serviciosistema');
        $this->hasColumn(
            'idsistema', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => true,
            )
        );
        
        $this->hasColumn(
            'idservicio', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                array(
                    0 => 'decimal',
                ),
                'notnull' => true,
                'primary' => false,
            )
        );
    }

}