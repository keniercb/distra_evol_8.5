<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomOrgano extends BaseNomOrgano
{
    /**
     *test
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEstructuraop', array('local' => 'idorgano', 'foreign' => 'idorgano'));
        $this->hasMany('DatEstructura', array('local' => 'idorgano', 'foreign' => 'idorgano'));
        $this->hasOne('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Organo
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $idconcepto
     * @param bool $grafica
     * @param int  $limit
     * @param int  $offset
     * @param bool $restricciones
     *
     * @return mixed : mixed, Retorna un arreglo con los elementos encontrados
     * @copyright Copyright (c)2013 xetid
     */
    static function dameOrganoPorTipo($idconcepto, $grafica = false, $limit = 10, $offset = 0, $restricciones = false)
    {
        $query = Doctrine_Query::create();
        if (!$grafica) {
            $idconcepto = ($idconcepto == 3 || $idconcepto == 4) ? 1 : $idconcepto;
        }
        $result = $query->select('*,idorgano as id')->from('NomOrgano')->where(
                        'fechafin IS NULL AND idconcepto =
                                ?', $idconcepto
        )->addWhere(
                        'visible = 1'
            );
        if (!is_bool($restricciones) && $restricciones != "") {
            $result->addWhere("idorgano in ($restricciones)");
        }
        $resultado = $result->limit($limit)->offset($offset)->setHydrationMode
            (Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $resultado;
    }

    static function dameCantOrganoPorTipo($idconcepto, $grafica = false)
    {
        $query = Doctrine_Query::create();
        if (!$grafica) {
            $idconcepto = ($idconcepto == 3 || $idconcepto == 4) ? 1 : $idconcepto;
        }
        $resultado = $query->from('NomOrgano')->where('fechafin IS NULL AND idconcepto = ?', $idconcepto)->addWhere(
                           'visible =1'
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return count($resultado);
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con una misma denominacion
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $denominacion
     * @param      $tipo id de la tabla concepto con la cual se asocia el organo
     * @param bool $modificar
     * @param bool $idorgano
     *
     * @return bool : Devuelve la cantidad de instancias encontradas
     * @copyright Copyright (c)2013 xetid
     */
    function existeDenominacion($denominacion, $tipo, $modificar = false, $idorgano = false)
    {
        if ($modificar) {
            $object = Doctrine::getTable('NomOrgano')->findByDql("idorgano = $idorgano AND idconcepto = $tipo")
                              ->getFirst();
            $denom = Util::fixTitle($object->denominacion);
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion, $tipo);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomOrgano')->where(
                               "fechafin IS NULL AND LOWER(denominacion) = LOWER('$denominacion')"
            )->addWhere("idconcepto = $tipo")->execute()->count();
            if ($resultado > 0) {
                return true;
            }

            return false;
        }
    }

    /**
     * Descripción del método: Verifica si el grado especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $idorgano   , id del elemento a saber si esta en uso
     * @param $idconcepto , id de la tabla concepto que se corresponde con Organo
     *
     * @return bool : bool, Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c) 2014 xetid
     */
    static function verificarUsoOrgano($idorgano, $idconcepto)
    {
        $query = Doctrine_Query::create();
        if ($idconcepto == 1) {
            $idconcepto = '1,3,4';
        }
        $resultado = $query->from('DatEstructura')->where("idorgano = $idorgano AND idconcepto IN ($idconcepto)")
                           ->execute()->count();
        $resultadoInterno = $query->from('DatEstructuraop')->where(
                                  "idorgano = $idorgano AND idconcepto IN ($idconcepto)"
        )->execute()->count();

        return ($resultado + $resultadoInterno) > 0;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Organo
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param bool|int    $idconcepto
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con los elementos almacenados en la tabla de organos
     * @copyright Copyright (c) 2013 xetid
     */
    static public function dameTodos($closed = false, $idconcepto = false, $valor = false, $limit = 10, $offset = 0)
    {
        $where = "1 = 1";
        if (!is_bool($valor)) {
            $where .= " AND (LOWER(denominacion) like LOWER('%$valor%')";
            $where .= " OR LOWER(abreviatura) like LOWER('%$valor%'))";
        }
        if (is_numeric($idconcepto)) {
            $where .= " AND idconcepto = $idconcepto";
        }
        $query = Doctrine_Query::create();
        $query->from('NomOrgano')->where($where)->orderBy('idorgano');
        if ($closed) {
            $query->addWhere("fechafin IS NOT NULL");
        } else {
            $query->addWhere("fechafin IS NULL");
        }
        if (is_numeric($limit)) {
            $query->limit($limit);
        }
        if (is_numeric($limit)) {
            $query->limit($limit);
        }
        if (is_numeric($offset)) {
            $query->offset($offset);
        }
        $resultado = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $resultado;
    }

    public function  getDenominacionByConcepto($idConcepto, $idOrgano)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->Select('denominacion')->from('NomOrgano')->where(
                           'fechafin IS NULL AND idconcepto = ?', $idConcepto
        )->addWhere('visible =1')->addWhere('idorgano =?', $idOrgano)->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                           ->execute();

        return $resultado;
    }
}