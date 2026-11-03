<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatFormatoEntidad extends BaseDatFormatoEntidad
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {
        $this->hasOne('DatFormato', array('local' => 'idformato', 'foreign' => 'idformato'));
        parent::setUp();
    }

    /**
     * Get all
     *
     * @return array Retorna un arreglo con los datos de formato entidad 
     * @throws Doctrine_Exception $e
     */
    static public function GetAll() 
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatFormatoEntidad')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Get By Page
     * 
     * @param int $offset Indice de inicio de la busqueda
     * @param int $limit Limite de la busqueda
     * @param boolean $toArray 
     * @return array Retorna un arreglo con los datos de formato entidad 
     * @throws Doctrine_Exception $e
     */
    static public function GetByPage($offset, $limit, $toArray = false) 
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatFormatoEntidad')
                    ->offset($offset)
                    ->limit($limit)
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Get By Id
     *
     * @param int $idformato Identificador del formato entidad
     * @param boolean $toArray 
     * @return array Retorna un arreglo con los datos de formato entidad 
     * @throws Doctrine_Exception $e
     */
    static public function GetById($idformato, $toArray = false) 
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatFormatoEntidad')
                    ->where("idformato=?", array(0 => $idformato))
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Get By Condition
     *
     * @param array $condition Arreglo de condiciones
     * @param array $params Arreglo de parametros
     * @param boolean $toArray   
     * @return array Retorna un arreglo con los datos de formato entidad 
     * @throws Doctrine_Exception $e
     */
    static public function GetByCondition($condition, $params, $toArray = false) 
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatFormatoEntidad')
                    ->where("$condition", $params)
                    ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Erase
     *
     * @param int $idformato Identificador de formato
     * @param int $idestructuracomun Identificador de estructura comun
     * @return boolean Retorna verdadero en caso de borrar los datos falso en otro caso 
     * @throws Doctrine_Exception $e
     */
    static public function Erase($idformato, $idestructuracomun) 
    {
        try {
            $query = Doctrine_Query::create();
            $rowsafected = $query->delete('DatFormatoEntidad')
                    ->where("idformato=? AND idestructuracomun=?", array($idformato, $idestructuracomun))
                    ->execute();
            return $rowsafected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Erase by condition
     *
     * @param array $conditions Arreglo de condiciones
     * @param array $params Arreglo de parametros
     * @return boolean Retorna verdadero en caso de borrar los datos falso en otro caso 
     * @throws Doctrine_Exception $e
     */
    static public function EraseByCondition($conditions, $params) 
    {
        try {
            $query = Doctrine_Query::create();
            $rowsafected = $query->delete('DatFormatoEntidad')
                    ->where("$conditions", $params)
                    ->execute();
            return $rowsafected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
