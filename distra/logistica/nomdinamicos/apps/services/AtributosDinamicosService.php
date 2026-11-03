<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AtributosDinamicosService
 *
 * @author Gerardo
 */
class AtributosDinamicosService extends ZendExt_Model {
    
    public function getJSAtributosDinamicos(){
        return '
        <script type="text/javascript" src="/configuracion/comun/views/js/validator.js"></script>
        <script type="text/javascript" src="/configuracion/nomdinamicos/views/js/atributosdinamicos/gridAtribDinamicos.component.js"></script>
        <script type="text/javascript" src="/configuracion/nomdinamicos/views/js/atributosdinamicos/propertyGridAtribDinamicos.component.js"></script>
        ';
    }


    public function getNomencladoresDinamicos(){
        $atribDinamModel = new AtributosDinamicosModel();
        return $atribDinamModel->GetTablasNomencladores();
    }

    public function getDatosFromNomencladorDinamico($idtabla){
        $atribDinamModel = new AtributosDinamicosModel();
        $datos = Array();

        if(strlen ($idtabla) > 0) {
            $config = $atribDinamModel->metadataModel->obtenerInfoTabla ($idtabla);
            $temp_alias = $config->ar_select;
            if($config) {
                $datos = $config->get ()->result_array ();
                $datos_new = array();
                foreach($datos as $pos => $dat){
                    $i = 0;
                    foreach($dat as $index => $d){
                        $temppos = substr($temp_alias[$i], strrpos($temp_alias[$i], ' as ') + 4);
                        if(strpos($temppos, 'denominacion')){
                            $datos_new[$pos]['denominacion'] = $datos[$pos][$index];
                        }
                        unset($datos[$pos][$index]);
                        $i++;
                    }
                }
            }
        }
        return $datos_new;
    }

    public function getDatosFromNomencladoresDinamicos($arridtablas){
        $atribDinamModel = new AtributosDinamicosModel();
        $obj = null;
        foreach($arridtablas as $i => $idtabla){

            $datos = Array();

            if(strlen ($idtabla) > 0) {
                $obj[$idtabla] = Array();
                $config = $atribDinamModel->metadataModel->obtenerInfoTabla ($idtabla);
                $temp_alias = $config->ar_select;
                if($config) {
                    $datos = $config->get ()->result_array ();
                    $datos_new = array();
                    foreach($datos as $pos => $dat){
                        $i = 0;
                        foreach($dat as $index => $d){
                            $temppos = substr($temp_alias[$i], strrpos($temp_alias[$i], ' as ') + 4);
                            if(strpos($temppos, 'denominacion')){
                                $datos_new[$pos]['denominacion'] = $datos[$pos][$index];
                            }
                            if(strpos($temppos, 'id')){
                                $datos_new[$pos]['id'] = $datos[$pos][$index];
                            }
                            unset($datos[$pos][$index]);
                            $i++;
                        }
                    }
                }
                $obj[$idtabla] = $datos_new;
            }
        }
        return $obj;
    }
}
