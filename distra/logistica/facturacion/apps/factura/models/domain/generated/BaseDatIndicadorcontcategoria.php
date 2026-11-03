<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatIndicadorcontcategoria extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_indicadorcontcategoria');
        $this->hasColumn(
            'idcategoriaindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_indicadorcontcategoria')
        );
        $this->hasColumn(
            'idcuentadesgloseprecio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicadorcontrato', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'concepto', 'character varying', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'porciento', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
