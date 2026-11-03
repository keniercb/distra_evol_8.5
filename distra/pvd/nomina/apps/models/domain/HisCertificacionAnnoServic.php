<?php

class HisCertificacionAnnoServic extends BaseHisCertificacionAnnoServic {

    public static function obtenerAnnoservcdadoidpersona($idpersona,$identidad) {


        return Doctrine_Query::create()
            ->from('HisCertificacionAnnoServic his')
            ->where('his.idpersona =? and his.identidad = ?',array($idpersona,$identidad) )
            ->fetchArray();
    }

    public static function obtenerHisPersonasCertificadas($identidad,$fecha){

        if($fecha != null)
        {
            $sql = "select * from mod_nomina.his_certificacionannoservc his where his.identidad = $identidad and his.fecha =  ''' $fecha'''";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return $r;
        }

    }

    public static function obtenerPeriodos($identidad){

       /* return Doctrine_Query::create()
            ->distinct('fecha')
            ->from('HisCertificacionAnnoServic his')
            ->where('his.identidad = ?',array($identidad) )
            ->orderBy('fecha DESC')
            ->fetchArray();*/

        $sql = "select distinct(fecha) from mod_nomina.his_certificacionannoservc where identidad = $identidad group by fecha order by fecha desc";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }
}
