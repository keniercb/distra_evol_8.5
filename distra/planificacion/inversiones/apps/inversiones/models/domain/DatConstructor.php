<?php

class DatConstructor extends BaseDatConstructor {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('NomDatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasOne('NomNomenclador', array('local' => 'idnomnomenclador', 'foreign' => 'idnomenclador'));
        $this->hasMany('DatConstructor', array('local' => 'idconstructor', 'foreign' => 'idconstructor'));
    }

    public function getByid($idetapa) {
        return Doctrine::getTable('DatConstructor')->find($idetapa);
    }

    public function getConstructoresByidetapainversion($param) {
        $conn =  Doctrine_Manager::connection();
        $sql = "SELECT 
            mod_planificacion.nom_datosnomenclador.descripcion,
            mod_planificacion.nom_datosnomenclador.color,
            mod_planificacion.nom_datosnomenclador.iddatosnomenclador,
            mod_planifinversiones.dat_constructor.idconstructor,
            mod_planifinversiones.dat_constructor.iddatosnomenclador,
            mod_planifinversiones.dat_constructor.idnomenclador,
            mod_planifinversiones.dat_etapinverconsprov.idetapinverconsprov,
            mod_planifinversiones.dat_etapinverconsprov.idetapainversion,
            mod_planifinversiones.dat_etapinverconsprov.iddpt,
            mod_planifinversiones.dat_etapinverconsprov.idconstructor,
            mod_planifinversiones.nom_nomenclador.idnomenclador,
            mod_planifinversiones.nom_nomenclador.tabla,
            mod_planifinversiones.nom_nomenclador.esquema,
            mod_planifinversiones.nom_nomenclador.nombrecampo,
            mod_planifinversiones.nom_nomenclador.nombreidtabla,
            mod_planifinversiones.nom_nomenclador.nombretablausa,
            mod_planificacion.nom_datosnomenclador.denominacion,
            mod_datosmaestros.nom_dpt.denominacion AS denomdpt
          FROM
            mod_planifinversiones.nom_nomenclador
            INNER JOIN mod_planifinversiones.dat_constructor ON (mod_planifinversiones.nom_nomenclador.idnomenclador = mod_planifinversiones.dat_constructor.idnomenclador)
            INNER JOIN mod_planificacion.nom_datosnomenclador ON (mod_planifinversiones.dat_constructor.iddatosnomenclador = mod_planificacion.nom_datosnomenclador.iddatosnomenclador)
            INNER JOIN mod_planifinversiones.dat_etapinverconsprov ON (mod_planifinversiones.dat_constructor.idconstructor = mod_planifinversiones.dat_etapinverconsprov.idconstructor)
            INNER JOIN mod_datosmaestros.nom_dpt ON (mod_planifinversiones.dat_etapinverconsprov.iddpt = mod_datosmaestros.nom_dpt.iddpt)
          WHERE
            mod_planifinversiones.dat_etapinverconsprov.idetapainversion = " . $param['idetapainversion'];
        //  print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getConstructores($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                mod_planificacion.nom_datosnomenclador.descripcion,
                mod_planificacion.nom_datosnomenclador.color,
                mod_planificacion.nom_datosnomenclador.iddatosnomenclador,
                mod_planifinversiones.dat_constructor.idconstructor,
                mod_planifinversiones.dat_constructor.iddatosnomenclador,
                mod_planifinversiones.dat_constructor.idnomenclador,
                mod_planifinversiones.nom_nomenclador.idnomenclador,
                mod_planifinversiones.nom_nomenclador.tabla,
                mod_planifinversiones.nom_nomenclador.esquema,
                mod_planifinversiones.nom_nomenclador.nombrecampo,
                mod_planifinversiones.nom_nomenclador.nombreidtabla,
                mod_planifinversiones.nom_nomenclador.nombretablausa,
                mod_planificacion.nom_datosnomenclador.denominacion as denomconstructor
              FROM
                mod_planifinversiones.nom_nomenclador
                INNER JOIN mod_planifinversiones.dat_constructor ON (mod_planifinversiones.nom_nomenclador.idnomenclador = mod_planifinversiones.dat_constructor.idnomenclador)
                INNER JOIN mod_planificacion.nom_datosnomenclador ON (mod_planifinversiones.dat_constructor.iddatosnomenclador = mod_planificacion.nom_datosnomenclador.iddatosnomenclador)";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getDatosReporteNAPorConstructor($params, $entidades) {
        $query = "SELECT
  dpt.denominacion AS provincia,
  dn.denominacion AS constructor,
  dnfp.denominacion AS formapropiedad,
  eicpp.idmoneda,
  nm.codigoiso,
  sum(eicpp.valor) AS valor
FROM
  mod_planifinversiones.dat_etapinverconsprov eicp
  INNER JOIN mod_datosmaestros.nom_dpt dpt ON (eicp.iddpt = dpt.iddpt)
  INNER JOIN mod_planifinversiones.dat_constructor c ON (eicp.idconstructor = c.idconstructor)
  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (c.iddatosnomenclador = dn.iddatosnomenclador)
  LEFT OUTER JOIN mod_planifinversiones.dat_etapinverconsprovplan eicpp ON (eicp.idetapinverconsprov = eicpp.idetapinverconsprov)
  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (eicp.idetapainversion = ei.idetapainversion)
  INNER JOIN mod_planifinversiones.dat_inversion i ON (ei.idinversion = i.idinversion and i.eliminada = 0)
  INNER JOIN mod_planifinversiones.dat_formapropiedad fp on (fp.idformapropiedad = i.idformapropiedad)
  INNER JOIN mod_planificacion.nom_datosnomenclador dnfp ON (dnfp.iddatosnomenclador = fp.iddatosnomenclador)
  INNER JOIN mod_datosmaestros.nom_moneda nm on (nm.idmoneda = eicpp.idmoneda )
  LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = i.idestructuracomun
  LEFT JOIN mod_estructuracomp.dat_estructura e ON nfe.idfila = e.idestructura
  LEFT JOIN mod_estructuracomp.dat_estructura ep ON nfe.idpadre = ep.idestructura
WHERE i.idestadoinversion = 1 AND
  eicpp.idejercicio = {$params['idejercicio']}
  AND valor>0
  And i.idestructuracomun in($entidades)
  {$params['cadenaWHERE']}
GROUP BY
  dpt.denominacion,
  dn.denominacion,
  dnfp.denominacion,
  eicpp.idmoneda,
  nm.codigoiso
ORDER BY
  dn.denominacion,
  dpt.denominacion,
  dnfp.denominacion,
  nm.codigoiso";

  //print_r('Demanda por Constructor:---'.$query);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($query);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getMonedasReporteNAPorConstructor($params, $entidades) {
       /* $query = "SELECT
  distinct eicpp.idmoneda,
  nm.codigoiso
  FROM
  mod_planifinversiones.dat_etapinverconsprov eicp
  INNER JOIN mod_datosmaestros.nom_dpt dpt ON (eicp.iddpt = dpt.iddpt)
  INNER JOIN mod_planifinversiones.dat_constructor c ON (eicp.idconstructor = c.idconstructor)
  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (c.iddatosnomenclador = dn.iddatosnomenclador)
  LEFT OUTER JOIN mod_planifinversiones.dat_etapinverconsprovplan eicpp ON (eicp.idetapinverconsprov = eicpp.idetapinverconsprov)
  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (eicp.idetapainversion = ei.idetapainversion)
  INNER JOIN mod_planifinversiones.dat_inversion i ON (ei.idinversion = i.idinversion)
  INNER JOIN mod_planifinversiones.dat_formapropiedad fp on (fp.idformapropiedad = i.idformapropiedad)
  INNER JOIN mod_planificacion.nom_datosnomenclador dnfp ON (dnfp.iddatosnomenclador = fp.iddatosnomenclador)
  INNER JOIN mod_datosmaestros.nom_moneda nm on (nm.idmoneda = eicpp.idmoneda )
  LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = i.idestructuracomun
  LEFT JOIN mod_estructuracomp.dat_estructura e ON nfe.idfila = e.idestructura
  LEFT JOIN mod_estructuracomp.dat_estructura ep ON nfe.idpadre = ep.idestructura
WHERE i.idestadoinversion = 1 AND
  eicpp.idejercicio = {$params['idejercicio']}
  {$params['cadenaWHERE']}
ORDER BY
  nm.codigoiso";*/
        $query = "SELECT distinct eicpp.idmoneda,
       nm.codigoiso
FROM mod_planifinversiones.dat_etapinverconsprov eicp
     left OUTER JOIN mod_planifinversiones.dat_etapinverconsprovplan eicpp ON (
       eicp.idetapinverconsprov = eicpp.idetapinverconsprov)
     inner JOIN mod_planifinversiones.dat_etapainversion ei ON (
       eicp.idetapainversion = ei.idetapainversion)
     inner JOIN mod_planifinversiones.dat_inversion i ON (ei.idinversion =
       i.idinversion and i.eliminada = 0)
     inner JOIN mod_datosmaestros.nom_moneda nm on (nm.idmoneda = eicpp.idmoneda
       )
     inner JOIN mod_estructuracomp.dat_estructura ep ON i.idestructuracomun =
       ep.idestructura
WHERE i.idestadoinversion = 1 AND
      eicpp.idejercicio = {$params['idejercicio']} 
          and i.idestructuracomun in($entidades)
      {$params['cadenaWHERE']}
ORDER BY nm.codigoiso";
        //print_r($query);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($query);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function cargarIdEtapaInversion($idetapainv) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select  eiv.idetapainversion
                       from mod_planifinversiones.dat_etapainversion eiv 
                       INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                       INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov eicp on(eiv.idetapainversion = eicp.idetapainversion)
                       WHERE  eiv.idetapainversion =  " . $idetapainv . "";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function datNivelAct($param, $idsEstructura) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  i.denominacion as inversion,
                    e.denominacion as entidad,
                    (SELECT de.denominacion                     
                                    FROM mod_estructuracomp.nom_filaestruc f6 
                                     INNER JOIN mod_estructuracomp.dat_estructura de ON(de.idestructura = f6.idfila) 
                                     where f6.idfila <> f6.idpadre  AND f6.rgt -f6.lft <>1 
                                     and nfe.lft BETWEEN  f6.lft and f6.rgt
                                    ) as organismo,
                     dn.denominacion AS constructor,
                     dpt.denominacion AS provincia, 
                     eicpp.idmoneda, 
                      nm.codigoiso, 
                      dngo.denominacion AS grupoobra,
                      sum(eicpp.valor)::numeric(19,2) AS valor 
                    FROM 
                      mod_planifinversiones.dat_etapinverconsprov eicp 
                      INNER JOIN mod_datosmaestros.nom_dpt dpt ON (eicp.iddpt = dpt.iddpt) 
                      INNER JOIN mod_planifinversiones.dat_constructor c ON (eicp.idconstructor = c.idconstructor) 
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (c.iddatosnomenclador = dn.iddatosnomenclador ) 
                      LEFT OUTER JOIN mod_planifinversiones.dat_etapinverconsprovplan eicpp ON (eicp.idetapinverconsprov  = eicpp.idetapinverconsprov) 
                      INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (eicp.idetapainversion = ei.idetapainversion) 
                      INNER JOIN mod_planifinversiones.dat_inversion i ON (ei.idinversion = i.idinversion) 
                      INNER JOIN mod_datosmaestros.nom_moneda nm on (nm.idmoneda = eicpp.idmoneda ) 
                      LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON (nfe.idfila = i.idestructuracomun )
                      LEFT JOIN mod_estructuracomp.dat_estructura e ON (nfe.idfila = e.idestructura and e.idproyecto = 0)
                      INNER JOIN mod_planifinversiones.dat_grupoobra go on (go.idgrupoobra = i.idgrupoobra)
                      INNER JOIN mod_planificacion.nom_datosnomenclador dngo ON (dngo.iddatosnomenclador = go.iddatosnomenclador)
                    WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND
                     eicpp.idejercicio = {$param['idejercicio']}
                       AND eicpp.idmoneda = {$param['filtros'][8]['id'][0]}
                     AND valor > 0
                       AND i.idestructuracomun IN ({$idsEstructura})
                   
                   GROUP BY 
                    e.denominacion,
                      dpt.denominacion, 
                      dn.denominacion, 
                      eicpp.idmoneda, 
                      nm.codigoiso ,
                      nfe.lft,
  i.denominacion,dngo.denominacion
                    ORDER BY 
                     i.denominacion,
                        dn.denominacion,
                        dpt.denominacion,
                        organismo,
                        e.denominacion, dngo.denominacion
            
";
                       
                       //print_r('Niveles de actividad por constructor:---'.$sql);die;
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }
}
