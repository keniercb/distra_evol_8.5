<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain/Generated
 * @version    1.0
 */
abstract class  BaseNomCamponiveleav extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_camponiveleav');
        $this->hasColumn('actual', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('eliminable', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idcampo', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_camponiveleav')
        );
        $this->hasColumn('idconceptoestructural', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('longitud', 'numeric', 10, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombre', 'character varying', 30, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombre_mostrar', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('obligatorio', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', 2, array('notnull' => false, 'primary' => false));
        $this->hasColumn('regex', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipo', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipocampo', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('visible', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('visual', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
 
