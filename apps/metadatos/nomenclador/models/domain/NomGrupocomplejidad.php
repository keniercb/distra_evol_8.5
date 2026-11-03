<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomGrupocomplejidad extends BaseNomGrupocomplejidad
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomSalario', array('local' => 'idgrupocomplejidad', 'foreign' => 'idgrupocomplejidad'));
        $this->hasMany('NomCargo', array('local' => 'idgrupocomplejidad', 'foreign' => 'idgrupocomplejidad'));
        $this->hasMany('NomCondicion', array('local' => 'idgrupocomplejidad', 'foreign' => 'idgrupocomplejidad'));
    }

    /**
     * Descripción del método: Verifica si el grupocomplejidad especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $id , id del elemento a saber si esta en uso
     *
     * @return bool : bool, Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c) 2013 xetid
     */
    static function verificarUsoGrupoComplejidad($id)
    {
        $query = Doctrine_Query::create();
        $condicion = $query->from('NomCondicion c')->where("idgrupocomplejidad = $id")->execute()->count();
        $cargo = $query->from('NomCargo c')->where("idgrupocomplejidad = $id")->execute()->count();
        $salario = $query->from('NomSalario')->where("idgrupocomplejidad = $id")->execute()->count();
        if ($cargo + $salario + $condicion > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Busca todos los datos de los grupos de complejidad visibles existentes
     *
     * @author    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de los grupos de complejidad
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $query->from('NomGrupocomplejidad g');
        $where = '1=1';
        $result = $query->where("g.fechafin IS NULL AND g.visible = 1 AND $where")->orderBy("g.idgrupocomplejidad")
                        ->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
            )->execute();

        return $result;
    }

    /**
     * @return Doctrine_Collection
     */
    public static function dameTodosVisiblesInSalario()
    {
        $query = new Doctrine_Query();
        $query->from('NomGrupocomplejidad g')->innerJoin('g.NomSalario s');
        $result = $query->where("g.visible = 1")->orderBy("g.idgrupocomplejidad")->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
        )->execute();

        return $result;
    }

    public static function dameTodosVisiblesInCargo()
    {
        $query = new Doctrine_Query();
        $query->from('NomGrupocomplejidad g')->innerJoin('g.NomCargo c');
        $result = $query->where("g.fechafin IS NULL AND g.visible = 1")->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                        ->execute();

        return $result;
    }

    /**
     * @return Doctrine_Collection
     */
    public static function dameTodosVisiblesInSalarioEscala()
    {
        $query = new Doctrine_Query();
        $query->from('NomGrupocomplejidad g')->innerJoin('g.NomSalario s')->innerJoin('s.NomEscalaSalarial es');
        $result = $query->where("g.visible = 1")->orderBy("g.idgrupocomplejidad")->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
        )->execute();

        return $result;
    }

    /**
     * Descripción del método:  Busca la cantidad de elementos que existen con la misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param      $denominacion
     * @param bool $modificar
     * @param int  $idGrupoComplejidad
     *
     * @return bool : bool Devuelve la cantidad de instancias encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion, $modificar = false, $idGrupoComplejidad = 1)
    {
        if ($modificar) {
            $object = Doctrine::getTable('NomGrupocomplejidad')->findByDql("idgrupocomplejidad = $idGrupoComplejidad")
                              ->getFirst();
            $denom = $object[0]->denominacion;
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomGrupocomplejidad')->where(
                               "fechafin IS NULL AND LOWER(denominacion) = LOWER
            ('$denominacion')"
            )->execute()->count();

            return $resultado > 0;
        }
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla GRUPO DE COMPLEJIDAD
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con las GRUPO DE COMPLEJIDAD
     * @copyright Copyright (c) 2013 xetid
     */
    static public function dameTodos($closed = false, $valor = false, $limit = 10, $offset = 0)
    {
        $where = "1 = 1";
        if (!is_bool($valor)) {
            $where .= " AND (LOWER(denominacion) like LOWER('%$valor%')";
            $where .= " OR LOWER(abreviatura) like LOWER('%$valor%'))";
        }
        $query = Doctrine_Query::create();
        $query->from('NomGrupocomplejidad')->where($where)->orderBy('idgrupocomplejidad');
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
}