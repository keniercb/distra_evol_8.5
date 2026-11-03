<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseNomUnidadmedida extends Doctrine_Record
{

    /**
     * Cambiar la definición de la tabla
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.nom_unidadmedida');
        $this->hasColumn('idunidadmedida', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_nomunidadmedida'));
        $this->hasColumn('denominacionunidadmedida', 'character varying', 30, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmagnitud', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('abreviaturaunidadmedida', 'character varying', 10, array('notnull' => true, 'primary' => false));
        $this->hasColumn('decimales', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('uriunidadmedida', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcionunidadmedida', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
    }

    /**
     * Constuctor de la clase
     */
    public function Setup() 
    {
        parent::setUp();
    }

}

