<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class NomClasificacioninformacionModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta un objeto NomClasificacioninformacion
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
        $nomClasificacioninformacion = new NomClasificacioninformacion();

        $nomClasificacioninformacion->denominacion = trim($denom);
        $nomClasificacioninformacion->descripcion = $descripcion;
        $nomClasificacioninformacion->fechafin = $fechafin;
        $nomClasificacioninformacion->fechaini = $fechaini;

        return NomClasificacioninformacion::insertar($nomClasificacioninformacion);
    }

    /**
     * Modifica un objeto NomClasificacioninformacion
     *
     * @param int    $idclasificacioninformacion Identificador de clasificación de información
     * @param string $denom                      Denominación
     * @param string $descripcion                Descripción
     * @param date   $fechaini                   Fecha inicio
     * @param date   $fechafin                   Fecha fin
     *
     * @return code Código de respuesta
     */
    public function Actualizar($idclasificacioninformacion, $denom, $descripcion, $fechaini, $fechafin)
    {
        $nomClasificacioninformacion = new NomClasificacioninformacion();
        $nomClasificacioninformacion = NomClasificacioninformacion::Buscar($idclasificacioninformacion);
        if (strtolower($nomClasificacioninformacion->denominacion) != trim(strtolower($denom))) {
            $objvalidators = new NomencladoresValidator();
            if ($objvalidators->validarDenominacion('NomClasificacioninformacion', trim($denom))) {
                $nomClasificacioninformacion->denominacion = trim($denom);
                $nomClasificacioninformacion->descripcion = $descripcion;
                $nomClasificacioninformacion->fechafin = $fechafin;
                $nomClasificacioninformacion->fechaini = $fechaini;
                return NomClasificacioninformacion::modificar($nomClasificacioninformacion);
            } else {
                throw new ZendExt_Exception('NCI02');
            }
        } else {
            $nomClasificacioninformacion->denominacion = trim($denom);
            $nomClasificacioninformacion->descripcion = $descripcion;
            $nomClasificacioninformacion->fechafin = $fechafin;
            $nomClasificacioninformacion->fechaini = $fechaini;
            return NomClasificacioninformacion::modificar($nomClasificacioninformacion);
        }
    }

    /**
     * Obtiene un objeto NomClasificacioninformacion
     *
     * @param int $idclasificacioninformacion Identificador de clasificación de información
     *
     * @return array
     */
    public function getNomClasificacioninformacion($idclasificacioninformacion)
    {
        $nomClasificacioninformacion = new NomClasificacioninformacion();

        $nomClasificacioninformacion = NomClasificacioninformacion::Buscar($idclasificacioninformacion);

        return $nomClasificacioninformacion;
    }

    /**
     * Obtiene un objeto NomClasificacioninformacion por límites
     *
     * @param int    $inicio   Comienzo inferior
     * @param int    $limite   Límite superior
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getArrayClasificacioninformacion($inicio, $limite, $denom, $fechaini, $fechafin)
    {
        $resultado = NomClasificacioninformacion::GetPorLimite($inicio, $limite, $denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Obtiene todos los objetos NomClasificacioninformacion
     *
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getAllClasificacioninformacion($denom, $fechaini, $fechafin)
    {
        $resultado = NomClasificacioninformacion::GetTodos($denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Elimina un objeto NomClasificacioninformacion
     *
     * @param int   $id Identificador
     * @param mixed $con
     *
     * @return code Código de respuesta
     */
    public function Eliminar($id, $con)
    {
        return NomClasificacioninformacion::eliminar($id, $con);
    }

}


