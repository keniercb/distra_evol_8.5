<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomCargo extends BaseNomCargo
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCargo', array('local' => 'idnomcargo', 'foreign' => 'idnomcargo'));
        $this->hasMany('NomCondicion', array('local' => 'idnomcargo', 'foreign' => 'idnomcargo'));
        $this->hasOne('NomGrupocomplejidad', array('local' => 'idgrupocomplejidad', 'foreign' => 'idgrupocomplejidad'));
        $this->hasOne('NomNormaJuridica', array('local' => 'idnormajuridica', 'foreign' => 'idnormajuridica'));
    }

    /**
     * Descripción del método: Obtiene todos los Cargos
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param int  $limit
     * @param int  $offset
     * @param bool $valor
     * @param bool $closed
     *
     * @return mixed : $result, Retorna un arreglo con todos los cargos
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodos($valor = false, $limit = 10, $offset = 0, $closed = false)
    {
        if ($closed) {
            $where = "fechafin IS NOT NULL";
        } else {
            $where = "fechafin IS NULL";
        }
        if (!is_bool($valor) && $valor) {
            $where = "fechafin IS NULL";
            if (is_numeric($valor)) {
                $where .= " AND idnomcargo = $valor";
            } else {
                $where .= " AND LOWER(denominacion) like LOWER('%$valor%')
                    OR LOWER(abreviatura) like LOWER('%$valor%') ";
            }
        }
        $query = Doctrine_Query::create();
        $query->from('NomCargo')->where($where)->orderBy('idnomcargo <> 0,denominacion');
        if (is_numeric($offset)) {
            $query->offset($offset);
        }
        if (is_numeric($limit)) {
            $query->limit($limit);
        }
        $resultado = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $resultado;
    }

    /**
     * @param int  $limit
     * @param int  $offset
     * @param bool $denominacion
     * @param bool $idescala
     *
     * @return array
     */
    static public function buscarCargoEscala($limit = 10, $offset = 0, $denominacion = false, $idescala = false)
    {
        $where = "c.visible = 1 AND c.actual = 1";
        if ($denominacion AND !is_bool($denominacion)) {
            $where .= " AND ( LOWER(c.denominacion) like LOWER('%$denominacion%')";
            $where .= " OR LOWER(c.abreviatura) like LOWER('%$denominacion%'))";
        }
        $whereSubConsult = '1=1';
        if (is_numeric($idescala)) {
            $whereSubConsult .= " AND escala.idtipoescala = $idescala";
        }
        $subConsult = $whereSubConsult;
        if (is_numeric($idescala)) {
            $subConsult = " gc.idgrupocomplejidad IN (
                        SELECT money.idgrupocomplejidad
                        FROM   mod_estructuracomp.nom_salario as money
                        INNER JOIN mod_estructuracomp.nom_escalasalarial as escala
                            ON (money.idsalario = escala.idsalario)
                        WHERE $whereSubConsult
                )";
        }
        $sqlCargos = "
               SELECT c.*, c.idnomcargo as id, gc.denominacion as grupocomplejidad
                FROM   mod_estructuracomp.nom_cargo as c
                INNER JOIN mod_estructuracomp.nom_grupocomplejidad as gc
                    ON (gc.idgrupocomplejidad = c.idgrupocomplejidad)
                WHERE   $where AND $subConsult
                ORDER BY c.denominacion
                LIMIT  $limit
                OFFSET $offset

             ";
        $conn = Doctrine_Query::create()->getConnection();
        $resultado = $conn->fetchAll($sqlCargos);
        foreach ($resultado as $index => $cargo) {
            $condicion = NomCondicion::buscar($cargo['id']);
            $resultado[$index]['idcondicion'] = $condicion['idcondicion'];
            $resultado[$index]['condicion'] = $condicion['condicion'];
        }

        return $resultado;
    }

    /**
     * @param bool $denominacion
     * @param bool $idescala
     *
     * @return int
     */
    public function cantidadInEscala($denominacion = false, $idescala = false)
    {
        $where = "c.visible = 1 AND c.actual = 1";
        if (!is_bool($denominacion)) {
            $where .= " AND ( LOWER(c.denominacion) like LOWER('%$denominacion%')";
            $where .= " OR LOWER(c.abreviatura) like LOWER('%$denominacion%'))";
        }
        if (!is_bool($idescala)) {
            $where .= " AND es.idtipoescala = $idescala";
        }
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomCargo c')->leftJoin('c.NomGrupocomplejidad gc')->leftJoin('c.NomCondicion cond')
                           ->leftJoin('gc.NomSalario s')->leftJoin('s.NomEscalaSalarial es')->where($where)->execute()
                           ->count();

        return $resultado;
    }

    /**
     * Descripción del método: Verifica si el cargo esta siendo utilizado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $id
     *
     * @return bool : bool, Retorna true si esta en uso
     * @copyright Copyright (c) 2013 xetid
     */
    static function verificarUsoCargo($id)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('DatCargo')->where("idnomcargo = $id")->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método:  Busca los cargos que existan dada una denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $denominacion
     * @param $idgrupocomplejidad
     *
     * @return bool : bool Devuelve si existen elementos encontrados
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion, $idgrupocomplejidad)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomCargo')->where(
                           "fechafin IS NULL AND idgrupocomplejidad = $idgrupocomplejidad AND LOWER(denominacion) =
                           LOWER('$denominacion')"
        )->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Busqueda de la cantidad de cargos que cumplen con el criterio de busqueda
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param bool $filtro
     *
     * @internal  param $denominacion
     * @internal  param $abreviatura
     * @return mixed : int Retorna la cantidad de elementos que cumplen con la condicion definida
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($filtro = false)
    {
        $model = new UtilModel();
        $where = $model->whereBusquedaDinamica('c', $filtro);
        $where .= ' AND c.visible = 1 AND c.fechafin IS NULL';
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomCargo c')->where($where)->execute()->count();

        return $resultado;
    }



  static public function buscarFacultados()
  {
    $query = Doctrine_Query::create();
    $resultado = $query->from('NomCargoFacultado')
      ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

    return $resultado;
  }
}