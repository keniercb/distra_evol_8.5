<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class NomConfiabilidadModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta un NomConfiabilidad
     *
     * @param string $denom       Denominación
     * @param string $descripcion Descripción
     * @param date   $fechaini    Fecha inicio
     * @param date   $fechafin    Fecha fin
     *
     * @return code Código de respuesta
     */
    public function Insertar($denom, $descripcion, $fechaini, $fechafin)
    {
        $nomConfiabilidad = new NomConfiabilidad();

        $nomConfiabilidad->denominacion = $denom;
        $nomConfiabilidad->descripcion = $descripcion;
        $nomConfiabilidad->fechafin = $fechafin;
        $nomConfiabilidad->fechaini = $fechaini;

        return NomConfiabilidad::insertar($nomConfiabilidad);
    }


    /**
     * Inserta un NomConfiabilidad
     *
     * @param int    $idconfiabilidad Identificador de Confiabilidad
     * @param string $denom           Denominación
     * @param string $descripcion     Descripción
     * @param date   $fechaini        Fecha inicio
     * @param date   $fechafin        Fecha fin
     *
     * @return code Código de respuesta
     */
    public function Actualizar($idconfiabilidad, $denom, $descripcion, $fechaini, $fechafin)
    {
        $nomConfiabilidad = new NomConfiabilidad();

        $nomConfiabilidad = NomConfiabilidad::Buscar($idconfiabilidad);
        if (strtolower($nomConfiabilidad->denominacion) != trim(strtolower($denom))) {
            $objvalidators = new NomencladoresValidator();
            if ($objvalidators->validarDenominacion('NomConfiabilidad', trim($denom))) {
                $nomConfiabilidad->denominacion = trim($denom);
                $nomConfiabilidad->descripcion = $descripcion;
                $nomConfiabilidad->fechafin = $fechafin;
                $nomConfiabilidad->fechaini = $fechaini;
                return NomConfiabilidad::modificar($nomConfiabilidad);
            } else {
                throw new ZendExt_Exception('NCI05');
            }
        } else {
            $nomConfiabilidad->denominacion = $denom;
            $nomConfiabilidad->descripcion = $descripcion;
            $nomConfiabilidad->fechafin = $fechafin;
            $nomConfiabilidad->fechaini = $fechaini;
            return NomConfiabilidad::modificar($nomConfiabilidad);
        }


    }

    /**
     * Obtiene un NomConfiabilidad
     *
     * @param int $idconfiabilidad Identificador de Confiabilidad
     *
     * @return array
     */
    public function getNomConfiabilidad($idconfiabilidad)
    {
        $nomConfiabilidad = new NomConfiabilidad();

        $nomConfiabilidad = NomConfiabilidad::Buscar($idconfiabilidad);

        return $nomConfiabilidad;
    }

    /**
     * Obtiene un arreglo de NomConfiabilidad por límites
     *
     * @param int    $inicio   Comienzo inferior
     * @param int    $limite   Límite superior
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getArrayConfiabilidad($inicio, $limite, $denom, $fechaini, $fechafin)
    {
        $resultado = NomConfiabilidad::GetPorLimite($limite, $inicio, $denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Obtiene un arreglo de NomConfiabilidad
     *
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getAllConfiabilidad($denom, $fechaini, $fechafin)
    {
        $resultado = NomConfiabilidad::GetTodos($denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Obtiene un arreglo de NomConfiabilidad por límites
     *
     * @param int   $id Identificador
     * @param mixed $con
     *
     * @return code Código de respuesta
     */
    public function Eliminar($id, $con)
    {
        return NomConfiabilidad::eliminar($id, $con);
    }
}

