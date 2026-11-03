<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomGrado extends BaseNomGrado
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCargomilitar', array('local' => 'idgrado', 'foreign' => 'idgrado'));
        $this->hasOne('NomIcono', array('local' => 'idicono', 'foreign' => 'idicono'));
        $this->hasOne(
             'NomCategoriaMilitar', array('local' => 'idcategoriamilitar', 'foreign' => 'idcategoriamilitar')
        );
    }

    /**
     * Descripción del método: Obtiene el ultimo orden disponible
     *
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameOrden()
    {
        $query = new Doctrine_Query();
        $result = $query->select(('MAX(orden) as orden'))->from('NomGrado')->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
        )->execute();

        return $result[0]['orden'] + 1;
    }

    /**
     * Descripción del método: Obtiene todos los grados
     *
     * @param    int $offset ,  rango de los elementos que se muestran en la interfaz
     * @param    int $limit  , rango de los elementos que se muestran en la interfaz
     * @param bool   $valor
     * @param bool   $idCategoriaMilitar
     * @param bool   $esMarina
     *
     * @return mixed : $result, Retorna un arreglo con las instancias de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public static function buscarGrado(
        $offset = 0, $limit = 50, $valor = false, $idCategoriaMilitar = false, $esMarina = false
    )
    {
        $limit = ($limit == 0) ? 50 : $limit;
        $offset = ($offset == 0) ? 0 : $offset;
        $idCategoriaMilitar = ($idCategoriaMilitar == 0) ? false : $idCategoriaMilitar;
        $where = self::consWhere($valor, $idCategoriaMilitar, $esMarina);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "
        SELECT g.*,cm.denominacion as categoria,cm.idcategoriamilitar, i.icono,
        i.denominacion as icono_name
        FROM mod_estructuracomp.nom_grado g
        INNER JOIN mod_estructuracomp.nom_icono i ON (g.idicono = i.idicono)
        INNER JOIN mod_estructuracomp.nom_categoriamilitar cm ON (g.idcategoriamilitar = cm.idcategoriamilitar)
        WHERE $where
        ORDER BY g.orden DESC
        LIMIT $limit
        OFFSET $offset";
        $resultado = $conn->fetchAll($sql);

        return $resultado;
    }

    /**
     * Descripción del método: Busca todos los datos de los grados visibles existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de los grados
     * @copyright Copyright (c) 2013 xetid
     */
    public function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->select('g.*, i.icono as icono')->from('NomGrado g')->innerJoin('g.NomIcono i')->where(
                        "visible = 1 AND actual = 1 AND fechafin IS NULL"
        )->orderBy('orden')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con una misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $denominacion , denominacion del elemento a verificar si existe
     * @param $marina
     *
     * @return bool : bool Devuelve TRUE en caso de que existan instancias con dicha denominacion
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion, $marina)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomGrado')->where(
                           "fechafin IS NULL AND LOWER(denominacion) = LOWER('$denominacion')"
        )->addWhere(
                           "marina = $marina"
            )->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Verifica si el grado especificado esta siendo usado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $id , id del elemento a saber si esta en uso
     *
     * @return bool : bool Retorna TRUE o FALSE en correspondencia si esta en uso o no
     * @copyright Copyright (c) 2013 xetid
     */
    static function verificarUsoGrado($id)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatCargomilitar')->where("idgrado = $id")->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * @param $valor
     * @param $idCategoriaMilitar
     * @param $esMarina
     *
     * @return string
     */
    private static function consWhere($valor, $idCategoriaMilitar, $esMarina)
    {
        $where = "1 = 1";
        if (!is_bool($valor) && $valor != 0) {
            if (is_numeric($valor)) {
                $where .= " AND g.idgrado = $valor";
            } else {
                $where .= " AND LOWER(g.denominacion) like LOWER('%$valor%')
                    OR LOWER(g.abreviatura) like LOWER('%$valor%') ";
            }
        }
        if (is_numeric($idCategoriaMilitar)) {
            $where .= " AND g.idcategoriamilitar = $idCategoriaMilitar";
        }
        if ($esMarina == 1 || $esMarina == 0) {
            $where .= " AND g.marina = '$esMarina'";
        }

        return $where;
    }

    /**
     * Descripción del método: Obtiene las instancias de la tabla Grado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool        $closed
     * @param int         $limit
     * @param int         $offset
     * @param bool|string $valor
     *
     * @return mixed : mixed, Retorna un arreglo con los grados militares
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
        $query->from('NomGrado')->where($where)->orderBy('idgrado');
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