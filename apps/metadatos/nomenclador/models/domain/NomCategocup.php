<?php

/**
 * Class NomCategocup
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomCategocup extends BaseNomCategocup
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCargocivil', array('local' => 'idcategocup', 'foreign' => 'idcategocup'));
        $this->hasMany('NomCargo', array('local' => 'idcategocup', 'foreign' => 'idcategocup'));
        $this->hasOne('NomCategoria', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
    }

    /**
     * Descripción del método: Busca todos los datos de las categorias visibles existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de las categorias
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->select('ocup.*, categ.denominacion s categoria')->from('NomCategocup ocup')->innerJoin(
                        'ocup.NomCategoria categ'
        )->where("ocup.visible = 1 AND ocup.actual = 1 AND ocup.fechafin IS NULL")->setHydrationMode(
                        Doctrine ::HYDRATE_ARRAY
            )->execute();

        return $result;
    }

    /**
     * Descripción del método: Busca si existe una categorias ocupacionales con una denominacion especificada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $denominacion
     *
     * @return bool : bool, Devuelve true o false
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion)
    { 
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomCategocup')->where(
                           "fechafin IS NULL AND LOWER(denominacion) = LOWER
        ('$denominacion')"
        )->execute()->count();
       
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Verifica si la categoria ocupacional esta siendo usada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $id
     *
     * @return bool : bool, Retorna true si la categoria ocupacional esta en uso
     * @copyright Copyright (c) 2013 xetid
     */
    static function verificarUsoCategoria($id)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatCargocivil')->where("idcategocup = $id")->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Categoria ocupacional
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con las categorias ocupacionales
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
        $query->from('NomCategocup')->where($where)->orderBy('idcategocup');
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