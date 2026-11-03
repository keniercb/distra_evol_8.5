<?php

/**
 * Created by PhpStorm.
 * User: Javier
 * Date: 18/04/15
 * Time: 9:59
 */
class NomFirmaModel extends ZendExt_Model
{
    /***
     * Descripción del método: Devuelve la cantidad de cargos segun los filtros de busqueda
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return int Retorna la cantidad de cargos que cumplen con el filtro
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
        $where = '1=1';
        if (count($data) > 1) {
            $valores = $data[1];
            $denominacion = $valores->denominacion;
            $abreviatura = $valores->abreviatura;
            $iddominio = $valores->iddominio;
            if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
                $where .= " AND LOWER(c.persona) LIKE LOWER ('%$denominacion%')";
            }
            if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
                $where .= " AND LOWER(c.persona) LIKE LOWER ('%$abreviatura%')";
            }
            if (!empty($iddominio) && $iddominio != "Criterio a buscar...") {
                $where .= " AND c.iddominio = $iddominio";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->from('NomFirma c')->where($where)->execute()->count();
        return $result;
    }

    /**
     * Descripción del método: Busca uno o varios cargos
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite buscar uno o varios elemento en la base de
     * datos atendiendo a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $limit = $data[0];
        $start = $data[1];
        $dir = $data[3];
        $sort = $data[4];
        if ($sort === 'cargo') {
            $sort = 'denominacion';
            $esquema = "gc." . $sort;
        } else {
            if ($sort === 'persona') {
                $sort = 'persona';
                $esquema = "c." . $sort;
            } else {
                $esquema = "gc." . $sort;
            }
        }
        $campo = ($sort != "") ? $esquema : 'c.idfirma';
        $orden = ($dir === "ASC") ? " ASC" : " DESC";
        $data = $data[2];
        $valores = $data[1];
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        $iddominio = $valores->iddominio;
        $where = "1=1";
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
            $where .= " AND LOWER(gc.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
            $where .= " AND LOWER(c.persona) LIKE LOWER ('%$abreviatura%')";
        }
        if (!empty($iddominio) && $iddominio != "Criterio a buscar...") {
            $where .= " AND c.iddominio = $iddominio";
        }
        $query = Doctrine_Query::create();
        $result = $query->select('c.*,gc.denominacion as cargo, c.idfirma as id, nd.denominacion as dominio')
            ->from('NomFirma c')
            ->leftJoin("c.NomCargo gc")
            ->innerJoin("c.NomDominio nd")
            ->where($where)
            ->orderBy(
                $campo . $orden
            )->limit($limit)->offset($start)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    /**
     * Descripción del método: Inserta un nuevo cargo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $data
     *
     * @return bool : boolm Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    function insertar($data)
    {
        $firmaObject = new NomFirma();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $valores = $data[2];
        $fechainicio = $valores->fechainicio;
        $fechafin = $valores->fechafin;
        if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
            $actual = 1;
            $visible = 1;
        } else {
            $actual = 0;
            $visible = 0;
        }
        $firmaObject->persona = $valores->persona;
        $firmaObject->idnomcargo = $valores->idnomcargo;
        $firmaObject->actual = $actual;
        $firmaObject->visible = $visible;
        $firmaObject->fechainicio = $valores->fechainicio;
        $firmaObject->fechafin = $valores->fechafin;
        $firmaObject->iddominio = $valores->iddominio;
        $firmaObject->save();
        return TRUE;
    }

    /**
     * Descripción del método: Inserta un nuevo cargo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $data
     *
     * @return bool : boolm Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    function modificar($data)
    {
        $idfirma = $data[0];
        $valores = $data[2];
        $idfirma = $valores->idfirma;
        $fechainicio = $valores->fechainicio;
        $fechafin = ($valores->fechafin != "") ? $valores->fechafin : NULL;
        if (UtilModel::check_in_range($fechainicio, $fechafin)) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        } else {
            if ($valores->fechafin == "") {
                $actual = 1;
                $visible = 1;
            } else {
                $actual = 0;
                $visible = 1;
            }
        }
        $firmaObject = Doctrine::getTable('NomFirma')->find($idfirma);
        $firmaObject->persona = $valores->persona;
        $firmaObject->idnomcargo = $valores->idnomcargo;
        $firmaObject->actual = $actual;
        $firmaObject->visible = $visible;
        $firmaObject->fechainicio = $fechainicio;
        $firmaObject->fechafin = $fechafin;
        $firmaObject->iddominio = $valores->iddominio;
        $firmaObject->save();
        return TRUE;
    }

    /**
     * Descripción del método: Desactiva el cargor especificado atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool  Desactiva o activa el nomenclador
     * @copyright Copyright (c) 2014 xetid
     */
    public function desactivar($data)
    {
        $idfirma = $data[0];
        try {
            $object = Doctrine::getTable('NomFirma')->find($idfirma);
            $object->actual = 0;
            $object->visible = 0;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee) {
            return FALSE;
        }
    }

    /**
     * Descripción del método: Activa el cargo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Activa el nomenclador
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
        $idfirma = $data[0];
        try {
            $object = Doctrine::getTable('NomFirma')->find($idfirma);
            $object->actual = 1;
            $object->visible = 1;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee) {
            return FALSE;
        }
    }

    /**
     * Descripción del método: Elimina la instancia de la tabla atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Elimina la instancia de la tabla
     * @copyright Copyright (c) 2014 xetid
     */
    public function eliminar($data)
    {
        $idfirma = $data[0];
        $object = Doctrine::getTable('NomFirma')->find($idfirma);
        if (is_object($object)) {
            $object->delete();
            return TRUE;
        }
        return FALSE;
    }

    public function getElementsFirma($idFirma)
    {
        $arrayDatos = array();
        $query = Doctrine_Query::create();
        $result = $query->select('nf.persona,nc.denominacion as cargo')->from('NomFirma nf')->leftJoin("nf.NomCargo nc")
            ->where("nf.idfirma = $idFirma")->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $arrayDatos['persona'] = $result[0]['persona'];
        $arrayDatos['cargo'] = $result[0]['cargo'];
        return $arrayDatos;
    }

    public function getDominiosHijos()
    {
        $idpadre = $this->global->Perfil->iddominio;

        if ($idpadre) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "
            SELECT iddominio, denominacion
            FROM mod_estructuracomp.nom_dominio
            WHERE idpadre = $idpadre
            order by denominacion";
            return $conn->fetchAll($sql);
        }
        return [];
    }
}
