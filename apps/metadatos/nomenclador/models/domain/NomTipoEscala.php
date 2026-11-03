<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomTipoEscala extends BaseNomTipoEscala
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomEscalaSalarial', array('local' => 'idtipoescala', 'foreign' => 'idtipoescala'));
    }

    /**
     * Descripción del método: Busca todos los datos de las escalas visibles existentes
     *
     * @author    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de las escalas
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipoEscala')->where("visible = 1 AND actual = 1")->orderBy('idtipoescala')
                        ->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
            )->execute();

        return $result;
    }

    /**
     * @return Doctrine_Collection
     */
    public static function dameTodosVisiblesInEscalaSalarial()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomTipoEscala te')->innerJoin('te.NomEscalaSalarial es')->where(
                        "es.fechafin IS NULL AND es.visible = 1 AND te.visible = 1 AND te.fechafin IS NULL "
        )->orderBy('te.idtipoescala')->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con la misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param      $denominacion
     * @param bool $modificar
     * @param int  $idEscala
     *
     * @return bool : bool Devuelve la cantidad de instancias encontradas
     * @copyright Copyright (c) 2014 xetid
     */
    function existeDenominacion($denominacion, $modificar = false, $idEscala = 1)
    {
        if ($modificar) {
            $object = Doctrine::getTable('NomTipoEscala')->find($idEscala);
            $denom = $object->denominacion;
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomTipoEscala')->where("LOWER(denominacion) = LOWER('$denominacion')")->execute()
                               ->count();
            if ($resultado > 0) {
                return true;
            }

            return false;
        }
    }

    /**
     * Descripción del método: Verifica si la escala especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param    int $id , id del elemento a saber si esta en uso
     *
     * @return bool Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c)2013 xetid
     */
    static function verificarUsoEscala($id)
    {
        $query = Doctrine_Query::create();
        $estructura = $query->from('DatEstructura')->where("idtipoescala = $id")->execute()->count();
        $escala = $query->from('NomEscalaSalarial')->where("idtipoescala = $id")->execute()->count();

        return ($estructura + $escala) > 0;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Tipo de Escala
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con los Tipos de Escala
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
        $query->from('NomTipoEscala')->where($where)->orderBy('idtipoescala');
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