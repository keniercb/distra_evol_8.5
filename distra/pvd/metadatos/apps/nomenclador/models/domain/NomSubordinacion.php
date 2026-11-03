<?php

/**
 * Class NomSubordinacion
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomSubordinacion extends BaseNomSubordinacion
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
             'DatSubordinacion', array('local' => 'idnomsubordinacion', 'foreign' => 'idnomsubordinacion')
        );
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con la denominación especificada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $denominacion
     *
     * @return bool : bool Devuelve si existen instancias encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomSubordinacion')->where(
                           "fechafin IS NULL AND LOWER(denominacion) = LOWER
        ('$denominacion')"
        )->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Verifica si el un tipo de subordinacion especificado
     * esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $idSubordiancion
     *
     * @return bool : bool, Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c) 2013 xetid
     */
    static function verificarUsoSubordinacion($idSubordiancion)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatSubordinacion')->where("idnomsubordinacion = $idSubordiancion")->execute()->count(
        );
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Subordinacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool|string $valor
     * @param int         $limit
     * @param int         $offset
     *
     * @internal  param bool $closed
     * @return mixed : mixed, Retorna un arreglo con las subordinaciones
     * @copyright Copyright (c) 2013 xetid
     */
    static public function dameTodos($valor = false, $limit = 10, $offset = 0)
    {
        $where = "visible = 1";
        if ($valor != "false") {
            $where .= " AND (LOWER(denominacion) like LOWER('%$valor%')";
            $where .= " OR LOWER(abreviatura) like LOWER('%$valor%'))";
        }
        $query = Doctrine_Query::create();
        $query->from('NomSubordinacion')->where($where)->orderBy('idnomsubordinacion');
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