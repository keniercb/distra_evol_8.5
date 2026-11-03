<?php

class DatElementosReportesCertificaciones extends BaseDatElementosReportesCertificaciones
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatReportesCertificaciones', array(
            'local' => 'idreportescertificaciones',
            'foreign' => 'idreportescertificaciones'
        ));
        $this->hasMany('DatVariablesElementosReportesCertificaciones', array(
            'local' => 'idelementosreportescertificaciones',
            'foreign' => 'idelementosreportescertificaciones'
        ));
    }

    public static function obtenerObjDatElementosReportesCertificacionesDadoId($idelementosreportescertificaciones)
    {
        return Doctrine::getTable('DatElementosReportesCertificaciones')->find($idelementosreportescertificaciones);
    }

    public static function obtenerIdElementosReportesCertificacionesXIdReporte($idreportescertificaciones)
    {
        return Doctrine_Query::create()->select('p.idelementosreportescertificaciones AS idelementosreportescertificaciones')
            ->from('DatElementosReportesCertificaciones p')
            ->where('p.idreportescertificaciones = ?', array($idreportescertificaciones))
            ->fetchArray();

    }

    public static function obtenerTodosElementosReportesCertificacionesXIdElm($idelementosreportescertificaciones)
    {
        return Doctrine_Query::create()->select('idelemento')
            ->from('DatElementosReportesCertificaciones p')
            ->where('p.idelementosreportescertificaciones = ?', array($idelementosreportescertificaciones))
            ->fetchArray();

    }

    public static function obtenerIdElementosReportesCertificacionesXIdReporteIdPersona($idreportescertificaciones, $idpersona)
    {
        return Doctrine_Query::create()->select('p.idelementosreportescertificaciones AS idelementosreportescertificaciones')
            ->from('DatElementosReportesCertificaciones p')
            ->where('p.idreportescertificaciones = ? and p.idelemento = ?', array($idreportescertificaciones, $idpersona))
            ->fetchArray();

    }

    public static function obtenerIdElementosXIdReporte($idreportescertificaciones)
    {
        return Doctrine_Query::create()->select('p.idelementosreportescertificaciones AS idelementosreportescertificaciones')
            ->from('DatElementosReportesCertificaciones p')
            ->where('p.idreportescertificaciones = ?', array($idreportescertificaciones))
            ->fetchArray()/*->fetchOne()
            ->idelementosreportescertificaciones*/
            ;

    }

    public static function obtenerArrIdElementosXIdReporte($idreportescertificaciones)
    {
        return Doctrine_Query::create()->select('p.idelementosreportescertificaciones ,p.idelemento')
            ->from('DatElementosReportesCertificaciones p')
            ->where('p.idreportescertificaciones = ?', array($idreportescertificaciones))
            ->fetchArray();
    }

    public function obtenerElementosReportesCertificacionesXid($idreportescertificaciones, $identidad){
        $sql = "SELECT estado FROM mod_nomina.dat_reportescertificaciones WHERE idreportescertificaciones = $idreportescertificaciones and identidad = $identidad;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $estado = $conn->fetchOne($sql);
        return $estado;
    }

    public function obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad)
    {
        $sql = "select erp.*, (CASE WHEN (dp.snombre = '' OR dp.snombre is null) THEN (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) ELSE (dp.nombre ||' '||dp.snombre ||' '|| dp.papel ||' '|| dp.sapel) END) as nombreyapellidos, pcc.numero, pn.orden,
        (pn.orden ||'-'|| (CASE WHEN pn.idplantillanominal is not null THEN pn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
        pcodc.cdgocontable,nfe.nivel as ordencargo, dco.idcargosocupados, nfe.ordenunico
        from mod_nomina.dat_elementosreportescertificaciones erp
        inner join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento)
        inner join mod_persona.dat_docidentidad pcc on (pcc.idpersona = dp.idpersona and pcc.principal=1)
        inner join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.identidad = {$identidad})
        inner join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
        inner join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = cpnc.idplantillanominal and pn.identidad = {$identidad})
        inner join mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo and dc.idproyecto = 0)
        inner join mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo )
        inner join mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo )
        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
        where idreportescertificaciones = ? and dco.activa = 1 order by nfe.ordenunico ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones));

        if (!empty($arregloElem)) {
            $arrIdsElem = array();
            foreach ($arregloElem as $k => $e) {
                $arrIdsElem[] = $e['idelementosreportescertificaciones'];
            }
            $objVE = new DatVariablesElementosReportesCertificaciones();
            $arregloVE = $objVE->obtenerVariablesElementosReportesCertificaciones($arrIdsElem);
            foreach ($arregloElem as $i => $e) {
                foreach ($arregloVE as $k => $ve) {
                    if ($arregloElem[$i]['idelementosreportescertificaciones'] == $ve['idelementosreportescertificaciones']) {
                        $arregloElem[$i][$ve['idvariablesconfreportescertificaciones']] = $ve['valor'];
                    }
                }
            }

        }

        return $arregloElem;
    }

    public static function obtenerElementosReportesCertificacionesPersonaPDF($idreportescertificaciones, $identidad)
    {
        $sql = "select erp.*, (CASE WHEN (dp.snombre = '' OR dp.snombre is null) THEN (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) ELSE (dp.nombre ||' '||dp.snombre ||' '|| dp.papel ||' '|| dp.sapel) END) as nombreyapellidos, pcc.numero, pn.orden,
        (pn.orden ||'-'|| (CASE WHEN pn.idplantillanominal is not null THEN pn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
        pcodc.cdgocontable
        from mod_nomina.dat_elementosreportescertificaciones erp
        left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento)
        left join mod_persona.dat_docidentidad pcc  on (pcc.idpersona = dp.idpersona and pcc.principal=1)
        left join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.fechavencimiento is null and dco.identidad = " . $identidad . ")
        left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
        left join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = cpnc.idplantillanominal and pn.identidad = " . $identidad . ")
        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad and (pcodc.cdgocontable is not null and pcodc.cdgocontable <> ''))
        where idreportescertificaciones = ? and dco.identidad = ? order by pn.orden, nombreyapellidos DESC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones, $identidad));
        if (!empty($arregloElem)) {
            $arrIdsElem = array();
            foreach ($arregloElem as $k => $e) {
                $arrIdsElem[] = $e['idelementosreportescertificaciones'];
            }

            $objVE = new DatVariablesElementosReportesCertificaciones();
            $arregloVE = $objVE->obtenerVariablesElementosReportesCertificaciones($arrIdsElem);
            

            foreach ($arregloElem as $i => &$e) {
                foreach ($arregloVE as $k => $ve) {
                    if ($ve['idelementosreportescertificaciones'] == $e['idelementosreportescertificaciones'])
                        $e[$ve['idvariablesconfreportescertificaciones']] = $ve['valor'];
                }
            }
        }
        return $arregloElem;
    }

    public static function obtenerElementosReportesCertificacionesPersonaPDFDatos($idreportescertificaciones, $identidad)
    {
        $sql = "SELECT datos FROM mod_nomina.dat_reportescertificaciones where idreportescertificaciones = ? and identidad = ? ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones, $identidad));
        return $arregloElem;
    }

    /*SELECT
    CASE
     WHEN dp.snombre IS NOT NULL
     THEN dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel
      ELSE dp.nombre||' '||dp.papel||' '||dp.sapel END as nombre,
      cpcc.cdgocontable,
      ddi.numero AS ci,
      nc.denominacion AS cargo,
      (ncc.codigocentrogrupo ||'_'||ncc.descripcioncentrogrupo) AS centrocosto,
      cb.numerocuenta AS cuentacuc,
      cb1.numerocuenta AS cuentamn,
      cpn.denominacion AS plantilla_nominal,cpn.orden,nfe.nivel*/
    public static function obtenerDatosPDF($identidad)
    {
        $sql = "
        SELECT DISTINCT(dp.idpersona),dp.papel, dp.sapel, dp.sexo,cpn.orden,nfe.nivel, cpcc.cdgocontable,ddi.numero AS ci,nc.denominacion AS cargo,nc.denominacion AS cargo,
        (ncc.codigocentrogrupo ||'_'||ncc.descripcioncentrogrupo) AS centrocosto, cb.numerocuenta AS cuentacuc, cb1.numerocuenta AS cuentamn, 
        (CASE WHEN dp.snombre IS NOT NULL THEN dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel ELSE dp.nombre||' '||dp.papel||' '||dp.sapel END) as nombre, 
        (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
        (CASE WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal, 
        (CASE WHEN cpn.idplantillanominal is not null THEN (select cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = cpn.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.denominacion ELSE 'Sin plantilla nominal' END) as plantilla_nominal
        FROM mod_nomina.dat_cargosocupados dco 
        INNER JOIN mod_persona.dat_persona dp ON( dco.idpersona = dp.idpersona) 
        INNER JOIN mod_persona.dat_docidentidad ddi ON( ddi.idpersona = dp.idpersona and ddi.principal = 1) 
        LEFT JOIN mod_nomina.conf_personacdgocontable cpcc ON(cpcc.idpersona = dp.idpersona) 
        LEFT JOIN mod_personaext.dat_cuentabancaria cb1 ON(dco.idpersonacuentabancariamn = cb1.idcuentabancaria) 
        LEFT JOIN mod_personaext.dat_cuentabancaria cb ON(dco.idpersonacuentabancariacuc = cb.idcuentabancaria) 
        LEFT JOIN mod_estructuracomp.dat_cargo dc ON(dco.idcargo = dc.idcargo) 
        LEFT JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo) 
        LEFT JOIN mod_estructuracomp.nom_cargo nc ON(nc.idnomcargo = dc.idnomcargo) 
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON( cpnc.idcargo = dco.idcargo) 
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON(cpnc.idplantillanominal = cpn.idplantillanominal AND cpn.identidad = {$identidad}) 
        LEFT JOIN mod_contabilidadcosto.nom_centrocosto ncc ON(dco.idcentrocosto = ncc.idcentrogrupo ) 
		left join mod_contabilidadcosto.dat_centro_grupo_entidad dcce on (dcce.idcentrogrupo = ncc.idcentrogrupo)
	    WHERE dco.identidad = {$identidad} and ((ncc.idestructuracomun = $identidad) or (dcce.idestructuracomun = $identidad)) ORDER BY cpn.orden ASC,nfe.nivel ASC;";
       // LEFT JOIN mod_contabilidadcosto.nom_centrocosto ncc ON(dco.idcentrocosto = ncc.idcentrogrupo AND ncc.idestructuracomun = {$identidad}) WHERE dco.identidad = {$identidad} ORDER BY cpn.orden ASC,nfe.nivel ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql);
        //print_r($arregloElem);die;
        return $arregloElem;
    }

    public static function obtenerCabeceraReportesCertificacionesPersona($idreportescertificaciones)
    {
        $sql = "SELECT trc.denominacion, rc.fechainicio, rc.fechafin, rc.idusuario,
	    (CASE WHEN nfe.idconcepto = 3 THEN e.codigo WHEN nfe.idconcepto = 5 THEN eop.codigo ELSE '' END) as codigo,
	    (CASE WHEN nfe.idconcepto = 3 THEN e.denominacion WHEN nfe.idconcepto = 5 THEN eop.denominacion ELSE '' END) as entidad
        FROM mod_nomina.dat_reportescertificaciones rc
        INNER join mod_nomina.conf_tiporeportescertificaciones trc on(rc.idconfreportescertificaciones=trc.idconfreportescertificaciones)
		INNER join mod_estructuracomp.nom_filaestruc nfe on(nfe.idfila=rc.identidad)
        LEFT join mod_estructuracomp.dat_estructura e on(e.idestructura=rc.identidad)
        LEFT join mod_estructuracomp.dat_estructuraop eop on(eop.idestructuraop=rc.identidad)
        WHERE rc.idreportescertificaciones=?;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones));

        return $arregloElem;
    }

    public function obtenerElementosReportesCertificacionesBuscarPersona($idreportescertificaciones, $textobuscar, $identidad)
    {
        $sql = "select erp.*, (CASE WHEN (dp.snombre = '' OR dp.snombre is null) THEN (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) ELSE (dp.nombre ||' '||dp.snombre ||' '|| dp.papel ||' '|| dp.sapel) END) as nombreyapellidos, pcc.numero, pn.orden,
        (pn.orden ||'-'|| (CASE WHEN pn.idplantillanominal is not null THEN pn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
        pcodc.cdgocontable,nfe.nivel, dco.idcargosocupados 
        from mod_nomina.dat_elementosreportescertificaciones erp
        left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento)
        left join mod_persona.dat_docidentidad pcc  on (pcc.idpersona = dp.idpersona and pcc.principal=1)
        left join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dp.idpersona and dco.identidad = {$identidad})
        left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
        left join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = cpnc.idplantillanominal)
        LEFT JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
        INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
        LEFT JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
        left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
        where (idreportescertificaciones = ? and dco.identidad = ?) and (dp.nombre ilike '%$textobuscar%' or dp.snombre ilike '%$textobuscar%' or dp.papel ilike '%$textobuscar%' or dp.sapel ilike '%$textobuscar%') 
		order by pn.orden, nfe.nivel ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones, $identidad));
        if (!empty($arregloElem)) {
            $arrIdsElem = array();
            foreach ($arregloElem as $k => $e) {
                $arrIdsElem[] = $e['idelementosreportescertificaciones'];
            }
            $objVE = new DatVariablesElementosReportesCertificaciones();
            $arregloVE = $objVE->obtenerVariablesElementosReportesCertificaciones($arrIdsElem);
            foreach ($arregloElem as $i => &$e) {
                foreach ($arregloVE as $k => $ve) {
                    if ($ve['idelementosreportescertificaciones'] == $e['idelementosreportescertificaciones']) {
                        /*if ($ve['calculable'] == 1) {
                            if (!empty($ve['idexpresionmatematica'])) {
                                $e[$ve['idvariablesconfreportescertificaciones']] = $this->evaluarFormulasVariablesCalculables($e['idelemento'], $e['idreportescertificaciones'], $ve['idexpresionmatematica']);
//                                $objDatVariablesElementosReportesCertificaciones = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find(($ve['idvariableselementosreportescertificaciones']));
//                                $objDatVariablesElementosReportesCertificaciones->valor = $e[$ve['idvariablesconfreportescertificaciones']];
//                                $objDatVariablesElementosReportesCertificaciones->save();
                            } else {
                                $e[$ve['idvariablesconfreportescertificaciones']] = $ve['valor'];
                            }
                        } else {*/
                        $e[$ve['idvariablesconfreportescertificaciones']] = $ve['valor'];
                        //}
                    }
                }
            }
        }
        //print_r($arregloElem) ;die;
        return $arregloElem;
    }

    public static function devolverElementosqueCoinciden($idreportescertificaciones, $arrEl)
    {
        $sql = "select *
        from mod_nomina.dat_elementosreportescertificaciones erp
        where idreportescertificaciones = ? and idelemento in (" . implode(',', $arrEl) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idreportescertificaciones));

    }

    public function obtenerElementosReportesCertificaciones($idreportescertificaciones, $nivel = 1, $limite = 15, $inicio = 0)
    {
        if ($nivel == 1) {
            $sql = "select erp.*, (CASE WHEN dp.snombre is null or dp.snombre = '' THEN dp.nombre || ' ' || dp.papel || ' ' ||dp.sapel ELSE dp.nombre ||' '|| dp.snombre || ' ' || dp.papel || ' ' ||dp.sapel END) as  denominacion
			from mod_nomina.dat_elementosreportescertificaciones erp
			left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento and dp.feliminado is null)
			where idreportescertificaciones = ? order by denominacion;";
            //and aprobado = 1

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            return $conn->fetchAll($sql, array($idreportescertificaciones));
        } else {
            return array();
        }
    }

    public function cantidadElementosReportesCertificaciones($idreportescertificaciones, $nivel = 1)
    {
        if ($nivel == 1) {
            $sql = "select count(erp.*) as cantidad
			from mod_nomina.dat_elementosreportescertificaciones erp
			left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento and dp.feliminado is null)
			where idreportescertificaciones = ? ;";
            //and aprobado = 1
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql, array($idreportescertificaciones));
            return $r[0]['cantidad'];
        } else {
            return 0;
        }
    }

    public static function devolverElementos($idreportescertificaciones, $idpersona)
    {

        $sql = "select ele.idelementosreportescertificaciones
        from mod_nomina.dat_elementosreportescertificaciones ele
        where ele.idreportescertificaciones = $idreportescertificaciones and ele.idelemento = $idpersona ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;

    }

    public static function devolverElementosPersona($idreportescertificaciones, $idpersona)
    {

        $sql = "select ele.idelementosreportescertificaciones
        from mod_nomina.dat_elementosreportescertificaciones ele
        where ele.idreportescertificaciones = $idreportescertificaciones and ele.idelemento = $idpersona ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchOne($sql);
        return $r;

    }

    public static function existePersonaReporte($idreportescertificaciones, $idpersona)
    {

        $sql = "select count(ele.idelementosreportescertificaciones)
        from mod_nomina.dat_elementosreportescertificaciones ele
        where ele.idreportescertificaciones = $idreportescertificaciones and ele.idelemento = $idpersona ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;

    }

    public function evaluarFormulasVariablesCalculables($idpersona, $idreportescertificacionesactual, $idexpresionmatematica)
    {
        $arrformulaind = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($idexpresionmatematica);

        $expresion = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($idexpresionmatematica));
        $expmostrar = $expresion[0]['expresionacalcular'];
        $cont = 0;

        foreach ($arrformulaind as $rif) {
            $rexplode = explode('_', $rif);
            $idvariableformula = $rexplode[1];

            $arrvariablepersona = $this->obtenerValorVariableReportePorPersona($idpersona, $idreportescertificacionesactual, $idvariableformula);
            $arrayind[$cont]['idindicador'] = $rif;
//            if(empty($arrvariablepersona[0]['valor'])){
            if (!$arrvariablepersona[0]['valor'] && $arrvariablepersona[0]['valor'] == null) {
                return 0;
            }
            $arrayind[$cont]['valor'] = $arrvariablepersona[0]['valor'];
            $cont++;
        }

        $valorfind = CalculoFormulasPagoResultados::evaluarExpresionMatematica($arrayind, $expmostrar);
        return $valorfind->valor;
    }

    public function obtenerValorVariableReportePorPersona($idpersona, $idreportescertificacionesactual, $idvariablesconfreportescertificaciones)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "WITH repcert as (SELECT drc1.idreportescertificaciones, drc1.fechainicio, drc1.fechafin FROM  mod_nomina.dat_reportescertificaciones drc1 WHERE
        drc1.idreportescertificaciones = {$idreportescertificacionesactual})
        SELECT drc.idreportescertificaciones,drc.idconfreportescertificaciones,dverc.idvariableselementosreportescertificaciones,
        derc.idelemento , drc.fechainicio, drc.fechafin, dverc.valor
        FROM repcert, mod_nomina.dat_reportescertificaciones drc
        INNER JOIN mod_nomina.dat_elementosreportescertificaciones derc on (derc.idreportescertificaciones = drc.idreportescertificaciones)
        INNER JOIN mod_nomina.dat_variableselementosreportescertificaciones dverc on (dverc.idelementosreportescertificaciones = derc.idelementosreportescertificaciones)
        WHERE derc.idelemento = ? AND dverc.idvariablesconfreportescertificaciones = ? AND (drc.fechainicio = repcert.fechainicio AND drc.fechafin = repcert.fechafin);";
        return $conn->fetchAll($sql, array($idpersona, $idvariablesconfreportescertificaciones));
    }

    public function obtenerIDelementosreportescertificaciones($idpersona, $idreportecertificaciones)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT idelementosreportescertificaciones
            FROM mod_nomina.dat_elementosreportescertificaciones WHERE idelemento = $idpersona and idreportescertificaciones = $idreportecertificaciones;";
        return $conn->fetchOne($sql);
    }
}
