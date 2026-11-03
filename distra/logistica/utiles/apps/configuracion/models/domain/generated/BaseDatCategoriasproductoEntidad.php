<?php

abstract class BaseDatCategoriasproductoEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_categoriaentidad');
        $this->hasColumn(
            'idcategoria', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcategoriaentidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_datcategoriaentidad')
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
