<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseConfRecargo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('conf_recargo');
        $this->hasColumn(
            'idrecargo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'porcentual', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
