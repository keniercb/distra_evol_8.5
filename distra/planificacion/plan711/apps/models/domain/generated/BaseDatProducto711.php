<?php

abstract class BaseDatProducto711 extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_producto711');
        $this->hasColumn(
                'idproducto711', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_producto711')
        );
        $this->hasColumn(
                'denominacion', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'precio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'codigocup', 'text', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosempimp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'numeropieza', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'activo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'tipo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatoscodigo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatostipocodigo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idplan711', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
        
    }

}

?>