<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDesglosecategoriapreciofactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_desglosecategoriapreciofactura');
        $this->hasColumn(
            'iddesglosecategoria', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_categoriapreciofactura')
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcategoriafactura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valorcalculo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'porciento', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'concepto', 'character varying', 1, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valorcalculofact', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmonedacategoria', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
