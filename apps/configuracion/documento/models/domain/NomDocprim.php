<?php

/**
 * Clase modelo de nomenclador de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Domain
 * @copyright  XETID.
 * @version    1.0-0
 */
class NomDocprim extends BaseNomDocprim
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Obtiene documentos por condiciones
     *
     * @param array $cond Condiciones
     *
     * @return mixed Array con cantidad y datos de documentos o "false" en caso de Doctrine_Exception
     */
    public static function buscardocparam($cond = array())
    {
        try {
            $limit = $cond['limit'];
            $start = $cond['start'];
            $filter = self::aplicateFilter($cond, 'e');
            $q = new Doctrine_Query();
            if ($limit && $start != null) {
                $estudiantes = $q->select(
                    "e.iddocumentos,e.denominacion,e.abreviatura,e.concepto,e.codigo"
                )->from(
                    'NomDocprim e'
                )->where($filter)->limit($limit)->offset($start)->orderby(
                    "e.denominacion"
                )
                    ->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                    )->execute();
            } else {
                $estudiantes = $q->select(
                    "e.iddocumentos,e.denominacion,e.abreviatura,e.concepto,e.codigo"
                )->from(
                    'NomDocprim e'
                )->where($filter)->orderby("e.denominacion")->setHydrationMode(
                    Doctrine::HYDRATE_ARRAY
                )
                    ->execute();
            }
            $cantidad = $q->from('NomDocprim e')->where($filter)->count();
            $resultado = array('cant' => $cantidad, 'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene un filtro SQL
     *
     * @param array $cond Condiciones
     *
     * @return mixed Filtro
     */
    private static function aplicateFilter($cond, $alias)
    {
        $filter = " 0 =0 ";
        if ($cond['iddocumentos']) {
            $filter .= " and $alias.iddocumentos = '" . $cond['iddocumentos']
                . "'";
        }
        if ($cond['denominacion']) {
            $filter .= " and $alias.denominacion= '" . $cond['denominacion']
                . "'";
        }
        if ($cond['abreviatura']) {
            $filter .= " and $alias.abreviatura= '" . $cond['abreviatura']
                . "'";
        }
        if ($cond['codigo']) {
            $filter .= " and $alias.codigo= '" . $cond['codigo'] . "'";
            return $filter;
        }
        if ($cond['sfFiltro'] != "") {
            $filter = " $alias.denominacion ILIKE '%" . $cond['sfFiltro'] . "%' OR $alias.codigo ILIKE '%"
                . $cond['sfFiltro'] . "%' OR $alias.abreviatura ILIKE '%"
                . $cond['sfFiltro'] . "%'";
        }
        return $filter;
    }

    /**
     * Obtiene documentos por condiciones
     *
     * @param array $params Condiciones
     *
     * @return array Documentos
     * @throws Doctrine_Exception
     */
    static public function buscarnomdoc($params = array())
    {
        try {
            $offset = isset($params['start']) ? $params['start'] : 0;
            $limit = isset($params['limit']) ? $params['limit'] : 20;
            $filter = self::aplicateFilter($params, 'nd');
            $query = Doctrine_Query::create();
            $query->from('NomDocprim nd')
                ->where($filter)
                ->orderBy("nd.denominacion,nd.codigo");
            $cant = $query->select("nd.iddocumentos")
                ->count();
            $resultado['cant'] = $cant;
            if ($resultado['cant']) {
                $resultado['datos'] = (isset($offset) && isset($limit))
                    ? $query->select("nd.*")
                        ->offset($offset)
                        ->limit($limit)
                        ->fetchArray()
                    :
                    $query->select("nd.*")
                        ->fetchArray();
                if ($params['sfFiltro'] != "") {
                    include_once Zend_Registry::get('config')->dir_aplication .
                        'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                    $resultado['datos'] = UtilesDatosMaestros::colorSearch(
                        $resultado['datos'],
                        array('denominacion', 'codigo', 'abreviatura'),
                        array($params['sfFiltro'], $params['sfFiltro'], $params['sfFiltro'])
                    );
                }
            } else {
                $resultado['datos'] = array();
            }
            return $resultado;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene datos de documentos por condiciones
     *
     * @param array $cond Condiciones
     *
     * @return mixed Array con cantidad y datos de documentos o "false" en caso de Doctrine_Exception
     */
    public static function buscar($cond = array())
    {
        try {
            $limit = $cond['limit'];
            $start = $cond['start'];
            $filter = self::aplicateFilter($cond);
            $q = new Doctrine_Query();
            if ($limit && $start != null) {
                $estudiantes = $q->select(
                    "e.iddocumentos,e.denominacion,e.abreviatura,e.concepto,e.codigo"
                )
                    ->from(
                        'NomDocprim e'
                    )->where($filter)->limit($limit)->offset($start)->orderby(
                        "e.denominacion"
                    )
                    ->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
                    )->execute();
            } else {
                $estudiantes = $q->select(
                    "e.iddocumentos,e.denominacion,e.abreviatura,e.concepto,e.codigo"
                )
                    ->from(
                        'NomDocprim e'
                    )->where($filter)->orderby("e.denominacion")
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            }
            $cantidad = $q->from('NomDocprim e')->where($filter)->count();
            $resultado = array('cant' => $cantidad, 'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    public static function obtenerNomDocprim($cond = array())
    {
        try {
            $limit = $cond['limit'];
            $start = $cond['start'];
            $filter = $cond['sfFiltro'] ? " (nom.denominacion ilike '%" . $cond['sfFiltro']
                . "%' OR nom.codigo ilike '%" . $cond['sfFiltro'] . "%' OR nom.abreviatura ilike '%"
                . $cond['sfFiltro'] . "%') " : ' 0 = 0 ';
            $q = new Doctrine_Query();
            $docprim = $q->select('docprim.iddocumentos')
                ->from('DatDocumentoprim docprim')
                ->where(
                    'docprim.idestructurasubsist = ?',
                    array($cond['idestructurasubsist'])
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            $datos = self::damedatos($docprim);
            if ($limit && $start != null) {
                $qUno = new Doctrine_Query();
                $nomdoc = $qUno->select(
                    'nom.iddocumentos,nom.denominacion,nom.abreviatura,nom.concepto,nom.codigo'
                )
                    ->from('NomDocprim nom')
                    ->whereNotIn('nom.iddocumentos', $datos)
                    ->where($filter)
                    ->limit($limit)
                    ->offset($start)
                    ->orderby("nom.denominacion")
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            } else {
                $qUno = new Doctrine_Query();
                $nomdoc = $qUno->select(
                    'nom.iddocumentos,nom.denominacion,nom.abreviatura,nom.concepto,nom.codigo'
                )
                    ->from('NomDocprim nom')
                    ->whereNotIn('nom.iddocumentos', $datos)
                    ->where($filter)
                    ->orderby("nom.denominacion")
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            }
            $qDos = new Doctrine_Query();
            $cantidad = $qDos->from('NomDocprim nom')->whereNotIn(
                'nom.iddocumentos', $datos
            )->where($filter)->count();
            $resultado = array('cant' => $cantidad, 'datos' => $nomdoc);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    public static function damedatos($array)
    {
        $result = array();
        foreach ($array as $elem) {
            array_push($result, $elem['iddocumentos']);
        }
        return $result;
    }

}
