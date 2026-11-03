<?php

class DatContratoModel extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function adicionarContrato($parametros){
        $contrato = DatContrato::adicionarContrato($parametros);
        DatSolicitud711::ActualizarFFSol($parametros['idsolicitud711']);
        foreach ($parametros['accionescontrato'] as $value) {
            $accionenconrtato= $value;
            $formapagolista= null;
            $cubicajelista= null;
            foreach ($parametros['formapagolista'] as $value2){
                if($value[0]==$value2[0][0]){
                    $formapagolista = $value2[1];
                }
            }
            foreach ($parametros['cubicajelista'] as $value3){
                if($value[0]==$value3[0][0]){
                    $cubicajelista = $value3[1];
                }
            }
            $embarquesacciones = DatEmbarque::adicionarEmbarqueAccion($contrato->idcontrato, $accionenconrtato, $formapagolista, $cubicajelista);
            if($value[7]!='Fletescero'){
                $addfuentessol = DatSolicitud711::AdicionarFuenteSol($accionenconrtato[3], $parametros['idsolicitud711'], $accionenconrtato[5], $contrato->idcontrato);
            }
        }
        return 1;
    }    
    
    public function modificarContrato($parametros){
        $contrato = DatContrato::modificarContrato($parametros);
        DatEmbarque::eliminarFormaPagos($parametros['idcontrato']);
        DatEmbarque::eliminarCubicajes($parametros['idcontrato']);
        DatEmbarque::eliminarAccionEmbargues($parametros['idcontrato']);
        
        foreach ($parametros['accionescontrato'] as $value) {
            $accionenconrtato= $value;
            $formapagolista= null;
            $cubicajelista= null;
            foreach ($parametros['formapagolista'] as $value2){
                if($value[0]==$value2[0][0]){
                    $formapagolista = $value2[1];
                }
            }
            foreach ($parametros['cubicajelista'] as $value3){
                if($value[0]==$value3[0][0]){
                    $cubicajelista = $value3[1];
                }
            }
            $embarquesacciones = DatEmbarque::adicionarEmbarqueAccion($parametros['idcontrato'], $accionenconrtato, $formapagolista, $cubicajelista);
            if($value[7]!='Fletescero'){
                $addfuentessol = DatSolicitud711::AdicionarFuenteSol($accionenconrtato[3], $parametros['idsolicitud711'], $accionenconrtato[5], $parametros['idcontrato']);
            }
        }
        return 1;
    }    
    
    public function listarContrato($parametros) {
        $result= DatContrato::listarContrato($parametros);
        return $result;
    }
    
    public function listarContratoPlanEntidad($parametros) {
        $result= DatContrato::listarContratoPlanEntidad($parametros);
        return $result;
    }
    
    public function listarAccionesEmbarquesCt($parametros) {
        $result= DatContrato::listarAccionesEmbarquesCt($parametros);
        return $result;
    }
    
    public function listarCtEmbFormaPago($parametros) {
        $result= DatContrato::listarCtEmbFormaPago($parametros);
        return $result;
    }
    
    public function listarCtEmbFormaPagoTodo($parametros) {
        $result= DatContrato::listarCtEmbFormaPagoTodo($parametros);
        return $result;
    }
    
    public function listarDetallesEmbarq($parametros) {
        $result= DatContrato::listarDetallesEmbarq($parametros);
        return $result;
    }
    
    public function listarDetallesEmbarqTodo($parametros) {
        $result= DatContrato::listarDetallesEmbarqTodo($parametros);
        return $result;
    }
    
    public function SalvarFechas($parametros) {
        if($parametros['tipo']==1){
            $result= DatContrato::ActualizarFechaAcciones($parametros);
        }
        if($parametros['tipo']==2){
            $result= DatContrato::ActualizarFechaFormaPago($parametros);
        }
        return $result;
    }
    
    public function EliminarCT($parametros) {
        $result= DatContrato::EliminarCT($parametros);
        return $result;
    }
}