<?php

/**
 * Class NomNormaJuridica
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomNormaJuridica extends BaseNomNormaJuridica
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomCargo', array('local' => 'idnormajuridica', 'foreign' => 'idnormajuridica'));
    }

    /**
     * Descripción del método: Busca todos los tipos de medios existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con los datos de los tipos de medio
     * @copyright Copyright (c) 2013 xetid
     */
    static public function buscarTipoMedio()
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomNormaJuridica')->addWhere("fechafin IS NULL and visible = 1")->setHydrationMode(
                           Doctrine::HYDRATE_ARRAY
        )->execute();

        return $resultado;
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con una misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param      $denominacion
     * @param bool $modificar
     * @param int  $idTipoMedio
     *
     * @return bool : bool Devuelve TRUE en caso de que existan instancias con dicha denominacion
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion, $modificar = false, $idTipoMedio = 1)
    {
        if ($modificar) {
            $object = Doctrine::getTable('NomNormaJuridica')->find($idTipoMedio);
            $denom = $object->denominacion;
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomNormaJuridica')->where(
                               "fechafin IS NULL AND LOWER(denominacion) = LOWER
            ('$denominacion')"
            )->execute()->count();
            if ($resultado > 0) {
                return true;
            }

            return false;
        }
    }

    /**
     * Descripción del método: Verifica si el tipo de medio especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $id , id del elemento a saber si esta en uso
     *
     * @return bool : bool Retorna TRUE o FALSE en correspondencia si esta en uso o no
     * @copyright Copyright (c) 2013 xetid
     */
    static function verificarUsoNormaJuridica($id)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomCargo')->where("idnormajuridica = $id")->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Tipo de Medio
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con los tipos de medio
     * @copyright Copyright (c) 2013 xetid
     */
    static public function dameCantTodos($closed = false, $valor = false)
    {
        $where = "1 = 1";
        if (!is_bool($valor)) {
            $where .= " AND (LOWER(denominacion) like LOWER('%$valor%')";
            $where .= " OR LOWER(abreviatura) like LOWER('%$valor%'))";
        }
        $query = Doctrine_Query::create();
        $query->from('NomNormaJuridica')->where($where)->orderBy('idnormajuridica');
        if ($closed) {
            $query->addWhere("fechafin IS NOT NULL");
        } else {
            $query->addWhere("fechafin IS NULL AND actual = 1 AND visible = 1");
        }
        $resultado = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return count($resultado);
    }

    static public function dameTodos($closed = false, $valor = false, $limit = 10, $offset = 0, $restricciones = false)
    {
        $where = "1 = 1";
        if (!is_bool($valor)) {
            $where .= " AND (LOWER(denominacion) like LOWER('%$valor%')";
            $where .= " OR LOWER(abreviatura) like LOWER('%$valor%'))";
        }
        $query = Doctrine_Query::create();
        $query->select('*,idnormajuridica as id')->from('NomNormaJuridica')->where($where)->orderBy('idnormajuridica');
        if ($closed) {
            $query->addWhere("fechafin IS NOT NULL");
        } else {
            $query->addWhere("fechafin IS NULL AND actual = 1 AND visible = 1");
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
        if (!is_bool($restricciones) && $restricciones != "") {
            $query->addWhere("idnormajuridica in ($restricciones)");
        }
        $resultado = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $resultado;
    }

    public function getDenominacion($idNomNorma)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->select('denominacion')->from('NomNormaJuridica')->where("idnormajuridica = ?", $idNomNorma)
                           ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $resultado;
    }

    public static function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNormaJuridica')->where("fechafin IS NULL AND visible = 1 AND actual = 1")
          ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)->execute();

        return $result;
    }
}