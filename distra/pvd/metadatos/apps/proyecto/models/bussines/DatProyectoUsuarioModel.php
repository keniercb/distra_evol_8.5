<?php

/**
 * Class DatProyectoUsuarioModel
 */
class DatProyectoUsuarioModel extends ZendExt_Model
{
    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Descripción del método: Inserta un nuevo proyecto
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $idproyecto
     * @param      $idresponsable
     * @param      $idusuarios
     *
     * @return bool : boolm Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idproyecto, $idresponsable, $idusuarios)
    {
        foreach ($idusuarios as $id) {
            $object = Doctrine::getTable('DatProyectoUsuario')->find(array($idproyecto, $id, $idresponsable));
            if (!is_object($object)) {
                $object = new DatProyectoUsuario();
                $object->idproyecto = $idproyecto;
                $object->idresponsable = $idresponsable;
                $object->idusuario = $id;
                $object->save();
            }
        }

        return true;
    }

    /**
     * @param $idproyecto
     * @param $idusuario
     *
     * @return bool
     */
    static function actualizar($idproyecto, $idusuario)
    {
        $object = Doctrine::getTable('DatProyectoUsuario')->findByDql(
                          "idproyecto = $idproyecto AND idusuario = $idusuario"
        )->getFirst();
        if (is_object($object)) {
            $object->nuevo = 0;
            $object->save();

            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Elimina un proyecto especificado segun el id
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $idproyecto
     * @param      $idresponsable
     * @param      $idusuarios
     *
     * @return bool : bool, Elimina la instancia de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($idproyecto, $idresponsable, $idusuarios)
    {
        foreach ($idusuarios as $id) {
            $object = Doctrine::getTable('DatProyectoUsuario')->find(array($idproyecto, $id, $idresponsable));
            if (is_object($object)) {
                $object->delete();
            }
        }

        return true;
    }

    /***
     * Descripción del método: Devuelve la cantidad de proyectos pos usuario y proyecto
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return int Retorna la cantidad de proyectos que cumplen con el filtro
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
        $usuario = $data[usuario];
        $where = "c.idproyecto = 0 OR c.idusuario = $usuario";
        if (count($data[0]) > 0) {
            $valores = $data[0][0];
            $denominacion = $valores->denominacion;
            if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
                $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->from('DatProyectoUsuario c')->where($where)->execute()->count();

        return $result;
    }

    /**
     * Descripción del método: Busca uno o varios proyectos
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite buscar uno o varios elemento en la base de datos atendiendo a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscar($data)
    {
        $usuario = $data[usuario];
        $limit = $data[0];
        $start = $data[1];
        $data = $data[2];
        $valores = $data[0];
        $denominacion = $valores->denominacion;
        $where = "(c.idproyecto = 0 OR c.idusuario = $usuario)";
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
            $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        $query = Doctrine_Query::create();
        $result = $query->select(
                        'c.*,
                                                    ((SELECT COUNT(p.idproyecto)
                                                              FROM DatProyectoUsuario p
                                                              WHERE p.idpadre = c.idproyecto ) > 0) AS fusionado
                                          '
        )->from('DatProyectoUsuario c')->where($where)->orderBy('c.idproyecto')->limit($limit)->offset(
                        $start
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Descripción del método: Busca uno o varios usuarios asignados a un proyecto
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idproyecto
     * @param $idusuario
     *
     * @return bool : Permite buscar uno o varios usuarios asignados al proyecto especificado
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameUsuariosPorProyecto($idproyecto, $idusuario)
    {
        $query = Doctrine_Query::create();
        $result = $query->select("pu.idusuario as id")->from('DatProyectoUsuario pu')->where(
                        "pu.idproyecto = $idproyecto"
        )->addWhere("pu.idresponsable = $idusuario")->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Descripción del método: Busca los identificadores de los proyectos que han sido
     * asignados o enviados al|por usuario
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idusuario
     * @param $enviado
     *
     * @return ARRAY : Busca los identificadores de los royectos que han sido asignados al usuario
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameProyectosAsignadosEnviados($idusuario, $enviado = false)
    {
        $query = Doctrine_Query::create();
        $query->from('DatProyectoUsuario pu');
        if ($enviado) {
            $query->addWhere("pu.idresponsable = $idusuario");
        } else {
            $query->addWhere("pu.idusuario = $idusuario");
        }
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * @param      $idusuario
     * @param      $idproyecto
     * @param bool $enviado
     *
     * @return Doctrine_Collection
     */
    public static function dameAsignacionesPorProyectoUsuario($idusuario, $idproyecto, $enviado = false)
    {
        $query = Doctrine_Query::create();
        $query->from('DatProyectoUsuario pu')->addWhere("pu.idproyecto = $idproyecto");
        if ($enviado) {
            $query->addWhere("pu.idresponsable = $idusuario");
        } else {
            $query->addWhere("pu.idusuario = $idusuario");
        }
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * @param $idproyecto
     *
     * @return Doctrine_Collection
     */
    public static function dameAsignacionesPorProyecto($idproyecto)
    {
        $query = Doctrine_Query::create();
        $query->from('DatProyectoUsuario pu')->addWhere("pu.idproyecto = $idproyecto");
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }
}