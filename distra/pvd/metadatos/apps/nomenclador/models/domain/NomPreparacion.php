<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomPreparacion extends BaseNomPreparacion
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCargo', array('local' => 'idpreparacion', 'foreign' => 'idpreparacion'));
    }

    /**
     * Descripción del método: Busca todos los datos de las preparaciones visibles existentes
     *
     * @author    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de las preparaciones
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomPreparacion')->where("fechafin IS NULL AND visible = 1 AND actual = 1")
                        ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Tipomedio
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param    int $idPreparacion , id de la tabla concepto
     *
     * @return \Doctrine_Collection : mixed Retorna un arreglo con los elementos encontrados
     * @copyright Copyright (c)2013 xetid
     */
    static function buscar($idPreparacion)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomPreparacion')->where('idpreparacion = ?', $idPreparacion)->setHydrationMode(
                           Doctrine::HYDRATE_ARRAY
        )->execute();

        return $resultado;
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con la misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param      $denominacion
     * @param bool $modificar
     * @param int  $idPreparacion
     *
     * @return bool : bool Devuelve la cantidad de instancias encontradas
     * @copyright Copyright (c) 2014 xetid
     */
    function existeDenominacion($denominacion, $modificar = false, $idPreparacion = 1)
    {
        if ($modificar) {
            $object = Doctrine::getTable('NomPreparacion')->find($idPreparacion);
            $denom = $object->denominacion;
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomPreparacion')->where(
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
     * Descripción del método: Verifica si la preparacion especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param    int $id , id del elemento a saber si esta en uso
     *
     * @return bool Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c)2013 xetid
     */
    static function verificarUsoPreparacion($id)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatCargo')->where("idpreparacion = $id")->execute()->count();

        return $resultado > 0;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Categoria
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con las categorias
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
        $query->from('NomPreparacion')->where($where)->orderBy('idpreparacion');
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