<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatFormato extends BaseDatFormato
{

    /**
     * Constuctor de la clase
     */
    public function setUp()
    {
        $this->hasMany(
            'DatParteformato',
            array('local' => 'idformato', 'foreign' => 'idformato')
        );
        $this->hasMany(
            'DatFormatoEntidad',
            array('local' => 'idformato', 'foreign' => 'idformato')
        );
        parent::setUp();
    }

    /**
     * Formato parrafo
     *
     * @return array Retorna un arreglo con los datos del formato
     */
    public function FormatoParrafo()
    {
        $q = Doctrine_Query::create();
        $formatos = $q->select("f.*, pf.*")
            ->from('DatFormato f')
            ->innerJoin("f.DatParteformato pf")
            ->where("f.nivelpais = ?", 1)
            ->execute()
            ->toArray(true);
        return $formatos;
    }

    /**
     * Aplicar filtros
     *
     * @param  array $cond Arreglo de condiciones
     *
     * @return string Retorna una cadena con los filtros
     *
     */
    private function aplicarFiltros($cond = array())
    {
        $filter = " 0 = 0 ";
        if ($cond['idformato']) {
            $filter .= "and e.idformato = '" . $cond['idformato'] . "'";
        }
        if ($cond['nombre']) {
            $filter .= " and e.nombre = '" . $cond['nombre'] . "'";
        }
        if ($cond['descripcion']) {
            $filter .= " and e.descripcion = '" . $cond['descripcion'] . "'";
        }

        return $filter;
    }

    /**
     * Aplicar filtros
     *
     * @param  array $cond   Arreglo de condiciones
     * @param array  $filter Filtros
     *
     * @return string Retorna una cadena con los filtros
     *
     */
    private function subAplicarfiltro($filter, $cond = array())
    {
        if ($cond['separador']) {
            $filter .= " and e.separador = '" . $cond['separador'] . "'";
        }
        if ($cond['version']) {
            $filter .= " and e.version = '" . $cond['version'] . "'";
        }
        if ($cond['idestructuracomun']) {
            $filter
                .= " and e.idestructuracomun = '" . $cond['idestructuracomun']
                . "'";
        }
        if ($cond['idsubsistema']) {
            $filter .= " and e.idsubsistema = '" . $cond['idsubsistema'] . "'";
        }
        return $filter;
    }

    /**
     * Buscar formato
     *
     * @param  array $cond  Arreglo de condiciones
     * @param  int   $limit Limite de la busqueda
     * @param int    $start Indice donde comienza la busqueda
     *
     * @return array Retorna un arreglo con la cantidad y con los datos de formato
     *
     */
    public function buscarFormato($cond = array(), $limit = 10, $start = 0)
    {
        $ff = self::aplicarFiltros($cond);
        $filter = self::subAplicarfiltro($ff, $cond);
        $q = new Doctrine_Query();
        $formatos = $q->select(
            "e.idformato,e.nombre,e.descripcion,e.separador,
                                    e.version,e.idestructuracomun,e.nivelpais,e.idsubsistema"
        )
            ->from('DatFormato e')->limit($limit)->offset($start)->where(
                $filter
            )->execute();
        $formatosd = $formatos->toArray();

        $cantidad = self::Cantidad($filter);

        $resultado = array('cant' => $cantidad, 'datos' => $formatosd);

        return $resultado;
    }

    /**
     * Cantidad
     *
     * @param  array $filter Arreglo de filtros
     *
     * @return array Retorna un arreglo con la cantidad de formatos segun los filtros
     *
     */
    public function Cantidad($filter)
    {
        $q = new Doctrine_Query();
        if ($filter) {
            $count = $q->select("COUNT(e.idformato) cant ")->from(
                "DatFormato e"
            )->where($filter)->execute();
        } else {
            $count = $q->select("COUNT(e.idformato) cant ")->from(
                "DatFormato e"
            )->execute();
        }

        $cant = $count->toArray();
        return $cant[0]['cant'];
    }

    /**
     * Formatos
     *
     * @param  string $select Query
     * @param array   $cond   Arreglo de condiciones
     *
     * @return array Retorna un arreglo con los datos pedidos en la query
     *
     */
    public static function Formatos($select = '', $cond = array())
    {
        $ff = self::aplicarFiltros($cond);
        $filter = self::subAplicarfiltro($ff, $cond);
        $filter .= ($filter != '') ? " or e.nivelpais = 1" : "e.nivelpais = 1";
        $q = Doctrine_Query::create();
        if (!$select) {
            $estudiant = ($cond['limit'] && $cond['start'])
                ?
                $q->from('DatFormato e')->limit($cond['limit'])
                    ->offset($cond['start'])->execute()
                :
                $q->from('DatFormato e')->execute();
        } else {
            $estudiant = ($cond['limit'] && $cond['start'])
                ?
                $q->select($select)->from('DatFormato e')
                    ->limit($cond['limit'])->offset($cond['start'])->execute()
                :
                $q->select($select)->from('DatFormato e')->execute();
        }
        $estudiantes = $estudiant->toArray();

        return $estudiantes;
    }

    /**
     * Formatos por subsistemas
     *
     * @param int $idestructuracomun Identificador de estructura comúm
     * @param int $idsubsistema      Identificador de subsistema
     *
     * @return array Retorna un arreglo con los datos del formato por subsistemas
     *
     */
    public static function FormatosPorSubs($idestructuracomun, $idsubsistema)
    {
        $query = Doctrine_Query::create();
        $result = $query
            ->select("e.*, fe.idformatoentidad as idformatoheredado")
            ->from('DatFormato e')
            ->leftJoin("e.DatFormatoEntidad fe")
            ->innerJoin('e.DatParteformato pf')
            ->where(
                "(e.idestructuracomun = $idestructuracomun OR e.nivelpais = 1
                   OR fe.idestructuracomun = $idestructuracomun) AND e.idsubsistema = $idsubsistema"
            )
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Obtener los datos del formato dado el id.
     *
     * @param int $argIdFormato Id del formato.
     *
     * @return array Datos del formato dado su id.
     */
    public static function FormatosPorId($argIdFormato)
    {
        $query = new Doctrine_Query();
        return $query->from('DatFormato e')
            ->where("e.idformato = $argIdFormato")
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Otro aplicar filtros
     *
     * @param  array $cond Arreglo de condiciones
     *
     * @return string Retorna una cadena con los filtros
     *
     */
    private function otroaplicarfiltro($cond = array())
    {
        $filter = array();
        if ($cond['idformato']) {
            $filter[] = "e.idformato = '" . $cond['idformato'] . "'";
        }
        if ($cond['nombre']) {
            $filter[] = " e.nombre ILIKE '%" . $cond['nombre'] . "%'";
        }
        if ($cond['descripcion']) {
            $filter[]
                = "lower(e.descripcion) = '" . strtolower($cond['descripcion'])
                . "'";
        }
        if ($cond['separador']) {
            $filter[] = "e.separador ILIKE '%" . $cond['separador'] . "%'";
        }
        if ($cond['idestructuracomun']) {
            $filter[] = "(nivelpais = 1 OR idestructuracomun = "
                . $cond['idestructuracomun'] . " OR idformato "
                . "IN(SELECT dat.idformato FROM  mod_datosmaestros.dat_formatoentidad dat WHERE "
                . "dat.idestructuracomun = " . $cond['idestructuracomun']
                . " ))";
        }
        if ($cond['sfFiltro']) {
            include_once Zend_Registry::get('config')->dir_aplication .
                'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
            $filter[] = "(" . UtilesDatosMaestros::accentWordToSearch(
                    'e.nombre', $cond['sfFiltro']
                ) . " OR "
                . UtilesDatosMaestros::accentWordToSearch(
                    'e.descripcion', $cond['sfFiltro']
                ) .
                " OR e.separador ILIKE '%" . $cond['sfFiltro'] . "%')";
        }

        return count($filter) ? implode(' AND ', $filter) : '';
    }

    /**
     * FormatosC
     *
     * @param  string $select Query
     * @param array   $cond   Arreglo de condiciones
     *
     * @return array Retorna un arreglo con los datos pedidos en la query
     * @throws Doctrine_Exception $e
     */
    public function FormatosC($select = '', $cond = array())
    {
        $filter = self::otroaplicarfiltro($cond);
        if (!$select) {
            $select
                = "e.idformato,e.nombre,e.descripcion,e.separador,
             e.version,e.idestructuracomun,p.idformatopais,e.idsubsistema,
             s.denominacion,CASE WHEN idformato IN(SELECT dat.idformato 
             FROM  mod_datosmaestros.dat_formatoentidad dat 
             WHERE dat.idestructuracomun = " . $cond['idestructuracomun'] . ") 
             THEN 1 ELSE 0 END AS heredado";
        } else {
            $select
                .= ",CASE WHEN idformato IN(SELECT dat.idformato
            FROM  mod_datosmaestros.dat_formatoentidad dat WHERE 
            dat.idestructuracomun = " . $cond['idestructuracomun'] . ") 
            THEN 1 ELSE 0 END AS heredado";
        }
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $resultado = $conexionActual
                ->fetchAll(
                    "SELECT $select FROM mod_datosmaestros.dat_formato e  
                 INNER JOIN mod_datosmaestros.nom_subsistema s 
                 ON e.idsubsistema = s.idsubsistema WHERE $filter 
                     ORDER BY s.denominacion,e.nombre ASC;"
                );
            return (isset($cond['start']) && is_numeric($cond['start'])
                && isset($cond['start'])
                && is_numeric($cond['start'])) ?
                array_splice($resultado, $cond['start'], $cond['limit'])
                : $resultado;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Cantidad de formato
     *
     * @param  array $cond Arreglo de condiciones
     *
     * @return int Retorna la cantidad de formatos que cumplen con las condiciones
     *
     */
    public function CantidadFormatos($cond = array())
    {

        $filter = self::otroaplicarfiltro($cond);


        $q = new Doctrine_Query();

        if ($filter) {
            $count = $q->select("COUNT(e.idformato) cant ")->from(
                "DatFormato e"
            )->where($filter)->execute();
        } else {
            $count = $q->select("COUNT(e.idformato) cant ")->from(
                "DatFormato e"
            )->execute();
        }

        $cant = $count->toArray();

        return $cant[0]['cant'];
    }

    /**
     * Obtener formatos que heredan
     *
     * @param  int $idestructuracomun      Identificador de estructura común
     * @param  int $idestructuracomunpadre Identificador de estructura común padre
     *
     * @return array Retorna un arreglo con los datos de los formatos que heredan
     * @throws Doctrine_Exception $e
     */
    public function getFormatosHeredar(
        $idestructuracomun, $idestructuracomunpadre
    ) {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $resultado = $conexionActual->fetchAll(
                "SELECT dat.idformato,dat.nombre,dat.descripcion,dat.separador,dat.version,dat.idestructuracomun,
						dat.ordenizq,dat.ordender,dat.idformatopadre,dat.nivel,dat.nivelpais,dat.idsubsistema
						FROM mod_datosmaestros.dat_formato dat
						LEFT JOIN mod_datosmaestros.dat_formatoentidad d1 on dat.idformato = d1.idformato
						WHERE (dat.idestructuracomun = $idestructuracomunpadre OR d1.idestructuracomun = $idestructuracomunpadre) AND
						dat.idformato NOT IN(SELECT d.idformato FROM  mod_datosmaestros.dat_formatoentidad d 
                                                WHERE d.idestructuracomun = $idestructuracomun)
						AND dat.nivelpais = 0 ORDER BY dat.nombre,dat.descripcion ASC;"
            );
            return $resultado;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}
