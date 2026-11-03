<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomIcono extends BaseNomIcono
{
    /**
     *
     */
    public function setUp()
    {
        $this->hasMany('NomGrado', array('local' => 'idicono', 'foreign' => 'idicono'));
        $this->hasMany('NomConcepto', array('local' => 'idicono', 'foreign' => 'idicono'));
        parent::setUp();
    }

    /**
     * @param $idicono
     *
     * @return mixed
     */
    static function buscar($idicono)
    {
        $result = Doctrine::getTable('NomIcono')->find($idicono);

        return $result->icono;
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con una misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $denominacion , denominacion del elemento a verificar si existe
     * @param bool $modificar    , valor booleano que especifica si es a la hora de modificar
     * @param int  $idicono      , identificador del icono
     *
     * @return bool : bool Devuelve la cantidad de instancias encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion, $modificar = false, $idicono = 0)
    {
        if ($modificar) {
            $object = Doctrine::getTable('NomIcono')->find($idicono);
            $denom = $object->denominacion;
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion, false, $idicono);
            } else {
                return false;
            }
        } else {
            $query = Doctrine_Query::create();
            $resultado = $query->from('NomIcono')->where(
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
     * Descripción del método: Verifica si el icono especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idicono , Identificador del icono
     *
     * @return bool : bool, Retorna true o false en correspondencia si esta en uso o no
     * @copyright Copyright (c)2013 xetid
     */
    static function verificarUsoIcono($idicono)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatMedio')->where("idicono = $idicono")->execute()->count();
        $resultado += $query->from('NomConcepto')->where("idicono = $idicono")->execute()->count();
        $resultado += $query->from('NomGrado')->where("idicono = $idicono")->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Icono
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con los Icono
     * @copyright Copyright (c) 2013 xetid
     */
    static public function dameTodos($closed = false, $valor = false, $limit = 10, $offset = 0)
    {
        $where = "1 = 1";
        if (!is_bool($valor)) {
            $where .= " AND LOWER(denominacion) like LOWER('%$valor%')";
        }
        $query = Doctrine_Query::create();
        $query->from('NomIcono')->where($where)->orderBy('idicono');
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