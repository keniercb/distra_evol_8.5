<?php

/**
 * Clase modelo para datos de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Domain
 * @copyright  XETID.
 * @version    1.0-0
 */
class DatDocumentoprim extends BaseDatDocumentoprim
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
            'NomDocprim',
            array('local' => 'iddocumentos', 'foreign' => 'iddocumentos')
        );
        $this->hasOne(
            'DatEstructurasubsist',
            array('local' => 'idestructurasubsist', 'foreign' => 'idestructurasubsist')
        );
        parent::setUp();
    }

    /**
     * Obtiene los tipos de documentos primarios
     *
     * @return mixed Tipos de documentos
     */
    public static function TipoDocumentos()
    {
        $q = Doctrine_Query::create();
        $res = $q->from("DatDocumentoprim d")->innerJoin("d.NomDocprim nd")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $res;
    }

    /**
     * Obtiene documentos por alias
     *
     * @param mixed $alias      Alias
     * @param mixed $subsistema Subsistema
     *
     * @return mixed Documentos
     */
    public static function BuscarPorAlias($idestructurasubsist, $alias)
    {
        $q = Doctrine_Query::create();
        $res = $q->from("DatDocumentoprim d")
            ->innerJoin("d.NomDocprim nd")
            ->where("d.idestructurasubsist = $idestructurasubsist and nd.abreviatura = '$alias'")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $res;
    }

    /**
     * Obtiene categorías de documentos por alias
     *
     * @param mixed $alias      Alias
     * @param mixed $subsistema Subsistema
     * @param mixed $whereIn    Par\xE1metro para Base de Datos
     * @param mixed $whereNotIn Par\xE1metro para Base de Datos
     *
     * @return mixed Categorías
     */
    public static function BuscarCategoriaPorAlias(
        $alias, $subsistema, $whereIn = 0, $whereNotIn = 0
    ) {
        $q = Doctrine_Query::create();
        if ($whereIn) {
            $result = $q->from("DatDocumentoprim d")
                ->innerJoin("d.NomDocprim nd")
                ->where("d.idestructurasubsist = ?", $subsistema)
                ->whereIn("nd.abreviatura", $alias)
                ->whereIn("d.iddoc", $whereIn)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        } else {
            if ($whereNotIn) {
                $result = $q->from("DatDocumentoprim d")
                    ->innerJoin("d.NomDocprim nd")
                    ->where("d.idestructurasubsist = ?", $subsistema)
                    ->whereIn("nd.abreviatura", $alias)
                    ->whereNotIn("d.iddoc", $whereNotIn)
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            } else {
                $result = $q->from("DatDocumentoprim d")
                    ->innerJoin("d.NomDocprim nd")
                    ->where("d.idestructurasubsist = ?", $subsistema)
                    ->whereIn("nd.abreviatura", $alias)
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            }
        }
        return $result;
    }

    /**
     * Obtiene identificador de documentos por alias
     *
     * @param mixed $aliascat            Alias
     * @param mixed $idestructurasubsist Identificador de subsistema
     *
     * @return mixed Identificador
     */
    public static function BuscarIdDocumentoPorAlia(
        $aliascat, $idestructurasubsist
    ) {
        $q = Doctrine_Query::create();
        $docs = $q->select("dd.iddoc")
            ->from('DatDocumentoprim dd')
            ->where(
                'dd.idestructurasubsist = ? and dd.sigla = ?',
                array($idestructurasubsist, $aliascat)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $docs;
    }

    /**
     * Obtiene documentos por entidad y nombre
     *
     * @param mixed $entidad Entidad
     * @param mixed $nomdoc  Nombre de documento
     *
     * @return mixed Documentos
     */
    public static function BuscarPorEntidadyNomDoc($entidad, $nomdoc)
    {
        $q = Doctrine_Query::create();
        $docs = array();
        $docs = $q->from('DatDocumentoprim dd')
            ->where(
                'dd.idestructurasubsist = ? and dd.iddocumentos = ?',
                array($entidad, $nomdoc)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return count($docs) ? $docs : array();
    }

    /**
     * Obtiene documentos por su identificador
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return mixed Documentos
     */
    public static function BuscarPorId($iddocumento)
    {
        $q = Doctrine_Query::create();
        $res = $q->from("DatDocumentoprim d")->innerJoin("d.NomDocprim nd")
            ->where("d.iddoc = $iddocumento")
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)->execute();
        return $res;
    }

    /**
     * Obtiene la cantidad de documentos por identificador
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return int Cantidad de documentos
     */
    public static function contBuscarPorId($iddocumento)
    {
        $q = Doctrine_Query::create();
        $res = $q->from("DatDocumentoprim d")->innerJoin("d.NomDocprim nd")
            ->where("d.iddocumentos = ?", $iddocumento)
            ->setHydrationMode(Doctrine :: HYDRATE_RECORD)->execute();
        return $res->count();
    }

    /**
     * Obtiene documentos por identificador
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return mixed Documentos
     */
    public static function BuscarPorIdDocumentos($iddocumento)
    {
        $q = Doctrine_Query::create();
        $res = $q->from("DatDocumentoprim d")->innerJoin("d.NomDocprim nd")
            ->where("d.iddocumentos = ?", $iddocumento)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        return $res;
    }

    /**
     * Obtiene documentos por condiciones
     *
     * @param mixed $cond Condiciones
     *
     * @return mixed Array con cantidad y datos de documentos o "false" en caso de Doctrine_Exception
     */
    public static function buscar($cond)
    {
        try {
            $filter = self::aplicateFilter($cond);
            $q = Doctrine_Query::create();
            if ($cond['subsistemas']) {
                if ($cond['limit']) {
                    $docs = $q->from('DatDocumentoprim e')
                        ->innerJoin('e.NomDocprim o')
                        ->where($filter)
                        ->whereIn("e.idestructurasubsist", $cond['subsistemas'])
                        ->orderby("o.denominacion")
                        ->limit($cond['limit'])->offset($cond['start'])
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
                } else {
                    $docs = $q->from('DatDocumentoprim e')
                        ->innerJoin('e.NomDocprim o')
                        ->where($filter)
                        ->whereIn("e.idestructurasubsist", $cond['subsistemas'])
                        ->orderby("o.denominacion")
                        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
                }
            } else {
                if ($cond['limit']) {
                    $docs = $q->from('DatDocumentoprim e')->innerJoin(
                        'e.NomDocprim o'
                    )->where($filter)
                        ->limit(
                            $cond['limit']
                        )->offset($cond['start'])->orderby("o.denominacion")
                        ->setHydrationMode(
                            Doctrine :: HYDRATE_ARRAY
                        )
                        ->execute();
                } else {
                    $docs = $q->from('DatDocumentoprim e')->innerJoin(
                        'e.NomDocprim o'
                    )->where($filter)
                        ->orderby(
                            "o.denominacion"
                        )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
                }
            }
            $cantidad = self::Cantidad($filter, $cond['subsistemas']);

            return array('cant' => $cantidad, 'datos' => $docs);
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Conforma un filtro de SQL
     *
     * @param mixed $cond Condiciones
     *
     * @return mixed Filtro
     */
    private static function aplicateFilter($cond)
    {
        $filter = " 0 = 0 ";
        if ($cond['iddoc']) {
            $filter .= " and e.iddoc = '" . $cond['iddoc'] . "'";
        }
        if ($cond['iddocumentos']) {
            $filter .= " and e.iddocumentos = '" . $cond['iddocumentos'] . "'";
        }
        if ($cond['idestructurasubsist']) {
            if (!is_array($cond['idestructurasubsist'])) {
                $filter
                    .= " and e.idestructurasubsist = '" . $cond['idestructurasubsist']
                    . "'";
            } else {
                $filter
                    .= " and e.idestructurasubsist in (" . implode(',', $cond['idestructurasubsist']) . ")";
            }
        }
        //campos foraneos
        //denominacion --> NomObjeto o
        if ($cond['denominacion']) {
            $filter .= " and (lower(o.denominacion) = '" . strtolower(
                    $cond['denominacion']
                ) . "'";
            $filter .= " or lower(o.denominacion) like '%" . strtolower(
                    $cond['denominacion']
                ) . "'";
            $filter .= " or lower(o.denominacion) like '%" . strtolower(
                    $cond['denominacion']
                ) . "%'";
            $filter .= " or lower(o.denominacion) like '" . strtolower(
                    $cond['denominacion']
                ) . "%')";
        }
        if ($cond['concepto']) {
            $filter
                .= " and (lower(o.concepto) = '" . strtolower($cond['concepto'])
                . "'";
            $filter
                .= " or lower(o.concepto) like '%" . strtolower($cond['concepto'])
                . "'";
            $filter
                .= " or lower(o.concepto) like '%" . strtolower($cond['concepto'])
                . "%'";
            $filter
                .= " or lower(o.concepto) like '" . strtolower($cond['concepto'])
                . "%')";
        }
        if ($cond['codigo']) {
            $filter .= " and (lower(o.codigo) = '" . strtolower($cond['codigo'])
                . "'";
            $filter
                .= " or lower(o.codigo) like '%" . strtolower($cond['codigo'])
                . "'";
            $filter
                .= " or lower(o.codigo) like '%" . strtolower($cond['codigo'])
                . "%'";
            $filter
                .= " or lower(o.codigo) like '" . strtolower($cond['codigo'])
                . "%')";
        }
        if ($cond['sigla']) {
            $filter .= " and e.sigla= '" . $cond['sigla'] . "'";
        }
        if ($cond['sfFiltro'] != '' && $cond['documento']) {
            $filter .= " and (o.concepto ILIKE '%" . $cond['sfFiltro']
                . "%' OR e.sigla ILIKE '%" . $cond['sfFiltro']
                . "%' OR o.codigo ILIKE '%" . $cond['sfFiltro']
                . "%' OR o.denominacion ILIKE '%" . $cond['sfFiltro'] . "%')";
        } else {
            if ($cond['sfFiltro'] != '') {
                $filter
                    .= " and (o.denominacion ILIKE '%" . $cond['sfFiltro']
                    . "%' OR o.codigo ILIKE '%" . $cond['sfFiltro']
                    . "%')";
            }
        }
        return $filter;
    }

    /**
     * Obtiene la cantidad de documentos por condiciones y subsistemas
     *
     * @param mixed $filter      Condiciones
     * @param mixed $subsistemas Subsistemas
     *
     * @return int Cantidad
     */
    public static function Cantidad($filter, $subsistemas)
    {

        $q = Doctrine_Query::create();

        if ($filter) {
            if ($subsistemas) {
                $count = $q->from("DatDocumentoprim e")->innerJoin(
                    'e.NomDocprim o'
                )->where($filter)->whereIn(
                    "e.idestructurasubsist", $subsistemas
                )->count();
            } else {
                $count = $q->from("DatDocumentoprim e")->innerJoin(
                    'e.NomDocprim o'
                )->where($filter)->count();
            }
        } else {
            if ($subsistemas) {
                $count = $q->from("DatDocumentoprim e")->innerJoin(
                    'e.NomDocprim o'
                )->whereIn(
                    "e.idestructurasubsist", $subsistemas
                )->count();
            } else {
                $count = $q->from("DatDocumentoprim e")->innerJoin(
                    'e.NomDocprim o'
                )->count();
            }
        }
        return $count;
    }

    /**
     * Obtiene documentos por identificador y estructura
     *
     * @param mixed $iddocumentos    Identificador de documento
     * @param mixed $idestructurasub Identificador de estructura
     *
     * @return mixed Documentos
     */
    public static function buscarPorIdDocEstructura(
        $iddocumentos, $idestructurasub
    ) {
        $q = Doctrine_Query::create();
        $res = $q->from("DatDocumentoprim d")
            ->where(
                "d.iddocumentos = ? and d.idestructurasubsist = ?",
                array($iddocumentos, $idestructurasub)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $res;
    }

    /**
     * Obtiene documento primario por identificador
     *
     * @param mixed $iddocprim Identificador de documento primario
     *
     * @return mixed Documento
     */
    public static function BuscarDocumentoPrimPorId($iddocprim)
    {
        $q = Doctrine_Query::create();
        $res = $q->from('DatDocumentoprim d')->where('iddoc =' . $iddocprim)
            ->execute()->toArray(true);
        return $res;
    }

    /**
     * Obtiene identificador de documento por estructura e identificador de nomenclador de documento
     *
     * @param mixed $idestructurasubsist Identificador de estructura
     * @param mixed $iddocnom            Identificador nomenclador de documento
     *
     * @return mixed Identificador de documento
     * @throws Doctrine_Exception
     */
    public static function ObtenerIdDocPorIdDocNom(
        $idestructurasubsist, $iddocnom
    ) {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('d.iddoc')
                ->from('DatDocumentoprim d')
                ->where(
                    'd.idestructurasubsist = ? AND d.iddocumentos = ?',
                    array($idestructurasubsist, $iddocnom)
                )
                ->execute();
            return $result[0]['iddoc'];
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene documentos por condiciones
     *
     * @param mixed $cond Condiciones
     *
     * @return mixed Documentos
     */
    public static function BuscarDocumentoParam($cond = array())
    {
        $filter = self::aplicateFilter($cond);
        $q = Doctrine_Query::create();
        $docprim = $q->select("e.*")
            ->from('DatDocumentoprim e')
            ->where($filter)
            //->limit($limit)
            //->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        //$q->free();

        return $docprim;
    }

    /**
     * Obtiene documentos por condiciones
     *
     * @param mixed $cond Condiciones
     *
     * @return mixed Array con cantidad y datos de documentos o "false" en caso de Doctrine_Exception
     */
    public static function buscarDocTodos($cond)
    {
        try {
            $cond['documento'] = true;
            $filter = self::aplicateFilter($cond);
//            print_r($cond);die;
            $subsistema = $cond['subsistemas'];
            $q = Doctrine_Query::create();
            $docs = $q->from('DatDocumentoprim e')->limit($cond['limit'])
                ->offset($cond['start'])
                ->innerJoin('e.NomDocprim o')
                ->where($filter)
                ->whereIn("e.idestructurasubsist", $cond['subsistemas'])
                ->orderby("e.idestructurasubsist, o.denominacion")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            $cantidad = self::Cantidad($filter, $subsistema);
            $resultado = array('cant' => $cantidad, 'datos' => $docs);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Verifica si existen documentos asociados a un subsistema
     *
     * @param mixed $agIdDocPrim Identificadores de documentos
     *
     * @return int Cantidad de documentos
     * @throws Doctrine_Exception
     */
    static public function yaExisteDocumentoAsociadoSubsistema($agIdDocPrim)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->from("DatDocumentoprim d")
                ->innerJoin("d.NomDocprim n")
                ->where("d.iddocumentos = ?", $agIdDocPrim)
                ->setHydrationMode(Doctrine_Core::HYDRATE_RECORD)
                ->execute()->count();
            return $result;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * Obtiene los documentos primarios dado el identificador de estructura
     *
     * @param mixed $idEstructSubsistema Identificador de estructura
     *
     * @return array Documentos
     * @throws Doctrine_Exception
     */
    static function GetDocsPrim($idEstructSubsistema)
    {
        try {
            $q = Doctrine_Query::create();
            $res = $q->select('d.*,nd.*')->from("DatDocumentoprim d")
                ->innerJoin("d.NomDocprim nd")->where(
                    "d.idestructurasubsist = ?", $idEstructSubsistema
                )->setHydrationMode(Doctrine :: HYDRATE_RECORD)->execute();
            return $res->toArray();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Verifica si existe otro documento primario con el mismo código o denominación
     *
     * @param mixed $objNomDocPrim Objeto de nomenclador de documento
     * @param mixed $iddocumentos  Identificador del documento para verificar
     *
     * @retun -1 si no coinciden, -5 si se encuentra otro documento con su denominación, -2 si se encuentra
     *        otro documento con el mismo código.
     * @throws Doctrine_Exception
     */
    static function verificarMod($objNomDocPrim, $iddocumentos)
    {
        $denominacion = $objNomDocPrim->denominacion;
        $codigo = $objNomDocPrim->codigo;
        $abreviatura = $objNomDocPrim->abreviatura;

        try {
            $query = Doctrine_Query::create();
            $denomNomDocPrim = $query->select('ndp.iddocumentos')
                ->from('NomDocprim ndp')
                ->where(
                    "ndp.denominacion iLIKE '$denominacion'  AND ndp.iddocumentos <> '$iddocumentos'"
                )
                ->setHydrationMode(Doctrine_Core::HYDRATE_RECORD)
                ->execute();

            $abrevNomDocPrim = $query->select('ndp.iddocumentos')
                ->from('NomDocPrim ndp')
                ->where(
                    "ndp.abreviatura = '$abreviatura'  AND ndp.iddocumentos <> '$iddocumentos'"
                )
                ->setHydrationMode(Doctrine_Core::HYDRATE_RECORD)
                ->execute();
            if (!empty($codigo)) {
                $codigoNomDocPrim = $query->select('ndp.iddocumentos')
                    ->from('NomDocPrim ndp')
                    ->where(
                        "ndp.codigo = '$codigo'  AND ndp.iddocumentos <> '$iddocumentos'"
                    )
                    ->setHydrationMode(Doctrine_Core::HYDRATE_RECORD)
                    ->execute();
            }
            if (!empty($codigo) && $codigoNomDocPrim->count() > 0) {
                return -4;
            } else {
                if ($denomNomDocPrim->count() > 0) {
                    return -5;
                } else {
                    if ($abrevNomDocPrim->count() > 0) {
                        return -6;
                    }
                }
            }
            return -1;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtiene los documentos primarios dado el identificador de estructura
     *
     * @param mixed $idEstructSubsistema Identificador de estructura
     *
     * @return array Documentos
     * @throws Doctrine_Exception
     */
    static function GetDocsPrimByEstructura($idestrucutura)
    {
        try {
            $manager = Doctrine_Manager::getInstance();
            $conexion = $manager->getCurrentConnection();

            $query = "SELECT m1.*,m2.* FROM mod_datosmaestros.dat_documentoprim m1
                      INNER JOIN mod_datosmaestros.dat_estructurasubsist m2 ON
                      m2.idestructurasubsist = m1.idestructurasubsist WHERE idestructuracomun = $idestrucutura;";
            return $conexion->fetchAll($query);
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    static public function EraseByEstrucutura($idestructura)
    {
        try {
            $manager = Doctrine_Manager::getInstance();
            $conexion = $manager->getCurrentConnection();

            $query = "DELETE FROM mod_datosmaestros.dat_documentoprim WHERE idestructurasubsist IN
                      (SELECT m2.idestructurasubsist FROM mod_datosmaestros.dat_documentoprim m1
                      INNER JOIN mod_datosmaestros.dat_estructurasubsist m2 ON
                      m2.idestructurasubsist = m1.idestructurasubsist WHERE idestructuracomun = $idestructura);";
            $conexion->fetchAll($query);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}
