<?php

/**
 * Componente que gestiona las especialidades por subsistemas 
 * 
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Especialidad/Models/Domain/Generated
 * @version    1.0
 */
abstract class BaseNomEspecialidad extends Doctrine_Record
{
   /**
     * Cambiar definiciones de la tabla
     * 
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.nom_especialidad');
        $this->hasColumn(
                'idespecialidad', 'numeric', 19, array(
                    'notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_idespecialidad'
                    )
                );
        $this->hasColumn('denespecialidad', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('abrevespecialidad', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ordenizq', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codespecialidad', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ordender', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechaini', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nivel', 'numeric', 10, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'varchar', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('controlmaterial', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
   /**
     * Constructor de la clase
     */
    public function setUp() 
    {
        parent::setUp();
    }

}
