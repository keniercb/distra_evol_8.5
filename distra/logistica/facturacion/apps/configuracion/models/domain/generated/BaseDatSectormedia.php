<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatSectormedia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_sectormedia');
        $this->hasColumn(
            'idsectormedia',
            'numeric', null,
            array(
                'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn(
            'idnaturaleza',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idsector',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecio',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'media',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
