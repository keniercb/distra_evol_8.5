<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class NomTipomediocontactoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta un NomTipoMedioContacto
     *
     * @param string $denom       Denominación
     * @param string $descripcion Descripción
     * @param date   $fechaini    Fecha inicio
     * @param date   $fechafin    Fecha fin
     * @param int    $idformato   Identificador de formato
     *
     * @return code Código de respuesta
     */
    public function Insertar($denom, $descripcion, $fechaini, $fechafin, $idformato)
    {
        $nomTipoMedioContacto = new NomTipoMedioContacto();
        $nomTipoMedioContacto->denom = $denom;
        $nomTipoMedioContacto->descripcion = $descripcion;
        $nomTipoMedioContacto->desde = $fechaini;
        $nomTipoMedioContacto->hasta = $fechafin;
        $nomTipoMedioContacto->idformatotipomediocontacto = $idformato;
        return NomTipoMedioContacto::insertar($nomTipoMedioContacto);
    }

    /**
     * Inserta un NomTipoMedioContacto
     *
     * @param int    $idtipomediocontacto Identificador de tipo de medio contacto
     * @param string $denom               Denominación
     * @param string $descripcion         Descripción
     * @param date   $fechaini            Fecha inicio
     * @param date   $fechafin            Fecha fin
     * @param int    $idformato           Identificador de formato
     *
     * @return code Código de respuesta
     */
    public function Actualizar($idtipomediocontacto, $denom, $descripcion, $fechaini, $fechafin, $idformato)
    {
        $nomTipoMedioContacto = new NomTipoMedioContacto();
        $nomTipoMedioContacto = NomTipoMedioContacto::BuscarMedio($idtipomediocontacto);
        if (strtolower($nomTipoMedioContacto->denominacion) != trim(strtolower($denom))) {
            $objvalidators = new NomencladoresValidator();
            if ($objvalidators->validarDenominacionMedioContacto('NomTipoMedioContacto', trim($denom))) {
                $nomTipoMedioContacto->denom = trim($denom);
                $nomTipoMedioContacto->descripcion = $descripcion;
                $nomTipoMedioContacto->desde = $fechaini;
                $nomTipoMedioContacto->hasta = $fechafin;
                $nomTipoMedioContacto->idformatotipomediocontacto = $idformato;
                return NomTipoMedioContacto::modificar($nomTipoMedioContacto);
            } else {
                throw new ZendExt_Exception('NCI16');
            }
        } else {
            $nomTipoMedioContacto->denom = trim($denom);
            $nomTipoMedioContacto->descripcion = $descripcion;
            $nomTipoMedioContacto->desde = $fechaini;
            $nomTipoMedioContacto->hasta = $fechafin;
            $nomTipoMedioContacto->idformatotipomediocontacto = $idformato;
            return NomTipoMedioContacto::modificar($nomTipoMedioContacto);
        }
    }

    /**
     * Elimina un NomTipoMedioContacto
     *
     * @param int $id
     *
     * @return code Código de respuesta
     */
    public function Eliminar($id)
    {
        $con = '';
        return NomTipoMedioContacto::eliminar($id, $con);
    }

    /**
     * Obtiene un arreglo de medio de contacto
     *
     * @param int    $inicio   Comienzo inferior
     * @param int    $limite   Límite superior
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getArrayMedioContacto($inicio, $limite, $denom, $fechaini, $fechafin)
    {
        $resultado = NomTipoMedioContacto::GetPorLimiteMedios($limite, $inicio, $denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Obtiene todos los medio de contacto
     *
     * @param string $denom    Denominación
     * @param date   $fechaini Fecha inicio
     * @param date   $fechafin Fecha fin
     *
     * @return array
     */
    public function getAllMedioContacto($denom, $fechaini, $fechafin)
    {
        $resultado = NomTipoMedioContacto::GetTodosMedios($denom, $fechaini, $fechafin);

        return $resultado;
    }

    /**
     * Obtiene la cantidad de ID
     *
     * @param int $idtipomediocontacto Identificador de tipo medio de contacto
     *
     * @return bool
     */
    public function CantId($idtipomediocontacto)
    {
        $cant = NomTipoMedioContacto::cant($idtipomediocontacto);
        if ($cant > 0) {
            return false;
        } else {
            $nomTipoMedioContacto = Doctrine::getTable('NomTipoMedioContacto')->find($idtipomediocontacto);
            $nomTipoMedioContacto->delete();
            return true;
        }
    }


    /**
     * Obtiene un NomTipoMedioContacto
     *
     * @param int $idtipomediocontacto Identificador de tipo medio de contacto
     *
     * @return mixed
     */
    public function getTipomediocontacto($idtipomediocontacto)
    {
        return  Doctrine::getTable('NomTipoMedioContacto')->find($idtipomediocontacto);
    }

    /**
     * Verifica la cantidad de NomTipoMedioContacto
     *
     * @param int $idtipomediocontacto Identificador de tipo medio de contacto
     *
     * @return bool
     */
    public function Cant($idtipomediocontacto)
    {
        $tipomediocontacto = new NomTipoMedioContacto();
        $cant = $tipomediocontacto->canttipo($idtipomediocontacto);

        if ($cant > 0) {
            return false;
        } else {
            $this->Eliminar($idtipomediocontacto);
            return true;
        }
    }

    /**
     * Obtiene todos los activos
     *
     * @return array
     */
    public function obtenerTodosActivos()
    {
        $obj = new NomTipoMedioContacto();
        return $obj->GetTodosActivos();
    }

    /**
     * Obtiene un arreglo por ID
     *
     * @return array
     */
    public function obtenerTodosporArrIds($arr)
    {
        $obj = new NomTipoMedioContacto();
        return $obj->GetTodosporArrIds($arr);
    }

}//Fin clase

