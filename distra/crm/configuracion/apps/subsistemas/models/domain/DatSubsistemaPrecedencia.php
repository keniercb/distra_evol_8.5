<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatSubsistemaPrecedencia extends BaseDatSubsistemaPrecedencia
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    static function deleteById($idestructurasubsist){
        try {
            $query = Doctrine_Query::create();
            $query->delete()->from('DatSubsistemaPrecedencia sp')
                ->where('sp.idestructurasubsist = ?', $idestructurasubsist)
                ->execute();
            return true;
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    static function getById($idestructurasubsist){
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatSubsistemaPrecedencia sp')
                ->where('sp.idestructurasubsist = ?', $idestructurasubsist)
                ->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            return array();
        }
    }

}
