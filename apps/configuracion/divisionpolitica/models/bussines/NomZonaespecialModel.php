<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Bussines
 * @version    1.0
 */
class NomZonaespecialModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta objeto NomAbrae
     *
     * @param string $denom       Denominación
     * @param int    $tipozona    Tipo de zona
     * @param string $descripcion Descripción
     * @param string $abreviatura Abreviatura
     * @param int    $idpadre     Identificador del padre
     * @param date   $fechaini    Fecha inicio
     * @param date   $fechafin    Fecha fin
     *
     * @return code Código de respuesta
     */
    public function Insertar($denom, $tipozona, $descripcion, $abreviatura, $idpadre, $fechaini, $fechafin)
    {
        $nomZonaespecial = new NomAbrae();
        $nomZonaespecial->denominacion = $denom;
        $nomZonaespecial->idtipoabrae = $tipozona;
        $nomZonaespecial->idabraepadre = $idpadre;
        $nomZonaespecial->descripcion = $descripcion;
        $nomZonaespecial->abreviatura = $abreviatura;
        $nomZonaespecial->fechaini = $fechaini;
        $nomZonaespecial->fechafin = $fechafin;
        $columnapadre = $nomZonaespecial->getTable()->getColumnNames();
        $columnaid = $columnapadre[0];
        $columnapadre = $columnapadre[3];
        return NomAbrae::insertar($nomZonaespecial, $columnapadre, $columnaid);
    }

    /**
     * Inserta objeto zona de seguridad
     *
     * @param string $denom Denominación
     *
     * @return code Código de respuesta
     */
    public function InsertarZonaSeguridad($denom)
    {
        $nivelestructurazonaseg = $this->integrator->configsecodena->obtenerNivelporURI('zonaseguridad');
        $idpadre = NomAbrae::GetIdAbrePadreZonas($nivelestructurazonaseg);
        $nomZonaespecial = new NomAbrae();
        $nomZonaespecial->denominacion = $denom;
        $nomZonaespecial->idabraepadre = $idpadre;
        $nomZonaespecial->idtipoabrae = $nivelestructurazonaseg; //id del concepto de zona de seguridad

        return NomAbrae::insertarZonaSeguirdad($nomZonaespecial);
    }

    /**
     * Actualiza zona de seguridad
     *
     * @param int    $idabrae Identificador de abrae
     * @param string $denom   Denominación
     *
     * @return code Código de respuesta
     */
    public function ActualizarZonaSeguridad($idabrae, $denom)
    {
        $nomZonaespecial = new NomAbrae();
        $nomZonaespecial = NomAbrae::Buscar($idabrae);
        $nomZonaespecial->denominacion = $denom;
        return NomAbrae::modificar($nomZonaespecial);
    }


    /**
     * Elimina zona de seguridad
     *
     * @param int $idzonaespecial Identificador zona especial
     *
     * @return code Código de respuesta
     */
    public function EliminarZonaSeguridad($idzonaespecial)
    {
        return NomAbrae::eliminarAbraeZonaSeguridad($idzonaespecial);
    }

    /**
     * Actualiza zona especial
     *
     * @param int    $idzonaespecial Identificador zona especial
     * @param string $denom          Denominación
     * @param string $tipozona       Tipo de zona
     * @param string $descripcion    Descripción
     * @param string $abreviatura    Abreviatura
     * @param date   $fechaini       Fecha inicio
     * @param date   $fechafin       Fecha fin
     *
     * @return code Código de respuesta
     */
    public function Actualizar($idzonaespecial, $denom, $tipozona, $descripcion, $abreviatura, $fechaini, $fechafin)
    {
        $nomZonaespecial = new NomAbrae();
        $nomZonaespecial = NomAbrae::Buscar($idzonaespecial);
        $columnapadre = $nomZonaespecial->getTable()->getColumnNames();
        //$columnaid = $columnapadre[0];
        $columnapadre = $columnapadre[3];
        if ($nomZonaespecial->denominacion != trim($denom)) {
            $objvalidators = new NomencladoresValidator();
            if ($objvalidators->validarDenominacionArbolAbrae(
                trim($denom), $nomZonaespecial->idabrae, $nomZonaespecial->idabraepadre
            )
            ) {
                $nomZonaespecial->denominacion = trim($denom);
                $nomZonaespecial->descripcion = $descripcion;
                $nomZonaespecial->abreviatura = $abreviatura;
                $nomZonaespecial->fechaini = $fechaini;
                $nomZonaespecial->fechafin = $fechafin;
                return NomAbrae::modificar($nomZonaespecial);
            } else {
                throw new ZendExt_Exception('NCI12');
            }
        } else {
            $nomZonaespecial->denominacion = trim($denom);
            $nomZonaespecial->descripcion = $descripcion;
            $nomZonaespecial->abreviatura = $abreviatura;
            $nomZonaespecial->fechaini = $fechaini;
            $nomZonaespecial->fechafin = $fechafin;
            return NomAbrae::modificar($nomZonaespecial);
        }
    }

    /**
     * Obtiene un NomAbrae
     *
     * @param int $idzonaespecial Identificador de zona especial
     *
     * @return array
     */
    public function getNomZonaespecial($idzonaespecial)
    {
        $nomZonaespecial = new NomAbrae();

        $nomZonaespecial = NomAbrae::Buscar($idzonaespecial);

        return $nomZonaespecial;
    }

    /**
     * Obtiene los hijos de una zona especial
     *
     * @param int $idzonaespecial Identificador de zona especial
     *
     * @return array
     */
    public function getHijos($idzonaespecialpadre)
    {
        return NomAbrae::getHijos($idzonaespecialpadre);
    }

    /**
     * Obtiene todas las zonas de seguridad
     *
     * @return array
     */
    public function getZonasSeguridad()
    {
        return NomAbrae::GetAllZonasSeguridad();
    }

    /**
     * Obtiene todas las zonas de seguridad dado el ID del padre
     *
     * @param int $idzonaespecialpadre Identificador de zona especial del padre
     * @param int $limit               Límite superior
     * @param int $start               Comienzo inferior
     *
     * @return array
     */
    public function getArrayZonaespecial($idzonaespecialpadre, $limit, $start)
    {
        $resultado = NomAbrae::GetPorLimite($idzonaespecialpadre, $limit, $start);

        return $resultado;
    }

    /**
     * Obtiene todas las zonas de seguridad dado el ID del padre
     *
     * @param int   $idzonaespecialpadre Identificador de zona especial del padre
     * @param mixed $con
     *
     * @return code Código de respuesta
     */
    public function Eliminar($idzonaespecial, $con)
    {
        return NomAbrae::eliminar($idzonaespecial, $con);
    }

    /**
     * Obtiene todas los Abrae pertenecientes a un nivel estructural definido por el ID padre
     *
     * @param string $concepto Concepto
     * @param int    $idpadre  Identificador del padre
     *
     * @return array
     */
    public function getAllAbraePerteneceNivel($concepto, $idpadre)
    {
        return NomAbrae::GetAllAbraeNivelextructural($concepto, $idpadre);
    }

    /**
     * Obtiene todas los Abrae pertenecientes a un nivel estructural definido por el ID padre por límites
     *
     * @param string $concepto Concepto
     * @param int    $idpadre  Identificador del padre
     * @param int    $limit    Límite superior
     * @param int    $start    Comienzo inferior
     *
     * @return array
     */
    public function getPorLimiteAbraePerteneceNivel($concepto, $idpadre, $limit, $start)
    {
        return NomAbrae::GetPorLimiteAbraeNivelextructural($concepto, $idpadre, $limit, $start);
    }

}

