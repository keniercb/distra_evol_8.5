<?php

/**
 * Class NomencladorService
 * Descripción de la clase: Empleada a realizar una llamado de los servicios de los nomencladores
 *
 * @author    : Ing. Javier Limonta
 * @modify    : Ing. Pedro Alonso
 * @modify    : Ing. Daymel Machado
 * @modify    : Ing. Osvaldo M. Gonzalez
 * @copyright Copyright (c) 2013 xetid
 */
class NomencladorService extends ZendExt_Model
{
    /**
     *
     */
    function __construct()
    {
    }

    /**
     * Descripción del método: Busca los grados militares existentes
     *
     * @param $limit              , rango de los elementos que se muestran en la interfaz
     * @param $offset             , rango de los elementos que se muestran en la interfaz
     * @param $valor              , Puede ser una denominacion o el identificdor del grado militar
     * @param $idCategoriaMilitar , Identificador de la categoria militar del grado
     * @param $esMarina           , Si es marina o terrestre
     *
     * @return mixed : $result, retorna un arreglo con los grados militares existentes en la base de dato
     * @author     : Ing. Javier Limonta
     * @modify     : Ing. Pedro Alonso
     * @modify     : Ing. Osvaldo M. Gonzalez
     * @copyright  Copyright (c) 2013 xetid
     */
    function buscarGradoMilitar($offset, $limit, $valor, $idCategoriaMilitar, $esMarina)
    {
        $result = NomGrado::buscarGrado($offset, $limit, $valor, $idCategoriaMilitar, $esMarina);
        return $result;
    }

    /**
     * Descripción del método: Busca los cargos existentes
     *
     * @param $limit  , rango de los elementos que se muestran en la interfaz
     * @param $offset , rango de los elementos que se muestran en la interfaz
     * @param $valor  , Puede ser una denominacion o el identificdor del grado militar
     *
     * @return mixed, retorna un arreglo con los cargos existentes en la base de dato
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Pedro Alonso
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarCargo($valor, $limit, $offset)
    {
        $result = NomCargo::dameTodos($valor, $limit, $offset);
        return $result;
    }

    /**
     * @param $query
     *
     * @return mixed
     */
    function getSqlOrgano($query)
    {
        return $query->addSelect('no.idorgano as organo')->innerJoin('e.NomOrgano no');
    }

    /**
     * @param $query
     *
     * @return mixed
     */
    function getSqlNomTipoEscala($query)
    {
        return $query->addSelect('te.denominacion as tipoescala')->innerJoin('e.NomTipoEscala te');
    }

    /**
     * Obtener los datos del cargo
     *
     * @param $query
     *
     * @return mixed
     */
    function getSqlCargo($query)
    {
        return $query->addSelect(
                     'nc.denominacion as denominacion,
                                             nc.idnomcargo as idnomcargo,
                                             nc.abreviatura as abreviatura,
                                             p.denominacion as preparacion,
                                             (
                                                CASE
                                                    WHEN categocup.idcategocup IS NOT NULL THEN 1 ELSE 0
                                                END
                                             ) as civil,
                                             categocup.idcategocup as idcategoria,
                                             categocup.denominacion as categoria,
                                             categoria.denominacion as grupocategoria,
                                             categoria.idcategoria as idgrupocategoria,
                                             ng.denominacion as grado,
                                             ng.idgrado as idgrado,
                                             ng.idcategoriamilitar as idcategoriamilitar,
                                             categmilitar.denominacion as categoriamilitar,
                                             gc.denominacion as grupocomplejidad,
                                             gc.idgrupocomplejidad as idgrupocomplejidad,
                                             e.denominacion as estado,
                                             s.salario as salario'
        )->innerJoin("dc.NomPreparacion p")->innerJoin("dc.NomEstado e")->innerJoin("dc.NomCargo nc")->innerJoin(
                     "dc.NomSalario s"
            )->innerJoin("s.NomGrupocomplejidad gc")->leftJoin("cc.NomCategocup categocup")->leftJoin(
                     "categocup.NomCategoria categoria"
            )->leftJoin("cm.NomGrado ng")->leftJoin("ng.NomCategoriaMilitar categmilitar");
    }

    /**
     * Obtener los conceptos con sus iconos
     *
     * @param $query
     *
     * @return mixed
     */
    function getIconos($query)
    {
        return $query->addSelect('i.denominacion as nombre_imagen, i.icono as icon')->innerJoin('c.NomIcono i');
    }

    /**
     * Obtener los conceptos con sus iconos
     *
     * @param        $query
     *
     * @param        $aliasP
     * @param        $aliasS
     * @param string $join
     *
     * @return mixed
     */
    function getIconosSql($query,$aliasP,$aliasS,$join = "innerJoin")
    {
        return $query->addSelect("$aliasS.denominacion as nombre_imagen, $aliasS.icono as icon")->$join("$aliasP.NomIcono $aliasS");
    }

    /**
     * Descripción del método: Agrega al objeto de Doctrine_Query las tablas de los
     * nomencladore que tienen relacion con DatCargo, DatCargocivil y DatCargomilitar
     *
     * @param Doctrine_Query $objQuery
     * @param string         $aliaReference
     * @param string         $aliaDCC
     * @param string         $aliaDCM
     * @param bool           $includeDqlSelect
     *
     * @return Doctrine_Query
     */
    function agregarDQLCargo(
        Doctrine_Query $objQuery, $aliaReference, $aliaDCC, $aliaDCM, $includeDqlSelect = FALSE
    )
    {
        $aliaP = $aliaReference . 'npre';
        $aliaNC = $aliaReference . 'nc';
        $aliaNGC = $aliaReference . 'gc';
        $aliaNS = $aliaReference . 's';
        $aliaNCO = $aliaDCC . 'categocup';
        $aliaNG = $aliaDCM . 'ng';
        if ($includeDqlSelect) {
            $objQuery->addSelect(
                     "$aliaNC.denominacion as denomcargo,
                        $aliaNC.idnomcargo as idnomcargo,
                        $aliaNC.abreviatura as abreviatura,
                        $aliaP.denominacion as preparacion,
                        $aliaNS.salario as salario,
                        $aliaNCO.denominacion as categoria,
                        $aliaNG.denominacion as grado,
                        $aliaNGC.denominacion as grupocomplejidad"
            );
        }
        $objQuery->leftJoin("$aliaReference.NomPreparacion $aliaP")->leftJoin("$aliaReference.NomCargo $aliaNC")
                 ->leftJoin("$aliaNC.NomGrupocomplejidad $aliaNGC")->leftJoin("$aliaReference.NomSalario $aliaNS")
                 ->leftJoin("$aliaDCC.NomCategocup $aliaNCO")->leftJoin("$aliaDCM.NomGrado $aliaNG");
        return $objQuery;
    }

    /**
     * Descripción del método: Devuelve la dirección fisica del icono del grado
     *
     * @autor     : Ing. Osvaldo Manuel Gonzalez Ortis
     *
     * @param     $idGrado
     *
     * @return string, Devuelve la dirección fisica del icono del grado
     * @copyright Copyright (c) 2013 xetid
     */
    function dameGrado($idGrado)
    {
        return NomGradoModel::dameGrado($idGrado);
    }

    /**
     * Descripción del método: Devuelve la(s) categorías militares
     *
     * @autor     : Ing. Osvaldo Manuel Gonzalez Ortis
     *
     * @param            $idCategoria
     * @param            $start
     * @param            $limit
     *
     * @return array, Lista de categorias militares
     * @copyright Copyright (c) 2013 xetid
     */
    function dameCategoriaMilitar($idCategoria = FALSE, $start = FALSE, $limit = FALSE)
    {
        return NomCategoriaMilitarModel::dameCategorias($idCategoria, $start, $limit);
    }

    /**
     * Descripción del método: Devuelve los grupos de categorías civiles
     *
     * @autor     : Ing. Osvaldo Manuel Gonzalez Ortis
     *
     * @param                   $esSubCategoria
     * @param                   $idCategoria
     * @param                   $start
     * @param                   $limit
     *
     * @return array, Lista de categorias civiles
     * @copyright Copyright (c) 2013 xetid
     */
    function dameCategoriaOcupacional($esSubCategoria = FALSE, $idCategoria = FALSE, $start = FALSE, $limit = FALSE)
    {
        if ($esSubCategoria) {
            return NomCategocupModel::dameCategorias($idCategoria, $start, $limit);
        }
        return NomCategoriaModel::dameCategorias($idCategoria, $start, $limit);
    }

    /**
     * Servicio para obtener las subordinaciones del nomenclador
     *
     * @param $valor
     * @param $limit
     * @param $start
     *
     * @return mixed
     */
    function obtenerSubordinaciones($valor, $limit, $start)
    {
        return NomSubordinacion::dameTodos($valor, $limit, $start);
    }

    /**
     * Servicio para unir consulta de subordinaciones
     *
     * @param $query
     *
     * @return mixed
     */
    function getSqlSubordinaciones($query)
    {
        return $query->addSelect('ns.idnomsubordinacion as iddesubordinacion')->innerJoin('ds.NomSubordinacion ns');
    }

    /**
     * Servicio para obtener los datos de las firmas
     *
     * @param $idFirma
     *
     * @return array
     */
    function getFirma($idFirma)
    {
        $firma = new NomFirmaModel();
        return $firma->getElementsFirma($idFirma);
    }
}





