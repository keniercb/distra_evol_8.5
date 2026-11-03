<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage CargaInicial/Models/Domain/Generated
 * @version    1.0
 */
abstract class BaseConfEntidades extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.conf_entidad');
        $this->hasColumn(
            'idconfiguracion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_idconfiguracion')
        );
        $this->hasColumn('configurado', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

