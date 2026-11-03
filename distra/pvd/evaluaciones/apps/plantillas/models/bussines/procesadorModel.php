<?php
/** 
* ReglasController 
* Modelo de negocio para gestionar reglas * 
* @author Javier  Rodr�guez L�pez  y  Oraldo Jacinto Sim�n
* @package Capital Humano
* @subpackage Evaluaciones
* @copyright UCID-ERP Cuba
* @version 1-0.0
*/ 

class procesadorModel extends ZendExt_Model {
	/*
	 * Atributos de la clase
	 */
	private $inicio;
	private $final;
	private $pila;
	private $resultado;
	private $errores;
	private $top;
	private $arrayreferencias;
	private $contadorreferencias;
	
	/*
	 * Constructor de la clase
	*/
	function __construct() {
		$this->inicio = 0;
		$this->final = 0;
		$this->resultado = array ();
		$this->pila = array ();
		$this->errores = array ();
		$this->top = - 1;
		$this->arrayreferencias =  array();
		$this->contadorreferencias = 0;
	}
	/*
	 * Valida y construye la expresi�n 
	*/
	//echo json_encode(array('codMsg'=>1,'mensaje'=>'ok'));die;
	public function validarExpresion($newcadena) 
	{
		$newcadena = procesadorModel::eliminarespacios($newcadena);
	
		$newcadena = str_replace ( "<=", ";", $newcadena );
		$newcadena = str_replace ( ">=", "?", $newcadena );
		$newcadena = str_replace ( "<>", "#", $newcadena );	
		//Cambios hechos por javier.
		$newcadena = str_replace ( "and", "&", $newcadena );
		$newcadena = str_replace ( "or", "|", $newcadena );	
		
		$this->final = strlen ( $newcadena ) - 1;
		procesadorModel::oplogicos($newcadena);
	//	print_r($this->errores);die;
		if (count ( $this->errores ) == 0) 
		{
			$res = "";
			//print_r($this->resultado);die;
			foreach ( $this->resultado as $var => $value ) 
			{
				$res = $res . $value . " ";
			}
			$res = substr ( $res, 0, strlen ( $res ) - 1 );
			//print_r($res);die;
			return $res;
		} 
		else 
		{
			$error = "ERRORES: ";
			foreach ( $this->errores as $var => $value ) {
				$error = $error . $value;
				$error .= ", ";
			}
			$error = substr ( $error, 0, strlen ( $error ) - 2 );
			$error .= "!";
			return $error;
		}
		
	}
	
	//Funci�n que elimina los espacios en blanco de la cadena menos dentro de las referencias
	private function eliminarespacios($newcadena)
	{
		//print_r($newcadena);die;
		$cantabiertos = substr_count($newcadena, "[");
		$cantcerrado = substr_count($newcadena, "]");
		if($cantabiertos == $cantcerrado)
		{
			if($cantabiertos == 0)
			{
				return str_replace ( " ", "", $newcadena );
			}
			else 
			{
				$subcadena = str_replace ( " ", "", substr($newcadena, 0, strpos($newcadena,"[")));
				$subcadena1= substr($newcadena, strpos($newcadena, "["),strpos($newcadena, "]")-strpos($newcadena, "[")+1);				
				$this->arrayreferencias [$this->contadorreferencias] = $subcadena1;
				$this->contadorreferencias ++;
				$resto = substr($newcadena,strpos($newcadena, "]")+1);
				$indice = $this->contadorreferencias -1;
				return $subcadena."[".$indice."]".procesadorModel::eliminarespacios($resto);
			}
		}
		else
		{
			$this->errores = "Referencia incorrecta";
		}
	}
	
	//Funci�n que permite validar y construir los operadores l�gicos
	private function oplogicos($newcadena) 
	{
		$cantand = procesadorModel::cantcaracteres ( $newcadena, "&", $this->inicio, $this->final );
		$cantor = procesadorModel::cantcaracteres ( $newcadena, "|", $this->inicio, $this->final );
		//caso base de la recursividad
		if ($cantand + $cantor <= 1) 
		{
			if (strpos ( $newcadena, "&", $this->inicio ) === false) 
			{
				if (strpos ( $newcadena, "|", $this->inicio ) === false) //no aparece ningun and u or en la expresión
				{
					procesadorModel::posicionarfinal ( "|", $newcadena );
					//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;				
					procesadorModel::start ( $newcadena );
				} else {
					//aparece un solo signo or
					procesadorModel::posicionarfinal ( "|", $newcadena );
					procesadorModel::start ( $newcadena );
					$this->inicio += 2;
					$this->final = strlen ( $newcadena ) - 1;
					$pos = $this->inicio - 1;
					procesadorModel::start ( $newcadena );
					$this->resultado [] = $newcadena [$pos];
				}
			} 
			else 
			{
				//aparece un signo and
				procesadorModel::posicionarfinal ( "&", $newcadena );
				procesadorModel::start ( $newcadena );
				$this->inicio += 2;
				$this->final = strlen ( $newcadena ) - 1;
				$pos = $this->inicio - 1;
				procesadorModel::start ( $newcadena );
				$this->resultado [] = $newcadena [$pos];
			}
		} 
		else 
		{
			//recursividad
			procesadorModel::posicionarfinal ( "&", $newcadena );
			$posand = $this->final;
			procesadorModel::posicionarfinal ( "|", $newcadena );
			$posor = $this->final;
			if ($posand > $posor) //el signo or aparece primero
			{
				procesadorModel::start ( $newcadena );
				$posor ++;
				$this->inicio += 2;
				procesadorModel::oplogicos ( $newcadena );
				$this->resultado [] = $newcadena [$posor];
			} 
			else //el signo and aparece primero
			{
				procesadorModel::posicionarfinal ( "&", $newcadena );
				procesadorModel::start ( $newcadena );
				$posand ++;
				$this->inicio += 2;
				procesadorModel::oplogicos ( $newcadena );
				$this->resultado [] = $newcadena [$posand];
			}
		}
		//print_r($this->resultado);die;		
	}
	
	//Funci�n que posiciona el indicador final
	private function posicionarfinal($char, $newcadena) 
	{
		if (strpos ( $newcadena, $char, $this->inicio ) === false) 
		{
			//$this->final = strlen($newcadena)-1;
		} 
		else 
		{
			$cantabierto = 0;
			
			for($i = $this->inicio; $i <= $this->final; $i ++) 
			{
				if (substr ( $newcadena, $i, 1 ) == "(")
					$cantabierto ++;
				if (substr ( $newcadena, $i, 1 ) == ")")
					$cantabierto --;
				if ($cantabierto == 0 && substr ( $newcadena, $i, 1 ) == $char)
					$this->final = strpos ( $newcadena, $char, $this->inicio ) - 1;
			}
		}
	}
	
	//Funci�n de inicio de la validaci�n y construccion
	private function start($newcadena) 
	{
		$signo = "";
		$posfinal = $this->final;
		
		$cantigual = procesadorModel::cantcaracteres ( $newcadena, "=", $this->inicio, $this->final );
		$cantmayor = procesadorModel::cantcaracteres ( $newcadena, ">", $this->inicio, $this->final );
		$cantmenor = procesadorModel::cantcaracteres ( $newcadena, "<", $this->inicio, $this->final );
		$cantmenorigual = procesadorModel::cantcaracteres ( $newcadena, ";", $this->inicio, $this->final );
		$cantmayorigual = procesadorModel::cantcaracteres ( $newcadena, "?", $this->inicio, $this->final );
		$cantdiferente = procesadorModel::cantcaracteres ( $newcadena, "#", $this->inicio, $this->final );
		
		$total = $cantdiferente + $cantigual + $cantmayor + $cantmayorigual + $cantmenor + $cantmenorigual;
		//echo json_encode(array('codMsg'=>1,'mensaje'=>$this->final));die;
		if ($total <= 1) 
		{
			if ($total == 0) //no aparece ningun operador
			{
				//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
				procesadorModel::exp ( $newcadena );
			} 
			else 
			{
				if ($cantmayor == 1) //aparece el signo de mayor
					$signo = ">";
				else 
				{
					if ($cantmenor == 1) //aparece el signo de menor
						$signo = "<";
					else 
					{
						if ($cantigual == 1) //aparece el signo de igual
							$signo = "=";
						else 
						{
							if ($cantdiferente == 1) //aparece el signo diferente
								$signo = "#";
							else 
							{
								if ($cantmayorigual == 1) //aparece el signo de mayorigual
									$signo = "?";
								else 
								{
									if ($cantmenorigual == 1) //aparece el signo menorigual
										$signo = ";";
									else
										$this->errores [] = "Uso incorrecto de los operadores de igualdad";
								}
							}
						}
					}
				}
				procesadorModel::posicionarfinal ( $signo, $newcadena );
				procesadorModel::exp ( $newcadena );
				$this->inicio = $this->final + 2;
				$this->final = $posfinal;
				procesadorModel::exp ( $newcadena );
				$this->resultado [] = $signo;
			}
		
		} else 
		{
			$this->errores [] = "Uso incorrecto de los operadores de igualdad";
		}
	}
	//Funci�n que devuelve la cantidad de apariciones de un caracter en un cadena, no cuenta los que estan dentro de los parentesis
	private function cantcaracteres($newcadena, $char, $ini, $fin) 
	{
		//print_r($newcadena." ".$char." ".$ini." ".$fin);die;
		$cantabierto = 0;
		$cant = 0;
		for($i = $ini; $i <= $fin; $i ++) 
		{
			if (substr ( $newcadena, $i, 1 ) == "(")
				$cantabierto ++;
			if (substr ( $newcadena, $i, 1 ) == ")")
				$cantabierto --;
			if ($cantabierto == 0 && substr ( $newcadena, $i, 1 ) == $char)
				$cant ++;
		}
		return $cant;
	}
	
	//Funci�n que valida y construye una expresi�n
	private function exp($newcadena) 
	{
		//caso base de la recursividad
		$cantmas = procesadorModel::cantcaracteres ( $newcadena, "+", $this->inicio, $this->final );
		$cantmenos = procesadorModel::cantcaracteres ( $newcadena, "-", $this->inicio, $this->final );
		
		$posfinal = $this->final;
		//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
		if ($cantmas + $cantmenos <= 1) 
		{
			if ($cantmas == 0) 
			{
				if ($cantmenos == 0) //no aparece ningun mas o menos en la expresión
				{
					//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
					procesadorModel::term ( $newcadena );
				} 
				else 
				{
					//aparece un solo signo menos
					procesadorModel::posicionarfinal ( "-", $newcadena );
					procesadorModel::term ( $newcadena );
					$this->inicio += 2;
					$this->final = $posfinal;
					$pos = $this->inicio - 1;
					procesadorModel::term ( $newcadena );
					$this->resultado [] = $newcadena [$pos];
				}
			} 
			else 
			{
				//aparece un signo mas
				procesadorModel::posicionarfinal ( "+", $newcadena );
				procesadorModel::term ( $newcadena );
				$this->inicio += 2;
				$this->final = $posfinal;
				$pos = $this->inicio - 1;
				procesadorModel::term ( $newcadena );
				$this->resultado [] = $newcadena [$pos];
			}
		} 
		else 
		{
			//recursividad
			procesadorModel::posicionarfinal ( "+", $newcadena );
			$posmas = $this->final;
			procesadorModel::posicionarfinal ( "-", $newcadena );
			$posmenos = $this->final;
			if ($posmas > $posmenos) //el signo menos aparece primero
			{
				procesadorModel::term ( $newcadena );
				$posmenos ++;
				$this->inicio += 2;
				$this->final = $posfinal;
				procesadorModel::exp ( $newcadena );
				$this->resultado [] = $newcadena [$posmenos];
			} 
			else //el signo mas aparece primero
			{
				procesadorModel::posicionarfinal ( "+", $newcadena );
				procesadorModel::term ( $newcadena );
				$posmas ++;
				$this->inicio += 2;
				$this->final = $posfinal;
				procesadorModel::exp ( $newcadena );
				$this->resultado [] = $newcadena [$posmas];
			}
		}
	}
	
	//Funci�n que valida y construye un termino
	private function term($newcadena) 
	{
		//caso base de la recursividad
		$cantpor = procesadorModel::cantcaracteres ( $newcadena, "*", $this->inicio, $this->final );
		$cantentre = procesadorModel::cantcaracteres ( $newcadena, "/", $this->inicio, $this->final );
		$cantresto = procesadorModel::cantcaracteres ( $newcadena, "%", $this->inicio, $this->final );
		
		$posfinal = $this->final;
		
		if ($cantpor + $cantentre + $cantresto <= 1) 
		{
			if ($cantentre == 0 && $cantpor == 0 && $cantresto == 0) 
			{
				//$this->posicionarfinal("/", $newcadena);//arreglar
				//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
				procesadorModel::factorp ( $newcadena );
			} 
			else 
			{
				//aparece un solo signo por
				if ($cantpor == 1) 
				{
					procesadorModel::posicionarfinal ( "*", $newcadena );
					procesadorModel::factorp ( $newcadena );
					$this->inicio += 2;
					$this->final = $posfinal;
					$pos = $this->inicio - 1;
					procesadorModel::factorp ( $newcadena );
					$this->resultado [] = $newcadena [$pos];
				}
				//aparece un solo signo entre
				if ($cantentre == 1) 
				{
					procesadorModel::posicionarfinal ( "/", $newcadena );
					procesadorModel::factorp ( $newcadena );
					$this->inicio += 2;
					$this->final = $posfinal;
					$pos = $this->inicio - 1;
					procesadorModel::factorp ( $newcadena );
					$this->resultado [] = $newcadena [$pos];
				}
				//aparece un solo signo resto
				if ($cantresto == 1) 
				{
					procesadorModel::posicionarfinal ( "%", $newcadena );
					procesadorModel::factorp ( $newcadena );
					$this->inicio += 2;
					$this->final = $posfinal;
					$pos = $this->inicio - 1;
					procesadorModel::factorp ( $newcadena );
					$this->resultado [] = $newcadena [$pos];
				}
			}
		} 
		else 
		{
			//recursividad
			procesadorModel::posicionarfinal ( "*", $newcadena );
			$pospor = $this->final;
			procesadorModel::posicionarfinal ( "/", $newcadena );
			$posentre = $this->final;
			procesadorModel::posicionarfinal ( "%", $newcadena );
			$posresto = $this->final;
			$poscerca = min ( $posentre, $pospor, $posresto );
			
			$this->final = $poscerca;
			$this->factorp ( $newcadena );
			$this->inicio += 2;
			$this->final = $posfinal;
			procesadorModel::term ( $newcadena );
			$this->resultado [] = $newcadena [$poscerca + 1];
		}
	}
	
	//Funci�n que valida y construye un factor de potencia
	private function factorp($newcadena) 
	{
		$posfinal = $this->final;		
		$cantpotencia = procesadorModel::cantcaracteres ( $newcadena, "^", $this->inicio, $this->final );		
		if ($cantpotencia == 0) 
		{
			//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
			procesadorModel::factor ( $newcadena );
		} 
		else 
		{
			procesadorModel::posicionarfinal ( "^", $newcadena );
			procesadorModel::factor ( $newcadena );
			$this->inicio += 2;
			$this->final = $posfinal;
			$pos = $this->inicio - 1;
			procesadorModel::factor ( $newcadena );
			$this->resultado [] = $newcadena [$pos];
		}
	}
	
	//Funci�n que valida y construye un factor
	private function factor($newcadena) 
	{
		if ($newcadena [$this->inicio] == "(") //expresión entre paréntisis
		{
			$canpareabierto = substr_count ( $newcadena, "(", $this->inicio, $this->final - $this->inicio + 1 );
			$canparecerrado = substr_count ( $newcadena, ")", $this->inicio, $this->final - $this->inicio + 1 );
			
			if ($canpareabierto == $canparecerrado) 
			{
				$this->inicio ++;
				$this->final --;
				if (substr ( $newcadena, $this->inicio, 1 ) != "-") 
				{
					procesadorModel::start( $newcadena );
				} 
				else 
				{
					procesadorModel::negativo ( $newcadena );
				}
				$this->inicio ++;
				$this->final ++;
			} 
			else 
			{
				$this->errores [] = "Par&eacute;ntesis desbalanceados";
			}
		} 
		else 
		{
			if (substr ( $newcadena, $this->inicio, 1 ) == "[") //referencia
			{
				$cantcorabiero = procesadorModel::cantcaracteres ( $newcadena, "[", $this->inicio, $this->final );
				//substr_count($newcadena,"[", $this->inicio, $this->final - $this->inicio +1);
				$cantcorcerrado = procesadorModel::cantcaracteres ( $newcadena, "]", $this->inicio, $this->final );
				//substr_count($newcadena,"]", $this->inicio, $this->final - $this->inicio +1);
				//print_r($cantcorabiero." ".$cantcorcerrado);die;
				if ($cantcorabiero == $cantcorcerrado) 
				{
					//print_r("llego");die;
					procesadorModel::ref ( $newcadena );
				} 
				else 
				{
					$this->errores [] = "Referencia incorrecta";
				}
			} 
			else 
			{
				if (substr ( $newcadena, $this->inicio, 1 ) == "_") //función
				{
					procesadorModel::funcion ( $newcadena );
				} 
				else 
				{
					if (procesadorModel::esDigito ( substr ( $newcadena, $this->inicio, 1 ) )) //digito
					{
						//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
						procesadorModel::num ( $newcadena );
					} 
					else 
					{
						$this->errores [] = "Expresi&oacute;n incorrecta";
					}
				}
			}
		}
	}
	
	//Funcion que determina si un caracter es un digito
	private function esDigito($char) 
	{
		if ($char == "0" || $char == "1" || $char == "2" || $char == "3" || $char == "4" || $char == "5" || $char == "6" || $char == "7" || $char == "8" || $char == "9")
			return true;
		return false;
	}
	
	//Funci�n que valida y construye un numero negativo
	private function negativo($newcadena) 
	{
		if (substr ( $newcadena, $this->inicio, 1 ) == "-" && procesadorModel::esDigito ( substr ( $newcadena, $this->inicio + 1, 1 ) ) == true) 
		{
			$this->inicio ++;
			procesadorModel::num ( $newcadena );
			$this->resultado [] = "@";
		} 
		else 
		{
			$this->errores [] = "N&uacute;mero incorrecto";
		}
	}
	
	//Funci�n que valida y construye una funci�n
	private function funcion($newcadena) 
	{
		$canpareabierto = substr_count ( $newcadena, "(", $this->inicio, $this->final - $this->inicio + 1 );
		$canparecerrado = substr_count ( $newcadena, ")", $this->inicio, $this->final - $this->inicio + 1 );
		
		if ($canpareabierto == $canparecerrado && $canpareabierto >= 1) 
		{
			$posparent = strpos ( $newcadena, "(", $this->inicio );
			$idfuncion = substr ( $newcadena, $this->inicio, $posparent - $this->inicio );
			switch ($idfuncion) 
			{
				case "_SUMA" :
					{
						$this->inicio = $posparent + 1;
						$this->final --;
						//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
						procesadorModel::arrayParametros ( $newcadena );
						$this->inicio = $this->final = $this->final + 1;
						$this->resultado [] = "_SUMA";
					}
					break;
				case "_PROMEDIO" :
					{
						$this->inicio = $posparent + 1;
						$this->final --;
						procesadorModel::arrayParametros ( $newcadena );
						$this->inicio = $this->final = $this->final + 1;
						$this->resultado [] = "_PROMEDIO";
					}
					break;
				case "_PROMEDIOPONDERADO" :
					{
						$this->inicio = $posparent + 1;
						$this->final --;
						procesadorModel::arrayParametros ( $newcadena );
						$this->inicio = $this->final = $this->final + 1;
						$this->resultado [] = "_PROMEDIOPONDERADO";
					}
					break;
				case "_MAXIMO" :
					{
						$this->inicio = $posparent + 1;
						$this->final --;
						procesadorModel::arrayParametros ( $newcadena );
						$this->inicio = $this->final = $this->final + 1;
						$this->resultado [] = "_MAXIMO";
					}
					break;
				case "_MINIMO" :
					{
						$this->inicio = $posparent + 1;
						$this->final --;
						procesadorModel::arrayParametros ( $newcadena );
						$this->inicio = $this->final = $this->final + 1;
						$this->resultado [] = "_MINIMO";
					}
					break;
				case "_INDICE" :
					{
						//esta funcion tiene solo dos parametros
						$this->inicio = $posparent + 1;
						$this->final --;
						$posfinal = $this->final;
						$parametros = procesadorModel::posParametros ( $newcadena );
						if (count ( $parametros ) == 1) {
							$this->final = $parametros [0];
							procesadorModel::parametro ( $newcadena );
							$this->inicio = $parametros [0] + 2;
							$this->final = $posfinal;
							procesadorModel::parametro ( $newcadena );
							$this->inicio = $this->final = $posfinal + 1;
							$this->resultado [] = "_INDICE";
						} else {
							$this->errores [] = "Funci&oacute;n incorrecta";
						}
					}
					break;
				case "_SQRT" :
					{
						//esta funcion tiene un solo parametro
						$this->inicio = $posparent + 1;
						$this->final --;
						$posfinal = $this->final;
						procesadorModel::parametro ( $newcadena );
						$this->inicio = $this->final = $posfinal + 1;
						$this->resultado [] = "_SQRT";
					}
					break;
				default :
					{
						$this->errores [] = "Funci&oacute;n incorrecta";
					}
					break;
			}
		} 
		else 
		{
			$this->errores [] = "Funci&oacute;n incorrecta";
		}
	}
	
	//Funci�n que determina la posici�n de los parametros
	private function posParametros($newcadena) 
	{
		$param = array ();
		$parabiertos = 0;
		$corabierto = 0;
		for($i = $this->inicio; $i < $this->final; $i ++) 
		{
			if (substr ( $newcadena, $i, 1 ) == "(")
				$parabiertos ++;
			if (substr ( $newcadena, $i, 1 ) == ")")
				$parabiertos --;
			if (substr ( $newcadena, $i, 1 ) == "[")
				$corabierto ++;
			if (substr ( $newcadena, $i, 1 ) == "]")
				$corabierto --;
			if (substr ( $newcadena, $i, 1 ) == "," && $parabiertos == 0 && $corabierto == 0)
				$param [] = $i - 1;
		}
		return $param;
	}
	
	//Funci�n que valida y construye una referencia
	private function ref($newcadena) 
	{
		//print_r($newcadena." ".$this->arrayreferencias[$this->contadorreferencias-1]);die;
		//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
		if (substr ( $newcadena, $this->inicio, 1 ) == "[" && substr ( $newcadena, $this->final, 1 ) == "]") 
		{			
			
			$indice = substr ( $newcadena, $this->inicio + 1, $this->final - $this->inicio - 1);
			$manejador = new manejadorReferenciasModel($this->arrayreferencias[$indice]);
			//print_r($this->arrayreferencias[$indice]);die;
			$refcorrecta = $manejador->validarReferencia(); //referencia a calculo de las necesidades, celda de la plantilla, indicador externo, celda de algun modelo, conjunto de celdas
			//print_r($refcorrecta);die; 
			if ($refcorrecta == true)
			{
				$this->resultado [] = $this->arrayreferencias[$indice];
				$this->inicio = $this->final; 
			}
			else
				$this->errores [] = "Referencia incorrecta";							
		}
		else
			$this->errores [] = "Referencia incorrecta..";
	}
	
	//Funci�n que valida y construye un n�mero
	private function num($newcadena) 
	{
		
		$bandera = true;
		if(is_numeric(substr($newcadena,$this->inicio, $this->final - $this->inicio + 1))== false)
		{
			$bandera = false;
		}
		if ($bandera == true) {
			//echo json_encode(array('codMsg'=>1,'mensaje'=>substr($newcadena, $this->inicio, $this->final - $this->inicio + 1)));die;
			$this->resultado [] = substr ( $newcadena, $this->inicio, $this->final - $this->inicio + 1 );
			$this->inicio = $this->final;
		} 
		else 
			$this->errores [] = "N&uacute;mero incorrecto";
	}
	
	//Funci�n que valida y construye un arreglo de par�metros
	private function arrayParametros($newcadena) 
	{
		$posarray = procesadorModel::posParametros ( $newcadena );
		$posfinal = $this->final;
		$adicional = 0;
		for($i = 0; $i < count ( $posarray ); $i ++) 
		{
			$this->final = $posarray [$i];
			
			if(substr($newcadena, $this->inicio, 1) == "[" && substr($newcadena, $this->inicio, 1) == "[")
			{
				$referencia = substr($newcadena, $this->inicio, $this->final - $this->inicio +1);
				$cantidadcomas = substr_count($referencia,",");
				$cantidaddosptos = substr_count($referencia, ":");
				$cantidadparametros = count(spliti(",",$referencia));
				$cantidadparametros1 = count(spliti(":",$referencia));	
				//es una referencia a un modelo
				if($cantidadcomas == 6 && $cantidaddosptos == 1 && $cantidadparametros == 7 && $cantidadparametros1 == 2)	
				{
					$manejador = new manejadorReferenciasModel();
					$adicional = $manejador->cantidadParametros($referencia);
					if($adicional == false)
						$adicional = 0;
					else 
					{	
						if($adicional != 0)
						$adicional --;
					}	
				}				
			}
			procesadorModel::parametro ( $newcadena );
			$this->inicio = $this->final + 2;
		}
		$this->final = $posfinal;		
		procesadorModel::parametro ( $newcadena );
		$this->inicio = $this->final;
		$this->resultado [] = count ( $posarray ) + 1 + $adicional;
	}
	
	//Funci�n que valida y construye un par�metro
	private function parametro($newcadena) 
	{
		procesadorModel::exp ( $newcadena );
	}
	
	private function separarelementos($cadena)
	{
		$arrayelementos =  array();				
		$abierto = 0;
		$subcadena;
		for($i=0;$i<strlen($cadena);$i++)
		{
			if(substr($cadena, $i, 1)== " " && $abierto == 0)
			{
				$arrayelementos[] = $subcadena;	
				$subcadena = "";			
			}
			else 
			{
				if(substr($cadena, $i, 1)== "[")
					$abierto++;
				if(substr($cadena, $i, 1)== "]")
					$abierto--;	
				$subcadena.= substr($cadena, $i, 1);	
			}
		}
		$arrayelementos[]=$subcadena;
		//print_r($arrayelementos);die();
		return $arrayelementos;
	}
	/*
	 * Calcula la expresi�n 
	*/
	public function calcularPolaca($exppolaca) 
	{//print_r($exppolaca);die;
		$arrayexp = array ();
		$arrayexp = procesadorModel::separarelementos($exppolaca);
		$bandera = true;		
		for($index = 0; $index < count ( $arrayexp ) && $bandera = true; $index ++) 
		{
			$value = $arrayexp [$index];
			switch (substr ( $value, 0, 1 )) 
			{
				case "&" :
					{
						if ($this->pila [$this->top] > 0 && $this->pila [$this->top - 1] > 0) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case "|" :
					{
						if ($this->pila [$this->top] > 0 || $this->pila [$this->top - 1] > 0) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case ">" :
					{
						if ($this->pila [$this->top - 1] > $this->pila [$this->top]) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case "<" :
					{
						if ($this->pila [$this->top - 1] < $this->pila [$this->top]) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case "=" :
					{
						if ($this->pila [$this->top - 1] == $this->pila [$this->top]) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case "?" :
					{
						if ($this->pila [$this->top - 1] >= $this->pila [$this->top]) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case ";" :
					{
						if ($this->pila [$this->top - 1] <= $this->pila [$this->top]) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case "#" :
					{
						if ($this->pila [$this->top - 1] != $this->pila [$this->top]) 
						{
							$this->pila [$this->top - 1] = 1;
							$this->top --;
						} 
						else 
						{
							$this->pila [$this->top - 1] = 0;
							$this->top --;
						}
					}
					break;
				case "+" :
					{
						$this->pila [$this->top - 1] = $this->pila [$this->top - 1] + $this->pila [$this->top];
						$this->top --;
					}
					break;
				case "-" :
					{
						$this->pila [$this->top - 1] = $this->pila [$this->top - 1] - $this->pila [$this->top];
						$this->top --;
					}
					break;
				case "*" :
					{
						$this->pila [$this->top - 1] = $this->pila [$this->top - 1] * $this->pila [$this->top];
						$this->top --;
					}
					break;
				case "/" :
					{
						if ($this->pila [$this->top] != 0) 
						{
							$this->pila [$this->top - 1] = $this->pila [$this->top - 1] / $this->pila [$this->top];
							$this->top --;
						} 
						else 
						{
							$bandera = false;
							$this->errores [] = "La divisi&oacute;n por cero no est&aacute; definida";
						}
					}
					break;
				case "%" :
					{
						if ($this->pila [$this->top] != 0) 
						{
							$this->pila [$this->top - 1] = $this->pila [$this->top - 1] % $this->pila [$this->top];
							$this->top --;
						} 
						else 
						{
							$bandera = false;
							$this->errores [] = "La divisi&oacute;n por cero no est&aacute; definida";
						}
					}
					break;
				case "^" :
					{
						$this->pila [$this->top - 1] = pow ( $this->pila [$this->top - 1], $this->pila [$this->top] );
						$this->top --;
					}
					break;
				case "@" :
					{
						$this->pila [$this->top] = $this->pila [$this->top] * (- 1);
					}
					break;
				case "_" :
					{
						switch ($value) 
						{
							case "_SUMA" :
								{
									$cantidadparam = $this->pila [$this->top];
									$suma = 0;
									for($i = 1; $i <= $cantidadparam; $i ++) {
										$suma += $this->pila [$this->top - $i];
									}
									$this->pila [$this->top - $cantidadparam] = $suma;
									$this->top = $this->top - $cantidadparam;
								}
								break;
							case "_PROMEDIO" :
								{
									$cantidadparam = $this->pila [$this->top];
									$suma = 0;
									for($i = 1; $i <= $cantidadparam; $i ++) 
									{
										$suma += $this->pila [$this->top - $i];
									}
									$this->pila [$this->top - $cantidadparam] = $suma / $cantidadparam;
									$this->top = $this->top - $cantidadparam;
								}
								break;
							case "_PROMEDIOPONDERADO" :
								{
									$cantidadparam = $this->pila [$this->top];
									$suma = 0;
									for($i = 1; $i <= $cantidadparam; $i ++) 
									{
										$suma += $this->pila [$this->top - $i];
									}
									$this->pila [$this->top - $cantidadparam] = round ( $suma / $cantidadparam, 3 );
									$this->top = $this->top - $cantidadparam;
								}
								break;
							case "_MAXIMO" :
								{
									$cantidadparam = $this->pila [$this->top];
									$elementos = array ();
									for($i = 1; $i <= $cantidadparam; $i ++) 
									{
										$elementos [] = $this->pila [$this->top - $i];
									}
									$this->pila [$this->top - $cantidadparam] = max ( $elementos );
									$this->top = $this->top - $cantidadparam;
								}
								break;
							case "_MINIMO" :
								{
									$cantidadparam = $this->pila [$this->top];
									$elementos = array ();
									for($i = 1; $i <= $cantidadparam; $i ++) 
									{
										$elementos [] = $this->pila [$this->top - $i];
									}
									$this->pila [$this->top - $cantidadparam] = min ( $elementos );
									$this->top = $this->top - $cantidadparam;
								}
								break;
							case "_INDICE" :
								{
									if ($this->pila [$this->top] != 0) 
									{
										$this->pila [$this->top - 1] = $this->pila [$this->top - 1] / $this->pila [$this->top];
										$this->top --;
									} 
									else 
									{
										$bandera = false;
										$this->errores [] = "La divisi&oacute;n por cero no est&aacute; definida";
									}
								}
								break;
							case "_SQRT" :
								{
									$this->pila [$this->top] = round ( sqrt ( $this->pila [$this->top] ), 3 );
								}
								break;
						}
					}
					break;
				case "[" :
					{						
						$valor = 0;
						$manejador = new manejadorReferenciasModel();
						
						if($manejador->validarReferencia($value) == true)
						{
							$resultref = $manejador->obtenerValorReferencia($value);
							//print_r($value);die;
							//print_r($resultref);die;
							foreach ($resultref as $i=>$v)
								{
									if(strcmp($v, '{Error Referencia}') == 0)
										return '{Error Referencia}';
									$this->top ++;
									$this->pila [$this->top] = $v;
								}	
							
						}
						else 
						{
							$this->errores [] = "Referencia incorrecta";
						} 						
					}
					break;
				default :
					{
						if (procesadorModel::esDigito ( substr ( $value, 0, 1 ) ) == true) 
						{
							$this->top ++;
							$this->pila [$this->top] = $value;
						} 
						else
							$this->errores [] = "Expresi&oacute;n incorrecta";
					}
					break;
			}
		
		}
		if (count($this->errores) == 0)
			return $this->pila [$this->top];
		return false;
	}
}