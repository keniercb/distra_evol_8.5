<?php

class LecturamedidorValidator
{

    public $comun;

    public function LecturamedidorValidator()
    {
        $this->comun = new ComunModel();
    }

    public function validarlecturamedidor()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;
        $subsistema = $global->Subsistema->idsubsistema;
        $documento = $this->comun->devuelveIddocByidestructura('LecturaMedidorLog', $idestructura, $subsistema);
        if (!$documento->iddoc) {
            throw new ZendExt_Exception('LOG0031');
        }
        $parametros['idestructura'] = $global->Estructura->idestructura;
        $parametros['idservicio'] = false;
        $datos = ConfFacturacionService::getServiciosporConfproductosMedidor($parametros);
        //   print_r($datos);die; 	
        if ($datos['cantidad'] == 0) {
            throw new ZendExt_Exception('LOGFACL0001');
        }
        return true;
    }

    public function validardocentidad()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;
        $subsistema = $global->Subsistema->idsubsistema;
        $invp = $this->comun->devuelveIddocByidestructura('LecturaMedidorLog', $idestructura, $subsistema);
        if (!$invp->iddoc) {
            return false;
        }
        return true;
    }
}

?>
