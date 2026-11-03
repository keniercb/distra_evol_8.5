<?php

/**
 * Class NomTipomedio
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomTipomedio extends BaseNomTipomedio
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatMedio', array('local' => 'idtipomedio', 'foreign' => 'idtipomedio'));
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
        $resultado = $query->from('NomTipomedio')->addWhere("fechafin IS NULL and visible = 1")->setHydrationMode(
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
            $object = Doctrine::getTable('NomTipomedio')->find($idTipoMedio);
            $denom = $object->denominacion;
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomTipomedio')->where(
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
    static function verificarUsoTipoMedio($id)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatMedio')->where("idtipomedio = $id")->execute()->count();
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
        $query->from('NomTipomedio')->where($where)->orderBy('idtipomedio');
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
        $query->select('*,idtipomedio as id')->from('NomTipomedio')->where($where)->orderBy('idtipomedio');
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
            $query->addWhere("idtipomedio in ($restricciones)");
        }
        $resultado = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $resultado;
    }

    public function getDenominacion($idNomTipo)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->select('denominacion')->from('NomTipomedio')->where("idtipomedio = ?", $idNomTipo)
                           ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $resultado;
    }
}