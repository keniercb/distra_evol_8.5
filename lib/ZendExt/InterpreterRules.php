<?php
/**
 *ZendExt_InterpreterRules
 *Interpretador de reglas de negocio para el ERP
 *
 *@author Sergio Hernandez Cisneros
 * 
 */
class ZendExt_InterpreterRules {
	
	/**
	* Variable de tipo String, en la cual se guardar� 
	* la cadena que constituye la regla.
	* 
	* @var String 
	*/
	private static $cadena;
	
	/**
	* Variable de tipo ZendExt_InterpreterRules_Evaluator, creada para poder 
	* evaluar las reglas.
	* 
	* @var ZendExt_InterpreterRules_Evaluator 
	*/
	private static $regla;
		
	/**
	* Variable de tipo array(), en la cual se guardar� cada uno de los hechos
	* que constituyen la regla.
	* 
	* @var array() 
	*/
	private static $variables;
	
	/**
	* Variable de tipo array(), en la cual se guardar� los valores de cada uno
	* de los hechos que constituyen la regla.
	* 
	* @var array() 
	*/
	private static $valores;
	
	/**
	* Variable de tipo Doctrine_Connection_Pgsql, utilizada para crear la conecci�n 
	* a la base de datos donde se encuentran los valores de las reglas y los hechos.
	* 
	* @var Doctrine_Connection_Pgsql 
	*/
	private static $con;
	
	/**
	* Variable de tipo Doctrine_Manager, utilizada para obtener una instancia 
	* de la coneccion actual a la base de datos donde se encuentran los
	* valores de las reglas y los hechos.
	* 
	* @var Doctrine_Connection_Pgsql 
	*/
	private static $doctMng;
	/**
	* EvaluaRegla
	* 
	* Busca en la Base de Datos una regla con el id pasado por parametros 
	* luego la evalua teniendo en cuenta el valor que tengan los hechos
	* que aparezcan en ella en la Entidad pasada tambien por parametro.
	* 
	* @param integer $idregla - Identificador de la Regla.
	* @param integer $identidad - Identificador de la Entidad.
	* 
	**/
	private function EvaluaRegla($idregla,$identidad)
	{
		try{
				$q = Doctrine_Query::create();
				$tipocadena = '';
				$regla = $q->select('cadena, idtipovaloresperado')->from('DatRegla dr')->where("dr.idreglas = $idregla")->execute();
				$array_result = $regla->toArray();
				if (count($array_result))
				{
					$tipocadena = $array_result[0]['idtipovaloresperado'];
					self::$cadena = $array_result[0]['cadena'];
					self::$regla = new ZendExt_InterpreterRules_Evaluator(self::$cadena);
					self::$variables = self::$regla->devuelve_variables();
					foreach (self::$variables as $hecho){
						$hecho = substr($hecho,1,strlen($hecho));
						$query = Doctrine_Query::create();
						$valor = $query->select('valor')->from('DatValor dv')->Where("dv.idhecho = '".$hecho."' and dv.ident = '".$identidad."'")->execute();
						$array_valor = $valor->toArray();
						if (!count($array_valor))
							throw new ZendExt_Exception('IR003');
						$idtipodato = $query->select('idtipodato')->from('DatHechos dh')->Where("dh.idhecho = '".$hecho."'")->execute();
						$array_td = $idtipodato->toArray();
						
						$td_regex = $query->select('regex')->from('NomTipodato nt')->Where("nt.idtipodato = '".$array_td[0]['idtipodato']."'")->execute();
						$array_regex = $td_regex->toArray();
						
						if (ereg($array_regex[0]['regex'],$array_valor[0]['valor']))
						{
							$hecho = "$".$hecho;
							self::$valores[$hecho]=$array_valor[0]['valor'];
						}
						else
						  throw new ZendExt_Exception('IR004');
					}
				}
				else 
					throw new ZendExt_Exception('IR001');
				self::$regla->asignar_valores(self::$valores);
				$result = self::$regla->evaluar();
				$tipocadenav = $q->select('regex')->from('NomTipocadena tc')->where("tc.idtipovaloresperado = '".$tipocadena."'")->execute();
				$array_regexcadena = $tipocadenav->toArray();
				if (!ereg($array_regexcadena[0]['regex'],$result))
					throw new ZendExt_Exception('IR002');
				return $result; 
		}
		catch (Exception $e)
		{
		    throw $e;
		}			
	}
	
	/**
	* ExecRulesByAction
	* 
	* Evalua y  verifica que cada una de las Reglas(id) tenga un valor esperado(validvalue).
	* 
	* @param SimpleXMLElement $pAction - Contiene un conjunto de Reglas(id,entity,validvalue,error).
	* 
	**/
	public function ExecRulesByAction(SimpleXMLElement $pAction = null)
	{					
		if(!self::$con)self::Connect();
		if ($pAction)
		{
			foreach ($pAction->children() as $rule)
			{
			    $id         = utf8_decode($rule['id']);
				$entity     = utf8_decode($rule['entity']);			//Este valor($entity) se coge ahora aqui, pero es momentaneo
																//cuando la aplicacion se implante en alguna entidad
																//se debe coger a travez de alguna variable session 
																//o algo asi. 
				$validvalue = utf8_decode($rule['validvalue']);
				$error = utf8_decode($rule['error']);
				try{
					
					$resEval = self::EvaluaRegla($id,$entity);
					if($resEval != $validvalue)
				  		throw new ZendExt_Exception($error);
				}
				catch (Doctrine_Exception $e){
			    	throw $e;
				}
			}
		}
		return true;
	}
	
	/**
	* Connect
	* 
	* Obtiene la conecci�n a la Base de Datos y la guarda en el atributo $con.
	* 
	**/
	private function Connect()
	{	   
		try 
		{			
			self::$doctMng = Doctrine_Manager::getInstance();
			$configSchema = Zend_Registry::getInstance();
			$module = $configSchema->config->module_name; 
			self::$con = self::$doctMng->getConnection($module);
			self::$con->exec("set search_path=pg_catalog,".$configSchema->config->bd->$module->esquema.','.$configSchema->config->schema_reglas.";");
		}
		catch (Exception $e)
		{
			throw $e;
		}
	}
	
	public function ModifyRule($idRegla,$newCadena,$newIdTVE){
		$regla = new DatRegla();
		$regla = Doctrine::getTable('DatRegla')->find($idRegla);
		$regla->cadena = $newCadena;
		$regla->idtipovaloresperado = $newIdTVE;
	    try
		{
		    $regla->save();
		}
		catch (Doctrine_Exception $e)
		{
			throw $e;
		}	
	}
	
	public function AddRule($cadena,$idSubs,$idTVE){
		
		$regla = new DatRegla();
		$regla->cadena = $cadena;		
		$regla->idsubsistema = $idSubs;
		$regla->idtipovaloresperado = $idTVE;
		try
		{
		    $regla->save();
		}
		catch (Doctrine_Exception $e)
		{
			throw $e;
		}
	}
}

