<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class DatFormatoEntidadModel extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    public function __constructDatFormatoEntidadModel() 
    {
        parent::ZendExt_Model();
    }

    /**
     * Insertar Formato Entidad
     *
     * @param DatFormatoEntidad $datFormatoEntidad Datos del formato de la entidad
     * @return boolean Retorna verdadero si el identificador es un número
     * @throws Doctrine_Exception $error Excepción de Doctrine ocurrida durante la transacción.
     */
    public function Insertar(DatFormatoEntidad $datFormatoEntidad) 
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $datFormatoEntidad->save();

            $va->commit();
            $va->beginTransaction();

            return is_numeric($datFormatoEntidad->idformatoentidad);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar Formato Entidad
     *
     * @param int $idformato Identificador de formato
     * @param int $idestructuracomun Identificador de estructura común.
     * @return boolean Retorna verdadero si es borrado el formato entidad falso en otro caso
     * 
     */
    static public function Eliminar($idformato, $idestructuracomun) 
    {
        return DatFormatoEntidad::Erase($idformato, $idestructuracomun);
    }

}