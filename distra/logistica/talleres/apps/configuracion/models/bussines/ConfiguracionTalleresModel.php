<?php

/**
 * @version 1.0
 */
class ConfiguracionTalleresModel extends ZendExt_Model
{

    private $_serviciosPlanificacion, $_serviciosEstructuraComposicion, $_logistEstrucUbica,$_ordenTrabajoTalleres,$_serviciosRecursosHumanos;

    public function __construct()
    {
        parent::__construct();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->_serviciosEstructuraComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->_logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
      $this->_ordenTrabajoTalleres = new OrdenTrabajoTalleresModel();
    }

    public function adicionarServicioAlArea($parametros)
    {
        $relactividades = json_decode($parametros['relactividades'], true);
        $relpersonas = json_decode($parametros['relpersonas'], true);
        $arrAdicionado = $relactividades['adicionados'];
        $arrModificados = $relactividades['modificados'];
//        $arrAdicionado = array_column($arrAdicionado, 'idservicio');
        $arrEliminados = $relactividades['eliminados'];

        $arrAdicionadoPer = $relpersonas['adicionados'];
        $arrAdicionadoPer = array_column($arrAdicionadoPer, 'idpersona');
        $arrEliminadosPer = $relpersonas['eliminados'];
        if (count($arrEliminados) > 0) {
            Doctrine_Query::create()->delete('ConfServicioArea')->whereIn(
                'idservicioarea ', $arrEliminados
            )->andWhere('idarea = ?', array($parametros['idarea']))->execute();
        }
        if (count($arrEliminadosPer) > 0) {
            Doctrine_Query::create()->delete('ConfPersonaArea')->whereIn(
                'idpersonaarea ', $arrEliminadosPer
            )->andWhere('idarea = ?', array($parametros['idarea']))->execute();
        }

        if ($arrModificados) {
            foreach ($arrModificados as $modificado) {
                $obj = Doctrine::getTable('ConfServicioArea')
                    ->find($modificado['idservicioarea']);
                if ($obj->idservicioarea) {
                    $obj->idcentrodecosto = $modificado['idcentrodecosto'];
                    $obj->save();
                }
            }
        }

        $serviciosAddArray = new Doctrine_Collection('ConfServicioArea');
        if ($arrAdicionado) {
            foreach ($arrAdicionado as $adicionado) {
                $objServArea = new ConfServicioArea();
                $objServArea->idservicio = $adicionado['idservicio'];
                $objServArea->idcentrodecosto = $adicionado['idcentrodecosto'];
                $objServArea->idarea = $parametros['idarea'];
                $objServArea->idestructuracomun = $this->global->Estructura->idestructura;
                $objServArea->contratoobligatorio = $parametros['contratoobligatorio'] ? 1 : 0;
                $serviciosAddArray[] = $objServArea;
            }
            if (count($serviciosAddArray)) {
                $serviciosAddArray->save();
            }
        } else {
            $contrato = Doctrine_Query::create()->select('sa.contratoobligatorio')->from('ConfServicioArea sa')
                ->where('idestructuracomun = ?', array($this->global->Estructura->idestructura)
            )->execute();

            if (count($contrato) > 0) {
                $contratoobligatorio = ($parametros['contratoobligatorio']) ? 1 : 0;
                $sqlUpdate = "UPDATE mod_logtaller.conf_servicioarea " .
                    "SET contratoobligatorio = {$parametros['contratoobligatorio']} " .
                    "WHERE idestructuracomun = {$this->global->Estructura->idestructura} ";
                Doctrine_Manager::connection()->fetchAll($sqlUpdate);
            } else {
                $objServArea = new ConfServicioArea();
                $objServArea->idestructuracomun = $this->global->Estructura->idestructura;
                $objServArea->contratoobligatorio = $parametros['contratoobligatorio'];
                $objServArea->save();
            }
        }
        $PersonasAddArray = new Doctrine_Collection('ConfPersonaArea');
        if ($arrAdicionadoPer) {
            foreach ($arrAdicionadoPer as $idpersona) {
                $objServPersona = new ConfPersonaArea();
                $objServPersona->idpersona = $idpersona;
                $objServPersona->idarea = $parametros['idarea'];
                $objServPersona->idestructuracomun = $this->global->Estructura->idestructura;
                $PersonasAddArray[] = $objServPersona;
            }
            if (count($PersonasAddArray)) {
                $PersonasAddArray->save();
            }
        }
        $ccpa = ($parametros['centrocostosporactividad']) ? 1 : 0;
        $comp = ($parametros['comprobante']) ? 1 : 0;
        $cerraroperarios = ($parametros['Cerraroperarios']) ? 1 : 0;
        $cierredif = ($parametros['cerrarcondiferencia']) ? 1 : 0;
        $ordenproducto = ($parametros['ordenproducto']) ? $parametros['ordenproducto']: 0;
        $centrocostosporactividad = Doctrine_Query::create()->select('ct.centrocostosporactividad')->from('ConfTalleres ct')
            ->where('idestructuracomun = ?', array($this->global->Estructura->idestructura)
            )->execute();

        if (count($centrocostosporactividad) > 0) {
            $sqlUpdate = "UPDATE mod_logtaller.conf_talleres " .
               "SET centrocostosporactividad = {$ccpa}, comprobante = {$comp}, cierrecondiferencia = {$cierredif}, ordenproducto = {$ordenproducto}, 
               cerraroperarios = {$cerraroperarios}" .
                "WHERE idestructuracomun = {$this->global->Estructura->idestructura} ";
            Doctrine_Manager::connection()->fetchAll($sqlUpdate);
        } else {
            $objConfTalleres = new ConfTalleres();
            $objConfTalleres->idestructuracomun = $this->global->Estructura->idestructura;
            $objConfTalleres->centrocostosporactividad = $ccpa;
            $objConfTalleres->comprobante = $comp;
            $objConfTalleres->cierrecondiferencia = $cierredif;
            $objConfTalleres->ordenproducto =  $ordenproducto;
            $objConfTalleres->cerraroperarios = ($parametros['Cerraroperarios']) ? 1 : 0;
            if( $objConfTalleres->cierrecondiferencia == 1){
                $parametros['cierrecondiferencia'] = true;
             }
            $objConfTalleres->save();
        }
    }

    public function cargarServiciosExistentes($parametros)
    {
        $idEntidad = $this->global->Estructura->idestructura;
        /*$denominacion = ($parametros['criterio']) ? $parametros['criterio'] : null;
        $query = new Doctrine_Query();
        $query->select('sa.idservicio')->from('ConfServicioArea sa')->where(
            'idarea = ?', array($parametros['idarea'])
        );
        $excluir = $this->auxiliarCargarServiciosExistentes($query->fetchArray());
        $filtro[] = array('valor' => $denominacion);
        $filtro[] = ($excluir) ? array('notIn' => $excluir) : array();*/
        //Servicio que venia de Planificacion
        /*$servicios = $this->_serviciosPlanificacion->obtenerActividadyNorma(
            3, ($parametros['idservicio']) ? $parametros['idservicio'] : null, ($filtro) ? $filtro : array(),
            ($parametros['start']) ? $parametros['start'] : 0, ($parametros['limit']) ? $parametros['limit'] : 30,
            ($parametros['hijos']) ? $parametros['hijos'] : 0
        );*/
        $limit = $parametros['limit'] ? $parametros['limit'] : 30;
        $start = $parametros['start'] ? $parametros['start'] : 0;
        $sqlFiltrar = '';
        if ($parametros['filtrado'] == 1) {
            $sqlFiltrar = " AND (cs.denominacion ilike '%{$parametros['criterio']}%'
            OR cs.codigo ilike '%{$parametros['criterio']}%')
            ";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "select cs.denominacion, cs.codigo, cs.idactividad as idservicio, count(*) over() as cantidad
        from mod_logtaller.conf_actividad cs 
        left join mod_logtaller.conf_servicioarea sa on(cs.idactividad = sa.idservicio AND sa.idestructuracomun = {$idEntidad})
        where cs.idpadre IS NOT NULL 
          AND sa.idservicio is null
        $sqlFiltrar
        group by cs.denominacion, cs.codigo, cs.idactividad
        offset $start
        limit $limit
        ";
        $datos = $conn->execute($sql)
            ->fetchAll(PDO::FETCH_ASSOC);
        $actividades = array('datos' => $datos, 'totalpaginado' => $datos ? $datos[0]['cantidad'] : 0);

        return $actividades;
    }

    private function auxiliarCargarServiciosExistentes($excluir)
    {
        $arr = array();
        foreach ($excluir as $actividad) {
            $arr[] = $actividad['idservicio'];
        }
        return ($arr) ? implode(',', $arr) : array();
    }

    /**
     * @description
     *
     * @param $parametros
     *
     * @return array
     */
    public function cargarServiciosArea($parametros)
    {
        $idEntidad = $this->global->Estructura->idestructura;
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        $sqlFiltrar = '';
        if ($parametros['filtrado'] == 1) {
            $sqlFiltrar = " AND (ca.denominacion ilike '%{$parametros['criterio']}%'
            OR ca.codigo ilike '%{$parametros['criterio']}%')
            ";
        }
        $result = [];
        if ($parametros['idarea']) {
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll("
            SELECT sa.idservicioarea, sa.idservicio, ca.denominacion, ca.codigo
                 , sa.idcentrodecosto, nom.concat ||' '||nom.descripcioncentrogrupo as denomcentrodecosto
                 , count(*) over() as cantidad
            FROM mod_logtaller.conf_servicioarea sa
            inner join mod_logtaller.conf_actividad ca on(sa.idservicio = ca.idactividad)
            left join mod_contabilidadcosto.nom_centrocosto nom on(nom.idcentrogrupo = sa.idcentrodecosto)
            where sa.idestructuracomun = {$idEntidad} and sa.idarea = {$parametros['idarea']}
            $sqlFiltrar
            order by ca.denominacion
            LIMIT $limit
            OFFSET $start
            ");

        }

        return array('datos' => count($result) > 0 ? $result : [],
            'cantidad' => count($result) > 0 ? $result[0]['cantidad'] : 0);

//        $query = new Doctrine_Query();
//        if ($parametros['idarea']) {
//            $query->select('sa.idservicioarea, sa.idservicio, ca.denominacion as denominacion')
//                ->from('ConfServicioArea sa')
//                ->innerJoin('sa.ConfActividad ca')
//                ->where(
//                'sa.idarea = ?', array($parametros['idarea'])
//            );
//
//            if (is_numeric($parametros['limit']) && is_numeric($parametros['start']))
//            {
//                $query->offset($parametros['start'])->limit($parametros['limit']);
//            }
//
//            $servicios = $query->fetchArray();
//
////            if (count($servicios) > 0) {
////                foreach ($servicios as $index => $serv) {
////                    if ($serv['idservicio']) {
////                        $act = $this->_serviciosPlanificacion->obtenerActividadyNorma(3, $serv['idservicio'], null, 0, 30, 0);
////                        $servicios[$index]['denominacion'] = ($act['datos']) ? $act['datos'][0]['denominacion'] : '-';
////                    }
////                }
////            }
//        }

        return array('datos' => count($servicios) > 0 ? $servicios : null,
            'cantidad' => count($servicios) > 0 ? $query->count() : 0);
    }

    /**
     * @descripcion Devuelve las areas relacionas al servicio pasado por parametro
     *              filtrando por el idestructuracomun por defecto.
     *
     * @param $parametros
     *
     * @return array
     */
    public function cargarAreasServicio($parametros)
    {
        $query = new Doctrine_Query();
        $query->select('sa.idarea')->from('ConfServicioArea sa')->where(
            'sa.idservicio = ?', array($parametros['idservicio'])
        )->andWhere("sa.idestructuracomun = ?", array($this->global->Estructura->idestructura));
        $areas = $query->fetchArray();
        $areasTall = array();
        foreach ($areas as $areaServ) {
            $area = $this->_serviciosEstructuraComposicion->getEstructura($areaServ['idarea']);
            $areasTall[] = $area[0];
        }
        return array('datos' => $areasTall, 'cantidad' => count($areasTall));
    }

    /**
     * @descripcion Devuelve las areas del o los talleres de la entidad en dependencia de la subordinacion
     *              o en caso de no usar subordinacion de la clasificacion -3 taller
     *
     * @param array $params
     *
     * @return array|stdClass
     */
    public function cargarAreasDelTaller($params = array())
    {

//        $params['start'] = ($params['start']) ? $params['start'] : 0;
//        $params['limit'] = ($params['limit']) ? $params['limit'] : 15;
        $params['start'] = null;
        $params['limit'] = null;
        if ($params['usarsubordinacion'] == 1) {
            $subd = $this->_serviciosEstructuraComposicion->obtenerSubordinaciones(
                "ATall", $params['limit'], $params['start']
            );
            $params['idnomsubordinacion'] = $subd[0]['idnomsubordinacion'];
            $depositos = $this->_serviciosEstructuraComposicion->buscarHijoPorSubordinacion(
                $this->global->Estructura->idestructura, array($params['idnomsubordinacion']), null
            );
        } else {
            $depositos = $this->_serviciosEstructuraComposicion->obtenerEstructurasNoFormales(
                $this->global->Perfil->iddominio, null, null, $params['limit'], $params['start'], null, -3
            );
        }
        return $depositos;
    }

    public function cargarSubordinacion($params = array())
    {
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 15;
        $sub =
            $this->_serviciosEstructuraComposicion->obtenerSubordinaciones(false, $params['limit'], $params['start']);
        return $sub;
    }

    public function cargarConfiguracionContrato()
    {
        $query = new Doctrine_Query();
        $contrato = $query->select('sa.contratoobligatorio')->from('ConfServicioArea sa')->where(
            'sa.idestructuracomun = ?', array($this->global->Estructura->idestructura)
        )->execute()->getFirst();
        if ($contrato->contratoobligatorio){
            $confContrato = $contrato->toArray();
        }
        return array('datos' => count($confContrato) > 0 ? $confContrato : null);
    }

    public function cargarConfiguracionTalleres()
    {
        $confTalleres = [];
        $query = new Doctrine_Query();
        $ct = $query->select('ct.*')->from('ConfTalleres ct')->where(
            'ct.idestructuracomun = ?', array($this->global->Estructura->idestructura)
        )->execute()->getFirst();
        if ($ct->centrocostosporactividad){
            $confTalleres = $ct->toArray();
        } else if ($ct->comprobante){
            $confTalleres = $ct->toArray();
       } else if ($ct->cierrecondiferencia){
            $confTalleres = $ct->toArray();
        }else if ($ct->ordenproducto){
            $confTalleres = $ct->toArray();
        }
        $contrato = $this->cargarConfiguracionContrato()['datos'];
        if ($contrato) {
            $confTalleres['contratoobligatorio'] = $contrato['contratoobligatorio'];
        } else {
            $confTalleres['contratoobligatorio'] = 0;
        }
        return array('datos' => $confTalleres);
    }

    public function cargarPersonas($idEntidad, $params = array())
    {
        $params['idspersonas'] = ($params['idspersonas']) ? $params['idspersonas'] : array();
        $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        if (!$idEntidad) {
            $idEntidad = $this->global->Estructura->idestructura;
        }
        $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
            $params['idspersonas'], $params['criterio'], $params['limit'], $params['start'], array(), array(),
            $idEntidad
        );
        return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);
    }

    public function cargarPersonasArea($parametros)
    {
        $idEntidad = $this->global->Estructura->idestructura;
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        $result = [];
        $sqlFiltrar = '';
        if ($parametros['filtrado'] == 1) {
            $sqlFiltrar = " AND 
            (per.nombre ilike '%{$parametros['criterio']}%'
            OR per.snombre ilike '%{$parametros['criterio']}%'
            OR per.papel ilike '%{$parametros['criterio']}%'
            OR per.sapel ilike '%{$parametros['criterio']}%'
            OR per.idsuin ilike '%{$parametros['criterio']}%'
            )
            ";
        }
        if ($parametros['idarea']) {
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll("
            SELECT per.nombre||' '||per.papel||' '||per.sapel as nombreapellidos
                 , pa.idpersonaarea, pa.idpersona, per.idsuin as numid
                 , count(*) over() as cantidad
            FROM mod_logtaller.conf_personaarea pa
            inner join mod_persona.dat_persona per on(per.idpersona = pa.idpersona)
            where pa.idestructuracomun = {$idEntidad} and pa.idarea = {$parametros['idarea']}
            $sqlFiltrar
            order by per.nombre
            LIMIT $limit
            OFFSET $start
            ");

        }

        return array('datos' => count($result) > 0 ? $result : [],
            'cantidad' => count($result) > 0 ? $result[0]['cantidad'] : 0);
    }

    public function cargarConfiguracion($idestructura)
    {
        $confTalleres = [];
        $query = new Doctrine_Query();
        $ct = $query->select('ct.*')->from('ConfTalleres ct')->where(
            'ct.idestructuracomun = ?', array($idestructura)
        )->execute()->getFirst();
        if ($ct) {
            $confTalleres = $ct->toArray();
            return array('datos' => $confTalleres);
        }
        return array('datos' => []);
    }


    public function getOrdenByConfig(&$query, $campo)
    {
        $result = $this->cargarConfiguracion($this->global->Estructura->idestructura);
        if (count($result['datos'])) {
            switch ($result['datos']['ordenproducto']) {
                case 1:
                    $query = $query->orderBy("ind.codigo",'ASC');
                    return $query;
                case 2:
                    $query = $query->orderBy("ind.denominacion",'ASC');
                    return $query;
                case 3:
                    $query = $query->orderBy("{$campo}",'ASC');
                    return $query;
                case 4:
                    $query = $query->orderBy("ind.numeropieza",'ASC');
                    return $query;
                case 5:
                    $query = $query->orderBy("ind.idnaturaleza",'ASC');
                    return $query;
                default:
                    $query = $query->orderBy("ind.numeropieza",'ASC');
                    return $query;
            }
        }
    }




}