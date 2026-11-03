<?php 
/** 
* ReglasController 
* Modelo de negocio para gestionar reglas * 
* @author Javier  Rodríguez López  y  Oraldo Jacinto Simón
* @package Capital Humano
* @subpackage Evaluaciones
* @copyright UCID-ERP Cuba
* @version 1-0.0
*/ 

class ReglasController extends ZendExt_Controller_Secure 
{	
	
	function init()
	{		
		parent::init();	
	}

	function reglasAction(){
		$this->render();
	}
	
	function cargarReglasAction(){
		$limit = $this->_request->getPost('limit');
		$start = $this->_request->getPost('start');
		$idplanilla = $this->_request->getPost('idplanilla');		
		$r['datos'] = $this->pIntegrator->evaluaciones->BuscarReglasPorPlanilla($idplanilla,$limit,$start);
		$r['cantidad'] = count($r['datos']);		
		echo (json_encode ($r));
	}
	
	function cargarEstadosAction(){
		$arrEstados = $this->pIntegrator->evaluaciones->CargarEstados();
		if (is_array($arrEstados)){		
			$arrEstados = array ('cantidad'=>count($arrEstados),'datos' => $arrEstados);
			echo (json_encode($arrEstados));
		}		
	}	
	
	function cargarPlanillasAction(){
		$limit = $this->_request->getPost('limit');
		$start = $this->_request->getPost('start');
		$iddominioevaluativo = $this->_request->getPost('iddominioevaluativo');
		$texto = $this->_request->getPost('texto');
		if($iddominioevaluativo != null){
			$r['datos'] = $this->pIntegrator->evaluaciones->BuscarPlanillasPorDomEval($iddominioevaluativo, $limit,$start);
			$r['cantidad'] = count($r['datos']);
		}
		else if($texto != null){
			$r['datos'] = $this->pIntegrator->evaluaciones->GetPlanillasPorTexto($texto,$limit,$start);
			$r['cantidad'] = count($r['datos']);
		}
		else{
			$r['datos'] = $this->pIntegrator->evaluaciones->BuscarPlanillasPorLimite($limit,$start);
			$r['cantidad'] = count($r['datos']);
	    }
		echo (json_encode ($r));
	}		
	
	function cargarIndicadoresAction(){		
		$idplanilla = $this->_request->getPost('idplanilla');
		$idnodopadre = $this->_request->getPost('idnodo');
		$indicadores = array();
		if(!empty($idplanilla) && $idplanilla!=-1){			
			$indicadores = $this->pIntegrator->evaluaciones->ObtenerIndicadoresPorPlanilla($idplanilla, $idnodopadre);
			
			$arrIndTexto = array();
			$arrIndImagen = array();
			foreach($indicadores as $indicador){
				if($indicador['tipo'] == true){
					$arrIndTexto[] = $indicador['idindicador'];
				}
				else {
					$arrIndImagen[] = $indicador['idindicador'];
				}
			}
			if(count($arrIndTexto)>0){
				$arrIndTexto = $this->pIntegrator->evaluaciones->ObtenerIndicadoresTextPorId($arrIndTexto);
			}
			if(count($arrIndImagen)>0){				
				$arrIndImagen = $this->pIntegrator->evaluaciones->ObtenerIndicadoresImagenPorId($arrIndImagen);
			}			
			$result = array();
			if(count($indicadores) > 0){			
				foreach($indicadores as $key => $indicador){
					foreach($arrIndTexto as $indTexto){
						if($indicador['idindicador'] == $indTexto['idindicadortexto']){//revisar esta mierda..
							$result[] = array_merge($indicador, $indTexto);							
						}
					}
					foreach($arrIndImagen as $indImg){
						if($indicador['idindicador'] == $indImg['idindicadorimagen']){//revisar esta mierda..
							$result[] = array_merge($indicador, $indImg);							
						}
					}
				}
			}			
			$nodos = array();
			if(count($result) > 0){
				foreach($result as $v){
					$icono = "";
					if($v['calculado'] == false)
						$icono = "task-folder";
					else if($v['tipo'] == true && $v['calculado'] == true)
						$icono = "indicadorTexto";					
					else if($v['tipo'] == false && $v['calculado'] == true)
						$icono = "indicadorImagen";
					$nodos[] = array('id'=>$v['idindicadorplanilla'], 'idindicador'=>$v['idindicador'], 'text'=>$v['denom']." (".$v['abreviatura'].")", 'abreviatura'=>$v['abreviatura'], 'idpadre'=>$v['idpadre'], 'calculado'=>$v['calculado'], 'tipo'=>$v['tipo'], 'idescala'=>$v['idescala'], 'iconCls'=>$icono);
				}
			}
			echo json_encode($nodos);return;
		}
	}
	
	function cargarIndicadoresChkAction(){
		$idplanilla = $this->_request->getPost('idplanilla');
		$idnodopadre = $this->_request->getPost('idnodo');
		$indicadores = array();
		if(!empty($idplanilla) && $idplanilla!=-1){			
			$indicadores = $this->pIntegrator->evaluaciones->ObtenerIndicadoresPorPlanilla($idplanilla, $idnodopadre);
			
			$arrIndTexto = array();
			$arrIndImagen = array();
			foreach($indicadores as $indicador){
				if($indicador['tipo'] == true){
					$arrIndTexto[] = $indicador['idindicador'];
				}
				else {
					$arrIndImagen[] = $indicador['idindicador'];
				}
			}
			if(count($arrIndTexto)>0){
				$arrIndTexto = $this->pIntegrator->evaluaciones->ObtenerIndicadoresTextPorId($arrIndTexto);
			}
			if(count($arrIndImagen)>0){				
				$arrIndImagen = $this->pIntegrator->evaluaciones->ObtenerIndicadoresImagenPorId($arrIndImagen);
			}			
			$result = array();
			if(count($indicadores) > 0){			
				foreach($indicadores as $key => $indicador){
					foreach($arrIndTexto as $indTexto){
						if($indicador['idindicador'] == $indTexto['idindicadortexto']){//revisar esta mierda..
							$result[] = array_merge($indicador, $indTexto);							
						}
					}
					foreach($arrIndImagen as $indImg){
						if($indicador['idindicador'] == $indImg['idindicadorimagen']){//revisar esta mierda..
							$result[] = array_merge($indicador, $indImg);							
						}
					}
				}
			}			
			$nodos = array();
			if(count($result) > 0){
				foreach($result as $v){
					$icono = "";
					if($v['calculado'] == false)
						$icono = "task-folder";
					else if($v['tipo'] == true && $v['calculado'] == true)
						$icono = "indicadorTexto";					
					else if($v['tipo'] == false && $v['calculado'] == true)
						$icono = "indicadorImagen";
					$nodos[] = array('id'=>$v['idindicadorplanilla'], 'idindicador'=>$v['idindicador'], 'text'=>$v['denom']." (".$v['abreviatura'].")", 'abreviatura'=>$v['abreviatura'], 'idpadre'=>$v['idpadre'], 'calculado'=>$v['calculado'], 'tipo'=>$v['tipo'], 'iconCls'=>$icono, 'checked'=>false);
				}
			}
			echo json_encode($nodos);return;
		}
	}
	
	function cargardominioEvalAction(){
		$iddominioevaluativo = $this->_request->getPost ( 'iddominio' );
		$idrecursovaluativo = $this->_request->getPost ( 'idrecurso' );
		$r = null;
		if($iddominioevaluativo == -1 && $idrecursovaluativo == -1){
			$r = $this->pIntegrator->evaluaciones->GetTodosRecursos();
		}
		else{
			$r = $this->pIntegrator->evaluaciones->GetDominioEvaluativo($iddominioevaluativo, $idrecursovaluativo);
		}
		$nodos = array();
		if(count($r) > 0)
			foreach($r as $v)
				if($iddominioevaluativo == -1 && $idrecursovaluativo == -1)
					$nodos[] = array('id'=>$v['idrecursoevaluativo'], 'text'=>$v['denom'], 'descripcion'=>$v['descripcion'], 'idpadre'=>$v['idrecursoevaluativo']);
				else  
					$nodos[] = array('id'=>$v['iddominioevaluativo'], 'text'=>$v['denom'], 'descripcion'=>$v['descripcion'], 'idpadre'=>$v['idpadre']);
		echo (json_encode ($nodos));
	}
	
	function cargarEscalaAction(){
		$idindicador = $this->_request->getPost('idindicador');
		$arrValorEscala['datos'] = $this->pIntegrator->evaluaciones->ObtenerValoresEscalaPorIndicador($idindicador);
		$arrValorEscala['cantidad'] = count($arrValorEscala['datos']);
		//print_r($arrValorEscala['datos']);die();
		echo (json_encode ($arrValorEscala));
	}
	
	function validarExpresionAction(){
		$expInFija = $this->_request->getPost('expInFija');
		$expEnArreglo = Json_decode(stripslashes($this->_request->getPost('expEnArreglo')));
		$arrPropElemt = Json_decode(stripslashes($this->_request->getPost('arrPropElemt')));
		$expresion = "";
		//print_r($expEnArreglo);die;
		foreach($expEnArreglo as $linea){
			$expresion .= $linea[0]." ".$linea[1].$linea[2].$linea[3].$linea[4].$linea[5]." ";
		}
		//$expresion = "([i120]+[i52])=5";  //Probado ejemplo
		if(empty($expInFija)){
			$result['msg'] = "No debe dejar el campo vacío";
			$result['tipo'] = "error";
			echo json_encode($result);
		}
		else{
			$objPolaca = new procesadorModel();
			$resultado = $objPolaca->validarExpresion($expresion);
			//$resultado = $objPolaca->calcularPolaca($resultado);

			if(substr($resultado,0,8) != "ERRORES:"){				
				$result['codMsg']=1;
				$result['mensaje']="Expresi&oacute;n correcta";
				//$result['mensaje']=$resultado; //Muestra la expresión polaca.
			}else{
				$result['codMsg']=3;
				$result['mensaje']=$resultado;
			}	
			echo (json_encode ($result));
		}		
	}
	//Función que permite adicionar una nueva regla
	function adicionarReglaAction(){
		$objRegla = new DatEvalregla();
		$objRegla->denom = $this->_request->getPost('denom');
		$objRegla->descripcion = $this->_request->getPost('descripcion');		
		$objRegla->idplanilla = $this->_request->getPost('idplanilla');
		$objRegla->idestado = $this->_request->getPost('idestado');		
		$objRegla->expnatural = $this->_request->getPost('infija');
		$objRegla->exparreglo = stripslashes($this->_request->getPost('expEnArreglo'));
		$objRegla->propiedades = stripslashes($this->_request->getPost('arrPropElemt'));
		//Copio la expresión en formato de arreglo para una variable para validar su estructura.
		$expEnArreglo = Json_decode(stripslashes($this->_request->getPost('expEnArreglo')));		
		$expresion = "";
		foreach($expEnArreglo as $linea){
			$expresion .= $linea[0]." ".$linea[1].$linea[2].$linea[3].$linea[4].$linea[5]." ";
		}
		$objPolaca = new procesadorModel();
		$resultado = $objPolaca->validarExpresion($expresion);
		$arrEvalreferencia = $this->getArrEvalreferencia($resultado);
		
		//Valido que si no hubo error de sintaxis en la expresión entonces inserto la regla en la BD.
		if(substr($resultado,0,8) != "ERRORES:"){
			$objreglaModel = new DatEvalreglaModel();
			$objreglaModel->Insertar($objRegla);			
			$idregla = $objreglaModel->getIdRegla($this->_request->getPost('idplanilla'), $this->_request->getPost('denom'));			
			$objDatEvalRefReglaModel = new DatEvalreferenciareglaModel();
			
			foreach($arrEvalreferencia as $elemento){
				$objDatEvalRefRegla = new DatEvalreferenciaregla();
				$objDatEvalRefRegla->variable = $elemento['variable'];
				$objDatEvalRefRegla->orden = $elemento['orden'];
				$objDatEvalRefRegla->referencia = $elemento['referencia'];				
				$objDatEvalRefRegla->idregla = $idregla;
				$objDatEvalRefRegla->idtiporeferencia = $elemento['idtiporeferencia'];				
				$objDatEvalRefReglaModel->Insertar($objDatEvalRefRegla);
			}			
			$r->codMsg = 1; $r->mensaje = "Se guard&oacute; correctamente la regla.";
		}else{
			$r->codMsg = 3;
			$r->mensaje = $resultado;
		}		
		echo (json_encode ($r));
	}
	
	function eliminarReglaAction(){
		$idregla = $this->_request->getPost('idregla');
		
		$objDatEvalRefreglaModel = new DatEvalreferenciareglaModel();
		$objDatEvalRefreglaModel->EliminarPorIdRegla($idregla);
		
		$objRegla = Doctrine::getTable ('DatEvalregla' )->find($idregla);
		$objReglaModel = new DatEvalreglaModel();
		$objReglaModel->Eliminar($objRegla);
		
		$r->codMsg = 1; $r->mensaje = "La regla se ha eliminado correctamente."; 		
		echo (json_encode ($r));
	}

	function actualizarReglaAction(){
		$idregla = $this->_request->getPost('idregla');
		$objReglaModel = new DatEvalreglaModel();
		$objRegla = $objReglaModel->getRegla($idregla);		
		
		$objRegla->denom = $this->_request->getPost('denom');
		$objRegla->descripcion = $this->_request->getPost('descripcion');
		$objRegla->idestado = $this->_request->getPost('idestado');
		
		$objReglaModel->Actualizar($objRegla);	
		$r->codMsg = 1; $r->mensaje = "La regla se ha actualizado correctamente."; 		
		echo (json_encode ($r));		
	}

	function sincronizarImagenAction(){
		$idIndicadorImagen = $this->_request->getPost('idIndicadorImagen');
		$nombreImagen = $this->pIntegrator->evaluaciones->SincronizarImgBDconFicheroServer($idIndicadorImagen);
		echo (json_encode($nombreImagen));
	}
	
	private function getArrEvalreferencia($cadenaPolaca){
		$arrEvalReferencia = array();
		$arregloPolaca = explode(" ", $cadenaPolaca);
		foreach($arregloPolaca as $key => $elemento){
			if($this->esIndicador($elemento)){
				$arrEvalReferencia[] = array('idtiporeferencia'=>'1', 'referencia'=>substr($elemento, 2, strlen($elemento)-3), 'variable'=>$elemento , 'orden'=>$key);
			}
			else if($this->esRegla($elemento)){
				$arrEvalReferencia[] = array('idtiporeferencia'=>'2', 'referencia'=>substr($elemento, 2, strlen($elemento)-3), 'variable'=>$elemento , 'orden'=>$key);
			}
			else if($this->esEscalaNumerica($elemento)){
				$arrEvalReferencia[] = array('idtiporeferencia'=>'3', 'referencia'=>substr($elemento, 4, strlen($elemento)-5), 'variable'=>$elemento , 'orden'=>$key);
			}
			else if($this->esEscalaCualitativa($elemento)){
				$arrEvalReferencia[] = array('idtiporeferencia'=>'4', 'referencia'=>substr($elemento, 4, strlen($elemento)-5), 'variable'=>$elemento , 'orden'=>$key);
			}
			else if($this->esEscalaImagen($elemento)){
				$arrEvalReferencia[] = array('idtiporeferencia'=>'5', 'referencia'=>substr($elemento, 4, strlen($elemento)-5), 'variable'=>$elemento , 'orden'=>$key);
			}
			else if($this->esOperador($elemento)){
				$arrEvalReferencia[] = array('idtiporeferencia'=>'6', 'referencia'=>'-1', 'variable'=>$elemento , 'orden'=>$key);
			}
			else if(is_numeric($elemento)){
				$arrEvalReferencia[] = array('idtiporeferencia'=>'7', 'referencia'=>'-1', 'variable'=>$elemento , 'orden'=>$key);
			}
		}
		return $arrEvalReferencia;
	}
	
	private function esIndicador($elemento){
		if(substr($elemento, 0, 1)=='[' && substr($elemento, -1)==']'){
			if(substr($elemento, 1,1) == 'i'){
				return is_numeric(substr($elemento, 2, strlen($elemento)-3));
			}
			return false;
		}
		return false;
	}	
	
	private function esRegla($elemento){
		if(substr($elemento, 0, 1)=='[' && substr($elemento, -1)==']'){
			if(substr($elemento, 1,1) == 'r'){
				return is_numeric(substr($elemento, 2, strlen($elemento)-3));
			}
			return false;
		}
		return false;
	}
	
	private function esEscalaNumerica($elemento){
		if(substr($elemento, 0, 1)=='[' && substr($elemento, -1)==']'){
			if(substr($elemento, 1,1) == 'e' && substr($elemento, 2,1) == '0' && substr($elemento, 3,1) == '-'){
				return is_numeric(substr($elemento, 4, strlen($elemento)-5));				
			}
			return false;
		}
		return false;
	}
	
	private function esEscalaCualitativa($elemento){
		if(substr($elemento, 0, 1)=='[' && substr($elemento, -1)==']'){
			if(substr($elemento, 1,1) == 'e' && substr($elemento, 2,1) == '1' && substr($elemento, 3,1) == '-'){
				return is_numeric(substr($elemento, 4, strlen($elemento)-5));				
			}
			return false;
		}
		return false;
	}
	
	private function esEscalaImagen($elemento){
		if(substr($elemento, 0, 1)=='[' && substr($elemento, -1)==']'){
			if(substr($elemento, 1,1) == 'e' && substr($elemento, 2,1) == '2' && substr($elemento, 3,1) == '-'){
				return is_numeric(substr($elemento, 4, strlen($elemento)-5));				
			}
			return false;
		}
		return false;
	}
	
	private function esOperador($elemento){
		switch($elemento){
			case '+': return true;
			case '-': return true;
			case '*': return true;
			case '/': return true;
			case '>': return true;
			case '<': return true;
			case '=': return true;
			case '?': return true; //mayor igual >=
			case ';': return true; //menor igual <=
			case '#': return true; //distinto <>
			case 'and': return true;
			case 'or': return true;
			case '_PROMEDIO': return true;
			case '_SUMA': return true;
			default:{
				return false;
			}
		}
	}
	
	public function cargarExpresionReglaAction(){
		$idregla = $this->_request->getPost('idregla');
		$objRegla = new DatEvalregla();
		$arrValores = $objRegla->Buscar($idregla);
		$result['propiedades']= json_decode($arrValores[0]['propiedades']);
		$result['exparreglo']= json_decode($arrValores[0]['exparreglo']);
		//print_r($arrValores[0]['exparreglo']);die();
		echo (json_encode($result));
	}
	//Función que permite modificar la ecuación de una regla.
	public function modificarExpresionReglaAction(){
		$idregla = $this->_request->getPost('idregla');
		$objReglaModel = new DatEvalreglaModel();
		$objRegla = $objReglaModel->getRegla($idregla);
		
		$objRegla->expnatural = $this->_request->getPost('infija');
		$objRegla->exparreglo = stripslashes($this->_request->getPost('expEnArreglo'));
		$objRegla->propiedades = stripslashes($this->_request->getPost('arrPropElemt'));
		//Copio la expresión en formato de arreglo para una variable para validar su estructura.
		$expEnArreglo = Json_decode(stripslashes($this->_request->getPost('expEnArreglo')));		
		$expresion = "";
		foreach($expEnArreglo as $linea){
			$expresion .= $linea[0]." ".$linea[1].$linea[2].$linea[3].$linea[4].$linea[5]." ";
		}
		$objPolaca = new procesadorModel();
		$resultado = $objPolaca->validarExpresion($expresion);
		$arrEvalreferencia = $this->getArrEvalreferencia($resultado);
		
		//Valido que si no hubo error de sintaxis en la expresión entonces inserto la regla en la BD.
		if(substr($resultado,0,8) != "ERRORES:"){
			$objReglaModel->Actualizar($objRegla);			
			
			$objDatEvalRefReglaModel = new DatEvalreferenciareglaModel();
			//Elimino todas las referencias para volver a crearlas.
			$objDatEvalRefReglaModel->EliminarPorIdRegla($idregla);  //OJO (Buscar una forma mas eficiente)
			
			foreach($arrEvalreferencia as $elemento){
				$objDatEvalRefRegla = new DatEvalreferenciaregla();
				$objDatEvalRefRegla->variable = $elemento['variable'];
				$objDatEvalRefRegla->orden = $elemento['orden'];
				$objDatEvalRefRegla->referencia = $elemento['referencia'];				
				$objDatEvalRefRegla->idregla = $idregla;
				$objDatEvalRefRegla->idtiporeferencia = $elemento['idtiporeferencia'];				
				$objDatEvalRefReglaModel->Insertar($objDatEvalRefRegla);
			}			
			$r->codMsg = 1; $r->mensaje = "Se modific&oacute; correctamente la expresi&oacute;n de la regla.";
		}else{
			$r->codMsg = 3;
			$r->mensaje = $resultado;
		}		
		echo (json_encode ($r));
	}
}