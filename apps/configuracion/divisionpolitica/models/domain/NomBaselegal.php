<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomBaselegal extends BaseNomBaselegal
{

    public function setUp()
    {
        parent::setUp();
        $this->HasMany('NomBaselegal', array('local' => 'idbaselegal', 'foreign' => 'idpadre'));
        $this->hasOne('NomBaselegal', array('local' => 'idpadre', 'foreign' => 'idbaselegal'));
        $this->hasMany(
            'NomNivelestructural', array(
                                        'local' => 'idnivelestructural', 'foreign' => 'idnivelestructural'
                                   )
        );
    }

    /**
     * Función que se utiliza para cargar a estructura de la base legal
     *
     * @param int $id
     *
     * @return array
     */
    static function cargarEstructuraplan($id)
    {
        $q = Doctrine_Query::create();
        $where = ($id == 'idpadre')
            ? "idbaselegal = idpadre and fechafin is null"
            : "idpadre =
                  $id  and idbaselegal<>idpadre and fechafin is null";

        $result = $q->select(
            'idbaselegal id, denominacion text,idelementocontenido,idpadre, abreviatura,
            fechafin, fechainicio, idnivelestructural, numerogaceta,fechagaceta, (ordender - ordenizq = 1) as leaf'
        )
            ->from('NomBaselegal')
            ->where($where)
            ->orderby('idbaselegal')
            ->execute();
        return $result->toArray();
    }

    /**
     * Función que se utiliza para cargar a estructura de la base legal
     *
     * @param int $id
     *
     * @return array
     */
    static function cargarEstructuraplanConFechafin($id)
    {
        $q = Doctrine_Query::create();
        $where = ($id == 'idpadre') ? "idbaselegal = idpadre " : "idpadre =   $id  and idbaselegal<>idpadre ";

        $result = $q->select(
            'idbaselegal id, denominacion text,idelementocontenido,idpadre,abreviatura,
            fechafin, fechainicio, idnivelestructural, numerogaceta,fechagaceta, (ordender - ordenizq = 1) as leaf'
        )
            ->from('NomBaselegal')
            ->where($where)
            ->orderby('idbaselegal')
            ->execute();
        return $result->toArray();
    }

    /**
     * Función que se utiliza para retornar la cantidad de estructuras de la base legal
     *
     * @param int $id
     *
     * @return int
     */
    static function cantidadEstructuras($id)
    {
        $q = Doctrine_Query::create();
        $where = ($id == 'idpadre') ? "idbaselegal = idpadre and 
            fechafin is null" : "idpadre =   $id  and idbaselegal<>idpadre and fechafin is null";

        $result = $q->from('NomBaselegal')
            ->where($where)
            ->count();
        return $result;
    }

    /**
     * Función que se utiliza para retornar la cantidad de estructuras de la base legal
     *
     * @param int $id
     *
     * @return int
     */
    static function cantidadEstructurasConFechafin($id)
    {
        $q = Doctrine_Query::create();
        $where = ($id == 'idpadre') ? "idbaselegal = idpadre " : "idpadre =   $id  and idbaselegal<>idpadre";

        $result = $q->from('NomBaselegal')
            ->where($where)
            ->count();
        return $result;
    }

    /**
     * Función que se utiliza para retornar la cantidad de estructuras de la base legal
     *
     * @param int $id
     * @param int $start
     * @param int $limit
     *
     * @return array
     */
    static function valoresEstructuraplan($id, $start, $limit)
    {
        $q = Doctrine_Query::create();
        $where = ($id == 'idpadre') ? "idbaselegal = idpadre and fechafin is 
        null" : "idpadre =   $id  and idbaselegal<>idpadre and fechafin is null";

        $result = $q->select(
            'idbaselegal id, denominacion text,idelementocontenido,idpadre, abreviatura,
             fechafin, fechainicio, idnivelestructural, numerogaceta,fechagaceta, (ordender - ordenizq = 1) as leaf'
        )
            ->from('NomBaselegal')
            ->where($where)
            ->offset($start)
            ->limit($limit)
            ->orderby('idbaselegal')
            ->execute()->toArray();
        return $result;
    }

    /**
     * Función que se utiliza para retornar la cantidad de estructuras de la base legal
     *
     * @param int $id
     * @param int $start
     * @param int $limit
     *
     * @return array
     */
    static function valoresEstructuraplanConFechaFin($id, $start, $limit)
    {
        $q = Doctrine_Query::create();
        $where = ($id == 'idpadre') ? "idbaselegal = idpadre " : "idpadre =   $id  and idbaselegal<>idpadre ";

        $result = $q->select(
            'idbaselegal id, denominacion text,idelementocontenido,idpadre, abreviatura, fechafin,
            fechainicio, idnivelestructural, numerogaceta,fechagaceta, (ordender - ordenizq = 1) as leaf'
        )
            ->from('NomBaselegal')
            ->where($where)
            ->offset($start)
            ->limit($limit)
            ->orderby('idbaselegal')
            ->execute()->toArray();
        return $result;
    }

    /**
     * Para que devuelve los padres de un nodo determinado
     *
     * @param int $idbaselegal
     *
     * @return array
     */
    static function buscarPadres($idbaselegal)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('configsecodena');
        $sql
            = "SELECT n.idbaselegal AS idbaselegal, n.denominacion AS text,n.idnivelestructural,
               n.ordender - n.ordenizq = 1 as leaf
               FROM mod_configsecodena.nom_baselegal n
               WHERE (ordenizq < (select ordenizq from mod_configsecodena.nom_baselegal
               where idbaselegal=$idbaselegal) AND ordender >
               (select ordender from mod_configsecodena.nom_baselegal where idbaselegal=$idbaselegal))
               ORDER BY n.ordenizq";

        return $conn->fetchAll($sql);
    }

    /**
     * Para cargar la estructura de la base legal, este metodo es implementado
     * como parte del servicio que brinda esta configsecodena
     *
     * @param mixed $descripcion Descripción
     *
     * @return array
     */
    static function cargarEstruturabaselegaldenominacion($descripcion)
    {
        $query = Doctrine_Query::create();
        $valores = $query->select('z.*')
            ->from('NomBaselegal z')
            ->where('z.fechafin is NULL');
        $valores = ($descripcion != '') ? $valores->addWhere("lower(z.denominacion) LIKE '$descripcion%'") : $valores;

        $temp = $valores->execute()->toArray();
        return $temp;
    }

    /**
     * Para devolver los datos asociados a una Base legal
     *
     * @param array $arrayidbaselegal Arraglo de IDs de las Bases legales
     *
     * @return array
     * @author Liv\xE1n Capote Valdés
     */
    static function obtenerBaseLegalId($arrayidbaselegal)
    {
        $query = Doctrine_Query::create();
        $valores = $query->select('z.*,n.*,k.*')
            ->from('NomBaselegal z')
            ->innerJoin('z.NomNivelestructural n')
            ->leftJoin('n.NomConceptonivel k')
            ->whereIn('z.idbaselegal', $arrayidbaselegal)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $valores;
    }

    /**
     * Función para validar que no existan dos bases legales con el mismo nombre en un padre
     */
    public function validarDenominacionArbolBaseLegal($denominacion, $id, $idpadre)
    {
        $query = new Doctrine_Query();
        $denominacion = strtoupper($denominacion);
        if (($idpadre == $id) || (!$idpadre)) {
            $result = $query->from('NomBaselegal')
                ->where("upper(denominacion)='$denominacion' and idbaselegal=idpadre ")->execute();
            $array = $result->toArray();
        } else {
            $result = $query->from('NomBaselegal')
                ->where("upper(denominacion)='$denominacion' and idpadre=$idpadre")->execute();
            $array = $result->toArray();
        }

        if (empty($array)) {
            return true;
        } else {
            return false;
        }
    }

}
