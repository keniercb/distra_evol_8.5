<?php

class DatCierreNomina extends BaseCierreNomina
{
    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerCantidadCuentas ()
    {
        $sql = "select MAX(cuenta) as maximo from mod_nomina.dat_cierrenomina;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r[0]['maximo'];
    }
    public function obtenerNominasporIdPeriodo ($idperiodo)
    {
        $sql = "select * from mod_nomina.dat_cierrenomina	where idcierrenomina = $idperiodo ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idperiodo));
        return $r;
    }

    public function cargarCajas($identidad){
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query="SELECT( CASE
                            WHEN cf.idcajafondo > 0 THEN 1
                            ELSE 0
                             END) as asociado , nc.*
                            From mod_caja.nom_caja nc 
                            left Join mod_caja.dat_cajafondo cf on (nc.idcaja = cf.idcaja)
                            where nc.idestructuracomun = 200531040 
                            order By nc.codigo ASC";//print_r($query);die;
         $result = $conn->fetchAll($query); 
        return $result;
     
    }
    
     //Obtener el saldo contable de la cuenta a cualquier nivel
     public function saldoContableByIdCuenta($idCuenta, $idEstructuraE, $inicio, $fin)
     {
         $sqlSaldo = "SELECT sum(s.saldomo) as saldo FROM mod_contabilidad.nom_cuenta h 
                         LEFT JOIN mod_contabilidad.dat_confcuentaentidade c ON h.idcuenta = c.idcuenta and c.idestructurae = $idEstructuraE 
                         INNER JOIN mod_contabilidad.res_centroelem_saldo s ON (h.idcuenta = s.idcuenta and s.idestructurae = $idEstructuraE) 
                         WHERE (h.idestructurae = $idEstructuraE OR c.idestructurae = $idEstructuraE) AND s.fechaemision >= '$inicio' and s.fechaemision <= '$fin'::date 
                         AND h.parent_path OPERATOR(public.<@) (SELECT parent_path FROM mod_contabilidad.nom_cuenta where idcuenta = $idCuenta)";
 
         $dm = Doctrine_Manager::getInstance();
         $conn = $dm->getCurrentConnection();
 
         $resSaldo = $conn->fetchAll($sqlSaldo);
         return $resSaldo[0]['saldo'] ? $resSaldo[0]['saldo'] : 0;
     }

     public function cuentaById($idCuenta){
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll("SELECT concatcta, descripcion, mon.codigoiso from mod_contabilidad.nom_cuenta cta inner join mod_datosmaestros.nom_moneda mon using(idmoneda) where idcuenta = $idCuenta");
        return $result[0];
    }

    public function Periodo($identidad,$idperiodo) {
        $sql = "SELECT idperiodo from mod_nomina.dat_cierrenomina	where identidad = $identidad and idperiodo = $idperiodo";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        $flag=false;
        if (count($r)>0) {
            $flag=true;
        }

        return $flag;
        
    }

    public function obtenerplantillasnominal($identidad)
    {
    
        $arraycentroscostofinal = array();
        $objPlantillasNominales = new ConfPlantillaNominal();
        $plantillas = $objPlantillasNominales->obtenerListadoPlantillasNominalesActivas($identidad);
        foreach ($plantillas as $i => $value) {
            $arraycentroscostofinal[$i]['idplantillanominal'] = $value['idplantillanominal'];
            $arraycentroscostofinal[$i]['denomcentrocosto'] = $value['denominacion'];
        }
        return $arraycentroscostofinal;
    }

    public function obtenerPersonasPlantillasNominales($identidad)
    {
        // $idplantillas = json_decode(stripslashes($this->_getParam('idplantillas')));
        // $idestructura = $this->_request->getPost('idestructura');
        $confplantillanominal = new ConfPlantillaNominal();
        $confplantillanominalcargo = new ConfPlantillaNominalCargo();
        $arrayfinal = array();
        $cont = 0;
        foreach ($idplantillas as $i => $value) {
            $cargosplantilla = $confplantillanominalcargo->obtenerCargosByIdPlantilla($value);
            $denominacionplantilla = $confplantillanominal->obtenerDenomXIdSinCodigo($value);
            foreach ($cargosplantilla as $ic => $rc) {
                //Personas con cargo en altas y bajas y no tiene cargo en gestionarcargosocupados en nomina
                $sqldatospersona = "select dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
                                    inner join mod_persona.dat_personaentidad dpe on(dpe.idpersona = dp.idpersona)
                                    inner join mod_persona.dat_situacionlaboral dsp on(dsp.idpersonaentidad = dpe.idpersonaentidad)
                                    left join  mod_nomina.dat_cargosocupados dco on(dpe.idpersona = dco.idpersona)
			                        where dpe.identidad = ? and dsp.idcargo = ? and dco.idcargosocupados is null and ((dsp.fhasta >= now()) or (dsp.fhasta is null)) and dsp.idcargo is not null;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $datospersona = $conn->fetchAll($sqldatospersona, array($identidad, $rc['idcargo']));

                if (count($datospersona) > 0) {

                    foreach ($datospersona as $idp => $rdp) {
                        $datos = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($rdp['idpersona']);
                        //  print_r($datos);die;
                        $arrayfinal[$cont]['idpersona'] = $rdp['idpersona'];
                        $arrayfinal[$cont]['nombreyapellidos'] = $rdp['nombre'] . ' ' . $rdp['snombre'] . ' ' . $rdp['papel'] . ' ' . $rdp['sapel'];
                        $arrayfinal[$cont]['denominacionplantilla'] = $denominacionplantilla;
                        $arrayfinal[$cont]['numerocontablepersona'] = $datos[0]['cdgocontable'];
                        $cont++;
                    }


                }
            }

        }
       return $arrayfinal;
    }

    public function BuscadorNomina($inicio = 0, $limite = 20, $texto, $idestructura, $iddominio, $permiso, $campocolores, $arraycategorias = null, $arrayidplantillas = null, $categoriapersonabuscar = 5, $arrcargos, $tipobusqueda)
    {    $where = '';
        $where1 = '';

        if($tipobusqueda == 2)
        {
            if ($texto->numid != "") {
                $where .= "dpdi.numero ilike '%" . $texto->numid . "%' and ";
            }
            if ($texto->nombre != "") {
                $where .= "lower(dp.nombre) ilike '%" . strtolower($texto->nombre) . "%' and ";
            }
            if ($texto->snombre != "") {
                $where .= "lower(dp.snombre) ilike '%" . strtolower($texto->snombre) . "%' and ";
            }
            if ($texto->primerapellido != "") {
                $where .= "lower(dp.papel) ilike '%" . strtolower($texto->primerapellido) . "%' and ";
            }
            if ($texto->segundoapellido != "") {
                $where .= "lower(dp.sapel) ilike '%" . strtolower($texto->segundoapellido) . "%' and ";
            }
            if ($texto->idpersona != "") {
                $where .= "dp.idpersona = '" . $texto->idpersona . "' and ";
            }
            if ($texto->idcategoriapersona != "") {
                $where .= "npc.idcategoriapersona = '" . $texto->idcategoriapersona . "' and ";
            }
            if ($texto->numerocuenta != "") {
                $where .= "dcb.numerocuenta ilike '%" . $texto->numerocuenta . "%' and ";
            }
            if ($texto->grado != "") {
                $where .= "lower(ng.denominacion) ilike '%" . strtolower($texto->grado) . "%' and ";
            } 
            $where .= " dp.feliminado is null";
        }
        else
        {
            if ($texto != '') {
                $arreglo = split(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = ' or ';
                        //$where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or pcodc.cdgocontable = '$arreglo[$i]' ";
                        $where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                        //$where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' or pcodc.cdgocontable = '$arreglo[$i]' ";
                        $where1 .= $or . "dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' or dpdi.numero ilike '%$arreglo[$i]%'";
                    }
                }
            }
        }
        
        /*if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where1 != '')
            $where1 = '( ' . $where1 . ' )';*/
        $where .= ($where != '') ? ' and (dp.feliminado is null) and (((dps.fhasta is null or dps.fhasta >= now())) or (dco.idcargosocupados is not null and dco.identidad = ?))' : '(dp.feliminado is null) and (((doc.fhasta is null or doc.fhasta >= now()) and (dps.fhasta is null or dps.fhasta >= now()) or (dco.idcargosocupados is not null and dco.identidad = ?)))';
        $where1 .= ($where1 != '') ? ' and (dp1.feliminado is null)' : ' dp1.feliminado is null';
        if (count($arrayidplantillas) > 0) {
            $where .= ($where != '') ? ' and cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')' : 'cpn.idplantillanominal in(' . implode(',', $arrayidplantillas) . ')';

        }
        if($arrcargos){
            //Para que la persona salga en la consulta aunque el idcargo de datcargosocupados no este en el $arrcargos que viene de estructura 
        $implodecargocpcc = '(dco.idcargo in(' . implode(',', $arrcargos) . ') or (dco.idcargo not in(' . implode(',', $arrcargos) . ')))';
		//Para que la persona salga en la consulta aunque el no exista el idcargo en datcargosocupados y si este en datsituacion  
        $implodecargocpss = 'dps.idcargo in(' . implode(',', $arrcargos) . ')';
        $where .= ($where != '') ? ' and (('.$implodecargocpcc.') or ('.$implodecargocpss.'))': '(('.$implodecargocpcc.') or ('.$implodecargocpss.'))';
        }
        
		
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = '';
        //Caso MINFAR, y las entidades del pais que compartimentan a nivel de entidades
        if ($arraycategorias->cliente == 'MINFAR') {
            if (count($arraycategorias->arraycategorias) > 0) {
                $sql = "SELECT DISTINCT(dp.idpersona), dps.idpersonaentidad, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,
                 (CASE WHEN dp.snombre is not null THEN dp.snombre
                ELSE '' END) as snombre,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                (select d.idinterrupto from mod_fuerzatrabajo.dat_interrupto as d where (d.fhasta is null or d.fhasta >= now()) and dps.idsituacionlaboralp = d.idsituacionlaboralp) as idinterrupto,
            (select dis.iddisponible from mod_fuerzatrabajo.dat_disponible as dis where (dis.fhasta is null or dis.fhasta >= now()) and dps.idsituacionlaboralp = dis.idsituacionlaboralp) as iddisponible,
            npc.denominacion as categoriapersona
            ,(select dco.idcargosocupados where dco.identidad = " . $idestructura . ") as idcargosocupados
            FROM mod_persona.dat_persona dp
        INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $idestructura . ")
        INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        LEFT JOIN mod_personaext.dat_gradomilitar dg on (dg.idpersona = dp.idpersona and dg.fhasta is null)
        LEFT JOIN mod_estructuracomp.nom_grado ng on (ng.idgrado = dg.idgradomilitar)
        INNER JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
        INNER JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
        LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
        LEFT JOIN mod_personaext.dat_cuentabancaria dcb ON (dcb.idpersona = dp.idpersona)
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
        WHERE " . ($where != '' ? "" . $where : $where) . "";
                $sql .= " order by plantilla limit {$limite} offset {$inicio} ;";
            } else {
                return array();
            }
        } else {
            /*$sql = "SELECT DISTINCT(dp.idpersona), dps.idpersonaentidad, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria,
                 (CASE WHEN dp.snombre is not null THEN dp.snombre
                ELSE '' END) as snombre,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                (select d.idinterrupto from mod_fuerzatrabajo.dat_interrupto as d where (d.fhasta is null or d.fhasta >= now()) and dps.idsituacionlaboralp = d.idsituacionlaboralp) as idinterrupto,
            (select dis.iddisponible from mod_fuerzatrabajo.dat_disponible as dis where (dis.fhasta is null or dis.fhasta >= now()) and dps.idsituacionlaboralp = dis.idsituacionlaboralp) as iddisponible,
            npc.denominacion as categoriapersona
            ,(select dco.idcargosocupados where dco.identidad = " . $idestructura . ") as idcargosocupados, pcodc.cdgocontable
            FROM mod_persona.dat_persona dp
        INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona  AND doc.identidad = " . $idestructura . ")
        INNER JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
        LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
        LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
                left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
        WHERE " . $where;
            $sql .= " order by dp.nombre ASC limit {$limite} offset {$inicio} ;";*/

            $sql = "SELECT DISTINCT(dp.idpersona), dps.idpersonaentidad, dpdi.numero as numid, dp.nombre, dp.papel, dp.sapel, dp.sexo, dpcat.idcategoria, nfe.ordenunico,
                 (CASE WHEN dp.snombre is not null THEN dp.snombre
                ELSE '' END) as snombre,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
                ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                (select d.idinterrupto from mod_fuerzatrabajo.dat_interrupto as d where (d.fhasta is null or d.fhasta >= now()) and dps.idsituacionlaboralp = d.idsituacionlaboralp) as idinterrupto,
            (select dis.iddisponible from mod_fuerzatrabajo.dat_disponible as dis where (dis.fhasta is null or dis.fhasta >= now()) and dps.idsituacionlaboralp = dis.idsituacionlaboralp) as iddisponible,
            npc.denominacion as categoriapersona
            ,(select dco.idcargosocupados where dco.identidad = " . $idestructura . ") as idcargosocupados, 
            (CASE WHEN pcodc.cdgocontable is not null THEN pcodc.cdgocontable ELSE '' END) as cdgocontable, nc.denominacion as denomcargo 
            FROM mod_persona.dat_persona dp			
        LEFT JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona)
        LEFT JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
        LEFT JOIN mod_personaext.dat_categoria dpcat ON (dpcat.idpersona = dp.idpersona)
        LEFT JOIN mod_personaext.nom_categoriapersona npc ON (npc.idcategoriapersona = dpcat.idcategoriapersona)
        LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = " . $idestructura . ")
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
        LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON (nfe.idfila = dco.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = " . $idestructura . ")
        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
        LEFT JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
        LEFT JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
        WHERE " . $where;
            $sql .= " order by nfe.ordenunico ASC limit {$limite} offset {$inicio} ;";
        }

        $resultado = $conn->fetchAll($sql, array($idestructura));
        return $resultado;
    }
   
    public function sincronizarPeriodosPagoMesPago($identidad){
        $dep = $this->obtenerPeriodosPagos($identidad);
        //Recorriendo los periodos de pago para actualizarle la fecha inicio y fin a los periodos que tengan mes de pago y no tengan fechas
        foreach ($dep as $rep){
            if($rep['mesanyopago']){
                $rexpmap = explode('-', $rep['mesanyopago']);
                $annopago = $rexpmap[0];
                $mespago = $rexpmap[1];
                $ultimodia = date("d",(mktime(0,0,0,$mespago+1,1,$annopago)-1));
                $pd = 1;
                $fechainiciop = $annopago.'-'.$mespago.'-'.$pd;
                $fechafin = $annopago.'-'.$mespago.'-'.$ultimodia;
                //Actualizando las fechas
                if(!$rep['fechainicioperiodo'] || !$rep['fechafinperiodo']){
                    $idelaborarpagos = $rep['idelaborarpagos'];
                    $sqldatosElabP = "UPDATE mod_nomina.dat_elaborarpagos SET fechainicioperiodo = '{$fechainiciop}'::date,
                                                                          fechafinperiodo = '{$fechafin}'::date
                                  where idelaborarpagos = {$idelaborarpagos};";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $conn->execute($sqldatosElabP);
                }
            }
        }
        return 'ok';
    }
   
}
