<?php

class DatAmbiente extends BaseDatMedioambglobal
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idmedio)
    {
        return Doctrine::getTable('DatAmbiente')->find($idmedio)->toArray();
    }

    public function listarAcciones($params)
    {
        if ($params['idsector'] != 0) {
            $ADDWHERE = " acc.iddatosnomenclador not in (Select glob.iddatosnomenclador
             FROM mod_planifinversiones.dat_medioambglobal glob where glob.idpadre = {$params['idsector']})";
        } else {
            $ADDWHERE = 'true';
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT acc.idaccion idmedioambglobal,nomc.denominacion dato,acc.iddatosnomenclador
      FROM  mod_planifinversiones.dat_accion  acc
      INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (acc.iddatosnomenclador =  nomc.iddatosnomenclador)
      where $ADDWHERE ";


        $datosListar = $conn->execute($sql);

        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarCuencas($params)
    {
        if ($params['idsector'] != 0) {
            $ADDWHERE = "cue.iddatosnomenclador not in (Select glob.iddatosnomenclador
         FROM mod_planifinversiones.dat_medioambglobal glob where glob.idpadre = {$params['idsector']})";
        } else {
            $ADDWHERE = 'true';
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT cue.idcuenca idmedioambglobal,nomc.denominacion dato,cue.iddatosnomenclador
      FROM  mod_planifinversiones.dat_cuenca cue
      INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (cue.iddatosnomenclador =  nomc.iddatosnomenclador)
      where $ADDWHERE";
        $datosListar = $conn->execute($sql);

        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarBahias($params)
    {
        if ($params['idsector'] != 0) {
            $ADDWHERE = "bah.iddatosnomenclador not in (Select glob.iddatosnomenclador
             FROM mod_planifinversiones.dat_medioambglobal glob where glob.idpadre = {$params['idsector']})";
        } else {
            $ADDWHERE = 'true';
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT bah.idbahia idmedioambglobal,nomc.denominacion dato,bah.iddatosnomenclador
      FROM  mod_planifinversiones.dat_bahia bah
      INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (bah.iddatosnomenclador =  nomc.iddatosnomenclador)
      where $ADDWHERE ";
        $datosListar = $conn->execute($sql);

        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarSectores()
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT sect.idsector idsector,nomc.denominacion dato,sect.iddatosnomenclador
      FROM  mod_planifinversiones.dat_sector  sect
      INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (sect.iddatosnomenclador =  nomc.iddatosnomenclador)";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listaCuentaAux($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT cue.idcuenca idcuenca,nomc.denominacion dato,cue.iddatosnomenclador
      FROM  mod_planifinversiones.dat_cuenca  cue
      INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (cue.iddatosnomenclador =  nomc.iddatosnomenclador)
      INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (cue.idnomenclador = nom.idnomenclador)
      INNER JOIN mod_planifinversiones.dat_medioambglobal amb ON (nomc.iddatosnomenclador = amb.iddatosnomenclador)
      INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (amb.idmedioambglobal = mp.idmedioambglobal)
      INNER JOIN mod_planifinversiones.dat_inversion i ON (amb.idinversion = i.idinversion and i.eliminada = 0)
      WHERE i.idestadoinversion=1 and nom.nombrecampo = 'Cuenca' AND i.idinversion = " . $params['idinversion'] . " AND
      (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
      AND mp.idejercicio = " . $params['idejercicio'] . "
      ORDER BY cue.idcuenca";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listaBahiasAux($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT bah.idbahia idbahia,nomc.denominacion dato,bah.iddatosnomenclador
      FROM  mod_planifinversiones.dat_bahia  bah
      INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (bah.iddatosnomenclador =  nomc.iddatosnomenclador)
      INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (bah.idnomenclador = nom.idnomenclador)
      INNER JOIN mod_planifinversiones.dat_medioambglobal amb ON (nomc.iddatosnomenclador = amb.iddatosnomenclador)
      INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (amb.idmedioambglobal = mp.idmedioambglobal)
      INNER JOIN mod_planifinversiones.dat_inversion i ON (amb.idinversion = i.idinversion and i.eliminada = 0)
      WHERE i.idestadoinversion=1 and nom.nombrecampo = 'Bahía' AND i.idinversion = " . $params['idinversion'] . " AND
      (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
      AND mp.idejercicio = " . $params['idejercicio'] . "
      ORDER BY bah.idbahia";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarSectoresAux($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT sect.idsector idsector,nomc.denominacion dato,sect.iddatosnomenclador
      FROM  mod_planifinversiones.dat_sector  sect
      INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (sect.iddatosnomenclador =  nomc.iddatosnomenclador)
      INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (sect.idnomenclador = nom.idnomenclador)
      INNER JOIN mod_planifinversiones.dat_medioambglobal amb ON (nomc.iddatosnomenclador = amb.iddatosnomenclador)
      INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (amb.idmedioambglobal = mp.idmedioambglobal)
      INNER JOIN mod_planifinversiones.dat_inversion i ON (amb.idinversion = i.idinversion and i.eliminada = 0)
      WHERE i.idestadoinversion=1 and nom.nombrecampo = 'Sector' AND i.idinversion = " . $params['idinversion'] . " AND
      (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
      AND mp.idejercicio = " . $params['idejercicio'] . "
      ORDER BY sect.idsector";
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarAccionesAux($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT a.idaccion,
                        nomc.denominacion dato,
                        a.iddatosnomenclador
                 FROM mod_planifinversiones.dat_accion a
                    INNER JOIN mod_planificacion.nom_datosnomenclador nomc ON (a.iddatosnomenclador = nomc.iddatosnomenclador)
                    INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (a.idnomenclador = nom.idnomenclador)
                    INNER JOIN mod_planifinversiones.dat_medioambglobal amb ON (nomc.iddatosnomenclador = amb.iddatosnomenclador)
                    INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (amb.idmedioambglobal = mp.idmedioambglobal)
                    INNER JOIN mod_planifinversiones.dat_inversion i ON (amb.idinversion = i.idinversion and i.eliminada = 0)
                WHERE i.idestadoinversion=1 and nom.nombrecampo = 'Acción' AND i.idinversion = " . $params['idinversion'] . " AND
                    (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
                    AND mp.idejercicio = " . $params['idejercicio'] . "
                ORDER BY a.idaccion";
//pre_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarMedioAmb($params)
    {
        $conn = Doctrine_Manager::connection();
        if ($params['idpadre'] != 0) {
            $ADDWHERE = "and glob.idpadre = {$params['idpadre']} and glob.idmedioambglobal <> glob.idpadre";
        } else {
            $ADDWHERE = "and glob.idmedioambglobal = glob.idpadre";
        }
        $sql = "select glob.idmedioambglobal,nom.denominacion ,glob.idpadre pad,nom1.denominacion pannom,glob.idnomenclador,
                       inv.denominacion inversion,inv.idinversion,COALESCE(mp.valor,0) AS  sumapresp_usd,
                       COALESCE(mp1.valor,0) AS  sumapresp_mp,COALESCE(mp.idmedioambpresupuesto,0) AS idpresmp,
                         case when (select count (mod_planifinversiones.dat_medioambglobal.idmedioambglobal) as cont
                            from mod_planifinversiones.dat_medioambglobal
                            where 
                             mod_planifinversiones.dat_medioambglobal.idpadre  = glob.idmedioambglobal) > 1 then 0 else 1 end as _is_leaf,
                       COALESCE(mp1.idmedioambpresupuesto,0) AS idpresusd,glob.iddatosnomencladorpadre,glob.iddatosnomenclador,glob.idnomenclador
                                FROM mod_planifinversiones.dat_medioambglobal glob
				LEFT JOIN mod_planifinversiones.dat_medioambpresupuesto mp ON (mp.idmedioambglobal = glob.idmedioambglobal and mp.idmonedaentidad = {$params['USD']})
				LEFT JOIN mod_planifinversiones.dat_medioambpresupuesto mp1 ON (mp1.idmedioambglobal = glob.idmedioambglobal and mp1.idmonedaentidad = {$params['MP']})
				LEFT JOIN mod_planifinversiones.dat_sector sect ON (sect.idsector = glob.idpadre)
				LEFT JOIN mod_planifinversiones.dat_cuenca cu ON (cu.idcuenca = glob.idmedioambglobal)
				LEFT JOIN mod_planifinversiones.dat_accion acc ON (acc.idaccion = glob.idmedioambglobal)
				LEFT JOIN mod_planifinversiones.dat_bahia ba ON (ba.idbahia = glob.idmedioambglobal)
				INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (nom.iddatosnomenclador =  glob.iddatosnomenclador)
				INNER JOIN mod_planificacion.nom_datosnomenclador nom1 ON (nom1.iddatosnomenclador =  glob.iddatosnomencladorpadre)
				INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = glob.idinversion)
                                
                                WHERE inv.idestructuracomun = {$params['identidad']} AND inv.idinversion = {$params['idinversion']} 
                                $ADDWHERE ORDER BY glob.idnomenclador";
        //  print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarejecutado($ejercicio, $idmonedaent, $params, $idglob)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idmedioambglobal,mdest.idmedioambejecutado) glob.idmedioambglobal,mdest.idmedioambejecutado,
                 COALESCE(mdest.valor,0) AS valor
                         FROM mod_planifinversiones.dat_medioambglobal glob
				INNER JOIN mod_planifinversiones.dat_inversion inv 
                                ON (inv.idinversion = glob.idinversion)
				LEFT JOIN mod_planifinversiones.dat_medioambejecutado mdest 
                                ON (mdest.idmedioambglobal = glob.idmedioambglobal
                                and mdest.idejercicio = $ejercicio 
                                and mdest.idmonedaentidad = {$idmonedaent})
                                WHERE inv.idestructuracomun = {$params['identidad']}
                                AND inv.idinversion = {$params['idinversion']} 
                              
                                AND glob.idmedioambglobal = {$idglob}";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarplanmdio($ejercicio, $idmonedaent, $params, $idglob)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idmedioambglobal,mdest.idmedioambplan) glob.idmedioambglobal,mdest.idmedioambplan,
                 COALESCE(mdest.valor,0) AS valor
                         FROM mod_planifinversiones.dat_medioambglobal glob
				INNER JOIN mod_planifinversiones.dat_inversion inv 
                                ON (inv.idinversion = glob.idinversion)
				LEFT JOIN mod_planifinversiones.dat_medioambplan mdest 
                                ON (mdest.idmedioambglobal = glob.idmedioambglobal 
                                and mdest.idejercicio = $ejercicio 
                                and mdest.idmonedaentidad = {$idmonedaent})
                                WHERE inv.idestructuracomun = {$params['identidad']}
                                AND inv.idinversion = {$params['idinversion']} 
                                and glob.idmedioambglobal = {$idglob}";
        //     print_r($sql);
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarproyecc($ejercicio, $idmonedaent, $params, $idglob)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idmedioambglobal,mdest.idmedioambproyectado)glob.idmedioambglobal,mdest.idmedioambproyectado,
                 COALESCE(mdest.valor,0) AS valor
                         FROM mod_planifinversiones.dat_medioambglobal glob
				INNER JOIN mod_planifinversiones.dat_inversion inv 
                                ON (inv.idinversion = glob.idinversion)
				LEFT JOIN mod_planifinversiones.dat_medioambproyectado mdest 
                                ON (mdest.idmedioambglobal = glob.idmedioambglobal 
                                and mdest.idejercicio = $ejercicio 
                                and mdest.idmonedaentidad ={$idmonedaent} )
                                WHERE inv.idestructuracomun = {$params['identidad']}
                AND inv.idinversion = {$params['idinversion']}  and glob.idmedioambglobal = {$idglob}";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarestimado($ejercicio, $idmonedaent, $params, $idglob)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(glob.idmedioambglobal,mdest.idmedioambestimado)glob.idmedioambglobal,mdest.idmedioambestimado, 
                 COALESCE(mdest.valor,0) AS valor
                         FROM mod_planifinversiones.dat_medioambglobal glob
				INNER JOIN mod_planifinversiones.dat_inversion inv 
                                ON (inv.idinversion = glob.idinversion)
				LEFT JOIN mod_planifinversiones.dat_medioambestimado mdest 
                                ON (mdest.idmedioambglobal = glob.idmedioambglobal 
                                and mdest.idejercicio = $ejercicio 
                                and mdest.idmonedaentidad ={$idmonedaent})
                                WHERE inv.idestructuracomun = {$params['identidad']}
                AND inv.idinversion = {$params['idinversion']} and glob.idmedioambglobal = {$idglob}";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarNomAmb($tabla, $id)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "select idnomenclador
                                FROM mod_planifinversiones.nom_nomenclador 
                                where tabla = '" . $tabla . "'";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarPresPlan($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    ei.idinversion,
                    ep.idmoneda,
                    ep.idejercicio,
                    sum (ep.valor) as valor
                  FROM
                    mod_planifinversiones.dat_inversetapaplan ep
                    INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (ep.idetapainversion = ei.idetapainversion)
                    where ei.idinversion = " . $params['idinversion'] . "
                    and ep.idejercicio = " . $params['idejercicio'] . "
                    group by ei.idinversion,
                    ep.idmoneda,
                    ep.idejercicio";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarPresMedioAmbientePlan($params)
    {
        if ($params['tipoMedioAmb'] != '')
            $whereTipo = " and nom.nombrecampo = '{$params['tipoMedioAmb']}'";
        else
            $whereTipo = " ";

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    ma.idinversion,
                    me.idmoneda,
                    map.idejercicio,
                    sum (map.valor) as valor,
                    m.codigoiso
                  FROM

                    mod_planifinversiones.dat_medioambglobal ma
                    INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (ma.idnomenclador = nom.idnomenclador)
                    INNER JOIN mod_planifinversiones.dat_medioambplan map ON(ma.idmedioambglobal=map.idmedioambglobal)
                    inner JOIN mod_datosmaestros.dat_monedaentidad me ON(map.idmonedaentidad= me.idmonedaentidad)
                    RIGHT join mod_datosmaestros.nom_moneda m on (me.idmoneda = m.idmoneda)
                  where ma.idinversion = " . $params['idinversion'] . "
                  and map.idejercicio = " . $params['idejercicio'] . "
                  $whereTipo
                  group by ma.idinversion,
                    me.idmoneda,
                    map.idejercicio,
                    m.codigoiso";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarDatosSectores($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                mg.idinversion,
                mg.iddatosnomenclador,
                mg.iddatosnomencladorpadre,
                mp.idmonedaentidad,
                ds.idsector,
                men.idmoneda,
                mp.idejercicio,
                mp.valor
                --sum(mp.valor) as valor
              FROM
                mod_planifinversiones.dat_medioambglobal mg
                INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (mg.idmedioambglobal = mp.idmedioambglobal)
                INNER JOIN mod_planifinversiones.dat_sector ds ON (mg.iddatosnomenclador = ds.iddatosnomenclador)
                INNER JOIN mod_datosmaestros.dat_monedaentidad men ON (men.idmonedaentidad = mp.idmonedaentidad)
                AND (mg.idnomenclador =ds.idnomenclador)
                INNER JOIN mod_planifinversiones.dat_inversion i ON (mg.idinversion = i.idinversion and i.eliminada = 0)
              WHERE i.idestadoinversion=1 and
                i.idinversion = " . $params['idinversion'] . "
                AND (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
                AND mp.idejercicio = " . $params['idejercicio'] . "
                    group by  mg.idinversion,
                    mg.iddatosnomenclador,
                    mg.iddatosnomencladorpadre,
                    mp.idmonedaentidad,
                     ds.idsector,
                      men.idmoneda,
                    mp.idejercicio,
                    mp.valor
                    order by idsector

                "; //pre_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarDatosAcciones($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                mg.idinversion,
                mg.iddatosnomenclador,
                mg.iddatosnomencladorpadre,
                mp.idmonedaentidad,
                ds.idaccion,
                men.idmoneda,
                mp.idejercicio,
                mp.valor,
                m.codigoiso
                --sum(mp.valor) as valor
              FROM
                mod_planifinversiones.dat_medioambglobal mg
                INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (mg.idmedioambglobal = mp.idmedioambglobal)
                INNER JOIN mod_planifinversiones.dat_accion ds ON (mg.iddatosnomenclador = ds.iddatosnomenclador)
                INNER JOIN mod_datosmaestros.dat_monedaentidad men ON (men.idmonedaentidad = mp.idmonedaentidad)
                RIGHT join mod_datosmaestros.nom_moneda m on (men.idmoneda = m.idmoneda)
                AND (mg.idnomenclador =ds.idnomenclador)
                INNER JOIN mod_planifinversiones.dat_inversion i ON (mg.idinversion = i.idinversion and i.eliminada = 0)
              WHERE i.idestadoinversion=1 and
                i.idinversion = " . $params['idinversion'] . "
                AND (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
                AND mp.idejercicio = " . $params['idejercicio'] . "
                    group by  mg.idinversion,
                    mg.iddatosnomenclador,
                    mg.iddatosnomencladorpadre,
                    mp.idmonedaentidad,
                    ds.idaccion,
                    men.idmoneda,
                    mp.idejercicio,
                    mp.valor,
                    m.codigoiso
                    order by idaccion

                "; //pre_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarCuencas($params){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                mg.idinversion,
                mg.iddatosnomenclador,
                mg.iddatosnomencladorpadre,
                mp.idmonedaentidad,
                cue.idcuenca,
                men.idmoneda,
                mp.idejercicio,
                mp.valor
                --sum(mp.valor) as valor
              FROM
                mod_planifinversiones.dat_medioambglobal mg
                INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (mg.idmedioambglobal = mp.idmedioambglobal)
                INNER JOIN mod_planifinversiones.dat_cuenca cue ON (mg.iddatosnomenclador = cue.iddatosnomenclador)
                INNER JOIN mod_datosmaestros.dat_monedaentidad men ON (men.idmonedaentidad = mp.idmonedaentidad)
                AND (mg.idnomenclador =cue.idnomenclador)
                INNER JOIN mod_planifinversiones.dat_inversion i ON (mg.idinversion = i.idinversion and i.eliminada = 0)
              WHERE i.idestadoinversion=1 and
                i.idinversion = " . $params['idinversion'] . "
                AND (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
                AND mp.idejercicio = " . $params['idejercicio'] . "
                    group by  mg.idinversion,
                    mg.iddatosnomenclador,
                    mg.iddatosnomencladorpadre,
                    mp.idmonedaentidad,
                     cue.idcuenca,
                      men.idmoneda,
                    mp.idejercicio,
                    mp.valor
                    order by idcuenca

                "; //pre_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }
    public function cargarBahias($params){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                mg.idinversion,
                mg.iddatosnomenclador,
                mg.iddatosnomencladorpadre,
                mp.idmonedaentidad,
                bah.idbahia,
                men.idmoneda,
                mp.idejercicio,
                mp.valor
                --sum(mp.valor) as valor
              FROM
                mod_planifinversiones.dat_medioambglobal mg
                INNER JOIN mod_planifinversiones.dat_medioambplan mp ON (mg.idmedioambglobal = mp.idmedioambglobal)
                INNER JOIN mod_planifinversiones.dat_bahia bah ON (mg.iddatosnomenclador = bah.iddatosnomenclador)
                INNER JOIN mod_datosmaestros.dat_monedaentidad men ON (men.idmonedaentidad = mp.idmonedaentidad)
                AND (mg.idnomenclador =bah.idnomenclador)
                INNER JOIN mod_planifinversiones.dat_inversion i ON (mg.idinversion = i.idinversion and i.eliminada = 0)
              WHERE i.idestadoinversion=1 and
                i.idinversion = " . $params['idinversion'] . "
                AND (" . $params['ejercicio'] . " >=(date_part('year', i.fechainicio)) ::numeric AND " . $params['ejercicio'] . " <=(date_part('year', i.fechafin)) ::numeric)
                AND mp.idejercicio = " . $params['idejercicio'] . "
                    group by  mg.idinversion,
                    mg.iddatosnomenclador,
                    mg.iddatosnomencladorpadre,
                    mp.idmonedaentidad,
                     bah.idbahia,
                      men.idmoneda,
                    mp.idejercicio,
                    mp.valor
                    order by idbahia

                "; //pre_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}

