<?php


class GestionarcertificaciondeannosserviciosModel extends ZendExt_Model
{
    public function GestionarcertificaciondeannosserviciosModel()
    {
        parent::ZendExt_Model();
    }

    public function getPersonaentidad($identidad, $texto, $limit, $start)
    {
        $ioc = ZendExt_IoC_Inter::getInstance();
        $arrayPersonas = ConfCertificacionAnnoServic::getPersonaentidad($identidad, $texto, $limit, $start);

        foreach ($arrayPersonas as $keyp => $persona) {

            $arraannosservc = ConfCertificacionAnnoServic::obtenerAnnoservcdadoidpersona($persona['idpersona'], $persona['identidad']);
            $arrayPersonas[$keyp]['nombreapellidos'] = $persona['nombre'] . ' ' . $persona['papel'] . ' ' . $persona['sapel'];

            if (count($arraannosservc) > 0) {
                $antigEntidad = explode(',', $arraannosservc[0]['annosserventidad']);
                $antigGeneral = explode(',', $arraannosservc[0]['antuguedad']);

                $arrayPersonas[$keyp]['valor'] = $arraannosservc[0]['annosservc'];
                $arrayPersonas[$keyp]['fechacert'] = $persona['fechacert'];
                $arrayPersonas[$keyp]['annosserventidad'] = $antigEntidad[0] . ' años y ' . $antigEntidad[1] . ' meses';
                $arrayPersonas[$keyp]['mesesservicio'] = $arraannosservc[0]['mesesservicio'];
                $arrayPersonas[$keyp]['antuguedad'] = $antigGeneral[0] . ' años y ' . $antigGeneral[1] . ' meses';
                $arrayPersonas[$keyp]['cambiaescala'] = $arraannosservc[0]['cambiacategoria'];
                $arrayPersonas[$keyp]['reporteantiguedad'] = $arraannosservc[0]['reporteantiguedad'];

            } else {
                $arrayPersonas[$keyp]['valor'] = ' ';
                $arrayPersonas[$keyp]['annosserventidad'] = ' ';
                $arrayPersonas[$keyp]['mesesservicio'] = ' ';
                $arrayPersonas[$keyp]['antuguedad'] = ' ';
                $arrayPersonas[$keyp]['cambiaescala'] = '';
            }

        }

        return $arrayPersonas;
    }

    public function addAnnosservicios($datos)
    {
        if (count($datos) > 0) {
            foreach ($datos as $k => $v) {
                $arraannosservc = ConfCertificacionAnnoServic::obtenerAnnoservcdadoidpersona($v->idpersona, $v->identidad);
                if (count($arraannosservc) > 0) {
                    $objannosservic = ConfCertificacionAnnoServic::getByid($arraannosservc[0]['idcertificacionannoservc']);
                    $annosold = $v->valor;
                    $mesold = $v->mes;
                    $newfecha = $v->faltaentidad;
                    //Para saber si el formato de fecha es el que trae el calendario
                    $calendario = substr_count($newfecha, 'T');
                    if ($calendario == 0) {
                        $fecha = explode('/', $newfecha);
                        //convierto la fecha en el formato aa/mm/dd
                        $newfecha2 = $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0];
                        $fechafinal = $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0];
                        $datetime1 = new DateTime($newfecha2);
                        $datetime2 = new DateTime();
                        //encuentra la diferencia entre las dos fechas, lo da en : [y,m,d,h,m,s]
                        $intervalo = $datetime2->diff($datetime1);

                    } else {
                        //capturo ambas fecha la de alta a la entidad y la actual
                        $datetime1 = new DateTime($newfecha);
                        $datetime2 = new DateTime();
                        //encuentra la diferencia entre las dos fechas, lo da en : [y,m,d,h,m,s]
                        $intervalo = $datetime2->diff($datetime1);
                        $fechafinal = null;
                    }
                    //CALCULANDO antiguedad en la entidad
                    $antiguedadEntidad = $intervalo->y . ',' . $intervalo->m;
                    //CALCULANDO antiguedad general
                    $antiguedadAnno = $annosold + $intervalo->y;
                    $antiguedadMes = $mesold + $intervalo->m;
                    if ($antiguedadMes > 11) {
                        $antiguedadMes = $antiguedadMes - 12;
                        $antiguedadAnno += 1;
                    }
                    $antiguedadGeneral = $antiguedadAnno . ',' . $antiguedadMes;
                    $objannosservic->antuguedad = $antiguedadGeneral;
                    $objannosservic->annosserventidad = $antiguedadEntidad;
                    if ($fechafinal == null) {
                        $fechafinal = $newfecha;
                    }
                    $objannosservic->faltaentidad = $fechafinal;
                    $objannosservic->mesesservicio = $v->mes;
                    $objannosservic->annosservc = $v->valor;
                    $objannosservic->reporteantiguedad = ($v->reporteantiguedad == 1) ? true : false;
                    $objannosservic->save();
                } else {
                    if (is_numeric($v->mes) && is_numeric($v->valor)) {
                        $annosold = $v->valor;
                        $mesold = $v->mes;
                        //elimino los / de la fecha que viene con el formato dd/mm/aa
                        $newfecha = $v->faltaentidad;
                        //Para saber si el formato de fecha es el que trae el calendario
                        $calendario = substr_count($newfecha, 'T');
                        if ($calendario == 0) {
                            $fecha = explode('/', $newfecha);
                            //convierto la fecha en el formato aa/mm/dd
                            $newfecha2 = $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0];
                            $fechafinal = $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0];
                            $datetime1 = new DateTime($newfecha2);
                            $datetime2 = new DateTime();
                            //encuentra la diferencia entre las dos fechas, lo da en : [y,m,d,h,m,s]
                            $intervalo = $datetime2->diff($datetime1);
                        } else {
                            //capturo ambas fecha la de alta a la entidad y la actual
                            $datetime1 = new DateTime($newfecha);
                            $datetime2 = new DateTime();
                            //encuentra la diferencia entre las dos fechas, lo da en : [y,m,d,h,m,s]
                            $intervalo = $datetime2->diff($datetime1);
                            $fechafinal = null;
                        }
                        //CALCULANDO antiguedad en la entidad
                        $antiguedadEntidad = $intervalo->y . ',' . $intervalo->m;
                        //CALCULANDO antiguedad general
                        $antiguedadAnno = $annosold + $intervalo->y;
                        $antiguedadMes = $mesold + $intervalo->m;
                        $antiguedadGeneral = $antiguedadAnno . ',' . $antiguedadMes;
                        $objannosservic = new ConfCertificacionAnnoServic();
                        if ($fechafinal == null) {
                            $fechafinal = $newfecha;
                        }
                        $objannosservic->faltaentidad = $fechafinal;
                        $objannosservic->annosservc = $v->valor;
                        $objannosservic->idpersona = $v->idpersona;
                        $objannosservic->identidad = $v->identidad;
                        $objannosservic->mesesservicio = $v->mes;
                        $objannosservic->antuguedad = $antiguedadGeneral;
                        $objannosservic->annosserventidad = $antiguedadEntidad;
                        $objannosservic->annosserventidad = $antiguedadEntidad;
                        $objannosservic->reporteantiguedad = ($v->reporteantiguedad == 1) ? true : false;
                        $objannosservic->save();
                    }
                }
            }
        }
        return 'ok';
    }


    public function getCantidadPersonaentidad($identidad, $texto)
    {

        $sql = "select count(dp.idpersona)
        from mod_persona.dat_persona dp
        INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = $identidad)
         LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dco.idcargo)
         INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
         LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
         LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
         LEFT JOIN mod_nomina.conf_plantillanominalcargo plnc on(plnc.idcargo = dco.idcargo)
         LEFT JOIN mod_nomina.conf_plantillanominal pln on(pln.idplantillanominal = plnc.idplantillanominal)
         LEFT JOIN mod_nomina.conf_certificacionannoservc cer on(cer.idpersona = dp.idpersona and cer.identidad = $identidad)
         WHERE ((dp.feliminado) >= now() or dp.feliminado is null)
         and (dco.fechavencimiento >= now() or dco.fechavencimiento is null)";


        $sqltexto = " select count(dp.idpersona)
        from mod_persona.dat_persona dp
        INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = $identidad)
         LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dco.idcargo)
          INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
         LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
         LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
         LEFT JOIN mod_nomina.conf_plantillanominalcargo plnc on(plnc.idcargo = dco.idcargo)
         LEFT JOIN mod_nomina.conf_plantillanominal pln on(pln.idplantillanominal = plnc.idplantillanominal)
         LEFT JOIN mod_nomina.conf_certificacionannoservc cer on(cer.idpersona = dp.idpersona and cer.identidad = $identidad)
         WHERE ((dp.feliminado) >= now() or dp.feliminado is null)
         and (dco.fechavencimiento >= now() or dco.fechavencimiento is null)
         and dp.nombre ilike '%$texto%' or dp.snombre ilike '%$texto%' or dp.papel ilike '%$texto%' or dp.sapel ilike '%$texto%'";


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if (!empty($texto)) {
            $r = $conn->fetchAll($sqltexto);

            return $r[0]['count'];
        } else {

            $r = $conn->fetchAll($sql);
            return $r[0]['count'];
        }

    }

}