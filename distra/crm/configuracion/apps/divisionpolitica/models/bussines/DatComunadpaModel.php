<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class DatComunadpaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta objeto DatComundpt
     *
     * @param int $idcomuna Identificador de comuna
     * @param int $iddpa    Identificador DPA
     *
     * @return array
     */
    public function Insertar($idcomuna, $iddpa)
    {
        $datComunadpa = new DatComunadpt();
        $datComunadpa->idcomuna = $idcomuna;
        $datComunadpa->iddpt = $iddpa;
        return DatComunadpt::insertar($datComunadpa);
    }

    /**
     * Busca un objeto Comuna DPA
     *
     * @param int $idcomuna Identificador de comuna
     * @param int $iddpa    Identificador DPA
     *
     * @return bool
     */
    public function EstaComunadpa($idcomuna, $iddpa)
    {
        $datComunadpa = new DatComunadpt();
        $datComunadpa = DatComunadpt::Buscar($idcomuna, $iddpa);
        if ($datComunadpa) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene un arreglo de Comunas DPA
     *
     * @param int $inicio   Comienzo inferior
     * @param int $limite   Límite superior
     * @param int $idcomuna Identificador de comuna
     *
     * @return array
     */
    public function getArrayComunasDPA($inicio, $limite, $idcomuna)
    {
        $resultado = DatComunadpt::GetPorLimite($limite, $inicio, $idcomuna);

        return $resultado;
    }

    /**
     * Obtiene todas las Comunas DPA
     *
     * @param int $idcomuna Identificador de comuna
     *
     * @return array
     */
    public function getAllComunasDPA($idcomuna)
    {
        $resultado = DatComunadpt::GetTodos($idcomuna);

        return $resultado;
    }

    /**
     * Elimina objeto Comuna DPA
     *
     * @param int $idcomuna Identificador de comuna
     * @param int $iddpa    Identificador DPA
     *
     * @return code Código de respuesta
     */
    public function Eliminar($idcomuna, $iddpa)
    {
        return DatComunadpt::eliminar($idcomuna, $iddpa);
    }

}

