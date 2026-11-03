<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class NomMedioinformacionModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta un NomMedioinformacion
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
        $nomMedioinformacion = new NomMedioinformacion();

        $nomMedioinformacion->denominacion = $denom;
        $nomMedioinformacion->descripcion = $descripcion;
        $nomMedioinformacion->fechafin = $fechafin;
        $nomMedioinformacion->fechaini = $fechaini;

        return NomMedioinformacion::insertar($nomMedioinformacion);
    }

    /**
     * Actualiza un NomMedioinformacion
     *
     * @param int    $idmedioinformacion Identificador de medio información
     * @param string $denom              Denominación
     * @param string $descripcion        Descripción
     * @param date   $fechaini           Fecha inicio
     * @param date   $fechafin           Fecha fin
     *
     * @return code Código de respuesta
     */
    public function Actualizar($idmedioinformacion, $denom, $descripcion, $fechaini, $fechafin)
    {
        $nomMedioinformacion = new NomMedioinformacion();
        $nomMedioinformacion = NomMedioinformacion::Buscar($idmedioinformacion);
        if (strtolower($nomMedioinformacion->denominacion) != trim(strtolower($denom))) {
            $objvalidators = new NomencladoresValidator();
            if ($objvalidators->validarDenominacion('NomMedioinformacion', trim($denom))) {
                $nomMedioinformacion->denominacion = $denom;
                $nomMedioinformacion->descripcion = $descripcion;
                $nomMedioinformacion->fechafin = $fechafin;
                $nomMedioinformacion->fechaini = $fechaini;
                return NomMedioinformacion::modificar($nomMedioinformacion);
            } else {
                throw new ZendExt_Exception('NCI04');
            }
        } else {
            $nomMedioinformacion->denominacion = $denom;
            $nomMedioinformacion->descripcion = $descripcion;
            $nomMedioinformacion->fechafin = $fechafin;
            $nomMedioinformacion->fechaini = $fechaini;
            return NomMedioinformacion::modificar($nomMedioinformacion);
        }
    }

    /**
     * Obtiene un NomMedioinformacion
     *
     * @param int $idmedioinformacion Identificador de medio información
     *
     * @return array
     */
    public function getNomMedioinformacion($idmedioinformacion)
    {
        $nomMedioinformacion = new NomMedioinformacion();

        $nomMedioinformacion = NomMedioinformacion::Buscar($idmedioinformacion);

        return $nomMedioinformacion;
    }

    /**
     * Obtiene un arreglo de Medio información
     *
     * @param int    $inicio   Comienzo inferior
     * @param int    $limite   Límite superior
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getArrayMedioInformacion($inicio, $limite, $denom, $fechaini, $fechafin)
    {
        $resultado = NomMedioinformacion::GetPorLimite($limite, $inicio, $denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Obtiene todos los Medios información
     *
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getAllMedioinformacion($denom, $fechaini, $fechafin)
    {
        $resultado = NomMedioinformacion::GetTodos($denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Obtiene un arreglo de Medio información
     *
     * @param int   $id Identificador
     * @param mixed $con
     *
     * @return code Código de respuesta
     */
    public function Eliminar($id, $con)
    {
        return NomMedioinformacion::eliminar($id, $con);
    }

}

