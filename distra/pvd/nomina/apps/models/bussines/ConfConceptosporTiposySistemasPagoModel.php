<?php
class ConfConceptosporTiposySistemasPagoModel extends ZendExt_Model {

    public function ConfConceptosporTiposySistemasPagoModel() {
        parent::ZendExt_Model();
    }

    private function ExisteEnArreglo($valorbuscar, $campobuscar, $arr){
		foreach($arr as $k => $v){
			if($v[$campobuscar] == $valorbuscar) return true;
		}
		return false;
	}
	
	public static function existeConfConceptosporTiposySistemasPago($idconceptopercepciondescuento, $idtipopago, $identidad, $idsistemapago) {
	    $obj = new ConfConceptosporTiposySistemasPago();
		$cant = $obj->existeConfConceptosporTiposySistemasPago($idconceptopercepciondescuento, $idtipopago, $identidad, $idsistemapago);
		
		return $cant; 
    }

    public function adicionarConfConceptosporTiposySistemas($arregloDatos) {
		
		$mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
		
        $obj = new ConfConceptosporTiposySistemasPago();
        $arrExistentes = $obj->obtenerExistentes($arregloDatos['identidad'], $arregloDatos['idtipopago'], $arregloDatos['idsistemapago'], $arregloDatos['sedesglosa'], $arregloDatos['conceptos']);
      
		foreach ($arregloDatos['conceptos'] as $i => $v) {
			if(!$this->ExisteEnArreglo($v, 'idconceptopercepciondescuento', $arrExistentes)){
				
				$objI = new ConfConceptosporTiposySistemasPago();
				
				$objI->identidad = $arregloDatos['identidad'];
				$objI->idtipopago = $arregloDatos['idtipopago'];
				$objI->idsistemapago = $arregloDatos['idsistemapago'];
				$objI->idconceptopercepciondescuento = $v;
				$objI->save();
            //nuevo
                $idconfconceptosportiposysistemaspago = $objI->idconfconceptosportiposysistemaspago;
			}
			
		}
		//print_r($arregloDatos);die;
        
        $conn->commit();
       // return true;
        return $idconfconceptosportiposysistemaspago;
    }

    public function eliminarConfConceptosporTiposySistemas($id) {

	  	//Eliminando los datos de la configuracion
		$objConfConceptospdFormasySistemasPago = new ConfConceptospdFormasySistemasPago();
        $idconf = $objConfConceptospdFormasySistemasPago->obtenerIdConfconceptospdFormasySistemasPago($id);	
		$objDelete = $objConfConceptospdFormasySistemasPago->obtenerObjConfconceptospdFormasySistemasPago($idconf);
		
		//Eliminando los datos de las variables auxiales
		$objDatVarAuxConceptospdFormasySistemasPago = new DatVarAuxConceptospdFormasySistemasPago();
		$iddatvar = $objDatVarAuxConceptospdFormasySistemasPago->obtenerIdDatVarAuxConceptospdFormasySistemasPago($idconf);
		$objDelDatVar = $objDatVarAuxConceptospdFormasySistemasPago->obtenerDatVarAuxConceptospdFormasySistemasPago($iddatvar);
		
		if($objDelDatVar != null){
		$objDelDatVar->delete();
		}
		if($objDelete != null){
		$objDelete->delete();
		}

        if ($id) {
            //Eliminando el concepto de percepcion y descuento
            $obj = Doctrine::getTable('ConfConceptosporTiposySistemasPago')->find($id);
            if ($obj) {
                $obj->delete();
            }


        }
		
		
    }

    public function dameIdConceptopd($idconfconceptosportiposysistemaspago)
    {
        //Eliminando el concepto de percepcion y descuento
        $obj = Doctrine::getTable('ConfConceptosporTiposySistemasPago')->find($idconfconceptosportiposysistemaspago);

        return $obj->idconceptopercepciondescuento;
    }


    public function dameIdidconfconceptosportiposysistemaspago($identidad, $idtipopago, $idconceptopercepciondescuento)
    {
        $obj = new ConfConceptosporTiposySistemasPago();
        return $obj->dameIdidconfconceptosportiposysistemaspago($identidad, $idtipopago, $idconceptopercepciondescuento);
    }

//    public function replicardatos($idConcepto, $idtipopago, $rid, $idsistemapago,$sedesglosa) {
//
//        //eliminando conceptos si exiten
//        $cantidad = $this->existeConfConceptosporTiposySistemasPago($idConcepto['idconceptopercepciondescuento'], $idtipopago, $rid, $idsistemapago);
//        if($cantidad == "existe"){
//            $obj = new ConfConceptosporTiposySistemasPago();
//            $concepto = $obj->dadoId($idConcepto['idconceptopercepciondescuento'], $idtipopago, $rid, $idsistemapago);
//            $this->eliminarConfConceptosporTiposySistemas($concepto[0]['idconfconceptosportiposysistemaspago']);
//        }
//
//        //adicionando concepto
//        $variables = ConfConceptospdFormasySistemasPagoModel::existenvariables($idConcepto['id']);
//
//       // print_r($variables);die;
//        //Creando una nueva formula con los mismos elementos pero con diferente id
//        $nuevoidformula = ConfConceptospdFormasySistemasPagoModel::crearFormulaNueva($variables[0]['idexpresionmatematica']);
//
//        $arregloDatos['idperiodopago'] = $variables[0]['idperiodopago'];
//        $arregloDatos['idconfconceptosportiposysistemaspago']= $variables[0]['idconfconceptospdformasysistemaspago'];
//        $arregloDatos['formacalculo']= $variables[0]['formacalculo'];
//        $arregloDatos['idexpresionmatematica']= $nuevoidformula;
//        $arregloDatos['lugaresdecimales']= $variables[0]['lugaresdecimales'];
//
//        $objM = new ConfConceptospdFormasySistemasPagoModel();
//        $o = $objM->adicionarConfConceptospdFormasySistemas($arregloDatos);
//
//        $vaux = ConfConceptospdFormasySistemasPagoModel::existenvariablesaux($variables[0]['idconfconceptospdformasysistemaspago']);
//
//        $arrayidvarauxviejas = array();
//        $arrayidvarauxnuevas = array();
//        if (count($vaux) > 0) {
//            foreach ($vaux as $kvaux => $vvaux) {
//                $var['idconfconceptospdformasysistemaspago'] = $o->idconfconceptospdformasysistemaspago;
//                $var['denominacion'] = $vvaux['denominacion'];
//                $var['formaentrada'] = $vvaux['formaentrada'];
//                $var['idconfreportescertificaciones'] = $vvaux['idconfreportescertificaciones'];
//                $var['idvariablesconfreportescertificaciones'] = $vvaux['idvariablesconfreportescertificaciones'];
//                $var['lugaresdecimalesvariable'] = $vvaux['lugaresdecimalesvariable'];
//                $objModel = new DatVariablesAuxConceptospdFormasySistemasPagoModel();
//                $idvariableauxconceptospdformasysistemaspago = $objModel->adicionarDatVariablesAuxConceptospdFormasySistemasPago($var);
//                //Llenando los arreglos de variables nuevas y viejas
//                $arrayidvarauxviejas[] = $vvaux['idvariableauxconceptospdformasysistemaspago'];
//                $arrayidvarauxnuevas[] = $idvariableauxconceptospdformasysistemaspago;
//            }
//
//            //Cambiando las variables auxiliares en la expresion a calcular de la formula nueva en dat_expresionmatematica
//            $objFormulaNueva = DatExpresionMatematicaNomina::Buscar($nuevoidformula);
//            $arrElementos = DatElementoExpresionMatematicaNomina::obtenerElementosFormula($nuevoidformula);
//
//            foreach ($arrayidvarauxnuevas as $n => $varnueva) {
//                $expresionacalcular = str_ireplace('IVASP_' . $arrayidvarauxviejas[$n], 'IVASP_' . $varnueva, $objFormulaNueva->expresionacalcular . '');
//                $objFormulaNueva->expresionacalcular = $expresionacalcular;
//
//                //Cambiando los elementos en dat_elementoexpresionmatematica
//                foreach ($arrElementos as $e => $elemento) {
//                    if ($elemento['idindicador'] == 'VASP_' . $arrayidvarauxviejas[$n]) {
//                        $objElemento = DatElementoExpresionMatematicaNomina::Buscar($elemento['idelementoexpresionmatematica']);
//                        $objElemento->elemento = 'IVASP_' . $varnueva;
//                        $objElemento->idindicador = 'VASP_' . $varnueva;
//                        $objElemento->save();
//                    }
//                }
//            }
//            $objFormulaNueva->save();
//        }
//
//
//        $objI = new ConfConceptosporTiposySistemasPago();
//        $objI->identidad = $rid;
//        $objI->idtipopago = $idtipopago;
//        $objI->idsistemapago = $idsistemapago;
//        $objI->idconceptopercepciondescuento = $idConcepto['idconceptopercepciondescuento'];
//        $objI->save();
//        //nuevo
//        $idconfconceptosportiposysistemaspago = $objI->idconfconceptosportiposysistemaspago;
//
//	  	return true;
//
//
//    }

}
