<?php

class HisRetencionesPersonaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function HisRetencionesPersonaModel() {
        parent::ZendExt_Model();
    }
	
	private function calcularMensualidad($objRet, $modoRetener = 1){
		if($modoRetener == 2){
			if($objRet->retencionpendiente != -1){
				$retencionpendiente = $objRet->retencionpendiente;
			}else{
				$retencionpendiente = 0.00;
			}	
		}else if($modoRetener == 1){
			$retencionpendiente = 0.00;
		}else {
			return 0.00;
		}
		
		if($objRet->saldolimite == 2){
			return $objRet->mensualidad + $retencionpendiente;
		}else{
			$saldoA = ($objRet->saldodeladeudo == -1)?0.00:$objRet->saldodeladeudo;
			$resta = $objRet->saldoinicial - $saldoA;
			
			if($resta > 0 && $objRet->saldodeladeudo!=0.00){
				if($objRet->ultmensualidad != ''){
                    if($objRet->saldodeladeudo == $objRet->ultmensualidad || $resta < $objRet->mensualidad) {
                        return $objRet->ultmensualidad;
                    }if($resta > $objRet->ultmensualidad){
						return $objRet->mensualidad + $retencionpendiente; 
					}else if($resta == $objRet->ultmensualidad){
						return $objRet->ultmensualidad + $retencionpendiente;
					}else if($resta > 0 && $resta < $objRet->ultmensualidad){
						return $resta + $retencionpendiente;
					}else return 0.00;
				}else{
					if($resta >= $objRet->mensualidad){
						return $objRet->mensualidad + $retencionpendiente;
					}else {
						return $resta + $retencionpendiente;
					}
				}
			}else{
				return 0.00;
			}
		}

	}
	
    public function Adicionar($idnomina, $arrValoresRetencionesPersona, $seCalcularonRetenciones){
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$conn->beginTransaction();
		
		foreach($arrValoresRetencionesPersona as $i => $p){
			foreach($p as $j => $r){
				foreach($r->comoretener as $k => $dco){
					if($seCalcularonRetenciones[$i][$k] != 2) {
                        $saldoAdeudo = ($r->saldodeladeudo == -1) ? 0.00 : $r->saldodeladeudo;
                        $resta = $r->saldoinicial - $saldoAdeudo;
                        $retenido = $this->calcularMensualidad($r, $dco);
                        if($retenido != 0.00){
                         if ($resta > 0 || $r->saldolimite == 2) {
                            $objHisRET = new HisRetencionesPersona();
                            $objHisRET->idretencionpersona = $r->idretencionpersona;
                            $objHisRET->idnomina = $idnomina;
                            $objHisRET->idcomprobanteacredita = null;
                            $objHisRET->idcomprobantependiente = null;
                            $objHisRET->retenido = $retenido;
                            if ($r->saldolimite == 1) {
                                //$objHisRET->saldodeladeudo = $resta - $objHisRET->retenido;
                                if ($r->saldodeladeudo != -1 && $saldoAdeudo < $r->mensualidad) {
                                    $objHisRET->saldodeladeudo = 0.00;
                                } else if ($r->saldodeladeudo != -1 && $saldoAdeudo > $r->mensualidad) {
                                    $objHisRET->saldodeladeudo = $saldoAdeudo - $r->mensualidad;
                                } else {
                                    $objHisRET->saldodeladeudo = $resta - $objHisRET->retenido;
                                }
                            } else {
                                $objHisRET->saldodeladeudo = $saldoAdeudo + $objHisRET->retenido;
                            }

                            $objHisRET->retencionpendiente = ($dco == -1) ? $this->calcularMensualidad($r, 1) : 0.00;
                            $saldodeladeudopendiente = ($objHisRET->saldodeladeudopendiente) ? $objHisRET->saldodeladeudopendiente : 0.00;
                            $objHisRET->saldodeladeudopendiente = ($dco == -1) ? $saldodeladeudopendiente + $objHisRET->retencionpendiente : $saldodeladeudopendiente;
                            $objHisRET->fechaoperacion = date('Y-m-d');
                            $objHisRET->fechacomprobantependiente = null;
                            $objHisRET->save();
                         }
                        }
					}
				}
			}
		}
		$conn->commit();
		return true; 
	}
	
}
