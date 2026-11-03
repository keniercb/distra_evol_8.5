<?php
class ConfVarAuxSNC225Model extends ZendExt_Model {

    public function ConfVarAuxSNC225Model() {
        parent::ZendExt_Model();
    }
	
    public function adicionarConfVariablesAux($idregistsalartiempservc, $idvariablesconfreportescertificaciones,$anotaciones) {

        $objDomain = new ConfVarAuxSNC225();
        $objDomain->idregistsalartiempservc = $idregistsalartiempservc;
        $objDomain->idvariablesconfreportescertificaciones = $idvariablesconfreportescertificaciones;
        $objDomain->anotaciones = $anotaciones;
        $objDomain->save();
        return 'ok';
    }

    public function eliminarConfVariablesAux($idvariableregistsalartiempservc) {

        $objDomain = new ConfVarAuxSNC225();
        $objDomainDelete = $objDomain->obtenerConfVarAuxSNC225($idvariableregistsalartiempservc);
        $objDomainDelete->delete();
        return 'ok';
    }

    public function obtenerConfVariableAuxiliar($idregistsalartiempservc){
        $contador = 0;
        $arrayfinal = array();
        $objDomain = new ConfVarAuxSNC225();
        $objDomainVarReporte = new ConfVariablesReportesCertificaciones();
        $objDomainConReporte = new ConfReportesCertificaciones();
        $arrayelementos = $objDomain->obtenerConfVariableAuxiliar($idregistsalartiempservc);
        foreach($arrayelementos as $i=>$value){
            //Datos de la variable
            $datosvariables = $objDomainVarReporte->devDatosPorIdVariable($value['idvariablesconfreportescertificaciones']);
            $denominacionvariable = $datosvariables[0]['denominacion'];
            $denomconfreporte = $objDomainConReporte->obtenerDenomReportesCertificacionesdadoxId($datosvariables[0]['idconfreportescertificaciones']);
            $arrayfinal[$contador]['idvblesgblesregsaltmpserv'] = $value['idvblesgblesregsaltmpserv'];
            $arrayfinal[$contador]['idregistsalartiempservc'] = $value['idregistsalartiempservc'];
            $arrayfinal[$contador]['idvariablesconfreportescertificaciones'] = $value['idvariablesconfreportescertificaciones'];
            $arrayfinal[$contador]['denomvariable'] = $denominacionvariable;
            $arrayfinal[$contador]['idconfreportescertificaciones'] = $datosvariables[0]['idconfreportescertificaciones'];
            $arrayfinal[$contador]['denomconfreporte'] = $denomconfreporte;
            $arrayfinal[$contador]['anotaciones'] = $value['anotaciones'];;
            $contador++;
        }
        return $arrayfinal;
    }

}
