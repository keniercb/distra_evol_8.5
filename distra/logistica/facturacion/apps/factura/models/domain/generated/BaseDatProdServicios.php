<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatProdServicios extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_prodservicios');
        $this->hasColumn(
            'idprodservicio', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datprodservicios')
        );
        $this->hasColumn(
            'idelementofactura', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciobase', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importetotal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idregnumerico', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcentrocosto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'matricula', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'indicativo', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nroinventario', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'centrocosto', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'entidad', 'character varying', null, array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}
