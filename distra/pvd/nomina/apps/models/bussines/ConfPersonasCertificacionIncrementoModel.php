<?php

class ConfPersonasCertificacionIncrementoModel extends ZendExt_Model
{

    public function ConfPersonasCertificacionIncrementoModel()
    {
        parent::ZendExt_Model();
    }

    public function addPersonasCertificacionInc($arregloDatos)
    {
     //   print_r($arregloDatos);die;

        if ($arregloDatos != null)
        {
            foreach ($arregloDatos as $i => $valor)
            {
                $idpersona = $valor->idpersona;
                $idestructura = $valor->idestructura;
                $contador = ConfPersonasCertificacionIncremento::existePersona($idpersona,$idestructura);
                if($contador[0]['count'] == 0)
                {
                    $antiguedadentidad = ConfPersonasCertificacionIncremento::getAntigEntidadxPersona($valor->idestructura , $valor->idpersona );

                    $obj = new ConfPersonasCertificacionIncremento();
                    $obj->idpersona = $valor->idpersona;
                    $obj->annosserventidadincremental = $antiguedadentidad[0]['annos'];
                    $obj->mesesserventidadincremental = $antiguedadentidad[0]['meses'];
                    $obj->idestructura = $valor->idestructura;
                    $obj->incremento = 0.0;
                    $obj->save();
                }

            }
        }

    }
    public function getPersonasCertificacionInc($identidad)
    {
        $arrayPersonas = ConfPersonasCertificacionIncremento::getPersonasxEntidad($identidad);
        $arrayDatos = array();
        $cont = 0;
        $ioc = ZendExt_IoC_Inter::getInstance();

        foreach ($arrayPersonas as $i => $valor)
        {
            $datospersona = $ioc->pvd->getPrincipalesDatosPersona(array($valor['idpersona']),null,null,null,null,null);
            $datoscargos = DatCargosOcupados::obtenerListadoCargosOcupadosActual($valor['idpersona'],$valor['idestructura'], $inicio = 0, $limite = 15) ;
            $arrayDatos[$cont]['idpersonacertificacionincremento'] = $valor['idpersonacertificacionincremento'];
            $arrayDatos[$cont]['idpersona'] = $valor['idpersona'] ;
            $arrayDatos[$cont]['nombreplantilla'] = $valor['nombreplantilla'] ;
            $arrayDatos[$cont]['nombreapellidos']= $datospersona->data[0]['nombre'].' '.$datospersona->data[0]['snombre'].' '.$datospersona->data[0]['papel'].' '.$datospersona->data[0]['sapel'];
            $arrayDatos[$cont]['numid']= $datospersona->data[0]['numid'];
            $arrayDatos[$cont]['idestructura']=$valor['idestructura'];
            $arrayDatos[$cont]['idcargo']= $datoscargos[0]['idcargo'];
            $arrayDatos[$cont]['incremento']= $valor['incremento'] ;
            $arrayDatos[$cont]['fecha']= $valor['fecha'];
            $cont++;
        }
        return $arrayDatos;
    }

    public function getPersonaIncCero($identidad)
    {
        $arrayPersonas = ConfPersonasCertificacionIncremento::getPersonaIncCero($identidad);

        return $arrayPersonas;
    }

    public function deletePersonasCertificacionInc($arrayid)
    {
        foreach ($arrayid as $i => $valor) {
            $obj = Doctrine::getTable('ConfPersonasCertificacionIncremento')->find($valor->idtablacertincremento);
            $obj->delete();
        }
    }

    public function updatePersonasCertificacionInc($arrayid)
    {
        foreach ($arrayid as $i => $valor) {
            $obj = Doctrine::getTable('ConfPersonasCertificacionIncremento')->find($valor->idtabla);
            $obj->incremento = $valor->incremento;
            $obj->save();
        }
    }

    public function updateAntiguedadEntidadxPersona($datos,$annosEntidad,$mesesEntidad)
    {
        $incremento = $datos[0]['incremento'];


        //Cuando el incremento sea 0
        if($incremento == 0 || $incremento ==0.0)
        {
            $obj = Doctrine::getTable('ConfPersonasCertificacionIncremento')->find($datos[0]['idtabla']);
            $obj->annosserventidadincremental = $annosEntidad;
            $obj->mesesserventidadincremental = $mesesEntidad;
            $obj->save();
        }
        else {

            //Cuando el incremento sea 1.5
            if ($incremento == 1.5) {
                if ($mesesEntidad != 0 && $annosEntidad != 0) {
                    $mesincremental = $mesesEntidad * $incremento;
                    if ($mesincremental > 11) {
                        $mesincremental = $mesincremental - 12;
                        $añoincremental = $annosEntidad + 1;
                    } else {
                        $añoincremental = $annosEntidad;
                    }
                } else if ($mesesEntidad == 0 && $annosEntidad != 0) {
                    $añoincrementalaux = explode('.', ($annosEntidad * $incremento));

                    $añoincremental = $añoincrementalaux[0];
                    if ($añoincrementalaux[1] == 5)
                        $mesincremental = 6;
                    else $mesincremental = $mesesEntidad;
                } else if ($mesesEntidad != 0 && $annosEntidad == 0) {
                    $mesincremental = $mesesEntidad * $incremento;
                    if ($mesincremental > 11) {
                        $mesincremental = $mesincremental - 12;
                        $añoincremental = $annosEntidad + 1;
                    } else {
                        $añoincremental = $annosEntidad;
                    }

                } else if ($mesesEntidad == 0 && $annosEntidad == 0) {
                    $añoincremental = $annosEntidad;
                    $mesincremental = $mesesEntidad;
                }
            } //Cuando el incremento sea 2
            else if ($incremento == 2) {
                if ($mesesEntidad != 0 && $annosEntidad != 0) {
                    $mesincremental = $mesesEntidad * $incremento;
                    if ($mesincremental > 11) {
                        $mesincremental = $mesincremental - 12;
                        $añoincremental = ($annosEntidad * 2) + 1;
                    } else {
                        $añoincremental = $annosEntidad * 2;
                    }
                } else if ($mesesEntidad == 0 && $annosEntidad != 0) {
                    $añoincremental = $annosEntidad * $incremento;
                    $mesincremental = $mesesEntidad;
                } else if ($mesesEntidad != 0 && $annosEntidad == 0) {
                    $mesincremental = $mesesEntidad * $incremento;
                    if ($mesincremental > 11) {
                        $mesincremental = $mesincremental - 12;
                        $añoincremental = $annosEntidad + 1;
                    } else {
                        $añoincremental = $annosEntidad;
                    }

                } else if ($mesesEntidad == 0 && $annosEntidad == 0) {
                    $añoincremental = $annosEntidad;
                    $mesincremental = $mesesEntidad;
                }
            }
            $obj = Doctrine::getTable('ConfPersonasCertificacionIncremento')->find($datos[0]['idtabla']);
            $obj->annosserventidadincremental = $añoincremental;
            $obj->mesesserventidadincremental = $mesincremental;
            $obj->save();
        }
    }

    public function calcularAntiguedadPersonaInc($arrayid)
    {

        foreach( $arrayid as $i => $valor )
        {
            $antiguedad = ConfPersonasCertificacionIncremento::getAntiguedadxId($valor->idtabla);

            $annosold = $antiguedad[0]['annosservc'];
            $mesold = $antiguedad[0]['mesesservicio'];
            $annos = $antiguedad[0]['annos'];
            $meses = $antiguedad[0]['meses'];
            $idcertificacionannoservc = $antiguedad[0]['idtablacert'];

            //CALCULANDO antiguedad general
            $antiguedadAnno = $annosold + $annos;
            $antiguedadMes = $mesold + $meses;

            if ($antiguedadMes > 11) {
                $antiguedadMes = $antiguedadMes - 12;
                $antiguedadAnno += 1;
            }
            $antiguedadGeneral = $antiguedadAnno . ',' . $antiguedadMes;


           // $obj = Doctrine::getTable('ConfCertificacionAnnoServic')->find($antiguedad[0]['idtablacert']);
          //  Doctrine::getTable('ConfCertificacionAnnoServic')->find($idcertificacionannoservc);

            $obj = Doctrine::getTable('ConfCertificacionAnnoServic')->find($idcertificacionannoservc);
           // print_r($obj);die;
          // print_r($idcertificacionannoservc);die;
            $obj->antuguedad = $antiguedadGeneral;
            $obj->annosserventidadincremental = $annos;
            $obj->mesesserventidadincremental = $meses;
            $obj->save();

        }

    }
}
