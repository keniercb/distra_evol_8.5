<?php 
class NomcausaController extends ZendExt_Controller_Secure 
{	
	function init()
	{	
		parent::init();	
	}

	function nomcausaAction()
	{
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
		$this->render();
	}

    function getcausasAction()
	{
        $obj = new NomCausaModel();

        if($this->_request->getPost ( 'criterio' )==-1)
        {
             if(!is_numeric($this->_request->getPost ( 'node' )))
             {
                 $arreglo = $obj->GetByLimit();
             }

            else
                $arreglo = $obj->GetByLimithijos($this->_request->getPost ( 'node' ));
            foreach($arreglo as $key => $val)
            {
                    $arreglo[$key]['id'] =$val['idcausa'];
                    $abrev = $val['abreviatura'];
                    $arreglo[$key]['uiProvider'] = 'col';
                    $arreglo[$key]['leaf'] = (empty($val['abreviatura']))?0:1;
                    $arreglo[$key]['descripcion'] =$val['descripcion'];
                    $arreglo[$key]['fdesde'] =$val['fdesde'];
                    $arreglo[$key]['fhasta'] =$val['fhasta'];
                    $arreglo[$key]['abreviatura'] =$val['abreviatura'];
                    $arreglo[$key]['tieneentradasalida'] =$val['tieneentradasalida'];
                    $arreglo[$key]['tieneperiodo'] =$val['tieneperiodo'];
                    $arreglo[$key]['descuenta'] =$val['descuenta'];
                    $arreglo[$key]['modifica'] =$val['modifica'];
                    $arreglo[$key]['cantincidencias'] =$val['cantincidencias'];
                    $arreglo[$key]['color'] =$val['color'];
            }
            echo (json_encode ($arreglo));
        }
        else
        {
            $criterio=$this->_request->getPost ( 'criterio' );
            $arreglo = $obj->GetByLimitFind($criterio);
            foreach($arreglo as $key => $val)
            {
                $arreglo[$key]['uiProvider'] = 'col';
                $hijos = $obj->getHijos($val['idcausa']);
                if(count($hijos) > 0){
                    $arreglo[$key]['leaf'] = 'false';
                }else{
                    $arreglo[$key]['leaf'] = 'true';
                }

            }
            echo (json_encode ($arreglo));
        }
		
	}

    function getconfcausasAction()
    {
        $obj = new NomCausaModel();
            if(!is_numeric($this->_request->getPost ( 'node' )))
            {
                $arreglo = $obj->GetByLimit();
            }
            else
                $arreglo = $obj->GetByLimithijos($this->_request->getPost ( 'node' ));
            foreach($arreglo as $key => $val)
            {
                $arreglo[$key]['uiProvider'] = 'col';
                $arreglo[$key]['id'] =$val['idcausa'];
                $hijos = $obj->getHijos($val['idcausa']);
                if(count($hijos) == 0){
                    $arreglo[$key]['leaf'] = 'true';
                    $arreglo[$key]['checked'] = 'true';
                }
            }
            echo (json_encode ($arreglo));
    }

    function getDenomCausaAction()
    {
        $obj = new NomCausaModel();
        $result=null;
        $nomcausas = $obj-> GetAll();
        if($nomcausas == null){
            $arreglo = ZendExt_IoC_Inter::getInstance()->persona->getNomCategoriasPadres();
            foreach($arreglo as $key => $val)
            {
                $result[$key]['id'] =$val['idcategoriapersona'];
                $result[$key]['text'] =$val['denominacion'];
                $result[$key]['leaf'] = true;
            }
            echo (json_encode ($result));
        }else{
            if(!is_numeric($this->_request->getPost ('node'))){
                $arreglo = $obj->GetByLimit();
            }
            else
                $arreglo = $obj->GetByLimithijos($this->_request->getPost ('node'));
            foreach($arreglo as $key => $val)
            {
                $arreglo[$key]['id'] =$val['idcausa'];
                $arreglo[$key]['text'] =$val['denominacion'];

                $hijos = $obj->getHijos($val['idcausa']);
                if(count($hijos) == 0){
                    $arreglo[$key]['leaf'] = 'true';
                }
            }
            echo (json_encode ($arreglo));
        }
    }

    function addcausasAction()
	{
        $model = new NomCausaModel();
        $arreglo= Zend_Json::decode(stripslashes($this->_getParam('array')));
        $existedenom = $model->Existe('denominacion',$this->_request->getPost ('denom'));
        if(count($existedenom) != 0)
        {
            $r['cod'] =5;
            echo (json_encode ($r));
        }
        else
        {
            $abrev = $this->_request->getPost('abrev');

            if(!empty($abrev))
            {
                $existeabrev = $model->Existe('abreviatura',$this->_request->getPost ('abrev'));
            }
            if(count($existeabrev) == 0)
            {
                try{
                if($arreglo != null){
                    foreach($arreglo as $val){
                        $obj = new NomCausa();
                        $obj->denominacion = $val['denominacion'];
                        $obj->idcategoria = $val['idcategoria'];
                        $obj->save();
                        if($val['idcategoria'] == $this->_request->getPost ('categ'))
                            $idpadre = $obj->idcausa;
                    }
                }
                $objcausa = new NomCausa();
                $objcausa->denominacion = $this->_request->getPost ('denom');
                $objcausa->idcategoria = $this->_request->getPost ('categ');

                if(!empty($abrev))
                {
                    $objcausa->descripcion = $this->_request->getPost ('descrip');
                    $objcausa->abreviatura = $this->_request->getPost ('abrev');
                    $objcausa->fdesde = $this->_request->getPost ('fechaini');
                    if($this->_request->getPost ('fechafin') == '')
                        $ff = null;
                    else
                        $ff = $this->_request->getPost ('fechafin');
                    $objcausa->fhasta = $ff;
                    $objcausa->color = '#'.$this->_request->getPost ('color');
                    $objcausa->tieneentradasalida = ($this->_request->getPost ('tieneentradasalida') == 'true')?1:0;
                    $objcausa->tieneperiodo = ($this->_request->getPost ('tieneperiodo') == 'true')?1:0;
                    $objcausa->descuenta = ($this->_request->getPost ('descuenta') == 'true')?1:0;
                    $objcausa->afectasalario = ($this->_request->getPost('afectasalario') == 'true') ? 1 : 0;
                    $objcausa->modifica = ($this->_request->getPost('modifica') == 'true') ? 1 : 0;
                    if(is_numeric($this->_request->getPost('cantincidencias')))
                        $objcausa->cantincidencias =$this->_request->getPost('cantincidencias');
                }
                if($arreglo != null){
                    $objcausa->idpadre = $idpadre;
                }else{
                    if(!is_numeric($this->_request->getPost ('idpadre')))
                        $objcausa->idpadre=null;
                    else{
                        $objcausa->idpadre=$this->_request->getPost ('idpadre');
                    }
                }
                   $objcausa->save();
                   $r['cod'] =1;
                   echo (json_encode ($r));
               }
               catch(Exception $e)
                {
                    $r['cod'] =3;
                    echo (json_encode ($r));
                }
            }
            else
            {
                $r['cod'] =6;
                echo (json_encode ($r));
            }
        }
	}

    function updcausasAction()
	{
        $model = new NomCausaModel();
        $cambiodenom = $this->_request->getPost ('cambiodenom');
        if($cambiodenom == 'true')
        {
            $existeDenom = $model->Existe('denominacion',$this->_request->getPost ('denom'));
        }
       $cambioabrev = $this->_request->getPost ('cambioabrev');
        if($cambioabrev == 'true')
        {
            $existeAbrev = $model->Existe('abreviatura',$this->_request->getPost ('abrev'));
        }
            if($cambiodenom == 'false' ||( $cambiodenom == 'true' && count($existeDenom) == 0))
            {
                if($cambioabrev == 'false' ||( $cambioabrev == 'true' && count($existeAbrev) == 0))
                {
                    try{
                        $obj = Doctrine::getTable('NomCausa')->find($this->_request->getPost('idcausa'));
                        $obj->denominacion = $this->_request->getPost ('denom');
                        $obj->descripcion = $this->_request->getPost ('descrip');
                        $obj->abreviatura = $this->_request->getPost ('abrev');
                        $obj->fdesde = $this->_request->getPost ('fechaini');
                        if($this->_request->getPost ('fechafin') == '')
                            $ff = null;
                        else
                            $ff = $this->_request->getPost ('fechafin');
                        $obj->fhasta = $ff;
                        $obj->color = '#'.$this->_request->getPost ('color');
                        $obj->tieneentradasalida = ($this->_request->getPost ('tieneentradasalida') == 'true')?1:0;
                        $obj->tieneperiodo = ($this->_request->getPost ('tieneperiodo') == 'true')?1:0;
                        $obj->descuenta = ($this->_request->getPost ('descuenta') == 'true')?1:0;
                        $obj->afectasalario = ($this->_request->getPost ('afectasalario') == 'true')?1:0;
                        $obj->modifica = ($this->_request->getPost ('modifica') == 'true')?1:0;
                        $obj->idpadre = $this->_request->getPost ('idpadre');
                        if(is_numeric($this->_request->getPost('cantincidencias')))
                            $obj->cantincidencias =$this->_request->getPost('cantincidencias');
                        $model->Actualizar($obj);
                        $r['cod'] =1;
                        echo (json_encode ($r));
                    }
                    catch(Exception $e)
                    {
                        $r['cod'] =3;
                        echo (json_encode ($r));
                    }
                }
                else
                {
                    $r['cod'] =6;
                    echo (json_encode ($r));
                }
            }
            else
            {
                $r['cod'] =5;
                echo (json_encode ($r));
            }
	}

    function delcausasAction()
	{
        $modeloNegocio = new NomCausaModel();
        if($this->_request->getPost ('eliminar') == 1){
            $resp =  $modeloNegocio->Eliminar($this->_request->getPost ('idcausa'));
            if ($resp == false) {
                $m->codMsg = 3;
            } else {
                $m->codMsg = 1;
            }
        }else
            $m->codMsg = 2;

        echo json_encode($m);
	}

    function getcamposreporteausenciaAction()
    {
        $r = ZendExt_IoC_Inter::getInstance()->nomina->ExportarReporte();
        echo Zend_Json::encode(array('datos' => $r));
    }

    function getcausasausenciasAction()
    {
        $arreglo=null;
        $a = array();
        $result = array();
        $idvariablesconfreportescertificaciones = $this->_request->getPost('idvariablesconfreportescertificaciones');
        $model = new NomCausaModel();
        $valores = $model->getCausasByIdreporteausencia($idvariablesconfreportescertificaciones);
        $r = $model->GetCausas();
        $var = 0;
        foreach($r as $key =>$valor){
            $arreglo = $model->GethijosNoCategoria($valor['idcausa']);
                if(count($arreglo) == 0){
                    $a[$var]['idcausa'] = $valor['idcausa'];
                    $a[$var]['denominacion'] = $valor['camino'];
                    $var ++;
                }
        }
        foreach($a as $k =>$valor){
            if($valores != null){
                foreach($valores as $key1 =>$value ){
                    if($valor['idcausa'] == $value['idcausa']){
                        $a[$k]['marcado']= 1;
                        break;
                    }else{
                        $a[$k]['marcado']= 0;
                    }
                }
            }
            else
            {
                $a[$k]['marcado']= 0;
            }
        }
        echo Zend_Json::encode(array('datos' => $a));
    }

    public function guardarcausasreporteausenciaAction() {
        $r = null;
        $arreglo = json_decode(stripslashes($this->_request->getPost('array')));
        $idvariablesconfreportescertificaciones = $this->_request->getPost('idvariablesconfreportescertificaciones');

        $model = new NomCausaModel();
        foreach($arreglo as $key1 =>$value ){
            if($model->existeCausa($value) == null){
                $model->guardarcausasreporteausencia($idvariablesconfreportescertificaciones,$arreglo);
            }
            else{
                $resul = $model->eliminarCausa($value);
                $model->guardarcausasreporteausencia($idvariablesconfreportescertificaciones,$arreglo);
            }
        }
        $this->_enviarNotificacionCorrecta();
    }

    private function _enviarNotificacionCorrecta() {
        echo "{success: 'true'}";
    }

}
?>