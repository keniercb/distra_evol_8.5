<?php
/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class NomEstadosubsistema extends BaseNomEstadosubsistema
{
    /**
      * Constructor de la clase 
      */
    public function setUp()
    {
        parent::setUp();
    }
/**
 * Buscar estado
 * 
 * @param int $idestado Identificador de estado
 * @return object Retorna un objeto de tipo estado subsistema
 */
    static public function BuscarEstado($idestado)
    {
        $q = new Doctrine_Query();
        $result = $q->from("NomEstadosubsistema s")
            ->where("s.idestado= " . $idestado)
            ->execute();
        return $result;
    }


   /**
    * Buscar estados
    * 
    * @return array Retorna un arreglo de objetos de tipo estado subsistemas
    * @throws Doctrine_Exception $e
    */
    public function BuscarEstados()
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->from("NomEstadosubsistema")
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }
}
