<?php

class DesagregCtrlInver {

    public function getCmpPorInv($idinvers) {
        $conn = Doctrine_Manager::connection();
        $sql = "select ne.idnombreetapa, ne.denominacion, eiv.idetapainversion, dnm.idmonedaentidad, nm.codigoiso
                FROM mod_planifinversiones.dat_etapainversion eiv
                INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                INNER JOIN mod_planifinversiones.dat_inversion di ON (di.idinversion = eiv.idinversion)
                INNER JOIN mod_datosmaestros.dat_monedaentidad dnm on (dnm.idestructuracomun = di.idestructuracomun)
                INNER JOIN mod_datosmaestros.nom_moneda nm on (nm.idmoneda = dnm.idmoneda)
               where eiv.idinversion = " . $idinvers . " ORDER BY nm.codigoiso, ne.denominacion";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function PlanAprobadoPorInvCmp($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dnm.idmonedaentidad,
                        sum(diep.valor),
                        nm.codigoiso,
                        dei.idetapainversion
                 FROM mod_planifinversiones.dat_inversetapaplan diep
                INNER JOIN mod_datosmaestros.nom_moneda nm on (nm.idmoneda = diep.idmoneda)
                INNER JOIN mod_datosmaestros.dat_monedaentidad dnm on (dnm.idmoneda = diep.idmoneda and dnm.idestructuracomun =" . $params['identidad'] . " )
                INNER JOIN mod_planifinversiones.dat_etapainversion dei on (dei.idetapainversion = diep.idetapainversion)
                INNER JOIN mod_planifinversiones.dat_etapa de ON (de.idetapa = dei.idetapa)
                WHERE dei.idinversion =" . $params['idinversion'] . " 
                AND diep.idejercicio =" .  $params['idejercicio'] . "
                GROUP BY dnm.idmonedaentidad, nm.codigoiso, dei.idetapainversion";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function PlanAprobadoPP($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT p.idmonedaentidad, pp.valor, nm.codigoiso
                FROM mod_planifinversiones.dat_presanteproy p
                INNER JOIN mod_planifinversiones.dat_presupplan pp ON (pp.idpresanteproy = p.idpresanteproy)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = p.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda nm ON (nm.idmoneda = me.idmoneda)
                WHERE p.idinversion =" . $params['idinversion'] . " 
                AND pp.idejercicio =" .  $params['idejercicio'] . "";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function OtrosInd($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT oi.idnomotrosindicadores, oi.plan
                FROM mod_planifinversiones.dat_otrosindicadares oi 
                WHERE oi.idinversion =" . $params['idinversion'] . " 
                AND oi.idejercicio =" .  $params['idejercicio'] . "
                AND oi.idnomotrosindicadores IN(122, 124)";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function desgCmp($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dep.valor,
                    de.idnombreetapa,
                    nm.codigoiso,
                    ei.idetapainversion,
                    me.idmonedaentidad
                  FROM
                    mod_planifinversiones.dat_desagregacionplan dp
                    INNER JOIN mod_planifinversiones.dat_desagregacionetapaplan dep ON (dp.iddesagregacionplan = dep.iddesagregacionplan)
                    INNER JOIN mod_planifinversiones.nom_trimestre nt ON (dp.idtrimestre = nt.idtrimestre)
                    INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (dep.idetapainversion = ei.idetapainversion)
                    INNER JOIN mod_planifinversiones.dat_etapa de ON (ei.idetapa = de.idetapa)
                    INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = dep.idmonedaentidad)
                    INNER JOIN mod_datosmaestros.nom_moneda nm ON (nm.idmoneda = me.idmoneda)
                  WHERE
                dp.idinversion = " . $params['idinversion'] . " AND
                dp.idejercicio = " . $params['idejercicio'] . " AND 
                dp.idtrimestre in (" . $params['trimestre'] . ")";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function desgCmpIsemestre($semestre, $params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT sum(dep.valor),
                    de.idnombreetapa,
                    nm.codigoiso,
                    ei.idetapainversion,
                    me.idmonedaentidad
                FROM mod_planifinversiones.dat_desagregacionplan dp
                    INNER JOIN mod_planifinversiones.dat_desagregacionetapaplan dep ON (dp.iddesagregacionplan = dep.iddesagregacionplan)
                    INNER JOIN mod_planifinversiones.nom_trimestre nt ON (dp.idtrimestre = nt.idtrimestre)
                    INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (dep.idetapainversion = ei.idetapainversion)
                    INNER JOIN mod_planifinversiones.dat_etapa de ON (ei.idetapa = de.idetapa)
                    INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = dep.idmonedaentidad)
                    INNER JOIN mod_datosmaestros.nom_moneda nm ON (nm.idmoneda = me.idmoneda)
                WHERE
                    dp.idinversion = " . $params['idinversion'] . " AND
                    dp.idejercicio = " . $params['idejercicio'] . " AND 
                    dp.idtrimestre in (" . $semestre . ") 
                GROUP BY  de.idnombreetapa,
                    nm.codigoiso,
                    ei.idetapainversion,
                    me.idmonedaentidad";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function desgMAIsemestre($semestre, $params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    sum (dma.valor) as valor,
                    dma.idmonedaentidad
                FROM mod_planifinversiones.dat_desagregacionmedambplan dma
                INNER JOIN mod_planifinversiones.dat_desagregacionplan dp ON (dma.iddesagregacionplan = dp.iddesagregacionplan)
                WHERE
                    dp.idtrimestre IN (" . $semestre . ") AND
                    dp.idejercicio = " . $params['idejercicio'] . " 
                    AND dp.idinversion = " . $params['idinversion'] . "
                GROUP BY dma.idmonedaentidad";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }
    public function desgIndSemestre($semestre, $params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    sum (dip.valor) as valor,
                    noi.idnomotrosindicadores
                FROM
                    mod_planifinversiones.dat_desagregacionplan dp
                    INNER JOIN mod_planifinversiones.dat_desagregacionindplan dip ON (dp.iddesagregacionplan = dip.iddesagregacionplan)
                    INNER JOIN mod_planifinversiones.nom_trimestre nt ON (dp.idtrimestre = nt.idtrimestre)
                    INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (dip.idnomotrosindicadores = noi.idnomotrosindicadores)
                WHERE
                    dp.idinversion = " . $params['idinversion'] . " AND 
                    dp.idtrimestre IN (" . $semestre . ") AND 
                    dp.idejercicio = " . $params['idejercicio'] . " AND
                    noi.idnomotrosindicadores IN (122, 124) 
                GROUP BY noi.idnomotrosindicadores";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function DesgPPSemestre($semestre, $params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT sum (dppp.valor) as valor,
                        dppp.idmonedaentidad
                FROM mod_planifinversiones.dat_desagregacionplan dp
                    INNER JOIN mod_planifinversiones.dat_desagregacionplanpreparacionplan dppp ON (dp.iddesagregacionplan = dppp.iddesagregacionplan)
                WHERE
                    dp.idinversion = " . $params['idinversion'] . " AND 
                    dp.idtrimestre IN (" . $semestre . ") AND 
                    dp.idejercicio = " . $params['idejercicio'] . " 
                GROUP BY dppp.idmonedaentidad";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ctrlCmp($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    eti.idetapainversion,
                    cep.valor,
                    nm.codigoiso,
                    dm.idmonedaentidad
                FROM
                    mod_planifinversiones.dat_controlplantiempocontrol ctp
                    INNER JOIN mod_planifinversiones.dat_controlplan cp ON (ctp.idcontrolplan = cp.idcontrolplan)
                    INNER JOIN mod_planifinversiones.dat_controletapaplan cep ON (ctp.idcontrolplantiempocontrol = cep.idcontrolplantiempocontrol)
                    INNER JOIN mod_planifinversiones.dat_etapainversion eti ON (cep.idetapainversion = eti.idetapainversion)
                    INNER JOIN mod_datosmaestros.dat_monedaentidad dm ON (cep.idmonedaentidad = dm.idmonedaentidad)
                    INNER JOIN mod_datosmaestros.nom_moneda nm ON (dm.idmoneda = nm.idmoneda)
                WHERE
                    cp.idinversion = " . $params['idinversion'] . " AND
                    cp.idejercicio = " . $params['idejercicio'] . " AND 
                    ctp.idtiempocontrol = " . $params['idtiempocontrol'] . " AND 
                    cp.idtrimestre = " . $params['trimestre'] . "";
//pre_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function realMA($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    cma.valor,
                    nm.codigoiso,
                    cma.idmonedaentidad
                FROM mod_planifinversiones.dat_controlplan cp
                    INNER JOIN mod_planifinversiones.dat_controlplantiempocontrol ctc ON (cp.idcontrolplan = ctc.idcontrolplan)
                    INNER JOIN mod_planifinversiones.dat_controlmedambplan cma ON (ctc.idcontrolplantiempocontrol = cma.idcontrolplantiempocontrol)
                    INNER JOIN mod_datosmaestros.dat_monedaentidad dm ON (cma.idmonedaentidad = dm.idmonedaentidad)
                    INNER JOIN mod_datosmaestros.nom_moneda nm ON (dm.idmoneda = nm.idmoneda)
                WHERE
                cp.idinversion = " . $params['idinversion'] . " AND
                cp.idejercicio = " . $params['idejercicio'] . " AND 
                ctc.idtiempocontrol = " . $params['idtiempocontrol'] . " AND 
                cp.idtrimestre = " . $params['trimestre'] . "";
//pre_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }
    
    public function ctrlInd($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    noi.idnomotrosindicadores,
                    cip.valor
                FROM
                    mod_planifinversiones.dat_controlplantiempocontrol ctc
                    INNER JOIN mod_planifinversiones.dat_controlplan cp ON (ctc.idcontrolplan = cp.idcontrolplan)
                    INNER JOIN mod_planifinversiones.nom_tiempocontrol nt ON (ctc.idtiempocontrol = nt.idtiempocontrol)
                    INNER JOIN mod_planifinversiones.dat_controlindplan cip ON (ctc.idcontrolplantiempocontrol = cip.idcontrolplantiempocontrol)
                    INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (cip.idnomotrosindicadores = noi.idnomotrosindicadores)
                WHERE
                    cp.idinversion = " . $params['idinversion'] . " AND 
                    nt.idtiempocontrol = " . $params['idtiempocontrol'] . " AND 
                    cp.idtrimestre = " . $params['trimestre'] . " AND 
                    cp.idejercicio = " . $params['idejercicio'] . " AND
                    noi.idnomotrosindicadores IN (122, 124)";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function desgEquipo($params, $idTrimestres) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    sum (dep.valor) valor,
                    dep.identidadmodelo
                  FROM
                    mod_planifinversiones.dat_desagregacionplan dp
                    INNER JOIN mod_planifinversiones.dat_desagregacionequipoplan dep ON (dp.iddesagregacionplan = dep.iddesagregacionplan)
                  WHERE
                dp.idinversion = " . $params['idinversion'] . " AND
                dep.idindicador = " . $params['idindicador'] . " AND
                dp.idejercicio = " . $params['idejercicio'] . " AND 
                dp.idtrimestre in (" . $idTrimestres . ") GROUP BY dep.identidadmodelo";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function comprobacionEquipo($ids, $idindicador) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    sum(dep.valor),
                    dep.identidadmodelo
                FROM mod_planifinversiones.dat_desagregacionequipoplan dep 
                WHERE dep.iddesagregacionplan in (" . $ids . ")  AND dep.idindicador = " . $idindicador . "
                GROUP BY dep.identidadmodelo";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function DesgInd($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dip.valor,
                    noi.idnomotrosindicadores
                  FROM
                    mod_planifinversiones.dat_desagregacionplan dp
                    INNER JOIN mod_planifinversiones.dat_desagregacionindplan dip ON (dp.iddesagregacionplan = dip.iddesagregacionplan)
                    INNER JOIN mod_planifinversiones.nom_trimestre nt ON (dp.idtrimestre = nt.idtrimestre)
                    INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (dip.idnomotrosindicadores = noi.idnomotrosindicadores)
                  WHERE
                    dp.idinversion = " . $params['idinversion'] . " AND 
                    dp.idtrimestre in (" . $params['trimestre'] . ") AND 
                    dp.idejercicio = " . $params['idejercicio'] . " AND
                    noi.idnomotrosindicadores IN (122, 124)";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function DesgPP($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dppp.valor,
                        dppp.idmonedaentidad
                FROM mod_planifinversiones.dat_desagregacionplan dp
                INNER JOIN mod_planifinversiones.dat_desagregacionplanpreparacionplan dppp ON (dp.iddesagregacionplan = dppp.iddesagregacionplan)
                WHERE
                    dp.idinversion = " . $params['idinversion'] . " AND 
                    dp.idtrimestre in (" . $params['trimestre'] . ") AND 
                    dp.idejercicio = " . $params['idejercicio'] . "";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ctrlPP($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    cpp.valor,
                    cpp.idmonedaentidad
                FROM
                    mod_planifinversiones.dat_controlplanpreparacionplan cpp
                    INNER JOIN mod_planifinversiones.dat_controlplantiempocontrol ctc ON (ctc.idcontrolplantiempocontrol = cpp.idcontrolplantiempocontrol)
                    INNER JOIN mod_planifinversiones.dat_controlplan cp ON (ctc.idcontrolplan = cp.idcontrolplan)
                    INNER JOIN mod_planifinversiones.nom_tiempocontrol nt ON (ctc.idtiempocontrol = nt.idtiempocontrol)
                WHERE
                    cp.idinversion = " . $params['idinversion'] . " AND 
                    nt.idtiempocontrol = " . $params['idtiempocontrol'] . " AND 
                    cp.idtrimestre = " . $params['trimestre'] . " AND 
                    cp.idejercicio = " . $params['idejercicio'] . "";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function DesgMA($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
	dma.idmonedaentidad,
            --dma.valor
            coalesce(dma.valor, 0) as valor
        FROM mod_planifinversiones.dat_desagregacionmedambplan dma
        WHERE dma.iddesagregacionplan = " . $params . "";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ComprobacionMA($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dma.idmonedaentidad,
                    sum(dma.valor)
                FROM mod_planifinversiones.dat_desagregacionmedambplan dma
                WHERE dma.iddesagregacionplan in(" . $params . ") GROUP BY dma.idmonedaentidad";
// print_r('<pre>');print_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }
}
