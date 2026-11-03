<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatMatrizprecio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_matrizprecio');
        $sequence = 'mod_logfacturacion.sec_datmatrizprecio';
        $this->hasColumn(
            'idmatrizprecio',
            'numeric', null,
            array(
                'notnull'  => true, 'primary' => true,
                'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idestructuracomun',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciopromedio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'bi',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciocontable', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoconcepto',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idorigen',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'iddestino',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechavigencia',
            'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idumedida',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
