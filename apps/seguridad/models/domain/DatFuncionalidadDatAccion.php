<?php

/**
 * @name DatFuncionalidadDatAccion - Clase dominio.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0.0
 */
class DatFuncionalidadDatAccion extends BaseDatFuncionalidadDatAccion
{

    /**
     * @method setUp - Función principal de la clase donde se generan 
     * las relaciones con otros modelos.
     * @return void.
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRecurso', 
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
        $this->hasOne(
            'DatFuncionalidad', 
            array(
                'local' => 'idfuncionalidadasociada',
                'foreign' => 'idfuncionalidad'
            )
        );
        $this->hasOne(
            'DatAccion',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
    }

    /**
     * @method getArrayAccionesByIdFunc - Retorna un listado de las acciones
     *  que estan asociadas a la funcionalidad y el recurso 
     * pasados por parámetros.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $idrecurso - Identificador del recurso.
     * @return array
     */
    public static function getArrayAccionesByIdFunc(
        $idfuncionalidad, $idrecurso
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('fa.idrecurso, fa.idaccion')
            ->from('DatFuncionalidadDatAccion fa')
            ->where(
                "fa.idfuncionalidadasociada = ? and fa.idrecurso = ?",
                array($idfuncionalidad, $idrecurso)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    /**
     * @method eliminarRecursosFuncAccion - Elimina las acciones que pertenecen
     *  a un recurso y una funcionalidad determinada.
     * @param integer $idrecurso  - Identificador del recurso.
     * @param integer $idfuncionalidadasociada - Identificador 
     * de la funcionalidad.
     * @param array $arrayAccEliminar - Arreglo de identificadores de acciones.
     * @return void
     */
    public static function eliminarRecursosFuncAccion(
        $idrecurso, $idfuncionalidadasociada, $arrayAccEliminar
    )
    {

        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatFuncionalidadDatAccion fa')
            ->where(
                "fa.idfuncionalidadasociada = ? and fa.idrecurso = ?", 
                array($idfuncionalidadasociada, $idrecurso)
            )
            ->whereIn('idaccion', $arrayAccEliminar)
            ->execute();
    }



    /**
     * @method eliminarRecursosAccion - Elimina las acciones de un 
     * recurso determinado.
     * @param integer $idrecurso  - Identificador del recurso.
     * @param array $arrayNodesElim  - Arreglo de identificadores de acciones.
     * @return void
     */
    public static function eliminarRecursosAccion($idrecurso, $arrayNodesElim)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatFuncionalidadDatAccion fa')
            ->where("fa.idrecurso = ?", $idrecurso)
            ->whereIn('idaccion', $arrayNodesElim)
            ->execute();
    }

    /**
     * @method getArrayAccionesByIdRecurso - Retorna un listado con todas 
     * las acciones que pertenecen a un recurso.
     * @param integer $idrecurso  - Identificador del recurso.
     * @return array
     */
    public static function getArrayAccionesByIdRecurso($idrecurso)
    {
        $query = Doctrine_Query::create();
        return $query->select('fa.idaccion')
            ->from('DatFuncionalidadDatAccion fa')
            ->where("fa.idrecurso = ?", $idrecurso)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @method obtenerAccionesByArrayIdsRecursos - Retorna un listado 
     * de acciones.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param array $arrayRecursos - Arreglo de identificadores de recursos.
     * @return array
     */
    public static function obtenerAccionesByArrayIdsRecursosI(
        $idfuncionalidad, $arrayRecursos
    )
    {
//        var_dump("1");
        $datos1 = self::obtenerAccionesByArrayIdsRecursos($idfuncionalidad, $arrayRecursos);
//        var_dump("2");
        $datos2 = self::obtenerAccionesHeredadasByArrayIdsRecursos($idfuncionalidad, $arrayRecursos);
//        var_dump("3");
        $datos = array_merge($datos1,$datos2);
//        var_dump("4");

//        var_dump("\n...........Viendo los resultados datos1......................");
//        var_dump("\n........................................");
//        var_dump($datos1);
//        var_dump("\n........................................");
//        var_dump("\n...........datos2......................");
//        var_dump("\n........................................");
//        var_dump($datos2);
//        var_dump("\n........................................");
//        var_dump("\n...........datos......................");
//        var_dump("\n........................................");
//        var_dump($datos);
//        var_dump("\n........................................");
//        die();
        return $datos;
    }

    public static function obtenerAccionesByArrayIdsRecursos(
        $idfuncionalidad, $arrayRecursos
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso,a.idaccion, fa.idaccion')
            ->from('DatFuncionalidadDatAccion fa')
            ->innerjoin('fa.DatRecurso r')
            ->innerjoin('fa.DatAccion a')
            ->where("r.idfuncionalidad = ?", $idfuncionalidad)
            ->whereIn('r.idrecurso', $arrayRecursos)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    public static function obtenerAccionesHeredadasByArrayIdsRecursos(
        $idfuncionalidad, $arrayRecursos
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso,a.idaccion, fa.idaccion')
            ->from('DatFuncionalidadDatAccion fa')
            ->innerjoin('fa.DatRecurso r')
            ->innerjoin('fa.DatAccion a')
            ->innerjoin('r.DatRecursoFuncionalidad rf')
            ->where("rf.idfuncionalidad = ?", $idfuncionalidad)
            ->whereIn('r.idrecurso', $arrayRecursos)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    /**
     * @method getAllRoleResourse - Retorna un listado con todos los 
     * recursos que pertenecen a los roles.
     * @param array $arrayIds - Arreglo de identificadores de roles.
     * @return array
     */
    public static function getAllRoleResourse($arrayIds)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            "f.referencia as url, a.denominacion as accion, a.idaccion, "
            . "f.idfuncionalidad, r.idrecurso, fa.idrecurso"
        )
            ->from('DatFuncionalidadDatAccion fa')
            ->innerjoin('fa.DatRecurso r ON (r.idrecurso = fa.idrecurso)')
            ->innerjoin(
                'fa.DatFuncionalidad f '
                . 'ON (fa.idfuncionalidadasociada = f.idfuncionalidad)'
            )
            ->innerjoin('fa.DatAccion a ON (fa.idaccion = a.idaccion)')
            ->where(
                "r.idrecurso IN (SELECT DISTINCT srfa.idrecurso "
                . "FROM DatSistemaSegRolDatFuncionalidadDatAccion srfa "
                . "WHERE srfa.idrol IN (" . implode(',', $arrayIds) . ") )"
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

}