<?php

/**
 * Clase dominio <b>Tasas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class DatTasa extends BaseDatTasa
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
                'NomTipotasas', array('local' => 'idtipotasa', 'foreign' => 'idtipotasa')
        );
        $this->hasOne(
                'NomMoneda', array('local' => 'idmoneda', 'foreign' => 'idmoneda')
        );
        parent::setUp();
    }

    /**
     * Obtiene tasas.
     *
     * @param array $cond              Condiciones
     * @param mixed $idestructuracomun Identificador de estructura común
     * @param int   $limit             Límite
     * @param int   $start             Inicio
     *
     * @return mixed Tasas
     * @throws Doctrine_Exception
     */
    public function getTasas(
    $cond = array(), $idestructuracomun = 0, $limit = 10, $start = 0
    )
    {
        try {
            $filter = "";
            if ($idestructuracomun) {
                $filter .= "e.idestructuracomun = '" . $idestructuracomun . "'";
            }
            if ($cond['sfFiltro'] != '') {
                $filter .= "and e.nombretasa ilike '%" . $cond['sfFiltro']
                        . "%' OR nm.codigoiso ilike '%" . $cond['sfFiltro']
                        . "%' OR t.nombretipotasa ilike '%" . $cond['sfFiltro']
                        . "%'";
            }
            $where = "";
            if($filter){
                $where = "WHERE $filter";
            }
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();

            $query = "SELECT e.*,nm.*,t.*, nm1.codigoiso AS codigoisomonedacontable,
                      (CASE WHEN ncp.registrado = 0 THEN ncp.nombre else COALESCE
                      (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as nombrecliente
                      FROM mod_datosmaestros.dat_tasa e
                      INNER JOIN mod_datosmaestros.dat_monedaentidad mn
                      ON (e.idmonedacontable = mn.idmonedaentidad AND e.idmoneda != mn.idmoneda)
                      LEFT JOIN mod_datosmaestros.nom_moneda nm on e.idmoneda = nm.idmoneda
                      LEFT JOIN mod_datosmaestros.nom_moneda nm1 on mn.idmoneda = nm1.idmoneda
                      LEFT JOIN mod_datosmaestros.nom_tipotasa t on e.idtipotasa = t.idtipotasa
                      LEFT JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = e.idcliente
                      LEFT JOIN mod_estructuracomp.dat_estructura estru
                      ON (ncp.idestructura = estru.idestructura and estru.idproyecto=0)
                      LEFT JOIN mod_persona.dat_persona per ON (ncp.idpersona = per.idpersona)
                    $where ORDER BY e.idtipotasa, e.nombretasa
                    ";
            //print_r($query);die;
            $extra = " LIMIT $limit OFFSET $start";
            if ($filter) {
                $result = $conexionActual->fetchAll($query.$extra);
            }
            $query = "SELECT count(a.idtasa) as cantidad FROM ($query)a";
            $count = $conexionActual->fetchAll($query.$extra);
            return array('data'=>$result,'count'=>$count[0]['cantidad']);
        } catch (Doctrine_Exception $ee) {
            return $ee;
        }
    }

    /**
     * Obtiene tasas a partir de condiciones.
     *
     * @param array $cond  Condiciones
     * @param int   $limit Límite
     * @param int   $start Inicio
     *
     * @return array Tasas
     * @throws Doctrine_Exception
     */
    public function buscarDatTasa($cond = array(), $limit = 10, $start = 0)
    {
        try {
            $filter = " 0=0 ";
            $filter .= self::auxFiltroFirst($cond);
            $filter .= self::auxFiltroSecond($cond);
            $filter .= self::auxFiltroThird($cond);
            $q = new Doctrine_Query();
            $estudiant = ($filter) ? $q->from('DatTasa e')->where($filter)
                            ->limit($limit)->offset($start)->execute() : $q->from(
                            'DatTasa e'
                    )->limit($limit)->offset($start)->execute();
            $estudiantes = $estudiant->toArray();

            $cantidad = self::Cantidad($filter);
            $resultado = array('cant' => $cantidad, 'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    private function auxFiltroFirst($cond)
    {
        $filter = "";
        if ($cond['idtasa']) {
            $filter .= " and e.idtasa = '" . $cond['idtasa'] . "'";
        }
        if ($cond['venta']) {
            $filter .= " and e.venta = '" . $cond['venta'] . "'";
        }
        if ($cond['compra']) {
            $filter .= " and e.compra = '" . $cond['compra'] . "'";
        }
        if ($cond['desde']) {
            $filter .= " and e.desde = '" . $cond['desde'] . "'";
        }
        return $filter;
    }

    private function auxFiltroSecond($cond)
    {
        $filter = "";
        if ($cond['hasta']) {
            $filter .= " and e.hasta = '" . $cond['hasta'] . "'";
        }
        if ($cond['idcliente']) {
            $filter .= " and e.idcliente = '" . $cond['idcliente'] . "'";
        }
        if ($cond['referencia']) {
            $filter .= " and e.referencia = '" . $cond['referencia'] . "'";
        }
        if ($cond['idtipotasa']) {
            $filter .= " and e.idtipotasa = '" . $cond['idtipotasa'] . "'";
        }
        if ($cond['idmoneda']) {
            $filter .= " and e.idmoneda = '" . $cond['idmoneda'] . "'";
        }
        return $filter;
    }

    private function auxFiltroThird($cond)
    {
        $filter = "";
        if ($cond['factordeconversion']) {
            $filter .= " and e.factordeconversion = '". $cond['factordeconversion'] . "'";
        }
        if ($cond['idmonedacontable']) {
            $filter .= " and e.idmonedacontable = '" . $cond['idmonedacontable'] . "'";
        }
        if ($cond['nombretasa']) {
            $filter .= " and lower(e.nombretasa) = '" . strtolower($cond['nombretasa']) . "'";
        }
        if ($cond['codigoiso']) {
            $filter .= " and lower(m.codigoiso) = '" . strtolower($cond['codigoiso']) . "'";
        }
        if ($cond['idestructuracomun']) {
            $filter .= " and e.idestructuracomun = '" . $cond['idestructuracomun']. "'";
        }
        return $filter;
    }

    /**
     * Obtiene tasa a partir de su identificador.
     *
     * @param mixed $idtasa Identificador de tasa
     *
     * @return array Tasa
     * @throws ZendExt_Exception
     */
    static public function buscarTasaPorId($idtasa)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from("DatTasa dt")->where(
                            "dt.idtasa = ?", $idtasa
                    )->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw new ZendExt_Exception('CONF00', $e);
        }
    }

    /**
     * Obtiene la cantidad de tasas que cumplen ciertas condiciones.
     *
     * @param mixed $filter Condiciones
     *
     * @return int Cantidad
     */
    static public function Cantidad($filter)
    {
        $q = new Doctrine_Query();
        if ($filter) {
            $count = $q->select("COUNT(e.idtasa) cant")->from("DatTasa e")
                            ->where($filter)->execute();
        } else {
            $count = $q->select("COUNT(e.idtasa) cant")->from("DatTasa e")
                    ->execute();
        }

        $cant = $count->toArray();
        return $cant[0]['cant'];
    }

    /**
     * Obtiene tasas a partir de condiciones.
     *
     * @param string $select Atributos que se desean seleccionar
     * @param array  $cond   Condiciones
     *
     * @return mixed Tasas o "false" si no existe ninguna que cumpla las
     * condiciones
     */
    public function Tasas($select = '', $cond = array())
    {
        try {
            $filter = " 0=0 ";
            $filter .= self::auxFiltroFirst($cond);
            $filter .= self::auxFiltroSecond($cond);
            $filter .= self::auxFiltroThird($cond);
            if ($cond['cotizacionvariable']) {
                $filter .= " and e.cotizacionvariable = '"
                        . $cond['cotizacionvariable'] . "'";
            }
            $limit = 10;
            $start = 0;
            if ($cond['limit'] && $cond['start']) {
                $limit = $cond['limit'];
                $start = $cond['start'];
            }
            $q = new Doctrine_Query();
            $estudiante = $q->from('DatTasa e')->where($filter)->execute();
            $estudiant = $q->from('DatTasa e')->where($filter)->limit($limit)
                            ->offset($start)->execute();
            $estudiantes = $estudiant->toArray();
            if (!$select) {
                if ($filter) {
                    $estudiant = ($cond['limit'] && $cond['start']) ? $q->select(
                                    "e.idtasa,e.venta,e.compra,e.desde,e.hasta,e.idcliente,e.referencia,e.idtipotasa,
                            e.factordeconversion,e.version,e.idmonedacontable,e.idmoneda,e.nombretasa,e.tiempoactual,
                            e.idestructuracomun"
                            )->from('DatTasa e')->where($filter)->limit(
                                    $cond['limit']
                            )->offset($cond['start'])->execute() : $q->select(
                                    "e.idtasa,e.venta,e.compra,e.desde,e.hasta,e.idcliente,e.referencia,e.idtipotasa,
                            e.factordeconversion,e.version,e.idmonedacontable,e.idmoneda,e.nombretasa,e.tiempoactual,
                            e.idestructuracomun"
                            )->from('DatTasa e')->where($filter)->execute();
                } else {
                    $estudiant = ($cond['limit'] && $cond['start']) ? $q->select(
                                    "e.idtasa,e.venta,e.compra,e.desde,e.hasta,e.idcliente,e.referencia,e.idtipotasa,
                            e.factordeconversion,e.version,e.idmonedacontable,e.idmoneda,e.nombretasa,e.tiempoactual,
                            e.idestructuracomun"
                            )->from('DatTasa e')->limit($cond['limit'])->offset(
                                    $cond['start']
                            )->execute() : $q->select(
                                    "e.idtasa,e.venta,e.compra,e.desde,e.hasta,e.idcliente,e.referencia,e.idtipotasa,
                            e.factordeconversion,e.version,e.idmonedacontable,e.idmoneda,e.nombretasa,e.tiempoactual,
                            e.idestructuracomun"
                            )->from('DatTasa e')->execute();
                }
            } else {
                if ($filter) {
                    $estudiant = ($cond['limit'] && $cond['start']) ? $q->select($select)->from('DatTasa e')
                    ->where($filter)
                                    ->limit($cond['limit'])->offset($cond['start'])
                                    ->execute() : $q->select($select)->from('DatTasa e')->where($filter)
                                    ->execute();
                } else {
                    $estudiant = ($cond['limit'] && $cond['start']) ? $q->select($select)->from('DatTasa e')->limit(
                                    $cond['limit']
                            )->offset($cond['start'])->execute() : $q->select(
                                    $select
                            )->from('DatTasa e')->execute();
                }
            }
            $resultado = array('cant' => $estudiante->count(),
                'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene identificadores de tasas.
     *
     * @param mixed $idestructuracomun Identificador de estructura común
     * @param int   $limit             Límite
     * @param int   $start             Inicio
     *
     * @return array Identificadores de tasas
     * @throws Doctrine_Exception
     */
    static public function buscar($idestructuracomun, $limit = 10, $start = 0)
    {
        try {
            $query = Doctrine_Query::create();
            $tasas = $query->select("e.idtasa")
                    ->from('DatTasa e')
                    ->innerJoin("e.NomTipotasas t")
                    ->innerJoin("e.NomMoneda m")
                    ->where("t.idestructuracomun = $idestructuracomun")
                    ->limit($limit)
                    ->offset($start)
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            $resultado = array('cant' => count($tasas), 'datos' => $tasas);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return $ee->errorMessage();
        }
    }

    /**
     * Obtiene una tasa.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idtasa            Identificador de tasa
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return mixed Tasa
     */
    public static function getTasa($idmoneda = '', $idtasa = '', $idestructuracomun = '')
    {
        $q = Doctrine_Query::create();
        $filter = " 0=0 ";
        if ($idtasa) {
            $filter .= " and e.idtasa = '" . $idtasa . "'";
        }
        if ($idmoneda) {
            $filter .= " and e.idmoneda = '" . $idmoneda . "'";
        }
        if ($idestructuracomun) {
            $filter .= " and e.idestructuracomun = '" . $idestructuracomun
                    . "'";
        }
        if ($filter) {
            $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                            $filter
                    )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        } else {
            $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")
                            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        }
        return $tasas;
//        return array();
    }

    /**
     * Obtiene las tasas de cierre diario.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return array Tasa
     */
    public static function TasaActual($idmoneda, $idestructuracomun)
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idtipotasa = ? and e.idestructuracomun = ?", array($idmoneda, 2,
                            $idestructuracomun)
                )->orderBy('hasta desc')->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene la tasa actual de la XETID.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return array Tasa
     */
    public static function TasaActualXetid($idmoneda, $idestructuracomun)
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idtipotasa = ? and e.idestructuracomun = ?", array($idmoneda, 2,
                            $idestructuracomun)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene todas las tasas por moneda.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return array Tasa
     */
    public static function AllTasasByMoneda($idmoneda, $idestructuracomun)
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idestructuracomun = ?", array($idmoneda, $idestructuracomun)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene la tasa por moneda dato el tipo de tasa.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     * @param int   $idtipotasa        tipo de tasa
     *
     * @return array Tasa
     */
    public static function TasasByMonedaIdTipoTasa($idmoneda, $idestructuracomun, $idtipotasa = 2)
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idestructuracomun = ? and e.idtipotasa = ?", array($idmoneda, $idestructuracomun, $idtipotasa)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene la tasa actualizada.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return array Tasa
     * @throws Doctrine_Exception
     */
    public static function TasaActualActualizada($idmoneda, $idestructuracomun)
    {
        try {
            $instanceGlobal = ZendExt_GlobalConcept::getInstance();
            $instanceIntegrator = ZendExt_IoC::getInstance();
            $fecha = $instanceGlobal->FechaContable->fecha;
            if (!$fecha) {
                $fecha = $instanceIntegrator->parametros
                        ->fechaContableSubsistema($idestructuracomun, 4);
            }
            $query = new Doctrine_Query();
            $tasas = $query
                    ->from('DatTasa e')
                    ->innerJoin("e.NomMoneda m")
                    ->where(
                            "e.idmoneda = $idmoneda and e.idtipotasa = 2
                    and e.idestructuracomun = $idestructuracomun
                    and (e.hasta >= '$fecha' OR e.hasta IS NULL)
                    and (e.desde <= '$fecha' or e.desde is NULL)"
                    )
                    ->execute()
                    ->toArray();
            return $tasas;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene la tasa actualizada de la XETID.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return array Tasa
     * @throws Doctrine_Exception
     */
    public static function TasaActualActualizadaXetid(
    $idmoneda, $idestructuracomun
    )
    {
        try {
            $instanceGlobal = ZendExt_GlobalConcept::getInstance();
            $instanceIntegrator = ZendExt_IoC::getInstance();
            $fecha = $instanceGlobal->FechaContable->fecha;
            if (!$fecha) {
                $fecha = $instanceIntegrator->parametros->fechaContableSubsistema(
                        $idestructuracomun, 4
                );
            }
            $query = new Doctrine_Query();
            $tasas = $query
                    ->from('DatTasa e')
                    ->innerJoin("e.NomMoneda m")
                    ->where(
                            "e.idmoneda = $idmoneda and e.idtipotasa = 2
                    and e.idestructuracomun = $idestructuracomun
                     and (e.hasta >= '$fecha' OR e.hasta IS NULL)
                     and (e.desde <= '$fecha' or e.desde is NULL)"
                    )
                    ->execute()
                    ->toArray();
            return $tasas;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene tasa por fecha.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     * @param mixed $fecha             Fecha
     *
     * @return array Tasa
     */
    public static function TasaPorFecha(
    $idmoneda, $idestructuracomun, $fecha = null
    )
    {
        if ($fecha == null) {
            $instanceGlobal = ZendExt_GlobalConcept::getInstance();
            $instanceIntegrator = ZendExt_IoC::getInstance();
            $fecha = $instanceGlobal->FechaContable->fecha;

            if (!$fecha) {
                $fecha = $instanceIntegrator->parametros->fechaContableSubsistema(
                        $idestructuracomun, 4
                );
            }
        }
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idtipotasa = ? and e.idestructuracomun = ?
            and (e.hasta >= ? or e.hasta is NULL) and e.desde <= ?", array($idmoneda, 2, $idestructuracomun,
                $fecha, $fecha)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene tasa por fecha en la XETID.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     * @param mixed $fecha             Fecha
     *
     * @return array Tasa
     */
    public static function TasaPorFechaXetid(
    $idmoneda, $idestructuracomun, $fecha = null
    )
    {
        if ($fecha == null) {
            $instanceGlobal = ZendExt_GlobalConcept::getInstance();
            $instanceIntegrator = ZendExt_IoC::getInstance();
            $fecha = $instanceGlobal->FechaContable->fecha;

            if (!$fecha) {
                $fecha = $instanceIntegrator->parametros->fechaContableSubsistema(
                        $idestructuracomun, 4
                );
            }
        }
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idestructuracomun = ? and (e.hasta >= ?
            or e.hasta is NULL) and e.desde <= ?", array($idmoneda, $idestructuracomun, $fecha, $fecha)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene cantidad de tasas a partir de la entidad.
     *
     * @param mixed $entidad Identificador de estructura común
     *
     * @return int Cantidad de tasas
     */
    public static function GetCantidadTasa($entidad)
    {
        $query = new Doctrine_Query();
        $result = NomTipotasas::Buscar_Id_ByDenominacionA();
        if ($result) {
            $datos = $result->toArray();
            $idtipotasaCierreDia = $datos[0]['idtipotasa'];
            return $query->from('DatTasa t')->where(
                            't.idtipotasa=? and t.idestructuracomun=?', array($idtipotasaCierreDia, $entidad)
                    )->count();
        }
        return 0;
    }

    /**
     * Obtiene tasas por límite.
     *
     * @param int $limite Límite
     * @param int $inicio Inicio
     *
     * @return mixed Tasas
     */
    public static function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = Doctrine_Query::create();
        $denominacion = "Cierre de dia";
        $result = NomTipotasas::Buscar_Id_ByDenominacion($denominacion);
        if ($result) {
            $datos = $result->toArray();
            $idtipotasaCierreDia = $datos[0]['idtipotasa'];
            $result = $query->from('DatTasa t,t.NomMoneda moneda')->where(
                            't.idtipotasa=?', $idtipotasaCierreDia
                    )->limit($limite)->offset($inicio)->execute();
        }
        return $result;
    }

    /**
     * Obtiene tasas por código ISO.
     *
     * @param mixed $codigoiso Código ISO
     *
     * @return mixed Tasas
     */
    public static function BuscarByCodigoISO($codigoiso)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatTasa t,t.NomMoneda moneda')->where(
                        'moneda.codigoiso=?', $codigoiso
                )->execute();
        return $result;
    }

    /**
     * Obtiene nombre de monedas a partir de un identificador de tasa.
     *
     * @param mixed $idtasa Identificador de tasa
     *
     * @return mixed Monedas
     */
    public static function GetNombreMoneda($idtasa)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('ta.idtasa , moneda.nombremoneda')->from(
                        'DatTasa ta'
                )->innerJoin("ta.NomMoneda moneda")->where('ta.idtasa=?', $idtasa)
                ->execute();

        return $result;
    }

    /**
     * Obtiene factores a partir de un identificador de moneda.
     *
     * @param mixed $idmoneda Identificador de moneda
     *
     * @return array Tasa
     */
    public static function GetFactoresByMoneda($idmoneda)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatTasa ta')
                        ->innerJoin('ta.NomMoneda nm')
                        ->innerJoin('nm.DatNommonedaEntidad dnm')
                        ->where(
                                "dnm.idnommonedaentidad = ? AND ta.idtipotasa = ?", array($idmoneda, 2)
                        )->execute()->toArray();
        return $result;
    }

    /**
     * Obtiene tasas contratadas.
     *
     * @param mixed $idmoneda  Identificador de moneda
     * @param mixed $idcliente Identificador de cliente
     * @param mixed $entidad   Identificador de estructura común
     *
     * @return array Tasas
     */
    public static function TasasContratadas($idmoneda, $idcliente, $entidad)
    {
        $q = Doctrine_Query::create();
        $instanceGlobal = ZendExt_GlobalConcept::getInstance();
        $fecha = $instanceGlobal->FechaContable->fecha;
        if (!$fecha) {
            $fecha = $integrator->datosmaestros->fechaContableSubsistema(
                    $entidad, 4
            );
        }
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idcliente = ? and e.idtipotasa = ?
            and e.idestructuracomun = ? and e.desde <= ? and e.hasta >= ?", array($idmoneda, $idcliente, 1,
                $entidad, $fecha, $fecha)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene tasas contratadas actualmente.
     *
     * @param mixed $idmoneda  Identificador de moneda
     * @param mixed $idcliente Identificador de cliente
     * @param mixed $entidad   Identificador de estructura común
     *
     * @return array Tasas
     */
    public static function TasasContratadasActuales(
    $idmoneda, $idcliente, $entidad
    )
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idcliente = ? and e.idtipotasa = ? and e.idestructuracomun = ?
                        and e.hasta < ?", array($idmoneda, $idcliente, 1, $entidad, date("d/m/Y"))
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene la tasa inicial.
     *
     * @return array Tasa
     */
    public static function tasaInicial()
    {
        $q = Doctrine_Query::create();
        $tasas = $q->select("e.*")->from('DatTasa e')->where("e.idtasa = ?", 1)
                        ->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene la tasa actual a partir de la moneda contable y la entidad.
     *
     * @param mixed $idmoneda          Identificador de la moneda contable
     * @param mixed $idestructuracomun Identificador de la estructura común
     *
     * @return array Tasa
     */
    public static function TasaActualMonEnt($idmoneda, $idestructuracomun)
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idtipotasa = ? and e.idestructuracomun = ?",
                        array($idmoneda, 2, $idestructuracomun)
                )->execute()->toArray();
        return $tasas;
    }

    public static function TasaMonEnt($idmonedaContable, $idestructuracomun, $idmonedaAlternativa,$idtipotasa = 2)
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmonedacontable = ? and e.idmoneda = ? and e.idestructuracomun = ? and e.idtipotasa = ?",
                        array($idmonedaContable, $idmonedaAlternativa, $idestructuracomun,$idtipotasa)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene la tasa actual a partir de la moneda y la entidad en la XETID.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return array Tasa
     */
    public static function TasaActualMonEntXetid($idmoneda, $idestructuracomun)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $tasas = $conexionActual->fetchAll(
            "SELECT t.* FROM mod_datosmaestros.dat_tasa t INNER JOIN mod_datosmaestros.nom_moneda m
             ON t.idmoneda = m.idmoneda INNER JOIN mod_datosmaestros.dat_monedaentidad dmn ON m.idmoneda = dmn.idmoneda
             WHERE dmn.idmonedaentidad = '$idmoneda' AND t.idestructuracomun = '$idestructuracomun';"
        );
        /*$q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->innerJoin('m.DatNommonedaEntidad dnm')->where(
                        "dnm.idmonedaentidad = ? and e.idestructuracomun = ?", array($idmoneda, $idestructuracomun)
                )->execute()->toArray();*/
        return $tasas;
    }

    /**
     * Obtiene las tasas vigentes en una fecha.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idestructuracomun Identificador de estructura común
     * @param mixed $fecha             Fecha
     *
     * @return array Tasas
     */
    public static function BuscarTasasVigentesFecha(
    $idmoneda, $idestructuracomun, $fecha
    )
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idestructuracomun = ? and e.desde <= ? and (e.hasta >= ? or
                            e.hasta is NULL)", array($idmoneda, $idestructuracomun, $fecha, $fecha)
                )->execute()->toArray();
        return $tasas;
    }

    /**
     * Obtiene tasas por tipo y moneda.
     *
     * @param mixed $idmoneda          Identificador de moneda
     * @param mixed $idTipoTasa        Identificador de tipo de tasa
     * @param mixed $idestructuracomun Identificador de estructura común
     *
     * @return array Tasas
     */
    public static function BuscarTasasPorTipoyMoneda(
    $idmoneda, $idTipoTasa, $idestructuracomun
    )
    {
        $q = Doctrine_Query::create();
        $tasas = $q->from('DatTasa e')->innerJoin("e.NomMoneda m")->where(
                        "e.idmoneda = ? and e.idestructuracomun = ? and e.idtipotasa <= ?", array($idmoneda,
                            $idestructuracomun, $idTipoTasa)
                )->execute()->toArray();
        return $tasas;
    }

}
