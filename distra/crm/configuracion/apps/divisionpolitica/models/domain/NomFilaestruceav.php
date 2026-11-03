<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomFilaestruceav extends BaseNomFilaestruceav
{
    public function setUp()
    {
        parent::setUp();

        $this->HasMany('NomFilaestruceav', array('local' => 'idfila', 'foreign' => 'idpadre'));
        $this->hasOne('NomFilaestruceav', array('local' => 'idpadre', 'foreign' => 'idfila'));
        $this->hasOne('NomConceptoestructural', array('local' => 'idnomeav', 'foreign' => 'idconceptoestructural'));
    }

    /**
     * Devuelve las filas de una tabla
     *
     * @param int $idTabla Identificador de tabla
     *
     * @return array
     */
    function buscarFilas($idTabla)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomFilaestruceav')
            ->where("idnomeav = '$idTabla'")
            ->execute();
        return $result->toArray();

    }

} 
 
