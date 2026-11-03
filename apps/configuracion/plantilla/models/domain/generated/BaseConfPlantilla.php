<?php

/**
 *  Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseConfPlantilla extends Doctrine_Record
{

    /**
     * Cambiar la definición de la tabla
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.conf_plantilla');
        $this->hasColumn(
            'idplantilla', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_confplantilla')
        );
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfuncionalidad', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
