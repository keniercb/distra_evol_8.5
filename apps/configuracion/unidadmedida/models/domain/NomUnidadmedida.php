<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class NomUnidadmedida extends BaseNomUnidadmedida
{

    /**
     * Constuctor de la clase
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomMagnitud', array('local' => 'idmagnitud', 'foreign' => 'idmagnitud'));
        $this->HasMany(
                'NomUnidadmedidaNomUnidadmedida', array(
                    'local' => 'idunidadmedida', 'foreign' => 'idunidadmedida'
                    )
                );
        $this->HasMany(
                'NomUnidadmedidaNomUnidadmedida', array(
                    'local' => 'idunidadmedida', 'foreign' => 'idunidadmedidaconversion'
                    )
                );
    }

    /**
     * Dame todas las Unidades de medida asociadas a una magnitud
     *
     * @param int $start Indice de inicio de la busqueda
     * @param int $limit Limite de la busqueda
     * @param int $idmagnitud Identificador de la magnitud
     * @return array Retorna un arreglo con las unidades de medida asociadas a la magnitud
     * @throws Doctrine_Exception $ee
     *
     */
    public function getTodos($start = 0, $limit = 20, $idmagnitud = 0)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select(
                    'um.idunidadmedida,nm.idmagnitud,(case when(Current_Date <= (case when(um.fechafin is null)
                    then Current_Date else um.fechafin end) and Current_Date >= um.fechainicio) 
                    then 0 else 1 end) as red'
                    )
                    ->from('NomUnidadmedida um')->innerJoin('um.NomMagnitud nm')
                    ->where('um.idmagnitud=?', $idmagnitud)->offset($start)->limit($limit)->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    public function getTodosReporteUM($idmagnitud)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select(
                '*'
            )
                ->from('NomUnidadmedida um')->innerJoin('um.NomMagnitud nm')
                ->where('um.idmagnitud=?', $idmagnitud)->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Listar las unidades de medida
     *
     *
     * @return array Retorna un arreglo con las unidades de medida
     * @throws Doctrine_Exception $ee
     */
    public function listarUnidadMedida()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomUnidadmedida')->where(
                '(Current_Date >= fechainicio and Current_Date < fechafin) or
                (Current_Date >= fechainicio and fechafin is null)'
            )->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Listar las unidades de medida dado la uri magnitud
     *
     * @param  string $urimagnitud Uri magnitud
     * @return array Retorna un arreglo con las unidades de medida
     * @throws Doctrine_Exception $ee
     */
    public function listarUnidadMedidaDadoUriMagnitud($urimagnitud)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('um.idunidadmedida')
            ->from('NomUnidadmedida um')->innerJoin('um.NomMagnitud m')
            ->where('m.urimagnitud = ?', $urimagnitud);
            $result->addWhere(
            '(Current_Date > um.fechainicio and Current_Date < um.fechafin) or
                (Current_Date > um.fechainicio and um.fechafin is null)'
                    );
            return $result->execute()->toArray();
        } catch (Doctrine_Exception $ee) {
            return $ee;
        }
    }

    /**
     * Listar las unidades de medida dado un objeto uri magnitud
     *
     * @param object $urimagnitud Objeto de tipo uri magnitud
     * @return array Retorna un arreglo con las unidades de medida
     * @throws Doctrine_Exception $ee
     */
    public function listarUnidadMedidaDadoUriMagnitud_Objects($urimagnitud)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('um.idunidadmedida')
             ->from('NomUnidadmedida um')->innerJoin('um.NomMagnitud m')
             ->where('m.urimagnitud = ?', $urimagnitud);
            $result->addWhere(
            '(Current_Date > um.fechainicio and Current_Date < um.fechafin) or
             (Current_Date > um.fechainicio and um.fechafin is null)'
             );

            return $result->execute();
        } catch (Doctrine_Exception $ee) {
            return $ee;
        }
    }

    /**
     * Obtener unidad de medida dado la uri unidad de medida
     *
     * @param  string $uriunidadmedida Uri unidad de medida
     * @return object Retorna un objeto de tipo unidad de medida
     *
     */
    public function obtenerUnidadMediaDadoUri($uriunidadmedida)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('um.idunidadmedida')
        ->from('NomUnidadmedida um')
        ->where('um.uriunidadmedida = ?', $uriunidadmedida)->execute()->getFirst();

        return $result;
    }

    /**
     * Obtener factor de conversión
     *
     * @param  int $idumorigen Identificador unidad de medida de origen
     * @param  int $idumdestino Identificador unidad de medida de destino
     * @return array Retorna un arreglo con el valor del factor de conversión
     *
     */
    public function obtenerFactorConversion($idumorigen, $idumdestino)
    {
        if ($idumdestino == $idumorigen) {
            return array(1);
        } else {
            $obj = Doctrine::getTable('NomUnidadmedidaNomUnidadmedida')->find(array($idumorigen, $idumdestino));
            $result = array();
            if (!empty($obj)) {
                array_push($result, $obj->factorconversion);
            }

            return $result;
        }
    }

    /**
     * Obtener unidad de medida con factor
     *
     * @param  int $idum Unidad de medida de origen
     * @return array Retorna un arreglo con el valor del factor de conversión y el id de la unidad de medida
     * @throws Doctrine_Exception $ee
     */
    public function obtenerUnidadesMedidaConFactor($idum)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('um.idunidadmedida, num.factorconversion as factorconversion')
            ->from('NomUnidadmedida um')->innerJoin('um.NomUnidadmedidaNomUnidadmedida num')
            ->where('num.idunidadmedida = ?', $idum);
            $result->addWhere(
            '(Current_Date > um.fechainicio and Current_Date < um.fechafin) or
            (Current_Date > um.fechainicio and um.fechafin is null)'
            );

            return $result->execute()->toArray();
        } catch (Doctrine_Exception $ee) {
            return $ee;
        }
    }

    /**
     * Obtener unidades de medida dao un arreglo de ids
     *
     * @param  array $ids Arreglo de ids
     * @return array Retorna un arreglo de unidades de medida
     *
     */
    static function obtenerUnidadesMedidaDadoArrayId($ids)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomUnidadmedida')->whereIn('idunidadmedida', $ids)->execute()->toArray();
        return $result;
    }

    /**
     * Total dado el id de la magniud
     *
     * @param int $idmagnitud Identificador de magnitud
     * @return int cantidad de unidades de medida asociadas a una magnitud
     *
     */
    function getTotalDadoIdMag($idmagnitud)
    {
        $query = Doctrine_Query::create();

        return $query->select('COUNT(um.idunidadmedida) as total')
        ->from('NomUnidadmedida um')
        ->where('um.idmagnitud=?', $idmagnitud)
        ->execute()->getFirst()->total;
    }

    /**
     * Total de unidades de medida
     *
     *
     * @return int cantidad de unidades de medida
     *
     */
    function getTotal()
    {
        $query = Doctrine_Query::create();
        return $query->select('COUNT(idunidadmedida) as total')
        ->from('NomUnidadmedida')->execute()->getFirst()->total;
    }

    /**
     * Dame idmagnitud
     *
     * @param int $idunidadmedida Identificador de la unidad de medida
     * @return int Retorna el identificador de la magnitud
     *
     */
    function dameIdMagintud($idunidadmedida)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('n.idmagnitud')
        ->from('NomUnidadmedida n')
        ->where('n.idunidadmedida =?', $idunidadmedida)
        ->execute()->toArray();

        return $result;
    }

    /**
     * Existe la relación denominación unidad de medida
     * @param int $denominacion Tipo de denominación
     * @param int $idunidadmedida Identificador de la unidad de medida
     * @return int Retorna la cantidad de magnitudes que existe con una denominación
     *
     */
    function exiteDenominacionUM($denominacion, $idunidadmedida = null, $idmagnitud = 0)
    {
        try {
            $query = Doctrine_Query::create();
            $query->select('COUNT(um.idunidadmedida) as total')
            ->from('NomUnidadmedida um')
            ->where(
            "(um.denominacionunidadmedida ilike '$denominacion' AND um.idmagnitud = $idmagnitud)
            OR um.uriunidadmedida ilike '$denominacion'"
             );
            if (isset($idunidadmedida)) {
                $query->addWhere('idunidadmedida != ?', $idunidadmedida);
            }

            $total = $query->execute()->getFirst()->total;
            return $total;
        } catch (Doctrine_Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Obtener la consulta unidad de medida
     *
     * @param Doctrine_Query $query Objeto de tipo Doctrine_Query
     * @param string $table Nombre de la tabla
     * @param string $aliasum Nombre de la unidad de medida
     * @param string $select Consulta
     * @param string $tipoJoin Tipo de unión
     * @return object Retorna el valor o los valores devueltos por la consulta
     *
     */
    public function getQueryJoinUnidadMedida(
            Doctrine_Query $query, $table, $aliasum, $select, $tipoJoin = 'leftJoin'
            )
    {
        if ($tipoJoin == 'innerJoin') {
            return $query->innerJoin("$table.NomUnidadmedida $aliasum")->addSelect($select);
        }

        return $query->leftJoin("$table.NomUnidadmedida $aliasum")->addSelect($select);
    }

    /**
     * Obtener el Identificador de la unidad de medida dado una abreviatura
     *
     * @param string $alias Abreviatura de la unidad de medida
     * @return object Retorna el Identificador unidad de medida junto con su abreviatura
     *
     */
    public function obtenerIdUmByAbreviatura($alias)
    {
        $query = new Doctrine_Query();
        $result = $query->select("u.idunidadmedida, u.abreviaturaunidadmedida")
                        ->from('NomUnidadmedida u')
                        ->where("u.abreviaturaunidadmedida like ? ", $alias)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

}
