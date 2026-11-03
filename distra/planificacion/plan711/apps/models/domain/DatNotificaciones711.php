<?php

class DatNotificaciones711 extends BaseDatNotificaciones711 {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function listarNotificacion($parametros){

        $conn = Doctrine_Manager::connection();
        $addWhere = "where ";
        if($parametros['tiponotificacion']==1){
            $addWhere .= " dat_notificaciones711.idestadoaprobacion is not null";
            if($parametros['idnomenclador']){
                $addWhere .= " and dat_notificaciones711.idestadoaprobacion = {$parametros['idnomenclador']}";
            }
        }
        if($parametros['tiponotificacion']==2){
            $addWhere .= " dat_notificaciones711.idsituacionpedido is not null";
            if($parametros['idnomenclador']){
                $addWhere .= " and dat_notificaciones711.idsituacionpedido = {$parametros['idnomenclador']}";
            }
        }
        if($parametros['paraconsolidacion']){
            $addWhere .= " and paraconsolidacion = {$parametros['paraconsolidacion']}";
        }
        if($parametros['idtipoplan']){
            $addWhere .= " and idtipoplan = {$parametros['idtipoplan']}";
        }
        if($parametros['idcc']){
            $addWhere .= " and idconceptocompra = {$parametros['idcc']}";
        }
        if($parametros['idrol']){
            $addWhere .= " and dat_notificaciones711.idrol = {$parametros['idrol']}";
        }
        
        $sql = "SELECT idnotificaciones711, 
                idtipoplan, 
                tp.denominacion as tipoplan,
                idestadoaprobacion,
                eap.denominacion as estadoaprobacion, 
                idsituacionpedido,
                sp.denominacion as situacionpedido, 
                idconceptocompra,
                cc.denominacion as conceptocompra,  
                dat_notificaciones711.listaidrol, 
                dat_notificaciones711.listaroles, 
                textonotificacion,
                paraconsolidacion
          FROM mod_plan711.dat_notificaciones711 
           left JOIN mod_planificacion.nom_datosnomenclador tp ON (mod_plan711.dat_notificaciones711.idtipoplan = tp.iddatosnomenclador)
           left JOIN mod_planificacion.nom_datosnomenclador eap ON (mod_plan711.dat_notificaciones711.idestadoaprobacion = eap.iddatosnomenclador)
           left JOIN mod_planificacion.nom_datosnomenclador sp ON (mod_plan711.dat_notificaciones711.idsituacionpedido = sp.iddatosnomenclador)	
           left JOIN mod_planificacion.nom_datosnomenclador cc ON (mod_plan711.dat_notificaciones711.idconceptocompra = cc.iddatosnomenclador)
           -- left JOIN mod_seguridad.seg_rol r ON (mod_plan711.dat_notificaciones711.idrol = r.idrol)
           $addWhere";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

      
}