<?php
/**
 * ZendExt_InterpreterRules_Evaluator
 * Esta clase es la encargada de analizar la regla, asignarle valores
 * a las variables que en ella aparezcan y evaluarla.
 *
 * @author Sergio Hernandez Cisneros
 * 
 */
class ZendExt_InterpreterRules_Evaluator 
{
    /**
	* Variable de tipo String, en la cual se guardar� 
	* la cadena que constituye la regla.
	* 
	* @var String 
	*/
	private $regla; 
    
	/**
	* Variable de tipo array(), esta actuara como un arbol con el
	* objetivo de evaluar la cadena como si estuviera escrita en polaca.  
	* 
	* @var String 
	*/
	private $pila; 
    
    /**
	* ZendExt_InterpreterRules_Evaluator
	* 
	* Constructor de la clase ZendExt_InterpreterRules_Evaluator
	* 
	* @param String $regla - Cadena que define la regla.
	* 
	**/
    function ZendExt_InterpreterRules_Evaluator($regla) 
    { 
        $this->regla=$regla; 
        $this->pila = array(); 
    } 
    
    /**
	* devuelve_variables
	* 
	* Este metodo retorna un arreglo con cada uno de los hechos que
	* aprecen en la regla.
	* 
	* @return array() $variables - Hechos que aparecen en la cadena.
	* 
	**/
    function devuelve_variables() 
    { 
        $variables=array(); 
        $arr=explode('$', $this->regla);
        $j=0;
        foreach($arr as $value) 
        { 
            if ($j>0)
            {
            	$chr=ord(substr($value, 0, 1)); 
            	if(($chr>96)&&($chr<123)||($chr>64)&&($chr<93)||($chr>47)&&($chr<58)) 
            	{ 
	                $len=strlen($value);
            		$i=0; 
                	$flag=false; 
	                $cad="$"; 
                	while(($i<$len)) 
                	{ 
	                    $char=substr($value, $i++, 1); 
                    	$chr=ord($char); 
                    	if (!$flag)
	                    	if(($chr>64)&&($chr<93)||($chr>96)&&($chr<123)||($chr>47)&&($chr<58)||($chr==95)) 
    	                	{ 
                       			$cad.=$char; 
                    		}
                    		else
                    		{ 
	                    		$flag = true;
                    		}
                	} 
                	$variables[]=$cad; 
            	} 
        	}
        	$j++;
        }             
        return $variables; 
    } 
    
    /**
	* asignar_valores
	* 
	* Este metodo se utiliza para asignar los valores a cada uno
	* de los hechos que aparecen en la regla.
	* 
	* @param array() $valores - Valores de los hechos.
	* 
	**/
    function asignar_valores($valores=array()) 
    { 
        $variables = $this->devuelve_variables(); 
        $variables_up = array(); 
        foreach($variables as $key => $value)
        {
            if(array_key_exists($value, $valores))
				$variables_up[$value]=$valores[$value];
            else
				$this->regla='0';
    	}
        
       	if(count($variables_up))
       	{
       		foreach($variables_up as $key=>$value)
       			$$key=$value;
       	} 
        $this->regla = $this->sustituye($valores);
        
        return $this->regla; 
    } 
    
    /**
	* sustituye
	* 
	* Este metodo se utiliza para asignar los valores a cada uno
	* de los hechos que aparecen en la regla y sustituirlas en la regla.
	* 
	* @param array() $valores - Valores de los hechos.
	* 
	**/
    function sustituye($valores=array())
    {
    	$arr = explode('$', $this->regla);
		$res ="";
		foreach($arr as $value) 
        { 
            $chr=ord(substr($value, 0, 1));
            if(($chr>=65)&&($chr<=90)||($chr>=97)&&($chr<=122)||($chr>=45)&&($chr<=58)||($chr>=40)&&($chr<=43)||($chr==35)||($chr==10)||($chr==13)||($chr==32)||($chr==38)||($chr==123)||($chr==124)||($chr==125)||($chr==63)||($chr>=60)&&($chr<=62)) 
            { 
                $len=strlen($value);
            	$i=0; 
                $flag=false; 
                $cad="$";
                $cad1=""; 
                while(($i<$len)) 
                { 
                    $char=substr($value, $i++, 1); 
                    $chr=ord($char); 
                    if (!$flag)
                    	if(($chr>64)&&($chr<93)||($chr>96)&&($chr<123)||($chr>47)&&($chr<58)||($chr==95)) 
                    	{ 
                       		$cad.=$char; 
                    	}
                    	else
                    	{ 
                    		$flag = true;
                    		$cad1 .= $char;
                    	}
                    else $cad1 .= $char;
                } 
                $res .= $valores[$cad];
                $res .= $cad1; 
            }
        }
        return $res;
    }
    
    /**
	* baja_pila
	* 
	* Este metodo se utiliza para evaluar las operaciones que
	* aparecen en la regla e ir actalizando el atributo $pila
	* 
	* 
	**/
    function baja_pila($resultado, &$posicion, $puntero) 
    { 
        $this->pila[$posicion-$puntero]=$resultado; 
        $i=$puntero-1; 
        while($i>=0){unset($this->pila[$posicion-$i]);$i--;} 
         
        foreach($this->pila as $value)$pila_aux[]=$value; 
        unset($this->pila); 
        $this->pila=$pila_aux; 
        $posicion-=$puntero; 
    } 
    
    /**
	* evaluar
	* 
	* Este metodo evalua la regla y retorna el resultado de la evaluaci�n.
	* 
	**/
    function evaluar() 
    { 
        $npa = 0;
        $cantsig = 0;
        $elemento=""; 
        $len=strlen($this->regla); 
        $i=0; 
        while($i<$len) 
        { 
            
        	$char=substr($this->regla, $i++, 1);
        	$chr=ord($char); 
            if(($chr == 36)||($chr>=65)&&($chr<=90)||($chr>=97)&&($chr<=122)||($chr>=45)&&($chr<=58)||($chr>=40)&&($chr<=43)||($chr==35)||($chr==10)||($chr==13)||($chr==32)||($chr==38)||($chr==123)||($chr==124)||($chr==125)||($chr==63)||(($chr>=60)&&($chr<=62)||($chr<=58))) 
            { 
                switch($chr) 
                { 
                    case 10:case 13:case 32:break; 
                    case 40:                $npa++;break; 
                    case 41:                if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$npa--;break; 
                    case 43:case 45:        if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 1);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break; 
                    case 42:case 47:        if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 2);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break; 
                    case 37:				if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 2);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break;
                    case 63:                if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 3);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break; 
                    case 58:                if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass("", $npa, 4);$j=$cantsig-1;while($j>0){if(($sig[$j-1]->pr>=$sig[$j]->pr)){if($sig[$j-1]->denom)$this->pila[]=$sig[$j-1]->denom;$sig[$j-1]->denom="";$sig[$j-1]->pr=$sig[$j]->pr;}$j--;}break; 
                    case 38:                if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 6);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break; 
                    case 124:               if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 5);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break;
                    case 60:case  61:case 62: 
                    case 35:
                    case 123: 		        if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 7);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break; 
                    case 125:        		if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento='';}$sig[$cantsig++]=new ZendExt_InterpreterRules_SignoClass($char, $npa, 7);$j=$cantsig;while($j>1){if(($sig[$j-2]->pr>=$sig[$j-1]->pr)){if($sig[$j-2]->denom)$this->pila[]=$sig[$j-2]->denom;$sig[$j-2]->denom="";$sig[$j-2]->pr=$sig[$j-1]->pr;}$j--;}break;
                    default:$elemento.=$char;break; 
                } 
            }else throw new ZendExt_Exception('IR005'); 
        } 
        if($elemento != ':' & $elemento != ""){$this->pila[]=$elemento;$elemento="";} 
        while($cantsig>=0){if($sig[$cantsig]->denom)$this->pila[]=$sig[$cantsig]->denom;$cantsig--;} 
        $i=0; 
        while($i<=count($this->pila)) 
        { 
            switch($this->pila[$i]) 
            { 
                case "+":
                		$this->baja_pila( $this->pila[$i-2] + $this->pila[$i-1], $i, 2);
                		break;//suma 
                case "-":
                		$this->baja_pila( $this->pila[$i-2] - $this->pila[$i-1], $i, 2);
                		break;//resta 
                case "*":
                		$this->baja_pila( $this->pila[$i-2] * $this->pila[$i-1], $i, 2);
                		break;//multiplicacion 
                case "/":
                		$this->baja_pila( $this->pila[$i-2] / $this->pila[$i-1], $i, 2);
                		break;//division 
                case "&":
                		$this->baja_pila( $this->pila[$i-2] & $this->pila[$i-1], $i, 2);
                		break;//and logico 
                case "%":
                		$this->baja_pila( $this->pila[$i-2] % $this->pila[$i-1], $i, 2);
                		break;//resto de la division entera
                case "|":
                		$this->baja_pila( $this->pila[$i-2] | $this->pila[$i-1], $i, 2);
                		break;//or logico 
                case ">":
                		if($this->pila[$i-2] >  $this->pila[$i-1])
                			$this->baja_pila(1, $i, 2);
                		else 
                			$this->baja_pila( 0, $i, 2);
                		break;//mayor que 
                case "<":
                		if($this->pila[$i-2] <  $this->pila[$i-1])
                			$this->baja_pila(1, $i, 2);
                		else 
                			$this->baja_pila( 0, $i, 2);
                		break;//menor que 
                case "=":
                		if($this->pila[$i-2] == $this->pila[$i-1])
                			$this->baja_pila(1, $i, 2);
               		 	else 
                			$this->baja_pila( 0, $i, 2);
                		break;//igual que 
                case "#":
                		if($this->pila[$i-2] != $this->pila[$i-1])
                			$this->baja_pila(1, $i, 2);
               		 	else 
                			$this->baja_pila( 0, $i, 2);
                		break;//distinto de
                case "}":
                		if($this->pila[$i-2] >= $this->pila[$i-1])
                			$this->baja_pila(1, $i, 2);
                		else 
                			$this->baja_pila( 0, $i, 2);
                		break;//mayor igual que 
                case "{":
                		if($this->pila[$i-2] <= $this->pila[$i-1])
                			$this->baja_pila(1, $i, 2);
                		else 
                			$this->baja_pila( 0, $i, 2);
                		break;//menor igual que 
                case "?":
                		if(!array_key_exists(($i-3), $this->pila))
                			throw new ZendExt_Exception('IR005');
                		if($this->pila[$i-3])
               		 		$this->baja_pila($this->pila[$i-2], $i, 3);
                		else 
                			$this->baja_pila($this->pila[$i-1], $i, 3);
                		break;//operador logico si entonces, operador ternario
            } 
            $i++; 
            if(count($this->pila)==1)break; 
        } 
        if (count($this->pila)>1)throw new ZendExt_Exception('IR005');//echo "<br>La regla no esta bien definida.";exit;}
        return $this->pila[0]; 
    } 
}


