<?php

class DatElaborarPagos extends BaseDatElaborarPagos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomTipoPago', array(
            'local' => 'idtipopago',
            'foreign' => 'idtipopago',
            'refClass' => 'DatElaborarPagos'
        ));

        $this->hasMany('NomPeriodoPago', array(
            'local' => 'idperiodopago',
            'foreign' => 'idperiodopago',
            'refClass' => 'DatElaborarPagos'
        ));


        $this->hasMany('ConfigModeloNomina', array(
            'local' => 'idtipopago',
            'foreign' => 'idtipopago',
            'refClass' => 'DatElaborarPagos'
        ));
        $this->hasMany('DatNomina', array(
            'local' => 'idelaborarpagos',
            'foreign' => 'idelaborarpago',
            'refClass' => 'DatElaborarPagos'
        ));


    }

    public static function obtenerElaborarPagos($idelaborarpagos)
    {
        return Doctrine::getTable('DatElaborarPagos')->find($idelaborarpagos);
    }

    public static function obteneridtipopagoElaborarPagos($idelaborarpago){
        $sql = "SELECT idtipopago FROM mod_nomina.dat_elaborarpagos WHERE idelaborarpagos = $idelaborarpago;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchOne($sql);
        return $r;
    }

    public static function obtenerPeriodosPagos($identidad, $idtipopago, $modopago, $cargarsinaprobar, $formato = 1)
    {
        if ($cargarsinaprobar == 2) {
            $sql = "select * from mod_nomina.dat_elaborarpagos	where identidad = ? and idtipopago = ? order by fechainicioperiodo DESC ;";
        } else {
            $sql = "select * from mod_nomina.dat_elaborarpagos	where identidad = ? and idtipopago = ? order by fechainicioperiodo DESC ;";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($identidad, $idtipopago));
        $objNomTipoPago = new NomTipoPago();
        if ($formato == 1) {
            if (count($r) > 0) {
                foreach ($r as $i => &$v) {
                    $mesanyo = explode('-', $v['mesanyopago']);
                    if ($modopago == 1) {
                        $fexplode = explode('/', $v['fechainicioperiodo']);
                        //$v['anyo'] = date('Y', strtotime($v['fechainicioperiodo']));print_r(date('Y', strtotime('"2016-08-16"')));die;
                        $v['anyo'] = $fexplode[2];
                    } else if ($modopago == 2) {
                        $v['anyo'] = (count($mesanyo) > 0 ? $mesanyo[0] : '');
                    }
                    $v['periodopago'] = $v['fechainicioperiodo'] . ' al ' . $v['fechafinperiodo'];
                    $v['mes'] = (count($mesanyo) > 0 ? $mesanyo[1] : '');
                    $v['denomtipopago'] = $objNomTipoPago->obtenerDenominacion($v['idtipopago']);
                }
            }
        }
        return $r;
    }

    public static function obtenerPeriodosPagosEntidades($arrayidentidad, $idtipopago, $modopago, $cargarsinaprobar, $formato = 1)
    {
        $sql = "select dep.*, de.denominacion as denomentidad from mod_nomina.dat_elaborarpagos dep
                  left join mod_estructuracomp.dat_estructura de on (de.idestructura = dep.identidad)
                  where dep.identidad IN (" . implode(',', $arrayidentidad) . ") and dep.idtipopago = ? order by dep.fechapago ASC ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idtipopago));
        $objNomTipoPago = new NomTipoPago();
        if ($formato == 1) {
            if (count($r) > 0) {
                foreach ($r as $i => &$v) {
                    $mesanyo = explode('-', $v['mesanyopago']);
                    if ($modopago == 1) {
                        $fexplode = explode('/', $v['fechainicioperiodo']);
                        //$v['anyo'] = date('Y', strtotime($v['fechainicioperiodo']));print_r(date('Y', strtotime('"2016-08-16"')));die;
                        $v['anyo'] = $fexplode[2] . '-' . $v['denomentidad'];
                    } else if ($modopago == 2) {
                        $v['anyo'] = (count($mesanyo) > 0 ? $mesanyo[0] : '') . '-' . $v['denomentidad'];
                    }
                    $v['periodopago'] = $v['fechainicioperiodo'] . ' al ' . $v['fechafinperiodo'];
                    $v['mes'] = (count($mesanyo) > 0 ? $mesanyo[1] : '');
                    $v['denomtipopago'] = $objNomTipoPago->obtenerDenominacion($v['idtipopago']);
                }
            }
        }
        return $r;
    }

    public static function convierteEnArregloString($array)
    {
        $arrayString = '(';
        foreach ($array as $valor) {
            $arrayString .= $valor . ',';
        }
        $arrayString = str_split($arrayString, strlen($arrayString) - 1)[0] . ')';
        return $arrayString;
    }

    public static function obtenerPeriodosPagosPorEntidades($identidades, $idtipopagos, $modopago, $cargarsinaprobar, $formato = 1, $objmetadatos)
    {
        $idsentidades = array();
        foreach ($identidades as $identidad) {
            $datosentidades = $objmetadatos->BuscarEntidadbyDominio($identidad);
            if ($datosentidades) {
                foreach ($datosentidades as $datoentidad) {
                    array_push($idsentidades, $datoentidad->idfila);
                }
            }
        }

        $identidadesString = DatElaborarPagos::convierteEnArregloString($identidades);
        $identidadesHijaString = DatElaborarPagos::convierteEnArregloString($idsentidades);
        $idtipopagosString = DatElaborarPagos::convierteEnArregloString($idtipopagos);

        if ($cargarsinaprobar == 2) {
           // $sql = "select * from mod_nomina.dat_elaborarpagos	where (identidad in $identidadesString or identidad in $identidadesHijaString) and idtipopago in $idtipopagosString order by fechapago ASC ;";
            $sql = "select * from mod_nomina.dat_elaborarpagos	where (identidad in $identidadesString) and idtipopago in $idtipopagosString order by fechapago ASC ;";
        } else {
            //$sql = "select * from mod_nomina.dat_elaborarpagos	where (identidad in $identidadesString or identidad in $identidadesHijaString) order by fechapago ASC ;";
            $sql = "select * from mod_nomina.dat_elaborarpagos	where (identidad in $identidadesString) order by fechapago ASC ;";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);

        $objNomTipoPago = new NomTipoPago();
        if ($formato == 1) {
            if (count($r) > 0) {
                foreach ($r as $i => &$v) {
                    $mesanyo = explode('-', $v['mesanyopago']);
                    if ($modopago == 1) {
                        $fexplode = explode('/', $v['fechainicioperiodo']);
                        //$v['anyo'] = date('Y', strtotime($v['fechainicioperiodo']));print_r(date('Y', strtotime('"2016-08-16"')));die;
                        $v['anyo'] = $fexplode[2];
                    } else if ($modopago == 2) {
                        $v['anyo'] = (count($mesanyo) > 0 ? $mesanyo[0] : '');
                    }
                    $v['periodopago'] = $v['fechainicioperiodo'] . ' al ' . $v['fechafinperiodo'];
                    $v['mes'] = (count($mesanyo) > 0 ? $mesanyo[1] : '');
                    $v['denomtipopago'] = $objNomTipoPago->obtenerDenominacion($v['idtipopago']);
                    //print_r($v['denomtipopago']);die;
                }
            }
        }
        return $r;
    }

    public static function obtenerCantidadPeriodosPagos($identidad, $idtipopago)
    {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
            ->from('DatElaborarPagos')
            ->where('identidad = ? and idtipopago = ? ', array($identidad, $idtipopago))
            ->fetchOne()
            ->cantidad;
    }

    public static function obtenePeriodoPagoAbiertoByTipoPago($identidad, $idtipopago)
    {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
            ->from('DatElaborarPagos')
            ->where('identidad = ? and idtipopago = ? and estado=1 ', array($identidad, $idtipopago))
            ->fetchOne()
            ->cantidad;
    }

    public static function obtenePeriodoPagoEntidad($identidad)
    {
        return Doctrine_Query::create()->select('idelaborarpagos')
            ->from('DatElaborarPagos')
            ->where('identidad = ?', array($identidad))
            ->fetchArray();
    }

    public static function estaAperturadoModeloNomina($identidad, $idtipopago)
    {
        $sql = "select COUNT(*) AS cantidad
                    from  mod_nomina.conf_modelonomina mn
                    inner join mod_nomina.nom_tiponomina tn on(mn.idtiponomina = tn.idtiponomina)
                    where(mn.idtipopago = ? and tn.operacioncontable is not null);";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idtipopago));
//      print_r($r[0]['cantidad']);die;
        return $r[0]['cantidad'] > 0;
    }

    public static function listarpornominapartidasgasto($idelaborarpagos, $identidad, $tipo)
    {


        $sql = "select ep.idelaborarpagos,ep.idtipopago,mn.idtiponomina, tn.denominacion as nomenclador,n.idnomina,n.cajacajero,nd.idnominadatos,nd.valores
                    from  mod_nomina.dat_elaborarpagos ep
                    inner join mod_nomina.conf_modelonomina mn on(mn.idtipopago = ep.idtipopago)
                    inner join mod_nomina.nom_tiponomina tn on(mn.idtiponomina = tn.idtiponomina)
                    inner join mod_nomina.dat_nomina n on(ep.idelaborarpagos = n.idelaborarpago)
                    inner join mod_nomina.dat_nominadatos nd on (nd.idnomina = n.idnomina)
                    where(n.cajacajero =? and ep.identidad = ? and ep.idelaborarpagos = ?);";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($tipo, $identidad, $idelaborarpagos,));
        return $r;
    }

    public static function obtenerFechaInicioPeriodo($idelaborarpagos, $identidad)
    {
        return Doctrine_Query::create()->select('p.fechainicioperiodo AS fechainicioperiodo')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ? and p.identidad = ?', array($idelaborarpagos, $identidad))
            ->fetchOne()
            ->fechainicioperiodo;
    }

    public static function obtenerEntidadPeriodo($idelaborarpagos)
    {
        return Doctrine_Query::create()->select('p.identidad')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->identidad;
    }

    public static function obtenerFechaInicioPeriodoPago($idelaborarpagos)
    {
        return Doctrine_Query::create()->select('p.fechainicioperiodo')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->fechainicioperiodo;
    }

    public static function obtenerPeriodosXIdEntidadIdTPIdPP($identidad, $idtipopago, $idperiodopago)
    {
        return Doctrine_Query::create()
            ->select('p.*')
            ->from('DatElaborarPagos p')
            ->where('p.identidad = ? and p.idtipopago = ? and p.idperiodopago = ?', array($identidad, $idtipopago, $idperiodopago))
            ->fetchArray();
    }

    public static function obtenerFechaFinPeriodo($idelaborarpagos, $identidad)
    {
        return Doctrine_Query::create()->select('p.fechafinperiodo AS fechafinperiodo')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ? and p.identidad = ?', array($idelaborarpagos, $identidad))
            ->fetchOne()
            ->fechafinperiodo;
    }

    public static function obtenerFechaFinPeriodoPago($idelaborarpagos)
    {
        return Doctrine_Query::create()->select('p.fechafinperiodo')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->fechafinperiodo;
    }

    public static function obtenerPeriodosPagoEntidad($idelaborarpagos)
    {
        return Doctrine_Query::create()->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchArray();

    }

    public function dameIdComprobantesOperacionesCanc($idelaborarpagos)
    {
        return Doctrine_Query::create()->select('p.idcomprobanteoperaciones,p.idcomprobantecancelacion')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchArray();
    }

    public function obtenerPersonasReportes($identidad, $idtipopago, $fechainicio, $fechafin, $idelaborarpagos = null)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        if (!empty($idelaborarpagos)) {
            $sqldel = "delete from mod_nomina.dat_personaselaborarpagos where idelaborarpagos = {$idelaborarpagos};";
            $conn->execute($sqldel);
        }

        $sql = "select distinct(erp.idelemento) as idpersona, erp.*,ntp.idconfreportescertificaciones, drc.fechainicio,drc.fechafin,
        (CASE WHEN dp.snombre is null or dp.snombre = '' THEN dp.nombre || ' ' || dp.papel || ' ' ||dp.sapel
        ELSE dp.nombre ||' '|| dp.snombre || ' ' || dp.papel || ' ' ||dp.sapel END) as  denominacion
		from mod_nomina.dat_elementosreportescertificaciones erp
		left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento and dp.feliminado is null)
		inner join mod_nomina.dat_reportescertificaciones drc on (drc.idreportescertificaciones = erp.idreportescertificaciones)
		inner join mod_nomina.nom_tipopago ntp on (ntp.idconfreportescertificaciones = drc.idconfreportescertificaciones)
		inner join mod_nomina.dat_elaborarpagos dep on (dep.idtipopago = ntp.idtipopago)
		where drc.identidad = ? and ntp.idtipopago = ? and ('{$fechainicio}'::date = drc.fechainicio and '{$fechafin}'::date = drc.fechafin);";
        $datos = $conn->fetchAll($sql, array($identidad, $idtipopago));

        $r = array();
        foreach ($datos as $persona) {
            $sql = "select COUNT(*) as cantidaddco from mod_nomina.dat_cargosocupados where identidad = ? and idpersona = ?;";
            $cantidadcoo = $conn->fetchOne($sql, array($identidad, $persona["idpersona"]));
            if ($cantidadcoo > 0) {
                $r[] = $persona;
            }
        }
        $conn->commit();
        return $r;
    }

    public function obtenerTipoPagoPeriodo($idelaborarpagos)
    {
        return Doctrine_Query::create()
            ->select('idtipopago')
            ->from('DatElaborarPagos')
            ->where('idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->idtipopago;
    }

    public function obtenerDatosPagoparaCierrePorMoneda($arrIdelaborarpagos, $codigoMoneda)
    {
        if (count($arrIdelaborarpagos) > 0) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            $sql = "SELECT ep.idelaborarpagos, ntp.denominacion as tipopago, mtn.idtiponomina,  mtn.reintegro
        FROM mod_nomina.dat_elaborarpagos ep
        INNER JOIN mod_nomina.nom_tipopago ntp ON (ntp.idtipopago = ep.idtipopago)
        INNER JOIN mod_nomina.conf_modelonomina mn ON (mn.idtipopago = ep.idtipopago)
        INNER JOIN mod_nomina.nom_tiponomina mtn ON (mtn.idtiponomina = mn.idtiponomina)
        WHERE ep.idelaborarpagos IN (" . implode(',', $arrIdelaborarpagos) . ") AND mtn.tipomoneda = ?";
            $datos = $conn->fetchAll($sql, array($codigoMoneda));
            return $datos;
        }

    }

    public function obtenerPeriodosPagoEntidadSubmayorV($identidad, $cadenaperiodospago = null)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $concat = ($cadenaperiodospago) ? "and case when ( ($cadenaperiodospago) is not null) then (
                            (to_char(dep.fechainicioperiodo, 'MM-YYYY')) in ($cadenaperiodospago) )else true end" : ' ';
        $sql = "select dep.idelaborarpagos, dep.fechapago, dep.fechainicioperiodo,
                dep.fechafinperiodo, dep.idtipopago,
                cmn.idtiponomina, ntn.acumulavacaciones, ntp.orden as ordentipopago
                from mod_nomina.dat_elaborarpagos dep
                inner join mod_nomina.nom_tipopago ntp on(ntp.idtipopago = dep.idtipopago)
                inner join mod_nomina.conf_modelonomina cmn on(cmn.idtipopago = dep.idtipopago)
                inner join mod_nomina.nom_tiponomina ntn on(ntn.idtiponomina = cmn.idtiponomina)
                where dep.identidad = ? and (ntn.acumulavacaciones = 1 or ntn.acumulavacaciones = 2)"
                . $concat .
                " ORDER BY dep.fechainicioperiodo, ntp.orden ASC";
        $r = $conn->fetchAll($sql, array($identidad));
        return $r;
    }

    public function obtenerSalarioNetoTotalPorNomina($identidad, $idtipopago, $idconceptoentidad, $fechainicioperiodo, $fechafinperiodo, $objmetadatos)
    {
        $sumaNetoTotal = array();
        /*if ($idconceptoentidad != 3) {
            $entidades = $objmetadatos->BuscarEntidadbyDominio($identidad);
            foreach ($entidades as $datosentidad) {
                $identidad = $datosentidad->idfila;
                $sumaTotalEntidad = $this->obtenerSalarioNetoTotalPorNominayEntidad($identidad, $idtipopago, $fechainicioperiodo, $fechafinperiodo);
                $sumaNetoTotal['st'] += $sumaTotalEntidad['st'];
                $sumaNetoTotal['stmujeres'] += $sumaTotalEntidad['stmujeres'];
                $sumaNetoTotal['sthombres'] += $sumaTotalEntidad['sthombres'];
            }
            return $sumaNetoTotal;
        } else {*/
            return $this->obtenerSalarioNetoTotalPorNominayEntidad($identidad, $idtipopago, $fechainicioperiodo, $fechafinperiodo);
      //  }
    }

    public function obtenerSalarioNetoTotalPorNominayEntidad($identidad, $idtipopago, $fechainicioperiodo, $fechafinperiodo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT
           dnd.valores,ep.idelaborarpagos
         FROM
           mod_nomina.dat_elaborarpagos ep
           INNER JOIN   mod_nomina.dat_nomina dn ON(ep.idelaborarpagos = dn.idelaborarpago)
           INNER JOIN mod_nomina.dat_nominadatos dnd ON(dn.idnomina = dnd.idnomina)
           INNER JOIN mod_nomina.nom_tipopago ntp ON(ntp.idtipopago = ep.idtipopago)
         WHERE
            ep.fechainicioperiodo = ? AND
            ep.fechafinperiodo = ?  AND
            ep.identidad = ? AND
            ep.idtipopago = ?;";
        $valoresNomina = $conn->fetchAll($sql, array($fechainicioperiodo, $fechafinperiodo, $identidad, $idtipopago));
        $sumaNetoTotal = 0;
        $sumaNetoMujeres = 0;
        $sumaNetoHombres = 0;
        if ($valoresNomina) {
            $idelaborarpagos = $valoresNomina[0]['idelaborarpagos'];
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "select distinct estr.idestructuramodelodomina, estr.denominacion, estr.orden from mod_nomina.conf_estructuramodelosnomina estr
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									inner join mod_nomina.dat_nomina nom on (nom.idelaborarpago = elp.idelaborarpagos)
									where elp.idelaborarpagos = ? and estr.esconceptopagosalario = 1 and estr.idtipocampo<>1;";
            $datosEstructurarModeloNomina = $conn->fetchAll($sql, array($idelaborarpagos));

            //Capturando el sexo de cada persona
            $arrayids = array();
            foreach ($valoresNomina as $val) {
                $arrValores = unserialize($val['valores']);
                foreach ($arrValores as $contvalores => $valores) {
                    $arrayids[] = $valores['idpersona'];
                }
            }
            $arrayids = implode(',', array_values(array_unique($arrayids)));
            $sql = "select distinct(idpersona), sexo from mod_persona.dat_persona where idpersona in (" . $arrayids . ");";
            $rpersonassexo = $conn->fetchAll($sql);
            $arrayids = array();
            foreach ($rpersonassexo as $pers) {
                $arrayids[$pers['idpersona']] = $pers['sexo'];
            }

            foreach ($valoresNomina as $cont => $val) {
                $arrValores = unserialize($val['valores']);
                foreach ($arrValores as $contvalores => $valores) {
                    $claveDelNetoAPagar = 'c' . $datosEstructurarModeloNomina[0]['idestructuramodelodomina'];
                    $sumaNetoTotal += $valores[$claveDelNetoAPagar];
                    $sumaNetoMujeres += ($arrayids[$valores['idpersona']] == 0) ? $valores[$claveDelNetoAPagar] : 0;
                    $sumaNetoHombres += ($arrayids[$valores['idpersona']] == 1) ? $valores[$claveDelNetoAPagar] : 0;
                }
            }
            if ($sumaNetoTotal == 0) {
                foreach ($valoresNomina as $cont => $val) {
                    $arrValores = unserialize($val['valores']);
                    foreach ($arrValores as $contvalores => $valores) {
                        $claveDelNetoAPagar = 'c' . $datosEstructurarModeloNomina[1]['idestructuramodelodomina'];
                        $sumaNetoTotal += $valores[$claveDelNetoAPagar];
                        $sumaNetoMujeres += ($arrayids[$valores['idpersona']] == 0) ? $valores[$claveDelNetoAPagar] : 0;
                        $sumaNetoHombres += ($arrayids[$valores['idpersona']] == 1) ? $valores[$claveDelNetoAPagar] : 0;
                    }
                }
            }
        }
        $sumaNetoTotal = number_format($sumaNetoTotal, 2, '.', '');
        $sumaNetoMujeres = number_format($sumaNetoMujeres, 2, '.', '');
        $sumaNetoHombres = number_format($sumaNetoHombres, 2, '.', '');
        return array('st' => $sumaNetoTotal, 'stmujeres' => $sumaNetoMujeres, 'sthombres' => $sumaNetoHombres);
    }

    public static function obtenerNominasPeriodosPagoAbiertos($identidad)
    {


        $sql = "select ep.*,mn.idtiponomina, tn.denominacion,nd.idnominadatos,nd.valores
                    from  mod_nomina.dat_elaborarpagos ep
                    inner join mod_nomina.conf_modelonomina mn on(mn.idtipopago = ep.idtipopago)
                    inner join mod_nomina.nom_tiponomina tn on(mn.idtiponomina = tn.idtiponomina)
                    inner join mod_nomina.dat_nomina n on(ep.idelaborarpagos = n.idelaborarpago)
                    inner join mod_nomina.dat_nominadatos nd on (nd.idnomina = n.idnomina)
                    where ep.identidad = ? and ep.estado = 1;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($identidad));
        return $r;
    }

    public static function obtenerComprobanteOperacionesPeriodoPago($idelaborarpagos)
    {
        return Doctrine_Query::create()->select('p.idcomprobanteoperaciones')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->idcomprobanteoperaciones;
    }

    public static function obtenerNumeroComprobanteOperacionesPeriodoPago($idelaborarpagos)
    {
        return Doctrine_Query::create()->select('p.numerocomprobanteoperaciones')
            ->from('DatElaborarPagos p')
            ->where('p.idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->numerocomprobanteoperaciones;
    }

}
