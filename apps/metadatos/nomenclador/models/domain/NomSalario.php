<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomSalario extends BaseNomSalario
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCargo', array('local' => 'idsalario', 'foreign' => 'idsalario'));
        $this->hasOne(
             'NomGrupocomplejidad', array('local' => 'idgrupocomplejidad', 'foreign' => 'idgrupocomplejidad')
        );
        $this->hasMany('NomEscalaSalarial', array('local' => 'idsalario', 'foreign' => 'idsalario'));
    }

    /**
     * Descripción del método: Busca todos los datos de los salarios segun el
     * grupo de complejidad, visibles existentes
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param $grupoComplejo
     *
     * @return array Retorna un arreglo con todos los datos de los salarios
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodosVisibles($grupoComplejo)
    {
        $query = new Doctrine_Query();
        if (is_array($grupoComplejo)) {
            $where = " AND idgrupocomplejidad = " . $grupoComplejo[0];
        } else {
            $where = (is_numeric($grupoComplejo)) ? " AND idgrupocomplejidad = $grupoComplejo" : '';
        }
        $result = $query->from('NomSalario')->where("visible = 1 AND actual = 1" . $where)->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
        )->execute();

        return $result;
    }

    /**
     * @param $idtipoescala
     * @param $idgrupo
     *
     * @return Doctrine_Collection
     */
    public static function dameTodosVisiblesInEscalaSalarial($idtipoescala, $idgrupo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomSalario s')->innerJoin('s.NomGrupocomplejidad gc')->innerJoin(
                        "s.NomEscalaSalarial es WITH es.idtipoescala = $idtipoescala"
        )->where("s.fechafin IS NULL and s.visible = 1 AND s.idgrupocomplejidad IN ($idgrupo)")->innerJoin(
                        'es.NomTipoEscala e'
            )->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
            )->execute();

        return $result;
    }

    /**
     * Descripción del método: Verifica si el salario especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $idSalario
     *
     * @return bool : bool, Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c) 2013 xetid
     */
    static function verificarUsoSalario($idSalario)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatCargo')->where("idsalario = $idSalario")->execute()->count();
        $escala = $query->from('NomEscalaSalarial')->where("idsalario = $idSalario")->execute()->count();
        if (($resultado + $escala) > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Busca la cantidad de salarios que existen
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $salario
     * @param      $idGrupoComplejidad
     * @param bool $modificar
     * @param int  $idsalario
     *
     * @return bool : bool Devuelve true si existen elementos con las condiciones especificadas
     * @copyright Copyright (c) 2013 xetid
     */
    function existeSalario($salario, $idGrupoComplejidad, $modificar = false, $idsalario = 1)
    {
        if ($modificar) {
            $object = Doctrine::getTable('NomSalario')->find($idsalario);
            $sal = $object->salario;
            $grupo = $object->idgrupocomplejidad;
            if ($sal <> $salario || $grupo <> $idGrupoComplejidad) {
                return $this->existeSalario($salario, $idGrupoComplejidad);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomSalario')->addWhere("fechafin IS NULL")->where(
                               "salario = $salario AND idgrupocomplejidad = $idGrupoComplejidad"
            )->execute()->count();
            if ($resultado > 0) {
                return true;
            }

            return false;
        }
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Salario
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con las Salario
     * @copyright Copyright (c) 2013 xetid
     */
    static public function dameTodos($closed = false, $valor = false, $limit = 10, $offset = 0)
    {
        $where = "1 = 1";
        if (!is_bool($valor)) {
            $where .= " AND CONCAT(salario,'') like LOWER('%$valor%')";
        }
        $query = Doctrine_Query::create();
        $query->from('NomSalario')->where($where)->orderBy('idsalario');
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